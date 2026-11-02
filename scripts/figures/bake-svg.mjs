// Bakes the unDraw illustrations in scripts/figures/svg/ into point clouds for the accordion figures.
// Usage: node scripts/figures/bake-svg.mjs [--out <dir>]
// Requires ImageMagick (`magick`) on PATH to rasterize the SVGs.
//
// Output per figure: <name>.bin = Float32 [x, y, z, bright] x COUNT, little-endian ("f32xyzb"), same format
// as bake-models.mjs, so the particle controller loads it unchanged. Points are shuffled with a seeded RNG,
// so any prefix is a uniform subsample (mobile reads the first 6000).

import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, '..', '..');
const COUNT = 14000;
const HEIGHT = 3.2; // matches PORTRAIT_H
const RASTER_W = 900;
const EDGE_WEIGHT = 30; // edge pixels are sampled 30x as often as interior ones, so outlines stay crisp
const DEPTH = 0.12; // colour classes sit on slightly different planes so the scroll rotation shows depth

// item: accordion item (1-based), matched to the item copy in src/i18n/ui.ts. light: optional brightness for
// light-grey shapes. flameShare: share of points on the flame. outline: brightness factor for non-flame points.
// drop: 1-based shape elements to remove before rasterizing. flame: the #ff7a00 shapes are
// flame points, flagged with bright in (1, 2] (the shader flickers them when uFlame > 0).
export const FIGURES = [
  { name: 'architecture', svg: 'undraw_database-tables_yft5.svg', item: 1 }, // components wired together
  { name: 'platform', svg: 'undraw_key-insights_ex8y.svg', item: 2 }, // one core feeding several outputs
  { name: 'cloud', svg: 'undraw_server-status_7viz.svg', item: 3 }, // healthy server stack
  { name: 'security', svg: 'undraw_fingerprint_kdwq.svg', item: 4 }, // identity and protection
  { name: 'performance', svg: 'rocket.svg', item: 5, flame: true, flameShare: 0.58, outline: 0.7 }, // slender rocket
];

// Standalone shapes, not accordion items: key is the shape name the controller loads. accentRed: the red mark is
// the brightest class (bright 1), so the logo's colour reads as the accent rather than as ink. edgeWeight: 1 samples
// edge and interior pixels alike, so the letters read as solid fills instead of outlines.
export const SHAPES = [
  { name: 'icvm-logo', svg: 'icvm-hawk-logo.svg', key: 'icvm-logo', seed: 9001, accentRed: true, edgeWeight: 1 },
];

