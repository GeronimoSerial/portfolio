import * as THREE from 'three';
import { prefersReducedMotion } from '../../../shared/lib/motion';
import { createRenderer, readThemeColors } from '../../../shared/lib/three';
import { MOBILE_QUERY } from '../../../shared/motion/policy';
import {
  createClouds,
  DECK_TOP_OFFSET,
  type Clouds,
  type CloudRegion,
  type CloudTones,
} from './clouds';
import {
  FINALE_STEP,
  initialLayers,
  mountChoreography,
  ORBIT_SPAN,
  SEPARATION,
  type TeardownState,
} from './choreography';
import { loadGeoData, PLATE_SIZE, type GeoData } from './data';
import { LAYERS, type LayerId } from './layers';
import { buildAccess } from './layers/access';
import { buildRisk } from './layers/risk';
import { buildTerritory } from './layers/territory';
import { createSharedResources, type SharedResources } from './layers/shared';
import type { Env, LayerBuilder, LayerHandle, Palette } from './layers/types';
import { createMist, type Mist } from './mist';
import {
  createModel,
  RAIN_STEPS,
  rainIndexForStorm,
  readoutFor,
  type Model,
  type ModelResult,
  type ReadoutStep,
} from './model';
import { assertReadoutsStable } from './readout.check';
import { createWeather, type Weather, type WeatherTones } from './weather';

const BUILDERS: Record<LayerId, LayerBuilder> = {
  territory: buildTerritory,
  access: buildAccess,
  risk: buildRisk,
};

// Share of the canvas kept clear below the stack, and on each side of it. The stack fills the
// rest, so it reads as the main object of the stage. Desktop: ~56% of the viewport width.
// Mobile: ~90% of the stage width.
const MARGIN_Y = 0.06;
const MARGIN_X_DESKTOP = 0.03;
const MARGIN_X_MOBILE = 0.03;
// Camera height per unit of horizontal distance, and the fixed starting azimuth.
const ELEVATION = 0.52;
const AZIMUTH = Math.PI / 4;
// Highest slot of the stack: the framing covers it even when a layer is not on top yet.
const TOP_SLOT = 2;
const CAMERA_FOV = 32;
const MOBILE_ORBIT = 0.12;
const FADE_IN_MS = 600;
// Wetness follows the storm with this rate (1/s): the ground is mostly wet ~2.5 s after the rain.
const WET_RATE = 1.2;
// Canvas brightness lost at the height of the storm. Subtle on purpose: no strobe, no flash.
const DARKEN = 0.18;

// Readout templates from the Astro markup, one set per language.
interface ReadoutCopy {
  rain: string;
  territory: string;
  access: string;
  risk: string;
}

interface Stack {
  box: THREE.Box3; // the exploded stack plus the cloud headroom: what the framing must fit
  top: number; // top of the exploded stack, below the headroom
  groundTop: number; // top of the territory layer (relief), for the mist
}

const fill = (template: string, vars: Record<string, string>): string =>
  template.replace(/\{(\w+)\}/g, (_, key: string) => vars[key] ?? '');


function defaultStack(): Stack {
  const half = PLATE_SIZE / 2;
  const top = SEPARATION * TOP_SLOT + 0.5;
  return {
    box: new THREE.Box3(
      new THREE.Vector3(-half, 0, -half),
      new THREE.Vector3(half, top + DECK_TOP_OFFSET, half),
    ),
    top,
    groundTop: 0.5,
  };
}

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

// The light theme is the one whose page ground is bright.
const isLight = (p: Palette): boolean => (p.base.r + p.base.g + p.base.b) / 3 > 0.5;

// Rain sits halfway between ground and ink on the dark theme. On the light theme that mix reads as
// black specks, so the streaks take a soft mid-grey instead.
const weatherTones = (p: Palette): WeatherTones => ({
  rain: isLight(p) ? p.base.clone().lerp(p.ink, 0.32) : p.base.clone().lerp(p.ink, 0.5),
});

// Clouds are neutral greys: a lit top and a darker underside. On a dark theme the top is lifted
// towards ink. On the light theme the deck is a light grey (body near #B9B8BE): a lighter top and
// a soft darker underside.
const cloudTones = (p: Palette): CloudTones =>
  isLight(p)
    ? { lit: new THREE.Color('#CFCED4'), shadow: new THREE.Color('#A4A3AA') }
    : { lit: p.base.clone().lerp(p.ink, 0.5), shadow: p.base.clone().lerp(p.ink, 0.18) };

// Places a camera on the orbit around `target`: a fixed elevation ratio, `radius` out.
function placeOrbit(cam: THREE.PerspectiveCamera, target: THREE.Vector3, radius: number, angle: number): void {
  cam.position.set(
    target.x + Math.cos(angle) * radius,
    target.y + radius * ELEVATION,
    target.z + Math.sin(angle) * radius,
  );
  cam.lookAt(target);
  cam.updateMatrixWorld();
}

