import { samplePortrait } from './portrait-sampler';
import {
  asCollection,
  buildArgentina,
  buildField,
  buildFigure,
  buildGlobe,
  buildUsa,
  FIGURE_NAMES,
  GLOBE_CENTER_Y,
  type GeoCollection,
  type Shape,
} from './shapes';
import type { ShapeKey } from './poses';

const GEO = {
  land: '/data/geo/land-110m.json',
  argentina: '/data/geo/argentina-50m.json',
  usa: '/data/geo/usa-50m.json',
};

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

async function loadGeo(url: string): Promise<GeoCollection | null> {
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    return asCollection(await res.json());
  } catch {
    return null;
  }
}

// Accordion figures: public/images/figures/manifest.json lists {name, src, item, format}. Each .bin holds
// Float32 [x, y, z, brightness] points, shuffled so any prefix is a uniform subsample. The procedural
// figures stay in place when the manifest or a file is missing.
let figureFallbackLogged = false;

function boundsShape(positions: Float32Array, bright: Float32Array): Shape {
  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;
  for (let i = 0; i < positions.length; i += 3) {
    minX = Math.min(minX, positions[i]);
    maxX = Math.max(maxX, positions[i]);
    minY = Math.min(minY, positions[i + 1]);
    maxY = Math.max(maxY, positions[i + 1]);
  }
  const cx = (minX + maxX) / 2;
  const cy = (minY + maxY) / 2;
  for (let i = 0; i < positions.length; i += 3) {
    positions[i] -= cx;
    positions[i + 1] += GLOBE_CENTER_Y - cy;
  }
  return { positions, bright, width: maxX - minX, height: maxY - minY, focus: [0, 0] };
}

async function loadFigureClouds(n: number): Promise<Partial<Record<ShapeKey, Shape>>> {
  try {
    const res = await fetch('/images/figures/manifest.json');
    if (!res.ok) throw new Error(`manifest ${res.status}`);
    const entries = (await res.json()) as {
      name: string;
      src: string;
      item?: number | string;
      key?: ShapeKey;
      format?: string;
    }[];
    const out: Partial<Record<ShapeKey, Shape>> = {};
    await Promise.all(
      entries.map(async (entry) => {
        // key names a standalone shape (the logo); item is the accordion item, 1-based, or a figure name.
        const name: ShapeKey | undefined =
          entry.key ??
          (typeof entry.item === 'number' ? FIGURE_NAMES[entry.item - 1] : FIGURE_NAMES.find((f) => f === entry.item));
        if (!name) return;
        try {
          if (entry.format !== 'f32xyzb') throw new Error(`unknown format ${entry.format}`);
          const r = await fetch(entry.src);
          if (!r.ok) throw new Error(`${entry.src} ${r.status}`);
          const f = new Float32Array(await r.arrayBuffer());
          if (f.length < n * 4) throw new Error('not enough points');
          const positions = new Float32Array(n * 3);
          const bright = new Float32Array(n);
          for (let i = 0; i < n; i++) {
            positions.set(f.subarray(i * 4, i * 4 + 3), i * 3);
            bright[i] = f[i * 4 + 3];
          }
          out[name] = boundsShape(positions, bright);
        } catch (err) {
          console.warn(`Figure ${entry.name} failed; using the procedural shape.`, err);
        }
      }),
    );
    return out;
  } catch {
    if (!figureFallbackLogged) {
      figureFallbackLogged = true;
      console.info('Figure models unavailable; using procedural figures.');
    }
    return {};
  }
}

// Portrait sampling is the hero; if it fails, a field stands in with flat luminance.
async function loadPortrait(count: number): Promise<{ positions: Float32Array; lum: Float32Array }> {
  try {
    return samplePortrait(await loadImage('/images/portrait.png'), count);
  } catch (err) {
    console.warn('Portrait sampling failed; using field fallback.', err);
    return { positions: buildField(count), lum: new Float32Array(count).fill(0.5) };
  }
}

export interface BaseAssets {
  portrait: { positions: Float32Array; lum: Float32Array };
  n: number;
  field: Float32Array;
  seed: Float32Array;
  globe: Shape;
  mapShape: Shape;
  usaShape: Shape;
}

// Fetches the portrait and geo data and builds the hero, globe, Argentina and USA shapes. Resolves null when
// cancelled() turns true while the fetches were in flight.
export async function loadBaseAssets(count: number, cancelled: () => boolean): Promise<BaseAssets | null> {
  const [portrait, land, map, usa] = await Promise.all([
    loadPortrait(count),
    loadGeo(GEO.land),
    loadGeo(GEO.argentina),
    loadGeo(GEO.usa),
  ]);
  if (cancelled()) return null;

  const missing = [land ? null : 'globe', map ? null : 'argentina', usa ? null : 'usa'].filter(Boolean);
  if (missing.length) {
    console.warn(`Geo data unavailable for ${missing.join(', ')}; using fallback shapes instead.`);
  }

  const n = portrait.positions.length / 3;
  const field = buildField(n);
  const seed = new Float32Array(n);
  for (let i = 0; i < n; i++) seed[i] = Math.random();

  const fallback = (): Shape => ({ positions: field, bright: seed, width: 0, height: 0, focus: [0, 0] });
  return {
    portrait,
    n,
    field,
    seed,
    globe: land ? buildGlobe(n, land) : fallback(),
    mapShape: map ? buildArgentina(n, map) : fallback(),
    usaShape: usa ? buildUsa(n, usa) : fallback(),
  };
}

// Accordion figures plus the ICVM logo: real clouds when the manifest has them, procedural otherwise.
export async function loadFigureShapes(base: BaseAssets): Promise<Partial<Record<ShapeKey, Shape>>> {
  const { n, field, seed } = base;
  const real = await loadFigureClouds(n);
  const out: Partial<Record<ShapeKey, Shape>> = {};
  for (const name of FIGURE_NAMES) out[name] = real[name] ?? buildFigure(name, n);
  out['icvm-logo'] = real['icvm-logo'] ?? { positions: field, bright: seed, width: 0, height: 0, focus: [0, 0] };
  return out;
}
