import gsap from 'gsap';
import { MORPH_SHARE } from '../../motion/scene';
import { useSlots } from '../morph';
import {
  clamp01,
  figureFrame,
  FIG_TURN,
  frameOf,
  lerpFrame,
  ROCKET,
  ROCKET_KEY,
  tierOf,
  type ShapeKey,
} from '../poses';
import { FIGURE_NAMES } from '../shapes';
import type { ParticleContext } from '../state';

// Accordion figure at scroll progress p (0 to 1 across the pinned scene). Slot i shows figure i; its first
// MORPH_SHARE of scroll morphs from the previous figure (slot 0 from the usa map), then it holds.
export function setFigureState(ctx: ParticleContext, p: number) {
  const { attrs, shapes, uniforms, state, view, layout, reduced } = ctx;
  if (!attrs) return;
  const f = clamp01(p) * FIGURE_NAMES.length;
  const i = Math.min(FIGURE_NAMES.length - 1, Math.floor(f));
  const t = clamp01((f - i) / MORPH_SHARE);
  const toKey = FIGURE_NAMES[i];
  const fromKey: ShapeKey = i === 0 ? 'usa' : FIGURE_NAMES[i - 1];
  const toShape = shapes[toKey];
  const fromShape = shapes[fromKey];
  if (!toShape || !fromShape) return;
  useSlots(ctx, fromKey, toKey, fromShape, toShape);
  uniforms.uProgress.value = t;
  // Hold share of the slot: 0 when the morph ends, 1 at the slot end.
  const h = clamp01((f - i - MORPH_SHARE) / (1 - MORPH_SHARE));
  const rocket = toKey === ROCKET_KEY;
  const ignite = rocket ? clamp01(h / ROCKET.ignite) : 0;
  const flame = 1 - (1 - ignite) * (1 - ignite); // quick ease-out ignition
  if (flame > 0 && state.ignitedAt < 0) state.ignitedAt = uniforms.uTime.value;
  if (flame === 0) state.ignitedAt = -1;
  uniforms.uFlame.value = flame;
  uniforms.uFlicker.value = 1;
  const tier = tierOf();
  const fromFrame = i === 0 ? frameOf('usa', tier, layout) : figureFrame(fromKey, fromShape, tier, layout, FIG_TURN);
  const yaw = (f - i - 0.5) * 2 * FIG_TURN;
  // The rocket straightens as its flame ignites, then travels up its nose axis with an ease-in.
  const turn = rocket ? yaw * (1 - ignite) : yaw;
  const vals = lerpFrame(fromFrame, figureFrame(toKey, toShape, tier, layout, turn, h * h), t);
  state.spinTarget = 0;
  if (reduced) gsap.set(view, vals);
  else Object.assign(view, vals);
}

// Reduced motion: the figure snaps to item i with no morph. names is the scene's figure list.
export function setFigureIndex(ctx: ParticleContext, i: number, names: readonly ShapeKey[] = FIGURE_NAMES) {
  const { attrs, shapes, uniforms, state, view, layout } = ctx;
  if (!attrs) return;
  const key = names[i];
  const shape = shapes[key];
  if (!shape) return;
  useSlots(ctx, key, key, shape, shape);
  uniforms.uProgress.value = 0;
  uniforms.uFlow.value = 0;
  state.spinTarget = 0;
  // Reduced motion: the rocket's flame is lit and still, and the rocket holds at the centre of its travel.
  uniforms.uFlame.value = key === ROCKET_KEY ? 0.6 : 0;
  uniforms.uFlicker.value = 0;
  state.ignitedAt = -1;
  gsap.set(view, figureFrame(key, shape, tierOf(), layout, 0, key === ROCKET_KEY ? 0.5 : 0));
}

// Hands control back to the scroll logic, which re-derives the state from the scroll positions.
export function leaveFigure(ctx: ParticleContext) {
  ctx.state.figureMode = false;
  ctx.uniforms.uFlame.value = 0;
  ctx.uniforms.uFlicker.value = 1;
  ctx.state.ignitedAt = -1;
  ctx.apply();
}

export interface FigureDetail {
  active?: boolean;
  progress?: number;
  index?: number;
}

// A pinned scene drives the figure: { progress } scrubs it across the scene, { index } snaps it (reduced motion),
// and { active: false } hands control back to the scroll morphs.
export function handleFigure(ctx: ParticleContext, d: FigureDetail) {
  const { state } = ctx;
  if (d.active === false) {
    leaveFigure(ctx);
    return;
  }
  state.figureMode = true;
  if (typeof d.index === 'number') {
    const index = d.index;
    state.figureRedraw = () => setFigureIndex(ctx, index, FIGURE_NAMES);
  } else if (typeof d.progress === 'number') {
    const progress = d.progress;
    state.figureRedraw = () => setFigureState(ctx, progress);
  }
  state.figureRedraw();
}
