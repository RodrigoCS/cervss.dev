# Components

- `.astro` components; type props with `interface Props` in the frontmatter.
- Scoped `<style>`; use tokens from `src/styles/global.css`, no hardcoded colours.
- Client JS goes in a `<script>` tag (bundled by Astro); no UI framework.

## data-testid checklist
- [ ] Root element of the component has one: `<component-name>` or `<component-name>-<id>`.
- [ ] Every link, button, input and dialog inside has one: `<component-name>-<element>`.
- [ ] Rendered in a list or more than once? Accept a `testid` prop or an `id` and suffix it.
- [ ] Ids come from content slugs, never display text or index.
