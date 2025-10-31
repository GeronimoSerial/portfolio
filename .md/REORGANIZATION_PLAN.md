# Project Reorganization Plan

### Following Next.js 13+ Best Practices

**Date:** October 31, 2025  
**Objective:** Clean and organize project structure for maintainability and scalability

---

## Current Structure Issues

1. **Mixed component locations:**
   - `app/components/` (partial)
   - `components/` (root level - different components)
2. **Legacy routes:**

   - `app/contacto/` - Old contact route (unused, replaced by Contact section)

3. **Inconsistent naming:**

   - Some files use PascalCase, others use kebab-case

4. **Deep nesting:**
   - Portfolio components in `app/portfolio/components/`

---

## Proposed Structure (Next.js 13+ Best Practices)

```
portfolio/
├── app/                                    # Next.js App Router
│   ├── (main)/                            # Route group for main site
│   │   ├── layout.tsx                     # Main site layout
│   │   └── page.tsx                       # Home page (6 sections)
│   │
│   ├── portfolio/                         # Portfolio route
│   │   ├── layout.tsx                     # Portfolio layout (optional)
│   │   ├── page.tsx                       # Portfolio page
│   │   └── _components/                   # Portfolio-specific components (private)
│   │       ├── PortfolioHero.tsx
│   │       ├── AboutExtended.tsx
│   │       ├── SkillsComprehensive.tsx
│   │       ├── ExperienceTimeline.tsx
│   │       ├── EducationSection.tsx
│   │       ├── ProjectsShowcase.tsx
│   │       ├── ResumeDownload.tsx
│   │       └── ContactOpportunities.tsx
│   │
│   ├── layout.tsx                         # Root layout
│   └── globals.css                        # Global styles
│
├── components/                            # Shared components (used across routes)
│   ├── layout/                            # Layout components
│   │   ├── Background.tsx
│   │   └── BackToTop.tsx
│   │
│   ├── navigation/                        # Navigation components
│   │   ├── StickyNav.tsx
│   │   └── PortfolioNav.tsx
│   │
│   ├── sections/                          # Main site sections (6 active)
│   │   ├── Hero.tsx
│   │   ├── Services.tsx
│   │   ├── Process.tsx
│   │   ├── Projects.tsx
│   │   ├── Testimonials.tsx
│   │   └── Contact.tsx
│   │
│   ├── shared/                            # Shared UI components
│   │   ├── particles.tsx
│   │   ├── analytics.tsx
│   │   ├── SocialCard.tsx
│   │   └── proyectosDrawer.tsx
│   │
│   ├── mdx/                               # MDX components
│   │   └── mdx.tsx
│   │
│   └── ui/                                # UI primitives (shadcn-like)
│       ├── button.tsx
│       ├── card.tsx
│       ├── carousel.tsx
│       └── moving-border.tsx
│
├── config/                                # Configuration files
│   ├── navigation.ts
│   └── site.ts
│
├── content/                               # Content (Contentlayer)
│   └── projects/                          # MDX project files
│
├── hooks/                                 # Custom React hooks
│   ├── useDraggable.ts
│   ├── useScrollSpy.ts
│   ├── useScrollTo.ts
│   └── useSectionInView.ts
│
├── lib/                                   # Utilities & helpers
│   ├── constants.ts
│   ├── mouse.ts
│   └── utils.ts
│
├── types/                                 # TypeScript type definitions
│   ├── index.ts
│   └── mdx.d.ts
│
├── public/                                # Static assets
│   ├── assets/
│   │   ├── icons/
│   │   └── images/
│   └── fonts/
│
├── .archive/                              # Archived/legacy code
│   ├── sections/                          # Old section components
│   │   ├── About.tsx
│   │   ├── Skills.tsx
│   │   └── Experience.tsx
│   │
│   └── routes/                            # Old route components
│       └── contacto/
│           └── carouselComponent.tsx
│
└── [config files]                         # Root config files
    ├── package.json
    ├── tsconfig.json
    ├── tailwind.config.js
    ├── next.config.mjs
    └── contentlayer.config.js
```

---

## Key Changes

### 1. Move `app/sections/` → `components/sections/`

**Reason:** Sections are components, not routes. Keep routes clean in `app/`

### 2. Rename `app/portfolio/components/` → `app/portfolio/_components/`

**Reason:** Underscore prefix = private folder (Next.js convention), not a route

### 3. Move `app/contacto/` → `.archive/routes/contacto/`

**Reason:** Unused legacy route, keep for reference but remove from active structure

### 4. Consolidate `app/components/` into root `components/`

**Reason:** Single source of truth for shared components

### 5. Move `app/sections/.old/` → `.archive/sections/`

**Reason:** Centralized archive location, cleaner structure

---

## Migration Steps

### Step 1: Create new structure

```bash
mkdir -p .archive/sections .archive/routes
mkdir -p app/portfolio/_components
mkdir -p components/sections
```

### Step 2: Move active sections

```bash
mv app/sections/*.tsx components/sections/
```

### Step 3: Move legacy files

```bash
mv app/sections/.old/* .archive/sections/
mv app/contacto .archive/routes/
rmdir app/sections/.old
rmdir app/sections
```

### Step 4: Move portfolio components

```bash
mv app/portfolio/components/* app/portfolio/_components/
rmdir app/portfolio/components
```

### Step 5: Consolidate app/components

```bash
# Move card.tsx to components/ui/
mv app/components/card.tsx components/ui/
# Remove empty ui folder if exists
rmdir app/components/ui 2>/dev/null || true
# Remove empty app/components if exists
rmdir app/components 2>/dev/null || true
```

### Step 6: Update imports across codebase

- Update `app/page.tsx` section imports
- Update `app/portfolio/page.tsx` component imports
- Search/replace: `from "./sections/` → `from "@/components/sections/`
- Search/replace: `from "./components/` → `from "./_components/`

---

## Benefits

✅ **Clear separation:** Routes vs Components  
✅ **Next.js conventions:** Route groups, private folders  
✅ **Scalability:** Easy to add new routes/components  
✅ **Maintainability:** Logical grouping by function  
✅ **Clean app/ directory:** Only routes and layouts  
✅ **Centralized components:** Single source of truth  
✅ **Archived safely:** Legacy code preserved but out of the way

---

## Post-Reorganization Checklist

- [ ] All imports updated
- [ ] TypeScript compiles without errors
- [ ] Dev server runs successfully
- [ ] Production build succeeds
- [ ] Main site (/) renders correctly
- [ ] Portfolio (/portfolio) renders correctly
- [ ] Navigation works (StickyNav + PortfolioNav)
- [ ] No broken links or missing components
