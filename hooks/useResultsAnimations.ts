"use client";
import { RefObject } from "react";
import { useGSAP } from "@gsap/react";
import { ensureGsapPlugins, gsap, ScrollTrigger } from "@/lib/gsap";
import { EASE, EASE2, MOBILE, SCROLL, clearMotionProps, getMotionPrefs } from "@/lib/motion";

ensureGsapPlugins();

// Counter animations need legible read time; a touch shorter on mobile.
const COUNTER_DUR = (isMobile: boolean) => (isMobile ? 1.4 : 2);

export function useResultsAnimations(
  containerRef: RefObject<HTMLElement | null>,
  headerRef: RefObject<HTMLDivElement | null>,
) {
  useGSAP(
    () => {
      if (!containerRef.current) return;

      const { reduceMotion, isMobile } = getMotionPrefs();
      if (reduceMotion) {
        clearMotionProps(containerRef.current);
        return;
      }

      const ctx = gsap.context(() => {
        // --- 1. Header Animation ---
        if (headerRef.current) {
          const words = headerRef.current.querySelectorAll(".result-word");
          gsap.from(words, {
            y: isMobile ? MOBILE.y : 30,
            opacity: 0,
            duration: isMobile ? MOBILE.duration.reveal : 1,
            stagger: isMobile ? MOBILE.stagger : 0.1,
            ease: isMobile ? EASE2.sharp : "power2.out",
            scrollTrigger: {
              trigger: headerRef.current,
              start: SCROLL.header,
              once: true,
            },
          });

          const subtitle = headerRef.current.querySelector(".result-subtitle");
          if (subtitle) {
            gsap.from(subtitle, {
              opacity: 0,
              y: 10,
              duration: 1,
              ease: "power2.out",
              delay: 0.2,
              scrollTrigger: {
                trigger: headerRef.current,
                start: SCROLL.header,
                once: true,
              },
            });
          }
        }

        // --- 2. Cards Entrance (Staggered Fade Up) ---
        const cards = containerRef.current?.querySelectorAll(".result-card");
        if (cards && cards.length > 0) {
          gsap.from(cards, {
            y: isMobile ? MOBILE.y : 30,
            opacity: 0,
            scale: isMobile ? 0.97 : 1,
            duration: isMobile ? MOBILE.duration.reveal : 0.8,
            stagger: isMobile ? MOBILE.stagger : 0.15,
            ease: EASE.reveal,
            scrollTrigger: {
              trigger: cards[0],
              start: SCROLL.enter,
              once: true,
            },
          });
        }

        // --- 3. Internal Data Animations ---
        
        // Card 1: Visits (Technical Sparkline)
        const card1 = containerRef.current?.querySelector(".result-card-1");
        if (card1) {
          ScrollTrigger.create({
            trigger: card1,
            start: SCROLL.enter,
            once: true,
            onEnter: () => {
                const counter = card1.querySelector(".result-number");
                if (counter) {
                    gsap.from(counter, {
                        textContent: 0,
                        duration: COUNTER_DUR(isMobile),
                        ease: "expo.out",
                        snap: { textContent: 1 },
                        onUpdate: function() {
                           this.targets()[0].textContent = Math.ceil(this.targets()[0].textContent).toString();
                        }
                    });
                }
                const path = card1.querySelector(".main-path");
                if (path) {
                     const len = (path as SVGPathElement).getTotalLength();
                     gsap.fromTo(path,
                        { strokeDasharray: len, strokeDashoffset: len },
                        { strokeDashoffset: 0, duration: 2, ease: "power3.out" }
                     );
                }
                const dots = card1.querySelectorAll(".tech-dot");
                gsap.from(dots, { scale: 0.92, opacity: 0, stagger: 0.08, duration: 0.35, ease: "power2.out" });

                const scanLine = card1.querySelector(".scan-line");
                if (scanLine && !isMobile) {
                  gsap.to(scanLine, { x: 120, duration: 3, repeat: -1, ease: "none" });
                }
            }
          });
        }

        // Card 2: Performance (Radial Accelerator)
        const card2 = containerRef.current?.querySelector(".result-card-2");
        if (card2) {
           ScrollTrigger.create({
            trigger: card2,
            start: SCROLL.enter,
            once: true,
            onEnter: () => {
                const counter = card2.querySelector(".result-number");
                if (counter) {
                    gsap.from(counter, {
                        textContent: 0,
                        duration: COUNTER_DUR(isMobile),
                        ease: "expo.out",
                        snap: { textContent: 0.1 },
                         onUpdate: function() {
                            const val = parseFloat(this.targets()[0].textContent).toFixed(1);
                            this.targets()[0].textContent = val;
                        }
                    });
                }
                
                const arc = card2.querySelector(".speed-arc");
                if (arc) {
                  const len = (arc as SVGPathElement).getTotalLength();
                  gsap.fromTo(arc, 
                    { strokeDasharray: len, strokeDashoffset: len },
                    { strokeDashoffset: 0, duration: 1.5, ease: "power2.out" }
                  );
                }

                const needle = card2.querySelector(".speed-needle");
                if (needle) {
                  gsap.fromTo(needle, 
                    { rotation: -90, transformOrigin: "bottom center" },
                    { rotation: 45, duration: 1.2, ease: "power2.out" }
                  );
                }
            }
           });
        }

        // Card 3: Projects (Isometric Grid)
        const card3 = containerRef.current?.querySelector(".result-card-3");
        if (card3) {
            ScrollTrigger.create({
                trigger: card3,
                start: SCROLL.enter,
                once: true,
                onEnter: () => {
                     const digits = card3.querySelectorAll(".result-digit");
                     digits.forEach((digit, i) => {
                         gsap.from(digit, {
                             textContent: 0,
                             duration: COUNTER_DUR(isMobile),
                             delay: i * 0.1,
                             ease: "expo.out",
                             snap: { textContent: 1 },
                         });
                     });
                     
                     const grid = card3.querySelector(".grid-isometric");
                     if (grid) {
                       gsap.from(grid.querySelectorAll("path, line"), {
                         opacity: 0,
                         scale: 0.8,
                         stagger: 0.1,
                         duration: 1,
                         ease: "power2.out"
                       });
                     }

                     const nodes = card3.querySelectorAll(".grid-node");
                     gsap.from(nodes, {
                       opacity: 0,
                       scale: 0,
                       stagger: 0.05,
                       duration: 0.5,
                        ease: "power2.out",
                       delay: 0.5
                     });

                     // Subtle pulse for nodes
                      if (!isMobile) {
                        gsap.to(nodes, {
                          opacity: 0.4,
                          duration: 1,
                          repeat: -1,
                          yoyo: true,
                          stagger: 0.1
                        });
                      }
                }
            });
        }

        // Card 4: Uptime (Frequency Pulse)
        const card4 = containerRef.current?.querySelector(".result-card-4");
        if (card4) {
             ScrollTrigger.create({
                trigger: card4,
                start: SCROLL.enter,
                once: true,
                onEnter: () => {
                    const percent = card4.querySelector(".result-percentage");
                     if (percent) {
                        gsap.from(percent, {
                            textContent: 0,
                            duration: COUNTER_DUR(isMobile),
                            ease: "expo.out",
                            snap: { textContent: 0.1 },
                            onUpdate: function() {
                                this.targets()[0].textContent = parseFloat(this.targets()[0].textContent).toFixed(1);
                            }
                        });
                    }
                    
                    const path = card4.querySelector(".pulse-path");
                    if (path) {
                      const len = (path as SVGPathElement).getTotalLength();
                      gsap.fromTo(path,
                        { strokeDasharray: len, strokeDashoffset: len },
                        { strokeDashoffset: 0, duration: 2, ease: "none" }
                      );

                      // Continuous "pulse" effect
                      if (!isMobile) {
                        gsap.to(path, {
                          strokeDashoffset: -len * 2,
                          duration: 10,
                          repeat: -1,
                          ease: "none",
                          delay: 2
                        });
                      }
                    }

                    const dot = card4.querySelector(".pulse-dot");
                    if (dot) {
                      if (isMobile) {
                        // Single accent breathe — life without a continuous loop.
                        gsap.fromTo(
                          dot,
                          { opacity: 1, scale: 1 },
                          {
                            opacity: 0.35,
                            scale: 1.15,
                            duration: 0.55,
                            yoyo: true,
                            repeat: 1,
                            transformOrigin: "center center",
                            ease: EASE2.pop,
                          }
                        );
                      } else {
                        gsap.to(dot, {
                          opacity: 0.2,
                          duration: 0.5,
                          repeat: -1,
                          yoyo: true,
                          ease: "power2.inOut"
                        });
                      }
                    }
                }
             });
        }

      }, containerRef);

      return () => ctx.revert();
    },
    { scope: containerRef }
  );
}
