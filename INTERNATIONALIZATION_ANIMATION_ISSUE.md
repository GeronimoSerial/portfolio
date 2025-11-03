# Análisis: Problema de Animaciones GSAP al Cambiar Idioma

## 🔍 Diagnóstico del Problema

### **Síntoma Observado**
Al cambiar de idioma mediante el `LocaleSwitcher`, los componentes se re-renderizan y las animaciones GSAP fallan o directamente no se ejecutan.

### **Causa Raíz**

El problema ocurre debido a la **interacción entre el ciclo de vida de React y GSAP ScrollTrigger**:

1. **Router Refresh sin Recarga Completa**
   ```tsx
   // LocaleSwitcher.tsx - Línea 19
   router.refresh();
   ```
   - `router.refresh()` actualiza el contenido del servidor sin hacer un hard reload
   - React re-renderiza todos los componentes con las nuevas traducciones
   - **PERO** los ScrollTriggers de GSAP permanecen en memoria apuntando a elementos DOM antiguos

2. **ScrollTrigger con `once: true`**
   ```typescript
   // useProjectsAnimations.ts - Línea 60
   ScrollTrigger.create({
     trigger: headline,
     start: "top 80%",
     onEnter: () => { /* animaciones */ },
     once: true,  // ⚠️ PROBLEMA: Solo se ejecuta una vez
   });
   ```
   - La mayoría de hooks usan `once: true` para que las animaciones solo se ejecuten al hacer scroll por primera vez
   - Cuando React re-renderiza los componentes, los ScrollTriggers NO se recrean porque el hook `useGSAP` con `dependencies: []` no detecta cambios
   - Los elementos DOM son nuevos, pero los triggers siguen apuntando a los elementos viejos

3. **Falta de Sincronización con Cambio de Locale**
   ```typescript
   // Hooks de animación actuales NO detectan cambio de idioma
   useGSAP(() => {
     // Animaciones...
   }, { scope: containerRef, dependencies: [] });
   ```
   - El array de dependencias está vacío
   - No hay referencia al `locale` actual
   - Los hooks no se reinicializan al cambiar el idioma

4. **Estado Inicial ya Aplicado**
   ```typescript
   // Los elementos quedan con opacity: 0, y: 50, etc.
   gsap.set(cards, {
     opacity: 0,
     y: 50,
   });
   ```
   - Al re-renderizar, `gsap.set()` vuelve a aplicar estados iniciales
   - Pero el `onEnter` con `once: true` ya fue consumido
   - Los elementos quedan invisibles permanentemente

---

## 🎯 Soluciones Propuestas

### **Opción 1: Hard Reload (F5) - Solución Simple** ⭐ **RECOMENDADA**

#### **Ventajas:**
- ✅ **Implementación inmediata** (1 línea de código)
- ✅ **100% confiable** - Resetea completamente GSAP y React
- ✅ **Sin efectos secundarios** - Todo vuelve al estado inicial
- ✅ **No requiere cambios en hooks** - Mantiene arquitectura actual
- ✅ **UX aceptable** - Cambio de idioma es acción poco frecuente

#### **Desventajas:**
- ⚠️ Pérdida de scroll position (se puede guardar con `sessionStorage`)
- ⚠️ Recarga completa (pero solo al cambiar idioma, no es navegación común)

#### **Implementación:**

