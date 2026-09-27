# Canvas engine

Architecture and glossary: [docs/ARCHITECTURE.md](../../docs/ARCHITECTURE.md#canvas-engine-srccanvas).

- Plain TypeScript, no framework, no dependency without a measured reason. Canvas 2D first.
- Small modules by responsibility: `camera`, `input`, `render`, `overlay`. Keep world↔screen math in `camera` only.
- Store and compute in **world** coordinates; convert to screen at draw time. Node `x, y` is the centre.
- Redraw only when state is dirty; never run an idle `requestAnimationFrame` loop.
- Cull nodes outside the viewport before drawing. Scale the backing store by `devicePixelRatio`.
- Iframes and `<video>` are DOM overlays, never drawn. Mount iframes lazily, unmount when far away.
- Canvas pixels can't carry testids, so each node must exist in the DOM with one:
  - fallback nav item: `data-testid="node-link-<id>"`
  - overlay: `data-testid="node-overlay-<id>"`
  - canvas element: `canvas-root`; serialised data: `canvas-data`
- Input via Pointer Events (not mouse/touch separately). Every pointer action has a keyboard equivalent.
- Respect `prefers-reduced-motion`: jump instead of animating.
