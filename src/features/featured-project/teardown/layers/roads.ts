import * as THREE from 'three';
import { FLOOD_LEVEL, sampleBilinear, toWorld, type GeoData } from '../data';
import type { Rgb } from '../palette';
import { FOCUS_GLSL, track } from './base';
import type { LayerHandle } from './types';

// Roads: the OSM network on the plate, in three tiers. Class 0 (national) is the widest strip and
// gets a darker or paler casing under it; class 1 (provincial) is a narrower strip; class 2
// (tertiary) is a hairline. A segment that touches the flood extent is a cut-off link: it is drawn
// in the accent colour on top of its tier, so the links the water cuts stand out. The cut test runs
// once on the CPU at build time, never per frame.

const ROAD_Y = 0.012; // just above the plate
const FLOOD_SAMPLES = 8; // points tested along each segment, both endpoints included
const HALF_WIDTH = [0.022, 0.013, 0] as const; // world units by class; 0 draws a hairline
const CASING_HALF_WIDTH = 0.031; // world units; the casing shows as an edge around national roads

// One road segment in plate coordinates, with its class and its cut-off status.
export interface RoadSegment {
  cls: number; // 0 national, 1 provincial, 2 tertiary
  cut: boolean; // touches the flood extent
  u0: number;
  v0: number;
  u1: number;
  v1: number;
}

export interface RoadTones {
  casing: Rgb;
  primary: Rgb; // class 0
  secondary: Rgb; // class 1
  tertiary: Rgb; // class 2
  cut: Rgb; // cut-off links, any class
}

const vertexShader = /* glsl */ `
  void main() {
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  uniform vec3 uColor; // sRGB
  uniform float uRecede; // alpha when the layer is receded (focus 0)
  ${FOCUS_GLSL}
  void main() {
    gl_FragColor = vec4(applyFocus(uColor), mix(uRecede, 1.0, uFocus));
  }
`;

const roadClass = (data: GeoData, index: number): number => {
  const c = data.roadClasses?.[index] ?? 1;
  return c === 0 || c === 2 ? c : 1;
};

// True when any sampled point along the segment lies in the flood extent (hazard at the 0.5 level).
function touchesFlood(data: GeoData, u0: number, v0: number, u1: number, v1: number): boolean {
  for (let s = 0; s <= FLOOD_SAMPLES; s++) {
    const t = s / FLOOD_SAMPLES;
    const hazard = sampleBilinear(data.flood, data.grid, u0 + (u1 - u0) * t, v0 + (v1 - v0) * t);
    if (hazard >= FLOOD_LEVEL) return true;
  }
  return false;
}

export function roadSegments(data: GeoData): RoadSegment[] {
  const out: RoadSegment[] = [];
  data.roads.forEach((line, i) => {
    const cls = roadClass(data, i);
    for (let p = 0; p + 1 < line.length; p++) {
      const [u0, v0] = line[p];
      const [u1, v1] = line[p + 1];
      out.push({ cls, cut: touchesFlood(data, u0, v0, u1, v1), u0, v0, u1, v1 });
    }
  });
  return out;
}

// Distance in plate units from (u, v) to the nearest segment; Infinity when there are none.
export function distanceToRoads(u: number, v: number, segments: readonly RoadSegment[]): number {
  let best = Infinity;
  for (const s of segments) {
    const dx = s.u1 - s.u0;
    const dy = s.v1 - s.v0;
    const len2 = dx * dx + dy * dy;
    const t = len2 === 0 ? 0 : Math.min(1, Math.max(0, ((u - s.u0) * dx + (v - s.v0) * dy) / len2));
    const ex = u - (s.u0 + dx * t);
    const ey = v - (s.v0 + dy * t);
    best = Math.min(best, ex * ex + ey * ey);
  }
  return Math.sqrt(best);
}

// Four floats per segment: start x, start z, end x, end z in world units.
function worldSegments(segments: readonly RoadSegment[]): Float32Array {
  const out = new Float32Array(segments.length * 4);
  segments.forEach((s, i) => {
    out[i * 4] = toWorld(s.u0);
    out[i * 4 + 1] = toWorld(s.v0);
    out[i * 4 + 2] = toWorld(s.u1);
    out[i * 4 + 3] = toWorld(s.v1);
  });
  return out;
}

