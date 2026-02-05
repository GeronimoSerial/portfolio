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
    <section ref={containerRef} id="process" className="relative overflow-x-hidden px-4 py-20">
      <div className="container mx-auto max-w-7xl">
        <div className="process-header mb-14 max-w-3xl space-y-4">
          <p className="text-sm tracking-wide text-zinc-500">Proceso</p>
          <h2 className="text-3xl font-semibold tracking-tight text-zinc-100 md:text-4xl">{t("title")}</h2>
          <div className="process-divider h-px w-24 bg-zinc-800" />
          <p className="text-zinc-400">{t("subtitle")}</p>
        </div>

        <div className="relative">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 lg:gap-5">
            {steps.map((step, index) => {
              const Icon = step.icon;

              return (
                <div key={step.number} className="relative">
                  {index < steps.length - 1 && (
                    <div
                      className="process-connector absolute -right-2 top-14 hidden h-px w-4 bg-zinc-800 lg:block"
                      style={{ transformOrigin: "left center" }}
                    />
                  )}

                  <div className="process-card relative h-full rounded-2xl border border-white/10 bg-white/[0.03] p-6">
                    <div className="process-number mb-5 inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 text-sm font-semibold text-zinc-300">
                      {step.number}
                    </div>

                    <div className="process-icon mb-5 inline-flex rounded-lg border border-white/10 bg-white/[0.02] p-2.5">
                      <Icon className="h-5 w-5 text-zinc-300" />
                    </div>

                    <h3 className="process-title mb-3 text-lg font-medium text-zinc-100">{t(`steps.${step.key}.title`)}</h3>
                    <p className="process-description mb-5 text-sm leading-relaxed text-zinc-400">
                      {t(`steps.${step.key}.description`)}
                    </p>

                    <ul className="space-y-2.5">
                      {[0, 1, 2].map((itemIndex) => (
                        <li key={itemIndex} className="process-list-item flex items-start gap-2 text-sm text-zinc-400">
                          <span className="mt-2 h-1.5 w-1.5 rounded-full bg-zinc-500" />
                          <span>{t(`steps.${step.key}.items.${itemIndex}`)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="process-footer mt-12">
          <p className="inline-flex rounded-lg border border-white/10 bg-white/[0.02] px-4 py-2 text-sm text-zinc-300">
            {t("tagline")}
          </p>
        </div>
      </div>
    </section>
  );
}
