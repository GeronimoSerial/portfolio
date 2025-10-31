# Plan de Reorganización de Estructura de Directorios

## 📊 Análisis de la Situación Actual

### Problemas Identificados

1. **Duplicación de carpetas `components/`**

   - ❌ `/components/ui/` (shadcn/ui components)
   - ❌ `/app/components/` (componentes custom)
   - **Problema:** Confusión sobre dónde crear nuevos componentes

2. **Rutas legacy no consolidadas**

   - ❌ `/app/perfil/` (página antigua)
   - ❌ `/app/contacto/` (página antigua)
   - **Problema:** Ya migrado al SPA pero los archivos siguen existiendo

3. **Componentes sin categorizar**

   - ❌ `card.tsx`, `nav.tsx`, `particles.tsx`, `analytics.tsx` mezclados en `/app/components/`
   - **Problema:** Difícil encontrar componentes específicos

4. **Hooks dispersos**

   - ✅ `/hooks/` está bien organizado (root level)
   - ⚠️ Pero podría estar dentro de `/src/` para mejor estructura

5. **Utilidades y tipos**

   - ✅ `/lib/utils.ts` (bien ubicado)
   - ✅ `/types/mdx.d.ts` (bien ubicado)
   - ⚠️ `/util/mouse.ts` (debería estar en `/lib/`)

6. **Assets sin organizar**
   - ⚠️ `/public/` tiene archivos sueltos sin subcarpetas

---

## 🎯 Estructura Objetivo (Propuesta)

### Opción A: Estructura Moderna con `/src`

```
portfolio/
├── .github/
├── .next/
├── node_modules/
├── public/
│   ├── assets/
│   │   ├── images/
│   │   │   ├── logo_geroserial.webp
│   │   │   ├── memoji.png
│   │   │   ├── profile_photo.webp
│   │   │   └── og.png
│   │   └── icons/
│   │       └── favicon.png
│   └── fonts/
│       └── CalSans-SemiBold.ttf
│
├── src/
│   ├── app/
│   │   ├── (routes)/                    # Rutas opcionales futuras
│   │   │   └── blog/                   # Ejemplo de ruta futura
│   │   ├── api/
│   │   │   └── download/
│   │   │       └── route.ts
│   │   ├── layout.tsx
│   │   ├── page.tsx                    # SPA principal
│   │   └── globals.css
│   │
│   ├── components/
│   │   ├── sections/                   # Secciones del SPA
│   │   │   ├── Hero.tsx
│   │   │   ├── About.tsx
│   │   │   ├── Skills.tsx
│   │   │   ├── Experience.tsx
│   │   │   ├── Projects.tsx
│   │   │   ├── Testimonials.tsx
│   │   │   ├── Services.tsx
│   │   │   └── Contact.tsx
│   │   │
│   │   ├── navigation/                 # Componentes de navegación
│   │   │   ├── StickyNav.tsx
│   │   │   └── MobileMenu.tsx          # Si se separa del sticky
│   │   │
│   │   ├── layout/                     # Componentes de layout
│   │   │   ├── ScrollProgress.tsx
│   │   │   └── BackToTop.tsx
│   │   │
│   │   ├── ui/                         # Componentes shadcn/ui
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   └── carousel.tsx
│   │   │
│   │   ├── shared/                     # Componentes reutilizables
│   │   │   ├── Particles.tsx
│   │   │   ├── Card.tsx               # Custom card (renombrar)
│   │   │   ├── ProjectsDrawer.tsx
│   │   │   └── Analytics.tsx
│   │   │
│   │   └── mdx/                        # Componentes MDX
│   │       └── MDXComponents.tsx
│   │
│   ├── lib/
│   │   ├── utils.ts                    # Utilidades generales
│   │   ├── mouse.ts                    # Mover de /util/
│   │   └── constants.ts                # Constantes del proyecto
│   │
│   ├── hooks/
│   │   ├── useScrollTo.ts
│   │   ├── useScrollSpy.ts
│   │   ├── useSectionInView.ts
│   │   └── useDraggable.ts
│   │
│   ├── types/
│   │   ├── index.ts                    # Re-exportar todos los tipos
│   │   └── mdx.d.ts
│   │
│   └── config/
│       ├── site.ts                     # Configuración del sitio
│       └── navigation.ts               # Items de navegación
│
├── content/
│   └── projects/
│       └── *.mdx
│
├── .contentlayer/
├── .env.example
├── components.json                      # Config shadcn/ui
├── contentlayer.config.js
├── mdx-components.tsx
├── next.config.mjs
├── package.json
├── pnpm-lock.yaml
├── postcss.config.js
├── rome.json
├── tailwind.config.js
├── tsconfig.json
├── PLAN_MIGRACION_SPA.md
└── README.md
```

