"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useContactAnimations } from "@/hooks/useContactAnimations";
import { MirrorButton } from "@/components/ui/mirror_button";
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
      console.log("Sending data:", {
        firstName: formData.name,
        email: formData.email,
        company: formData.company,
        message: formData.message,
      });

      const response = await fetch("/api/send", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstName: formData.name, // ← CAMBIO: name → firstName
          email: formData.email,
          company: formData.company || undefined,
          message: formData.message,
          locale: locale,
        }),
      });

      const result = await response.json();
      console.log("Response:", { status: response.status, result });

      // ← CAMBIO: Verificar si la respuesta es exitosa
      if (!response.ok) {
        throw new Error(result.error || "Error al enviar el mensaje");
      }

      // Éxito
      setSubmitStatus({
        type: "success",
        message:
          t("form.success") ||
          "¡Mensaje enviado con éxito! Te responderé pronto.",
      });

      // Limpiar formulario
      setFormData({
        name: "",
        email: "",
        company: "",
        message: "",
      });
    } catch (error) {
      console.error("Error sending form:", error);
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
    <section
      id="contact"
      ref={containerRef}
      className="relative min-h-screen py-20 px-4 overflow-hidden"
    >
      {/* SVG Art Masks - Abstract Organic Shapes */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.03] dark:opacity-[0.02]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Organic blob mask */}
          <mask id="organic-mask">
            <rect width="100%" height="100%" fill="black" />
            <path
              d="M 200,300 Q 350,150 500,250 T 800,350 Q 750,500 600,550 T 200,450 Z"
              fill="white"
              className="gsap-mask-1"
            />
          </mask>

          {/* Hand silhouette mask */}
          <mask id="hand-mask">
            <rect width="100%" height="100%" fill="black" />
            <ellipse
              cx="85%"
              cy="60%"
              rx="180"
              ry="220"
              fill="white"
              className="gsap-mask-2"
            />
            <path
              d="M 1400,600 Q 1420,500 1440,550 L 1460,700 Q 1450,750 1420,730 Z"
              fill="white"
              className="gsap-mask-2"
            />
          </mask>
        </defs>

        {/* Apply masks with subtle patterns */}
        <g mask="url(#organic-mask)">
          <rect
            width="100%"
            height="100%"
            fill="currentColor"
            className="text-zinc-950 dark:text-zinc-50"
          />
        </g>
        <g mask="url(#hand-mask)">
          <rect
            width="100%"
            height="100%"
            fill="currentColor"
            className="text-zinc-900 dark:text-zinc-100"
          />
        </g>
      </svg>

      {/* Floating geometric elements */}
      <div className="absolute top-20 left-10 w-24 h-24 border border-zinc-200 dark:border-zinc-800 rounded-full gsap-float-1" />
      <div className="absolute bottom-32 right-16 w-32 h-32 border border-zinc-300 dark:border-zinc-700 gsap-float-2" />
      <div className="absolute top-1/2 right-1/4 w-2 h-2 bg-zinc-400 dark:bg-zinc-600 rounded-full gsap-float-3" />

      <div className="container mx-auto max-w-6xl relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Column - Typography & Info */}
          <div className="space-y-10 gsap-fade-left">
            <div className="space-y-5">
              <div className="overflow-hidden">
                <h2 className="text-5xl md:text-6xl lg:text-7xl  font-light tracking-tight text-zinc-950 dark:text-zinc-50 leading-[0.9] gsap-title">
                  {t("heading.line1")}
                  <br />
                  <span className="font-normal italic">
                    {t("heading.line2")}
                  </span>
                </h2>
              </div>

              <div className="h-px w-20 bg-gradient-to-r from-zinc-950 dark:from-zinc-50 to-transparent gsap-line" />

              <p className="text-base text-zinc-600 dark:text-zinc-400 max-w-md leading-relaxed gsap-description">
                {t("description")}
              </p>
            </div>

            {/* Contact Details */}
            <div className="space-y-6 gsap-info">
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
                  className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-50 transition-colors duration-300 gsap-social"
                >
                  GitHub
                </a>
                <a
                  href="https://linkedin.com/in/geronimoserial"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-zinc-600 dark:text-zinc-400 hover:text-zinc-950 dark:hover:text-zinc-50 transition-colors duration-300 gsap-social"
                >
                  LinkedIn
                </a>
              </div>
            </div>
          </div>

          {/* Right Column - Form */}
          <div className="relative gsap-fade-right">
            {/* Decorative frame */}
            <div className="absolute -inset-6 border border-zinc-200 dark:border-zinc-800 pointer-events-none gsap-frame" />

            <form
              onSubmit={handleSubmit}
              className="relative bg-white/80 dark:bg-black/80 backdrop-blur-xl border border-zinc-300 dark:border-zinc-700 p-8 space-y-6"
            >
              {/* Form Fields */}
              <div className="space-y-6">
                {/* Name Field */}
                <div className="relative gsap-field">
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

                {/* Email Field */}
                <div className="relative gsap-field">
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

                {/* Company Field */}
                <div className="relative gsap-field">
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

                {/* Message Field */}
                <div className="relative gsap-field">
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

              {/* Submit Button */}
              <div className="pt-3 gsap-submit">
                <MirrorButton
                  type="submit"
                  variant="default"
                  size="full"
                  isLoading={isSubmitting}
                  disabled={isSubmitting}
                >
                  {isSubmitting
                    ? t("form.sending") || "Sending"
                    : t("form.submit")}
                </MirrorButton>
              </div>
              {submitStatus.type && (
                <div
                  className={cn(
                    "mt-4 p-4 rounded-lg border text-sm animate-in fade-in slide-in-from-top-2 duration-300",
                    submitStatus.type === "success"
                      ? "bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800 text-green-800 dark:text-green-200"
                      : "bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200"
                  )}
                  role="alert"
                >
                  <p className="flex items-center gap-2">
                    {submitStatus.type === "success" ? (
                      <svg
                        className="w-5 h-5 flex-shrink-0"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="w-5 h-5 flex-shrink-0"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                    {submitStatus.message}
                  </p>
                </div>
              )}

              {/* Privacy Notice */}
              <p className="text-xs text-zinc-500 dark:text-zinc-500 leading-relaxed gsap-privacy">
                {t("form.privacy")}
              </p>
            </form>
          </div>
        </div>

        {/* Bottom Accent */}
        <div className="mt-20 flex justify-center gsap-accent">
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
