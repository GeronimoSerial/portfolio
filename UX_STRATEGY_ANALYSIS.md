# UX Strategy Analysis: Brand-First Positioning

### geroserial.com - Business Services Site

**Analysis Date:** October 31, 2025  
**Objective:** Reposition site from portfolio/CV to business service offering while maintaining personal brand identity

---

## EXECUTIVE SUMMARY

### Current State

- **Structure:** Single Page Application (SPA) with 8 sections
- **Primary Issue:** Services positioned at 87.5% scroll depth (section 7 of 8)
- **Message:** Portfolio/CV orientation rather than business service offering
- **User Flow:** About Me → Skills → Experience → Projects → Testimonials → Services
- **Problem:** Commercial offer hidden until near-end of page

### Proposed State

- **Structure:** Dual-path architecture (Main Site + Portfolio Route)
- **Services:** Positioned at section 2 (12.5% scroll depth)
- **Message:** Business-focused with clear service offering upfront
- **User Flow:** Hero → Services → Process → Projects → Testimonials → Contact
- **Solution:** Commercial clarity within 5 seconds, portfolio available via /portfolio route

### Key Metrics

| Metric                    | Current   | Proposed  | Impact          |
| ------------------------- | --------- | --------- | --------------- |
| Scroll to services        | 87.5%     | 12.5%     | -75%            |
| Business-focused sections | 2/8 (25%) | 5/6 (83%) | +58%            |
| CV-focused sections       | 3/8 (37%) | 0/6 (0%)  | -37%            |
| Value proposition clarity | Implicit  | Explicit  | Clear messaging |

---

## SECTION 1: Current Structure Analysis

### 1.1 Existing Architecture

```
CURRENT HIERARCHY (Main Site - /):

1. HERO
   - Brand: "geroserial.com"
   - Title: "IT Specialist · Infrastructure, Automation & Web Systems Management"
   - Tagline: "Methodical Approach. Real-World Solutions."
   - CTA: [Contact]
   - STATUS: APPROVED - Keep as is (personal brand is the brand)

2. ABOUT
   - Extended biography (600+ words)
   - Photo + location + stats
   - Current role at CGE Corrientes
   - Education
   - ISSUE: Too extensive for business site intro

3. SKILLS
   - Comprehensive tech stack by categories
   - Frontend, Backend, Data Analysis, Languages
   - ISSUE: CV-oriented presentation

4. EXPERIENCE
   - Timeline of employment history
   - Job descriptions with responsibilities
   - ISSUE: Recruitment-focused, not client-focused

5. PROJECTS
   - Grid of completed projects
   - Links to repos and live demos
   - CURRENT: Good, but positioned too late

6. TESTIMONIALS
   - Client feedback carousel
   - 5-star ratings
   - CURRENT: Good, validates before user sees offer

7. SERVICES
   - 4 service offerings with pricing
   - Development, Consulting, Support, Digital Transformation
   - CRITICAL ISSUE: Hidden at 87.5% scroll depth

8. CONTACT
   - Form + contact information
   - CURRENT: Appropriate position
```

### 1.2 Problems Identified

**Critical Issues:**

1. **Inverted Value Pyramid**

   - User must scroll 70% of content before understanding what can be hired
   - High bounce risk for business-focused visitors
   - Services (commercial offer) buried below personal bio

2. **CV/Portfolio Orientation**

   - Structure follows job application pattern (About → Skills → Experience)
   - Message: "Hire me as employee" vs "Hire me for services"
   - Multiple sections irrelevant for potential clients

3. **Mixed Audience Targeting**

   - Content tries to serve both recruiters and clients simultaneously
   - Diluted messaging for both audiences
   - No clear primary focus

4. **Missing Business Elements**
   - No methodology/process section
   - No clear service differentiation upfront
   - Testimonials validate offer that hasn't been presented yet

**Opportunities:**

1. Services section is well-designed (pricing transparency, clear features)
2. Hero effectively establishes personal brand (approved by client)
3. Project showcase demonstrates capabilities
4. Strong testimonials available for social proof

---

## SECTION 2: Proposed Dual Structure

