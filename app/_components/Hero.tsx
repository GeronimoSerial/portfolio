"use client";

import { MapPin } from "lucide-react";
import React, { useRef } from "react";
import { useGSAPOnly, useGSAPScroll } from "@/hooks/useGSAPOnly";

export default function HeroStatic() {
  const container = useRef<HTMLElement>(null);
  const { heroEntrance, parallaxScroll, fadeOnScroll } = useGSAPOnly();

  // Usar hook simplificado para scroll animations
  const { parallaxScroll: scroll, fadeOnScroll: fade } = useGSAPScroll();

  // Animaciones de entrada con el nuevo sistema
  React.useEffect(() => {
    if (container.current) {
      // Hero entrance optimizado
      heroEntrance(container.current);

      // Parallax effect
      scroll(".hero-content", {
        yPercent: -30,
        trigger: container.current,
      });

      // Fade effect
      fade(".hero-fade", {
        opacity: 0.3,
        trigger: container.current,
      });
    }
  }, [heroEntrance, scroll, fade]);

  return (
    <section
      ref={container}
      id="hero"
      className="relative flex flex-col items-center justify-center w-full min-h-screen px-4 overflow-hidden"
    >
      <div className="hero-content z-10 flex flex-col items-center text-center hero-fade">
        {/* Título principal */}
        <div className="mb-6">
          <h1
            className="hero-title gsap-element text-6xl md:text-9xl font-display 
                       text-zinc-950 dark:text-white"
          >
            geroserial.com
          </h1>
        </div>

        <h2
          className="hero-subtitle gsap-element text-sm md:text-lg 
                     text-zinc-700 dark:text-zinc-300 
                     max-w-3xl"
        >
          IT Specialist · Infrastructure, Automation & Web Systems Management
        </h2>

        <p
          className="hero-subtitle gsap-element mt-4 text-sm md:text-base 
                    text-zinc-500 dark:text-zinc-500 
                    max-w-xl leading-relaxed"
        >
          Methodical Approach. Real-World Solutions.
        </p>

        {/* Trust Indicators */}
        <div
          className="hero-details gsap-element flex flex-wrap items-center justify-center gap-3 mt-6 
                      text-xs md:text-sm 
                      text-zinc-400 dark:text-zinc-600"
        >
          <span>+15 Projects Delivered</span>
          <span className="text-zinc-300 dark:text-zinc-800">•</span>
          <span>+5 Satisfied Clients</span>
          <span className="text-zinc-300 dark:text-zinc-800">•</span>
          <span>2+ Years Experience</span>
        </div>

        {/* Location */}
        <div
          className="hero-details gsap-element flex items-center gap-2 mt-3 
                      text-xs md:text-sm 
                      text-zinc-400 dark:text-zinc-600"
        >
          <MapPin className="w-3 h-3 md:w-4 md:h-4" />
          <span>Corrientes, Argentina</span>
          <span className="text-zinc-300 dark:text-zinc-800">|</span>
          <span>Remote Services Available</span>
        </div>

        {/* Botones simples */}
        <div className="hero-buttons gsap-element flex gap-4 mt-10">
          <a
            href="#services"
            className="px-6 py-3 text-sm font-medium 
                     text-zinc-700 dark:text-zinc-300 
                     bg-black/10 dark:bg-white/10 
                     border border-zinc-300 dark:border-zinc-700 
                     rounded-lg 
                     hover:bg-black/20 dark:hover:bg-white/20 
                     hover:border-zinc-500 dark:hover:border-zinc-500"
          >
            View Services
          </a>
          <a
            href="#contact"
            className="px-6 py-3 text-sm font-medium 
                     text-white dark:text-black 
                     bg-black dark:bg-white 
                     rounded-lg 
                     hover:bg-zinc-800 dark:hover:bg-zinc-100"
          >
            Get in Touch
          </a>
        </div>
      </div>

      {/* Líneas decorativas adaptativas */}
      <div
        className="hero-line gsap-element absolute top-0 w-screen h-px 
                    bg-linear-to-r 
                    from-zinc-700/0 via-zinc-700/50 to-zinc-700/0
                    dark:from-zinc-300/0 dark:via-zinc-300/50 dark:to-zinc-300/0
                    origin-center"
      />
      <div
        className="hero-line gsap-element absolute bottom-0 w-screen h-px 
                    bg-linear-to-r 
                    from-zinc-700/0 via-zinc-700/50 to-zinc-700/0
                    dark:from-zinc-300/0 dark:via-zinc-300/50 dark:to-zinc-300/0
                    origin-center"
      />
    </section>
  );
}
