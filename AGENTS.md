# cervss.dev

Personal portfolio, blog and router to other projects. The home page is an explorable pan/zoom
`<canvas>` whose nodes are blog posts, media, embedded projects (iframes) and links.
Static Astro site, TypeScript strict, no UI framework.

Read [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) before structural changes.

## Commands

| Command | Action |
| :-- | :-- |
| `npm install` | Install deps and the commit-msg hook (`prepare` sets `core.hooksPath`) |
| `astro dev --background` | Start the dev server (manage with `astro dev stop \| status \| logs`) |
| `npm run build` | Build to `./dist` — also validates content schemas |
| `npm run preview` | Serve the build |

## Rules

### data-testid on everything that matters
Every element that is interactive (links, buttons, inputs), a landmark (`header`, `nav`, `main`, `footer`,
dialogs), a canvas DOM overlay, or an item a test would need to find **must** have a `data-testid`.

- Format: kebab-case `<area>-<element>[-<id>]` — e.g. `canvas-root`, `node-overlay-hello-world`, `post-title`.
- `<id>` is the stable content id/slug. Never use display text or array index.
- Pixels drawn on the canvas cannot carry testids: every node must also exist in the DOM
  (overlay or accessible fallback nav) with a testid. See [src/canvas/AGENTS.md](src/canvas/AGENTS.md).
- Components forward a testid prop when rendered more than once on a page.

### Conventional Commits
`type(scope)!: subject` — enforced by [.githooks/commit-msg](.githooks/commit-msg).

- Types: `feat fix docs style refactor perf test build ci chore revert`.
- Scopes (optional): `canvas`, `content`, `layout`, `blog`, `deps`, or a component name.
- Subject: imperative, lowercase, no trailing period, header ≤ 100 chars. `!` marks a breaking change.
- One concern per commit.

### Styling
- Scoped `<style>` in each `.astro` file. Global CSS lives only in [src/styles/global.css](src/styles/global.css).
- Use the tokens (`--color-*`, `--space-*`, `--font-*`); add a token instead of hardcoding a repeated value.

### Dependencies
Prefer platform APIs and what Astro ships. A new dependency needs a stated reason in the commit body.

## Nested guides

| Path | Covers |
| :-- | :-- |
| [src/canvas/AGENTS.md](src/canvas/AGENTS.md) | Canvas engine: camera, input, rendering, DOM overlay |
| [src/content/AGENTS.md](src/content/AGENTS.md) | Adding posts and nodes, schema fields, coordinates |
| [src/components/AGENTS.md](src/components/AGENTS.md) | Component conventions and testid checklist |

Each nested `AGENTS.md` has a `CLAUDE.md` symlink beside it, like the root one.

## Astro documentation

Full documentation: https://docs.astro.build

Consult these guides before working on related tasks:

- [Adding pages, dynamic routes, or middleware](https://docs.astro.build/en/guides/routing/)
- [Working with Astro components](https://docs.astro.build/en/basics/astro-components/)
- [Using React, Vue, Svelte, or other framework components](https://docs.astro.build/en/guides/framework-components/)
- [Adding or managing content](https://docs.astro.build/en/guides/content-collections/)
- [Adding styles or using Tailwind](https://docs.astro.build/en/guides/styling/)
- [Supporting multiple languages](https://docs.astro.build/en/guides/internationalization/)
