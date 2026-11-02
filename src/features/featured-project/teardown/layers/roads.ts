import * as THREE from 'three';
import { toWorld, type GeoData } from '../data';
import { track } from './base';
import type { LayerHandle, Role } from './types';

// Roads: the OSM network on the plate. Classes 0 and 1 are real strips (world-width quads), so
// they read heavier at any zoom; class 2 is a hairline.

const ROAD_Y = 0.012; // just above the plate

interface RoadStyle {
  role: Role;
  halfWidth: number; // world units; 0 draws a hairline instead of a strip
}

const STYLES: readonly RoadStyle[] = [
  { role: 'ink', halfWidth: 0.02 }, // class 0, national: widest, lightest
  { role: 'muted', halfWidth: 0.012 }, // class 1, provincial
  { role: 'muted', halfWidth: 0 }, // class 2, tertiary
];

const roadClass = (data: GeoData, index: number): number => {
  const c = data.roadClasses?.[index] ?? 1;
  return c === 0 || c === 2 ? c : 1;
};

// Four floats per segment: start x, start z, end x, end z in world units.
function segmentsOf(data: GeoData, cls: number): Float32Array {
  const lines = data.roads.filter((_, i) => roadClass(data, i) === cls);
  const count = lines.reduce((sum, line) => sum + Math.max(0, line.length - 1), 0);
  const out = new Float32Array(count * 4);
  let k = 0;
  for (const line of lines) {
    for (let p = 0; p + 1 < line.length; p++) {
      const [u0, v0] = line[p];
      const [u1, v1] = line[p + 1];
      out[k++] = toWorld(u0);
      out[k++] = toWorld(v0);
      out[k++] = toWorld(u1);
      out[k++] = toWorld(v1);
    }
  }
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

export function addRoads(base: LayerHandle, data: GeoData): void {
  STYLES.forEach((style, cls) => {
    const segments = segmentsOf(data, cls);
    const material = track(
      base,
      // Strips are wound by segment direction, so both faces are drawn to stay visible from above.
      style.halfWidth > 0
        ? new THREE.MeshBasicMaterial({ side: THREE.DoubleSide })
        : new THREE.LineBasicMaterial(),
      style.role,
    );
    const object =
      style.halfWidth > 0
        ? new THREE.Mesh(stripGeometry(segments, style.halfWidth), material)
        : new THREE.LineSegments(hairlineGeometry(segments), material);
    object.renderOrder = 3;
    base.group.add(object);
  });
}
