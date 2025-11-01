"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export const useProcessAnimations = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const cards = gsap.utils.toArray<HTMLDivElement>(".process-card");

      // Set initial state with lighter transforms
      gsap.set(cards, {
        xPercent: (i: number) => (i % 2 === 0 ? -50 : 50),
        rotation: (i: number) => (i % 2 === 0 ? -4 : 4),
        opacity: 0,
        scale: 0.98,
        willChange: "transform, opacity", // Hint to browser for optimization
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 40%",
          end: "bottom bottom",
          toggleActions: "play none none reverse",
        },
      });

      // Animate header
      tl.fromTo(
        ".process-header",
        { opacity: 0, y: 60 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
        }
      ).fromTo(
        ".process-divider",
        { width: 0 },
        { width: "6rem", duration: 1, ease: "power3.out" },
        "-=0.6"
      );

      // Animate all cards with stagger for sequential entrance
      tl.to(
        cards,
        {
          xPercent: 0,
          rotation: 0,
          opacity: 1,
          scale: 1,
          duration: 0.5,
          ease: "expo.out",
          stagger: 0.15,
        },
        "-=0.6"
      );

      // Animate footer
      tl.fromTo(
        ".process-footer",
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
        },
        "-=0.4"
      );

      // Optional: refresh ScrollTrigger if layout changes
      ScrollTrigger.refresh();
    },
    { scope: containerRef }
  );

  return containerRef;
};
