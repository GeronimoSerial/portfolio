"use client";

import { useTranslations } from "next-intl";
import { Lightbulb, Wrench, TrendingUp, Code } from "lucide-react";
import { useServicesAnimations } from "@/hooks/useServicesAnimations";

export default function Expertise() {
  const t = useTranslations("expertise");
  const { containerRef, headerRef } = useServicesAnimations();

  const areas = [
    {
      icon: Lightbulb,
      key: "strategy",
    },
    {
      icon: TrendingUp,
      key: "automation",
    },
    {
      icon: Code,
      key: "development",
    },
    {
      icon: Wrench,
      key: "infrastructure",
    },
  ];

  return (
    <section
      ref={containerRef}
      id="expertise"
      className="relative min-h-screen py-20 px-4"
    >
      <div className="container mx-auto max-w-7xl">
        <div ref={headerRef} className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-semibold text-zinc-200 mb-4">
            {t("title")}
          </h2>
          <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto">
            {t("subtitle")}
          </p>
        </div>

        <div className="services-grid grid md:grid-cols-2 gap-8">
          {areas.map((area) => {
            const Icon = area.icon;
            const title = t(`items.${area.key}.title`);
            const description = t(`items.${area.key}.description`);
            const example = t(`items.${area.key}.example`);

            return (
              <article
                key={area.key}
                className="service-card group p-8 bg-white/5 backdrop-blur-sm border border-zinc-800 hover:border-zinc-700 rounded-2xl pointer-events-auto relative overflow-hidden transition-colors duration-300"
              >
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none bg-gradient-to-br from-white/5 via-transparent to-transparent" />

                <div className="icon-container mb-6 inline-block p-3 bg-zinc-900/50 border border-zinc-800 rounded-lg group-hover:border-zinc-700 transition-colors duration-300">
                  <Icon className="w-6 h-6 text-zinc-400 group-hover:text-zinc-200 transition-colors duration-300" />
                </div>

                <h3 className="text-xl font-semibold mb-3 text-zinc-200">
                  {title}
                </h3>

                <p className="text-zinc-400 mb-6 leading-relaxed">
                  {description}
                </p>

                <div className="service-footer pt-4 border-t border-zinc-800">
                  <p className="text-sm text-zinc-500 italic">{example}</p>
                </div>
              </article>
            );
          })}
        </div>

        <div className="text-center mt-16">
          <p className="text-zinc-400 mb-4">{t("cta.text")}</p>
          <button
            onClick={() => {
              document
                .getElementById("contact")
                ?.scrollIntoView({ behavior: "smooth" });
            }}
            className="bg-zinc-200 text-zinc-900 px-8 py-3 rounded-full font-medium hover:bg-white transition-colors"
          >
            {t("cta.button")}
          </button>
        </div>
      </div>
    </section>
  );
}
