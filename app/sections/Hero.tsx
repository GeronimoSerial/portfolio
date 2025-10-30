"use client";

import React from "react";
import { motion } from "motion/react";
import { ArrowDown } from "lucide-react";

export default function Hero() {
  return (
    <section
      id="hero"
      className="relative flex flex-col items-center justify-center w-full h-screen overflow-hidden"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="z-10 flex flex-col items-center"
      >
        <h1 className="py-3.5 px-0.5 text-6xl text-transparent duration-1000 bg-white cursor-default text-edge-outline animate-title font-display sm:text-6xl md:text-9xl whitespace-nowrap bg-clip-text">
          geroserial.com
        </h1>

        <div className="my-8 text-center">
          <h2 className="text-sm md:text-lg text-zinc-300 max-w-3xl px-4">
            IT Specialist | Web Systems, Automation & Infrastructure Management{" "}
          </h2>
          <p className="mt-4 text-sm md:text-base text-zinc-500 max-w-xl px-4">
            Methodical Approach. Real-World Solutions
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="flex gap-4 mt-8"
        >
          <a
            href="#projects"
            className="px-6 py-3 text-sm font-medium text-black bg-white rounded-lg hover:bg-zinc-100 transition-colors duration-200"
          >
            See Projects
          </a>
          <a
            href="#contact"
            className="px-6 py-3 text-sm font-medium text-white bg-white/10 border border-zinc-700 rounded-lg hover:bg-white/20 hover:border-zinc-500 transition-all duration-200"
          >
            Contact
          </a>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
      >
        <a
          href="#about"
          className="flex flex-col items-center text-zinc-500 hover:text-zinc-300 transition-colors"
        >
          <span className="text-xs mb-2">Scroll</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
            </svg>
          </motion.div>
        </a>
      </motion.div>

      <div className="absolute top-0 w-screen h-px animate-glow animate-fade-left bg-gradient-to-r from-zinc-300/0 via-zinc-300/50 to-zinc-300/0" />
      <div className="absolute bottom-0 w-screen h-px animate-glow animate-fade-right bg-gradient-to-r from-zinc-300/0 via-zinc-300/50 to-zinc-300/0" />
    </section>
  );
}
