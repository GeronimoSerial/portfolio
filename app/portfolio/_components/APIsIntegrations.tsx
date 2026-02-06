"use client";

import { Bot, Link2 } from "lucide-react";
import { useTranslations } from "next-intl";
import type { ComponentType } from "react";

const icons = [Link2, Bot];

function IntegrationPanel({
  title,
  summary,
  impact,
  icon: Icon,
  impactLabel,
}: {
  title: string;
  summary: string;
  impact: string;
  icon: ComponentType<{ className?: string }>;
  impactLabel: string;
}) {
  return (
    <article className="flex h-full flex-col rounded-2xl border border-white/10 bg-white/[0.03] p-6">
      <div className="mb-5 flex items-center gap-3">
        <div className="rounded-lg border border-white/10 bg-white/[0.02] p-2.5">
          <Icon className="h-5 w-5 text-zinc-300" />
        </div>
        <h3 className="text-lg font-medium text-zinc-100">{title}</h3>
      </div>

      <div className="space-y-3 text-sm leading-relaxed">
        <p className="text-zinc-300">{summary}</p>
        <p className="text-zinc-200">{impactLabel} {impact}</p>
      </div>
    </article>
  );
}

export default function APIsIntegrations() {
  const t = useTranslations("portfolio.apis");

  const cases = [0, 1].map((index) => ({
    title: t(`cases.${index}.title`),
    summary: t(`cases.${index}.summary`),
    impact: t(`cases.${index}.impact`),
    icon: icons[index],
  }));

  return (
    <section id="apis" className="relative px-4 py-20">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-12 max-w-3xl space-y-4">
          <p className="text-sm tracking-wide text-zinc-500">{t("label")}</p>
          <h2 className="text-3xl font-semibold tracking-tight text-zinc-100 md:text-4xl">
            {t("title")}
          </h2>
          <p className="text-zinc-400">{t("subtitle")}</p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {cases.map((item, index) => (
            <IntegrationPanel key={index} {...item} impactLabel={t("impactLabel", { fallback: "Impacto:" })} />
          ))}
        </div>
      </div>
    </section>
  );
}
