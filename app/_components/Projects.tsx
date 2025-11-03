"use client";
import projectsData from "@/data/projects.json";
import { ExternalLink, Github } from "lucide-react";
import { useProjectsAnimations } from "@/hooks/useProjectsAnimations";

type Project = {
  title: string;
  description: string;
  date?: string;
  url?: string;
  repository?: string;
  published: boolean;
  slug: string;
};

export default function ProjectsStatic() {
  const { containerRef, headlineRef } = useProjectsAnimations();

  const projects = (projectsData as Project[])
    .filter((project) => project.published)
    .sort(
      (a, b) =>
        new Date(b.date ?? Number.POSITIVE_INFINITY).getTime() -
        new Date(a.date ?? Number.POSITIVE_INFINITY).getTime()
    )
    .slice(0, 6);

  return (
    <section
      id="projects"
      ref={containerRef}
      className="relative min-h-screen py-20 px-4 overflow-hidden"
    >
      {/* Decorative SVG Background Pattern */}
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

      <div className="container mx-auto max-w-6xl relative z-10">
        {/* Header */}
        <div ref={headlineRef} className="mb-16">
          <div className="relative mx-4 my-4 flex flex-col items-center justify-center gap-4 text-center sm:mx-0 sm:mb-0 sm:flex-row flex-wrap">
            <span className="word text-4xl md:text-5xl lg:text-6xl font-display font-bold text-zinc-900 dark:text-zinc-50">
              Featured
            </span>
            <span className="word text-4xl md:text-5xl lg:text-6xl font-display font-bold text-zinc-900 dark:text-zinc-50">
              Projects
            </span>
          </div>
          <p className="projects-subtitle mt-6 mb-4 text-center text-base text-zinc-600 dark:text-zinc-400">
            Experience the power of modern UI components that bring your ideas
            to life.
          </p>
        </div>
        {/* Grid de proyectos */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <article
              key={project.slug}
              className="project-card relative group will-change-transform"
            >
              {/* SVG Border decorativo */}
              <svg
                className="card-border absolute inset-0 w-full h-full pointer-events-none"
                viewBox="0 0 300 400"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                preserveAspectRatio="none"
              >
                <rect
                  x="2"
                  y="2"
                  width="296"
                  height="396"
                  rx="12"
                  className="stroke-zinc-300 dark:stroke-zinc-700"
                  strokeWidth="1.5"
                  fill="none"
                />
                <rect
                  x="6"
                  y="6"
                  width="288"
                  height="388"
                  rx="10"
                  className="stroke-zinc-200 dark:stroke-zinc-800"
                  strokeWidth="1"
                  fill="none"
                />
              </svg>

              {/* Contenido del card */}
              <div className="card-content relative p-6 h-full bg-white/50 dark:bg-black/30 backdrop-blur-sm rounded-xl border border-zinc-200 dark:border-zinc-800">
                <div className="flex flex-col h-full">
                  {/* Número del proyecto */}
                  <div className="absolute top-4 right-4 text-6xl font-display font-bold text-zinc-200/60 dark:text-zinc-900 opacity-100 leading-none">
                    {String(index + 1).padStart(2, "0")}
                  </div>

                  <h3 className="card-title relative text-xl md:text-2xl font-display font-bold text-zinc-900 dark:text-zinc-50 mb-3 pr-12 z-10">
                    {project.title}
                  </h3>

                  <p className="card-description relative text-sm text-zinc-600 dark:text-zinc-400 mb-4 grow line-clamp-3 z-10">
                    {project.description}
                  </p>

                  <div className="card-metadata relative flex items-center gap-3 mt-auto pt-4 border-t border-zinc-200 dark:border-zinc-800 z-10">
                    {project.url && (
                      <a
                        href={project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="card-icon inline-flex items-center justify-center w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
                        title="View project"
                        aria-label="View project"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                    {project.repository && (
                      <a
                        href={project.repository}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="card-icon inline-flex items-center justify-center w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200 dark:hover:bg-zinc-700 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
                        title="View code"
                        aria-label="View code"
                      >
                        <Github className="w-4 h-4" />
                      </a>
                    )}
                    {project.date && (
                      <span className="ml-auto text-xs font-medium text-zinc-400 dark:text-zinc-600 px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800">
                        {new Date(project.date).getFullYear()}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
