import { Workflow, Wrench } from "lucide-react";
import type { ComponentType } from "react";

const architectureCases = [
  {
    title: "CI/CD con cero friccion",
    summary:
      "Diseno pipelines con GitHub Actions, validaciones previas y despliegue automatizado sobre VPS Linux.",
    impact: "Releases mas predecibles y menor riesgo operativo.",
    icon: Workflow,
  },
  {
    title: "Infraestructura mantenible",
    summary:
      "Trabajo con Docker, Nginx como reverse proxy, SSL automatizado y monitoreo de servicios criticos.",
    impact: "Entornos previsibles y recuperacion mas rapida ante incidentes.",
    icon: Wrench,
  },
];

function KnowledgePanel({
  title,
  summary,
  impact,
  icon: Icon,
}: {
  title: string;
  summary: string;
  impact: string;
  icon: ComponentType<{ className?: string }>;
}) {
  return (
    <article className="flex h-full flex-col rounded-2xl border border-white/10 bg-white/[0.03] p-6">
      <div className="mb-5 flex items-center gap-3">
        <div className="rounded-lg border border-white/10 bg-white/[0.02] p-2.5">
          <Icon className="h-5 w-5 text-zinc-300" />
        </div>
        <h3 className="text-lg font-medium text-zinc-100">{title}</h3>
      </div>

      <div className="space-y-3 text-sm leading-relaxed">
        <p className="text-zinc-300">{summary}</p>
        <p className="text-zinc-200">Impacto: {impact}</p>
      </div>
    </article>
  );
}

export default function ArchitectureDevOps() {
  return (
    <section id="architecture" className="relative px-4 py-20">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-12 max-w-3xl space-y-4">
          <p className="text-sm tracking-wide text-zinc-500">
            Arquitectura y operaciones
          </p>
          <h2 className="text-3xl font-semibold tracking-tight text-zinc-100 md:text-4xl">
            Diseño infraestructura para sostener carga real en produccion
          </h2>
          <p className="text-zinc-400">
            Estas son practicas que aplico para desplegar, operar y escalar
            sistemas sin sumar friccion al equipo.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {architectureCases.map((item) => (
            <KnowledgePanel key={item.title} {...item} />
          ))}
        </div>
      </div>
    </section>
  );
}
