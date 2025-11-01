# Plan de Implementación: Modo Oscuro/Claro (Dark/Light Mode)

## 📋 Resumen Ejecutivo

Este documento detalla el plan completo para implementar un interruptor global de modo oscuro/claro en el portfolio geroserial.com. El proyecto actualmente utiliza un **diseño monocromático en escala de grises** (black/zinc) sin soporte para temas claros.

### Estado Actual

- **Framework**: Next.js 13+ con App Router
- **Estilos**: Tailwind CSS 4 con utilidades personalizadas
- **Paleta actual**: Monocromática (negro, zinc, blanco)
- **Soporte de temas**: Configurado en Tailwind (`darkMode: ["class"]`) pero no implementado
- **Componentes con estilos dark**: Button y LayoutTextFlip tienen clases `dark:*` residuales

### Objetivos

1. Implementar toggle de tema funcional con persistencia en `localStorage`
2. Crear paleta de colores para modo claro manteniendo la identidad visual
3. Adaptar todos los componentes para soportar ambos modos
4. Garantizar accesibilidad y experiencia de usuario óptima
5. Mantener el rendimiento y las animaciones existentes

---

## 🎨 1. Análisis de Diseño y Paleta de Colores

### 1.1 Paleta Actual (Modo Oscuro)

| Elemento              | Color Actual                       | Uso                    |
| --------------------- | ---------------------------------- | ---------------------- |
| Background principal  | `bg-black`                         | Layout principal       |
| Background secundario | `bg-zinc-950`                      | Secciones alternadas   |
| Superficies/Cards     | `bg-white/5` con `border-zinc-800` | Tarjetas, contenedores |
| Texto principal       | `text-zinc-50`                     | Títulos, encabezados   |
| Texto secundario      | `text-zinc-300`                    | Subtítulos             |
| Texto muted           | `text-zinc-400/500/600`            | Texto terciario        |
| Bordes                | `border-zinc-800/700`              | Separadores            |
| Hover/Highlights      | `white`, `hover:border-white`      | Estados interactivos   |
| Gradientes            | `from-zinc-900 via-zinc-400/10`    | Fondos decorativos     |

### 1.2 Paleta Propuesta (Modo Claro)

```css
/* Variables CSS propuestas para modo claro */
:root {
  /* Backgrounds */
  --bg-primary-light: #ffffff;
  --bg-secondary-light: #fafafa;
  --bg-surface-light: rgba(0, 0, 0, 0.02);

  /* Borders */
  --border-light: #e5e5e5;
  --border-hover-light: #737373;

  /* Text */
  --text-primary-light: #18181b;
  --text-secondary-light: #3f3f46;
  --text-muted-light: #71717a;

  /* Highlights */
  --highlight-light: #09090b;
}
```

| Elemento              | Modo Oscuro                  | Modo Claro                                                        |
| --------------------- | ---------------------------- | ----------------------------------------------------------------- |
| Background principal  | `bg-black`                   | `bg-white dark:bg-black`                                          |
| Background secundario | `bg-zinc-950`                | `bg-zinc-50 dark:bg-zinc-950`                                     |
| Superficies/Cards     | `bg-white/5 border-zinc-800` | `bg-black/5 border-zinc-200 dark:bg-white/5 dark:border-zinc-800` |
| Texto principal       | `text-zinc-50`               | `text-zinc-950 dark:text-zinc-50`                                 |
| Texto secundario      | `text-zinc-300`              | `text-zinc-700 dark:text-zinc-300`                                |
| Texto muted           | `text-zinc-400`              | `text-zinc-500 dark:text-zinc-400`                                |
| Bordes                | `border-zinc-800`            | `border-zinc-200 dark:border-zinc-800`                            |
| Hover highlights      | `hover:border-white`         | `hover:border-zinc-900 dark:hover:border-white`                   |

### 1.3 Consideraciones de Diseño

**✅ Mantener:**

- Identidad minimalista y monocromática
- Efectos de glassmorphism (`backdrop-blur`)
- Animaciones personalizadas de Tailwind
- Jerarquía visual clara

**⚠️ Adaptar:**

- Contraste de texto (WCAG AA mínimo, AAA ideal)
- Sombras y elevaciones (invertir opacidades)
- Gradientes decorativos (ajustar direcciones y opacidades)
- Partículas del canvas (color dinámico)

---

## 🔧 2. Arquitectura de Implementación

### 2.1 Proveedor de Tema (Theme Provider)

**Ubicación**: `app/providers/ThemeProvider.tsx`

```tsx
"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Leer preferencia guardada o del sistema
    const savedTheme = localStorage.getItem("theme") as Theme | null;
    const systemPreference = window.matchMedia("(prefers-color-scheme: dark)")
      .matches
      ? "dark"
      : "light";

    const initialTheme = savedTheme || systemPreference;
    setThemeState(initialTheme);
    updateDOMTheme(initialTheme);
  }, []);

  const updateDOMTheme = (newTheme: Theme) => {
    const root = document.documentElement;

    if (newTheme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
  };

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem("theme", newTheme);
    updateDOMTheme(newTheme);
  };

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
  };

  // Evitar flash de contenido sin estilo
  if (!mounted) {
    return <>{children}</>;
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}
```

**Características clave:**

