"use client";

import { Code, Lightbulb, Wrench, TrendingUp } from "lucide-react";
import { useRef } from "react";
import { useServicesAnimations } from "@/hooks/useServicesAnimations";

export default function ServicesStatic() {
  const containerRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  const services = [
    {
      icon: Code,
      title: "Full Stack Web Development",
      description: "Scalable web applications built with modern technologies",
      features: [
        "Responsive web applications",
        "Robust RESTful APIs",
        "Third-party integrations",
        "Performance optimization",
      ],
      price: "From $800 USD",
    },
    {
      icon: Lightbulb,
      title: "Technology Consulting",
      description: "Expert technical guidance for complex challenges",
      features: [
        "Code audits & reviews",
        "Software architecture design",
        "System optimization",
        "Best practices implementation",
      ],
      price: "From $500 USD",
    },
    {
      icon: Wrench,
      title: "IT Technical Support",
      description: "Ongoing maintenance and incident resolution",
      features: [
        "Preventive maintenance",
        "Incident resolution",
        "System monitoring",
        "Technical training",
      ],
      price: "From $400 USD/month",
    },
    {
      icon: TrendingUp,
      title: "Digital Transformation",
      description: "Modernize business processes and infrastructure",
      features: [
        "Digital strategy planning",
        "Cloud migration",
        "Process automation",
        "Data analytics implementation",
      ],
      price: "Custom Quote",
    },
  ];

  // Apply animations
  useServicesAnimations(containerRef, headerRef);

  return (
    <section
      ref={containerRef}
      id="services"
      className="relative min-h-screen py-20 px-4"
    >
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div ref={headerRef} className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-display text-zinc-950 dark:text-white mb-4">
            Services
          </h2>

          <p className="text-lg md:text-xl text-zinc-700 dark:text-zinc-300 max-w-2xl mx-auto">
            Comprehensive IT solutions tailored to your business needs
          </p>
        </div>

        {/* Grid de servicios */}
        <div className="services-grid grid md:grid-cols-2 gap-6">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <article
                key={service.title}
                className="service-card group p-6 
                         bg-black/5 dark:bg-white/5 
                         border border-zinc-200 dark:border-zinc-800 
                         rounded-lg 
                         hover:border-zinc-400 dark:hover:border-white 
                         transition-all duration-300
                         relative overflow-hidden"
              >
                {/* Glow effect on hover */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 
                             transition-opacity duration-500 pointer-events-none
                             bg-gradient-to-br from-white/5 via-transparent to-transparent"
                />

                <div className="flex items-start gap-4 mb-4 relative z-10">
                  <div
                    className="icon-container p-3 
                                bg-zinc-100 dark:bg-zinc-900 
                                border border-zinc-200 dark:border-zinc-800 
                                rounded-lg"
                  >
                    <Icon className="w-6 h-6 text-zinc-600 dark:text-zinc-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl text-zinc-950 dark:text-zinc-50 mb-2">
                      {service.title}
                    </h3>
                    <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
                      {service.description}
                    </p>
                  </div>
                </div>

                <ul className="space-y-2 mb-6 relative z-10">
                  {service.features.map((feature, featureIndex) => (
                    <li
                      key={feature}
                      className="feature-item flex items-center gap-2 text-sm 
                               text-zinc-700 dark:text-zinc-300"
                    >
                      <svg
                        className="w-4 h-4 text-zinc-500 dark:text-zinc-500 shrink-0"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {feature}
                    </li>
                  ))}
                </ul>

                <div
                  className="flex items-center justify-between pt-4 
                              border-t border-zinc-200 dark:border-zinc-800 
                              relative z-10"
                >
                  <span className="text-lg font-display text-zinc-900 dark:text-zinc-100">
                    {service.price}
                  </span>
                  <span
                    className="px-4 py-2 text-sm font-medium 
                                 text-white dark:text-black 
                                 bg-black dark:bg-white 
                                 rounded-lg cursor-pointer 
                                 transition-all duration-300
                                 hover:shadow-lg hover:shadow-black/20 dark:hover:shadow-white/20"
                  >
                    Request Quote
                  </span>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
