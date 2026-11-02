import gsap from 'gsap';
import type * as THREE from 'three';
import {
  clamp01,
  DISPERSE,
  frameFor,
  frameOf,
  lerpFrame,
  type DispersePose,
  type Pose,
  type ShapeKey,
  SHAPE_OF,
  shapeKeyOf,
  smoothstep,
  tierOf,
} from './poses';
import type { ParticleContext } from './state';
import type { Shape } from './shapes';

export function loadBuffer(attr: THREE.BufferAttribute, bright: THREE.BufferAttribute, shape: Shape) {
  (attr.array as Float32Array).set(shape.positions);
  (bright.array as Float32Array).set(shape.bright);
  attr.needsUpdate = true;
  bright.needsUpdate = true;
}

// Loads the two morph slots, reloading only the slot whose shape changed.
export function useSlots(ctx: ParticleContext, fromKey: ShapeKey, toKey: ShapeKey, fromShape: Shape, toShape: Shape) {
  const { attrs, loaded, uniforms } = ctx;
  if (!attrs) return;
  if (fromKey !== loaded.from) loadBuffer(attrs.from, attrs.fromBright, fromShape);
  if (toKey !== loaded.to) loadBuffer(attrs.to, attrs.toBright, toShape);
  loaded.from = fromKey;
  loaded.to = toKey;
  uniforms.uFromGlobe.value = fromKey === 'globe' ? 1 : 0;
  uniforms.uToGlobe.value = toKey === 'globe' ? 1 : 0;
  uniforms.uDisperse.value = 0; // only setDisperse sets it, after useSlots
}

// A shape disperses with the scroll (p 0 to 1): points leave downwind and fade out. Used for the Argentina map
// (into Featured) and the ICVM logo (over the title).
export function setDisperse(ctx: ParticleContext, pose: DispersePose, p: number) {
  const { attrs, shapes, uniforms, layout, view } = ctx;
  if (!attrs) return;
  const shape = shapes[SHAPE_OF[pose]];
  if (!shape) return;
  useSlots(ctx, SHAPE_OF[pose], SHAPE_OF[pose], shape, shape);
  uniforms.uProgress.value = 0;
  // The logo eases in and out; the map keeps its linear progress.
  const e = pose === 'icvm-logo' ? smoothstep(p) : p;
  uniforms.uDisperse.value = e;
  const d = DISPERSE[pose];
  const span = pose === 'argentina' ? layout.mapH : layout.logoH;
  uniforms.uWind.value.set(d.x, d.y).multiplyScalar(d.reach * span);
  Object.assign(view, { ...frameOf(pose, tierOf(), layout), opacity: 1 - e });
}

// Sets the visual state for the morph from pose a to pose b at progress p. Pure function of scroll.
export function setState(ctx: ParticleContext, a: Pose, b: Pose, p: number) {
  const { attrs, loaded, shapes, uniforms, layout, view, reduced } = ctx;
  if (!attrs) return;
  const fromKey = shapeKeyOf(a, b) ?? loaded.from ?? 'portrait';
  const toKey = shapeKeyOf(b, a) ?? loaded.to ?? fromKey;
  const fromShape = shapes[fromKey];
  const toShape = shapes[toKey];
  if (!fromShape || !toShape) return;
  useSlots(ctx, fromKey, toKey, fromShape, toShape);
  uniforms.uProgress.value = p;

  const t = tierOf();
  const vals = lerpFrame(frameFor(a, b, t, layout), frameFor(b, a, t, layout), p);
  if (reduced) gsap.set(view, vals);
  else Object.assign(view, vals);
}

// Every pair reads the same scroll clock, including the logo on a reverse handoff.
export function progressOf(ctx: ParticleContext, i: number): number {
  return clamp01(ctx.pairSt[i]?.progress ?? 0);
}
