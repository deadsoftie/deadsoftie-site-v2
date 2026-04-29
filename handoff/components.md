# Components

Self-contained component recipes. Each gives you semantic HTML + the CSS it
needs. Drop into Jekyll includes, Astro components, whatever.

---

## 1. Top chrome (sticky nav)

```html
<header class="chrome">
  <a href="/" class="brand">
    <span class="brand-mark">
      <span class="brand-mark-d">d</span>
      <span class="brand-mark-s">s</span>
    </span>
    <b>deadsoftie</b>
    <span class="brand-tag">/ a research log</span>
  </a>
  <nav class="nav">
    <a href="/">Home</a>
    <a href="/essays" class="active">Essays</a>
    <a href="/notes">Notes</a>
    <a href="/projects">Projects</a>
    <a href="/bookshelf">Bookshelf</a>
    <a href="/about">About</a>
  </nav>
  <div class="chrome-right">
    <span class="dot pulse"></span>
    <span>writing · 04.26</span>
    <span class="kbd">⌘ K</span>
  </div>
</header>
```

```css
.chrome {
  position: sticky; top: 0; z-index: 50;
  display: flex; align-items: center; justify-content: space-between;
  padding: 18px 36px;
  background: color-mix(in oklab, var(--bg) 88%, transparent);
  backdrop-filter: blur(14px);
  border-bottom: 1px solid var(--rule-soft);
}
.brand { display: flex; align-items: center; gap: 10px;
  font-family: var(--mono); font-size: 13px; }
.brand b { font-weight: 600; }
.brand-tag { color: var(--muted); }

.brand-mark { display: inline-flex; }
.brand-mark-d, .brand-mark-s {
  width: 22px; height: 22px; border-radius: 4px;
  display: grid; place-items: center;
  font-weight: 700; font-size: 12px; color: white;
}
.brand-mark-d { background: var(--accent); }
.brand-mark-s { background: var(--accent-2); margin-left: -4px; transform: translateY(2px); }

.nav { display: flex; gap: 28px; font-size: 13px; }
.nav a { color: var(--fg-dim); position: relative; padding: 4px 0; }
.nav a:hover { color: var(--fg); }
.nav a.active { color: var(--fg); }
.nav a.active::after {
  content: ""; position: absolute; left: 0; right: 0; bottom: -2px;
  height: 1px; background: var(--accent);
}
.chrome-right { display: flex; align-items: center; gap: 18px;
  font-family: var(--mono); font-size: 12px; color: var(--muted); }
.kbd { border: 1px solid var(--rule); border-radius: 4px;
  padding: 2px 6px; font-size: 11px; color: var(--fg-dim); }
.dot { width: 6px; height: 6px; border-radius: 50%; background: var(--ok);
  box-shadow: 0 0 0 3px color-mix(in oklab, var(--ok) 25%, transparent); }
@keyframes pulse-dot { 0%,100%{opacity:1} 50%{opacity:.4} }
.pulse { animation: pulse-dot 2s ease-in-out infinite; }
```

---

## 2. Eyebrow label

A tiny mono label with a hairline blue→red gradient before it. Use everywhere
above section titles.

```html
<div class="eyebrow">section · 002</div>
```

```css
.eyebrow {
  font-family: var(--mono); font-size: 11px;
  text-transform: uppercase; letter-spacing: 0.12em;
  color: var(--muted);
  display: inline-flex; align-items: center; gap: 8px;
}
.eyebrow::before {
  content: ""; width: 14px; height: 1px;
  background: linear-gradient(90deg, var(--accent), var(--accent-2));
}
```

---

## 3. Tag chip

```html
<a href="/tag/ml" class="tag">#ml</a>
<a class="tag is-active">#ml</a>
```

```css
.tag {
  display: inline-flex; align-items: center; gap: 4px;
  font-family: var(--mono); font-size: 11px;
  color: var(--fg-dim);
  border: 1px solid var(--rule);
  border-radius: 3px;
  padding: 2px 7px;
  text-transform: lowercase;
  transition: all .15s;
}
.tag:hover { border-color: var(--accent); color: var(--accent); }
.tag.is-active {
  border-color: var(--accent); color: var(--accent);
  background: var(--accent-glow);
}
```

---

## 4. Button

```html
<button class="btn">Subscribe via RSS</button>
<button class="btn btn-accent">Read latest essay →</button>
```