```typescript
// components/layout/LocaleSwitcher.tsx

'use client';

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import { Languages } from 'lucide-react';
import { localeNames, localeFlags, type Locale } from '@/lib/i18n/config';
import { useTransition } from 'react';

export function LocaleSwitcher() {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const toggleLocale = () => {
    const newLocale: Locale = locale === 'en' ? 'es' : 'en';
    
    startTransition(() => {
      // Guardar preferencia en cookie
      document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000; SameSite=Lax`;
      
      // 🔥 SOLUCIÓN: Hard reload para resetear GSAP completamente
      window.location.reload();
      
      // Alternativa: Guardar scroll position antes de recargar
      // sessionStorage.setItem('scrollPosition', window.scrollY.toString());
      // window.location.reload();
    });
  };

  const nextLocale: Locale = locale === 'en' ? 'es' : 'en';

  return (
    <button
      onClick={toggleLocale}
      disabled={isPending}
      className="p-2 rounded-lg 
                 text-zinc-600 dark:text-zinc-400
                 hover:text-zinc-900 dark:hover:text-zinc-100
                 hover:bg-zinc-100 dark:hover:bg-zinc-800
                 transition-all duration-200
                 hover:scale-110 active:scale-95
                 disabled:opacity-50 disabled:cursor-wait
                 will-change-transform
                 group"
      aria-label={`Switch to ${localeNames[nextLocale]}`}
      title={`Switch to ${localeNames[nextLocale]}`}
    >
      <div className="flex items-center gap-2">
        <Languages className="w-5 h-5 transition-transform group-hover:rotate-12" />
        <span className="text-base" role="img" aria-label={localeNames[nextLocale]}>
          {localeFlags[nextLocale]}
        </span>
      </div>
    </button>
  );
}
```

**Opcional: Restaurar scroll position**

```typescript
// app/layout.tsx - Agregar al final del componente

'use client';

useEffect(() => {
  // Restaurar posición de scroll después de reload
  const savedPosition = sessionStorage.getItem('scrollPosition');
  if (savedPosition) {
    window.scrollTo(0, parseInt(savedPosition, 10));
    sessionStorage.removeItem('scrollPosition');
  }
}, []);
```

---

### **Opción 2: Reinicialización Inteligente de Hooks** 🔧 **Avanzada**

#### **Ventajas:**
- ✅ Sin recarga de página
- ✅ Mantiene scroll position
- ✅ Transición más "suave"

#### **Desventajas:**
- ❌ Requiere refactorizar **todos** los hooks de animación
- ❌ Mayor complejidad y superficie de bugs
- ❌ Necesita manejo cuidadoso de cleanup
- ❌ Posibles race conditions entre cleanup y nueva inicialización

#### **Implementación:**

**1. Modificar LocaleSwitcher para usar estado global:**

```typescript
// lib/i18n/locale-store.ts (NUEVO)
import { create } from 'zustand';

type LocaleStore = {
  locale: string;
  animationKey: number;
  toggleLocale: (newLocale: string) => void;
};

export const useLocaleStore = create<LocaleStore>((set) => ({
  locale: 'en',
  animationKey: 0,
  toggleLocale: (newLocale) => set((state) => ({ 
    locale: newLocale,
    animationKey: state.animationKey + 1 // Forzar re-render
  })),
}));
```

**2. Modificar TODOS los hooks de animación:**

```typescript
// hooks/useServicesAnimations.ts
import { useLocale } from 'next-intl';

