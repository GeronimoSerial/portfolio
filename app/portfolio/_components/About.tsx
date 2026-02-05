import { MapPin, Briefcase, GraduationCap } from "lucide-react";
import Image from "next/image";

export default function About() {
	const stats = [
		{ label: "Projects", value: "+15" },
		{ label: "Clients", value: "+5" },
		{ label: "Years of Experience", value: "2+" },
		{ label: "Commitment", value: "100%" },
	];

	return (
		<section id="about" className="relative py-20 px-4">
			<div className="container mx-auto max-w-6xl">
				<div className="text-center mb-16">
					<div className="flex items-center justify-center gap-3 mb-4">
						<div className="px-2 py-1 bg-zinc-800 dark:bg-zinc-200 rounded text-xs font-mono text-zinc-200 dark:text-zinc-800">
							$ whoami
						</div>
					</div>
					<h2
						className="text-4xl md:text-5xl font-mono font-semibold
                       text-white
                       mb-4 tracking-tight gsap-element"
					>
						About Me
					</h2>
					<div
						className="w-20 h-px
                        bg-gradient-to-r from-transparent
                        via-zinc-500
                        to-transparent
                        mx-auto mb-4"
					/>
				</div>

				<div className="grid md:grid-cols-2 gap-12 items-center mb-16">
					{/* Image/Avatar */}
					<div className="flex justify-center">
						<div className="relative">
							<div
								className="absolute inset-0
                            bg-linear-to-r
                            from-cyan-500/20 to-cyan-400/20
                            dark:from-cyan-400/20 dark:to-cyan-300/20
                            rounded-full blur-2xl opacity-30"
							/>
							<Image
								src="/assets/images/profile_photo.jpeg"
								width={256}
								height={256}
								alt="Geronimo Serial"
								className="relative w-64 h-64 rounded-full object-cover
                         border-2
                         border-zinc-800
                         hover:border-cyan-500/50
                         transition-colors"
							/>
						</div>
					</div>

					{/* Bio */}
					<div className="space-y-6">
						<h3
							className="text-3xl font-mono font-semibold
                         text-white
                         gsap-element"
						>
							Geronimo Serial
						</h3>
						<div
							className="flex items-center gap-2
                          text-zinc-400
                          gsap-element"
						>
							<MapPin className="w-4 h-4" />
							<span className="font-mono text-sm">Corrientes, Argentina</span>
						</div>

						<p
							className="text-zinc-400
                        leading-relaxed gsap-element"
						>
							Desarrollador Full Stack especializado en arquitectura de sistemas,
							infraestructura cloud y optimización de performance. Diseño e implemento
							soluciones multi-tenant con PostgreSQL, RLS y estrategias de caching.
							Experiencia en CI/CD, Docker y despliegues automatizados en VPS Linux.
						</p>

						<p
							className="text-zinc-400
                        leading-relaxed gsap-element"
						>
							Aplico patrones de Domain-Driven Design y arquitectura por capas
							(services, repositories, actions) para construir sistemas mantenibles.
							Enfoque pragmático: sé cuándo aplicar complejidad y cuándo mantenerlo simple.
							Testing unitario, webhooks, RAG y automatización de workflows.
						</p>

						<div
							className="flex items-start gap-3 p-4
                          bg-white/5
                          border border-white/5
                          rounded-lg gsap-element"
						>
							<Briefcase
								className="w-5 h-5
                                  text-cyan-400
                                  mt-1 shrink-0 gsap-element"
							/>
							<div>
								<h4
									className="text-zinc-200
                             font-medium mb-1 font-mono gsap-element"
								>
									Institutional Technology Coordinator
								</h4>
								<p
									className="text-sm
                            text-zinc-400
                            mb-1 gsap-element"
								>
									Consejo General de Educación de Corrientes
								</p>
								<p
									className="text-sm
                            text-zinc-400
                            mb-2 gsap-element"
								>
									2022 - Present
								</p>
								<p
									className="text-sm
                            text-zinc-500
                            mt-2 gsap-element"
								>
									Liderando transformación digital a escala provincial.
									Arquitectura multi-tenant, APIs RESTful, webhooks de deploy,
									automatización CI/CD y optimización de bases de datos PostgreSQL.
								</p>
							</div>
						</div>

						<div
							className="flex items-start gap-3 p-4
                          bg-white/5
                          border border-white/5
                          rounded-lg gsap-element"
						>
							<GraduationCap
								className="w-5 h-5
                                      text-cyan-400
                                      mt-1 shrink-0 gsap-element"
							/>
							<div>
								<h4
									className="text-zinc-200
                             font-medium mb-1 font-mono gsap-element"
								>
									Bachelor&apos;s in Systems Analysis
								</h4>
								<p
									className="text-sm
                            text-zinc-400
                            gsap-element"
								>
									Universidad Nacional del Nordeste (UNNE)
								</p>
								<p
									className="text-sm
                            text-zinc-500
                            mt-2 gsap-element"
								>
									In Progress - Expected completion 2026
								</p>
							</div>
						</div>
					</div>
				</div>

				{/* Stats */}
				<div className="grid grid-cols-2 md:grid-cols-4 gap-6">
					{stats.map((stat) => (
						<div
							key={stat.label}
							className="p-6
                       bg-white/5
                       border border-white/5
                       rounded-lg text-center
                       hover:border-cyan-500/50
                       gsap-element duration-300"
						>
							<div
								className="text-3xl md:text-4xl font-mono font-semibold
                            text-white
                            mb-2 gsap-element"
							>
								{stat.value}
							</div>
							<div
								className="text-sm font-mono
                            text-zinc-400
                            gsap-element"
							>
								{stat.label}
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
