import * as THREE from 'three';
import type { GeoData } from '../data';
import { DEFAULT_RAIN_INDEX, type Model, type ModelResult } from '../model';
import { createLayer } from './base';
import { buildHillshade } from './hillshade';
import { footprintTexture } from './fieldTexture';
import { addPlate } from './plateMaterial';
import { createMarkers } from './schools';
import { isDarkTheme, LUT_MAX, makeLut, riskTones } from './ramps';
import { riskFragment, riskVertex } from './riskShaders';
import type { Env, LayerBuilder, LayerHandle, Palette } from './types';

// Risk: the exposure surface, the same f() that scores the schools, drawn as a smooth overlay over
// an opaque satellite map (see riskShaders). School markers take their size and colour from their
// own exposure, on the same warm ramp.

const clamp01 = (v: number): number => Math.min(1, Math.max(0, v));

const CELLS = 128; // exposure grid: bilinear on the GPU, so 128 is smooth at plate scale
const SMOOTH_PASSES = 1; // one 3x3 box blur removes sampling streaks without flattening the field

// Markers: unexposed schools neutral grey, exposed ones warm. The light stops are deeper so the
// dots read on the pale page; the dark stops keep the bright sand. The rim gain is per theme too.
const MARKER_LUT = {
  dark: makeLut(['#8d8c86', '#f2d6a6']),
  light: makeLut(['#8a8990', '#b5735c']),
};
const MARKER_RIM = { dark: 0.45, light: 1.2 };
const MARKER_MIN_PX = 3; // diameter of a school with no exposure
const MARKER_SPAN_PX = 5; // extra diameter at full exposure: 8 px on desktop
const MOBILE_SCALE = 0.7;
const MARKER_Y = 0.02;

// One 3x3 box blur pass with clamped edges, from `src` into `dst`.
function blur(src: Float32Array, dst: Float32Array): void {
  for (let j = 0; j < CELLS; j++) {
    for (let i = 0; i < CELLS; i++) {
      let sum = 0;
      for (let dj = -1; dj <= 1; dj++) {
        const jj = Math.min(CELLS - 1, Math.max(0, j + dj));
        for (let di = -1; di <= 1; di++) {
          const ii = Math.min(CELLS - 1, Math.max(0, i + di));
          sum += src[jj * CELLS + ii];
        }
      }
      dst[j * CELLS + i] = sum / 9;
    }
  }
}

