import * as THREE from 'three';
import { toWorld, type GeoData } from '../data';
import { FOCUS_GLSL, track } from './base';
import type { LayerHandle } from './types';

// School markers: one THREE.Points per layer with a fixed screen size. Sizes are CSS pixels; the
// shader scales them by the device pixel ratio, so a marker is the same size on every zoom level.
// Each dot is a soft round disc with a one-pixel darker rim, so it separates from any surface.
// Positions are fixed at build time; each update rewrites only the size and colour attributes.

export interface Markers {
  // sizes: diameter in CSS px per school. colours: sRGB r,g,b (0..1) per school, 3 floats each.
  set(sizes: Float32Array, colours: Float32Array): void;
  // Rim gain: the outer pixel is the colour times this factor. Below 1 darkens (dark theme),
  // above 1 lightens (light theme), so the rim separates from the surface on either theme.
  setRim(gain: number): void;
  // Call every frame: keeps the device pixel ratio uniform in step with the window.
  sync(): void;
}

const vertexShader = /* glsl */ `
  attribute float aSize;
  attribute vec3 aColor;
  uniform float uPixelRatio;
  varying float vSize;
  varying vec3 vColor;
  void main() {
    vSize = aSize * uPixelRatio;
    vColor = aColor;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = vSize;
  }
`;

const fragmentShader = /* glsl */ `
  varying float vSize;
  varying vec3 vColor;
  uniform float uRimGain; // rim colour = colour * uRimGain, clamped to white
  ${FOCUS_GLSL}
  void main() {
    float r = vSize * 0.5;
    float d = length(gl_PointCoord - 0.5) * vSize; // distance from the centre, in device px
    float alpha = 1.0 - smoothstep(r - 0.5, r + 0.5, d); // one-pixel soft edge
    if (alpha <= 0.0) discard;
    float rim = smoothstep(r - 1.0, r - 0.25, d); // the outer device pixel takes the rim colour
    vec3 c = mix(vColor, min(vColor * uRimGain, vec3(1.0)), rim);
    gl_FragColor = vec4(applyFocus(c), alpha);
  }
`;

export function createMarkers(base: LayerHandle, data: GeoData, y: number): Markers {
  const count = data.schools.length;
  const positions = new Float32Array(count * 3);
  data.schools.forEach((s, i) => {
    positions[i * 3] = toWorld(s.x);
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = toWorld(s.y);
  });
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const sizeAttr = new THREE.BufferAttribute(new Float32Array(count), 1);
  const colourAttr = new THREE.BufferAttribute(new Float32Array(count * 3), 3);
  geometry.setAttribute('aSize', sizeAttr);
  geometry.setAttribute('aColor', colourAttr);

  const material = track(
    base,
    new THREE.ShaderMaterial({
      uniforms: {
        uPixelRatio: { value: window.devicePixelRatio || 1 },
        uRimGain: { value: 0.45 },
        uFocus: { value: 1 },
      },
      vertexShader,
      fragmentShader,
      transparent: true,
      depthWrite: false,
    }),
  );
  const points = new THREE.Points(geometry, material);
  points.renderOrder = 4;
  points.frustumCulled = false;
  base.group.add(points);

  const set = (sizes: Float32Array, colours: Float32Array): void => {
    (sizeAttr.array as Float32Array).set(sizes);
    (colourAttr.array as Float32Array).set(colours);
    sizeAttr.needsUpdate = true;
    colourAttr.needsUpdate = true;
  };
  const setRim = (gain: number): void => {
    material.uniforms.uRimGain.value = gain;
  };
  const sync = (): void => {
    material.uniforms.uPixelRatio.value = window.devicePixelRatio || 1;
  };
  return { set, setRim, sync };
}
