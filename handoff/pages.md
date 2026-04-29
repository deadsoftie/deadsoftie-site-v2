# Page layouts

Each page describes structure, grid, and which components to compose.
Build them as Jekyll layouts (`_layouts/*.html`) or your framework's equivalent.

## Global

- `<Chrome>` at the top of every page (sticky)
- `<Footer>` at the bottom of every page
- Max content width 1180px; gutters 36px

---

## 1. Home (`/`)

```
┌─────────────────────────────────────────────────────────────┐
│ chrome (sticky)                                             │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   eyebrow: research log · est. 2019                         │
│   ┌─────────────────────────────┐ ┌────────────────────┐    │
│   │ Hero serif headline         │ │  /now sidebar      │    │
│   │ (with blue + red emphasis)  │ │  (live status,     │    │
│   │                             │ │   writing/building │    │
│   │ Lead paragraph              │ │   /reading/loc)    │    │
│   │                             │ │                    │    │
│   │ [primary] [rss] [⌘ K]      │ │  see /now →        │    │
│   └─────────────────────────────┘ └────────────────────┘    │
│                                                             │
│   ┌─────────────────────────────────────────────────────┐   │
│   │ Hero canvas (animated "deadsoftie" particles)       │   │
│   └─────────────────────────────────────────────────────┘   │
│                                                             │
│   003 · Featured                       see all 47 →         │
│   ┌──────────┐ ┌──────────┐ ┌──────────┐                    │
│   │ feat I   │ │ feat II  │ │ feat III │                    │
│   └──────────┘ └──────────┘ └──────────┘                    │
│                                                             │
│   004 · Recent                          5 of 47             │
│   ─── post-row ───                                          │
│   ─── post-row ───                                          │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│ footer                                                      │
└─────────────────────────────────────────────────────────────┘
```

Grid: `1fr 320px` (60px gap) for hero+now. Featured is 3-up. Recent shows 5
post-rows then a "see all" link.

---

## 2. Essays index (`/essays`)

