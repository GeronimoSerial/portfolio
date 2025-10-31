# Estructura de Directorios - Portfolio Estático

## 📁 Árbol de Directorios

```
portfolio/
├── app/                              # Next.js App Router
│   ├── _components/                  # Componentes de la página principal (/)
│   │   ├── Hero.tsx                  # Sección Hero del home
│   │   ├── Services.tsx              # Sección de servicios
│   │   ├── Process.tsx               # Sección de proceso de trabajo
│   │   ├── Projects.tsx              # Sección de proyectos (usa Contentlayer)
│   │   ├── Testimonials.tsx          # Sección de testimonios
│   │   └── Contact.tsx               # Sección de contacto
│   │
│   ├── portfolio/                    # Ruta /portfolio (CV extendido)
│   │   ├── _components/              # Componentes del portfolio extendido
│   │   │   ├── PortfolioHero.tsx     # Hero específico del portfolio
│   │   │   ├── AboutExtended.tsx     # Sobre mí extendido con foto
│   │   │   ├── SkillsComprehensive.tsx # Skills por categorías completas
│   │   │   ├── ExperienceTimeline.tsx  # Línea de tiempo de experiencia
│   │   │   ├── EducationSection.tsx   # Educación y certificaciones
│   │   │   ├── ResumeDownload.tsx     # Descarga de CV EN/ES
│   │   │   └── ContactOpportunities.tsx # Contacto y disponibilidad
│   │   └── page.tsx                  # Página del portfolio
│   │
│   ├── layout.tsx                    # Layout raíz (fuentes, metadata)
│   └── page.tsx                      # Página principal (home)
│
├── components/                       # Componentes compartidos
│   ├── layout/                       # Componentes de layout
│   │   ├── Nav.tsx                   # Navegación principal (con link a /portfolio)
│   │   └── Background.tsx            # Background con grid pattern CSS
│   │
│   ├── shared/                       # Componentes reutilizables
│   │   └── analytics.tsx             # Analytics component
│   │
│   ├── mdx/                          # Componentes para MDX
│   │   └── index.tsx                 # Componentes personalizados MDX
│   │
│   └── ui/                           # Componentes UI base
│       ├── button.tsx
│       └── dialog.tsx
│
├── content/                          # Contenido en MDX (Contentlayer)
│   └── projects/                     # Proyectos en formato MDX
│       └── *.mdx                     # Archivos de proyectos individuales
│
├── lib/                              # Utilidades y helpers
│   └── utils.ts                      # Funciones utilitarias
│
├── public/                           # Archivos estáticos
│   ├── assets/
│   │   └── images/                   # Imágenes del sitio
│   ├── fonts/                        # Fuentes custom (Cal Sans)
│   └── resume/                       # PDFs de CV (para descargas)
│
├── styles/                           # Estilos globales
│   └── global.css                    # CSS global con Tailwind
│
├── config/                           # Configuración
│   └── site.ts                       # Configuración del sitio
│
└── types/                            # Tipos de TypeScript
    └── *.d.ts                        # Definiciones de tipos
```

## 📋 Convenciones de Nombres

### Archivos de Componentes
- **PascalCase**: `Hero.tsx`, `AboutExtended.tsx`
- Sin sufijos como "Static", "Component", etc.
- Nombres descriptivos y específicos

### Directorios Privados
- **`_components/`**: Prefijo `_` indica que son componentes privados de esa ruta
- Next.js ignora estos directorios en el routing

### Imports
```typescript
// Componentes de la página principal
import Hero from "@/app/_components/Hero";

// Componentes del portfolio
import AboutExtended from "@/app/portfolio/_components/AboutExtended";

// Componentes compartidos
import Nav from "@/components/layout/Nav";
import Background from "@/components/layout/Background";
```

## 🎯 Responsabilidades por Directorio

### `app/_components/`
**Propósito**: Componentes exclusivos de la página principal (`/`)

**Contenido**:
- Secciones del home (Hero, Services, Process, etc.)
- Todos son Server Components por defecto
- Sin estado ni hooks (versión estática)

### `app/portfolio/_components/`
**Propósito**: Componentes exclusivos del portfolio extendido (`/portfolio`)

