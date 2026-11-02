import { FLOOD_LEVEL, sampleBilinear, type GeoData, type IndicatorKey } from './data';

// Rain steps in mm/h that the scroll-driven storm walks through. The top step is the normalisation scale.
export const RAIN_STEPS: readonly number[] = [10, 20, 40, 60, 80, 100];
// Index of the default step: 60 mm/h, a strong storm. Lower than the 80 mm/h first
// considered: with the placeholder scatter, 80 mm/h cannot keep the default share
// at 15-30% while the top step reaches 45-60% (the 80 -> 100 step is too small).
export const DEFAULT_RAIN_INDEX = 3;
const RAIN_MAX = RAIN_STEPS[RAIN_STEPS.length - 1];

// A school is exposed when its exposure is at or above this value (0..1).
export const EXPOSED_THRESHOLD = 0.5;

// Single exposure function, used for schools and for the risk surface alike:
//
//   rain      = precip(u, v) * RAIN_STEPS[i] / RAIN_MAX          (0..1)
//   hazard    = flood(u, v)                                       (0..1)
//   access    = clamp01(1 - roadDistance / ACCESS_RANGE)          (1 near a road, 0 isolated)
//   exposure  = clamp01(rain^0.8 * (0.55 * hazard + 0.45 * (1 - access)) * GAIN)
//
// Monotonic non-decreasing in rain, so a stronger storm never removes an exposed school.
// GAIN is tuned against the placeholder scatter; replace it with the real bake calibration.
const GAIN = 2.5;
const RAIN_EXPONENT = 0.8;
const ISOLATED_BELOW = 0.35; // access below this counts as isolated
const ACCESS_RANGE = 0.12; // plate units; roads closer than this still help access
const ACCESS_GRID = 96;

export interface SchoolExposure {
  exposure: number; // 0..1, the single f() above
  hazard: number; // flood field at the school, 0..1
  access: number; // 1 near a road, 0 isolated
  rain: number; // local rain, normalised 0..1
  exposed: boolean; // exposure >= EXPOSED_THRESHOLD
}

export interface IndicatorValue {
  key: IndicatorKey;
  value: number; // 0..1, derived from the schools at the current step
}

export interface ModelResult {
  rainMmH: number; // selected step
  rainNorm: number; // rainMmH / RAIN_MAX
  schools: SchoolExposure[];
  exposedCount: number;
  total: number;
  peakMmH: number; // highest local rate in the precipitation field at this step
  indicators: IndicatorValue[];
}

export interface Model {
  readonly data: GeoData;
  evaluate(rainIndex: number): ModelResult; // cached per index
  // Per-cell field for the risk surface: the same f() as for schools, at plate coords.
  exposureAt(u: number, v: number, rainIndex: number): number;
  hazardAt(u: number, v: number): number;
  // JRC flood extent at plate coords (0..1). The simulated water is masked to it, so it never
  // shows where this is 0. Samples the placeholder flood field until the real mask is baked.
  floodMaskAt(u: number, v: number): number;
  accessAt(u: number, v: number): number;
  rainAt(u: number, v: number, rainIndex: number): number;
  // Simulated water surface height for a storm (0..1), in heightmap units. See waterLevel below.
  waterLevel(storm: number): number;
}

// Highest simulated water surface, in heightmap units (0..1 of the relief range). It is a
// visual stand-in for flood progression, not the JRC model: the rise is masked to floodMaskAt.
export const WATER_MAX = 0.35;

// Monotonic non-decreasing in storm, 0 at a calm sky and WATER_MAX at a full storm. The
// smoothstep keeps the early rain from flooding anything, so the water starts at the low spots.
export function waterLevel(storm: number): number {
  const t = Math.min(1, Math.max(0, (storm - 0.2) / 0.8));
  return WATER_MAX * t * t * (3 - 2 * t);
}

const clamp01 = (v: number): number => Math.min(1, Math.max(0, v));

