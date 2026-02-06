"use client";

import { Briefcase, Calendar } from "lucide-react";
import { useTranslations } from "next-intl";
import type { ComponentType } from "react";

const icons = [Briefcase, Briefcase];

function ExperienceCard({
  title,
  organization,
  period,
  summary,
  highlight,
  icon: Icon,
}: {
  title: string;
  organization: string;
  period: string;
  summary: string;
  highlight: string;
  icon: ComponentType<{ className?: string }>;
}) {
  return (
    <article className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="rounded-lg border border-white/10 bg-white/[0.02] p-2.5">
            <Icon className="h-5 w-5 text-zinc-300" />
          </div>
          <div>
            <h3 className="text-lg font-medium text-zinc-100">{title}</h3>
            <p className="text-sm text-zinc-500">{organization}</p>
          </div>
        </div>
        <div className="inline-flex items-center gap-1.5 rounded-full border border-white/10 px-3 py-1 text-xs text-zinc-500">
          <Calendar className="h-3.5 w-3.5" />
          {period}
        </div>
      </div>

      <p className="mb-3 text-sm leading-relaxed text-zinc-400">{summary}</p>
      <p className="text-sm leading-relaxed text-zinc-200">{highlight}</p>
    </article>
  );
}

export default function ExperienceTimeline() {
  const t = useTranslations("portfolio.experience");

  const experiences = [0, 1].map((index) => ({
    title: t(`items.${index}.title`),
    organization: t(`items.${index}.organization`),
    period: t(`items.${index}.period`),
    summary: t(`items.${index}.summary`),
    highlight: t(`items.${index}.highlight`),
    icon: icons[index],
  }));

  return (
    <section id="experience" className="relative px-4 py-20">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-12 max-w-3xl space-y-4">
          <p className="text-sm tracking-wide text-zinc-500">{t("label")}</p>
          <h2 className="text-3xl font-semibold tracking-tight text-zinc-100 md:text-4xl">
            {t("title")}
          </h2>
          <p className="text-zinc-400">
            {t("subtitle")}
          </p>
        </div>

        <div className="space-y-5">
          {experiences.map((item, index) => (
            <ExperienceCard key={index} {...item} />
          ))}
        </div>
      </div>
    </section>
  );
}
