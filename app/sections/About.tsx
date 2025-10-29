"use client";

import { motion } from "motion/react";
import { User, MapPin, Briefcase, GraduationCap } from "lucide-react";
import { useSectionInView } from "@/hooks/useSectionInView";

export default function About() {
  const { ref, inView } = useSectionInView();

  const stats = [
    { label: "Proyectos", value: "+15" },
    { label: "Clientes", value: "+5" },
    { label: "Años exp.", value: "3+" },
    { label: "Compromiso", value: "100%" },
  ];

  return (
    <section
      id="about"
      ref={ref}
      className="relative min-h-screen py-20 px-4 bg-black"
    >
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-display text-zinc-50 mb-4">
            Sobre Mí
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-transparent via-zinc-300 to-transparent mx-auto" />
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          {/* Image/Avatar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex justify-center"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-zinc-500 to-zinc-300 rounded-full blur-xl opacity-20 animate-pulse" />
              <img
                src="/assets/images/memoji.png"
                alt="Geronimo Serial"
                className="relative w-64 h-64 rounded-full object-cover border-2 border-zinc-700 hover:border-zinc-500 transition-all duration-300"
              />
            </div>
          </motion.div>

          {/* Bio */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="space-y-6"
          >
            <h3 className="text-3xl font-display text-zinc-50">
              Geronimo Serial
            </h3>
            <div className="flex items-center gap-2 text-zinc-400">
              <MapPin className="w-4 h-4" />
              <span>Corrientes, Argentina</span>
            </div>

            <p className="text-zinc-300 leading-relaxed">
              Soy desarrollador web y técnico en sistemas con un enfoque
              integral en tecnologías frontend y backend, programación,
              hardware, redes y soluciones en la nube. Me destaco por mis
              habilidades técnicas avanzadas, diagnóstico preciso y mi capacidad
              para trabajar en entornos bilingües.
            </p>

            <div className="flex items-start gap-3 p-4 bg-white/5 border border-zinc-800 rounded-lg">
              <Briefcase className="w-5 h-5 text-zinc-400 mt-1 flex-shrink-0" />
              <div>
                <h4 className="text-zinc-200 font-medium mb-1">
                  Help Desk - CGE Corrientes
                </h4>
                <p className="text-sm text-zinc-400">2022 - Presente</p>
                <p className="text-sm text-zinc-500 mt-2">
                  Soporte tecnológico y gestión de proyectos audiovisuales en RRSS
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-white/5 border border-zinc-800 rounded-lg">
              <GraduationCap className="w-5 h-5 text-zinc-400 mt-1 flex-shrink-0" />
              <div>
                <h4 className="text-zinc-200 font-medium mb-1">
                  Licenciatura en Sistemas de Información
                </h4>
                <p className="text-sm text-zinc-400">
                  Universidad Nacional del Nordeste - 2022
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className="p-6 bg-white/5 border border-zinc-800 rounded-lg text-center hover:border-zinc-700 transition-colors duration-300"
            >
              <div className="text-3xl md:text-4xl font-display text-zinc-50 mb-2">
                {stat.value}
              </div>
              <div className="text-sm text-zinc-400">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