const clampIndex = (i: number): number =>
  Math.min(RAIN_STEPS.length - 1, Math.max(0, Math.round(i)));

// The scroll-driven storm (0..1) mapped to a rain step. The only place storm becomes an index.
export const rainIndexForStorm = (storm: number): number =>
  clampIndex(Math.min(1, Math.max(0, storm)) * (RAIN_STEPS.length - 1));

const exposureOf = (rain: number, hazard: number, access: number): number =>
  clamp01(Math.pow(rain, RAIN_EXPONENT) * (0.55 * hazard + 0.45 * (1 - access)) * GAIN);

// Access depends only on the roads, so it is computed once per model. A road farther than ACCESS_RANGE
// contributes 0, so each cell only tests the segments in the buckets around it. The segments are bucketed
// once; the result equals the brute-force nearest distance, at a fraction of its cost. Measured in Node on
// the baked Corrientes roads (8.7k polylines, 20k segments): about 0.17 s, against about 3.8 s for the scan.
const BUCKET_SIZE = 0.04; // plate units

function buildAccessGrid(roads: GeoData['roads']): Float32Array {
  const n = ACCESS_GRID;
  const out = new Float32Array(n * n);

  // Flat segment store: start u, start v, end u, end v.
  let count = 0;
  for (const line of roads) count += Math.max(0, line.length - 1);
  const seg = new Float64Array(count * 4);
  let s = 0;
  for (const line of roads) {
    for (let k = 0; k + 1 < line.length; k++, s++) {
      seg[s * 4] = line[k][0];
      seg[s * 4 + 1] = line[k][1];
      seg[s * 4 + 2] = line[k + 1][0];
      seg[s * 4 + 3] = line[k + 1][1];
    }
  }

  // Each segment is listed in every bucket its bounding box touches.
  const cells = Math.ceil(1 / BUCKET_SIZE) + 1;
  const cellOf = (p: number): number => Math.min(cells - 1, Math.max(0, Math.floor(p / BUCKET_SIZE)));
  const buckets: number[][] = Array.from({ length: cells * cells }, () => []);
  for (let k = 0; k < count; k++) {
    const b = k * 4;
    const i0 = cellOf(Math.min(seg[b], seg[b + 2]));
    const i1 = cellOf(Math.max(seg[b], seg[b + 2]));
    const j0 = cellOf(Math.min(seg[b + 1], seg[b + 3]));
    const j1 = cellOf(Math.max(seg[b + 1], seg[b + 3]));
    for (let j = j0; j <= j1; j++) for (let i = i0; i <= i1; i++) buckets[j * cells + i].push(k);
  }

  // A segment within ACCESS_RANGE of a point overlaps a bucket within this many cells of the point's bucket.
  const reach = Math.ceil(ACCESS_RANGE / BUCKET_SIZE);
  for (let j = 0; j < n; j++) {
    for (let i = 0; i < n; i++) {
      const u = i / (n - 1);
      const v = j / (n - 1);
      const ci = cellOf(u);
      const cj = cellOf(v);
      let best = Infinity;
      for (let nj = Math.max(0, cj - reach); nj <= Math.min(cells - 1, cj + reach); nj++) {
        for (let ni = Math.max(0, ci - reach); ni <= Math.min(cells - 1, ci + reach); ni++) {
          for (const k of buckets[nj * cells + ni]) {
            const b = k * 4;
            const dx = seg[b + 2] - seg[b];
            const dy = seg[b + 3] - seg[b + 1];
            const len2 = dx * dx + dy * dy;
            const t = len2 === 0 ? 0 : Math.min(1, Math.max(0, ((u - seg[b]) * dx + (v - seg[b + 1]) * dy) / len2));
            const ex = u - (seg[b] + dx * t);
            const ey = v - (seg[b + 1] + dy * t);
            const d2 = ex * ex + ey * ey;
            if (d2 < best) best = d2;
          }
        }
      }
      out[j * n + i] = clamp01(1 - Math.sqrt(best) / ACCESS_RANGE);
    }
  }
  return out;
}

