"use client";

import { useTranslations } from "next-intl";
import { Lightbulb, Wrench, TrendingUp, Code } from "lucide-react";
import { useServicesAnimations } from "@/hooks/useServicesAnimations";
import { MirrorButton } from "@/components/ui/mirror_button";

export default function ServicesStatic() {
  const t = useTranslations("services");
  const { containerRef, headerRef } = useServicesAnimations();

  const services = [
    {
      icon: Wrench,
      key: "transformation",
    },
    {
      icon: Code,
      key: "development",
    },
    {
      icon: Lightbulb,
      key: "consulting",
    },
    {
      icon: TrendingUp,
      key: "support",
    },
  ];

  return (
    <section
      ref={containerRef}
      id="services"
      className="relative min-h-screen py-20 px-4"
    >
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div ref={headerRef} className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-display text-zinc-950 dark:text-white mb-4">
            {t("title")}
          </h2>

          <p className="text-lg md:text-xl text-zinc-700 dark:text-zinc-300 max-w-2xl mx-auto">
            {t("subtitle")}
          </p>
        </div>

        {/* Grid de servicios */}
        <div className="services-grid grid md:grid-cols-2 gap-8">
          {services.map((service) => {
            const Icon = service.icon;
            const title = t(`items.${service.key}.title`);
            const description = t(`items.${service.key}.description`);
            const price = t(`items.${service.key}.price`);
            const cta = t("cta");
            const features = [0, 1, 2, 3].map((i) =>
              t(`items.${service.key}.features.${i}`)
            );

            return (
              <article
                key={service.key}
                className="service-card group p-6 bg-gradient-to-b from-zinc-50/30 to-zinc-100/30 dark:from-zinc-900/50 dark:to-zinc-800/30 hover:opacity-100 border-2 border-zinc-200 dark:border-zinc-800 rounded-2xl pointer-events-auto relative overflow-hidden shadow-lg shadow-zinc-200/50 dark:shadow-zinc-900/50"
              >
                <svg
                  className="card-border-svg absolute inset-0 w-full h-full pointer-events-none"
                  viewBox="0 0 100% 100%"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  preserveAspectRatio="none"
                >
                  <rect
                    x="1"
                    y="1"
                    width="calc(100% - 2px)"
                    height="calc(100% - 2px)"
                    rx="16"
                    className="stroke-zinc-400 dark:stroke-white"
                    strokeWidth="2"
                    fill="none"
                  />
                </svg>

                {/* Glow effect on hover */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100
                             transition-opacity duration-500 pointer-events-none
                             bg-gradient-to-br from-white/5 via-transparent to-transparent"
                />

                <div className="flex items-start gap-4 mb-4 relative z-10">
                  <div
                    className="icon-container p-3
                                bg-zinc-100 dark:bg-zinc-900
                                border border-zinc-200 dark:border-zinc-800
                                rounded-lg"
                  >
                    <Icon className="w-6 h-6 text-zinc-600 dark:text-zinc-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl text-zinc-950 dark:text-zinc-50 mb-2">
                      {title}
                    </h3>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
                      {description}
                    </p>
                  </div>
                </div>

                <ul className="space-y-2 mb-6 relative z-10">
                  {features.map((feature, featureIndex) => (
                    <li
                      key={featureIndex}
                      className="feature-item flex items-center gap-2 text-sm
                               text-zinc-700 dark:text-zinc-300"
                    >
                      <svg
                        className="w-4 h-4 text-zinc-500 dark:text-zinc-500 shrink-0"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>

                <div
                  className="service-footer flex items-center justify-between pt-4
                              border-t border-zinc-200 dark:border-zinc-800
                              relative z-10"
                >
                  <span className="text-sm md:text-lg font-display text-zinc-900 dark:text-zinc-100">
                    {price}
                  </span>
                  <MirrorButton
                    className="whitespace-nowrap "
                    href="/#contact"
                    size="sm"
                  >
                    {cta}
                  </MirrorButton>
                </div>

                {/* Decorative corner accent */}
                <div
                  className="absolute bottom-0 right-0 w-16 h-16
                             bg-gradient-to-tl from-zinc-400/30 dark:from-zinc-800/30 to-transparent
                             rounded-tl-full rounded-br-2xl pointer-events-none"
                />
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