```css
.btn {
  display: inline-flex; align-items: center; gap: 8px;
  font-family: var(--mono); font-size: 12px;
  padding: 8px 14px;
  border: 1px solid var(--rule); border-radius: 4px;
  color: var(--fg); background: transparent;
  cursor: pointer; transition: all .15s;
}
.btn:hover { border-color: var(--accent); color: var(--accent); }
.btn-accent {
  background: var(--accent); border-color: var(--accent); color: white;
  font-weight: 600;
}
.btn-accent:hover { background: color-mix(in oklab, var(--accent) 85%, white); color: white; }
```

---

## 5. Post row (the hairline list pattern)

The core list element on home + essays index.

```html
<a href="/essay/slug" class="post-row">
  <div class="date">26 apr 2026</div>
  <div class="post-title">What I learned reviewing 200 NeurIPS submissions</div>
  <div class="post-tags">
    <span class="tag">#review</span>
    <span class="tag">#ml</span>
  </div>
  <div class="read">9 min</div>
</a>
```

```css
.post-row {
  display: grid;
  grid-template-columns: 90px 1fr 240px 80px;
  gap: 24px; align-items: baseline;
  padding: 18px 0;
  border-top: 1px solid var(--rule-soft);
  cursor: pointer; transition: padding .2s;
}
.post-row:hover { padding-left: 8px; }
.post-row:hover .post-title { color: var(--accent); }
.post-row .date { font-family: var(--mono); font-size: 12px; color: var(--muted); }
.post-row .post-title {
  font-family: var(--serif); font-size: 21px; line-height: 1.2;
  transition: color .15s;
}
.post-row .post-tags { display: flex; flex-wrap: wrap; gap: 6px; }
.post-row .read {
  font-family: var(--mono); font-size: 11px; color: var(--muted);
  text-align: right;
}
```

For pinned essays: add `style="background: linear-gradient(90deg, var(--accent-2-glow), transparent 40%);"`
to the row, and prepend a `<span class="pin-tag">★ pinned</span>` to the title.

---

## 6. Featured card

Used for the 3-up "Featured" grid on the home page.

```html
<a href="/essay/slug" class="feat">
  <div class="feat-num">No. I</div>
  <h3>On the slow erosion of model interpretability</h3>
  <p>After three months staring at attention heads in a 7B param model…</p>
  <div class="feat-meta">
    <span>essay · 18 min · drafted apr 22</span>
    <span class="tag">#research</span>
  </div>
</a>
```

```css
.feat {
  display: block; padding: 22px;
  border: 1px solid var(--rule-soft); border-radius: 6px;
  background:
    radial-gradient(120% 80% at 0% 0%, color-mix(in oklab, var(--accent) 7%, transparent), transparent 60%),
    var(--bg-elev);
  transition: all .2s;
}
.feat:hover { border-color: var(--accent); transform: translateY(-2px); }
.feat-num {
  font-family: var(--serif); font-style: italic; color: var(--accent);
  font-size: 13px; margin-bottom: 14px;
}
.feat h3 {
  font-family: var(--serif); font-weight: 400;
  font-size: 26px; line-height: 1.15; margin: 0 0 14px;
  letter-spacing: -0.015em;
}
.feat p { margin: 0 0 14px; font-size: 14px; color: var(--fg-dim); line-height: 1.55; }
.feat-meta {
  display: flex; align-items: center; gap: 10px;
  font-family: var(--mono); font-size: 11px; color: var(--muted);
}
```

---

## 7. "Now" sidebar

```html
<aside class="now">
  <div class="now-status"><span class="dot pulse"></span> live</div>
  <div class="eyebrow">now · apr 26</div>
  <ul>
    <li><span class="now-key">writing</span><span class="now-val">An essay on what interpretability papers are actually claiming.</span></li>
    <li><span class="now-key">building</span><span class="now-val"><code>tinyrouter</code> — a 24M-param classifier…</span></li>
    <li><span class="now-key">reading</span><span class="now-val">Stiegler, <em>Technics and Time, 1</em>.</span></li>
  </ul>
  <a href="/now" class="now-link">see /now in full →</a>
</aside>
```

```css
.now {
  border: 1px solid var(--rule-soft); border-radius: 6px;
  background: var(--bg-elev); padding: 22px; position: relative;
}
.now-status {
  position: absolute; top: 14px; right: 14px;
  font-family: var(--mono); font-size: 10px; color: var(--muted);
  text-transform: uppercase; letter-spacing: 0.12em;
  display: flex; align-items: center; gap: 8px;
}
.now ul { list-style: none; padding: 0; margin: 0; display: grid; gap: 14px; }
.now li { display: grid; gap: 4px; }
.now-key {
  font-family: var(--mono); font-size: 10px; color: var(--muted);
  text-transform: uppercase; letter-spacing: 0.1em;
}
.now-val { font-size: 14px; line-height: 1.45; }
.now-link {
  display: inline-block; margin-top: 16px;
  font-family: var(--mono); font-size: 11px; color: var(--accent);
}
```

