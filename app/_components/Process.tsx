"use client";

import { useTranslations } from "next-intl";
import { useProcessAnimations } from "@/hooks/useProcessAnimations";
import {
  DiscoverVisual,
  BuildVisual,
  LaunchVisual,
} from "./process/StepVisuals";
import DesignVisual from "./process/svg/design";
export default function Process() {
  const t = useTranslations("process");
  const containerRef = useProcessAnimations();

  const steps = [
    { number: "01", key: "1", visual: <DiscoverVisual /> },
    { number: "02", key: "2", visual: <DesignVisual /> },
    { number: "03", key: "3", visual: <BuildVisual /> },
    { number: "04", key: "4", visual: <LaunchVisual /> },
  ];

  return (
    <section
      ref={containerRef}
      id="process"
      className="relative overflow-x-hidden px-4 py-20 sm:py-24 lg:py-32"
    >
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="process-header mb-14 max-w-3xl space-y-4 sm:mb-20">
          <p className="text-sm font-medium tracking-widest uppercase text-zinc-500">
            {t("pretitle")}
          </p>
          <h2 className="text-[1.9rem] font-semibold tracking-tight text-zinc-100 sm:text-4xl md:text-5xl">
            {t("title")}
          </h2>
          <div className="process-divider h-px w-24 bg-zinc-500/50" />
          <p className="max-w-2xl text-base leading-relaxed text-zinc-400 sm:text-lg">{t("subtitle")}</p>
        </div>

        {/* Steps Container */}
        <div className="relative space-y-16 sm:space-y-20 lg:space-y-40">
          {/* Vertical Spine */}
          <div className="absolute left-6 top-4 bottom-4 hidden w-px bg-gradient-to-b from-zinc-800 via-zinc-700 to-zinc-800 sm:block lg:left-1/2" />

          {steps.map((step, index) => (
            <div
              key={step.number}
              className={`process-step-row group relative grid items-center gap-8 sm:gap-10 lg:grid-cols-2 lg:gap-12 ${
                index % 2 === 1 ? "lg:direction-rtl" : ""
              }`}
            >
              {/* Left Column: Text */}
              <div
                className={`relative z-10 space-y-6 sm:space-y-8 lg:py-12 ${
                  index % 2 === 1 ? "lg:order-2 lg:pl-12" : "lg:pr-12"
                }`}
              >
                <div className="process-text-content space-y-5 sm:space-y-6">
                  <div
                    className={`flex items-center gap-6 ${
                      index % 2 === 1 ? "lg:flex-row-reverse" : ""
                    }`}
                  >
                    <span className="process-number-badge relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/10 bg-zinc-900 text-sm font-bold font-jetbrains-mono text-zinc-100 ring-4 ring-zinc-950/50 transition-colors group-hover:border-white/20 sm:h-12 sm:w-12 sm:ring-8">
                      {step.number}
                    </span>
                    <h3 className="text-xl font-semibold text-zinc-100 sm:text-2xl md:text-3xl">
                      {t(`steps.${step.key}.title`)}
                    </h3>
                  </div>

                  <div className={index % 2 === 1 ? "lg:text-right" : ""}>
                    <p className="text-base leading-relaxed text-zinc-400 sm:text-lg">
                      {t(`steps.${step.key}.description`)}
                    </p>

                    <ul
                      className={`mt-6 space-y-3 sm:mt-8 sm:space-y-4 ${
                        index % 2 === 1
                          ? "lg:flex lg:flex-col lg:items-end"
                          : ""
                      }`}
                    >
                      {[0, 1, 2].map((itemIndex) => (
                        <li
                          key={itemIndex}
                          className={`flex items-start gap-3 text-zinc-400 ${
                            index % 2 === 1 ? "lg:flex-row-reverse" : ""
                          }`}
                        >
                          <span className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-zinc-600" />
                            <span className="text-sm leading-relaxed">
                              {t(`steps.${step.key}.items.${itemIndex}`)}
                            </span>
                          </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              {/* Right Column: Visual */}
              <div
                className={`process-visual-container relative flex items-center justify-center ${
                  index % 2 === 1 ? "lg:order-1" : ""
                }`}
              >
                <div className="relative aspect-square w-full max-w-md overflow-hidden rounded-3xl border border-white/5 bg-white/[0.01] backdrop-blur-sm transition-all duration-500 group-hover:bg-white/[0.02] group-hover:border-white/10">
                  <div className="absolute inset-0 flex items-center justify-center p-8 sm:p-12">
                    {step.visual}
                  </div>

                  <div className="absolute top-0 left-0 h-12 w-12 border-t border-l border-white/10 transition-all group-hover:h-16 group-hover:w-16" />
                  <div className="absolute bottom-0 right-0 h-12 w-12 border-b border-r border-white/10 transition-all group-hover:h-16 group-hover:w-16" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="process-footer mt-16 text-center sm:mt-24">
          <p className="inline-flex rounded-full border border-white/10 bg-white/[0.02] px-5 py-3 text-center text-xs font-medium tracking-[0.2em] text-zinc-500 uppercase sm:px-6 sm:text-sm">
            {t("tagline")}
          </p>
        </div>
      </div>
    </section>
  );
}
