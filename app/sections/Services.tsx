"use client";

import { motion } from "motion/react";
import { useSectionInView } from "@/hooks/useSectionInView";
import { Code, Lightbulb, Wrench, TrendingUp } from "lucide-react";

export default function Services() {
  const { ref, inView } = useSectionInView();

  const services = [
    {
      icon: Code,
      title: "Desarrollo Web Full Stack",
      description: "Aplicaciones web escalables y modernas",
      features: [
        "Aplicaciones web responsivas",
        "APIs RESTful robustas",
        "Integración de servicios",
        "Optimización de rendimiento",
      ],
      price: "Desde $800 USD",
    },
    {
      icon: Lightbulb,
      title: "Consultoría Tecnológica",
      description: "Asesoramiento técnico especializado",
      features: [
        "Auditoría de código",
        "Arquitectura de software",
        "Optimización de sistemas",
        "Mejores prácticas",
      ],
      price: "Desde $500 USD",
    },
    {
      icon: Wrench,
      title: "Soporte Técnico IT",
      description: "Mantenimiento y soporte continuo",
      features: [
        "Mantenimiento preventivo",
        "Resolución de incidencias",
        "Monitoreo de sistemas",
        "Capacitación técnica",
      ],
      price: "Desde $400 USD/mes",
    },
    {
      icon: TrendingUp,
      title: "Transformación Digital",
      description: "Modernización de procesos empresariales",
      features: [
        "Estrategia digital",
        "Migración a la nube",
        "Automatización de procesos",
        "Análisis de datos",
      ],
      price: "Consultar precio",
    },
  ];

  return (
    <section
      id="services"
      ref={ref}
      className="relative min-h-screen py-20 px-4 bg-zinc-950"
    >
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-display text-zinc-50 mb-4">
            Servicios
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-transparent via-zinc-300 to-transparent mx-auto mb-4" />
          <p className="text-zinc-400 max-w-2xl mx-auto">
            Soluciones tecnológicas personalizadas para impulsar tu negocio
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="group p-6 bg-white/5 border border-zinc-800 rounded-lg hover:border-white hover:bg-white/[0.07] transition-all duration-300"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-lg group-hover:border-zinc-700 transition-colors">
                    <Icon className="w-6 h-6 text-zinc-400 group-hover:text-zinc-100 transition-colors" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-display text-zinc-50 mb-2 group-hover:text-white transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-sm text-zinc-400 mb-4">
                      {service.description}
                    </p>
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
                    Solicitar
                  </a>
                </div>

                {/* Hover glow */}
                <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center mt-12"
        >
          <p className="text-sm text-zinc-500 mb-4">
            ¿Necesitas algo diferente? Hablemos sobre tu proyecto personalizado
          </p>
          <a
            href="#contact"
            className="inline-block px-6 py-3 text-sm font-medium text-white bg-white/10 border border-zinc-700 rounded-lg hover:bg-white/20 hover:border-zinc-500 transition-all duration-200"
          >
            Consultar Proyecto Personalizado
          </a>
        </motion.div>
      </div>
    </section>
  );
}
