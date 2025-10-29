# GitHub Copilot Instructions - Portfolio geroserial.com

Whenever you want to ask a question, always call the MCP interactive_feedback.
Whenever you’re about to complete a user request, call the MCP interactive_feedback instead of simply ending the process. Keep calling MCP until the user’s feedback is empty, then end the request.

## Architecture Overview

This is a **Next.js 13+ (App Router) portfolio** in active migration to a single-page application (SPA). Built with TypeScript, Tailwind CSS, and integrates Contentlayer for MDX-based project management.

**Current state (rebrand branch):** Migrating from multi-page to single-page vertical-scroll SPA. All content being consolidated into `app/page.tsx` with 8 main sections (Hero, About, Skills, Experience, Projects, Testimonials, Services, Contact) navigable via smooth scroll anchors.

## Tech Stack & Key Dependencies

- **Framework:** Next.js 13.5.4 with App Router (`app/` directory)
- **Styling:** Tailwind CSS 3.3 with custom animations (`tailwind.config.js`)
- **Fonts:** Inter (body), Cal Sans (display via `LocalFont`)
- **Content:** Contentlayer 0.3.4 for MDX project files in `content/projects/*.mdx`
- **UI Libraries:** Radix UI (Dialog), Embla Carousel
- **Animation:** `motion` (v12.23+) - Modern React animation library
- **Scroll:** react-scroll for smooth navigation between sections
- **Database:** Upstash Redis for analytics/counters
- **Package Manager:** pnpm (lockfile present)

## Critical Project Conventions

### Design System - Grayscale Palette

**The project uses a grayscale/monochrome design system:**

- **Backgrounds:** `bg-black` or `bg-zinc-950` with zinc-based gradients (`from-zinc-900 via-zinc-400/10`)
- **Text hierarchy:** `zinc-50` (primary) → `zinc-300` (secondary) → `zinc-500` (muted)
- **Borders:** `zinc-800` (default), `zinc-700` (lighter), `white` (highlights)
- **Surfaces:** `bg-white/5` with `backdrop-blur` for glassmorphism
- **Highlights:** White (`#ffffff`) for important elements, CTAs, and hover states
- **Gradients:** Always zinc-based (e.g., `from-zinc-950 via-zinc-900 to-black`)

**When adding/editing components:** 
- Use ONLY zinc/grayscale palette - NO indigo/purple/violet colors
- Particles: white with opacity variations
- Hover effects: transition from zinc shades to white
- Glow effects: `rgba(255, 255, 255, 0.1)`

### Custom Animations (Tailwind)

The `tailwind.config.js` defines **custom keyframe animations** not in standard Tailwind:

- `animate-fade-in`: 3s fade from 0% → 100% opacity (delayed start at 75%)
- `animate-fade-left` / `animate-fade-right`: Slide + fade for dividers
- `animate-title`: Letter-spacing + line-height transition for hero text
- `.text-edge-outline`: Custom text stroke (`-webkit-text-stroke: 1px`)

**Usage:** These are already applied in `app/page.tsx` hero section. Reuse for consistency.

### File Structure Patterns

```
app/
  ├── page.tsx               # Main SPA with all sections
  ├── layout.tsx             # Root layout with fonts, metadata, Analytics
  ├── sections/              # Section components (Hero, About, Skills, etc.)
  │   ├── Hero.tsx
  │   ├── About.tsx
  │   ├── Skills.tsx
  │   ├── Experience.tsx
  │   ├── Projects.tsx
  │   ├── Testimonials.tsx
  │   ├── Services.tsx
  │   └── Contact.tsx
  ├── components/            # Shared components
  │   ├── navigation/        # Nav components
  │   │   ├── StickyNav.tsx
  │   │   └── MobileMenu.tsx
  │   ├── shared/            # Reusable UI
  │   │   ├── ScrollProgress.tsx
  │   │   └── BackToTop.tsx
  │   └── ...                # Existing (particles, card, mdx)
  └── [legacy]/              # Old routes (to be removed)

content/projects/*.mdx       # Project definitions (Contentlayer)
hooks/                       # Custom React hooks
  ├── useScrollTo.ts         # Smooth scroll navigation
  ├── useScrollSpy.ts        # Active section detection
  └── useSectionInView.ts    # Intersection Observer wrapper
```

**Component patterns:**

- Client components: Use `"use client"` directive (required for hooks, events)
- Section components: All in `app/sections/` with semantic IDs
- Shared components: Place in `app/components/` or subcategories
- Each section is self-contained with its own styling

### Contentlayer Integration

Projects are defined as **MDX files** in `content/projects/` with frontmatter:

```mdx
---
published: true
title: "Project Name"
description: "Brief description"
date: "2023-10-15"
url: "https://example.com"
repository: "https://github.com/..."
---
```

**Accessing in components:**

