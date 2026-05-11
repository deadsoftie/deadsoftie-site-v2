# Content model

Front-matter shape for each content type. Use these field names directly in
Jekyll's `_essays/`, `_notes/`, etc.

## Essay

```yaml
---
layout: essay
title: "On the slow erosion of model interpretability"
date: 2026-04-22
updated: 2026-04-24
version: 3 # for the "v3 · last edited" meta
tags: [research, ml, interpretability]
summary: >
  After three months staring at attention heads in a 7B param model, I'm
  convinced the field has been measuring the wrong thing.
pinned: true # surfaces as "★ pinned" in the index
featured: true # eligible for the home featured 3-up
read_time: 18 # minutes; or compute from word count at build time
word_count: 5217
toc: true # generate TOC from H2/H3
---
```

## Note (garden entry)

```yaml
---
layout: note
title: "The threshold problem"
date: 2026-04-25
updated: 2026-04-25
stage: seedling # one of: seedling | budding | evergreen
tags: [interpretability, ml]
summary: "Most interpretability claims live or die on a threshold parameter."
links: # outbound notes/essays — used to compute backlinks
  - /essays/erosion-of-interpretability
  - /notes/linear-decodability
---
```

## Project

```yaml
---
layout: project
name: tinyrouter
year: 2026
status: active # active | maintained | archived
summary: >
  A 24M-param classifier that outperforms GPT-4 on multi-domain routing.
stack: [pytorch, candle, rust]
stars: "2.1k" # cached at build, or fetched live
url: https://github.com/halder/tinyrouter
featured: true
---
```

## Book

```yaml
---
layout: book
title: "Patterns of Software"
author: "Richard Gabriel"
year: 1996
status: finished # reading | finished | abandoned
rating: 5 # 1–5, or null while reading
finished: 2025-12-18
cover_color: "0.65 0.12 80" # OKLCH L C h triplet for programmatic cover
note: >
  Best book on software ergonomics I've ever read.
---
```

## /now

A single page rebuilt manually. Either Markdown with sections (writing,
building, reading, location, last_updated), or a tiny YAML data file at
`_data/now.yml` rendered into the home sidebar + a standalone /now page.

```yaml
# _data/now.yml
last_updated: 2026-04-26
writing: "An essay on what interpretability papers are actually claiming."
building: "tinyrouter — a 24M-param classifier that beats GPT-4 on routing."
reading: "Stiegler, Technics and Time, 1. Slowly."
location: "Lisbon, until June. Then Berlin."
```

---

## Computed at build time

| Field         | How                                                                            |
| ------------- | ------------------------------------------------------------------------------ |
| `read_time`   | `Math.ceil(word_count / 220)`                                                  |
| `word_count`  | Strip HTML, count words on rendered content                                    |
| `backlinks`   | For each note/essay, find pages whose `links:` includes this                   |
| `essays.json` | Build a flat JSON of {title, slug, date, tags, summary} for client-side search |

---

## Tag pages

Optional. `/tag/:tag` renders a filtered post-row list of all essays + notes
sharing that tag, ordered by date desc.
