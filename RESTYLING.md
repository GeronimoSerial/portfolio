# RESTYLING PLAN: Portfolio Geronimo Serial

## De "Producto SaaS" a "Experto con Autoridad"

**Documento:** Plan de Restyling Completo  
**Autor:** Consultor UX/UI Senior  
**Fecha:** Enero 2026  
**Estado:** Listo para implementar

---

## EXECUTIVE SUMMARY

### Diagnóstico

El portafolio actual presenta un enfoque de **producto SaaS comercial** que despersonaliza la marca profesional:

- Precios expuestos como commodity ("Desde $2000 USD")
- Estructura de funnel de conversión (Hero → Servicios → Pricing)
- Lenguaje transaccional ("Solicitar presupuesto", "features")
- Ausencia del autor como figura central
- Cards de servicios que parecen pricing tables

### Objetivo de Transformación

Reposicionar de **"Vendedor de servicios"** a **"Experto en tecnología con trayectoria demostrable"**.

El visitante debe salir pensando:  
> *"Este profesional entiende mi problema, tiene experiencia real resolviendo desafíos similares, y quiero trabajar con él."*

No:  
> *"Tiene buenos precios, voy a pedir cotización."*

---

## PARTE 1: ANÁLISIS PROFUNDO

### 1.1 Auditoría de Componentes Actuales

#### HERO (app/_components/Hero.tsx)

| Aspecto | Estado Actual | Problema |
|---------|---------------|----------|
| **Headline** | "Soluciones tecnológicas empresariales que escalan tu negocio" | Genérico, suena a template. No menciona quién eres |
| **Subtítulo** | "Especialista en IT · Infraestructura, Automatización..." | Descripción de rol, no propuesta de valor |
| **CTA** | "Ver servicios" | Transaccional, típico de landing de ventas |
| **Posición del nombre** | Ausente en Hero | Pierdes la conexión personal inmediata |
| **Visual** | Beams/partículas abstractas | Decorativo, no comunica nada sobre ti |

**Calificación:** 4/10 para posicionamiento de experto

#### SERVICES (app/_components/Services.tsx)

| Aspecto | Estado Actual | Problema |
|---------|---------------|----------|
| **Estructura** | Grid de 4 cards con precios | Pricing table de SaaS |
| **Precios expuestos** | "Desde $2000 USD", "$500 USD", etc. | Commoditiza tu expertise |
| **Features con checks** | Listas de ✓ funcionalidades | Parece comparador de planes |
| **CTA** | "Solicitar presupuesto" | 100% transaccional |
| **Títulos de servicios** | "Estrategia y dirección tecnológica" | Buenos, pero el contexto los arruina |

**Calificación:** 3/10 - Este es el componente más problemático

#### PROCESS (app/_components/Process.tsx)

| Aspecto | Estado Actual | Problema |
|---------|---------------|----------|
| **Estructura** | 4 pasos numerados (01-04) | Correcto para metodología |
| **Contenido** | Descubrir → Diseñar → Construir → Lanzar | Genérico pero funcional |
| **Visual** | Cards con iconos y bullets | Limpio, puede mejorarse |
| **CTA final** | Botón con tagline "Descubrir · Diseñar · Construir · Lanzar" | Redundante |

**Calificación:** 6/10 - Rescatable con ajustes narrativos

#### RESULTS (app/_components/Results.tsx)

| Aspecto | Estado Actual | Problema |
|---------|---------------|----------|
| **Métricas** | +150k visitas, 5.0x rendimiento, 20+ proyectos, 99.9% uptime | Buenos números pero descontextualizados |
| **Presentación** | Cards con animaciones numéricas | Visualmente atractivo |
| **Credibilidad** | Sin atribución a proyectos específicos | Podrían parecer inventados |

**Calificación:** 7/10 - Buen componente, necesita contexto

#### FEATURED PROJECTS (app/_components/FeaturedProjects.tsx)

| Aspecto | Estado Actual | Problema |
|---------|---------------|----------|
| **Presentación** | Grid de ProjectCards | Funcional |
| **Contenido MDX** | Casos bien documentados (CGE, SGS) | Excelente material base |
| **Posición en página** | Después de Process y antes de Results | Correcto |
| **Narrativa** | "Problema · Solución · Impacto" | Estructura profesional |

**Calificación:** 8/10 - El mejor activo del sitio

#### CONTACT (app/_components/Contact.tsx)

| Aspecto | Estado Actual | Problema |
|---------|---------------|----------|
| **Headline** | "Hablemos de tu próximo proyecto" | Bien pero impersonal |
| **Campos** | Nombre, email, empresa, mensaje | Estándar |
| **Info adicional** | Email, ubicación, GitHub, LinkedIn | Correcto |
| **Availability** | "DISPONIBLE PARA PROYECTOS SELECCIONADOS" | Buen copy, transmite exclusividad |