---

## 8. Code block (with copy button)

```html
<figure class="codeblock">
  <header class="codeblock-bar">
    <span>probe.py · 32 lines</span>
    <button class="copy">copy</button>
  </header>
  <pre><code><span class="tok-com"># lift residual stream</span>
<span class="tok-kw">def</span> <span class="tok-fn">probe</span>(model, layer):
    ...</code></pre>
</figure>
```

```css
.codeblock {
  background: var(--bg-deep); border: 1px solid var(--rule-soft);
  border-radius: 6px; margin: 1.4em 0; overflow: hidden;
}
.codeblock-bar {
  display: flex; justify-content: space-between; align-items: center;
  padding: 8px 12px; font-family: var(--mono); font-size: 11px;
  color: var(--muted); border-bottom: 1px solid var(--rule-soft);
}
.codeblock pre {
  margin: 0; padding: 14px 16px;
  font-family: var(--mono); font-size: 13px; line-height: 1.6;
  overflow-x: auto; color: var(--fg);
}
.codeblock .copy {
  cursor: pointer; padding: 2px 8px;
  border: 1px solid var(--rule); border-radius: 3px;
  background: transparent; color: var(--fg-dim);
  font-family: var(--mono); font-size: 11px;
}
.codeblock .copy:hover { color: var(--accent); border-color: var(--accent); }

/* Token colors — wire to your highlighter (Rouge, Prism, Shiki) */
.tok-kw  { color: oklch(0.78 0.13 30); }
.tok-fn  { color: oklch(0.82 0.14 82); }
.tok-str { color: oklch(0.78 0.12 150); }
.tok-com { color: var(--muted); font-style: italic; }
.tok-num { color: oklch(0.78 0.13 250); }
```

For Jekyll + Rouge: map your theme to these colors. Or use Shiki (with a custom
theme JSON) and point its tokens at the same OKLCH values.

---

## 9. Sticky TOC + reading progress

```html
<aside class="toc">
  <div class="toc-label">contents</div>
  <a href="#s1" class="active">The setup</a>
  <a href="#s2">What we measure</a>
  <a href="#s2a" class="lvl-3">Activations</a>
  <a href="#s2b" class="lvl-3">Probes</a>
  <a href="#s3">A working alternative</a>
  <hr class="hr-dashed">
  <div class="toc-label">progress</div>
  <div class="toc-progress"><div class="toc-progress-bar" style="width: 32%"></div></div>
  <div class="toc-progress-meta">32% · 6 of 18 min</div>
</aside>
```

```css
.toc {
  position: sticky; top: 96px;
  font-family: var(--mono); font-size: 11px;
  color: var(--muted); line-height: 1.8;
}
.toc-label {
  font-size: 10px; text-transform: uppercase; letter-spacing: 0.15em;
  color: var(--muted-2); margin-bottom: 10px;
  display: flex; align-items: center; gap: 8px;
}
.toc-label::before { content: ""; width: 14px; height: 1px; background: var(--rule); }
.toc a {
  display: block; padding-left: 10px;
  border-left: 1px solid var(--rule-soft);
  color: var(--fg-dim); transition: all .15s;
}
.toc a:hover { color: var(--fg); border-color: var(--rule); }
.toc a.active { color: var(--accent); border-left-color: var(--accent); }
.toc a.lvl-3 { padding-left: 22px; color: var(--muted); font-size: 10.5px; }

.toc-progress { height: 4px; background: var(--rule-soft); border-radius: 2px; }
.toc-progress-bar { height: 100%; background: var(--accent); border-radius: 2px; transition: width .2s; }
.toc-progress-meta { margin-top: 6px; font-size: 10px; }
```

Wire `width` to scroll position with a tiny JS handler.

---

## 10. Sidenote (Tufte-style)

```html
<aside class="sidenote">
  <div class="sidenote-num">1</div>
  See Anthropic's <em>monosemanticity</em> work for a related anxiety, framed differently.
</aside>
```

