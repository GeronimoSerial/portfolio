# Feature: Teardown structural refactor

## Objective
Restructure `src/features/featured-project/teardown/` so it is modular, de-duplicated and lifecycle-safe, with NO visual or behavioral change.

## Problem / why
Mapping (2026-11-02, Haiku read-only) found: `scene.ts` is a 501-line god file; hillshade, footprint and satellite textures are built 2-3x across layers; marker/rim constants are duplicated; hex colors are hardcoded in `ramps.ts`, `risk.ts`, `scene.ts` against the "tokens only" constraint; disposal and listener cleanup gaps. A clean base is required before the visual pass (lighting, fog, annotations).

## Scope
- In: `src/features/featured-project/**`. Pure refactor, same rendered output.
- Out: visual redesign, annotation UI, real-data bake, `bake.mjs` split, perf work on `extentField`/risk field (follow-up).

## Constraints
- Behavior-preserving. Do not fix the missing `[data-readout]` markup here (visual phase).
- Code, comments, identifiers in English.
- About 400 authored changed lines per task is a planning heuristic only, not a cap.
- TDD: off (source: no project/session config; no test runner). Checks: `pnpm check`, `pnpm build`, browser readback at the end.
- Delivery strategy: ask-on-risk.

## Tasks
- [x] R1 Shared resources: build hillshade, footprint and satellite once and share via `LayerContext`; extract duplicated marker/rim constants into one shared module. Route: delegated writer (2+ non-trivial files).
- [x] R2 Split `scene.ts` into focused modules (framing solver, readouts, atmosphere wiring, resize/theme/data-load); `scene.ts` stays a thin orchestrator. Route: delegated writer.
- [x] R3 Centralize palette: one module owns every hardcoded hex and the sRGB/linear conversions; layers consume it. Route: delegated writer.
- [x] R4 Lifecycle: dispose placeholder satellite always, remove media-query listener, avoid mounting before data resolves. Route: delegated writer.

- [x] R5 Scroll feel: replace the ScrollTrigger `pin` (JS fixed pin) in `choreography.ts` with a CSS `position: sticky` stage inside a tall wrapper, scrub the same timeline over the wrapper (`start: 'top top'`, `end: 'bottom bottom'`), as `@bsmnt/scrollytelling` does and as Stack/Projects already do. Keep GSAP and Lenis, no React. Route: delegated writer (`choreography.ts` + `FeaturedProject.astro` markup/CSS). Verify in browser with Lenis on, desktop and touch. Hypothesis, not yet proven to be the cause.

## Acceptance criteria
- `pnpm check` 0 errors; `pnpm build` passes.
- No duplicate `buildHillshade`/`footprintTexture`/satellite loads per mount.
- `scene.ts` under ~250 lines; no hex literals outside the palette module.
- Browser readback: section renders and scrolls as before, console clean.

## Progress / evidence
- Branch `refactor/teardown-structure` created from main 2026-11-02.
- R1 (2026-11-02, delegated Haiku writer, trigger: 2+ non-trivial files): `pnpm check` 0 errors, `pnpm build` Complete (parent re-ran both). Shared hillshade/footprint/satellite via `layers/shared.ts`; constants in `layers/markers.ts`. Not yet browser-verified (deferred to final readback). Build logs "file not created, response body was empty" for /proyectos and /en/projects routes: outside this feature, not confirmed pre-existing. Risk noted: satellite placeholder colour now white (never sampled while uHasSat=0).

- R2 (2026-11-02, delegated Haiku writer): `scene.ts` 507 -> 274 lines (target ~250 missed; palette and render loop kept in the orchestrator by brief). New `framing.ts`, `readouts.ts`, `atmosphere.ts`. Parent re-ran `pnpm check` (0 errors) and `pnpm build` (Complete). Browser readback still pending.
- R3 (2026-11-02, delegated Haiku writer): new `teardown/palette.ts` owns map colours + sRGB/linear helpers; parent re-ran `pnpm check` (0 errors) and `pnpm build` (Complete) and verified the access-layer hex values equal the old literals. Remaining hex-like literals are CSS selector and PRNG constants. GLSL luminance weights and a 0.16 water highlight stay in shaders. Browser readback pending.
- R4 (2026-11-02, delegated Haiku writer): one real fix in the `FeaturedProject.astro` client script (media-query listener removed, pending remount frame cancelled, cleanups run on non-bfcache `pagehide`); parent re-read the diff, re-ran `pnpm check` (0 errors) and `pnpm build` (Complete). Audit found no other leaks: data-load race already guarded by `disposed`, shared textures disposed once. Open, not changed: no `.catch` on the geo data load; extra fetch on remount (no promise cache); `renderer.dispose()` without `forceContextLoss()` on remount, not confirmed in a browser.
- R5 (2026-11-02, delegated Haiku writer): ScrollTrigger `pin` replaced by a CSS sticky stage in a tall track (`--pin-vh` from `PIN_VH`); `teardown-pin` id and `refreshPriority` dropped (no other references). Parent re-ran `pnpm check` (0 errors), `pnpm build` (Complete) and a browser readback on the dev server with Lenis on: desktop 1440x900: track 3877px vs 3878 expected, stage `top: 0` at every sampled progress (0 to 1), steps 0..3 advance in order, stage releases after the track; mobile 390x844 touch emulation: sticky, steps advance, stage 845px; reduced motion: `is-reduced`, stage static, all 4 steps visible, no console messages. Only console error: `/favicon.ico` 404 (unrelated). NOT measured: subjective smoothness on a real touch device, mobile URL-bar `svh` vs `innerHeight` end mismatch, remount on resize across 768px, scroll restore on reload.
- User request (2026-11-02): replace plain GSAP with `@bsmnt/scrollytelling` because it "works much better". Verified from the published package (0.3.3, `dist/index.mjs`): React-only (peer react>=18), a thin wrapper over the SAME GSAP ScrollTrigger with `scrub: true` default (same as ours), and its `Pin` is CSS `position: sticky` (spacer + sticky child), not a ScrollTrigger pin. Our teardown uses `scrollTrigger.pin` under Lenis. User decision: keep GSAP, no React. Likely cause of the worse feel: JS pin vs sticky. Captured as R5.

## Next step
All tasks done. User to judge scroll feel; remaining unmeasured items listed in R5 evidence. Follow-ups: visual pass, scrollytelling-style helper if desired.
