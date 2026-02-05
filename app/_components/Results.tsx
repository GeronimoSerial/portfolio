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
    <section id="results" ref={containerRef} className="relative overflow-hidden px-4 py-20">
      <div className="container mx-auto relative z-10 max-w-7xl">
        <div ref={headerRef} className="mb-12 max-w-3xl space-y-4">
          <p className="text-sm tracking-wide text-zinc-500">Resultados</p>
          <h2 className="result-word text-3xl font-semibold tracking-tight text-zinc-100 md:text-4xl">{t("title")}</h2>
          <p className="result-subtitle text-zinc-400">{t("subtitle")}</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <article className="result-card-1 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <div className="result-content relative">
              <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/[0.02]">
                <TrendingUp className="h-5 w-5 text-zinc-300" />
              </div>
              <div className="mb-2 flex items-end gap-1">
                <span className="text-2xl font-semibold text-zinc-100">+</span>
                <span className="result-number text-4xl font-semibold text-zinc-100">150</span>
                <span className="text-2xl font-semibold text-zinc-100">k</span>
              </div>
              <p className="text-sm text-zinc-400">
                {t("stats.visits.label")}
                <br />
                {t("stats.visits.period")}
              </p>
            </div>
            <svg className="pointer-events-none absolute h-0 w-0" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
              <title>Morph helper</title>
              <path
                className="morph-path"
                d="M50,10 C72.09,10 90,27.91 90,50 C90,72.09 72.09,90 50,90 C27.91,90 10,72.09 10,50 C10,27.91 27.91,10 50,10 Z"
              />
            </svg>
          </article>

          <article className="result-card-2 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <svg className="pointer-events-none absolute h-0 w-0" viewBox="0 0 200 300" preserveAspectRatio="none">
              <title>Path helper</title>
              <path className="result-path" d="M 20,150 Q 60,50 100,150 T 180,150" />
            </svg>
            <div className="result-icon absolute left-0 top-0 h-0 w-0 opacity-0">
              <Zap className="h-5 w-5" />
            </div>
            <div className="result-content relative">
              <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/[0.02]">
                <Zap className="h-5 w-5 text-zinc-300" />
              </div>
              <div className="mb-2 flex items-end gap-1">
                <span className="result-number text-4xl font-semibold text-zinc-100">5.0</span>
                <span className="text-2xl font-semibold text-zinc-100">x</span>
              </div>
              <p className="text-sm text-zinc-400">
                {t("stats.performance.label")}
                <br />
                {t("stats.performance.period")}
              </p>
            </div>
          </article>

          <article className="result-card-3 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <div className="result-content">
              <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/[0.02]">
                <Target className="h-5 w-5 text-zinc-300" />
              </div>
              <div className="mb-2 flex items-end gap-1">
                <span className="result-digit text-4xl font-semibold text-zinc-100">2</span>
                <span className="result-digit text-4xl font-semibold text-zinc-100">0</span>
                <span className="text-2xl font-semibold text-zinc-100">+</span>
              </div>
              <p className="result-label text-sm text-zinc-400">
                {t("stats.projects.label")}
                <br />
                {t("stats.projects.period")}
              </p>
            </div>
          </article>

          <article className="result-card-4 rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <div className="result-content">
              <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/[0.02]">
                <Shield className="h-5 w-5 text-zinc-300" />
              </div>

              <div className="relative mb-4 h-28 w-28">
                <svg viewBox="0 0 100 100" className="h-full w-full -rotate-90">
                  <title>Uptime progress</title>
                  <circle
                    className="circle-bg stroke-zinc-700"
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    strokeWidth="8"
                    strokeDasharray="282.7"
                  />
                  <circle
                    className="circle-progress stroke-zinc-200"
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    strokeWidth="8"
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <span className="result-percentage text-3xl font-semibold text-zinc-100">99.9</span>
                    <span className="text-xl font-semibold text-zinc-100">%</span>
                  </div>
                </div>
              </div>

              <p className="result-label text-sm text-zinc-400">
                {t("stats.uptime.label")}
                <br />
                {t("stats.uptime.period")}
              </p>
            </div>
          </article>
        </div>

        <div className="mt-12">
          <p className="text-sm text-zinc-400">
            {t("cta.text")} {" "}
            <a href="#contact" className="text-zinc-200 underline underline-offset-4 decoration-zinc-700 hover:decoration-zinc-300">
              {t("cta.link")}
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
