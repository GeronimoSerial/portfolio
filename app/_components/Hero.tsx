"use client";

import { useTranslations } from "next-intl";
import { ScrambleText } from "@/components/scramble-text";
import { BitmapChevron } from "@/components/bitmap-chevron";

export default function HeroStatic() {
  const t = useTranslations("hero");

  return (
    <section
      id="hero"
      className="relative flex flex-col items-center justify-center w-full min-h-screen px-4 overflow-hidden"
    >
      <div className="flex flex-col items-center text-center z-10 max-w-5xl mx-auto">
        <div className="mb-8 font-mono text-[10px] md:text-xs uppercase tracking-[0.3em] text-zinc-400">
            {t("credentials.role1")} & {t("credentials.role2")}
        </div>

        <h1 className="text-5xl md:text-8xl font-display font-bold text-zinc-200 mb-8 leading-tight tracking-tight">
          <ScrambleText text={t("name") || "Geronimo Serial"} duration={1.2} />
        </h1>

        <p className="font-mono text-xs md:text-sm text-zinc-400 max-w-lg mx-auto mb-12 leading-relaxed tracking-wide">
          {t("tagline")}
        </p>

        <div className="flex flex-col sm:flex-row gap-6 items-center">
            <button
                onClick={() => {
                document
                    .getElementById("cases")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
                className="group flex items-center gap-3 bg-zinc-200 text-zinc-900 px-8 py-4 font-mono text-xs uppercase tracking-widest hover:bg-white transition-all duration-300 rounded-full"
            >
                {t("cta.primary")}
                <BitmapChevron className="transition-transform duration-300 group-hover:rotate-45" />
            </button>

            <button
                onClick={() => {
                document
                    .getElementById("expertise") // Changed to expertise or methodology depending on nav
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
                className="px-8 py-4 border border-zinc-700 text-zinc-400 font-mono text-xs uppercase tracking-widest hover:text-zinc-200 hover:border-zinc-500 transition-colors duration-300 rounded-full"
            >
                {t("cta.secondary")}
            </button>
        </div>
      </div>
      
      {/* Footer labels */}
      <div className="absolute bottom-12 left-0 w-full px-6 md:px-12 flex justify-between items-end pointer-events-none">
          <div className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest hidden md:block">
            <div className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-accent" />
                {t("credentials.location")}
            </div>
          </div>
          <div className="font-mono text-[10px] text-muted-foreground uppercase tracking-widest text-right">
             v.2.4 / System Online
          </div>
      </div>
    </section>
  );
}
