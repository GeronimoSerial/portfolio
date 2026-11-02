import { createPlaceholderData } from './placeholder';
import { composeGeo, decodeReal, type RealManifest } from './decode';

export const PLATE_SIZE = 10;

// Hazard value at which a cell counts as flooded (the 0.5 contour of `flood`).
export const FLOOD_LEVEL = 0.5;

export const INDICATOR_KEYS = ['pedagogical', 'rain', 'risk', 'isolation', 'access', 'flood'] as const;
export type IndicatorKey = (typeof INDICATOR_KEYS)[number];

// A school is a point in plate coordinates. Its exposure is derived by the model,
// never stored here, so the data layer carries no pre-computed risk.
export interface School {
  x: number;
  y: number;
}

export type PlaceKind = 'city' | 'town' | 'village';

// A named settlement in plate coordinates, from OSM place nodes.
export interface Place {
  name: string;
  x: number;
  y: number;
  kind: PlaceKind;
}

/**
 * Scene input. Grids are row-major: index = row * size + col, where row follows
 * plate z (v) and col follows plate x (u). Plate coordinates are in [0, 1]; the
 * world position is x = (u - 0.5) * PLATE_SIZE, and z likewise.
 */
export interface GeoData {
  isPlaceholder: boolean;
  grid: number;
  heightmap: Float32Array; // 0..1, grid x grid
  precipitation: Float32Array; // 0..1, precipGrid x precipGrid
  precipGrid: number;
  flood: Float32Array; // 0..1 hazard, grid x grid
  roads: Array<Array<[number, number]>>; // polylines in plate coordinates
  schools: School[]; // OSM schools when baked, example values otherwise
  // Optional province outline, plate coords [0, 1], y down. Layers clip their surfaces to it.
  footprint?: Array<[number, number]>;
  // Optional real-data extras. The placeholder leaves them all unset.
  hillshadeUrl?: string; // pre-rendered hillshade, plate-aligned; generated from the heightmap when absent
  satelliteUrl?: string; // Sentinel-2 true colour WebP with alpha = province mask, plate-aligned; absent = no imagery
  floodMaskUrl?: string; // JRC flood extent (red channel = hazard); the flood field is used when absent
  elevationRangeM?: [number, number]; // metres spanned by heightmap 0..1; informational only
  roadClasses?: number[]; // parallel to `roads`: 0 national, 1 provincial, 2 tertiary, 3 minor; default 1
  hospitals?: School[]; // OSM hospitals when baked; absent on the placeholder
  places?: Place[]; // OSM settlements when baked; absent on the placeholder
}

export interface LoadOptions {
  mobile: boolean;
}

export const toWorld = (u: number): number => (u - 0.5) * PLATE_SIZE;
export const toPlate = (world: number): number => world / PLATE_SIZE + 0.5;

// Bilinear sample of an n x n row-major field at plate coordinates (u = col, v = row).
export function sampleBilinear(field: Float32Array, n: number, u: number, v: number): number {
  const x = Math.min(Math.max(u, 0), 1) * (n - 1);
  const y = Math.min(Math.max(v, 0), 1) * (n - 1);
  const x0 = Math.floor(x);
  const y0 = Math.floor(y);
  const x1 = Math.min(x0 + 1, n - 1);
  const y1 = Math.min(y0 + 1, n - 1);
  const fx = x - x0;
  const fy = y - y0;
  const top = field[y0 * n + x0] + (field[y0 * n + x1] - field[y0 * n + x0]) * fx;
  const bottom = field[y1 * n + x0] + (field[y1 * n + x1] - field[y1 * n + x0]) * fx;
  return top + (bottom - top) * fy;
}

// Distance in plate units from (u, v) to the nearest road polyline segment.
// Pure and allocation-free per call; the model samples it on a precomputed grid.
export function nearestRoadDistance(u: number, v: number, roads: GeoData['roads']): number {
  let best = Infinity;
  for (const line of roads) {
    for (let k = 0; k + 1 < line.length; k++) {
      const [ax, ay] = line[k];
      const [bx, by] = line[k + 1];
      const dx = bx - ax;
      const dy = by - ay;
      const len2 = dx * dx + dy * dy;
      const t = len2 === 0 ? 0 : Math.min(1, Math.max(0, ((u - ax) * dx + (v - ay) * dy) / len2));
      const ex = u - (ax + dx * t);
      const ey = v - (ay + dy * t);
      const d2 = ex * ex + ey * ey;
      if (d2 < best) best = d2;
    }
  }
  return Math.sqrt(best);
}

// Manifest contract, written by scripts/geodata/bake.mjs and served from /public:
//   {
//     "version": 1,
//     "grid": 129,                      // square plate, grid x grid cells
//     "bbox": [w, s, e, n],             // WGS84 bounds of the square plate
//     "elevationM": [min, max],         // optional: metres spanned by heightmap 0..1
//     "files": {
//       "heightmap": "heightmap.f32",   // Float32 LE, 0..1, optional
//       "flood": "flood.f32",           // Float32 LE, 0..1 hazard, optional (absent until baked)
//       "roads": "roads.json",          // { "lines": [[[u, v], ...]], "classes": [0-3] }, optional
//       "footprint": "footprint.json",  // { "ring": [[u, v], ...] }, optional
//       "facilities": "facilities.json",// { "schools": [[u, v], ...], "hospitals": [[u, v], ...] }, optional
//       "places": "places.json"         // [{ "name", "u", "v", "kind": "city" | "town" | "village" }], optional
//     }
//   }
// Schools and hospitals come from OSM when baked. Precipitation and indicators stay example
// values from the placeholder, and the model derives indicators from the layers above.
// Files resolve next to the manifest. Any inconsistency falls back to the placeholder.
const MANIFEST_URL = '/data/featured/manifest.json';
const MANIFEST_BASE = '/data/featured';

function isManifest(value: unknown): boolean {
  if (typeof value !== 'object' || value === null) return false;
  const candidate = value as { version?: unknown; files?: unknown };
  return candidate.version === 1 && typeof candidate.files === 'object' && candidate.files !== null;
}

// Never throws: a missing, invalid or undecodable manifest yields the labelled placeholder.
export async function loadGeoData(opts: LoadOptions): Promise<GeoData> {
  try {
    const res = await fetch(MANIFEST_URL);
    if (!res.ok) return createPlaceholderData(opts);
    const manifest: unknown = await res.json();
    if (!isManifest(manifest)) return createPlaceholderData(opts);
    const real = await decodeReal(manifest as RealManifest, MANIFEST_BASE);
    return composeGeo(createPlaceholderData(opts), real, opts);
  } catch {
    return createPlaceholderData(opts);
  }
}
