"use client";

import { useTranslations } from "next-intl";
import { Lightbulb, Wrench, TrendingUp, Code } from "lucide-react";
import { useServicesAnimations } from "@/hooks/useServicesAnimations";

export default function Services() {
  const t = useTranslations("services");
  const { containerRef, headerRef } = useServicesAnimations();

  const services = [
    { icon: Wrench, key: "transformation" },
    { icon: Code, key: "development" },
    { icon: Lightbulb, key: "consulting" },
    { icon: TrendingUp, key: "support" },
  ];

  return (
    <section ref={containerRef} id="services" className="relative px-4 py-20">
      <div className="container mx-auto max-w-6xl">
        <div ref={headerRef} className="mb-12 max-w-3xl space-y-4">
          <h2 className="text-3xl font-semibold tracking-tight text-zinc-100 md:text-4xl">
            {t("title")}
          </h2>
          <p className="text-zinc-400">{t("subtitle")}</p>
        </div>

        <div className="services-grid grid gap-6 md:grid-cols-2">
          {services.map((service) => {
            const Icon = service.icon;
            const title = t(`items.${service.key}.title`);
            const description = t(`items.${service.key}.description`);
            const price = t(`items.${service.key}.price`);
            const features = [0, 1, 2, 3].map((i) =>
              t(`items.${service.key}.features.${i}`),
            );

            return (
              <article
                key={service.key}
                className="service-card group relative rounded-2xl border border-white/10 bg-white/[0.03] p-6"
              >
                <svg
                  className="card-border-svg pointer-events-none absolute inset-0 h-full w-full"
                  viewBox="0 0 300 240"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  preserveAspectRatio="none"
                >
                  <title>{`${title} frame`}</title>
                  <rect
                    x="1"
                    y="1"
                    width="298"
                    height="238"
                    rx="16"
                    className="stroke-white/10"
                    strokeWidth="1"
                    fill="none"
                  />
                </svg>

                <div className="relative z-10 flex items-start gap-4">
                  <div className="icon-container rounded-lg border border-white/10 bg-white/[0.02] p-3">
                    <Icon className="h-5 w-5 text-zinc-300" />
                  </div>
                  <div className="flex-1">
                    <h3 className="mb-2 text-xl text-zinc-100">{title}</h3>
                    <p className="mb-5 text-sm leading-relaxed text-zinc-400">
                      {description}
                    </p>
                  </div>
                </div>

                <ul className="relative z-10 mb-6 space-y-2.5">
                  {features.map((feature) => (
                    <li
                      key={`${service.key}-${feature}`}
                      className="feature-item flex items-start gap-2 text-sm text-zinc-400"
                    >
                      <span className="mt-2 h-1.5 w-1.5 rounded-full bg-zinc-500" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="service-footer relative z-10 border-t border-white/10 pt-4">
                  <span className="text-sm font-medium text-zinc-300">
                    {price}
                  </span>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
