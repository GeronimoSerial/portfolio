import * as THREE from 'three';
import { PLATE_SIZE } from '../data';
import { FOCUS_GLSL, track } from './base';
import type { LayerHandle } from './types';

// Opaque textured plate, clipped to the province footprint by discard (no translucency).
// The colour map is multiplied by a tint uniform and then receives the focus.

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  uniform sampler2D uMap;
  uniform sampler2D uFoot;
  uniform vec3 uTint;
  uniform float uShade; // 1 = full map detail, 0 = flat tint (the light theme's faint hillshade)
  varying vec2 vUv;
  ${FOCUS_GLSL}
  void main() {
    float inside = smoothstep(0.4, 0.6, texture2D(uFoot, vUv).r);
    if (inside < 0.003) discard;
    vec3 c = mix(vec3(1.0), texture2D(uMap, vUv).rgb, uShade) * uTint;
    gl_FragColor = vec4(applyFocus(c), 1.0);
  }
`;

// The footprint and map textures belong to this material alone: disposeLayer frees them.
export function createPlateMaterial(map: THREE.Texture, foot: THREE.Texture): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    uniforms: {
      uMap: { value: map },
      uFoot: { value: foot },
      uTint: { value: new THREE.Vector3(1, 1, 1) },
      uShade: { value: 1 },
      uFocus: { value: 1 },
    },
    vertexShader,
    fragmentShader,
    // createPlateGeometry lies the plate with rotateX(+PI/2), so its normal points down and the
    // top face is wound away from the camera. DoubleSide keeps the plate visible from above.
    side: THREE.DoubleSide,
  });
}

// Plane lying on the XZ floor. Row 0 of the plate (v = 0) sits at world z = -PLATE_SIZE / 2.
export function createPlateGeometry(segments: number): THREE.PlaneGeometry {
  const geometry = new THREE.PlaneGeometry(PLATE_SIZE, PLATE_SIZE, segments, segments);
  geometry.rotateX(Math.PI / 2);
  return geometry;
}

// Adds an opaque plate to the layer and tracks its material for focus.
export function addPlate(
  handle: LayerHandle,
  material: THREE.ShaderMaterial,
  segments: number,
  renderOrder: number,
): THREE.Mesh {
  const mesh = new THREE.Mesh(createPlateGeometry(segments), track(handle, material));
  mesh.renderOrder = renderOrder;
  handle.group.add(mesh);
  return mesh;
}
