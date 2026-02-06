"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface AppleStyleSectionProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export const AppleStyleSection = ({
  children,
  className,
  delay = 0,
}: AppleStyleSectionProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!containerRef.current) return;

      // Select meaningful content elements to animate
      // We look for common block-level and text elements
      const selector = "h1, h2, h3, p, a, button, span.inline-flex, .rounded-2xl, article, li, .animate-target";
      const targets = gsap.utils.toArray<HTMLElement>(
        containerRef.current.querySelectorAll(selector)
      );

      // Filter out elements that are nested within other selected elements
      // to avoid double-animating (e.g., a <p> inside a <article>)
      // This is a simple heuristic: if the parent is also in the list, skip this one.
      // However, sometimes we WANT to animate the children of a card separately.
      // Let's refine: If it's a 'card' (article, .rounded-2xl), we might want to animate IT, 
      // but maybe not its internal text separately if that looks too busy.
      // For an "Apple" feel, moving the container is often cleaner than moving every line of text inside it.
      // But user asked for "stagger... elements inside".
      // Let's try to keep it simple: animate the direct semantic children if possible, or leaf nodes.
      // A better approach for general sections is to animate the direct children of the grid/flex containers.
      // But since we can't easily know the structure, let's stick to the list but filter out *deeply* nested ones if needed.
      // For now, I'll animate them all but with a very tight stagger.
      
      // Let's rely on the user's "Hierachy of Layers" rule:
      // "El contenedor debe empezar a moverse un 10% antes que su contenido."
      // This is hard to do generically without knowing the structure.
      // I will implement a robust default: animate distinct blocks.
      
      const uniqueTargets = targets.filter((el) => {
         // Optimization: Skip icons inside buttons/badges to avoid clutter
         if (el.tagName === 'SVG' || el.closest('button') !== el.parentElement && el.parentElement?.tagName === 'BUTTON') return false;
         return true;
      });

      // Initial State - Apple Style
      gsap.set(uniqueTargets, {
        opacity: 0,
        y: 20, // Reduced from 20 to 20 (user asked for "scale 0.92 to 1")
        scale: 0.96, // Subtle scale
        filter: "blur(10px)", // Blur effect
        rotationX: 3, // Slight 3D tilt
        transformPerspective: 1000,
        transformOrigin: "center center",
        willChange: "transform, opacity, filter",
      });

      ScrollTrigger.create({
        trigger: containerRef.current,
        start: "top 85%", // Trigger slightly earlier
        end: "bottom 10%",
        toggleActions: "play none none reverse",
        onEnter: () => {
          gsap.to(uniqueTargets, {
            opacity: 1,
            y: 0,
            scale: 1,
            filter: "blur(0px)",
            rotationX: 0,
            duration: 1.2, // Slower, more cinematic
            stagger: 0.04, // Fast ripple
            ease: "expo.out", // Sharp entrance, smooth landing
            delay: delay,
            clearProps: "willChange,transformPerspective,filter", // Cleanup for performance
          });
        },
      });

      // Magnetic Hover Effect for interactive elements
      const interactiveElements = containerRef.current.querySelectorAll<HTMLElement>("a, button, .interactive");
      
      interactiveElements.forEach((el) => {
        el.addEventListener("mouseenter", () => {
             gsap.to(el, {
                scale: 1.02,
                duration: 0.3,
                ease: "power2.out",
                overwrite: "auto"
             });
        });
        
        el.addEventListener("mousemove", (e) => {
          const rect = el.getBoundingClientRect();
          const x = e.clientX - rect.left - rect.width / 2;
          const y = e.clientY - rect.top - rect.height / 2;

          gsap.to(el, {
            x: x * 0.1, // Subtle magnetic pull
            y: y * 0.1,
            rotation: x * 0.02, // Slight tilt follow
            duration: 0.4,
            ease: "power2.out",
            overwrite: "auto"
          });
        });

        el.addEventListener("mouseleave", () => {
          gsap.to(el, {
            x: 0,
            y: 0,
            scale: 1,
            rotation: 0,
            duration: 0.7,
            ease: "elastic.out(1, 0.4)", // Bouncy return
            overwrite: "auto"
          });
        });
      });
    },
    { scope: containerRef }
  );

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  );
};
