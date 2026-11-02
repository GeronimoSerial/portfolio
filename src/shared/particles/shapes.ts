// Shape targets for the particle layer. Every builder returns exactly n points, matching the
// portrait so the morph can index every attribute with the same vertex.
import { PORTRAIT_H } from './portrait-sampler';

const DEG = Math.PI / 180;
const FIELD_SEED = 17.3;

// Globe: centred at (0, GLOBE_CENTER_Y, 0) in shape space. Radius is the unfitted base size;
// the controller scales it to the view.
export const GLOBE_CENTER_Y = PORTRAIT_H / 2;
export const GLOBE_RADIUS = 0.42 * PORTRAIT_H;
// Land is about 29% of the surface, so 0.92 of the points on land left the ocean side of a spinning globe
// almost empty. At 0.6 land is still about 4x denser than ocean, but every face of the sphere reads.
const GLOBE_LAND_SHARE = 0.6;
const GLOBE_RADIAL_JITTER = 0.01;
export const GLOBE_CENTRE_LON = -60; // longitude that faces the camera at rest (South America)
const LAND_BRIGHT = 0.9;
const OCEAN_BRIGHT = 0.4;
const LAND_W = 1024;
const LAND_H = 512;

// Argentina map: MAP_HEIGHT is the unfitted height of the country's bbox.
const MAP_HEIGHT = 0.95 * PORTRAIT_H;
const MAP_PROJECTION_LAT = -38; // equirectangular cos(lat) correction for the east-west scale
const MAP_PX_PER_DEG = 40; // raster resolution used to test whether a point is inside the country
const MAP_BORDER_SHARE = 0.2;
const MAP_CORE_BRIGHT = 0.5;
const MAP_BORDER_BRIGHT = 0.65;
const MAP_Z_JITTER = 0.03;
// Contiguous USA map: the New York cluster is the arc's end point.
const USA_PROJECTION_LAT = 39;
const USA_CLUSTER_SHARE = 0.025;
const USA_CLUSTER_BRIGHT = 1;
const USA_CLUSTER_RADIUS_DEG = 0.9;
export const USA_NY = { lon: -74.01, lat: 40.71 };

export interface Bounds {
  minLon: number;
  maxLon: number;
  minLat: number;
  maxLat: number;
}

export interface Shape {
  positions: Float32Array;
  bright: Float32Array;
  width: number; // horizontal extent in world units, used for fit scaling
  height: number; // vertical extent in world units, used for fit scaling
  focus: [number, number]; // zoom centre relative to the cloud centre, in world units
}

type Ring = number[][];
type Polygons = Ring[][];
type Geometry = { type: 'Polygon'; coordinates: Ring[] } | { type: 'MultiPolygon'; coordinates: Polygons };

export interface GeoCollection {
  type: 'FeatureCollection';
  features: { geometry: Geometry }[];
}

// Accepts a FeatureCollection, a Feature or a bare geometry. The province file format is not fixed.
export function asCollection(raw: unknown): GeoCollection | null {
  const r = raw as { type?: string; features?: unknown; geometry?: Geometry };
  if (r?.type === 'FeatureCollection' && Array.isArray(r.features)) return r as GeoCollection;
  if (r?.type === 'Feature' && r.geometry) return { type: 'FeatureCollection', features: [{ geometry: r.geometry }] };
  if (r?.type === 'Polygon' || r?.type === 'MultiPolygon') {
    return { type: 'FeatureCollection', features: [{ geometry: r as unknown as Geometry }] };
  }
  return null;
}

function polygonsOf(geo: GeoCollection): Polygons {
  return geo.features.flatMap((f) => (f.geometry.type === 'Polygon' ? [f.geometry.coordinates] : f.geometry.coordinates));
}

function pack(xs: number[], ys: number[], zs: number[]): Float32Array {
  const out = new Float32Array(xs.length * 3);
  for (let i = 0; i < xs.length; i++) {
    out[i * 3] = xs[i];
    out[i * 3 + 1] = ys[i];
    out[i * 3 + 2] = zs[i];
  }
  return out;
}

