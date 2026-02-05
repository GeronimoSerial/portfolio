"use client";

import { useTranslations } from "next-intl";
import { useHardwareTier } from "@/hooks/useHardwareTier";
import { useEffect, useState, useMemo, useCallback } from "react";
import Robot from "@/components/shared/SplineScene";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

const VideoFallback = () => (
  <div className="absolute inset-0 pointer-events-none">
    <video
      autoPlay
      muted
      playsInline
      loop
      preload="none"
      poster="/assets/images/poster.png"
      className="h-full w-full object-cover opacity-60"
    >
      <source
        src="https://res.cloudinary.com/dmitnt8de/video/upload/v1770236274/video_mf0fdh.mp4"
        type="video/mp4"
      />
    </video>
    <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/35 via-zinc-950/65 to-zinc-950" />
  </div>
);

const LoadingBackdrop = () => (
  <div className="absolute inset-0 pointer-events-none">
    <div className="h-full w-full bg-zinc-950" />
  </div>
);

export default function Hero() {
  const t = useTranslations("hero");
  const { tier } = useHardwareTier();
  const [isMobile, setIsMobile] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [runtimeCanRender3d, setRuntimeCanRender3d] = useState<boolean | null>(
    null
  );
  const [forceVideoFallback, setForceVideoFallback] = useState(false);

  useEffect(() => {
    const updateMobile = () => setIsMobile(window.innerWidth < 1024);
    updateMobile();
    window.addEventListener("resize", updateMobile);
    return () => window.removeEventListener("resize", updateMobile);
  }, []);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setPrefersReducedMotion(media.matches);
    updatePreference();

    if ("addEventListener" in media) {
      media.addEventListener("change", updatePreference);
      return () => media.removeEventListener("change", updatePreference);
    }
  }, []);

  const canRender3dDesktop = tier !== null && tier >= 2;
  const canRender3dMobile = tier !== null && tier >= 3;
  const hardwareEligible = useMemo(
    () => (isMobile ? canRender3dMobile : canRender3dDesktop),
    [isMobile, canRender3dDesktop, canRender3dMobile]
  );

  useEffect(() => {
    let rafId = 0;
    let cancelled = false;
    let observer: PerformanceObserver | null = null;

    const benchmarkRuntime = async () => {
      if (tier === null) {
        setRuntimeCanRender3d(null);
        return;
      }

      if (!hardwareEligible || prefersReducedMotion) {
        setRuntimeCanRender3d(false);
        return;
      }

      setRuntimeCanRender3d(null);

      const sampleDuration = 900;
      const minFps = isMobile ? 50 : 52;
      const workIterations = isMobile ? 70000 : 90000;
      const cpuCheckIterations = isMobile ? 1200000 : 1500000;
      const maxCpuCheckTime = isMobile ? 95 : 85;
      let frames = 0;
      let slowFrames = 0;
      let longTaskTime = 0;
      let last = performance.now();
      const start = last;
      let sink = 0;

      if (
        "PerformanceObserver" in window &&
        PerformanceObserver.supportedEntryTypes?.includes("longtask")
      ) {
        observer = new PerformanceObserver((list) => {
          for (const entry of list.getEntries()) {
            longTaskTime += entry.duration;
          }
        });
        observer.observe({ entryTypes: ["longtask"] });
      }

      const syntheticWork = () => {
        let acc = 0;
        for (let i = 0; i < workIterations; i += 1) {
          acc += Math.sqrt(i + (acc % 7));
        }
        sink = acc;
      };

      const done = (ok: boolean) => {
        if (observer) {
          observer.disconnect();
          observer = null;
        }
        if (!cancelled) {
          setRuntimeCanRender3d(ok);
        }
      };

      const cpuStart = performance.now();
      for (let i = 0; i < cpuCheckIterations; i += 1) {
        sink += Math.sqrt(i + (sink % 13));
      }
      const cpuDuration = performance.now() - cpuStart;
      if (cpuDuration > maxCpuCheckTime) {
        done(false);
        return;
      }

      const tick = (now: number) => {
        if (cancelled) return;

        const delta = now - last;
        last = now;
        frames += 1;
        syntheticWork();
        void sink;
        if (delta > 32) slowFrames += 1;

        if (now - start >= sampleDuration) {
          const elapsed = now - start;
          const fps = (frames * 1000) / elapsed;
          const slowRatio = slowFrames / Math.max(frames, 1);
          const hasLongTasks = longTaskTime > 120;
          done(fps >= minFps && slowRatio < 0.2 && !hasLongTasks);
          return;
        }

        rafId = requestAnimationFrame(tick);
      };

      rafId = requestAnimationFrame(tick);
    };

    benchmarkRuntime();

    return () => {
      cancelled = true;
      if (observer) observer.disconnect();
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [tier, hardwareEligible, prefersReducedMotion, isMobile]);

  const handleSplinePerformanceIssue = useCallback(() => {
    setForceVideoFallback(true);
  }, []);

  const shouldRender3d =
    !forceVideoFallback && !prefersReducedMotion && runtimeCanRender3d === true;

  return (
    <section
      id="hero"
      className="relative -mt-20 flex min-h-[100svh] w-full items-center overflow-hidden bg-zinc-950"
    >
      {/* Background/Robot Layer */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute inset-0 lg:left-[35%] lg:w-[65%]">
          {tier === null || runtimeCanRender3d === null ? (
            <LoadingBackdrop />
          ) : shouldRender3d ? (
            <Robot onPerformanceIssue={handleSplinePerformanceIssue} />
          ) : (
            <VideoFallback />
          )}
        </div>
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/60 to-zinc-950/10 lg:w-[60%]" />
      </div>

      <div className="container relative z-10 mx-auto max-w-6xl px-8 pointer-events-none">
        <div className="flex flex-col items-end lg:flex-row lg:items-center">
          <div className="w-full space-y-10 lg:w-1/2">
            <div className="space-y-5">
              <h1 className="text-3xl font-medium tracking-tight text-white/90 md:text-4xl lg:text-[2.75rem] lg:leading-[1.1]">
                {t("title")}
              </h1>
              <div className="flex items-center gap-5">
                <div className="h-px w-16 bg-zinc-700" />
                <span className="text-base font-light tracking-tight text-zinc-500 md:text-lg">
                  {t("midtitle")}
                </span>
              </div>
            </div>

            <div className="max-w-md space-y-3">
              <p className="text-sm leading-relaxed text-zinc-400 md:text-[0.9375rem]">
                {t("subtitle")}
              </p>
              <p className="text-xs leading-relaxed text-zinc-600 md:text-sm">
                {t("description")}
              </p>
            </div>

            <div className="flex items-center gap-6 pt-2">
              <Link
                href="/portfolio"
                scroll={false}
                className="pointer-events-auto group inline-flex items-center gap-2 text-sm font-medium text-white/90 transition-colors hover:text-white"
              >
                {t("portfolio_cta")}
                <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </Link>
              <span className="h-3 w-px bg-zinc-800" />
              <button
                type="button"
                onClick={() =>
                  document
                    .getElementById("services")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
                className="pointer-events-auto text-sm text-zinc-600 transition-colors hover:text-zinc-400"
              >
                {t("cta")}
              </button>
            </div>
          </div>

          <div className="hidden lg:block lg:w-1/2" />
        </div>
      </div>
    </section>
  );
}
