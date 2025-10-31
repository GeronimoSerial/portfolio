# Plan de Conversión a Mockup Estático Puro

## Objetivo

Convertir el sitio actual a una versión **100% estática sin interactividad** que sirva como mockup visual. Solo HTML+CSS (Tailwind) manteniendo la estética grayscale idéntica.

**Sin JavaScript. Sin animaciones. Sin smooth scroll. Sin formularios. Sin carruseles.**

Versión de exhibición visual lista para luego añadir funcionalidades de manera optimizada.

---

## 1. Análisis del Estado Actual

### 1.1 Dependencias a Eliminar

**TODO:**
- ❌ `motion` (framer-motion) - Remover completamente
- ❌ `@tsparticles/*` - Canvas particles
- ❌ `react-intersection-observer`
- ❌ `react-scroll`
- ❌ `ScrollContext` y todos los custom hooks
- ❌ `@radix-ui/react-dialog`
- ❌ `embla-carousel-*`
- ❌ Componentes UI animados (`moving-border.tsx`, etc.)

**Mantener:**
- ✅ Next.js (solo para SSG - Static Site Generation)
- ✅ Tailwind CSS
- ✅ Contentlayer (para proyectos MDX)
- ✅ Lucide React (íconos - o reemplazar por SVG)
- ✅ TypeScript

### 1.2 Simplificaciones

| Componente | Estado Actual | Versión Estática |
|------------|---------------|------------------|
| `StickyNav` | Hooks, blur al scroll, menu móvil | Nav simple fijo sin interacciones |
| `BackToTop` | Aparece con scroll | **Eliminar completamente** |
| `Hero` | Animaciones motion fade-in | Contenido estático sin animaciones |
| `Services` | Animaciones al scroll | Grid estático |
| `Projects` | Animaciones + links dinámicos | Grid estático con datos de Contentlayer |
| `Contact` | Formulario con estado | Solo info de contacto (email, links) |
| `Testimonials` | Carrusel con botones | Grid estático de 3 columnas |
| `ParticlesOptimized` | Canvas animado | Grid pattern CSS estático |
| `Moving Border Button` | Animación SVG compleja | Botón simple con border estático |

---

## 2. Estructura Simplificada

```
portfolio/
├── app/
│   ├── page.tsx                 # SPA con todas las secciones
│   ├── layout.tsx               # Layout básico
│   └── static-sections/         # Secciones sin lógica
│       ├── HeroStatic.tsx
│       ├── ServicesStatic.tsx
│       ├── ProjectsStatic.tsx
│       ├── TestimonialsStatic.tsx
│       └── ContactStatic.tsx
├── components/
│   └── NavStatic.tsx            # Nav sin menú móvil
├── styles/
│   └── global.css               # Solo estilos base
└── public/
    └── (assets estáticos)
```

---

## 3. Implementación por Componente

### 3.1 Layout Base

```tsx
// app/layout.tsx
import { GeistSans } from 'geist/font/sans';
import { GeistMono } from 'geist/font/mono';
import './globals.css';

export const metadata = {
  title: 'geroserial.com',
  description: 'IT Specialist · Infrastructure, Automation & Web Systems Management',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body className="bg-black text-zinc-50 antialiased">
        {children}
      </body>
    </html>
  );
}
```

### 3.2 Navigation (Sin Menú Móvil)

```tsx
// components/NavStatic.tsx
import Link from 'next/link';
import { Github } from 'lucide-react';

export default function NavStatic() {
  const navItems = [
    { id: 'hero', label: 'Home' },
    { id: 'services', label: 'Services' },
    { id: 'projects', label: 'Projects' },
    { id: 'testimonials', label: 'Testimonials' },
    { id: 'contact', label: 'Contact' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-zinc-900/95 backdrop-blur-lg border-b border-zinc-800">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <span className="text-xl font-display text-zinc-50">
            geroserial
          </span>

          {/* Desktop Navigation - Sin responsive, siempre visible */}
          <div className="flex items-center gap-1">
            {navItems.slice(1).map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className="px-4 py-2 text-sm font-medium text-zinc-400 hover:text-zinc-100 hover:bg-white/5 rounded-lg transition-colors"
              >
                {item.label}
              </a>
            ))}
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/GeronimoSerial"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-400 hover:text-zinc-100 transition-colors"
              aria-label="GitHub"
            >
              <Github className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}
```

