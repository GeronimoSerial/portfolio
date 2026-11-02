import * as THREE from 'three';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { createRenderer } from '../lib/three';
import { DURATION, EASE, MOBILE_BREAKPOINT, reduced as reducedPolicy, SMOOTH } from '../motion/policy';
import { createParticleMaterial, createParticleUniforms } from './material';
import { createArcMaterial, ARC_REVEAL_END } from './arc';
import { createClouds } from './clouds';
import { createPointerHandler, createRig, fitRig, HEAD_Y } from './rig';
import { loadBaseAssets, loadFigureShapes } from './assets';
import { FIGURE_EVENT } from './events';
import { setDisperse, setState } from './morph';
import {
  CENTERED_Y,
  clamp01,
  CLOUD_CENTER_Y,
  createLayout,
  fitLayout,
  FIGURE_X,
  POSE_KEYS,
  ROCKET,
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
const TAU = Math.PI * 2;
const SPIN_RATE = 0.08; // rad/s around Y, fully formed globe only
const SPIN_EASE = 0.04; // per-frame easing of the spin weight in and out
const ARC_COUNT = { desktop: 600, mobile: 300 };
const MOBILE_TURN = { x: 0.2, y: 0.12 }; // mobile-only extra shift in the turned state: view widths right, view heights down

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
  };
  const state: ParticleState = {
    logoSmooth: -1,
    figureMode: false,
    figureRedraw: () => {},
    mobile: false,
    ignitedAt: -1,
    spinWeight: 0,
    spinTarget: 0,
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
  const spinState = { angle: 0 }; // idle spin, accumulates only while the globe is fully formed
  const turn = { p: 0 };
  const look = { x: 0, y: 0 };
  const lookTarget = { x: 0, y: 0 };

  let geometry: THREE.BufferGeometry | null = null;
  let arcGeometry: THREE.BufferGeometry | null = null;
  let turnTween: gsap.core.Tween | null = null;
  let raf = 0;
  let last = performance.now();

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

  function frame(now: number) {
    raf = requestAnimationFrame(frame);
    const dt = Math.min(0.05, (now - last) / 1000);
    uniforms.uTime.value += dt;
    last = now;

    // Wheel steps move the scroll in jumps; the logo's progress catches up per frame so the dispersal and title glide.
    if (ctx.logoIdx >= 0 && !reduced) {
      const before = state.logoSmooth;
      const raw = clamp01(ctx.pairSt[ctx.logoIdx]?.progress ?? 0);
      state.logoSmooth =
        state.logoSmooth < 0 ? raw : state.logoSmooth + (raw - state.logoSmooth) * (1 - Math.exp(-dt * SMOOTH.logo));
      if (Math.abs(raw - state.logoSmooth) < 1e-4) state.logoSmooth = raw;
      if (state.logoSmooth !== before) apply();
    }

    look.x += (lookTarget.x - look.x) * LOOK_EASE;
    look.y += (lookTarget.y - look.y) * LOOK_EASE;
    state.spinWeight += (state.spinTarget - state.spinWeight) * SPIN_EASE;
    spinState.angle = (spinState.angle + dt * SPIN_RATE * state.spinWeight) % TAU;

    // The scroll turn fades out with turnOut, so the framed poses end facing front.
    const k = view.turnOut;
    pivot.rotation.set(turn.p * TURN.x * k + look.y, turn.p * TURN.y * k + look.x, 0);
    spinGroup.rotation.set(view.tilt, view.yaw + spinState.angle, view.roll);
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
    const since = state.ignitedAt < 0 ? Infinity : uniforms.uTime.value - state.ignitedAt;
    const shake = since < 0.8 ? ROCKET.shake * Math.exp(-since * 5) * Math.sin(since * 50) : 0;
    grp.position.y += shake * layout.visH;
    uniforms.uScale.value = Math.max(1, view.s);
    uniforms.uOpacity.value = view.opacity;
    arc.uniforms.uReveal.value = arcState.reveal;
    arc.uniforms.uAlpha.value = view.arc * view.opacity;
    renderer.render(scene, camera);
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
        scrub: SMOOTH.turn,
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
    const logoRaw = ctx.logoIdx >= 0 ? clamp01(ctx.pairSt[ctx.logoIdx]?.progress ?? 0) : 0;
    if (Math.abs(logoRaw - state.logoSmooth) > 0.5) state.logoSmooth = -1; // re-measured positions snap rather than glide
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
    gsap.killTweensOf([view, turn, look, spinState, uniforms.uIntro]);
    geometry?.dispose();
    arcGeometry?.dispose();
    material.dispose();
    arc.material.dispose();
    renderer.dispose();
  };
  window.addEventListener('pagehide', dispose);
  return dispose;
}
