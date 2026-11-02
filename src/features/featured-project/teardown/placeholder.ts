import {
  FLOOD_LEVEL,
  nearestRoadDistance,
  sampleBilinear,
  toPlate,
  toWorld,
  type GeoData,
  type LoadOptions,
  type School,
} from './data';

// Terrain value below which land floods in the example. `flood` is exactly
// FLOOD_LEVEL on this contour, matching the approved prototype.
const FLOOD_TERRAIN_CUT = 0.36;

// School scatter cohorts, placed in this order as shares of the school count, then
// the rest uniform. Placeholder only: shaped so each rain step visibly changes the
// exposed count. `hazard` is the flood field band, `gap` the plate distance to a road.
const SCHOOL_COHORTS = [
  { share: 0.06, hazard: [0.6, 1], gap: [0.04, 1] }, // flood-prone and near a road
  { share: 0.28, hazard: [0.48, 0.73], gap: [0, 1] }, // mid-to-high hazard
  { share: 0.15, hazard: [0, 0.35], gap: [0.1, 1] }, // high ground, far from roads
] as const;

const clamp01 = (v: number): number => Math.min(1, Math.max(0, v));

function mulberry32(seed: number): () => number {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Returns f(x, z) in [0, 1] for world coordinates in [-5, 5].
function makeField(seed: number, freq: number): (x: number, z: number) => number {
  const rnd = mulberry32(seed);
  const vals = new Float32Array(64 * 64);
  for (let k = 0; k < vals.length; k++) vals[k] = rnd();
  const lat = (x: number, y: number): number => vals[(x & 63) | ((y & 63) << 6)];
  const noise = (x: number, y: number): number => {
    const xi = Math.floor(x);
    const yi = Math.floor(y);
    const xf = x - xi;
    const yf = y - yi;
    const u = xf * xf * (3 - 2 * xf);
    const v = yf * yf * (3 - 2 * yf);
    const a = lat(xi, yi);
    const b = lat(xi + 1, yi);
    const c = lat(xi, yi + 1);
    const d = lat(xi + 1, yi + 1);
    return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
  };
  const fbm = (x: number, y: number): number => {
    let s = 0;
    let amp = 0.5;
    let f = 1;
    let norm = 0;
    for (let o = 0; o < 4; o++) {
      s += amp * noise(x * f, y * f);
      norm += amp;
      amp *= 0.5;
      f *= 2;
    }
    return s / norm;
  };
  return (x, z) => clamp01((fbm(toPlate(x) * freq, toPlate(z) * freq) - 0.3) / 0.4);
}

// The example dataset is identical on every viewport: same schools, same precipitation
// field, same fallback grids. Mobile reduction applies only to real grids (decode.ts).
// The options argument is kept so callers and the loader contract do not change.
export function createPlaceholderData(_opts: LoadOptions): GeoData {
  const grid = 161;
  const precipGrid = 60;
  const schoolCount = 140;
  const terrain = makeField(11, 2.2);
  const precip = makeField(29, 4.5);

  const heightmap = new Float32Array(grid * grid);
  const flood = new Float32Array(grid * grid);
  for (let j = 0; j < grid; j++) {
    for (let i = 0; i < grid; i++) {
      const t = terrain(toWorld(i / (grid - 1)), toWorld(j / (grid - 1)));
      heightmap[j * grid + i] = t;
      flood[j * grid + i] = clamp01(FLOOD_LEVEL + (FLOOD_TERRAIN_CUT - t) * 10);
    }
  }

  const precipitation = new Float32Array(precipGrid * precipGrid);
  for (let j = 0; j < precipGrid; j++) {
    for (let i = 0; i < precipGrid; i++) {
      precipitation[j * precipGrid + i] = precip(
        toWorld((i + 0.5) / precipGrid),
        toWorld((j + 0.5) / precipGrid),
      );
    }
  }

  // Road network: four trunk walks plus side branches, seeded like the prototype.
  const rr = mulberry32(53);
  const walk = (
    x0: number,
    z0: number,
    h0: number,
    n: number,
    step: number,
    turn: number,
  ): Array<[number, number]> => {
    let x = x0;
    let z = z0;
    let h = h0;
    const pts: Array<[number, number]> = [[x, z]];
    for (let k = 0; k < n; k++) {
      h += (rr() - 0.5) * turn;
      x += Math.cos(h) * step;
      z += Math.sin(h) * step;
      if (Math.abs(x) > 4.8 || Math.abs(z) > 4.8) break;
      pts.push([x, z]);
    }
    return pts;
  };
  const mains = [
    walk(-4.8, -2.6, 0.08, 90, 0.11, 0.22),
    walk(-1.2, -4.8, 1.25, 80, 0.11, 0.26),
    walk(4.8, 1.8, Math.PI + 0.35, 90, 0.11, 0.2),
    walk(-4.8, 3.9, -0.25, 70, 0.11, 0.3),
  ];
  const worldRoads = [...mains];
  for (const m of mains) {
    for (let k = 10; k < m.length - 4; k += 22) {
      const [x0, z0] = m[k];
      const [x1, z1] = m[k - 1];
      const h = Math.atan2(z0 - z1, x0 - x1) + (rr() < 0.5 ? -1 : 1) * (0.7 + rr() * 0.5);
      worldRoads.push(walk(x0, z0, h, 18 + Math.floor(rr() * 12), 0.11, 0.35));
    }
  }
  const roads = worldRoads.map((pl) =>
    pl.map(([x, z]): [number, number] => [toPlate(x), toPlate(z)]),
  );

  // Schools: sampled in plate space with fixed seed. Cohorts are placed first so
  // their quotas hold; the rest is uniform. Exposure is never stored here.
  const srnd = mulberry32(71);
  const randomPlate = (): number => 0.5 + (srnd() - 0.5) * 0.92;
  const hazardAt = (u: number, v: number): number => sampleBilinear(flood, grid, u, v);
  const gapAt = (u: number, v: number): number => nearestRoadDistance(u, v, roads);
  const schools: School[] = [];
  for (const cohort of SCHOOL_COHORTS) {
    const target = schools.length + Math.round(schoolCount * cohort.share);
    // Bounded attempts keep a degenerate field from looping forever.
    for (let tries = 0; schools.length < target && tries < 200_000; tries++) {
      const x = randomPlate();
      const y = randomPlate();
      const h = hazardAt(x, y);
      const g = gapAt(x, y);
      if (h >= cohort.hazard[0] && h <= cohort.hazard[1] && g >= cohort.gap[0] && g <= cohort.gap[1]) {
        schools.push({ x, y });
      }
    }
  }
  while (schools.length < schoolCount) {
    schools.push({ x: randomPlate(), y: randomPlate() });
  }

  return {
    isPlaceholder: true,
    grid,
    heightmap,
    precipitation,
    precipGrid,
    flood,
    roads,
    schools,
  };
}