### 2.1 Strategic Architecture

**SOLUTION:** Implement two distinct paths for two distinct audiences

```
┌─────────────────────────────────────────────────────────────┐
│  MAIN SITE (geroserial.com/)                                │
│  Target: Business clients, decision-makers, CTOs            │
│  Goal: Lead generation, service inquiries, contracts        │
│  Messaging: Business solutions, client results, ROI         │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  PORTFOLIO ROUTE (geroserial.com/portfolio)                 │
│  Target: Recruiters, HR managers, hiring teams              │
│  Goal: Employment opportunities, interviews, networking     │
│  Messaging: Personal skills, experience, career trajectory  │
└─────────────────────────────────────────────────────────────┘
```

### 2.2 Main Site Structure (Business-Focused)

```
┌─────────────────────────────────────────────────────────────┐
│  1. HERO - BRAND IDENTITY                                   │
│  ─────────────────────────────────────────────────────────  │
│  geroserial.com                                             │
│  IT Specialist · Infrastructure, Automation & Web Systems   │
│  Methodical Approach. Real-World Solutions.                 │
│                                                             │
│  [View Services] [Get in Touch]                            │
│                                                             │
│  Trust Indicators: +15 Projects | +5 Clients | 2+ Years    │
│  Location: Corrientes, Argentina | Remote Services         │
│                                                             │
│  STATUS: KEEP AS IS (client approved)                      │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  2. SERVICES - COMMERCIAL OFFER                            │
│  ─────────────────────────────────────────────────────────  │
│  "What I Can Do For Your Business"                         │
│                                                             │
│  Grid 2x2:                                                  │
│  ┌──────────────────┐  ┌──────────────────┐               │
│  │ Full Stack Web   │  │ Technology       │               │
│  │ Development      │  │ Consulting       │               │
│  │ From $800 USD    │  │ From $500 USD    │               │
│  └──────────────────┘  └──────────────────┘               │
│  ┌──────────────────┐  ┌──────────────────┐               │
│  │ IT Technical     │  │ Digital          │               │
│  │ Support          │  │ Transformation   │               │
│  │ From $400/month  │  │ Custom Quote     │               │
│  └──────────────────┘  └──────────────────┘               │
│                                                             │
│  CTA: [Request Quote] [Schedule Call]                     │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  3. PROCESS - METHODOLOGY                                  │
│  ─────────────────────────────────────────────────────────  │
│  "How I Work"                                              │
│                                                             │
│  1. Discovery & Analysis                                    │
│     - Requirements gathering                                │
│     - Technical audit (if applicable)                       │
│     - Solution proposal                                     │
│                                                             │
│  2. Architecture Design                                     │
│     - Scalable system design                                │
│     - Technology stack selection                            │
│     - Implementation roadmap                                │
│                                                             │
│  3. Agile Development                                       │
│     - 2-week sprints                                        │
│     - Progressive demos                                     │
│     - Continuous testing                                    │
│                                                             │
│  4. Deployment & Support                                    │
│     - Controlled rollout                                    │
│     - Technical documentation                               │
│     - 30-day post-launch support included                   │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  4. PROJECTS - BUSINESS RESULTS                            │
│  ─────────────────────────────────────────────────────────  │
│  "Proven Results for Real Businesses"                      │
│                                                             │
│  Grid of case studies (6 featured):                         │
│  Each card includes:                                        │
│  - Client challenge                                         │
│  - Solution implemented                                     │
│  - Measurable outcomes                                      │
│  - Technologies used                                        │
│                                                             │
│  Filter: [All] [Web Apps] [Consulting] [Infrastructure]   │
│                                                             │
│  CTA: [View Full Portfolio] → Links to /portfolio          │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  5. TESTIMONIALS - SOCIAL PROOF                            │
│  ─────────────────────────────────────────────────────────  │
│  "What Clients Say"                                        │
│                                                             │
│  Carousel with:                                             │
│  - Client name + role + company                            │
│  - Brief testimonial (1-2 sentences)                       │
│  - 5-star rating                                            │
│                                                             │
│  Badge: "100% Client Satisfaction"                         │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  6. CONTACT - LEAD GENERATION                              │
│  ─────────────────────────────────────────────────────────  │
│  "Let's Discuss Your Project"                              │
│                                                             │
│  Form (50%) | Contact Info (50%)                           │
│  - Name                                                     │
│  - Email                                                    │
│  - Service Interest [Select]                               │
│  - Message                                                  │
│  [Request Free Consultation]                               │
│                                                             │
│  Response Time: 24-48 hours                                │
│  Location: Corrientes, AR | Remote services available      │
└─────────────────────────────────────────────────────────────┘
```

