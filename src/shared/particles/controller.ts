import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { createRenderer } from '../lib/three';
import { DURATION, EASE, MOBILE_BREAKPOINT, reduced as reducedPolicy } from '../motion/policy';
import { createParticleMaterial, createParticleUniforms } from './material';
import { createArcMaterial, ARC_REVEAL_END } from './arc';
import { createClouds } from './clouds';
import { createPointerHandler, createRig, fitRig, HEAD_Y } from './rig';
import { loadBaseAssets, loadFigureShapes } from './assets';
import { FIGURE_EVENT } from './events';
import { setDisperse, setState } from './morph';
import { GLOBE_CENTER_Y, GLOBE_RADIUS } from './shapes';
import {
  CENTERED_Y,
  CLOUD_CENTER_Y,
  createLayout,
  fitLayout,
  FIGURE_X,
  GLOBE_SPIN_RAD_PER_S,
  POSE_KEYS,
  tierOf,
  type Frame,
  type Pose,
} from './poses';
import type { ParticleContext, ParticleState, Section } from './state';
import { applyText, placeLogo, readRevealMax } from './text';
import { handleFigure, type FigureDetail } from './scenes/accordion';
import { createExitTrigger, exitProgress, setFigureExit } from './scenes/exit';
import { arcReveal, createArcTrigger, createPairTriggers, createReducedTriggers, setScrollState } from './scenes/story';

// Point budget of the hero figure.
const COUNT = { desktop: 14000, mobile: 6000 };
const TURN = { y: -0.6, x: 0.06, shiftX: 0.14 }; // scroll turn: rad, rad, view widths
const LOOK_EASE = 0.08;
const ARC_COUNT = { desktop: 600, mobile: 300 };
const MOBILE_TURN = { x: 0.2, y: 0.12 }; // mobile-only extra shift in the turned state: view widths right, view heights down
// SVG ring in GlobeRing.astro: a 200 unit box with its text on arcs of radius 80. gap is the share of the sphere's
// radius between its edge and the arc; the text size in CSS px follows the viewport width within [fontMin, fontMax].
const RING = { box: 200, pathR: 80, gap: 0.2, fontMin: 18, fontMax: 32, fontPerWidth: 0.022 };

// The sampler and colour are tuned in raw sRGB, matching the mockup.
THREE.ColorManagement.enabled = false;
gsap.registerPlugin(ScrollTrigger);

