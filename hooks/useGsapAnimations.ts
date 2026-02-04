import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Hook para revelar elementos al entrar en viewport
export function useScrollReveal<T extends HTMLElement>(
  options: {
    delay?: number;
    duration?: number;
    y?: number;
    blur?: number;
    threshold?: number;
    scrub?: boolean | number;
    stagger?: number;
  } = {}
) {
  const ref = useRef<T>(null);
  const { delay = 0, duration = 1.2, y = 50, blur = 10, threshold = 0.2, scrub = false, stagger = 0 } = options;

  useGSAP(
    () => {
      const element = ref.current;
      if (!element) return;

      gsap.fromTo(
        element,
        {
          opacity: 0,
          y: y,
          filter: `blur(${blur}px)`,
        },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: duration,
          delay: delay,
          stagger: stagger,
          ease: "power3.out",
          scrollTrigger: {
            trigger: element,
            start: `top ${100 - threshold * 100}%`,
            toggleActions: "play none none reverse",
            scrub: scrub,
          },
        }
      );
    },
    { scope: ref }
  );

  return ref;
}

// Hook para revelar lista de elementos con stagger
export function useStaggerReveal<T extends HTMLElement>(
  options: {
    selector?: string;
    stagger?: number;
    delay?: number;
    y?: number;
    threshold?: number;
  } = {}
) {
  const containerRef = useRef<T>(null);
  const { selector = ".gsap-item", stagger = 0.1, delay = 0, y = 30, threshold = 0.2 } = options;

  useGSAP(
    () => {
      const container = containerRef.current;
      if (!container) return;

      // Si se proporciona un selector, buscar hijos, si no, usar el contenedor mismo si es aplicable o sus hijos directos
      const items = selector ? container.querySelectorAll(selector) : container.children;
      if (items.length === 0) return;

      gsap.fromTo(
        items,
        { opacity: 0, y: y, filter: "blur(5px)" },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          duration: 1,
          stagger: stagger,
          delay: delay,
          ease: "power3.out",
          scrollTrigger: {
            trigger: container,
            start: `top ${100 - threshold * 100}%`,
            toggleActions: "play none none reverse",
          },
        }
      );
    },
    { scope: containerRef }
  );

  return containerRef;
}

// Hook para efecto magnético en botones/cards
export function useMagneticEffect<T extends HTMLElement>(strength: number = 0.5) {
  const ref = useRef<T>(null);

  useGSAP(
    () => {
      const element = ref.current;
      if (!element) return;

      const xTo = gsap.quickTo(element, "x", { duration: 1, ease: "elastic.out(1, 0.3)" });
      const yTo = gsap.quickTo(element, "y", { duration: 1, ease: "elastic.out(1, 0.3)" });

      const onMouseMove = (e: MouseEvent) => {
        const { clientX, clientY } = e;
        const rect = element.getBoundingClientRect();
        const x = clientX - (rect.left + rect.width / 2);
        const y = clientY - (rect.top + rect.height / 2);
        xTo(x * strength);
        yTo(y * strength);
      };

      const onMouseLeave = () => {
        xTo(0);
        yTo(0);
      };

      element.addEventListener("mousemove", onMouseMove);
      element.addEventListener("mouseleave", onMouseLeave);

      return () => {
        element.removeEventListener("mousemove", onMouseMove);
        element.removeEventListener("mouseleave", onMouseLeave);
      };
    },
    { scope: ref }
  );

  return ref;
}

// Hook para efecto parallax simple
export function useParallax<T extends HTMLElement>(speed: number = 0.5) {
  const ref = useRef<T>(null);

  useGSAP(
    () => {
      const element = ref.current;
      if (!element) return;

      gsap.to(element, {
        y: () => (document.documentElement.scrollHeight - window.innerHeight) * speed * -0.1, // Simple parallax calc
        ease: "none",
        scrollTrigger: {
          trigger: element,
          start: "top bottom",
          end: "bottom top",
          scrub: 0,
        },
      });
    },
    { scope: ref }
  );

  return ref;
}

// Hook para animar números (Count Up)
export function useCountUp<T extends HTMLElement>(
  endValue: number | string,
  duration: number = 2,
  suffix: string = ""
) {
  const ref = useRef<T>(null);
  
  // Extraer número del string si viene como "100%" o "+150k"
  const numericValue = typeof endValue === "string" 
    ? parseFloat(endValue.replace(/[^0-9.]/g, "")) 
    : endValue;
    
  // Detectar prefijo y sufijo original si existen
  const prefix = typeof endValue === "string" && endValue.startsWith("+") ? "+" : "";
  const originalSuffix = typeof endValue === "string" && endValue.endsWith("%") ? "%" : (typeof endValue === "string" && endValue.toLowerCase().endsWith("k") ? "k" : "");
  
  const finalSuffix = suffix || originalSuffix;

  useGSAP(
    () => {
      const element = ref.current;
      if (!element) return;

      const obj = { value: 0 };
      
      gsap.to(obj, {
        value: numericValue,
        duration: duration,
        ease: "power2.out",
        scrollTrigger: {
          trigger: element,
          start: "top 85%",
          toggleActions: "play none none reverse",
        },
        onUpdate: () => {
          // Formatear número: enteros sin decimales, float con 1 decimal si es necesario
          const current = Number.isInteger(numericValue) 
            ? Math.round(obj.value) 
            : obj.value.toFixed(1);
            
          element.textContent = `${prefix}${current}${finalSuffix}`;
        },
      });
    },
    { scope: ref }
  );

  return ref;
}
