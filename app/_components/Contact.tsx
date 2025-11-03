"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { useContactAnimations } from "@/hooks/useContactAnimations";
import { MirrorButton } from "@/components/ui/mirror_button";
export default function Contact() {
  const t = useTranslations("contact");
  const containerRef = useContactAnimations();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    message: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log("Form submitted:", formData);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
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
                <h2 className="text-5xl md:text-6xl lg:text-7xl font-display font-light tracking-tight text-zinc-950 dark:text-zinc-50 leading-[0.9] gsap-title">
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
                <MirrorButton type="submit" variant="default" size="full">
                  {t("form.submit")}
                </MirrorButton>
              </div>

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
