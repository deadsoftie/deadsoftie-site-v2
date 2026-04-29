---
layout: default
title: Now
---

<div class="container" style="padding-top: 56px; padding-bottom: 80px; max-width: 680px;">
  <div class="eyebrow" style="margin-bottom: 14px;">now · {{ site.data.now.last_updated | date: "%B %-d, %Y" }}</div>
  <h1 class="h-display" style="font-size: 56px; margin: 0 0 36px;">/now</h1>

  <div class="prose">

**Writing:** {{ site.data.now.writing }}

**Building:** {{ site.data.now.building }}

**Reading:** {{ site.data.now.reading }}

**Location:** {{ site.data.now.location }}

  </div>

  <div style="margin-top: 48px; font-family: var(--mono); font-size: 11px; color: var(--muted);">
    Last updated {{ site.data.now.last_updated | date: "%B %-d, %Y" }}. Inspired by <a href="https://nownownow.com/about" target="_blank" rel="noopener" style="color: var(--accent);">nownownow.com</a>.
  </div>
</div>
