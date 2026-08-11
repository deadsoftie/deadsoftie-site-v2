---
title: "Reproducing Neural Render Proxies: A Full-Speed Relighting Pipeline in Blender"
date: 2026-08-10
tags: [blender, neural-rendering, research]
summary: >
  Reimplementing "Neural Render Proxies for Interactive and Differentiable
  Lighting" (EGSR 2026) from scratch, no official code to lean on: a decoupled
  path tracer, a hashgrid MLP, a Cycles fork, and a Blender addon that relights
  scenes live.
toc: true
pinned: true
---

<figure>
  <img src="/assets/images/nrp-blender/hero-ss.png" alt="Live NRP relighting preview in the Blender viewport, native room scene" style="display:block;width:100%;max-width:600px;margin:0 auto;">
  <figcaption style="text-align:center;">Live NRP relighting preview in the Blender viewport, native room scene</figcaption>
</figure>

<figure>
  <video src="/assets/images/nrp-blender/nrp-blender-video.webm" controls muted loop playsinline style="display:block;width:100%;max-width:600px;margin:0 auto;"></video>
  <figcaption style="text-align:center;">Live preview demo, dragging a virtual light in the viewport with the preview image updating in real time</figcaption>
</figure>

I spent the last few weeks reproducing a paper from this year's Eurographics Symposium on Rendering: _Neural Render Proxies for Interactive and Differentiable Lighting_, by Sergio Sancho, Alexander Rath, Marco Manzi, Pascal Chang, Amit Bermano, Derek Nowrouzezahrai, Markus Gross, and Marios Papas (ETH Zurich, Disney Research, Tel Aviv University, McGill, Mila)[^1]. It's a genuinely clever idea: train a tiny neural network that stands in for a full path tracer's lighting response, so an artist can drag lights around a static scene and see a physically plausible result at 30 to 60 frames a second, with real gradients flowing back to the light parameters so an optimizer can solve for lighting instead of an artist hand tuning it.

This post covers both, the method as described and the process of getting it working end to end inside Blender, including the bugs, because most of what I actually learned came from the bugs.

## The paper's core idea: decoupling the render

A normal path tracer does two jobs at once for every bounce: it decides where the ray goes next (BSDF importance sampling, maybe next-event estimation toward a light), and it accumulates whatever light that bounce actually sees. Those two jobs get re-run from scratch every time you move a light, even though moving a light doesn't change the geometry, materials, or camera at all.

The paper's insight is that you can split those jobs apart, because a _virtual_ light, one that exists only for the purpose of testing ray intersections, doesn't perturb path generation. If you trace a path using pure BSDF sampling with no light-aware bias, and only afterward test that path's segments against a light instead of biasing the path toward it, the path itself stays a fair sample of the scene's transport regardless of where the light is. That decoupling has a name in the paper:

- **SamplePaths**, run once, expensive: trace camera rays with BSDF-only importance sampling, no next-event estimation, no emission accumulated along the way. Record every path vertex's position and the throughput carried up to that point.
- **GatherLight**, run per lighting configuration, cheap: for every recorded path segment, test whether it intersects a given light. On a hit, add throughput times that light's emission to the pixel. Because light transport is linear, this decomposes cleanly per light, so multiple lights are just a sum.

```
COUPLED (classic path tracer)              DECOUPLED (this paper)

  camera ray                                camera ray
     |                                          |
     v                                          v
  bounce, sample BSDF toward light  ---\     bounce, sample BSDF only
     |    (bakes THIS light's           \       |
     v     position into the path)       \      v
  bounce, sample BSDF toward light        \  bounce, sample BSDF only
     |                                     \    |
     v                                      \   v
  accumulate radiance for THIS light         \ record vertex + throughput
     |                                        \   |
     v                                         \  v
  move the light -> retrace everything          [ path dump, light-agnostic ]
                                                    |
                                          GatherLight(dump, any light config)
                                                    |
                                              cheap, re-runnable per light
```

The catch is that a raw path dump is huge, tens of gigabytes for a single frame at production resolution. That's what motivates the second half of the paper: a small neural network that learns to imitate GatherLight directly, so you never have to touch the dump again after training.

## The network standing in for GatherLight

