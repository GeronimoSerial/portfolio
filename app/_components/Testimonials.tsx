"use client";

import { useTranslations } from "next-intl";
import { Star } from "lucide-react";

export default function TestimonialsStatic() {
  const t = useTranslations("testimonials");

  const testimonials = [
    {
      key: "client1",
      name: "Juan Pérez",
      role: "CEO, Tech Solutions",
    },
    {
      key: "client2",
      name: "María González",
      role: "Product Manager, StartupXYZ",
    },
    {
      key: "client3",
      name: "Carlos Rodríguez",
      role: "CTO, Innovation Labs",
    },
  ];

  return (
    <section id="testimonials" className="relative min-h-screen py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-16">
          <h2
            className="text-4xl md:text-5xl font-display 
                       text-zinc-950 dark:text-zinc-50 
                       mb-4 gsap-element"
          >
            {t("title")}
          </h2>
          <div
            className="w-20 h-1 
                        bg-linear-to-r from-transparent 
                        via-zinc-400 dark:via-zinc-300 
                        to-transparent 
                        mx-auto mb-4"
          />
          <p
            className="text-zinc-600 dark:text-zinc-400 
                      max-w-2xl mx-auto gsap-element"
          >
            {t("subtitle")}
          </p>
        </div>

        {/* Grid de testimonials */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <article
              key={testimonial.key}
              className="p-6 
                       bg-black/5 dark:bg-white/5 
                       border border-zinc-200 dark:border-zinc-800 
                       rounded-lg 
                       gsap-element"
            >
              {/* Estrellas */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 
                                         fill-zinc-400 dark:fill-zinc-400 
                                         text-zinc-400 dark:text-zinc-400"
                  />
                ))}
              </div>

              {/* Content */}
              <p
                className="text-zinc-700 dark:text-zinc-300 
                          mb-6 leading-relaxed gsap-element"
              >
                "{t(`items.${testimonial.key}.content`)}"
              </p>

              {/* Author */}
              <div
                className="flex items-center gap-3 pt-4 
                            border-t border-zinc-200 dark:border-zinc-800 
                            gsap-element"
              >
                <div
                  className="w-10 h-10 rounded-full 
                              bg-zinc-200 dark:bg-zinc-800 
                              flex items-center justify-center 
                              gsap-element"
                >
                  <span
                    className="text-sm font-medium 
                                 text-zinc-600 dark:text-zinc-400 
                                 gsap-element"
                  >
                    {testimonial.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <p
                    className="text-sm font-medium 
                              text-zinc-900 dark:text-zinc-100 
                              gsap-element"
                  >
                    {t(`items.${testimonial.key}.name`)}
                  </p>
                  <p
                    className="text-xs 
                              text-zinc-500 dark:text-zinc-500 
                              gsap-element"
                  >
                    {t(`items.${testimonial.key}.role`)}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
