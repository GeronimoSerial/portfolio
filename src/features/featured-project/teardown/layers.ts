import type { UIKey } from '../../../i18n/utils';

export type LayerId = 'territory' | 'access' | 'risk';

export interface Layer {
  id: LayerId;
  labelKey: UIKey;
  bodyKey: UIKey;
  // Source labels live in i18n: some contain Spanish or locale-specific wording.
  sourceKey: UIKey;
}

export const LAYERS: readonly Layer[] = [
  {
    id: 'territory',
    labelKey: 'layers.territory',
    bodyKey: 'layers.territory.body',
    sourceKey: 'layers.territory.source',
  },
  {
    id: 'access',
    labelKey: 'layers.access',
    bodyKey: 'layers.access.body',
    sourceKey: 'layers.access.source',
  },
  {
    id: 'risk',
    labelKey: 'layers.risk',
    bodyKey: 'layers.risk.body',
    sourceKey: 'layers.risk.source',
  },
];
