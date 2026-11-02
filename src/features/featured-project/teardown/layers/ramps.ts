import {
  RISK_DARK,
  RISK_LIGHT,
  srgbArray,
  srgbArrayOf,
  TERRAIN_DARK,
  TERRAIN_LIGHT,
  type Rgb,
} from '../palette';
import type { Palette } from './types';

// Map tones are chosen per theme from palette.ts. The dark theme uses darker plates so they sit on
// the page background. UI colours still come from the palette tokens.

const LUT_SIZE = 256;

export const isDarkTheme = (p: Palette): boolean => {
  const [r, g, b] = srgbArrayOf(p.base);
  return r + g + b < 1.2;
};

export interface Tones {
  low: Rgb; // valley floor
  high: Rgb; // highland
  shallow: Rgb; // water, just covered
  deep: Rgb; // water, deepest
  plate: Rgb; // neutral plate under the access layer
}

export const terrainTones = (dark: boolean): Tones => {
  const c = dark ? TERRAIN_DARK : TERRAIN_LIGHT;
  return {
    low: srgbArray(c.low),
    high: srgbArray(c.high),
    shallow: srgbArray(c.shallow),
    deep: srgbArray(c.deep),
    plate: srgbArray(c.plate),
  };
};

export interface RiskTones {
  plate: Rgb; // underlay with no imagery
  underlay: number; // satellite brightness multiplier
  sand: Rgb; // overlay at mid exposure, muted
  brick: Rgb; // overlay at high exposure, muted, under 45% saturation
}

// Light stops sit a little brighter so the overlay still reads on the light page background.
export const riskTones = (dark: boolean): RiskTones =>
  dark
    ? {
        plate: terrainTones(true).plate,
        underlay: 0.55,
        sand: srgbArray(RISK_DARK.sand),
        brick: srgbArray(RISK_DARK.brick),
      }
    : {
        plate: terrainTones(false).plate,
        underlay: 0.82,
        sand: srgbArray(RISK_LIGHT.sand),
        brick: srgbArray(RISK_LIGHT.brick),
      };

// Returns LUT_SIZE * 3 bytes (r, g, b) for t in 0..1, linearly interpolated between the stops.
export function makeLut(stops: readonly string[]): Uint8ClampedArray {
  const colours = stops.map((stop) => srgbArray(stop));
  const lut = new Uint8ClampedArray(LUT_SIZE * 3);
  for (let i = 0; i < LUT_SIZE; i++) {
    const f = (i / (LUT_SIZE - 1)) * (colours.length - 1);
    const k = Math.min(colours.length - 2, Math.floor(f));
    const t = f - k;
    for (let c = 0; c < 3; c++) {
      lut[i * 3 + c] = Math.round(255 * (colours[k][c] + (colours[k + 1][c] - colours[k][c]) * t));
    }
  }
  return lut;
}

export const LUT_MAX = LUT_SIZE - 1;
