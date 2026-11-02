// Renders baked .bin clouds as white dots on #1F1E21 (orthographic, front view) into one sheet.
// Usage: node scripts/figures/preview-models.mjs <sheet.png> <file.bin> [more.bin ...]
import { createRequire } from 'node:module';
import { readFile } from 'node:fs/promises';
import { realpathSync } from 'node:fs';
import { basename } from 'node:path';

const [sheetPath, ...files] = process.argv.slice(2);
const TILE = 560;
const PX = 150; // px per world unit, as 3.2 units tall fits a 480 px figure
const COUNT = 14000;

const req = createRequire(import.meta.url);
const sharp = (await import(createRequire(realpathSync(req.resolve('astro/package.json'))).resolve('sharp'))).default;

const cols = Math.min(files.length, 3);
const rows = Math.ceil(files.length / cols);
const W = cols * TILE;
const H = rows * TILE;
const img = Buffer.alloc(W * H * 3);
for (let i = 0; i < W * H; i++) img.set([0x1f, 0x1e, 0x21], i * 3);

for (const [ti, file] of files.entries()) {
  const buf = await readFile(file);
  const f = new Float32Array(buf.buffer, buf.byteOffset, buf.byteLength / 4);
  // fit: scale so the cloud fits the tile with margin
  let minX = 1e9, maxX = -1e9, minY = 1e9, maxY = -1e9;
  for (let i = 0; i < COUNT; i++) {
    minX = Math.min(minX, f[i * 4]); maxX = Math.max(maxX, f[i * 4]);
    minY = Math.min(minY, f[i * 4 + 1]); maxY = Math.max(maxY, f[i * 4 + 1]);
  }
  const s = Math.min(PX, (TILE * 0.86) / (maxX - minX), (TILE * 0.86) / (maxY - minY));
  const ox = (ti % cols) * TILE + TILE / 2;
  const oy = Math.floor(ti / cols) * TILE + TILE / 2;
  const cx = (minX + maxX) / 2;
  const cy = (minY + maxY) / 2;
  for (let i = 0; i < COUNT; i++) {
    const x = Math.round(ox + (f[i * 4] - cx) * s);
    const y = Math.round(oy - (f[i * 4 + 1] - cy) * s);
    // same alpha law as the particle shader: 0.62 * (0.5 + 0.5 * bright)
    const a = 0.62 * (0.5 + 0.5 * f[i * 4 + 3]) * 1.4;
    for (let dy = 0; dy <= 1; dy++)
      for (let dx = 0; dx <= 1; dx++) {
        const px = x + dx;
        const py = y + dy;
        if (px < 0 || py < 0 || px >= W || py >= H) continue;
        const o = (py * W + px) * 3;
        for (let c = 0; c < 3; c++) img[o + c] = Math.min(255, img[o + c] + (255 - img[o + c]) * a);
      }
  }
  console.log(`${ti}: ${basename(file)}`);
}
await sharp(img, { raw: { width: W, height: H, channels: 3 } }).png().toFile(sheetPath);
