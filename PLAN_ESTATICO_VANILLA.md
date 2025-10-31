# Plan de Conversión a Sitio Estático Vanilla

## Objetivo

Convertir el sitio actual de Next.js con React hooks y animaciones complejas a una versión **100% estática** que mantenga la misma estética visual pero utilizando únicamente:
- HTML/CSS (Tailwind)
- JavaScript vanilla mínimo e indispensable
- Sin hooks de React
- Sin librerías de animación pesadas

Esta versión servirá como base sólida y optimizada para luego añadir mejoras progresivas de manera controlada.

---

## 1. Análisis del Estado Actual

### 1.1 Dependencias a Eliminar

**Librerías de Animación:**
- ❌ `motion` (framer-motion) - Usado en 20+ componentes
- ❌ `@tsparticles/react` - Canvas particles con hooks
- ❌ `@tsparticles/engine` & `@tsparticles/slim`

**Hooks y Context:**
- ❌ `react-intersection-observer` - Detección de scroll
- ❌ `react-scroll` - Smooth scrolling
- ❌ `ScrollContext` - Context personalizado para estado de scroll
- ❌ Custom hooks: `useScrollSpy`, `useScrollTo`, `useSectionInView`, `useScrollReveal`, `useDraggable`

**UI Complejas:**
- ❌ `@radix-ui/react-dialog` - Modales
- ❌ `embla-carousel-*` - Carruseles
- ❌ Componentes UI con motion: `moving-border.tsx`, `card.tsx`, `SocialCard.tsx`

**Mantener:**
- ✅ Next.js (para SSG - Static Site Generation)
- ✅ Tailwind CSS
- ✅ Contentlayer (para proyectos MDX)
- ✅ Lucide React (íconos - puede ser reemplazado por SVG estáticos)
- ✅ TypeScript (opcional, pero recomendado)

### 1.2 Funcionalidades Actuales con Hooks

| Componente | Hooks Usados | Funcionalidad |
|------------|-------------|---------------|
| `StickyNav` | `useScroll`, `useState` | Cambio de estilo al scroll, menú móvil |
| `BackToTop` | `useScroll` | Botón que aparece al scrollear |
| `Hero` | `motion` hooks | Animaciones de entrada/fade-in |
| `Services` | `useSectionInView`, `motion` | Detección de vista + animaciones |
| `Projects` | `useSectionInView`, `motion` | Detección de vista + animaciones |
| `Contact` | `useSectionInView`, `useState`, `motion` | Formulario + animaciones |
| `Testimonials` | `useSectionInView`, `useState`, `motion` | Carrusel manual + animaciones |
| `ParticlesOptimized` | `useEffect`, `useState` | Canvas animado con interactividad mouse |
| `ScrollContext` | `useEffect`, `useState`, `useCallback` | Estado global de scroll |

---

## 2. Estrategia de Conversión

### 2.1 Principios Fundamentales

1. **Mobile-First Estático:** Todo el HTML se renderiza en build time
2. **CSS-First Animations:** Usar solo `@keyframes` de Tailwind y CSS transitions
3. **Progressive Enhancement:** JavaScript solo para interacciones esenciales
4. **No Runtime Dependencies:** Cero librerías en el bundle del cliente (excepto necesarias)

### 2.2 Mapeo de Reemplazos

#### A. Animaciones `motion` → CSS Animations

**Fade-in con delay:**
```tsx
// ANTES (motion)
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6, delay: 0.2 }}
>

// DESPUÉS (CSS + Tailwind)
<div className="animate-fade-in opacity-0 [animation-delay:200ms]">
```

**Configuración en `tailwind.config.js`:**
```js
keyframes: {
  'fade-in': {
    '0%': { opacity: '0', transform: 'translateY(20px)' },
    '100%': { opacity: '1', transform: 'translateY(0)' }
  }
}
animation: {
  'fade-in': 'fade-in 0.6s ease-out forwards'
}
```

**Delays escalonados:**
```html
<!-- Usar classes utilitarias para delays -->
<div class="[animation-delay:100ms]"></div>
<div class="[animation-delay:200ms]"></div>
<div class="[animation-delay:300ms]"></div>
```

#### B. Intersection Observer → CSS `animation-timeline`

