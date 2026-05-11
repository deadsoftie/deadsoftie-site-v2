# Jekyll migration notes

You're moving from a vanilla Jekyll setup. Here's the minimum diff to get
the new design wired up while keeping markdown-first authoring.

## Recommended structure

```
_config.yml
_data/
  now.yml                    ← manual /now content
_includes/
  head.html                  ← font links + tokens
  chrome.html                ← top nav
  footer.html
  post-row.html              ← the hairline list item
  feat-card.html             ← featured 3-up card
  tag.html
  toc.html                   ← reading TOC
  sidenote.html
  note-card.html
  book-cover.html
_layouts/
  default.html               ← chrome + main + footer
  essay.html                 ← TOC + prose + sidenotes
  note.html                  ← single garden note + backlinks
  project.html
  book.html
  page.html                  ← static pages (about)
_sass/
  _tokens.scss               ← design-tokens.css
  _chrome.scss
  _post-row.scss
  _prose.scss
  _toc.scss
  _components.scss
assets/
  css/main.scss
_essays/                     ← collection
_notes/                       ← collection
_projects/                   ← collection
_books/                      ← collection
essays.html                  ← /essays index
notes.html                   ← /notes index
projects.html                ← /projects index
bookshelf.html               ← /bookshelf
about.md
now.md                       ← /now (full page)
index.html                   ← home
```

## `_config.yml` essentials

```yaml
permalink: /:collection/:slug

collections:
  essays: { output: true, permalink: /essays/:slug }
  notes: { output: true, permalink: /notes/:slug }
  projects: { output: true, permalink: /projects/:slug }
  books: { output: false } # rendered through bookshelf.html only

defaults:
  - scope: { path: "", type: "essays" }
    values: { layout: essay }
  - scope: { path: "", type: "notes" }
    values: { layout: note }

markdown: kramdown
kramdown:
  syntax_highlighter: rouge
  toc_levels: 2..3
  footnote_nr: 1
```

Footnotes via `[^1]` syntax map to your sidenote component if you write a
small Liquid filter or post-process the rendered HTML. Easiest path:

- Render with `kramdown` (footnotes become an `<ol class="footnotes">` at end)
- In `essay.html` layout, after rendering content, move each `<li id="fn:N">`
  into a sidenote slot in the right rail with JS, OR
- Use a kramdown extension / a Jekyll plugin that emits inline sidenotes
  directly. `jekyll-tufte-sidenotes` exists in the wild — vet before use.

## Reading time

```liquid
{% assign words = page.content | strip_html | number_of_words %}
{% assign minutes = words | divided_by: 220 | plus: 1 %}
{{ minutes }} min · {{ words }} words
```

## Search index

Generate `/essays.json` at build:

```liquid
---
layout: null
permalink: /essays.json
---
[
{% for e in site.essays %}
  {
    "title": {{ e.title | jsonify }},
    "url":   {{ e.url | jsonify }},
    "date":  {{ e.date | date: "%Y-%m-%d" | jsonify }},
    "tags":  {{ e.tags | jsonify }},
    "summary": {{ e.summary | jsonify }}
  }{% unless forloop.last %},{% endunless %}
{% endfor %}
]
```

Then in `essays.html`, fetch + filter client-side (a few lines of vanilla JS).

## Rouge → token colors

In `_sass/_prose.scss` (after importing tokens):

```scss
.highlight {
  .k,
  .kn,
  .kd,
  .kp,
  .kr,
  .kt {
    color: oklch(0.78 0.13 30);
  } /* keyword */
  .nf,
  .nx {
    color: oklch(0.82 0.14 82);
  } /* function */
  .s,
  .s1,
  .s2,
  .sb,
  .se {
    color: oklch(0.78 0.12 150);
  } /* string */
  .c,
  .c1,
  .cm {
    color: var(--muted);
    font-style: italic;
  } /* comment */
  .m,
  .mi,
  .mf {
    color: oklch(0.78 0.13 250);
  } /* number */
}
```

Wrap Rouge's output in your `.codeblock` shell with a small Liquid block so
you get the file-name bar + copy button:

```liquid
{% capture _code %}{% highlight python %}
def probe(model, layer):
    ...
{% endhighlight %}{% endcapture %}

<figure class="codeblock">
  <header class="codeblock-bar">
    <span>{{ include.file }}</span>
    <button class="copy" data-copy>copy</button>
  </header>
  {{ _code }}
</figure>
```

A 6-line copy-button JS:

```html
<script>
  document.querySelectorAll("[data-copy]").forEach((b) => {
    b.addEventListener("click", () => {
      const code = b.closest(".codeblock").querySelector("pre").innerText;
      navigator.clipboard.writeText(code);
      b.textContent = "copied";
      setTimeout(() => (b.textContent = "copy"), 1200);
    });
  });
</script>
```

## Hero animation

Optional — `reference/components/hero.jsx` is React but the algorithm is
~80 lines of vanilla JS. Translate it directly:

1. Rasterize "deadsoftie" into an offscreen canvas, sample to ~4px-grid points
2. Each frame: spring-back force + mouse-repel within 80px
3. Color: left half of word uses `--accent`, right half `--accent-2`,
   resolved via a probe `<div>` so it stays in sync with tokens
4. Mount on the home page only

You can defer this; the static hero looks fine on its own.

## Backlinks

In `note.html`:

```liquid
{% assign here = page.url %}
<aside class="backlinks">
  <h3>Mentioned in</h3>
  {% for n in site.notes %}
    {% if n.links contains here %}
      <a href="{{ n.url }}">{{ n.title }}</a>
    {% endif %}
  {% endfor %}
  {% for e in site.essays %}
    {% if e.links contains here %}
      <a href="{{ e.url }}">{{ e.title }}</a>
    {% endif %}
  {% endfor %}
</aside>
```

## Hosting

GitHub Pages still works fine, but you can also drop into Netlify / Cloudflare
Pages with a `_config.yml` and `Gemfile`. Build time stays fast.

## TODO order suggestion

1. Drop `design-tokens.css` + Google Fonts → entire site looks 60% closer
2. Build `_layouts/default.html` with chrome + footer
3. Convert one essay to the new `essay.html` layout (TOC, sidenotes, prose)
4. Build the essays index (post-row component)
5. Add /notes (collection + index)
6. Add /projects, /bookshelf
7. Polish home (featured + recent + /now sidebar)
8. Optional: hero animation, search, command palette