function mulberry32(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// drop: 1-based indexes of shape elements (path, rect, circle, ellipse, in document order) to remove before
// rasterizing, for decoration that competes with the subject. The source SVG on disk stays untouched.
function rasterize(svgPath, drop = []) {
  let index = 0;
  const svg = readFileSync(svgPath, 'utf8').replace(/<(path|rect|circle|ellipse)\b[^>]*>/g, (el) => (drop.includes(++index) ? '' : el));
  const run = (args) => execFileSync('magick', ['-background', 'none', 'svg:-', '-resize', `${RASTER_W}x`, ...args], { input: svg, maxBuffer: 64 * 1024 * 1024 });
  const [w, h] = run(['-format', '%w %h', 'info:']).toString().trim().split(/\s+/).map(Number);
  return { w, h, rgba: run(['-depth', '8', 'rgba:-']) };
}

// Maps an illustration colour to a particle class: accent -> brightest, dark ink -> bright, light grey -> dim.
// Near-white fills (box interiors) are dropped so shapes read as outlines on the dark background.
// Shared class objects, so edge detection can compare neighbours by identity.
const ACCENT = { bright: 1, z: DEPTH };
const WARM = { bright: 0.7, z: DEPTH / 2 };
const INK = { bright: 0.85, z: 0 };
const LIGHT = { bright: 0.35, z: -DEPTH };

// Flame class: flame orange (#ff7a00, hue ~29 deg) only, and only for figures that opt in.
const FLAME = { bright: 1, z: 0 };

function classify(r, g, b, flame, accentRed = false) {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const sat = max === 0 ? 0 : (max - min) / max;
  const lum = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
  if (lum > 0.97) return null;
  const hue = max === min ? 0 : 60 * ((g - b) / (max - min));
  if (flame && r === max && sat > 0.6 && hue >= 15 && hue <= 45) return FLAME;
  if (accentRed && r === max && sat > 0.5) return ACCENT; // the logo's red mark, #E41E1E
  if (sat > 0.35 && b > r) return ACCENT; // accent purple
  if (sat > 0.25) return WARM; // skin and other warm tones
  if (lum < 0.4) return INK; // dark ink
  return LIGHT; // light grey details
}

function bake(
  { w, h, rgba },
  seed,
  { light = LIGHT.bright, flame = false, flameShare = 0.22, outline = 1, accentRed = false, edgeWeight = EDGE_WEIGHT } = {},
) {
  const cls = new Array(w * h).fill(null);
  for (let i = 0; i < w * h; i++) {
    if (rgba[i * 4 + 3] < 128) continue;
    cls[i] = classify(rgba[i * 4], rgba[i * 4 + 1], rgba[i * 4 + 2], flame, accentRed);
  }
  const pixels = [];
  const weights = [];
  const flames = [];
  let total = 0;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const c = cls[y * w + x];
      if (!c) continue;
      if (c === FLAME) {
        flames.push(y * w + x);
        continue;
      }
      const edge = [
        [1, 0],
        [-1, 0],
        [0, 1],
        [0, -1],
      ].some(([dx, dy]) => {
        const nx = x + dx;
        const ny = y + dy;
        return nx < 0 || ny < 0 || nx >= w || ny >= h || cls[ny * w + nx] !== c;
      });
      total += edge ? edgeWeight : 1;
      pixels.push(y * w + x);
      weights.push(total);
    }
  }
  let minX = w;
  let maxX = 0;
  let minY = h;
  let maxY = 0;
  for (const p of [...pixels, ...flames]) {
    const x = p % w;
    const y = (p - x) / w;
    minX = Math.min(minX, x);
    maxX = Math.max(maxX, x);
    minY = Math.min(minY, y);
    maxY = Math.max(maxY, y);
  }
  const k = HEIGHT / (maxY - minY + 1);
  const cx = (minX + maxX + 1) / 2;
  const cy = (minY + maxY + 1) / 2;
  const rand = mulberry32(seed);
  const f = new Float32Array(COUNT * 4);
  for (let i = 0; i < COUNT; i++) {
    // Flame points are uniform over the flame interior (no edge weighting), at a fixed share of the count.
    const inFlame = flames.length > 0 && rand() < flameShare;
    let p;
    if (inFlame) {
      p = flames[Math.floor(rand() * flames.length)];
    } else {
      const t = rand() * total;
      let lo = 0;
      let hi = weights.length - 1;
      while (lo < hi) {
        const mid = (lo + hi) >> 1;
        if (weights[mid] < t) lo = mid + 1;
        else hi = mid;
      }
      p = pixels[lo];
    }
    const x = p % w;
    const y = (p - x) / w;
    const c = cls[p];
    // Flame brightness is 1 + (0, 1], so the shader can read bright > 1 as the flame flag.
    const b = c === FLAME ? 2 - rand() : (c === LIGHT ? light : c.bright) * outline;
    f.set([(x + rand() - cx) * k, (cy - y - rand()) * k, c.z + (rand() - 0.5) * 0.04, b], i * 4);
  }
  return f; // sampling is i.i.d., so the order is already a uniform shuffle
}

async function main() {
  const outIdx = process.argv.indexOf('--out');
  const outDir = outIdx > -1 ? process.argv[outIdx + 1] : join(root, 'public', 'images', 'figures');
  await mkdir(outDir, { recursive: true });
  for (const fig of FIGURES) {
    const f = bake(rasterize(join(here, 'svg', fig.svg), fig.drop), 1234 + fig.item, fig);
    await writeFile(join(outDir, `${fig.name}.bin`), Buffer.from(f.buffer));
    console.log(`${fig.name}: ${fig.svg}`);
  }
  for (const shape of SHAPES) {
    const f = bake(rasterize(join(here, 'svg', shape.svg)), shape.seed, shape);
    await writeFile(join(outDir, `${shape.name}.bin`), Buffer.from(f.buffer));
    console.log(`${shape.name}: ${shape.svg}`);
  }
  const manifest = [
    ...FIGURES.map((m) => ({ name: m.name, src: `/images/figures/${m.name}.bin`, item: m.item, format: 'f32xyzb' })),
    ...SHAPES.map((m) => ({ name: m.name, src: `/images/figures/${m.name}.bin`, key: m.key, format: 'f32xyzb' })),
  ];
  await writeFile(join(outDir, 'manifest.json'), JSON.stringify(manifest, null, 2) + '\n');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