function hash(i: number, j: number): number {
  const s = Math.sin(i * 127.1 + j * 311.7 + FIELD_SEED) * 43758.5453;
  return s - Math.floor(s);
}

function noise2(x: number, y: number): number {
  const i = Math.floor(x);
  const j = Math.floor(y);
  const fx = x - i;
  const fy = y - j;
  const ux = fx * fx * (3 - 2 * fx);
  const uy = fy * fy * (3 - 2 * fy);
  const a = hash(i, j);
  const b = hash(i + 1, j);
  const c = hash(i, j + 1);
  const e = hash(i + 1, j + 1);
  return a + (b - a) * ux + (c - a) * uy + (a - b - c + e) * ux * uy;
}

export function buildField(n: number): Float32Array {
  const cols = Math.ceil(Math.sqrt(n * 1.5));
  const rows = Math.ceil(n / cols);
  const xs: number[] = [];
  const ys: number[] = [];
  const zs: number[] = [];
  const th = -1.0;
  const ct = Math.cos(th);
  const st = Math.sin(th);
  for (let k = 0; k < n; k++) {
    const i = k % cols;
    const j = Math.floor(k / cols);
    const x = (i / (cols - 1) - 0.5) * 6;
    const y = (j / (rows - 1) - 0.5) * 4;
    const h = (noise2(x * 0.7, y * 0.7) - 0.5) * 0.8;
    xs.push(x);
    ys.push(y * ct - h * st + PORTRAIT_H / 2);
    zs.push(y * st + h * ct);
  }
  return pack(xs, ys, zs);
}

// Rasterizes lon/lat rings into a W x H mask. `project` maps lon/lat to raster pixels.
function rasterize(
  geo: GeoCollection,
  W: number,
  H: number,
  project: (lon: number, lat: number) => [number, number],
): Uint8Array {
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) throw new Error('2D canvas context unavailable');
  const path = new Path2D();
  for (const poly of polygonsOf(geo)) {
    for (const ring of poly) {
      ring.forEach(([lon, lat], i) => {
        const [x, y] = project(lon, lat);
        if (i === 0) path.moveTo(x, y);
        else path.lineTo(x, y);
      });
      path.closePath();
    }
  }
  ctx.fillStyle = '#fff';
  ctx.fill(path, 'evenodd');
  const px = ctx.getImageData(0, 0, W, H).data;
  const mask = new Uint8Array(W * H);
  for (let i = 0; i < mask.length; i++) mask[i] = px[i * 4 + 3] > 127 ? 1 : 0;
  return mask;
}

function isLand(mask: Uint8Array, lat: number, lon: number): boolean {
  const x = Math.min(LAND_W - 1, Math.floor(((lon + 180) / 360) * LAND_W));
  const y = Math.min(LAND_H - 1, Math.floor(((90 - lat) / 180) * LAND_H));
  return mask[y * LAND_W + x] === 1;
}

// Uniform direction on the sphere as [lat, lon] in degrees.
function randomLatLon(): [number, number] {
  return [Math.asin(Math.random() * 2 - 1) / DEG, Math.random() * 360 - 180];
}

// Points on a sphere centred at GLOBE_CENTER_Y. Most sit on land; a sparse ocean set keeps the
// sphere readable. The longitude offset puts South America at the front when the pose starts.
export function buildGlobe(n: number, land: GeoCollection): Shape {
  const mask = rasterize(land, LAND_W, LAND_H, (lon, lat) => [
    ((lon + 180) / 360) * LAND_W,
    ((90 - lat) / 180) * LAND_H,
  ]);
  const positions = new Float32Array(n * 3);
  const bright = new Float32Array(n);
  const landN = Math.round(n * GLOBE_LAND_SHARE);
  let i = 0;

  const put = (lat: number, lon: number, b: number) => {
    const phi = lat * DEG;
    const lam = (lon - GLOBE_CENTRE_LON) * DEG;
    const r = GLOBE_RADIUS + (Math.random() * 2 - 1) * GLOBE_RADIAL_JITTER;
    positions[i * 3] = r * Math.cos(phi) * Math.sin(lam);
    positions[i * 3 + 1] = GLOBE_CENTER_Y + r * Math.sin(phi);
    positions[i * 3 + 2] = r * Math.cos(phi) * Math.cos(lam);
    bright[i] = b;
    i++;
  };

  while (i < landN) {
    const [lat, lon] = randomLatLon();
    if (isLand(mask, lat, lon)) put(lat, lon, LAND_BRIGHT);
  }
  while (i < n) {
    const [lat, lon] = randomLatLon();
    if (!isLand(mask, lat, lon)) put(lat, lon, OCEAN_BRIGHT);
  }
  return { positions, bright, width: 2 * GLOBE_RADIUS, height: 2 * GLOBE_RADIUS, focus: [0, 0] };
}