**Calificación:** 7/10 - Ajustes menores

#### TESTIMONIALS (app/_components/Testimonials.tsx)

| Aspecto | Estado Actual | Problema Crítico |
|---------|---------------|------------------|
| **Contenido** | "Juan Pérez, CEO Tech Solutions" | **PLACEHOLDERS FALSOS** |
| **Credibilidad** | Cero | Peor que no tener testimonials |
| **Recomendación** | **ELIMINAR INMEDIATAMENTE** | Daña credibilidad |

**Calificación:** 0/10 - Debe eliminarse o reemplazarse con testimonios reales

---

### 1.2 Análisis de Narrativa y Copywriting

#### Problemas de Lenguaje Detectados

| Texto Actual | Tipo de Problema | Por Qué Falla |
|--------------|------------------|---------------|
| "Soluciones tecnológicas empresariales" | Corporate speak | Vacío, cualquiera puede decirlo |
| "Soluciones inteligentes para crecer en digital" | Buzzword soup | Genérico al extremo |
| "Desde $2000 USD" | Pricing | Reduce expertise a commodity |
| "Solicitar presupuesto" | Transaccional | Posiciona como proveedor, no experto |
| "Tu información es confidencial..." | Legal boilerplate | No aporta valor |

#### Lenguaje que SÍ Funciona (Preservar)

| Texto | Por Qué Funciona |
|-------|------------------|
| "Problema · Solución · Impacto" (casos) | Estructura consultiva |
| "Enfoque metódico. Soluciones reales." | Conciso, con carácter |
| "DISPONIBLE PARA PROYECTOS SELECCIONADOS" | Exclusividad |
| Narrativas de casos (CGE, SGS) | Storytelling con resultados |

---

### 1.3 Análisis Visual y Estético

#### Sistema de Diseño Actual

| Elemento | Implementación | Evaluación |
|----------|----------------|------------|
| **Paleta** | Zinc/Grayscale monocromática | Excelente, sofisticada |
| **Tipografía display** | Cal Sans (--font-calsans) | Elegante, buen contraste |
| **Tipografía body** | Geist Sans | Moderna, legible |
| **Espaciado** | py-20, gap-8, mb-16 | Consistente, aire suficiente |
| **Borders** | zinc-200/zinc-800 | Sutiles, apropiados |
| **Glassmorphism** | bg-white/5, backdrop-blur | Usado con moderación |
| **Dark mode** | Implementado correctamente | Coherente |

**Veredicto:** El sistema visual es sólido. No necesita cambios radicales.

#### Animaciones (GSAP)

| Hook | Uso | Evaluación |
|------|-----|------------|
| useServicesAnimations | Cards de servicios | Preservar |
| useProcessAnimations | Pasos de metodología | Preservar |
| useProjectsAnimations | Grid de proyectos | Preservar |
| useResultsAnimations | Métricas numéricas | Preservar |
| useContactAnimations | Formulario | Preservar |

**Veredicto:** Las animaciones son de calidad. Mantener todas.

---

## PARTE 2: ESTRATEGIA DE REPOSICIONAMIENTO

### 2.1 Nueva Arquitectura de Marca

#### Antes (Producto)

```
[Logo] ────────────────────────────────────────────── [Nav Items]

          SOLUCIONES TECNOLÓGICAS EMPRESARIALES
              que escalan tu negocio
              
                 [Ver servicios]
                 
────────────────────────────────────────────────────────────────

    [Card Servicio]     [Card Servicio]     [Card Servicio]
     Desde $2000         Desde $500          Desde $1000
    [Solicitar →]       [Solicitar →]       [Solicitar →]
```

#### Después (Experto)

```
[Logo: geroserial] ─────────────────────────────── [Trayectoria | Proyectos | Contacto]

                    GERONIMO SERIAL
                    
     Transformo sistemas obsoletos en infraestructura
          digital que escala con tu organización.
              
    Systems Analyst · Full-Stack Developer · Corrientes, AR
    
           [Ver mi trayectoria]    [Explorar proyectos]

────────────────────────────────────────────────────────────────

     "En 2024, lideré la digitalización de un proceso que
      eliminó el 100% del papel en la gestión de salarios
      para 10,000+ docentes en Corrientes."
      
────────────────────────────────────────────────────────────────

              PROYECTOS DE TRANSFORMACIÓN
              
    [Caso CGE]              [Caso SGS]              [Caso X]
    Portal institucional    Sistema interministerial   ...
    +28,500 usuarios/mes    Cero papel logrado
```

### 2.2 Nueva Jerarquía de Información

#### Estructura Actual (Funnel de Ventas)

1. Hero (propuesta genérica)
2. **Servicios con precios** ← Problema principal
3. Metodología
4. Proyectos
5. Resultados
6. ~~Testimonials~~ (placeholders)
7. Contacto

