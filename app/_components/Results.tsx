"use client";

import { useRef } from "react";
import { useTranslations } from "next-intl";
import { useResultsAnimations } from "@/hooks/useResultsAnimations";
import { TrendingUp, Zap, Target, Shield } from "lucide-react";

export default function Results() {
  const t = useTranslations("results");
  const containerRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  useResultsAnimations(containerRef, headerRef);

  return (
    <section
      id="results"
      ref={containerRef}
      className="relative min-h-screen py-20 px-4 overflow-hidden"
    >
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-zinc-50/30 to-transparent dark:via-zinc-900/30 pointer-events-none" />

      {/* Decorative Grid */}
      <div
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, currentColor 1px, transparent 1px),
            linear-gradient(to bottom, currentColor 1px, transparent 1px)
          `,
          backgroundSize: "4rem 4rem",
        }}
      />

      <div className="container mx-auto max-w-7xl relative z-10">
        {/* Header */}
        <div ref={headerRef} className="text-center mb-16">
          <div className="flex flex-wrap items-center justify-center gap-4 mb-6">
            <h2 className="result-word text-5xl md:text-6xl lg:text-7xl font-semibold text-zinc-900 dark:text-zinc-50">
              {t("title")}
            </h2>
          </div>

          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-zinc-400 dark:via-zinc-600 to-transparent mx-auto mb-6" />

          <p className="result-subtitle text-lg text-zinc-600 dark:text-zinc-400 max-w-3xl mx-auto leading-relaxed">
            {t("subtitle")}
          </p>
        </div>

        {/* Results Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Card 1: Morph Animation */}
          <article className="result-card-1 relative group">
            <div className="relative h-full p-8 bg-white dark:bg-zinc-900 border-2 border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden">
              {/* Background SVG with Morph */}
              <div className="absolute top-4 right-4 w-20 h-20 opacity-10">
                <svg
                  viewBox="0 0 100 100"
                  className="w-full h-full"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    className="morph-path fill-zinc-900 dark:fill-zinc-100"
                    d="M50,10 C72.09,10 90,27.91 90,50 C90,72.09 72.09,90 50,90 C27.91,90 10,72.09 10,50 C10,27.91 27.91,10 50,10 Z"
                  />
                </svg>
              </div>

              {/* Content */}
              <div className="result-content relative z-10">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-zinc-100 dark:bg-zinc-800 mb-4">
                  <TrendingUp className="w-6 h-6 text-zinc-900 dark:text-zinc-100" />
                </div>

                <div className="mb-2">
                  <span className="text-3xl font-display font-bold text-zinc-900 dark:text-zinc-50">
                    +
                  </span>
                  <span className="result-number text-5xl font-display font-bold text-zinc-900 dark:text-zinc-50">
                    150
                  </span>
                  <span className="text-3xl font-display font-bold text-zinc-900 dark:text-zinc-50">
                    k
                  </span>
                </div>

                <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                  {t("stats.visits.label")}
                  <br />
                  {t("stats.visits.period")}
                </p>
              </div>

              {/* Decorative Corner */}
              <div className="absolute bottom-0 left-0 w-16 h-16">
                <svg
                  viewBox="0 0 100 100"
                  className="w-full h-full opacity-5"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M0,100 L0,0 L100,100 Z"
                    className="fill-zinc-900 dark:fill-zinc-100"
                  />
                </svg>
              </div>
            </div>
          </article>

          {/* Card 2: Path Animation */}
          <article className="result-card-2 relative group">
            <div className="relative h-full p-8 bg-white dark:bg-zinc-900 border-2 border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden">
              {/* SVG Path Background */}
              <svg
                className="absolute inset-0 w-full h-full opacity-10"
                viewBox="0 0 200 300"
                preserveAspectRatio="none"
              >
                <path
                  className="result-path stroke-zinc-900 dark:stroke-zinc-100 fill-none"
                  strokeWidth="3"
                  d="M 20,150 Q 60,50 100,150 T 180,150"
                />
              </svg>

              {/* Animated Icon */}
              <div className="result-icon absolute top-8 left-8 w-8 h-8 opacity-0">
                <Zap className="w-full h-full text-zinc-900 dark:text-zinc-100" />
              </div>

              {/* Content */}
              <div className="result-content relative z-10">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-zinc-100 dark:bg-zinc-800 mb-4">
                  <Zap className="w-6 h-6 text-zinc-900 dark:text-zinc-100" />
                </div>

                <div className="mb-2">
                  <span className="result-number text-5xl font-display font-bold text-zinc-900 dark:text-zinc-50">
                    5.0
                  </span>
                  <span className="text-3xl font-display font-bold text-zinc-900 dark:text-zinc-50">
                    x
                  </span>
                </div>

                <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                  {t("stats.performance.label")}
                  <br />
                  {t("stats.performance.period")}
                </p>
              </div>

              {/* Decorative Corner */}
              <div className="absolute top-0 right-0 w-16 h-16">
                <svg
                  viewBox="0 0 100 100"
                  className="w-full h-full opacity-5"
                  preserveAspectRatio="none"
                >
                  <path
                    d="M100,0 L100,100 L0,0 Z"
                    className="fill-zinc-900 dark:fill-zinc-100"
                  />
                </svg>
              </div>
            </div>
          </article>

          {/* Card 3: Split Digits */}
          <article className="result-card-3 relative group">
            <div className="relative h-full p-8 bg-white dark:bg-zinc-900 border-2 border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden">
              {/* Content */}
              <div className="result-content relative z-10">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-zinc-100 dark:bg-zinc-800 mb-4">
                  <Target className="w-6 h-6 text-zinc-900 dark:text-zinc-100" />
                </div>

                <div className="mb-2 flex items-center gap-1">
                  <span className="result-digit text-5xl font-display font-bold text-zinc-900 dark:text-zinc-50">
                    2
                  </span>
                  <span className="result-digit text-5xl font-display font-bold text-zinc-900 dark:text-zinc-50">
                    0
                  </span>
                  <span className="text-3xl font-display font-bold text-zinc-900 dark:text-zinc-50">
                    +
                  </span>
                </div>

                <p className="result-label text-sm font-medium text-zinc-600 dark:text-zinc-400">
                  {t("stats.projects.label")}
                  <br />
                  {t("stats.projects.period")}
                </p>
              </div>

              {/* Background Pattern */}
              <div className="absolute bottom-4 right-4 w-24 h-24 opacity-5">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <circle
                    cx="50"
                    cy="50"
                    r="30"
                    className="stroke-zinc-900 dark:stroke-zinc-100 fill-none"
                    strokeWidth="2"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="20"
                    className="stroke-zinc-900 dark:stroke-zinc-100 fill-none"
                    strokeWidth="2"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="10"
                    className="stroke-zinc-900 dark:stroke-zinc-100 fill-none"
                    strokeWidth="2"
                  />
                </svg>
              </div>
            </div>
          </article>

          {/* Card 4: Circle Progress */}
          <article className="result-card-4 relative group">
            <div className="relative h-full p-8 bg-white dark:bg-zinc-900 border-2 border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden">
              {/* Content */}
              <div className="result-content relative z-10">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-zinc-100 dark:bg-zinc-800 mb-4">
                  <Shield className="w-6 h-6 text-zinc-900 dark:text-zinc-100" />
                </div>

                {/* Circle Progress */}
                <div className="relative w-32 h-32 mx-auto mb-4">
                  <svg
                    viewBox="0 0 100 100"
                    className="w-full h-full -rotate-90"
                  >
                    {/* Background circle */}
                    <circle
                      className="circle-bg stroke-zinc-200 dark:stroke-zinc-800"
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      strokeWidth="8"
                      strokeDasharray="282.7"
                    />
                    {/* Progress circle */}
                    <circle
                      className="circle-progress stroke-zinc-900 dark:stroke-zinc-100"
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      strokeWidth="8"
                      strokeLinecap="round"
                    />
                  </svg>

                  {/* Percentage in center */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <span className="result-percentage text-3xl font-display font-bold text-zinc-900 dark:text-zinc-50">
                        99.9
                      </span>
                      <span className="text-xl font-display font-bold text-zinc-900 dark:text-zinc-50">
                        %
                      </span>
                    </div>
                  </div>
                </div>

                <p className="result-label text-sm font-medium text-zinc-600 dark:text-zinc-400 text-center">
                  {t("stats.uptime.label")}
                  <br />
                  {t("stats.uptime.period")}
                </p>
              </div>
            </div>
          </article>
        </div>

        {/* Bottom CTA */}
        <div className="mt-20 text-center">
          <p className="text-base text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
            {t("cta.text")}{" "}
            <a
              href="#contact"
              className="font-medium text-zinc-900 dark:text-zinc-50 underline underline-offset-4 decoration-zinc-300 dark:decoration-zinc-700 hover:decoration-zinc-900 dark:hover:decoration-zinc-50 transition-colors"
            >
              {t("cta.link")}
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
