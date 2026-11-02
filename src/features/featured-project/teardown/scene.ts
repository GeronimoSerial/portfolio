import * as THREE from 'three';
import { prefersReducedMotion } from '../../../shared/lib/motion';
import { createRenderer, readThemeColors } from '../../../shared/lib/three';
import { MOBILE_QUERY } from '../../../shared/motion/policy';
import { createAtmosphere } from './atmosphere';
import type { CloudRegion } from './clouds';
import {
  initialLayers,
  mountChoreography,
  ORBIT_SPAN,
  SEPARATION,
  type TeardownState,
} from './choreography';
import { loadGeoData, PLATE_SIZE, type GeoData } from './data';
import {
  AZIMUTH,
  CAMERA_FOV,
  defaultStack,
  type Frame,
  marginXFor,
  measureStack,
  placeOrbit,
  type Stack,
  solveFrame,
} from './framing';
import { LAYERS, type LayerId } from './layers';
import { buildAccess } from './layers/access';
import { buildRisk } from './layers/risk';
import { buildTerritory } from './layers/territory';
import { createSharedResources, type SharedResources } from './layers/shared';
import type { Env, LayerBuilder, LayerHandle, Palette } from './layers/types';
import { createModel, RAIN_STEPS, rainIndexForStorm, type Model } from './model';
import { assertReadoutsStable } from './readout.check';
import { createReadouts, type ReadoutCopy } from './readouts';

const BUILDERS: Record<LayerId, LayerBuilder> = {
  territory: buildTerritory,
  access: buildAccess,
  risk: buildRisk,
};

const MOBILE_ORBIT = 0.12;
const FADE_IN_MS = 600;

function readPalette(): Palette {
  const css = readThemeColors();
  const ink = new THREE.Color(css.ink);
  return {
    base: new THREE.Color(css.bg).lerp(ink, 0.07),
    ink,
    accent: new THREE.Color(css.accent),
    muted: new THREE.Color(css.muted),
    white: new THREE.Color(1, 1, 1),
    cssInk: css.ink,
  };
}

