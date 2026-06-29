"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { ensureGsapPlugins, gsap, ScrollTrigger } from "@/lib/gsap";
import {
  EASE,
  SCROLL,
  clearMotionProps,
  getMotionPrefs,
} from "@/lib/motion";

ensureGsapPlugins();

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
      const root = containerRef.current;
      if (!root) return;

      const { reduceMotion, canHover } = getMotionPrefs();

      if (reduceMotion) {
        clearMotionProps(root);
        return;
      }

      const selector =
        "h1, h2, h3, p, a, button, span.inline-flex, .rounded-2xl, article, li, .animate-target";
      const targets = gsap.utils.toArray<HTMLElement>(
        root.querySelectorAll(selector),
      );

      const uniqueTargets = targets.filter((el) => {
        if (el.tagName === "SVG") return false;
        if (
          el.parentElement?.tagName === "BUTTON" &&
          el.closest("button") !== el.parentElement
        ) {
          return false;
        }
        return true;
      });

      gsap.set(uniqueTargets, {
        autoAlpha: 0,
        y: 24,
        scale: 0.96,
        transformOrigin: "center center",
        willChange: "transform, opacity",
      });

      ScrollTrigger.create({
        trigger: root,
        start: SCROLL.enter,
        once: true,
        onEnter: () => {
          gsap.to(uniqueTargets, {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            duration: 0.9,
            stagger: 0.04,
            ease: EASE.reveal,
            delay,
            clearProps: "willChange",
          });
        },
      });

      if (!canHover) return;

      const interactiveElements =
        root.querySelectorAll<HTMLElement>("a, button, .interactive");
      const cleanups: Array<() => void> = [];

      interactiveElements.forEach((el) => {
        const setTransform = gsap.quickSetter(el, "transform");

        const handleMouseEnter = () => {
          gsap.to(el, {
            scale: 1.01,
            duration: 0.22,
            ease: "power2.out",
            overwrite: "auto",
          });
        };

        const handleMouseMove = (e: MouseEvent) => {
          const rect = el.getBoundingClientRect();
          const x = e.clientX - rect.left - rect.width / 2;
          const y = e.clientY - rect.top - rect.height / 2;
          setTransform(
            `translate3d(${x * 0.06}px, ${y * 0.06}px, 0) rotate(${x * 0.01}deg) scale(1.01)`,
          );
        };

        const handleMouseLeave = () => {
          gsap.to(el, {
            x: 0,
            y: 0,
            scale: 1,
            rotation: 0,
            duration: 0.24,
            ease: "power2.out",
            overwrite: "auto",
          });
        };

        el.addEventListener("mouseenter", handleMouseEnter);
        el.addEventListener("mousemove", handleMouseMove);
        el.addEventListener("mouseleave", handleMouseLeave);

        cleanups.push(() => {
          el.removeEventListener("mouseenter", handleMouseEnter);
          el.removeEventListener("mousemove", handleMouseMove);
          el.removeEventListener("mouseleave", handleMouseLeave);
        });
      });

      return () => {
        cleanups.forEach((cleanup) => cleanup());
      };
    },
    { scope: containerRef },
  );

  return (
    <div ref={containerRef} className={className}>
      {children}
    </div>
  );
};
