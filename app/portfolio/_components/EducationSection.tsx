"use client";

import { BookOpen, GraduationCap } from "lucide-react";
import { useTranslations } from "next-intl";

export default function EducationSection() {
  const t = useTranslations("portfolio.education");

  const educationItems = [0, 1].map((index) => ({
    title: t(`formal.${index}.title`),
    institution: t(`formal.${index}.institution`),
    period: t(`formal.${index}.period`),
    summary: t(`formal.${index}.summary`),
  }));

  const continuousItems = [0, 1, 2, 3, 4].map((index) =>
    t(`continuous.items.${index}`)
  );

  return (
    <section id="education" className="relative px-4 py-20">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-12 max-w-3xl space-y-4">
          <p className="text-sm tracking-wide text-zinc-500">{t("label")}</p>
          <h2 className="text-3xl font-semibold tracking-tight text-zinc-100 md:text-4xl">
            {t("title")}
          </h2>
          <p className="text-zinc-400">{t("subtitle")}</p>
        </div>

        <div className="grid gap-5 lg:grid-cols-[1.25fr_0.75fr]">
          <div className="space-y-5">
            {educationItems.map((item) => (
              <article
                key={item.title}
                className="rounded-2xl border border-white/10 bg-white/[0.03] p-6"
              >
                <div className="mb-4 flex items-start gap-3">
                  <div className="rounded-lg border border-white/10 bg-white/[0.02] p-2.5">
                    <GraduationCap className="h-5 w-5 text-zinc-300" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-zinc-100">
                      {item.title}
                    </h3>
                    <p className="text-sm text-zinc-500">{item.institution}</p>
                  </div>
                </div>
                <p className="mb-3 text-xs uppercase tracking-wide text-zinc-500">
                  {item.period}
                </p>
                <p className="text-sm leading-relaxed text-zinc-400">
                  {item.summary}
                </p>
              </article>
            ))}
          </div>

          <aside className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-lg border border-white/10 bg-white/[0.02] p-2.5">
                <BookOpen className="h-5 w-5 text-zinc-300" />
              </div>
              <h3 className="text-lg font-medium text-zinc-100">
                {t("continuous.title")}
              </h3>
            </div>
            <ul className="space-y-2.5 text-sm text-zinc-400">
              {continuousItems.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="mt-2 h-1.5 w-1.5 rounded-full bg-zinc-500" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </div>
    </section>
  );
}
