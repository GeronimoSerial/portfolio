import * as THREE from 'three';

// The map's own colours. Every hardcoded colour in the teardown lives here, named for what it
// colours. Hex strings are sRGB, as written in design. The two consumers need different spaces,
// so the conversion is explicit: shader uniforms and vertex attributes take raw sRGB (srgbArray),
// THREE.Color takes linear values (linearColor, linearRgbColor). Theme UI colours (bg, ink, accent,
// muted) are not here: scene.ts reads them from CSS tokens.

export type Rgb = [number, number, number]; // 0..1

// Hex string to raw sRGB, 0..1. For ShaderMaterial uniforms, LUT bytes and vertex attributes.
export function srgbArray(value: string): Rgb {
  const n = parseInt(value.slice(1), 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
}

// Existing THREE.Color (linear working space) back to raw sRGB, 0..1, for shader uniforms.
export function srgbArrayOf(color: THREE.Color): Rgb {
  const n = color.getHex(THREE.SRGBColorSpace);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
}

// THREE.Color from a hex string. THREE converts the sRGB hex to its linear working space.
export function linearColor(value: string): THREE.Color {
  return new THREE.Color(value);
}

// THREE.Color from values that are already linear. No sRGB conversion happens.
export function linearRgbColor(rgb: Rgb): THREE.Color {
  return new THREE.Color(rgb[0], rgb[1], rgb[2]);
}

// Terrain (territory plate): valley floor, highland, water and the plate under the access layer.
// The light theme uses a paler, bluer water.
export const TERRAIN_DARK = {
  low: '#5f6349', // valley floor
  high: '#9c9274', // highland
  shallow: '#6b7b82', // water, just covered
  deep: '#414f56', // water, deepest
  plate: '#3a3c3b', // neutral plate under the access layer
} as const;

export const TERRAIN_LIGHT = {
  low: '#c5c7a2', // valley floor
  high: '#e9dfc2', // highland
  shallow: '#5d7681', // water, just covered
  deep: '#2c4049', // water, deepest
  plate: '#e3e0d8', // neutral plate under the access layer
} as const;

// Access school markers: neutral when not exposed, warm when exposed.
export const ACCESS_DARK = {
  other: '#d8d8d4', // school without exposure
  exposed: '#b9826b', // school with exposure
} as const;

export const ACCESS_LIGHT = {
  other: '#8a8990', // school without exposure, mid grey on the pale plate
  exposed: '#b5735c', // school with exposure
} as const;

// Risk overlay on the satellite: sand at mid exposure, brick at high exposure, both muted.
export const RISK_DARK = {
  sand: '#8f8068',
  brick: '#a66f5c',
} as const;

export const RISK_LIGHT = {
  sand: '#c2ab84',
  brick: '#c08a72',
} as const;

// Risk school markers: colour ramps from no exposure (first stop) to full exposure (last stop).
export const MARKER_RAMP_DARK: readonly string[] = ['#8d8c86', '#f2d6a6'];
export const MARKER_RAMP_LIGHT: readonly string[] = ['#8a8990', '#b5735c'];

// Clouds on the light theme: a lit top and a softer underside. The deck body is near #B9B8BE.
export const CLOUD_LIGHT = {
  lit: '#CFCED4',
  shadow: '#A4A3AA',
} as const;

// Slab shading, linear RGB: fully lit top and a half-lit underside. Not sRGB hex values.
export const SLAB_LIT_LINEAR: Rgb = [1, 1, 1];
export const SLAB_SHADOW_LINEAR: Rgb = [0.5, 0.5, 0.5];

// Palette white for role-bearing basic materials, linear RGB.
export const WHITE_LINEAR: Rgb = [1, 1, 1];

// Footprint mask canvas: outside the province outline and inside it.
export const MASK_OUTSIDE = '#000';
export const MASK_INSIDE = '#fff';
