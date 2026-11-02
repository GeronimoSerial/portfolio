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

// Access layer: the plate, the flood wash, the road tiers and the school markers. `exposed` is also
// the cut-off road colour, so a cut link and an exposed school share the warm accent.
export const ACCESS_DARK = {
  other: '#d8d8d4', // school without exposure
  exposed: '#b9826b', // school with exposure; also cut-off roads
  plate: '#4a5562', // cool slate under the access layer, lifted from the old near-black plate
  wash: '#5f93ad', // flooded extent, translucent cool blue
  primary: '#dfe3e6', // national road
  secondary: '#9aa4ae', // provincial road
  tertiary: '#7d8793', // tertiary road, dimmest
  casing: '#2a3138', // dark edge under national roads
} as const;

export const ACCESS_LIGHT = {
  other: '#8a8990', // school without exposure, mid grey on the pale plate
  exposed: '#b5735c', // school with exposure; also cut-off roads
  plate: '#d9dee3', // cool pale plate under the access layer
  wash: '#6f9bb3', // flooded extent, translucent cool blue
  primary: '#3f4852', // national road, darkest on the pale plate
  secondary: '#6f7985', // provincial road
  tertiary: '#9aa3ad', // tertiary road, dimmest
  casing: '#f4f6f7', // pale edge under national roads
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

// --- satellites ---
// Satellite materials and the scan paint ramp (sRGB hex). The light variants are deeper so the
// spacecraft and the paint read on the pale page.
// Sober instrument colours: a graphite body, dark panels, a light antenna. Gold foil read like a toy.
export const SATELLITE_DARK = {
  foil: '#aab0b9', // body
  wing: '#25344f', // solar wings
  dish: '#e3e6eb', // antenna
  beam: '#cfe3ea', // scan line and footprint ring
} as const;

export const SATELLITE_LIGHT = {
  foil: '#6c7480',
  wing: '#1b2a47',
  dish: '#99a0aa',
  beam: '#33566b',
} as const;

// Precipitation ramp for the scan paint, cool to warm, low to high, modest saturation.
// The risk gamut of the real platform: low (green) through yellow and orange to high (red).
export const SCAN_RAMP_DARK: readonly string[] = ['#1f9d4c', '#8cc63f', '#f0df4b', '#f29b1d', '#c62828'];
export const SCAN_RAMP_LIGHT: readonly string[] = ['#188a40', '#7ab22f', '#e0cd34', '#e08a0c', '#b71f1f'];