export const buildRisk: LayerBuilder = (data: GeoData, ctx, model: Model): LayerHandle => {
  const base = createLayer();
  let disposed = false;

  // The exposure field lives in one RGBA texture, rewritten in place on every rain step.
  const bytes = new Uint8Array(CELLS * CELLS * 4);
  const exposure = new THREE.DataTexture(bytes, CELLS, CELLS, THREE.RGBAFormat, THREE.UnsignedByteType);
  exposure.minFilter = THREE.LinearFilter;
  exposure.magFilter = THREE.LinearFilter;
  exposure.generateMipmaps = false;
  exposure.wrapS = THREE.ClampToEdgeWrapping;
  exposure.wrapT = THREE.ClampToEdgeWrapping;
  const field = new Float32Array(CELLS * CELLS);
  const scratch = new Float32Array(CELLS * CELLS);

  // 1x1 mid grey until the satellite loads; uHasSat keeps the neutral base.
  const placeholder = new THREE.DataTexture(new Uint8Array([128, 128, 128, 255]), 1, 1);
  placeholder.needsUpdate = true;
  const uniforms = {
    uSat: { value: placeholder as THREE.Texture },
    uHasSat: { value: 0 },
    uHillshade: { value: buildHillshade(data).texture as THREE.Texture },
    uExpo: { value: exposure as THREE.Texture },
    uFoot: { value: footprintTexture(data.footprint, ctx.mobile ? 256 : 512) as THREE.Texture },
    uBase: { value: new THREE.Vector3() },
    uUnderlay: { value: 0.55 },
    uSand: { value: new THREE.Vector3() },
    uBrick: { value: new THREE.Vector3() },
    uFocus: { value: 1 },
  };
  const material = new THREE.ShaderMaterial({
    uniforms,
    vertexShader: riskVertex,
    fragmentShader: riskFragment,
    side: THREE.DoubleSide, // the plate normal points down, so draw both faces
  });
  addPlate(base, material, 1, 1);

  if (data.satelliteUrl) {
    new THREE.TextureLoader().load(data.satelliteUrl, (tex) => {
      tex.flipY = false;
      tex.colorSpace = THREE.NoColorSpace;
      if (disposed) {
        tex.dispose();
        return;
      }
      placeholder.dispose();
      uniforms.uSat.value = tex;
      uniforms.uHasSat.value = 1;
    });
  }

  const draw = (rainIndex: number): void => {
    for (let j = 0; j < CELLS; j++) {
      for (let i = 0; i < CELLS; i++) {
        field[j * CELLS + i] = clamp01(model.exposureAt((i + 0.5) / CELLS, (j + 0.5) / CELLS, rainIndex));
      }
    }
    let src = field;
    let dst = scratch;
    for (let pass = 0; pass < SMOOTH_PASSES; pass++) {
      blur(src, dst);
      [src, dst] = [dst, src];
    }
    for (let k = 0; k < CELLS * CELLS; k++) {
      const v = Math.round(clamp01(src[k]) * LUT_MAX);
      bytes[k * 4] = v;
      bytes[k * 4 + 1] = v;
      bytes[k * 4 + 2] = v;
      bytes[k * 4 + 3] = 255;
    }
    exposure.needsUpdate = true;
  };

  const count = data.schools.length;
  const markers = createMarkers(base, data, MARKER_Y);
  const sizes = new Float32Array(count);
  const colours = new Float32Array(count * 3);
  const scale = ctx.mobile ? MOBILE_SCALE : 1;
  let markerLut = MARKER_LUT.dark;
  let lastResult: ModelResult = model.evaluate(DEFAULT_RAIN_INDEX);

  const writeMarkers = (r: ModelResult): void => {
    for (let i = 0; i < count; i++) {
      const e = clamp01(r.schools[i]?.exposure ?? 0);
      const c = Math.round(e * LUT_MAX) * 3;
      sizes[i] = (MARKER_MIN_PX + MARKER_SPAN_PX * e) * scale;
      colours[i * 3] = markerLut[c] / 255;
      colours[i * 3 + 1] = markerLut[c + 1] / 255;
      colours[i * 3 + 2] = markerLut[c + 2] / 255;
    }
    markers.set(sizes, colours);
  };

  // The theme sets the underlay brightness, the overlay stops and the marker ramp; the palette is
  // the only source. Markers are rewritten here so a live theme switch repaints them at once.
  const paint = (p: Palette): void => {
    base.paint(p);
    const dark = isDarkTheme(p);
    const t = riskTones(dark);
    uniforms.uBase.value.set(...t.plate);
    uniforms.uUnderlay.value = t.underlay;
    uniforms.uSand.value.set(...t.sand);
    uniforms.uBrick.value.set(...t.brick);
    markerLut = dark ? MARKER_LUT.dark : MARKER_LUT.light;
    markers.setRim(MARKER_RIM[dark ? 'dark' : 'light']);
    writeMarkers(lastResult);
  };

  draw(DEFAULT_RAIN_INDEX);
  paint(ctx.palette);

  return {
    ...base,
    paint,
    update: (r: ModelResult, rainIndex: number) => {
      draw(rainIndex);
      lastResult = r;
      writeMarkers(r);
    },
    tick: (_env: Env) => markers.sync(),
    dispose: () => {
      disposed = true;
      base.dispose();
    },
  };
};
