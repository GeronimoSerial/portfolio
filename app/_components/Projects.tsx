"use client";

import { useTranslations } from "next-intl";
import { useProjectsAnimations } from "@/hooks/useProjectsAnimations";
import Link from "next/link";
import { Project } from "@/types";
import ProjectCard from "../projects/_components/ProjectCard";

interface ProjectsProps {
  projectsData: Project[];
}

export default function Projects({ projectsData }: ProjectsProps) {
  const t = useTranslations("projects");
  const { containerRef, headlineRef } = useProjectsAnimations();

  const projects = projectsData.filter((p) => p.published).slice(0, 6);

  return (
    <section
      id="projects"
      ref={containerRef}
      className="relative min-h-screen py-20 px-4 overflow-hidden"
    >
      <svg
        className="decorative-svg absolute top-20 left-10 w-40 h-40 opacity-20 pointer-events-none"
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle
          cx="100"
          cy="100"
          r="80"
          className="stroke-zinc-400 dark:stroke-zinc-600"
          strokeWidth="2"
        />
        <path
          d="M100 20 L100 180 M20 100 L180 100"
          className="stroke-zinc-400 dark:stroke-zinc-600"
          strokeWidth="2"
        />
        <circle
          cx="100"
          cy="100"
          r="40"
          className="stroke-zinc-400 dark:stroke-zinc-600"
          strokeWidth="2"
        />
      </svg>

      <svg
        className="decorative-svg absolute bottom-20 right-10 w-32 h-32 opacity-20 pointer-events-none"
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M20 100 L60 20 L140 20 L180 100 L140 180 L60 180 Z"
          className="stroke-zinc-400 dark:stroke-zinc-600"
          strokeWidth="2"
        />
        <circle
          cx="100"
          cy="100"
          r="60"
          className="stroke-zinc-400 dark:stroke-zinc-600"
          strokeWidth="2"
        />
      </svg>

      {/* ==== Header ==== */}
      <div ref={headlineRef} className="mb-16">
        <div className="relative mx-4 my-4 flex flex-col items-center justify-center gap-4 text-center sm:mx-0 sm:mb-0 sm:flex-row flex-wrap">
          <span className="word text-4xl md:text-5xl lg:text-6xl font-display font-bold text-zinc-900 dark:text-zinc-50">
            {t("title")}
          </span>
        </div>
        <p className="projects-subtitle mt-6 mb-4 text-center text-base text-zinc-600 dark:text-zinc-400">
          {t("subtitle")}
        </p>
      </div>

      <div className="container mx-auto max-w-7xl relative z-10">
        {/* ==== Grid de proyectos ==== */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <ProjectCard key={project.slug} project={project} index={index} />
          ))}
        </div>

        {/* View All Projects Button */}
        <div className="flex justify-center mt-12">
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white/50 dark:bg-black/30 backdrop-blur-sm border border-zinc-200 dark:border-zinc-800 text-zinc-900 dark:text-zinc-50 hover:bg-white/70 dark:hover:bg-black/50 transition-all duration-300 font-medium group"
          >
            View All Projects
            <svg
              className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
}
