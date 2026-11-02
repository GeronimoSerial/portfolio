import { FOCUS_GLSL } from './base';

// Territory shaders: one displaced DEM mesh. The fragment stage carries the satellite base, the
// rain and wetness response, and the flood water painted into the same opaque surface.

export const territoryVertex = /* glsl */ `
  uniform sampler2D uHeight;
  uniform float uGrid;
  uniform float uHeightScale;
  varying vec2 vUv;
  varying float vH;
  void main() {
    vUv = uv;
    // Texel centres sit at (i + 0.5) / n, so sample there to match the bilinear model sampler.
    vH = texture2D(uHeight, (uv * (uGrid - 1.0) + 0.5) / uGrid).r;
    vec3 p = position;
    p.y = vH * uHeightScale;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  }
`;

export const territoryFragment = /* glsl */ `
  uniform sampler2D uHeight;
  uniform sampler2D uHillshade;
  uniform sampler2D uSat;
  uniform float uHasSat;
  uniform sampler2D uPrecip;
  uniform sampler2D uMask;
  uniform sampler2D uFoot;
  uniform float uGrid;
  uniform vec3 uLow;
  uniform vec3 uHigh;
  uniform vec3 uShallow;
  uniform vec3 uDeep;
  uniform float uStorm;
  uniform float uWet;
  uniform float uLevel;
  uniform float uTime;
  uniform float uDetail;
  varying vec2 vUv;
  varying float vH;
  ${FOCUS_GLSL}
  void main() {
    float inside = smoothstep(0.4, 0.6, texture2D(uFoot, vUv).r);
    if (inside < 0.003) discard;

    // Base: satellite true colour when baked, otherwise the hillshaded earth tones.
    float hs = texture2D(uHillshade, vUv).r;
    vec3 terrain = mix(uLow, uHigh, smoothstep(0.0, 1.0, vH)) * mix(0.55, 1.08, hs);
    vec3 sat = texture2D(uSat, vUv).rgb * mix(0.6, 1.05, hs);
    vec3 col = mix(terrain, sat, uHasSat);

    // Rain: a faint desaturation and darkening, scaled by the storm and the precipitation field.
    float rain = texture2D(uPrecip, vUv).r * uStorm;
    float lum = dot(col, vec3(0.299, 0.587, 0.114));
    col = mix(col, vec3(lum), 0.2 * rain);
    col *= 1.0 - 0.18 * rain - 0.1 * uStorm;

    // Wet ground: less saturated and darker as the soil soaks.
    lum = dot(col, vec3(0.299, 0.587, 0.114));
    col = mix(col, vec3(lum) * 0.85, uWet * 0.35);
    col *= 1.0 - 0.14 * uWet;

    // Water: below the level and inside the flood extent, in the same opaque surface.
    float h = texture2D(uHeight, (vUv * (uGrid - 1.0) + 0.5) / uGrid).r;
    float below = 1.0 - smoothstep(uLevel - 0.005, uLevel + 0.005, h);
    float extent = smoothstep(0.12, 0.2, texture2D(uMask, vUv).r);
    float cover = below * extent;
    if (cover > 0.003) {
      float depth = clamp((uLevel - h) * 6.0, 0.0, 1.0);
      vec3 water = mix(uShallow, uDeep, depth);
      // Two scrolling ripple octaves perturb the shade; mobile (uDetail 0) keeps a flat surface.
      float r1 = sin(vUv.x * 210.0 + uTime * 1.4) * sin(vUv.y * 170.0 - uTime * 1.1);
      float r2 = sin((vUv.x * 0.7 + vUv.y) * 460.0 - uTime * 2.6);
      float ripple = (0.6 * r1 + 0.4 * r2) * uDetail;
      water *= 1.0 + 0.07 * ripple;
      // Sheen: a fixed-direction streak, static on mobile.
      float s = sin(vUv.x * 9.0 - vUv.y * 5.0 + ripple * 0.25);
      water += vec3(pow(max(s, 0.0), 14.0) * 0.16);
      col = mix(col, water, cover * 0.6);
    }

    gl_FragColor = vec4(applyFocus(col), 1.0);
  }
`;
