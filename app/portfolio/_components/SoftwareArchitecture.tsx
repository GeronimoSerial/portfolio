import { Boxes, Layers2 } from "lucide-react";
import type { ComponentType } from "react";

const softwareCases = [
  {
    title: "Arquitectura por capas",
    summary:
      "Organizo actions, services y repositories con contratos claros y dependencias controladas.",
    impact:
      "Codigo legible y mantenible, preparado para escalar funcional y tecnicamente.",
    icon: Layers2,
  },
  {
    title: "Modelado de dominio",
    summary:
      "Aplico principios de Domain-Driven Design en entidades, objetos de valor y limites de contexto.",
    impact:
      "Menor deuda conceptual y una representacion mas fiel de las reglas del negocio.",
    icon: Boxes,
  },
];

function SoftwarePanel({
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

export default function SoftwareArchitecture() {
  return (
    <section id="software" className="relative px-4 py-20">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-12 max-w-3xl space-y-4">
          <p className="text-sm tracking-wide text-zinc-500">
            Arquitectura de software
          </p>
          <h2 className="text-3xl font-semibold tracking-tight text-zinc-100 md:text-4xl">
            Estructuro el código para iterar rápido sin perder claridad.
          </h2>
          <p className="text-zinc-400">
            Defino estructuras que permiten probar, desplegar y evolucionar el
            sistema con menor riesgo.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {softwareCases.map((item) => (
            <SoftwarePanel key={item.title} {...item} />
          ))}
        </div>
      </div>
    </section>
  );
}
