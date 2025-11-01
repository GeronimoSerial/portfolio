"use client";

import { useLayoutEffect, RefObject } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

export function useServicesAnimations(
  containerRef: RefObject<HTMLElement | null>,
  headerRef: RefObject<HTMLDivElement | null>
) {
  useGSAP(
    () => {
      if (!containerRef.current) return;

      const mm = gsap.matchMedia();

      mm.add("(min-width: 768px)", () => {
        // Header fade in
        if (headerRef.current) {
          gsap.from(headerRef.current.children, {
            opacity: 0,
            y: 30,
            stagger: 0.2,
            duration: 0.8,
            ease: "power2.out",
            scrollTrigger: {
              trigger: headerRef.current,
              start: "top 80%",
              toggleActions: "play none none reverse",
            },
          });
        }

        // Cards staggered fade in
        const cards = gsap.utils.toArray<HTMLElement>(".service-card");
        if (cards.length > 0) {
          gsap.fromTo(
            cards,
            {
              opacity: 0,
              y: 60,
            },
            {
              opacity: 1,
              y: 0,
              stagger: 0.15,
              duration: 0.8,
              ease: "power2.out",
              scrollTrigger: {
                trigger: ".services-grid",
                start: "top 80%",
                toggleActions: "play none none reverse",
              },
            }
          );
        }

        // Feature items fade in per card
        cards.forEach((card) => {
          const features = card.querySelectorAll(".feature-item");
          gsap.fromTo(
            features,
            {
              opacity: 0,
              x: -15,
            },
            {
              opacity: 1,
              x: 0,
              stagger: 0.08,
              duration: 0.5,
              ease: "power2.out",
              scrollTrigger: {
                trigger: card,
                start: "top 70%",
                toggleActions: "play none none reverse",
              },
            }
          );
        });
      });

      // Mobile: simpler animations
      mm.add("(max-width: 767px)", () => {
        if (headerRef.current) {
          gsap.from(headerRef.current.children, {
            opacity: 0,
            y: 20,
            stagger: 0.15,
            duration: 0.6,
            ease: "power2.out",
            scrollTrigger: {
              trigger: headerRef.current,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          });
        }

        const cards = gsap.utils.toArray<HTMLElement>(".service-card");
        if (cards.length > 0) {
          gsap.fromTo(
            cards,
            { opacity: 0, y: 40 },
            {
              opacity: 1,
              y: 0,
              stagger: 0.2,
              duration: 0.7,
              ease: "power2.out",
              scrollTrigger: {
                trigger: ".services-grid",
                start: "top 85%",
                toggleActions: "play none none reverse",
              },
            }
          );
        }
      });

      return () => mm.revert();
    },
    { scope: containerRef, dependencies: [] }
  );

  // Cleanup on unmount
  useLayoutEffect(() => {
    return () => {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
    };
  }, []);
}
