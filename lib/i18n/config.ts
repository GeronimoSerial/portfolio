/**
 * Configuración de locales e internacionalización
 */

export const locales = ['en', 'es'] as const;
export const defaultLocale = 'en';

export type Locale = (typeof locales)[number];

export const localeNames: Record<Locale, string> = {
  en: 'English',
  es: 'Español'
};

export const localeFlags: Record<Locale, string> = {
  en: '🇺🇸',
  es: '🇪🇸'
};
