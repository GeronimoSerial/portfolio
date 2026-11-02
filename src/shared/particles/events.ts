// Typed contract for the `particles:figure` DOM event. Scroll scenes emit it on window and the
// particle controller listens for it. The event name and payload field names are kept as they are
// so the controller works unchanged during the migration.

export type FigureScene = 'accordion';

export type FigureMsg =
  | { scene: FigureScene; kind: 'active'; active: boolean }
  | { scene: FigureScene; kind: 'progress'; progress: number }
  | { scene: FigureScene; kind: 'index'; index: number };

export const FIGURE_EVENT = 'particles:figure';

export function emitFigure(msg: FigureMsg): void {
  window.dispatchEvent(new CustomEvent<FigureMsg>(FIGURE_EVENT, { detail: msg }));
}

export function onFigure(handler: (msg: FigureMsg) => void): () => void {
  const listener = (event: Event) => {
    const detail = (event as CustomEvent<FigureMsg | null>).detail;
    if (detail) handler(detail);
  };
  window.addEventListener(FIGURE_EVENT, listener);
  return () => window.removeEventListener(FIGURE_EVENT, listener);
}
