import { FOCUS_GLSL } from './base';
import { SCAN_FADE_S, SCAN_HUE_RATE, SCAN_MIX, SCAN_RAMP_STOPS, SCAN_RESIDUAL } from './satellites';

// Territory shaders: one displaced DEM mesh. The fragment stage carries the satellite base, the
// rain and wetness response, the flood water and the satellite scan paint in the same opaque surface.

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
  uniform sampler2D uScan; // R: paint clock per texel, -1 = never painted
  uniform vec3 uRamp[${SCAN_RAMP_STOPS}];
  uniform float uScanAll;
  uniform float uScanClock;
  uniform float uScanTexel;
  varying vec2 vUv;
  varying float vH;
  ${FOCUS_GLSL}
  // Precipitation ramp, t in 0..1, piecewise linear over the stops.
  vec3 scanRamp(float t) {
    float x = clamp(t, 0.0, 0.9999) * ${(SCAN_RAMP_STOPS - 1).toFixed(1)};
    float f = fract(x);
    vec3 a = uRamp[0];
    vec3 b = uRamp[1];
    if (x >= 1.0) { a = uRamp[1]; b = uRamp[2]; }
    if (x >= 2.0) { a = uRamp[2]; b = uRamp[3]; }
    if (x >= 3.0) { a = uRamp[3]; b = uRamp[4]; }
    return mix(a, b, f);
  }
  // Paint strength at one uv: fresh at the satellite, relaxing to a residual, 0 where never painted.
  float scanStrengthAt(vec2 uv) {
    float c = texture2D(uScan, uv).r;
    float a = max(uScanClock - c, 0.0);
    float s = mix(${SCAN_RESIDUAL.toFixed(2)}, 1.0, exp(-a / ${SCAN_FADE_S.toFixed(1)}));
    return mix(s * step(0.0, c), 1.0, uScanAll);
  }
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

    // Scan paint: land under a satellite's swath takes the precipitation ramp, fresh at the
    // satellite and fading slowly to a residual. Only land is painted, never the flood water.
    float clock = texture2D(uScan, vUv).r;
    float age = max(uScanClock - clock, 0.0);
    // Nine taps spread over a few texels feather the edge of the swath, so the paint reads as a smooth
    // field and not as stamped discs.
    vec2 o = vec2(uScanTexel * 2.5);
    float strength = scanStrengthAt(vUv) * 0.28
      + 0.09 * (scanStrengthAt(vUv + vec2(o.x, 0.0)) + scanStrengthAt(vUv - vec2(o.x, 0.0))
              + scanStrengthAt(vUv + vec2(0.0, o.y)) + scanStrengthAt(vUv - vec2(0.0, o.y))
              + scanStrengthAt(vUv + o) + scanStrengthAt(vUv - o)
              + scanStrengthAt(vUv + vec2(o.x, -o.y)) + scanStrengthAt(vUv + vec2(-o.x, o.y)));
    // The colour follows the precipitation field, then drifts along the ramp (a triangle wave, so it
    // swings back instead of jumping) with the time since a satellite last passed: the map keeps
    // changing colour as the satellites move.
    // Risk of the ground as the platform reads it: rain, the (softened) JRC flood hazard, and low ground.
    vec2 hz = vec2(0.035);
    float hazard = 0.25 * (texture2D(uMask, vUv + vec2(hz.x, 0.0)).r + texture2D(uMask, vUv - vec2(hz.x, 0.0)).r
                         + texture2D(uMask, vUv + vec2(0.0, hz.y)).r + texture2D(uMask, vUv - vec2(0.0, hz.y)).r);
    float rampBase = clamp(0.3 * smoothstep(0.0, 0.7, texture2D(uPrecip, vUv).r) + 0.9 * hazard + 0.55 * (1.0 - vH) + 0.2, 0.0, 1.0);
    float rampDrift = 0.55 + 0.45 * abs(fract((rampBase + age * ${SCAN_HUE_RATE.toFixed(3)}) * 0.5) * 2.0 - 1.0);
    vec3 paint = scanRamp(mix(rampBase, rampDrift, 0.4));
    float paintAmt = ${SCAN_MIX.toFixed(2)} * strength * (1.0 - cover);
    // The platform draws its heat map on a dark base so the gamut pops. A green satellite image under
    // a green ramp would make the paint disappear: darken and desaturate the ground under it first.
    float baseLum = dot(col, vec3(0.299, 0.587, 0.114));
    col = mix(col, vec3(baseLum) * 0.45, 0.8 * paintAmt);
    col = mix(col, paint, paintAmt);

    gl_FragColor = vec4(applyFocus(col), 1.0);
  }
`;
