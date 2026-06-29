"use client";

import { useTranslations } from "next-intl";
import { useProjectsAnimations } from "@/hooks/useProjectsAnimations";
import { Project } from "@/types";
import ProjectCard from "../projects/_components/ProjectCard";
// import { Button } from "@/components/ui/moving-border";

interface ProjectsProps {
  projectsData: Project[];
  maxWidth?: "7xl" | "6xl";
}

export default function FeaturedProjects({
  projectsData,
  maxWidth = "7xl",
}: ProjectsProps) {
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
      className="relative overflow-hidden px-4 py-20"
    >
      <div className={`container mx-auto max-w-${maxWidth} relative z-10`}>
        <div ref={headlineRef} className="mb-10 max-w-3xl space-y-4 sm:mb-12">
          <p className="text-sm tracking-wide text-zinc-500">{t("pretitle")}</p>
          <h2 className="word text-[1.9rem] font-semibold tracking-tight text-zinc-100 sm:text-3xl md:text-4xl">
            {t("title")}
          </h2>
          <p className="projects-subtitle max-w-2xl text-sm leading-relaxed text-zinc-400 sm:text-base">{t("subtitle")}</p>
        </div>

        <div className="grid gap-5 sm:gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {projects.map((project, index) => (
            <ProjectCard key={project.slug} project={project} index={index + 1} />
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
