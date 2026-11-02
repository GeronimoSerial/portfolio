// Samples the approved portrait into a point cloud. Silhouette comes from the sharp alpha;
// luminance comes from a blurred copy so facial features dissolve into broad shading.

export const PORTRAIT_H = 3.2;

const ALPHA_CUT = 128;
const BLUR_RATIO = 0.02;
const DEPTH_RATIO = 0.45;

function readPixels(img: HTMLImageElement, W: number, H: number, blurPx: number): Uint8ClampedArray {
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
  if (!ctx) throw new Error('2D canvas context unavailable');
  if (blurPx > 0) ctx.filter = `blur(${blurPx}px)`;
  ctx.drawImage(img, 0, 0);
  return ctx.getImageData(0, 0, W, H).data;
}

// Rows of the sharp silhouette: left and right alpha edges, or -1 for empty rows.
function rowExtents(sharp: Uint8ClampedArray, W: number, H: number) {
  const left = new Int32Array(H).fill(-1);
  const right = new Int32Array(H).fill(-1);
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      if (sharp[(y * W + x) * 4 + 3] < ALPHA_CUT) continue;
      if (left[y] < 0) left[y] = x;
      right[y] = x;
    }
  }
  return { left, right };
}

// Returns n xyz positions and the matching luminance per point (0..1, blurred copy).
export function samplePortrait(
  img: HTMLImageElement,
  target: number,
): { positions: Float32Array; lum: Float32Array } {
  const W = img.naturalWidth;
  const H = img.naturalHeight;
  const sharp = readPixels(img, W, H, 0);
  const blurred = readPixels(img, W, H, Math.round(W * BLUR_RATIO));

  // Luminance of the blurred copy, un-premultiplied by its own alpha.
  const blurLum = (o: number) =>
    (0.299 * blurred[o] + 0.587 * blurred[o + 1] + 0.114 * blurred[o + 2]) / 255 /
    Math.max(0.05, blurred[o + 3] / 255);

  const unit = PORTRAIT_H / H;
  const { left, right } = rowExtents(sharp, W, H);

  let minLeft = W;
  let maxRight = 0;
  for (let y = 0; y < H; y++) {
    if (left[y] < 0) continue;
    minLeft = Math.min(minLeft, left[y]);
    maxRight = Math.max(maxRight, right[y]);
  }
  const figureWidth = Math.max(0, maxRight - minLeft) * unit;
  const depth = DEPTH_RATIO * figureWidth;

  // Estimate the visible mass so the grid step lands near the requested count.
  let mass = 0;
  for (let p = 0; p < W * H; p++) {
    const o = p * 4;
    if (sharp[o + 3] < ALPHA_CUT) continue;
    mass += 0.18 + 0.82 * Math.min(1, blurLum(o));
  }

  const step = Math.max(1, Math.sqrt(mass / target));
  const out: number[] = [];
  const lumOut: number[] = [];
  for (let gy = 0; gy < H; gy += step) {
    for (let gx = 0; gx < W; gx += step) {
      const x = gx + (Math.random() - 0.5) * step;
      const y = gy + (Math.random() - 0.5) * step;
      const ix = Math.min(W - 1, Math.max(0, Math.round(x)));
      const iy = Math.min(H - 1, Math.max(0, Math.round(y)));
      const o = (iy * W + ix) * 4;
      if (sharp[o + 3] < ALPHA_CUT) continue;

      const L = Math.min(1, blurLum(o));
      // Dissolve the lower 22% of the photo so the crop edge never reads as a cut.
      const fade = Math.min(1, Math.max(0, (H - iy) / (H * 0.22)));
      if (Math.random() > (0.18 + 0.82 * L) * fade * fade) continue;

      // Cylindrical bulge across this row's silhouette. The -1 keeps the centre line at the
      // mockup depth, so the frontal face is not pushed toward the camera.
      const l = left[iy] < 0 ? ix : left[iy];
      const r = right[iy] < 0 ? ix : right[iy];
      const half = Math.max(1, (r - l) / 2);
      const u = Math.min(1, Math.max(-1, (ix - (l + r) / 2) / half));
      const bulge = (Math.sqrt(Math.max(0, 1 - u * u)) - 1) * depth;

      out.push((ix - W / 2) * unit, (H - iy) * unit, (L - 0.5) * 0.35 + Math.random() * 0.04 + bulge);
      lumOut.push(L);
    }
  }
  return { positions: Float32Array.from(out), lum: Float32Array.from(lumOut) };
}
