"use client";

import { useServicesAnimations } from "@/hooks/useServicesAnimations";
import { services } from "@/lib/constants";

export default function ServicesStatic() {
  const { containerRef, headerRef } = useServicesAnimations();
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
        <div className="services-grid grid md:grid-cols-2 gap-8">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <article
                key={service.title}
                className="service-card group p-8
                         bg-white/80 dark:bg-zinc-900/80
                         backdrop-blur-sm
                         hover:opacity-100
                         border border-zinc-200/50 dark:border-zinc-800/50
                         rounded-2xl
                         hover:cursor-pointer
                         relative overflow-hidden
                         shadow-lg shadow-zinc-200/50 dark:shadow-zinc-950/50
                         hover:shadow-xl hover:shadow-zinc-300/50 dark:hover:shadow-zinc-900/50
                         transition-all duration-300
                         hover:-translate-y-1"
              >
                <svg
                  className="card-border-svg absolute inset-0 w-full h-full pointer-events-none"
                  viewBox="0 0 100% 100%"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  preserveAspectRatio="none"
                >
                  <rect
                    x="1"
                    y="1"
                    width="calc(100% - 2px)"
                    height="calc(100% - 2px)"
                    rx="16"
                    className="stroke-zinc-400 dark:stroke-white"
                    strokeWidth="2"
                    fill="none"
                  />
                </svg>

                {/* Glow effect on hover */}
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100
                             transition-opacity duration-500 pointer-events-none
                             bg-gradient-to-br from-zinc-200/20 via-transparent to-transparent
                             dark:from-white/5"
                />

                {/* Decorative corner elements */}
                <div className="absolute top-0 right-0 w-24 h-24 opacity-30">
                  <div className="absolute top-4 right-4 w-1 h-12 bg-zinc-300 dark:bg-zinc-700 rotate-45" />
                  <div className="absolute top-4 right-4 w-12 h-1 bg-zinc-300 dark:bg-zinc-700 rotate-45" />
                </div>

                <div className="relative z-10 mb-6">
                  <div className="flex items-start justify-between mb-6">
                    {/* Luxury icon container */}
                    <div className="relative">
                      <div className="absolute inset-0 bg-zinc-900 dark:bg-zinc-100 rounded-full blur-xl opacity-20 group-hover:opacity-40 transition-opacity duration-500" />
                      <div
                        className="icon-container relative p-5
                                  bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900
                                  dark:from-zinc-100 dark:via-zinc-50 dark:to-zinc-100
                                  rounded-full
                                  border-2 border-zinc-700 dark:border-zinc-300
                                  shadow-2xl shadow-zinc-900/40 dark:shadow-zinc-100/20
                                  group-hover:scale-110 group-hover:rotate-6
                                  transition-all duration-500 ease-out"
                      >
                        {/* Inner glow ring */}
                        <div className="absolute inset-1 rounded-full border border-zinc-600/50 dark:border-zinc-400/50" />
                        <Icon
                          className="w-6 h-6 text-white dark:text-zinc-900 relative z-10"
                          strokeWidth={2.5}
                        />
                      </div>
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold text-zinc-900 dark:text-zinc-50 mb-3 tracking-tight">
                    {service.title}
                  </h3>
                  <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                    {service.description}
                  </p>
                </div>

                <ul className="space-y-3 mb-8 relative z-10">
                  {service.features.map((feature) => (
                    <li
                      key={feature}
                      className="feature-item flex items-center gap-3
                               text-zinc-700 dark:text-zinc-300"
                    >
                      <div className="relative w-5 h-5 shrink-0">
                        <div className="absolute inset-0 rounded-full bg-zinc-900/5 dark:bg-zinc-100/5 border border-zinc-300/50 dark:border-zinc-700/50" />
                        <svg
                          className="absolute inset-0 w-5 h-5 text-zinc-700 dark:text-zinc-300"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </div>
                      <span className="text-sm font-medium">{feature}</span>
                    </li>
                  ))}
                </ul>

                <div
                  className="service-footer flex items-center justify-between pt-6
                              border-t border-zinc-200/70 dark:border-zinc-800/70
                              relative z-10"
                >
                  <div>
                    <p className="text-xs text-zinc-500 dark:text-zinc-500 mb-1 font-medium uppercase tracking-wider">
                      Price
                    </p>
                    <span className="text-2xl font-bold text-zinc-900 dark:text-zinc-100 tracking-tight">
                      {service.price}
                    </span>
                  </div>

                  {/* Luxury button */}
                  <button
                    className="relative group/btn overflow-hidden
                               px-7 py-3.5
                               text-sm font-semibold tracking-wide
                               text-white dark:text-zinc-900
                               transition-all duration-300"
                  >
                    {/* Button background layers */}
                    <div className="absolute inset-0 bg-zinc-900 dark:bg-zinc-100 transition-transform duration-300 group-hover/btn:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-zinc-800 to-transparent dark:from-transparent dark:via-zinc-200 dark:to-transparent opacity-0 group-hover/btn:opacity-100 transition-opacity duration-500" />

                    {/* Decorative corners */}
                    <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-white dark:border-zinc-900 transition-all duration-300 group-hover/btn:w-4 group-hover/btn:h-4" />
                    <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-white dark:border-zinc-900 transition-all duration-300 group-hover/btn:w-4 group-hover/btn:h-4" />

                    {/* Shine effect */}
                    <div className="absolute inset-0 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-700">
                      <div className="absolute inset-0 translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 dark:via-zinc-900/20 to-transparent skew-x-12" />
                    </div>

                    <span className="relative z-10 flex items-center gap-2">
                      Request quote
                      <svg
                        className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2.5}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </span>
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