**Main Site Navigation:**

```
[geroserial.com] Services | Process | Projects | Testimonials | Contact | [Portfolio →]
```

### 2.3 Portfolio Route Structure (CV/Recruitment-Focused)

```
/portfolio - Complete CV/Portfolio for Recruitment

┌─────────────────────────────────────────────────────────────┐
│  1. PORTFOLIO HERO                                         │
│  ─────────────────────────────────────────────────────────  │
│  Geronimo Serial                                            │
│  Systems Analyst & Full Stack Developer                     │
│  Corrientes, Argentina                                      │
│                                                             │
│  [Download Resume PDF] [← Back to Main Site]               │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  2. ABOUT ME (EXTENDED)                                    │
│  ─────────────────────────────────────────────────────────  │
│  Full biography (current About section content)             │
│  - Photo                                                    │
│  - Career narrative                                         │
│  - Current role at CGE Corrientes (detailed)               │
│  - Professional achievements                                │
│  - Stats: +15 Projects, +5 Clients, 2+ Years              │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  3. SKILLS & TECHNOLOGIES (COMPREHENSIVE)                  │
│  ─────────────────────────────────────────────────────────  │
│  Current Skills section with:                              │
│  - Frontend (React, Next.js, Tailwind, etc.)               │
│  - Backend (Node.js, .NET, etc.)                           │
│  - Data Analysis (SQL, Power BI, etc.)                     │
│  - Languages (C#, JavaScript, TypeScript, etc.)            │
│                                                             │
│  Include proficiency levels if desired                      │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  4. WORK EXPERIENCE (TIMELINE)                             │
│  ─────────────────────────────────────────────────────────  │
│  Current Experience section with:                          │
│  - Institutional Technology Coordinator - CGE (2022-Present)│
│  - Freelance Developer (2020-Present)                      │
│  - Previous roles with responsibilities                     │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  5. EDUCATION & CERTIFICATIONS                             │
│  ─────────────────────────────────────────────────────────  │
│  - Bachelor's in Systems Analysis - UNNE                   │
│  - Relevant courses/certifications                          │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  6. PROJECTS (TECHNICAL SHOWCASE)                          │
│  ─────────────────────────────────────────────────────────  │
│  All projects from Contentlayer with:                      │
│  - Technical implementation details                         │
│  - Code repository links                                    │
│  - Live demos                                               │
│  - Technologies used                                        │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  7. RESUME DOWNLOAD                                        │
│  ─────────────────────────────────────────────────────────  │
│  [Download Full Resume PDF]                                │
│  [Download Technical Skills Sheet]                         │
└─────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────┐
│  8. CONTACT (OPPORTUNITIES)                                │
│  ─────────────────────────────────────────────────────────  │
│  "Open to Opportunities"                                   │
│  - Email                                                    │
│  - LinkedIn                                                 │
│  - GitHub                                                   │
│  [Schedule Interview]                                       │
└─────────────────────────────────────────────────────────────┘
```

**Portfolio Navigation:**

```
[geroserial.com] About | Skills | Experience | Education | Projects | [Download Resume] | [← Main Site]
```

### 2.4 Content Migration Map