The **neural render proxy** (NRP) is one compact model per light type. It takes a pixel coordinate, a handful of auxiliary features at that pixel (albedo, depth, normal, 7 numbers total), and a light's parameters (for a sphere light, center plus radius, 4 numbers), and predicts what GatherLight would have returned for that light alone. Because transport is linear in emitted radiance, the final image is just a weighted sum over however many lights are in the scene:

```
                    pixel coord (2D)
                          |
                          v
              [ 2D multires hashgrid encoding ]   <- Instant-NGP style,
                          |                           sharp shadow edges
                          v
   aux features (albedo, depth, normal) --\
                                            \
   light params (center, radius) -----------+--> concat --> MLP (8 x 256) --> RGB
                                            /
                    (no color/intensity input --
                     multiplied in afterward, exploiting linearity)

   final pixel = sum over all lights of  color(light) * N(pixel, aux, light)
```

Deliberately leaving color and intensity out of the network's input is a small but important trick: it means the network only has to learn how radiance depends on a light's _geometry_, and the caller scales the output by the light's emitted color after the fact. Same trick as the linearity used in GatherLight itself, just pushed one layer up.

Training happens on the fly, no pre-rendered dataset: every iteration samples a random light configuration, computes the target pixel values by running GatherLight against the path dump, denoises that target with Intel's OIDN (the same denoiser Blender ships), and trains against it with a relative-MSE loss borrowed from Müller et al.'s Neural Radiance Caching work, with a stop-gradient on the prediction to stabilize the high dynamic range. The paper's headline numbers: 35 to 41 dB tonemapped PSNR on academic scenes, 30 to 60 Hz interactive relighting, model sizes of 5 to 13 MB, and a striking claim that training on one 64-spp light-agnostic path dump beats an image-based baseline trained on up to 1024 separately rendered, fully-lit images by more than 2.8 dB, because the win is about how much lighting information each sample carries, not raw compute spent.

## Why this reproduction, and not the last one

This wasn't my first attempt at reproducing a neural rendering paper in this fork of Blender. An earlier project tried to reproduce Neural Radiance Caching, baking a cache trained on one renderer's radiance field and then querying it inside the render kernel itself. That track got shelved for a specific reason: a cache trained on renderer A's field systematically fails inside renderer B, because the frozen bake loses exactly the transport estimate the target renderer's own sampler would have found at query time.

NRP sidesteps that failure mode by construction. The path dump that trains the network and the GatherLight computation it's measured against both come from the _same_ renderer, whichever one produced the dump. There's no cross-renderer field to go stale. That single structural difference is most of why this reproduction actually finished.

## System architecture, three processes and one socket

Before getting into the staged build-out, here's the shape of the finished system, since every stage below is really just building one layer of this:

```
 +----------------------------------------------------------+
 | Cycles fork (branch thesis/nrp, off blender-v5.2-release) |
 |  - "light-agnostic dump" render mode                      |
 |    (use_direct_light=false, emission writes guarded)      |
 |  - per-thread path-segment recorder -> .nrp1 on disk      |
 |  - aux passes: denoise albedo/normal, depth, as EXR       |
 +----------------------------------------------------------+
                          |  .nrp1 dump + EXR aux passes
                          v
 +----------------------------------------------------------+
 | training code (Mitsuba 3 + PyTorch + tinycudann)          |
 |  - GatherLight, vectorized PyTorch                        |
 |  - NRPNet training loop (hashgrid MLP, OIDN target pool)  |
 +----------------------------------------------------------+
                          |  trained checkpoint (.pt, few MB)
                          v
 +----------------------------------------------------------+
 | Blender addon (nrp_relight, stock bpy + numpy only)       |
 |  |                                                        |
 |  |  spawns, talks over a Unix domain socket                |
 |  v                                                        |
 | sidecar subprocess (thesis-proto conda env, torch+tcnn)   |
 |  - loads one checkpoint, stays resident on CUDA           |
 |  - forward(lights) -> composited (H,W,3) float32 image    |
 +----------------------------------------------------------+
```

The socket in the middle deserves its own explanation, because it's the one piece that isn't in the paper at all, it's purely a Blender integration problem. Blender 5.2 ships Python 3.13. PyTorch has a wheel for that. Tinycudann, the CUDA hashgrid library the network's encoder depends on, does not, it's a from-source CUDA extension build, and getting it building against Blender's embedded interpreter would mean redoing the whole compiler-container dance from scratch for an environment that only exists to run one addon. So the addon stays dependency-free (`bpy`, `numpy`, and stdlib socket/struct/json) and hands the actual inference off to a subprocess running in the environment that already has torch and tinycudann built, talking over a length-prefixed protocol: a 4-byte big-endian frame length, a JSON control message, and optionally a raw binary float32 frame for image payloads too big to put in JSON comfortably. The socket path is hardcoded under `/tmp` rather than Blender's configured temp directory, because Unix domain socket paths are capped at roughly 108 bytes on Linux and a user's temp directory setting can blow past that without warning.

