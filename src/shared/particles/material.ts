import * as THREE from 'three';
import { GLOBE_CENTER_Y } from './shapes';

// Vertex: intro scatter with a swirl around Y that unwinds as uIntro reaches 1,
// two-slot morph from aFrom to aTo with a per-point stagger (uProgress 0..1),
// idle drift and pointer repulsion.
// The globe facing fade is weighted by the globe slots, so it never touches other shapes.
// Flame points (bright > 1, item 5 only) flicker and drift down from the nozzle while uFlame > 0; with uFlame 0
// they are hidden, so every other figure and morph is unaffected.
// Drift and pointer repulsion are divided by uScale so they stay in screen space when zoomed.
const VS = `
attribute vec3 aFrom;
attribute vec3 aTo;
attribute float aSeed;
attribute float aFromBright;
attribute float aToBright;
uniform float uProgress;
uniform float uFromGlobe;
uniform float uToGlobe;
uniform float uTime;
uniform float uIntro;
uniform float uDrift;
uniform float uScale;
uniform vec2 uMouse;
uniform float uSize;
uniform float uPixelRatio;
uniform float uRef;
uniform float uFlame;
uniform float uFlicker;
uniform float uDisperse;
uniform vec2 uWind;
uniform float uFlow;
uniform vec3 uSink;
varying float vBright;
varying float vFade;
varying float vAlpha;

const vec3 GLOBE_C = vec3(0.0, ${GLOBE_CENTER_Y.toFixed(4)}, 0.0);

float smooth01(float x) {
  float c = clamp(x, 0.0, 1.0);
  return c * c * (3.0 - 2.0 * c);
}

float hash11(float x) {
  return fract(sin(x) * 43758.5453);
}

void main() {
  float s = aSeed;
  float k = smooth01((uProgress - s * 0.3) / 0.7);
  vec3 shape = mix(aFrom, aTo, k);
  // Flame flag from the slot the point is drawn from; the flame stays on one side of the morph per point.
  // Flame points have bright in (1, 2]; streamers (project figures) have bright 2.5 and are not flame.
  float fl = k < 0.5 ? step(1.001, aFromBright) - step(2.001, aFromBright) : step(1.001, aToBright) - step(2.001, aToBright);
  float bright = min(mix(aFromBright, aToBright, k), 1.0);

  float h1 = fract(sin(s * 127.1) * 43758.5453);
  float h2 = fract(sin(s * 311.7 + 1.3) * 43758.5453);
  float h3 = fract(sin(s * 74.7 + 2.1) * 43758.5453);
  float th = h1 * 6.2831853;
  float ph = acos(clamp(2.0 * h2 - 1.0, -1.0, 1.0));
  float rr = 18.0 * (0.6 + 0.4 * h3);
  vec3 scatter = rr * vec3(sin(ph) * cos(th), sin(ph) * sin(th), cos(ph));

  float swirl = (1.0 - uIntro) * 1.6;
  float cs = cos(swirl);
  float ss = sin(swirl);
  scatter = vec3(scatter.x * cs + scatter.z * ss, scatter.y, -scatter.x * ss + scatter.z * cs);

  float ki = smooth01((uIntro - s * 0.4) / 0.6);
  vec3 p = mix(scatter, shape, ki);

  // Streamers leave their glyph along a quadratic arc into uSink and fade out there; the phase is per point, so the
  // flow never reads as a wave. uFlow 0 (reduced motion) keeps them still and fully lit.
  float streamW = smooth01((k - 0.5) / 0.5) * step(2.001, aToBright) * uFlow;
  float su = fract(s * 7.31 + uTime * 0.15 * uFlow);
  vec3 ctrl = mix(shape, uSink, 0.5) + vec3(0.0, 0.35 * length(uSink - shape), 0.0);
  vec3 q = (1.0 - su) * (1.0 - su) * shape + 2.0 * (1.0 - su) * su * ctrl + su * su * uSink;
  float streamA = mix(1.0, sin(3.14159265 * su), streamW);
  p = mix(p, q, streamW);

  // Dispersal: each point leaves at its own time, speed and angle, so the map thins out downwind and spreads
  // a little as it goes. uDisperse 0 leaves the point where it was.
  float dz = clamp((uDisperse - s * 0.5) / 0.5, 0.0, 1.0);
  float speed = 0.6 + 0.8 * h3;
  vec2 jitter = vec2(h1 - 0.5, h2 - 0.5) * 0.5 * length(uWind);
  vec2 rel = p.xy - GLOBE_C.xy;
  p.xy = GLOBE_C.xy + rel * (1.0 + 0.3 * uDisperse) + (uWind + jitter) * dz * speed;
  p.y += dz * 0.02 * sin(uTime * 0.9 + s * 40.0);

  p.xy += uDrift * 0.004 / uScale * vec2(sin(uTime * 0.3 + s * 6.2831853), cos(uTime * 0.3 + s * 12.566371));

  // Flame: each point travels 0 to 0.5 units down from the nozzle and wraps; age 0 at the nozzle, 1 at the tail.
  // uFlicker 0 (reduced motion) holds the flame still.
  float age = fract(s + uTime * 0.9) * uFlicker;
  float flick = mix(1.0, 0.55 + 0.45 * hash11(s * 91.7 + floor(uTime * 14.0)), uFlicker);
  p.y -= fl * 0.5 * age;
  p.x += fl * uFlicker * 0.02 * sin(uTime * 23.0 + s * 80.0);
  float flameA = fl * uFlame * (1.0 - age) * flick;
  float sizeMul = mix(1.0, mix(1.3, 0.6, age), fl);

  vec2 d = p.xy - uMouse;
  float dist = length(d);
  float radius = 0.2 / uScale;
  float f = 1.0 - smoothstep(0.0, radius, dist);
  vec2 dir = d / max(dist, 0.0001);
  p.xy += dir * f * 0.07 / uScale;

  vec4 mv = modelViewMatrix * vec4(p, 1.0);

  // Globe facing: view-space normal of the globe slot, faded out on the back side.
  vec3 src = uToGlobe > 0.5 ? aTo : aFrom;
  vec3 gn = normalize(src - GLOBE_C);
  float facing = normalize(normalMatrix * gn).z;
  float globeW = uToGlobe * k + uFromGlobe * (1.0 - k);
  vFade = mix(1.0, smoothstep(-0.15, 0.35, facing), globeW);

  gl_Position = projectionMatrix * mv;
  gl_PointSize = clamp(uSize * sizeMul * uPixelRatio * uRef / max(-mv.z, 0.5), 0.0, 10.0 * uPixelRatio);
  vBright = bright;
  vAlpha = ((1.0 - fl) + flameA) * streamA;
}
`;

