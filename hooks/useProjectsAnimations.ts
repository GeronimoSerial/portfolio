"use client";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

/**
 * Hook de animaciones optimizado para la sección de proyectos
 * Versión mobile-optimized con reducciones de complejidad para 60fps
 */
export const useProjectsAnimations = () => {
  const containerRef = useRef<HTMLElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!containerRef.current) return;

      // Configuración optimizada para GPU acceleration
      gsap.config({
        force3D: true,
        nullTargetWarn: false,
      });

      const mm = gsap.matchMedia();

      mm.add(
        {
          isMobile: "(max-width: 768px)",
          isDesktop: "(min-width: 769px)",
        },
        (context) => {
          const { isMobile } = context.conditions as { isMobile: boolean };

          // ============================================
          // 1. ANIMACIÓN DEL HEADLINE - MOBILE OPTIMIZED
          // ============================================
          if (headlineRef.current) {
            const headline = headlineRef.current;
            const words = headline.querySelectorAll(".word");
            const subtitle =
              containerRef.current?.querySelector(".projects-subtitle");

            // Simplificado para mobile: sin rotateX en mobile para mejor performance
            gsap.set(words, {
              opacity: 0,
              y: isMobile ? 50 : 100,
              rotateX: isMobile ? 0 : -90,
              transformOrigin: "50% 100%",
              force3D: true,
            });

            if (subtitle) {
              gsap.set(subtitle, {
                opacity: 0,
                y: isMobile ? 15 : 30,
                force3D: true,
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
                  duration: isMobile ? 0.8 : 1.2,
                  stagger: {
                    amount: isMobile ? 0.2 : 0.4,
                    from: "start",
                  },
                  ease: "power3.out",
                  force3D: true,
                });

                if (subtitle) {
                  gsap.to(subtitle, {
                    opacity: 1,
                    y: 0,
                    duration: isMobile ? 0.5 : 0.8,
                    delay: isMobile ? 0.3 : 0.6,
                    ease: "power2.out",
                    force3D: true,
                  });
                }
              },
              once: true,
            });
          }

          // ============================================
          // 2. ANIMACIÓN DE CARDS - MOBILE OPTIMIZED
          // Reducción de complejidad en mobile para 60fps
          // ============================================
          const cards = gsap.utils.toArray<HTMLElement>(".project-card");

          // Direcciones simplificadas para mobile
          const directions = isMobile
            ? [
                { x: 0, y: -30, rotation: 0 },
                { x: 0, y: -30, rotation: 0 },
                { x: 0, y: -30, rotation: 0 },
                { x: 0, y: -30, rotation: 0 },
                { x: 0, y: -30, rotation: 0 },
                { x: 0, y: -30, rotation: 0 },
              ]
            : [
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

            // Estado inicial con clip-path simplificado en mobile
            gsap.set(card, {
              opacity: 0,
              x: direction.x,
              y: direction.y,
              rotation: direction.rotation,
              scale: isMobile ? 0.95 : 0.8,
              clipPath: isMobile ? "none" : "circle(0% at 50% 50%)",
              force3D: true,
            });

            if (border) {
              gsap.set(border, {
                opacity: 0,
                scale: isMobile ? 1 : 0.5,
                force3D: true,
              });
            }

            if (content) {
              gsap.set(content, {
                opacity: 0,
              });
            }

            ScrollTrigger.create({
              trigger: card,
              start: "top 85%",
              onEnter: () => {
                const tl = gsap.timeline({ defaults: { force3D: true } });

                // Animación del card principal
                tl.to(card, {
                  opacity: 1,
                  x: 0,
                  y: 0,
                  rotation: 0,
                  scale: 1,
                  clipPath: isMobile ? "none" : "circle(150% at 50% 50%)",
                  duration: isMobile ? 0.6 : 1.2,
                  ease: "power3.out",
                });

                // Borde con animación simplificada en mobile
                if (border) {
                  tl.to(
                    border,
                    {
                      opacity: 1,
                      scale: 1,
                      duration: isMobile ? 0.4 : 0.8,
                      ease: isMobile ? "power2.out" : "elastic.out(1, 0.6)",
                    },
                    isMobile ? "-=0.4" : "-=0.8"
                  );
                }

                // Contenido
                if (content) {
                  tl.to(
                    content,
                    {
                      opacity: 1,
                      duration: isMobile ? 0.3 : 0.6,
                      ease: "power2.out",
                    },
                    isMobile ? "-=0.3" : "-=0.6"
                  );
                }

                // Título: split de caracteres solo en desktop
                if (title) {
                  if (isMobile) {
                    // Mobile: animación simple del título completo
                    gsap.set(title, { opacity: 0, y: 10 });
                    tl.to(
                      title,
                      {
                        opacity: 1,
                        y: 0,
                        duration: 0.4,
                        ease: "power2.out",
                      },
                      "-=0.2"
                    );
                  } else {
                    // Desktop: split de caracteres
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
                      force3D: true,
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
                }

                // Descripción
                if (description) {
                  gsap.set(description, {
                    opacity: 0,
                    y: isMobile ? 10 : 20,
                  });

                  tl.to(
                    description,
                    {
                      opacity: 1,
                      y: 0,
                      duration: isMobile ? 0.3 : 0.6,
                      ease: "power2.out",
                    },
                    isMobile ? "-=0.15" : "-=0.3"
                  );
                }

                // Metadata
                if (metadata) {
                  gsap.set(metadata, {
                    opacity: 0,
                    y: isMobile ? 10 : 20,
                  });

                  tl.to(
                    metadata,
                    {
                      opacity: 1,
                      y: 0,
                      duration: isMobile ? 0.3 : 0.5,
                      ease: "power2.out",
                    },
                    isMobile ? "-=0.1" : "-=0.2"
                  );
                }

                // Iconos con animación simplificada en mobile
                if (icons.length > 0) {
                  gsap.set(icons, {
                    opacity: 0,
                    scale: 0,
                    rotation: isMobile ? 0 : -180,
                    force3D: true,
                  });

                  tl.to(
                    icons,
                    {
                      opacity: 1,
                      scale: 1,
                      rotation: 0,
                      duration: isMobile ? 0.3 : 0.6,
                      stagger: isMobile ? 0.05 : 0.1,
                      ease: isMobile ? "power2.out" : "back.out(2)",
                    },
                    isMobile ? "-=0.1" : "-=0.2"
                  );
                }
              },
              once: true,
            });

            // ============================================
            // 3. EFECTO DE PARALLAX SOLO EN DESKTOP
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
                    overwrite: "auto",
                  });
                },
              });
            }
          });

          // ============================================
          // 4. ANIMACIÓN DEL DECORATIVE SVG - MOBILE OPTIMIZED
          // SVG animations simplificadas en mobile
          // ============================================
          const decorativeElements =
            gsap.utils.toArray<SVGElement>(".decorative-svg");

          decorativeElements.forEach((element) => {
            const paths = element.querySelectorAll("path, circle, line");

            if (isMobile) {
              // Mobile: simple fade in sin path drawing
              gsap.set(paths, {
                opacity: 0,
              });

              ScrollTrigger.create({
                trigger: element,
                start: "top 90%",
                onEnter: () => {
                  gsap.to(paths, {
                    opacity: 1,
                    duration: 0.6,
                    stagger: 0.05,
                    ease: "power2.out",
                  });
                },
                once: true,
              });
            } else {
              // Desktop: full path drawing animation
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
            }
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
