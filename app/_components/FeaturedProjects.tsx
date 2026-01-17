"use client";

import { useTranslations } from "next-intl";
import { Project } from "@/types";
import ProjectCard from "../projects/_components/ProjectCard";

interface ProjectsProps {
  projectsData: Project[];
}

export default function FeaturedProjects({ projectsData }: ProjectsProps) {
  const t = useTranslations("cases");

  const getIndexValue = (p: Project) => {
    const typed = p as Project & { index?: number };
    return typed.index ?? Number.MAX_SAFE_INTEGER;
  };

  const projects = projectsData
    .filter((p) => p.published)
    .sort((a, b) => getIndexValue(a) - getIndexValue(b))
    .slice(0, 6);

  return (
    <section
      id="cases"
      className="relative min-h-screen py-20 px-4 overflow-hidden"
    >
      <div className="mb-16">
        <div className="relative mx-4 my-4 flex flex-col items-center justify-center gap-4 text-center sm:mx-0 sm:mb-0 sm:flex-row flex-wrap">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-zinc-900 dark:text-zinc-200">
            {t("title")}
          </h2>
        </div>
        <div className="w-24 h-1 bg-gradient-to-r from-transparent via-zinc-400 dark:via-zinc-600 to-transparent mx-auto mt-3 mb-6" />

        <p className="mt-6 mb-4 text-center text-base text-zinc-600 dark:text-zinc-400">
          {t("subtitle")}
        </p>
      </div>

      <div className="container mx-auto max-w-7xl relative z-10">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
}