### 3.3 Background Estático

```tsx
// components/BackgroundStatic.tsx
export default function BackgroundStatic() {
  return (
    <div className="fixed inset-0 -z-50 bg-black">
      {/* Grid pattern estático */}
      <div 
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px'
        }}
      />
      
      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-zinc-900/50 via-black to-black" />
    </div>
  );
}
```

### 3.4 Hero Section (Sin Animaciones)

```tsx
// app/static-sections/HeroStatic.tsx
import { MapPin } from 'lucide-react';

export default function HeroStatic() {
  return (
    <section id="hero" className="relative flex flex-col items-center justify-center w-full min-h-screen px-4">
      <div className="z-10 flex flex-col items-center text-center">
        {/* Título principal */}
        <div className="mb-6">
          <h1 className="text-6xl md:text-9xl font-display text-white">
            geroserial.com
          </h1>
        </div>

        {/* Subtítulo */}
        <h2 className="text-sm md:text-lg text-zinc-300 max-w-3xl">
          IT Specialist · Infrastructure, Automation & Web Systems Management
        </h2>

        <p className="mt-4 text-sm md:text-base text-zinc-500 max-w-xl leading-relaxed">
          Methodical Approach. Real-World Solutions.
        </p>

        {/* Trust Indicators */}
        <div className="flex flex-wrap items-center justify-center gap-3 mt-6 text-xs md:text-sm text-zinc-600">
          <span>+15 Projects Delivered</span>
          <span className="text-zinc-800">•</span>
          <span>+5 Satisfied Clients</span>
          <span className="text-zinc-800">•</span>
          <span>2+ Years Experience</span>
        </div>

        {/* Location */}
        <div className="flex items-center gap-2 mt-3 text-xs md:text-sm text-zinc-600">
          <MapPin className="w-3 h-3 md:w-4 md:h-4" />
          <span>Corrientes, Argentina</span>
          <span className="text-zinc-800">|</span>
          <span>Remote Services Available</span>
        </div>

        {/* Botones simples */}
        <div className="flex gap-4 mt-10">
          <a 
            href="#services"
            className="px-6 py-3 text-sm font-medium text-zinc-300 bg-white/10 border border-zinc-700 rounded-lg hover:bg-white/20 hover:border-zinc-500 transition-colors"
          >
            View Services
          </a>
          <a 
            href="#contact"
            className="px-6 py-3 text-sm font-medium text-black bg-white rounded-lg hover:bg-zinc-100 transition-colors"
          >
            Get in Touch
          </a>
        </div>
      </div>

      {/* Líneas decorativas estáticas */}
      <div className="absolute top-0 w-screen h-px bg-gradient-to-r from-zinc-300/0 via-zinc-300/50 to-zinc-300/0" />
      <div className="absolute bottom-0 w-screen h-px bg-gradient-to-r from-zinc-300/0 via-zinc-300/50 to-zinc-300/0" />
    </section>
  );
}
```

### 3.5 Services Section (Grid Estático)

