import { sampleBilinear, type GeoData, type LoadOptions } from './data';

// Province outline in plate coordinates, [u, v] per point.
export type Footprint = Array<[number, number]>;

// Manifest written by scripts/geodata/bake.mjs. Only the files listed are decoded.
export interface RealManifest {
  version: 1;
  grid: number;
  bbox: [number, number, number, number];
  elevation?: { minM: number; maxM: number };
  files: {
    heightmap?: string;
    flood?: string;
    floodmask?: string;
    hillshade?: string;
    satellite?: string;
    roads?: string;
    footprint?: string;
  };
}

// Real layers that were decoded and validated. Absent keys were not in the manifest.
// Image layers are returned as URLs: the renderer loads them, the decoder does not.
export interface DecodedGeo {
  grid: number;
  heightmap?: Float32Array | undefined;
  flood?: Float32Array | undefined;
  roads?: GeoData['roads'] | undefined;
  roadClasses?: number[] | undefined;
  footprint?: Footprint | undefined;
  elevationRangeM?: [number, number] | undefined;
  hillshadeUrl?: string | undefined;
  floodMaskUrl?: string | undefined;
  satelliteUrl?: string | undefined;
}

// Mobile renders at most this many cells per side.
const FILE_NAME = /^[A-Za-z0-9._-]+$/;

function resolveFile(baseUrl: string, name: string): string {
  if (!FILE_NAME.test(name)) throw new Error(`Invalid manifest file name: ${name}`);
  return `${baseUrl.replace(/\/+$/, '')}/${name}`;
}

async function fetchBytes(url: string): Promise<ArrayBuffer> {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
  return res.arrayBuffer();
}

// Little-endian float32 grid, values already normalised to 0..1 by the bake.
function decodeFloat32(buffer: ArrayBuffer, grid: number, label: string): Float32Array {
  const expected = grid * grid * 4;
  if (buffer.byteLength !== expected) {
    throw new Error(`${label}: expected ${expected} bytes for grid ${grid}, got ${buffer.byteLength}`);
  }
  const view = new DataView(buffer);
  const out = new Float32Array(grid * grid);
  for (let k = 0; k < out.length; k++) {
    const v = view.getFloat32(k * 4, true);
    if (!Number.isFinite(v) || v < 0 || v > 1) throw new Error(`${label}: value ${v} outside 0..1 at ${k}`);
    out[k] = v;
  }
  return out;
}

function parsePoint(value: unknown, label: string): [number, number] {
  if (
    !Array.isArray(value) ||
    value.length !== 2 ||
    !value.every((n) => typeof n === 'number' && Number.isFinite(n))
  ) {
    throw new Error(`${label}: expected a [u, v] pair`);
  }
  return [value[0] as number, value[1] as number];
}

// roads.json: { lines: [[[u, v], ...], ...], classes: [0 | 1 | 2, ...] }, classes parallel to lines.
const ROAD_CLASS_VALUES = new Set([0, 1, 2]);

function decodeRoads(json: unknown): { roads: GeoData['roads']; roadClasses: number[] } {
  const lines = (json as { lines?: unknown } | null)?.lines;
  const classes = (json as { classes?: unknown } | null)?.classes;
  if (!Array.isArray(lines)) throw new Error('roads: expected { lines, classes }');
  if (!Array.isArray(classes) || classes.length !== lines.length) {
    throw new Error('roads: classes must be an array parallel to lines');
  }
  const roads = lines.map((line, i) => {
    if (!Array.isArray(line) || line.length < 2) throw new Error(`roads.lines[${i}]: needs 2+ points`);
    return line.map((p, k) => parsePoint(p, `roads.lines[${i}][${k}]`));
  });
  const roadClasses = classes.map((c, i) => {
    if (typeof c !== 'number' || !ROAD_CLASS_VALUES.has(c)) throw new Error(`roads.classes[${i}]: expected 0, 1 or 2`);
    return c;
  });
  return { roads, roadClasses };
}

function decodeFootprint(json: unknown): Footprint {
  const ring = (json as { ring?: unknown } | null)?.ring;
  if (!Array.isArray(ring) || ring.length < 3) throw new Error('footprint: expected { ring } with 3+ points');
  return ring.map((p, k) => parsePoint(p, `footprint.ring[${k}]`));
}

