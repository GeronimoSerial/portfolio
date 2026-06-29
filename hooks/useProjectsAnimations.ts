"use client";

import { useGSAP } from "@gsap/react";
import { useRef } from "react";
import { ensureGsapPlugins, gsap, ScrollTrigger } from "@/lib/gsap";
import {
  EASE,
  MOBILE,
  MOBILE_BREAKPOINT,
  clearMotionProps,
  getMotionPrefs,
} from "@/lib/motion";

/** Section enters earlier than per-element triggers — cards feel tied to the headline. */
const SECTION_START = "top 90%";

/**
 * Featured Projects — one section timeline: header and cards overlap so there
 * is no second scroll beat between title and grid.
 */
export const useProjectsAnimations = () => {
  const containerRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      ensureGsapPlugins();

      const root = containerRef.current;
      if (!root) return;

      const { reduceMotion } = getMotionPrefs();
      if (reduceMotion) {
        clearMotionProps(root);
        return;
      }

      const mm = gsap.matchMedia();

      mm.add(
        {
          isMobile: `(max-width: ${MOBILE_BREAKPOINT}px)`,
          isDesktop: `(min-width: ${MOBILE_BREAKPOINT + 1}px)`,
        },
        (context) => {
          const isMobile = Boolean(
            (context.conditions as { isMobile?: boolean }).isMobile,
          );
          const travel = isMobile ? 20 : 24;
          const cardDuration = isMobile ? 0.42 : 0.48;
          const headerDuration = isMobile ? 0.45 : 0.52;

          const headline = headlineRef.current;
          const cards = gsap.utils.toArray<HTMLElement>(".project-card");

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: root,
              start: SECTION_START,
              once: true,
            },
            defaults: { ease: EASE.reveal },
          });

          if (headline) {
            const pretitle = headline.querySelector(".projects-pretitle");
            const title = headline.querySelector(".projects-title");
            const subtitle = headline.querySelector(".projects-subtitle");

            if (pretitle) {
              tl.from(pretitle, {
                autoAlpha: 0,
                y: travel,
                duration: headerDuration,
              });
            }
            if (title) {
              tl.from(
                title,
                { autoAlpha: 0, y: travel, duration: headerDuration },
                "-=0.32",
              );
            }
            if (subtitle) {
              tl.from(
                subtitle,
                {
                  autoAlpha: 0,
                  y: travel * 0.6,
                  duration: headerDuration * 0.85,
                  ease: EASE.soft,
                },
                "-=0.36",
              );
            }
          }

          if (cards.length > 0) {
            tl.from(
              cards,
              {
                autoAlpha: 0,
                y: travel,
                scale: 0.98,
                duration: cardDuration,
                stagger: { amount: isMobile ? 0.22 : 0.28, from: "start" },
                clearProps: "willChange,transform",
              },
              headline ? "-=0.28" : 0,
            );
          }
        },
      );

      ScrollTrigger.refresh();

      return () => mm.revert();
    },
    { scope: containerRef, dependencies: [] },
  );

  return {
    containerRef,
    headlineRef,
  };
};