**OPCIÓN 1: Animaciones automáticas (sin JS)**
```css
/* Animaciones que inician automáticamente al cargar */
.section {
  animation: fade-in 0.8s ease-out forwards;
}
```

**OPCIÓN 2: JavaScript vanilla mínimo**
```js
// Solo para animaciones que DEBEN iniciar al entrar en viewport
document.addEventListener('DOMContentLoaded', () => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
      }
    });
  }, { threshold: 0.1 });

  document.querySelectorAll('.animate-on-scroll').forEach(el => {
    observer.observe(el);
  });
});
```

```css
.animate-on-scroll {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.6s ease-out, transform 0.6s ease-out;
}

.animate-on-scroll.is-visible {
  opacity: 1;
  transform: translateY(0);
}
```

**RECOMENDACIÓN:** Usar OPCIÓN 1 para primera versión estática. Añadir OPCIÓN 2 solo si es crítico para UX.

#### C. Particles Canvas → CSS Gradient Animado

**Reemplazo 1: Gradiente animado simple**
```html
<div class="fixed inset-0 -z-50 bg-black">
  <div class="absolute inset-0 bg-gradient-radial from-zinc-800/20 via-transparent to-transparent animate-pulse-slow"></div>
</div>
```

**Reemplazo 2: Grid pattern estático**
```css
.bg-grid-pattern {
  background-image: 
    linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px);
  background-size: 80px 80px;
}
```

**Reemplazo 3: Canvas estático (sin interactividad)**
```html
<!-- Imagen pre-renderizada de particles -->
<div class="fixed inset-0 -z-50 opacity-20" 
     style="background-image: url('/particles-static.png')"></div>
```

**RECOMENDACIÓN:** Usar Reemplazo 2 (Grid pattern) por mejor performance y estética limpia.

#### D. Smooth Scroll → CSS `scroll-behavior`

```css
/* En global.css */
html {
  scroll-behavior: smooth;
  scroll-padding-top: 80px; /* Altura del nav */
}
```

```html
<!-- Links normales -->
<a href="#services">Services</a>
<a href="#contact">Contact</a>

<!-- Secciones con IDs -->
<section id="services">...</section>
<section id="contact">...</section>
```

**Sin JavaScript necesario.**

#### E. Sticky Nav con Blur → CSS puro

```html
<nav class="fixed top-0 w-full z-50 transition-colors duration-300
            [&:has(~main:not(:first-child))]:bg-zinc-900/95
            [&:has(~main:not(:first-child))]:backdrop-blur-lg
            [&:has(~main:not(:first-child))]:border-b
            [&:has(~main:not(:first-child))]:border-zinc-800">
```

**ALTERNATIVA con JavaScript mínimo:**
```js
// scroll-nav.js (< 10 líneas)
let lastScroll = 0;
window.addEventListener('scroll', () => {
  const nav = document.querySelector('nav');
  const scrolled = window.scrollY > 50;
  nav.classList.toggle('scrolled', scrolled);
}, { passive: true });
```

```css
nav {
  @apply fixed top-0 w-full z-50 transition-all duration-300;
}
nav.scrolled {
  @apply bg-zinc-900/95 backdrop-blur-lg border-b border-zinc-800;
}
```

#### F. Menú Móvil → Checkbox Hack (sin JS)

```html
<input type="checkbox" id="mobile-menu" class="peer hidden">

<label for="mobile-menu" class="md:hidden cursor-pointer">
  <svg><!-- hamburger icon --></svg>
</label>

<div class="hidden peer-checked:block fixed inset-0 bg-black/80">
  <nav><!-- menu items --></nav>
</div>
```

**CSS:**
```css
/* El menú se muestra cuando el checkbox está checked */
.peer:checked ~ .mobile-menu {
  display: block;
}
```

#### G. BackToTop Button → CSS + Anchor

```html
<!-- Botón siempre presente, pero hidden -->
<a href="#hero" 
   class="fixed bottom-8 right-8 z-40 p-3 rounded-full
          bg-white text-black opacity-0 pointer-events-none
          [body:has(main:not(:first-child))]:opacity-100
          [body:has(main:not(:first-child))]:pointer-events-auto
          transition-opacity duration-300">
  <svg><!-- arrow up --></svg>
</a>
```

