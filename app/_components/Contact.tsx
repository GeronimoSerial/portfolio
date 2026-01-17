"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { cn } from "@/lib/utils";

export default function Contact() {
  const t = useTranslations("contact");
  const locale = useLocale();

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
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: formData.name,
          email: formData.email,
          company: formData.company || undefined,
          message: formData.message,
          locale: locale,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Error al enviar el mensaje");
      }

      setSubmitStatus({
        type: "success",
        message:
          t("form.success") ||
          "¡Mensaje enviado con éxito! Te responderé pronto.",
      });

      setFormData({
        name: "",
        email: "",
        company: "",
        message: "",
      });
    } catch (error) {
      setSubmitStatus({
        type: "error",
        message:
          error instanceof Error
            ? error.message
            : t("form.error") || "Hubo un error. Intenta de nuevo.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <section id="contact" className="relative min-h-screen py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="space-y-10">
            <div className="space-y-5">
              <h2 className="text-5xl md:text-6xl lg:text-7xl font-light tracking-tight text-zinc-950 dark:text-zinc-50 leading-[0.9]">
                {t("heading.line1")}
                <br />
                <span className="font-normal italic">
                  {t("heading.line2")}
                </span>
              </h2>

              <div className="h-px w-20 bg-gradient-to-r from-zinc-950 dark:from-zinc-50 to-transparent" />

              <p className="text-base text-zinc-600 dark:text-zinc-400 max-w-md leading-relaxed">
                {t("description")}
              </p>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <p className="text-xs font-medium uppercase tracking-widest text-zinc-500 dark:text-zinc-500">
                  {t("info.directContact")}
                </p>
                <a
                  href="mailto:contact@geroserial.com"
                  className="block text-lg text-zinc-950 dark:text-zinc-50 hover:text-zinc-600 dark:hover:text-zinc-400 transition-colors duration-300"
                >
                  contact@geroserial.com
                </a>
              </div>

              <div className="space-y-2">
                <p className="text-xs font-medium uppercase tracking-widest text-zinc-500 dark:text-zinc-500">
                  {t("info.basedIn")}
                </p>
                <p className="text-lg text-zinc-950 dark:text-zinc-50">
                  Corrientes, Argentina
                </p>
              </div>

              <div className="flex gap-6 pt-3">
                <a
                  href="https://github.com/GeronimoSerial"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-50 transition-colors duration-300"
                >
                  GitHub
                </a>
                <a
                  href="https://linkedin.com/in/geronimoserial"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-50 transition-colors duration-300"
                >
                  LinkedIn
                </a>
              </div>
            </div>
          </div>

          <div className="relative">
            <form
              onSubmit={handleSubmit}
              className="relative bg-white/80 dark:bg-black/80 backdrop-blur-xl border border-zinc-300 dark:border-zinc-700 p-8 space-y-6"
            >
              <div className="space-y-6">
                <div className="relative">
                  <label
                    htmlFor="name"
                    className="block text-xs font-medium uppercase tracking-widest text-zinc-500 dark:text-zinc-500 mb-2"
                  >
                    {t("form.name.label")}
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full bg-transparent border-b border-zinc-300 dark:border-zinc-700 py-2.5 text-base text-zinc-950 dark:text-zinc-50 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:border-zinc-950 dark:focus:border-zinc-50 focus:outline-none transition-colors duration-300"
                    placeholder={t("form.name.placeholder")}
                  />
                </div>

                <div className="relative">
                  <label
                    htmlFor="email"
                    className="block text-xs font-medium uppercase tracking-widest text-zinc-500 dark:text-zinc-500 mb-2"
                  >
                    {t("form.email.label")}
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full bg-transparent border-b border-zinc-300 dark:border-zinc-700 py-2.5 text-base text-zinc-950 dark:text-zinc-50 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:border-zinc-950 dark:focus:border-zinc-50 focus:outline-none transition-colors duration-300"
                    placeholder={t("form.email.placeholder")}
                  />
                </div>

                <div className="relative">
                  <label
                    htmlFor="company"
                    className="block text-xs font-medium uppercase tracking-widest text-zinc-500 dark:text-zinc-500 mb-2"
                  >
                    {t("form.company.label")}
                    <span className="text-zinc-400 dark:text-zinc-600 ml-2 normal-case tracking-normal">
                      {t("form.company.optional")}
                    </span>
                  </label>
                  <input
                    type="text"
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    className="w-full bg-transparent border-b border-zinc-300 dark:border-zinc-700 py-2.5 text-base text-zinc-950 dark:text-zinc-50 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:border-zinc-950 dark:focus:border-zinc-50 focus:outline-none transition-colors duration-300"
                    placeholder={t("form.company.placeholder")}
                  />
                </div>

                <div className="relative">
                  <label
                    htmlFor="message"
                    className="block text-xs font-medium uppercase tracking-widest text-zinc-500 dark:text-zinc-500 mb-2"
                  >
                    {t("form.message.label")}
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={3}
                    className="w-full bg-transparent border-b border-zinc-300 dark:border-zinc-700 py-2.5 text-base text-zinc-950 dark:text-zinc-50 placeholder:text-zinc-400 dark:placeholder:text-zinc-600 focus:border-zinc-950 dark:focus:border-zinc-50 focus:outline-none transition-colors duration-300 resize-none"
                    placeholder={t("form.message.placeholder")}
                  />
                </div>
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-zinc-900 dark:bg-zinc-100 text-zinc-50 dark:text-zinc-900 px-6 py-3 font-medium hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting
                    ? t("form.sending") || "Sending"
                    : t("form.submit")}
                </button>
              </div>

              {submitStatus.type && (
                <div
                  className={cn(
                    "mt-4 p-4 border text-sm",
                    submitStatus.type === "success"
                      ? "bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800 text-green-800 dark:text-green-200"
                      : "bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200"
                  )}
                  role="alert"
                >
                  {submitStatus.message}
                </div>
              )}

              <p className="text-xs text-zinc-500 dark:text-zinc-500 leading-relaxed">
                {t("form.privacy")}
              </p>
            </form>
          </div>
        </div>

        <div className="mt-20 flex justify-center">
          <div className="flex items-center gap-4">
            <div className="h-px w-12 bg-zinc-300 dark:bg-zinc-700" />
            <p className="text-xs text-zinc-500 dark:text-zinc-500 tracking-widest">
              {t("availability")}
            </p>
            <div className="h-px w-12 bg-zinc-300 dark:bg-zinc-700" />
          </div>
        </div>
      </div>
    </section>
  );
}