```tsx
// app/static-sections/ServicesStatic.tsx
import { Code, Lightbulb, Wrench, TrendingUp } from 'lucide-react';

export default function ServicesStatic() {
  const services = [
    {
      icon: Code,
      title: 'Full Stack Web Development',
      description: 'Scalable web applications built with modern technologies',
      features: [
        'Responsive web applications',
        'Robust RESTful APIs',
        'Third-party integrations',
        'Performance optimization',
      ],
      price: 'From $800 USD',
    },
    {
      icon: Lightbulb,
      title: 'Technology Consulting',
      description: 'Expert technical guidance for complex challenges',
      features: [
        'Code audits & reviews',
        'Software architecture design',
        'System optimization',
        'Best practices implementation',
      ],
      price: 'From $500 USD',
    },
    {
      icon: Wrench,
      title: 'IT Technical Support',
      description: 'Ongoing maintenance and incident resolution',
      features: [
        'Preventive maintenance',
        'Incident resolution',
        'System monitoring',
        'Technical training',
      ],
      price: 'From $400 USD/month',
    },
    {
      icon: TrendingUp,
      title: 'Digital Transformation',
      description: 'Modernize business processes and infrastructure',
      features: [
        'Digital strategy planning',
        'Cloud migration',
        'Process automation',
        'Data analytics implementation',
      ],
      price: 'Custom Quote',
    },
  ];

  return (
    <section id="services" className="relative min-h-screen py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-display text-zinc-50 mb-4">
            Services
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-transparent via-zinc-300 to-transparent mx-auto mb-4" />
          <p className="text-zinc-400 max-w-2xl mx-auto">
            Scalable IT solutions designed to grow with your business
          </p>
        </div>

        {/* Grid de servicios */}
        <div className="grid md:grid-cols-2 gap-6">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <article
                key={service.title}
                className="group p-6 bg-white/5 border border-zinc-800 rounded-lg hover:border-white transition-colors"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-lg">
                    <Icon className="w-6 h-6 text-zinc-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl text-zinc-50 mb-2">
                      {service.title}
                    </h3>
                    <p className="text-sm text-zinc-400 mb-4">
                      {service.description}
                    </p>
                  </div>
                </div>

                <ul className="space-y-2 mb-6">
                  {service.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex items-center gap-2 text-sm text-zinc-300"
                    >
                      <svg className="w-4 h-4 text-zinc-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>

                <div className="flex items-center justify-between pt-4 border-t border-zinc-800">
                  <span className="text-lg font-display text-zinc-100">
                    {service.price}
                  </span>
                  <span className="px-4 py-2 text-sm font-medium text-black bg-white rounded-lg">
                    Request Quote
                  </span>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
```

### 3.6 Projects Section (Contentlayer Estático)

```tsx
// app/static-sections/ProjectsStatic.tsx
import { allProjects } from 'contentlayer/generated';
import { ExternalLink, Github } from 'lucide-react';

export default function ProjectsStatic() {
  const projects = allProjects
    .filter((project) => project.published)
    .sort((a, b) => 
      new Date(b.date ?? Number.POSITIVE_INFINITY).getTime() -
      new Date(a.date ?? Number.POSITIVE_INFINITY).getTime()
    )
    .slice(0, 6);

  return (
    <section id="projects" className="relative min-h-screen py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-display text-zinc-50 mb-4">
            Featured Projects
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-transparent via-zinc-300 to-transparent mx-auto mb-4" />
          <p className="text-zinc-400 max-w-2xl mx-auto">
            A selection of projects showcasing web applications and development tools
          </p>
        </div>

        {/* Grid de proyectos */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <article
              key={project.slug}
              className="group p-6 bg-white/5 border border-zinc-800 rounded-lg hover:border-zinc-700 transition-colors"
            >
              <div className="flex flex-col h-full">
                <h3 className="text-xl text-zinc-50 mb-3">
                  {project.title}
                </h3>

                <p className="text-sm text-zinc-400 mb-4 flex-grow line-clamp-3">
                  {project.description}
                </p>

                <div className="flex items-center gap-3 mt-auto pt-4 border-t border-zinc-800">
                  {project.url && (
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-zinc-400 hover:text-zinc-100 transition-colors"
                      title="View project"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                  {project.repository && (
                    <a
                      href={project.repository}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-zinc-400 hover:text-zinc-100 transition-colors"
                      title="View code"
                    >
                      <Github className="w-4 h-4" />
                    </a>
                  )}
                  {project.date && (
                    <span className="ml-auto text-xs text-zinc-600">
                      {new Date(project.date).getFullYear()}
                    </span>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
```

### 3.7 Testimonials (Grid Estático, Sin Carrusel)

