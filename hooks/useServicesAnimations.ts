"use client";
import { useGSAP } from "@gsap/react";
import { useRef } from "react";
import { ensureGsapPlugins, gsap, ScrollTrigger } from "@/lib/gsap";
import { EASE, EASE2, MOBILE, SCROLL, clearMotionProps, getMotionPrefs } from "@/lib/motion";

ensureGsapPlugins();

export const useServicesAnimations = () => {
  const containerRef = useRef<HTMLElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!containerRef.current) return;

      const { reduceMotion } = getMotionPrefs();
      if (reduceMotion) {
        clearMotionProps(containerRef.current, ".service-card, h2, p");
        return;
      }

      // Optimización 60fps: renderizado inmediato
      gsap.config({ force3D: true });

      const mm = gsap.matchMedia();

      mm.add(
        {
          isMobile: "(max-width: 768px)",
          isDesktop: "(min-width: 769px)",
        },
        (context) => {
          const isMobile = Boolean(
            (context.conditions as { isMobile?: boolean } | undefined)?.isMobile
          );

          // ============================================
          // 1. ANIMACIÓN DEL HEADER
          // ============================================
          if (headerRef.current) {
            const headline = headerRef.current.querySelector("h2");
            const subtitle = headerRef.current.querySelector("p");

            if (isMobile) {
              // Mobile: clip-path wipe reveal for the headline (expressive,
              // transform/clip only) + soft rise on the subtitle.
              gsap.set(headline, {
                autoAlpha: 0,
                y: MOBILE.y,
                clipPath: "inset(0 100% 0 0)",
                willChange: "transform, opacity, clip-path",
              });
              gsap.set(subtitle, {
                autoAlpha: 0,
                y: MOBILE.y * 0.7,
                willChange: "transform, opacity",
              });

              ScrollTrigger.create({
                trigger: headerRef.current,
                start: SCROLL.enter,
                once: true,
                onEnter: () => {
                  gsap
                    .timeline()
                    .to(headline, {
                      autoAlpha: 1,
                      y: 0,
                      clipPath: "inset(0 0% 0 0)",
                      duration: MOBILE.duration.wipe,
                      ease: EASE2.wipe,
                      clearProps: "willChange,clipPath",
                    })
                    .to(
                      subtitle,
                      {
                        autoAlpha: 1,
                        y: 0,
                        duration: MOBILE.duration.soft,
                        ease: EASE.soft,
                        clearProps: "willChange",
                      },
                      "-=0.45"
                    );
                },
              });
            } else {
              // Desktop (unchanged)
              gsap.set([headline, subtitle], {
                opacity: 0,
                y: 50,
                willChange: "transform, opacity",
              });

              ScrollTrigger.create({
                trigger: headerRef.current,
                start: SCROLL.enter,
                once: true,
                onEnter: () => {
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
              });
            }
          }

          const cards = gsap.utils.toArray<HTMLElement>(".service-card");

          const animateCard = (card: HTMLElement, index: number) => {
            const border = card.querySelector(".card-border-svg rect");
            const iconContainer = card.querySelector(".icon-container");
            const title = card.querySelector("h3");
            const description = card.querySelector("p");
            const features = gsap.utils.toArray<HTMLElement>(
              card.querySelectorAll(".feature-item")
            );
            const footer = card.querySelector(".service-footer");

            // GPU-accelerated initial states with will-change.
            // Mobile: alternating directional entrance (rhythm) + subtle scale.
            if (isMobile) {
              gsap.set(card, {
                opacity: 0,
                y: index % 2 === 0 ? MOBILE.y : MOBILE.y * 0.4,
                x: index % 2 === 0 ? 0 : index % 4 === 1 ? -24 : 24,
                scale: 0.96,
                willChange: "transform, opacity",
              });
            } else {
              gsap.set(card, {
                opacity: 0,
                y: 50,
                willChange: "transform, opacity",
              });
            }
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
          };

          cards.forEach((card, index) => animateCard(card, index));

          ScrollTrigger.batch(cards, {
            start: SCROLL.enter,
            once: true,
            onEnter: (batch) => {
              batch.forEach((card) => {
                const el = card as HTMLElement;
                const border = el.querySelector(".card-border-svg rect");
                const iconContainer = el.querySelector(".icon-container");
                const title = el.querySelector("h3");
                const description = el.querySelector("p");
                const features = gsap.utils.toArray<HTMLElement>(
                  el.querySelectorAll(".feature-item"),
                );
                const footer = el.querySelector(".service-footer");

                const tl = gsap.timeline({
                  defaults: { ease: "power2.out" },
                });

                tl.to(el, {
                  opacity: 1,
                  y: 0,
                  x: 0,
                  scale: 1,
                  duration: isMobile ? MOBILE.duration.reveal : 0.8,
                  ease: isMobile ? EASE.reveal : "power2.out",
                  clearProps: "willChange",
                })
                  .to(
                    border,
                    {
                      strokeDashoffset: 0,
                      duration: isMobile ? MOBILE.duration.wipe : 1.2,
                      ease: "circ.out",
                      clearProps: "willChange",
                    },
                    "-=0.6",
                  )
                  .to(
                    iconContainer,
                    {
                      scale: 1,
                      opacity: 1,
                      duration: isMobile ? MOBILE.duration.soft : 0.8,
                      ease: isMobile ? EASE2.pop : "power2.out",
                      clearProps: "willChange",
                    },
                    "-=1.0",
                  )
                  .to(
                    [title, description],
                    {
                      opacity: 1,
                      x: 0,
                      duration: isMobile ? MOBILE.duration.soft : 0.7,
                      stagger: isMobile ? MOBILE.stagger : 0.1,
                      clearProps: "willChange",
                    },
                    "-=0.8",
                  )
                  .to(
                    features,
                    {
                      opacity: 1,
                      y: 0,
                      duration: isMobile ? 0.4 : 0.5,
                      stagger: isMobile ? 0.05 : 0.08,
                      clearProps: "willChange",
                    },
                    "-=0.5",
                  )
                  .to(
                    footer,
                    {
                      opacity: 1,
                      duration: isMobile ? MOBILE.duration.soft : 0.6,
                      clearProps: "willChange",
                    },
                    "-=0.3",
                  );
              });
            },
          });
        }
      );

      // Cleanup
      return () => {
        mm.revert();
      };
    },
    { scope: containerRef }
  );

  return {
    containerRef,
    headerRef,
  };
};