export function createModel(data: GeoData): Model {
  const access = buildAccessGrid(data.roads);
  let peakPrecip = 0;
  for (const p of data.precipitation) peakPrecip = Math.max(peakPrecip, p);
  const cache = new Map<number, ModelResult>();

  const hazardAt = (u: number, v: number): number => sampleBilinear(data.flood, data.grid, u, v);
  const floodMaskAt = hazardAt;
  const accessAt = (u: number, v: number): number => sampleBilinear(access, ACCESS_GRID, u, v);
  const rainAt = (u: number, v: number, rainIndex: number): number =>
    (sampleBilinear(data.precipitation, data.precipGrid, u, v) *
      RAIN_STEPS[clampIndex(rainIndex)]) /
    RAIN_MAX;
  const exposureAt = (u: number, v: number, rainIndex: number): number =>
    exposureOf(rainAt(u, v, rainIndex), hazardAt(u, v), accessAt(u, v));

  function evaluate(rainIndex: number): ModelResult {
    const i = clampIndex(rainIndex);
    const hit = cache.get(i);
    if (hit) return hit;

    const schools: SchoolExposure[] = data.schools.map((s) => {
      const hazard = hazardAt(s.x, s.y);
      const acc = accessAt(s.x, s.y);
      const rain = rainAt(s.x, s.y, i);
      const exposure = exposureOf(rain, hazard, acc);
      return { exposure, hazard, access: acc, rain, exposed: exposure >= EXPOSED_THRESHOLD };
    });

    const total = schools.length;
    const share = (pred: (s: SchoolExposure) => boolean): number =>
      total === 0 ? 0 : schools.filter(pred).length / total;
    const mean = (pick: (s: SchoolExposure) => number): number =>
      total === 0 ? 0 : schools.reduce((sum, s) => sum + pick(s), 0) / total;

    const exposedCount = schools.filter((s) => s.exposed).length;
    const indicators: IndicatorValue[] = [
      { key: 'pedagogical', value: 1 - share((s) => s.exposed) },
      { key: 'rain', value: schools.reduce((m, s) => Math.max(m, s.rain), 0) },
      { key: 'risk', value: mean((s) => s.exposure) },
      { key: 'isolation', value: share((s) => s.access < ISOLATED_BELOW) },
      { key: 'access', value: 1 - mean((s) => s.access) },
      { key: 'flood', value: share((s) => s.hazard >= FLOOD_LEVEL) },
    ];

    const result: ModelResult = {
      rainMmH: RAIN_STEPS[i],
      rainNorm: RAIN_STEPS[i] / RAIN_MAX,
      schools,
      exposedCount,
      total,
      peakMmH: peakPrecip * RAIN_STEPS[i],
      indicators,
    };
    cache.set(i, result);
    return result;
  }

  return {
    data,
    evaluate,
    exposureAt,
    hazardAt,
    floodMaskAt,
    accessAt,
    rainAt,
    waterLevel,
  };
}

// Steps whose numbers the page shows: the cover (live storm) and the layer and finale steps (peak).
export type ReadoutStep = 'cover' | 'territory' | 'access' | 'risk' | 'finale';

// Index of the peak storm step: the numbers of every layer step and of the finale.
const PEAK_INDEX = RAIN_STEPS.length - 1;

// The single source of every number written to the page. Only the cover follows the live storm;
// the layer and finale steps always show the peak, so their numbers do not depend on scroll timing
// or on the viewport. Pure: the same model and arguments always give the same result.
export function readoutFor(model: Model, step: ReadoutStep, stormIndex: number): ModelResult {
  return model.evaluate(step === 'cover' ? clampIndex(stormIndex) : PEAK_INDEX);
}