```tsx
// app/static-sections/TestimonialsStatic.tsx
import { Star } from 'lucide-react';

export default function TestimonialsStatic() {
  const testimonials = [
    {
      name: 'Juan Pérez',
      role: 'CEO, Tech Solutions',
      content: 'Excellent work on our company website. Professional, timely, and exceeded expectations.',
      rating: 5,
      image: null,
    },
    {
      name: 'María González',
      role: 'Product Manager, StartupXYZ',
      content: 'The automation tools developed have saved us countless hours. Highly recommended.',
      rating: 5,
      image: null,
    },
    {
      name: 'Carlos Rodríguez',
      role: 'CTO, Innovation Labs',
      content: 'Outstanding technical expertise and problem-solving skills. A pleasure to work with.',
      rating: 5,
      image: null,
    },
  ];

  return (
    <section id="testimonials" className="relative min-h-screen py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-display text-zinc-50 mb-4">
            What Clients Say
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-transparent via-zinc-300 to-transparent mx-auto mb-4" />
          <p className="text-zinc-400 max-w-2xl mx-auto">
            Testimonials from satisfied clients
          </p>
        </div>

        {/* Grid de testimonials */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <article
              key={testimonial.name}
              className="p-6 bg-white/5 border border-zinc-800 rounded-lg"
            >
              {/* Estrellas */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-zinc-400 text-zinc-400" />
                ))}
              </div>

              {/* Content */}
              <p className="text-zinc-300 mb-6 leading-relaxed">
                "{testimonial.content}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-3 pt-4 border-t border-zinc-800">
                <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center">
                  <span className="text-sm font-medium text-zinc-400">
                    {testimonial.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-zinc-100">
                    {testimonial.name}
                  </p>
                  <p className="text-xs text-zinc-500">
                    {testimonial.role}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
```

### 3.8 Contact (Solo Info, Sin Formulario)

```tsx
// app/static-sections/ContactStatic.tsx
import { Mail, MapPin, Github, Linkedin } from 'lucide-react';

export default function ContactStatic() {
  const contactInfo = [
    {
      icon: Mail,
      label: 'Email',
      value: 'contact@geroserial.com',
      href: 'mailto:contact@geroserial.com',
    },
    {
      icon: MapPin,
      label: 'Location',
      value: 'Corrientes, Argentina',
      href: null,
    },
    {
      icon: Github,
      label: 'GitHub',
      value: '@GeronimoSerial',
      href: 'https://github.com/GeronimoSerial',
    },
    {
      icon: Linkedin,
      label: 'LinkedIn',
      value: 'Geronimo Serial',
      href: 'https://linkedin.com/in/geronimoserial',
    },
  ];

  return (
    <section id="contact" className="relative min-h-screen py-20 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-display text-zinc-50 mb-4">
            Get in Touch
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-transparent via-zinc-300 to-transparent mx-auto mb-4" />
          <p className="text-zinc-400 max-w-2xl mx-auto">
            Let's discuss your next project
          </p>
        </div>

        {/* Contact Info Grid */}
        <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
          {contactInfo.map((info) => {
            const Icon = info.icon;
            const content = (
              <div className="p-6 bg-white/5 border border-zinc-800 rounded-lg hover:border-zinc-700 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-lg">
                    <Icon className="w-5 h-5 text-zinc-400" />
                  </div>
                  <div>
                    <p className="text-xs text-zinc-500 mb-1">{info.label}</p>
                    <p className="text-sm text-zinc-100">{info.value}</p>
                  </div>
                </div>
              </div>
            );

            return info.href ? (
              <a key={info.label} href={info.href} target="_blank" rel="noopener noreferrer">
                {content}
              </a>
            ) : (
              <div key={info.label}>{content}</div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <p className="text-zinc-500 mb-4">
            Available for freelance projects and consulting opportunities
          </p>
          <a
            href="mailto:contact@geroserial.com"
            className="inline-block px-6 py-3 text-sm font-medium text-black bg-white rounded-lg hover:bg-zinc-100 transition-colors"
          >
            Send Email
          </a>
        </div>
      </div>
    </section>
  );
}
```

### 3.9 Page Principal

```tsx
// app/page.tsx
import NavStatic from '@/components/NavStatic';
import BackgroundStatic from '@/components/BackgroundStatic';
import HeroStatic from './static-sections/HeroStatic';
import ServicesStatic from './static-sections/ServicesStatic';
import ProjectsStatic from './static-sections/ProjectsStatic';
import TestimonialsStatic from './static-sections/TestimonialsStatic';
import ContactStatic from './static-sections/ContactStatic';

export default function Home() {
  return (
    <>
      <BackgroundStatic />
      <NavStatic />
      
      <main>
        <HeroStatic />
        <ServicesStatic />
        <ProjectsStatic />
        <TestimonialsStatic />
        <ContactStatic />
      </main>

      {/* Footer simple */}
      <footer className="border-t border-zinc-800 py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-zinc-500">
            © {new Date().getFullYear()} geroserial.com. All rights reserved.
          </p>
        </div>
      </footer>
    </>
  );
}
```

