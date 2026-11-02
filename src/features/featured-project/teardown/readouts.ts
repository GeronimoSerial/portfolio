import { FINALE_STEP } from './choreography';
import { LAYERS } from './layers';
import { readoutFor, type Model, type ModelResult, type ReadoutStep } from './model';

// Readout templates from the Astro markup, one set per language.
export interface ReadoutCopy {
  rain: string;
  territory: string;
  access: string;
  risk: string;
}

export interface Readouts {
  write(built: Model, stormIndex: number): void;
}

const fill = (template: string, vars: Record<string, string>): string =>
  template.replace(/\{(\w+)\}/g, (_, key: string) => vars[key] ?? '');

// The step a readout belongs to, from its container: 0 is the cover, the finale is FINALE_STEP,
// and any other step is the layer at the same index. Unknown containers take the stable peak.
const stepOf = (el: HTMLElement): ReadoutStep => {
  const n = Number(el.closest<HTMLElement>('[data-step]')?.dataset.step);
  if (n === 0) return 'cover';
  if (n === FINALE_STEP) return 'finale';
  return LAYERS[n - 1]?.id ?? 'finale';
};

// Owns the number formats for one language. `elements` are the page's readout nodes, queried by
// the caller so the lookup stays where the mount order is decided.
export function createReadouts(
  elements: HTMLElement[],
  lang: 'en' | 'es',
  copy: ReadoutCopy,
): Readouts {
  const numberFormat = new Intl.NumberFormat(lang, { maximumFractionDigits: 0 });
  const percentFormat = new Intl.NumberFormat(lang, {
    style: 'percent',
    maximumFractionDigits: 0,
  });

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

  // Writes every number on the page through readoutFor: the cover follows the live storm, every
  // layer and the finale show the peak. Called on each rain step change, on both viewports.
  return {
    write(built: Model, stormIndex: number): void {
      for (const el of elements) {
        const text = fillReadout(
          el.dataset.readout ?? '',
          readoutFor(built, stepOf(el), stormIndex),
        );
        if (text !== undefined) el.textContent = text;
      }
    },
  };
}
