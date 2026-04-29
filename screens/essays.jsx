// Essays index — filterable + searchable
const EssaysScreen = () => {
  const all = [
    { y: 2026, m: "apr 26", t: "What I learned reviewing 200 NeurIPS submissions", tags: ["review", "ml"], read: "9 min", words: 2400 },
    { y: 2026, m: "apr 22", t: "On the slow erosion of model interpretability", tags: ["research", "ml"], read: "18 min", words: 5200, featured: true },
    { y: 2026, m: "apr 21", t: "Why I stopped using vector databases for personal projects", tags: ["tools", "infra"], read: "6 min", words: 1700 },
    { y: 2026, m: "apr 14", t: "A scattershot taxonomy of 'agentic'", tags: ["ml", "essay"], read: "11 min", words: 3100 },
    { y: 2026, m: "apr 11", t: "Building a personal index for everything I've ever read", tags: ["tools", "writing"], read: "12 min", words: 3400 },
    { y: 2026, m: "apr 06", t: "The forgotten elegance of awk", tags: ["unix", "tools"], read: "5 min", words: 1300 },
    { y: 2026, m: "apr 02", t: "Notes from a month of writing in plaintext", tags: ["writing"], read: "7 min", words: 1900 },
    { y: 2026, m: "mar 29", t: "Three small things that made my research faster", tags: ["research"], read: "4 min", words: 1100 },
    { y: 2026, m: "mar 21", t: "On the moral hazard of benchmarks", tags: ["research", "essay"], read: "14 min", words: 4000 },
    { y: 2026, m: "mar 12", t: "An archaeology of my dotfiles", tags: ["unix", "personal"], read: "8 min", words: 2200 },
    { y: 2025, m: "dec 18", t: "Reading <em>Patterns of Software</em> twenty years late", tags: ["books"], read: "10 min", words: 2700 },
    { y: 2025, m: "nov 30", t: "Embeddings are an ergonomics problem, not a quality one", tags: ["ml", "tools"], read: "13 min", words: 3700 },
    { y: 2025, m: "nov 14", t: "What a 'researcher' actually does, in practice", tags: ["research", "career"], read: "15 min", words: 4400 },
    { y: 2025, m: "oct 27", t: "Notes on running my own GPU box for a year", tags: ["infra"], read: "9 min", words: 2500 },
    { y: 2025, m: "oct 04", t: "The unbearable smallness of attention windows", tags: ["ml"], read: "11 min", words: 3000 },
  ];

  const allTags = ["all", "research", "ml", "tools", "writing", "unix", "essay", "infra", "books", "personal", "career", "review"];
  const [tag, setTag] = React.useState("all");
  const [q, setQ] = React.useState("");
  const [sort, setSort] = React.useState("new");

  const filtered = React.useMemo(() => {
    let r = all;
    if (tag !== "all") r = r.filter(x => x.tags.includes(tag));
    if (q.trim()) {
      const k = q.toLowerCase();
      r = r.filter(x => x.t.toLowerCase().includes(k));
    }
    if (sort === "long") r = [...r].sort((a, b) => b.words - a.words);
    if (sort === "short") r = [...r].sort((a, b) => a.words - b.words);
    return r;
  }, [tag, q, sort]);

  const grouped = React.useMemo(() => {
    const g = {};
    for (const r of filtered) { (g[r.y] = g[r.y] || []).push(r); }
    return g;
  }, [filtered]);

  return (
    <div>
      <Chrome active="essays" />
      <div className="container" style={{ paddingTop: 56 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: 60, alignItems: "end", marginBottom: 36 }}>
          <div>
            <div className="eyebrow" style={{ marginBottom: 14 }}>section · 002</div>
            <h1 className="h-display" style={{ fontSize: 72, margin: 0 }}>
              <span style={{ color: "var(--accent)", fontStyle: "italic", fontSize: 28, verticalAlign: "top", marginRight: 8 }}>{all.length}</span>
              Essays
            </h1>
            <p style={{ color: "var(--fg-dim)", maxWidth: 520, marginTop: 14, fontSize: 15 }}>
              Long-form pieces. These get edited, sat with, and re-edited. If something here is wrong, it's wrong on purpose; if it's wrong by accident, please tell me.
            </p>
          </div>
          {/* search */}
          <div style={{
            border: "1px solid var(--rule)",
            borderRadius: 4, padding: "10px 14px",
            display: "flex", alignItems: "center", gap: 10,
            background: "var(--bg-elev)",
          }}>
            <span className="mono" style={{ color: "var(--muted)", fontSize: 13 }}>/</span>
            <input
              value={q}
              onChange={e => setQ(e.target.value)}
              placeholder="search 47 essays…"
              style={{
                flex: 1, background: "transparent", border: 0, outline: 0,
                color: "var(--fg)", fontFamily: "var(--mono)", fontSize: 13,
              }}
            />
            <span className="kbd" style={{
              border: "1px solid var(--rule)", borderRadius: 3, padding: "2px 6px",
              fontSize: 10, color: "var(--muted)", fontFamily: "var(--mono)",
            }}>esc</span>
          </div>
        </div>

        {/* tag filters */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 14 }}>
          {allTags.map(t => (
            <button
              key={t}
              className="tag"
              onClick={() => setTag(t)}
              style={{
                background: "transparent", cursor: "pointer",
                ...(tag === t ? {
                  borderColor: "var(--accent)", color: "var(--accent)",
                  background: "var(--accent-glow)",
                } : {}),
              }}
            >
              {t === "all" ? "all" : "#" + t}
            </button>
          ))}
        </div>
        {/* sort row */}
        <div style={{
          display: "flex", justifyContent: "space-between", alignItems: "center",
          fontFamily: "var(--mono)", fontSize: 11, color: "var(--muted)",
          padding: "10px 0", borderTop: "1px solid var(--rule-soft)", borderBottom: "1px solid var(--rule-soft)",
          marginBottom: 0,
        }}>
          <span>{filtered.length} matching</span>
          <div style={{ display: "flex", gap: 16 }}>
            {[["new", "newest"], ["long", "longest"], ["short", "shortest"]].map(([k, l]) => (
              <button key={k} onClick={() => setSort(k)} style={{
                background: "transparent", border: 0, cursor: "pointer",
                color: sort === k ? "var(--accent)" : "var(--fg-dim)",
                fontFamily: "var(--mono)", fontSize: 11, padding: 0,
              }}>{l}</button>
            ))}
          </div>
        </div>

        {/* posts grouped by year */}
        {Object.keys(grouped).sort((a, b) => b - a).map(year => (
          <div key={year} style={{ marginTop: 36 }}>
            <div style={{
              display: "flex", alignItems: "baseline", gap: 16,
              marginBottom: 4,
            }}>
              <h2 className="h-serif" style={{
                fontSize: 64, margin: 0, color: "oklch(0.50 0.010 250)",
                letterSpacing: "-0.03em",
              }}>{year}</h2>
              <span className="mono" style={{ fontSize: 11, color: "var(--muted)" }}>
                {grouped[year].length} {grouped[year].length === 1 ? "essay" : "essays"}
              </span>
            </div>
            {grouped[year].map((r, i) => (
              <div key={i} className="post-row" style={{
                ...(r.featured ? { background: "linear-gradient(90deg, var(--accent-2-glow), transparent 40%)" } : {}),
              }}>
                <div className="date">{r.m}</div>
                <div className="post-title">
                  {r.featured && <span style={{
                    fontFamily: "var(--mono)", fontSize: 9, color: "var(--accent-2)",
                    border: "1px solid var(--accent-2)", borderRadius: 3, padding: "1px 5px",
                    marginRight: 10, verticalAlign: "middle", textTransform: "uppercase",
                    letterSpacing: "0.1em",
                  }}>★ pinned</span>}
                  <span dangerouslySetInnerHTML={{ __html: r.t }} />
                </div>
                <div className="post-tags">{r.tags.map(t => <Tag key={t}>{t}</Tag>)}</div>
                <div className="read">{r.read}</div>
              </div>
            ))}
          </div>
        ))}
      </div>
      <Footer />
    </div>
  );
};

window.EssaysScreen = EssaysScreen;
