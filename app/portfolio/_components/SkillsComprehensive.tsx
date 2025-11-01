interface Skill {
	name: string;
	icon: string;
	className?: string;
}

interface Subcategory {
	name: string;
	skills: Skill[];
}

interface SkillCategory {
	subcategories: Subcategory[];
}

export default function SkillsComprehensiveStatic() {
	const skillsData: Record<string, SkillCategory> = {
		Frontend: {
			subcategories: [
				{
					name: "Frameworks & Libraries",
					skills: [
						{ name: "React", icon: "devicon-react-original colored" },
						{
							name: "Next.js",
							icon: "devicon-nextjs-original-wordmark",
							className: "text-white",
						},
						{ name: "Tailwind", icon: "devicon-tailwindcss-original colored" },
						{ name: "Bootstrap", icon: "devicon-bootstrap-plain colored" },
					],
				},
			],
		},
		Backend: {
			subcategories: [
				{
					name: "Runtime & Frameworks",
					skills: [
						{ name: "Node.js", icon: "devicon-nodejs-plain colored" },
						{
							name: "Express",
							icon: "devicon-express-original",
							className: "text-white",
						},
						{ name: "ASP.NET", icon: "devicon-dot-net-plain colored" },
						{ name: "Redis", icon: "devicon-redis-plain colored" },
					],
				},
				{
					name: "ORM",
					skills: [
						{ name: "Prisma", icon: "devicon-prisma-original colored" },
						{ name: "Entity Framework", icon: "devicon-dot-net-plain colored" },
					],
				},
				{
					name: "Version Control",
					skills: [
						{ name: "Git", icon: "devicon-git-plain colored" },
						{
							name: "GitHub",
							icon: "devicon-github-original",
							className: "text-white",
						},
					],
				},
			],
		},
		"Data Analysis": {
			subcategories: [
				{
					name: "Database",
					skills: [
						{
							name: "SQL Server",
							icon: "devicon-microsoftsqlserver-plain colored",
						},
						{ name: "PostgreSQL", icon: "devicon-postgresql-plain colored" },
						{ name: "SQLite", icon: "devicon-sqlite-plain colored" },
					],
				},
				{
					name: "BI Tools",
					skills: [
						{ name: "Power BI", icon: "devicon-azure-plain colored" },
						{ name: "Excel", icon: "devicon-azure-plain colored" },
					],
				},
			],
		},
		"Programming Languages": {
			subcategories: [
				{
					name: "Languages",
					skills: [
						{ name: "C", icon: "devicon-c-plain colored" },
						{ name: "C#", icon: "devicon-csharp-plain colored" },
						{ name: "Java", icon: "devicon-java-plain colored" },
						{ name: "JavaScript", icon: "devicon-javascript-plain colored" },
						{ name: "TypeScript", icon: "devicon-typescript-plain colored" },
						{ name: "PHP", icon: "devicon-php-plain colored" },
					],
				},
			],
		},
	};

	return (
		<section id="skills" className="relative py-20 px-4">
			<div className="container mx-auto max-w-6xl">
				{/* Header */}
				<div className="text-center mb-16">
					<h2
						className="text-4xl md:text-5xl font-semibold 
                       text-zinc-950 dark:text-zinc-50 
                       mb-4 tracking-tight transition-colors"
					>
						Technical Skills
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
                      max-w-2xl mx-auto transition-colors"
					>
						Comprehensive toolkit for modern development
					</p>
				</div>

				{/* All Categories Visible */}
				<div className="space-y-12">
					{Object.entries(skillsData).map(([categoryName, categoryData]) => (
						<div key={categoryName}>
							<h3
								className="text-2xl font-display 
                           text-zinc-950 dark:text-zinc-50 
                           mb-6 text-center transition-colors"
							>
								{categoryName}
							</h3>

							<div className="space-y-8">
								{categoryData.subcategories.map((subcategory) => (
									<div key={subcategory.name}>
										<h4
											className="text-lg 
                                 text-zinc-700 dark:text-zinc-300 
                                 mb-4 font-medium transition-colors"
										>
											{subcategory.name}
										</h4>

										<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
											{subcategory.skills.map((skill) => (
												<div
													key={skill.name}
													className="group p-4 
                                   bg-black/5 dark:bg-white/5 
                                   border border-zinc-200 dark:border-zinc-800 
                                   rounded-lg 
                                   hover:border-zinc-400 dark:hover:border-zinc-700 
                                   hover:bg-black/10 dark:hover:bg-white/10 
                                   transition-all duration-300 text-center"
												>
													<div className="flex flex-col items-center gap-3">
														<i
															className={`${skill.icon} text-4xl ${
																skill.className || ""
															}`}
														/>
														<span
															className="text-sm 
                                           text-zinc-700 dark:text-zinc-300 
                                           font-medium transition-colors"
														>
															{skill.name}
														</span>
													</div>
												</div>
											))}
										</div>
									</div>
								))}
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	);
}
