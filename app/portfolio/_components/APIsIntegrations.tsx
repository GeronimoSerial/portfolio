import { Bot, Link2 } from "lucide-react";
import type { ComponentType } from "react";

const integrationCases = [
  {
    title: "Webhooks para flujo continuo",
    summary:
      "Uso webhooks para disparar validaciones, despliegues y notificaciones operativas de forma automatica.",
    impact:
      "Menor tiempo entre merge y disponibilidad en produccion, con trazabilidad de punta a punta.",
    icon: Link2,
  },
  {
    title: "Bots para monitoreo diario",
    summary:
      "Desarrollo bots de Telegram para consultar salud de servicios, procesos y eventos de despliegue.",
    impact:
      "Deteccion de desvios mas rapida, sin depender de paneles aislados.",
    icon: Bot,
  },
];

function IntegrationPanel({
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

export default function APIsIntegrations() {
  return (
    <section id="apis" className="relative px-4 py-20">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-12 max-w-3xl space-y-4">
          <p className="text-sm tracking-wide text-zinc-500">
            APIs e integraciones
          </p>
          <h2 className="text-3xl font-semibold tracking-tight text-zinc-100 md:text-4xl">
            Diseño e implemento integraciones sin perder control técnico ni
            operabilidad.
          </h2>
          <p className="text-zinc-400">
            Trabajo APIs y eventos con foco en contratos claros, errores
            trazables y operacion continua.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {integrationCases.map((item) => (
            <IntegrationPanel key={item.title} {...item} />
          ))}
        </div>
      </div>
    </section>
  );
}
