# 📱 Análisis y Plan: Animaciones Sincronizadas con Scroll en Móviles

> **Objetivo**: Implementar un sistema de animaciones completamente sincronizadas con el scroll del usuario en dispositivos móviles, donde el progreso visual está bloqueado hasta que la animación se complete.

---

## 📋 Índice

1. [Resumen Ejecutivo](#resumen-ejecutivo)
2. [Análisis del Estado Actual](#análisis-del-estado-actual)
3. [Arquitectura de la Solución](#arquitectura-de-la-solución)
4. [Especificación Técnica](#especificación-técnica)
5. [Plan de Implementación](#plan-de-implementación)
6. [Consideraciones de Rendimiento](#consideraciones-de-rendimiento)
7. [Testing y Validación](#testing-y-validación)

---

## 🎯 Resumen Ejecutivo

### Comportamiento Deseado

En dispositivos móviles (max-width: 768px):

- ✅ **Scroll controla animación**: El progreso de la animación está 100% sincronizado con el movimiento del scroll
- ✅ **Bloqueo de navegación**: El usuario no puede avanzar más allá de la sección hasta que la animación termine visualmente
- ✅ **Efecto "enganchado"**: La sección se mantiene fija mientras la animación se reproduce
- ✅ **Control total del usuario**: El usuario puede ir hacia adelante/atrás y la animación responde instantáneamente

### Comportamiento en Desktop

- ❌ **Sin modificaciones**: El scroll funciona de forma nativa, sin bloqueos
- ✅ **Animaciones opcionales**: Pueden mantener animaciones trigger-based normales

---

## 🔍 Análisis del Estado Actual

### Sistema Actual de Animaciones

El proyecto usa **GSAP 3.x** con hooks personalizados por sección:

```typescript
// hooks/useProcessAnimations.ts
export const useProcessAnimations = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 40%",
          end: "bottom bottom",
          toggleActions: "play none none reverse", // ❌ No usa scrub
        },
      });

      // Animaciones secuenciales...
    },
    { scope: containerRef }
  );

  return containerRef;
};
```

### Problemas Identificados

1. **❌ No usa `scrub`**: Las animaciones se ejecutan automáticamente con `toggleActions`
2. **❌ No hay pinning**: Las secciones no se "enganchan" durante la animación
3. **❌ No es responsive**: La lógica no diferencia entre móvil y desktop
4. **❌ Scroll libre**: El usuario puede avanzar más rápido que la animación

---

## 🏗️ Arquitectura de la Solución

### Componentes Clave

```
┌─────────────────────────────────────────────────┐
│         Hook: useMobileScrollLocked             │
│  (Lógica central de scroll sincronizado)        │
└───────────────────┬─────────────────────────────┘
                    │
        ┌───────────┴───────────┐
        │                       │
        ▼                       ▼
┌───────────────┐      ┌────────────────┐
│ gsap.matchMedia│      │ ScrollTrigger  │
│   (mobile)    │      │ + scrub + pin  │
└───────────────┘      └────────────────┘
        │                       │
        └───────────┬───────────┘
                    ▼
        ┌───────────────────────┐
        │  Timeline Principal   │
        │  (Animación scrubbed) │
        └───────────────────────┘
```

### Flujo de Funcionamiento

```
Usuario hace scroll hacia abajo
         │
         ▼
   ¿Es móvil? ──NO──> Animación normal (trigger-based)
         │
        SÍ
         │
         ▼
  Pin la sección (queda fija)
         │
         ▼
  ScrollTrigger con scrub: true
         │
         ▼
  Animación avanza con el scroll
         │
         ▼
  ¿Scroll alcanzó el final? ──NO──> Animación pausada
         │
        SÍ
         │
         ▼
  Desbloquear sección (unpin)
         │
         ▼
  Usuario puede seguir navegando
```

---

## 🔧 Especificación Técnica

### 1. Hook Principal: `useMobileScrollLocked`

```typescript
// hooks/useMobileScrollLocked.ts
import { useRef, useLayoutEffect } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface ScrollLockedOptions {
  /**
   * Duración virtual del scroll para completar la animación
   * Recomendado: altura de la sección * 1.5 - 2
   */
  scrollDistance?: string;

  /**
   * Suavidad del scrub (0 = instantáneo, 1+ = con delay)
   * Recomendado: 0.5 para sincronización inmediata
   */
  scrubSmoothing?: number | boolean;

  /**
   * Punto de inicio para activar el pinning
   */
  startTrigger?: string;

  /**
   * Función que retorna el timeline a animar
   */
  createTimeline: (container: HTMLElement) => gsap.core.Timeline;

  /**
   * Breakpoint móvil (default: 768px)
   */
  mobileBreakpoint?: number;
}

export const useMobileScrollLocked = ({
  scrollDistance = "200%",
  scrubSmoothing = 0.5,
  startTrigger = "top top",
  createTimeline,
  mobileBreakpoint = 768,
}: ScrollLockedOptions) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null);

  useGSAP(
    () => {
      if (!containerRef.current) return;

      // Media query para móvil
      const mm = gsap.matchMedia();

      mm.add(`(max-width: ${mobileBreakpoint}px)`, () => {
        // **LÓGICA MÓVIL**: Scroll bloqueado + animación scrubbed

        const timeline = createTimeline(containerRef.current!);

        scrollTriggerRef.current = ScrollTrigger.create({
          trigger: containerRef.current,
          start: startTrigger,
          end: `+=${scrollDistance}`,

          // 🔑 CLAVE: Pin mantiene la sección fija
          pin: true,
          pinSpacing: true,
          anticipatePin: 1,

          // 🔑 CLAVE: Scrub sincroniza animación con scroll
          scrub: scrubSmoothing,

          // Vincula el timeline al scroll
          animation: timeline,

          // Callbacks opcionales para debugging
          onEnter: () => console.log("🔒 Sección bloqueada"),
          onLeave: () => console.log("🔓 Sección desbloqueada"),

          // Optimizaciones
          refreshPriority: 1,
          invalidateOnRefresh: true,
        });

        return () => {
          scrollTriggerRef.current?.kill();
        };
      });

      mm.add(`(min-width: ${mobileBreakpoint + 1}px)`, () => {
        // **LÓGICA DESKTOP**: Animación normal sin bloqueo

        const timeline = createTimeline(containerRef.current!);

        ScrollTrigger.create({
          trigger: containerRef.current,
          start: "top 60%",
          toggleActions: "play none none reverse",
          animation: timeline,
        });
      });

      return () => mm.kill();
    },
    { scope: containerRef, dependencies: [] }
  );

  return containerRef;
};
```

### 2. Implementación en Componente de Sección

```typescript
// app/_components/Process.tsx (REFACTORIZADO)
"use client";

import { Search, Layers, Code, Rocket } from "lucide-react";
import { useMobileScrollLocked } from "@/hooks/useMobileScrollLocked";
import { gsap } from "gsap";

export default function Process() {
  const containerRef = useMobileScrollLocked({
    scrollDistance: "250%", // 2.5 viewports para completar
    scrubSmoothing: 0.5,
    startTrigger: "top top",
    createTimeline: (container) => {
      const tl = gsap.timeline();

      // Header
      tl.fromTo(
        ".process-header",
        { opacity: 0, y: 60 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }
      );

      // Divider
      tl.fromTo(
        ".process-divider",
        { width: 0 },
        { width: "6rem", duration: 1, ease: "power3.out" },
        "-=0.4"
      );

      // Cards con stagger
      const cards = gsap.utils.toArray<HTMLDivElement>(".process-card");
      tl.fromTo(
        cards,
        {
          xPercent: (i: number) => (i % 2 === 0 ? -50 : 50),
          rotation: (i: number) => (i % 2 === 0 ? -4 : 4),
          opacity: 0,
          scale: 0.95,
        },
        {
          xPercent: 0,
          rotation: 0,
          opacity: 1,
          scale: 1,
          duration: 0.6,
          ease: "expo.out",
          stagger: 0.2,
        },
        "-=0.3"
      );

      // Connectors (solo desktop visible)
      tl.fromTo(
        ".process-connector",
        { scaleX: 0 },
        { scaleX: 1, duration: 0.5, ease: "power2.inOut", stagger: 0.15 },
        "-=0.8"
      );

      // Footer
      tl.fromTo(
        ".process-footer",
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
        "-=0.4"
      );

      return tl;
    },
  });

  // Resto del componente igual...

  return (
    <section
      ref={containerRef}
      id="process"
      className="relative min-h-screen py-20 px-4"
    >
      {/* ... contenido ... */}
    </section>
  );
}
```

### 3. Cálculo del `scrollDistance`

El parámetro `end` define cuánto scroll necesita el usuario para completar la animación:

```typescript
// Fórmula recomendada:
scrollDistance = (altura_seccion * factor_multiplicador) + "px"

// Ejemplo:
// Sección de 800px de alto
// Factor 2x para darle tiempo al usuario
scrollDistance = "1600px" o "+= 200%" (2x viewport height)

// Valores recomendados por tipo de animación:
const distancePresets = {
  simple: "150%",      // Animaciones cortas (fade, slide)
  moderate: "200%",    // Animaciones con stagger
  complex: "300%",     // Animaciones complejas con múltiples pasos
  showcase: "400%",    // Secciones tipo "storytelling"
};
```

### 4. Configuración del `scrub`

```typescript
// Opciones de scrub:
scrub: true; // Instantáneo (sin suavizado)
scrub: 0.5; // Suavizado ligero (recomendado para móvil)
scrub: 1; // Suavizado moderado
scrub: 2; // Suavizado pesado (puede sentirse lento)

// Recomendación por tipo de dispositivo:
const scrubConfig = {
  mobile: 0.5, // Respuesta rápida
  tablet: 1, // Balance entre fluidez y control
  desktop: false, // Sin scrub, usar toggleActions
};
```

---

## 📐 Plan de Implementación

### Fase 1: Infraestructura Base (Día 1)

#### Tarea 1.1: Crear Hook Principal

- [ ] Crear `hooks/useMobileScrollLocked.ts`
- [ ] Implementar lógica con `gsap.matchMedia()`
- [ ] Configurar `ScrollTrigger` con `pin` y `scrub`
- [ ] Añadir tipado TypeScript completo
- [ ] Testing básico con componente de prueba

#### Tarea 1.2: Configuración de Constantes

```typescript
// lib/constants.ts
export const SCROLL_ANIMATION_CONFIG = {
  MOBILE_BREAKPOINT: 768,
  SCRUB_SMOOTHING: {
    MOBILE: 0.5,
    TABLET: 1,
  },
  SCROLL_DISTANCES: {
    SIMPLE: "150%",
    MODERATE: "200%",
    COMPLEX: "300%",
    SHOWCASE: "400%",
  },
  PIN_SPACING: true,
  ANTICIPATE_PIN: 1,
} as const;
```

### Fase 2: Refactorización de Secciones (Días 2-3)

#### Tarea 2.1: Migrar Process

- [ ] Refactorizar `hooks/useProcessAnimations.ts` para usar el nuevo hook
- [ ] Ajustar timeline para funcionar con scrub
- [ ] Testing en móvil real

#### Tarea 2.2: Migrar Services

- [ ] Adaptar animaciones de tarjetas
- [ ] Configurar scroll distance apropiado
- [ ] Testing de bordes SVG animados

#### Tarea 2.3: Migrar Projects

- [ ] Revisar `hooks/useProjectsAnimations.ts`
- [ ] Adaptar para sistema de scrub
- [ ] Testing de galería de proyectos

#### Tarea 2.4: Migrar Results

- [ ] Implementar en sección de resultados
- [ ] Animaciones de números/estadísticas
- [ ] Testing de counters animados

### Fase 3: Optimizaciones (Día 4)

#### Tarea 3.1: Performance

```typescript
// Optimizaciones a implementar:

// 1. Will-change CSS para elementos animados
.scroll-animated {
  will-change: transform, opacity;
  backface-visibility: hidden;
  perspective: 1000px;
}

// 2. Force3D en animaciones GSAP
gsap.set(elements, { force3D: true });

// 3. Throttle de resize events
const debouncedRefresh = gsap.utils.debounce(
  () => ScrollTrigger.refresh(),
  250
);
window.addEventListener("resize", debouncedRefresh);

// 4. Cleanup de ScrollTriggers
useLayoutEffect(() => {
  return () => {
    ScrollTrigger.getAll().forEach(st => st.kill());
  };
}, []);
```

#### Tarea 3.2: Accesibilidad

- [ ] Detectar `prefers-reduced-motion`
- [ ] Fallback sin animaciones para usuarios sensibles
- [ ] Testing con lectores de pantalla

```typescript
// Detección de motion preference
useLayoutEffect(() => {
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (prefersReducedMotion) {
    // Deshabilitar todas las animaciones
    gsap.set(elements, { clearProps: "all" });
    ScrollTrigger.killAll();
  }
}, []);
```

### Fase 4: Testing & Ajustes (Día 5)

#### Dispositivos de Prueba

| Dispositivo        | Resolución | Navegador | Prioridad   |
| ------------------ | ---------- | --------- | ----------- |
| iPhone 13 Pro      | 390x844    | Safari    | ⭐⭐⭐ Alta |
| Samsung Galaxy S21 | 360x800    | Chrome    | ⭐⭐⭐ Alta |
| iPad Mini          | 744x1133   | Safari    | ⭐⭐ Media  |
| Pixel 6            | 412x915    | Chrome    | ⭐⭐ Media  |
| iPhone SE          | 375x667    | Safari    | ⭐ Baja     |

#### Checklist de Testing

- [ ] Scroll suave sin janks (60fps)
- [ ] Pinning funciona correctamente
- [ ] Animación se detiene cuando el usuario para de scrollear
- [ ] Scroll hacia atrás funciona (animación reversa)
- [ ] No hay conflictos con otras secciones
- [ ] Desktop mantiene comportamiento normal
- [ ] Transición entre breakpoints sin errores
- [ ] Performance en dispositivos de gama baja

---

## ⚡ Consideraciones de Rendimiento

### 1. Optimización de Renders

```typescript
// ❌ MALO: Re-crear timeline en cada render
const containerRef = useMobileScrollLocked({
  createTimeline: (container) => {
    return gsap.timeline()... // ⚠️ Se crea de nuevo cada vez
  }
});

// ✅ BUENO: useCallback para memoizar función
const createTimeline = useCallback((container: HTMLElement) => {
  return gsap.timeline()...
}, []); // Sin dependencias

const containerRef = useMobileScrollLocked({
  createTimeline,
});
```

### 2. Lazy Loading de Secciones

```typescript
// Cargar animaciones solo cuando la sección está cerca del viewport
const SectionWithAnimation = dynamic(
  () => import("@/app/_components/Process"),
  {
    ssr: true,
    loading: () => <Skeleton className="h-screen" />,
  }
);
```

### 3. GPU Acceleration

```css
/* global.css */
.scroll-section {
  /* Forzar capa GPU */
  transform: translateZ(0);
  will-change: transform;

  /* Mejorar rendering de texto */
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
```

### 4. Throttling de ScrollTrigger Refresh

```typescript
// Hook para refrescar ScrollTrigger optimizado
export const useScrollTriggerRefresh = () => {
  useEffect(() => {
    const refresh = gsap.utils.debounce(() => ScrollTrigger.refresh(), 200);

    window.addEventListener("resize", refresh);
    window.addEventListener("orientationchange", refresh);

    return () => {
      window.removeEventListener("resize", refresh);
      window.removeEventListener("orientationchange", refresh);
    };
  }, []);
};
```

### 5. Métricas de Performance

```typescript
// Medir performance de animaciones
const measureAnimationPerformance = () => {
  let frameCount = 0;
  let lastTime = performance.now();

  const checkFPS = () => {
    frameCount++;
    const currentTime = performance.now();
    const delta = currentTime - lastTime;

    if (delta >= 1000) {
      const fps = Math.round((frameCount * 1000) / delta);
      console.log(`FPS: ${fps}`);

      if (fps < 50) {
        console.warn(
          "⚠️ Performance degradada, considerar reducir complejidad"
        );
      }

      frameCount = 0;
      lastTime = currentTime;
    }

    requestAnimationFrame(checkFPS);
  };

  checkFPS();
};
```

---

## 🧪 Testing y Validación

### Testing Manual

#### Checklist de Comportamiento

```markdown
## Móvil (< 768px)

### Scroll Hacia Abajo

- [ ] Sección se "engancha" al entrar en viewport
- [ ] Animación avanza solo cuando usuario scrollea
- [ ] Si usuario detiene scroll, animación se pausa
- [ ] Contenido no se desplaza más allá de la animación
- [ ] Al completar animación, sección se "desengancha"
- [ ] Siguiente sección es navegable

### Scroll Hacia Arriba

- [ ] Animación se reproduce en reversa
- [ ] Sincronización es perfecta (no hay desfase)
- [ ] Sección se re-engancha al volver a entrar

### Edge Cases

- [ ] Scroll rápido no rompe la animación
- [ ] Scroll con momentum (iOS) funciona correctamente
- [ ] Cambio de orientación refresca correctamente
- [ ] Navegación con teclado (Tab) no interfiere

## Desktop (>= 768px)

- [ ] Scroll es completamente libre
- [ ] Animaciones se activan por trigger normal
- [ ] No hay pinning de secciones
- [ ] Performance es fluida
```

### Testing Automatizado

```typescript
// tests/scroll-locked-animations.spec.ts
import { test, expect } from "@playwright/test";

test.describe("Mobile Scroll-Locked Animations", () => {
  test.use({
    viewport: { width: 375, height: 667 },
    isMobile: true,
  });

  test("should pin section during animation", async ({ page }) => {
    await page.goto("http://localhost:3000");

    // Scroll hasta la sección
    await page.evaluate(() => {
      window.scrollTo({ top: 800, behavior: "smooth" });
    });

    // Verificar que la sección está pinned
    const isPinned = await page.evaluate(() => {
      const section = document.querySelector("#process");
      return window.getComputedStyle(section!).position === "fixed";
    });

    expect(isPinned).toBe(true);
  });

  test("should sync animation with scroll progress", async ({ page }) => {
    await page.goto("http://localhost:3000");

    // Scroll inicial
    await page.evaluate(() => window.scrollTo({ top: 800 }));
    await page.waitForTimeout(300);

    const opacityBefore = await page.evaluate(() => {
      const card = document.querySelector(".process-card");
      return window.getComputedStyle(card!).opacity;
    });

    // Scroll adicional
    await page.evaluate(() => window.scrollTo({ top: 1200 }));
    await page.waitForTimeout(300);

    const opacityAfter = await page.evaluate(() => {
      const card = document.querySelector(".process-card");
      return window.getComputedStyle(card!).opacity;
    });

    // Opacidad debe haber aumentado
    expect(parseFloat(opacityAfter)).toBeGreaterThan(parseFloat(opacityBefore));
  });

  test("should not pin section on desktop", async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto("http://localhost:3000");

    await page.evaluate(() => window.scrollTo({ top: 800 }));
    await page.waitForTimeout(300);

    const isPinned = await page.evaluate(() => {
      const section = document.querySelector("#process");
      return window.getComputedStyle(section!).position === "fixed";
    });

    expect(isPinned).toBe(false);
  });
});
```

### Performance Testing

```typescript
// tests/performance.spec.ts
import { test, expect } from "@playwright/test";

test("should maintain 60fps during scroll animation", async ({ page }) => {
  await page.goto("http://localhost:3000");

  // Empezar medición de FPS
  await page.evaluate(() => {
    (window as any).fpsLog = [];
    let lastTime = performance.now();
    let frames = 0;

    const measureFPS = () => {
      frames++;
      const currentTime = performance.now();
      const delta = currentTime - lastTime;

      if (delta >= 1000) {
        const fps = Math.round((frames * 1000) / delta);
        (window as any).fpsLog.push(fps);
        frames = 0;
        lastTime = currentTime;
      }

      requestAnimationFrame(measureFPS);
    };

    measureFPS();
  });

  // Simular scroll
  for (let i = 0; i < 10; i++) {
    await page.evaluate((scroll) => {
      window.scrollTo({ top: scroll, behavior: "smooth" });
    }, 800 + i * 100);
    await page.waitForTimeout(200);
  }

  // Obtener FPS promedio
  const avgFPS = await page.evaluate(() => {
    const log = (window as any).fpsLog;
    return log.reduce((a: number, b: number) => a + b, 0) / log.length;
  });

  expect(avgFPS).toBeGreaterThanOrEqual(55); // Permitir 5fps de margen
});
```

---

## 🚨 Posibles Problemas y Soluciones

### Problema 1: Animación "salta" al entrar/salir

**Causa**: Conflicto entre múltiples ScrollTriggers en la misma sección

**Solución**:

```typescript
// Usar un solo ScrollTrigger por sección
ScrollTrigger.create({
  trigger: container,
  animation: masterTimeline, // Timeline que controla todo
  // NO crear múltiples ScrollTriggers para sub-elementos
});
```

### Problema 2: Sección se queda "trabada" en pinning

**Causa**: `end` del ScrollTrigger mal calculado

**Solución**:

```typescript
// Asegurar que end es suficientemente largo
ScrollTrigger.create({
  end: () => {
    const sectionHeight = container.offsetHeight;
    return `+=${sectionHeight * 2}px`; // 2x la altura
  },
});
```

### Problema 3: Scroll se siente "lento" o "pesado"

**Causa**: `scrub` value muy alto

**Solución**:

```typescript
// Reducir scrub para respuesta más rápida
scrub: 0.3, // En vez de 1 o 2
```

### Problema 4: Animación no funciona en iOS Safari

**Causa**: iOS tiene scroll behavior diferente (momentum)

**Solución**:

```typescript
ScrollTrigger.normalizeScroll({
  allowNestedScroll: true,
  lockAxis: true,
  momentum: true, // ✅ Importante para iOS
});
```

### Problema 5: Performance degradada en dispositivos antiguos

**Causa**: Demasiadas animaciones simultáneas

**Solución**:

```typescript
// Simplificar animaciones en dispositivos lentos
const isLowEndDevice = () => {
  return navigator.hardwareConcurrency <= 4;
};

if (isLowEndDevice()) {
  // Versión simplificada sin efectos complejos
  timeline.to(cards, { opacity: 1, duration: 0.3 });
} else {
  // Versión completa con todos los efectos
  timeline.to(cards, {
    opacity: 1,
    scale: 1,
    rotation: 0,
    duration: 0.6,
  });
}
```

---

## 📊 Métricas de Éxito

### KPIs Técnicos

| Métrica         | Objetivo | Medición                    |
| --------------- | -------- | --------------------------- |
| FPS promedio    | ≥ 55 fps | Chrome DevTools Performance |
| Tiempo de carga | ≤ 2s     | Lighthouse                  |
| LCP             | ≤ 2.5s   | Web Vitals                  |
| CLS             | ≤ 0.1    | Web Vitals                  |
| TTI             | ≤ 3.5s   | Lighthouse                  |

### KPIs de UX

| Métrica                         | Objetivo    | Medición       |
| ------------------------------- | ----------- | -------------- |
| Sincronización scroll-animación | 100%        | Testing manual |
| Bloqueo funcional en móvil      | Sí          | Testing manual |
| Scroll libre en desktop         | Sí          | Testing manual |
| Compatibilidad iOS              | ≥ iOS 13    | BrowserStack   |
| Compatibilidad Android          | ≥ Android 9 | BrowserStack   |

---

## 📝 Checklist Pre-Implementación

Antes de comenzar el desarrollo, confirmar:

- [ ] **Contexto del proyecto revisado**: Se entiende la estructura actual de hooks y componentes
- [ ] **GSAP correctamente instalado**: Verificar que `gsap` y `@gsap/react` están en `package.json`
- [ ] **ScrollTrigger disponible**: Plugin registrado globalmente
- [ ] **Testing setup**: Playwright configurado para pruebas móviles
- [ ] **Dispositivos de prueba**: Acceso a al menos 2 dispositivos físicos móviles
- [ ] **Backup del código**: Crear branch `feat/scroll-locked-animations`
- [ ] **Tiempo estimado**: 5 días laborables confirmados
- [ ] **Stakeholder informado**: Cliente/equipo al tanto del cambio de comportamiento en móvil

---

## 🎨 Ejemplo Visual del Comportamiento

```
MÓVIL (Scroll Locked):
┌────────────────────────────┐
│   Usuario scrollea ↓       │
├────────────────────────────┤
│                            │
│   📱 VIEWPORT             │
│  ┌──────────────────────┐ │
│  │  🔒 SECCIÓN PINNED   │ │ <- Se mantiene fija
│  │                      │ │
│  │  Card 1: ████ 40%   │ │ <- Animación progresa
│  │  Card 2: ██   20%   │ │    con el scroll
│  │  Card 3:       0%   │ │
│  │                      │ │
│  └──────────────────────┘ │
│                            │
│  Usuario no puede pasar    │
│  hasta completar 100%      │
└────────────────────────────┘

DESKTOP (Scroll Libre):
┌────────────────────────────┐
│   Usuario scrollea ↓       │
├────────────────────────────┤
│                            │
│   🖥️  VIEWPORT            │
│  ┌──────────────────────┐ │
│  │  Sección Process     │ │ <- Se mueve libremente
│  │  (trigger at 60%)    │ │
│  │  ✅ Animación play   │ │ <- Se activa pero no
│  └──────────────────────┘ │    bloquea el scroll
│  ┌──────────────────────┐ │
│  │  Sección Projects    │ │ <- Usuario puede
│  │                      │ │    seguir navegando
│  └──────────────────────┘ │
└────────────────────────────┘
```

---

## 🚀 Próximos Pasos

Una vez aprobado este plan:

1. **Crear branch**: `feat/scroll-locked-mobile-animations`
2. **Implementar Fase 1**: Hook base + testing
3. **Checkpoint 1**: Demo en un componente para validar concepto
4. **Implementar Fases 2-4**: Rollout completo
5. **Testing exhaustivo**: Dispositivos reales + automatizado
6. **Merge a staging**: Validación en entorno de staging
7. **Deploy a producción**: Con feature flag para rollback rápido

---

## 📚 Referencias Técnicas

### Documentación Oficial

- [GSAP ScrollTrigger](https://greensock.com/docs/v3/Plugins/ScrollTrigger)
- [GSAP matchMedia](<https://greensock.com/docs/v3/GSAP/gsap.matchMedia()>)
- [GSAP scrub property](https://greensock.com/docs/v3/Plugins/ScrollTrigger#scrub)

### Recursos Adicionales

- [ScrollTrigger Pin Spacing](https://greensock.com/docs/v3/Plugins/ScrollTrigger#pinSpacing)
- [Mobile Optimization Best Practices](https://greensock.com/docs/v3/GSAP/CorePlugins/CSSPlugin#performance)
- [Web Vitals](https://web.dev/vitals/)

---

## ✅ Aprobación y Feedback

### Preguntas para el Cliente/Equipo

1. **¿El comportamiento de "scroll bloqueado" es el esperado para la UX móvil?**

   - Algunos usuarios pueden encontrarlo "diferente" al scroll nativo
   - ¿Hay preferencia por una versión más suave?

2. **¿Todas las secciones deben tener este comportamiento o solo algunas?**

   - Process, Services, Projects, Results
   - ¿O implementarlo selectivamente?

3. **¿Hay presupuesto de tiempo para testing en dispositivos reales?**

   - Recomendado: 2-3 días de testing exhaustivo
   - Alternativa: Solo testing en emuladores (menos confiable)

4. **¿El proyecto tiene Analytics para medir engagement?**

   - Sería útil trackear tiempo en cada sección
   - Comparar bounce rate antes/después

5. **¿Hay plan de rollback si la UX no es bien recibida?**
   - Recomendado: Feature flag para activar/desactivar fácilmente

---

**Documento creado**: ${new Date().toLocaleDateString('es-ES')}  
**Versión**: 1.0  
**Autor**: GitHub Copilot + GSAP Master AI  
**Estado**: ⏳ Pendiente de Aprobación
