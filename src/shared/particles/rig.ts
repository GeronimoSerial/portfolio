import * as THREE from 'three';
import { PORTRAIT_H } from './portrait-sampler';
import { GLOBE_CENTER_Y } from './shapes';
import { CLOUD_CENTER_Y, tierOf } from './poses';
import type { ParticleContext } from './state';

// Hero figure tuning. SCALE multiplies the approved mockup size.
const SCALE = { desktop: 1.35, mobile: 1.15 };
// Point size in CSS px at reference distance. Scaled up with SCALE so the larger figure keeps
// v12's dot coverage: area per point grows with SCALE squared, so size grows with its root.
const POINT_SIZE = { desktop: 2.5, mobile: 1.95 };
const MOCKUP_VIEW_H = { desktop: 0.85, mobile: 0.7 };
const HEADROOM = { desktop: 0.05, mobile: 0.15 }; // space above the head, in view heights
export const HEAD_Y = PORTRAIT_H * 0.7; // pivot height for the head turn
const LOOK = { y: 0.08, x: 0.05 }; // pointer nudge, rad
const FOV = 35;

export interface Rig {
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  grp: THREE.Group; // framing offset
  pivot: THREE.Group; // head turn, pivoted at head height
  spinGroup: THREE.Group; // tilt, yaw and fit-scale about the cloud centre (globe and map poses)
}

export function createRig(): Rig {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(FOV, 1, 0.1, 100);
  const grp = new THREE.Group();
  const pivot = new THREE.Group();
  pivot.position.y = HEAD_Y;
  grp.add(pivot);
  const spinGroup = new THREE.Group();
  spinGroup.position.y = CLOUD_CENTER_Y - HEAD_Y;
  pivot.add(spinGroup);
  scene.add(grp);
  return { scene, camera, grp, pivot, spinGroup };
}

// Sizes the renderer and camera to the window and refits the poses; relayout runs once the layout has its new size.
export function fitRig(rig: Rig, renderer: THREE.WebGLRenderer, ctx: ParticleContext, relayout: () => void) {
  const { camera } = rig;
  const { layout, uniforms, state } = ctx;
  const w = window.innerWidth;
  const h = window.innerHeight;
  const t = tierOf();
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const visH = PORTRAIT_H / (MOCKUP_VIEW_H[t] * SCALE[t]);
  const visW = visH * (w / h);

  renderer.setPixelRatio(dpr);
  renderer.setSize(w, h, false);
  camera.aspect = w / h;
  camera.position.set(0, 0, visH / (2 * Math.tan(THREE.MathUtils.degToRad(FOV) / 2)));
  camera.updateProjectionMatrix();

  state.mobile = t === 'mobile';
  layout.visH = visH;
  layout.visW = visW;
  layout.baseY = visH / 2 - visH * HEADROOM[t] - PORTRAIT_H;
  relayout();
  uniforms.uPixelRatio.value = dpr;
  uniforms.uRef.value = camera.position.z;
  uniforms.uSize.value = POINT_SIZE[t];
}

// Pointer handler: repels the cloud under the cursor and nudges the head (lookTarget, in rad).
export function createPointerHandler(rig: Rig, ctx: ParticleContext, lookTarget: { x: number; y: number }) {
  const { camera, grp, pivot, spinGroup } = rig;
  const raycaster = new THREE.Raycaster();
  const ndc = new THREE.Vector2();
  const zPlane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
  const hit = new THREE.Vector3();

  return function onPointer(e: PointerEvent) {
    ndc.set((e.clientX / window.innerWidth) * 2 - 1, -(e.clientY / window.innerHeight) * 2 + 1);
    raycaster.setFromCamera(ndc, camera);
    if (raycaster.ray.intersectPlane(zPlane, hit)) {
      // Pointer in the cloud's local frame, so the repulsion follows the scale.
      const localX = (hit.x - grp.position.x - spinGroup.position.x) / ctx.view.s;
      const localY = (hit.y - grp.position.y - pivot.position.y - spinGroup.position.y) / ctx.view.s;
      ctx.uniforms.uMouse.value.set(localX, localY + GLOBE_CENTER_Y);
    }
    lookTarget.x = ndc.x * LOOK.y;
    lookTarget.y = -ndc.y * LOOK.x;
  };
}
