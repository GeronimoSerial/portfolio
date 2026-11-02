import { FOCUS_GLSL } from './base';

// Risk plate: an opaque province-shaped map. The underlay is the satellite image, about 70%
// desaturated and scaled to the theme's brightness, shaded by the hillshade, so the terrain stays
// recognisable. The exposure field, sampled bilinearly, is a muted overlay: transparent where
// exposure is zero, sand at mid exposure, terracotta at high exposure, with alpha capped at 0.75
// so the imagery still shows through.

export const riskVertex = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const riskFragment = /* glsl */ `
  uniform sampler2D uSat;
  uniform sampler2D uHillshade;
  uniform sampler2D uExpo;
  uniform sampler2D uFoot;
  uniform float uHasSat;
  uniform vec3 uBase;      // plate tone with no imagery
  uniform float uUnderlay; // underlay brightness, per theme
  uniform vec3 uSand;      // overlay at mid exposure
  uniform vec3 uBrick;     // overlay at high exposure
  varying vec2 vUv;
  ${FOCUS_GLSL}

  const float DESATURATION = 0.7;
  const float OVERLAY_ALPHA = 0.75;

  void main() {
    float inside = smoothstep(0.4, 0.6, texture2D(uFoot, vUv).r);
    if (inside < 0.003) discard;

    float shade = texture2D(uHillshade, vUv).r;
    vec3 under = uBase * mix(0.7, 1.0, shade);
    if (uHasSat > 0.5) {
      vec3 sat = texture2D(uSat, vUv).rgb;
      float lum = dot(sat, vec3(0.299, 0.587, 0.114));
      vec3 desat = mix(sat, vec3(lum), DESATURATION);
      under = desat * uUnderlay * mix(0.8, 1.05, shade);
    }

    float t = clamp(texture2D(uExpo, vUv).r, 0.0, 1.0);
    vec3 tint = mix(uSand, uBrick, smoothstep(0.5, 1.0, t));
    float alpha = OVERLAY_ALPHA * smoothstep(0.04, 0.9, t);
    vec3 c = mix(under, tint, alpha);
    gl_FragColor = vec4(applyFocus(c), 1.0);
  }
`;
