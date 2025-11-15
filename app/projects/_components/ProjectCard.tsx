"use client";

import { ArrowRight, ExternalLink, Github } from "lucide-react";
import Link from "next/link";
import { Project } from "@/types";

interface ProjectCardProps {
  project: Project;
  index?: number;
}

export default function ProjectCard({ project, index }: ProjectCardProps) {
  return (
    <>
      <article className="project-card relative  will-change-transform">
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
            <div className="absolute top-4 right-4 text-6xl font-display font-bold text-zinc-200/60 dark:text-zinc-900 opacity-100 leading-none">
              {String(project.index ?? index ?? 0).padStart(2, "0")}
            </div>

            <h3 className="card-title relative text-xl md:text-2xl font-display font-bold text-zinc-900 dark:text-zinc-50 mb-3 pr-12 z-10">
              {project.title}
            </h3>

            <p
              title={project.description}
              className="card-description relative text-sm text-zinc-600 dark:text-zinc-400 mb-4 grow line-clamp-3 z-10"
            >
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
                  onClick={(e) => e.stopPropagation()}
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
                  onClick={(e) => e.stopPropagation()}
                >
                  <Github className="w-4 h-4" />
                </a>
              )}
              <Link
                href={`/projects/${project.slug}`}
                onClick={(e) => e.stopPropagation()}
                className="ml-auto"
              >
                <div className="ml-auto inline-flex items-center justify-center w-10 h-10 rounded-full bg-zinc-900/10 dark:bg-zinc-50/10 backdrop-blur-sm border border-zinc-300/50 dark:border-zinc-600/50 text-zinc-600 dark:text-zinc-400 transition-all duration-300 hover:bg-zinc-900/20 dark:hover:bg-zinc-50/20 hover:border-zinc-400/50 dark:hover:border-zinc-500/50 hover:scale-105">
                  <ArrowRight className="w-5 h-5" />
                </div>
              </Link>
            </div>
          </div>
        </div>
      </article>
    </>
  );
}