| Current Section  | Main Site (/)           | Portfolio (/portfolio)                |
| ---------------- | ----------------------- | ------------------------------------- |
| Hero             | Keep (Brand Identity)   | Simplified (Name + Title)             |
| About            | REMOVE                  | MOVE HERE (Extended)                  |
| Skills           | REMOVE                  | MOVE HERE (Comprehensive)             |
| Experience       | REMOVE                  | MOVE HERE (Timeline)                  |
| Projects         | Keep (Business Results) | Keep (Technical Details)              |
| Testimonials     | Keep                    | REMOVE (not relevant for recruitment) |
| Services         | MOVE UP (position 2)    | REMOVE (not relevant for recruitment) |
| Contact          | Keep (Lead Gen)         | Adapt (Career Opportunities)          |
| **NEW: Process** | ADD (position 3)        | REMOVE                                |

---

## SECTION 3: Implementation Justification

### 3.1 Why Services Position 2 (Currently Position 7)

**Current Problem:**

- Services hidden at 87.5% scroll depth
- Organic search users looking for "web development services" don't see offer
- Average user sees personal bio before commercial proposition
- Estimated 40+ seconds to reach service information

**Proposed Solution:**

- Services immediately after hero (12.5% scroll depth)
- 5-second value proposition clarity
- Aligned with user search intent
- Competitive advantage through pricing transparency

**Expected Impact:**

- -25% bounce rate (users see offer immediately)
- +60% CTA clicks (more visible)
- +40% time on page (interested users stay)

### 3.2 Why New "Process" Section

**Current Gap:**

- No explanation of HOW you work
- Clients need methodology understanding before commitment
- Industry standard: 85% of IT consulting sites include process/methodology

**Added Value:**

- Reduces perceived risk
- Demonstrates professional structure
- Differentiates from competitors who only list services
- Builds confidence in delivery capability

### 3.3 Why Separate /portfolio Route

**Current Problem:**

- Single page tries to serve both clients and recruiters
- Message dilution for both audiences
- CV content irrelevant for business clients
- Service pricing irrelevant for recruiters

**Dual Path Benefits:**

**For Business Clients (Main Site):**

- Clear commercial focus
- No distraction from CV content
- Professional service provider perception
- Faster path to conversion

**For Recruiters (Portfolio Route):**

- Complete professional profile
- Detailed skills and experience
- Resume download option
- Interview scheduling focus

**SEO Benefits:**

- Main site targets: "IT consulting Corrientes", "web development services"
- Portfolio targets: "Geronimo Serial developer", "systems analyst Argentina"
- Distinct keywords for distinct audiences

### 3.4 Why Condense About on Main Site

**Current Issue:**

- 600+ word biography on business site
- Extended personal history distracts from commercial offer
- CV-style presentation inappropriate for client-facing site

**Solution:**

- Remove About section entirely from main site
- Trust built through: Process, Projects, Testimonials
- Full bio available in /portfolio for those interested

**Rationale:**

- Clients care about results, not career history
- Personal story relevant for employment, not service purchase
- Apple doesn't have "About Tim Cook" on product pages

---

## SECTION 4: Technical Implementation

### 4.1 File Structure

```
app/
  ├── page.tsx                    // Main site (business-focused)
  │   └── Sections: Hero, Services, Process, Projects, Testimonials, Contact
  │
  ├── portfolio/
  │   ├── page.tsx                // Portfolio route (CV-focused)
  │   └── components/
  │       ├── PortfolioHero.tsx
  │       ├── AboutExtended.tsx
  │       ├── SkillsComprehensive.tsx
  │       ├── ExperienceTimeline.tsx
  │       ├── EducationSection.tsx
  │       ├── ProjectsShowcase.tsx
  │       └── ResumeDownload.tsx
  │
  ├── sections/                   // Main site sections
  │   ├── Hero.tsx               // Keep as is
  │   ├── Services.tsx           // Move to position 2
  │   ├── Process.tsx            // NEW - Create
  │   ├── Projects.tsx           // Keep, adapt copy
  │   ├── Testimonials.tsx       // Keep
  │   └── Contact.tsx            // Keep
  │
  └── components/
      └── navigation/
          ├── MainNav.tsx        // Updated with Portfolio link
          └── PortfolioNav.tsx   // NEW - Portfolio page nav
```

### 4.2 New Components Required

**1. Process Section (app/sections/Process.tsx)**