**ALTERNATIVA con JavaScript:**
```js
window.addEventListener('scroll', () => {
  const btn = document.getElementById('back-to-top');
  btn.classList.toggle('show', window.scrollY > 300);
}, { passive: true });
```

#### H. Formulario de Contacto → Form Nativo

```html
<form action="/api/contact" method="POST" class="space-y-4">
  <input type="text" name="name" required 
         class="w-full px-4 py-3 bg-white/5 border border-zinc-800 rounded-lg
                focus:border-white focus:outline-none transition-colors">
  
  <textarea name="message" required rows="5"></textarea>
  
  <button type="submit" 
          class="px-6 py-3 bg-white text-black rounded-lg
                 hover:bg-zinc-100 transition-colors">
    Send Message
  </button>
</form>
```

**Sin validación JS en primera versión.** HTML5 validation es suficiente.

#### I. Testimonials Carousel → CSS Scroll Snap

```html
<div class="overflow-x-auto snap-x snap-mandatory flex gap-6 pb-4">
  <article class="snap-center shrink-0 w-full md:w-1/2 lg:w-1/3">
    <!-- testimonial card -->
  </article>
  <!-- más testimonials -->
</div>
```

```css
.testimonials-container {
  scrollbar-width: thin;
  scrollbar-color: rgba(255,255,255,0.2) transparent;
}
```

**Sin botones prev/next en versión estática.** Usuario hace scroll horizontal.

---

## 3. Estructura de Archivos Estáticos

```
portfolio/
├── app/
│   ├── page.tsx                 # SPA principal (Server Component)
│   ├── layout.tsx               # Root layout
│   └── sections/                # Componentes de sección (Server Components)
│       ├── HeroStatic.tsx
│       ├── ServicesStatic.tsx
│       ├── ProjectsStatic.tsx
│       ├── TestimonialsStatic.tsx
│       └── ContactStatic.tsx
├── components/
│   ├── navigation/
│   │   └── NavStatic.tsx        # Nav sin hooks
│   └── ui/
│       └── ButtonStatic.tsx     # Botón sin motion
├── styles/
│   ├── animations.css           # Keyframes personalizados
│   └── global.css
├── public/
│   ├── particles-bg.svg         # Background estático (opcional)
│   └── grid-pattern.svg
└── lib/
    └── scroll.js                # JavaScript mínimo (< 50 líneas total)
```

---

## 4. Plan de Implementación por Fases

### FASE 1: Preparación (1-2 horas)

**Crear rama y estructura:**
```bash
git checkout -b static-vanilla
mkdir -p app/sections-static
mkdir -p components/static
mkdir -p styles/animations
```

**Configurar Tailwind con animaciones custom:**
```js
// tailwind.config.js - Extender con más keyframes
module.exports = {
  theme: {
    extend: {
      keyframes: {
        'fade-in': { /* ... */ },
        'fade-up': { /* ... */ },
        'slide-in-left': { /* ... */ },
        'slide-in-right': { /* ... */ },
        'scale-in': { /* ... */ },
        'pulse-slow': {
          '0%, 100%': { opacity: '0.6' },
          '50%': { opacity: '0.3' }
        }
      },
      animation: {
        'fade-in': 'fade-in 0.6s ease-out forwards',
        'fade-up': 'fade-up 0.8s ease-out forwards',
        'slide-in-left': 'slide-in-left 0.6s ease-out forwards',
        'slide-in-right': 'slide-in-right 0.6s ease-out forwards',
        'scale-in': 'scale-in 0.5s ease-out forwards',
        'pulse-slow': 'pulse-slow 4s ease-in-out infinite'
      }
    }
  }
}
```

### FASE 2: Componentes Base (2-3 horas)

#### 2.1 Layout y Navigation
- [ ] Convertir `app/layout.tsx` a Server Component puro
- [ ] Crear `NavStatic.tsx` sin hooks
- [ ] Implementar menú móvil con checkbox hack
- [ ] Añadir BackToTop con CSS puro

#### 2.2 Background
- [ ] Crear grid pattern CSS como reemplazo de particles
- [ ] O crear SVG estático de particles
- [ ] Configurar gradientes animados de fondo