function boundsOf(geo: GeoCollection): Bounds {
  const b: Bounds = { minLon: Infinity, maxLon: -Infinity, minLat: Infinity, maxLat: -Infinity };
  for (const poly of polygonsOf(geo)) {
    for (const ring of poly) {
      for (const [lon, lat] of ring) {
        b.minLon = Math.min(b.minLon, lon);
        b.maxLon = Math.max(b.maxLon, lon);
        b.minLat = Math.min(b.minLat, lat);
        b.maxLat = Math.max(b.maxLat, lat);
      }
    }
  }
  return b;
}

// Equirectangular flat projection shared by the map and the province. Centres on the bbox of
// `geo`, with the bbox height equal to MAP_HEIGHT.
export function argentinaProjection(geo: GeoCollection, projectionLat = MAP_PROJECTION_LAT) {
  const bounds = boundsOf(geo);
  const cosLat = Math.cos(projectionLat * DEG);
  const scale = MAP_HEIGHT / (bounds.maxLat - bounds.minLat);
  const cLon = (bounds.minLon + bounds.maxLon) / 2;
  const cLat = (bounds.minLat + bounds.maxLat) / 2;
  const toWorld = (lon: number, lat: number): [number, number] => [
    (lon - cLon) * cosLat * scale,
    (lat - cLat) * scale + GLOBE_CENTER_Y,
  ];
  return { bounds, cosLat, scale, toWorld };
}

// Border samples in world space, uniform by arc length.
function borderSampler(geo: GeoCollection, toWorld: (lon: number, lat: number) => [number, number]) {
  const segs: number[][] = [];
  const cum: number[] = [];
  let total = 0;
  for (const poly of polygonsOf(geo)) {
    for (const ring of poly) {
      for (let j = 0; j < ring.length - 1; j++) {
        const [x0, y0] = toWorld(ring[j][0], ring[j][1]);
        const [x1, y1] = toWorld(ring[j + 1][0], ring[j + 1][1]);
        total += Math.hypot(x1 - x0, y1 - y0);
        segs.push([x0, y0, x1, y1]);
        cum.push(total);
      }
    }
  }
  return (): [number, number] => {
    if (!segs.length) return [0, GLOBE_CENTER_Y];
    const t = Math.random() * total;
    let lo = 0;
    let hi = cum.length - 1;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (cum[mid] < t) lo = mid + 1;
      else hi = mid;
    }
    const [x0, y0, x1, y1] = segs[lo];
    const prev = lo ? cum[lo - 1] : 0;
    const u = (t - prev) / Math.max(1e-9, cum[lo] - prev);
    return [x0 + (x1 - x0) * u, y0 + (y1 - y0) * u];
  };
}

// Rasterises `geo` over `bounds` at k px per degree, and returns a sampler of points inside it.
function insideSampler(
  geo: GeoCollection,
  bounds: Bounds,
  k: number,
  cosLat: number,
  toWorld: (lon: number, lat: number) => [number, number],
) {
  const W = Math.ceil((bounds.maxLon - bounds.minLon) * k * cosLat) + 1;
  const H = Math.ceil((bounds.maxLat - bounds.minLat) * k) + 1;
  const mask = rasterize(geo, W, H, (lon, lat) => [(lon - bounds.minLon) * k * cosLat, (bounds.maxLat - lat) * k]);
  return (): [number, number] => {
    for (;;) {
      const px = Math.floor(Math.random() * W);
      const py = Math.floor(Math.random() * H);
      if (mask[py * W + px]) return toWorld(bounds.minLon + px / (k * cosLat), bounds.maxLat - py / k);
    }
  };
}