## Setting up

The `thesis-proto` conda environment (Python 3.10, PyTorch 2.5.1+cu121, Mitsuba 3.9.0 in its `cuda_ad_rgb` variant, tinycudann built from source, OIDN, OpenEXR) is where all the ML code actually runs. Getting Cycles building with CUDA/OptiX support in the fork needed one real fix beyond the documented recipe: the runtime CUDA kernel JIT path (as opposed to the CMake build-time compile, which is a separate path entirely) needed an explicit `-ccbin` flag pointed at a compatible compiler wrapper, missing from the shell config. Without it, the failure only shows up the first time you actually try to GPU-render, not at build time, so it's worth checking before you're mid-stage and confused.

The other honest thing to flag up front is hardware. The paper trains on an RTX 5090 with 32 GB of VRAM. This machine has an RTX 4060 Laptop GPU with 8.2 GB, a quarter of that. Every resolution, spp count, and network size choice through the rest of this writeup is scaled down accordingly, not because the method needs less, but because the reproduction had to fit in a much smaller box. Where it matters, I've noted the paper's own reference numbers next to what I actually ran.

<figure>
  <img src="/assets/images/nrp-blender/terminal-output.png" alt="Terminal output of environment sanity checks: torch.cuda.is_available(), Mitsuba cuda_ad_rgb variant, tinycudann import" style="display:block;width:100%;max-width:600px;margin:0 auto;">
  <figcaption style="text-align:center;">Terminal output of environment sanity checks: torch.cuda.is_available(), Mitsuba cuda_ad_rgb variant, tinycudann import</figcaption>
</figure>

## Proving the decoupling is unbiased

Before training anything, the first real question is whether SamplePaths plus GatherLight actually reconstructs the same image a normal path tracer would, since the whole method rests on that being true. I built this in Mitsuba 3 first rather than in the Cycles fork, since a research prototype is much faster to iterate on outside a C++ renderer's build cycle.

