"use client";

import { motion } from "motion/react";
import { useSectionInView } from "@/hooks/useSectionInView";
import { Code, Server, Cloud, Users } from "lucide-react";

export default function Skills() {
  const { ref, inView } = useSectionInView();

  const skillCategories = [
    {
      title: "Frontend Development",
      icon: Code,
      skills: [
        { name: "React/Next.js", level: 90 },
        { name: "TypeScript", level: 85 },
        { name: "Tailwind CSS", level: 95 },
        { name: "Angular", level: 75 },
      ],
    },
    {
      title: "Backend Development",
      icon: Server,
      skills: [
        { name: "C#/.NET", level: 85 },
        { name: "Node.js", level: 80 },
        { name: "MySQL", level: 80 },
        { name: "API REST", level: 90 },
      ],
    },
    {
      title: "DevOps & Cloud",
      icon: Cloud,
      skills: [
        { name: "AWS", level: 70 },
        { name: "Azure", level: 65 },
        { name: "Git/GitHub", level: 90 },
        { name: "Docker", level: 60 },
      ],
    },
    {
      title: "Soft Skills",
      icon: Users,
      skills: [
        { name: "Resolución de problemas", level: 95 },
        { name: "Trabajo en equipo", level: 90 },
        { name: "Comunicación efectiva", level: 85 },
        { name: "Gestión de proyectos", level: 80 },
      ],
    },
  ];

  return (
    <section id="skills" ref={ref} className="relative min-h-screen py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-display text-zinc-50 mb-4">
            Habilidades
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-transparent via-zinc-300 to-transparent mx-auto" />
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {skillCategories.map((category, categoryIndex) => {
            const Icon = category.icon;
            return (
              <motion.div
                key={category.title}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: categoryIndex * 0.1 }}
                className="p-6 bg-white/5 border border-zinc-800 rounded-lg hover:border-zinc-700 transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-6">
                  <Icon className="w-6 h-6 text-zinc-400" />
                  <h3 className="text-xl font-display text-zinc-50">
                    {category.title}
                  </h3>
                </div>

                <div className="space-y-4">
                  {category.skills.map((skill, skillIndex) => (
                    <div key={skill.name}>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-zinc-300">
                          {skill.name}
                        </span>
                        <span className="text-xs text-zinc-500">
                          {skill.level}%
                        </span>
                      </div>
                      <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={inView ? { width: `${skill.level}%` } : {}}
                          transition={{
                            duration: 1,
                            delay: categoryIndex * 0.1 + skillIndex * 0.1,
                            ease: "easeOut",
                          }}
                          className="h-full bg-gradient-to-r from-zinc-500 to-zinc-100 rounded-full"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