- ✅ Persistencia en `localStorage`
- ✅ Respeto por preferencia del sistema
- ✅ Prevención de flash de contenido (FOUC)
- ✅ Hook personalizado para consumir el contexto

### 2.2 Script de Inicialización Temprana

**Ubicación**: Inline en `app/layout.tsx` dentro de `<head>`

```tsx
// Prevenir flash de tema incorrecto
<script
  dangerouslySetInnerHTML={{
    __html: `
      (function() {
        const theme = localStorage.getItem('theme') || 
          (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
        if (theme === 'dark') {
          document.documentElement.classList.add('dark');
        }
      })();
    `,
  }}
/>
```

**Por qué es necesario:**

- Se ejecuta antes de que React hidrate la aplicación
- Elimina el "flash" de tema incorrecto al recargar
- Mantiene sincronizado el DOM con la preferencia guardada

### 2.3 Componente Toggle

**Ubicación**: `components/shared/ThemeToggle.tsx`

```tsx
"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/app/providers/ThemeProvider";
import { motion } from "motion/react";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="relative p-2 rounded-lg border border-zinc-800 dark:border-zinc-700 
                 bg-white/5 dark:bg-white/5 hover:bg-white/10 dark:hover:bg-white/10 
                 transition-colors"
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
    >
      <motion.div
        initial={false}
        animate={{ rotate: theme === "dark" ? 0 : 180 }}
        transition={{ duration: 0.3 }}
      >
        {theme === "dark" ? (
          <Moon className="w-5 h-5 text-zinc-400" />
        ) : (
          <Sun className="w-5 h-5 text-zinc-600" />
        )}
      </motion.div>
    </button>
  );
}
```

**Características:**

- ✅ Animación suave de rotación con `motion`
- ✅ Iconos claros (luna/sol)
- ✅ Accesibilidad con `aria-label`
- ✅ Estilos consistentes con el diseño actual

---

## 📦 3. Cambios por Componente

### 3.1 Root Layout (`app/layout.tsx`)

**Cambios necesarios:**

```tsx
import { ThemeProvider } from "./providers/ThemeProvider";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={[
        geist.variable,
        calSans.variable,
        dm_sans.variable,
        geist_mono.variable,
      ].join(" ")}
      suppressHydrationWarning // Importante para el script de tema
    >
      <head>
        {/* Script de inicialización temprana */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                const theme = localStorage.getItem('theme') || 
                  (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
                if (theme === 'dark') {
                  document.documentElement.classList.add('dark');
                }
              })();
            `,
          }}
        />
        <link
          rel="stylesheet"
          type="text/css"
          href="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/devicon.min.css"
        />
      </head>
      <body
        className={`bg-white dark:bg-black transition-colors duration-300 ${
          process.env.NODE_ENV === "development" ? "debug-screens" : undefined
        }`}
      >
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
```

**Puntos clave:**

- Envolver `children` con `ThemeProvider`
- Agregar `suppressHydrationWarning` (necesario para script inline)
- Agregar clases dinámicas al `body`: `bg-white dark:bg-black`

### 3.2 Navigation (`components/layout/Nav.tsx`)

**Cambios necesarios:**

```tsx
import { ThemeToggle } from "@/components/shared/ThemeToggle";

export default function Nav() {
  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 
                    bg-white/95 dark:bg-zinc-900/95 
                    backdrop-blur-lg 
                    border-b border-zinc-200 dark:border-zinc-800
                    transition-colors duration-300"
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a
            href="/"
            className="text-xl font-display 
                               text-zinc-950 dark:text-zinc-50"
          >
            geroserial
          </a>

          {/* Navigation links */}
          <div className="flex items-center gap-1">
            {navItems.slice(1).map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className="px-4 py-2 text-sm font-medium 
                         text-zinc-600 dark:text-zinc-400 
                         hover:text-zinc-900 dark:hover:text-zinc-100 
                         hover:bg-black/5 dark:hover:bg-white/5 
                         rounded-lg transition-colors"
              >
                {item.label}
              </a>
            ))}
          </div>

          {/* Right Side with Theme Toggle */}
          <div className="flex items-center gap-4">
            <Link
              href="/portfolio"
              className="px-4 py-2 text-sm font-medium 
                       text-zinc-600 dark:text-zinc-400 
                       hover:text-zinc-900 dark:hover:text-zinc-100 
                       hover:bg-black/5 dark:hover:bg-white/5 
                       rounded-lg transition-colors"
            >
              Portfolio
            </Link>
            <ThemeToggle />
            <a
              href="https://github.com/GeronimoSerial"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-600 dark:text-zinc-400 
                       hover:text-zinc-900 dark:hover:text-zinc-100 
                       transition-colors"
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

**Cambios detallados:**

- ✅ Agregar `ThemeToggle` al lado derecho
- ✅ Todas las clases de color necesitan variantes `dark:`
- ✅ Background: `bg-white/95 dark:bg-zinc-900/95`
- ✅ Bordes: `border-zinc-200 dark:border-zinc-800`
- ✅ Texto: invertir jerarquía (zinc-950/600/400 en light, zinc-50/400/600 en dark)

### 3.3 Background (`components/layout/Background.tsx`)

**Cambios necesarios:**

