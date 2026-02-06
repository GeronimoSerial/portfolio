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
    <section id="results" ref={containerRef} className="relative overflow-hidden px-4 py-24">
      <div className="container relative z-10 mx-auto max-w-7xl">
        {/* Header */}
        <div ref={headerRef} className="mb-16 max-w-3xl space-y-4">
          <p className="text-sm font-medium tracking-wide text-zinc-500">Resultados</p>
          <h2 className="result-word text-3xl font-semibold tracking-tight text-zinc-100 md:text-4xl">
            {t("title")}
          </h2>
          <p className="result-subtitle text-zinc-400 max-w-xl">
            {t("subtitle")}
          </p>
        </div>

        {/* Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          
          {/* Card 1: Visits (Identity: Flow) */}
          <article className="result-card result-card-1 relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-sm">
             {/* Background Pattern: Sparkline Schematic */}
             <svg className="pointer-events-none absolute inset-0 h-full w-full opacity-20" preserveAspectRatio="none" viewBox="0 0 120 120" aria-hidden="true">
                <defs>
                  <linearGradient id="grad-1" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="currentColor" stopOpacity="0" className="text-zinc-500" />
                    <stop offset="50%" stopColor="currentColor" stopOpacity="0.5" className="text-zinc-400" />
                    <stop offset="100%" stopColor="currentColor" stopOpacity="0" className="text-zinc-500" />
                  </linearGradient>
                </defs>
                <path d="M0,100 Q30,95 40,60 T80,50 T120,30" fill="none" stroke="url(#grad-1)" strokeWidth="0.5" className="tech-path" />
                <path d="M0,100 Q30,95 40,60 T80,50 T120,30" fill="none" stroke="currentColor" strokeWidth="1" className="text-zinc-500 main-path" />
                <circle cx="40" cy="60" r="1.5" fill="currentColor" className="text-zinc-400 tech-dot" />
                <circle cx="80" cy="50" r="1.5" fill="currentColor" className="text-zinc-400 tech-dot" />
                <line x1="0" y1="0" x2="0" y2="120" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 2" className="text-zinc-600 scan-line" />
                <text x="5" y="115" className="fill-zinc-600 font-jetbrains-mono text-[4px] uppercase tracking-tighter">Data.Sync_Active</text>
             </svg>

            <div className="relative z-10 flex flex-col h-full justify-between">
              <div className="mb-8">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/[0.02]">
                  <TrendingUp className="h-5 w-5 text-zinc-300" />
                </div>
              </div>
              
              <div>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-semibold text-zinc-500">+</span>
                  <span className="result-number text-5xl font-semibold tracking-tight text-zinc-100">
                    150
                  </span>
                  <span className="text-2xl font-semibold text-zinc-500">k</span>
                </div>
                <p className="mt-2 text-sm text-zinc-400 font-medium">
                  {t("stats.visits.label")}
                </p>
                 <p className="text-xs text-zinc-500 mt-1">
                  {t("stats.visits.period")}
                </p>
              </div>
            </div>
          </article>

          {/* Card 2: Performance (Identity: Velocity) */}
          <article className="result-card result-card-2 relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-sm">
             {/* Background Pattern: Radial Accelerator */}
            <svg className="pointer-events-none absolute -right-4 -top-4 h-48 w-48 opacity-20" viewBox="0 0 100 100" aria-hidden="true">
               <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="0.5" fill="none" strokeDasharray="1 3" className="text-zinc-600" />
               <path d="M50,10 A40,40 0 0,1 90,50" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-zinc-500 speed-arc" />
               <line x1="50" y1="50" x2="50" y2="15" stroke="currentColor" strokeWidth="1" className="text-zinc-400 speed-needle" />
               <circle cx="50" cy="50" r="2" fill="currentColor" className="text-zinc-400" />
               <text x="15" y="85" className="fill-zinc-600 font-jetbrains-mono text-[4px] uppercase tracking-tighter">Acc.Velocity_Max</text>
            </svg>

            <div className="relative z-10 flex flex-col h-full justify-between">
              <div className="mb-8">
                 <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/[0.02]">
                  <Zap className="h-5 w-5 text-zinc-300" />
                </div>
              </div>

              <div>
                <div className="flex items-baseline gap-1">
                  <span className="result-number text-5xl font-semibold tracking-tight text-zinc-100">
                    5.0
                  </span>
                  <span className="text-2xl font-semibold text-zinc-500">x</span>
                </div>
                <p className="mt-2 text-sm text-zinc-400 font-medium">
                  {t("stats.performance.label")}
                </p>
                 <p className="text-xs text-zinc-500 mt-1">
                  {t("stats.performance.period")}
                </p>
              </div>
            </div>
          </article>

          {/* Card 3: Projects (Identity: Structure) */}
          <article className="result-card result-card-3 relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-sm">
             {/* Background Pattern: Isometric Blueprint */}
            <svg className="pointer-events-none absolute bottom-0 right-0 h-40 w-40 opacity-20" viewBox="0 0 100 100" aria-hidden="true">
                <g className="grid-isometric text-zinc-600">
                  <path d="M0,50 L50,25 L100,50 L50,75 Z" fill="none" stroke="currentColor" strokeWidth="0.5" />
                  <path d="M0,70 L50,45 L100,70 L50,95 Z" fill="none" stroke="currentColor" strokeWidth="0.5" />
                  <line x1="50" y1="25" x2="50" y2="95" stroke="currentColor" strokeWidth="0.5" />
                  <circle cx="50" cy="50" r="1.5" fill="currentColor" className="text-zinc-400 grid-node" />
                  <circle cx="25" cy="37.5" r="1" fill="currentColor" className="text-zinc-500 grid-node" />
                  <circle cx="75" cy="62.5" r="1" fill="currentColor" className="text-zinc-500 grid-node" />
                </g>
                <text x="10" y="20" className="fill-zinc-600 font-jetbrains-mono text-[4px] uppercase tracking-tighter">Struct.Load_Ready</text>
            </svg>

             <div className="relative z-10 flex flex-col h-full justify-between">
              <div className="mb-8">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/[0.02]">
                  <Target className="h-5 w-5 text-zinc-300" />
                </div>
              </div>

              <div>
                <div className="flex items-baseline gap-1">
                  <div className="flex">
                    <span className="result-digit text-5xl font-semibold tracking-tight text-zinc-100">2</span>
                    <span className="result-digit text-5xl font-semibold tracking-tight text-zinc-100">0</span>
                  </div>
                  <span className="text-2xl font-semibold text-zinc-500">+</span>
                </div>
                <p className="mt-2 text-sm text-zinc-400 font-medium">
                  {t("stats.projects.label")}
                </p>
                 <p className="text-xs text-zinc-500 mt-1">
                  {t("stats.projects.period")}
                </p>
              </div>
            </div>
          </article>

          {/* Card 4: Uptime (Identity: Stability) */}
          <article className="result-card result-card-4 relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-sm">
             {/* Background Pattern: Frequency Pulse */}
            <svg className="pointer-events-none absolute -bottom-10 -right-10 h-48 w-48 opacity-20" viewBox="0 0 100 100" aria-hidden="true">
               <path d="M0,50 L20,50 L25,30 L35,70 L40,50 L60,50 L65,20 L75,80 L80,50 L100,50" fill="none" stroke="currentColor" strokeWidth="1" className="text-zinc-500 pulse-path" />
               <circle cx="80" cy="50" r="2" fill="currentColor" className="text-zinc-400 pulse-dot" />
               <line x1="0" y1="50" x2="100" y2="50" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 2" className="text-zinc-700" />
               <text x="10" y="15" className="fill-zinc-600 font-jetbrains-mono text-[4px] uppercase tracking-tighter">System.Stable_24.7</text>
            </svg>

            <div className="relative z-10 flex flex-col h-full justify-between">
              <div className="mb-8">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/[0.02]">
                  <Shield className="h-5 w-5 text-zinc-300" />
                </div>
              </div>

              <div>
                 <div className="flex items-baseline gap-1">
                    <span className="result-percentage text-5xl font-semibold tracking-tight text-zinc-100">99.9</span>
                    <span className="text-2xl font-semibold text-zinc-500">%</span>
                </div>
                <p className="mt-2 text-sm text-zinc-400 font-medium">
                  {t("stats.uptime.label")}
                </p>
                 <p className="text-xs text-zinc-500 mt-1">
                  {t("stats.uptime.period")}
                </p>
              </div>
            </div>
          </article>

        </div>
        
        {/* Footer CTA */}
        <div className="mt-16 text-center">
            <p className="text-sm text-zinc-400">
            {t("cta.text")} {" "}
            <a href="#contact" className="text-zinc-200 underline underline-offset-4 decoration-zinc-700 hover:decoration-zinc-300 transition-all">
                {t("cta.link")}
            </a>
            </p>
        </div>
      </div>
    </section>
  );
}
