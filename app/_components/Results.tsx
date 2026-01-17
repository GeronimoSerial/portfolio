"use client";

import { useTranslations } from "next-intl";
import { TrendingUp, Zap, Target, Shield } from "lucide-react";

export default function Results() {
  const t = useTranslations("impact");

  return (
    <section id="impact" className="relative min-h-screen py-20 px-4">
      <div className="container mx-auto max-w-7xl relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl lg:text-7xl font-semibold text-zinc-200 mb-6">
            {t("title")}
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-transparent via-zinc-700 to-transparent mx-auto mb-6" />
          <p className="text-lg text-zinc-400 max-w-3xl mx-auto leading-relaxed">
            {t("subtitle")}
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <article className="relative group">
            <div className="relative h-full p-8 bg-white/5 backdrop-blur-sm border border-zinc-800 rounded-2xl hover:border-zinc-700 transition-colors duration-300">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-zinc-900/50 border border-zinc-800 mb-4 group-hover:border-zinc-700 transition-colors">
                <TrendingUp className="w-6 h-6 text-zinc-400 group-hover:text-zinc-200 transition-colors" />
              </div>

              <div className="mb-2">
                <span className="text-5xl font-display font-bold text-zinc-200">
                  +150k
                </span>
              </div>

              <p className="text-sm font-medium text-zinc-400">
                {t("stats.visits.label")}
                <br />
                <span className="text-xs opacity-70">
                  {t("stats.visits.context")}
                </span>
              </p>
            </div>
          </article>

          <article className="relative group">
            <div className="relative h-full p-8 bg-white/5 backdrop-blur-sm border border-zinc-800 rounded-2xl hover:border-zinc-700 transition-colors duration-300">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-zinc-900/50 border border-zinc-800 mb-4 group-hover:border-zinc-700 transition-colors">
                <Zap className="w-6 h-6 text-zinc-400 group-hover:text-zinc-200 transition-colors" />
              </div>

              <div className="mb-2">
                <span className="text-5xl font-display font-bold text-zinc-200">
                  5.0x
                </span>
              </div>

              <p className="text-sm font-medium text-zinc-400">
                {t("stats.performance.label")}
                <br />
                <span className="text-xs opacity-70">
                  {t("stats.performance.context")}
                </span>
              </p>
            </div>
          </article>

          <article className="relative group">
            <div className="relative h-full p-8 bg-white/5 backdrop-blur-sm border border-zinc-800 rounded-2xl hover:border-zinc-700 transition-colors duration-300">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-zinc-900/50 border border-zinc-800 mb-4 group-hover:border-zinc-700 transition-colors">
                <Target className="w-6 h-6 text-zinc-400 group-hover:text-zinc-200 transition-colors" />
              </div>

              <div className="mb-2">
                <span className="text-5xl font-display font-bold text-zinc-200">
                  20+
                </span>
              </div>

              <p className="text-sm font-medium text-zinc-400">
                {t("stats.projects.label")}
                <br />
                <span className="text-xs opacity-70">
                  {t("stats.projects.context")}
                </span>
              </p>
            </div>
          </article>

          <article className="relative group">
            <div className="relative h-full p-8 bg-white/5 backdrop-blur-sm border border-zinc-800 rounded-2xl hover:border-zinc-700 transition-colors duration-300">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-zinc-900/50 border border-zinc-800 mb-4 group-hover:border-zinc-700 transition-colors">
                <Shield className="w-6 h-6 text-zinc-400 group-hover:text-zinc-200 transition-colors" />
              </div>

              <div className="mb-2">
                <span className="text-5xl font-display font-bold text-zinc-200">
                  99.9%
                </span>
              </div>

              <p className="text-sm font-medium text-zinc-400">
                {t("stats.uptime.label")}
                <br />
                <span className="text-xs opacity-70">
                  {t("stats.uptime.context")}
                </span>
              </p>
            </div>
          </article>
        </div>

        <div className="mt-20 text-center">
          <p className="text-base text-zinc-400 max-w-2xl mx-auto">
            {t("cta.text")}{" "}
            <a
              href="#contact"
              className="font-medium text-zinc-200 underline underline-offset-4 decoration-zinc-700 hover:decoration-zinc-50 transition-colors"
            >
              {t("cta.link")}
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
