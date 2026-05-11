---
title: "Porting the Render Lab to Linux: What Actually Broke"
date: 2026-04-31
tags: [linux, opengl, c++, cmake]
summary: >
  Migrating the render-lab project from MSBuild to CMake on Fedora. The build
  system move was straightforward. The four things that broke after that were
  more interesting.
read_time: 7
featured: false
toc: true
links:
  - /essays/moving-to-linux
---

Once I had Fedora running as a daily driver, the first thing I wanted to do was get an existing project compiling on it.

The render lab was the obvious choice. It is small enough to debug quickly but has enough going on to surface real problems: OpenGL, GLFW, Dear ImGui, Assimp, a few shaders, the full stack. If it compiled and ran, I could reasonably say the new setup was usable. If it didn't, I would learn something.

## Moving to CMake

The project was previously built with MSBuild via a Visual Studio solution. The first task was replacing that with a `CMakeLists.txt` and a `CMakePresets.json` that covered both Linux and Windows configurations.

This part went smoothly. vcpkg already supported Linux and all the dependencies (glm, GLFW, GLAD, Assimp, Dear ImGui, ImGuizmo) had proper CMake config files. The preset approach meant I could run:

```bash
cmake --preset linux-debug
cmake --build --preset linux-debug
```

and not have to pass the toolchain path manually every time. The only mildly annoying part was verifying the ImGuizmo CMake target name after vcpkg installed it on Linux, since the config file name does not always match what you expect. Worth checking `vcpkg_installed/x64-linux/share/imguizmo/` directly rather than guessing.

Beyond that, the build system migration was genuinely uneventful. The interesting part came when I actually tried to compile.

## What Broke

### Case-sensitive include paths

The first error was in `Input.cpp`, which had:

```cpp
#include "Input/Input.h"
```

The actual directory on disk was `input/` with a lowercase `i`. On Windows this works fine because NTFS is case-insensitive. On Linux it does not, and GCC told me immediately. The fix was a one-character change.

This was a good reminder that Windows has been quietly letting me get away with inconsistent casing for years. Worth doing a pass on any project you plan to build on Linux just to check.

### GCC rejecting redundant namespace qualification

Inside `Geometry.cpp`, two function definitions looked like this:

```cpp
namespace Geometry {
    CornellMesh Geometry::MakeCornellBox(glm::vec3 h) { ... }
    MeshData    Geometry::MakeSphere(float r, int s, int t) { ... }
}
```

The `Geometry::` prefix on the function name is redundant since the definitions are already inside the `namespace Geometry` block. MSVC accepted this without complaint. GCC flagged it as an error: "explicit qualification in declaration of...".

The fix is just removing the prefix from the function name inside the block. Correct behaviour on GCC's part, mild surprise that MSVC never said anything.

### GLSL version and dynamic sampler indexing

This one was the most interesting. Two fragment shaders declared `#version 330 core` at the top but indexed sampler arrays using non-constant variables:

```glsl
texture(uShadowMaps[lightIdx], ...)  // lightIdx derived from a uniform
texture(uMSMaps[i], ...)             // i from a loop counter
```

Dynamic indexing of sampler arrays is not legal in GLSL 3.30. The spec requires GLSL 4.00 or the `GL_ARB_gpu_shader5` extension. On Windows, the shader was going through a cross-compilation path that apparently let this slide. Mesa on Linux enforces the spec strictly and the shaders failed to compile at runtime.

The RTX 4060 supports OpenGL 4.6, so bumping both shaders to `#version 400 core` was the right fix rather than trying to work around it. It is a better shader version to be targeting anyway.

### Discrete GPU on PRIME

After getting the binary to link, I ran it and the window opened but was reporting `Mesa Intel(R) Graphics (RPL-S)` as the renderer. On a laptop with both an Intel iGPU and an NVIDIA dGPU, Linux OpenGL apps default to the integrated GPU unless you tell them otherwise.

Forcing the NVIDIA card requires PRIME render offload environment variables:

```bash
__NV_PRIME_RENDER_OFFLOAD=1 __GLX_VENDOR_LIBRARY_NAME=nvidia ./the-render-lab
```

Rather than type that every time, I added a `run.sh` at the project root that sets the vars and prefers the release binary if it exists, falls back to debug otherwise. A small quality of life thing but worth doing immediately.

## Verdict

Four issues, none of them particularly deep, and the project compiled and ran correctly after fixing them. The case sensitivity and namespace qualification issues are pure Windows habits that Linux corrects at compile time, which is arguably a good thing. The GLSL version issue was the most legitimate bug, something that should have been caught earlier. The GPU selection issue is just how PRIME works.

The overall experience confirmed what I was hoping: the new setup is completely viable for this kind of work. CMake and Ninja on Fedora are noticeably faster to work with than the MSBuild equivalent, the feedback loop is tighter, and I am not fighting the environment to get things done.

More projects to follow.
