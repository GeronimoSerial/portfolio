import { Briefcase, Calendar, Code, GraduationCap } from "lucide-react";

export default function ExperienceTimelineStatic() {
  const experiences = [
    {
      title: "Help Desk",
      company: "CGE Corrientes",
      period: "2022 - Presente",
      type: "full-time",
      description:
        "Soporte técnico nivel 1 y 2, gestión de proyectos audiovisuales en redes sociales, mantenimiento de infraestructura IT y capacitación a usuarios finales.",
      technologies: ["Windows", "Linux", "Redes", "Soporte Técnico"],
      icon: Briefcase,
    },
    {
      title: "Freelance Developer",
      company: "Independiente",
      period: "2020 - Presente",
      type: "freelance",
      description:
        "Desarrollo de aplicaciones web personalizadas, consultoría tecnológica, diseño e implementación de APIs y optimización de rendimiento web.",
      technologies: ["React", "Next.js", "Node.js", "TypeScript", "MySQL"],
      icon: Code,
    },
    {
      title: "Talentos Digitales - FullStack",
      company: "Telco, UNNE, PoloIT",
      period: "2022",
      type: "training",
      description:
        "Formación intensiva en desarrollo web full stack. Proyectos colaborativos utilizando metodologías ágiles (Scrum). Certificación en programación frontend y backend.",
      technologies: ["HTML", "CSS", "JavaScript", "Angular", "C#", ".NET"],
      icon: GraduationCap,
    },
  ];

  return (
    <section id="experience" className="relative min-h-screen py-20 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-16">
          <h3
            className="text-4xl md:text-5xl font-display 
                       text-zinc-950 dark:text-zinc-50 
                       mb-4 tracking-tight transition-colors"
          >
            <span
              className="bg-linear-to-b 
                           from-zinc-950 via-zinc-700 to-zinc-500
                           dark:from-zinc-50 dark:via-zinc-200 dark:to-zinc-400 
                           bg-clip-text text-transparent 
                           drop-shadow-[0_0_40px_rgba(0,0,0,0.15)]
                           dark:drop-shadow-[0_0_40px_rgba(255,255,255,0.15)]"
            >
              Experience
            </span>
          </h3>
          <div className="flex items-center justify-center gap-3 mb-2">
            <div
              className="w-12 h-px 
                          bg-linear-to-r from-transparent to-zinc-500"
            />
            <div
              className="w-2 h-2 rounded-full 
                          bg-zinc-400 dark:bg-zinc-400 
                          shadow-[0_0_10px_rgba(150,150,150,0.3)]"
            />
            <div
              className="w-12 h-px 
                          bg-linear-to-l from-transparent to-zinc-500"
            />
          </div>
        </div>

        <div className="relative">
          {/* Timeline line */}
          <div
            className="absolute left-8 top-0 bottom-0 w-px 
                        bg-zinc-200 dark:bg-zinc-800 
                        hidden md:block transition-colors"
          />

          <div className="space-y-12">
            {experiences.map((exp, index) => {
              const Icon = exp.icon;
              return (
                <div key={index} className="relative">
                  {/* Timeline dot */}
                  <div
                    className="absolute left-6 top-6 w-5 h-5 rounded-full 
                                bg-white dark:bg-zinc-950 
                                border-2 
                                border-zinc-300 dark:border-zinc-700 
                                hidden md:block z-10 transition-colors"
                  />

                  {/* Content card */}
                  <div className="md:ml-20">
                    <div
                      className="p-6 
                                  bg-black/5 dark:bg-white/5 
                                  border border-zinc-200 dark:border-zinc-800 
                                  rounded-lg 
                                  hover:border-zinc-400 dark:hover:border-zinc-700 
                                  hover:bg-black/10 dark:hover:bg-white/10 
                                  transition-all duration-300"
                    >
                      <div className="flex items-start gap-4 mb-4">
                        <div
                          className="p-3 
                                      bg-zinc-100 dark:bg-zinc-900 
                                      border border-zinc-200 dark:border-zinc-800 
                                      rounded-lg transition-colors"
                        >
                          <Icon
                            className="w-6 h-6 
                                         text-zinc-600 dark:text-zinc-400 
                                         transition-colors"
                          />
                        </div>

                        <div className="flex-1">
                          <div className="flex items-start justify-between gap-4 mb-2">
                            <div>
                              <h4
                                className="text-xl 
                                           text-zinc-950 dark:text-zinc-50 
                                           font-semibold mb-1 transition-colors"
                              >
                                {exp.title}
                              </h4>
                              <p
                                className="text-sm 
                                          text-zinc-600 dark:text-zinc-400 
                                          transition-colors"
                              >
                                {exp.company}
                              </p>
                            </div>
                            <div
                              className="flex items-center gap-2 
                                          text-zinc-500 dark:text-zinc-500 
                                          text-sm shrink-0 transition-colors"
                            >
                              <Calendar className="w-4 h-4" />
                              <span>{exp.period}</span>
                            </div>
                          </div>

                          <p
                            className="text-zinc-700 dark:text-zinc-300 
                                      mb-4 leading-relaxed transition-colors"
                          >
                            {exp.description}
                          </p>

                          <div className="flex flex-wrap gap-2">
                            {exp.technologies.map((tech) => (
                              <span
                                key={tech}
                                className="px-3 py-1 text-xs font-medium 
                                         text-zinc-700 dark:text-zinc-300 
                                         bg-zinc-100 dark:bg-zinc-900 
                                         border border-zinc-200 dark:border-zinc-800 
                                         rounded-full transition-colors"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
