import * as THREE from 'three';
import { PLATE_SIZE, toPlate, type GeoData } from '../data';
import { SATELLITE_DARK, SATELLITE_LIGHT, SCAN_RAMP_DARK, SCAN_RAMP_LIGHT, srgbArray } from '../palette';
import { terrainY } from './terrain';

// Satellites over the territory plate: two procedural spacecraft (a gold-foil box, dark-blue solar
// wings and a dish) on inclined elliptical tracks, each with a faint scan beam down to its ground
// footprint. The footprint stamps a swath into a small paint texture holding one clock value per
// texel; the territory shader colours painted land by the precipitation field and fades it slowly.
// Flat basic materials only: the scene has no lights. Nothing here is an external asset.

export const SCAN_HALF_WIDTH = 1.3; // world units: half the swath under each satellite (a wide pass covers the map in about one orbit)
export const SCAN_TEXELS = 128; // paint texture side on desktop
export const SCAN_TEXELS_MOBILE = 64; // lower resolution on phones
export const SCAN_FADE_S = 12; // seconds for a fresh swath to relax to its residual
export const SCAN_RESIDUAL = 0.85; // strength a swath keeps once it has faded: the map stays painted
export const SCAN_HUE_RATE = 0.05; // ramp positions per second that a painted area drifts after a pass
export const SCAN_MIX = 0.78; // share of the paint colour over the satellite imagery
export const SCAN_RAMP_STOPS = 5;
// Altitude above the territory plate. The layer above tops out at SEPARATION + relief = 1.15, and
// a satellite is only drawn while territory is the top layer, so nothing sits between them.
export const ORBIT_ALTITUDE = 1.35;
const ORBIT_WOBBLE = 0.08; // altitude swing, so each track reads as inclined
// Half-axes of the ground track in world units (the plate is 10 wide). The province covers only the
// middle of the plate, so the track stays inside it: a wider one puts the beam over empty space.
const ORBIT_RX = 2.4;
const ORBIT_RZ = 1.0;
const HEADING_DT = 0.05; // seconds ahead, to read the direction of travel
const BEAM_OPACITY = 0.5; // the hairline from the spacecraft to the ground
const BEAM_RADIUS = 0.01;
const RING_OPACITY = 0.4; // outline of the footprint
const CRAFT_SCALE = 0.7;

interface OrbitSpec {
  period: number; // seconds per revolution
  phase: number; // radians
  yaw: number; // turn of the ground track around the stack's vertical axis
  precession: number; // rad per second the track keeps turning, so successive passes sweep the whole province
}

// Two passes at different speeds and phases: the second satellite covers the far side of the plate.
const ORBITS: readonly OrbitSpec[] = [
  { period: 15, phase: 0, yaw: 0.5, precession: 0.13 },
  { period: 19, phase: Math.PI, yaw: -0.7, precession: -0.1 },
];

interface Craft {
  spec: OrbitSpec;
  root: THREE.Group;
  beam: THREE.Mesh; // thin line from the spacecraft to the ground
  ring: THREE.Mesh; // outline of the scanned footprint on the ground
  prev: { i: number; j: number } | null; // last paint position, to sweep the swath without gaps
}

export interface ScanUniforms {
  uScan: { value: THREE.Texture }; // R = paint clock per texel, -1 = never painted
  uRamp: { value: THREE.Vector3[] }; // precipitation ramp, low to high, sRGB
  uScanAll: { value: number }; // 1 paints all land at once (reduced motion)
  uScanClock: { value: number }; // current clock, the same units as the paint clock
  uScanTexel: { value: number }; // size of one paint texel in uv, for the soft edge of the swath
}

export interface ScanRig {
  group: THREE.Group; // lives beside the territory group, never inside it (framing measures that group)
  materials: THREE.Material[];
  uniforms: ScanUniforms;
  setActive(on: boolean): void;
  setPalette(dark: boolean): void;
  // Moves the satellites and paints their swaths for the given time in seconds. No-op when unchanged.
  update(time: number): void;
}

