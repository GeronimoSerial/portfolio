import { Database, Gauge } from "lucide-react";
import type { ComponentType } from "react";

const metricSnapshots = [
  { label: "Query crítica", from: "850 ms", to: "45 ms" },
  { label: "Respuesta API", from: "320 ms", to: "85 ms" },
];

const performanceCases = [
  {
    title: "Datos con aislamiento real",
    summary:
      "Aplico Row Level Security en PostgreSQL con políticas alineadas al contexto de cada organización.",
    impact:
      "Menor riesgo de fuga de datos y mayor confianza operativa en entornos multi-tenant.",
    icon: Database,
  },
  {
    title: "Performance guiada por medición",
    summary:
      "Analizo planes de ejecución, ajusto índices y aplico cache según el patrón de consumo.",
    impact:
      "Reducción sostenida de latencia en consultas y endpoints de alto tráfico.",
    icon: Gauge,
  },
];

function PerformancePanel({
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

export default function DataPerformance() {
  return (
    <section id="performance" className="relative px-4 py-20">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-12 max-w-3xl space-y-4">
          <p className="text-sm tracking-wide text-zinc-500">
            Data y performance
          </p>
          <h2 className="text-3xl font-semibold tracking-tight text-zinc-100 md:text-4xl">
            Optimizo datos y performance con foco en producción real.
          </h2>
          <p className="text-zinc-400">
            Mido, ajusto y vuelvo a medir para reducir latencia y sostener
            estabilidad en producción.
          </p>
        </div>

        <div className="mb-8 grid gap-4 md:grid-cols-2">
          {metricSnapshots.map((metric) => (
            <div
              key={metric.label}
              className="rounded-xl border border-white/10 bg-white/[0.02] p-4"
            >
              <p className="text-xs uppercase tracking-wide text-zinc-500">
                {metric.label}
              </p>
              <div className="mt-2 flex items-center gap-3 text-sm">
                <span className="text-zinc-500 line-through">
                  {metric.from}
                </span>
                <span className="text-zinc-300">{metric.to}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {performanceCases.map((item) => (
            <PerformancePanel key={item.title} {...item} />
          ))}
        </div>
      </div>
    </section>
  );
}