#### Estructura Propuesta (Narrativa de Experto)

1. **Hero Personal** (quién soy + propuesta de valor única)
2. **Statement de Impacto** (quote destacado de logro principal)
3. **Casos de Éxito** (proyectos como prueba de expertise)
4. **Competencias** (ex-servicios, reposicionados)
5. **Metodología** (cómo trabajo)
6. **Resultados Agregados** (métricas con contexto)
7. **Contacto** (conversación, no cotización)

### 2.3 Cambio de Paradigma Narrativo

| De (SaaS) | A (Experto) |
|-----------|-------------|
| "Ofrecemos servicios de..." | "Mi enfoque en..." |
| "Nuestras soluciones incluyen..." | "He liderado proyectos que..." |
| "Desde $X USD" | [Sin precio, implica premium] |
| "Solicitar presupuesto" | "Conversemos sobre tu proyecto" |
| "Features: ✓ ✓ ✓" | "Mi metodología incluye..." |
| Cards de pricing | Narrativas de expertise |
| Testimonials genéricos | Casos documentados con métricas |

---

## PARTE 3: REDISEÑO COMPONENTE POR COMPONENTE

### 3.1 HERO: Transformación Completa

#### Código Actual (Extracto)

```tsx
<h1>
  {t("title")} // "Soluciones tecnológicas empresariales que"
  <span>{t("midtitle")}</span> // "escalan tu negocio"
</h1>
<h2>{t("subtitle")}</h2> // "Especialista en IT..."
<Button>{t("cta")}</Button> // "Ver servicios"
```

#### Código Propuesto (Estructura)

```tsx
<section id="hero" className="...">
  {/* Nombre como elemento principal */}
  <h1 className="text-6xl md:text-8xl font-display">
    Geronimo Serial
  </h1>
  
  {/* Tagline con personalidad */}
  <p className="text-xl md:text-2xl text-zinc-600 dark:text-zinc-400 max-w-2xl">
    Transformo sistemas obsoletos en infraestructura digital 
    que escala con tu organización.
  </p>
  
  {/* Credenciales compactas */}
  <div className="flex items-center gap-4 text-sm text-zinc-500">
    <span>Systems Analyst</span>
    <span className="w-1 h-1 rounded-full bg-zinc-400" />
    <span>Full-Stack Developer</span>
    <span className="w-1 h-1 rounded-full bg-zinc-400" />
    <span className="flex items-center gap-1">
      <MapPin className="w-3 h-3" />
      Corrientes, Argentina
    </span>
  </div>
  
  {/* CTAs que construyen relación */}
  <div className="flex gap-4 mt-8">
    <Button href="#cases">Explorar proyectos</Button>
    <Button variant="ghost" href="#about">Mi trayectoria</Button>
  </div>
</section>
```

#### Cambios en messages/es.json

```json
{
  "hero": {
    "name": "Geronimo Serial",
    "tagline": "Transformo sistemas obsoletos en infraestructura digital que escala con tu organización.",
    "credentials": {
      "role1": "Systems Analyst",
      "role2": "Full-Stack Developer",
      "location": "Corrientes, Argentina"
    },
    "cta": {
      "primary": "Explorar proyectos",
      "secondary": "Mi trayectoria"
    }
  }
}
```

---

### 3.2 STATEMENT DE IMPACTO (Nuevo Componente)

Este componente no existe. **Crear nuevo.**

#### Propósito

Establecer credibilidad inmediata con un logro verificable.

#### Diseño Propuesto

```tsx
// app/_components/ImpactStatement.tsx
export default function ImpactStatement() {
  return (
    <section className="py-20 px-4 border-y border-zinc-200 dark:border-zinc-800">
      <div className="container mx-auto max-w-4xl text-center">
        <blockquote className="text-2xl md:text-3xl font-light text-zinc-700 dark:text-zinc-300 leading-relaxed">
          "En 2024, lideré la digitalización de un proceso interministerial 
          que eliminó el <span className="font-semibold text-zinc-900 dark:text-zinc-50">100% del papel</span> en 
          la gestión de salarios para <span className="font-semibold text-zinc-900 dark:text-zinc-50">+10,000 docentes</span> 
          en la provincia de Corrientes."
        </blockquote>
        
        <div className="mt-8 flex items-center justify-center gap-6">
          <a href="#case-sgs" className="text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-50 underline underline-offset-4">
            Ver caso completo →
          </a>
        </div>
      </div>
    </section>
  );
}
```

#### Posición

Inmediatamente después del Hero, antes de cualquier otra sección.

---

### 3.3 SERVICES → COMPETENCIAS (Transformación Radical)

#### Problema Actual

La sección "Services" es el componente más dañino para el posicionamiento:
- Precios expuestos = commoditización
- Estructura de pricing table
- CTAs transaccionales

