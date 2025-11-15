"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/moving-border";
import Robot from "@/components/shared/SplineScene";

export default function HeroStatic() {
  const t = useTranslations("hero");

  return (
    <section
      id="hero"
      className="relative flex flex-col items-center min-h-screen justify-center w-full min-h-screen px-4 overflow-hidden"
    >
      <Robot />
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
        <div className="mb-6 w-full sm:max-w-full lg:max-w-4xl">
          <h1 className="font-display pb-3 bg-clip-text text-transparent bg-gradient-to-t from-neutral-700 lg:text-pretty to-neutral-800 dark:from-stone-200 dark:to-neutral-200 text-3xl sm:text-4xl lg:text-6xl ">
            {t("title")}{" "}
            <span
              className="bg-none text-slate-700 text-4xl sm:text-5xl lg:text-7xl dark:text-slate-50 font-normal"
              style={{ fontFamily: "var(--font-crimson-text)" }}
            >
              {t("midtitle")}
            </span>
          </h1>
        </div>

        <h2
          className="text-sm md:text-lg 
          text-zinc-700 dark:text-zinc-300 
          max-w-3xl"
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

      {/* Líneas decorativas adaptativas */}
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
  );
}
