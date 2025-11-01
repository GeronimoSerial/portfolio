import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { useRef, useLayoutEffect } from "react";

gsap.registerPlugin(ScrollTrigger);

export function useProcessAnimations() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!containerRef.current) return;

      const ctx = gsap.context(() => {
        // Animate section header with split reveal
        gsap.from(".process-header", {
          y: 50,
          opacity: 0,
          duration: 1.1,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".process-header",
            start: "top 80%",
            toggleActions: "play none none none",
          },
        });

        gsap.from(".process-divider", {
          scaleX: 0,
          opacity: 0,
          duration: 1,
          ease: "power3.inOut", // Más suave
          scrollTrigger: {
            trigger: ".process-divider",
            start: "top 80%",
            toggleActions: "play none none none",
          },
        });

        // Animate cards with unique entrance per card
        const cards = gsap.utils.toArray<HTMLElement>(".process-card");
        
        cards.forEach((card, index) => {
          const direction = index % 2 === 0 ? -1 : 1;
          const rotation = index % 2 === 0 ? -8 : 8;
          
          // Card entrance with rotation and slide - smoother easing
          gsap.from(card, {
            x: direction * 80,
            y: 60,
            rotation: rotation,
            opacity: 0,
            scale: 0.85,
            duration: 1.2,
            ease: "power3.out", // Más suave y consistente
            force3D: true,
            scrollTrigger: {
              trigger: card,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          });

          // Animate number with scale pulse - más suave
          const number = card.querySelector(".process-number");
          if (number) {
            gsap.from(number, {
              scale: 0,
              rotation: 180, // Reducido de 360 a 180
              opacity: 0,
              duration: 1,
              ease: "back.out(1.2)", // Menos elástico, más suave
              delay: 0.15,
              scrollTrigger: {
                trigger: card,
                start: "top 85%",
                toggleActions: "play none none none",
              },
            });
          }

          // Animate icon with bounce and draw effect - más suave
          const icon = card.querySelector(".process-icon");
          if (icon) {
            gsap.from(icon, {
              scale: 0,
              rotation: -90, // Reducido de -180
              opacity: 0,
              duration: 0.9,
              ease: "back.out(1.5)", // Menos rebote
              delay: 0.3,
              scrollTrigger: {
                trigger: card,
                start: "top 85%",
                toggleActions: "play none none none",
              },
            });
          }

          // Animate title with slide from side
          const title = card.querySelector(".process-title");
          if (title) {
            gsap.from(title, {
              x: direction * -30,
              opacity: 0,
              duration: 0.9,
              ease: "power3.out", // Más consistente con la tarjeta
              delay: 0.4,
              scrollTrigger: {
                trigger: card,
                start: "top 85%",
                toggleActions: "play none none none",
              },
            });
          }

          // Animate description with fade
          const description = card.querySelector(".process-description");
          if (description) {
            gsap.from(description, {
              y: 15,
              opacity: 0,
              duration: 0.9,
              ease: "power3.out", // Consistente
              delay: 0.5,
              scrollTrigger: {
                trigger: card,
                start: "top 85%",
                toggleActions: "play none none none",
              },
            });
          }

          // Animate list items sequentially with stagger
          const listItems = card.querySelectorAll(".process-list-item");
          if (listItems.length > 0) {
            gsap.from(listItems, {
              x: -15,
              opacity: 0,
              duration: 0.7,
              ease: "power3.out", // Consistente
              stagger: 0.08,
              delay: 0.6,
              scrollTrigger: {
                trigger: card,
                start: "top 85%",
                toggleActions: "play none none none",
              },
            });
          }
        });

        // Animate connecting lines between cards (decorative)
        const connectors = gsap.utils.toArray<HTMLElement>(".process-connector");
        connectors.forEach((connector, index) => {
          gsap.from(connector, {
            scaleX: 0,
            opacity: 0,
            duration: 0.9,
            ease: "power3.out", // Consistente con otros elementos
            delay: 0.25 + index * 0.15,
            scrollTrigger: {
              trigger: connector,
              start: "top 85%",
              toggleActions: "play none none none",
            },
          });
        });

        // Animate footer text
        gsap.from(".process-footer", {
          y: 25,
          opacity: 0,
          duration: 1,
          ease: "power3.out", // Consistente
          scrollTrigger: {
            trigger: ".process-footer",
            start: "top 90%",
            toggleActions: "play none none none",
          },
        });
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

  return containerRef;
}
