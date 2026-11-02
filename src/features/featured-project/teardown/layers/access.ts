import * as THREE from 'three';
import type { GeoData } from '../data';
import type { Model, ModelResult } from '../model';
import { DEFAULT_RAIN_INDEX } from '../model';
import { createLayer } from './base';
import { addRoads } from './roads';
import { MARKER_RIM, MARKER_Y, MOBILE_SCALE } from './markers';
import { createMarkers } from './schools';
import { addPlate, createPlateMaterial } from './plateMaterial';
import { ACCESS_DARK, ACCESS_LIGHT, srgbArray } from '../palette';
import { isDarkTheme, terrainTones } from './ramps';
import type { LayerBuilder, LayerHandle, Palette } from './types';

// Access: an opaque neutral plate under the roads and the school markers. Exposed schools are
// larger and warm muted; the rest are small and neutral. Sizes are CSS pixels. The light theme
// uses a pale plate with a faint hillshade and a mid-grey marker with a lighter rim.

const SIZE_OTHER_PX = 5;
const SIZE_EXPOSED_PX = 7;
const DARK = {
  other: srgbArray(ACCESS_DARK.other),
  exposed: srgbArray(ACCESS_DARK.exposed),
  rim: MARKER_RIM.dark, // darker rim
  shade: 1, // full hillshade detail
};
const LIGHT = {
  other: srgbArray(ACCESS_LIGHT.other),
  exposed: srgbArray(ACCESS_LIGHT.exposed),
  rim: MARKER_RIM.light, // lighter rim, so the mid-grey dot separates from the pale plate
  shade: 0.35, // faint hillshade on the pale plate
};

export const buildAccess: LayerBuilder = (data: GeoData, ctx, model: Model): LayerHandle => {
  const base = createLayer(ctx.shared);
  // The plate is the hillshade multiplied by a neutral tint: a quiet, desaturated base.
  const plate = createPlateMaterial(ctx.shared.hillshade, ctx.shared.footprint);
  const tint = plate.uniforms.uTint.value as THREE.Vector3;
  addPlate(base, plate, 1, 1);
  addRoads(base, data);

  const markers = createMarkers(base, data, MARKER_Y);
  const count = data.schools.length;
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
    for (let i = 0; i < count; i++) exposed[i] = r.schools[i]?.exposed ? 1 : 0;
  };
  readExposure(model.evaluate(DEFAULT_RAIN_INDEX));
  writeMarkers();

  // Theme tones are applied here, not at build time, so a live theme switch repaints the markers.
  const paint = (p: Palette): void => {
    base.paint(p);
    const dark = isDarkTheme(p);
    tones = dark ? DARK : LIGHT;
    tint.set(...terrainTones(dark).plate);
    plate.uniforms.uShade.value = tones.shade;
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
