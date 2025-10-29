"use client";

import { motion } from "motion/react";
import { useSectionInView } from "@/hooks/useSectionInView";
import { Star } from "lucide-react";
import { useState } from "react";

export default function Testimonials() {
  const { ref, inView } = useSectionInView();
  const [activeIndex, setActiveIndex] = useState(0);

  const testimonials = [
    {
      name: "María González",
      role: "CEO",
      company: "TechStartup",
      content:
        "Geronimo transformó nuestra visión en una plataforma funcional y escalable. Su profesionalismo y expertise técnico son excepcionales.",
      rating: 5,
      image: "/testimonials/maria.jpg", // Placeholder
    },
    {
      name: "Carlos Ramírez",
      role: "Product Manager",
      company: "InnovaLabs",
      content:
        "Trabajar con Geronimo fue una experiencia increíble. Siempre disponible, propositivo y con soluciones innovadoras.",
      rating: 5,
      image: "/testimonials/carlos.jpg", // Placeholder
    },
    {
      name: "Ana Martínez",
      role: "Directora de Marketing",
      company: "DigitalCorp",
      content:
        "La calidad del trabajo y atención al detalle superó nuestras expectativas. Altamente recomendado.",
      rating: 5,
      image: "/testimonials/ana.jpg", // Placeholder
    },
  ];

  const nextTestimonial = () => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setActiveIndex(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length
    );
  };

  return (
    <section
      id="testimonials"
      ref={ref}
      className="relative min-h-screen py-20 px-4 bg-gradient-to-b from-black to-zinc-950"
    >
      <div className="container mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-display text-zinc-50 mb-4">
            Testimonios
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-transparent via-zinc-300 to-transparent mx-auto mb-4" />
          <p className="text-zinc-400 max-w-2xl mx-auto">
            Lo que dicen quienes han trabajado conmigo
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="relative"
        >
          {/* Testimonial Card */}
          <div className="bg-white/5 border border-zinc-800 rounded-lg p-8 md:p-12">
            <div className="flex flex-col items-center text-center">
              {/* Avatar Placeholder */}
              <div className="w-20 h-20 rounded-full bg-zinc-800 border-2 border-zinc-700 mb-6 flex items-center justify-center">
                <span className="text-2xl font-display text-zinc-400">
                  {testimonials[activeIndex].name.charAt(0)}
                </span>
              </div>

              {/* Rating */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: testimonials[activeIndex].rating }).map(
                  (_, i) => (
                    <Star
                      key={i}
                      className="w-5 h-5 fill-zinc-300 text-zinc-300"
                    />
                  )
                )}
              </div>

              {/* Content */}
              <blockquote className="text-lg md:text-xl text-zinc-200 leading-relaxed mb-6 max-w-2xl">
                "{testimonials[activeIndex].content}"
              </blockquote>

              {/* Author */}
              <div>
                <p className="font-display text-zinc-50 mb-1">
                  {testimonials[activeIndex].name}
                </p>
                <p className="text-sm text-zinc-400">
                  {testimonials[activeIndex].role} •{" "}
                  {testimonials[activeIndex].company}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              onClick={prevTestimonial}
              className="p-2 bg-white/5 border border-zinc-800 rounded-lg hover:border-zinc-500 hover:bg-white/10 transition-all duration-200"
              aria-label="Anterior testimonio"
            >
              <svg
                className="w-5 h-5 text-zinc-400"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M15 19l-7-7 7-7"></path>
              </svg>
            </button>

            {/* Dots */}
            <div className="flex gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setActiveIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-200 ${
                    index === activeIndex
                      ? "bg-zinc-300 w-8"
                      : "bg-zinc-700 hover:bg-zinc-600"
                  }`}
                  aria-label={`Ir al testimonio ${index + 1}`}
                />
              ))}
            </div>

            <button
              onClick={nextTestimonial}
              className="p-2 bg-white/5 border border-zinc-800 rounded-lg hover:border-zinc-500 hover:bg-white/10 transition-all duration-200"
              aria-label="Siguiente testimonio"
            >
              <svg
                className="w-5 h-5 text-zinc-400"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path d="M9 5l7 7-7 7"></path>
              </svg>
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
