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
    <article className="project-card tap-ripple rounded-2xl border border-white/10 bg-white/[0.03] p-5 transition-[transform,border-color,background-color] duration-200 hover:border-white/20 hover:bg-white/[0.05] active:scale-[0.98] active:border-white/30 active:bg-white/[0.07] sm:p-6">
      <div className="flex h-full flex-col">
        <p className="mb-3 text-xs uppercase tracking-wide text-zinc-500">
          Project {String(index ?? 1).padStart(2, "0")}
        </p>

        <h3 className="card-title mb-3 text-lg font-semibold text-zinc-100 sm:text-xl">
              {project.title}
        </h3>

        <p
          title={project.description}
          className="card-description text-sm text-zinc-400 mb-5 grow line-clamp-3"
        >
          {project.description}
        </p>

        <div className="card-metadata mt-auto flex items-center gap-3 border-t border-white/10 pt-4">
          {project.url && (
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="card-icon inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 text-zinc-400 transition-[transform,color,border-color] duration-150 hover:border-white/20 hover:text-zinc-200 active:scale-90 active:border-white/30"
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
              className="card-icon inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 text-zinc-400 transition-[transform,color,border-color] duration-150 hover:border-white/20 hover:text-zinc-200 active:scale-90 active:border-white/30"
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
            className="group ml-auto inline-flex min-h-11 items-center gap-1 text-sm text-zinc-300 transition-colors hover:text-zinc-100 active:text-zinc-100"
          >
            View details
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-active:translate-x-0.5" />
          </Link>
          </div>
      </div>
    </article>
  );
}
