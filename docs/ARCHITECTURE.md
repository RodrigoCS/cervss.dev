# Architecture

## Overview

cervss.dev is a statically generated Astro site. Instead of a scrolling page, the home route is a
**world** you explore by panning and zooming a `<canvas>`. Things placed in that world are **nodes**:
blog posts, images and videos, live embeds of other projects, and outbound links.

```
/               canvas explorer (all nodes)
/blog/[slug]    real page per post — deep links, SEO, works without JS
```

Every node is reachable without the canvas: posts have their own route, and the canvas page ships an
accessible fallback list of all nodes. The canvas is an enhancement, never the only way in.

## Glossary

| Term | Meaning |
| :-- | :-- |
| **World** | The unbounded 2D plane nodes live on. Units are CSS pixels at zoom 1. |
| **Camera** | `{ x, y, zoom }` — the world point at the viewport centre and the scale factor. |
| **Node** | Anything placed in the world. Has an `id`, a `type`, a position and optional size. |
| **Overlay** | A real DOM element kept aligned with a node's on-screen rect (iframes, video, focus UI). |
| **Fallback nav** | Visually hidden `<nav>` listing every node as a link — keyboard, screen readers, SEO, tests. |

## Node types

Defined as Zod schemas in [src/content.config.ts](../src/content.config.ts) — that file is the source of truth.

| `type` | Source | Specific fields | Rendered as |
| :-- | :-- | :-- | :-- |
| `post` | `src/content/posts/*.md` (frontmatter `canvas: {x, y, w?, h?}`) | `title, description, date, tags, draft` | Card on canvas → opens `/blog/[slug]` |
| `media` | `src/content/nodes.yaml` | `kind: image \| video, src, alt` | Image drawn on canvas; video as overlay |
| `embed` | `src/content/nodes.yaml` | `url` | Thumbnail on canvas; live `<iframe>` overlay when focused/near |
| `link` | `src/content/nodes.yaml` | `url, description?` | Card on canvas → opens `url` in a new tab |

Shared fields: `id` (kebab-case slug; the post's file name for posts), `title`, `x`, `y`, `w?`, `h?`.

## Coordinates

- Origin `(0, 0)` is where the camera starts; the "hello" post sits there.
- `x` grows right, `y` grows down (same as the DOM). `x, y` is the node's **centre**.
- `w`/`h` default per type in the renderer; set them only to override.
- screen = (world − camera) × zoom + viewport / 2, and the inverse for pointer input.

## Canvas engine (`src/canvas/`)

Plain TypeScript modules loaded by an Astro `<script>` on the index page. No UI framework.

- **camera** — camera state, world↔screen transforms, clamped zoom, animated fly-to a node.
- **input** — Pointer Events (drag to pan, pinch), wheel (zoom around cursor), keyboard (arrows, `+`/`-`, Tab through nodes).
- **render** — draws visible nodes only (cull by viewport), redraws on `requestAnimationFrame` **only when dirty**,
  scales the backing store by `devicePixelRatio`.
- **overlay** — positions DOM elements over nodes with `transform: translate() scale()` from the same camera;
  mounts iframes lazily when a node is focused/near, unmounts when far.

Rendering starts with **Canvas 2D** (zero dependencies). Move to WebGL (e.g. PixiJS) only when node count or
effects measurably need it; the camera/overlay contract stays the same.

**URL state:** the focused node lives in the hash (`/#node=hello-world`) so views are shareable and the back
button works.

**Data flow:** at build time the index page reads both collections with `getCollection`, merges them into one
`Node[]`, and serialises it into the page (`<script type="application/json" data-testid="canvas-data">`).
The engine reads that JSON on load — no runtime fetches.

## Directory layout

```
.githooks/           commit-msg hook (Conventional Commits)
docs/                architecture and design notes
public/              static files served as-is (favicons, media referenced by nodes)
src/
  canvas/            canvas engine modules (camera, input, render, overlay)
  components/        .astro components
  content/
    posts/           blog posts (Markdown)
    nodes.yaml       media / embed / link nodes
  content.config.ts  collection schemas = node definitions
  layouts/           page shells
  pages/             routes
  styles/global.css  design tokens and resets
```

## Conventions

- **data-testid** on every interactive element, landmark, overlay and fallback item — see [AGENTS.md](../AGENTS.md#rules).
- **Conventional Commits**, enforced locally by `.githooks/commit-msg`.
- **Styling:** scoped component CSS + tokens from `global.css`; respect `prefers-color-scheme` and `prefers-reduced-motion`
  (disable fly-to animation and inertia).
- **Accessibility:** canvas has `aria-label`; all content reachable via the fallback nav; visible focus on overlays.
- **Embeds:** `<iframe>` gets `title`, `loading="lazy"`, and a `sandbox` as tight as the embedded project allows.