`sample_paths.py` traces camera rays with BSDF importance sampling only, no next-event estimation, no emission accumulated along the way, Russian roulette starting at depth 3 with a 5% minimum survival probability based on throughput luminance. Each ray records its vertex positions, per-segment throughput, and escape direction where it leaves the scene, capped at 6 segments per path (the paper's own cap). `gather_light.py` then does the second half in vectorized PyTorch: an exact analytic ray-sphere intersection against each recorded segment, per light.

```
   camera
      |
      v
   [bounce 1]---T0--->[bounce 2]---T1--->[bounce 3]---T2---> escape
      x0                 x1                  x2

   virtual light sphere placed anywhere after the fact:

                     .-----.
                    ( light )
                     '-----'
                        ^
                        | analytic ray-sphere test against
                        | EVERY recorded segment x0-x1, x1-x2, x2-escape
                        |
   hit on segment x1-x2 --> add T1 * light_color to that pixel
```

The Cornell box scene used for this, and every other scene in this project, came from Benedikt Bitterli's rendering resources[^2], since the archive that survived from an earlier project only had a bedroom and a staircase scene left, neither with the sphere light this validation needed. Standard proportions, red and green side walls, two boxes, and a sphere emitter (radius 0.15, radiance 15) in the ceiling.

The check itself: does GatherLight over the dump converge toward a reference render of the same scene, using the same lights, as the sample count grows, with no bias plateau? At 96x96 resolution and a 6-segment cap, PSNR against a 512-spp reference climbed strictly monotonically, 33.48 dB at 4 spp up to 49.99 dB at 256 spp, right around 2.7 to 3 dB per doubling, textbook Monte Carlo variance halving and nothing structurally wrong. A second check, that gathering two lights separately and summing equals gathering both together (linearity should be exact, not approximate), came back with a maximum absolute error of 7.6e-6, which is just float32 noise.

<figure>
  <img src="/assets/images/nrp-blender/2026-07-14-stage-p1-qualitative-comparison.png" alt="Qualitative comparison, GatherLight reconstruction vs reference path tracer render, Cornell box" style="display:block;width:100%;max-width:600px;margin:0 auto;">
  <figcaption style="text-align:center;">Qualitative comparison, GatherLight reconstruction vs reference path tracer render, Cornell box</figcaption>
</figure>

## Training the network

With the decoupling validated, `nrp_net.py` implements the actual proxy: a tinycudann 2D hashgrid encoding on the pixel coordinates (16 levels, 2 features per level, base resolution 16), concatenated with the 7 auxiliary feature channels and the 4 light parameters, feeding an MLP. I ran most iteration at a smaller 128-neuron, 4-layer network to fit comfortably in 8 GB, then confirmed the paper's own reference size, 256 neurons across 8 layers, on headline runs.

`train_nrp.py` is the largest piece of code in the whole project, and most of its complexity is the image pool. A denoiser needs one full, coherent lighting configuration per image, it can't denoise a target that's a patchwork of different light setups, so you can't just render a fresh scene per training step, that would defeat batching entirely. Instead the training loop keeps a pool of 64 denoised images, each rendered from GatherLight under one randomly sampled light configuration, and refreshes one of them every few iterations. Critically, each individual pixel in a training batch is drawn from an _independently_ random image in the pool, so even though every single pool image only shows one lighting setup, a batch of pixels drawn across the pool sees enormous lighting diversity. That's the mechanism that keeps the network from just memorizing one lighting condition. Loss is relative MSE with a stop-gradient on the prediction, `(pred - target)^2 / (pred.detach()^2 + eps)`, matching the paper's borrowed formulation from Neural Radiance Caching.

There was one real bug here worth describing because it's the kind that quietly wrecks training without ever throwing an error. Light centers for training were sampled by picking a random point along a random recorded path segment, which is a reasonable way to bias sampling toward regions the camera can actually see. But segment zero, the piece of path between the camera and its first hit, was included in that pool, and a light center sampled onto it could land almost inside the near plane, producing a giant, blown-out disk that dominated the loss for that batch. Excluding segment zero from the candidate set dropped the starting loss from roughly 8.7 to 1.25 and cut mean SMAPE on held-out light configs from 0.39 to 0.07.

Headline result at the paper's reference network size, 15,000 iterations on the Cornell box: mean tonemapped PSNR 38.62 dB, median 35.86 dB, mean SMAPE 0.097, clearing the roughly 35 dB target the paper reports, in about 157 seconds on the 4060 (the paper's own reference run is closer to an hour on a 5090, for a much larger training budget). A component ablation reproduces the paper's own Table 2 in direction, including its most specific and least obvious claim, that hashgrid encoding on its own, without denoising, is actually _worse_ than plain auxiliary features on their own:

| Config                                    | SMAPE | mean tonemapped PSNR |
| ----------------------------------------- | ----- | -------------------- |
| None (aux off, hashgrid off, denoise off) | 0.169 | 38.08 dB             |
| Aux only                                  | 0.153 | 35.17 dB             |
| Aux + hashgrid, no denoise                | 0.199 | 35.34 dB             |
| Aux + denoise                             | 0.082 | 35.78 dB             |
| Full (aux + hashgrid + denoise)           | 0.078 | 36.02 dB             |

The hashgrid needs clean, denoised targets to actually pay off, on noisy targets it just gives the network more capacity to overfit noise. That's a genuinely counterintuitive result to land on independently and then see the paper had already found the same thing.

<figure>
  <img src="/assets/images/nrp-blender/2026-07-14-stage-p2-ablation-qualitative.png" alt="Ablation qualitative grid, None vs Aux vs Full config against GatherLight target" style="display:block;width:100%;max-width:600px;margin:0 auto;">
  <figcaption style="text-align:center;">Ablation qualitative grid, None vs Aux vs Full config against GatherLight target</figcaption>
</figure>

## Scope: what I left out on purpose

The paper's second half is differentiability, since the proxy is a plain MLP, gradients from an image-space loss can flow straight back to the light parameters that produced it, which is what lets an optimizer solve for lighting instead of an artist hand tuning it. I did not implement that half. The goal for this pass was narrower: find out whether the first half of the paper, the decoupled sampling, the proxy network, and the claim that it transfers across renderers, actually holds up when rebuilt from scratch with no reference code. Reverse light optimization is a real, separate piece of engineering on top of that, and it stays out of scope here rather than getting a half-finished treatment.

