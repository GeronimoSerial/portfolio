import * as THREE from 'three';
import { buildSlabGeometry, createSlabMaterial, mulberry32, type Slab } from './slabs';
import type { CloudTones } from './clouds';

// Low mist: a few soft slabs hugging the wet ground (one draw call). Opacity follows the wetness.
export const MIST_PLANES_DESKTOP = 5;
export const MIST_PLANES_MOBILE = 1;
const MAX_OPACITY = 0.22;
const DRIFT: [number, number] = [-0.02, 0.012];

export interface MistRegion {
  cx: number;
  cz: number;
  half: number;
  y: number; // height above the terrain origin, low enough to hug the ground
}

export interface Mist {
  group: THREE.Group;
  step(dt: number, wet: number): void;
  setTones(tones: CloudTones): void;
  dispose(): void;
}

export function createMist(region: MistRegion, mobile: boolean, tones: CloudTones): Mist {
  const rand = mulberry32(41);
  const count = mobile ? MIST_PLANES_MOBILE : MIST_PLANES_DESKTOP;
  const slabs: Slab[] = [];
  for (let i = 0; i < count; i++) {
    slabs.push({
      x: region.cx + (rand() * 2 - 1) * region.half * 0.6,
      y: region.y + rand() * 0.12,
      z: region.cz + (rand() * 2 - 1) * region.half * 0.6,
      size: region.half * (1.0 + 0.7 * rand()),
      rot: rand() * Math.PI,
      shade: 1,
    });
  }

  const geometry = buildSlabGeometry(slabs);
  const { material, uniforms } = createSlabMaterial({
    drift: DRIFT,
    scale: 0.22,
    soft: 1,
    density: 0.25,
  });
  uniforms.uLit.value.copy(tones.lit);
  uniforms.uShadow.value.copy(tones.shadow);
  const mesh = new THREE.Mesh(geometry, material);
  mesh.renderOrder = 2;
  mesh.frustumCulled = false;
  const group = new THREE.Group();
  group.add(mesh);

  let clock = 0;
  return {
    group,
    step(dt, wet) {
      clock += dt;
      uniforms.uTime.value = clock;
      uniforms.uOpacity.value = MAX_OPACITY * Math.min(1, Math.max(0, wet));
    },
    setTones(next) {
      uniforms.uLit.value.copy(next.lit);
      uniforms.uShadow.value.copy(next.shadow);
    },
    dispose() {
      geometry.dispose();
      material.dispose();
    },
  };
}