// Two triangles per segment, offset by the half width along the segment normal.
function stripGeometry(segments: Float32Array, halfWidth: number): THREE.BufferGeometry {
  const out = new Float32Array((segments.length / 4) * 18);
  let k = 0;
  const put = (x: number, z: number): void => {
    out[k++] = x;
    out[k++] = ROAD_Y;
    out[k++] = z;
  };
  for (let s = 0; s < segments.length; s += 4) {
    const ax = segments[s];
    const az = segments[s + 1];
    const bx = segments[s + 2];
    const bz = segments[s + 3];
    const dx = bx - ax;
    const dz = bz - az;
    const len = Math.hypot(dx, dz) || 1;
    const nx = (-dz / len) * halfWidth;
    const nz = (dx / len) * halfWidth;
    put(ax + nx, az + nz);
    put(bx + nx, bz + nz);
    put(bx - nx, bz - nz);
    put(ax + nx, az + nz);
    put(bx - nx, bz - nz);
    put(ax - nx, az - nz);
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(out, 3));
  return geometry;
}

function hairlineGeometry(segments: Float32Array): THREE.BufferGeometry {
  const out = new Float32Array((segments.length / 4) * 6);
  let k = 0;
  for (let s = 0; s < segments.length; s += 4) {
    out[k++] = segments[s];
    out[k++] = ROAD_Y;
    out[k++] = segments[s + 1];
    out[k++] = segments[s + 2];
    out[k++] = ROAD_Y;
    out[k++] = segments[s + 3];
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(out, 3));
  return geometry;
}

// Builds the road meshes once and returns a repainter for the theme colours. `recede` is the alpha
// the roads keep when the layer is receded.
export function addRoads(
  base: LayerHandle,
  segments: readonly RoadSegment[],
  recede: number,
): (tones: RoadTones) => void {
  const colours = {
    casing: new THREE.Vector3(),
    primary: new THREE.Vector3(),
    secondary: new THREE.Vector3(),
    tertiary: new THREE.Vector3(),
    cut: new THREE.Vector3(),
  };

  const add = (
    colour: THREE.Vector3,
    halfWidth: number,
    picked: readonly RoadSegment[],
    renderOrder: number,
  ): void => {
    const material = track(
      base,
      new THREE.ShaderMaterial({
        uniforms: { uColor: { value: colour }, uRecede: { value: recede }, uFocus: { value: 1 } },
        vertexShader,
        fragmentShader,
        transparent: true,
        depthWrite: false,
        // Strips are wound by segment direction, so both faces are drawn to stay visible from above.
        side: THREE.DoubleSide,
      }),
    );
    const world = worldSegments(picked);
    const object =
      halfWidth > 0
        ? new THREE.Mesh(stripGeometry(world, halfWidth), material)
        : new THREE.LineSegments(hairlineGeometry(world), material);
    object.renderOrder = renderOrder;
    base.group.add(object);
  };

  const pick = (keep: (s: RoadSegment) => boolean): RoadSegment[] => segments.filter(keep);
  add(colours.casing, CASING_HALF_WIDTH, pick((s) => s.cls === 0), 3);
  add(colours.primary, HALF_WIDTH[0], pick((s) => s.cls === 0 && !s.cut), 3.1);
  add(colours.secondary, HALF_WIDTH[1], pick((s) => s.cls === 1 && !s.cut), 3.1);
  add(colours.tertiary, HALF_WIDTH[2], pick((s) => s.cls === 2 && !s.cut), 3.1);
  add(colours.cut, HALF_WIDTH[0], pick((s) => s.cls === 0 && s.cut), 3.2);
  add(colours.cut, HALF_WIDTH[1], pick((s) => s.cls === 1 && s.cut), 3.2);
  add(colours.cut, HALF_WIDTH[2], pick((s) => s.cls === 2 && s.cut), 3.2);

  return (tones) => {
    colours.casing.set(...tones.casing);
    colours.primary.set(...tones.primary);
    colours.secondary.set(...tones.secondary);
    colours.tertiary.set(...tones.tertiary);
    colours.cut.set(...tones.cut);
  };
}
