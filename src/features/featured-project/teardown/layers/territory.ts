import * as THREE from 'three';
import { toWorld, type GeoData } from '../data';
import type { Model } from '../model';
import { createLayer, track } from './base';
import { encodeField } from './fieldTexture';
import { createPlateGeometry } from './plateMaterial';
import { isDarkTheme, terrainTones } from './ramps';
import { RELIEF_HEIGHT, terrainY } from './terrain';
import { territoryFragment, territoryVertex } from './territoryShaders';
import type { Env, LayerBuilder, LayerHandle, Palette } from './types';

// Territory: the satellite terrain draped on the Copernicus DEM, with the rain tint, the
// wetness and the simulated water painted into one opaque displaced mesh. The province outline
// sits on the terrain edge.

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

  // Satellite, hillshade and footprint come from the scene. The satellite uniforms are the shared
  // objects themselves, so the placeholder-to-file swap reaches this material without a callback.
  const uniforms = {
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

  const paint = (p: Palette): void => {
    base.paint(p);
    const t = terrainTones(isDarkTheme(p));
    uniforms.uLow.value.set(...t.low);
    uniforms.uHigh.value.set(...t.high);
    uniforms.uShallow.value.set(...t.shallow);
    uniforms.uDeep.value.set(...t.deep);
  };
  paint(ctx.palette);

  return {
    ...base,
    paint,
    tick: (env: Env) => {
      uniforms.uStorm.value = env.storm;
      uniforms.uWet.value = env.wet;
      uniforms.uLevel.value = env.water;
      uniforms.uTime.value = env.time;
    },
    dispose: () => {
      disposed = true;
      base.dispose();
    },
  };
};