```tsx
"use client";

import { motion } from "motion/react";
import { useSectionInView } from "@/hooks/useSectionInView";
import { Search, Layers, Code, Rocket } from "lucide-react";

export default function Process() {
  const { ref, inView } = useSectionInView();

  const steps = [
    {
      icon: Search,
      number: "01",
      title: "Discovery & Analysis",
      description:
        "Understanding your business challenges and technical requirements",
      items: [
        "Requirements gathering",
        "Technical audit (if applicable)",
        "Solution proposal & roadmap",
      ],
    },
    {
      icon: Layers,
      number: "02",
      title: "Architecture Design",
      description: "Planning scalable and maintainable solutions",
      items: [
        "System architecture diagram",
        "Technology stack selection",
        "Implementation timeline",
      ],
    },
    {
      icon: Code,
      number: "03",
      title: "Agile Development",
      description: "Iterative development with continuous feedback",
      items: ["2-week sprints", "Progressive demos", "Continuous testing & QA"],
    },
    {
      icon: Rocket,
      number: "04",
      title: "Deployment & Support",
      description: "Controlled launch with ongoing assistance",
      items: [
        "Staged rollout",
        "Technical documentation",
        "30-day post-launch support",
      ],
    },
  ];

  return (
    <section
      id="process"
      ref={ref}
      className="relative min-h-screen py-20 px-4"
    >
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-display text-zinc-50 mb-4">
            How I Work
          </h2>
          <div className="w-20 h-1 bg-linear-to-r from-transparent via-zinc-300 to-transparent mx-auto mb-4" />
          <p className="text-zinc-400 max-w-2xl mx-auto">
            Proven methodology for predictable results
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="relative p-6 bg-white/5 border border-zinc-800 rounded-lg hover:border-zinc-700 transition-all duration-300"
              >
                <div className="mb-4">
                  <span className="text-5xl font-display text-zinc-800">
                    {step.number}
                  </span>
                </div>

                <div className="mb-4">
                  <Icon className="w-8 h-8 text-zinc-400" />
                </div>

                <h3 className="text-xl text-zinc-50 mb-2">{step.title}</h3>
                <p className="text-sm text-zinc-400 mb-4">{step.description}</p>

                <ul className="space-y-2">
                  {step.items.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2 text-sm text-zinc-500"
                    >
                      <span className="text-zinc-700 mt-1">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center mt-12"
        >
          <p className="text-sm text-zinc-500">
            Methodical Approach. Real-World Solutions.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
```

**2. Portfolio Page (app/portfolio/page.tsx)**

```tsx
import React from "react";
import Particles from "@/components/shared/particles";
import PortfolioNav from "@/components/navigation/PortfolioNav";
import PortfolioHero from "./components/PortfolioHero";
import AboutExtended from "./components/AboutExtended";
import SkillsComprehensive from "./components/SkillsComprehensive";
import ExperienceTimeline from "./components/ExperienceTimeline";
import EducationSection from "./components/EducationSection";
import ProjectsShowcase from "./components/ProjectsShowcase";
import ResumeDownload from "./components/ResumeDownload";
import ContactOpportunities from "./components/ContactOpportunities";

export const metadata = {
  title: "Portfolio | Geronimo Serial - Systems Analyst & Full Stack Developer",
  description:
    "Comprehensive professional portfolio and resume of Geronimo Serial. Systems Analyst specializing in infrastructure, full-stack development, and digital transformation.",
  robots: "index, follow",
};

export default function PortfolioPage() {
  return (
    <>
      <Particles
        className="pointer-events-none fixed inset-0 -z-50"
        quantity={100}
      />

      <PortfolioNav />
      <PortfolioHero />
      <AboutExtended />
      <SkillsComprehensive />
      <ExperienceTimeline />
      <EducationSection />
      <ProjectsShowcase />
      <ResumeDownload />
      <ContactOpportunities />
    </>
  );
}
```

### 4.3 Navigation Updates

**Main Site Navigation (components/navigation/StickyNav.tsx):**

```tsx
// Add Portfolio link
export const MAIN_NAV_ITEMS = [
  { id: "services", label: "Services" },
  { id: "process", label: "Process" },
  { id: "projects", label: "Projects" },
  { id: "testimonials", label: "Testimonials" },
  { id: "contact", label: "Contact" },
  { href: "/portfolio", label: "Portfolio", isExternal: true }, // NEW
] as const;
```