#### Solución: Reposicionar como "Competencias" o "Áreas de Expertise"

#### Nuevo Enfoque

En lugar de "vender servicios", mostrar **áreas de dominio con contexto**.

#### Código Propuesto

```tsx
// app/_components/Expertise.tsx (renombrar Services.tsx)
export default function Expertise() {
  const t = useTranslations("expertise");
  
  const areas = [
    {
      icon: Lightbulb,
      key: "strategy",
      // Sin precios
      // Sin CTAs individuales
    },
    // ...
  ];

  return (
    <section id="expertise" className="relative min-h-screen py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header reposicionado */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-semibold mb-4">
            {t("title")} {/* "Áreas de Expertise" */}
          </h2>
          <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
            {t("subtitle")} {/* "Competencias desarrolladas a través de proyectos reales de transformación digital" */}
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {areas.map((area) => (
            <article key={area.key} className="p-8 border border-zinc-200 dark:border-zinc-800 rounded-2xl">
              <Icon className="w-8 h-8 mb-4 text-zinc-600 dark:text-zinc-400" />
              
              <h3 className="text-xl font-semibold mb-3">
                {t(`items.${area.key}.title`)}
              </h3>
              
              <p className="text-zinc-600 dark:text-zinc-400 mb-6">
                {t(`items.${area.key}.description`)}
              </p>
              
              {/* NUEVO: Ejemplo de aplicación real, no features */}
              <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800">
                <p className="text-sm text-zinc-500 italic">
                  {t(`items.${area.key}.example`)}
                  {/* Ej: "Aplicado en: Portal CGE, Sistema SGS" */}
                </p>
              </div>
              
              {/* SIN PRECIO */}
              {/* SIN CTA INDIVIDUAL */}
            </article>
          ))}
        </div>
        
        {/* CTA único al final */}
        <div className="text-center mt-16">
          <p className="text-zinc-600 dark:text-zinc-400 mb-4">
            {t("cta.text")} {/* "¿Tienes un proyecto que requiere este tipo de expertise?" */}
          </p>
          <Button href="#contact">
            {t("cta.button")} {/* "Conversemos" */}
          </Button>
        </div>
      </div>
    </section>
  );
}
```

#### Nuevos Textos para messages/es.json

```json
{
  "expertise": {
    "title": "Áreas de Expertise",
    "subtitle": "Competencias desarrolladas a través de proyectos reales de transformación digital",
    "items": {
      "strategy": {
        "title": "Estrategia y Arquitectura Tecnológica",
        "description": "Diseño de hojas de ruta digitales, análisis de sistemas existentes y definición de arquitecturas escalables que alinean tecnología con objetivos de negocio.",
        "example": "Aplicado en: Sistema Interministerial SGS, Portal CGE"
      },
      "automation": {
        "title": "Automatización y Modernización",
        "description": "Transformación de procesos manuales en flujos digitales integrados. Análisis de reglas de negocio y diseño de motores de validación automática.",
        "example": "Aplicado en: Digitalización de Salario Familiar (0% papel)"
      },
      "development": {
        "title": "Desarrollo Web y Plataformas",
        "description": "Construcción de aplicaciones web de alto rendimiento con Next.js, React y arquitecturas modernas. Enfoque en UX, SEO técnico y escalabilidad.",
        "example": "Aplicado en: consejo.mec.gob.ar (+28,500 usuarios/mes)"
      },
      "infrastructure": {
        "title": "Infraestructura y Operaciones",
        "description": "Gestión de entornos, monitoreo proactivo, optimización de rendimiento y mantenimiento evolutivo de sistemas en producción.",
        "example": "Aplicado en: Infraestructura CGE, soporte a +1,200 escuelas"
      }
    },
    "cta": {
      "text": "¿Tienes un proyecto que requiere este tipo de expertise?",
      "button": "Conversemos"
    }
  }
}
```

#### Eliminaciones Críticas

- [ ] Eliminar todos los precios de services.items.*.price
- [ ] Eliminar features con checkmarks (reemplazar por "example")
- [ ] Eliminar CTA "Solicitar presupuesto"
- [ ] Renombrar archivo de Services.tsx a Expertise.tsx
- [ ] Actualizar imports en page.tsx

---

### 3.4 FEATURED PROJECTS → CASOS DE ÉXITO (Promoción)

#### Estado Actual

Bueno, pero posicionado muy abajo en la página.

#### Cambios Propuestos

1. **Subir posición**: Mover después del Statement de Impacto
2. **Renombrar**: "Proyectos Destacados" → "Casos de Transformación"
3. **Nuevo headline**: Enfatizar resultados, no catálogo

#### Nuevos Textos

```json
{
  "cases": {
    "title": "Casos de Transformación",
    "subtitle": "Proyectos donde lideré el diseño e implementación de soluciones de alto impacto",
    "cta": "Explorar todos los proyectos"
  }
}
```

