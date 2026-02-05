import { BookOpen, GraduationCap } from "lucide-react";

const education = [
	{
		title: "Tecnicatura / Licenciatura en Analisis de Sistemas",
		institution: "Universidad Nacional del Nordeste (UNNE)",
		period: "En curso - finalizacion estimada 2026",
		summary:
			"Me forme en diseno de sistemas, modelado de datos, arquitectura de software y metodologias de desarrollo.",
	},
	{
		title: "Talentos Digitales - Full Stack",
		institution: "Ministerio de Educacion de Corrientes",
		period: "2022",
		summary:
			"Hice entrenamiento intensivo en desarrollo web moderno, trabajo colaborativo y ciclos de entrega agiles.",
	},
];

const continuousLearning = [
	"Gestion de proyectos agiles",
	"Arquitectura de software y patrones",
	"Infraestructura cloud y despliegue",
	"Modelado y administracion de datos",
];

export default function EducationSection() {
	return (
		<section id="education" className="relative px-4 py-20">
			<div className="container mx-auto max-w-6xl">
				<div className="mb-12 max-w-3xl space-y-4">
					<p className="text-sm tracking-wide text-zinc-500">Formacion</p>
					<h2 className="text-3xl font-semibold tracking-tight text-zinc-100 md:text-4xl">
						Sostengo base academica y aprendizaje continuo
					</h2>
					<p className="text-zinc-400">
						Combino formacion formal con aprendizaje practico para tomar mejores
						decisiones tecnicas en proyectos reales.
					</p>
				</div>

				<div className="grid gap-5 lg:grid-cols-[1.25fr_0.75fr]">
					<div className="space-y-5">
						{education.map((item) => (
							<article key={item.title} className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
								<div className="mb-4 flex items-start gap-3">
									<div className="rounded-lg border border-white/10 bg-white/[0.02] p-2.5">
										<GraduationCap className="h-5 w-5 text-zinc-300" />
									</div>
									<div>
										<h3 className="text-lg font-medium text-zinc-100">{item.title}</h3>
										<p className="text-sm text-zinc-500">{item.institution}</p>
									</div>
								</div>
								<p className="mb-3 text-xs uppercase tracking-wide text-zinc-500">{item.period}</p>
								<p className="text-sm leading-relaxed text-zinc-400">{item.summary}</p>
							</article>
						))}
					</div>

					<aside className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
						<div className="mb-4 flex items-center gap-3">
							<div className="rounded-lg border border-white/10 bg-white/[0.02] p-2.5">
								<BookOpen className="h-5 w-5 text-zinc-300" />
							</div>
							<h3 className="text-lg font-medium text-zinc-100">Aprendizaje continuo</h3>
						</div>
						<ul className="space-y-2.5 text-sm text-zinc-400">
							{continuousLearning.map((item) => (
								<li key={item} className="flex items-start gap-2">
									<span className="mt-2 h-1.5 w-1.5 rounded-full bg-zinc-500" />
									<span>{item}</span>
								</li>
							))}
						</ul>
					</aside>
				</div>
			</div>
		</section>
	);
}
