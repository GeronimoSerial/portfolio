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
      // Optimización 60fps: aceleración GPU
      gsap.config({ force3D: true });

      const cards = gsap.utils.toArray<HTMLDivElement>(".process-card");

      // Set initial state with GPU-accelerated transforms
      gsap.set(cards, {
        xPercent: (i: number) => (i % 2 === 0 ? -50 : 50),
        rotation: (i: number) => (i % 2 === 0 ? -4 : 4),
        opacity: 0,
        scale: 0.98,
        willChange: "transform, opacity",
      });

      const tl = gsap.timeline({
        defaults: { ease: "power3.out" },
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 40%",
          end: "bottom bottom",
          toggleActions: "play none none reverse",
        },
      });

      // Animate header with GPU acceleration
      tl.fromTo(
        ".process-header",
        { opacity: 0, y: 60, willChange: "transform, opacity" },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          clearProps: "willChange",
        }
      ).fromTo(
        ".process-divider",
        { width: 0, willChange: "width" },
        { width: "6rem", duration: 1, clearProps: "willChange" },
        "-=0.6"
      );

      // Animate all cards with GPU-accelerated stagger
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
          clearProps: "willChange",
        },
        "-=0.6"
      );

      // Animate footer
      tl.fromTo(
        ".process-footer",
        { opacity: 0, y: 40, willChange: "transform, opacity" },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          clearProps: "willChange",
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