const orbitAt = (spec: OrbitSpec, t: number, out: THREE.Vector3): void => {
  const a = (t / spec.period) * Math.PI * 2 + spec.phase;
  const x = Math.cos(a) * ORBIT_RX;
  const z = Math.sin(a) * ORBIT_RZ;
  const yaw = spec.yaw + spec.precession * t;
  const c = Math.cos(yaw);
  const s = Math.sin(yaw);
  out.set(x * c - z * s, ORBIT_ALTITUDE + ORBIT_WOBBLE * Math.sin(2 * a), x * s + z * c);
};

export function buildScanRig(data: GeoData, mobile: boolean, reduce: boolean): ScanRig {
  const n = mobile ? SCAN_TEXELS_MOBILE : SCAN_TEXELS;
  const radius = Math.max(1, Math.round(SCAN_HALF_WIDTH / (PLATE_SIZE / n)));
  const paint = new Float32Array(n * n).fill(-1);
  const texture = new THREE.DataTexture(paint, n, n, THREE.RedFormat, THREE.FloatType);
  texture.minFilter = THREE.NearestFilter;
  texture.magFilter = THREE.NearestFilter;
  texture.generateMipmaps = false;
  texture.needsUpdate = true;

  const uniforms: ScanUniforms = {
    uScan: { value: texture },
    uRamp: { value: Array.from({ length: SCAN_RAMP_STOPS }, () => new THREE.Vector3()) },
    uScanAll: { value: reduce ? 1 : 0 },
    uScanClock: { value: 0 },
    uScanTexel: { value: 1 / n },
  };

  const group = new THREE.Group();
  const seg = mobile ? 6 : 12;
  const foilMat = new THREE.MeshBasicMaterial();
  const wingMat = new THREE.MeshBasicMaterial();
  const dishMat = new THREE.MeshBasicMaterial();
  const beamMat = new THREE.MeshBasicMaterial({
    transparent: true,
    opacity: BEAM_OPACITY,
    depthWrite: false,
    side: THREE.DoubleSide,
    blending: THREE.AdditiveBlending,
  });
  const ringMat = new THREE.MeshBasicMaterial({
    transparent: true,
    opacity: RING_OPACITY,
    depthWrite: false,
    side: THREE.DoubleSide,
    blending: THREE.AdditiveBlending,
  });
  // Body along local Z (flight direction), solar wings along X, dish pointing down at the ground.
  const bodyGeo = new THREE.BoxGeometry(0.14, 0.12, 0.18);
  const wingGeo = new THREE.BoxGeometry(0.36, 0.012, 0.12);
  const dishGeo = new THREE.ConeGeometry(0.05, 0.07, seg);
  dishGeo.rotateX(Math.PI);
  // A hairline from the spacecraft to the ground (unit height, stretched per frame), and a flat ring that
  // outlines the footprint. A solid cone read like a toy flashlight.
  const beamGeo = new THREE.CylinderGeometry(1, 1, 1, 6, 1, true);
  const ringGeo = new THREE.RingGeometry(0.97, 1, mobile ? 32 : 72);
  ringGeo.rotateX(-Math.PI / 2);

  const specs = mobile ? ORBITS.slice(0, 1) : ORBITS;
  const crafts: Craft[] = specs.map((spec) => {
    const root = new THREE.Group();
    const body = new THREE.Mesh(bodyGeo, foilMat);
    const wingL = new THREE.Mesh(wingGeo, wingMat);
    const wingR = new THREE.Mesh(wingGeo, wingMat);
    wingL.position.x = -0.26;
    wingR.position.x = 0.26;
    const dish = new THREE.Mesh(dishGeo, dishMat);
    dish.position.y = -0.095;
    root.add(body, wingL, wingR, dish);
    root.scale.setScalar(CRAFT_SCALE);
    const beam = new THREE.Mesh(beamGeo, beamMat);
    const ring = new THREE.Mesh(ringGeo, ringMat);
    group.add(root, beam, ring);
    return { spec, root, beam, ring, prev: null };
  });

  const materials: THREE.Material[] = [foilMat, wingMat, dishMat, beamMat, ringMat];
  const pos = new THREE.Vector3();
  const ahead = new THREE.Vector3();

  // Places one craft at time t and returns its plate coordinates (may lie outside the plate).
  const place = (craft: Craft, t: number): { u: number; v: number } => {
    orbitAt(craft.spec, t, pos);
    orbitAt(craft.spec, t + HEADING_DT, ahead);
    craft.root.position.copy(pos);
    craft.root.rotation.y = Math.atan2(ahead.x - pos.x, ahead.z - pos.z);
    const u = toPlate(pos.x);
    const v = toPlate(pos.z);
    const ground = terrainY(data, Math.min(1, Math.max(0, u)), Math.min(1, Math.max(0, v)));
    const len = Math.max(0.05, pos.y - ground);
    craft.beam.position.set(pos.x, (pos.y + ground) / 2, pos.z);
    craft.beam.scale.set(BEAM_RADIUS, len, BEAM_RADIUS);
    craft.ring.position.set(pos.x, ground + 0.015, pos.z);
    craft.ring.scale.set(SCAN_HALF_WIDTH, 1, SCAN_HALF_WIDTH);
    return { u, v };
  };

  const stampDisc = (cx: number, cy: number, clock: number): void => {
    for (let dj = -radius; dj <= radius; dj++) {
      for (let di = -radius; di <= radius; di++) {
        if (di * di + dj * dj > radius * radius) continue;
        const x = cx + di;
        const y = cy + dj;
        if (x < 0 || y < 0 || x >= n || y >= n) continue;
        paint[y * n + x] = clock;
      }
    }
  };

  // Sweeps discs from the previous paint position to the current one, so a fast satellite leaves no gaps.
  const stampSwath = (a: { i: number; j: number }, b: { i: number; j: number }, clock: number): void => {
    const steps = Math.max(Math.abs(b.i - a.i), Math.abs(b.j - a.j), 1);
    for (let s = 0; s <= steps; s++) {
      const cx = Math.round(a.i + ((b.i - a.i) * s) / steps);
      const cy = Math.round(a.j + ((b.j - a.j) * s) / steps);
      stampDisc(cx, cy, clock);
    }
  };

  let lastTime = Number.NaN;
  let placed = false;

  return {
    group,
    materials,
    uniforms,
    setActive(on: boolean): void {
      if (group.visible === on) return;
      group.visible = on;
      // Re-entering the step must not sweep a chord from the old position in one frame.
      for (const craft of crafts) craft.prev = null;
    },
    setPalette(dark: boolean): void {
      const c = dark ? SATELLITE_DARK : SATELLITE_LIGHT;
      foilMat.color.set(c.foil);
      wingMat.color.set(c.wing);
      dishMat.color.set(c.dish);
      beamMat.color.set(c.beam);
      ringMat.color.set(c.beam);
      beamMat.blending = ringMat.blending = dark ? THREE.AdditiveBlending : THREE.NormalBlending;
      beamMat.needsUpdate = ringMat.needsUpdate = true;
      const stops = dark ? SCAN_RAMP_DARK : SCAN_RAMP_LIGHT;
      stops.forEach((hex, k) => uniforms.uRamp.value[k]?.set(...srgbArray(hex)));
    },
    update(time: number): void {
      // Reduced motion: one fixed pose, and the whole land is painted by uScanAll.
      if (reduce) {
        if (placed) return;
        for (const craft of crafts) place(craft, 0);
        placed = true;
        return;
      }
      if (time === lastTime) return;
      lastTime = time;
      let stamped = false;
      for (const craft of crafts) {
        const { u, v } = place(craft, time);
        if (u < 0 || u >= 1 || v < 0 || v >= 1) {
          craft.prev = null;
          continue;
        }
        const cell = { i: Math.min(n - 1, Math.floor(u * n)), j: Math.min(n - 1, Math.floor(v * n)) };
        stampSwath(craft.prev ?? cell, cell, time);
        craft.prev = cell;
        stamped = true;
      }
      if (stamped) texture.needsUpdate = true;
    },
  };
}
