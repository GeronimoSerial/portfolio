import { MapPin, Briefcase, GraduationCap } from "lucide-react";
import Image from "next/image";

export default function AboutExtendedStatic() {
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
					<h2
						className="text-4xl md:text-5xl font-semibold 
                       text-zinc-950 dark:text-zinc-50 
                       mb-4 tracking-tight gsap-element"
					>
						About Me
					</h2>
					<div
						className="w-20 h-1 
                        bg-linear-to-r from-transparent 
                        via-zinc-400 dark:via-zinc-300 
                        to-transparent 
                        mx-auto mb-4"
					/>
					<p
						className="text-zinc-600 dark:text-zinc-400 
                      max-w-2xl mx-auto gsap-element"
					>
						Professional Background & Experience
					</p>
				</div>

				<div className="grid md:grid-cols-2 gap-12 items-center mb-16">
					{/* Image/Avatar */}
					<div className="flex justify-center">
						<div className="relative">
							<div
								className="absolute inset-0 
                            bg-linear-to-r 
                            from-zinc-300 to-zinc-200
                            dark:from-zinc-500 dark:to-zinc-300 
                            rounded-full blur-2xl opacity-10"
							/>
							<Image
								src="/assets/images/remove-bg-profile.png"
								width={256}
								height={256}
								alt="Geronimo Serial"
								className="relative w-64 h-64 rounded-full object-cover 
                         border-2 
                         border-zinc-300 dark:border-zinc-700 
                         hover:border-zinc-500 dark:hover:border-zinc-500 
                         "
							/>
						</div>
					</div>

					{/* Bio */}
					<div className="space-y-6">
						<h3
							className="text-3xl font-display 
                         text-zinc-950 dark:text-zinc-50 
                         gsap-element"
						>
							Geronimo Serial
						</h3>
						<div
							className="flex items-center gap-2 
                          text-zinc-600 dark:text-zinc-400 
                          gsap-element"
						>
							<MapPin className="w-4 h-4" />
							<span>Corrientes, Argentina</span>
						</div>

						<p
							className="text-zinc-700 dark:text-zinc-300 
                        leading-relaxed gsap-element"
						>
							Systems analyst in training with experience in infrastructure
							management, the design of scalable and secure software
							architectures, and full-stack web development. Led province-wide,
							high-impact digital transformation projects applying modern
							methodologies and sustainable solutions.
						</p>

						<p
							className="text-zinc-700 dark:text-zinc-300 
                        leading-relaxed gsap-element"
						>
							With a strong foundation in both backend and frontend
							technologies, I specialize in building robust, maintainable
							systems that solve real-world business problems. My approach
							combines technical expertise with strategic thinking to deliver
							solutions that not only work but scale.
						</p>

						<div
							className="flex items-start gap-3 p-4 
                          bg-black/5 dark:bg-white/5 
                          border border-zinc-200 dark:border-zinc-800 
                          rounded-lg gsap-element"
						>
							<Briefcase
								className="w-5 h-5 
                                  text-zinc-600 dark:text-zinc-400 
                                  mt-1 shrink-0 gsap-element"
							/>
							<div>
								<h4
									className="text-zinc-900 dark:text-zinc-200 
                             font-medium mb-1 gsap-element"
								>
									Institutional Technology Coordinator
								</h4>
								<p
									className="text-sm 
                            text-zinc-600 dark:text-zinc-400 
                            mb-1 gsap-element"
								>
									Consejo General de Educación de Corrientes
								</p>
								<p
									className="text-sm 
                            text-zinc-600 dark:text-zinc-400 
                            mb-2 gsap-element"
								>
									2022 - Present
								</p>
								<p
									className="text-sm 
                            text-zinc-500 dark:text-zinc-500 
                            mt-2 gsap-element"
								>
									Leading the digital transformation of educational systems
									across the province, implementing scalable web solutions and
									infrastructure improvements to enhance pedagogical approach
									for over 10,000 teachers.
								</p>
							</div>
						</div>

						<div
							className="flex items-start gap-3 p-4 
                          bg-black/5 dark:bg-white/5 
                          border border-zinc-200 dark:border-zinc-800 
                          rounded-lg gsap-element"
						>
							<GraduationCap
								className="w-5 h-5 
                                      text-zinc-600 dark:text-zinc-400 
                                      mt-1 shrink-0 gsap-element"
							/>
							<div>
								<h4
									className="text-zinc-900 dark:text-zinc-200 
                             font-medium mb-1 gsap-element"
								>
									Bachelor's in Systems Analysis
								</h4>
								<p
									className="text-sm 
                            text-zinc-600 dark:text-zinc-400 
                            gsap-element"
								>
									Universidad Nacional del Nordeste (UNNE)
								</p>
								<p
									className="text-sm 
                            text-zinc-500 dark:text-zinc-500 
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
                       bg-black/5 dark:bg-white/5 
                       border border-zinc-200 dark:border-zinc-800 
                       rounded-lg text-center 
                       hover:border-zinc-400 dark:hover:border-zinc-700 
                       gsap-element duration-300"
						>
							<div
								className="text-3xl md:text-4xl font-display 
                            text-zinc-950 dark:text-zinc-50 
                            mb-2 gsap-element"
							>
								{stat.value}
							</div>
							<div
								className="text-sm 
                            text-zinc-600 dark:text-zinc-400 
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
