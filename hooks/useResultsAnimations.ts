"use client";
import { RefObject } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

export function useResultsAnimations(
  containerRef: RefObject<HTMLElement | null>,
  headerRef: RefObject<HTMLDivElement | null>,
) {
  useGSAP(
    () => {
      if (!containerRef.current) return;

      const ctx = gsap.context(() => {
        // --- 1. Header Animation ---
        if (headerRef.current) {
          const words = headerRef.current.querySelectorAll(".result-word");
          gsap.from(words, {
            y: 30,
            opacity: 0,
            duration: 1,
            stagger: 0.1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: headerRef.current,
              start: "top 80%",
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
                start: "top 80%",
              },
            });
          }
        }

        // --- 2. Cards Entrance (Staggered Fade Up) ---
        const cards = containerRef.current?.querySelectorAll(".result-card");
        if (cards && cards.length > 0) {
          gsap.from(cards, {
            y: 30,
            opacity: 0,
            duration: 0.8,
            stagger: 0.15,
            ease: "power3.out",
            scrollTrigger: {
              trigger: cards[0], // Trigger first card
              start: "top 85%",
            },
          });
        }

        // --- 3. Internal Data Animations ---
        
        // Card 1: Visits (Technical Sparkline)
        const card1 = containerRef.current?.querySelector(".result-card-1");
        if (card1) {
          ScrollTrigger.create({
            trigger: card1,
            start: "top 85%",
            onEnter: () => {
                const counter = card1.querySelector(".result-number");
                if (counter) {
                    gsap.from(counter, {
                        textContent: 0,
                        duration: 2,
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
                gsap.from(dots, { scale: 0, opacity: 0, stagger: 0.2, duration: 0.5, ease: "back.out" });

                const scanLine = card1.querySelector(".scan-line");
                if (scanLine) {
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
            start: "top 85%",
            onEnter: () => {
                const counter = card2.querySelector(".result-number");
                if (counter) {
                    gsap.from(counter, {
                        textContent: 0,
                        duration: 2,
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
                    { rotation: 45, duration: 2, ease: "elastic.out(1, 0.3)" }
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
                start: "top 85%",
                onEnter: () => {
                     const digits = card3.querySelectorAll(".result-digit");
                     digits.forEach((digit, i) => {
                         gsap.from(digit, {
                             textContent: 0,
                             duration: 2,
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
                       ease: "back.out",
                       delay: 0.5
                     });

                     // Subtle pulse for nodes
                     gsap.to(nodes, {
                       opacity: 0.4,
                       duration: 1,
                       repeat: -1,
                       yoyo: true,
                       stagger: 0.1
                     });
                }
            });
        }

        // Card 4: Uptime (Frequency Pulse)
        const card4 = containerRef.current?.querySelector(".result-card-4");
        if (card4) {
             ScrollTrigger.create({
                trigger: card4,
                start: "top 85%",
                onEnter: () => {
                    const percent = card4.querySelector(".result-percentage");
                     if (percent) {
                        gsap.from(percent, {
                            textContent: 0,
                            duration: 2,
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
                      gsap.to(path, {
                        strokeDashoffset: -len * 2,
                        duration: 10,
                        repeat: -1,
                        ease: "none",
                        delay: 2
                      });
                    }

                    const dot = card4.querySelector(".pulse-dot");
                    if (dot) {
                      gsap.to(dot, {
                        opacity: 0.2,
                        duration: 0.5,
                        repeat: -1,
                        yoyo: true,
                        ease: "power2.inOut"
                      });
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
