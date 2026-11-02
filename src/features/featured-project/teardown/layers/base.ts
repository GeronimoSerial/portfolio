import * as THREE from 'three';
import { srgbArrayOf, type Rgb } from '../palette';
import { isDarkTheme } from './ramps';
import type { SharedResources } from './shared';
import type { LayerHandle, Palette, Role } from './types';

// Shared scaffolding for layer builders: material tracking, palette roles, focus and disposal.
// Every material is opaque. Focus is 1 for full colour and 0 for a receded layer. A receded layer
// darkens and desaturates on the dark theme (about 36% brightness); on the light theme it
// desaturates and drifts toward the page colour, so it reads as a pale plate, never a black one.
// ShaderMaterials read the focus and the theme from `uFocus`, `uLight` and `uPage`; basic
// materials get their colour rewritten from `userData.tone`, the current palette colour.

// Light theme: how far a receded colour moves toward the page colour (0 = unchanged, 1 = page).
export const RECEDE_TO_PAGE = 0.35;

export const FOCUS_GLSL = /* glsl */ `
  uniform float uFocus;
  uniform float uLight; // 1 on the light theme, 0 on the dark theme
  uniform vec3 uPage;   // page colour, sRGB: the light theme's recede target
  vec3 applyFocus(vec3 c) {
    float l = dot(c, vec3(0.299, 0.587, 0.114));
    vec3 desat = vec3(l) + (c - vec3(l)) * 0.25;
    vec3 darkRecede = desat * 0.36;
    vec3 lightRecede = mix(desat, uPage, ${RECEDE_TO_PAGE.toFixed(2)});
    vec3 receded = mix(darkRecede, lightRecede, uLight);
    return mix(receded, c, uFocus);
  }
`;

const RECEDED_GAIN = 0.40;
const RECEDED_SATURATION = 0.25;

// Palette state the focus helpers need: the theme flag and the page colour in both spaces.
export interface Theme {
  light: boolean;
  page: THREE.Color; // linear, for basic materials
  pageRgb: Rgb; // sRGB, for shader uniforms
}

const DARK_THEME: Theme = { light: false, page: new THREE.Color(), pageRgb: [0, 0, 0] };

// The palette base is the page colour the scene paints over; it is the light recede target.
export const themeOf = (p: Palette): Theme => ({
  light: !isDarkTheme(p),
  page: p.base,
  pageRgb: srgbArrayOf(p.base),
});

// Receded channel. Dark: today's darkening. Light: desaturate, then move toward the page.
const receded = (c: number, lum: number, page: number, light: boolean): number => {
  const desat = lum + (c - lum) * RECEDED_SATURATION;
  return light ? desat + (page - desat) * RECEDE_TO_PAGE : desat * RECEDED_GAIN;
};

// `shared` names the textures the scene owns, so dispose() leaves them alone.
export function createLayer(shared?: SharedResources): LayerHandle {
  const group = new THREE.Group();
  const materials: THREE.Material[] = [];
  let focus = 1;
  let theme: Theme = DARK_THEME;
  return {
    group,
    materials,
    paint: (p) => {
      theme = themeOf(p);
      applyRoles(materials, p);
      applyFocus(materials, focus, theme);
    },
    setFocus: (f) => {
      focus = Math.min(1, Math.max(0, f));
      applyFocus(materials, focus, theme);
    },
    dispose: () => disposeLayer(group, materials, (t) => shared?.owns(t) ?? false),
  };
}

// Tracks a material for palette, focus and disposal. Materials are opaque by construction.
// Shader materials that read `uFocus` also get the theme uniforms, so every layer can recede.
export function track<M extends THREE.Material>(
  handle: LayerHandle,
  material: M,
  role?: Role,
): M {
  material.userData = role ? { role, tone: new THREE.Color() } : {};
  const uniforms = (material as unknown as THREE.ShaderMaterial).uniforms;
  if (uniforms?.uFocus) {
    uniforms.uLight ??= { value: 0 };
    uniforms.uPage ??= { value: new THREE.Vector3() };
  }
  handle.materials.push(material);
  return material;
}

// Stores the palette colour of every role-bearing basic material. Focus is applied afterwards.
export function applyRoles(materials: THREE.Material[], p: Palette): void {
  for (const m of materials) {
    const role = m.userData.role as Role | undefined;
    if (!role) continue;
    (m.userData.tone as THREE.Color).copy(p[role]);
  }
}

// Writes the focused colour into basic materials and the focus and theme uniforms into
// ShaderMaterials. Allocation-free: the colour and vector objects are reused.
export function applyFocus(materials: THREE.Material[], f: number, theme: Theme = DARK_THEME): void {
  for (const m of materials) {
    const uniforms = (m as THREE.ShaderMaterial).uniforms;
    if (uniforms?.uFocus) {
      uniforms.uFocus.value = f;
      if (uniforms.uLight) uniforms.uLight.value = theme.light ? 1 : 0;
      (uniforms.uPage?.value as THREE.Vector3 | undefined)?.set(...theme.pageRgb);
    }
    const tone = m.userData.tone as THREE.Color | undefined;
    if (!tone || !('color' in m)) continue;
    const lum = tone.r * 0.299 + tone.g * 0.587 + tone.b * 0.114;
    const { light, page } = theme;
    (m as THREE.MeshBasicMaterial).color.setRGB(
      f * tone.r + (1 - f) * receded(tone.r, lum, page.r, light),
      f * tone.g + (1 - f) * receded(tone.g, lum, page.g, light),
      f * tone.b + (1 - f) * receded(tone.b, lum, page.b, light),
    );
  }
}

// Frees everything a layer owns: geometries, materials and every texture a material references,
// except textures that `isShared` reports as owned by the scene.
export function disposeLayer(
  group: THREE.Group,
  materials: THREE.Material[],
  isShared: (texture: THREE.Texture) => boolean = () => false,
): void {
  group.traverse((obj) => {
    const mesh = obj as THREE.Mesh;
    mesh.geometry?.dispose();
  });
  for (const m of materials) {
    for (const value of Object.values((m as THREE.ShaderMaterial).uniforms ?? {})) {
      if (value.value instanceof THREE.Texture && !isShared(value.value)) value.value.dispose();
    }
    (m as THREE.MeshBasicMaterial).map?.dispose();
    m.dispose();
  }
}
