// Notes / garden — short-form, growth-stage tagged, with backlinks graph
const NotesScreen = () => {
  const notes = [
    { stage: "🌱", title: "The threshold problem", excerpt: "Most interpretability claims live or die on a threshold parameter that nobody discusses.", links: 4, age: "3d" },
    { stage: "🌿", title: "Linear decodability ≠ representation", excerpt: "A probe finds structure that is linearly recoverable. That is a much weaker claim than 'the model represents X'.", links: 7, age: "1w" },
    { stage: "🌳", title: "Why I think attention is the wrong abstraction", excerpt: "Three years of half-arguments, finally collected. Mostly: attention is a routing primitive, not a cognitive one.", links: 14, age: "2mo" },
    { stage: "🌱", title: "On the texture of code reviews", excerpt: "I review more code than I write. Some patterns I've noticed in what makes a review feel like a gift vs. an audit.", links: 2, age: "5d" },
    { stage: "🌿", title: "Embeddings as memory, not knowledge", excerpt: "The mistake is treating an embedding store as a knowledge base. It's a sieve with a particular hole geometry.", links: 9, age: "3w" },
    { stage: "🌳", title: "What 'reading' actually means in 2026", excerpt: "I read in three modes now: cover-to-cover, query-driven, and ambient. Different tools for each.", links: 11, age: "4mo" },
    { stage: "🌱", title: "Small models, large priors", excerpt: "A working hunch: most of what makes a 'small' model usable is the prior the user brings.", links: 1, age: "1d" },
    { stage: "🌿", title: "On not finishing books", excerpt: "I gave myself permission to abandon books at page 50. My retention went up.", links: 3, age: "2w" },
    { stage: "🌱", title: "The cost of context windows", excerpt: "Long contexts feel free; they aren't. Latency, attention dilution, and the politics of who decides what to truncate.", links: 5, age: "6d" },
  ];

  const stages = [
    { mark: "🌱", label: "seedling", desc: "raw, just planted" },
    { mark: "🌿", label: "budding", desc: "taking shape" },
    { mark: "🌳", label: "evergreen", desc: "stable, reliable" },
  ];

  return (
    <div>
      <Chrome active="notes" />
      <div className="container" style={{ paddingTop: 56 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 60, alignItems: "end", marginBottom: 36 }}>
          <div>
            <div className="eyebrow" style={{ marginBottom: 14 }}>section · 003</div>
            <h1 className="h-display" style={{ fontSize: 72, margin: 0 }}>
              <span style={{ color: "var(--accent)", fontStyle: "italic", fontSize: 28, verticalAlign: "top", marginRight: 8 }}>132</span>
              Notes
            </h1>
            <p style={{ color: "var(--fg-dim)", maxWidth: 540, marginTop: 14, fontSize: 15 }}>
              The compost heap. Half-thoughts, hunches, fragments that haven't earned the weight of an essay yet. Some will. Most won't. Each note is dated, linked, and labelled by how settled the idea is.
            </p>
          </div>
          <div style={{
            border: "1px solid var(--rule-soft)", borderRadius: 6, padding: 18,
            background: "var(--bg-elev)", fontSize: 12,
          }}>
            <div className="eyebrow" style={{ marginBottom: 12 }}>legend</div>
            {stages.map(s => (
              <div key={s.mark} style={{ display: "flex", gap: 10, alignItems: "baseline", marginBottom: 8 }}>
                <span style={{ fontSize: 16, width: 22 }}>{s.mark}</span>
                <span className="mono" style={{ color: "var(--fg)", fontSize: 12, width: 80 }}>{s.label}</span>
                <span className="mono" style={{ color: "var(--muted)", fontSize: 11 }}>{s.desc}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Notes masonry */}
        <div style={{
          columnCount: 3, columnGap: 16,
        }}>
          {notes.map((n, i) => (
            <article key={i} style={{
              breakInside: "avoid",
              border: "1px solid var(--rule-soft)",
              borderRadius: 6,
              padding: "16px 18px",
              marginBottom: 16,
              background: "var(--bg-elev)",
              cursor: "pointer",
              transition: "all .2s",
              display: "block",
            }}
              onMouseEnter={e => {
                e.currentTarget.style.borderColor = "var(--accent)";
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.borderColor = "var(--rule-soft)";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <div style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                marginBottom: 10,
              }}>
                <span style={{ fontSize: 18 }}>{n.stage}</span>
                <span className="mono" style={{ fontSize: 10, color: "var(--muted)" }}>{n.age}</span>
              </div>
              <h3 className="h-serif" style={{ fontSize: 19, margin: "0 0 8px", lineHeight: 1.25 }}>{n.title}</h3>
              <p style={{ fontSize: 13, color: "var(--fg-dim)", margin: 0, lineHeight: 1.5 }}>{n.excerpt}</p>
              <div style={{
                marginTop: 12, display: "flex", justifyContent: "space-between", alignItems: "center",
                fontFamily: "var(--mono)", fontSize: 10, color: "var(--muted)",
                paddingTop: 10, borderTop: "1px dashed var(--rule)",
              }}>
                <span>↳ {n.links} link{n.links === 1 ? "" : "s"}</span>
                <span>read →</span>
              </div>
            </article>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
};

window.NotesScreen = NotesScreen;
