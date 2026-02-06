"use client";

import { useTranslations } from "next-intl";
import { Search, Layers, Code, Rocket } from "lucide-react";
import { useProcessAnimations } from "@/hooks/useProcessAnimations";

export default function Process() {
  const t = useTranslations("process");
  const containerRef = useProcessAnimations();

  const steps = [
    { icon: Search, number: "01", key: "1" },
    { icon: Layers, number: "02", key: "2" },
    { icon: Code, number: "03", key: "3" },
    { icon: Rocket, number: "04", key: "4" },
  ];

  return (
    <section
      ref={containerRef}
      id="process"
      className="relative overflow-x-hidden px-4 py-20"
    >
      <div className="container mx-auto max-w-7xl">
        {/* Header con selectores para GSAP */}
        <div className="process-header mb-14 max-w-3xl space-y-4">
          <p className="text-sm font-medium tracking-widest uppercase text-zinc-500">
            Proceso
          </p>
          <h2 className="text-3xl font-semibold tracking-tight text-zinc-100 md:text-4xl">
            {t("title")}
          </h2>
          <div className="process-divider h-px w-24 bg-zinc-500/50" />
          <p className="text-zinc-400">{t("subtitle")}</p>
        </div>

        <div className="relative">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 lg:gap-5">
            {steps.map((step, index) => {
              const Icon = step.icon;

              return (
                <div key={step.number} className="relative group">
                  {/* Conector Visual - Optimizado para la animación GSAP */}
                  {index < steps.length - 1 && (
                    <div className="process-connector absolute right-[-12px] top-[48px] z-10 hidden w-[24px] items-center justify-center lg:flex">
                      <div className="h-[1px] w-full bg-gradient-to-r from-zinc-700 via-zinc-400 to-zinc-700" />
                      <div className="absolute h-1 w-1 rounded-full bg-zinc-400 ring-4 ring-zinc-950" />
                    </div>
                  )}

                  {/* Card Principal - Se eliminó transition-all para no romper GSAP */}
                  <div className="process-card flex h-full flex-col rounded-2xl border border-white/10 bg-white/[0.03] p-6 hover:border-white/20 hover:bg-white/[0.05]">
                    {/* Header de la Card: Número e Icono alineado a la derecha */}
                    <div className="mb-6 flex items-start justify-between">
                      <div className="process-number inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-sm font-bold text-zinc-400">
                        {step.number}
                      </div>

                      <div className="process-icon inline-flex rounded-xl border border-white/10 bg-white/[0.02] p-3">
                        <Icon className="h-6 w-6 text-zinc-300" />
                      </div>
                    </div>

                    {/* Contenido de texto */}
                    <div className="flex-grow">
                      <h3 className="process-title mb-3 text-lg font-semibold text-zinc-100">
                        {t(`steps.${step.key}.title`)}
                      </h3>
                      <p className="process-description mb-6 text-sm leading-relaxed text-zinc-400">
                        {t(`steps.${step.key}.description`)}
                      </p>
                    </div>

                    {/* Lista de puntos clave */}
                    <ul className="mt-auto space-y-3">
                      {[0, 1, 2].map((itemIndex) => (
                        <li
                          key={itemIndex}
                          className="flex items-start gap-3 text-sm text-zinc-400"
                        >
                          <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-zinc-600" />
                          <span className="leading-tight">
                            {t(`steps.${step.key}.items.${itemIndex}`)}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer con selector para GSAP */}
        <div className="process-footer mt-12">
          <p className="inline-flex rounded-full border border-white/10 bg-white/[0.02] px-5 py-2 text-xs font-medium tracking-wide text-zinc-400 uppercase">
            {t("tagline")}
          </p>
        </div>
      </div>
    </section>
  );
}
