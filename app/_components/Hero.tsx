"use client";

import { useTranslations } from "next-intl";
import { useHardwareTier } from "@/hooks/useHardwareTier";
import { useCpuBenchmark } from "@/hooks/useCpuBenchmark";
import { useEffect, useState, useMemo, useCallback } from "react";
import Robot from "@/components/shared/SplineScene";
import { ArrowUpRight, ArrowDown } from "lucide-react";
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
      className="h-full w-full object-cover "
    >
      <source
        src="https://res.cloudinary.com/dmitnt8de/video/upload/v1770236274/video_mf0fdh.mp4"
        type="video/mp4"
      />
    </video>
    <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/35 via-zinc-950/65 to-zinc-950" />
  </div>
);

const LoadingSpinner = () => (
  <div className="absolute inset-0 pointer-events-none flex items-center justify-center bg-zinc-950">
    <div className="relative h-10 w-10">
      <div
        className="absolute inset-0 rounded-full border-2 border-zinc-800"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 rounded-full border-2 border-transparent border-t-zinc-600 animate-spin"
        aria-hidden="true"
      />
    </div>
  </div>
);

export default function Hero() {
  const t = useTranslations("hero");
  const { tier } = useHardwareTier();
  const [isMobile, setIsMobile] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [forceVideoFallback, setForceVideoFallback] = useState(false);
  const [splineReady, setSplineReady] = useState(false);

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
    [isMobile, canRender3dDesktop, canRender3dMobile],
  );

  const { canRender3d: cpuCanRender3d, isRunning: cpuBenchmarkRunning } =
    useCpuBenchmark({
      isMobile,
    });

  const isLoading =
    tier === null || (hardwareEligible && cpuCanRender3d === null);

  const shouldRender3d =
    !forceVideoFallback &&
    !prefersReducedMotion &&
    hardwareEligible &&
    cpuCanRender3d === true;

  useEffect(() => {
    if (!shouldRender3d || splineReady) return;
    const timeoutId = window.setTimeout(() => {
      setForceVideoFallback(true);
    }, 7000);

    return () => window.clearTimeout(timeoutId);
  }, [shouldRender3d, splineReady]);

  const handleSplinePerformanceIssue = useCallback(() => {
    setForceVideoFallback(true);
  }, []);

  const handleSplineReady = useCallback(() => {
    setSplineReady(true);
  }, []);

  // Determine what to show
  const showSpinner = isLoading || (shouldRender3d && !splineReady);
  const showSpline = shouldRender3d;
  const showVideo = !isLoading && !shouldRender3d;

  return (
    <section
      id="hero"
      className="relative -mt-20 flex min-h-auto lg:min-h-[100svh] w-full pt-[500px] sm:pt-2 sm:items-center overflow-hidden bg-transparent"
    >
      {showVideo && <div className="absolute inset-0 bg-black/40" />}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <div className="absolute inset-0 lg:left-[35%] lg:w-[65%]">
          {/* Spinner - shown while loading or waiting for Spline */}
          {showSpinner && <LoadingSpinner />}

          {/* Spline - mounted when eligible, fades in when ready */}
          {showSpline && (
            <div
              className={`absolute inset-0 transition-opacity duration-500 ${
                splineReady ? "opacity-100" : "opacity-0"
              }`}
            >
              <Robot
                onPerformanceIssue={handleSplinePerformanceIssue}
                onReady={handleSplineReady}
              />
            </div>
          )}

          {/* Video fallback*/}
          {showVideo && <VideoFallback />}
        </div>
        {isMobile && (
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/80 to-zinc-950/20 lg:w-[60%]" />
        )}
      </div>

      <div className="container relative z-10 mx-auto max-w-7xl px-4 lg:px-0 pointer-events-none">
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
                className="pointer-events-auto group inline-flex items-center gap-2 text-sm text-white/60 transition-colors hover:text-zinc-400"
              >
                {t("cta")}
                <ArrowDown className="h-3.5 w-3.5 transition-transform group-hover:translate-y-0.5 " />
              </button>
            </div>
          </div>

          <div className="hidden lg:block lg:w-1/2" />
        </div>
      </div>
    </section>
  );
}
