import gsap from 'gsap';
import { prefersReducedMotion } from '../../../shared/lib/motion';
import { LAYERS } from './layers';

export interface LayerState {
  slot: number; // stack slot, 0 = bottom .. LAYERS.length - 1 = top; the layer's y is slot * SEPARATION
  focus: number; // 0..1: 1 = full colour; 0 = receded. The scene passes it to handle.setFocus
}

// Plain state the scene reads on every render. GSAP tweens these values, never THREE objects.
export interface TeardownState {
  orbit: number; // radians, a slow gentle turn around the stack (0..ORBIT_SPAN)
  storm: number; // 0..1, scroll-driven; the scene maps it to a rain step and the particles
  layers: LayerState[];
}

export interface ChoreographyHooks {
  requestRender: () => void;
}

// World units between neighbouring slots. Small on purpose: the stack reads as one object taken
// apart, not as a tall tower. Relief stays below this, so a layer never pokes through the one above.
export const SEPARATION = 0.7;

// Total camera turn across the whole pinned timeline, in radians. Framing never changes otherwise.
export const ORBIT_SPAN = 0.25;

// Pinned timeline, in scroll time units. Every step takes one unit of scroll: the cover, then
// territory, access and risk. The storm ramps over the cover only, so it reaches its peak exactly
// when the territory step starts.
const STEP_SPAN = 1;
export const STORM_END = STEP_SPAN;
// A layer reaches its slot early in its step and holds there until the next step starts.
const EXPLODE = 0.35;
// Start of the finale: the cover plus one step per layer. The finale only brings the layers into
// full colour; the risk step stays on screen until the timeline ends, with no extra hold.
export const FINALE = STEP_SPAN * (LAYERS.length + 1);
export const TIMELINE_END = FINALE + EXPLODE;
// Step indices in the DOM: 0 is the cover, 1..n are the layers. n + 1 has no step element; the
// finale keeps the last layer's step on screen instead.
export const FINALE_STEP = LAYERS.length + 1;
// Scroll length of the pinned sequence, in viewport heights: 0.55 vh per timeline unit, the pace
// the sequence had before the closing hold was cut.
export const PIN_VH = 0.55 * TIMELINE_END;

// Focus of a layer that is not the active one. 0 is the receded level in the layers contract.
const RECEDE = 0;

// Slot of layer i when layer `active` is on top. The active layer takes the top slot; the other
// layers keep their fixed relative order (territory, access, risk, bottom to top) below it.
const slotFor = (active: number) => (i: number): number => {
  if (i === active) return LAYERS.length - 1;
  const below = LAYERS.map((_, k) => k).filter((k) => k !== active);
  return below.indexOf(i);
};

// Focus target per layer: the active one at 1, the others receded.
const focusFor = (active: number) => (i: number): number => (i === active ? 1 : RECEDE);

// Start of every layer state: the cover (territory on top) or the finale (risk on top, all in full
// colour). Reduced motion starts at the finale; the pinned and stacked paths start at the cover.
export function initialLayers(finale: boolean): LayerState[] {
  return LAYERS.map((_, k) =>
    finale
      ? { slot: slotFor(LAYERS.length - 1)(k), focus: 1 }
      : { slot: slotFor(0)(k), focus: focusFor(0)(k) },
  );
}

// Entry point. Motion allowed gets the pinned sequence (desktop and mobile); reduced motion does nothing.
export function mountChoreography(
  root: HTMLElement,
  state: TeardownState,
  hooks: ChoreographyHooks,
): () => void {
  const steps = [...root.querySelectorAll<HTMLElement>('[data-step]')];
  if (prefersReducedMotion() || steps.length === 0) return () => {};
  return mountPinnedSequence(root, steps, state, hooks);
}

// The pinned stage plays the storm and the layers, step by step, as the
// visitor scrolls. There are no manual controls; scroll is the only input.
function mountPinnedSequence(
  root: HTMLElement,
  steps: HTMLElement[],
  state: TeardownState,
  hooks: ChoreographyHooks,
): () => void {
  const pin = root.querySelector<HTMLElement>('[data-pin]');
  if (!pin) return () => {};

  const ctx = gsap.context(() => {
    gsap.set(steps, { autoAlpha: 0 });
    gsap.set(steps[0], { autoAlpha: 1 });

    const tl = gsap.timeline({
      defaults: { ease: 'power2.inOut' },
      onUpdate: hooks.requestRender,
      scrollTrigger: {
        trigger: root,
        start: 'top top',
        end: () => `+=${window.innerHeight * PIN_VH}`,
        pin,
        scrub: true,
        invalidateOnRefresh: true,
        // The pin's spacer must exist before any trigger below it is measured, so it refreshes first.
        id: 'teardown-pin',
        refreshPriority: 4,
        // Refresh runs on load, resize and remount. Jump to the trigger's current progress at once
        // so a restored scroll position shows its step without scrubbing in from step 0.
        onRefresh: (self) => {
          self.animation?.progress(self.progress, true);
          hooks.requestRender();
        },
      },
    });

    // The camera turns slowly over the whole timeline; the storm builds from the first moment.
    tl.to(state, { orbit: ORBIT_SPAN, duration: TIMELINE_END, ease: 'none' }, 0);
    tl.to(state, { storm: 1, duration: STORM_END, ease: 'power1.in' }, 0);
    // Each layer step lifts its layer to the top of the stack and recedes the other two below it.
    LAYERS.forEach((_, k) => {
      const start = STEP_SPAN * (k + 1);
      tl.to(state.layers, { slot: slotFor(k), focus: focusFor(k), duration: EXPLODE }, start);
    });
    // The finale keeps the risk layer on top and brings all three into full colour.
    tl.to(state.layers, { focus: 1, duration: EXPLODE }, FINALE);

    // Text shares the layers' playhead: the same scroll position renders the same crossfade
    // in either direction. Keep glyphs stationary instead of translating them through subpixels.
    const crossfade = 0.24;
    steps.slice(1).forEach((step, i) => {
      const at = STEP_SPAN * (i + 1) - crossfade / 2;
      const timing = { duration: crossfade, ease: 'none', immediateRender: false };
      tl.fromTo(steps[i], { autoAlpha: 1 }, { autoAlpha: 0, ...timing }, at);
      tl.fromTo(step, { autoAlpha: 0 }, { autoAlpha: 1, ...timing }, at);
    });
    tl.progress(tl.scrollTrigger?.progress ?? 0, true);
  }, root);

  return () => {
    ctx.revert();
  };
}
