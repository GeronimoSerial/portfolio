import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export function useLandingTimeline() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // Timeline principal de la landing page
      const masterTl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 1,
        },
      });

      // Ejemplo: Conectar secciones si fuera necesario una animación continua
      // Por ahora, dejamos el hook preparado para orquestar transiciones globales
      // Las animaciones per-sección se manejarán con ScrollTrigger individuales
      // para mejor performance y modularidad.
    },
    { scope: containerRef }
  );

  return containerRef;
}
