import * as THREE from 'three';
import { buildSlabGeometry, mulberry32, type Slab } from './slabs';

// Cloud deck: 12-20 horizontal slabs stacked a little above the stack (one draw call).
// Mobile keeps a single slab. Each slab is a domain-warped fbm mass with an irregular soft edge,
// drifting at its own speed; the deck is lit from the north-west and darkens towards its base.
// Density and opacity follow the storm; the deck never reaches down into the layers.
export const CLOUD_PLANES_DESKTOP = 14;
export const CLOUD_PLANES_MOBILE = 1;
// Side length of a slab, in footprint halves: the deck covers at least 1.4x the province width.
const SLAB_SPAN_MIN = 2.8;
const SLAB_SPAN_RANGE = 0.4;
const CLOUD_SCALE = 0.42; // isotropic noise frequency: masses a few world units across
const LIGHTNING_INTERVAL = 20; // seconds between events, at least
const LIGHTNING_LENGTH = 1.6; // seconds for one event (>= 1.2 s, ease in and out)
const LIGHTNING_STORM = 0.8; // only while the storm is at its height
const DRIFT: [number, number] = [-0.035, 0.03]; // from the north-east (wind towards the south-west)

// The deck starts this far above the stack top, and sits behind the stack (away from the camera):
// seen from above, it rises over the plates instead of covering them.
const DECK_LIFT = 0.6;
const DECK_BACK = 1.7; // behind the stack, in half-widths: the camera looks down steeply, so a far deck leaves the frame
const DECK_SPREAD = 0.6; // height gap between the lowest and the highest slab
// Highest point of the deck above the stack top. The framing includes it, so the deck is never cropped.
export const DECK_TOP_OFFSET = DECK_LIFT + DECK_SPREAD + 0.15;

export interface CloudRegion {
  cx: number; // footprint centre
  cz: number;
  half: number; // half the footprint width
  baseY: number; // height of the stack top; the deck starts above it
  view: number; // azimuth of the camera on the XZ plane; the deck thins towards it
}

export interface CloudTones {
  lit: THREE.Color;
  shadow: THREE.Color;
}

export interface Clouds {
  group: THREE.Group;
  // Advances the deck. Returns the soft lightning illumination, 0..1 (0 when none is running).
  step(dt: number, storm: number): number;
  setTones(tones: CloudTones): void;
  dispose(): void;
}

const CLOUD_VERTEX = /* glsl */ `
  attribute float aShade;
  attribute float aSeed;
  varying vec2 vUv;
  varying vec2 vWorld;
  varying float vShade;
  varying float vSeed;
  void main() {
    vUv = uv;
    vWorld = position.xz;
    vShade = aShade;
    vSeed = aSeed;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

// Isotropic value noise and a three-octave fbm (each octave rotated, so no lattice rows show).
// The density is a domain-warped fbm: the warp bends the masses into irregular towers and bays.
const CLOUD_FRAGMENT = /* glsl */ `
  uniform float uTime;
  uniform float uOpacity;
  uniform float uDensity;
  uniform float uLight;
  uniform vec2 uDrift;
  uniform float uScale;
  uniform vec3 uLit;
  uniform vec3 uShadow;
  uniform vec2 uCenter;
  uniform vec2 uView;
  uniform float uHalf;
  uniform float uNearFade;
  varying vec2 vUv;
  varying vec2 vWorld;
  varying float vShade;
  varying float vSeed;

  float hash(vec2 p) {
    vec3 p3 = fract(vec3(p.xyx) * 0.1031);
    p3 += dot(p3, p3.yzx + 33.33);
    return fract((p3.x + p3.y) * p3.z);
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
    mat2 rot = mat2(0.8, -0.6, 0.6, 0.8);
    float v = 0.0;
    float a = 0.5;
    for (int i = 0; i < 3; i++) {
      v += a * noise(p);
      p = rot * p * 2.02 + 13.7;
      a *= 0.5;
    }
    return v;
  }
  float cloudField(vec2 p) {
    vec2 w = vec2(fbm(p), fbm(p + vec2(5.2, 1.3)));
    return fbm(p + 1.8 * w);
  }

  void main() {
    // Each slab drifts at its own speed and phase, so the deck layers slide past one another.
    vec2 p = vWorld * uScale + uDrift * uTime * (0.6 + 0.8 * vSeed) + vSeed * 23.0;
    float n = cloudField(p);
    float thr = mix(0.56, 0.40, uDensity);
    // Irregular soft edge: the radius is pushed in and out by noise, and fades to zero at the rim.
    float r = length(vUv - 0.5) * 2.0;
    float wob = noise(vWorld * uScale * 1.7 + vSeed * 9.0) - 0.5;
    float edge = 1.0 - smoothstep(0.35, 0.95, r + 0.45 * wob);
    float body = smoothstep(thr, thr + 0.12, n) * edge;
    // Thins towards the camera: the near side of the deck must not cover the active layer.
    float toward = dot(vWorld - uCenter, uView) / uHalf;
    float fade = 1.0 - uNearFade * smoothstep(-0.2, 1.0, toward);
    float a = body * uOpacity * fade;
    if (a < 0.004) discard;
    // Relief: density falls off towards the light (north-west), so the sunward flank is a bright
    // rim and the far flank falls into shadow. The core of a mass is darker than its edges.
    float nl = cloudField(p + vec2(-0.03, 0.03));
    float relief = clamp(0.5 + (n - nl) * 9.0, 0.0, 1.0);
    float core = smoothstep(thr + 0.08, thr + 0.3, n);
    vec3 col = mix(uShadow, uLit, relief);
    col *= mix(1.0, 0.7, core * (1.0 - vShade));
    col *= mix(0.8, 1.0, vShade);
    col += uLight * 0.25;
    gl_FragColor = vec4(col, a);
  }