#### Mejoras en ProjectCard

Añadir métrica destacada visible en el card:

```tsx
// En ProjectCard.tsx, agregar después del título
{project.highlightMetric && (
  <div className="text-sm font-medium text-zinc-500 mb-2">
    {project.highlightMetric} {/* Ej: "+28,500 usuarios/mes" */}
  </div>
)}
```

---

### 3.5 PROCESS → MI METODOLOGÍA (Ajuste Narrativo)

#### Cambio de Enfoque

De: "Así es nuestro proceso" (impersonal, corporate)  
A: "Así es como trabajo" (personal, autoral)

#### Nuevos Textos

```json
{
  "methodology": {
    "title": "Mi Metodología",
    "subtitle": "Un enfoque estructurado para entregar soluciones que funcionan",
    "tagline": "Descubrir · Diseñar · Construir · Entregar",
    "steps": {
      "1": {
        "title": "Descubrir",
        "description": "Entiendo tu contexto antes de proponer soluciones. Analizo sistemas existentes, identifico fricciones y defino objetivos claros.",
        "items": [
          "Inmersión en el problema real",
          "Auditoría de sistemas y procesos",
          "Definición de alcance y prioridades"
        ]
      },
      "2": {
        "title": "Diseñar",
        "description": "Diseño la arquitectura técnica y experiencia de usuario antes de escribir código. Itero con feedback temprano.",
        "items": [
          "Arquitectura de información y flujos",
          "Prototipado y validación",
          "Especificación técnica detallada"
        ]
      },
      "3": {
        "title": "Construir",
        "description": "Desarrollo iterativo con entregas frecuentes. Código limpio, testing integrado y documentación continua.",
        "items": [
          "Sprints cortos con demos",
          "Integración y testing continuo",
          "Refinamiento basado en feedback"
        ]
      },
      "4": {
        "title": "Entregar",
        "description": "Despliegue controlado, transferencia de conocimiento y soporte post-lanzamiento. No desaparezco después de entregar.",
        "items": [
          "Deployment y monitoreo",
          "Documentación y capacitación",
          "Soporte evolutivo continuo"
        ]
      }
    }
  }
}
```

---

### 3.6 RESULTS → IMPACTO AGREGADO (Contextualizar)

#### Problema

Los números actuales están descontextualizados. Parecen inventados.

#### Solución

Vincular cada métrica a un proyecto específico.

#### Nuevo Diseño

```tsx
// Cada card de resultado debe tener atribución
<article className="result-card">
  <div className="text-5xl font-bold">+150k</div>
  <p className="text-sm text-zinc-500">
    Visitas al portal CGE
    <br />
    <span className="text-xs">en los primeros 20 días</span>
  </p>
  <a href="#case-cge" className="text-xs underline mt-2">
    Ver caso →
  </a>
</article>
```

#### Nuevos Textos

```json
{
  "impact": {
    "title": "Impacto Medible",
    "subtitle": "Resultados verificables de proyectos en producción",
    "stats": {
      "visits": {
        "value": "+150k",
        "label": "Visitas mensuales",
        "context": "Portal CGE",
        "link": "#case-cge"
      },
      "performance": {
        "value": "5x",
        "label": "Mejora en rendimiento",
        "context": "Optimización de carga",
        "link": "#case-cge"
      },
      "paper": {
        "value": "0%",
        "label": "Papel en proceso",
        "context": "Sistema SGS",
        "link": "#case-sgs"
      },
      "uptime": {
        "value": "99.9%",
        "label": "Disponibilidad",
        "context": "Infraestructura CGE",
        "link": "#case-cge"
      }
    }
  }
}
```

---

### 3.7 TESTIMONIALS → ELIMINAR O REEMPLAZAR

#### Decisión Crítica

**Los testimonials actuales son placeholders falsos ("Juan Pérez, CEO Tech Solutions").**

Esto es **peor que no tener testimonials**. Daña la credibilidad del sitio completo.

#### Opciones

| Opción | Acción | Recomendación |
|--------|--------|---------------|
| A | Eliminar sección completa | **Recomendado si no tienes testimonios reales** |
| B | Obtener testimonios reales y reemplazar | Ideal a mediano plazo |
| C | Reemplazar por "Organizaciones con las que he trabajado" (logos) | Alternativa viable |

#### Si Eliges Opción A (Eliminar)

```tsx
// En app/page.tsx, eliminar:
// import Testimonials from "@/app/_components/Testimonials";
// <Testimonials />

// Eliminar archivo:
// app/_components/Testimonials.tsx
```

#### Si Eliges Opción C (Logos de Organizaciones)