```
┌─────────────────────────────────────────────────────────────┐
│ chrome                                                      │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   eyebrow: section · 002                                    │
│   ⁴⁷ Essays                       [/ search 47 essays… esc] │
│   description                                               │
│                                                             │
│   [all] [#research] [#ml] [#tools] [#writing] [#unix] …     │
│   ─────────────────────────────────────────────────────     │
│   15 matching                  newest · longest · shortest  │
│   ─────────────────────────────────────────────────────     │
│                                                             │
│   ²⁰²⁶  10 essays                                           │
│   ─── post-row ───                                          │
│   ─── post-row [pinned, accent-2 gradient] ───              │
│   ─── post-row ───                                          │
│                                                             │
│   ²⁰²⁵  5 essays                                            │
│   ─── post-row ───                                          │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

Grouped by year. The year is a 64px serif numeral in `oklch(0.50)` on the left
of each group. Tag bar + sort row are sticky-friendly. Search filters live
client-side over a generated `/essays.json` index.

---

## 3. Single essay (`/essays/:slug`)

```
┌─────────────────────────────────────────────────────────────┐
│ chrome                                                      │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│ ┌──────────┐ ┌────────────────────────────┐ ┌─────────────┐│
│ │ TOC      │ │ ← essays                   │ │  notes      ││
│ │ contents │ │ eyebrow: essay · no. 042   │ │  [1] sidenote│
│ │ ─ The…   │ │                            │ │  [2] sidenote│
│ │ ─ What…  │ │ # Headline (serif 48px)    │ │              ││
│ │   Activ. │ │ 22 apr 2026 · 18 min · 5k  │ │  ─── ─── ── ││
│ │   Probes │ │ #research #ml              │ │  backlinks   ││
│ │ ─ A wor… │ │                            │ │  ─ Note title││
│ │          │ │ Body prose (17px / 1.7,    │ │  ─ Essay…   ││
│ │ progress │ │ max 640px)                 │ │              ││
│ │ ▰▰▱▱▱ 32%│ │                            │ │              ││
│ └──────────┘ │ blockquote · code · figs   │ └─────────────┘│
│              │                            │                │
│              │ ── prev / next ──          │                │
│              └────────────────────────────┘                │
├─────────────────────────────────────────────────────────────┤
│ footer                                                      │
└─────────────────────────────────────────────────────────────┘
```

Grid: `200px 1fr 220px` with 60px gaps.

- **TOC** auto-generated from H2/H3 headings; reading-progress bar updates on
  scroll
- **Body** max 640px text column. Prose styles in `prose` md doc (below).
- **Right rail** holds Tufte-style sidenotes (one per footnote) + backlinks
  to other essays/notes that mention this one
- After the article: dashed rule, prev/next 2-up cards

---

## 4. Notes / garden (`/notes`)

```
┌─────────────────────────────────────────────────────────────┐
│ chrome                                                      │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   eyebrow: section · 003                                    │
│   ¹³² Notes                       ┌────────────────┐        │
│   description                     │ legend         │        │
│                                   │ 🌱 seedling    │        │
│                                   │ 🌿 budding     │        │
│                                   │ 🌳 evergreen   │        │
│                                   └────────────────┘        │
│                                                             │
│   ┌──────┐ ┌──────┐ ┌──────┐                                │
│   │ note │ │ note │ │ note │   ← CSS columns (3-up)         │
│   │      │ │      │ │      │     break-inside: avoid        │
│   └──────┘ └──────┘ └──────┘                                │
│   ┌──────┐ ┌──────┐ ┌──────┐                                │
│   │ note │ │ note │ │ note │                                │
│   └──────┘ └──────┘ └──────┘                                │
└─────────────────────────────────────────────────────────────┘
```

Use `column-count: 3; column-gap: 16px;` on the container. Each note-card has
`break-inside: avoid;`. Sort by `updated` desc.

---

## 5. Projects (`/projects`)

```
┌─────────────────────────────────────────────────────────────┐
│ chrome                                                      │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   eyebrow: section · 004                                    │
│   ⁴ Projects                                                │
│   description                                               │
│                                                             │
│   ─────────────────────────────────────────────────────     │
│   tinyrouter         | description text +    | ★ 2.1k      │
│   2026 · ● active    | tags                  | github.com/…│
│   ─────────────────────────────────────────────────────     │
│   deadnotes          | …                     | …            │
│   ─────────────────────────────────────────────────────     │
└─────────────────────────────────────────────────────────────┘
```

Grid: `200px 1fr 200px`. Hover indents. Status colors:
- `active` → `--ok`
- `maintained` → `--accent`
- `archived` → `--muted`

---

## 6. Bookshelf (`/bookshelf`)

```
┌─────────────────────────────────────────────────────────────┐
│ chrome                                                      │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   eyebrow: section · 005                                    │
│   Bookshelf                                                 │
│   description                                               │
│                                                             │
│   i. Currently reading                                      │
│   ┌──┐ ┌──┐ ┌──┐ ┌──┐ ┌──┐ ┌──┐                             │
│   │📕│ │📗│ │📘│ │📙│ │📓│ │📔│  ← 6-up cover grid           │
│   └──┘ └──┘ └──┘ └──┘ └──┘ └──┘                             │
│                                                             │
│   ii. Recently finished                                     │
│   ─────────────────────────────────────────────────────     │
│   📕 | Title              | ★★★★★ | finished                │
│      | author · year      |       |                         │
│      | "private note…"    |       |                         │
│   ─────────────────────────────────────────────────────     │
└─────────────────────────────────────────────────────────────┘
```

Currently-reading: `repeat(6, 1fr)` cover grid.
Finished: `60px 1fr 80px 80px` row layout with mini cover + note. Abandoned
status renders in `--accent-2`.

---

## 7. About (`/about`)

```
┌─────────────────────────────────────────────────────────────┐
│ chrome                                                      │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   eyebrow: section · 006                                    │
│   About                                                     │
│   ┌─────────────────────────────────┐ ┌────────────────┐    │
│   │ Prose:                          │ │  portrait      │    │
│   │  - intro                        │ │                │    │
│   │  - what's here                  │ │  elsewhere     │    │
│   │  - how to reach me              │ │  ─ github      │    │
│   │  - colophon                     │ │  ─ arxiv       │    │
│   └─────────────────────────────────┘ │  ─ scholar     │    │
│                                       │  ─ mastodon    │    │
│                                       │  ─ email       │    │
│                                       └────────────────┘    │
└─────────────────────────────────────────────────────────────┘
```

Grid: `1fr 280px`. Portrait is a square `1:1` placeholder until you drop
a real photo in.

---

## Prose styles (post body)

```css
.prose { font-size: 17px; line-height: 1.7; color: var(--fg); max-width: 640px; }
.prose p { margin: 0 0 1.2em; }
.prose p:first-child { font-size: 19px; }      /* lead */
.prose h2 {
  font-family: var(--serif); font-weight: 400; font-size: 28px;
  letter-spacing: -0.015em; margin: 2.2em 0 0.6em;
}
.prose h3 {
  font-family: var(--serif); font-weight: 400; font-size: 22px;
  margin: 1.6em 0 0.4em;
}
.prose a {
  color: var(--accent);
  border-bottom: 1px solid color-mix(in oklab, var(--accent) 40%, transparent);
}
.prose a:hover { background: var(--accent-glow); }
.prose blockquote {
  margin: 1.4em 0; padding-left: 18px;
  border-left: 2px solid var(--accent);
  font-family: var(--serif); font-style: italic;
  color: var(--fg-dim); font-size: 19px;
}
.prose code {
  font-family: var(--mono); font-size: 0.86em;
  background: var(--bg-elev); border: 1px solid var(--rule-soft);
  border-radius: 3px; padding: 1px 5px;
}
.prose figure { margin: 1.8em 0; }
.prose figcaption {
  font-family: var(--mono); font-size: 11px;
  color: var(--muted); margin-top: 8px;
  text-transform: uppercase; letter-spacing: 0.08em;
}
```
