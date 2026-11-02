import { RAIN_STEPS, readoutFor, type Model, type ReadoutStep } from './model';

// Steps that must not depend on the live storm. The cover is excluded on purpose: it ramps with it.
const STABLE_STEPS: readonly ReadoutStep[] = ['territory', 'access', 'risk', 'finale'];

// Compares values, not references: model.evaluate caches its results, so identity says nothing.
const signature = (model: Model, step: ReadoutStep, stormIndex: number): string => {
  const result = readoutFor(model, step, stormIndex);
  const indicators = result.indicators.map((i) => `${i.key}=${i.value}`).join(',');
  return `${result.rainMmH}|${result.exposedCount}|${result.total}|${indicators}`;
};

// Dev-only guard: throws if any layer or finale readout changes with the storm index.
export function assertReadoutsStable(model: Model): void {
  for (const step of STABLE_STEPS) {
    const expected = signature(model, step, 0);
    for (let storm = 1; storm < RAIN_STEPS.length; storm++) {
      const actual = signature(model, step, storm);
      if (actual !== expected) {
        throw new Error(
          `Readout "${step}" changes with the storm index (${storm} vs 0): ${actual} !== ${expected}`,
        );
      }
    }
  }
}
