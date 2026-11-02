import type * as THREE from 'three';
import { FLOOD_LEVEL, sampleBilinear, type GeoData } from '../data';
import type { Model, ModelResult } from '../model';
import { DEFAULT_RAIN_INDEX } from '../model';
import { createLayer } from './base';
import { encodeField } from './fieldTexture';
import { MARKER_RIM, MARKER_Y, MOBILE_SCALE } from './markers';
import { addPlate, addFloodWash, createPlateMaterial } from './plateMaterial';
import { addRoads, distanceToRoads, roadSegments, type RoadTones } from './roads';
import { createMarkers, type MarkerStyle } from './schools';
import { ACCESS_DARK, ACCESS_LIGHT, srgbArray, type Rgb } from '../palette';
import { isDarkTheme } from './ramps';
import type { LayerBuilder, LayerHandle, Palette } from './types';

// Access: a cool slate plate with the flooded extent as a translucent blue wash. Roads sit in three
// tiers, and the links the water cuts are terracotta. Schools are one of two sizes with a soft
// halo: exposed ones are larger and warm, the rest small and neutral. A school is exposed when it
// stands on flooded ground, sits on a cut-off road, or the model exposes it at the current rain.
// Receded, the roads, wash and markers fade with the layer, so they never float over the layer above.
// Sizes are CSS pixels.

const SIZE_OTHER_PX = 5;
const SIZE_EXPOSED_PX = 7;
const HALO_PX = 3;
const RECEDED_ALPHA = 0.3;
const WASH_LIFT = 0.004; // plate units, above the plate and below the roads
const ROAD_TOUCH = 0.006; // plate units: a school this close to a cut-off road sits on it
// Markers vanish entirely when the layer is receded; roads and the wash keep RECEDED_ALPHA.
const MARKER_STYLE: MarkerStyle = { haloPx: HALO_PX, recedeAlpha: 0 };

type AccessColours = Record<keyof typeof ACCESS_DARK, string>;

interface Tones {
  other: Rgb;
  exposed: Rgb;
  plate: Rgb;
  wash: Rgb;
  roads: RoadTones;
  rim: number; // marker rim gain
  shade: number; // plate hillshade detail, 1 = full
}

const toneSet = (c: AccessColours, rim: number, shade: number): Tones => ({
  other: srgbArray(c.other),
  exposed: srgbArray(c.exposed),
  plate: srgbArray(c.plate),
  wash: srgbArray(c.wash),
  roads: {
    casing: srgbArray(c.casing),
    primary: srgbArray(c.primary),
    secondary: srgbArray(c.secondary),
    tertiary: srgbArray(c.tertiary),
    cut: srgbArray(c.exposed),
  },
  rim,
  shade,
});

const DARK = toneSet(ACCESS_DARK, MARKER_RIM.dark, 1); // full hillshade detail
const LIGHT = toneSet(ACCESS_LIGHT, MARKER_RIM.light, 0.35); // faint hillshade on the pale plate

export const buildAccess: LayerBuilder = (data: GeoData, ctx, model: Model): LayerHandle => {
  const base = createLayer(ctx.shared);

  // The plate is the hillshade multiplied by a cool tint; the tint is repainted per theme.
  const plate = createPlateMaterial(ctx.shared.hillshade, ctx.shared.footprint);
  const tint = plate.uniforms.uTint.value as THREE.Vector3;
  addPlate(base, plate, 1, 1);

  // The flood field is the same 0..1 hazard grid the model and the cut-off test read.
  const washColour = addFloodWash(
    base,
    encodeField(data.flood, data.grid),
    ctx.shared.footprint,
    RECEDED_ALPHA,
    WASH_LIFT,
  );

  const segments = roadSegments(data);
  const setRoadTones = addRoads(base, segments, RECEDED_ALPHA);

  // Static part of exposure, decided once: flooded ground, or a school on a cut-off road.
  const cutRoads = segments.filter((s) => s.cut);
  const count = data.schools.length;
  const cutSchool = data.schools.map(
    (s) =>
      sampleBilinear(data.flood, data.grid, s.x, s.y) >= FLOOD_LEVEL ||
      distanceToRoads(s.x, s.y, cutRoads) <= ROAD_TOUCH,
  );

  const markers = createMarkers(base, data, MARKER_Y, MARKER_STYLE);
  const exposed = new Uint8Array(count);
  const sizes = new Float32Array(count);
  const colours = new Float32Array(count * 3);

  const scale = ctx.mobile ? MOBILE_SCALE : 1;
  let tones = DARK;
  const writeMarkers = (): void => {
    for (let i = 0; i < count; i++) {
      const c = exposed[i] ? tones.exposed : tones.other;
      sizes[i] = (exposed[i] ? SIZE_EXPOSED_PX : SIZE_OTHER_PX) * scale;
      colours[i * 3] = c[0];
      colours[i * 3 + 1] = c[1];
      colours[i * 3 + 2] = c[2];
    }
    markers.set(sizes, colours);
  };

  const readExposure = (r: ModelResult): void => {
    for (let i = 0; i < count; i++) exposed[i] = cutSchool[i] || r.schools[i]?.exposed ? 1 : 0;
  };
  readExposure(model.evaluate(DEFAULT_RAIN_INDEX));
  writeMarkers();

  // Theme tones are applied here, not at build time, so a live theme switch repaints every part.
  const paint = (p: Palette): void => {
    base.paint(p);
    const dark = isDarkTheme(p);
    tones = dark ? DARK : LIGHT;
    tint.set(...tones.plate);
    plate.uniforms.uShade.value = tones.shade;
    washColour.set(...tones.wash);
    setRoadTones(tones.roads);
    markers.setRim(tones.rim);
    writeMarkers();
  };
  paint(ctx.palette);

  return {
    ...base,
    paint,
    update: (r: ModelResult) => {
      readExposure(r);
      writeMarkers();
    },
    tick: () => markers.sync(),
  };
};
