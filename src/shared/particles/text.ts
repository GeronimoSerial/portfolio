import { clamp01, smoothstep } from './poses';
import { progressOf } from './morph';
import type { ParticleContext } from './state';
import { viewSize } from './rig';

// Text reveal, as shares of the incoming and outgoing morph progress. A linear crossfade keeps
// max(incoming, outgoing) at or above one half across the whole boundary.
const TEXT = { blur: 12, inFrom: 0, inTo: 1, outSpan: 1 };
// Title block over the logo's dispersal (progress 0 to 1). Each line starts a beat after the previous one, and all
// three have settled by progress 0.9, so the globe can start forming as the dust clears.
const ICVM_TEXT = { from: 0.1, span: 0.6, stagger: 0.1 };

// A per-frame blur on text makes mobile browsers re-rasterise the glyphs every scroll tick (they shimmer), so
// phones fade with opacity only. Near the end the blur snaps to none instead of lingering as blur(0.0x px).
function blurFor(ctx: ParticleContext, t: number): string {
  if (ctx.state.mobile || t >= 0.98) return 'none';
  return `blur(${((1 - t) * TEXT.blur).toFixed(1)}px)`;
}

// Text reveal bound to the morphs: blur and opacity in over the incoming progress, out over the next one.
export function applyText(ctx: ParticleContext) {
  if (!ctx.reduced) {
    ctx.sections.forEach((s, i) => {
      if (!s.text) return;
      const inP = i === 0 ? 1 : progressOf(ctx, i - 1);
      const outP = progressOf(ctx, i);
      const inT = clamp01((inP - TEXT.inFrom) / (TEXT.inTo - TEXT.inFrom));
      const outT = 1 - clamp01(outP / TEXT.outSpan);
      s.text.style.opacity = String(inT * outT);
      s.text.style.filter = blurFor(ctx, inT);
    });
  }
  // The ICVM title block reveals over the logo's dispersal, line by line; the stage itself stays opaque.
  // Reduced motion shows the title in full (progress 1) so each line still lands at its CSS ceiling.
  if (ctx.logoIdx >= 0) {
    const p = ctx.reduced ? 1 : progressOf(ctx, ctx.logoIdx);
    ctx.icvmLines.forEach((el, k) => {
      const t = smoothstep(clamp01((p - ICVM_TEXT.from - k * ICVM_TEXT.stagger) / ICVM_TEXT.span));
      el.style.opacity = String(t * (ctx.icvmMax[k] ?? 1));
      el.style.filter = blurFor(ctx, t);
    });
  }
}

// Reads each title-block line's `--reveal-max` ceiling. Called on refresh, not per frame.
export function readRevealMax(ctx: ParticleContext) {
  ctx.icvmMax = ctx.icvmLines.map((el) => {
    const v = parseFloat(getComputedStyle(el).getPropertyValue('--reveal-max'));
    return Number.isFinite(v) ? v : 1;
  });
}

// The logo is scaled so its width equals the rendered width of the title text (a Range over the text, not the
// block). The figure centre sits at screen x = w / 2 + x * w and y = h / 2 - oy * h: the logo's left edge goes on
// the text's left edge (the gutter) and its centre on the title's first line, with the stage pinned at the top.
export function placeLogo(ctx: ParticleContext) {
  const { icvmText, layout } = ctx;
  const title = icvmText?.querySelector<HTMLElement>('.title');
  if (!icvmText || !title) return;
  // Same frame as the renderer (see viewSize), so the logo lands on the title.
  const { w, h } = viewSize();
  const range = document.createRange();
  range.selectNodeContents(title);
  const text = range.getBoundingClientRect();
  const box = title.getBoundingClientRect();
  const lineH = parseFloat(getComputedStyle(title).lineHeight) || box.height;
  if (layout.logoW && text.width > 0) layout.fitLogo = (text.width * layout.visW) / (layout.logoW * w);
  const centreY = box.top - icvmText.getBoundingClientRect().top + lineH / 2;
  layout.logoX = (text.left + text.width / 2 - w / 2) / w;
  layout.logoOY = (h / 2 - centreY) / h;
}
