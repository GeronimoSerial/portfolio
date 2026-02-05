"use client";

import { useTranslations } from "next-intl";
import { useProjectsAnimations } from "@/hooks/useProjectsAnimations";
import { Project } from "@/types";
import ProjectCard from "../projects/_components/ProjectCard";
// import { Button } from "@/components/ui/moving-border";

interface ProjectsProps {
  projectsData: Project[];
}

export default function FeaturedProjects({ projectsData }: ProjectsProps) {
  const t = useTranslations("featuredProjects");
  const { containerRef, headlineRef } = useProjectsAnimations();

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
      id="projects"
      ref={containerRef}
      className="relative px-4 py-20 overflow-hidden"
    >
      <div className="container mx-auto max-w-7xl relative z-10">
        <div ref={headlineRef} className="mb-12 max-w-3xl space-y-4">
          <p className="text-sm tracking-wide text-zinc-500">Proyectos</p>
          <h2 className="word text-3xl font-semibold tracking-tight text-zinc-100 md:text-4xl">
            {t("title")}
          </h2>
          <p className="projects-subtitle text-zinc-400">{t("subtitle")}</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project) => (
            <ProjectCard key={project.slug} project={project} />
          ))}
        </div>

        {/* View All Projects Button */}
        {/* <div className="flex justify-center mt-12">
          <Button
            borderRadius="0.75rem"
            borderClassName="bg-[radial-gradient(black_40%,transparent_60%)] dark:bg-[radial-gradient(white_40%,transparent_60%)]"
            as="a"
            href="/projects"
            className="bg-white dark:bg-black text-black dark:text-white border-neutral-200 dark:border-slate-800 text-xs"
          >
            {t("cta")}
          </Button>
        </div> */}
      </div>
    </section>
  );
}