### FASE 3: Secciones Principales (3-4 horas)

#### 3.1 Hero Section
```tsx
// app/sections-static/HeroStatic.tsx
export default function HeroStatic() {
  return (
    <section id="hero" className="relative min-h-screen flex items-center justify-center">
      <div className="animate-fade-in [animation-delay:200ms]">
        <h1 className="animate-title">geroserial.com</h1>
      </div>
      
      {/* Líneas decorativas con animación CSS */}
      <div className="absolute top-0 w-full h-px animate-fade-left bg-gradient-to-r from-zinc-300/0 via-zinc-300/50 to-zinc-300/0" />
      <div className="absolute bottom-0 w-full h-px animate-fade-right bg-gradient-to-r from-zinc-300/0 via-zinc-300/50 to-zinc-300/0" />
      
      {/* Flecha con animación CSS pura */}
      <a href="#services" className="absolute bottom-10 animate-bounce-slow">
        <svg><!-- arrow down --></svg>
      </a>
    </section>
  );
}
```

#### 3.2 Services Section
```tsx
export default function ServicesStatic() {
  const services = [/* data */];
  
  return (
    <section id="services" className="py-20">
      <div className="container">
        <h2 className="animate-fade-up">Services</h2>
        
        <div className="grid md:grid-cols-2 gap-6">
          {services.map((service, i) => (
            <article 
              key={service.title}
              className="opacity-0 animate-fade-up"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              {/* Service card */}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
```

#### 3.3 Projects Section
```tsx
// Server Component con datos de Contentlayer
import { allProjects } from "contentlayer/generated";

export default function ProjectsStatic() {
  const projects = allProjects
    .filter(p => p.published)
    .slice(0, 6);
  
  return (
    <section id="projects" className="py-20">
      <div className="grid md:grid-cols-3 gap-6">
        {projects.map((project, i) => (
          <article 
            key={project.slug}
            className="opacity-0 animate-fade-in"
            style={{ animationDelay: `${i * 100}ms` }}
          >
            <h3>{project.title}</h3>
            <p>{project.description}</p>
            <div className="flex gap-3">
              {project.url && <a href={project.url}>View</a>}
              {project.repository && <a href={project.repository}>Code</a>}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
```

#### 3.4 Testimonials (Scroll Horizontal)
```tsx
export default function TestimonialsStatic() {
  const testimonials = [/* data */];
  
  return (
    <section id="testimonials" className="py-20">
      <div className="overflow-x-auto snap-x snap-mandatory">
        <div className="flex gap-6 pb-4">
          {testimonials.map(t => (
            <article 
              key={t.name}
              className="snap-center shrink-0 w-full md:w-1/2 lg:w-1/3
                         p-6 bg-white/5 border border-zinc-800 rounded-lg"
            >
              {/* Testimonial content */}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
```

#### 3.5 Contact Form
```tsx
export default function ContactStatic() {
  return (
    <section id="contact" className="py-20">
      <form 
        action="/api/contact" 
        method="POST"
        className="max-w-2xl mx-auto space-y-4"
      >
        <input 
          type="text" 
          name="name" 
          required
          placeholder="Your name"
          className="w-full px-4 py-3 bg-white/5 border border-zinc-800 rounded-lg
                     focus:border-white transition-colors"
        />
        
        <input 
          type="email" 
          name="email" 
          required
          placeholder="your@email.com"
        />
        
        <textarea 
          name="message" 
          required 
          rows={5}
          placeholder="Your message"
        />
        
        <button 
          type="submit"
          className="w-full px-6 py-3 bg-white text-black rounded-lg
                     hover:bg-zinc-100 transition-colors"
        >
          Send Message
        </button>
      </form>
    </section>
  );
}
```

### FASE 4: JavaScript Mínimo (30 min - 1 hora)

**Crear archivo único de JS vanilla:**
```js
// public/scripts/site.js (< 50 líneas)

// 1. Sticky nav con blur
const nav = document.querySelector('nav');
let lastScroll = 0;

window.addEventListener('scroll', () => {
  const scrolled = window.scrollY > 50;
  nav.classList.toggle('scrolled', scrolled);
}, { passive: true });

// 2. Back to top button
const backBtn = document.getElementById('back-to-top');
window.addEventListener('scroll', () => {
  backBtn.classList.toggle('show', window.scrollY > 300);
}, { passive: true });

// 3. (OPCIONAL) Animaciones al scroll
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.animate-on-scroll').forEach(el => {
  observer.observe(el);
});
```