export function buildArgentina(n: number, geo: GeoCollection): Shape {
  return buildMap(n, geo, MAP_PROJECTION_LAT);
}

export function usaProjection(geo: GeoCollection) {
  return argentinaProjection(geo, USA_PROJECTION_LAT);
}

export function buildUsa(n: number, geo: GeoCollection): Shape {
  return buildMap(n, geo, USA_PROJECTION_LAT, USA_NY);
}

function buildMap(n: number, geo: GeoCollection, projectionLat: number, cluster?: { lon: number; lat: number }): Shape {
  const { bounds, cosLat, scale, toWorld } = argentinaProjection(geo, projectionLat);
  const sampleInside = insideSampler(geo, bounds, MAP_PX_PER_DEG, cosLat, toWorld);
  const sampleBorder = borderSampler(geo, toWorld);

  const positions = new Float32Array(n * 3);
  const bright = new Float32Array(n);
  let i = 0;
  const put = ([x, y]: [number, number], v: number, jitter: number) => {
    positions[i * 3] = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = (Math.random() * 2 - 1) * jitter;
    bright[i] = v;
    i++;
  };

  if (cluster) {
    const clusterN = Math.round(n * USA_CLUSTER_SHARE);
    for (let j = 0; j < clusterN; j++) {
      const a = Math.random() * 2 * Math.PI;
      const r = USA_CLUSTER_RADIUS_DEG * Math.sqrt(Math.random());
      put(toWorld(cluster.lon + (r * Math.cos(a)) / cosLat, cluster.lat + r * Math.sin(a)), USA_CLUSTER_BRIGHT, MAP_Z_JITTER);
    }
  }
  const borderN = Math.round(n * MAP_BORDER_SHARE);
  for (let j = 0; j < borderN; j++) put(sampleBorder(), MAP_BORDER_BRIGHT, MAP_Z_JITTER);
  while (i < n) put(sampleInside(), MAP_CORE_BRIGHT, MAP_Z_JITTER);
  return {
    positions,
    bright,
    width: (bounds.maxLon - bounds.minLon) * cosLat * scale,
    height: MAP_HEIGHT,
    focus: [0, 0],
  };
}

// Accordion figures. Each is built in a unit space, then fitted: its longest side becomes PORTRAIT_H,
// it is centred on the cloud centre, and it is packed to exactly n points like every other shape.
export const FIGURE_NAMES = ['architecture', 'lifecycle', 'cloud', 'flow', 'performance'] as const;
export type FigureName = (typeof FIGURE_NAMES)[number];

interface Cloud {
  xyz: number[];
  bright: number[];
}

const newCloud = (): Cloud => ({ xyz: [], bright: [] });

function put(c: Cloud, x: number, y: number, z: number, b: number) {
  c.xyz.push(x, y, z);
  c.bright.push(b);
}

// Splits `total` into `parts` whole counts that add up to `total`.
function splitEven(total: number, parts: number): number[] {
  const base = Math.floor(total / parts);
  const extra = total - base * parts;
  return Array.from({ length: parts }, (_, i) => base + (i < extra ? 1 : 0));
}

// Smoothstep ramp from 0 at a to 1 at b.
function ramp(a: number, b: number, x: number): number {
  const t = Math.min(1, Math.max(0, (x - a) / (b - a)));
  return t * t * (3 - 2 * t);
}

