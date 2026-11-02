// Single source for motion policy: reduced-motion state, the mobile breakpoint, and tween tuning.
// Values mirror the constants that were previously scattered across the particle controller,
// the feature scripts and the scroll-driven scenes.

const REDUCED_QUERY = '(prefers-reduced-motion: reduce)';

// Live reduced-motion state. Reads query the media list on every call, so a change made after
// load (DevTools emulation, OS setting) is seen without a reload.
export const reduced = {
  get matches(): boolean {
    return window.matchMedia(REDUCED_QUERY).matches;
  },
  onChange(listener: (matches: boolean) => void): () => void {
    const mql = window.matchMedia(REDUCED_QUERY);
    const handler = (event: MediaQueryListEvent) => listener(event.matches);
    mql.addEventListener('change', handler);
    return () => mql.removeEventListener('change', handler);
  },
};

// Pins, Lenis and the particle triggers are built once per page load for one motion mode. A change
// after load (OS setting or DevTools emulation) therefore reloads once into the matching mode.
// Events that do not change the value are ignored, and rapid repeats collapse into one reload.
if (typeof window !== 'undefined') {
  const mql = window.matchMedia(REDUCED_QUERY);
  let last = mql.matches;
  let reloadTimer = 0;
  mql.addEventListener('change', (event) => {
    if (event.matches === last) return;
    last = event.matches;
    window.clearTimeout(reloadTimer);
    reloadTimer = window.setTimeout(() => location.reload(), 150);
  });
}

export const MOBILE_BREAKPOINT = 768;
export const MOBILE_QUERY = '(max-width: 767px)';

export const EASE = {
  reveal: 'power2.out',
  intro: 'power3.inOut',
  choreography: 'power2.inOut',
} as const;

export const DURATION = {
  reveal: 1.4,
  intro: 2.6,
} as const;