// Fragment: soft round dot, alpha 0.62 * (0.5 + 0.5 * bright), scaled by facing and layer opacity.
const FS = `
uniform vec3 uColor;
uniform float uOpacity;
varying float vBright;
varying float vFade;
varying float vAlpha;

void main() {
  vec2 c = gl_PointCoord - 0.5;
  float d = length(c);
  if (d > 0.5) discard;
  float a = 1.0 - smoothstep(0.2, 0.5, d);
  gl_FragColor = vec4(uColor, a * 0.62 * (0.5 + 0.5 * vBright) * vFade * uOpacity * vAlpha);
}
`;

export function createParticleUniforms() {
  return {
    uProgress: { value: 1 },
    uFromGlobe: { value: 0 },
    uToGlobe: { value: 0 },
    uTime: { value: 0 },
    uMouse: { value: new THREE.Vector2(99, 99) },
    uIntro: { value: 0 },
    uDrift: { value: 1 },
    uScale: { value: 1 },
    uColor: { value: new THREE.Color('#ECEBEE') },
    uSize: { value: 1.9 },
    uPixelRatio: { value: 1 },
    uRef: { value: 6 },
    uOpacity: { value: 1 },
    uFlame: { value: 0 },
    uFlicker: { value: 1 },
    uDisperse: { value: 0 },
    uWind: { value: new THREE.Vector2(0, 0) },
    uFlow: { value: 0 },
    uSink: { value: new THREE.Vector3() },
  };
}

export type ParticleUniforms = ReturnType<typeof createParticleUniforms>;

export function createParticleMaterial(uniforms: ParticleUniforms): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    uniforms,
    vertexShader: VS,
    fragmentShader: FS,
    transparent: true,
    depthWrite: false,
    blending: THREE.NormalBlending,
  });
}