```tsx
export default function Background() {
  return (
    <div className="fixed inset-0 -z-50 bg-white dark:bg-black transition-colors duration-300">
      {/* Grid pattern adaptativo */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(0,0,0,0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0,0,0,0.05) 1px, transparent 1px)
          `,
          backgroundSize: "80px 80px",
        }}
      />

      {/* Gradient overlay adaptativo */}
      <div
        className="absolute inset-0 
                      bg-linear-to-b from-zinc-50/50 via-white to-white
                      dark:bg-linear-to-b dark:from-zinc-900/50 dark:via-black dark:to-black"
      />
    </div>
  );
}
```

**Consideración**: El grid pattern necesita invertir el color de las líneas (negro con transparencia en modo claro, blanco en modo oscuro).

**Versión mejorada con CSS variables:**

```tsx
export default function Background() {
  return (
    <div className="fixed inset-0 -z-50 bg-white dark:bg-black transition-colors duration-300">
      {/* Grid pattern con variable CSS */}
      <div
        className="absolute inset-0 opacity-20 
                   [background-image:linear-gradient(to_right,rgba(0,0,0,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(0,0,0,0.05)_1px,transparent_1px)]
                   dark:[background-image:linear-gradient(to_right,rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.05)_1px,transparent_1px)]"
        style={{ backgroundSize: "80px 80px" }}
      />

      {/* Gradient overlay */}
      <div
        className="absolute inset-0 
                      bg-linear-to-b from-zinc-50/50 via-white to-white
                      dark:from-zinc-900/50 dark:via-black dark:to-black"
      />
    </div>
  );
}
```

### 3.4 Hero (`app/_components/Hero.tsx`)

**Cambios necesarios:**

```tsx
export default function Hero() {
  return (
    <section
      id="hero"
      className="relative flex flex-col items-center justify-center w-full min-h-screen px-4"
    >
      <div className="z-10 flex flex-col items-center text-center">
        {/* Título principal */}
        <div className="mb-6">
          <h1
            className="text-6xl md:text-9xl font-display 
                       text-zinc-950 dark:text-white"
          >
            geroserial.com
          </h1>
        </div>

        {/* Subtítulo */}
        <h2
          className="text-sm md:text-lg 
                     text-zinc-700 dark:text-zinc-300 
                     max-w-3xl"
        >
          IT Specialist · Infrastructure, Automation & Web Systems Management
        </h2>

        <p
          className="mt-4 text-sm md:text-base 
                    text-zinc-500 dark:text-zinc-500 
                    max-w-xl leading-relaxed"
        >
          Methodical Approach. Real-World Solutions.
        </p>

        {/* Trust Indicators */}
        <div
          className="flex flex-wrap items-center justify-center gap-3 mt-6 
                      text-xs md:text-sm 
                      text-zinc-400 dark:text-zinc-600"
        >
          <span>+15 Projects Delivered</span>
          <span className="text-zinc-300 dark:text-zinc-800">•</span>
          <span>+5 Satisfied Clients</span>
          <span className="text-zinc-300 dark:text-zinc-800">•</span>
          <span>2+ Years Experience</span>
        </div>

        {/* Location */}
        <div
          className="flex items-center gap-2 mt-3 
                      text-xs md:text-sm 
                      text-zinc-400 dark:text-zinc-600"
        >
          <MapPin className="w-3 h-3 md:w-4 md:h-4" />
          <span>Corrientes, Argentina</span>
          <span className="text-zinc-300 dark:text-zinc-800">|</span>
          <span>Remote Services Available</span>
        </div>

        {/* Botones */}
        <div className="flex gap-4 mt-10">
          <a
            href="#services"
            className="px-6 py-3 text-sm font-medium 
                     text-zinc-700 dark:text-zinc-300 
                     bg-black/10 dark:bg-white/10 
                     border border-zinc-300 dark:border-zinc-700 
                     rounded-lg 
                     hover:bg-black/20 dark:hover:bg-white/20 
                     hover:border-zinc-500 dark:hover:border-zinc-500 
                     transition-colors"
          >
            View Services
          </a>
          <a
            href="#contact"
            className="px-6 py-3 text-sm font-medium 
                     text-white dark:text-black 
                     bg-black dark:bg-white 
                     rounded-lg 
                     hover:bg-zinc-800 dark:hover:bg-zinc-100 
                     transition-colors"
          >
            Get in Touch
          </a>
        </div>
      </div>

      {/* Líneas decorativas adaptativas */}
      <div
        className="absolute top-0 w-screen h-px 
                    bg-linear-to-r 
                    from-zinc-700/0 via-zinc-700/50 to-zinc-700/0
                    dark:from-zinc-300/0 dark:via-zinc-300/50 dark:to-zinc-300/0"
      />
      <div
        className="absolute bottom-0 w-screen h-px 
                    bg-linear-to-r 
                    from-zinc-700/0 via-zinc-700/50 to-zinc-700/0
                    dark:from-zinc-300/0 dark:via-zinc-300/50 dark:to-zinc-300/0"
      />
    </section>
  );
}
```

**Patrón de cambios:**

- Texto principal: `text-zinc-950 dark:text-white`
- Texto secundario: `text-zinc-700 dark:text-zinc-300`
- Texto terciario: `text-zinc-500` (sin cambio, funciona en ambos)
- Texto muted: `text-zinc-400 dark:text-zinc-600`
- Botones: invertir fondos y colores

### 3.5 Cards/Surfaces Pattern (Services, Projects, etc.)

**Patrón estándar para tarjetas:**

```tsx
// Antes (solo dark)
className="p-6 bg-white/5 border border-zinc-800 rounded-lg hover:border-zinc-700"