### Opción B: Estructura App Router Pura (Sin `/src`)

```
portfolio/
├── app/
│   ├── api/
│   ├── sections/                        # Componentes de secciones
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
│
├── components/
│   ├── navigation/
│   ├── layout/
│   ├── sections/                        # ALTERNATIVA: puede ir aquí
│   ├── ui/
│   ├── shared/
│   └── mdx/
│
├── lib/
├── hooks/
├── types/
├── config/
├── content/
├── public/
└── [archivos de configuración]
```

---

## 🚀 Plan de Acción Detallado

### **FASE 1: Preparación y Backup**

#### 1.1 Crear Backup

```bash
# Crear una rama de backup
git checkout -b backup-before-reorganization
git push origin backup-before-reorganization

# Volver a la rama principal
git checkout rebrand
```

#### 1.2 Documentar Imports Actuales

- [ ] Listar todos los imports en componentes principales
- [ ] Identificar dependencias críticas
- [ ] Verificar que el build funciona antes de comenzar

---

### **FASE 2: Reorganizar Public Assets**

#### 2.1 Crear Estructura de Assets

```bash
mkdir -p public/assets/images
mkdir -p public/assets/icons
```

#### 2.2 Mover Archivos

- [ ] `logo_geroserial.webp` → `public/assets/images/`
- [ ] `memoji.png` → `public/assets/images/`
- [ ] `profile_photo.webp` → `public/assets/images/`
- [ ] `og.png` → `public/assets/images/`
- [ ] `planetfall.png` → `public/assets/images/` (si se usa)
- [ ] `favicon.png` → `public/assets/icons/`
- [ ] Mantener `/public/fonts/` como está

#### 2.3 Actualizar Referencias

Archivos a actualizar:

- [ ] `app/layout.tsx` (favicon)
- [ ] `app/sections/About.tsx` (memoji.png)
- [ ] Cualquier referencia a OG image

---

### **FASE 3: Decidir y Crear Estructura Base**

#### Opción Recomendada: **Estructura App Router Pura (Opción B)**

**Razón:** Next.js 13+ con App Router no requiere `/src`. Mantener estructura plana es más idiomático.

#### 3.1 Crear Nuevas Carpetas

```bash
# Dentro de /components
mkdir -p components/navigation
mkdir -p components/layout
mkdir -p components/shared
mkdir -p components/mdx

# Config y tipos
mkdir -p config
```

#### 3.2 Crear Archivos de Configuración

- [ ] `config/site.ts` - Metadata del sitio
- [ ] `config/navigation.ts` - Items de navegación
- [ ] `types/index.ts` - Barrel export de tipos

---

### **FASE 4: Reorganizar Componentes**

#### 4.1 Mover Secciones (ya están bien ubicadas)

✅ Las secciones ya están en `app/sections/` - **NO MOVER**

#### 4.2 Consolidar Componentes de Navegación

**Origen:** `app/components/navigation/`  
**Destino:** `components/navigation/`

```bash
mv app/components/navigation components/
```

Actualizar imports en:

- [ ] `app/page.tsx`

#### 4.3 Mover Componentes de Layout

**Origen:** `app/components/shared/`  
**Destino:** `components/layout/`