**Contenido**:
- Secciones del CV completo
- Información detallada profesional
- Server Components estáticos

### `components/layout/`
**Propósito**: Componentes estructurales reutilizables

**Contenido**:
- Navegación
- Background/fondos
- Layouts generales

### `components/shared/`
**Propósito**: Componentes reutilizables entre rutas

**Contenido**:
- Analytics
- Utilities compartidas
- Componentes pequeños reutilizables

### `components/ui/`
**Propósito**: Componentes UI base sin lógica de negocio

**Contenido**:
- Botones, inputs, modals base
- Componentes de shadcn/ui si se usan

## 🔄 Flujo de Datos

### Página Principal (`/`)
```
app/page.tsx
  ├─> Background (layout)
  ├─> Nav (layout)
  └─> Main
      ├─> Hero
      ├─> Services
      ├─> Process
      ├─> Projects (← Contentlayer)
      ├─> Testimonials
      └─> Contact
```

### Portfolio (`/portfolio`)
```
app/portfolio/page.tsx
  ├─> Background (layout)
  ├─> Nav (layout)
  └─> Main
      ├─> PortfolioHero
      ├─> AboutExtended
      ├─> SkillsComprehensive
      ├─> ExperienceTimeline
      ├─> EducationSection
      ├─> Projects (← Contentlayer, compartido)
      ├─> ResumeDownload
      └─> ContactOpportunities
```

## 📦 Componentes Compartidos

### Entre rutas
- `components/layout/Nav.tsx` - Usado en `/` y `/portfolio`
- `components/layout/Background.tsx` - Usado en `/` y `/portfolio`
- `app/_components/Projects.tsx` - Usado en `/` y `/portfolio`

### Contentlayer
- `content/projects/*.mdx` - Fuente de datos
- Consumido por `Projects.tsx` en ambas rutas

## 🚀 Próximas Mejoras

### Estructura Recomendada para Crecimiento
Si el sitio crece, considera:

```
app/
├── (marketing)/              # Route group para marketing
│   ├── _components/
│   └── page.tsx
├── (portfolio)/              # Route group para portfolio
│   ├── _components/
│   └── page.tsx
└── (blog)/                   # Route group para blog futuro
    ├── _components/
    ├── [slug]/
    └── page.tsx
```

### Separación de Concerns
```
components/
├── features/                 # Componentes por feature
│   ├── projects/
│   ├── testimonials/
│   └── contact/
└── primitives/               # Componentes UI primitivos
    ├── button/
    ├── card/
    └── dialog/
```

## 📝 Notas Importantes

1. **No hay JavaScript en el cliente** - Todo es Server Components
2. **Sin hooks** - Versión estática pura
3. **Sin animaciones** - Solo CSS transitions
4. **Contentlayer** - Única fuente de datos dinámica (build time)
5. **Tailwind CSS** - Todo el styling es con clases de Tailwind

## 🔍 Buscar Archivos

### Por funcionalidad
- **Hero sections**: `app/_components/Hero.tsx`, `app/portfolio/_components/PortfolioHero.tsx`
- **Navegación**: `components/layout/Nav.tsx`
- **Proyectos**: `app/_components/Projects.tsx` + `content/projects/*.mdx`
- **Contacto**: `app/_components/Contact.tsx`, `app/portfolio/_components/ContactOpportunities.tsx`

### Por tipo
- **Páginas**: `app/page.tsx`, `app/portfolio/page.tsx`
- **Layout**: `app/layout.tsx`
- **Componentes**: `app/_components/`, `app/portfolio/_components/`, `components/`
- **Contenido**: `content/projects/*.mdx`
- **Estilos**: `styles/global.css`, `tailwind.config.js`

## 🎨 Design System

### Colores (Grayscale)
- Background: `black`, `zinc-950`, `zinc-900`
- Text: `zinc-50`, `zinc-300`, `zinc-400`, `zinc-500`
- Borders: `zinc-800`, `zinc-700`
- Highlights: `white`

### Tipografía
- Display: `font-display` (Cal Sans)
- Body: `font-sans` (Inter/Geist)

### Espaciado
- Sections: `py-20`
- Containers: `max-w-6xl` o `max-w-4xl`
- Padding: `px-4` (mobile), `px-6` (desktop)