## Forking Cycles for path dumps

Everything up to here ran in Mitsuba, deliberately, since a research prototype iterates faster outside a compiled renderer's build loop. Getting a real dump out of the Cycles fork was the first actual change to the renderer itself, on a branch off `blender-v5.2-release`.

The first finding here was a pleasant surprise: no new kernel guard was needed at all. Tracing `use_direct_light`, the flag that gates all next-event estimation, back to its actual source showed it's driven entirely by whether the scene has any emitters. A scene with zero lights already behaves exactly like the light-agnostic pass this project needed, no toggle required. The only real work was building the _recording_, not disabling anything: a new pair of headers for the per-thread recorder, modeled directly on the existing OpenPGL path-guiding recorder that already stores a very similar tuple (position, direction, weight) for a different purpose, with hooks dropped into the surface and background shading code to append a record on every bounce.

Three real bugs surfaced here, and all three only showed up by actually building and running the fork, none of them were catchable by reading the diff:

1. A circular header include: the new recording functions needed `KernelGlobals`, but the header that defines `KernelGlobals` was the one trying to include the recorder in the first place. Fixed by splitting the plain data structs out into their own header, so the circular dependency just doesn't exist anymore.
2. `KernelGlobals` is const-qualified everywhere it's passed around, which meant appending to the per-thread recording vectors through it didn't compile. Fixed with `mutable` on the storage fields, the standard way to carry accumulator state through a const-qualified handle.
3. The interesting one. After fixing the first two, the kernel built and ran without crashing, but the dumped data had a suspiciously exact gap, every pixel's very first sample was missing. It traced back to how Cycles actually schedules a render: it splits the work into multiple batches internally, each running its own init and deinit cycle, and the recorder was writing its accumulated data out on deinit. That meant every batch after the first one overwrote whatever the previous batch had already written, silently discarding all but the final batch. Fixed with a persistent accumulator that drains each batch's per-thread records instead of writing directly at deinit time.

Once those were fixed, the same unbiasedness protocol from the Mitsuba stage, PSNR against increasing spp, per-light linearity, reproduced cleanly on real Cycles dumps: 7.75 dB at 4 spp climbing monotonically to 21.73 dB at 64 spp, and linearity exact to 2.4e-7, matching the earlier Mitsuba result to almost the same precision.

## Training across renderers

This is the stage that actually tests the claim the whole project was built around: that because the dump and the ground truth both come from the same renderer, training should transfer cleanly regardless of which renderer produced the dump. And it did, with zero changes to the training code itself, just pointing it at a Cycles dump instead of a Mitsuba one.

| Scene / renderer               | median tonemapped PSNR | mean SMAPE |
| ------------------------------ | ---------------------- | ---------- |
| Cornell box, Mitsuba           | 35.86 dB               | 0.078      |
| Bedroom, Cycles                | 38.70 dB               | 0.0751     |
| Native room, Cycles            | 37.80 dB               | 0.0904     |
| Bedroom, Mitsuba (cross-check) | 35.68 dB               | 0.0985     |

Two real bugs got caught here, both found after the fact while investigating why numbers looked off, and both worth describing because they're the kind that produce plausible-looking but wrong output rather than an obvious crash.

The first: the Cycles bedroom's aux features and its training targets were subtly mismatched, visible in the live preview as duplicated geometry near the top and bottom of the frame. The root cause was a row-convention mismatch, Blender's own EXR writer puts row 0 at the top of the image, while Cycles' internal pixel indexing treats row 0 as the bottom. Loading the aux passes without flipping them vertically meant every pixel's auxiliary features were paired with the wrong row of the actual render. Fixing that in the EXR loader corrected the bedroom-Cycles checkpoint's PSNR from an inflated 42.00 dB down to a more honest 38.70 dB, the number in the table above, while SMAPE barely moved, which makes sense since a global structural misalignment shows up much more clearly in a peak-signal metric than a per-pixel error average.

The second: the training loop's normalization constants for light positions were still hardcoded to the Cornell box's small bounding volume even when training on the bedroom scene, which is roughly three times larger on every axis. Fixed by always computing normalization stats directly from whatever scene's dump is actually loaded rather than assuming Cornell's numbers.