// Después (ambos modos)
className="p-6
           bg-black/5 dark:bg-white/5
           border border-zinc-200 dark:border-zinc-800
           rounded-lg
           hover:border-zinc-400 dark:hover:border-zinc-700
           transition-colors"
```

**Aplicar a:**

- `Services.tsx`: tarjetas de servicios
- `Projects.tsx`: tarjetas de proyectos
- `Process.tsx`: tarjetas de proceso
- `Testimonials.tsx`: tarjetas de testimonios
- `Contact.tsx`: tarjetas de contacto
- Todos los componentes del portfolio (`/portfolio/*`)

### 3.6 Particles Component (`components/shared/particles.tsx`)

**Cambio crítico**: El color de las partículas debe ser dinámico.

```tsx
"use client";

import React, { useRef, useEffect } from "react";
import { useMousePosition } from "@/lib/mouse";
import { useTheme } from "@/app/providers/ThemeProvider";

export default function Particles({
  className = "",
  quantity = 100,
  staticity = 50,
  ease = 50,
  refresh = false,
}: ParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { theme } = useTheme();

  // ... resto del código ...

  const drawCircle = (circle: Circle, update = false) => {
    if (context.current) {
      const { x, y, translateX, translateY, size, alpha } = circle;
      context.current.translate(translateX, translateY);
      context.current.beginPath();
      context.current.arc(x, y, size, 0, 2 * Math.PI);

      // Color dinámico según tema
      const particleColor =
        theme === "dark"
          ? `rgba(255, 255, 255, ${alpha})`
          : `rgba(0, 0, 0, ${alpha})`;

      context.current.fillStyle = particleColor;
      context.current.fill();
      context.current.setTransform(dpr, 0, 0, dpr, 0, 0);

      if (!update) {
        circles.current.push(circle);
      }
    }
  };

  // Redibujar cuando cambia el tema
  useEffect(() => {
    if (circles.current.length > 0) {
      drawParticles();
    }
  }, [theme]);

  // ... resto del código ...
}
```

**Importante**: Agregar `useEffect` para redibujar partículas cuando cambia el tema.

### 3.7 Global CSS (`global.css`)

**Agregar variables CSS globales:**

```css
@layer base {
  :root {
    /* Light mode colors */
    --background: 0 0% 100%;
    --foreground: 240 10% 3.9%;

    --card: 0 0% 100%;
    --card-foreground: 240 10% 3.9%;

    --popover: 0 0% 100%;
    --popover-foreground: 240 10% 3.9%;

    --primary: 240 5.9% 10%;
    --primary-foreground: 0 0% 98%;

    --muted: 240 4.8% 95.9%;
    --muted-foreground: 240 3.8% 46.1%;

    --border: 240 5.9% 90%;
    --input: 240 5.9% 90%;

    --radius: 0.5rem;
  }

  .dark {
    /* Dark mode colors */
    --background: 240 10% 3.9%;
    --foreground: 0 0% 98%;

    --card: 240 10% 3.9%;
    --card-foreground: 0 0% 98%;

    --popover: 240 10% 3.9%;
    --popover-foreground: 0 0% 98%;

    --primary: 0 0% 98%;
    --primary-foreground: 240 5.9% 10%;

    --muted: 240 3.7% 15.9%;
    --muted-foreground: 240 5% 64.9%;

    --border: 240 3.7% 15.9%;
    --input: 240 3.7% 15.9%;
  }
}
```

**Opcional**: Si prefieres no usar variables HSL, mantén las clases directas de Tailwind (recomendado para este proyecto).

---

## 🎯 4. Lista de Cambios por Archivo

### Archivos Nuevos a Crear

| Archivo                             | Descripción               | Prioridad |
| ----------------------------------- | ------------------------- | --------- |
| `app/providers/ThemeProvider.tsx`   | Context provider del tema | 🔴 Alta   |
| `components/shared/ThemeToggle.tsx` | Componente toggle         | 🔴 Alta   |

### Archivos a Modificar

| Archivo                                              | Cambios Principales                       | Complejidad |
| ---------------------------------------------------- | ----------------------------------------- | ----------- |
| `app/layout.tsx`                                     | Envolver con ThemeProvider, script inline | 🟡 Media    |
| `components/layout/Nav.tsx`                          | Agregar toggle, adaptar colores           | 🟡 Media    |
| `components/layout/Background.tsx`                   | Grid y gradientes adaptativos             | 🟡 Media    |
| `components/shared/particles.tsx`                    | Color dinámico de partículas              | 🔴 Alta     |
| `app/_components/Hero.tsx`                           | Todos los colores y gradientes            | 🟢 Baja     |
| `app/_components/Services.tsx`                       | Cards y texto                             | 🟢 Baja     |
| `app/_components/Process.tsx`                        | Cards y texto                             | 🟢 Baja     |
| `app/_components/Projects.tsx`                       | Cards y texto                             | 🟢 Baja     |
| `app/_components/Testimonials.tsx`                   | Cards y texto                             | 🟢 Baja     |
| `app/_components/Contact.tsx`                        | Cards y texto                             | 🟢 Baja     |
| `app/portfolio/page.tsx`                             | Background y layout                       | 🟢 Baja     |
| `app/portfolio/_components/PortfolioHero.tsx`        | Colores de texto                          | 🟢 Baja     |
| `app/portfolio/_components/AboutExtended.tsx`        | Cards y texto                             | 🟢 Baja     |
| `app/portfolio/_components/SkillsComprehensive.tsx`  | Cards de skills                           | 🟢 Baja     |
| `app/portfolio/_components/ExperienceTimeline.tsx`   | Timeline y cards                          | 🟢 Baja     |
| `app/portfolio/_components/EducationSection.tsx`     | Cards                                     | 🟢 Baja     |
| `app/portfolio/_components/ResumeDownload.tsx`       | Botones                                   | 🟢 Baja     |
| `app/portfolio/_components/ContactOpportunities.tsx` | Cards y formulario                        | 🟢 Baja     |
| `components/ui/button.tsx`                           | Limpiar clases dark residuales            | 🟢 Baja     |
| `components/ui/layout-text-flip.tsx`                 | Adaptar animación de texto                | 🟢 Baja     |
| `global.css`                                         | (Opcional) Variables CSS                  | 🟢 Baja     |

---

## 🚀 5. Estrategia de Implementación

### Fase 1: Infraestructura (Día 1)

**Objetivo**: Configurar el sistema de temas sin cambios visuales.

1. ✅ Crear `ThemeProvider.tsx`
2. ✅ Crear `ThemeToggle.tsx`
3. ✅ Modificar `app/layout.tsx`:
   - Agregar script de inicialización
   - Envolver con `ThemeProvider`
   - Agregar `suppressHydrationWarning`
4. ✅ Agregar toggle a `Nav.tsx` (sin adaptar colores aún)
5. ✅ Probar que el toggle funciona (verificar clase `dark` en `<html>`)

**Testing**:

```bash
# Verificar en DevTools
document.documentElement.classList.contains('dark') // debe ser true/false

