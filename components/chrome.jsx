// Shared chrome — top nav, footer, helpers
const Chrome = ({ active = "home" }) => {
  const items = [
    { id: "home", label: "Home", href: "#home" },
    { id: "essays", label: "Essays", href: "#essays" },
    { id: "notes", label: "Notes", href: "#notes" },
    { id: "projects", label: "Projects", href: "#projects" },
    { id: "bookshelf", label: "Bookshelf", href: "#bookshelf" },
    { id: "about", label: "About", href: "#about" },
  ];
  return (
    <header className="chrome">
      <div className="brand">
        <div style={{ display: "flex", gap: 0 }}>
          <div className="brand-mark accent">d</div>
          <div
            className="brand-mark accent-2"
            style={{ marginLeft: -4, transform: "translateY(2px)" }}
          >
            s
          </div>
        </div>
        <b style={{ marginLeft: 4 }}>deadsoftie</b>
        <span>/ a research log</span>
      </div>
      <nav className="nav">
        {items.map((i) => (
          <a
            key={i.id}
            href={i.href}
            className={active === i.id ? "active" : ""}
          >
            {i.label}
          </a>
        ))}
      </nav>
      <div className="chrome-right">
        <span className="dot pulse" />
        <span>writing · 04.26</span>
        <span className="kbd">⌘ K</span>
      </div>
    </header>
  );
};

const Footer = () => (
  <footer className="foot">
    <div>
      <div style={{ marginBottom: 8 }}>
        <span style={{ color: "var(--fg-dim)" }}>deadsoftie</span> · maintained
        since 2019 · last build {new Date().toLocaleDateString("en-CA")}
      </div>
      <div style={{ display: "flex", gap: 18 }}>
        <a href="#">RSS</a>
        <a href="#">GitHub</a>
        <a href="#">Mastodon</a>
        <a href="#">arXiv</a>
        <a href="#">Email</a>
      </div>
    </div>
    <div className="ascii">
      {`   ___  ___ ___ ___  
  / _ \\/ __| __|   \\ 
 | (_) \\__ \\__|| |) |
  \\___/|___/___|___/ `}
    </div>
  </footer>
);

// Tag chip
const Tag = ({ children, active = false }) => (
  <span className={"tag" + (active ? " is-active" : "")}>#{children}</span>
);

// Small helper to render a placeholder image
const Placeholder = ({ w = "100%", h = 160, label = "figure" }) => (
  <div className="placeholder" style={{ width: w, height: h }}>
    {label}
  </div>
);

Object.assign(window, { Chrome, Footer, Tag, Placeholder });
