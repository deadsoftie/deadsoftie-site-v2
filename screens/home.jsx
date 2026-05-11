// Home page — bio + now + featured essays
const HomeScreen = () => {
  const featured = [
    {
      n: "I",
      title: "On the slow erosion of model interpretability",
      desc: "After three months staring at attention heads in a 7B param model, I'm convinced the field has been measuring the wrong thing. A working note on what I think we should track instead.",
      meta: "essay · 18 min · drafted apr 22",
      tag: "research",
    },
    {
      n: "II",
      title: "Building a personal index for everything I've ever read",
      desc: "Forty-thousand highlights, eight years of reading, embedded once and queried daily. The architecture, the failure modes, and what I'd do differently.",
      meta: "essay · 12 min · published apr 11",
      tag: "tools",
    },
    {
      n: "III",
      title: "Notes from a month of writing in plaintext",
      desc: "I left the rich-text editor and didn't look back. Some observations on friction, recall, and the politics of file formats.",
      meta: "essay · 7 min · published apr 02",
      tag: "writing",
    },
  ];

  const recent = [
    {
      date: "26 apr 2026",
      title: "What I learned reviewing 200 NeurIPS submissions",
      tags: ["review", "ml"],
      read: "9 min",
    },
    {
      date: "21 apr 2026",
      title: "Why I stopped using vector databases for personal projects",
      tags: ["tools", "infra"],
      read: "6 min",
    },
    {
      date: "14 apr 2026",
      title: "A scattershot taxonomy of 'agentic'",
      tags: ["ml", "essay"],
      read: "11 min",
    },
    {
      date: "06 apr 2026",
      title: "The forgotten elegance of awk",
      tags: ["unix"],
      read: "5 min",
    },
    {
      date: "29 mar 2026",
      title: "Three small things that made my research faster",
      tags: ["research"],
      read: "4 min",
    },
  ];

  return (
    <div>
      <Chrome active="home" />

      <div className="container" style={{ paddingTop: 56, paddingBottom: 24 }}>
        {/* Hero header */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 320px",
            gap: 60,
            alignItems: "start",
          }}
        >
          <div>
            <div className="eyebrow" style={{ marginBottom: 18 }}>
              research log · est. 2019 · written by hand
            </div>
            <h1
              className="h-display"
              style={{ fontSize: 64, margin: "0 0 24px" }}
            >
              Independent research on{" "}
              <em style={{ color: "var(--accent)", fontStyle: "italic" }}>
                language models
              </em>
              , the texture of{" "}
              <em style={{ color: "var(--accent-2)", fontStyle: "italic" }}>
                attention
              </em>
              , and the long, unglamorous work of paying attention to one's own
              thinking.
            </h1>
            <p
              style={{
                fontSize: 16,
                color: "var(--fg-dim)",
                maxWidth: 560,
                margin: 0,
                lineHeight: 1.6,
              }}
            >
              I'm <span style={{ color: "var(--fg)" }}>Sam Halder</span> — a
              researcher and engineer working on interpretability, retrieval,
              and the soft edges of human–model collaboration. This is where I
              keep my notebook in public. Half-formed essays, working code,
              books I'm chewing through, and the occasional small thing that
              delighted me.
            </p>
            <div style={{ display: "flex", gap: 10, marginTop: 22 }}>
              <button className="btn btn-accent">Read latest essay →</button>
              <button className="btn">Subscribe via RSS</button>
              <button className="btn">⌘ K Search</button>
            </div>
          </div>

          {/* Now block */}
          <aside
            style={{
              border: "1px solid var(--rule-soft)",
              borderRadius: 6,
              padding: 22,
              background: "var(--bg-elev)",
              position: "relative",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 14,
                right: 14,
                display: "flex",
                alignItems: "center",
                gap: 8,
                fontFamily: "var(--mono)",
                fontSize: 10,
                color: "var(--muted)",
                textTransform: "uppercase",
                letterSpacing: "0.12em",
              }}
            >
              <span
                className="dot pulse"
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: "var(--ok)",
                  display: "inline-block",
                }}
              />
              live
            </div>
            <div className="eyebrow" style={{ marginBottom: 14 }}>
              now · apr 26
            </div>
            <ul
              style={{
                listStyle: "none",
                padding: 0,
                margin: 0,
                display: "grid",
                gap: 14,
              }}
            >
              <li>
                <div
                  style={{
                    fontFamily: "var(--mono)",
                    fontSize: 10,
                    color: "var(--muted)",
                    marginBottom: 4,
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                  }}
                >
                  writing
                </div>
                <div style={{ fontSize: 14, lineHeight: 1.45 }}>
                  An essay on what interpretability papers are actually
                  claiming.
                </div>
              </li>
              <li>
                <div
                  style={{
                    fontFamily: "var(--mono)",
                    fontSize: 10,
                    color: "var(--muted)",
                    marginBottom: 4,
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                  }}
                >
                  building
                </div>
                <div style={{ fontSize: 14, lineHeight: 1.45 }}>
                  <span className="mono" style={{ color: "var(--accent)" }}>
                    tinyrouter
                  </span>{" "}
                  — a 24M-param classifier that beats GPT-4 on my own routing
                  benchmarks.
                </div>
              </li>
              <li>
                <div
                  style={{
                    fontFamily: "var(--mono)",
                    fontSize: 10,
                    color: "var(--muted)",
                    marginBottom: 4,
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                  }}
                >
                  reading
                </div>
                <div style={{ fontSize: 14, lineHeight: 1.45 }}>
                  Stiegler, <em>Technics and Time, 1</em>. Slowly.
                </div>
              </li>
              <li>
                <div
                  style={{
                    fontFamily: "var(--mono)",
                    fontSize: 10,
                    color: "var(--muted)",
                    marginBottom: 4,
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                  }}
                >
                  location
                </div>
                <div style={{ fontSize: 14, lineHeight: 1.45 }}>
                  Lisbon, until June. Then Berlin.
                </div>
              </li>
            </ul>
            <hr className="hr-dashed" style={{ margin: "16px 0" }} />
            <a
              href="#"
              style={{
                fontFamily: "var(--mono)",
                fontSize: 11,
                color: "var(--accent)",
              }}
            >
              see /now in full →
            </a>
          </aside>
        </div>

        {/* Hero canvas */}
        <Hero />
      </div>

      {/* Featured */}
      <div className="container" style={{ paddingTop: 60, paddingBottom: 40 }}>
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            justifyContent: "space-between",
            marginBottom: 22,
          }}
        >
          <h2 className="h-serif" style={{ fontSize: 28, margin: 0 }}>
            <span className="section-num">003</span> Featured
          </h2>
          <a
            href="#"
            className="mono"
            style={{ fontSize: 12, color: "var(--muted)" }}
          >
            see all 47 essays →
          </a>
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 20,
          }}
        >
          {featured.map((f, i) => (
            <article key={i} className="feat">
              <div className="feat-num">No. {f.n}</div>
              <h3>{f.title}</h3>
              <p>{f.desc}</p>
              <div className="feat-meta">
                <span>{f.meta}</span>
                <span style={{ color: "var(--rule)" }}>·</span>
                <Tag>{f.tag}</Tag>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Recent list */}
      <div className="container" style={{ paddingTop: 40 }}>
        <div
          style={{
            display: "flex",
            alignItems: "baseline",
            justifyContent: "space-between",
            marginBottom: 8,
          }}
        >
          <h2 className="h-serif" style={{ fontSize: 28, margin: 0 }}>
            <span className="section-num">004</span> Recent
          </h2>
          <span
            className="mono"
            style={{ fontSize: 11, color: "var(--muted)" }}
          >
            5 of 47
          </span>
        </div>
        <div>
          {recent.map((r, i) => (
            <div key={i} className="post-row">
              <div className="date">{r.date}</div>
              <div className="post-title">{r.title}</div>
              <div className="post-tags">
                {r.tags.map((t) => (
                  <Tag key={t}>{t}</Tag>
                ))}
              </div>
              <div className="read">{r.read}</div>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
};

window.HomeScreen = HomeScreen;
