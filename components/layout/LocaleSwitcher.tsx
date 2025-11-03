'use client';

import { useLocale } from 'next-intl';
import { Languages } from 'lucide-react';
import { localeNames, localeFlags, type Locale } from '@/lib/i18n/config';
import { useState } from 'react';

export function LocaleSwitcher() {
  const locale = useLocale() as Locale;
  const [isChanging, setIsChanging] = useState(false);

  const toggleLocale = () => {
    const newLocale: Locale = locale === 'en' ? 'es' : 'en';
    
    // Mostrar feedback visual
    setIsChanging(true);
    
    // Guardar preferencia en cookie
    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000; SameSite=Lax`;
    
    // Hard reload para resetear completamente GSAP y React
    // Esto garantiza que todas las animaciones se ejecuten correctamente
    window.location.reload();
  };

  const nextLocale: Locale = locale === 'en' ? 'es' : 'en';

  return (
    <button
      onClick={toggleLocale}
      disabled={isChanging}
      className={`
        p-2 rounded-lg 
        text-zinc-600 dark:text-zinc-400
        hover:text-zinc-900 dark:hover:text-zinc-100
        hover:bg-zinc-100 dark:hover:bg-zinc-800
        transition-all duration-200
        ${isChanging 
          ? 'opacity-50 cursor-wait scale-95' 
          : 'hover:scale-110 active:scale-95'
        }
        will-change-transform
        group
      `}
      aria-label={`Switch to ${localeNames[nextLocale]}`}
      title={`Switch to ${localeNames[nextLocale]}`}
    >
      {isChanging ? (
        <div className="animate-spin text-xl">⟳</div>
      ) : (
        <div className="flex items-center gap-2">
          <Languages className="w-5 h-5 transition-transform group-hover:rotate-12" />
          <span className="text-base" role="img" aria-label={localeNames[nextLocale]}>
            {localeFlags[nextLocale]}
          </span>
        </div>
      )}
    </button>
  );
}
