import * as THREE from 'three';
import type { Palette } from './types';

// Map colours are fixed, restrained hexes, with a darker set for the dark theme so the plates sit
// on the page background. UI colours still come from the palette tokens.

export type Rgb = [number, number, number]; // 0..1, sRGB values (raw, for ShaderMaterial uniforms)

const LUT_SIZE = 256;

export function hex(value: string): Rgb {
  const n = parseInt(value.slice(1), 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
}

// Palette token to raw sRGB. THREE stores colours in linear space; shaders need the sRGB values.
export function srgb(c: THREE.Color): Rgb {
  const n = c.getHex(THREE.SRGBColorSpace);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
}

export const isDarkTheme = (p: Palette): boolean => {
  const [r, g, b] = srgb(p.base);
  return r + g + b < 1.2;
};

export interface Tones {
  low: Rgb; // valley floor
  high: Rgb; // highland
  shallow: Rgb; // water, just covered
  deep: Rgb; // water, deepest
  plate: Rgb; // neutral plate under the access layer
}

export const terrainTones = (dark: boolean): Tones =>
  dark
    ? {
        low: hex('#5f6349'),
        high: hex('#9c9274'),
        shallow: hex('#6b7b82'),
        deep: hex('#414f56'),
        plate: hex('#3a3c3b'),
      }
    : {
        low: hex('#c5c7a2'),
        high: hex('#e9dfc2'),
        shallow: hex('#5d7681'),
        deep: hex('#2c4049'),
        plate: hex('#e3e0d8'),
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
    ? { plate: terrainTones(true).plate, underlay: 0.55, sand: hex('#8f8068'), brick: hex('#a66f5c') }
    : { plate: terrainTones(false).plate, underlay: 0.82, sand: hex('#c2ab84'), brick: hex('#c08a72') };

// Returns LUT_SIZE * 3 bytes (r, g, b) for t in 0..1, linearly interpolated between the stops.
export function makeLut(stops: string[]): Uint8ClampedArray {
  const colours = stops.map(hex);
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
