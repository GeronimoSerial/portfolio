"use client";

import { motion } from "motion/react";
import { useSectionInView } from "@/hooks/useSectionInView";
import { Briefcase, Code } from "lucide-react";

export default function Experience() {
  const { ref, inView } = useSectionInView();

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
    <section
      id="experience"
      ref={ref}
      className="relative py-12 px-4"
    >
      <div className="container mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-display text-zinc-50 mb-4">
            Experiencia
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-transparent via-zinc-300 to-transparent mx-auto" />
        </motion.div>

        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-8 top-0 bottom-0 w-px bg-zinc-800 hidden md:block" />

          <div className="space-y-12">
            {experiences.map((exp, index) => {
              const Icon = exp.icon;
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={inView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  className="relative"
                >
                  {/* Timeline dot */}
                  <div className="absolute left-6 top-6 w-5 h-5 rounded-full bg-zinc-950 border-2 border-zinc-700 hidden md:block z-10" />

                  <div className="md:ml-20 p-6 bg-white/5 border border-zinc-800 rounded-lg hover:border-zinc-700 hover:bg-white/[0.07] transition-all duration-300">
                    <div className="flex items-start gap-4 mb-4">
                      <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-lg">
                        <Icon className="w-6 h-6 text-zinc-400" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-display text-zinc-50 mb-1">
                          {exp.title}
                        </h3>
                        <p className="text-zinc-400 text-sm mb-1">
                          {exp.company}
                        </p>
                        <p className="text-zinc-500 text-xs">{exp.period}</p>
                      </div>
                    </div>

                    <p className="text-zinc-300 text-sm leading-relaxed mb-4">
                      {exp.description}
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {exp.technologies.map((tech) => (
                        <span
                          key={tech}
                          className="px-3 py-1 text-xs bg-zinc-900 border border-zinc-800 text-zinc-400 rounded-full"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

// Import for GraduationCap icon
import { GraduationCap } from "lucide-react";
