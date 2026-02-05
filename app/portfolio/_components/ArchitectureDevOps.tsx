import { Shield, Workflow, Wrench } from "lucide-react";
import type { ComponentType } from "react";

const architectureCases = [
  {
    title: "CI/CD con cero friccion",
    decision:
      "Definir un pipeline único y consistente de test, build y deploy por producto.",
    implementation:
      "Diseño pipelines con GitHub Actions, incorporando validaciones previas, versionado coherente y despliegue automatizado sobre VPS Linux.",
    result:
      "Menos tareas manuales en los releases, entregas más predecibles y menor riesgo operativo.",
    icon: Workflow,
  },
  {
    title: "Infraestructura mantenible",
    decision:
      "Priorizo un stack simple y controlable antes que complejidad innecesaria.",
    implementation:
      "Trabajo con Docker, Nginx como reverse proxy, SSL automatizado y monitoreo de servicios críticos.",
    result:
      "Entornos previsibles, tiempos de recuperación más cortos y menor fricción operativa.",
    icon: Wrench,
  },
  {
    title: "Seguridad aplicada",
    decision:
      "Implementar seguridad por capas desde el diseño, no como un parche posterior.",
    implementation:
      "Integro validación de entradas, JWT, rate limiting y políticas de acceso contextualizadas para entornos multi-tenant.",
    result:
      "Reducción de la superficie de ataque y mejor trazabilidad de accesos.",
    icon: Shield,
  },
];

function KnowledgePanel({
  title,
  decision,
  implementation,
  result,
  icon: Icon,
}: {
  title: string;
  decision: string;
  implementation: string;
  result: string;
  icon: ComponentType<{ className?: string }>;
}) {
  return (
    <article className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
      <div className="mb-5 flex items-center gap-3">
        <div className="rounded-lg border border-white/10 bg-white/[0.02] p-2.5">
          <Icon className="h-5 w-5 text-zinc-300" />
        </div>
        <h3 className="text-lg font-medium text-zinc-100">{title}</h3>
      </div>

      <div className="space-y-4 text-sm leading-relaxed">
        <div>
          <p className="mb-1 text-xs uppercase tracking-wide text-zinc-500">
            Decisión que tomé
          </p>
          <p className="text-zinc-300">{decision}</p>
        </div>
        <div>
          <p className="mb-1 text-xs uppercase tracking-wide text-zinc-500">
            Cómo lo implementé
          </p>
          <p className="text-zinc-400">{implementation}</p>
        </div>
        <div>
          <p className="mb-1 text-xs uppercase tracking-wide text-zinc-500">
            Resultado
          </p>
          <p className="text-zinc-200">{result}</p>
        </div>
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
            En esta sección expongo decisiones de arquitectura y operación que
            aplico para desplegar, proteger y mantener sistemas sin frenar al
            equipo.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {architectureCases.map((item) => (
            <KnowledgePanel key={item.title} {...item} />
          ))}
        </div>
      </div>
    </section>
  );
}
