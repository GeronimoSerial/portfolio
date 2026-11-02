import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import { reduced } from './policy';

// Module evaluation runs once, so the plugin registers once.
gsap.registerPlugin(ScrollTrigger);

let lenis: Lenis | null = null;

// Dev-only probe for trigger order: [id or className, start, end] for every live ScrollTrigger.
function dumpTriggers(): [string, number, number][] {
  return ScrollTrigger.getAll().map((s) => [
    String(s.vars.id ?? s.trigger?.className ?? 'anonymous'),
    Math.round(s.start),
    Math.round(s.end),
  ]);
}

if (import.meta.env.DEV) {
  (window as Window & { __scroll?: unknown }).__scroll = {
    get lenis() {
      return lenis;
    },
    scrollToY,
    dump: dumpTriggers,
    refresh: () => ScrollTrigger.refresh(),
  };
}

export function initScroll(): Lenis | null {
  if (lenis) return lenis;
  if (reduced.matches) return null;

  // One scroll driver keeps touch, wheel and programmatic moves on the same animation clock.
  // normalizeScroll skips alternate touch moves on iOS, making slow drags visibly stop and start.
  const instance = new Lenis({
    autoRaf: false,
    syncTouch: true,
    touchMultiplier: 0.8,
    touchInertiaExponent: 1.6,
    syncTouchLerp: 0.1,
    allowNestedScroll: true,
    // Pinch zoom and panning a zoomed page belong to the browser.
    virtualScroll: ({ event }) =>
      !('touches' in event) || (event.touches.length < 2 && (window.visualViewport?.scale ?? 1) <= 1),
  });
  instance.on('scroll', ScrollTrigger.update);

  gsap.ticker.add((time) => {
    instance.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);

  lenis = instance;
  return lenis;
}

// Scrolls the page to an absolute Y. Goes through Lenis when it runs, so ScrollTrigger and the
// smooth-scroll state stay consistent; otherwise a native scroll (instant under reduced motion).
export function scrollToY(y: number, { immediate = false }: { immediate?: boolean } = {}): void {
  if (lenis) {
    lenis.scrollTo(y, { duration: 1.1, force: true, immediate });
    return;
  }
  window.scrollTo({ top: y, behavior: immediate || reduced.matches ? 'auto' : 'smooth' });
}
