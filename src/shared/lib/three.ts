import * as THREE from 'three';
import { MOBILE_BREAKPOINT } from '../motion/policy';

export function createRenderer(canvas: HTMLCanvasElement): THREE.WebGLRenderer {
  // MSAA does not smooth point sprites and costs fill on a full-screen canvas, so it stays off.
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false });
  // Phones get a lower pixel-ratio cap to bound fill cost; fitRig applies the same tier cap on resize.
  const maxRatio = window.innerWidth < MOBILE_BREAKPOINT ? 1.5 : 2;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, maxRatio));
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
