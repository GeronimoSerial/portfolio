import * as THREE from 'three';
import { PLATE_SIZE } from './data';
import { mulberry32 } from './slabs';

// Rain over the province: ONE THREE.Points draw call. Thin streaks with a per-drop speed and
// length; wind leans every streak, with slow gusts and more wind higher up. Density follows the
// model's rain (rainNorm), and the colour is a neutral tone from the theme, never blue or glowing.
// Overall rain strength. The streaks are a mood layer: they must never compete with the map.
const RAIN_GAIN = 0.5;
export const WEATHER_DESKTOP = 3000;
export const WEATHER_MOBILE = 1200;

const TOP = 7.5; // world y where a drop respawns
const BOTTOM = -0.6;
const SPAN = PLATE_SIZE * 0.6; // a little wider than the plate, so the field stays full
const SIZE_MIN = 0.16; // streak length, world units
const SIZE_RANGE = 0.2;
const FALL_BASE = 2.2;
const FALL_STORM = 5.5;
const WIND_BASE = 0.7;
const WIND_STORM = 2.6;
const OPACITY_FLOOR = 0.1;
const DENSITY_FLOOR = 0.1; // share of the drops that stay visible at the lightest rain

export interface WeatherTones {
  rain: THREE.Color;
}

export interface Weather {
  group: THREE.Group;
  // Advances the field by dt seconds (0 = static frame). `storm` drives opacity and wind;
  // `rainNorm` (0..1, from the model) drives how many drops are drawn.
  step(dt: number, storm: number, rainNorm: number): void;
  setTones(tones: WeatherTones): void;
  // Pixel height of the drawing buffer and the vertical field of view, so drops keep their size.
  resize(pixelHeight: number, fovDeg: number): void;
  dispose(): void;
}

const clamp01 = (v: number): number => Math.min(1, Math.max(0, v));

// Each drop is a square point; the fragment shader paints one streak inside it. The streak leans
// by aLean (horizontal shift per unit of drop length), which is how the wind bends the rain.
const RAIN_VERTEX = /* glsl */ `
  attribute float aSize;
  attribute float aAlpha;
  attribute float aLean;
  uniform float uPxPerUnit;
  uniform float uOpacity;
  varying float vAlpha;
  varying float vLean;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_PointSize = aSize * uPxPerUnit / max(-mv.z, 0.1);
    vAlpha = aAlpha * uOpacity;
    vLean = aLean;
    gl_Position = projectionMatrix * mv;
  }
`;

const RAIN_FRAGMENT = /* glsl */ `
  uniform vec3 uColor;
  varying float vAlpha;
  varying float vLean;
  void main() {
    vec2 p = gl_PointCoord - 0.5;
    float along = smoothstep(0.5, 0.18, abs(p.y)); // fades towards both ends
    float across = smoothstep(0.035, 0.0, abs(p.x - p.y * vLean)); // hair-thin, leaning
    float a = along * across * vAlpha;
    if (a < 0.01) discard;
    gl_FragColor = vec4(uColor, a);
  }
`;

