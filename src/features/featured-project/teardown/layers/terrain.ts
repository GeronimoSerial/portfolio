import { sampleBilinear, type GeoData } from '../data';

// Vertical exaggeration of the relief: world height of heightmap 1.0 over a 10-unit plate.
// Modest on purpose, so the relief reads as terrain and not as a model of a mountain range.
// Kept below the layer separation: a lower layer's relief must never poke through the plate above.
export const RELIEF_HEIGHT = 0.45;

// World height of the terrain at plate coordinates (u, v). Water, roads and schools all sit on
// this, so every layer agrees on where the ground is.
export const terrainY = (data: GeoData, u: number, v: number): number =>
  sampleBilinear(data.heightmap, data.grid, u, v) * RELIEF_HEIGHT;
