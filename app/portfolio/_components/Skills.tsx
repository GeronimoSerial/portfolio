"use client";

import { useTranslations } from "next-intl";
import { useSkillsAnimations } from "@/hooks/useSkillsAnimations";
import { skillsData } from "@/lib/skills-data";
import Image from "next/image";
import { useState } from "react";
import { Terminal, Database, Server, Cloud, Zap, Layers, Shield } from "lucide-react";

const categoryIcons: Record<string, React.ReactNode> = {
	architecture: <Terminal className="w-4 h-4" />,
	data: <Database className="w-4 h-4" />,
	backend: <Server className="w-4 h-4" />,
	infrastructure: <Cloud className="w-4 h-4" />,
	performance: <Zap className="w-4 h-4" />,
	software: <Layers className="w-4 h-4" />,
	security: <Shield className="w-4 h-4" />,
};

export default function Skills() {
	const t = useTranslations("skills");
	const { containerRef } = useSkillsAnimations();
	const [activeTab, setActiveTab] = useState(skillsData[0].key);

	const activeCategory = skillsData.find((cat) => cat.key === activeTab);

	return (
		<section ref={containerRef} id="skills" className="relative py-16 px-4">
			<div className="container mx-auto max-w-5xl">
				{/* Header */}
				<div className="skills-header mb-8">
					<div className="flex items-center gap-3 mb-2">
						<div className="px-2 py-1 bg-zinc-800 dark:bg-zinc-200 rounded text-xs font-mono text-zinc-200 dark:text-zinc-800">
							$ stack --list
						</div>
					</div>
					<h2 className="text-2xl md:text-3xl font-mono font-semibold text-zinc-950 dark:text-white">
						{t("title")}
					</h2>
					<p className="text-sm text-zinc-500 dark:text-zinc-400 font-mono mt-1">
						{t("subtitle")}
					</p>
				</div>

				{/* Layout: Tabs + Grid */}
				<div className="flex flex-col lg:flex-row gap-6">
					{/* Tabs - Compact horizontal scroll */}
					<div className="flex lg:flex-col gap-1 overflow-x-auto lg:overflow-visible lg:w-56 flex-shrink-0 pb-2 lg:pb-0">
						{skillsData.map((category) => (
							<button
								type="button"
								key={category.key}
								onClick={() => setActiveTab(category.key)}
								className={`
									tab-button flex items-center gap-2 px-3 py-2 rounded-md text-left
									transition-all duration-200 text-sm
									whitespace-nowrap lg:whitespace-normal
									font-mono
									${
										activeTab === category.key
											? "bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 border border-zinc-700 dark:border-zinc-300"
											: "bg-transparent text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 border border-transparent"
									}
								`}
							>
								<span className={activeTab === category.key ? "text-cyan-400 dark:text-cyan-600" : "text-zinc-400"}>
									{categoryIcons[category.key]}
								</span>
								{t(`categories.${category.key}.title`)}
							</button>
						))}
					</div>

					{/* Skills Grid - Dense layout */}
					<div className="flex-1">
						<div className="skills-grid grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
							{activeCategory?.skills.map((skill, index) => (
								<div
									key={`${skill.svglId}-${index}`}
									className="skill-card group relative p-3
										bg-zinc-900/5 dark:bg-zinc-100/5
										border border-zinc-200 dark:border-zinc-800
										rounded-md
										hover:border-cyan-500/50 dark:hover:border-cyan-400/50
										transition-all duration-200"
								>
									<div className="skill-icon-container flex flex-col items-center gap-2">
										<div className="w-8 h-8 relative flex items-center justify-center">
											<Image
												src={`https://svgl.app/library/${skill.svglId}.svg`}
												alt={skill.name}
												width={32}
												height={32}
												className="w-full h-full object-contain opacity-80 group-hover:opacity-100 transition-opacity"
												unoptimized
											/>
										</div>
										<span className="skill-name text-xs font-mono text-zinc-600 dark:text-zinc-400 text-center leading-tight">
											{skill.name}
										</span>
									</div>
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}
