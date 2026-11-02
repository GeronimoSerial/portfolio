import { languages, ui, type Lang } from './ui';

export { languages, type Lang };
export type UIKey = keyof (typeof ui)['es'];

export const defaultLang: Lang = 'es';

// Equivalent paths per locale. Keep both sides in sync when adding a page.
export const routeMap: Record<Lang, string>[] = [
  { es: '/', en: '/en/' },
  { es: '/proyectos', en: '/en/projects' },
  { es: '/proyectos/clima', en: '/en/projects/climate' },
];

function normalize(path: string): string {
  return path.length > 1 && path.endsWith('/') ? path.slice(0, -1) : path;
}

export function getLangFromUrl(url: URL): Lang {
  const [, first] = url.pathname.split('/');
  return first === 'en' ? 'en' : defaultLang;
}

export function useTranslations(lang: Lang) {
  return (key: UIKey): string => ui[lang][key];
}

// Maps a path (in any locale) to its equivalent in `lang`.
// Unknown paths fall back to a plain prefix swap.
export function localizedPath(path: string, lang: Lang): string {
  const target = normalize(path);
  const match = routeMap.find((pair) =>
    Object.values(pair).some((p) => normalize(p) === target),
  );
  if (match) return match[lang];
  const bare = target.replace(/^\/en(?=\/|$)/, '') || '/';
  return lang === defaultLang ? bare : `/en${bare === '/' ? '/' : bare}`;
}
