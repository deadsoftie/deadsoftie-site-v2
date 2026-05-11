// Single post view — TOC, prose, sidenotes, code, related
const PostScreen = () => {
  return (
    <div>
      <Chrome active="essays" />
      <article
        className="container"
        style={{
          paddingTop: 56,
          display: "grid",
          gridTemplateColumns: "200px 1fr 220px",
          gap: 60,
        }}
      >
        {/* Left: TOC */}
        <aside className="toc">
          <div className="toc-label">contents</div>
          <a href="#s1" className="active">
            The setup
          </a>
          <a href="#s2">What we measure</a>
          <a href="#s2a" className="lvl-3">
            Activations
          </a>
          <a href="#s2b" className="lvl-3">
            Probes
          </a>
          <a href="#s3">A working alternative</a>
          <a href="#s4">Open questions</a>
          <a href="#s5">Footnotes</a>
          <hr className="hr-dashed" style={{ margin: "16px 0" }} />
          <div className="toc-label">progress</div>
          <div
            style={{
              height: 4,
              background: "var(--rule-soft)",
              borderRadius: 2,
              marginTop: 4,
            }}
          >
            <div
              style={{
                width: "32%",
                height: "100%",
                background: "var(--accent)",
                borderRadius: 2,
              }}
            />
          </div>
          <div style={{ marginTop: 6, fontSize: 10 }}>32% · 6 of 18 min</div>
        </aside>

        {/* Center: prose */}
        <div>
          <div style={{ marginBottom: 28 }}>
            <a
              href="#"
              className="mono"
              style={{ fontSize: 11, color: "var(--muted)" }}
            >
              ← essays
            </a>
          </div>
          <div className="eyebrow" style={{ marginBottom: 18 }}>
            essay · no. 042
          </div>
          <h1
            className="h-display"
            style={{ fontSize: 48, margin: "0 0 18px", lineHeight: 1.05 }}
          >
            On the slow erosion of model interpretability
          </h1>
          <div
            style={{
              display: "flex",
              gap: 18,
              fontFamily: "var(--mono)",
              fontSize: 11,
              color: "var(--muted)",
              marginBottom: 6,
              alignItems: "center",
            }}
          >
            <span>22 apr 2026</span>
            <span style={{ color: "var(--rule)" }}>·</span>
            <span>18 min · 5,217 words</span>
            <span style={{ color: "var(--rule)" }}>·</span>
            <span>v3 · last edited apr 24</span>
          </div>
          <div style={{ display: "flex", gap: 6, marginBottom: 32 }}>
            <Tag>research</Tag>
            <Tag>ml</Tag>
            <Tag>interpretability</Tag>
          </div>

          <div className="prose">
            <p>
              I have spent the last three months staring at attention heads in a
              7B parameter model, and I am increasingly convinced that{" "}
              <em>the field has been measuring the wrong thing</em>. This is a
              working note: not a finished argument, but the shape of one.
            </p>

            <h2 id="s1">The setup</h2>
            <p>
              The thing we call "interpretability" — the work of cracking open a
              trained network and asking it what it is doing — has, over the
              last decade, slowly absorbed the conventions of the experimental
              sciences. We have benchmarks. We have leaderboards. We have{" "}
              <a href="#">canonical probing tasks</a>.
            </p>
            <p>
              This was, on balance, good. It rescued the field from years of
              unfalsifiable storytelling about "circuits." But it has also done
              something subtler and more troubling: it has narrowed our sense of
              what counts as understanding.
            </p>

            <blockquote>
              An attention head is not a unit of cognition. It is a unit of{" "}
              <em>convenience</em> — a place where weights happen to be
              addressable.
            </blockquote>

            <h2 id="s2">What we measure</h2>
            <p>
              Consider the standard interpretability paper of 2024–2025. It
              selects a model. It selects a behavior — induction, indirect
              object identification, modular addition. It locates a "circuit" —
              a small subgraph of attention heads and MLP neurons whose ablation
              degrades the behavior. It reports a clean story about flow.
            </p>

            <figure>
              <Placeholder
                h={220}
                label="figure 1 · attention pattern, layer 14, head 7"
              />
              <figcaption>
                Fig. 1 — Attention from "Mary" to "John" across 12 layers. The
                story is tidy until layer 9.
              </figcaption>
            </figure>

            <h3 id="s2a">Activations</h3>
            <p>
              The math is unambiguous; the interpretation is not. When we say a
              head "moves information about <code>X</code>," we mean a
              particular dot product crossed a threshold we chose.
            </p>

            <div className="codeblock">
              <div className="codeblock-bar">
                <span>probe.py · 32 lines</span>
                <button className="copy">copy</button>
              </div>
              <pre>
                <code>
                  <span className="tok-com">
                    # lift residual stream into probe basis
                  </span>
                  <span className="tok-kw">def</span>{" "}
                  <span className="tok-fn">probe</span>(model, layer, token): h
                  = model.<span className="tok-fn">forward</span>(token,
                  return_residual=<span className="tok-kw">True</span>) r = h[
                  <span className="tok-str">"resid_post"</span>][layer]{" "}
                  <span className="tok-com"># [seq, d_model]</span>
                  <span className="tok-kw">return</span> r @ probe_basis.T{" "}
                  <span className="tok-com"># [seq, k]</span>
                  <span className="tok-com">
                    # the threshold below is load-bearing
                  </span>
                  THRESH = <span className="tok-num">0.42</span>
                </code>
              </pre>
            </div>

            <p>
              The threshold is load-bearing. Move it 0.05 in either direction
              and the "circuit" dissolves or doubles in size.
              <sup style={{ color: "var(--accent)" }}>1</sup>
            </p>

            <h3 id="s2b">Probes</h3>
            <p>
              Linear probes are an even sharper case. We train a small
              classifier on intermediate activations and call its accuracy "the
              model's representation of X." But a probe trained on enough data
              can find <em>almost any</em> structure that happens to be linearly
              decodable — which is most structure, in a 4096-dimensional space.
            </p>

            <h2 id="s3">A working alternative</h2>
            <p>
              I want to suggest, tentatively, that we trade in our
              threshold-and-circuit grammar for something messier: a vocabulary
              of <em>load-bearingness</em>.
            </p>
          </div>

          {/* divider w/ pagination preview */}
          <hr className="hr-dashed" style={{ margin: "60px 0 30px" }} />
          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}
          >
            {[
              [
                "← previous",
                "What I learned reviewing 200 NeurIPS submissions",
              ],
              [
                "next →",
                "Why I stopped using vector databases for personal projects",
              ],
            ].map(([dir, t], i) => (
              <a
                key={i}
                href="#"
                style={{
                  border: "1px solid var(--rule-soft)",
                  borderRadius: 6,
                  padding: "16px 18px",
                  textAlign: i === 1 ? "right" : "left",
                }}
              >
                <div
                  className="mono"
                  style={{
                    fontSize: 11,
                    color: "var(--muted)",
                    marginBottom: 6,
                  }}
                >
                  {dir}
                </div>
                <div
                  className="h-serif"
                  style={{ fontSize: 17, lineHeight: 1.3 }}
                >
                  {t}
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Right: sidenotes + meta */}
        <aside style={{ position: "sticky", top: 96, alignSelf: "start" }}>
          <div
            className="toc-label"
            style={{
              fontFamily: "var(--mono)",
              fontSize: 10,
              color: "var(--muted-2)",
              textTransform: "uppercase",
              letterSpacing: "0.15em",
              marginBottom: 12,
            }}
          >
            <span
              style={{
                display: "inline-block",
                width: 14,
                height: 1,
                background: "var(--rule)",
                verticalAlign: "middle",
                marginRight: 8,
              }}
            />
            notes
          </div>
          <div className="sidenote" style={{ marginBottom: 20 }}>
            <div
              className="mono"
              style={{ fontSize: 10, color: "var(--accent)", marginBottom: 4 }}
            >
              1
            </div>
            See Anthropic's <em>monosemanticity</em> work for a related anxiety,
            framed differently.
          </div>
          <div className="sidenote" style={{ marginBottom: 28 }}>
            <div
              className="mono"
              style={{ fontSize: 10, color: "var(--accent)", marginBottom: 4 }}
            >
              2
            </div>
            "Probe" is doing a lot of work here. I mean a logistic regression
            trained with cross-entropy on a frozen activation.
          </div>
          <hr className="hr-dashed" style={{ margin: "0 0 18px" }} />
          <div
            style={{
              fontFamily: "var(--mono)",
              fontSize: 10,
              color: "var(--muted-2)",
              textTransform: "uppercase",
              letterSpacing: "0.15em",
              marginBottom: 12,
            }}
          >
            backlinks
          </div>
          <div style={{ display: "grid", gap: 10, fontSize: 12 }}>
            <a
              href="#"
              style={{
                color: "var(--fg-dim)",
                borderBottom: "1px solid var(--rule-soft)",
                paddingBottom: 8,
              }}
            >
              <span
                className="mono"
                style={{ color: "var(--muted)", fontSize: 10 }}
              >
                note
              </span>
              <br />
              The threshold problem
            </a>
            <a
              href="#"
              style={{
                color: "var(--fg-dim)",
                borderBottom: "1px solid var(--rule-soft)",
                paddingBottom: 8,
              }}
            >
              <span
                className="mono"
                style={{ color: "var(--muted)", fontSize: 10 }}
              >
                essay
              </span>
              <br />
              On the moral hazard of benchmarks
            </a>
            <a href="#" style={{ color: "var(--fg-dim)" }}>
              <span
                className="mono"
                style={{ color: "var(--muted)", fontSize: 10 }}
              >
                note
              </span>
              <br />
              Linear decodability ≠ representation
            </a>
          </div>
        </aside>
      </article>
      <Footer />
    </div>
  );
};

window.PostScreen = PostScreen;
