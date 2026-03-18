import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CV ATS | Geronimo Serial",
  description:
    "Curriculum Vitae ATS friendly de Geronimo Serial. Perfil de Software Engineer con experiencia en desarrollo full stack, analisis de sistemas y arquitectura de soluciones.",
  alternates: {
    canonical: "/cv",
  },
};

export default function CvPage() {
  return (
    <main className="min-h-screen bg-white px-4 py-8 text-zinc-900 print:bg-white print:px-0 print:py-0 print:text-zinc-900">
      <article className="cv-ats mx-auto w-full max-w-4xl border border-zinc-200 bg-white px-6 py-8 shadow-sm print:max-w-none print:border-none print:bg-white print:px-8 print:py-6 print:shadow-none">
        <header className="border-b border-zinc-200 pb-5 print:border-zinc-300">
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 print:text-zinc-900">Geronimo Serial</h1>
          <p className="mt-2 text-base font-medium text-zinc-700 print:text-zinc-700">
            Software Engineer | Analista de Sistemas | Arquitecto de Soluciones
          </p>
          <address className="mt-4 not-italic text-sm leading-6 text-zinc-700 print:text-zinc-800">
            <p>Corrientes, Argentina</p>
            <p>
              Email: <a href="mailto:serialgeronimo@gmail.com">serialgeronimo@gmail.com</a>
            </p>
            <p>
              Portfolio: <a href="https://geroserial.com">https://geroserial.com</a>
            </p>
            <p>
              GitHub: <a href="https://github.com/geronimoserial">https://github.com/geronimoserial</a>
            </p>
          </address>
        </header>

        <section className="mt-6">
          <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-zinc-700 print:text-zinc-700">
            Perfil profesional
          </h2>
          <p className="mt-3 text-sm leading-7 text-zinc-800 print:text-zinc-900">
            Software Engineer y Analista de Sistemas con mas de 4 anos de experiencia en desarrollo full stack,
            analisis de sistemas, automatizacion de procesos, arquitectura de soluciones y analisis de datos.
            Experiencia en diseno e implementacion de plataformas web, digitalizacion de procesos
            administrativos, definicion de reglas de negocio y generacion de reportes tecnicos para soporte a
            la toma de decisiones. Stack principal: React, Next.js, Node.js, TypeScript, JavaScript,
            PostgreSQL, SQL Server, SQLite, Linux y Nginx. Perfil orientado a software engineering, system
            design, process optimization, business analysis y delivery de soluciones con impacto operativo
            medible.
          </p>
        </section>

        <section className="mt-6">
          <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-zinc-700 print:text-zinc-700">
            Competencias clave
          </h2>
          <ul className="mt-3 grid gap-2 text-sm text-zinc-800 print:text-zinc-900 md:grid-cols-2">
            <li className="leading-6">Software Engineering</li>
            <li className="leading-6">Full Stack Development</li>
            <li className="leading-6">Systems Analysis</li>
            <li className="leading-6">Solutions Architecture</li>
            <li className="leading-6">Business Rules Definition</li>
            <li className="leading-6">Process Optimization</li>
            <li className="leading-6">Workflow Automation</li>
            <li className="leading-6">Data Analysis</li>
            <li className="leading-6">Technical Reporting</li>
            <li className="leading-6">Decision Support Systems</li>
            <li className="leading-6">Database Design</li>
            <li className="leading-6">API Integration</li>
            <li className="leading-6">Requirements Analysis</li>
            <li className="leading-6">Stakeholder Communication</li>
          </ul>
        </section>

        <section className="mt-6">
          <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-zinc-700 print:text-zinc-700">
            Stack tecnico
          </h2>
          <div className="mt-3 space-y-3">
            <p className="text-sm leading-7 text-zinc-800 print:text-zinc-900">
              <span className="font-semibold text-zinc-900 print:text-zinc-900">Lenguajes:</span> JavaScript,
              TypeScript, SQL
            </p>
            <p className="text-sm leading-7 text-zinc-800 print:text-zinc-900">
              <span className="font-semibold text-zinc-900 print:text-zinc-900">Frontend:</span> React, Next.js
            </p>
            <p className="text-sm leading-7 text-zinc-800 print:text-zinc-900">
              <span className="font-semibold text-zinc-900 print:text-zinc-900">Backend:</span> Node.js, ASP.NET
            </p>
            <p className="text-sm leading-7 text-zinc-800 print:text-zinc-900">
              <span className="font-semibold text-zinc-900 print:text-zinc-900">Bases de datos:</span>
              PostgreSQL, SQL Server, SQLite
            </p>
            <p className="text-sm leading-7 text-zinc-800 print:text-zinc-900">
              <span className="font-semibold text-zinc-900 print:text-zinc-900">Infraestructura:</span> Linux,
              Nginx, VPS, TLS/SSL, Firewalls, Web security, Caching
            </p>
            <p className="text-sm leading-7 text-zinc-800 print:text-zinc-900">
              <span className="font-semibold text-zinc-900 print:text-zinc-900">Datos y automatizacion:</span>
              Power Query, Validacion de datos, Automatizacion de flujos, Reporting tecnico
            </p>
            <p className="text-sm leading-7 text-zinc-800 print:text-zinc-900">
              <span className="font-semibold text-zinc-900 print:text-zinc-900">Herramientas:</span> Git,
              GitHub, Redis, Strapi, Google Workspace, Microsoft Office
            </p>
            <p className="text-sm leading-7 text-zinc-800 print:text-zinc-900">
              <span className="font-semibold text-zinc-900 print:text-zinc-900">Metodologias:</span> Analisis
              funcional, Diseno de soluciones, Digitalizacion institucional, Mejora de procesos, Documentacion
              tecnica
            </p>
          </div>
        </section>

        <section className="mt-6">
          <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-zinc-700 print:text-zinc-700">
            Experiencia profesional
          </h2>
          <div className="mt-4 space-y-6">
            <article className="space-y-2">
              <h3 className="text-base font-semibold text-zinc-900 print:text-zinc-900">
                Consejo General de Educacion (CGE) - Ministerio de Educacion
              </h3>
              <p className="text-sm font-medium text-zinc-700 print:text-zinc-800">
                Software Engineer | Analista de Sistemas | Arquitectura de Soluciones
              </p>
              <p className="text-xs uppercase tracking-[0.14em] text-zinc-600 print:text-zinc-600">
                2021 - Actualidad
              </p>
              <p className="text-sm leading-7 text-zinc-800 print:text-zinc-900">
                <span className="font-semibold text-zinc-900 print:text-zinc-900">Tecnologias:</span> React,
                Next.js, Node.js, JavaScript, TypeScript, PostgreSQL, SQL, Power Query, Linux, Nginx, Git,
                GitHub, CI/CD
              </p>
              <ul className="list-disc space-y-2 pl-5 text-sm leading-7 text-zinc-800 print:text-zinc-900">
                <li>
                  Disene e implemente un sistema de digitalizacion de planillas educativas para 1.300 escuelas
                  y 15.600 documentos anuales, eliminando procesos administrativos en papel y generando ahorros
                  estimados entre ARS 74M y ARS 106M por ano.
                </li>
                <li>
                  Desarrolle una plataforma web institucional desde cero con capacidad para atender hasta 25.000
                  usuarios mensuales.
                </li>
                <li>
                  Defini arquitectura funcional y reglas de negocio para un sistema interministerial de Salario
                  Familiar.
                </li>
                <li>
                  Realice analisis de datos y modelado operativo sobre 1.060 escuelas para optimizar la
                  distribucion de personal de limpieza, permitiendo cubrir el 20,8% del faltante mediante
                  redistribucion interna.
                </li>
                <li>
                  Elabore reportes tecnicos y analisis para escenarios operativos, optimizacion de recursos y
                  soporte a decisiones de gestion.
                </li>
                <li>
                  Participe en iniciativas de modernizacion institucional combinando software, datos y
                  automatizacion para mejorar trazabilidad, eficiencia y escalabilidad.
                </li>
              </ul>
            </article>

            <article className="space-y-2">
              <h3 className="text-base font-semibold text-zinc-900 print:text-zinc-900">
                Freelance Software Engineer | Founder / Builder - Proyectos Independientes
              </h3>
              <p className="text-sm font-medium text-zinc-700 print:text-zinc-800">
                Full Stack Developer | Web Infrastructure | Automation
              </p>
              <p className="text-xs uppercase tracking-[0.14em] text-zinc-600 print:text-zinc-600">
                2019 - Actualidad
              </p>
              <p className="text-sm leading-7 text-zinc-800 print:text-zinc-900">
                <span className="font-semibold text-zinc-900 print:text-zinc-900">Tecnologias:</span> React,
                Next.js, Node.js, JavaScript, TypeScript, PostgreSQL, SQL, Linux, Nginx, VPS, Git, GitHub,
                Redis, Strapi
              </p>
              <ul className="list-disc space-y-2 pl-5 text-sm leading-7 text-zinc-800 print:text-zinc-900">
                <li>
                  Desarrolle soluciones web para clientes y proyectos propios, integrando desarrollo full stack,
                  automatizacion, diseno de sistemas e infraestructura.
                </li>
                <li>
                  Actue como Founder / Builder de productos digitales propios, definiendo producto, logica de
                  negocio, arquitectura tecnica y despliegue.
                </li>
                <li>
                  Construi citado.app, una plataforma para gestion de reservas, turnos y rankings de jugadores
                  en clubes y canchas de padel.
                </li>
                <li>
                  Desarrolle CLEO Resolv Streetwear, un e-commerce orientado a branding, experiencia comercial y
                  conversion.
                </li>
                <li>
                  Implemente sitios web comerciales e infraestructura personalizada en hosting, dominios y VPS.
                </li>
                <li>
                  Automatice tareas operativas y flujos de trabajo para reducir trabajo manual y mejorar
                  eficiencia.
                </li>
              </ul>
            </article>
          </div>
        </section>

        <section className="mt-6">
          <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-zinc-700 print:text-zinc-700">
            Proyectos relevantes
          </h2>
          <div className="mt-4 space-y-4">
            <article className="space-y-1">
              <h3 className="text-base font-semibold text-zinc-900 print:text-zinc-900">citado.app</h3>
              <p className="text-sm font-medium text-zinc-700 print:text-zinc-800">Founder / Builder</p>
              <p className="text-sm leading-7 text-zinc-800 print:text-zinc-900">
                Producto digital orientado a reservas, turnos, rankings y operacion de canchas de padel.
                Enfoque en business logic, UX, administracion operativa y escalabilidad del sistema.
              </p>
            </article>

            <article className="space-y-1">
              <h3 className="text-base font-semibold text-zinc-900 print:text-zinc-900">
                CLEO Resolv Streetwear
              </h3>
              <p className="text-sm font-medium text-zinc-700 print:text-zinc-800">E-commerce Project</p>
              <p className="text-sm leading-7 text-zinc-800 print:text-zinc-900">
                Proyecto de comercio electronico orientado a identidad de marca, experiencia digital,
                performance web y conversion.
              </p>
            </article>
          </div>
        </section>

        <section className="mt-6 space-y-5">
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-zinc-700 print:text-zinc-700">
              Educacion
            </h2>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-7 text-zinc-800 print:text-zinc-900">
              <li>Analista Programador Universitario - Universidad Nacional del Nordeste (UNNE)</li>
              <li>
                Licenciatura en Sistemas de Informacion - Universidad Nacional del Nordeste (UNNE) - En curso
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-zinc-700 print:text-zinc-700">
              Formacion complementaria
            </h2>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-7 text-zinc-800 print:text-zinc-900">
              <li>Programacion Full Stack - Talentos Digitales</li>
              <li>JavaScript, Algoritmos y Estructuras de Datos - FreeCodeCamp</li>
              <li>Diplomatura en Aplicacion de IA para la Educacion - UNNE</li>
            </ul>
          </div>

          <div>
            <h2 className="text-sm font-semibold uppercase tracking-[0.14em] text-zinc-700 print:text-zinc-700">
              Idiomas
            </h2>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-7 text-zinc-800 print:text-zinc-900">
              <li>Ingles - Nivel B1 (American British Academy)</li>
            </ul>
          </div>
        </section>

        <p className="mt-8 border-t border-zinc-200 pt-4 text-xs tracking-wide text-zinc-600 print:border-zinc-300 print:text-zinc-700">
          CV ATS Friendly. Ultima actualizacion: Marzo 2026.
        </p>
      </article>
    </main>
  );
}