---

## 4. Estilos Globales

```css
/* styles/global.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

/* Variables de color */
:root {
  --bg-primary: #000000;
  --bg-secondary: #09090b;
  --text-primary: #fafafa;
  --text-secondary: #d4d4d8;
  --text-muted: #71717a;
  --border: #27272a;
  --border-light: #3f3f46;
}

/* Reset básico */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  @apply bg-black text-zinc-50 antialiased;
  font-family: var(--font-sans);
}

/* Line clamp utility */
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Transiciones estándar */
a, button {
  @apply transition-colors duration-200;
}
```

---

## 5. Checklist de Implementación

### Fase 1: Limpieza (30 min)
- [ ] Eliminar `context/ScrollContext.tsx`
- [ ] Eliminar carpeta `hooks/`
- [ ] Eliminar `components/shared/ParticlesOptimized.tsx`
- [ ] Eliminar `components/layout/BackToTop.tsx`
- [ ] Eliminar `components/ui/moving-border.tsx`
- [ ] Desinstalar dependencias: `pnpm remove motion @tsparticles/react @tsparticles/engine @tsparticles/slim react-intersection-observer react-scroll`

### Fase 2: Crear Componentes Estáticos (2-3 horas)
- [ ] Crear `components/NavStatic.tsx`
- [ ] Crear `components/BackgroundStatic.tsx`
- [ ] Crear `app/static-sections/HeroStatic.tsx`
- [ ] Crear `app/static-sections/ServicesStatic.tsx`
- [ ] Crear `app/static-sections/ProjectsStatic.tsx`
- [ ] Crear `app/static-sections/TestimonialsStatic.tsx`
- [ ] Crear `app/static-sections/ContactStatic.tsx`

### Fase 3: Integración (30 min)
- [ ] Actualizar `app/page.tsx`
- [ ] Actualizar `app/layout.tsx`
- [ ] Verificar `styles/global.css`

### Fase 4: Testing (30 min)
- [ ] Build exitoso: `pnpm build`
- [ ] Todas las secciones visibles
- [ ] Links externos funcionan
- [ ] Responsive en mobile/desktop
- [ ] Contentlayer carga proyectos correctamente
- [ ] No hay errores en consola

---

## 6. Resultado Esperado

### Lo Que Tendrás

✅ **Mockup estático funcional** - HTML+CSS puro con Tailwind  
✅ **Estética idéntica** - Mismo diseño grayscale  
✅ **Sin JavaScript** - Cero interactividad  
✅ **Sin animaciones** - Todo estático  
✅ **Performance máximo** - Carga instantánea  
✅ **Base limpia** - Lista para añadir features progresivamente  

### Métricas

- **Bundle JS:** ~0 KB (solo Next.js runtime mínimo)
- **HTML puro:** Todo renderizado en build time
- **Lighthouse:** 100/100/100/100
- **Tiempo de carga:** < 0.5s

### No Incluido (Añadir después si es necesario)

❌ Smooth scroll  
❌ Animaciones  
❌ Menú móvil interactivo  
❌ Formulario de contacto  
❌ Carrusel de testimonials  
❌ Botón back to top  
❌ Particles animados  
❌ Moving borders  

---

## 7. Comandos para Ejecutar

```bash
# Limpiar dependencias
pnpm remove motion @tsparticles/react @tsparticles/engine @tsparticles/slim react-intersection-observer react-scroll embla-carousel-react embla-carousel-autoplay embla-carousel-wheel-gestures @radix-ui/react-dialog

# Limpiar archivos
rm -rf hooks/
rm -rf context/
rm components/shared/ParticlesOptimized.tsx
rm components/layout/BackToTop.tsx
rm components/ui/moving-border.tsx

# Build
pnpm build

# Preview
pnpm start
```

---

## Conclusión

Este plan crea un **mockup visual estático** del sitio que:

1. Mantiene la estética 100%
2. Elimina TODA la interactividad
3. No usa JavaScript del lado del cliente
4. Sirve como base sólida para luego añadir features necesarias

**Tiempo de implementación: 3-4 horas**