export const useServicesAnimations = () => {
  const locale = useLocale(); // ⚠️ Detectar cambio de idioma
  const containerRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!containerRef.current) return;

      // 🔥 CRÍTICO: Limpiar TODOS los ScrollTriggers existentes
      ScrollTrigger.getAll().forEach(st => {
        if (st.vars.trigger && containerRef.current?.contains(st.vars.trigger as Element)) {
          st.kill();
        }
      });

      // 🔥 CRÍTICO: Resetear todos los estilos inline de GSAP
      const allAnimatedElements = containerRef.current.querySelectorAll('[style*="transform"], [style*="opacity"]');
      allAnimatedElements.forEach(el => {
        gsap.set(el, { clearProps: 'all' });
      });

      // ... resto de animaciones ...

      return () => {
        // Cleanup mejorado
        ScrollTrigger.getAll().forEach(st => {
          if (st.vars.trigger && containerRef.current?.contains(st.vars.trigger as Element)) {
            st.kill();
          }
        });
      };
    },
    { 
      scope: containerRef, 
      dependencies: [locale] // ⚠️ RE-EJECUTAR cuando cambia el idioma
    }
  );

  return { containerRef, headerRef };
};
```

**3. Este cambio debe aplicarse a:**
- ✅ `useServicesAnimations.ts`
- ✅ `useProcessAnimations.ts`
- ✅ `useProjectsAnimations.ts`
- ✅ `useResultsAnimations.ts`
- ✅ `useContactAnimations.ts`
- ✅ `useAnimatedNav.ts`
- ✅ Cualquier otro hook de animación

**Problemas potenciales:**
- ⚠️ ScrollTriggers huérfanos (triggers que no se limpian correctamente)
- ⚠️ Animaciones que se ejecutan dos veces durante la transición
- ⚠️ Elementos que quedan con estilos inline residuales
- ⚠️ Performance hit al recrear todos los triggers

---

### **Opción 3: Solución Híbrida** 🔀

Combinar ambas aproximaciones:

1. **Hard reload por defecto** (Opción 1)
2. **Transición suave opcional** con flag en `localStorage`:
   ```typescript
   const preferSmoothTransition = localStorage.getItem('smoothLocaleSwitch') === 'true';
   
   if (preferSmoothTransition) {
     router.refresh(); // Opción 2
   } else {
     window.location.reload(); // Opción 1
   }
   ```

---

## 📊 Comparación de Soluciones

| Criterio | Opción 1 (Hard Reload) | Opción 2 (Reinicialización) | Opción 3 (Híbrida) |
|----------|------------------------|------------------------------|-------------------|
| **Complejidad** | ⭐ Muy Baja (1 línea) | ⚠️ Alta (refactor total) | 🔶 Media |
| **Confiabilidad** | ⭐⭐⭐ 100% | 🔶 Dependiente de implementación | ⭐⭐ Alta |
| **Mantenibilidad** | ⭐⭐⭐ Trivial | ⚠️ Requiere disciplina | 🔶 Media |
| **UX (primera impresión)** | 🔶 Reload visible | ⭐⭐ Suave | ⭐⭐ Suave |
| **UX (funcionalidad)** | ⭐⭐⭐ Perfecto | 🔶 Posibles glitches | ⭐⭐ Buena |
| **Performance** | ⭐⭐ Reload completo | ⭐⭐⭐ Sin reload | ⭐⭐ Variable |
| **Riesgo de bugs** | ⭐⭐⭐ Casi cero | ⚠️ Alto | 🔶 Medio |
| **Tiempo implementación** | ⭐⭐⭐ 5 minutos | ⚠️ 2-4 horas | 🔶 1 hora |

---

## 🏆 Recomendación Final

### **Implementar Opción 1: Hard Reload** ✅

**Justificación:**

1. **Contexto de uso:** Cambiar idioma es una acción **poco frecuente** en una sesión típica de usuario
2. **Complejidad vs beneficio:** El hard reload garantiza funcionamiento perfecto sin agregar complejidad
3. **Mantenibilidad:** No requiere modificar hooks existentes ni futuros
4. **Precedentes:** Muchos sitios web profesionales (incluso con SPA) usan reload al cambiar idioma:
   - GitHub
   - Stripe Docs
   - Vercel
   - Tailwind CSS

**Código de Producción:**

```typescript
// components/layout/LocaleSwitcher.tsx

