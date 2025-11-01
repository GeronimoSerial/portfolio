# Projects Section - Animaciones GSAP

## 📋 Descripción General

Sección de proyectos destacados con animaciones creativas y modernas implementadas con GSAP. Las animaciones se activan al hacer scroll y ofrecen efectos visuales únicos que distinguen esta sección del resto del sitio.

## ✨ Efectos Implementados

### 1. **Headline Split Animation**
- Cada palabra del título ("Featured Projects") aparece con efecto 3D
- Rotación en el eje X desde -90° hasta 0°
- Movimiento desde abajo (translateY)
- Stagger entre palabras para efecto secuencial
- Subtítulo con fade in retrasado

### 2. **Liquid Reveal Effect (Cards)**
- Cada card aparece con un clip-path circular que se expande
- Efecto "líquido" mediante `circle(0% at 50% 50%)` → `circle(150% at 50% 50%)`
- Entrada desde diferentes direcciones por card
- 6 patrones de entrada diferentes que se alternan

### 3. **SVG Border Drawing**
- Bordes decorativos alrededor de cada card
- Doble rectángulo con efecto de escala elástica
- Animación con `ease: "elastic.out(1, 0.6)"`
- Se sincroniza con la aparición del card

### 4. **Split Text Effect (Títulos de Proyecto)**
- Cada carácter del título se anima individualmente
- Efecto 3D con rotateX desde -90°
- Stagger de 0.02s entre caracteres
- Back ease para efecto de "rebote" suave

### 5. **Sequential Content Reveal**
Orden de aparición dentro de cada card:
1. Card container (liquid reveal)
2. SVG border (elastic)
3. Content fade in
4. Title (split characters)
5. Description (fade up)
6. Metadata (slide from bottom)
7. Icons (scale + rotation)

### 6. **Magnetic Parallax Effect**
- Solo en desktop
- Movimiento sutil en Y basado en scroll progress
- Efecto de "flotación" magnética mientras scrolleas
- Scrub de 1 para suavidad

### 7. **Decorative SVG Patterns**
- Dos patrones SVG decorativos en el fondo
- Drawing animation con strokeDasharray
- Stagger entre paths para efecto secuencial
- Opacity fade in sincronizado

## 🎯 Patrones de Entrada por Card

```typescript
const directions = [
  { x: -100, y: -50, rotation: -8 },  // Card 1: Desde arriba-izquierda
  { x: 100, y: -50, rotation: 8 },    // Card 2: Desde arriba-derecha
  { x: 0, y: -100, rotation: 0 },     // Card 3: Desde arriba
  { x: -80, y: 50, rotation: 5 },     // Card 4: Desde abajo-izquierda
  { x: 80, y: 50, rotation: -5 },     // Card 5: Desde abajo-derecha
  { x: 0, y: 100, rotation: 0 },      // Card 6: Desde abajo
];
```

## 🏗️ Arquitectura

### Hook: `useProjectsAnimations.ts`
```typescript
export const useProjectsAnimations = () => {
  const containerRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  
  useGSAP(() => {
    // Todas las animaciones dentro de matchMedia para responsiveness
    // Cleanup automático con revert y kill
  }, { scope: containerRef });
  
  return { containerRef, headlineRef };
};
```

### Componente: `Projects.tsx`
- Usa el hook para obtener refs
- Estructura semántica con clases específicas
- SVG decorativos con preserveAspectRatio
- Glassmorphism en cards
- Números grandes decorativos por card

## 🎨 Elementos Visuales

### Cards
- **Background**: `bg-white/50 dark:bg-black/30` con backdrop blur
- **Border**: Doble línea con SVG (zinc-300/200 en light, zinc-700/800 en dark)
- **Número decorativo**: Font-display, tamaño 6xl, opacity 50%
- **Iconos**: Circular badges con transición de colores

