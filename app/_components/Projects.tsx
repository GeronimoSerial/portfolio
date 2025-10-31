"use client";
import projectsData from "@/data/projects.json";
import { ExternalLink, Github } from "lucide-react";
import { LayoutTextFlip } from "@/components/ui/layout-text-flip";
import { motion } from "motion/react";

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
  const projects = (projectsData as Project[])
    .filter((project) => project.published)
    .sort(
      (a, b) =>
        new Date(b.date ?? Number.POSITIVE_INFINITY).getTime() -
        new Date(a.date ?? Number.POSITIVE_INFINITY).getTime()
    )
    .slice(0, 6);

  return (
    <section id="projects" className="relative min-h-screen py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div>
          <motion.div className="relative mx-4 my-4 flex flex-col items-center justify-center gap-4 text-center sm:mx-0 sm:mb-0 sm:flex-row">
            <LayoutTextFlip
              text="Welcome to "
              words={[
                "Aceternity UI",
                "Fight Club",
                "The Matrix",
                "The Jungle",
              ]}
            />
          </motion.div>
          <p className="mt-4 text-center text-base text-neutral-600 dark:text-neutral-400">
            Experience the power of modern UI components that bring your ideas
            to life.
          </p>
        </div>
        {/* Grid de proyectos */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <article
              key={project.slug}
              className="group p-6 bg-white/5 border border-zinc-800 rounded-lg hover:border-zinc-700 transition-colors"
            >
              <div className="flex flex-col h-full">
                <h3 className="text-xl text-zinc-50 mb-3">{project.title}</h3>

                <p className="text-sm text-zinc-400 mb-4 grow line-clamp-3">
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
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