```tsx
// app/_components/Organizations.tsx
export default function Organizations() {
  const orgs = [
    { name: "Consejo General de Educación", logo: "/assets/logos/cge.png" },
    { name: "Ministerio de Hacienda", logo: "/assets/logos/hacienda.png" },
    // ...
  ];

  return (
    <section className="py-16 border-y border-zinc-200 dark:border-zinc-800">
      <div className="container mx-auto max-w-4xl">
        <p className="text-center text-sm text-zinc-500 mb-8">
          Organizaciones con las que he colaborado
        </p>
        <div className="flex flex-wrap justify-center items-center gap-12">
          {orgs.map((org) => (
            <img 
              key={org.name}
              src={org.logo} 
              alt={org.name}
              className="h-12 opacity-60 hover:opacity-100 transition-opacity grayscale"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
```

---

### 3.8 CONTACT → CONVERSACIÓN (Ajuste de Tono)

#### Cambios Menores

El componente está bien estructurado. Solo ajustes de copy.

#### Nuevos Textos

```json
{
  "contact": {
    "heading": {
      "line1": "¿Tienes un proyecto",
      "line2": "en mente?"
    },
    "description": "Cuéntame sobre el desafío que enfrentas. Respondo personalmente cada mensaje.",
    "form": {
      "name": {
        "label": "Tu nombre",
        "placeholder": "Nombre completo"
      },
      "email": {
        "label": "Email",
        "placeholder": "tu@email.com"
      },
      "company": {
        "label": "Organización",
        "optional": "(opcional)",
        "placeholder": "Empresa o institución"
      },
      "message": {
        "label": "Cuéntame sobre tu proyecto",
        "placeholder": "¿Qué desafío enfrentas? ¿Qué resultados buscas lograr?"
      },
      "submit": "Enviar mensaje",
      "success": "Mensaje recibido. Te respondo en las próximas 48 horas.",
      "error": "Error al enviar. Intenta nuevamente o escríbeme directamente a contact@geroserial.com"
    },
    "availability": "DISPONIBLE PARA PROYECTOS SELECCIONADOS EN 2026"
  }
}
```

---

### 3.9 NAVIGATION (Ajuste de Items)

#### Cambios

```tsx
// AnimatedNav.tsx
const navItems = [
  { id: "cases", label: t("cases") },      // antes: "projects"
  { id: "expertise", label: t("expertise") }, // antes: "services"
  { id: "methodology", label: t("methodology") }, // antes: "process"
  { id: "impact", label: t("impact") },    // antes: "results"
  { id: "contact", label: t("contact") },
];
```

#### Nuevas Claves de Traducción

```json
{
  "nav": {
    "home": "Inicio",
    "cases": "Proyectos",
    "expertise": "Expertise",
    "methodology": "Metodología",
    "impact": "Impacto",
    "contact": "Contacto"
  }
}
```

---

## PARTE 4: RECOMENDACIONES ESTÉTICAS

### 4.1 Tipografía

#### Estado Actual (Mantener)

| Uso | Fuente | Clase |
|-----|--------|-------|
| Display/Headings | Cal Sans | font-display |
| Body | Geist Sans | font-sans |
| Code/Mono | Geist Mono | font-mono |

#### Ajuste Propuesto

Añadir **Crimson Text** para citas y statements (ya está instalada pero subutilizada):

```tsx
// Para el ImpactStatement y blockquotes
<blockquote style={{ fontFamily: "var(--font-crimson-text)" }} className="italic">
  ...
</blockquote>
```

### 4.2 Colorimetría

#### Paleta Actual (Preservar)

La paleta grayscale es elegante y profesional. **No cambiar.**

| Token | Light | Dark | Uso |
|-------|-------|------|-----|
| Primary text | zinc-950 | zinc-50 | Headlines, emphasis |
| Secondary text | zinc-600 | zinc-400 | Body text |
| Muted text | zinc-500 | zinc-500 | Captions, meta |
| Borders | zinc-200 | zinc-800 | Cards, dividers |
| Backgrounds | white | black | Base |
| Surfaces | zinc-50 | zinc-900 | Cards, sections |

#### Posible Adición (Opcional)

Un **accent color** muy sutil para elementos interactivos clave:

```css
/* Solo si decides añadir un toque de color */
--accent: #3b82f6; /* Blue-500, usado con extrema moderación */
```

**Recomendación:** Mantener 100% grayscale. La restricción de color comunica sofisticación.

### 4.3 Layout y Espaciado

#### Actual (Correcto)

- Container max-width: 6xl-7xl (1152px-1280px)
- Section padding: py-20 (80px)
- Card gaps: gap-8 (32px)
- Card padding: p-6 a p-8 (24-32px)

#### Ajuste para Hero

Aumentar presencia del nombre:

```css
/* Hero name */
.hero-name {
  font-size: clamp(3rem, 8vw, 8rem); /* 48px → 128px */
  letter-spacing: -0.03em;
  line-height: 0.9;
}
```