<figure>
  <img src="/assets/images/nrp-blender/2026-07-15-stage-p5-quality-comparison.png" alt="Bedroom scene trained via Cycles next to the same scene trained via Mitsuba, side by side" style="display:block;width:100%;max-width:600px;margin:0 auto;">
  <figcaption style="text-align:center;">Bedroom scene trained via Cycles next to the same scene trained via Mitsuba, side by side</figcaption>
</figure>

## Building the Blender addon

Everything up to this point produces a trained checkpoint file. The addon, `nrp_relight`, is what turns that into something an artist can actually use inside Blender.

As described in the architecture section above, the addon itself stays deliberately minimal, `bpy`, `numpy`, and stdlib only, and hands inference off to a sidecar subprocess that has torch and tinycudann available. The addon's N-panel (under `View3D > N-panel > NRP`) has two sections: a checkpoint and sidecar box, with a file path field and a start/stop button that shows a live status string, and a virtual lights box, with an "add virtual light" button and editable radius and color for whichever light is currently selected.

Virtual lights turned out not to need a new Blender data type at all, they're plain Empty objects, displayed as a small sphere, tagged with custom properties (`nrp_virtual_light`, `nrp_radius`, `nrp_color`) and grouped into their own collection. That keeps them fully native, selectable, movable, and snappable with every ordinary Blender tool, since Blender already has a perfectly good object for "a point in space with some properties," there was no reason to reinvent one.

The live preview is a handler on Blender's depsgraph update event, so it fires automatically whenever anything in the scene changes, not just when a light moves. To avoid re-running inference on every unrelated scene edit, it computes a cheap rounded fingerprint of all tagged lights' positions, radii, and colors, and only calls the sidecar if that fingerprint actually changed since the last call. One rule mattered more than any of the mechanics: whatever happens inside that handler must never raise an exception into Blender's own callback chain, since Blender doesn't handle a broken depsgraph callback gracefully, so any failure during a forward pass gets swallowed silently rather than crashing the editor mid-edit.

```
   scene edit (light moved, etc.)
              |
              v
   depsgraph_update_post fires
              |
              v
   compute fingerprint of all tagged lights
              |
        changed? ---- no ----> do nothing
              |
             yes
              |
              v
   sidecar_client.forward(lights) over the Unix socket
              |
              v
   write resulting (H,W,3) array into an Image datablock
   named "NRP Preview", viewable in an Image Editor area
```

One genuinely tricky bug lived in that last step. Blender's Image > Save As operation can attach a file source to an Image datablock, and the code that decided whether to recreate the preview image only checked for a size mismatch, not for that file source. So if you'd ever used Save As on the preview during troubleshooting, the addon kept quietly reusing that now-file-backed datablock forever afterward, even though it was still writing fresh pixel data into it every call, the display just never picked it up. It's a good reminder that a debugging step can itself introduce the exact symptom it was meant to help diagnose. The fix was just checking the image's source type before deciding whether to reuse it.

There's also a real calibration problem baked into the demo, worth stating plainly rather than glossing over: the network is trained entirely on sphere lights, but to actually get a matching ground-truth render out of Blender's own renderer for comparison, a virtual light's parameters have to be converted into a real Blender POINT light, and that conversion needed an empirical scale factor, roughly 8.4x, found by measuring rather than derived from any formula, because the naive radiance-times-area calculation came out about 8 times too dim. Even after that calibration, a POINT light's sharp inverse-square falloff doesn't perfectly match the softer, finite-radius falloff the network learned from actual sphere lights, so there's a real, acknowledged shape mismatch between the fast preview and the calibrated ground truth, not something worth pretending away.

The end-to-end demo, on a native Blender scene trained via its own Cycles dump: drag a virtual light in the viewport, watch the preview image update automatically as the depsgraph fires, and compare against a calibrated F12 render. Tonemapped PSNR between the live NRP prediction and that calibrated render came out to 25.48 dB with a SMAPE of 0.2918, respectable for a fast preview against a genuinely different light representation, and honestly not as strong as the Mitsuba-side numbers, exactly because of that shape mismatch above.

The addon does exactly one thing: live virtual-light relighting through the sidecar's forward endpoint. There's no inverse-optimize operator in it, on purpose, since that half of the paper was never attempted in the first place.

<figure>
  <img src="/assets/images/nrp-blender/nrp-plugin.png" alt="NRP addon N-panel, checkpoint box and virtual lights box" style="display:block;width:100%;max-width:300px;margin:0 auto;">
  <figcaption style="text-align:center;">NRP addon N-panel, checkpoint box and virtual lights box</figcaption>