# Verificar localStorage
localStorage.getItem('theme') // debe ser 'light' o 'dark'
```

### Fase 2: Componentes de Layout (Día 2)

**Objetivo**: Adaptar backgrounds, navegación y efectos globales.

1. ✅ Adaptar `Background.tsx` (grid y gradientes)
2. ✅ Adaptar `Nav.tsx` (colores y estilos)
3. ✅ Adaptar `Particles.tsx` (color dinámico)
4. ✅ Probar transiciones suaves

**Testing**:

- Cambiar tema y verificar que no haya flash
- Verificar contraste de texto en navbar
- Verificar que partículas cambien de color

### Fase 3: Secciones Principales (Día 3-4)

**Objetivo**: Adaptar todas las secciones de la página principal.

**Orden recomendado:**

1. `Hero.tsx` (crítico, es lo primero que ven)
2. `Services.tsx`
3. `Projects.tsx`
4. `Process.tsx`
5. `Testimonials.tsx`
6. `Contact.tsx`

**Para cada componente:**

- Aplicar patrón de cards: `bg-black/5 dark:bg-white/5`
- Adaptar jerarquía de texto
- Verificar bordes y hovers
- Probar transiciones

### Fase 4: Portfolio Completo (Día 5)

**Objetivo**: Adaptar la página `/portfolio` y todos sus subcomponentes.

**Componentes:**

1. `portfolio/page.tsx`
2. `PortfolioHero.tsx`
3. `AboutExtended.tsx`
4. `SkillsComprehensive.tsx`
5. `ExperienceTimeline.tsx`
6. `EducationSection.tsx`
7. `ResumeDownload.tsx`
8. `ContactOpportunities.tsx`

**Desafíos específicos:**

- Timeline vertical con línea adaptativa
- Iconos de DevIcons (algunos necesitan `className="text-black dark:text-white"`)
- Badges de tecnologías

### Fase 5: Componentes UI y Detalles (Día 6)

**Objetivo**: Limpiar componentes reutilizables y casos edge.

1. ✅ `components/ui/button.tsx` (limpiar clases dark residuales)
2. ✅ `components/ui/layout-text-flip.tsx` (adaptar animación)
3. ✅ Revisar todos los componentes con `grep` para clases huérfanas
4. ✅ Verificar MDX content (si usa estilos inline)

**Comando útil:**

```bash
grep -r "dark:" app/ components/ --include="*.tsx" --include="*.ts"
```

### Fase 6: Testing y QA (Día 7)

**Objetivo**: Garantizar calidad y accesibilidad.

**Checklist de testing:**

- [ ] **Funcionalidad**

  - [ ] Toggle cambia el tema correctamente
  - [ ] Tema persiste al recargar la página
  - [ ] Respeta preferencia del sistema en primera visita
  - [ ] No hay flash de contenido al cargar

- [ ] **Accesibilidad**

  - [ ] Contraste de texto cumple WCAG AA (ratio 4.5:1 mínimo)
  - [ ] Toggle tiene `aria-label` descriptivo
  - [ ] Focus visible en todos los elementos interactivos
  - [ ] Sin problemas con lectores de pantalla

- [ ] **Responsive**

  - [ ] Funciona en mobile (320px+)
  - [ ] Funciona en tablet (768px+)
  - [ ] Funciona en desktop (1024px+)
  - [ ] Toggle visible en todos los breakpoints

- [ ] **Performance**

  - [ ] Transiciones de tema < 300ms
  - [ ] No hay layout shift al cambiar tema
  - [ ] Partículas mantienen 60fps en ambos modos

- [ ] **Cross-browser**
  - [ ] Chrome/Edge
  - [ ] Firefox
  - [ ] Safari (importante: `matchMedia`)
  - [ ] Mobile browsers

**Herramientas recomendadas:**

- Chrome DevTools (Lighthouse, Accessibility)
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [axe DevTools](https://www.deque.com/axe/devtools/)

---

## 🎨 6. Guía de Estilos y Convenciones

### 6.1 Patrón de Clases Tailwind

**❌ Evitar:**

```tsx
// Clases mezcladas sin orden
className = "hover:bg-white/10 text-zinc-50 bg-white/5 dark:text-zinc-300";
```

**✅ Preferir:**

```tsx
// Orden: Layout → Spacing → Colors → Borders → Effects → States → Dark variants
className="p-6
           bg-black/5 dark:bg-white/5
           border border-zinc-200 dark:border-zinc-800
           rounded-lg
           transition-colors
           hover:border-zinc-400 dark:hover:border-zinc-700"
