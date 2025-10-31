"use client";

import { useScrollReveal } from "@/hooks/useScrollReveal";
import { Star } from "lucide-react";
import { useState } from "react";

export default function Testimonials() {
  const { ref: headerRef, style: headerStyle } = useScrollReveal();
  const { ref: cardRef, style: cardStyle } = useScrollReveal({ delay: 0.2 });
  const [activeIndex, setActiveIndex] = useState(0);

  const testimonials = [
    {
      name: "María González",
      role: "CEO",
      company: "TechStartup",
      content:
        "Geronimo transformed our vision into a functional and scalable platform. His professionalism and technical expertise are exceptional.",
      rating: 5,
      image: "/testimonials/maria.jpg", // Placeholder
    },
    {
      name: "Carlos Ramírez",
      role: "Product Manager",
      company: "InnovaLabs",
      content:
        "Working with Geronimo was an incredible experience. Always available, proactive, and with innovative solutions.",
      rating: 5,
      image: "/testimonials/carlos.jpg", // Placeholder
    },
    {
      name: "Ana Martínez",
      role: "Marketing Director",
      company: "DigitalCorp",
      content:
        "The quality of work and attention to detail exceeded our expectations. Highly recommended.",
      rating: 5,
      image: "/testimonials/ana.jpg", // Placeholder
    },
  ];

  const nextTestimonial = () => {
    setActiveIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setActiveIndex(
      (prev) => (prev - 1 + testimonials.length) % testimonials.length,
    );
  };

  return (
    <section id="testimonials" className="relative min-h-screen py-20 px-4">
      <div className="container mx-auto max-w-4xl">
        <div ref={headerRef} style={headerStyle} className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-display text-zinc-50 mb-4">
            Testimonials
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-transparent via-zinc-300 to-transparent mx-auto mb-4" />
          <p className="text-zinc-400 max-w-2xl mx-auto">
            What clients say about working with me
          </p>
        </div>

        <div ref={cardRef} style={cardStyle} className="relative">
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
                  ),
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
              aria-label="Previous testimonial"
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
                  aria-label={`Go to testimonial ${index + 1}`}
                />
              ))}
            </div>

            <button
              onClick={nextTestimonial}
              className="p-2 bg-white/5 border border-zinc-800 rounded-lg hover:border-zinc-500 hover:bg-white/10 transition-all duration-200"
              aria-label="Next testimonial"
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
        </div>
      </div>
    </section>
  );
}
