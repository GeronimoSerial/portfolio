# Plan de Migración: Portfolio a SPA con Scroll Vertical y View Transitions

## 📋 Análisis de la Situación Actual

**Estado Actual:**

- Portfolio multi-página con Next.js 13 (App Router)
- Rutas separadas: `/`, `/perfil`, `/contacto`, proyectos en drawer
- Navegación tradicional con links entre páginas
- Animaciones básicas con Tailwind CSS
- Partículas y efectos visuales en cada página

**Objetivo:**

- Convertir a Single Page Application (SPA) con scroll vertical
- Implementar View Transitions API nativa
- Mantener SEO y accesibilidad
- Experiencia de usuario fluida y moderna

---

## 🎯 Plan de Acción Detallado

### **FASE 1: Preparación y Configuración**

#### 1.1 Actualizar Dependencias

- [ ] Actualizar Next.js a versión 14+
- [ ] Desinstalar framer-motion e instalar motion:
  ```bash
  pnpm remove framer-motion
  pnpm add motion react-scroll react-intersection-observer
  pnpm add -D @types/react-scroll
  ```
- [ ] Actualizar imports en archivos existentes que usen framer-motion

#### 1.2 Configurar Sistema de Scroll

- [ ] Crear hook personalizado `useScrollTo.ts` para navegación smooth
- [ ] Configurar scroll-behavior smooth en CSS global
- [ ] Implementar Intersection Observer para detectar sección activa

#### 1.3 Estructura de Carpetas

```
app/
  ├── page.tsx (SPA principal)
  ├── layout.tsx (mantener)
  ├── sections/
  │   ├── Hero.tsx
  │   ├── About.tsx
  │   ├── Skills.tsx
  │   ├── Experience.tsx
  │   ├── Projects.tsx
  │   ├── Testimonials.tsx
  │   ├── Services.tsx
  │   └── Contact.tsx
  ├── components/
  │   ├── navigation/
  │   │   ├── StickyNav.tsx
  │   │   └── MobileMenu.tsx
  │   ├── ui/ (mantener)
  │   └── shared/
  │       ├── ScrollProgress.tsx
  │       ├── SectionIndicator.tsx
  │       └── BackToTop.tsx
  └── hooks/
      ├── useScrollSpy.ts
      ├── useScrollTo.ts
      └── useSectionInView.ts
```

---

### **FASE 2: Conversión a Single Page Application**

#### 2.0 Consolidar Contenido en una Sola Página

- [ ] Migrar contenido de `/perfil` a sección About
- [ ] Migrar contenido de `/contacto` a sección Contact
- [ ] Integrar proyectos del drawer en sección Projects
- [ ] Eliminar rutas innecesarias (mantener solo `/`)
- [ ] Crear archivo único `app/page.tsx` con todas las secciones
- [ ] Configurar IDs para cada sección (`#hero`, `#about`, `#skills`, etc.)

---

### **FASE 3: Arquitectura de Secciones**

#### 3.1 Sección Hero (Principal)

**Contenido:**

```tsx
- Logo animado con efecto de aparición
- Nombre: "Geronimo Serial"
- Título: "Desarrollador Full Stack & Especialista en TI"
- Subtítulo: "Transformando ideas en soluciones tecnológicas innovadoras"
- CTA principal: "Ver Proyectos" | "Contactar"
- Particles de fondo (mantener)
- Indicador de scroll (animated arrow down)
```

**Animaciones:**

- Fade in secuencial de elementos
- Typing effect en el título
- Particles interactivas al hover
- Transición suave al hacer scroll

#### 3.2 Sección About (Sobre Mí)

**Contenido:**

```tsx
- Foto/Memoji profesional con hover effect
- Bio breve (2-3 párrafos)
- Localización: Corrientes, Argentina
- Años de experiencia: ~3 años
- Estadísticas visuales:
  * +15 Proyectos completados
  * +5 Clientes satisfechos
  * 3+ Años de experiencia
  * 100% Compromiso
- Enlaces a redes sociales
```

**Diseño:**

- Layout en dos columnas (desktop)
- Imagen con border gradient animado
- Cards de estadísticas con counter animation
- Background con blur gradient

#### 3.3 Sección Skills (Habilidades)

**Contenido:**

