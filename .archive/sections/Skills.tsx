"use client";

import { motion } from "motion/react";
import { useSectionInView } from "@/hooks/useSectionInView";
import { useState } from "react";
import {
	PowerBIIcon,
	ExcelIcon,
	StrapiIcon,
	CommonLispIcon,
} from "./CustomIcons";
import { Button } from "@/components/ui/moving-border";

interface Skill {
	name: string;
	icon: string;
	className?: string;
	customIcon?: "powerbi" | "excel" | "strapi" | "commonlisp";
}

interface Subcategory {
	name: string;
	skills: Skill[];
}

interface CategoryData {
	subcategories: Subcategory[];
}

export default function Skills() {
	const { ref, inView } = useSectionInView();
	const [selectedCategory, setSelectedCategory] = useState("Frontend");

	const skillsData: Record<string, CategoryData> = {
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
						{
							name: "Strapi",
							icon: "",
							customIcon: "strapi",
						},
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
						{
							name: "Power BI",
							icon: "",
							customIcon: "powerbi",
						},
						{
							name: "Excel",
							icon: "",
							customIcon: "excel",
						},
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
						{
							name: "Common Lisp",
							icon: "",
							customIcon: "commonlisp",
						},
					],
				},
			],
		},
	};

	const categories = Object.keys(skillsData);
	const currentData = skillsData[selectedCategory as keyof typeof skillsData];

	return (
		<section
			id="skills"
			ref={ref}
			className="relative py-12 px-4 min-h-[750px]"
		>
			<div className="container mx-auto max-w-6xl">
				{/* Header */}
				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={inView ? { opacity: 1, y: 0 } : {}}
					transition={{ duration: 0.6 }}
					className="text-center mb-12"
				>
					<h3 className="text-4xl md:text-5xl font-semibold text-zinc-50 mb-4 tracking-tight">
						<span className="bg-linear-to-b from-zinc-50 via-zinc-200 to-zinc-400 bg-clip-text text-transparent drop-shadow-[0_0_40px_rgba(255,255,255,0.15)]">
							Skills & Technologies
						</span>
					</h3>
					<p className="text-zinc-500 text-base mb-4">
						Technical Proficiencies
					</p>
					<div className="flex items-center justify-center gap-3 mb-2">
						<div className="w-12 h-px bg-linear-to-r from-transparent to-zinc-500" />
						<div className="w-2 h-2 rounded-full bg-zinc-400 shadow-[0_0_10px_rgba(255,255,255,0.3)]" />
						<div className="w-12 h-px bg-linear-to-l from-transparent to-zinc-500" />
					</div>
				</motion.div>

				<div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
					<motion.div
						initial={{ opacity: 0, x: -20 }}
						animate={inView ? { opacity: 1, x: 0 } : {}}
						transition={{ duration: 0.6 }}
						className="lg:w-1/3 lg:sticky lg:top-24 lg:self-start"
					>
						<div className="space-y-3">
							{categories.map((category, index) => (
								<motion.div
									key={category}
									initial={{ opacity: 0, x: -20 }}
									animate={inView ? { opacity: 1, x: 0 } : {}}
									transition={{ duration: 0.4, delay: index * 0.1 }}
								>
									<Button
										onClick={() => setSelectedCategory(category)}
										containerClassName="w-full h-12"
										borderRadius="0.5rem"
										borderClassName={`${
											selectedCategory === category
												? "bg-zinc-400/60"
												: "bg-zinc-600/30"
										}`}
										className={`text-sm font-medium ${
											selectedCategory === category
												? "text-zinc-50"
												: "text-zinc-400"
										}`}
									>
										{category}
									</Button>
								</motion.div>
							))}
						</div>
					</motion.div>

					{/* Línea divisoria vertical */}
					<div className="hidden lg:block w-px bg-linear-to-b from-transparent via-zinc-800 to-transparent" />

					{/* Content derecho - Tecnologías scrolleables */}
					<div className="lg:w-2/3 relative">
						<motion.div
							key={selectedCategory}
							initial={{ opacity: 0, x: 20 }}
							animate={{ opacity: 1, x: 0 }}
							transition={{ duration: 0.4 }}
							className="space-y-6 max-h-[500px] overflow-y-auto scrollbar-hide pr-2 pb-12"
						>
							{currentData.subcategories.map((subcategory, subIndex) => (
								<motion.div
									key={subcategory.name}
									initial={{ opacity: 0, y: 20 }}
									animate={{ opacity: 1, y: 0 }}
									transition={{ duration: 0.4, delay: subIndex * 0.1 }}
									className="space-y-3"
								>
									{/* Título de subcategoría */}
									<h3 className="text-base font-display text-zinc-300 flex items-center gap-2">
										<span className="w-1.5 h-1.5 bg-zinc-500 rounded-full" />
										{subcategory.name}
									</h3>

									{/* Grid de tecnologías */}
									<div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
										{subcategory.skills.map((skill, skillIndex) => (
											<motion.div
												key={skill.name}
												initial={{ opacity: 0, scale: 0.8 }}
												animate={{ opacity: 1, scale: 1 }}
												transition={{
													duration: 0.3,
													delay: subIndex * 0.1 + skillIndex * 0.05,
												}}
												className="group relative flex flex-col items-center justify-center gap-2 py-2"
											>
												{/* Icon */}
												<div className="relative transform group-hover:scale-125 transition-transform duration-300">
													{skill.customIcon ? (
														<>
															{skill.customIcon === "powerbi" && (
																<PowerBIIcon className="w-12 h-12 text-[#F2C811]" />
															)}
															{skill.customIcon === "excel" && (
																<ExcelIcon className="w-12 h-12" />
															)}
															{skill.customIcon === "strapi" && (
																<StrapiIcon className="w-12 h-12" />
															)}
															{skill.customIcon === "commonlisp" && (
																<CommonLispIcon className="w-12 h-12" />
															)}
														</>
													) : (
														<i
															className={`${skill.icon} ${
																skill.className || ""
															} text-5xl`}
															title={skill.name}
														/>
													)}
													{/* Glow effect detrás del icono */}
													<div className="absolute inset-0 bg-white/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 scale-150" />
												</div>

												{/* Name */}
												<span className="text-xs font-medium text-zinc-300 group-hover:text-white transition-colors duration-300 text-center leading-tight">
													{skill.name}
												</span>
											</motion.div>
										))}
									</div>
								</motion.div>
							))}
						</motion.div>
					</div>
				</div>
			</div>
		</section>
	);
}