function packFigure(c: Cloud, n: number): Shape {
  const count = c.bright.length;
  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;
  for (let i = 0; i < count; i++) {
    const x = c.xyz[i * 3];
    const y = c.xyz[i * 3 + 1];
    minX = Math.min(minX, x);
    maxX = Math.max(maxX, x);
    minY = Math.min(minY, y);
    maxY = Math.max(maxY, y);
  }
  const ex = maxX - minX;
  const ey = maxY - minY;
  const k = PORTRAIT_H / Math.max(ex, ey, 1e-6);
  const cx = (minX + maxX) / 2;
  const cy = (minY + maxY) / 2;
  const positions = new Float32Array(n * 3);
  const bright = new Float32Array(n);
  for (let i = 0; i < n; i++) {
    const j = Math.min(i, count - 1);
    positions[i * 3] = (c.xyz[j * 3] - cx) * k;
    positions[i * 3 + 1] = (c.xyz[j * 3 + 1] - cy) * k + GLOBE_CENTER_Y;
    positions[i * 3 + 2] = c.xyz[j * 3 + 2] * k;
    bright[i] = c.bright[j];
  }
  return { positions, bright, width: ex * k, height: ey * k, focus: [0, 0] };
}

// Architecture: four tiers of nodes, each node joined by dotted edges to its two nearest in the tier below.
function architectureFigure(n: number): Shape {
  const NODE_R = 0.09;
  const EDGE_DOTS = 70;
  const tiers = [2, 4, 5, 3];
  const nodes: { x: number; y: number }[] = [];
  const tierIdx = tiers.map((count, t) => {
    const y = 1 - (2 * t) / (tiers.length - 1);
    return Array.from({ length: count }, (_, i) => {
      const x = count === 1 ? 0 : -1 + (2 * i) / (count - 1);
      nodes.push({ x, y });
      return nodes.length - 1;
    });
  });
  const edges: [number, number][] = [];
  tierIdx.slice(0, -1).forEach((upper, t) => {
    const lower = tierIdx[t + 1];
    upper.forEach((a) => {
      lower
        .slice()
        .sort((p, q) => Math.abs(nodes[p].x - nodes[a].x) - Math.abs(nodes[q].x - nodes[a].x))
        .slice(0, 2)
        .forEach((b) => edges.push([a, b]));
    });
  });

  const c = newCloud();
  const nodeCounts = splitEven(n - edges.length * EDGE_DOTS, nodes.length);
  nodes.forEach((node, i) => {
    for (let k = 0; k < nodeCounts[i]; k++) {
      const a = Math.random() * Math.PI * 2;
      const r = NODE_R * Math.sqrt(Math.random());
      put(c, node.x + r * Math.cos(a), node.y + r * Math.sin(a), 0, 0.95);
    }
  });
  edges.forEach(([a, b]) => {
    for (let k = 0; k < EDGE_DOTS; k++) {
      const u = 0.14 + (0.72 * (k + 0.5)) / EDGE_DOTS;
      const x = nodes[a].x + (nodes[b].x - nodes[a].x) * u;
      const y = nodes[a].y + (nodes[b].y - nodes[a].y) * u;
      put(c, x, y, 0, 0.45);
    }
  });
  return packFigure(c, n);
}

// Lifecycle: an outward spiral from a core (idea) to a rim (production), with a closed loop around it for iteration.
function lifecycleFigure(n: number): Shape {
  const c = newCloud();
  const loopN = Math.round(n * 0.18);
  const spiralN = n - loopN;
  const turns = 2.4;
  for (let k = 0; k < spiralN; k++) {
    const t = (k + Math.random()) / spiralN;
    const a = t * turns * Math.PI * 2;
    const r = 0.1 + 0.8 * t + (Math.random() * 2 - 1) * 0.015;
    put(c, r * Math.cos(a), r * Math.sin(a), 0, 0.35 + 0.65 * t);
  }
  for (let k = 0; k < loopN; k++) {
    const a = Math.random() * Math.PI * 2;
    const r = 0.97 + (Math.random() * 2 - 1) * 0.008;
    put(c, r * Math.cos(a), r * Math.sin(a), 0, 0.3);
  }
  return packFigure(c, n);
}

