"use client";
gsap.defaults({ force3D: true, lazy: false });
import { useLayoutEffect, RefObject } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

export function useResultsAnimations(
  containerRef: RefObject<HTMLElement | null>,
  headerRef: RefObject<HTMLDivElement | null>
) {
  useGSAP(
    () => {
      if (!containerRef.current) return;

      const ctx = gsap.context(() => {
        // Header animation with split words
        if (headerRef.current) {
          const words = headerRef.current.querySelectorAll(".result-word");
          gsap.from(words, {
            y: 100,
            opacity: 0,
            rotationX: -90,
            transformOrigin: "top center",
            stagger: 0.15,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: headerRef.current,
              start: "top 80%",
              toggleActions: "play none none reverse",
            },
          });
        }

        // Subtitle with split letters effect
        const subtitle =
          containerRef.current?.querySelector(".result-subtitle");
        if (subtitle) {
          gsap.from(subtitle, {
            opacity: 0,
            y: 20,
            duration: 0.8,
            ease: "power2.out",
            delay: 0.4,
            scrollTrigger: {
              trigger: subtitle,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          });
        }

        // Card 1: Morph + Fade Animation
        const card1 = containerRef.current?.querySelector(".result-card-1");
        if (card1) {
          const tl1 = gsap.timeline({
            scrollTrigger: {
              trigger: card1,
              start: "top 75%",
              toggleActions: "play none none reverse",
            },
          });

          // Morph circle SVG
          const circlePath = card1.querySelector(".morph-path");
          if (circlePath) {
            tl1.fromTo(
              circlePath,
              {
                attr: {
                  d: "M50,10 C72.09,10 90,27.91 90,50 C90,72.09 72.09,90 50,90 C27.91,90 10,72.09 10,50 C10,27.91 27.91,10 50,10 Z",
                },
                opacity: 0.3,
              },
              {
                attr: {
                  d: "M20,50 L40,70 L80,30 L75,25 L40,60 L25,45 Z",
                },
                opacity: 1,
                duration: 1.2,
                ease: "power2.inOut",
              }
            );
          }

          // Card content
          tl1.from(
            card1.querySelector(".result-content"),
            {
              opacity: 0,
              scale: 0.8,
              duration: 0.8,
              ease: "back.out(1.7)",
            },
            "-=0.6"
          );

          // Counter animation (75k visits)
          const counter1 = card1.querySelector(".result-number");
          if (counter1) {
            tl1.from(
              counter1,
              {
                textContent: 0,
                duration: 1.8,
                ease: "power2.out",
                snap: { textContent: 1 },
                onUpdate: function () {
                  if (counter1.textContent) {
                    counter1.textContent = Math.round(
                      parseFloat(counter1.textContent)
                    ).toString();
                  }
                },
              },
              "-=0.8"
            );
          }
        }

        // Card 2: Path Animation
        const card2 = containerRef.current?.querySelector(".result-card-2");
        if (card2) {
          const tl2 = gsap.timeline({
            scrollTrigger: {
              trigger: card2,
              start: "top 75%",
              toggleActions: "play none none reverse",
            },
          });

          // Draw curved path
          const path = card2.querySelector(".result-path");
          if (path) {
            tl2.fromTo(
              path,
              {
                strokeDasharray: 300,
                strokeDashoffset: 300,
                opacity: 0.3,
              },
              {
                strokeDashoffset: 0,
                opacity: 1,
                duration: 1.5,
                ease: "power2.inOut",
              }
            );
          }

          // Animate icon along path
          const icon = card2.querySelector(".result-icon");
          if (icon && path) {
            tl2.fromTo(
              icon,
              {
                opacity: 0,
                scale: 0,
              },
              {
                motionPath: {
                  path: ".result-path",
                  align: ".result-path",
                  alignOrigin: [0.5, 0.5],
                },
                opacity: 1,
                scale: 1,
                duration: 1.5,
                ease: "power2.inOut",
              },
              "-=1.5"
            );
          }

          // Card content
          tl2.from(
            card2.querySelector(".result-content"),
            {
              opacity: 0,
              x: -30,
              duration: 0.8,
              ease: "power2.out",
            },
            "-=0.5"
          );

          // Counter animation (5.0x faster)
          const counter2 = card2.querySelector(".result-number");
          if (counter2) {
            tl2.from(
              counter2,
              {
                textContent: 0,
                duration: 1.8,
                ease: "power2.out",
                snap: { textContent: 0.1 },
                onUpdate: function () {
                  if (counter2.textContent) {
                    counter2.textContent = parseFloat(
                      counter2.textContent
                    ).toFixed(1);
                  }
                },
              },
              "-=1"
            );
          }
        }

        // Card 3: Split Text Number Counter
        const card3 = containerRef.current?.querySelector(".result-card-3");
        if (card3) {
          const tl3 = gsap.timeline({
            scrollTrigger: {
              trigger: card3,
              start: "top 75%",
              toggleActions: "play none none reverse",
            },
          });

          // Card entrance with rotation
          tl3.from(card3, {
            rotationY: 90,
            opacity: 0,
            duration: 1,
            ease: "power3.out",
            transformOrigin: "left center",
          });

          // Individual digit animation
          const digits = card3.querySelectorAll(".result-digit");
          if (digits.length > 0) {
            digits.forEach((digit, index) => {
              const target = digit.textContent || "0";
              const targetNum = parseInt(target, 10);
              const counter = { val: 0 };

              // Visual animation for the digit
              tl3.from(
                digit,
                {
                  y: -50,
                  opacity: 0,
                  rotation: 180,
                  duration: 0.8,
                  ease: "back.out(2)",
                },
                `-=${index === 0 ? 0 : 0.6}` // Stagger the visual animation
              );

              // Counter animation for the digit, starting at the same time
              tl3.to(
                counter,
                {
                  val: targetNum,
                  duration: 1,
                  ease: "power2.out",
                  onUpdate: () => {
                    digit.textContent = Math.round(counter.val).toString();
                  },
                },
                "<" // Start at the same time as the previous tween
              );
            });
          }

          tl3.from(
            card3.querySelector(".result-label"),
            {
              opacity: 0,
              y: 20,
              duration: 0.6,
              ease: "power2.out",
            },
            "-=0.3"
          );
        }

        // Card 4: SVG Circle Progress Draw
        const card4 = containerRef.current?.querySelector(".result-card-4");
        if (card4) {
          const tl4 = gsap.timeline({
            scrollTrigger: {
              trigger: card4,
              start: "top 75%",
              toggleActions: "play none none reverse",
            },
          });

          // Draw background circle
          const bgCircle = card4.querySelector(".circle-bg");
          if (bgCircle) {
            tl4.from(bgCircle, {
              strokeDasharray: 0,
              duration: 0.5,
              ease: "power2.out",
            });
          }

          // Draw progress circle
          const progressCircle = card4.querySelector(".circle-progress");
          if (progressCircle) {
            const circumference = 2 * Math.PI * 45; // r=45
            const targetProgress = 99.9; // 99.9%
            const offset = circumference * (1 - targetProgress / 100);

            tl4.fromTo(
              progressCircle,
              {
                strokeDasharray: circumference,
                strokeDashoffset: circumference,
                opacity: 0,
              },
              {
                strokeDashoffset: offset,
                opacity: 1,
                duration: 2,
                ease: "power2.inOut",
              },
              "-=0.3"
            );
          }

          // Percentage counter
          const percentage = card4.querySelector(".result-percentage");
          if (percentage) {
            tl4.from(
              percentage,
              {
                textContent: 0,
                duration: 2,
                ease: "power2.out",
                snap: { textContent: 0.1 },
                onUpdate: function () {
                  if (percentage.textContent) {
                    percentage.textContent = parseFloat(
                      percentage.textContent
                    ).toFixed(1);
                  }
                },
              },
              "-=2"
            );
          }

          tl4.from(
            card4.querySelector(".result-label"),
            {
              opacity: 0,
              scale: 0.8,
              duration: 0.6,
              ease: "back.out(1.7)",
            },
            "-=1.5"
          );
        }
      }, containerRef);

      return () => ctx.revert();
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
