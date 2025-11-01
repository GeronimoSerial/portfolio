"use client";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

/**
 * Hook de animaciones para la sección de proyectos
 * Implementa efectos creativos con SVG morphing, path animations y liquid reveals
 */
export const useProjectsAnimations = () => {
  const containerRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!containerRef.current) return;

      gsap.config({ force3D: true });

      const mm = gsap.matchMedia();

      mm.add(
        {
          isMobile: "(max-width: 768px)",
          isDesktop: "(min-width: 769px)",
        },
        (context) => {
          const { isMobile } = context.conditions as { isMobile: boolean };

          // ============================================
          // 1. ANIMACIÓN DEL HEADLINE CON SPLIT EFFECT
          // ============================================
          if (headlineRef.current) {
            const headline = headlineRef.current;
            const words = headline.querySelectorAll(".word");
            const subtitle =
              containerRef.current?.querySelector(".projects-subtitle");

            gsap.set(words, {
              opacity: 0,
              y: 100,
              rotateX: -90,
              transformOrigin: "50% 100%",
            });

            if (subtitle) {
              gsap.set(subtitle, {
                opacity: 0,
                y: 30,
              });
            }

            ScrollTrigger.create({
              trigger: headline,
              start: "top 80%",
              onEnter: () => {
                gsap.to(words, {
                  opacity: 1,
                  y: 0,
                  rotateX: 0,
                  duration: 1.2,
                  stagger: {
                    amount: 0.4,
                    from: "start",
                  },
                  ease: "power3.out",
                });

                if (subtitle) {
                  gsap.to(subtitle, {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    delay: 0.6,
                    ease: "power2.out",
                  });
                }
              },
              once: true,
            });
          }

          // ============================================
          // 2. ANIMACIÓN DE CARDS CON LIQUID REVEAL
          // ============================================
          const cards = gsap.utils.toArray<HTMLElement>(".project-card");
          const directions = [
            { x: -100, y: -50, rotation: -8 },
            { x: 100, y: -50, rotation: 8 },
            { x: 0, y: -100, rotation: 0 },
            { x: -80, y: 50, rotation: 5 },
            { x: 80, y: 50, rotation: -5 },
            { x: 0, y: 100, rotation: 0 },
          ];

          cards.forEach((card, index) => {
            const direction = directions[index % directions.length];
            const border = card.querySelector(".card-border");
            const content = card.querySelector(".card-content");
            const title = card.querySelector(".card-title");
            const description = card.querySelector(".card-description");
            const metadata = card.querySelector(".card-metadata");
            const icons = card.querySelectorAll(".card-icon");

            // Estado inicial del card con clip-path circular
            gsap.set(card, {
              opacity: 0,
              x: direction.x,
              y: direction.y,
              rotation: direction.rotation,
              scale: 0.8,
              clipPath: "circle(0% at 50% 50%)",
            });

            // Estado inicial del borde SVG
            if (border) {
              gsap.set(border, {
                opacity: 0,
                scale: 0.5,
              });
            }

            // Estado inicial del contenido
            if (content) {
              gsap.set(content, {
                opacity: 0,
              });
            }

            ScrollTrigger.create({
              trigger: card,
              start: "top 85%",
              onEnter: () => {
                const tl = gsap.timeline();

                // 1. Liquid reveal del card
                tl.to(card, {
                  opacity: 1,
                  x: 0,
                  y: 0,
                  rotation: 0,
                  scale: 1,
                  clipPath: "circle(150% at 50% 50%)",
                  duration: 1.2,
                  ease: "power3.out",
                });

                // 2. Animación del borde con elastic effect
                if (border) {
                  tl.to(
                    border,
                    {
                      opacity: 1,
                      scale: 1,
                      duration: 0.8,
                      ease: "elastic.out(1, 0.6)",
                    },
                    "-=0.8"
                  );
                }

                // 3. Fade in del contenido
                if (content) {
                  tl.to(
                    content,
                    {
                      opacity: 1,
                      duration: 0.6,
                      ease: "power2.out",
                    },
                    "-=0.6"
                  );
                }

                // 4. Animación del título con split
                if (title) {
                  const chars = title.textContent?.split("") || [];
                  const charsHTML = chars
                    .map((char) => `<span class="char">${char}</span>`)
                    .join("");
                  title.innerHTML = charsHTML;

                  const charElements = title.querySelectorAll(".char");
                  gsap.set(charElements, {
                    opacity: 0,
                    y: 20,
                    rotateX: -90,
                  });

                  tl.to(
                    charElements,
                    {
                      opacity: 1,
                      y: 0,
                      rotateX: 0,
                      duration: 0.5,
                      stagger: 0.02,
                      ease: "back.out(1.7)",
                    },
                    "-=0.4"
                  );
                }

                // 5. Descripción con fade
                if (description) {
                  gsap.set(description, {
                    opacity: 0,
                    y: 20,
                  });

                  tl.to(
                    description,
                    {
                      opacity: 1,
                      y: 0,
                      duration: 0.6,
                      ease: "power2.out",
                    },
                    "-=0.3"
                  );
                }

                // 6. Metadata con slide from bottom
                if (metadata) {
                  gsap.set(metadata, {
                    opacity: 0,
                    y: 20,
                  });

                  tl.to(
                    metadata,
                    {
                      opacity: 1,
                      y: 0,
                      duration: 0.5,
                      ease: "power2.out",
                    },
                    "-=0.2"
                  );
                }

                // 7. Iconos con path drawing effect (simulado)
                if (icons.length > 0) {
                  gsap.set(icons, {
                    opacity: 0,
                    scale: 0,
                    rotation: -180,
                  });

                  tl.to(
                    icons,
                    {
                      opacity: 1,
                      scale: 1,
                      rotation: 0,
                      duration: 0.6,
                      stagger: 0.1,
                      ease: "back.out(2)",
                    },
                    "-=0.2"
                  );
                }
              },
              once: true,
            });

            // ============================================
            // 3. EFECTO DE MAGNETISMO SUTIL EN SCROLL
            // ============================================
            if (!isMobile) {
              ScrollTrigger.create({
                trigger: card,
                start: "top bottom",
                end: "bottom top",
                scrub: 1,
                onUpdate: (self) => {
                  const progress = self.progress;
                  const yMove = (progress - 0.5) * 30;

                  gsap.to(card, {
                    y: yMove,
                    duration: 0.3,
                    ease: "none",
                  });
                },
              });
            }
          });

          // ============================================
          // 4. ANIMACIÓN DEL DECORATIVE SVG PATTERN
          // ============================================
          const decorativeElements =
            gsap.utils.toArray<SVGElement>(".decorative-svg");

          decorativeElements.forEach((element) => {
            const paths = element.querySelectorAll("path, circle, line");

            gsap.set(paths, {
              strokeDasharray: 1000,
              strokeDashoffset: 1000,
              opacity: 0,
            });

            ScrollTrigger.create({
              trigger: element,
              start: "top 90%",
              onEnter: () => {
                gsap.to(paths, {
                  strokeDashoffset: 0,
                  opacity: 1,
                  duration: 2,
                  stagger: 0.1,
                  ease: "power2.inOut",
                });
              },
              once: true,
            });
          });
        }
      );

      // Cleanup
      return () => {
        mm.revert();
        ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      };
    },
    { scope: containerRef, dependencies: [] }
  );

  return {
    containerRef,
    headlineRef,
  };
};
