"use client";

import { ArrowRight, ExternalLink, Github } from "lucide-react";
import Link from "next/link";
import { Project } from "@/types";
import { cn } from "@/lib/utils";

interface ProjectCardProps {
  project: Project;
  index?: number;
}

export default function ProjectCard({ project, index }: ProjectCardProps) {
  return (
    <article className="group relative border border-zinc-800 bg-white/5 backdrop-blur-sm p-8 flex flex-col justify-between transition-all duration-500 hover:border-zinc-700 overflow-hidden min-h-[300px] rounded-2xl">
      {/* Background layer */}
      <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 flex flex-col h-full">
        <div className="flex justify-between items-start mb-6">
          <span className="font-mono text-[10px] uppercase tracking-widest text-zinc-2000">
            Project
          </span>
          <span className="font-mono text-[10px] text-zinc-600 group-hover:text-zinc-200 transition-colors duration-300">
            {String(project.index ?? index ?? 0).padStart(2, "0")}
          </span>
        </div>

        <h3 className="font-display text-3xl md:text-4xl tracking-tight text-zinc-200 group-hover:text-zinc-100 transition-colors duration-300 mb-4">
          {project.title}
        </h3>

        <div className="relative overflow-hidden grow">
          <p className="font-mono text-xs text-zinc-400 leading-relaxed line-clamp-4 group-hover:text-zinc-300 transition-colors duration-300">
            {project.description}
          </p>
        </div>

        {/* Footer actions */}
        <div className="mt-8 pt-6 border-t border-zinc-800 flex items-center justify-between opacity-60 group-hover:opacity-100 transition-opacity duration-300">
          <div className="flex gap-4">
            {project.repository && (
              <a
                href={project.repository}
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-400 hover:text-zinc-100 transition-colors"
              >
                <Github className="w-4 h-4" />
              </a>
            )}
            {project.url && (
              <a
                href={project.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-zinc-400 hover:text-zinc-100 transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </div>

          <Link
            href={`/projects/${project.slug}`}
            className="group/link flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-zinc-400 hover:text-zinc-100 transition-colors"
          >
            View Case{" "}
            <ArrowRight className="w-3 h-3 transition-transform group-hover/link:translate-x-1" />
          </Link>
        </div>
      </div>

      {/* Corner accents */}
      <div className="absolute top-0 right-0 w-8 h-8 opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none">
        <div className="absolute top-0 right-0 w-full h-[1px] bg-white" />
        <div className="absolute top-0 right-0 w-[1px] h-full bg-white" />
      </div>
      <div className="absolute bottom-0 left-0 w-8 h-8 opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none">
        <div className="absolute bottom-0 left-0 w-full h-[1px] bg-white" />
        <div className="absolute bottom-0 left-0 w-[1px] h-full bg-white" />
      </div>
    </article>
  );
}
