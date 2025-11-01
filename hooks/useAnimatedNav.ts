"use client";

import { useState, useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);
}

export const useAnimatedNav = (
  navRef: React.RefObject<HTMLElement | null>,
  logoRef: React.RefObject<HTMLAnchorElement | null>,
  navItemsRef: React.RefObject<HTMLDivElement | null>,
  actionsRef: React.RefObject<HTMLDivElement | null>,
  expandButtonRef: React.RefObject<HTMLDivElement | null>
) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useGSAP(
    () => {
      if (!navRef.current || window.innerWidth < 768) return;

      const nav = navRef.current;
      const navItems = navItemsRef.current;
      const actions = actionsRef.current;
      const expandButton = expandButtonRef.current;
      const logo = logoRef.current;

      gsap.set(expandButton, { autoAlpha: 0 });

      const shrinkTimeline = gsap.timeline({
        paused: true,
        defaults: { duration: 0.4, ease: "power2.out", force3D: true },
      });

      shrinkTimeline
        .to(nav, {
          height: "3.5rem",
          paddingTop: "0.5rem",
          paddingBottom: "0.5rem",
          backgroundColor: "transparent",
          borderColor: "transparent",
          // backdropFilter: "blur(0px)",
          boxShadow: "none",
        })
        .to(
          navItems,
          {
            autoAlpha: 0,
            x: -20,
            pointerEvents: "none",
          },
          "<"
        )
        .to(
          actions,
          {
            autoAlpha: 0,
            x: 20,
            pointerEvents: "none",
          },
          "<"
        )
        .to(
          logo,
          {
            position: "absolute",
            left: "50%",
            x: "-50%",
            scale: 1,
            marginLeft: "0px",
          },
          "<"
        )
        .to(
          expandButton,
          {
            autoAlpha: 1,
            scale: 1,
            x: 0,
            pointerEvents: "auto",
          },
          "<0.15"
        );

      ScrollTrigger.create({
        trigger: "body",
        start: "100px top",
        end: "bottom bottom",
        onEnter: () => {
          shrinkTimeline.play();
          setIsExpanded(false);
        },
        onLeaveBack: () => {
          shrinkTimeline.reverse();
          setIsExpanded(true);
        },
      });

      ScrollTrigger.create({
        trigger: "body",
        start: "50px top",
        toggleClass: {
          targets: nav,
          className: "backdrop-saturate-150",
        },
      });

      return () => {
        ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      };
    },
    { scope: navRef, dependencies: [] }
  );

  const handleExpand = () => {
    if (
      !navRef.current ||
      !navItemsRef.current ||
      !actionsRef.current ||
      !expandButtonRef.current ||
      !logoRef.current
    )
      return;

    const tl = gsap.timeline({
      defaults: { duration: 0.5, ease: "elastic.out(1, 0.75)", force3D: true },
    });

    tl.to(navRef.current, {
      height: "5rem",
      clearProps: "backgroundColor,borderColor,backdropFilter,boxShadow",
      duration: 0.4,
      ease: "power2.out",
    })
      .to(
        expandButtonRef.current,
        {
          autoAlpha: 0,
          scale: 0.8,
          x: 20,
          pointerEvents: "none",
          duration: 0.3,
          ease: "power2.in",
        },
        "<"
      )
      .to(
        logoRef.current,
        {
          position: "relative",
          left: "auto",
          x: 0,
          scale: 1,
          marginLeft: 0,
        },
        "<"
      )
      .to(
        navItemsRef.current,
        {
          autoAlpha: 1,
          x: 0,
          pointerEvents: "auto",
        },
        "<0.1"
      )
      .to(
        actionsRef.current,
        {
          autoAlpha: 1,
          x: 0,
          pointerEvents: "auto",
        },
        "<"
      );

    setIsExpanded(true);

    if (window.scrollY > 100) {
      setTimeout(() => {
        handleCollapse();
      }, 3000);
    }
  };

  const handleCollapse = () => {
    if (
      !navRef.current ||
      !navItemsRef.current ||
      !actionsRef.current ||
      !expandButtonRef.current ||
      !logoRef.current
    )
      return;
    if (window.scrollY < 100) return;

    const tl = gsap.timeline({
      defaults: { duration: 0.4, ease: "power2.out", force3D: true },
    });

    tl.to(navRef.current, {
      height: "3.5rem",
      backgroundColor: "transparent",
      borderColor: "transparent",
      // backdropFilter: "blur(0px)",
      boxShadow: "none",
    })
      .to(
        navItemsRef.current,
        {
          autoAlpha: 0,
          x: -20,
          pointerEvents: "none",
        },
        "<"
      )
      .to(
        actionsRef.current,
        {
          autoAlpha: 0,
          x: 20,
          pointerEvents: "none",
        },
        "<"
      )
      .to(
        logoRef.current,
        {
          position: "absolute",
          left: "50%",
          x: "-50%",
          scale: 1,
        },
        "<"
      )
      .to(
        expandButtonRef.current,
        {
          autoAlpha: 1,
          scale: 1,
          pointerEvents: "auto",
        },
        "<0.15"
      );

    setIsExpanded(false);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return { isExpanded, isMobileMenuOpen, handleExpand, toggleMobileMenu };
};