// Fetches and validates the files the manifest lists. Throws on any inconsistency;
// the caller falls back to the placeholder.
export async function decodeReal(manifest: RealManifest, baseUrl: string): Promise<DecodedGeo> {
  const grid = manifest.grid;
  if (!Number.isInteger(grid) || grid < 2) throw new Error('manifest.grid must be an integer >= 2');
  const files = manifest.files ?? {};
  const load = async <T>(name: string | undefined, read: (bytes: ArrayBuffer) => T): Promise<T | undefined> =>
    name === undefined ? undefined : read(await fetchBytes(resolveFile(baseUrl, name)));
  const parseJson = (bytes: ArrayBuffer): unknown => JSON.parse(new TextDecoder().decode(bytes));

  const [heightmap, flood, roads, footprint] = await Promise.all([
    load(files.heightmap, (b) => decodeFloat32(b, grid, 'heightmap')),
    load(files.flood, (b) => decodeFloat32(b, grid, 'flood')),
    load(files.roads, (b) => decodeRoads(parseJson(b))),
    load(files.footprint, (b) => decodeFootprint(parseJson(b))),
  ]);
  const elevation = manifest.elevation;
  if (elevation !== undefined && !(Number.isFinite(elevation.minM) && Number.isFinite(elevation.maxM))) {
    throw new Error('manifest.elevation: minM and maxM must be finite numbers');
  }

  return {
    grid,
    heightmap,
    flood,
    roads: roads?.roads,
    roadClasses: roads?.roadClasses,
    footprint,
    elevationRangeM: elevation ? [elevation.minM, elevation.maxM] : undefined,
    hillshadeUrl: files.hillshade === undefined ? undefined : resolveFile(baseUrl, files.hillshade),
    floodMaskUrl: files.floodmask === undefined ? undefined : resolveFile(baseUrl, files.floodmask),
    satelliteUrl: files.satellite === undefined ? undefined : resolveFile(baseUrl, files.satellite),
  };
}

// Bilinear resample of an n x n field to target x target. Same size returns the input.
function resample(field: Float32Array, n: number, target: number): Float32Array {
  if (n === target) return field;
  const out = new Float32Array(target * target);
  for (let j = 0; j < target; j++) {
    for (let i = 0; i < target; i++) {
      out[j * target + i] = sampleBilinear(field, n, i / (target - 1), j / (target - 1));
    }
  }
  return out;
}

// Merges real layers over the placeholder. Heightmap and flood always share one grid:
// a missing real layer is resampled from the placeholder at that same size, never mixed.
// isPlaceholder stays true because schools and precipitation are still example values.
export function composeGeo(placeholder: GeoData, real: DecodedGeo, _opts: LoadOptions): GeoData {
  const anyRealGrid = real.heightmap !== undefined || real.flood !== undefined;
  const anyRealImage =
    real.hillshadeUrl !== undefined || real.floodMaskUrl !== undefined || real.satelliteUrl !== undefined;
  if (!anyRealGrid && real.roads === undefined && real.footprint === undefined && !anyRealImage) return placeholder;

  const sourceGrid = anyRealGrid ? real.grid : placeholder.grid;
  // Same grid on every viewport so the model yields identical numbers; only meshes are reduced on mobile.
  const grid = sourceGrid;
  const heightmap = real.heightmap
    ? resample(real.heightmap, real.grid, grid)
    : resample(placeholder.heightmap, placeholder.grid, grid);
  const flood = real.flood
    ? resample(real.flood, real.grid, grid)
    : resample(placeholder.flood, placeholder.grid, grid);

  return {
    isPlaceholder: true,
    grid,
    heightmap,
    precipitation: placeholder.precipitation,
    precipGrid: placeholder.precipGrid,
    flood,
    roads: real.roads ?? placeholder.roads,
    // Classes only describe the real roads; the placeholder roads keep the default class.
    roadClasses: real.roads === undefined ? undefined : real.roadClasses,
    schools: placeholder.schools,
    footprint: real.footprint,
    elevationRangeM: real.elevationRangeM,
    hillshadeUrl: real.hillshadeUrl,
    floodMaskUrl: real.floodMaskUrl,
    satelliteUrl: real.satelliteUrl,
  };
}