```tsx
import { allProjects } from "contentlayer/generated";

const published = allProjects.filter((p) => p.published);
```

Configured in `contentlayer.config.js` with rehype plugins (pretty-code, slug, autolink-headings). MDX components customized in `app/components/mdx.tsx`.

### Particles Component

The `Particles` component (`app/components/particles.tsx`) is a **custom canvas-based animation** with:

- Mouse-tracking using `util/mouse.ts` hook (`useMousePosition`)
- Configurable props: `quantity`, `staticity`, `ease`
- Always white particles with alpha variations

**Standard usage:**

```tsx
<Particles className="absolute inset-0 -z-10 animate-fade-in" quantity={200} />
```

Place inside gradient background containers for parallax effect.

### Navigation Component

`app/components/nav.tsx` uses **Intersection Observer** to toggle backdrop blur on scroll:

- Transparent at top: `bg-zinc-900/0 border-transparent`
- Solid when scrolled: `bg-zinc-900/500 border-zinc-800`
- Fixed with `z-50` for overlay

Always includes back arrow to home (`/`).

## Development Workflows

### Running the Project

```bash
pnpm install          # Install dependencies
pnpm dev              # Start dev server (localhost:3000)
pnpm build            # Production build
pnpm start            # Run production server
pnpm fmt              # Format with Rome (config in rome.json)
```

**Note:** Uses Rome for formatting/linting (not Prettier/ESLint). Run `pnpm fmt` before commits.

### Working with MDX Content

1. Add/edit MDX files in `content/projects/`
2. Contentlayer auto-generates types in `.contentlayer/generated`
3. Import from `contentlayer/generated` to access typed data
4. Dev server hot-reloads on MDX changes

### Adding New Routes (Pre-SPA Migration)

Currently uses App Router file-based routing:

- Create `app/[route]/page.tsx` for new pages
- Include `Navigation` and `Particles` components
- Add gradient background: `bg-gradient-to-tl from-indigo-900 via-indigo-400/10`
- Set metadata export for SEO

**Post-SPA migration:** All content will be sections in single `app/page.tsx` with scroll navigation.

## Migration Context (Active Work)

The **primary active task** is consolidating to SPA per `PLAN_MIGRACION_SPA.md`:

### Migration Status:

✅ **COMPLETED:**
1. Migrated from framer-motion to motion (`pnpm remove framer-motion && pnpm add motion`)
2. Installed scroll dependencies (react-scroll, react-intersection-observer)

🚧 **IN PROGRESS:**
3. Creating section components (Hero, About, Skills, etc.)
4. Consolidating `/perfil` → About section, `/contacto` → Contact section
5. Building main SPA in `app/page.tsx`

⏳ **TODO:**
6. Implement sticky navigation with scroll spy
7. Add smooth scroll between sections
8. Update all colors from indigo/purple to zinc/grayscale
9. Remove old route folders

### Key Principles:

- **Single Page:** Everything in one `app/page.tsx` with section anchors
- **Motion animations:** Use `motion` library (NOT framer-motion)
- **Grayscale only:** NO indigo/purple/violet colors
- **Smooth scroll:** Navigate via anchors (#hero, #about, #skills, etc.)

**When editing code:** Prioritize SPA consolidation. Avoid multi-page patterns.

## SEO & Metadata

Root layout (`app/layout.tsx`) defines **default metadata**:

- Title template: `"%s | geroserial.com"`
- Description: "Brindando soluciones tecnológicas..."
- OpenGraph + Twitter cards configured
- Analytics component in `<head>` (Upstash/custom)

**Per-page metadata:** Export `metadata` object in `page.tsx` files.

## Integration Points

### Upstash Redis

Used in `pages/api/incr.ts` for view counter/analytics. REST API via `@upstash/redis` package.

### Radix UI

Dialog primitive used in `proyectosDrawer.tsx`. Follow Radix patterns for other UI components.

### Embla Carousel

Used in contact page (`carouselComponent.tsx`). Config: autoplay + wheel gestures plugins.

## Common Pitfalls

1. **Missing "use client":** Components with hooks/events need client directive
2. **Font variables:** Use `font-display` (Cal Sans) for headings, default Inter for body
3. **Gradient syntax:** Always `bg-gradient-to-tl` for consistency with existing pages
4. **Animation timing:** Match 3s duration (`duration-1000` for Tailwind transitions)
5. **Contentlayer types:** Regenerate with build if schema changes

## Quick Reference

**Colors:** `zinc-50/100/300/500/700/800`, `black`, `white` (see Design System section)  
**Fonts:** `font-display` (headings), `font-sans` (body)  
**Container:** `max-w-7xl mx-auto` or `container` class  
**Spacing:** Sections use `py-8` / `py-16`, containers `px-4` / `px-6`  
**Custom text effect:** `.text-edge-outline` for stroked text
