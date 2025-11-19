# Análisis de Performance - SplineScene

## Estado Inicial

- **TBT (Total Blocking Time):** 34,890ms (34.9 segundos)
- **Problema crítico:** Carga síncrona inmediata del archivo `scene.splinecode` bloqueando el hilo principal
- **Impacto:** Core Web Vitals severamente afectados, experiencia de usuario degradada

## Fase 1: Mitigación Inmediata (Implementada)

### Fecha de implementación: 19 de noviembre de 2025

### Cambios realizados:

#### 1. Reemplazo de Beams con VideoFallback

**Archivo:** `app/_components/Hero.tsx`

- ❌ **Antes:** Componente `Beams` (React Three Fiber con shaders GLSL pesados)
- ✅ **Después:** `VideoFallback` con videos pregrabados (`intro.webm` → `loop.webm`)
- **Beneficio:** Reducción drástica de computación WebGL en dispositivos low-end
- **Estrategia:** Video intro (una vez) → video loop (infinito)

#### 2. Lazy Loading Inteligente en SplineScene

**Archivo:** `components/shared/SplineScene.tsx`

**a) IntersectionObserver con rootMargin:**

```typescript
const observer = new IntersectionObserver(
  (entries) => {
    if (entry.isIntersecting) {
      loadSplineScene();
      observer.disconnect();
    }
  },
  {
    rootMargin: "200px", // Precargar 200px antes
    threshold: 0.1,
  }
);
```

- Solo carga cuando Hero está cerca del viewport
- Precarga inteligente con margen de 200px

**b) requestIdleCallback para trabajo pesado:**

```typescript
if ("requestIdleCallback" in window) {
  requestIdleCallback(loadScene, { timeout: 2000 });
} else {
  setTimeout(loadScene, 100);
}
```

- Difiere parsing a momentos idle del navegador
- Fallback a setTimeout para compatibilidad

#### 3. Optimización DPR Agresiva en Mobile

- **Desktop:** DPR máximo 1.2 (antes 1.5)
- **Mobile (<768px):** DPR máximo 0.8 (antes 1.5)
- **Reducción:** ~47% menos píxeles en mobile = más FPS

#### 4. Loading Skeleton Explícito

```typescript
const Robot = dynamic(() => import("@/components/shared/SplineScene"), {
  ssr: false,
  loading: () => <VideoFallback />,
});
```

- Muestra video inmediatamente durante carga de chunk
- Mejor percepción de performance

### Estimación de impacto:

- **TBT esperado:** ~10,000-13,000ms (reducción 60-70%)
- **LCP (Largest Contentful Paint):** Mejorado por carga diferida
- **CLS (Cumulative Layout Shift):** Sin cambios (layout estable)
- **FID (First Input Delay):** Mejorado por main thread liberado

### Próximos pasos (Fase 2):

- [ ] Crear versiones LOD del modelo (low/medium/high.splinecode)
- [ ] Implementar selección automática basada en GPU tier
- [ ] Configurar compresión brotli en Next.js config
- [ ] Agregar preconnect para CDN de assets

### Métricas a monitorear:

- TBT en Chrome DevTools Performance
- Real User Monitoring (considerar Vercel Analytics)
- Tiempo de carga por GPU tier
- Tasa de rebote en Hero section

---

## Notas técnicas

### Compatibilidad:

- ✅ `requestIdleCallback`: Chrome 47+, Edge 79+, Safari 15.4+
- ✅ `IntersectionObserver`: >95% navegadores
- ✅ Videos WebM: Soporte universal moderno

### Archivos modificados:

1. `app/_components/Hero.tsx` - VideoFallback + import optimizado
2. `components/shared/SplineScene.tsx` - Lazy loading inteligente + DPR mobile