### 4.4 Microinteracciones (Preservar)

| Componente | Animación | Estado |
|------------|-----------|--------|
| Moving Border Button | Border gradient animation | Mantener |
| Mirror Button | Reflection effect | Mantener |
| Service Cards | GSAP stagger on scroll | Mantener |
| Process Cards | Sequential reveal | Mantener |
| Result Numbers | Count-up animation | Mantener |
| Nav Items | Underline slide on hover | Mantener |

---

## PARTE 5: TABLA COMPARATIVA COMPLETA

### Estructura de Página

| Sección | ANTES | DESPUÉS | Prioridad |
|---------|-------|---------|-----------|
| Hero | Headline genérico, sin nombre | Nombre prominente + tagline personal | CRÍTICA |
| Impact Statement | No existe | NUEVO: Quote de logro principal | ALTA |
| Services | 4 cards con precios | Expertise: 4 áreas sin precios | CRÍTICA |
| Projects | Posición #4, título genérico | Posición #2, "Casos de Transformación" | ALTA |
| Process | "Metodología" impersonal | "Mi Metodología" autoral | MEDIA |
| Results | Métricas descontextualizadas | Métricas vinculadas a casos | MEDIA |
| Testimonials | Placeholders falsos | ELIMINAR o reemplazar con logos | CRÍTICA |
| Contact | Copy transaccional | Copy conversacional | MEDIA |

### Copywriting

| Elemento | ANTES | DESPUÉS |
|----------|-------|---------|
| Headline Hero | "Soluciones tecnológicas empresariales que escalan tu negocio" | "Geronimo Serial" + "Transformo sistemas obsoletos en infraestructura digital que escala con tu organización." |
| Subtítulo Hero | "Especialista en IT · Infraestructura, Automatización y Gestión de Sistemas" | "Systems Analyst · Full-Stack Developer · Corrientes, Argentina" |
| CTA Hero | "Ver servicios" | "Explorar proyectos" / "Mi trayectoria" |
| Título Services | "Servicios" | "Áreas de Expertise" |
| Subtítulo Services | "Soluciones inteligentes para crecer en digital" | "Competencias desarrolladas a través de proyectos reales" |
| Precios | "Desde $2000 USD", etc. | ELIMINADOS |
| CTA Services | "Solicitar presupuesto" | "Conversemos" |
| Título Projects | "Proyectos destacados" | "Casos de Transformación" |
| Título Process | "Metodología" | "Mi Metodología" |
| Subtítulo Process | "Una forma clara y colaborativa de crear tecnología" | "Un enfoque estructurado para entregar soluciones que funcionan" |
| Título Results | "Resultados que hablan" | "Impacto Medible" |
| Subtítulo Results | "Cada entrega refleja precisión..." | "Resultados verificables de proyectos en producción" |
| Heading Contact | "Hablemos de tu próximo proyecto" | "¿Tienes un proyecto en mente?" |
| Desc Contact | "Compartí tu visión y hagámosla realidad." | "Cuéntame sobre el desafío que enfrentas." |

### Elementos Visuales

| Elemento | ANTES | DESPUÉS | Cambio |
|----------|-------|---------|--------|
| Paleta | Grayscale | Grayscale | Sin cambio |
| Tipografía | Cal Sans + Geist | Cal Sans + Geist + Crimson (quotes) | Menor |
| Cards de servicio | Con footer de precio | Sin precio, con "ejemplo" | Estructural |
| Animaciones GSAP | Implementadas | Preservadas | Sin cambio |
| Testimonial cards | 3 cards falsos | Eliminados o logos | Crítico |
| Hero visual | Beams abstractos | Beams (mantener) | Sin cambio |

---

## PARTE 6: PLAN DE IMPLEMENTACIÓN

### Fase 1: Eliminaciones Críticas (Día 1)

- [ ] Eliminar precios de `messages/es.json` y `messages/en.json`
- [ ] Eliminar o comentar `<Testimonials />` de `app/page.tsx`
- [ ] Eliminar archivo `app/_components/Testimonials.tsx` (o mover a _old)

### Fase 2: Restructuración de Contenido (Día 2-3)

- [ ] Actualizar `messages/es.json` con nuevos textos de hero
- [ ] Actualizar `messages/en.json` con traducciones
- [ ] Renombrar sección "services" a "expertise" en traducciones
- [ ] Crear estructura de "expertise" sin precios
- [ ] Actualizar "process" a "methodology" con nuevo copy

### Fase 3: Nuevo Hero (Día 4)

- [ ] Refactorizar `app/_components/Hero.tsx` con nuevo diseño
- [ ] Añadir nombre prominente
- [ ] Actualizar CTAs
- [ ] Ajustar estilos de tipografía

### Fase 4: Impact Statement (Día 5)

