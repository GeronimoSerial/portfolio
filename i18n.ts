import { getRequestConfig } from 'next-intl/server';
import { headers, cookies } from 'next/headers';
import { defaultLocale, locales } from './lib/i18n/config';

export default getRequestConfig(async () => {
  // Intentar obtener locale de cookies
  const cookieStore = await cookies();
  const localeCookie = cookieStore.get('NEXT_LOCALE')?.value;
  
  // Validar y usar defaultLocale si no es válido
  const locale = locales.includes(localeCookie as any) ? localeCookie : defaultLocale;
  
  return {
    locale: locale as string,
    messages: (await import(`./messages/${locale}.json`)).default
  };
});