### SVG Decorativos
- **Top-left**: Círculos concéntricos + cruz
- **Bottom-right**: Hexágono + círculo
- **Opacity**: 20% para no distraer
- **Color**: zinc-400/600 según tema

## ⚡ Optimizaciones

1. **GPU Acceleration**
   - `force3D: true` en configuración GSAP
   - `will-change: transform` en CSS
   - `backface-visibility: hidden`

2. **Cleanup**
   - `matchMedia.revert()` al desmontar
   - `ScrollTrigger.getAll().forEach(t => t.kill())`

3. **Responsive**
   - MatchMedia para mobile/desktop
   - Parallax desactivado en mobile
   - Animaciones ajustadas por viewport

4. **Performance**
   - `once: true` en ScrollTriggers de entrada
   - `vector-effect: non-scaling-stroke` para SVG
   - Transform en lugar de top/left

## 🎬 Timeline de Animación por Card

```
0.0s: Liquid reveal (1.2s)
0.4s: SVG border elastic (0.8s)
0.6s: Content fade (0.6s)
0.8s: Title split chars (0.5s)
1.1s: Description fade (0.6s)
1.3s: Metadata slide (0.5s)
1.5s: Icons spin + scale (0.6s)
```

## 🔧 Configuración GSAP

```typescript
gsap.config({ force3D: true });

// ScrollTrigger defaults
start: "top 85%"    // Trigger cuando el elemento está al 85% del viewport
once: true          // Solo animar una vez
```

## 📱 Responsiveness

- **Desktop**: Todas las animaciones + parallax magnético
- **Mobile**: Animaciones de entrada sin parallax
- **Tablet**: Igual que desktop

## 🎨 Clases CSS Clave

```css
.project-card         /* Container principal */
.card-border          /* SVG decorativo */
.card-content         /* Contenido con glassmorphism */
.card-title           /* H3 animado */
.card-description     /* Párrafo con fade */
.card-metadata        /* Footer con links */
.card-icon            /* Iconos circulares */
.word                 /* Palabra del headline */
.char                 /* Carácter individual */
.decorative-svg       /* SVG de fondo */
```

## 🚀 Uso

```tsx
import { useProjectsAnimations } from "@/hooks/useProjectsAnimations";

export default function Projects() {
  const { containerRef, headlineRef } = useProjectsAnimations();
  
  return (
    <section ref={containerRef}>
      <div ref={headlineRef}>
        <span className="word">Featured</span>
        <span className="word">Projects</span>
      </div>
      
      {projects.map((project, i) => (
        <article className="project-card">
          <svg className="card-border">...</svg>
          <div className="card-content">
            <h3 className="card-title">{project.title}</h3>
            <p className="card-description">{description}</p>
            <div className="card-metadata">
              <a className="card-icon">...</a>
            </div>
          </div>
        </article>
      ))}
    </section>
  );
}
```

## 🎯 Diferencias con otras secciones

### vs Services
- Services usa morph shapes y rotate 3D
- Projects usa liquid reveal y split text
- Services tiene hover effects, Projects solo scroll

### vs Process
- Process tiene scroll-linked animaciones con scrub
- Projects tiene entrada única con once: true
- Process usa clipPath rectangular, Projects usa circular

## 🔮 Posibles Mejoras Futuras

1. **DrawSVG Plugin Premium**: Para animar strokes de SVG real
2. **MorphSVG Plugin Premium**: Para morphing entre shapes complejos
3. **SplitText Plugin Premium**: Para efectos de texto más avanzados
4. **Custom Ease**: Para curvas de animación únicas
5. **MotionPath**: Para que los iconos sigan paths SVG

## 📊 Métricas de Performance

- **FPS Target**: 60fps en desktop, 30fps en mobile
- **Animation Duration**: < 2s total por card
- **File Size Impact**: Minimal (solo hook + estilos)
- **Lighthouse Score**: No debería afectar significativamente

---

**Creado**: Noviembre 2025  
**GSAP Version**: 3.13.0  
**@gsap/react Version**: 2.1.2
