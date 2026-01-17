import { getProjects } from "@/lib/get-projects";
import ProjectCard from "./_components/ProjectCard";
import { Metadata } from "next";
import { cookies } from "next/headers";
import { defaultLocale, locales } from "@/lib/i18n/config";
import Header from "./_components/Header";

async function getLocale() {
  const cookieStore = await cookies();
  const localeCookie = cookieStore.get("NEXT_LOCALE")?.value;
  return locales.includes(localeCookie as any) ? localeCookie : defaultLocale;
}
export const metadata: Metadata = {
  title: "Projects - My Portfolio",
  description:
    "Explore my complete portfolio of projects showcasing modern web development, innovative solutions, and attention to detail.",
};

export default async function ProjectsPage() {
  const locale = await getLocale();
  const allProjects = await getProjects(locale as string);

  const publishedProjects = allProjects.filter((p) => p.published);

  return (
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

        <Header />

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
  );
}