```bash
mv app/components/shared/ScrollProgress.tsx components/layout/
mv app/components/shared/BackToTop.tsx components/layout/
```

Actualizar imports en:

- [ ] `app/page.tsx`

#### 4.4 Consolidar UI Components

**Origen:** Mezcla en `app/components/` y `/components/ui/`  
**Destino:** `/components/ui/` (mantener shadcn/ui aquí)

- [ ] Mantener `components/ui/button.tsx`
- [ ] Mantener `components/ui/card.tsx` (shadcn)
- [ ] Mantener `components/ui/carousel.tsx`

**Renombrar para evitar conflictos:**

- [ ] `app/components/card.tsx` → `components/shared/SocialCard.tsx` (es el card custom)

#### 4.5 Reorganizar Componentes Shared

**Mover a:** `components/shared/`

```bash
mv app/components/particles.tsx components/shared/Particles.tsx
mv app/components/proyectosDrawer.tsx components/shared/ProjectsDrawer.tsx
mv app/components/analytics.tsx components/shared/Analytics.tsx
```

Actualizar imports en:

- [ ] `app/layout.tsx` (Analytics)
- [ ] `app/sections/Hero.tsx` (Particles)
- [ ] Donde se use ProjectsDrawer

#### 4.6 Componentes MDX

**Mover a:** `components/mdx/`

```bash
mkdir -p components/mdx
mv app/components/mdx.tsx components/mdx/MDXComponents.tsx
mv mdx-components.tsx components/mdx/mdx-components.tsx
```

Actualizar imports en:

- [ ] Root `mdx-components.tsx` puede re-exportar desde aquí

#### 4.7 Eliminar `app/components/nav.tsx`

Este es el nav viejo. Ya tenemos `StickyNav.tsx`.

- [ ] Verificar que no se use
- [ ] Eliminar archivo

---

### **FASE 5: Reorganizar Lib y Utils**

#### 5.1 Consolidar Utilidades

**Mover:** `/util/mouse.ts` → `/lib/mouse.ts`

```bash
mv util/mouse.ts lib/
rmdir util  # Si queda vacío
```

Actualizar imports en:

- [ ] `components/shared/Particles.tsx`

#### 5.2 Crear Constantes

**Crear:** `lib/constants.ts`

```typescript
export const SITE_CONFIG = {
  name: "geroserial.com",
  author: "Geronimo Serial",
  description: "Desarrollador Full Stack & Especialista en TI",
  url: "https://geroserial.com",
  ogImage: "/assets/images/og.png",
  links: {
    github: "https://github.com/GeronimoSerial",
    linkedin: "https://linkedin.com/in/geroserial",
  },
};

export const NAVIGATION_ITEMS = [
  { id: "hero", label: "Inicio" },
  { id: "about", label: "Sobre Mí" },
  { id: "skills", label: "Habilidades" },
  { id: "experience", label: "Experiencia" },
  { id: "projects", label: "Proyectos" },
  { id: "testimonials", label: "Testimonios" },
  { id: "services", label: "Servicios" },
  { id: "contact", label: "Contacto" },
];
```

Usar en:

- [ ] `components/navigation/StickyNav.tsx`
- [ ] `app/layout.tsx`

---

### **FASE 6: Reorganizar Types**

#### 6.1 Consolidar Tipos

**Crear:** `types/index.ts`

```typescript
export * from "./mdx";

// Tipos globales del proyecto
export interface SectionProps {
  id: string;
  title: string;
}

export interface NavItem {
  id: string;
  label: string;
}

// Agregar más según necesidad
```

---

### **FASE 7: Limpiar Rutas Legacy**

#### 7.1 Eliminar Páginas Antiguas

Ya consolidadas en el SPA:

- [ ] `app/perfil/` - **ELIMINAR COMPLETO**
- [ ] `app/contacto/` - **ELIMINAR COMPLETO**

**IMPORTANTE:** Crear redirects en `next.config.mjs` para mantener SEO:

```javascript
async redirects() {
  return [
    {
      source: '/perfil',
      destination: '/#about',
      permanent: true,
    },
    {
      source: '/contacto',
      destination: '/#contact',
      permanent: true,
    },
  ];
}
```

---

### **FASE 8: Actualizar Path Aliases en tsconfig.json**

```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./"],
      "@/components/*": ["./components/*"],
      "@/app/*": ["./app/*"],
      "@/lib/*": ["./lib/*"],
      "@/hooks/*": ["./hooks/*"],
      "@/types/*": ["./types/*"],
      "@/config/*": ["./config/*"],
      "@/public/*": ["./public/*"]
    }
  }
}
```

---

### **FASE 9: Actualizar Imports Globalmente**

#### 9.1 Herramientas para Buscar y Reemplazar

```bash
# Buscar todos los imports de un archivo específico
grep -r "from.*particles" app/

# O usar VS Code:
# Ctrl+Shift+F → Buscar: from.*particles
# Reemplazar manualmente o con regex
```

#### 9.2 Lista de Imports a Actualizar

| Archivo Original                     | Nuevo Path                           | Archivos Afectados                |
| ------------------------------------ | ------------------------------------ | --------------------------------- |
| `./components/particles`             | `@/components/shared/Particles`      | `app/sections/Hero.tsx`           |
| `./components/analytics`             | `@/components/shared/Analytics`      | `app/layout.tsx`                  |
| `./components/navigation/StickyNav`  | `@/components/navigation/StickyNav`  | `app/page.tsx`                    |
| `./components/shared/ScrollProgress` | `@/components/layout/ScrollProgress` | `app/page.tsx`                    |
| `./components/shared/BackToTop`      | `@/components/layout/BackToTop`      | `app/page.tsx`                    |
| `../util/mouse`                      | `@/lib/mouse`                        | `components/shared/Particles.tsx` |
| `./components/mdx`                   | `@/components/mdx/MDXComponents`     | Contentlayer                      |

---

### **FASE 10: Testing y Validación**

#### 10.1 Verificar Build

```bash
pnpm run build
```

#### 10.2 Verificar Dev Server

```bash
pnpm dev
```

#### 10.3 Checklist de Validación