```tsx
Categorías:
1. Frontend Development
   - React/Next.js (90%)
   - TypeScript (85%)
   - Tailwind CSS (95%)
   - Angular (75%)

2. Backend Development
   - C#/.NET (85%)
   - Node.js (80%)
   - MySQL (80%)
   - API REST (90%)

3. DevOps & Cloud
   - AWS (70%)
   - Azure (65%)
   - Git/GitHub (90%)
   - Docker (60%)

4. Soft Skills
   - Resolución de problemas
   - Trabajo en equipo
   - Comunicación efectiva
   - Gestión de proyectos
```

**Diseño:**

- Grid de categorías con tabs (fondo zinc-800, activo: white text on zinc-900)
- Barras de progreso animadas: fondo zinc-700, relleno zinc-100 a white gradient
- Iconos de tecnologías en zinc-400, hover: white con glow
- Tooltip con años de experiencia (bg-zinc-800 border-zinc-700)

#### 3.4 Sección Experience (Experiencia)

**Contenido:**

```tsx
Timeline vertical con:

1. Help Desk - CGE Corrientes (2022 - Presente)
   - Soporte técnico nivel 1 y 2
   - Gestión de proyectos audiovisuales RRSS
   - Mantenimiento de infraestructura IT
   - Capacitación a usuarios finales

2. Freelance Developer (2020 - Presente)
   - Desarrollo de aplicaciones web personalizadas
   - Consultoría tecnológica
   - Diseño e implementación de APIs
   - Optimización de rendimiento web

3. Talentos Digitales - FullStack (2022)
   - Formación intensiva en desarrollo web
   - Proyectos colaborativos
   - Metodologías ágiles (Scrum)
```

**Diseño:**

- Timeline interactiva con línea animada
- Cards que se expanden al hover
- Iconos de empresas/instituciones
- Badges de tecnologías usadas

#### 3.5 Sección Projects (Proyectos)

**Contenido:**

```tsx
Grid de proyectos destacados (integrar los .mdx existentes):

Proyectos Ficticios Adicionales:

1. EchoCommerce - Plataforma E-commerce
   - Stack: Next.js, Stripe, PostgreSQL
   - Características: Carrito, pagos, admin dashboard
   - Resultado: +500 transacciones/mes

2. TaskFlow Pro - Gestor de Tareas
   - Stack: React, Node.js, MongoDB
   - Características: Kanban, tiempo real, equipos
   - Usuarios: 150+ activos

3. HealthTrack - App de Salud
   - Stack: React Native, Firebase
   - Características: Seguimiento, notificaciones
   - Descargas: 1000+ en tiendas

4. AnalyticsDash - Dashboard Analítico
   - Stack: Next.js, D3.js, Redis
   - Características: Visualización en tiempo real
   - Métricas: 50k+ datos/día
```

**Diseño:**

- Grid masonry responsivo
- Cards con imagen, título, descripción breve
- Hover: overlay con tech stack y CTA
- Modal o página expandida para detalles
- Filtros por tecnología

#### 3.6 Sección Testimonials (Testimonios)

**Contenido:**

```tsx
Testimonios ficticios:

1. María González - CEO de TechStartup
   "Geronimo transformó nuestra visión en una plataforma funcional
   y escalable. Su profesionalismo y expertise técnico son excepcionales."
   ⭐⭐⭐⭐⭐

2. Carlos Ramírez - Product Manager
   "Trabajar con Geronimo fue una experiencia increíble. Siempre
   disponible, propositivo y con soluciones innovadoras."
   ⭐⭐⭐⭐⭐

3. Ana Martínez - Directora de Marketing
   "La calidad del trabajo y atención al detalle superó nuestras
   expectativas. Altamente recomendado."
   ⭐⭐⭐⭐⭐
```

**Diseño:**

- Carousel automático (usar embla-carousel)
- Cards con foto, nombre, cargo, empresa
- Estrellas de rating animadas
- Fade in/out transitions

#### 3.7 Sección Services (Servicios)

**Contenido:**

```tsx
1. Desarrollo Web Full Stack
   - Aplicaciones web escalables
   - APIs RESTful robustas
   - Integración de servicios
   Desde: $800 USD

2. Consultoría Tecnológica
   - Auditoría de código
   - Optimización de rendimiento
   - Arquitectura de software
   Desde: $500 USD

3. Soporte Técnico IT
   - Mantenimiento preventivo
   - Resolución de incidencias
   - Capacitación técnica
   Desde: $400 USD/mes

4. Transformación Digital
   - Estrategia digital
   - Migración a la nube
   - Automatización de procesos
   Consultar precio
```

**Diseño:**

