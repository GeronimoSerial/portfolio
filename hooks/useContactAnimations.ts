"use client";

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
      // 1. SVG MASKS - Subtle morph on scroll
      // ============================================
      gsap.to(".gsap-mask-1", {
        attr: {
          d: "M 250,280 Q 320,180 480,270 T 780,330 Q 730,480 620,530 T 250,430 Z",
        },
        ease: "none",
        scrollTrigger: {
          trigger: "#contact",
          start: "top bottom",
          end: "bottom top",
          scrub: 2,
        },
      });

      gsap.to(".gsap-mask-2", {
        attr: { cx: "82%", cy: "65%" },
        ease: "none",
        scrollTrigger: {
          trigger: "#contact",
          start: "top bottom",
          end: "bottom top",
          scrub: 3,
        },
      });

      // ============================================
      // 2. FLOATING GEOMETRIC ELEMENTS - Parallax
      // ============================================
      gsap.to(".gsap-float-1", {
        yPercent: -40,
        rotation: 45,
        ease: "none",
        scrollTrigger: {
          trigger: "#contact",
          start: "top bottom",
          end: "bottom top",
          scrub: 1,
        },
      });

      gsap.to(".gsap-float-2", {
        yPercent: -60,
        rotation: -30,
        ease: "none",
        scrollTrigger: {
          trigger: "#contact",
          start: "top bottom",
          end: "bottom top",
          scrub: 1.5,
        },
      });

      gsap.to(".gsap-float-3", {
        yPercent: -80,
        scale: 2,
        ease: "none",
        scrollTrigger: {
          trigger: "#contact",
          start: "top bottom",
          end: "bottom top",
          scrub: 0.5,
        },
      });

      // ============================================
      // 3. LEFT COLUMN - Fade from left with stagger
      // ============================================
      gsap.from(".gsap-fade-left", {
        x: -100,
        opacity: 0,
        duration: 1.2,
        force3D: true,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".gsap-fade-left",
          start: "top 80%",
          toggleActions: "play none none none",
        },
      });

      // ============================================
      // 4. TITLE CHARACTER REVEAL - "Collaborate"
      // ============================================
      if (containerRef.current) {
        const titleElement = containerRef.current.querySelector(".gsap-title");
        if (titleElement) {
          const split = new SplitText(titleElement, { type: "chars,words" });

          gsap.from(split.chars, {
            opacity: 0,
            y: 50,
            rotationX: -90,
            stagger: 0.03,
            duration: 0.8,
            force3D: true,
            ease: "back.out(1.7)",
            scrollTrigger: {
              trigger: titleElement,
              start: "top 75%",
              toggleActions: "play none none none",
            },
          });
        }
      }

      // Line animation
      gsap.from(".gsap-line", {
        scaleX: 0,
        transformOrigin: "left center",
        duration: 1,
        delay: 0.5,
        force3D: true,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".gsap-line",
          start: "top 80%",
          toggleActions: "play none none none",
        },
      });

      // Description fade
      gsap.from(".gsap-description", {
        opacity: 0,
        y: 30,
        duration: 1,
        delay: 0.8,
        force3D: true,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".gsap-description",
          start: "top 80%",
          toggleActions: "play none none none",
        },
      });

      // Contact info stagger
      gsap.from(".gsap-info > div", {
        opacity: 0,
        x: -30,
        stagger: 0.15,
        duration: 0.8,
        delay: 1,
        force3D: true,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".gsap-info",
          start: "top 80%",
          toggleActions: "play none none none",
        },
      });

      // ============================================
      // 5. FORM - Fade from right with stagger
      // ============================================
      gsap.from(".gsap-fade-right", {
        x: 100,
        opacity: 0,
        duration: 1.2,
        force3D: true,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".gsap-fade-right",
          start: "top 80%",
          toggleActions: "play none none none",
        },
      });

      // ============================================
      // 6. DECORATIVE FRAME - Scale in
      // ============================================
      gsap.from(".gsap-frame", {
        scale: 0.8,
        opacity: 0,
        duration: 1.5,
        force3D: true,
        ease: "elastic.out(1, 0.6)",
        scrollTrigger: {
          trigger: ".gsap-frame",
          start: "top 80%",
          toggleActions: "play none none none",
        },
      });

      // ============================================
      // 7. FORM FIELDS - Sequential stagger
      // ============================================
      gsap.from(".gsap-field", {
        opacity: 0,
        y: 40,
        stagger: 0.1,
        duration: 0.8,
        delay: 0.5,
        force3D: true,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".gsap-field",
          start: "top 80%",
          toggleActions: "play none none none",
        },
      });

      // ============================================
      // 8. SUBMIT BUTTON - Fade up
      // ============================================
      gsap.from(".gsap-submit", {
        opacity: 0,
        y: 30,
        duration: 0.8,
        delay: 1.2,
        force3D: true,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".gsap-submit",
          start: "top 85%",
          toggleActions: "play none none none",
        },
      });

      // ============================================
      // 9. PRIVACY NOTICE - Fade in
      // ============================================
      gsap.from(".gsap-privacy", {
        opacity: 0,
        duration: 0.8,
        delay: 1.4,
        force3D: true,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".gsap-privacy",
          start: "top 85%",
          toggleActions: "play none none none",
        },
      });

      // ============================================
      // 10. BOTTOM ACCENT - Slide up with fade
      // ============================================
      gsap.from(".gsap-accent", {
        opacity: 0,
        y: 50,
        duration: 1,
        force3D: true,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".gsap-accent",
          start: "top 90%",
          toggleActions: "play none none none",
        },
      });

      // ============================================
      // 11. SOCIAL LINKS - Individual hover states
      // ============================================
      const socialLinks = gsap.utils.toArray<HTMLElement>(".gsap-social");

      socialLinks.forEach((link) => {
        link.addEventListener("mouseenter", () => {
          gsap.to(link, {
            x: 5,
            duration: 0.3,
            force3D: true,
            ease: "power2.out",
          });
        });

        link.addEventListener("mouseleave", () => {
          gsap.to(link, {
            x: 0,
            duration: 0.3,
            force3D: true,
            ease: "power2.out",
          });
        });
      });
    }, containerRef);

    return () => {
      ctx.revert();
    };
  }, []);

  return containerRef;
}
