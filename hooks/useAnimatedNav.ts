"use client";

import { useRef, useLayoutEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useIsMobile } from "./useIsMobile";

gsap.registerPlugin(ScrollTrigger);

export const useAnimatedNav = (
  navRef: React.RefObject<HTMLElement>,
  logoRef: React.RefObject<HTMLAnchorElement>,
  navItemsRef: React.RefObject<HTMLDivElement>,
  actionsRef: React.RefObject<HTMLDivElement>
) => {
  const isExpandedRef = useRef(true);
  const lastScrollY = useRef(0);
  const ticking = useRef(false);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const isAnimatingRef = useRef(false);

  const SCROLL_THRESHOLD = 10;
  const isMobile = useIsMobile();

  useLayoutEffect(() => {
    if (isMobile) return;
    const nav = navRef.current;
    const navItems = navItemsRef.current;
    const actions = actionsRef.current;
    const logo = logoRef.current;

    if (!nav || !navItems || !actions || !logo) return;

    gsap.set([navItems, actions], { autoAlpha: 1, x: 0 });
    gsap.set(logo, { position: "relative", left: "auto", x: 0 });

    timelineRef.current = gsap
      .timeline({ paused: true })
      .to(
        nav,
        {
          height: "3.5rem",
          paddingTop: "0.5rem",
          paddingBottom: "0.5rem",
          backgroundColor: "rgba(0,0,0,0)",
          borderColor: "rgba(0,0,0,0)",
          boxShadow: "none",
          duration: 0.3,
        },
        0
      )
      .to(
        navItems,
        {
          autoAlpha: 0,
          x: -20,
          pointerEvents: "none",
          duration: 0.3,
        },
        0
      )
      .to(
        actions,
        {
          autoAlpha: 0,
          x: 20,
          pointerEvents: "none",
          duration: 0.3,
        },
        0
      )
      .to(
        logo,
        {
          position: "absolute",
          left: "50%",
          x: "-50%",
          duration: 0.3,
        },
        0
      );

    const updateScroll = () => {
      const currentY = window.scrollY;
      const delta = currentY - lastScrollY.current;

      if (Math.abs(delta) >= SCROLL_THRESHOLD && !isAnimatingRef.current) {
        const goingDown = delta > 0;

        if (goingDown && isExpandedRef.current) {
          isAnimatingRef.current = true;
          timelineRef.current?.play().then(() => {
            isExpandedRef.current = false;
            isAnimatingRef.current = false;
          });
        } else if (!goingDown && !isExpandedRef.current) {
          isAnimatingRef.current = true;
          timelineRef.current?.reverse().then(() => {
            isExpandedRef.current = true;
            isAnimatingRef.current = false;
          });
        }
      }

      lastScrollY.current = currentY;
      ticking.current = false;
    };

    const onScroll = () => {
      if (!ticking.current) {
        requestAnimationFrame(updateScroll);
        ticking.current = true;
      }
    };

    window.addEventListener("scroll", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
      timelineRef.current?.kill();
    };
  }, [isMobile]);

  return {
    isExpanded: isExpandedRef.current,
  };
};
