import * as THREE from 'three';
import { toWorld, type GeoData } from '../data';
import type { Model } from '../model';
import { prefersReducedMotion } from '../../../../shared/lib/motion';
import { createLayer, disposeLayer, track } from './base';
import { encodeField } from './fieldTexture';
import { createPlateGeometry } from './plateMaterial';
import { isDarkTheme, terrainTones } from './ramps';
import { buildScanRig } from './satellites';
import { RELIEF_HEIGHT, terrainY } from './terrain';
import { territoryFragment, territoryVertex } from './territoryShaders';
import type { Env, LayerBuilder, LayerHandle, Palette } from './types';

// Territory: the satellite terrain draped on the Copernicus DEM, with the rain tint, the
// wetness and the simulated water painted into one opaque displaced mesh. The province outline
// sits on the terrain edge. Satellites orbit above it and paint their swaths into the same surface.

// Focus above which the satellites fly and paint. Below it the layer is receded and they are hidden.
const ACTIVE_FOCUS = 0.02;

function outlineGeometry(data: GeoData): THREE.BufferGeometry | null {
  const fp = data.footprint;
  if (!fp || fp.length < 3) return null;
  const positions = new Float32Array(fp.length * 3);
  fp.forEach(([u, v], i) => {
    positions[i * 3] = toWorld(u);
    positions[i * 3 + 1] = terrainY(data, u, v) + 0.01;
    positions[i * 3 + 2] = toWorld(v);
  });
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  return geometry;
}

// Flood extent on the model grid, used until a baked JRC mask arrives.
function extentField(data: GeoData, model: Model): Float32Array {
  const n = data.grid;
  const out = new Float32Array(n * n);
  for (let j = 0; j < n; j++) {
    for (let i = 0; i < n; i++) out[j * n + i] = model.floodMaskAt(i / (n - 1), j / (n - 1));
  }
  return out;
}

export const buildTerritory: LayerBuilder = (data, ctx, model: Model): LayerHandle => {
  const base = createLayer(ctx.shared);
  let disposed = false;
  const n = data.grid;
  const shared = ctx.shared;
  // Scan satellites: their own group sits beside this one (framing measures this group, so the
  // satellites must not be inside it). Their paint uniforms join this material below.
  const scan = buildScanRig(data, ctx.mobile, prefersReducedMotion());

  // Satellite, hillshade and footprint come from the scene. The satellite uniforms are the shared
  // objects themselves, so the placeholder-to-file swap reaches this material without a callback.
  const uniforms = {
    ...scan.uniforms,
    uHeight: { value: encodeField(data.heightmap, n) as THREE.Texture },
    uMask: { value: encodeField(extentField(data, model), n) as THREE.Texture },
    uPrecip: { value: encodeField(data.precipitation, data.precipGrid) as THREE.Texture },
    uHillshade: { value: shared.hillshade },
    uSat: shared.satellite,
    uHasSat: shared.satelliteReady,
    uFoot: { value: shared.footprint },
    uGrid: { value: n },
    uHeightScale: { value: RELIEF_HEIGHT },
    uLow: { value: new THREE.Vector3() },
    uHigh: { value: new THREE.Vector3() },
    uShallow: { value: new THREE.Vector3() },
    uDeep: { value: new THREE.Vector3() },
    uStorm: { value: 0 },
    uWet: { value: 0 },
    uLevel: { value: 0 },
    uTime: { value: 0 },
    uDetail: { value: ctx.mobile ? 0 : 1 },
    uFocus: { value: 1 },
  };
  const material = track(
    base,
    // Same plate orientation as createPlateGeometry (normal down): draw both faces.
    new THREE.ShaderMaterial({
      uniforms,
      vertexShader: territoryVertex,
      fragmentShader: territoryFragment,
      side: THREE.DoubleSide,
    }),
  );

  // Texture swaps: the baked files replace the generated fallbacks once they arrive. A swapped-out
  // texture owned by the scene (the shared hillshade) is left for the scene to free.
  const swap = (key: 'uHillshade' | 'uMask', url: string): void => {
    new THREE.TextureLoader().load(url, (tex) => {
      tex.flipY = false;
      tex.colorSpace = THREE.NoColorSpace;
      if (disposed) {
        tex.dispose();
        return;
      }
      const previous = uniforms[key].value;
      uniforms[key].value = tex;
      if (!shared.owns(previous)) previous.dispose();
    });
  };
  if (data.hillshadeUrl) swap('uHillshade', data.hillshadeUrl);
  if (data.floodMaskUrl) swap('uMask', data.floodMaskUrl);

  const mesh = new THREE.Mesh(createPlateGeometry(ctx.mobile ? 96 : 192), material);
  base.group.add(mesh);

  const outline = outlineGeometry(data);
  if (outline) {
    base.group.add(new THREE.LineLoop(outline, track(base, new THREE.LineBasicMaterial(), 'ink')));
  }

  // Scan materials are disposed with the layer's materials; the paint texture rides in `uScan`.
  base.materials.push(...scan.materials);
  let active = false;

  const paint = (p: Palette): void => {
    base.paint(p);
    const dark = isDarkTheme(p);
    const t = terrainTones(dark);
    uniforms.uLow.value.set(...t.low);
    uniforms.uHigh.value.set(...t.high);
    uniforms.uShallow.value.set(...t.shallow);
    uniforms.uDeep.value.set(...t.deep);
    scan.setPalette(dark);
  };
  paint(ctx.palette);

  return {
    ...base,
    overlay: scan.group,
    paint,
    setFocus: (f: number) => {
      base.setFocus(f);
      active = f > ACTIVE_FOCUS;
      scan.setActive(active);
    },
    tick: (env: Env) => {
      uniforms.uStorm.value = env.storm;
      uniforms.uWet.value = env.wet;
      uniforms.uLevel.value = env.water;
      uniforms.uTime.value = env.time;
      uniforms.uScanClock.value = env.time;
      // Satellites move and paint only while the layer is focused; a receded layer keeps its paint.
      if (active) scan.update(env.time);
    },
    dispose: () => {
      disposed = true;
      base.dispose();
      disposeLayer(scan.group, []);
    },
  };
};
