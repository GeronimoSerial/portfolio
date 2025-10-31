"use client";

import { useScrollReveal, useStaggerReveal } from "@/hooks/useScrollReveal";
import { allProjects } from "contentlayer/generated";
import { Github, ExternalLink } from "lucide-react";

export default function Projects() {
  const { ref: headerRef, style: headerStyle } = useScrollReveal();

  // Get published projects sorted by date
  const projects = allProjects
    .filter((project) => project.published)
    .sort(
      (a, b) =>
        new Date(b.date ?? Number.POSITIVE_INFINITY).getTime() -
        new Date(a.date ?? Number.POSITIVE_INFINITY).getTime(),
    )
    .slice(0, 6); // Show top 6 projects

  return (
    <section id="projects" className="relative min-h-screen py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <div ref={headerRef} style={headerStyle} className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-display text-zinc-50 mb-4">
            Featured Projects
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-transparent via-zinc-300 to-transparent mx-auto mb-4" />
          <p className="text-zinc-400 max-w-2xl mx-auto">
            A selection of projects showcasing web applications and development
            tools
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project, index) => (
            <ProjectCard key={project.slug} project={project} index={index} />
          ))}
        </div>

        {allProjects.filter((p) => p.published).length > 6 && <CTASection />}
      </div>
    </section>
  );
}

interface Project {
  slug: string;
  title: string;
  description?: string;
  url?: string;
  repository?: string;
  date?: string;
}

function ProjectCard({ project, index }: { project: Project; index: number }) {
  const { ref, style } = useStaggerReveal(index);

  return (
    <article
      ref={ref}
      style={style}
      className="group relative p-6 bg-white/5 border border-zinc-800 rounded-lg hover:border-zinc-700 transition-all duration-300"
    >
      <div className="flex flex-col h-full">
        <h3 className="text-xl text-zinc-50 mb-3 group-hover:text-white transition-colors">
          {project.title}
        </h3>

        <p className="text-sm text-zinc-400 mb-4 flex-grow line-clamp-3">
          {project.description}
        </p>

        <div className="flex items-center gap-3 mt-auto pt-4 border-t border-zinc-800">
          {project.url && (
            <a
              href={project.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-400 hover:text-zinc-100 transition-colors"
              title="View project"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
          {project.repository && (
            <a
              href={project.repository}
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-400 hover:text-zinc-100 transition-colors"
              title="View code"
            >
              <Github className="w-4 h-4" />
            </a>
          )}
          {project.date && (
            <span className="ml-auto text-xs text-zinc-600">
              {new Date(project.date).getFullYear()}
            </span>
          )}
        </div>
      </div>

      {/* Hover glow effect */}
      <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    </article>
  );
}

function CTASection() {
  const { ref, style } = useScrollReveal({ delay: 0.8 });

  return (
    <div ref={ref} style={style} className="text-center mt-12">
      <a
        href="#contact"
        className="inline-block px-6 py-3 text-sm font-medium text-white bg-white/10 border border-zinc-700 rounded-lg hover:bg-white/20 hover:border-zinc-500 transition-all duration-200"
      >
        View More Projects
      </a>
    </div>
  );
}
