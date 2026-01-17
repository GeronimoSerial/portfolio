"use client";

import { useTranslations } from "next-intl";
import { Search, Layers, Code, Rocket } from "lucide-react";

export default function Process() {
  const t = useTranslations("methodology");

  const steps = [
    { icon: Search, number: "01", key: "1" },
    { icon: Layers, number: "02", key: "2" },
    { icon: Code, number: "03", key: "3" },
    { icon: Rocket, number: "04", key: "4" },
  ];

  return (
    <section id="methodology" className="relative min-h-screen py-20 px-4">
      <div className="container mx-auto max-w-7xl">
        <div className="text-center mb-20">
          <h2 className="text-5xl md:text-6xl font-semibold text-zinc-200 mb-6">
            {t("title")}
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-zinc-700 to-transparent mx-auto mb-6" />
          <p className="text-lg text-zinc-400 max-w-2xl leading-relaxed mx-auto">
            {t("subtitle")}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
          {steps.map((step) => {
            const Icon = step.icon;

            return (
              <div key={step.number} className="relative">
                <div className="relative p-8 h-full bg-white/5 backdrop-blur-sm border border-zinc-800 rounded-2xl hover:border-zinc-700 transition-colors">
                  <div className="absolute -top-4 -left-4 w-16 h-16 bg-zinc-200 text-zinc-900 rounded-full flex items-center justify-center text-2xl font-display font-bold border-4 border-zinc-950 shadow-xl">
                    {step.number}
                  </div>

                  <div className="mb-6 mt-6">
                    <div className="inline-flex p-3 bg-zinc-900/50 border border-zinc-800 rounded-xl">
                      <Icon className="w-7 h-7 text-zinc-400" />
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-zinc-200 mb-3">
                    {t(`steps.${step.key}.title`)}
                  </h3>

                  <p className="text-sm text-zinc-400 mb-6 leading-relaxed">
                    {t(`steps.${step.key}.description`)}
                  </p>

                  <ul className="space-y-3">
                    {[0, 1, 2].map((itemIndex) => (
                      <li
                        key={itemIndex}
                        className="flex items-start gap-3 text-sm text-zinc-400"
                      >
                        <span className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-zinc-600 mt-1.5" />
                        <span className="leading-relaxed">
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

        <div className="text-center mt-16">
          <p className="text-zinc-400 text-lg">{t("tagline")}</p>
        </div>
      </div>
    </section>
  );
}
