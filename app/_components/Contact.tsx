"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useContactAnimations } from "@/hooks/useContactAnimations";
import { cn } from "@/lib/utils";

export default function Contact() {
  const t = useTranslations("contact");
  const locale = useLocale();
  const containerRef = useContactAnimations();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: "" });

    try {
      const response = await fetch("/api/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: formData.name,
          email: formData.email,
          company: formData.company || undefined,
          message: formData.message,
          locale,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Error al enviar el mensaje");
      }

      setSubmitStatus({
        type: "success",
        message: t("form.success") || "Mensaje enviado con exito.",
      });

      setFormData({ name: "", email: "", company: "", message: "" });
    } catch (error) {
      setSubmitStatus({
        type: "error",
        message: error instanceof Error ? error.message : t("form.error") || "Hubo un error.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <section id="contact" ref={containerRef} className="relative px-4 py-20">
      <div className="container mx-auto max-w-6xl">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="space-y-6">
            <p className="text-sm tracking-wide text-zinc-500">Contacto</p>
            <h2 className="gsap-title text-3xl font-semibold tracking-tight text-zinc-100 md:text-4xl">
              {t("heading.line1")} {t("heading.line2")}
            </h2>
            <p className="max-w-md text-zinc-400">{t("description")}</p>

            <div className="space-y-4 text-sm">
              <div>
                <p className="text-xs uppercase tracking-wide text-zinc-500">{t("info.directContact")}</p>
                <a
                  href="mailto:contact@geroserial.com"
                  className="text-zinc-200 transition-colors hover:text-zinc-100"
                >
                  contact@geroserial.com
                </a>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wide text-zinc-500">{t("info.basedIn")}</p>
                <p className="text-zinc-300">Corrientes, Argentina</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 md:p-8">
            <div className="space-y-5">
              <div>
                <label htmlFor="name" className="mb-2 block text-xs uppercase tracking-wide text-zinc-500">
                  {t("form.name.label")}
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-white/10 bg-white/[0.02] px-3 py-2.5 text-sm text-zinc-200 placeholder:text-zinc-500 focus:border-white/25 focus:outline-none"
                  placeholder={t("form.name.placeholder")}
                />
              </div>

              <div>
                <label htmlFor="email" className="mb-2 block text-xs uppercase tracking-wide text-zinc-500">
                  {t("form.email.label")}
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full rounded-lg border border-white/10 bg-white/[0.02] px-3 py-2.5 text-sm text-zinc-200 placeholder:text-zinc-500 focus:border-white/25 focus:outline-none"
                  placeholder={t("form.email.placeholder")}
                />
              </div>

              <div>
                <label htmlFor="company" className="mb-2 block text-xs uppercase tracking-wide text-zinc-500">
                  {t("form.company.label")} {t("form.company.optional")}
                </label>
                <input
                  type="text"
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  className="w-full rounded-lg border border-white/10 bg-white/[0.02] px-3 py-2.5 text-sm text-zinc-200 placeholder:text-zinc-500 focus:border-white/25 focus:outline-none"
                  placeholder={t("form.company.placeholder")}
                />
              </div>

              <div>
                <label htmlFor="message" className="mb-2 block text-xs uppercase tracking-wide text-zinc-500">
                  {t("form.message.label")}
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={4}
                  className="w-full resize-none rounded-lg border border-white/10 bg-white/[0.02] px-3 py-2.5 text-sm text-zinc-200 placeholder:text-zinc-500 focus:border-white/25 focus:outline-none"
                  placeholder={t("form.message.placeholder")}
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex w-full items-center justify-center rounded-lg bg-zinc-100 px-4 py-2.5 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-200 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSubmitting ? t("form.sending") || "Enviando" : t("form.submit")}
              </button>
            </div>

            {submitStatus.type && (
              <div
                className={cn(
                  "mt-4 rounded-lg border p-3 text-sm",
                  submitStatus.type === "success"
                    ? "border-green-800 bg-green-950/20 text-green-200"
                    : "border-red-800 bg-red-950/20 text-red-200"
                )}
                role="alert"
              >
                {submitStatus.message}
              </div>
            )}

            <p className="mt-4 text-xs leading-relaxed text-zinc-500">{t("form.privacy")}</p>
          </form>
        </div>

        <div className="mt-10 inline-flex rounded-lg border border-white/10 bg-white/[0.02] px-3 py-1.5 text-xs tracking-wide text-zinc-500">
          {t("availability")}
        </div>
      </div>
    </section>
  );
}
