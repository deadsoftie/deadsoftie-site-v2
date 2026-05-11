# deadsoftie — design handoff

A complete design specification for the deadsoftie blog redesign.
Build it yourself in any framework — Jekyll, Astro, Eleventy, Next, whatever.
Nothing here depends on the React prototype.

## What's in this bundle

```
handoff/
├── README.md              ← this file
├── design-tokens.md       ← all colors, type, spacing, radii
├── design-tokens.css      ← drop-in CSS custom properties
├── components.md          ← every component, with HTML + CSS
├── pages.md               ← page-level layouts (home, index, post, etc.)
├── content-model.md       ← what fields each content type needs
├── jekyll-notes.md        ← migration tips for your existing setup
└── reference/             ← the working prototype, for visual reference
    ├── deadsoftie redesign.html
    ├── styles.css
    ├── design-canvas.jsx
    ├── tweaks-panel.jsx
    ├── components/
    └── screens/
```

## Quick start (Jekyll)

1. Copy `design-tokens.css` into `_sass/_tokens.scss` (or import it from your main stylesheet).
2. Pull in the three Google Fonts in `_includes/head.html`:
   ```html
   <link
     href="https://fonts.googleapis.com/css2?family=Inter+Tight:wght@400;500;600;700&family=Newsreader:ital,opsz,wght@0,6..72,300..500;1,6..72,300..400&family=JetBrains+Mono:wght@400;500;600&display=swap"
     rel="stylesheet"
   />
   ```
3. Use `pages.md` to scaffold layouts under `_layouts/`.
4. Use `components.md` to build `_includes/` partials (post-row, feat-card, tag, chrome, footer).
5. Front-matter shape lives in `content-model.md`.

## The Switch color scheme — finalized values

| Token              | OKLCH                   | Approx hex |
| ------------------ | ----------------------- | ---------- |
| `--bg`             | `oklch(0.20 0.005 250)` | `#1d2025`  |
| `--bg-elev`        | `oklch(0.24 0.006 250)` | `#272a30`  |
| `--bg-deep`        | `oklch(0.16 0.005 250)` | `#15181c`  |
| `--fg`             | `oklch(0.96 0.005 250)` | `#f0f1f4`  |
| `--fg-dim`         | `oklch(0.80 0.008 250)` | `#bcc0c8`  |
| `--muted`          | `oklch(0.66 0.010 250)` | `#8e93a0`  |
| `--muted-2`        | `oklch(0.55 0.010 250)` | `#71768a`  |
| `--rule`           | `oklch(0.36 0.010 250)` | `#41454f`  |
| `--rule-soft`      | `oklch(0.30 0.008 250)` | `#363941`  |
| `--accent` (blue)  | `oklch(0.66 0.18 252)`  | `#3b82f6`  |
| `--accent-2` (red) | `oklch(0.62 0.20 25)`   | `#e84a3c`  |

Blue is primary (links, active states, primary CTAs, brand "d").
Red is secondary (pinned essays, abandoned book status, brand "s", warnings).

## Typography

- **Newsreader** — display + serif headlines + post titles
- **Inter Tight** — body, UI, navigation (500/600 weights)
- **JetBrains Mono** — dates, metadata, code, kbd hints

## License

Yours. The prototype was built for you — strip what you need.