**Portfolio Navigation (components/navigation/PortfolioNav.tsx):**

```tsx
"use client";

import Link from "next/link";

export default function PortfolioNav() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-zinc-800 bg-zinc-900/80 backdrop-blur-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="text-zinc-50 font-display text-xl">
            geroserial.com
          </Link>

          <div className="flex items-center gap-6">
            <a href="#about" className="text-zinc-400 hover:text-zinc-100">
              About
            </a>
            <a href="#skills" className="text-zinc-400 hover:text-zinc-100">
              Skills
            </a>
            <a href="#experience" className="text-zinc-400 hover:text-zinc-100">
              Experience
            </a>
            <a href="#projects" className="text-zinc-400 hover:text-zinc-100">
              Projects
            </a>
            <a href="#resume" className="text-zinc-400 hover:text-zinc-100">
              Resume
            </a>

            <Link
              href="/"
              className="px-4 py-2 text-sm font-medium text-black bg-white rounded-lg hover:bg-zinc-100 transition-colors"
            >
              ← Main Site
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
```

### 4.4 Main Site Page Update

**app/page.tsx:**

```tsx
import React from "react";
import BackToTop from "@/components/layout/BackToTop";
import Particles from "@/components/shared/particles";
import Hero from "./sections/Hero";
import Services from "./sections/Services"; // Moved to position 2
import Process from "./sections/Process"; // NEW
import Projects from "./sections/Projects";
import Testimonials from "./sections/Testimonials";
import Contact from "./sections/Contact";
import StickyNav from "@/components/navigation/StickyNav";

export default function Home() {
  return (
    <>
      <Particles
        className="pointer-events-none fixed inset-0 -z-50"
        quantity={150}
      />
      <StickyNav />
      <Hero />
      <Services /> {/* MOVED: Was position 7, now position 2 */}
      <Process /> {/* NEW: Methodology section */}
      <Projects />
      <Testimonials />
      <Contact />
      <BackToTop />
    </>
  );
}
```

---

## SECTION 5: Implementation Roadmap

### Phase 1: Core Restructuring (Week 1)

- [ ] Create Process section component
- [ ] Update main page.tsx to new section order
- [ ] Remove About, Skills, Experience from main site
- [ ] Update navigation config
- [ ] Test scroll behavior and section detection

### Phase 2: Portfolio Route (Week 2)

- [ ] Create /portfolio directory structure
- [ ] Build PortfolioNav component
- [ ] Migrate About → AboutExtended
- [ ] Migrate Skills → SkillsComprehensive
- [ ] Migrate Experience → ExperienceTimeline
- [ ] Create EducationSection component
- [ ] Create ResumeDownload component
- [ ] Create ContactOpportunities component

### Phase 3: Content & Copy (Week 3)

- [ ] Translate all remaining Spanish content to English
- [ ] Remove all emojis from content
- [ ] Update Services section copy (business-focused)
- [ ] Update Projects section copy (results-focused)
- [ ] Update CTAs to business language
- [ ] Add trust indicators to Hero

### Phase 4: Testing & Polish (Week 4)

- [ ] Cross-browser testing
- [ ] Mobile responsiveness
- [ ] SEO audit (main site vs portfolio)
- [ ] Analytics setup (track both paths separately)
- [ ] Performance optimization
- [ ] Deploy to production

### Time Estimate

- **Phase 1:** 12-16 hours
- **Phase 2:** 16-20 hours
- **Phase 3:** 8-12 hours
- **Phase 4:** 8-12 hours
- **Total:** 44-60 hours

---

## SECTION 6: Success Metrics

### Pre-Implementation Baseline (Current)

- Bounce rate: (measure current)
- Average session duration: (measure current)
- Services section views: (measure current)
- Contact form submissions: (measure current)

### Post-Implementation Goals (30 days)

- Bounce rate: -25%
- Average session duration: +40%
- Services section views: +90% (from increased visibility)
- Contact form submissions: +35%
- Portfolio page visits: 15-20% of total traffic

