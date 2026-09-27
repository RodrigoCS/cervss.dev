# Content

Schemas: [src/content.config.ts](../content.config.ts). `npm run build` fails on invalid entries — run it after editing.

## Add a post
Create `posts/<slug>.md`. The file name is the id, URL (`/blog/<slug>`) and testid suffix — kebab-case, never rename casually.

```md
---
title: Post title
description: One sentence, used on the canvas card and in meta tags.
date: 2026-09-27
tags: [optional]
draft: false        # true hides it from the canvas and routes
canvas: { x: 0, y: 0 }
---
```

## Add a media / embed / link node
Append to `nodes.yaml` with a unique kebab-case `id`:

```yaml
- id: my-project
  type: embed          # media | embed | link
  title: My Project
  url: https://example.com
  x: 800
  y: 300
```

- `media` needs `kind: image | video`, `src` (path under `public/` or absolute URL) and `alt`.
- `embed` must allow being framed (no `X-Frame-Options: DENY`); check before adding.

## Coordinates
World pixels at zoom 1, origin is the start view, `y` grows down, `x, y` is the node centre.
Leave space between neighbours; group related nodes into regions.
