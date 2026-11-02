import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { setDisperse, setState, progressOf } from '../morph';
import { clamp01, isDispersePose } from '../poses';
import { ARC_REVEAL_END } from '../arc';
import type { ParticleContext } from '../state';

// A section's arrival morph starts when its top is this many vh below the viewport top (70% of the view)
// and ends when its top reaches the viewport top, so the canvas moves while the boundary passes.
// A marker can set its own window with data-morph-start / data-morph-end, in vh from its top.
const MORPH_LEAD_VH = 70;
// The ICVM arc draws over the first ARC_DRAW_VH of its pinned scene.
const ARC_DRAW_VH = 70;

export const vhPx = (v: number) => (window.innerHeight * v) / 100;
export const topOf = (el: HTMLElement) => el.getBoundingClientRect().top + window.scrollY;

// Scroll window of the morph into a section: by default the boundary pass, from 70vh below the view top
// to the view top. A marker with data-morph-start / data-morph-end sets its own window, in vh from its top.
function morphRange(el: HTMLElement): { start: () => number; end: () => number } {
  const from = Number(el.dataset.morphStart);
  const to = Number(el.dataset.morphEnd);
  if (Number.isFinite(from) && Number.isFinite(to)) {
    return { start: () => topOf(el) + vhPx(from), end: () => topOf(el) + vhPx(to) };
  }
  return { start: () => topOf(el) - vhPx(MORPH_LEAD_VH), end: () => topOf(el) };
}

// Sets the state for the scroll pair i at progress p. A dispersing pose fading into 'none' disperses instead.
function setPair(ctx: ParticleContext, i: number, p: number) {
  const a = ctx.sections[i].pose;
  const b = ctx.sections[i + 1].pose;
  if (isDispersePose(a) && b === 'none') setDisperse(ctx, a, p);
  else setState(ctx, a, b, p);
}

// A pair between two 'none' sections has no visual change; it is skipped so the state from the last real pair holds.
function isNoopPair(ctx: ParticleContext, i: number): boolean {
  return ctx.sections[i].pose === 'none' && ctx.sections[i + 1].pose === 'none';
}

export function setScrollState(ctx: ParticleContext) {
  const { sections, pairSt } = ctx;
  let active = -1;
  let passed = -1;
  pairSt.forEach((_, i) => {
    if (isNoopPair(ctx, i)) return;
    const p = progressOf(ctx, i);
    if (p > 0 && p < 1) active = i;
    if (p >= 1) passed = i;
  });
  if (active >= 0) setPair(ctx, active, progressOf(ctx, active));
  else if (passed >= 0) setPair(ctx, passed, 1);
  else if (sections.length > 1) setState(ctx, sections[0].pose, sections[1].pose, 0);
  else setState(ctx, sections[0].pose, sections[0].pose, 1);
}

// One scrubbed trigger per pair of consecutive sections; it lives on the incoming section.
export function createPairTriggers(ctx: ParticleContext): ScrollTrigger[] {
  return ctx.sections.slice(1).map((s, i) => {
    const range = morphRange(s.el);
    const st = ScrollTrigger.create({
      id: `icvm-pair-${i}`,
      refreshPriority: 3,
      trigger: s.el,
      start: range.start,
      end: range.end,
      onUpdate: ctx.apply,
    });
    ctx.pairSt.push(st);
    return st;
  });
}

// Scrubs the ICVM arc's draw progress; null when the page has no arc marker.
export function createArcTrigger(ctx: ParticleContext): ScrollTrigger[] {
  const arcEl = document.querySelector<HTMLElement>('[data-particles-arc]');
  if (!arcEl) return [];
  // The arc draws from the globe marker's morph start, so it begins once the logo has dispersed.
  const arcFrom = Number.isFinite(Number(arcEl.dataset.morphStart)) ? Number(arcEl.dataset.morphStart) : 0;
  const arcSt = ScrollTrigger.create({
    id: 'icvm-arc',
    refreshPriority: 3,
    start: () => topOf(arcEl) + vhPx(arcFrom),
    end: () => topOf(arcEl) + vhPx(arcFrom + ARC_DRAW_VH),
    onUpdate: ctx.apply,
  });
  ctx.arcSt = arcSt;
  return [arcSt];
}

export function arcReveal(ctx: ParticleContext): number {
  return ctx.arcSt ? ARC_REVEAL_END * clamp01(ctx.arcSt.progress) : 0;
}

// Reduced motion: no scrub. Each section snaps to its final pose when it enters.
export function createReducedTriggers(ctx: ParticleContext): ScrollTrigger[] {
  const { sections, argIdx, logoIdx, state, view } = ctx;
  const triggers: ScrollTrigger[] = [];
  sections.forEach((s, i) => {
    // The dispersal marker and the Featured section after it fade with the scroll instead of snapping.
    if (argIdx >= 0 && i > argIdx && i <= argIdx + 2) return;
    if (logoIdx >= 0 && i <= logoIdx + 1) return; // the logo is skipped (never shown); the globe snaps in after it
    triggers.push(
      ScrollTrigger.create({
        trigger: s.el,
        start: 'top 60%',
        end: 'bottom 40%',
        onToggle: (self) => {
          if (!self.isActive) return;
          state.reducedIndex = i;
          if (ctx.attrs) setState(ctx, s.pose, s.pose, 1);
        },
      }),
    );
  });
  // Reduced motion: the map's dispersal becomes a plain opacity fade across the same scroll window.
  if (argIdx >= 0 && sections[argIdx + 1]) {
    const fade = sections[argIdx + 1].el;
    const range = morphRange(fade);
    triggers.push(
      ScrollTrigger.create({
        trigger: fade,
        start: range.start,
        end: range.end,
        onUpdate: (self) => {
          view.opacity = 1 - self.progress;
        },
        onLeave: () => {
          view.opacity = 0;
        },
        onLeaveBack: () => {
          view.opacity = 1;
        },
      }),
    );
  }
  return triggers;
}