```css
.sidenote {
  font-family: var(--sans); font-size: 13px; line-height: 1.55;
  color: var(--fg-dim);
  border-left: 1px solid var(--accent);
  padding-left: 12px;
  margin-bottom: 20px;
}
.sidenote-num {
  font-family: var(--mono); font-size: 10px; color: var(--accent);
  margin-bottom: 4px;
}
```

For each footnote `[^1]` in your markdown, render a numbered `<sup>` inline
in the prose (color: `var(--accent)`) AND a sidenote in the right column.

---

## 11. Note card (garden, with growth stage)

```html
<a href="/note/slug" class="note-card">
  <header>
    <span class="note-stage">🌱</span>
    <span class="note-age">3d</span>
  </header>
  <h3>The threshold problem</h3>
  <p>Most interpretability claims live or die on a threshold parameter…</p>
  <footer>
    <span>↳ 4 links</span><span>read →</span>
  </footer>
</a>
```

```css
.note-card {
  display: block; break-inside: avoid;
  border: 1px solid var(--rule-soft); border-radius: 6px;
  padding: 16px 18px; margin-bottom: 16px;
  background: var(--bg-elev);
  transition: all .2s;
}
.note-card:hover { border-color: var(--accent); transform: translateY(-2px); }
.note-card header {
  display: flex; justify-content: space-between; align-items: center;
  margin-bottom: 10px;
}
.note-stage { font-size: 18px; }
.note-age { font-family: var(--mono); font-size: 10px; color: var(--muted); }
.note-card h3 {
  font-family: var(--serif); font-weight: 400;
  font-size: 19px; line-height: 1.25; margin: 0 0 8px;
}
.note-card p { font-size: 13px; color: var(--fg-dim); margin: 0; line-height: 1.5; }
.note-card footer {
  display: flex; justify-content: space-between;
  margin-top: 12px; padding-top: 10px;
  border-top: 1px dashed var(--rule);
  font-family: var(--mono); font-size: 10px; color: var(--muted);
}
```

Growth stages: 🌱 seedling · 🌿 budding · 🌳 evergreen. Stored as a single
front-matter field, e.g. `stage: budding`.

---

## 12. Book cover (programmatic)

```html
<div class="book-cover" style="--cover: oklch(0.65 0.12 80);">
  <div class="book-title">Patterns of Software</div>
  <div class="book-author">Richard Gabriel</div>
</div>
```

```css
.book-cover {
  width: 100%; aspect-ratio: 2/3; border-radius: 3px;
  background: linear-gradient(160deg, var(--cover), color-mix(in oklab, var(--cover) 60%, black));
  position: relative; overflow: hidden;
  box-shadow:
    0 4px 20px rgba(0,0,0,0.4),
    inset 0 0 0 1px rgba(255,255,255,0.06),
    inset 4px 0 0 rgba(0,0,0,0.2);
  padding: 14px 12px;
  display: flex; flex-direction: column; justify-content: space-between;
}
.book-title {
  font-family: var(--serif); font-size: 13px; line-height: 1.15;
  color: rgba(255,255,255,0.95); letter-spacing: -0.01em;
}
.book-author {
  font-family: var(--mono); font-size: 9px;
  color: rgba(255,255,255,0.7);
  text-transform: uppercase; letter-spacing: 0.1em;
}
```

Pick the cover OKLCH per book in front-matter (e.g. `cover_color: "0.65 0.12 80"`).

---

## 13. Footer

```html
<footer class="foot">
  <div>
    <div>deadsoftie · maintained since 2019 · last build 2026-04-28</div>
    <div class="foot-links">
      <a href="/feed.xml">RSS</a>
      <a href="https://github.com/halder">GitHub</a>
      <a>Mastodon</a>
      <a>arXiv</a>
      <a>Email</a>
    </div>
  </div>
  <pre class="ascii">   ___  ___ ___ ___  
  / _ \/ __| __|   \ 
 | (_) \__ \__|| |) |
  \___/|___/___|___/ </pre>
</footer>
```

```css
.foot {
  margin-top: 100px; padding: 40px 36px 50px;
  border-top: 1px solid var(--rule-soft);
  display: grid; grid-template-columns: 1fr auto; gap: 24px;
  font-family: var(--mono); font-size: 11px; color: var(--muted);
}
.foot a:hover { color: var(--accent); }
.foot-links { display: flex; gap: 18px; margin-top: 8px; }
.foot .ascii {
  white-space: pre; font-size: 10px;
  color: var(--rule); opacity: 0.7; line-height: 1.1; margin: 0;
}
```