**Cargar en layout:**
```tsx
// app/layout.tsx
export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <script src="/scripts/site.js" defer />
      </body>
    </html>
  );
}
```

### FASE 5: Optimizaciones CSS (1 hora)

**Crear archivo de animaciones:**
```css
/* styles/animations.css */

/* Delays utilitarios */
.delay-100 { animation-delay: 100ms; }
.delay-200 { animation-delay: 200ms; }
.delay-300 { animation-delay: 300ms; }
.delay-400 { animation-delay: 400ms; }
.delay-500 { animation-delay: 500ms; }

/* Bounce suave para flecha */
@keyframes bounce-slow {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(8px); }
}

.animate-bounce-slow {
  animation: bounce-slow 1.5s ease-in-out infinite;
}

/* Grid pattern background */
.bg-grid {
  background-image: 
    linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px);
  background-size: 80px 80px;
}

/* Gradient glow effect */
.glow-hover {
  position: relative;
}

.glow-hover::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent);
  opacity: 0;
  transition: opacity 0.3s;
  pointer-events: none;
  border-radius: inherit;
}

.glow-hover:hover::after {
  opacity: 1;
}
```

### FASE 6: Testing y Refinamiento (1-2 horas)

**Checklist de testing:**
- [ ] Todas las secciones visibles y con espaciado correcto
- [ ] Navegación funciona con smooth scroll
- [ ] Menú móvil abre/cierra correctamente
- [ ] Formulario envía datos
- [ ] Animaciones se ejecutan en orden
- [ ] No hay flashes de contenido sin estilo (FOUC)
- [ ] Colores grayscale consistentes
- [ ] Links funcionan correctamente
- [ ] Responsive en mobile/tablet/desktop
- [ ] Performance: Lighthouse > 95

---

## 5. Comparativa: Antes vs Después

### Métricas Esperadas

| Métrica | Antes (con hooks) | Después (estático) | Mejora |
|---------|-------------------|-------------------|--------|
| **Bundle JS** | ~250 KB | ~5 KB | -98% |
| **Tiempo de Carga** | ~2.5s | ~0.8s | -68% |
| **TTI** | ~3.2s | ~1.0s | -69% |
| **Hydration** | ~800ms | 0ms | -100% |
| **Dependencias** | 15+ | 2-3 | -80% |
| **Líneas de JS** | ~2000+ | ~50 | -97% |
| **Lighthouse** | 85-90 | 95-100 | +10% |

### Funcionalidades Mantenidas

✅ **Estética idéntica** - Mismo diseño visual grayscale  
✅ **Smooth scroll** - Nativo con CSS  
✅ **Animaciones** - CSS keyframes en lugar de motion  
✅ **Sticky nav** - CSS + JS mínimo  
✅ **Mobile menu** - Checkbox hack  
✅ **Responsive** - Tailwind breakpoints  
✅ **Formulario** - HTML5 form nativo  
✅ **Projects** - Server-rendered desde Contentlayer  

### Funcionalidades Simplificadas

⚠️ **Particles** → Grid pattern estático (más limpio, menos distracción)  
⚠️ **Carrusel testimonials** → Scroll horizontal nativo  
⚠️ **Animaciones al scroll** → Automáticas al cargar (o con 10 líneas de JS)  
⚠️ **Moving border button** → Border estático con hover glow  

---

## 6. Rollback y Compatibilidad

### Mantener Rama Original
```bash
# Rama actual (con hooks)
git checkout rebrand

# Nueva rama estática
git checkout static-vanilla
```

### Comparar Performance
```bash
# Build estático
pnpm build
npx lighthouse http://localhost:3000 --view

# Build con hooks (en rama rebrand)
git checkout rebrand
pnpm build
npx lighthouse http://localhost:3000 --view
```

### Estrategia de Deploy

**Opción A: A/B Testing**
- Deploy estático en subdomain: `static.geroserial.com`
- Medir métricas durante 1 semana
- Decidir cuál mantener

