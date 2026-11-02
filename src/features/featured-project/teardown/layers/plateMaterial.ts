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

// The map and footprint textures are passed in and stay owned by the caller (SharedResources).
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

// Translucent wash over the flooded cells, lifted just above the plate and clipped to the footprint.
// The flood field is a 0..1 hazard texture; the wash starts at the 0.5 contour, so it matches the
// cut-off test in roads.ts. Returns the colour uniform (sRGB) so the caller can repaint it per theme.
const WASH_ALPHA = 0.55;

const washFragment = /* glsl */ `
  uniform sampler2D uFlood;
  uniform sampler2D uFoot;
  uniform vec3 uColor;
  uniform float uAlpha;
  uniform float uRecede; // alpha when the layer is receded (focus 0)
  varying vec2 vUv;
  ${FOCUS_GLSL}
  void main() {
    float inside = smoothstep(0.4, 0.6, texture2D(uFoot, vUv).r);
    float wet = smoothstep(0.42, 0.58, texture2D(uFlood, vUv).r);
    float a = uAlpha * inside * wet;
    if (a < 0.003) discard;
    gl_FragColor = vec4(applyFocus(uColor), a * mix(uRecede, 1.0, uFocus));
  }
`;

export function addFloodWash(
  handle: LayerHandle,
  flood: THREE.Texture,
  foot: THREE.Texture,
  recede: number,
  lift: number,
): THREE.Vector3 {
  const colour = new THREE.Vector3();
  const material = track(
    handle,
    new THREE.ShaderMaterial({
      uniforms: {
        uFlood: { value: flood },
        uFoot: { value: foot },
        uColor: { value: colour },
        uAlpha: { value: WASH_ALPHA },
        uRecede: { value: recede },
        uFocus: { value: 1 },
      },
      vertexShader,
      fragmentShader: washFragment,
      transparent: true,
      depthWrite: false,
      side: THREE.DoubleSide,
      polygonOffset: true,
      polygonOffsetFactor: -1,
      polygonOffsetUnits: -1,
    }),
  );
  const mesh = new THREE.Mesh(createPlateGeometry(1), material);
  mesh.position.y = lift;
  mesh.renderOrder = 2;
  handle.group.add(mesh);
  return colour;
}