- Grid de 4 cards (2x2) con bg-white/5, border-zinc-800
- Icono representativo en zinc-400
- Lista de características en zinc-300
- CTA "Solicitar cotización" (bg-white text-black hover:bg-zinc-100)
- Hover effect: elevación + border-white + subtle glow

#### 3.8 Sección Contact (Contacto)

**Contenido:**

```tsx
Formulario:
- Nombre completo (required)
- Email (required, validación)
- Asunto (select: Proyecto/Consulta/Soporte)
- Mensaje (textarea, required)
- Botón: "Enviar Mensaje"

Información de contacto:
- Email: contacto@geroserial.com
- Teléfono: +54 9 3794 XXXXXX
- LinkedIn: linkedin.com/in/geroserial
- GitHub: github.com/geroserial
- Ubicación: Corrientes, Argentina

Mapa interactivo (opcional):
- Ubicación aproximada
```

**Diseño:**

- Layout 50/50 (formulario | info)
- Validación en tiempo real
- Mensajes de éxito/error
- Integración con CarouselComponent existente
- Links a redes sociales con iconos

---

### **FASE 4: Componentes de Navegación y UX**

#### 4.1 Sticky Navigation Bar

**Características:**

- Fixed en la parte superior
- Transparente en hero, sólido después del scroll
- Links a secciones con smooth scroll
- Indicador activo de sección actual
- Hamburger menu para móvil
- Logo que vuelve a hero

**Elementos:**

```tsx
[Logo] | Hero | Sobre Mí | Skills | Experiencia | Proyectos | Testimonios | Servicios | Contacto | [GitHub Icon]
```

#### 4.2 Scroll Progress Bar

- Barra horizontal en top (debajo del nav)
- Muestra % de scroll de la página
- Color gradient (zinc-700 to white)
- Animación fluida con ease-out

#### 4.3 Section Indicators (Opcional)

- Dots verticales en lateral derecho
- Indica sección actual
- Click para navegar
- Hover muestra nombre de sección

#### 4.4 Back to Top Button

- Aparece después de scroll de 300px
- Fixed en esquina inferior derecha
- Smooth scroll al hero
- Animación de fade in/out

---

### **FASE 5: Animaciones con Motion**

#### 5.1 Configurar Motion (React)

- [ ] Instalar y configurar `motion` (sucesor de framer-motion)
- [ ] Crear variantes de animación reutilizables
- [ ] Implementar scroll-triggered animations

#### 5.2 Animaciones de Entrada

```tsx
Usando motion:
- Fade in cuando elementos entran en viewport
- Slide from bottom/left/right
- Scale in para cards
- Stagger animations en listas
```

#### 5.3 Micro-interacciones

- Hover effects en botones y links con motion.button
- Loading states animados
- Form field focus animations
- Counter animations para números
- Progress bars que se llenan

#### 5.4 Ejemplo de Uso

```tsx
import { motion } from "motion/react";

<motion.div
  initial={{ opacity: 0, y: 20 }}
  whileInView={{ opacity: 1, y: 0 }}
  viewport={{ once: true }}
  transition={{ duration: 0.5 }}
>
  {/* Contenido */}
</motion.div>;
```

---

### **FASE 6: Optimización y Performance**

#### 6.1 Lazy Loading

- [ ] Imágenes con next/image
- [ ] Lazy load de secciones no visibles
- [ ] Dynamic imports para componentes pesados
- [ ] Intersection Observer para cargas progresivas

#### 6.2 SEO y Accesibilidad

- [ ] Meta tags por sección (JSON-LD)
- [ ] Semantic HTML5
- [ ] ARIA labels
- [ ] Alt texts descriptivos
- [ ] Focus management
- [ ] Keyboard navigation

#### 6.3 Performance

- [ ] Code splitting
- [ ] Image optimization
- [ ] Minificación CSS/JS
- [ ] Preload critical resources
- [ ] Caché strategy
- [ ] Lighthouse score >90

---

### **FASE 7: Responsive Design**

#### 7.1 Breakpoints

```css
- Mobile: 320px - 768px (single column)
- Tablet: 769px - 1024px (adapt layouts)
- Desktop: 1025px+ (full layout)
```

#### 7.2 Adaptaciones Mobile

- [ ] Hamburger menu con slide-in
- [ ] Stack de columns en single column
- [ ] Touch-friendly buttons (min 44px)
- [ ] Reducir padding/margins
- [ ] Hide/show elements estratégicamente
- [ ] Gestures (swipe, pinch)

---