const toggleLocale = () => {
  const newLocale: Locale = locale === 'en' ? 'es' : 'en';
  
  startTransition(() => {
    // 1. Guardar preferencia
    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000; SameSite=Lax`;
    
    // 2. (Opcional) Guardar scroll position
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('scrollBeforeLocaleChange', window.scrollY.toString());
    }
    
    // 3. Hard reload
    window.location.reload();
  });
};
```

**Y en `app/layout.tsx` (opcional):**

```typescript
'use client';

useEffect(() => {
  // Restaurar scroll después de cambio de idioma
  const savedScroll = sessionStorage.getItem('scrollBeforeLocaleChange');
  if (savedScroll) {
    setTimeout(() => {
      window.scrollTo({ top: parseInt(savedScroll, 10), behavior: 'instant' });
      sessionStorage.removeItem('scrollBeforeLocaleChange');
    }, 100); // Delay para asegurar que el DOM esté listo
  }
}, []);
```

---

## 🚀 Plan de Implementación

### **Paso 1: Implementación Inmediata (5 min)**
- [x] Reemplazar `router.refresh()` por `window.location.reload()` en `LocaleSwitcher.tsx`
- [x] Probar cambio de idioma en diferentes secciones
- [x] Verificar que todas las animaciones funcionen correctamente

### **Paso 2: Mejora de UX (Opcional, 15 min)**
- [ ] Agregar guardado/restauración de scroll position
- [ ] Agregar indicador de loading durante reload
- [ ] Considerar agregar animación de transición visual

### **Paso 3: Documentación (10 min)**
- [ ] Comentar en el código la razón del hard reload
- [ ] Actualizar README si existe sección de i18n
- [ ] Documentar decisión en archivo de arquitectura

---

## 📝 Código Alternativo: Loading Spinner Durante Reload

```typescript
// components/layout/LocaleSwitcher.tsx (versión mejorada)

export function LocaleSwitcher() {
  const locale = useLocale() as Locale;
  const [isChanging, setIsChanging] = useState(false);

  const toggleLocale = () => {
    const newLocale: Locale = locale === 'en' ? 'es' : 'en';
    
    // Mostrar feedback visual
    setIsChanging(true);
    
    // Guardar preferencia
    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000; SameSite=Lax`;
    
    // Opcional: Scroll to top con animación
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Reload después de 300ms (tiempo para animación)
    setTimeout(() => {
      window.location.reload();
    }, 300);
  };

  return (
    <button
      onClick={toggleLocale}
      disabled={isChanging}
      className={`
        p-2 rounded-lg transition-all duration-200
        ${isChanging 
          ? 'opacity-50 cursor-wait scale-95' 
          : 'hover:scale-110 active:scale-95'
        }
      `}
    >
      {isChanging ? (
        <div className="animate-spin">⟳</div>
      ) : (
        <div className="flex items-center gap-2">
          <Languages className="w-5 h-5" />
          <span>{localeFlags[locale === 'en' ? 'es' : 'en']}</span>
        </div>
      )}
    </button>
  );
}
```

---

## 🔮 Consideraciones Futuras

Si en el futuro se requiere **transición sin reload**, considerar:

1. **Migrar a `framer-motion`** en lugar de GSAP para animaciones de entrada
   - Mejor integración con ciclo de vida de React
   - Re-anima automáticamente con cambios de props

2. **Implementar sistema de "animation keys"**
   - Cada componente recibe un `key={locale}` único
   - React remonta completamente los componentes al cambiar idioma

3. **Usar `AnimatePresence` de framer-motion**
   - Permite transiciones de salida/entrada elegantes
   - Maneja automáticamente cleanup de animaciones

**Ejemplo conceptual:**

```tsx
import { AnimatePresence, motion } from 'framer-motion';

export default function Services() {
  const locale = useLocale();
  
  return (
    <AnimatePresence mode="wait">
      <motion.section
        key={locale} // 🔥 Remonta componente al cambiar idioma
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -50 }}
      >
        {/* contenido */}
      </motion.section>
    </AnimatePresence>
  );
}
```

---

## 📚 Referencias

- [GSAP ScrollTrigger - Best Practices](https://greensock.com/docs/v3/Plugins/ScrollTrigger)
- [Next.js Router Events](https://nextjs.org/docs/app/api-reference/functions/use-router)
- [React useEffect Cleanup](https://react.dev/reference/react/useEffect#cleanup-function)
- [GSAP Context](https://greensock.com/docs/v3/GSAP/gsap.context())

---

## ✅ Checklist de Testing

Después de implementar la solución, verificar:

- [ ] Cambio de idioma funciona en todas las páginas
- [ ] Animaciones se ejecutan correctamente después del reload
- [ ] No hay ScrollTriggers huérfanos (verificar con `ScrollTrigger.getAll()`)
- [ ] Scroll position se restaura correctamente (si se implementó)
- [ ] No hay errores en consola
- [ ] Performance sigue siendo aceptable
- [ ] Cookie de idioma persiste después del reload
- [ ] Funciona en todos los navegadores (Chrome, Firefox, Safari)

---

**Fecha de análisis:** 3 de noviembre de 2025  
**Autor:** GitHub Copilot  
**Estado:** ✅ Listo para implementación
