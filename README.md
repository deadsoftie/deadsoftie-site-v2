# deadsoftie-site-v2

Personal site built with Jekyll, hosted on GitHub Pages.

## Requirements

- Ruby (3.x recommended)
- Bundler (`gem install bundler`)

## Setup

```sh
bundle install
```

## Run locally

```sh
bundle exec jekyll serve
```

Opens at `http://localhost:4000`. Live-reloads on file changes.

## Build

```sh
bundle exec jekyll build
```

Output goes to `_site/`. GitHub Actions handles this automatically on push to `main`.