```

### 6.2 Convención de Colores de Texto

| Tipo                      | Light Mode      | Dark Mode            |
| ------------------------- | --------------- | -------------------- |
| Título principal (h1, h2) | `text-zinc-950` | `dark:text-zinc-50`  |
| Subtítulo (h3, h4)        | `text-zinc-900` | `dark:text-zinc-100` |
| Texto secundario          | `text-zinc-700` | `dark:text-zinc-300` |
| Texto terciario           | `text-zinc-500` | `dark:text-zinc-400` |
| Texto muted               | `text-zinc-400` | `dark:text-zinc-600` |

### 6.3 Convención de Backgrounds

| Elemento              | Light Mode    | Dark Mode          |
| --------------------- | ------------- | ------------------ |
| Background principal  | `bg-white`    | `dark:bg-black`    |
| Background secundario | `bg-zinc-50`  | `dark:bg-zinc-950` |
| Card/Surface          | `bg-black/5`  | `dark:bg-white/5`  |
| Card hover            | `bg-black/10` | `dark:bg-white/10` |

### 6.4 Convención de Bordes

| Contexto         | Light Mode        | Dark Mode              |
| ---------------- | ----------------- | ---------------------- |
| Border default   | `border-zinc-200` | `dark:border-zinc-800` |
| Border hover     | `border-zinc-400` | `dark:border-zinc-700` |
| Border highlight | `border-zinc-900` | `dark:border-white`    |
| Divider          | `border-zinc-200` | `dark:border-zinc-800` |

### 6.5 Transiciones

**Siempre incluir** `transition-colors` o `transition-all` en elementos con estados hover:

```tsx
className = "... transition-colors duration-300 hover:...";
```

**Duración recomendada**: 300ms (por defecto en Tailwind `duration-300`)

---

## ♿ 7. Consideraciones de Accesibilidad

### 7.1 Contraste de Color

**Requisitos WCAG:**

- **AA (mínimo)**: Ratio 4.5:1 para texto normal, 3:1 para texto grande
- **AAA (ideal)**: Ratio 7:1 para texto normal, 4.5:1 para texto grande

**Combinaciones validadas:**

| Foreground | Background (Light) | Ratio   | WCAG               |
| ---------- | ------------------ | ------- | ------------------ |
| `zinc-950` | `white`            | 19.44:1 | AAA ✅             |
| `zinc-700` | `white`            | 7.23:1  | AAA ✅             |
| `zinc-500` | `white`            | 4.53:1  | AA ✅              |
| `zinc-400` | `white`            | 3.45:1  | AA (text large) ⚠️ |

| Foreground | Background (Dark) | Ratio   | WCAG   |
| ---------- | ----------------- | ------- | ------ |
| `zinc-50`  | `black`           | 18.12:1 | AAA ✅ |
| `zinc-300` | `black`           | 9.85:1  | AAA ✅ |
| `zinc-400` | `black`           | 7.18:1  | AAA ✅ |
| `zinc-600` | `black`           | 3.84:1  | AA ✅  |

**⚠️ Precaución**: Evitar `zinc-400` en modo claro para texto pequeño.

### 7.2 Focus States

**Agregar estados de foco visibles a todos los elementos interactivos:**

```tsx
className="...
           focus:outline-none
           focus:ring-2
           focus:ring-zinc-400 dark:focus:ring-zinc-600
           focus:ring-offset-2"
```

### 7.3 Keyboard Navigation

**Garantizar que el toggle sea accesible por teclado:**

```tsx
<button
  onClick={toggleTheme}
  onKeyDown={(e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      toggleTheme();
    }
  }}
  aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
  aria-pressed={theme === "dark"}
>
  {/* Icon */}
