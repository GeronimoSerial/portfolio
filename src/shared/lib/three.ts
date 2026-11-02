import * as THREE from 'three';

const MAX_PIXEL_RATIO = 2;

export function createRenderer(canvas: HTMLCanvasElement): THREE.WebGLRenderer {
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, MAX_PIXEL_RATIO));
  return renderer;
}

export interface ThemeColors {
  bg: string;
  ink: string;
  muted: string;
  accent: string;
}

// Reads the active theme's tokens so scenes can match the page palette.
export function readThemeColors(): ThemeColors {
  const style = getComputedStyle(document.documentElement);
  const read = (name: string) => style.getPropertyValue(name).trim();
  return {
    bg: read('--bg'),
    ink: read('--ink'),
    muted: read('--muted'),
    accent: read('--accent'),
  };
}
