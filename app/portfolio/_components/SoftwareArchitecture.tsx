import { Boxes, Layers2, TestTube2 } from "lucide-react";
import type { ComponentType } from "react";

const softwareCases = [
	{
		title: "Arquitectura por capas",
		decision: "Separo responsabilidades para que cada modulo cambie sin romper el resto.",
		implementation:
			"Organizo actions, services y repositories con contratos claros entre capas.",
		result: "Mantengo codigo legible, mantenible y facil de escalar.",
		icon: Layers2,
	},
	{
		title: "Modelado de dominio",
		decision: "Llevo reglas de negocio al dominio y no las disperso en controladores.",
		implementation:
			"Aplico patrones de Domain-Driven Design en entidades, objetos de valor y limites de contexto.",
		result: "Reduzco deuda conceptual y represento mejor las reglas del negocio.",
		icon: Boxes,
	},
	{
		title: "Testing con criterio",
		decision: "Priorizo pruebas donde el riesgo operativo y funcional es mayor.",
		implementation:
			"Combino pruebas unitarias, de integracion y E2E para cubrir caminos criticos.",
		result: "Hago cambios mas seguros y reduzco regresiones en produccion.",
		icon: TestTube2,
	},
];

function SoftwarePanel({
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
					<p className="mb-1 text-xs uppercase tracking-wide text-zinc-500">Decision que tome</p>
					<p className="text-zinc-300">{decision}</p>
				</div>
				<div>
					<p className="mb-1 text-xs uppercase tracking-wide text-zinc-500">Como lo implemente</p>
					<p className="text-zinc-400">{implementation}</p>
				</div>
				<div>
					<p className="mb-1 text-xs uppercase tracking-wide text-zinc-500">Resultado</p>
					<p className="text-zinc-200">{result}</p>
				</div>
			</div>
		</article>
	);
}

export default function SoftwareArchitecture() {
	return (
		<section id="software" className="relative px-4 py-20">
			<div className="container mx-auto max-w-6xl">
				<div className="mb-12 max-w-3xl space-y-4">
					<p className="text-sm tracking-wide text-zinc-500">Arquitectura de software</p>
					<h2 className="text-3xl font-semibold tracking-tight text-zinc-100 md:text-4xl">
						Estructuro codigo para iterar rapido sin perder claridad
					</h2>
					<p className="text-zinc-400">
						No me interesa arquitectura decorativa. Defino estructura para que el
						equipo pueda iterar, probar y desplegar con menos riesgo.
					</p>
				</div>

				<div className="grid gap-6 md:grid-cols-3">
					{softwareCases.map((item) => (
						<SoftwarePanel key={item.title} {...item} />
					))}
				</div>
			</div>
		</section>
	);
}
