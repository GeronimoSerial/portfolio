import { sampleBilinear, type GeoData, type LoadOptions, type Place, type PlaceKind, type School } from './data';

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
    facilities?: string;
    places?: string;
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
  schools?: School[] | undefined;
  hospitals?: School[] | undefined;
  places?: Place[] | undefined;
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

// roads.json: { lines: [[[u, v], ...], ...], classes: [0 | 1 | 2 | 3, ...] }, classes parallel to lines.
const ROAD_CLASS_VALUES = new Set([0, 1, 2, 3]);

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
    if (typeof c !== 'number' || !ROAD_CLASS_VALUES.has(c)) throw new Error(`roads.classes[${i}]: expected 0 to 3`);
    return c;
  });
  return { roads, roadClasses };
}

function decodeFootprint(json: unknown): Footprint {
  const ring = (json as { ring?: unknown } | null)?.ring;
  if (!Array.isArray(ring) || ring.length < 3) throw new Error('footprint: expected { ring } with 3+ points');
  return ring.map((p, k) => parsePoint(p, `footprint.ring[${k}]`));
}

// facilities.json: { schools: [[u, v], ...], hospitals: [[u, v], ...] }, plate coords.
function decodePoints(list: unknown, label: string): School[] {
  if (!Array.isArray(list)) throw new Error(`${label}: expected an array of [u, v] pairs`);
  return list.map((p, k) => {
    const [x, y] = parsePoint(p, `${label}[${k}]`);
    return { x, y };
  });
}

function decodeFacilities(json: unknown): { schools: School[]; hospitals: School[] } {
  const obj = json as { schools?: unknown; hospitals?: unknown } | null;
  if (!obj || typeof obj !== 'object') throw new Error('facilities: expected { schools, hospitals }');
  return {
    schools: decodePoints(obj.schools, 'facilities.schools'),
    hospitals: decodePoints(obj.hospitals, 'facilities.hospitals'),
  };
}

// places.json: [{ name, u, v, kind }], kind one of city, town, village.
const PLACE_KINDS: ReadonlySet<string> = new Set<PlaceKind>(['city', 'town', 'village']);

function decodePlaces(json: unknown): Place[] {
  if (!Array.isArray(json)) throw new Error('places: expected an array');
  return json.map((p, k) => {
    const item = p as { name?: unknown; u?: unknown; v?: unknown; kind?: unknown } | null;
    if (typeof item !== 'object' || item === null) throw new Error(`places[${k}]: expected an object`);
    if (typeof item.name !== 'string') throw new Error(`places[${k}].name: expected a string`);
    if (typeof item.kind !== 'string' || !PLACE_KINDS.has(item.kind)) {
      throw new Error(`places[${k}].kind: expected city, town or village`);
    }
    const [x, y] = parsePoint([item.u, item.v], `places[${k}]`);
    return { name: item.name, x, y, kind: item.kind as PlaceKind };
  });
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

  const [heightmap, flood, roads, footprint, facilities, places] = await Promise.all([
    load(files.heightmap, (b) => decodeFloat32(b, grid, 'heightmap')),
    load(files.flood, (b) => decodeFloat32(b, grid, 'flood')),
    load(files.roads, (b) => decodeRoads(parseJson(b))),
    load(files.footprint, (b) => decodeFootprint(parseJson(b))),
    load(files.facilities, (b) => decodeFacilities(parseJson(b))),
    load(files.places, (b) => decodePlaces(parseJson(b))),
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
    schools: facilities?.schools,
    hospitals: facilities?.hospitals,
    places,
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

// Point in polygon by ray casting. The ring is in plate coordinates, like the schools.
function insideRing(ring: Array<[number, number]>, u: number, v: number): boolean {
  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i];
    const [xj, yj] = ring[j];
    if (yi > v !== yj > v && u < ((xj - xi) * (v - yi)) / (yj - yi) + xi) inside = !inside;
  }
  return inside;
}

// Merges real layers over the placeholder. Heightmap and flood always share one grid:
// a missing real layer is resampled from the placeholder at that same size, never mixed.
// isPlaceholder stays true because precipitation and indicators are still example values.
export function composeGeo(placeholder: GeoData, real: DecodedGeo, _opts: LoadOptions): GeoData {
  const anyRealGrid = real.heightmap !== undefined || real.flood !== undefined;
  const anyRealImage =
    real.hillshadeUrl !== undefined || real.floodMaskUrl !== undefined || real.satelliteUrl !== undefined;
  const anyRealPoints = real.schools !== undefined || real.hospitals !== undefined || real.places !== undefined;
  if (!anyRealGrid && real.roads === undefined && real.footprint === undefined && !anyRealImage && !anyRealPoints) {
    return placeholder;
  }

  const sourceGrid = anyRealGrid ? real.grid : placeholder.grid;
  // Same grid on every viewport so the model yields identical numbers; only meshes are reduced on mobile.
  const grid = sourceGrid;
  const heightmap = real.heightmap
    ? resample(real.heightmap, real.grid, grid)
    : resample(placeholder.heightmap, placeholder.grid, grid);
  const flood = real.flood
    ? resample(real.flood, real.grid, grid)
    : resample(placeholder.flood, placeholder.grid, grid);

  // Points must sit on the map: drop any that fall outside the province outline, real or example.
  const ring = real.footprint;
  const inProvince = (p: School): boolean => ring === undefined || insideRing(ring, p.x, p.y);

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
    // OSM schools replace the example schools when baked. The example ones are scattered over the whole
    // square plate, so they are filtered to the province as well.
    schools: (real.schools ?? placeholder.schools).filter(inProvince),
    hospitals: real.hospitals?.filter(inProvince),
    places: real.places,
    footprint: real.footprint,
    elevationRangeM: real.elevationRangeM,
    hillshadeUrl: real.hillshadeUrl,
    floodMaskUrl: real.floodMaskUrl,
    satelliteUrl: real.satelliteUrl,
  };
}