// Mounts the teardown inside `root` (the element with data-teardown).
// Motion allowed: one pinned sequence driven by scroll, on desktop and mobile alike (only the
// layout differs). Reduced motion: the static final state.
// Returns a cleanup that disposes GPU resources and observers.
export function mountTeardown(root: HTMLElement): () => void {
  const canvas = root.querySelector<HTMLCanvasElement>('[data-viz]');
  const wrapEl = root.querySelector<HTMLElement>('[data-canvas-wrap]');
  if (!canvas || !wrapEl) return () => {};
  // Non-null binding, so the closures below keep the narrowed type.
  const canvasWrap: HTMLElement = wrapEl;

  const lang = root.dataset.lang === 'en' ? 'en' : 'es';
  const copy = JSON.parse(root.dataset.strings ?? '{}') as ReadoutCopy;
  const mobile = window.matchMedia(MOBILE_QUERY).matches;
  const marginX = marginXFor(mobile);
  const reduce = prefersReducedMotion();
  const pinned = !reduce;
  root.classList.toggle('is-pinned', pinned);
  root.classList.toggle('is-reduced', reduce);

  const readouts = createReadouts(
    [...root.querySelectorAll<HTMLElement>('[data-readout]')],
    lang,
    copy,
  );
  const header = document.querySelector<HTMLElement>('header');

  // Storm starts calm; reduced motion shows the final storm at once. Territory is the base of
  // the stack from the start; access and risk are apart only when the pinned sequence reaches them.
  const state: TeardownState = {
    orbit: pinned ? 0 : MOBILE_ORBIT,
    storm: reduce ? 1 : 0,
    layers: initialLayers(reduce),
  };
  // The one shared environment object: layers keep a reference and read it on every tick.
  const env: Env = { storm: state.storm, wet: state.storm, water: 0, time: 0, lightning: 0 };
  const renderer = createRenderer(canvas);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(CAMERA_FOV, 1, 0.1, 100);

  let palette = readPalette();
  let model: Model | null = null;
  let handles: LayerHandle[] = [];
  let shared: SharedResources | null = null;
  let stack: Stack = defaultStack();
  let frame: Frame = solveFrame(stack.box, 1, marginX);
  const atmosphere = createAtmosphere({ scene, canvasWrap, mobile, pinned, palette });
  let appliedRain = -1; // rain index the layers and readouts currently show
  let disposed = false;
  let rafId = 0;
  let onScreen = false;
  let lastFrame = 0;
  // A remount on a tier change keeps the canvas already faded in, so it does not flash again.
  let faded = canvasWrap.style.opacity === '1';

  const requestRender = (): void => {
    if (!rafId && !disposed) rafId = requestAnimationFrame(render);
  };

  // Every layer is always drawn: the stack is opaque, so the slot order alone decides what is seen.
  function updateLayers(): void {
    handles.forEach((handle, k) => {
      const layer = state.layers[k];
      handle.group.position.y = layer.slot * SEPARATION;
      handle.setFocus(layer.focus);
    });
  }

  // Runs only when the rain step changes: the layers follow the live storm, and the readouts
  // are refilled through readoutFor.
  function syncRain(): void {
    if (!model) return;
    const index = rainIndexForStorm(state.storm);
    if (index === appliedRain) return;
    appliedRain = index;
    for (const h of handles) h.update?.(model.evaluate(index), index);
    readouts.write(model, index);
  }

  // Drop density follows the model's rain, interpolated between the two steps around the storm.
  function rainNormAt(storm: number): number {
    if (!model) return 0;
    const x = Math.min(1, Math.max(0, storm)) * (RAIN_STEPS.length - 1);
    const lo = Math.floor(x);
    const hi = Math.min(RAIN_STEPS.length - 1, lo + 1);
    const a = model.evaluate(lo).rainNorm;
    const b = model.evaluate(hi).rainNorm;
    return a + (b - a) * (x - lo);
  }

  // Sized from the canvas itself. Also measures the fixed site header: the pinned stage starts
  // just under it.
  const resize = (): void => {
    // On the section, so every part of the stage reads the same offset.
    if (header) {
      const section = root.closest<HTMLElement>('#featured') ?? root;
      section.style.setProperty('--sticky-top', `${header.offsetHeight}px`);
    }
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    if (!w || !h) return;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    frame = solveFrame(stack.box, camera.aspect, marginX);
    atmosphere.resize(h * renderer.getPixelRatio(), CAMERA_FOV);
    requestRender();
  };
  const resizeObserver = new ResizeObserver(resize);
  resizeObserver.observe(canvasWrap);
  resizeObserver.observe(canvas);
  resize();

  // Entry cross-fade: the wrap fades in once, the first time the section reaches the viewport.
  // The fade is set from JS, so without JS the canvas is simply visible.
  if (!reduce && !faded) canvasWrap.style.opacity = '0';
  canvasWrap.style.transition = `opacity ${FADE_IN_MS}ms ease-out`;

  // Animates the weather only while the section is on screen.
  const visibility = new IntersectionObserver(([entry]) => {
    onScreen = entry?.isIntersecting ?? false;
    lastFrame = 0;
    if (onScreen && !faded) {
      faded = true;
      requestAnimationFrame(() => {
        canvasWrap.style.opacity = '1';
      });
    }
    if (onScreen) requestRender();
  });
  visibility.observe(root);

  function render(now = performance.now()): void {
    rafId = 0;
    const animate = onScreen && !reduce;
    const dt = animate && lastFrame > 0 ? Math.min(0.05, (now - lastFrame) / 1000) : 0;
    lastFrame = animate ? now : 0;

    syncRain();
    atmosphere.advance(env, state.storm, dt, model);
    updateLayers();
    placeOrbit(camera, frame.target, frame.radius, AZIMUTH + state.orbit);
    for (const h of handles) h.tick?.(env);
    atmosphere.step(dt, env, rainNormAt(env.storm));
    renderer.render(scene, camera);
    if (animate) requestRender();
  }

  const themeObserver = new MutationObserver(() => {
    palette = readPalette();
    for (const h of handles) h.paint(palette);
    atmosphere.setPalette(palette);
    requestRender();
  });
  themeObserver.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ['data-theme'],
  });

  // Built only after the data resolves; the pin and timeline already exist by then.
  loadGeoData({ mobile }).then((data: GeoData) => {
    if (disposed) return;
    const built = createModel(data);
    if (import.meta.env.DEV) assertReadoutsStable(built);
    model = built;
    shared = createSharedResources(data, mobile);
    const ctx = { mobile, palette, env, shared };
    handles = LAYERS.map((layer) => BUILDERS[layer.id](data, ctx, built));
    handles.forEach((h) => {
      h.paint(palette);
      scene.add(h.group);
    });
    stack = measureStack(handles);
    frame = solveFrame(stack.box, camera.aspect, marginX);
    const box = stack.box;
    const cx = (box.min.x + box.max.x) / 2;
    const cz = (box.min.z + box.max.z) / 2;
    const cloudRegion: CloudRegion = {
      cx,
      cz,
      half: PLATE_SIZE / 2,
      baseY: stack.top,
      view: AZIMUTH + ORBIT_SPAN / 2,
    };
    atmosphere.attachDeck(cloudRegion, {
      cx,
      cz,
      half: PLATE_SIZE / 2,
      y: stack.groundTop * 0.45,
    });
    root.dataset.placeholder = String(data.isPlaceholder);
    appliedRain = -1;
    syncRain();
    requestRender();
  });

  // Choreography is mounted synchronously so pin spacing exists before the fetch resolves.
  const stopChoreography = mountChoreography(root, state, { requestRender });
  requestRender();

  return () => {
    disposed = true;
    cancelAnimationFrame(rafId);
    stopChoreography();
    resizeObserver.disconnect();
    visibility.disconnect();
    themeObserver.disconnect();
    for (const h of handles) {
      scene.remove(h.group);
      h.dispose();
    }
    // Shared textures go last: every layer that referenced them is already gone.
    shared?.dispose();
    atmosphere.dispose();
    renderer.dispose();
  };
}