interface Frame {
  target: THREE.Vector3;
  radius: number;
}

// Solves the orbit radius so every corner of the stack box (the stack plus the top of the cloud
// deck) sits inside the margins, at the start and the end of the orbit. Framing depends only on
// the stack and the aspect, never on the step.
function solveFrame(box: THREE.Box3, aspect: number, marginX: number): Frame {
  const target = box.getCenter(new THREE.Vector3());
  const corners: THREE.Vector3[] = [];
  for (const x of [box.min.x, box.max.x]) {
    for (const y of [box.min.y, box.max.y]) {
      for (const z of [box.min.z, box.max.z]) corners.push(new THREE.Vector3(x, y, z));
    }
  }
  const probe = new THREE.PerspectiveCamera(CAMERA_FOV, aspect, 0.1, 1000);
  const tanHalf = Math.tan(THREE.MathUtils.degToRad(CAMERA_FOV) / 2);
  const limitX = 1 - 2 * marginX;
  const bandTop = 1 - 2 * MARGIN_Y;
  const bandBottom = -(1 - 2 * MARGIN_Y);
  const bandMid = (bandTop + bandBottom) / 2;
  const bandSpan = bandTop - bandBottom;
  const angles = [AZIMUTH, AZIMUTH + ORBIT_SPAN / 2, AZIMUTH + ORBIT_SPAN];
  let radius = Math.max(box.max.x - box.min.x, box.max.z - box.min.z, box.max.y - box.min.y) * 2;
  for (let iter = 0; iter < 24; iter++) {
    let maxX = 0;
    let lo = Infinity;
    let hi = -Infinity;
    for (const angle of angles) {
      placeOrbit(probe, target, radius, angle);
      for (const c of corners) {
        const p = c.clone().project(probe);
        maxX = Math.max(maxX, Math.abs(p.x));
        lo = Math.min(lo, p.y);
        hi = Math.max(hi, p.y);
      }
    }
    // Projected size scales about inversely with the distance, so one multiply converges.
    const scale = Math.max(maxX / limitX, (hi - lo) / bandSpan);
    // Slide the target along world Y so the box centre sits in the middle of the height band.
    const shift = (lo + hi) / 2 - bandMid;
    target.y += shift * radius * tanHalf;
    radius *= scale;
    if (Math.abs(scale - 1) < 0.003 && Math.abs(shift) < 0.003) break;
  }
  return { target, radius };
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
  const marginX = mobile ? MARGIN_X_MOBILE : MARGIN_X_DESKTOP;
  const reduce = prefersReducedMotion();
  const pinned = !reduce;
  root.classList.toggle('is-pinned', pinned);
  root.classList.toggle('is-reduced', reduce);

  const readouts = [...root.querySelectorAll<HTMLElement>('[data-readout]')];
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
  const weather: Weather = createWeather(mobile, weatherTones(palette));
  scene.add(weather.group);
  let clouds: Clouds | null = null;
  let mist: Mist | null = null;
  let appliedRain = -1; // rain index the layers and readouts currently show
  let disposed = false;
  let rafId = 0;
  let onScreen = false;
  let lastFrame = 0;
  // A remount on a tier change keeps the canvas already faded in, so it does not flash again.
  let faded = canvasWrap.style.opacity === '1';
  let filterShown = '';

  const numberFormat = new Intl.NumberFormat(lang, { maximumFractionDigits: 0 });
  const percentFormat = new Intl.NumberFormat(lang, {
    style: 'percent',
    maximumFractionDigits: 0,
  });

  const requestRender = (): void => {
    if (!rafId && !disposed) rafId = requestAnimationFrame(render);
  };

  // Stack bounds over every slot a layer can take, so the framing never moves with the steps.
  // The box reaches the top of the cloud deck, so the framing keeps the deck in view.
  function measureStack(): Stack {
    const box = new THREE.Box3();
    const raise = new THREE.Vector3(0, TOP_SLOT * SEPARATION, 0);
    let groundTop = 0.5;
    handles.forEach((h, k) => {
      h.group.position.y = 0;
      h.group.updateMatrixWorld(true);
      const part = new THREE.Box3().setFromObject(h.group);
      box.union(part);
      box.union(part.clone().translate(raise));
      if (k === 0) groundTop = part.max.y;
    });
    const top = box.max.y;
    box.max.y += DECK_TOP_OFFSET;
    return { box, top, groundTop };
  }

  // Every layer is always drawn: the stack is opaque, so the slot order alone decides what is seen.
  function updateLayers(): void {
    handles.forEach((handle, k) => {
      const layer = state.layers[k];
      handle.group.position.y = layer.slot * SEPARATION;
      handle.setFocus(layer.focus);
    });
  }

  // The template for one readout key, filled from the result of its step.
  const fillReadout = (key: string, result: ModelResult): string | undefined => {
    const share = (name: string): string =>
      percentFormat.format(result.indicators.find((i) => i.key === name)?.value ?? 0);
    const mm = numberFormat.format(result.rainMmH);
    const total = numberFormat.format(result.total);
    switch (key) {
      case 'rain':
        return fill(copy.rain, { mm });
      case 'territory':
        return fill(copy.territory, { mm, pct: share('flood') });
      case 'access':
        return fill(copy.access, { pct: share('isolation'), total });
      case 'risk':
        return fill(copy.risk, { exposed: numberFormat.format(result.exposedCount), total });
      default:
        return undefined;
    }
  };

  // The step a readout belongs to, from its container: 0 is the cover, the finale is FINALE_STEP,
  // and any other step is the layer at the same index. Unknown containers take the stable peak.
  const stepOf = (el: HTMLElement): ReadoutStep => {
    const n = Number(el.closest<HTMLElement>('[data-step]')?.dataset.step);
    if (n === 0) return 'cover';
    if (n === FINALE_STEP) return 'finale';
    return LAYERS[n - 1]?.id ?? 'finale';
  };

  // Writes every number on the page through readoutFor: the cover follows the live storm, every
  // layer and the finale show the peak. Called on each rain step change, on both viewports.
  function renderReadouts(built: Model, stormIndex: number): void {
    for (const el of readouts) {
      const text = fillReadout(
        el.dataset.readout ?? '',
        readoutFor(built, stepOf(el), stormIndex),
      );
      if (text !== undefined) el.textContent = text;
    }
  }

  // Runs only when the rain step changes: the layers follow the live storm, and the readouts
  // are refilled through readoutFor.
  function syncRain(): void {
    if (!model) return;
    const index = rainIndexForStorm(state.storm);
    if (index === appliedRain) return;
    appliedRain = index;
    for (const h of handles) h.update?.(model.evaluate(index), index);
    renderReadouts(model, index);
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
    weather.resize(h * renderer.getPixelRatio(), CAMERA_FOV);
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

  // Copies the storm into the shared env and advances the time-dependent values.
  // Wetness lags the storm with a frame-rate independent step; a static frame snaps to it.
  function advanceEnv(dt: number): void {
    env.storm = state.storm;
    env.wet =
      dt > 0 ? env.wet + (env.storm - env.wet) * (1 - Math.exp(-WET_RATE * dt)) : env.storm;
    env.water = model ? model.waterLevel(env.storm) : 0;
    env.time += dt;
    env.lightning = clouds ? clouds.step(dt, env.storm) : 0;
  }

  // Darkening follows the storm through a CSS filter on the canvas wrapper; written only on change.
  // Light theme: no filter. On a light page the filter greys the whole canvas rectangle, so the
  // storm there is carried by the weather tones alone.
  // Quantized to 0.02 steps: a 3-decimal value changes on almost every scroll frame, and each write
  // repaints the large masked canvas. The filter now changes only when the visible step does.
  function applyDarkening(storm: number): void {
    const level = Math.round((1 - DARKEN * storm) / 0.02) * 0.02;
    const value = isLight(palette) ? 'none' : `brightness(${level.toFixed(2)})`;
    if (value === filterShown) return;
    filterShown = value;
    canvasWrap.style.filter = value;
  }

  function render(now = performance.now()): void {
    rafId = 0;
    const animate = onScreen && !reduce;
    const dt = animate && lastFrame > 0 ? Math.min(0.05, (now - lastFrame) / 1000) : 0;
    lastFrame = animate ? now : 0;

    syncRain();
    advanceEnv(dt);
    updateLayers();
    placeOrbit(camera, frame.target, frame.radius, AZIMUTH + state.orbit);
    for (const h of handles) h.tick?.(env);
    weather.step(dt, env.storm, rainNormAt(env.storm));
    mist?.step(dt, env.wet);
    applyDarkening(env.storm);
    renderer.render(scene, camera);
    if (animate) requestRender();
  }

  const themeObserver = new MutationObserver(() => {
    palette = readPalette();
    for (const h of handles) h.paint(palette);
    weather.setTones(weatherTones(palette));
    clouds?.setTones(cloudTones(palette));
    mist?.setTones(cloudTones(palette));
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
    stack = measureStack();
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
    clouds = createClouds(cloudRegion, mobile, cloudTones(palette), pinned);
    scene.add(clouds.group);
    mist = createMist(
      { cx, cz, half: PLATE_SIZE / 2, y: stack.groundTop * 0.45 },
      mobile,
      cloudTones(palette),
    );
    scene.add(mist.group);
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
    if (clouds) {
      scene.remove(clouds.group);
      clouds.dispose();
    }
    if (mist) {
      scene.remove(mist.group);
      mist.dispose();
    }
    scene.remove(weather.group);
    weather.dispose();
    renderer.dispose();
  };
}