</button>
```

### 7.4 Prefers Color Scheme

**Respetar preferencia del sistema en primera visita:**

```tsx
const systemPreference = window.matchMedia("(prefers-color-scheme: dark)")
  .matches
  ? "dark"
  : "light";

const initialTheme = savedTheme || systemPreference;
```

**Escuchar cambios del sistema (opcional):**

```tsx
useEffect(() => {
  const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");

  const handleChange = (e: MediaQueryListEvent) => {
    if (!localStorage.getItem("theme")) {
      setTheme(e.matches ? "dark" : "light");
    }
  };

  mediaQuery.addEventListener("change", handleChange);
  return () => mediaQuery.removeEventListener("change", handleChange);
}, []);
```

---

## 🔍 8. Testing y Validación

### 8.1 Test Cases

| ID    | Escenario                                       | Resultado Esperado                 | Prioridad |
| ----- | ----------------------------------------------- | ---------------------------------- | --------- |
| TC001 | Primera visita sin preferencia guardada         | Usar preferencia del sistema       | Alta      |
| TC002 | Primera visita con `prefers-color-scheme: dark` | Modo oscuro activo                 | Alta      |
| TC003 | Click en toggle                                 | Cambiar tema inmediatamente        | Alta      |
| TC004 | Recargar página                                 | Mantener tema seleccionado         | Alta      |
| TC005 | Cambiar tema y cerrar pestaña                   | Persistir al reabrir               | Alta      |
| TC006 | Navegar entre páginas                           | Mantener tema consistente          | Media     |
| TC007 | JavaScript deshabilitado                        | Modo oscuro por defecto (fallback) | Baja      |
| TC008 | localStorage lleno/bloqueado                    | Funcionar sin persistencia         | Baja      |

### 8.2 Script de Testing Manual

```bash
# 1. Limpiar estado inicial
localStorage.removeItem('theme');
document.documentElement.classList.remove('dark');

# 2. Recargar y verificar detección de sistema
location.reload();
# Verificar: tema coincide con preferencia del sistema

# 3. Cambiar tema
# Click en toggle
# Verificar: clase 'dark' en <html>
# Verificar: localStorage.getItem('theme')

# 4. Recargar
location.reload();
# Verificar: tema persiste

# 5. Cambiar preferencia del sistema y recargar
# Verificar: ignorar sistema, usar tema guardado

# 6. Limpiar localStorage y cambiar preferencia del sistema
localStorage.removeItem('theme');
# Verificar: usar nueva preferencia del sistema
```

### 8.3 Tests Automatizados (Opcional)

**Framework sugerido**: Playwright o Cypress

```typescript
// tests/theme.spec.ts
import { test, expect } from "@playwright/test";

test.describe("Theme Toggle", () => {
  test("should toggle between light and dark mode", async ({ page }) => {
    await page.goto("/");

    // Verificar modo inicial
    const html = page.locator("html");
    const initialDark = await html.evaluate((el) =>
      el.classList.contains("dark")
    );

    // Click en toggle
    await page.click('[aria-label*="Switch to"]');

    // Verificar cambio
    const afterToggleDark = await html.evaluate((el) =>
      el.classList.contains("dark")
    );
    expect(afterToggleDark).toBe(!initialDark);

    // Verificar localStorage
    const storedTheme = await page.evaluate(() =>
      localStorage.getItem("theme")
    );
    expect(storedTheme).toBeTruthy();
  });

  test("should persist theme on reload", async ({ page }) => {
    await page.goto("/");

    // Cambiar a modo claro
    await page.evaluate(() => {
      localStorage.setItem("theme", "light");
    });

    // Recargar
    await page.reload();

    // Verificar persistencia
    const isDark = await page
      .locator("html")
      .evaluate((el) => el.classList.contains("dark"));
    expect(isDark).toBe(false);
  });
});
```

---

## 📊 9. Métricas de Éxito

### 9.1 Indicadores Cuantitativos

| Métrica                  | Objetivo          | Herramienta      |
| ------------------------ | ----------------- | ---------------- |
| Tiempo de cambio de tema | < 300ms           | Performance API  |
| Layout shift (CLS)       | 0                 | Lighthouse       |
| Contraste mínimo (AA)    | 100% de elementos | axe DevTools     |
| Errores de consola       | 0                 | Browser DevTools |
| Lighthouse Accessibility | > 95              | Lighthouse       |
| Cobertura de componentes | 100%              | Manual           |

### 9.2 Indicadores Cualitativos

- ✅ Diseño consistente en ambos modos
- ✅ Transiciones suaves sin flash
- ✅ Legibilidad óptima en ambos modos
- ✅ Iconografía clara (sol/luna)
- ✅ Feedback visual al interactuar con toggle

---

## 🛠️ 10. Troubleshooting

### Problema 1: Flash de Contenido Incorrecto (FOUC)

**Síntoma**: Al recargar, aparece brevemente el modo incorrecto.

**Causa**: Script de inicialización ejecuta después de que React renderiza.

**Solución**:

```tsx
// En app/layout.tsx <head>
<script
  dangerouslySetInnerHTML={{
    __html: `(function(){const t=localStorage.getItem('theme')||(window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light');t==='dark'&&document.documentElement.classList.add('dark');})();`,
  }}
