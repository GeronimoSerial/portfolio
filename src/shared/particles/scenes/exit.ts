import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useSlots } from '../morph';
import { clamp01, figureFrame, ROCKET_KEY, tierOf } from '../poses';
import type { ParticleContext } from '../state';
import { topOf } from './story';

// Progress of the exit from the accordion scene: 0 when the next section's top reaches the view bottom (the scene
// has just ended) and 1 at the view top. Null above that, where the scroll morphs own the state. Without this the
// last passed morph is the usa marker's, which would bring the USA map back below the scene.
export function exitProgress(ctx: ParticleContext): number | null {
  if (!ctx.afterScene) return null;
  const vh = window.innerHeight;
  const gap = topOf(ctx.afterScene) - window.scrollY;
  return gap > vh ? null : clamp01(1 - gap / vh);
}

// The rocket's last frame, fading out with q across the exit. Uses the rocket's own slots, so no other pose shows.
export function setFigureExit(ctx: ParticleContext, q: number) {
  const { attrs, shapes, uniforms, state, view, layout } = ctx;
  if (!attrs) return;
  const shape = shapes[ROCKET_KEY];
  if (!shape) return;
  useSlots(ctx, ROCKET_KEY, ROCKET_KEY, shape, shape);
  uniforms.uProgress.value = 0;
  uniforms.uFlame.value = 1;
  uniforms.uFlicker.value = 1;
  state.ignitedAt = -1;
  state.spinTarget = 0;
  // The rocket keeps flying along its diagonal and leaves the view; it fades only near the end.
  const qq = clamp01(q * 1.6);
  const frame = figureFrame(ROCKET_KEY, shape, tierOf(), layout, 0, 1 + 3 * qq * qq);
  Object.assign(view, { ...frame, opacity: 1 - clamp01((qq - 0.6) / 0.4) });
}

// The rocket's fade-out is scrubbed by the scroll into the section after the accordion scene.
export function createExitTrigger(ctx: ParticleContext): ScrollTrigger[] {
  const afterScene = ctx.afterScene;
  if (!afterScene) return [];
  return [
    ScrollTrigger.create({
      id: 'icvm-exit',
      refreshPriority: 3,
      trigger: afterScene,
      start: () => topOf(afterScene) - window.innerHeight,
      end: () => topOf(afterScene),
      onUpdate: ctx.apply,
    }),
  ];
}
