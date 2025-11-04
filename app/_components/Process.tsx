"use client";

import { useTranslations } from "next-intl";
import { Search, Layers, Code, Rocket } from "lucide-react";
import { useProcessAnimations } from "@/hooks/useProcessAnimations";
import { Button } from "@/components/ui/moving-border";
export default function Process() {
  const t = useTranslations("process");
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
      id="process"
      className="relative min-h-screen py-20 px-4 overflow-x-hidden"
    >
      <div className="container mx-auto max-w-7xl">
        {/* Header */}
        <div className="text-center mb-20 process-header">
          <h2 className="text-5xl md:text-6xl font-display text-zinc-950 dark:text-zinc-50 mb-6">
            {t("title")}
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-zinc-400 dark:via-zinc-300 to-transparent mx-auto mb-6 process-divider" />
          <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-2xl leading-relaxed   mx-auto">
            {t("subtitle")}
          </p>
        </div>

        {/* Process Cards Grid */}
        <div className="relative">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isEven = index % 2 === 0;

              return (
                <div key={step.number} className="relative">
                  {/* Connector Line (hidden on mobile, visible on lg) */}
                  {index < steps.length - 1 && (
                    <div
                      className="process-connector hidden lg:block absolute top-16 -right-3 w-6 h-0.5
                                 bg-gradient-to-r from-zinc-300 dark:from-zinc-700 to-transparent"
                      style={{ transformOrigin: "left center" }}
                    />
                  )}

                  {/* Card */}
                  <div
                    className={`process-card relative p-8 h-full
                             bg-gradient-to-br ${
                               isEven
                                 ? "from-zinc-50 to-zinc-100 dark:from-zinc-900/50 dark:to-zinc-800/30"
                                 : "from-zinc-100 to-zinc-50 dark:from-zinc-800/30 dark:to-zinc-900/50"
                             }
                             border-2 border-zinc-200 dark:border-zinc-800
                             rounded-2xl
                             shadow-lg shadow-zinc-200/50 dark:shadow-zinc-900/50`}
                  >
                    {/* Number Badge */}
                    <div
                      className="process-number absolute -top-4 -left-4
                                   w-16 h-16
                                   bg-zinc-950 dark:bg-zinc-50
                                   text-zinc-50 dark:text-zinc-950
                                   rounded-full
                                   flex items-center justify-center
                                   text-2xl font-display font-bold
                                   border-4 border-white dark:border-zinc-950
                                   shadow-xl"
                    >
                      {step.number}
                    </div>

                    {/* Icon */}
                    <div className="mb-6 mt-6">
                      <div
                        className="process-icon inline-flex p-3
                                   bg-zinc-200 dark:bg-zinc-800
                                   rounded-xl"
                      >
                        <Icon className="w-7 h-7 text-zinc-700 dark:text-zinc-300" />
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="process-title text-xl font-bold text-zinc-950 dark:text-zinc-50 mb-3">
                      {t(`steps.${step.key}.title`)}
                    </h3>

                    {/* Description */}
                    <p className="process-description text-sm text-zinc-600 dark:text-zinc-400 mb-6 leading-relaxed">
                      {t(`steps.${step.key}.description`)}
                    </p>

                    {/* Items List */}
                    <ul className="space-y-3">
                      {[0, 1, 2].map((itemIndex) => (
                        <li
                          key={itemIndex}
                          className="process-list-item flex items-start gap-3 text-sm text-zinc-700 dark:text-zinc-300"
                        >
                          <span
                            className="flex-shrink-0 w-1.5 h-1.5 rounded-full
                                       bg-zinc-400 dark:bg-zinc-600 mt-1.5"
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
                                 bg-gradient-to-tl from-zinc-200/50 dark:from-zinc-800/50 to-transparent
                                 rounded-tl-full rounded-br-2xl"
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
            borderClassName="bg-[radial-gradient(black_40%,transparent_60%)] dark:bg-[radial-gradient(white_40%,transparent_60%)]"
            containerClassName="w-full max-w-96 h-12 mx-auto"
            className="bg-white dark:bg-black text-black dark:text-white border-neutral-200 dark:border-slate-800 text-sm font-medium "
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
