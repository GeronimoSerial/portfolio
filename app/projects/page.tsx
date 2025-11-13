import { getProjects } from "@/lib/get-projects";
import { Background } from "@/components/layout/Background";
import ProjectCard from "./_components/ProjectCard";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "All Projects",
  description:
    "Explore all projects showcasing modern web development and innovative solutions.",
};

export default async function ProjectsPage() {
  const allProjects = await getProjects();
  const publishedProjects = allProjects.filter((p) => p.published);

  return (
    <Background>
      <div className="relative min-h-screen py-20 px-4">
        {/* Decorative SVG */}
        <svg
          className="absolute top-20 left-10 w-40 h-40 opacity-20 pointer-events-none"
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
          className="absolute bottom-20 right-10 w-32 h-32 opacity-20 pointer-events-none"
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

        {/* Header */}
        <div className="mb-16">
          <div className="relative mx-4 my-4 flex flex-col items-center justify-center gap-4 text-center sm:mx-0 sm:mb-0">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-zinc-900 dark:text-zinc-50">
              All Projects
            </h1>
            <p className="mt-6 mb-4 text-center text-base text-zinc-600 dark:text-zinc-400 max-w-2xl">
              Explore my complete portfolio of projects showcasing modern web
              development, innovative solutions, and attention to detail.
            </p>
          </div>
        </div>

        {/* Projects Grid */}
        <div className="container mx-auto max-w-7xl relative z-10">
          {publishedProjects.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-zinc-600 dark:text-zinc-400">
                No projects available yet.
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {publishedProjects.map((project, index) => (
                <ProjectCard
                  key={project.slug}
                  project={project}
                  index={index}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </Background>
  );
}
