"use client";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

export const useServicesAnimations = () => {
  const containerRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!containerRef.current) return;

      // Optimización 60fps: renderizado inmediato
      gsap.config({ force3D: true });

      const mm = gsap.matchMedia();

      mm.add(
        {
          isMobile: "(max-width: 768px)",
          isDesktop: "(min-width: 769px)",
        },
        (context) => {
          // ============================================
          // 1. ANIMACIÓN DEL HEADER
          // ============================================
          if (headerRef.current) {
            const headline = headerRef.current.querySelector("h2");
            const subtitle = headerRef.current.querySelector("p");

            // GPU-accelerated initial state
            gsap.set([headline, subtitle], {
              opacity: 0,
              y: 50,
              willChange: "transform, opacity",
            });

            ScrollTrigger.create({
              trigger: headerRef.current,
              start: "top 85%",
              onEnter: () => {
                // Batch animations in timeline for better performance
                const tl = gsap.timeline({
                  defaults: { ease: "power3.out" },
                });

                tl.to(headline, {
                  opacity: 1,
                  y: 0,
                  duration: 1,
                  clearProps: "willChange",
                }).to(
                  subtitle,
                  {
                    opacity: 1,
                    y: 0,
                    duration: 1,
                    clearProps: "willChange",
                  },
                  "-=0.8"
                );
              },
              once: true,
            });
          }

          // ============================================
          // 2. ANIMACIÓN DE LAS TARJETAS DE SERVICIO
          // ============================================
          const cards = gsap.utils.toArray<HTMLElement>(".service-card");

          cards.forEach((card) => {
            const border = card.querySelector(".card-border-svg rect");
            const iconContainer = card.querySelector(".icon-container");
            const title = card.querySelector("h3");
            const description = card.querySelector("p");
            const features = gsap.utils.toArray<HTMLElement>(
              card.querySelectorAll(".feature-item")
            );
            const footer = card.querySelector(".service-footer");

            // GPU-accelerated initial states with will-change
            gsap.set(card, {
              opacity: 0,
              y: 50,
              willChange: "transform, opacity",
            });
            if (border) {
              const length = (border as SVGPathElement).getTotalLength();
              gsap.set(border, {
                strokeDasharray: length,
                strokeDashoffset: length,
                willChange: "stroke-dashoffset",
              });
            }
            gsap.set(iconContainer, {
              scale: 0,
              opacity: 0,
              willChange: "transform, opacity",
            });
            gsap.set([title, description], {
              opacity: 0,
              x: -30,
              willChange: "transform, opacity",
            });
            gsap.set(features, {
              opacity: 0,
              y: 20,
              willChange: "transform, opacity",
            });
            gsap.set(footer, {
              opacity: 0,
              willChange: "opacity",
            });

            ScrollTrigger.create({
              trigger: card,
              start: "top 85%",
              once: true,
              onEnter: () => {
                // Optimized timeline with clearProps
                const tl = gsap.timeline({
                  defaults: { ease: "power2.out" },
                });

                tl.to(card, {
                  opacity: 1,
                  y: 0,
                  duration: 0.8,
                  clearProps: "willChange",
                })
                  .to(
                    border,
                    {
                      strokeDashoffset: 0,
                      duration: 1.2,
                      ease: "circ.out",
                      clearProps: "willChange",
                    },
                    "-=0.6"
                  )
                  .to(
                    iconContainer,
                    {
                      scale: 1,
                      opacity: 1,
                      duration: 0.8,
                      ease: "back.out(1.7)",
                      clearProps: "willChange",
                    },
                    "-=1.0"
                  )
                  .to(
                    [title, description],
                    {
                      opacity: 1,
                      x: 0,
                      duration: 0.7,
                      stagger: 0.1,
                      clearProps: "willChange",
                    },
                    "-=0.8"
                  )
                  .to(
                    features,
                    {
                      opacity: 1,
                      y: 0,
                      duration: 0.5,
                      stagger: 0.08,
                      clearProps: "willChange",
                    },
                    "-=0.5"
                  )
                  .to(
                    footer,
                    {
                      opacity: 1,
                      duration: 0.6,
                      clearProps: "willChange",
                    },
                    "-=0.3"
                  );
              },
            });
          });
        }
      );

      // Cleanup
      return () => {
        mm.revert();
        ScrollTrigger.getAll().forEach((trigger) => {
          trigger.kill();
        });
      };
    },
    { scope: containerRef }
  );

  return {
    containerRef,
    headerRef,
  };
};
