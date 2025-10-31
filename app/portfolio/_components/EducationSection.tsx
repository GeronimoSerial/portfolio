"use client";

import { motion } from "motion/react";
import { GraduationCap, Award, BookOpen } from "lucide-react";

export default function EducationSection() {
  const education = [
    {
      degree: "Bachelor's in Systems Analysis",
      institution: "Universidad Nacional del Nordeste (UNNE)",
      location: "Corrientes, Argentina",
      period: "2020 - 2026 (Expected)",
      description:
        "Comprehensive program covering software engineering, system design, database management, and project management.",
      icon: GraduationCap,
    },
    {
      degree: "Talentos Digitales - Full Stack Development",
      institution: "Ministerio de Educación de Corrientes",
      location: "Corrientes, Argentina",
      period: "2022",
      description:
        "Intensive training in modern web development, agile methodologies, and collaborative projects.",
      icon: Award,
    },
  ];

  const certifications = [
    "Agile Project Management",
    "Cloud Infrastructure (AWS/Azure basics)",
    "Database Administration",
    "Software Architecture Design",
  ];

  return (
    <section id="education" className="relative py-20 px-4">
      <div className="container mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-display text-zinc-50 mb-4">
            Education & Certifications
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-transparent via-zinc-300 to-transparent mx-auto mb-4" />
          <p className="text-zinc-400 max-w-2xl mx-auto">
            Academic background and professional training
          </p>
        </motion.div>

        {/* Education */}
        <div className="space-y-8 mb-12">
          {education.map((edu, index) => {
            const Icon = edu.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="p-6 bg-white/5 border border-zinc-800 rounded-lg hover:border-zinc-700 transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-lg flex-shrink-0">
                    <Icon className="w-6 h-6 text-zinc-400" />
                  </div>

                  <div className="flex-1">
                    <h3 className="text-xl text-zinc-50 mb-2">{edu.degree}</h3>
                    <p className="text-zinc-400 mb-1">{edu.institution}</p>
                    <p className="text-sm text-zinc-500 mb-3">
                      {edu.location} | {edu.period}
                    </p>
                    <p className="text-sm text-zinc-400 leading-relaxed">
                      {edu.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Certifications */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="p-6 bg-white/5 border border-zinc-800 rounded-lg"
        >
          <div className="flex items-center gap-3 mb-4">
            <BookOpen className="w-5 h-5 text-zinc-400" />
            <h3 className="text-xl text-zinc-50">Additional Training</h3>
          </div>

          <ul className="grid md:grid-cols-2 gap-3">
            {certifications.map((cert, index) => (
              <li
                key={index}
                className="flex items-center gap-2 text-sm text-zinc-400"
              >
                <span className="w-1.5 h-1.5 bg-zinc-500 rounded-full flex-shrink-0" />
                {cert}
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  );
}
