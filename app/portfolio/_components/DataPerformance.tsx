import { Activity, Database, Gauge } from "lucide-react";
import type { ComponentType } from "react";

const metricSnapshots = [
	{ label: "Query critica", from: "850 ms", to: "45 ms" },
	{ label: "Respuesta API", from: "320 ms", to: "85 ms" },
	{ label: "Bundle inicial", from: "245 KB", to: "98 KB" },
];

const performanceCases = [
	{
		title: "Datos con aislamiento real",
		decision: "Separo acceso por tenant en base de datos y no solo en aplicacion.",
		implementation:
			"Implemento Row Level Security en PostgreSQL y reglas de consulta alineadas al contexto de cada organizacion.",
		result: "Reduzco riesgo de fuga de datos y subo la confianza operativa.",
		icon: Database,
	},
	{
		title: "Performance guiada por medicion",
		decision: "Optimizo solo despues de identificar cuellos reales.",
		implementation:
			"Analizo planes de ejecucion, ajusto indices y aplico cache por tipo de consumo.",
		result: "Consigo una reduccion sostenida de latencia en consultas y endpoints de alto trafico.",
		icon: Gauge,
	},
	{
		title: "Capacidad para crecer",
		decision: "Preparo el sistema para carga variable sin degradar experiencia.",
		implementation:
			"Combino cache de datos, pre-render donde corresponde y monitoreo de recursos criticos.",
		result: "Mantengo estabilidad en picos de uso y bajo costo operativo.",
		icon: Activity,
	},
];

function PerformancePanel({
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

export default function DataPerformance() {
	return (
		<section id="performance" className="relative px-4 py-20">
			<div className="container mx-auto max-w-6xl">
				<div className="mb-12 max-w-3xl space-y-4">
					<p className="text-sm tracking-wide text-zinc-500">Data y performance</p>
					<h2 className="text-3xl font-semibold tracking-tight text-zinc-100 md:text-4xl">
						Optimizo datos y performance con foco en produccion
					</h2>
					<p className="text-zinc-400">
						Mido, ajusto y vuelvo a medir. Asi reduzco latencia, mantengo
						estabilidad y preparo el sistema para crecer sin sorpresas.
					</p>
				</div>

				<div className="mb-8 grid gap-4 md:grid-cols-3">
					{metricSnapshots.map((metric) => (
						<div key={metric.label} className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
							<p className="text-xs uppercase tracking-wide text-zinc-500">{metric.label}</p>
							<div className="mt-2 flex items-center gap-3 text-sm">
								<span className="text-zinc-500 line-through">{metric.from}</span>
								<span className="text-zinc-300">{metric.to}</span>
							</div>
						</div>
					))}
				</div>

				<div className="grid gap-6 md:grid-cols-3">
					{performanceCases.map((item) => (
						<PerformancePanel key={item.title} {...item} />
					))}
				</div>
			</div>
		</section>
	);
}
