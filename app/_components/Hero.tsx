"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/moving-border";
import { useHardwareTier } from "@/hooks/useHardwareTier";
import { useEffect, useState } from "react";
import Robot from "@/components/shared/SplineScene";

// const Robot = dynamic(() => import("@/components/shared/SplineScene"), {
//   ssr: false,
//   loading: () => (
//     <div className="absolute inset-0 -z-10 pointer-events-none"></div>
//   ),
// });

const VideoFallback = () => (
  <div className="absolute inset-0 -z-10 pointer-events-none">
    <video
      autoPlay
      muted
      playsInline
      loop
      preload="none"
      poster="/assets/images/poster.png"
      className="w-full h-full object-cover opacity-70"
    >
      <source
        src="https://res.cloudinary.com/dmitnt8de/video/upload/v1770236274/video_mf0fdh.mp4"
        type="video/mp4"
      />
    </video>
    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background/80" />
  </div>
);

const LoadingBackdrop = () => (
  <div className="absolute inset-0 -z-10 pointer-events-none">
    <div className="w-full h-full bg-gradient-to-b from-transparent via-transparent to-background/80" />
  </div>
);

export default function HeroStatic() {
  const t = useTranslations("hero");
  const { tier } = useHardwareTier();
  const [isMobile, setIsMobile] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const updateMobile = () => setIsMobile(window.innerWidth < 768);
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

    // Fallback for older Safari
    const legacyMedia = media as MediaQueryList & {
      addListener: (listener: (event: MediaQueryListEvent) => void) => void;
      removeListener: (listener: (event: MediaQueryListEvent) => void) => void;
    };
    legacyMedia.addListener(updatePreference);
    return () => legacyMedia.removeListener(updatePreference);
  }, []);

  const canRender3dDesktop = tier !== null && tier >= 2;
  const canRender3dMobile = tier !== null && tier >= 3;
  const shouldRender3d =
    !prefersReducedMotion && (isMobile ? canRender3dMobile : canRender3dDesktop);

  return (
    <>
      <section
        id="hero"
        className="relative -mt-20 flex flex-col items-center justify-center w-full min-h-[100svh] md:min-h-[100svh] px-4 overflow-hidden"
      >
        <div className="absolute opacity-60 inset-0 -z-10 pointer-events-none">
          {/* <Beams /> */}
        </div>
        {tier === null ? (
          <LoadingBackdrop />
        ) : shouldRender3d ? (
          <Robot />
        ) : (
          <VideoFallback />
        )}

        <div
          className="pointer-events-none absolute bottom-0 left-0 right-0 h-24
        bg-gradient-to-t from-background/60 to-transparent"
        />

        <div
          className="hero-content z-10 flex flex-col items-center text-center
        rounded-2xl p-8
        bg-gradient-to-b from-white/40 via-white/20 to-white/10
        dark:bg-gradient-to-b dark:from-black/40 dark:via-black/20 dark:to-black/10
        backdrop-saturate-150 pointer-events-none"
        >
          <div className="mb-6 w-full sm:max-w-full md:max-w-xl  lg:max-w-3xl">
            <h1 className="font-extrabold font-display pb-3 bg-clip-text text-transparent bg-gradient-to-t from-neutral-800 lg:text-pretty to-neutral-900 dark:from-stone-200 dark:to-neutral-200 text-xl sm:text-3xl lg:text-5xl ">
              {t("title")}{" "}
              <span
                className="relative z-10 bg-none text-slate-900 text-2xl sm:text-4xl lg:text-6xl dark:text-slate-50 font-normal italic "
                style={{ fontFamily: "var(--font-crimson-text)" }}
              >
                {t("midtitle")}
              </span>
            </h1>
          </div>

          <h2
            className="text-sm md:text-lg
          text-zinc-700 dark:text-zinc-300
          max-w-3xl font-sans"
          >
            {t("subtitle")}
          </h2>

          <p
            className="mt-4 text-sm md:text-base
          text-zinc-500 dark:text-zinc-500
          max-w-xl leading-relaxed"
          >
            {t("description")}
          </p>

          {/* Botones simples */}
          <div className="flex gap-4 mt-10">
            <Button
              borderRadius="0.75rem"
              borderClassName="bg-[radial-gradient(black_40%,transparent_60%)] dark:bg-[radial-gradient(white_40%,transparent_60%)]"
              as="button"
              className="bg-white dark:bg-black text-black dark:text-white border-neutral-200 dark:border-slate-800 text-sm font-medium pointer-events-auto cursor-pointer"
              onClick={() => {
                document
                  .getElementById("services")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              {t("cta")}
            </Button>
          </div>
        </div>
        <div
          className="absolute top-0 w-screen h-px
        bg-linear-to-r
        from-zinc-700/0 via-zinc-700/50 to-zinc-700/0
        dark:from-zinc-300/0 dark:via-zinc-300/50 dark:to-zinc-300/0
        origin-center"
        />
        <div
          className="absolute bottom-0 w-screen h-px
        bg-linear-to-r
        from-zinc-700/0 via-zinc-700/50 to-zinc-700/0
        dark:from-zinc-300/0 dark:via-zinc-300/50 dark:to-zinc-300/0
        origin-center"
        />
      </section>
    </>
  );
}
