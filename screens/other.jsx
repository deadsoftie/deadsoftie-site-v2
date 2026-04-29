// Projects + Bookshelf + About
const ProjectsScreen = () => {
  const projects = [
    {
      name: "tinyrouter", year: "2026", status: "active",
      blurb: "A 24M-param classifier that outperforms GPT-4 on multi-domain routing. Open-sourced under MIT. Used in production at three companies I know of.",
      stack: ["pytorch", "candle", "rust"],
      stars: "2.1k", url: "github.com/halder/tinyrouter",
    },
    {
      name: "deadnotes", year: "2025", status: "active",
      blurb: "My personal index — eight years of reading highlights, embedded once, queried daily. Keyboard-first. Markdown out.",
      stack: ["sqlite", "ggml", "go"],
      stars: "418", url: "github.com/halder/deadnotes",
    },
    {
      name: "probe-zoo", year: "2025", status: "maintained",
      blurb: "A small library of interpretability probes that doesn't pretend the threshold doesn't matter. Companion to the essay.",
      stack: ["python", "torch"],
      stars: "612", url: "github.com/halder/probe-zoo",
    },
    {
      name: "awk-cookbook", year: "2024", status: "archived",
      blurb: "Forty awk one-liners I find myself reaching for. Now a small printed zine, also free online.",
      stack: ["awk", "shell", "love"],
      stars: "1.4k", url: "github.com/halder/awk-cookbook",
    },
  ];

  return (
    <div>
      <Chrome active="projects" />
      <div className="container" style={{ paddingTop: 56 }}>
        <div className="eyebrow" style={{ marginBottom: 14 }}>section · 004</div>
        <h1 className="h-display" style={{ fontSize: 72, margin: 0 }}>
          <span style={{ color: "var(--accent)", fontStyle: "italic", fontSize: 28, verticalAlign: "top", marginRight: 8 }}>{projects.length}</span>
          Projects
        </h1>
        <p style={{ color: "var(--fg-dim)", maxWidth: 600, marginTop: 14, fontSize: 15, marginBottom: 50 }}>
          Things I've built, mostly small, mostly open-source. I work on them in the evenings when the day's research has gone sideways.
        </p>

        <div style={{ display: "grid", gap: 0 }}>
          {projects.map((p, i) => (
            <article key={i} style={{
              padding: "32px 0", borderTop: "1px solid var(--rule-soft)",
              display: "grid", gridTemplateColumns: "200px 1fr 200px", gap: 40,
              cursor: "pointer", transition: "padding .2s",
            }}
              onMouseEnter={e => { e.currentTarget.style.paddingLeft = "8px"; }}
              onMouseLeave={e => { e.currentTarget.style.paddingLeft = "0"; }}
            >
              <div>
                <h2 className="h-serif" style={{ fontSize: 32, margin: "0 0 6px", letterSpacing: "-0.02em" }}>{p.name}</h2>
                <div className="mono" style={{ fontSize: 11, color: "var(--muted)", display: "flex", gap: 10, alignItems: "center" }}>
                  <span>{p.year}</span>
                  <span style={{ color: "var(--rule)" }}>·</span>
                  <span style={{
                    color: p.status === "active" ? "var(--ok)" : p.status === "archived" ? "var(--muted)" : "var(--accent)",
                  }}>● {p.status}</span>
                </div>
              </div>
              <div>
                <p style={{ margin: "0 0 14px", fontSize: 15, lineHeight: 1.6, color: "var(--fg)" }}>{p.blurb}</p>
                <div style={{ display: "flex", gap: 6 }}>
                  {p.stack.map(s => <Tag key={s}>{s}</Tag>)}
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div className="mono" style={{ fontSize: 22, color: "var(--fg)" }}>★ {p.stars}</div>
                <div className="mono" style={{ fontSize: 11, color: "var(--muted)", marginTop: 6, wordBreak: "break-all" }}>{p.url}</div>
              </div>
            </article>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

const BookshelfScreen = () => {
  const reading = [
    { t: "Technics and Time, 1", a: "Bernard Stiegler", year: 1994, status: "reading", rating: null, color: "oklch(0.55 0.14 25)" },
    { t: "The Order of Things", a: "Michel Foucault", year: 1966, status: "reading", rating: null, color: "oklch(0.45 0.05 200)" },
  ];
  const recent = [
    { t: "Patterns of Software", a: "Richard Gabriel", year: 1996, status: "finished", rating: 5, color: "oklch(0.65 0.12 80)", note: "best book on software ergonomics I've ever read." },
    { t: "Seeing Like a State", a: "James C. Scott", year: 1998, status: "finished", rating: 5, color: "oklch(0.5 0.1 130)", note: "everyone in ML should read chapter 1." },
    { t: "How to Take Smart Notes", a: "Sönke Ahrens", year: 2017, status: "finished", rating: 3, color: "oklch(0.75 0.04 60)", note: "useful, but loses steam in the back half." },
    { t: "The Glass Bead Game", a: "Hermann Hesse", year: 1943, status: "finished", rating: 4, color: "oklch(0.4 0.08 280)", note: "made me want to be 22 again." },
    { t: "A Pattern Language", a: "Christopher Alexander", year: 1977, status: "finished", rating: 5, color: "oklch(0.6 0.12 40)", note: "I keep this one within arm's reach." },
    { t: "Reasons and Persons", a: "Derek Parfit", year: 1984, status: "abandoned", rating: 2, color: "oklch(0.35 0.04 250)", note: "got 80 pages in. Will return one day, maybe." },
  ];

  const Cover = ({ b }) => (
    <div style={{
      width: "100%", aspectRatio: "2/3", borderRadius: 3,
      background: `linear-gradient(160deg, ${b.color}, color-mix(in oklab, ${b.color} 60%, black))`,
      position: "relative", overflow: "hidden",
      boxShadow: "0 4px 20px rgba(0,0,0,0.4), inset 0 0 0 1px rgba(255,255,255,0.06), inset 4px 0 0 rgba(0,0,0,0.2)",
      padding: "14px 12px",
      display: "flex", flexDirection: "column", justifyContent: "space-between",
    }}>
      <div style={{
        fontFamily: "var(--serif)", fontSize: 13, lineHeight: 1.15,
        color: "rgba(255,255,255,0.95)", letterSpacing: "-0.01em",
      }}>{b.t}</div>
      <div style={{
        fontFamily: "var(--mono)", fontSize: 9, color: "rgba(255,255,255,0.7)",
        textTransform: "uppercase", letterSpacing: "0.1em",
      }}>{b.a}</div>
    </div>
  );

  return (
    <div>
      <Chrome active="bookshelf" />
      <div className="container" style={{ paddingTop: 56 }}>
        <div className="eyebrow" style={{ marginBottom: 14 }}>section · 005</div>
        <h1 className="h-display" style={{ fontSize: 72, margin: 0 }}>Bookshelf</h1>
        <p style={{ color: "var(--fg-dim)", maxWidth: 600, marginTop: 14, fontSize: 15, marginBottom: 50 }}>
          What I'm reading, what I've finished, what I gave up on. Stars are private and unscientific. Notes are in my own voice.
        </p>

        {/* Currently reading */}
        <h2 className="h-serif" style={{ fontSize: 28, margin: "0 0 18px" }}>
          <span className="section-num">i.</span> Currently reading
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 18, marginBottom: 50 }}>
          {reading.map((b, i) => (
            <div key={i}>
              <Cover b={b} />
              <div style={{ marginTop: 8, fontSize: 12 }}>
                <div className="h-serif" style={{ fontSize: 14, lineHeight: 1.2 }}>{b.t}</div>
                <div className="mono" style={{ fontSize: 10, color: "var(--muted)", marginTop: 2 }}>{b.a}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Finished */}
        <h2 className="h-serif" style={{ fontSize: 28, margin: "0 0 18px" }}>
          <span className="section-num">ii.</span> Recently finished
        </h2>
        <div>
          {recent.map((b, i) => (
            <div key={i} style={{
              display: "grid", gridTemplateColumns: "60px 1fr 80px 80px",
              gap: 24, alignItems: "center",
              padding: "16px 0", borderTop: "1px solid var(--rule-soft)",
            }}>
              <div style={{ width: 60 }}><Cover b={b} /></div>
              <div>
                <div className="h-serif" style={{ fontSize: 18, lineHeight: 1.25 }}>{b.t}</div>
                <div style={{ display: "flex", gap: 10, marginTop: 4, alignItems: "baseline" }}>
                  <span className="mono" style={{ fontSize: 11, color: "var(--muted)" }}>{b.a}</span>
                  <span className="mono" style={{ fontSize: 11, color: "var(--muted-2, #555)" }}>{b.year}</span>
                </div>
                <p style={{ margin: "8px 0 0", fontSize: 13, color: "var(--fg-dim)", fontFamily: "var(--serif)", fontStyle: "italic" }}>"{b.note}"</p>
              </div>
              <div className="mono" style={{ fontSize: 12, color: b.rating >= 4 ? "var(--accent)" : "var(--muted)" }}>
                {b.rating ? "★".repeat(b.rating) + "☆".repeat(5 - b.rating) : "—"}
              </div>
              <div className="mono" style={{ fontSize: 11, color: b.status === "abandoned" ? "var(--accent-2)" : "var(--muted)", textAlign: "right" }}>
                {b.status}
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

const AboutScreen = () => (
  <div>
    <Chrome active="about" />
    <div className="container" style={{ paddingTop: 56, display: "grid", gridTemplateColumns: "1fr 280px", gap: 60 }}>
      <div>
        <div className="eyebrow" style={{ marginBottom: 14 }}>section · 006</div>
        <h1 className="h-display" style={{ fontSize: 72, margin: "0 0 30px" }}>About</h1>
        <div className="prose">
          <p>
            I'm Sam Halder. I do independent research on language models, mostly around interpretability and retrieval, and I write about it here. Before going independent in 2024 I spent five years on a small research team at a lab you've probably heard of, and four years before that as a software engineer in places I won't name because the work wasn't very interesting.
          </p>
          <p>
            This blog has existed in one form or another since 2019. The name <em>deadsoftie</em> is from a poem I read in my twenties; I'm fond of it for reasons that are now embarrassing. I've kept it.
          </p>
          <h2>What's here</h2>
          <p>
            Long essays I've sat with for a while. Shorter notes I publish more freely. Working code I'm willing to put my name on. Books I've read carefully. A "now" page I update most weeks.
          </p>
          <h2>How to reach me</h2>
          <p>
            Email is best. I read everything; I reply to most things, eventually. I'm slow on Twitter and worse on LinkedIn.
          </p>
          <h2>Colophon</h2>
          <p>
            Hand-written in markdown, built with Jekyll, hosted on GitHub Pages. Body is set in <a href="#">Inter Tight</a>; headings in <a href="#">Newsreader</a>; code in <a href="#">JetBrains Mono</a>. The accent color is a warm amber I picked in 2022 and have not been able to bring myself to change.
          </p>
        </div>
      </div>
      <aside>
        <div style={{
          aspectRatio: "1", border: "1px solid var(--rule-soft)",
          borderRadius: 6, marginBottom: 18,
          background: "linear-gradient(145deg, oklch(0.32 0.04 80), oklch(0.20 0.02 80))",
          display: "grid", placeItems: "center",
          fontFamily: "var(--mono)", color: "var(--muted)", fontSize: 11,
          letterSpacing: "0.1em", textTransform: "uppercase",
        }}>portrait_2025.jpg</div>
        <div style={{ fontSize: 12 }}>
          <div className="eyebrow" style={{ marginBottom: 12 }}>elsewhere</div>
          <div style={{ display: "grid", gap: 8, fontFamily: "var(--mono)" }}>
            <a href="#" style={{ color: "var(--fg-dim)" }}>github.com/halder ↗</a>
            <a href="#" style={{ color: "var(--fg-dim)" }}>arxiv.org/a/halder ↗</a>
            <a href="#" style={{ color: "var(--fg-dim)" }}>scholar.google.com ↗</a>
            <a href="#" style={{ color: "var(--fg-dim)" }}>mastodon.social/@halder ↗</a>
            <a href="#" style={{ color: "var(--fg-dim)" }}>sam@deadsoftie.com ↗</a>
          </div>
        </div>
      </aside>
    </div>
    <Footer />
  </div>
);

Object.assign(window, { ProjectsScreen, BookshelfScreen, AboutScreen });
