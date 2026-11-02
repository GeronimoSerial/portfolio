import type * as THREE from 'three';
import type { ScrollTrigger } from 'gsap/ScrollTrigger';
import type { ParticleUniforms } from './material';
import type { Frame, Layout, Pose, ShapeKey } from './poses';
import type { Shape } from './shapes';

// Scroll-locked sections, in DOM order. Each carries its pose and, when present, its text block.
export interface Section {
  pose: Pose;
  el: HTMLElement;
  text: HTMLElement | null;
}

export interface MorphAttrs {
  from: THREE.BufferAttribute;
  to: THREE.BufferAttribute;
  fromBright: THREE.BufferAttribute;
  toBright: THREE.BufferAttribute;
}

// Mutable controller state that used to live in closure variables.
export interface ParticleState {
  // While the accordion block is on screen, the scroll morphs pause and the open item's figure shows.
  figureMode: boolean;
  figureRedraw: () => void;
  mobile: boolean;
  reducedIndex: number;
  disposed: boolean;
}

// Everything the scenes read and write, passed around instead of being captured by one closure.
export interface ParticleContext {
  reduced: boolean;
  uniforms: ParticleUniforms;
  layout: Layout;
  view: Frame;
  shapes: Partial<Record<ShapeKey, Shape>>;
  attrs: MorphAttrs | null;
  loaded: { from: ShapeKey | null; to: ShapeKey | null };
  state: ParticleState;
  sections: Section[];
  // pairSt[i] scrubs the morph from sections[i] to sections[i + 1]; it lives on the NEXT section.
  pairSt: ScrollTrigger[];
  arcSt: ScrollTrigger | null;
  logoIdx: number;
  argIdx: number;
  // The ICVM scene ends at its last marker; the section after it is the one the accordion scene leads into.
  afterScene: HTMLElement | null;
  icvmText: HTMLElement | null;
  icvmLines: HTMLElement[];
  // Per-line reveal ceiling from the CSS `--reveal-max` custom property, read on refresh (1 when unset).
  icvmMax: number[];
  // Re-derives the whole visual state from the scroll positions.
  apply: () => void;
}
