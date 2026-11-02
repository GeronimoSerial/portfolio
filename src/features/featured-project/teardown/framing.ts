import * as THREE from 'three';
import { ORBIT_SPAN, SEPARATION } from './choreography';
import { DECK_TOP_OFFSET } from './clouds';
import { PLATE_SIZE } from './data';
import type { LayerHandle } from './layers/types';

// Share of the canvas kept clear below the stack, and on each side of it. The stack fills the
// rest, so it reads as the main object of the stage. Desktop: ~56% of the viewport width.
// Mobile: ~90% of the stage width.
const MARGIN_Y = 0.06;
const MARGIN_X_DESKTOP = 0.03;
const MARGIN_X_MOBILE = 0.03;
// Camera height per unit of horizontal distance, and the fixed starting azimuth.
const ELEVATION = 1.15;
export const AZIMUTH = Math.PI / 4;
// Highest slot of the stack: the framing covers it even when a layer is not on top yet.
const TOP_SLOT = 2;
export const CAMERA_FOV = 32;

export interface Stack {
  box: THREE.Box3; // the exploded stack plus the cloud headroom: what the framing must fit
  top: number; // top of the exploded stack, below the headroom
  groundTop: number; // top of the territory layer (relief), for the mist
}

export interface Frame {
  target: THREE.Vector3;
  radius: number;
}

export const marginXFor = (mobile: boolean): number =>
  mobile ? MARGIN_X_MOBILE : MARGIN_X_DESKTOP;

export function defaultStack(): Stack {
  const half = PLATE_SIZE / 2;
  const top = SEPARATION * TOP_SLOT + 0.5;
  return {
    box: new THREE.Box3(
      new THREE.Vector3(-half, 0, -half),
      new THREE.Vector3(half, top + DECK_TOP_OFFSET, half),
    ),
    top,
    groundTop: 0.5,
  };
}

// Places a camera on the orbit around `target`: a fixed elevation ratio, `radius` out.
export function placeOrbit(
  cam: THREE.PerspectiveCamera,
  target: THREE.Vector3,
  radius: number,
  angle: number,
): void {
  cam.position.set(
    target.x + Math.cos(angle) * radius,
    target.y + radius * ELEVATION,
    target.z + Math.sin(angle) * radius,
  );
  cam.lookAt(target);
  cam.updateMatrixWorld();
}

// Solves the orbit radius so every corner of the stack box (the stack plus the top of the cloud
// deck) sits inside the margins, at the start and the end of the orbit. Framing depends only on
// the stack and the aspect, never on the step.
export function solveFrame(box: THREE.Box3, aspect: number, marginX: number): Frame {
  const target = box.getCenter(new THREE.Vector3());
  const corners: THREE.Vector3[] = [];
  for (const x of [box.min.x, box.max.x]) {
    for (const y of [box.min.y, box.max.y]) {
      for (const z of [box.min.z, box.max.z]) corners.push(new THREE.Vector3(x, y, z));
    }
  }
  const probe = new THREE.PerspectiveCamera(CAMERA_FOV, aspect, 0.1, 1000);
  const tanHalf = Math.tan(THREE.MathUtils.degToRad(CAMERA_FOV) / 2);
  const limitX = 1 - 2 * marginX;
  const bandTop = 1 - 2 * MARGIN_Y;
  const bandBottom = -(1 - 2 * MARGIN_Y);
  const bandMid = (bandTop + bandBottom) / 2;
  const bandSpan = bandTop - bandBottom;
  const angles = [AZIMUTH, AZIMUTH + ORBIT_SPAN / 2, AZIMUTH + ORBIT_SPAN];
  let radius = Math.max(box.max.x - box.min.x, box.max.z - box.min.z, box.max.y - box.min.y) * 2;
  for (let iter = 0; iter < 24; iter++) {
    let maxX = 0;
    let lo = Infinity;
    let hi = -Infinity;
    for (const angle of angles) {
      placeOrbit(probe, target, radius, angle);
      for (const c of corners) {
        const p = c.clone().project(probe);
        maxX = Math.max(maxX, Math.abs(p.x));
        lo = Math.min(lo, p.y);
        hi = Math.max(hi, p.y);
      }
    }
    // Projected size scales about inversely with the distance, so one multiply converges.
    const scale = Math.max(maxX / limitX, (hi - lo) / bandSpan);
    // Slide the target along world Y so the box centre sits in the middle of the height band.
    const shift = (lo + hi) / 2 - bandMid;
    target.y += shift * radius * tanHalf;
    radius *= scale;
    if (Math.abs(scale - 1) < 0.003 && Math.abs(shift) < 0.003) break;
  }
  return { target, radius };
}

// Stack bounds over every slot a layer can take, so the framing never moves with the steps.
// The box reaches the top of the cloud deck, so the framing keeps the deck in view.
export function measureStack(handles: LayerHandle[]): Stack {
  const box = new THREE.Box3();
  const raise = new THREE.Vector3(0, TOP_SLOT * SEPARATION, 0);
  let groundTop = 0.5;
  handles.forEach((h, k) => {
    h.group.position.y = 0;
    h.group.updateMatrixWorld(true);
    const part = new THREE.Box3().setFromObject(h.group);
    box.union(part);
    box.union(part.clone().translate(raise));
    if (k === 0) groundTop = part.max.y;
  });
  const top = box.max.y;
  box.max.y += DECK_TOP_OFFSET;
  return { box, top, groundTop };
}