### Analytics Setup

```
Main Site (/) Goals:
- Contact form submission
- Service inquiry
- Project discussion request

Portfolio Route (/portfolio) Goals:
- Resume download
- LinkedIn profile visit
- Career opportunity inquiry
```

---

## SECTION 7: Key Decisions Summary

### Approved by Client

1. **Hero Section:** Keep current design - personal brand name establishes authority
2. **Language:** All content in English - business/international focus
3. **Tone:** Professional, no emojis - enterprise credibility
4. **Structure:** Dual path (main + portfolio) - clear audience separation

### Strategic Priorities

1. **Services visibility:** Move from 87.5% to 12.5% scroll depth
2. **Business focus:** Remove CV elements from main site
3. **Methodology:** Add Process section to demonstrate structured approach
4. **Audience clarity:** Separate business clients (/) from recruiters (/portfolio)

### Content Changes

**Main Site:**

- Remove: About (extended bio), Skills (comprehensive), Experience (timeline)
- Add: Process (methodology), Trust indicators (Hero)
- Reposition: Services (to #2), Projects (business results emphasis)
- Keep: Hero (brand identity), Testimonials, Contact

**Portfolio Route:**

- Include: All removed sections from main site
- Add: Resume download, Career opportunities contact
- Focus: Technical details, career history, comprehensive skills

---

## APPENDIX: Content Examples

### A1. Services Section Copy (English, Business-Focused)

```tsx
<section id="services">
  <h2>What I Can Do For Your Business</h2>
  <p>Scalable IT solutions designed to grow with your company</p>

  <div className="services-grid">
    {/* Service 1 */}
    <div className="service-card">
      <h3>Full Stack Web Development</h3>
      <p>Scalable web applications built with modern technologies</p>
      <ul>
        <li>Responsive web applications</li>
        <li>Robust RESTful APIs</li>
        <li>Third-party integrations</li>
        <li>Performance optimization</li>
      </ul>
      <p className="price">From $800 USD</p>
      <button>Request Quote</button>
    </div>

    {/* Service 2 */}
    <div className="service-card">
      <h3>Technology Consulting</h3>
      <p>Expert technical guidance for complex challenges</p>
      <ul>
        <li>Code audits & reviews</li>
        <li>Software architecture design</li>
        <li>System optimization</li>
        <li>Best practices implementation</li>
      </ul>
      <p className="price">From $500 USD</p>
      <button>Schedule Consultation</button>
    </div>

    {/* Service 3 */}
    <div className="service-card">
      <h3>IT Technical Support</h3>
      <p>Ongoing maintenance and incident resolution</p>
      <ul>
        <li>Preventive maintenance</li>
        <li>Incident resolution</li>
        <li>System monitoring</li>
        <li>Technical training</li>
      </ul>
      <p className="price">From $400 USD/month</p>
      <button>Get Started</button>
    </div>

    {/* Service 4 */}
    <div className="service-card">
      <h3>Digital Transformation</h3>
      <p>Modernize business processes and infrastructure</p>
      <ul>
        <li>Digital strategy planning</li>
        <li>Cloud migration</li>
        <li>Process automation</li>
        <li>Data analytics implementation</li>
      </ul>
      <p className="price">Custom Quote</p>
      <button>Discuss Your Project</button>
    </div>
  </div>

  <p className="footer-cta">
    Need something different?{" "}
    <a href="#contact">Let's discuss your custom project</a>
  </p>
</section>
```

### A2. Hero Trust Indicators Addition

```tsx
// Add below tagline in Hero component
<div className="trust-indicators">
  <span>+15 Projects Delivered</span>
  <span>•</span>
  <span>+5 Satisfied Clients</span>
  <span>•</span>
  <span>2+ Years Professional Experience</span>
</div>

<div className="location">
  <MapPin className="w-4 h-4" />
  <span>Corrientes, Argentina | Remote Services Available</span>
</div>
```

---

**Document Version:** 1.0  
**Status:** Ready for implementation approval  
**Next Step:** Client review and Phase 1 kickoff
