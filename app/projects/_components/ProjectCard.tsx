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
    <article className="project-card rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition-colors hover:border-white/20 hover:bg-white/[0.05]">
      <div className="flex h-full flex-col">
        <p className="mb-3 text-xs uppercase tracking-wide text-zinc-500">
          Proyecto {String(project.index ?? index ?? 0).padStart(2, "0")}
        </p>

        <h3 className="card-title text-xl font-semibold text-zinc-100 mb-3">
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
              className="card-icon inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/10 text-zinc-400 transition-colors hover:border-white/20 hover:text-zinc-200"
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
              className="card-icon inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/10 text-zinc-400 transition-colors hover:border-white/20 hover:text-zinc-200"
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
            className="ml-auto inline-flex items-center gap-1 text-sm text-zinc-300 transition-colors hover:text-zinc-100"
          >
            Ver detalle
            <ArrowRight className="w-4 h-4" />
          </Link>
          </div>
      </div>
    </article>
  );
}
