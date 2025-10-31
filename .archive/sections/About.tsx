"use client";

import { motion } from "motion/react";
import { MapPin, Briefcase, GraduationCap } from "lucide-react";
import { useSectionInView } from "@/hooks/useSectionInView";
import Image from "next/image";

export default function About() {
  const { ref, inView } = useSectionInView();

  const stats = [
    { label: "Projects", value: "+15" },
    { label: "Clients", value: "+5" },
    { label: "Years of Experience", value: "2+" },
    { label: "Commitment", value: "100%" },
  ];

  return (
    <section id="about" ref={ref} className="relative min-h-screen py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h3 className="text-4xl md:text-5xl font-semibold text-zinc-50 mb-4 tracking-tight">
            <span className="bg-gradient-to-b from-zinc-50 via-zinc-200 to-zinc-400 bg-clip-text text-transparent drop-shadow-[0_0_40px_rgba(255,255,255,0.15)]">
              About me
            </span>
          </h3>
          <div className="flex items-center justify-center gap-3 mb-2">
            <div className="w-12 h-[1px] bg-gradient-to-r from-transparent to-zinc-500" />
            <div className="w-2 h-2 rounded-full bg-zinc-400 shadow-[0_0_10px_rgba(255,255,255,0.3)]" />
            <div className="w-12 h-[1px] bg-gradient-to-l from-transparent to-zinc-500" />
          </div>
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
              <div className="absolute inset-0 bg-gradient-to-r from-zinc-500 to-zinc-300 rounded-full blur-2xl opacity-10 " />
              <Image
                src="/assets/images/remove-bg-profile.png"
                width={256}
                height={256}
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
              Systems analyst in training with experience in infrastructure
              management, the design of scalable and secure software
              architectures, and full-stack web development. Led province-wide,
              high-impact digital transformation projects applying modern
              methodologies and sustainable solutions.
            </p>

            <div className="flex items-start gap-3 p-4 bg-white/5 border border-zinc-800 rounded-lg">
              <Briefcase className="w-5 h-5 text-zinc-400 mt-1 flex-shrink-0" />
              <div>
                <h4 className="text-zinc-200 font-medium mb-1">
                  Institutional Technology Coordinator - Consejo General de
                  Educación de Corrientes
                </h4>
                <p className="text-sm text-zinc-400">2022 - Present</p>
                <p className="text-sm text-zinc-500 mt-2">
                  Leading the digital transformation of educational systems
                  across the province, implementing scalable web solutions and
                  infrastructure improvements to enhance pedagogical approach
                  for over 10,000 teachers.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 bg-white/5 border border-zinc-800 rounded-lg">
              <GraduationCap className="w-5 h-5 text-zinc-400 mt-1 flex-shrink-0" />
              <div>
                <h4 className="text-zinc-200 font-medium mb-1">
                  Bachelor's in Systems Analysis
                </h4>
                <p className="text-sm text-zinc-400">UNNE</p>
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
