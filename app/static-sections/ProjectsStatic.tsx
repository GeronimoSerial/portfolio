import { allProjects } from 'contentlayer/generated';
import { ExternalLink, Github } from 'lucide-react';

export default function ProjectsStatic() {
  const projects = allProjects
    .filter((project) => project.published)
    .sort((a, b) =>
      new Date(b.date ?? Number.POSITIVE_INFINITY).getTime() -
      new Date(a.date ?? Number.POSITIVE_INFINITY).getTime()
    )
    .slice(0, 6);

  return (
    <section id="projects" className="relative min-h-screen py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-display text-zinc-50 mb-4">
            Featured Projects
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-transparent via-zinc-300 to-transparent mx-auto mb-4" />
          <p className="text-zinc-400 max-w-2xl mx-auto">
            A selection of projects showcasing web applications and development tools
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
                <h3 className="text-xl text-zinc-50 mb-3">
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
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
