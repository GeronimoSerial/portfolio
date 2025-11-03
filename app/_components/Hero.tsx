"use client";

import React, { useRef } from "react";
import { useTranslations } from "next-intl";
import { useGSAPOnly, useGSAPScroll } from "@/hooks/useGSAPOnly";
import { GradientHeading } from "@/components/ui/gradient-heading";
import { Button } from "@/components/ui/moving-border";

export default function HeroStatic() {
  const t = useTranslations('hero');
  const container = useRef<HTMLElement>(null);
  const { heroEntrance } = useGSAPOnly();
  const { parallaxScroll, fadeOnScroll } = useGSAPScroll();

  // Animaciones de entrada y scroll optimizadas
  React.useEffect(() => {
    if (!container.current) return;

    // Hero entrance optimizado
    heroEntrance(container.current);

    // Parallax effect
    parallaxScroll(".hero-content", {
      yPercent: -30,
      trigger: container.current,
    });

    // Fade effect
    fadeOnScroll(".hero-fade", {
      opacity: 0.3,
      trigger: container.current,
    });
  }, [heroEntrance, parallaxScroll, fadeOnScroll]);

  return (
    <section
      ref={container}
      id="hero"
      className="relative flex flex-col items-center justify-center w-full min-h-[calc(100vh-10rem)] px-4 overflow-hidden"
    >
      <div className="hero-content z-10 flex flex-col items-center text-center hero-fade">
        {/* Título principal */}
        <div className="mb-6">
          <GradientHeading
            variant="default"
            size="xxxl"
            weight="bold"
            className="hero-title gsap-element "
          >
            {t('title')}
          </GradientHeading>
        </div>

        <h2
          className="hero-subtitle gsap-element text-sm md:text-lg 
                     text-zinc-700 dark:text-zinc-300 
                     max-w-3xl"
        >
          {t('subtitle')}
        </h2>

        <p
          className="hero-subtitle gsap-element mt-4 text-sm md:text-base 
                    text-zinc-500 dark:text-zinc-500 
                    max-w-xl leading-relaxed"
        >
          {t('description')}
        </p>

        {/* Botones simples */}
        <div className="hero-buttons gsap-element flex gap-4 mt-10">
          <Button
            borderRadius="0.75rem"
            borderClassName="bg-[radial-gradient(black_40%,transparent_60%)] dark:bg-[radial-gradient(white_40%,transparent_60%)]"
            as="button"
            className="bg-white dark:bg-black text-black dark:text-white border-neutral-200 dark:border-slate-800 text-sm font-medium"
            onClick={() => {
              document
                .getElementById("services")
                ?.scrollIntoView({ behavior: "smooth" });
            }}
          >
            {t('cta')}
          </Button>
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