### **FASE 8: Testing y Deploy**

#### 8.1 Testing

- [ ] Cross-browser testing (Chrome, Firefox, Safari, Edge)
- [ ] Responsive testing en múltiples dispositivos
- [ ] Performance testing (Lighthouse)
- [ ] Accessibility testing (WAVE, axe)
- [ ] SEO audit
- [ ] Form validation testing

#### 8.2 Deploy

- [ ] Build optimizado
- [ ] Environment variables
- [ ] Deploy en Vercel
- [ ] Configurar dominio geroserial.com
- [ ] SSL certificate
- [ ] Analytics setup (Google Analytics / Vercel Analytics)

---

## 📦 Librerías y Dependencias Nuevas

```json
{
  "dependencies": {
    "motion": "^10.18.0", // Animaciones (sucesor de framer-motion)
    "react-scroll": "^1.9.0", // Smooth scroll
    "react-intersection-observer": "^9.5.3", // Lazy loading
    "react-hook-form": "^7.48.0", // Form management
    "zod": "^3.22.4", // Validation
    "react-hot-toast": "^2.4.1", // Notifications
    "sharp": "^0.33.0" // Image optimization
  }
}
```

**IMPORTANTE:** Desinstalar `framer-motion` antes de instalar `motion`:

```bash
pnpm remove framer-motion
pnpm add motion
```

---

## 🎨 Paleta de Colores y Diseño

### Colores Principales (Grayscale)

```css
--primary: #f4f4f5 (zinc-100)
--primary-dark: #e4e4e7 (zinc-200)
--secondary: #a1a1aa (zinc-400)
--accent: #71717a (zinc-500)
--background: #0a0a0a (almost black)
--surface: rgba(255, 255, 255, 0.05)
--surface-hover: rgba(255, 255, 255, 0.1)
--text-primary: #fafafa (zinc-50)
--text-secondary: #d4d4d8 (zinc-300)
--text-muted: #71717a (zinc-500)
--border: #27272a (zinc-800)
--border-light: #3f3f46 (zinc-700)
```

### Highlights y Acentos

```css
--highlight: #ffffff (white) - Para elementos importantes
--highlight-subtle: #fafafa (zinc-50) - Hover states
--shadow-light: rgba(255, 255, 255, 0.1) - Glow effects
--shadow-dark: rgba(0, 0, 0, 0.5) - Profundidad
```

### Tipografía

- **Headings**: Cal Sans (actual)
- **Body**: Inter (actual)
- **Code**: Fira Code (nuevo)

### Espaciado

- Section padding: 100px vertical (desktop), 60px (mobile)
- Container max-width: 1280px
- Grid gap: 32px (desktop), 16px (mobile)

---

## ⚡ Animaciones y Efectos

### Durations

- **Rápido**: 150ms (hover, click)
- **Normal**: 300ms (transiciones estándar)
- **Lento**: 600ms (page transitions)

### Easing

```css
--ease-in-out-cubic: cubic-bezier(0.645, 0.045, 0.355, 1)
--ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1)
```

### Effects

- Particles (mantener del Hero)
- Gradient borders animados
- Blur backgrounds
- Glow effects en hover
- Parallax suave en backgrounds

---

## 🔄 Roadmap de Implementación

### Sprint 1 (Semana 1) - PRIORIDAD ALTA

- [ ] Migrar de framer-motion a motion
- [ ] Consolidar todo en single page (`app/page.tsx`)
- [ ] Crear estructura de 8 secciones básicas
- [ ] Implementar Hero y About

### Sprint 2 (Semana 2) - PRIORIDAD ALTA

- [ ] Skills y Experience
- [ ] Navegación sticky con scroll spy
- [ ] Scroll progress bar
- [ ] Smooth scroll entre secciones

### Sprint 3 (Semana 3) - PRIORIDAD MEDIA

- [ ] Projects y Testimonials
- [ ] Services y Contact
- [ ] Animaciones con motion (scroll-triggered)

### Sprint 4 (Semana 4) - PRIORIDAD MEDIA

- [ ] Optimización y performance
- [ ] Responsive design completo
- [ ] Testing y deploy

### Sprint Bonus (Futuro) - BAJA PRIORIDAD

- [ ] Implementar View Transitions API nativa
- [ ] Transiciones avanzadas entre navegación
- [ ] Efectos visuales adicionales

---

## 📊 Métricas de Éxito