**Opción B: Progresivo**
- Empezar con versión estática
- Añadir features interactivas solo cuando sean necesarias
- Mantener bundle pequeño

---

## 7. Próximos Pasos (Post-Estático)

Una vez validada la versión estática, **añadir mejoras progresivas:**

1. **View Transitions API** (navegación suave entre secciones)
2. **Lazy-load images** con `loading="lazy"` nativo
3. **Prefetch links** con `<link rel="prefetch">`
4. **Service Worker** para offline support
5. **Web Vitals tracking** con analytics mínimo
6. **Dark/Light mode toggle** (opcional, actualmente solo dark)

---

## 8. Decisiones de Diseño

### Mantener Estética Grayscale

**Colores base:**
```css
:root {
  --bg-primary: #000000;
  --bg-secondary: #09090b; /* zinc-950 */
  --text-primary: #fafafa; /* zinc-50 */
  --text-secondary: #d4d4d8; /* zinc-300 */
  --text-muted: #71717a; /* zinc-500 */
  --border: #27272a; /* zinc-800 */
  --border-light: #3f3f46; /* zinc-700 */
  --white: #ffffff;
}
```

### Transiciones Estándar
```css
/* Aplicar en todos los elementos interactivos */
.transition-default {
  transition-property: color, background-color, border-color, opacity, transform;
  transition-duration: 200ms;
  transition-timing-function: ease-in-out;
}
```

---

## 9. Scripts de Utilidad

### Script de Conversión Automatizada (Opcional)

```js
// scripts/convert-to-static.js
// Script para remover imports de motion automáticamente

const fs = require('fs');
const path = require('path');

function removeMotionImports(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Remover imports de motion
  content = content.replace(/import.*from ["']motion.*["'];?\n/g, '');
  
  // Remover "use client" directives
  content = content.replace(/["']use client["'];?\n/g, '');
  
  // Remover motion. tags
  content = content.replace(/<motion\./g, '<div ');
  content = content.replace(/<\/motion\./g, '</div>');
  
  // Remover props de motion
  content = content.replace(/\s*(initial|animate|transition|whileHover)=\{[^}]+\}/g, '');
  
  fs.writeFileSync(filePath, content);
  console.log(`✅ Converted: ${filePath}`);
}

// Procesar todos los archivos tsx en app/sections
const sectionsDir = path.join(__dirname, '../app/sections');
fs.readdirSync(sectionsDir).forEach(file => {
  if (file.endsWith('.tsx')) {
    removeMotionImports(path.join(sectionsDir, file));
  }
});
```

---

## 10. Checklist Final

### Pre-Deploy
- [ ] Todas las animaciones CSS funcionan correctamente
- [ ] No hay errores en consola
- [ ] No hay warnings de hydration
- [ ] Todas las secciones tienen IDs correctos
- [ ] Links internos funcionan (#services, #contact, etc.)
- [ ] Formulario de contacto funciona
- [ ] Responsive en todos los breakpoints
- [ ] Fuentes cargan correctamente (Inter, Cal Sans)
- [ ] Favicon y meta tags configurados

### Performance
- [ ] Lighthouse Performance > 95
- [ ] Lighthouse Accessibility > 90
- [ ] Lighthouse Best Practices > 95
- [ ] Lighthouse SEO > 95
- [ ] Bundle JS < 10 KB
- [ ] First Contentful Paint < 1s
- [ ] Time to Interactive < 1.5s

### SEO
- [ ] Meta tags presentes
- [ ] OpenGraph configurado
- [ ] Sitemap generado
- [ ] robots.txt configurado
- [ ] Structured data para proyectos

---

## Conclusión

Esta conversión a estático permitirá:

1. **Base sólida:** Fundamento sin dependencias pesadas
2. **Performance óptimo:** Carga ultrarrápida y TTI mínimo
3. **Mantenibilidad:** Código simple y predecible
4. **Escalabilidad:** Añadir features de manera controlada

**La estética visual se mantiene 100% idéntica**, solo cambia la implementación técnica de animaciones y state management. El resultado es un sitio más rápido, ligero y fácil de mantener.

**Tiempo estimado total: 8-12 horas de desarrollo.**