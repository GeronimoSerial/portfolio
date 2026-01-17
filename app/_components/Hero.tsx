"use client";

import { useTranslations } from "next-intl";
import { ArrowRight } from "lucide-react";

export default function Hero() {
  const t = useTranslations("hero");

  return (
    <section
      id="hero"
      className="relative flex flex-col justify-between w-full min-h-[calc(100vh-4rem)] md:min-h-screen px-4 md:px-16 py-8 md:py-16 overflow-hidden border-b border-border/50"
    >
      <div className="flex flex-col md:flex-row justify-between items-start w-full z-10 gap-4 md:gap-0">
        <div className="font-mono text-[10px] md:text-xs uppercase tracking-[0.2em] text-zinc-500 border-l border-accent/50 pl-4 h-full flex items-center min-w-[200px]">
          SOFTWARE ENGINEER
        </div>

        <div className="font-mono text-[10px] md:text-xs uppercase tracking-[0.2em] text-zinc-500 text-right">
          <span className="inline-block w-2 h-2 bg-green-500 rounded-full mr-2 animate-pulse" />
          AVAILABLE FOR WORK
        </div>
      </div>

      <div className="flex-1 flex flex-col justify-center items-start z-10 my-12 md:my-0">
        <h1 className="text-7xl sm:text-8xl md:text-[9rem] lg:text-[11rem] leading-[0.85] font-display font-bold text-foreground uppercase mix-blend-difference tracking-tighter">
          {t("name")?.split(" ")[0] || "GERO"}
          <br />
          <span className="text-zinc-600">
            {t("name")?.split(" ")[1] || "SERIAL"}
          </span>
        </h1>

        <div className="mt-8 md:mt-12 max-w-xl">
          <p className="font-mono text-xs md:text-sm text-muted-foreground leading-relaxed tracking-wide border-l-2 border-zinc-800 pl-6">
            {t("tagline")}
          </p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-end w-full z-10 gap-8 md:gap-0">
        <div className="flex flex-col items-start gap-4">
          <div className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground mb-2">
            {t("credentials.location")}
          </div>

          <button
            onClick={() => {
              document
                .getElementById("cases")
                ?.scrollIntoView({ behavior: "smooth" });
            }}
            className="group flex items-center gap-3 bg-foreground text-background px-6 py-3 font-mono text-xs uppercase tracking-widest hover:bg-zinc-200 transition-all duration-300"
          >
            {t("cta.primary")}
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </button>
        </div>

        <div className="font-mono text-[10px] uppercase tracking-widest text-zinc-600 text-right">
          v.2.4 / System Online
          <div className="mt-2 text-[8px] opacity-50">4R-GRID-SYS</div>
        </div>
      </div>
    </section>
  );
}
