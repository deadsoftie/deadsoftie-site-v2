# Design tokens

Source of truth for the visual system. Use the `design-tokens.css` file directly,
or copy the values into your tool of choice.

## Color

### Surfaces

| Token         | Value                          | Use                                    |
|---------------|--------------------------------|----------------------------------------|
| `--bg`        | `oklch(0.20 0.005 250)`        | Page background (default)              |
| `--bg-elev`   | `oklch(0.24 0.006 250)`        | Cards, "now" sidebar, search input     |
| `--bg-deep`   | `oklch(0.16 0.005 250)`        | Code blocks, hero gradient floor       |

The base background is a warm-cool slate — never pure black. Stay above L=0.16
to keep visual texture.

### Text

| Token         | Value                          | Use                                    |
|---------------|--------------------------------|----------------------------------------|
| `--fg`        | `oklch(0.96 0.005 250)`        | Primary text, headlines                |
| `--fg-dim`    | `oklch(0.80 0.008 250)`        | Secondary text, lead paragraphs        |
| `--muted`     | `oklch(0.66 0.010 250)`        | Metadata, dates, tag labels            |
| `--muted-2`   | `oklch(0.55 0.010 250)`        | Section labels, eyebrows               |

All tokens here pass WCAG AA against `--bg`.

### Lines

| Token           | Value                        | Use                                  |
|-----------------|------------------------------|--------------------------------------|
| `--rule`        | `oklch(0.36 0.010 250)`      | Default borders, button outlines     |
| `--rule-soft`   | `oklch(0.30 0.008 250)`      | List separators, faint dividers      |

### Accents (Switch palette)

| Token             | Value                       | Use                                   |
|-------------------|-----------------------------|---------------------------------------|
| `--accent`        | `oklch(0.66 0.18 252)`      | Primary: links, active nav, "d" mark  |
| `--accent-glow`   | `oklch(0.66 0.18 252 / 0.18)` | Hover bg for tags, buttons, links   |
| `--accent-2`      | `oklch(0.62 0.20 25)`       | Counterpoint: pinned, abandoned, "s"  |
| `--accent-2-glow` | `oklch(0.62 0.20 25 / 0.18)` | Pinned-row gradient                  |

Blue carries 80% of accent work. Red shows up rhythmically — the right-half "s"
in the brand mark, the "★ pinned" tag on the essays index, abandoned book
status, and the right half of the hero animation.

### Semantic

| Token       | Value                       | Use                       |
|-------------|-----------------------------|---------------------------|
| `--ok`      | `oklch(0.78 0.12 150)`      | Status dot (live/active)  |

## Type

### Stacks

```css
--serif: "Newsreader", "Iowan Old Style", "Apple Garamond", Georgia, serif;
--sans:  "Inter Tight", "Inter", system-ui, -apple-system, "Segoe UI", sans-serif;
--mono:  "JetBrains Mono", ui-monospace, "SF Mono", Menlo, monospace;
```

### Scale

| Role               | Family    | Size     | Weight | Letter-spacing | Line-height |
|--------------------|-----------|----------|--------|----------------|-------------|
| Hero display       | Newsreader| 64–72px  | 400    | -0.025em       | 1.02        |
| Page H1            | Newsreader| 48px     | 400    | -0.02em        | 1.05        |
| Section H2         | Newsreader| 28px     | 400    | -0.015em       | 1.2         |
| Post title (list)  | Newsreader| 21px     | 400    | -0.01em        | 1.2         |
| Feat card title    | Newsreader| 26px     | 400    | -0.015em       | 1.15        |
| Body lead          | Inter Tight| 19px    | 400    | 0              | 1.7         |
| Body               | Inter Tight| 17px    | 400    | 0              | 1.7         |
| UI body            | Inter Tight| 14–15px | 400    | 0              | 1.55        |
| Meta / mono        | JetBrains | 11–12px  | 400    | 0              | 1.4         |
| Eyebrow            | JetBrains | 11px     | 400    | 0.12em         | 1.4         |

### Conventions

- Headlines and post titles always serif. Italic + accent color for emphasis.
- Numerals in section labels (`I.`, `II.`, `003`) are serif italic in `--accent`.
- All metadata (dates, tags, word counts, file paths) is mono in `--muted`.
- Eyebrows are uppercase mono with a 14px hairline rule before them — that
  rule is a `linear-gradient(90deg, var(--accent), var(--accent-2))` to seed
  the dual-accent system on every page.

## Spacing

8px base. Most spacing is one of: `8 / 12 / 16 / 20 / 24 / 36 / 56 / 80 / 100`.

| Token-ish    | Use                                       |
|--------------|-------------------------------------------|
| 36px         | Page horizontal gutter                    |
| 56px         | Page top padding (below sticky chrome)    |
| 60px         | Major vertical section breaks             |
| 100px        | Footer top margin                         |
| 1180px       | Max content width                         |
| 680px        | Max text-column width (essays, about)     |
| 640px        | Max reading width (post body)             |

## Radii

- `3px` — tags, chips, kbd hints
- `4px` — buttons, search input, code-block bar items
- `6px` — cards, hero canvas, codeblocks, "now" sidebar

## Borders

Always 1px. Always `--rule` or `--rule-soft`. Hover lifts to `--accent`.

Hairline rules separate post-rows. Avoid card-on-card; prefer hairlines + a
single elevated `--bg-elev` band where you need separation.

## Motion

| Property                          | Use                                       |
|-----------------------------------|-------------------------------------------|
| `transition: color .15s`          | Link / nav hover                          |
| `transition: all .15s`            | Tag, button hover                         |
| `transition: padding .2s`         | Post-row indent on hover                  |
| `transition: all .2s`             | Card lift (`translateY(-2px)`)            |
| `cubic-bezier(.2,.7,.3,1)`        | Drag/sort transitions (if you implement)  |

A few signature animations:
- **Status dot pulse** — 2s ease-in-out, opacity 1↔0.4
- **Hero particle decay** — see `reference/components/hero.jsx`. The word
  "deadsoftie" is rasterized to a 4px-grid sample, particles spring back to
  origin, mouse repels within 80px. Left half blue, right half red.
- **Caret blink** — 1s steps(2), for typewriter accents

Keep motion under 250ms unless it's the hero canvas. No bouncy easings.
