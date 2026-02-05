import Image from "next/image";
import { ArrowDown, Mail, MapPin } from "lucide-react"; 

const highlights = [
  { label: "Proyectos entregados", value: "15+" },
  { label: "Organizaciones", value: "3+" },
  { label: "Años de experiencia", value: "2+" },
];

export default function PortfolioHero() {
  return (
    <section id="hero" className="relative px-4 pt-28 pb-20">
      <div className="container mx-auto max-w-6xl">
        <div className="grid gap-10 lg:grid-cols-[1.3fr_0.9fr] lg:items-start">
          <div className="space-y-8">
            <p className="text-sm tracking-wide text-zinc-500">
              Perfil profesional
            </p>
            <div className="space-y-4">
              <h1 className="text-4xl font-semibold tracking-tight text-zinc-100 md:text-6xl">
                Geronimo Serial
              </h1>
              <p className="max-w-2xl text-xl text-zinc-300 md:text-2xl">
                Ingeniero de software full-stack orientado a entornos
                productivos, especializado en arquitectura escalable,
                infraestructura y performance.
              </p>
            </div>

            <div className="max-w-2xl text-zinc-400">
              <p>
                Trabajo en sistemas multi-tenant sobre PostgreSQL con Row-Level
                Security, arquitectura por capas y despliegues automatizados en
                Linux, con foco en bajar complejidad y aumentar confiabilidad.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-sm text-zinc-400">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5">
                <MapPin className="h-4 w-4" />
                Corrientes, Argentina
              </span>
              <a
                href="mailto:contacto@geroserial.com"
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 transition-colors hover:border-white/20 hover:bg-white/10"
              >
                <Mail className="h-4 w-4" />
                contacto@geroserial.com
              </a>
            </div>

            <div className="flex flex-wrap gap-3">
              <a
                href="#architecture"
                className="inline-flex items-center gap-2 rounded-lg bg-zinc-100 px-5 py-2.5 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-200"
              >
                Ver como trabajo
                <ArrowDown className="h-4 w-4" />
              </a>
              <a
                href="#resume"
                className="inline-flex items-center rounded-lg border border-white/15 px-5 py-2.5 text-sm font-medium text-zinc-200 transition-colors hover:border-white/30 hover:bg-white/5"
              >
                Ir al CV
              </a>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <div className="mb-6 flex items-center gap-4">
              <Image
                src="/assets/images/profile_photo.jpeg"
                width={104}
                height={104}
                alt="Geronimo Serial"
                className="h-24 w-24 rounded-xl object-cover"
              />
              <div>
                <p className="text-sm text-zinc-500">Rol actual</p>
                <p className="text-zinc-200">
                  Coordinador Tecnologico Institucional
                </p>
                <p className="text-sm text-zinc-500">
                  Consejo General de Educacion
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {highlights.map((item) => (
                <div
                  key={item.label}
                  className="rounded-xl border border-white/10 bg-white/[0.02] p-4"
                >
                  <p className="text-2xl font-semibold text-zinc-100">
                    {item.value}
                  </p>
                  <p className="mt-1 text-xs text-zinc-500">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
