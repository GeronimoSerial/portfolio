"use client";

import { useTranslations } from "next-intl";

export default function ImpactStatement() {
  const t = useTranslations("impactStatement");

  return (
    <section className="py-20 px-4 border-y border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/20">
      <div className="container mx-auto max-w-4xl text-center">
        <blockquote
          className="text-2xl md:text-3xl font-light text-zinc-700 dark:text-zinc-300 leading-relaxed"
          style={{ fontFamily: "var(--font-crimson-text)" }}
        >
          &quot;{t("quote.part1")}{" "}
          <span className="font-semibold text-zinc-900 dark:text-zinc-50">
            {t("quote.highlight1")}
          </span>{" "}
          {t("quote.part2")}{" "}
          <span className="font-semibold text-zinc-900 dark:text-zinc-50">
            {t("quote.highlight2")}
          </span>{" "}
          {t("quote.part3")}&quot;
        </blockquote>

        <div className="mt-8 flex items-center justify-center gap-6">
          <button
            onClick={() => {
              document
                .getElementById("cases")
                ?.scrollIntoView({ behavior: "smooth" });
            }}
            className="text-sm text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-50 underline underline-offset-4 cursor-pointer"
          >
            {t("cta")} →
          </button>
        </div>
      </div>
    </section>
  );
}
