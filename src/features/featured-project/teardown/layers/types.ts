import type * as THREE from 'three';
import type { GeoData } from '../data';
import type { Model, ModelResult } from '../model';

export type Role = 'base' | 'ink' | 'accent' | 'muted' | 'white';

export interface Palette {
  base: THREE.Color;
  ink: THREE.Color;
  accent: THREE.Color;
  muted: THREE.Color;
  white: THREE.Color;
  // Raw ink token, for canvas 2D drawing.
  cssInk: string;
}

// Scene state shared by every layer. The scene mutates one object; layers read it in tick().
export interface Env {
  storm: number; // 0..1, scroll-driven
  wet: number; // 0..1, ground wetness; lags the storm
  water: number; // 0..1, normalised water level from model.waterLevel(storm)
  time: number; // seconds
  lightning: number; // 0..1, soft cloud illumination; 0 when unused. Layers may ignore it.
}

export interface LayerContext {
  mobile: boolean;
  palette: Palette;
  env: Env;
}

export interface LayerHandle {
  group: THREE.Group;
  // Every material is tracked here. `userData.role` selects the palette colour; `userData.tone`
  // keeps that colour so setFocus can recede it without drifting.
  materials: THREE.Material[];
  paint(p: Palette): void;
  // 0..1: 1 = full colour; 0 = receded (about 36% brightness, desaturated). Called every render.
  setFocus(f: number): void;
  dispose(): void;
  // Called on every rain step change. Rewrites attributes, textures or uniforms; never rebuilds geometry.
  update?(r: ModelResult, rainIndex: number): void;
  // Called every render frame. Sets uniforms from the env only; no allocation.
  tick?(env: Env): void;
}

export type LayerBuilder = (data: GeoData, ctx: LayerContext, model: Model) => LayerHandle;
