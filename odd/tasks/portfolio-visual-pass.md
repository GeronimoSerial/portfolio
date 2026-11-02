# Feature: Portfolio visual pass (teardown look, globe ring, architecture words, section transitions)

## Objective
Raise the visual quality of four areas the user rejected or asked for on 2026-11-02, keeping GSAP + Lenis and the "still stage" taste (sticky stages, scroll moves only what changes).

## Problem / why
- Teardown (featured project) still looks bad: camera was too low ("acostado", ELEVATION 0.52), rain dominates, layers muddy. Must stay sticky (it is: measured `top: 0` across the whole track).
- Reference ingrassiadaniel.it: a particle sphere with an SVG `textPath` ring ("Available everywhere") that rotates continuously (~10 deg/s measured, time-based, not scroll-driven). Ours: globe does not rotate (`turnOut: 0`, `poses.ts:146`, `controller.ts:180`) and the title is plain text.
- Projects section (Architecture / Edge / Security / Data): words are static ("Nothing moves on scroll", `Projects.astro:4-6`), the word AI is never rendered (`work.ai.title` exists in `ui.ts:34,130` but is unused; mask is `ARCHITECTURE|EDGE|SECURITY|DATA`), section is only 130svh.
- Transition friction at that section: hard cuts from flat `--bg` to an opaque video with a 45% black veil (`Projects.astro:75,89`) and back to `--bg` (Stack, transparent); words are `#fff` + `mix-blend-mode: difference` (not token-bound); video does not follow `data-theme`.

## Scope
- In: `src/features/featured-project/teardown/**` (look), `src/features/hero/Globe.astro` + `src/shared/particles/**` (globe spin + ring), `src/features/projects/Projects.astro` + `src/i18n/ui.ts` (words), boundary CSS between FeaturedProject / Experience / Projects / Stack.
- Out: new data bake, case-study page, other sections.

## Constraints
- Keep GSAP + Lenis, no React. Sticky stages, no JS pins.
- Colours from CSS tokens (`--bg`, `--ink`); respect `data-theme` and reduced motion; mobile < 768 must still work.
- Code, comments, UI copy in English (i18n keys keep es/en parity).
- TDD: off (source: no project/session config; no test runner). Checks: `pnpm check`, `pnpm build`, browser readback on the dev server (desktop 1440x900, mobile 390x844, reduced motion).
- Delivery: work on branch `refactor/teardown-structure` (not pushed). Strategy ask-on-risk.

## Tasks
- [x] V1 Teardown look: camera elevation 0.52 -> 1.15 (trial applied, readback good); tame rain/cloud dominance, lift layer contrast. Route: inline (parent, iterating with screenshots).
- [ ] V2 Globe: continuous spin of the particle globe + rotating SVG textPath ring ("Available everywhere" and a second phrase) in sync, reduced-motion static. Route: delegated writer (particles + Globe.astro).
- [ ] V3 Projects words: render AI, words converge from outside to inside on scroll (scrubbed), much longer sticky hold so the section lasts longer; reduced-motion static. Route: delegated writer.
- [ ] V4 Transitions: remove the colour friction around the Projects section (token-based gradient edges, veil from tokens, words colour from tokens, theme-aware). Route: same writer as V3 (same files).

## Acceptance criteria
- `pnpm check` 0 errors, `pnpm build` passes.
- Browser readback: teardown readable and top-down, still sticky; globe + ring rotate; Projects shows 5 words converging, hold length visibly longer; no hard colour cut at the section edges in dark and light; console clean (favicon 404 excepted).

## Progress / evidence
- 2026-11-02: reference measured (ring rotation ~10 deg/s, `textPath` in an SVG `ring`); our code mapped by a Haiku read-only pass (cites above). V1 ELEVATION 1.15 applied, uncommitted; screenshot shows map readable from above.

- V1 (2026-11-02, inline): `ELEVATION` 0.52 -> 1.15 (`framing.ts`), rain opacity x0.5 (`RAIN_GAIN` in `weather.ts`), receded layer gain 0.40 -> 0.58 and dark recede 0.36 -> 0.52 (`layers/base.ts`), canvas darken 0.18 -> 0.08 (`atmosphere.ts`). `pnpm check` 0 errors. Dev-server readback at 1440x900 (cover step: real satellite terrain readable from above; access step: roads and schools clear, rain subtle), `pinTop: 0` still sticky. Not re-checked: mobile and light theme with the new values; `pnpm build` not re-run for V1 alone (a writer is editing other files).
- V3+V4 delegated to a Haiku writer (disjoint files: Projects.astro, ui.ts, boundary CSS).

## Next step
V3+V4 result, then V2.
