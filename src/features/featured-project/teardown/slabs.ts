import * as THREE from 'three';

// Small seeded PRNG, so every climate layout is the same on each load.
export function mulberry32(seed: number): () => number {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// One horizontal noise slab: a square in the XZ plane, rotated around Y.
export interface Slab {
  x: number;
  y: number;
  z: number;
  size: number; // side length, world units
  rot: number; // radians around Y
  shade: number; // 0..1, 0 = underside (darkest), 1 = top (lightest)
}

export interface SlabUniforms {
  [name: string]: THREE.IUniform;
  uTime: { value: number };
  uOpacity: { value: number };
  uDensity: { value: number };
  uLight: { value: number };
  uDrift: { value: THREE.Vector2 };
  uScale: { value: number };
  uSoft: { value: number };
  uLit: { value: THREE.Color };
  uShadow: { value: THREE.Color };
}

export interface SlabMaterial {
  material: THREE.ShaderMaterial;
  uniforms: SlabUniforms;
}

// All slabs of one effect share one BufferGeometry, so the effect is one draw call.
export function buildSlabGeometry(slabs: Slab[]): THREE.BufferGeometry {
  const n = slabs.length;
  const position = new Float32Array(n * 12);
  const uv = new Float32Array(n * 8);
  const shade = new Float32Array(n * 4);
  const index = new Uint16Array(n * 6);
  const corners: Array<[number, number]> = [
    [-0.5, -0.5],
    [0.5, -0.5],
    [0.5, 0.5],
    [-0.5, 0.5],
  ];
  const uvs: Array<[number, number]> = [
    [0, 0],
    [1, 0],
    [1, 1],
    [0, 1],
  ];
  slabs.forEach((s, i) => {
    const c = Math.cos(s.rot);
    const sn = Math.sin(s.rot);
    corners.forEach(([cx, cz], j) => {
      const v = i * 4 + j;
      const lx = cx * s.size;
      const lz = cz * s.size;
      position[3 * v] = s.x + lx * c + lz * sn;
      position[3 * v + 1] = s.y;
      position[3 * v + 2] = s.z - lx * sn + lz * c;
      uv[2 * v] = uvs[j][0];
      uv[2 * v + 1] = uvs[j][1];
      shade[v] = s.shade;
    });
    index.set([i * 4, i * 4 + 1, i * 4 + 2, i * 4, i * 4 + 2, i * 4 + 3], i * 6);
  });
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(position, 3));
  geometry.setAttribute('uv', new THREE.BufferAttribute(uv, 2));
  geometry.setAttribute('aShade', new THREE.BufferAttribute(shade, 1));
  geometry.setIndex(new THREE.BufferAttribute(index, 1));
  return geometry;
}

const SLAB_VERTEX = /* glsl */ `
  attribute float aShade;
  varying vec2 vUv;
  varying vec2 vWorld;
  varying float vShade;
  void main() {
    vUv = uv;
    vWorld = position.xz;
    vShade = aShade;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

// Domain-warped fbm inside a radial falloff: the shape is irregular and its edge fades to zero,
// so a slab never reads as a rectangle. Lit top, darker underside, neutral tones only.
const SLAB_FRAGMENT = /* glsl */ `
  uniform float uTime;
  uniform float uOpacity;
  uniform float uDensity;
  uniform float uLight;
  uniform vec2 uDrift;
  uniform float uScale;
  uniform float uSoft;
  uniform vec3 uLit;
  uniform vec3 uShadow;
  uniform vec2 uCenter;
  uniform vec2 uView;
  uniform float uHalf;
  uniform float uNearFade;
  varying vec2 vUv;
  varying vec2 vWorld;
  varying float vShade;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }
  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(
      mix(hash(i), hash(i + vec2(1.0, 0.0)), u.x),
      mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), u.x),
      u.y
    );
  }
  float fbm(vec2 p) {
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 5; i++) {
      v += a * noise(p);
      p = p * 2.03 + 17.1;
      a *= 0.5;
    }
    return v;
  }

  float density(vec2 p) {
    vec2 warp = vec2(fbm(p + 3.7), fbm(p + 9.2));
    return fbm(p + 1.6 * warp);
  }

  void main() {
    vec2 p = vWorld * uScale + uDrift * uTime;
    float n = density(p);
    float r = length(vUv - 0.5) * 2.0;
    float edge = 1.0 - smoothstep(uSoft * 0.55, uSoft, r);
    // Puff edges: a narrow threshold band, so the deck reads as masses with defined outlines.
    float body = smoothstep(0.58 - 0.3 * uDensity, 0.7 - 0.12 * uDensity, n) * edge;
    // Thins towards the camera: the near side of the deck must not cover the active layer.
    float toward = dot(vWorld - uCenter, uView) / uHalf;
    float fade = 1.0 - uNearFade * smoothstep(-0.2, 1.0, toward);
    float a = body * uOpacity * fade;
    if (a < 0.004) discard;
    // Relief: the density falls off towards the light (north-west), so the sunward flank of each
    // mass is lit and the far flank falls into shadow.
    float nl = density(p + vec2(-0.025, 0.025));
    float relief = clamp(0.5 + (n - nl) * 7.0, 0.0, 1.0);
    vec3 col = mix(uShadow, uLit, relief);
    col *= mix(0.8, 1.0, vShade);
    col += uLight * 0.25;
    gl_FragColor = vec4(col, a);
  }
`;

export function createSlabMaterial(init: {
  drift: [number, number];
  scale: number;
  soft: number;
  density: number;
  // Optional: fades the slabs on the camera side of `center`, along `view` (unit vector in XZ).
  near?: { center: [number, number]; view: [number, number]; half: number; amount: number };
}): SlabMaterial {
  const near = init.near ?? { center: [0, 0], view: [0, 0], half: 1, amount: 0 };
  const uniforms: SlabUniforms = {
    uTime: { value: 0 },
    uOpacity: { value: 0 },
    uDensity: { value: init.density },
    uLight: { value: 0 },
    uDrift: { value: new THREE.Vector2(init.drift[0], init.drift[1]) },
    uScale: { value: init.scale },
    uSoft: { value: init.soft },
    uLit: { value: new THREE.Color(1, 1, 1) },
    uShadow: { value: new THREE.Color(0.5, 0.5, 0.5) },
    uCenter: { value: new THREE.Vector2(near.center[0], near.center[1]) },
    uView: { value: new THREE.Vector2(near.view[0], near.view[1]) },
    uHalf: { value: near.half },
    uNearFade: { value: near.amount },
  };
  const material = new THREE.ShaderMaterial({
    vertexShader: SLAB_VERTEX,
    fragmentShader: SLAB_FRAGMENT,
    uniforms,
    transparent: true,
    depthWrite: false,
    side: THREE.DoubleSide,
  });
  return { material, uniforms };
}