`;

// Clouds sit between DECK_LIFT and DECK_LIFT + 1.6 units above the stack top.
export function createClouds(
  region: CloudRegion,
  mobile: boolean,
  tones: CloudTones,
  lightningEnabled: boolean,
): Clouds {
  const rand = mulberry32(23);
  const count = mobile ? CLOUD_PLANES_MOBILE : CLOUD_PLANES_DESKTOP;
  const slabs: Slab[] = [];
  const seeds: number[] = [];
  // Centre of the deck: behind the stack, on the far side from the camera.
  const back = {
    x: region.cx - Math.cos(region.view) * region.half * DECK_BACK,
    z: region.cz - Math.sin(region.view) * region.half * DECK_BACK,
  };
  for (let i = 0; i < count; i++) {
    const height = count === 1 ? 0.8 : i / (count - 1);
    slabs.push({
      x: back.x + (rand() * 2 - 1) * region.half * 0.3,
      y: region.baseY + DECK_LIFT + height * DECK_SPREAD + rand() * 0.15,
      z: back.z + (rand() * 2 - 1) * region.half * 0.3,
      size: region.half * (SLAB_SPAN_MIN + SLAB_SPAN_RANGE * rand()),
      rot: rand() * Math.PI,
      shade: 0.55 + 0.45 * height,
    });
    seeds.push(rand());
  }

  const geometry = buildSlabGeometry(slabs);
  // Per-vertex slab seed (4 vertices per slab): drives each slab's drift speed and noise phase.
  const seedAttr = new Float32Array(count * 4);
  seeds.forEach((seed, i) => seedAttr.fill(seed, i * 4, i * 4 + 4));
  geometry.setAttribute('aSeed', new THREE.BufferAttribute(seedAttr, 1));

  const uniforms = {
    uTime: { value: 0 },
    uOpacity: { value: 0 },
    uDensity: { value: 0 },
    uLight: { value: 0 },
    uDrift: { value: new THREE.Vector2(DRIFT[0], DRIFT[1]) },
    uScale: { value: CLOUD_SCALE },
    uLit: { value: tones.lit.clone() },
    uShadow: { value: tones.shadow.clone() },
    uCenter: { value: new THREE.Vector2(region.cx, region.cz) },
    uView: { value: new THREE.Vector2(Math.cos(region.view), Math.sin(region.view)) },
    uHalf: { value: region.half },
    uNearFade: { value: 0.8 },
  };
  const material = new THREE.ShaderMaterial({
    vertexShader: CLOUD_VERTEX,
    fragmentShader: CLOUD_FRAGMENT,
    uniforms,
    transparent: true,
    depthWrite: false,
    side: THREE.DoubleSide,
  });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.renderOrder = 0;
  mesh.frustumCulled = false;
  const group = new THREE.Group();
  group.add(mesh);

  let clock = 0;
  // Lightning state: `timer` counts up to the next event, `event` runs while one is on.
  let timer = 0;
  let event = -1;

  const lightningAt = (dt: number, storm: number): number => {
    if (!lightningEnabled || dt <= 0) return 0;
    if (event < 0) {
      timer += dt;
      if (storm > LIGHTNING_STORM && timer >= LIGHTNING_INTERVAL) {
        event = 0;
        timer = 0;
      }
      return 0;
    }
    event += dt;
    if (event >= LIGHTNING_LENGTH) {
      event = -1;
      return 0;
    }
    // Zero slope at both ends: a slow up and a slow down, one peak.
    return 0.5 - 0.5 * Math.cos((2 * Math.PI * event) / LIGHTNING_LENGTH);
  };

  return {
    group,
    step(dt, storm) {
      clock += dt;
      const s = Math.min(1, Math.max(0, storm));
      const arrive = Math.min(1, Math.max(0, (s - 0.05) / 0.55));
      uniforms.uTime.value = clock;
      uniforms.uDensity.value = s;
      uniforms.uOpacity.value = 0.72 * arrive * arrive * (3 - 2 * arrive);
      const light = lightningAt(dt, s);
      uniforms.uLight.value = light;
      return light;
    },
    setTones(next) {
      uniforms.uLit.value.copy(next.lit);
      uniforms.uShadow.value.copy(next.shadow);
    },
    dispose() {
      geometry.dispose();
      material.dispose();
    },
  };
}