// Mounts the persistent particle layer. Returns a cleanup function.
export function mountParticles(canvas: HTMLCanvasElement): () => void {
  let renderer: THREE.WebGLRenderer;
  try {
    renderer = createRenderer(canvas);
  } catch {
    canvas.style.display = 'none';
    return () => {};
  }

  const reduced = reducedPolicy.matches;
  const fine = window.matchMedia('(pointer: fine)').matches;
  const count = window.innerWidth < MOBILE_BREAKPOINT ? COUNT.mobile : COUNT.desktop;
  const arcCount = window.innerWidth < MOBILE_BREAKPOINT ? ARC_COUNT.mobile : ARC_COUNT.desktop;

  const rig = createRig();
  const { scene, camera, grp, pivot, spinGroup } = rig;

  const uniforms = createParticleUniforms();
  const material = createParticleMaterial(uniforms);
  const arc = createArcMaterial(uniforms);

  const view: Frame = {
    x: FIGURE_X[tierOf()],
    oy: 0,
    c: 0,
    s: 1,
    turnOut: 1,
    tilt: 0,
    yaw: 0,
    roll: 0,
    opacity: 1,
    arc: 0, // arc visibility, 1 only in the north-facing globe pose
    spin: 0,
  };
  const state: ParticleState = {
    figureMode: false,
    figureRedraw: () => {},
    mobile: false,
    reducedIndex: -1,
    disposed: false,
  };

  // Scroll-locked sections, in DOM order. Each carries its pose and, when present, its text block.
  const sections: Section[] = [];
  document.querySelectorAll<HTMLElement>('[data-particles]').forEach((el) => {
    const pose = el.dataset.particles as Pose | undefined;
    if (!pose || !POSE_KEYS.includes(pose)) return;
    sections.push({ pose, el, text: el.querySelector<HTMLElement>('[data-particles-text]') });
  });
  const usaAt = sections.findIndex((s) => s.pose === 'usa');
  const icvmText = document.querySelector<HTMLElement>('#experience [data-particles-text]');
  const ctx: ParticleContext = {
    reduced,
    uniforms,
    layout: createLayout(),
    view,
    shapes: {},
    attrs: null,
    loaded: { from: null, to: null },
    state,
    sections,
    pairSt: [],
    arcSt: null,
    logoIdx: sections.findIndex((s) => s.pose === 'icvm-logo'),
    argIdx: sections.findIndex((s) => s.pose === 'argentina'),
    afterScene: usaAt >= 0 ? (sections[usaAt + 1]?.el ?? null) : null,
    icvmText,
    icvmLines: Array.from(icvmText?.querySelectorAll<HTMLElement>('.title, .meta, .lead') ?? []),
    icvmMax: [],
    apply: () => {},
  };
  const { layout, shapes } = ctx;

  const arcState = { reveal: reduced ? ARC_REVEAL_END : 0 }; // arc draw progress, scrubbed by the ICVM block that carries data-particles-arc
  const turn = { p: 0 };
  const look = { x: 0, y: 0 };
  const lookTarget = { x: 0, y: 0 };
  // Globe spin angle, rad. It advances only while the globe pose holds and is kept when the pose leaves.
  const spin = { angle: 0 };
  const ringEl = document.querySelector<HTMLElement>('[data-particles-ring]');
  const ringCentre = new THREE.Vector3();
  const ringEdge = new THREE.Vector3();
  let ringShown = false;

  if (import.meta.env.DEV) {
    (window as Window & { __particles?: unknown }).__particles = {
      snapshot: () => ({
        from: ctx.loaded.from,
        to: ctx.loaded.to,
        morph: uniforms.uProgress.value,
        disperse: uniforms.uDisperse.value,
        figure: state.figureMode,
        turn: turn.p,
        frame: { ...view },
        rotation: { x: spinGroup.rotation.x, y: spinGroup.rotation.y, z: spinGroup.rotation.z },
        position: { x: grp.position.x, y: grp.position.y },
      }),
    };
  }

  let geometry: THREE.BufferGeometry | null = null;
  let arcGeometry: THREE.BufferGeometry | null = null;
  let turnTween: gsap.core.Tween | null = null;
  let raf = 0;
  let last = performance.now();
  let drewEmpty = false; // true once the canvas has been cleared at zero opacity; skip rendering until it is visible again

  function layoutFit() {
    fitLayout(layout, tierOf());
    placeLogo(ctx);
  }

  const fit = () => fitRig(rig, renderer, ctx, layoutFit);

  function syncColor() {
    const ink = getComputedStyle(document.documentElement).getPropertyValue('--ink').trim();
    uniforms.uColor.value.set(ink);
  }

  const onPointer = createPointerHandler(rig, ctx, lookTarget);

  // Derives the whole visual state from the scroll positions of the morph triggers.
  function apply() {
    applyText(ctx);
    if (state.figureMode || !ctx.attrs || sections.length === 0) return;
    if (!reduced) {
      const exit = exitProgress(ctx);
      if (exit !== null) setFigureExit(ctx, exit);
      else setScrollState(ctx);
      arcState.reveal = arcReveal(ctx);
    }
  }
  ctx.apply = apply;

  // The ring hugs the projected sphere: its centre is the sphere's centre on screen and its arc sits a gap outside the
  // sphere's silhouette, measured from the sphere's edge in the screen plane. Hidden unless the globe pose holds.
  function placeRing(alpha: number) {
    if (!ringEl) return;
    if (alpha <= 0.001) {
      if (ringShown) ringEl.style.opacity = '0';
      ringShown = false;
      return;
    }
    grp.updateMatrixWorld(true);
    camera.updateMatrixWorld();
    // The points hang from a node offset by -CLOUD_CENTER_Y (clouds.ts), so the sphere centre is that far from the group origin.
    ringCentre.set(0, GLOBE_CENTER_Y - CLOUD_CENTER_Y, 0);
    spinGroup.localToWorld(ringCentre);
    ringEdge.copy(ringCentre).setX(ringCentre.x + GLOBE_RADIUS * view.s);
    ringCentre.project(camera);
    ringEdge.project(camera);
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    const cx = ((ringCentre.x + 1) / 2) * w;
    const cy = ((1 - ringCentre.y) / 2) * h;
    const radius = ((ringEdge.x - ringCentre.x) / 2) * w * (1 + RING.gap);
    const k = radius / RING.pathR; // CSS px per SVG unit
    ringEl.style.opacity = String(alpha);
    const fontPx = Math.min(RING.fontMax, Math.max(RING.fontMin, w * RING.fontPerWidth));
    ringEl.style.fontSize = `${fontPx / k}px`;
    ringEl.style.transform = `translate(${cx - RING.box / 2}px, ${cy - RING.box / 2}px) scale(${k}) rotate(${spin.angle}rad)`;
    ringShown = true;
  }

  function frame(now: number) {
    raf = requestAnimationFrame(frame);
    const dt = Math.min(0.05, (now - last) / 1000);
    uniforms.uTime.value += dt;
    last = now;

    look.x += (lookTarget.x - look.x) * LOOK_EASE;
    look.y += (lookTarget.y - look.y) * LOOK_EASE;

    // The scroll turn fades out with turnOut, so the framed poses end facing front.
    const k = view.turnOut;
    pivot.rotation.set(turn.p * TURN.x * k + look.y, turn.p * TURN.y * k + look.x, 0);
    // The globe turns about its own pole (the spin group's Y axis, applied before the tilt). The angle is applied at the
    // globe weight, so a morph in or out blends instead of snapping. A whole turn at full weight leaves the picture
    // unchanged, so the angle is folded back there to keep it small.
    if (!reduced) spin.angle += dt * GLOBE_SPIN_RAD_PER_S * view.spin;
    if (view.spin >= 1) spin.angle %= 2 * Math.PI;
    spinGroup.rotation.set(view.tilt, view.yaw + spin.angle * view.spin, view.roll);
    spinGroup.scale.setScalar(view.s);
    spinGroup.position.set(0, CLOUD_CENTER_Y - HEAD_Y, 0);
    // Mobile only: the turned head moves right and down, clear of the statement text.
    const extraX = state.mobile ? MOBILE_TURN.x * turn.p * k : 0;
    const extraY = state.mobile ? MOBILE_TURN.y * turn.p * k : 0;
    grp.position.set(
      (view.x + turn.p * TURN.shiftX * k + extraX) * layout.visW,
      layout.baseY + (CENTERED_Y - layout.baseY) * view.c + view.oy * layout.visH - extraY * layout.visH,
      0,
    );
    uniforms.uScale.value = Math.max(1, view.s);
    uniforms.uOpacity.value = view.opacity;
    arc.uniforms.uReveal.value = arcState.reveal;
    arc.uniforms.uAlpha.value = view.arc * view.opacity;
    placeRing(view.spin * view.opacity);
    // Fully transparent frames draw nothing, so render one of them to clear the canvas and then skip the GPU work.
    if (view.opacity > 0.001) {
      drewEmpty = false;
      renderer.render(scene, camera);
    } else if (!drewEmpty) {
      renderer.render(scene, camera);
      drewEmpty = true;
    }
  }

  function start() {
    if (raf) return;
    last = performance.now();
    raf = requestAnimationFrame(frame);
  }

  function stop() {
    cancelAnimationFrame(raf);
    raf = 0;
  }

  function onVisibility() {
    if (document.hidden) stop();
    else start();
  }

  const onFigure = (e: Event) => handleFigure(ctx, ((e as CustomEvent<FigureDetail>).detail ?? {}));

  const triggers: ScrollTrigger[] = [];
  if (!reduced) triggers.push(...createPairTriggers(ctx), ...createExitTrigger(ctx), ...createArcTrigger(ctx));
  else triggers.push(...createReducedTriggers(ctx));

  // Hero -> statement: the head turns toward the statement text, scrubbed with the scroll.
  const hero = document.getElementById('hero');
  const statement = document.getElementById('statement');
  if (!reduced && hero && statement) {
    turnTween = gsap.to(turn, {
      p: 1,
      ease: 'none',
      scrollTrigger: {
        id: 'icvm-turn',
        refreshPriority: 3,
        trigger: hero,
        start: 'top top',
        endTrigger: statement,
        end: 'center center',
        scrub: true,
      },
    });
  }

  async function build() {
    const base = await loadBaseAssets(count, () => state.disposed);
    if (!base) return;
    const { portrait, field, seed, globe, mapShape, usaShape } = base;

    Object.assign(layout, {
      mapW: mapShape.width,
      mapH: mapShape.height,
      usaW: usaShape.width,
      usaH: usaShape.height,
    });
    layoutFit();

    Object.assign(shapes, {
      portrait: { positions: portrait.positions, bright: portrait.lum },
      field: { positions: field, bright: seed },
      globe,
      argentina: mapShape,
      usa: usaShape,
    });

    Object.assign(shapes, await loadFigureShapes(base));
    const logo = shapes['icvm-logo'];
    Object.assign(layout, { logoW: logo?.width ?? 0, logoH: logo?.height ?? 0 });
    layoutFit();

    const clouds = createClouds(base, material, arc.material, arcCount);
    ({ geometry, arcGeometry } = clouds);
    ctx.attrs = clouds.attrs;
    ctx.loaded.from = 'portrait';
    ctx.loaded.to = 'portrait';
    spinGroup.add(clouds.points, clouds.arcPoints);

    uniforms.uDrift.value = reduced ? 0 : 1;
    if (reduced) uniforms.uIntro.value = 1;
    else gsap.to(uniforms.uIntro, { value: 1, duration: DURATION.intro, ease: EASE.intro });
    if (reduced) {
      const idx = state.reducedIndex >= 0 ? state.reducedIndex : 0;
      // The logo's first state is fully dispersed, so the title shows alone until the globe snaps in.
      if (sections[idx]?.pose === 'icvm-logo') setDisperse(ctx, 'icvm-logo', 1);
      else if (sections[idx]) setState(ctx, sections[idx].pose, sections[idx].pose, 1);
    }
    // Shape sizes are known now, so re-derive the state from the scroll position, or from the figure.
    if (state.figureMode) state.figureRedraw();
    apply();
  }

  fit();
  syncColor();
  start();
  readRevealMax(ctx);
  applyText(ctx);
  build();

  // Single resize path: ScrollTrigger.refresh() fires onRefresh synchronously, which fits and applies once.
  // A height-only change under 25% is the mobile URL bar showing or hiding: the canvas (100lvh) and the triggers keep
  // their measures, so no refresh, which would re-measure every pin mid-scroll and jolt the page.
  let lastW = window.innerWidth;
  let lastH = window.innerHeight;
  const onResize = () => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    const barOnly = w === lastW && Math.abs(h - lastH) < 0.25 * Math.max(h, lastH);
    lastW = w;
    if (barOnly) return;
    lastH = h;
    ScrollTrigger.refresh();
  };
  // Refresh follows resize and font loading; re-measure the rig, the title block and the logo's position then.
  const onRefresh = () => {
    fit();
    if (state.figureMode) state.figureRedraw();
    if (layout.logoH) placeLogo(ctx);
    readRevealMax(ctx);
    apply();
  };
  window.addEventListener('resize', onResize);
  window.addEventListener(FIGURE_EVENT, onFigure);
  document.addEventListener('visibilitychange', onVisibility);
  document.addEventListener('themechange', syncColor);
  if (fine && !reduced) window.addEventListener('pointermove', onPointer, { passive: true });
  ScrollTrigger.addEventListener('refresh', onRefresh);
  document.fonts?.ready.then(() => ScrollTrigger.refresh());

  const dispose = () => {
    if (state.disposed) return;
    state.disposed = true;
    if (import.meta.env.DEV) delete (window as Window & { __particles?: unknown }).__particles;
    window.removeEventListener('pagehide', dispose);
    stop();
    window.removeEventListener('resize', onResize);
    window.removeEventListener(FIGURE_EVENT, onFigure);
    window.removeEventListener('pointermove', onPointer);
    document.removeEventListener('visibilitychange', onVisibility);
    document.removeEventListener('themechange', syncColor);
    ScrollTrigger.removeEventListener('refresh', onRefresh);
    triggers.forEach((t) => t.kill());
    turnTween?.scrollTrigger?.kill();
    turnTween?.kill();
    gsap.killTweensOf([view, turn, look, uniforms.uIntro]);
    geometry?.dispose();
    arcGeometry?.dispose();
    material.dispose();
    arc.material.dispose();
    renderer.dispose();
  };
  window.addEventListener('pagehide', dispose);
  return dispose;
}
