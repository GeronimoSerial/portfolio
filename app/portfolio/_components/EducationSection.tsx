import { GraduationCap, Award, BookOpen } from "lucide-react";

export default function EducationSectionStatic() {
	const education = [
		{
			degree: "Bachelor's in Systems Analysis",
			institution: "Universidad Nacional del Nordeste (UNNE)",
			location: "Corrientes, Argentina",
			period: "2020 - 2026 (Expected)",
			description:
				"Comprehensive program covering software engineering, system design, database management, and project management.",
			icon: GraduationCap,
		},
		{
			degree: "Talentos Digitales - Full Stack Development",
			institution: "Ministerio de Educación de Corrientes",
			location: "Corrientes, Argentina",
			period: "2022",
			description:
				"Intensive training in modern web development, agile methodologies, and collaborative projects.",
			icon: Award,
		},
	];

	const certifications = [
		"Agile Project Management",
		"Cloud Infrastructure (AWS/Azure basics)",
		"Database Administration",
		"Software Architecture Design",
	];

	return (
		<section id="education" className="relative py-20 px-4">
			<div className="container mx-auto max-w-4xl">
				<div className="text-center mb-16">
					<h2
						className="text-4xl md:text-5xl font-display 
                       text-zinc-950 dark:text-zinc-50 
                       mb-4 gsap-element"
					>
						Education & Certifications
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
						Academic background and professional training
					</p>
				</div>

				{/* Education */}
				<div className="space-y-8 mb-12">
					{education.map((edu, index) => {
						const Icon = edu.icon;
						return (
							<div
								key={index}
								className="p-6 
                         bg-black/5 dark:bg-white/5 
                         border border-zinc-200 dark:border-zinc-800 
                         rounded-lg 
                         hover:border-zinc-400 dark:hover:border-zinc-700 
                         hover:bg-black/10 dark:hover:bg-white/10 
                         "
							>
								<div className="flex items-start gap-4">
									<div
										className="p-3 
                                bg-zinc-100 dark:bg-zinc-900 
                                border border-zinc-200 dark:border-zinc-800 
                                rounded-lg gsap-element"
									>
										<Icon
											className="w-6 h-6 
                                   text-zinc-600 dark:text-zinc-400 
                                   gsap-element"
										/>
									</div>

									<div className="flex-1">
										<h3
											className="text-xl 
                                 text-zinc-950 dark:text-zinc-50 
                                 font-semibold mb-1 gsap-element"
										>
											{edu.degree}
										</h3>
										<p
											className="text-sm 
                                text-zinc-600 dark:text-zinc-400 
                                mb-1 gsap-element"
										>
											{edu.institution}
										</p>
										<p
											className="text-sm 
                                text-zinc-500 dark:text-zinc-500 
                                mb-3 gsap-element"
										>
											{edu.location} • {edu.period}
										</p>
										<p
											className="text-zinc-700 dark:text-zinc-300 
                                leading-relaxed gsap-element"
										>
											{edu.description}
										</p>
									</div>
								</div>
							</div>
						);
					})}
				</div>

				{/* Certifications */}
				<div
					className="p-6 
                      bg-black/5 dark:bg-white/5 
                      border border-zinc-200 dark:border-zinc-800 
                      rounded-lg gsap-element"
				>
					<div className="flex items-start gap-4">
						<div
							className="p-3 
                          bg-zinc-100 dark:bg-zinc-900 
                          border border-zinc-200 dark:border-zinc-800 
                          rounded-lg gsap-element"
						>
							<BookOpen
								className="w-6 h-6 
                                 text-zinc-600 dark:text-zinc-400 
                                 gsap-element"
							/>
						</div>

						<div className="flex-1">
							<h3
								className="text-xl 
                           text-zinc-950 dark:text-zinc-50 
                           font-semibold mb-4 gsap-element"
							>
								Relevant Certifications & Training
							</h3>

							<ul className="grid md:grid-cols-2 gap-3">
								{certifications.map((cert) => (
									<li
										key={cert}
										className="flex items-center gap-2 text-sm 
                             text-zinc-700 dark:text-zinc-300 
                             gsap-element"
									>
										<svg
											className="w-4 h-4 text-zinc-500 dark:text-zinc-500 shrink-0"
											fill="currentColor"
											viewBox="0 0 20 20"
										>
											<path
												fillRule="evenodd"
												d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
												clipRule="evenodd"
											/>
										</svg>
										{cert}
									</li>
								))}
							</ul>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
