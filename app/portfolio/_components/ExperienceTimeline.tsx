import { Briefcase, Calendar, GraduationCap } from "lucide-react";
import type { ComponentType } from "react";

const experiences = [
	{
		title: "Coordinacion Tecnologica Institucional",
		organization: "Consejo General de Educacion de Corrientes",
		period: "2022 - Actualidad",
		summary:
			"Coordino iniciativas de transformacion digital a escala provincial, con foco en infraestructura, arquitectura y continuidad operativa.",
		highlight:
			"Implemente sistemas multi-tenant, automatice despliegues y reduje tiempos de entrega.",
		icon: Briefcase,
	},
	{
		title: "Desarrollo y consultoria independiente",
		organization: "Proyectos freelance",
		period: "2020 - Actualidad",
		summary:
			"Diseno y construyo productos web para organizaciones con necesidades de integracion, rendimiento y escalabilidad.",
		highlight:
			"Entrego soluciones de punta a punta, desde arquitectura hasta despliegue en produccion.",
		icon: Briefcase,
	},
	{
		title: "Formacion academica en Analisis de Sistemas",
		organization: "Universidad Nacional del Nordeste (UNNE)",
		period: "En curso - finalizacion estimada 2026",
		summary:
			"Mantengo una base metodologica en ingenieria de software, estructuras de datos, bases de datos y diseno de sistemas.",
		highlight: "Aplico de forma directa esa base academica en proyectos de alta exigencia.",
		icon: GraduationCap,
	},
];

function ExperienceCard({
	title,
	organization,
	period,
	summary,
	highlight,
	icon: Icon,
}: {
	title: string;
	organization: string;
	period: string;
	summary: string;
	highlight: string;
	icon: ComponentType<{ className?: string }>;
}) {
	return (
		<article className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
			<div className="mb-4 flex items-start justify-between gap-4">
				<div className="flex items-start gap-3">
					<div className="rounded-lg border border-white/10 bg-white/[0.02] p-2.5">
						<Icon className="h-5 w-5 text-zinc-300" />
					</div>
					<div>
						<h3 className="text-lg font-medium text-zinc-100">{title}</h3>
						<p className="text-sm text-zinc-500">{organization}</p>
					</div>
				</div>
				<div className="inline-flex items-center gap-1.5 rounded-full border border-white/10 px-3 py-1 text-xs text-zinc-500">
					<Calendar className="h-3.5 w-3.5" />
					{period}
				</div>
			</div>

			<p className="mb-3 text-sm leading-relaxed text-zinc-400">{summary}</p>
			<p className="text-sm leading-relaxed text-zinc-200">{highlight}</p>
		</article>
	);
}

export default function ExperienceTimeline() {
	return (
		<section id="experience" className="relative px-4 py-20">
			<div className="container mx-auto max-w-6xl">
				<div className="mb-12 max-w-3xl space-y-4">
					<p className="text-sm tracking-wide text-zinc-500">Trayectoria</p>
					<h2 className="text-3xl font-semibold tracking-tight text-zinc-100 md:text-4xl">
						Mi experiencia esta enfocada en resolver problemas reales
					</h2>
					<p className="text-zinc-400">
						En cada etapa asumi contexto, ejecute soluciones y deje sistemas mas
						estables para el equipo.
					</p>
				</div>

				<div className="space-y-5">
					{experiences.map((item) => (
						<ExperienceCard key={item.title} {...item} />
					))}
				</div>
			</div>
		</section>
	);
}