- [ ] Crear `app/_components/ImpactStatement.tsx`
- [ ] Añadir a `app/page.tsx` después de Hero
- [ ] Estilizar con Crimson Text para quote

### Fase 5: Services → Expertise (Día 6-7)

- [ ] Refactorizar `app/_components/Services.tsx`
- [ ] Eliminar lógica de precios
- [ ] Añadir campo "example" para cada área
- [ ] Actualizar animaciones si es necesario

### Fase 6: Reordenamiento (Día 8)

- [ ] Mover Projects arriba en `app/page.tsx`
- [ ] Actualizar navegación en `AnimatedNav.tsx`
- [ ] Ajustar IDs de secciones

### Fase 7: Contextualización de Results (Día 9)

- [ ] Añadir atribución a cada métrica
- [ ] Vincular con casos específicos
- [ ] Actualizar textos

### Fase 8: QA y Refinamiento (Día 10)

- [ ] Revisar todos los textos en ES y EN
- [ ] Verificar animaciones
- [ ] Test en móvil
- [ ] Revisar dark mode

---

## PARTE 7: ARCHIVOS A MODIFICAR

### Críticos (Cambios mayores)

| Archivo | Acción | Descripción |
|---------|--------|-------------|
| `messages/es.json` | MODIFICAR | Nuevos textos completos |
| `messages/en.json` | MODIFICAR | Traducciones correspondientes |
| `app/_components/Hero.tsx` | REFACTORIZAR | Nuevo diseño con nombre |
| `app/_components/Services.tsx` | REFACTORIZAR | Convertir en Expertise sin precios |
| `app/_components/Testimonials.tsx` | ELIMINAR | Placeholders dañinos |
| `app/page.tsx` | MODIFICAR | Nuevo orden de secciones |

### Importantes (Cambios menores)

| Archivo | Acción | Descripción |
|---------|--------|-------------|
| `app/_components/Process.tsx` | MODIFICAR | Nuevos textos de metodología |
| `app/_components/Results.tsx` | MODIFICAR | Añadir contexto a métricas |
| `app/_components/Contact.tsx` | MODIFICAR | Ajuste de copy |
| `app/_components/FeaturedProjects.tsx` | MODIFICAR | Nuevo título |
| `components/layout/AnimatedNav.tsx` | MODIFICAR | Nuevos items de nav |

### Nuevos Archivos

| Archivo | Acción | Descripción |
|---------|--------|-------------|
| `app/_components/ImpactStatement.tsx` | CREAR | Nuevo componente |
| `app/_components/Organizations.tsx` | CREAR (opcional) | Si reemplazas testimonials con logos |

---

## PARTE 8: CHECKLIST DE VALIDACIÓN

### Antes de Publicar

- [ ] **Nombre prominente en Hero** - ¿Se ve "Geronimo Serial" grande y claro?
- [ ] **Sin precios visibles** - ¿Se eliminaron todos los "$X USD"?
- [ ] **Sin testimonials falsos** - ¿Se eliminó o reemplazó la sección?
- [ ] **Proyectos arriba** - ¿Los casos están antes que la metodología?
- [ ] **Métricas contextualizadas** - ¿Cada número tiene atribución?
- [ ] **CTAs no transaccionales** - ¿Dicen "Conversemos" no "Solicitar presupuesto"?
- [ ] **Dark mode funcional** - ¿Todos los cambios se ven bien en dark?
- [ ] **Mobile responsive** - ¿El Hero se ve bien en móvil?
- [ ] **Enlaces internos** - ¿Los nuevos IDs de sección funcionan?
- [ ] **Traducciones completas** - ¿ES y EN están actualizados?

---

## NOTAS FINALES

### Sobre los Precios

La eliminación de precios no significa que no puedas hablar de costos. Significa que:

1. **No los expones públicamente** como commodity
2. **Los discutes en conversación** después de entender el proyecto
3. **Posicionas tu trabajo como inversión**, no como gasto

Cuando un prospect pregunta "¿Cuánto cuesta?", puedes responder:
> "Depende del alcance y complejidad. Conversemos para entender tu proyecto y darte una propuesta adecuada."

### Sobre los Testimonials

Si obtienes testimoniales reales en el futuro:

1. Pide permiso por escrito
2. Incluye nombre completo, cargo y organización
3. Idealmente con foto
4. Específicos (no "Excelente trabajo", sino "Redujo nuestro tiempo de procesamiento en 60%")

### Sobre la Evolución

Este plan es un punto de partida. El posicionamiento se refina con:

1. Feedback de visitors reales
2. Métricas (bounce rate, tiempo en página)
3. Conversaciones con prospects
4. Nuevos casos de éxito

---

**Documento preparado para implementación.**  
**Próximo paso:** Comenzar con Fase 1 (Eliminaciones Críticas).