export function createWeather(mobile: boolean, tones: WeatherTones): Weather {
  const count = mobile ? WEATHER_MOBILE : WEATHER_DESKTOP;
  const rand = mulberry32(7);
  const positions = new Float32Array(count * 3);
  const sizes = new Float32Array(count);
  const alphas = new Float32Array(count);
  const speeds = new Float32Array(count);
  const leans = new Float32Array(count);
  for (let i = 0; i < count; i++) {
    positions[3 * i] = (rand() * 2 - 1) * SPAN;
    positions[3 * i + 1] = BOTTOM + rand() * (TOP - BOTTOM);
    positions[3 * i + 2] = (rand() * 2 - 1) * SPAN;
    sizes[i] = SIZE_MIN + SIZE_RANGE * rand() * rand(); // most drops short, a few long
    alphas[i] = 0.3 + 0.7 * rand();
    speeds[i] = 0.75 + 0.5 * rand();
  }

  const geometry = new THREE.BufferGeometry();
  const positionAttr = new THREE.Float32BufferAttribute(positions, 3);
  positionAttr.setUsage(THREE.DynamicDrawUsage);
  const leanAttr = new THREE.Float32BufferAttribute(leans, 1);
  leanAttr.setUsage(THREE.DynamicDrawUsage);
  geometry.setAttribute('position', positionAttr);
  geometry.setAttribute('aSize', new THREE.Float32BufferAttribute(sizes, 1));
  geometry.setAttribute('aAlpha', new THREE.Float32BufferAttribute(alphas, 1));
  geometry.setAttribute('aLean', leanAttr);

  const material = new THREE.ShaderMaterial({
    vertexShader: RAIN_VERTEX,
    fragmentShader: RAIN_FRAGMENT,
    uniforms: {
      uColor: { value: tones.rain.clone() },
      uOpacity: { value: 0 },
      uPxPerUnit: { value: 1 },
    },
    transparent: true,
    depthWrite: false,
  });
  const rain = new THREE.Points(geometry, material);
  // The field spans the whole volume; skip the bounds test so no drop pops out at the edge.
  rain.frustumCulled = false;
  rain.renderOrder = 1;
  const group = new THREE.Group();
  group.add(rain);

  let clock = 0;
  let shown = -1;

  const step = (dt: number, storm: number, rainNorm: number): void => {
    const s = clamp01(storm);
    const density = DENSITY_FLOOR + (1 - DENSITY_FLOOR) * clamp01(rainNorm);
    const active = Math.round(count * density);
    if (active !== shown) {
      geometry.setDrawRange(0, active);
      shown = active;
    }
    material.uniforms.uOpacity.value = Math.max(OPACITY_FLOOR, s) * RAIN_GAIN;
    clock += dt;

    // Gusts: one slow swell plus a faster flutter, so the lean never sits still.
    const gust = 1 + 0.35 * Math.sin(clock * 0.31) + 0.15 * Math.sin(clock * 0.83 + 1.7);
    const wind = (WIND_BASE + WIND_STORM * s) * gust;
    const fallBase = FALL_BASE + FALL_STORM * s;
    const arr = positionAttr.array as Float32Array;
    const leanArr = leanAttr.array as Float32Array;
    for (let i = 0; i < active; i++) {
      const o = 3 * i;
      const height = (arr[o + 1] - BOTTOM) / (TOP - BOTTOM); // 0 at the ground, 1 at the top
      const fall = fallBase * speeds[i];
      // Wind shears with height: the upper drops are pushed harder, so streaks lean more there.
      leanArr[i] = (wind * (0.55 + 0.9 * height)) / fall;
      if (dt <= 0) continue;
      const travel = dt;
      arr[o] -= wind * (0.55 + 0.9 * height) * travel; // west
      arr[o + 2] += wind * 0.5 * travel; // south: the drift is slightly diagonal
      arr[o + 1] -= fall * travel;
      if (arr[o + 1] < BOTTOM) arr[o + 1] += TOP - BOTTOM;
      if (arr[o] < -SPAN) arr[o] += 2 * SPAN;
      if (arr[o + 2] > SPAN) arr[o + 2] -= 2 * SPAN;
    }
    leanAttr.needsUpdate = true;
    if (dt > 0) positionAttr.needsUpdate = true;
  };

  return {
    group,
    step,
    setTones: (next) => {
      material.uniforms.uColor.value.copy(next.rain);
    },
    resize: (pixelHeight, fovDeg) => {
      // Pixels per world unit at distance 1: the drop size follows the perspective like a sprite.
      const halfFov = THREE.MathUtils.degToRad(fovDeg) / 2;
      material.uniforms.uPxPerUnit.value = pixelHeight / (2 * Math.tan(halfFov));
    },
    dispose: () => {
      geometry.dispose();
      material.dispose();
    },
  };
}
