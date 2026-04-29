---
title: "Your essay title here"
date: YYYY-MM-DD
updated: YYYY-MM-DD        # optional: date of last significant edit
version: 1                 # increment with each major revision
tags: [tag1, tag2]         # lowercase, no spaces
summary: >
  A one-to-two sentence description shown in index lists and meta tags.
  Keep it under 160 characters for SEO.
pinned: false              # true → ★ pinned badge in essays index
featured: false            # true → eligible for home page 3-up grid
read_time: 10              # minutes; omit to auto-calculate from word count
toc: true                  # generate table of contents from H2/H3
links:                     # other essays/notes this references (for backlinks)
  - /notes/some-note-slug
  - /essays/other-essay-slug
---

Your first paragraph here. It renders slightly larger (19px) as the lead.

## Section heading

Body text. Links, **bold**, *italic*, `inline code` all work as standard Markdown.

> Blockquotes render with a blue left border in serif italic.

### Subsection

Add footnotes with `[^1]` syntax — they become sidenotes in the right rail on
desktop.

```python
# Code blocks get a header bar with a copy button
def example():
    return "hello"
```

[^1]: Your footnote text here.
