"use client";
// Performance-Optimized Version
gsap.defaults({ force3D: true, lazy: false });

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText);
  // Set global defaults for optimal performance
  gsap.defaults({ force3D: true, lazy: false });
}

export function useContactAnimations() {
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const ctx = gsap.context(() => {
      // ============================================
      // TITLE CHARACTER REVEAL - "Let's Collaborate"
      // ============================================
      const titleElement = containerRef.current?.querySelector(".gsap-title");
      if (titleElement) {
        const split = new SplitText(titleElement, { type: "chars,words" });

        gsap.from(split.chars, {
          opacity: 0,
          y: 50,
          rotationX: -90,
          stagger: 0.03,
          duration: 0.8,
          ease: "back.out(1.7)",
          scrollTrigger: {
            trigger: titleElement,
            start: "top 75%",
            toggleActions: "play none none none",
          },
        });
      }
    }, containerRef);

    return () => {
      ctx.revert();
    };
  }, []);

  return containerRef;
}