- [ ] Lighthouse Performance: >90
- [ ] Time to Interactive: <3s
- [ ] First Contentful Paint: <1.5s
- [ ] Cumulative Layout Shift: <0.1
- [ ] Accessibility Score: 100
- [ ] SEO Score: 100
- [ ] Mobile Responsive: 100%
- [ ] Cross-browser compatible: 95%+

---

## 🚀 Mejoras Futuras (Post-Launch)

### Prioridad Alta (Siguiente Versión)

1. **View Transitions API** - Transiciones nativas entre navegación
2. **Modo oscuro/claro** toggle
3. **Blog integrado** con MDX

### Prioridad Media

4. **Internacionalización** (ES/EN)
5. **Panel de administración** para contenido
6. **Newsletter** subscription
7. **Case studies** detallados de proyectos

### Prioridad Baja

8. **Animaciones 3D** con Three.js
9. **Chat en vivo** para consultas

---

## 🎨 Cambios de Diseño Visual

### Migración de Paleta de Colores

**De:** Púrpura/Violeta/Magenta/Indigo  
**A:** Grayscale (Escala de grises con blancos y negros)

#### Reemplazos Específicos:

```css
/* Antes */
from-indigo-900 via-indigo-400/10  →  /* Después */ from-zinc-900 via-zinc-400/10
bg-indigo-600                       →  bg-zinc-100 text-black
text-indigo-300                     →  text-zinc-300
text-indigo-400 hover:text-indigo-300  →  text-zinc-400 hover:text-zinc-100
border-zinc-800                     →  border-zinc-700
```

#### Gradientes Actualizados:

```css
/* Hero Background */
bg-gradient-to-tl from-zinc-950 via-zinc-900 to-black

/* Cards y Surfaces */
bg-white/5 backdrop-blur-lg  →  bg-white/3 backdrop-blur-xl

/* Borders Animados */
border-gradient: linear-gradient(90deg,
  transparent,
  rgba(255, 255, 255, 0.3),
  transparent
)

/* Text Gradients */
bg-gradient-to-r from-white via-zinc-100 to-zinc-300
```

#### Efectos y Animaciones:

- **Glow effects:** Usar `box-shadow: 0 0 20px rgba(255, 255, 255, 0.1)`
- **Hover states:** Transición de `zinc-500` a `white`
- **Particles:** Color blanco con opacidad variable
- **Progress bars:** Gradiente de `zinc-700` a `white`

#### Archivos a Modificar:

1. `global.css` - Variables CSS principales
2. `tailwind.config.js` - Extender paleta grayscale
3. `app/page.tsx` - Cambiar clases de Hero
4. `app/components/nav.tsx` - Actualizar colores
5. `app/perfil/about-content.tsx` - Reemplazar indigo por zinc
6. Todas las secciones nuevas usar grayscale desde el inicio

---

## 📝 Notas Importantes

### Prioridades del Proyecto

1. **CRÍTICO:** Convertir a Single Page Application primero
2. **CRÍTICO:** Migrar de framer-motion a motion
3. **ALTO:** Cambiar paleta de colores a grayscale
4. **MEDIO:** Implementar animaciones con motion
5. **BONUS:** View Transitions API (post-launch)

### Lineamientos

- Cambiar de gradientes indigo/violeta a grayscale (negro, grises, blanco)
- Mantener particles pero en blanco/gris
- Priorizar performance sobre efectos excesivos
- Todo el contenido en una sola página con scroll vertical
- Navegación por anclas (#hero, #about, #skills, etc.)
- Asegurar accesibilidad en todas las decisiones
- Usar TypeScript para type safety
- Comentar código complejo
- Documentar componentes reutilizables
- Git commits descriptivos y atómicos

---

## ✅ Checklist Final Pre-Launch

- [ ] Todos los links funcionan correctamente
- [ ] Formulario de contacto envía emails
- [ ] Imágenes optimizadas y cargando correctamente
- [ ] Animaciones fluidas en todos los navegadores
- [ ] Sin errores en consola
- [ ] Meta tags y OG images configurados
- [ ] Sitemap.xml generado
- [ ] Robots.txt configurado
- [ ] Analytics funcionando
- [ ] 404 page personalizada
- [ ] Favicon y app icons
- [ ] SSL certificate activo
- [ ] Backup configurado

---

**Fecha de inicio prevista:** Inmediatamente después de aprobación
**Fecha de finalización estimada:** 4 semanas
**Responsable:** Geronimo Serial

---

_Este documento es un plan vivo y puede actualizarse según necesidades del proyecto._
