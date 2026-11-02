import { PLATE_SIZE, type GeoData } from '../data';
import { createCanvas2D } from './fieldTexture';
import { RELIEF_HEIGHT } from './terrain';

// Analytical hillshade computed from the heightmap, used when no pre-rendered hillshade is
// baked. Light from azimuth 315 (north-west) at altitude 45, the usual cartographic setting.
// Slopes use the same world units as the displayed relief, so the shading matches the geometry.

const DEG = Math.PI / 180;
const ZENITH = (90 - 45) * DEG;
// Maths angle of the light direction: compass 315 maps to 90 - 315 = -225, i.e. 135 degrees.
const LIGHT_ANGLE = (90 - 315 + 360) * DEG;

export function buildHillshade(data: GeoData): ReturnType<typeof createCanvas2D> {
  const n = data.grid;
  const h = data.heightmap;
  const cell = PLATE_SIZE / (n - 1);
  const out = createCanvas2D(n, n);
  const image = out.ctx.createImageData(n, n);
  const cosZ = Math.cos(ZENITH);
  const sinZ = Math.sin(ZENITH);

  for (let r = 0; r < n; r++) {
    const ru = Math.max(r - 1, 0);
    const rd = Math.min(r + 1, n - 1);
    for (let c = 0; c < n; c++) {
      const cl = Math.max(c - 1, 0);
      const cr = Math.min(c + 1, n - 1);
      // East is +col; north is -row (v grows southwards, as the plate's z does).
      const dEast = ((h[r * n + cr] - h[r * n + cl]) * RELIEF_HEIGHT) / ((cr - cl) * cell);
      const dNorth = (-(h[rd * n + c] - h[ru * n + c]) * RELIEF_HEIGHT) / ((rd - ru) * cell);
      const slope = Math.atan(Math.hypot(dEast, dNorth));
      const aspect = Math.atan2(dNorth, -dEast);
      const shade =
        cosZ * Math.cos(slope) + sinZ * Math.sin(slope) * Math.cos(LIGHT_ANGLE - aspect);
      const value = Math.round(Math.min(1, Math.max(0, shade)) * 255);
      const k = (r * n + c) * 4;
      image.data[k] = value;
      image.data[k + 1] = value;
      image.data[k + 2] = value;
      image.data[k + 3] = 255;
    }
  }
  out.ctx.putImageData(image, 0, 0);
  out.texture.needsUpdate = true;
  return out;
}
