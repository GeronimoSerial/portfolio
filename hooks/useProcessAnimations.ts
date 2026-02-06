"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export const useProcessAnimations = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.config({ force3D: true });

      const cards = gsap.utils.toArray<HTMLDivElement>(".process-card");
      const header = ".process-header";
      const footer = ".process-footer";

      // --- ESTADO INICIAL (FUERA DE PANTALLA) ---
      gsap.set(header, { opacity: 0, y: 100, filter: "blur(10px)" });
      gsap.set(footer, { opacity: 0, scale: 0.8 });

      gsap.set(cards, {
        opacity: 0,
        // Alternamos entrada: izquierda/derecha + rotación agresiva
        x: (i) => (i % 2 === 0 ? -150 : 150),
        rotation: (i) => (i % 2 === 0 ? -12 : 12),
        scale: 0.8,
        transformOrigin: "center center",
      });

      // Animamos los elementos internos de la card para un efecto "entallado"
      const cardContents = cards.map((card) => ({
        icon: card.querySelector(".process-icon"),
        number: card.querySelector(".process-number"),
        text: card.querySelectorAll(".process-title, .process-description"),
        items: card.querySelectorAll("li"),
      }));

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 50%",
          toggleActions: "play none none reverse",
        },
      });

      // --- SECUENCIA DE ANIMACIÓN ---

      // 1. Entrada del Header con "revelado"
      tl.to(header, {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        duration: 1.2,
        ease: "expo.out",
      }).to(
        ".process-divider",
        {
          width: "6rem",
          duration: 1,
          ease: "power4.inOut",
        },
        "-=0.8",
      );

      // 2. Entrada de las Cards con efecto Elástico
      tl.to(
        cards,
        {
          opacity: 1,
          x: 0,
          rotation: 0,
          scale: 1,
          duration: 1.5,
          stagger: 0.2,
          ease: "elastic.out(1, 0.75)", // Ese rebote extravagante que buscas
        },
        "-=1",
      );

      // 3. Animación "Pop" de los iconos y números internos
      cardContents.forEach((content, i) => {
        tl.from(
          content.icon,
          {
            scale: 0,
            rotation: -45,
            duration: 0.6,
            ease: "back.out(2)",
          },
          `-=${1.2 - i * 0.1}`,
        );

        tl.from(
          content.items,
          {
            opacity: 0,
            x: -20,
            stagger: 0.05,
            duration: 0.4,
            ease: "power2.out",
          },
          "<",
        );
      });

      // 4. Footer final
      tl.to(
        footer,
        {
          opacity: 1,
          scale: 1,
          duration: 0.8,
          ease: "back.out(1.7)",
        },
        "-=0.5",
      );
    },
    { scope: containerRef },
  );

  return containerRef;
};