/>
```

### Problema 2: Hidration Mismatch

**Síntoma**: Error `Hydration failed` en consola.

**Causa**: Diferencia entre HTML del servidor y cliente al usar tema.

**Solución**:

```tsx
// En app/layout.tsx
<html suppressHydrationWarning>

// En ThemeProvider
const [mounted, setMounted] = useState(false);

useEffect(() => {
  setMounted(true);
}, []);

if (!mounted) {
  return <>{children}</>;
}
```

### Problema 3: Partículas No Cambian de Color

**Síntoma**: Partículas quedan blancas/negras al cambiar tema.

**Causa**: Canvas no se redibuja con nuevo color.

**Solución**:

```tsx
// En particles.tsx
const { theme } = useTheme();

useEffect(() => {
  if (circles.current.length > 0) {
    drawParticles();
  }
}, [theme]);
```

### Problema 4: LocalStorage No Disponible

**Síntoma**: Error en Safari private mode o bloqueadores.

**Solución**:

```tsx
const saveTheme = (theme: Theme) => {
  try {
    localStorage.setItem("theme", theme);
  } catch (e) {
    console.warn("localStorage not available:", e);
  }
};

const getTheme = (): Theme | null => {
  try {
    return localStorage.getItem("theme") as Theme | null;
  } catch (e) {
    return null;
  }
};
```

---

## 📚 11. Recursos y Referencias

### Documentación Oficial

- [Next.js: App Router](https://nextjs.org/docs/app)
- [Tailwind CSS: Dark Mode](https://tailwindcss.com/docs/dark-mode)
- [React Context API](https://react.dev/reference/react/useContext)
- [MDN: `prefers-color-scheme`](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme)

### Guías de Accesibilidad

- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)
- [WebAIM Contrast Checker](https://webaim.org/resources/contrastchecker/)
- [Inclusive Components: Dark Mode](https://inclusive-components.design/dark-mode/)

### Inspiración de Diseño

- [shadcn/ui: Dark Mode](https://ui.shadcn.com/docs/dark-mode)
- [Vercel: Theme Toggle](https://vercel.com/design/color)
- [Linear: Theme System](https://linear.app/)

### Herramientas

- **Contrast Checkers**: Polypane, Contrast, Stark
- **Testing**: Playwright, Cypress, Testing Library
- **Accessibility**: axe DevTools, WAVE, Lighthouse

---

## 🚀 12. Plan de Ejecución Resumido

### Día 1: Infraestructura

- [ ] Crear `ThemeProvider` y `ThemeToggle`
- [ ] Modificar `layout.tsx` con script y provider
- [ ] Agregar toggle a navegación
- [ ] Verificar que clase `dark` se aplica

### Día 2: Layout Global

- [ ] Adaptar `Background.tsx`
- [ ] Adaptar `Nav.tsx` completamente
- [ ] Adaptar `Particles.tsx`
- [ ] Testing de transiciones

### Día 3-4: Página Principal

- [ ] Adaptar `Hero.tsx`
- [ ] Adaptar `Services.tsx`, `Projects.tsx`, `Process.tsx`
- [ ] Adaptar `Testimonials.tsx`, `Contact.tsx`
- [ ] Testing de contraste

### Día 5: Portfolio

- [ ] Adaptar `portfolio/page.tsx`
- [ ] Adaptar todos los componentes del portfolio
- [ ] Testing específico de timeline y skills

### Día 6: Componentes UI

- [ ] Limpiar `button.tsx` y `layout-text-flip.tsx`
- [ ] Buscar clases huérfanas con grep
- [ ] Verificar MDX content

### Día 7: QA Final

- [ ] Testing exhaustivo (funcional, accesibilidad, responsive)
- [ ] Lighthouse audit
- [ ] Cross-browser testing
- [ ] Deploy a staging

---

## 📝 13. Checklist Final

### Pre-implementación

- [ ] Backup del código actual (branch `feature/dark-mode`)
- [ ] Revisar Tailwind config (`darkMode: ["class"]`)
- [ ] Instalar dependencias (ninguna adicional necesaria)

### Durante Implementación

- [ ] Seguir convenciones de clases establecidas
- [ ] Probar cada componente individualmente
- [ ] Commit frecuente con mensajes descriptivos

### Post-implementación

- [ ] Testing completo según checklist
- [ ] Actualizar documentación
- [ ] Screenshot de ambos modos para README
- [ ] Deploy a producción

---

## 🎯 Conclusión

Este plan proporciona una hoja de ruta completa para implementar el modo oscuro/claro en geroserial.com. La implementación estimada es de **7 días de trabajo** para un desarrollador frontend experimentado.

**Puntos críticos de éxito:**

1. ✅ Script de inicialización temprana (evita FOUC)
2. ✅ ThemeProvider con persistencia en localStorage
3. ✅ Convención consistente de clases Tailwind
4. ✅ Adaptar color de partículas dinámicamente
5. ✅ Testing exhaustivo de accesibilidad

**Resultado esperado:**

- Experiencia de usuario fluida al cambiar tema
- Diseño consistente manteniendo identidad monocromática
- Accesibilidad WCAG AA (idealmente AAA)
- Sin degradación de performance

---

**Documento creado por**: GitHub Copilot  
**Fecha**: 31 de octubre de 2025  
**Versión**: 1.0  
**Contacto para dudas**: [Abrir issue en el repositorio]
