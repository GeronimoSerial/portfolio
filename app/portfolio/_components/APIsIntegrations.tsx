import { Bot, Link2, Network } from "lucide-react";
import type { ComponentType } from "react";

const integrationCases = [
  {
    title: "Webhooks para flujo continuo",
    decision:
      "Uso eventos como fuente de coordinacion entre repositorio e infraestructura.",
    implementation:
      "Integro webhooks para disparar validaciones, despliegues y notificaciones operativas en canales de seguimiento.",
    result:
      "Reduzco el tiempo entre merge y disponibilidad en producción, con visibilidad completa del flujo.",
    icon: Link2,
  },
  {
    title: "Bots para monitoreo diario",
    decision:
      "Llevo el estado del sistema a canales donde el equipo ya trabaja.",
    implementation:
      "Desarrollo bots de Telegram para consultar salud de servicios, estado de procesos y eventos de despliegue.",
    result: "Resuelvo desvíos mas rapido sin depender de paneles aislados.",
    icon: Bot,
  },
  {
    title: "Arquitectura de integracion escalable",
    decision:
      "Defino contratos claros y versionado en APIs antes de escalar consumo.",
    implementation:
      "Armo endpoints con validacion consistente, documentacion util y manejo de errores para consumidores internos y externos.",
    result:
      "Logro integraciones predecibles y con menos roturas al evolucionar funcionalidades.",
    icon: Network,
  },
];

function IntegrationPanel({
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
            Decision que tome
          </p>
          <p className="text-zinc-300">{decision}</p>
        </div>
        <div>
          <p className="mb-1 text-xs uppercase tracking-wide text-zinc-500">
            Como lo implemente
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

export default function APIsIntegrations() {
  return (
    <section id="apis" className="relative px-4 py-20">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-12 max-w-3xl space-y-4">
          <p className="text-sm tracking-wide text-zinc-500">
            APIs e integraciones
          </p>
          <h2 className="text-3xl font-semibold tracking-tight text-zinc-100 md:text-4xl">
            Conecto sistemas sin perder control tecnico
          </h2>
          <p className="text-zinc-400">
            Trabajo integraciones para que sean operables: latencia controlada,
            errores trazables y contratos claros para cada consumidor.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {integrationCases.map((item) => (
            <IntegrationPanel key={item.title} {...item} />
          ))}
        </div>
      </div>
    </section>
  );
}