</figure>

<figure>
  <img src="/assets/images/nrp-blender/hero-ss-2.png" alt="NRP live preview after the virtual light has been moved, native room scene" style="display:block;width:100%;max-width:600px;margin:0 auto;">
  <figcaption style="text-align:center;">NRP live preview after the virtual light has been moved, native room scene</figcaption>
</figure>

<figure>
  <img src="/assets/images/nrp-blender/2026-07-15-stage-p6-f12-ground-truth.png" alt="Calibrated F12 ground-truth render, native room scene" style="display:block;width:100%;max-width:600px;margin:0 auto;">
  <figcaption style="text-align:center;">Calibrated F12 ground-truth render, native room scene</figcaption>
</figure>

<figure>
  <img src="/assets/images/nrp-blender/2026-07-15-stage-p6-nrp-vs-f12.png" alt="NRP live prediction next to the calibrated F12 ground-truth render, native room scene" style="display:block;width:100%;max-width:600px;margin:0 auto;">
  <figcaption style="text-align:center;">NRP live prediction next to the calibrated F12 ground-truth render, native room scene</figcaption>
</figure>

## Results across every stage

Pulling every number above into one place:

| Stage                         | What it measured                       | Result                                           |
| ----------------------------- | -------------------------------------- | ------------------------------------------------ |
| Decoupling validity (Mitsuba) | PSNR vs spp, Cornell                   | 33.48 -> 49.99 dB, spp 4 -> 256, no bias plateau |
| Decoupling validity (Mitsuba) | Per-light linearity error              | 7.6e-6                                           |
| Network training              | Mean / median tonemapped PSNR, Cornell | 38.62 / 35.86 dB                                 |
| Network training              | Mean SMAPE, Cornell                    | 0.097                                            |
| Network training              | Ablation, full config vs none          | 0.078 vs 0.169 SMAPE                             |
| Cycles dump validity          | PSNR vs spp                            | 7.75 -> 21.73 dB, spp 4 -> 64                    |
| Cycles dump validity          | Per-light linearity error              | 2.4e-7                                           |
| Cross-renderer training       | Bedroom, Cycles                        | 38.70 dB / 0.0751 SMAPE                          |
| Cross-renderer training       | Native room, Cycles                    | 37.80 dB / 0.0904 SMAPE                          |
| Addon end-to-end              | NRP live preview vs calibrated F12     | 25.48 dB / 0.2918 SMAPE                          |

## What's still rough

A few things worth stating plainly rather than smoothing over. The point-light shape mismatch described above is real and unfixed, the addon compares favorably against its own training target but not perfectly against Blender's native lights, because those two light representations genuinely aren't the same shape. The path dump format currently stores plain float32 rather than the paper's memory-optimized packing (half-precision positions, compact shared-exponent color for throughput), a deliberate call to get the pipeline validated first before spending time on a compression scheme. The live preview writes into a plain Image datablock rather than a GPU texture draw handler in the viewport itself, which is a scope cut, not a technical dead end, swapping the display backend later doesn't touch the socket client, the light gathering code, or the update throttling, it's genuinely isolated. And nothing here has been pushed past the resolutions covered in this writeup, scaling further on 8 GB of VRAM is untested and would need its own pass.

## Acknowledgements

None of this exists without the paper it's built on. Thanks to Sergio Sancho, Alexander Rath, Marco Manzi, Pascal Chang, Amit Bermano, Derek Nowrouzezahrai, Markus Gross, and Marios Papas for _Neural Render Proxies for Interactive and Differentiable Lighting_[^1], a clearly written paper that left enough of the right detail in to make a from-scratch reimplementation possible with no official code to check against. And thanks to Benedikt Bitterli for maintaining his rendering resources page[^2], the Cornell box, bedroom, and every other scene used through this project's validation stages came from there.

[^1]: Sergio Sancho, Alexander Rath, Marco Manzi, Pascal Chang, Amit H. Bermano, Derek Nowrouzezahrai, Markus Gross, and Marios Papas, "Neural Render Proxies for Interactive and Differentiable Lighting," _Computer Graphics Forum_ 45, no. 4 (2026), Eurographics Symposium on Rendering 2026.

[^2]: Benedikt Bitterli, _Rendering resources_, 2016, https://benedikt-bitterli.me/resources/
