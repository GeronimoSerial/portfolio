"use client";

import { useTranslations } from "next-intl";
import { Search, Layers, Code, Rocket } from "lucide-react";
import { useProcessAnimations } from "@/hooks/useProcessAnimations";
import { Button } from "@/components/ui/moving-border";

export default function Process() {
  const t = useTranslations("methodology");
  const containerRef = useProcessAnimations();

  const steps = [
    {
      icon: Search,
      number: "01",
      key: "1",
    },
    {
      icon: Layers,
      number: "02",
      key: "2",
    },
    {
      icon: Code,
      number: "03",
      key: "3",
    },
    {
      icon: Rocket,
      number: "04",
      key: "4",
    },
  ];

  return (
    <section
      ref={containerRef}
      id="methodology"
      className="relative min-h-screen py-20 px-4 overflow-x-hidden"
      style={{
        transform: "translateZ(0)",
        contain: "layout style paint",
      }}
    >
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center mb-20 process-header">
          <h2 className="text-5xl md:text-6xl font-semibold text-zinc-200 mb-6">
            {t("title")}
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-zinc-700 to-transparent mx-auto mb-6 process-divider" />

          <p className="text-lg text-zinc-400 max-w-2xl leading-relaxed mx-auto">
            {t("subtitle")}
          </p>
        </div>
        {/* Process Cards Grid */}
        <div className="relative">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
            {steps.map((step, index) => {
              const Icon = step.icon;
              
              return (
                <div key={step.number} className="relative">
                  {/* Connector Line (hidden on mobile, visible on lg) */}
                  {index < steps.length - 1 && (
                    <div
                      className="process-connector hidden lg:block absolute top-16 -right-3 w-6 h-0.5
                                 bg-gradient-to-r from-zinc-700 to-transparent z-0"
                      style={{ transformOrigin: "left center" }}
                    />
                  )}

                  {/* Card */}
                  <div
                    className="process-card relative p-8 h-full bg-white/5 backdrop-blur-sm border border-zinc-800 rounded-2xl hover:border-zinc-700 transition-colors"
                    style={{
                      transform: "translateZ(0)",
                      backfaceVisibility: "hidden",
                      willChange: "auto",
                    }}
                  >
                    {/* Number Badge */}
                    <div
                      className="process-number absolute -top-4 -left-4
                                   w-16 h-16
                                   bg-zinc-200
                                   text-zinc-900
                                   rounded-full
                                   flex items-center justify-center
                                   text-2xl font-display font-bold
                                   border-4 border-zinc-950
                                   shadow-xl"
                    >
                      {step.number}
                    </div>

                    {/* Icon */}
                    <div className="mb-6 mt-6">
                      <div
                        className="process-icon inline-flex p-3
                                   bg-zinc-900/50 border border-zinc-800
                                   rounded-xl"
                      >
                        <Icon className="w-7 h-7 text-zinc-400" />
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="process-title text-xl font-bold text-zinc-200 mb-3">
                      {t(`steps.${step.key}.title`)}
                    </h3>

                    {/* Description */}
                    <p className="process-description text-sm text-zinc-400 mb-6 leading-relaxed">
                      {t(`steps.${step.key}.description`)}
                    </p>

                    {/* Items List */}
                    <ul className="space-y-3">
                      {[0, 1, 2].map((itemIndex) => (
                        <li
                          key={itemIndex}
                          className="process-list-item flex items-start gap-3 text-sm text-zinc-400"
                        >
                          <span
                            className="flex-shrink-0 w-1.5 h-1.5 rounded-full
                                       bg-zinc-600 mt-1.5"
                          />
                          <span className="leading-relaxed">
                            {t(`steps.${step.key}.items.${itemIndex}`)}
                          </span>
                        </li>
                      ))}
                    </ul>

                    {/* Decorative corner accent */}
                    <div
                      className="absolute bottom-0 right-0 w-20 h-20
                                 bg-gradient-to-tl from-white/5 to-transparent
                                 rounded-tl-full rounded-br-2xl pointer-events-none"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-16 process-footer">
          <Button
            borderClassName="bg-[radial-gradient(white_40%,transparent_60%)]"
            containerClassName="w-full max-w-96 h-12 mx-auto"
            className="bg-black text-white border-slate-800 text-sm font-medium"
            type="primary"
            size="lg"
          >
            {t("tagline")}
          </Button>
        </div>
      </div>
    </section>
  );
}
