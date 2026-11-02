import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { scrollToY } from './scroll';

// Share of a slot over which its figure morphs in. The particle controller's FIG_MORPH_SHARE
// (src/shared/particles/controller.ts) has the same value and is switched to this export in WU4.
export const MORPH_SHARE = 2 / 3;

export interface SlotState {
  // Slot whose copy is shown. It switches at the morph midpoint, when the figure is half formed.
  index: number;
  // Scroll position in slot units, 0 to slots.
  f: number;
  // 0 to 1 across the morph share of the current slot.
  morph: number;
  // 0 to 1 across the hold share after the morph.
  hold: number;
  // 0 to 1 across the exit range after the last slot.
  exit: number;
}

export interface SceneOptions {
  el: HTMLElement;
  slots: number;
  slotVh: number;
  exitVh?: number;
  id?: string;
  refreshPriority?: number;
  onSlot?: (index: number, state: SlotState) => void;
  onProgress?: (state: SlotState) => void;
  onToggle?: (active: boolean) => void;
}

export interface Scene {
  trigger: ScrollTrigger;
  slotAt: (progress: number) => SlotState;
  scrollToSlot: (index: number, at?: number) => void;
  destroy: () => void;
}

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

// Sticky scene driven by one ScrollTrigger. The scene height is set here, so CSS cannot drift from
// the slot math. Scroll distance is slots * slotVh + exitVh (vh), the height is 100svh more than that.
export function defineScene({
  el,
  slots,
  slotVh,
  exitVh = 0,
  id,
  refreshPriority,
  onSlot,
  onProgress,
  onToggle,
}: SceneOptions): Scene {
  if (slots < 1 || slotVh <= 0 || exitVh < 0) {
    throw new RangeError(`defineScene: invalid slots (${slots}), slotVh (${slotVh}) or exitVh (${exitVh})`);
  }

  const slotSpanVh = slots * slotVh;
  const totalVh = slotSpanVh + exitVh;
  const previousHeight = el.style.height;
  el.style.height = `calc(100svh + ${totalVh}vh)`;
  if (import.meta.env.DEV) assertSceneHeight(el, totalVh);

  const slotAt = (progress: number): SlotState => {
    const scrolledVh = clamp01(progress) * totalVh;
    const f = Math.min(slots, scrolledVh / slotVh);
    const i = Math.min(slots - 1, Math.floor(f));
    const local = f - i;
    return {
      index: Math.min(slots - 1, Math.max(0, Math.floor(f - MORPH_SHARE / 2))),
      f,
      morph: clamp01(local / MORPH_SHARE),
      hold: clamp01((local - MORPH_SHARE) / (1 - MORPH_SHARE)),
      exit: exitVh > 0 ? clamp01((scrolledVh - slotSpanVh) / exitVh) : 0,
    };
  };

  // Progress past the scene resolves to the last slot, before it to the first, so one path covers
  // load, refresh and jumps.
  let lastIndex = -1;
  const apply = (progress: number) => {
    const state = slotAt(progress);
    onProgress?.(state);
    if (state.index !== lastIndex) {
      lastIndex = state.index;
      onSlot?.(state.index, state);
    }
  };

  let active: boolean | undefined;
  const sync = (self: ScrollTrigger) => {
    // ScrollTrigger runs onUpdate before onToggle. Assign the scene first so an entry from
    // either direction renders its current figure instead of reusing the last one seen.
    if (self.isActive !== active) {
      active = self.isActive;
      onToggle?.(active);
    }
    apply(self.progress);
  };

  const trigger = ScrollTrigger.create({
    id,
    refreshPriority,
    trigger: el,
    start: 'top top',
    end: 'bottom bottom',
    onUpdate: sync,
    // Re-applies the current slot after every refresh, so a reload or a jump inside the scene shows
    // the right copy and figure at once instead of replaying from the first slot.
    onRefresh: sync,
  });
  sync(trigger);

  // Lands at `at` of the slot (0.85 by default): earlier, the figure still shows the previous slot.
  const scrollToSlot = (index: number, at = 0.85) => {
    const slot = Math.min(slots - 1, Math.max(0, index));
    const top = el.getBoundingClientRect().top + window.scrollY;
    scrollToY(top + ((slot + at) * slotVh * window.innerHeight) / 100);
  };

  const destroy = () => {
    trigger.kill();
    el.style.height = previousHeight;
  };

  return { trigger, slotAt, scrollToSlot, destroy };
}

const parseVh = (raw: string | undefined): number | null => {
  if (raw === undefined || raw.trim() === '') return null;
  const value = Number(raw);
  return Number.isFinite(value) ? value : null;
};

// Morph window of a marker, in vh from its top: data-morph-start and data-morph-end. Null when either is missing.
export function readMorphWindow(el: HTMLElement): { start: number; end: number } | null {
  const start = parseVh(el.dataset.morphStart);
  const end = parseVh(el.dataset.morphEnd);
  return start === null || end === null ? null : { start, end };
}

// DEV only: the rendered scene must be as tall as the same CSS expression measured on a probe.
function assertSceneHeight(el: HTMLElement, totalVh: number): void {
  const expression = `calc(100svh + ${totalVh}vh)`;
  const probe = document.createElement('div');
  probe.style.cssText = `position:fixed;visibility:hidden;pointer-events:none;height:${expression}`;
  document.body.append(probe);
  const expected = probe.getBoundingClientRect().height;
  probe.remove();
  const actual = el.getBoundingClientRect().height;
  if (Math.abs(actual - expected) > 1) {
    console.warn(`defineScene: height ${actual}px differs from ${expression} (${expected}px)`);
  }
}
