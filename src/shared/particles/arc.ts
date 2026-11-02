import * as THREE from 'three';
import { GLOBE_CENTER_Y, GLOBE_CENTRE_LON, GLOBE_RADIUS, USA_NY } from './shapes';
import type { ParticleUniforms } from './material';

// Great-circle arc from Corrientes to New York, drawn on the globe frame and lifted off the surface.
const CORRIENTES = { lat: -27.47, lon: -58.83 };
const ARC_LIFT = 0.12; // peak lift at the midpoint, in globe radii
const ARC_JITTER = 0.004; // radial scatter, in globe radii
const DEG = Math.PI / 180;
const REVEAL_EDGE = 0.06; // width of the soft leading edge, in arc parameter
// Reveal value at which every point is drawn, the New York end (aT = 1) included.
export const ARC_REVEAL_END = 1 + REVEAL_EDGE;
const ENDPOINT_POINTS = 30; // points per endpoint cluster
const ENDPOINT_SPREAD = 0.012; // cluster radius, in globe radii

const VS = `
attribute float aT;
attribute float aGlow;
uniform float uReveal;
uniform float uAlpha;
uniform float uSize;
uniform float uPixelRatio;
uniform float uRef;
varying float vA;
varying float vG;

void main() {
  vec4 mv = modelViewMatrix * vec4(position, 1.0);
  vA = (1.0 - smoothstep(uReveal - ${REVEAL_EDGE.toFixed(3)}, uReveal, aT)) * uAlpha;
  vG = aGlow;
  gl_Position = projectionMatrix * mv;
  gl_PointSize = clamp(uSize * (1.0 + 0.4 * aGlow) * uPixelRatio * uRef / max(-mv.z, 0.5), 0.0, 10.0 * uPixelRatio);
}
`;

const FS = `
uniform vec3 uColor;
varying float vA;
varying float vG;

void main() {
  vec2 c = gl_PointCoord - 0.5;
  float d = length(c);
  if (d > 0.5) discard;
  float a = 1.0 - smoothstep(0.2, 0.5, d);
  gl_FragColor = vec4(uColor, a * mix(0.7, 1.0, vG) * vA);
}
`;

function unit(lat: number, lon: number): THREE.Vector3 {
  const phi = lat * DEG;
  const lam = (lon - GLOBE_CENTRE_LON) * DEG;
  return new THREE.Vector3(Math.cos(phi) * Math.sin(lam), Math.sin(phi), Math.cos(phi) * Math.cos(lam));
}

// Positions are in the globe's local frame, centred on GLOBE_CENTER_Y. `aT` runs 0 at Corrientes to 1 at New York.
// `aGlow` is 1 for the two endpoint clusters, which are brighter and sit on the surface.
export function buildArc(n: number): { positions: Float32Array; t: Float32Array; glow: Float32Array } {
  const a = unit(CORRIENTES.lat, CORRIENTES.lon);
  const b = unit(USA_NY.lat, USA_NY.lon);
  const omega = Math.acos(THREE.MathUtils.clamp(a.dot(b), -1, 1));
  const total = n + 2 * ENDPOINT_POINTS;
  const positions = new Float32Array(total * 3);
  const t = new Float32Array(total);
  const glow = new Float32Array(total);
  const p = new THREE.Vector3();
  for (let i = 0; i < n; i++) {
    const u = (i + Math.random()) / n;
    const wa = Math.sin((1 - u) * omega) / Math.sin(omega);
    const wb = Math.sin(u * omega) / Math.sin(omega);
    p.copy(a).multiplyScalar(wa).addScaledVector(b, wb).normalize();
    const r = GLOBE_RADIUS * (1 + ARC_LIFT * Math.sin(Math.PI * u) + (Math.random() * 2 - 1) * ARC_JITTER);
    positions[i * 3] = p.x * r;
    positions[i * 3 + 1] = GLOBE_CENTER_Y + p.y * r;
    positions[i * 3 + 2] = p.z * r;
    t[i] = u;
  }
  const spread = ENDPOINT_SPREAD * GLOBE_RADIUS;
  [a, b].forEach((dir, end) => {
    for (let k = 0; k < ENDPOINT_POINTS; k++) {
      const i = n + end * ENDPOINT_POINTS + k;
      positions[i * 3] = dir.x * GLOBE_RADIUS + (Math.random() * 2 - 1) * spread;
      positions[i * 3 + 1] = GLOBE_CENTER_Y + dir.y * GLOBE_RADIUS + (Math.random() * 2 - 1) * spread;
      positions[i * 3 + 2] = dir.z * GLOBE_RADIUS + (Math.random() * 2 - 1) * spread;
      t[i] = end; // 0 at Corrientes, 1 at New York: each cluster appears as the arc reaches it
      glow[i] = 1;
    }
  });
  return { positions, t, glow };
}

// Shares the dot colour and point scale with the main cloud through the same uniform objects.
export function createArcMaterial(shared: ParticleUniforms) {
  const uniforms = {
    uReveal: { value: 0 },
    uAlpha: { value: 0 },
    uColor: shared.uColor,
    uSize: shared.uSize,
    uPixelRatio: shared.uPixelRatio,
    uRef: shared.uRef,
  };
  const material = new THREE.ShaderMaterial({
    uniforms,
    vertexShader: VS,
    fragmentShader: FS,
    transparent: true,
    depthWrite: false,
    blending: THREE.NormalBlending,
  });
  return { material, uniforms };
}