// Cloud: a 7 x 5 x 2 lattice of small cubes, turned to show depth, with some status lights lit.
function latticeFigure(n: number): Shape {
  const NX = 7;
  const NY = 5;
  const NZ = 2;
  const CELL = 0.3;
  const HALF = 0.1;
  const LAYER = 0.42;
  const cubes: { x: number; y: number; z: number; lit: boolean }[] = [];
  for (let l = 0; l < NZ; l++) {
    for (let j = 0; j < NY; j++) {
      for (let i = 0; i < NX; i++) {
        cubes.push({
          x: (i - (NX - 1) / 2) * CELL,
          y: (j - (NY - 1) / 2) * CELL,
          z: (l - (NZ - 1) / 2) * LAYER,
          lit: Math.random() < 0.18,
        });
      }
    }
  }
  const yaw = 0.55;
  const cs = Math.cos(yaw);
  const sn = Math.sin(yaw);
  const c = newCloud();
  const counts = splitEven(n, cubes.length);
  cubes.forEach((cube, ci) => {
    for (let k = 0; k < counts[ci]; k++) {
      const axis = Math.floor(Math.random() * 3);
      const sign = Math.random() < 0.5 ? -HALF : HALF;
      const others = [0, 1, 2].filter((d) => d !== axis);
      const q = [0, 0, 0];
      q[axis] = sign;
      q[others[0]] = (Math.random() * 2 - 1) * HALF;
      q[others[1]] = (Math.random() * 2 - 1) * HALF;
      const x = cube.x + q[0];
      const y = cube.y + q[1];
      const z = cube.z + q[2];
      put(c, x * cs + z * sn, y, -x * sn + z * cs, cube.lit ? 1 : 0.5);
    }
  });
  return packFigure(c, n);
}

// Flow: streamlines enter from the left, then converge into one bright stream on the right.
function flowFigure(n: number): Shape {
  const STREAMS = 48;
  const c = newCloud();
  const counts = splitEven(n, STREAMS);
  for (let s = 0; s < STREAMS; s++) {
    const y0 = -0.8 + (1.6 * (s + 0.5)) / STREAMS;
    for (let k = 0; k < counts[s]; k++) {
      const t = Math.random();
      const conv = ramp(0.1, 0.8, t);
      const band = 0.012 + 0.1 * (1 - conv);
      const wobble = 0.03 * Math.sin(t * 10 + s * 0.7) * (1 - conv);
      const y = y0 * (1 - conv) + wobble + (Math.random() * 2 - 1) * band;
      put(c, -1 + 2 * t, y, 0, 0.25 + 0.75 * conv);
    }
  }
  return packFigure(c, n);
}

// Performance: a histogram of rising bars, filled by area and brighter toward the top of each bar.
function histogramFigure(n: number): Shape {
  const BARS = 22;
  const slot = 2 / BARS;
  const half = slot * 0.36;
  const floor = -0.9;
  const tops = Array.from({ length: BARS }, (_, i) => {
    const f = Math.min(1, (0.18 + 0.82 * Math.pow((i + 1) / BARS, 1.6)) * (0.88 + 0.12 * Math.sin(i * 1.7 + 0.4)));
    return floor + 1.8 * f;
  });
  const areas = tops.map((top) => (top - floor) * 2 * half);
  const total = areas.reduce((a, b) => a + b, 0);
  const counts = areas.map((a) => Math.floor((n * a) / total));
  const remainder = n - counts.reduce((a, b) => a + b, 0);
  for (let i = 0; i < remainder; i++) counts[i] += 1;

  const c = newCloud();
  tops.forEach((top, i) => {
    const cx = -1 + slot * (i + 0.5);
    for (let k = 0; k < counts[i]; k++) {
      const x = cx + (Math.random() * 2 - 1) * half;
      const y = floor + (top - floor) * Math.random();
      put(c, x, y, 0, 0.35 + (0.65 * (y - floor)) / (top - floor));
    }
  });
  return packFigure(c, n);
}

const FIGURE_BUILDERS: Record<FigureName, (n: number) => Shape> = {
  architecture: architectureFigure,
  lifecycle: lifecycleFigure,
  cloud: latticeFigure,
  flow: flowFigure,
  performance: histogramFigure,
};

export function buildFigure(name: FigureName, n: number): Shape {
  return FIGURE_BUILDERS[name](n);
}