- [ ] El sitio carga correctamente
- [ ] Todas las secciones se ven bien
- [ ] La navegación funciona
- [ ] Las imágenes cargan correctamente
- [ ] No hay errores en consola
- [ ] No hay warnings de imports
- [ ] Los enlaces internos funcionan
- [ ] Build de producción exitoso
- [ ] Redirects funcionan (/perfil → /#about)

---

## 📊 Estructura Final Esperada

```
portfolio/
│
├── app/
│   ├── api/
│   │   └── download/
│   ├── sections/                        ✅ Secciones del SPA
│   │   ├── Hero.tsx
│   │   ├── About.tsx
│   │   ├── Skills.tsx
│   │   ├── Experience.tsx
│   │   ├── Projects.tsx
│   │   ├── Testimonials.tsx
│   │   ├── Services.tsx
│   │   └── Contact.tsx
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
│
├── components/
│   ├── navigation/                      ✅ Navegación
│   │   └── StickyNav.tsx
│   ├── layout/                          ✅ Layout components
│   │   ├── ScrollProgress.tsx
│   │   └── BackToTop.tsx
│   ├── shared/                          ✅ Reutilizables
│   │   ├── Particles.tsx
│   │   ├── SocialCard.tsx
│   │   ├── ProjectsDrawer.tsx
│   │   └── Analytics.tsx
│   ├── mdx/                             ✅ MDX
│   │   ├── MDXComponents.tsx
│   │   └── mdx-components.tsx
│   └── ui/                              ✅ shadcn/ui
│       ├── button.tsx
│       ├── card.tsx
│       └── carousel.tsx
│
├── lib/
│   ├── utils.ts
│   ├── mouse.ts
│   └── constants.ts
│
├── hooks/
│   ├── useScrollTo.ts
│   ├── useScrollSpy.ts
│   ├── useSectionInView.ts
│   └── useDraggable.ts
│
├── types/
│   ├── index.ts
│   └── mdx.d.ts
│
├── config/
│   ├── site.ts
│   └── navigation.ts
│
├── content/
│   └── projects/
│       └── *.mdx
│
├── public/
│   ├── assets/
│   │   ├── images/
│   │   │   ├── logo_geroserial.webp
│   │   │   ├── memoji.png
│   │   │   ├── profile_photo.webp
│   │   │   └── og.png
│   │   └── icons/
│   │       └── favicon.png
│   └── fonts/
│       └── CalSans-SemiBold.ttf
│
├── pages/                               ⚠️ Solo para API Routes legacy
│   └── api/
│       └── incr.ts
│
└── [archivos de configuración]
```

---

## 🎯 Beneficios de la Nueva Estructura

### ✅ Organización Clara

- Separación lógica por tipo de componente
- Fácil localizar archivos
- Escalable para nuevas features

### ✅ Mantenibilidad

- Imports más claros con path aliases
- Menos confusión sobre dónde crear componentes
- Estructura estándar de Next.js 13+

### ✅ Performance

- Sin archivos duplicados
- Imports optimizados
- Tree-shaking mejorado

### ✅ Developer Experience

- Autocomplete mejor con path aliases
- Navegación más rápida en el código
- Menos fricción al agregar features

---

## 📝 Comandos Útiles Durante la Migración

### Buscar Referencias

```bash
# Buscar imports de un archivo específico
rg "from.*particles" -t tsx -t ts

# Buscar uso de un componente
rg "Particles" -t tsx

# Listar todos los imports en un archivo
grep "import" app/page.tsx
```

### Mover Archivos (con git)

```bash
# Mantiene el historial
git mv app/components/particles.tsx components/shared/Particles.tsx
```

### Verificar Imports Rotos

```bash
# Compilar y ver errores
pnpm run build 2>&1 | grep "Cannot find module"
```

---

## ⚠️ Precauciones

1. **Hacer commits frecuentes** durante la reorganización
2. **Probar después de cada fase** - no hacer todo de una vez
3. **Mantener el servidor de desarrollo corriendo** para detectar errores
4. **Usar git mv** en lugar de mv regular para mantener historial
5. **Actualizar imports inmediatamente** después de mover archivos

---

## 🚀 Orden de Ejecución Recomendado

1. ✅ **FASE 1:** Backup (5 min)
2. ✅ **FASE 2:** Reorganizar Public Assets (10 min)
3. ✅ **FASE 3:** Crear estructura base (5 min)
4. ✅ **FASE 4:** Reorganizar componentes (30 min) ⭐ **MÁS CRÍTICO**
5. ✅ **FASE 5:** Lib y utils (10 min)
6. ✅ **FASE 6:** Types (5 min)
7. ✅ **FASE 7:** Limpiar rutas legacy (10 min)
8. ✅ **FASE 8:** Path aliases (5 min)
9. ✅ **FASE 9:** Actualizar imports (20 min)
10. ✅ **FASE 10:** Testing (15 min)

**Tiempo total estimado:** 2-3 horas

---

## ✅ Checklist de Finalización

- [ ] Todos los archivos movidos a sus nuevas ubicaciones
- [ ] Imports actualizados y funcionando
- [ ] Build de producción exitoso
- [ ] Dev server sin errores
- [ ] Redirects configurados para URLs legacy
- [ ] Documentación actualizada (README.md)
- [ ] Path aliases configurados en tsconfig.json
- [ ] Componentes legacy eliminados
- [ ] Assets organizados por tipo
- [ ] Commit y push de cambios

---

**Responsable:** Geronimo Serial  
**Fecha de creación:** 29 de octubre de 2025  
**Estado:** Por ejecutar

---

_Este plan es complementario al PLAN_MIGRACION_SPA.md y debe ejecutarse después de completar la migración a SPA._
