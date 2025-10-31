"use client";

import React from "react";
import { motion } from "motion/react";
import { ButtonOptimized } from "@/components/ui/ButtonOptimized";
import { MapPin } from "lucide-react";

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative flex flex-col items-center justify-center w-full min-h-screen overflow-hidden"
    >
      {/* BLOQUE CENTRAL */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="z-10 flex flex-col items-center text-center px-4"
      >
        {/* Contenedor fijo para el H1 - su animación no afecta al resto */}
        <div className="mb-6 h-[4.5rem] md:h-[9rem] flex items-center justify-center">
          <h1 className="text-6xl md:text-9xl font-display text-transparent bg-clip-text bg-white cursor-default animate-title select-none">
            geroserial.com
          </h1>
        </div>
        {/* LÍNEAS SUPERIOR E INFERIOR */}
        <div className="absolute top-0 w-screen h-px animate-fade-left bg-gradient-to-r from-zinc-300/0 via-zinc-300/50 to-zinc-300/0" />
        <div className="absolute bottom-0 w-screen h-px animate-fade-right bg-gradient-to-r from-zinc-300/0 via-zinc-300/50 to-zinc-300/0" />

        <h2 className="text-sm md:text-lg text-zinc-300 max-w-3xl">
          IT Specialist · Infrastructure, Automation & Web Systems Management
        </h2>

        <p className="mt-4 text-sm md:text-base text-zinc-500 max-w-xl leading-relaxed">
          Methodical Approach. Real-World Solutions.
        </p>

        {/* Trust Indicators */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="flex flex-wrap items-center justify-center gap-3 mt-6 text-xs md:text-sm text-zinc-600"
        >
          <span>+15 Projects Delivered</span>
          <span className="text-zinc-800">•</span>
          <span>+5 Satisfied Clients</span>
          <span className="text-zinc-800">•</span>
          <span>2+ Years Experience</span>
        </motion.div>

        {/* Location */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="flex items-center gap-2 mt-3 text-xs md:text-sm text-zinc-600"
        >
          <MapPin className="w-3 h-3 md:w-4 md:h-4" />
          <span>Corrientes, Argentina</span>
          <span className="text-zinc-800">|</span>
          <span>Remote Services Available</span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="flex gap-4 mt-10"
        >
          <a href="#services">
            <ButtonOptimized
              containerClassName="h-12"
              borderRadius="0.75rem"
              duration={5}
              className="px-6 py-3 text-sm font-medium text-zinc-300"
            >
              View Services
            </ButtonOptimized>
          </a>
          <a href="#contact">
            <ButtonOptimized
              containerClassName="h-12"
              borderRadius="0.75rem"
              duration={5}
              className="px-6 py-3 text-sm font-medium text-zinc-300"
            >
              Get in Touch
            </ButtonOptimized>
          </a>
        </motion.div>
      </motion.div>

      {/* FLECHA INFERIOR */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.8 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
      >
        <a
          href="#services"
          className="flex flex-col items-center text-zinc-500 hover:text-zinc-300 transition-colors"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              viewBox="0 0 24 24"
            >
              <path d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </motion.div>
        </a>
      </motion.div>
    </section>
  );
}
