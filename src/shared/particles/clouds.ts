import * as THREE from 'three';
import { buildArc, type createArcMaterial } from './arc';
import { CLOUD_CENTER_Y } from './poses';
import type { BaseAssets } from './assets';
import type { MorphAttrs } from './state';

export interface Clouds {
  attrs: MorphAttrs;
  geometry: THREE.BufferGeometry;
  points: THREE.Points;
  arcGeometry: THREE.BufferGeometry;
  arcPoints: THREE.Points;
}

// Builds the morphing point cloud (both slots start on the portrait) and the arc points.
export function createClouds(
  base: BaseAssets,
  material: THREE.ShaderMaterial,
  arcMaterial: ReturnType<typeof createArcMaterial>['material'],
  arcCount: number,
): Clouds {
  const { portrait, seed } = base;
  const from = new THREE.BufferAttribute(new Float32Array(portrait.positions), 3);
  const to = new THREE.BufferAttribute(new Float32Array(portrait.positions), 3);
  const fromBright = new THREE.BufferAttribute(new Float32Array(portrait.lum), 1);
  const toBright = new THREE.BufferAttribute(new Float32Array(portrait.lum), 1);

  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', from);
  geometry.setAttribute('aFrom', from);
  geometry.setAttribute('aTo', to);
  geometry.setAttribute('aFromBright', fromBright);
  geometry.setAttribute('aToBright', toBright);
  geometry.setAttribute('aSeed', new THREE.BufferAttribute(seed, 1));

  const points = new THREE.Points(geometry, material);
  points.frustumCulled = false;
  points.position.y = -CLOUD_CENTER_Y;

  const arcShape = buildArc(arcCount);
  const arcGeometry = new THREE.BufferGeometry();
  arcGeometry.setAttribute('position', new THREE.BufferAttribute(arcShape.positions, 3));
  arcGeometry.setAttribute('aT', new THREE.BufferAttribute(arcShape.t, 1));
  arcGeometry.setAttribute('aGlow', new THREE.BufferAttribute(arcShape.glow, 1));
  const arcPoints = new THREE.Points(arcGeometry, arcMaterial);
  arcPoints.frustumCulled = false;
  arcPoints.position.y = -CLOUD_CENTER_Y;

  return { attrs: { from, to, fromBright, toBright }, geometry, points, arcGeometry, arcPoints };
}
