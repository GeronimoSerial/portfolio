"use client";

import { ArrowUpRight, Github, Linkedin, Mail, MapPin } from "lucide-react";
import { useTranslations } from "next-intl";
import SendMessage from "./SendMessage";

const icons = [Mail, Github, Linkedin];

export default function ContactOpportunities() {
  const t = useTranslations("portfolio.contact");

  const channels = [
    {
      label: t("channels.email.label"),
      value: t("channels.email.value"),
      href: "mailto:contacto@geroserial.com",
      icon: icons[0],
    },
    {
      label: t("channels.github.label"),
      value: t("channels.github.value"),
      href: "https://github.com/geroserial",
      icon: icons[1],
    },
    {
      label: t("channels.linkedin.label"),
      value: t("channels.linkedin.value"),
      href: "https://linkedin.com/in/geroserial",
      icon: icons[2],
    },
  ];

  return (
    <section id="contact-opp" className="relative px-4 py-20">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-12 max-w-3xl space-y-4">
          <p className="text-sm tracking-wide text-zinc-500">{t("label")}</p>
          <h2 className="text-3xl font-semibold tracking-tight text-zinc-100 md:text-4xl">
            {t("title")}
          </h2>
          <p className="text-zinc-400">
            {t.rich("subtitle", {
              email: (chunks) => (
                <a
                  href="mailto:contacto@geroserial.com"
                  className="text-zinc-300 hover:text-white transition-colors underline"
                >
                  {chunks}
                </a>
              ),
              linkedin: (chunks) => (
                <a
                  href="https://www.linkedin.com/in/geronimoserial/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-zinc-300 hover:text-white transition-colors underline"
                >
                  {chunks}
                </a>
              ),
            })}
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <div className="space-y-4">
              {channels.map((channel) => (
                <a
                  key={channel.label}
                  href={channel.href}
                  target={
                    channel.href.startsWith("http") ? "_blank" : undefined
                  }
                  rel={
                    channel.href.startsWith("http")
                      ? "noopener noreferrer"
                      : undefined
                  }
                  className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.02] p-4 transition-colors hover:border-white/20 hover:bg-white/[0.04]"
                >
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg border border-white/10 bg-white/[0.02] p-2.5">
                      <channel.icon className="h-5 w-5 text-zinc-300" />
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wide text-zinc-500">
                        {channel.label}
                      </p>
                      <p className="text-sm text-zinc-200">{channel.value}</p>
                    </div>
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-zinc-500" />
                </a>
              ))}
            </div>
          </div>

          <aside className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <div className="mb-4 flex items-center gap-2 text-zinc-300">
              <MapPin className="h-4 w-4" />
              <span className="text-sm">{t("location")}</span>
            </div>
            <p className="text-sm leading-relaxed text-zinc-400">
              {t("description")}
            </p>
            <SendMessage />
          </aside>
        </div>
      </div>
    </section>
  );
}
