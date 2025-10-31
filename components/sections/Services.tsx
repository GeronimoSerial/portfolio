"use client";

import { useScrollReveal, useStaggerReveal } from "@/hooks/useScrollReveal";
import { Code, Lightbulb, Wrench, TrendingUp } from "lucide-react";

export default function Services() {
  const { ref: headerRef, style: headerStyle } = useScrollReveal();

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

  return (
    <section id="services" className="relative min-h-screen py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <div ref={headerRef} style={headerStyle} className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-display text-zinc-50 mb-4">
            Services
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-transparent via-zinc-300 to-transparent mx-auto mb-4" />
          <p className="text-zinc-400 max-w-2xl mx-auto">
            Scalable IT solutions designed to grow with your business
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <ServiceCard
                key={service.title}
                service={service}
                icon={Icon}
                index={index}
              />
            );
          })}
        </div>

        <CTASection />
      </div>
    </section>
  );
}

function ServiceCard({
  service,
  icon: Icon,
  index,
}: {
  service: any;
  icon: any;
  index: number;
}) {
  const { ref, style } = useStaggerReveal(index);

  return (
    <div
      ref={ref}
      style={style}
      className="group p-6 bg-white/5 border border-zinc-800 rounded-lg hover:border-white hover:bg-white/[0.07] transition-all duration-300"
    >
      <div className="flex items-start gap-4 mb-4">
        <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-lg group-hover:border-zinc-700 transition-colors">
          <Icon className="w-6 h-6 text-zinc-400 group-hover:text-zinc-100 transition-colors" />
        </div>
        <div className="flex-1">
          <h3 className="text-xl text-zinc-50 mb-2 group-hover:text-white transition-colors">
            {service.title}
          </h3>
          <p className="text-sm text-zinc-400 mb-4">{service.description}</p>
        </div>
      </div>

      <ul className="space-y-2 mb-6">
        {service.features.map((feature) => (
          <li
            key={feature}
            className="flex items-center gap-2 text-sm text-zinc-300"
          >
            <svg
              className="w-4 h-4 text-zinc-500 flex-shrink-0"
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

      <div className="flex items-center justify-between pt-4 border-t border-zinc-800">
        <span className="text-lg font-display text-zinc-100">
          {service.price}
        </span>
        <a
          href="#contact"
          className="px-4 py-2 text-sm font-medium text-black bg-white rounded-lg hover:bg-zinc-100 transition-colors duration-200"
        >
          Request Quote
        </a>
      </div>

      {/* Hover glow */}
      <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
    </div>
  );
}

function CTASection() {
  const { ref, style } = useScrollReveal({ delay: 0.5 });

  return (
    <div ref={ref} style={style} className="text-center mt-12">
      <p className="text-sm text-zinc-500 mb-4">
        Need something different? Let's discuss your custom project
      </p>
      <a
        href="#contact"
        className="inline-block px-6 py-3 text-sm font-medium text-white bg-white/10 border border-zinc-700 rounded-lg hover:bg-white/20 hover:border-zinc-500 transition-all duration-200"
      >
        Discuss Custom Project
      </a>
    </div>
  );
}
