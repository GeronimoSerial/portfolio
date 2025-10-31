"use client";

import { useEffect, useRef, useState } from "react";
import { useInView } from "react-intersection-observer";

interface ScrollRevealOptions {
  threshold?: number;
  triggerOnce?: boolean;
  rootMargin?: string;
  delay?: number;
}

interface ScrollRevealReturn {
  ref: (node?: Element | null) => void;
  isVisible: boolean;
  style: React.CSSProperties;
}

/**
 * Hook optimizado para animaciones de scroll sin flicker
 *
 * Usa transform + opacity para animaciones GPU-accelerated
 * Previene CLS (Cumulative Layout Shift) con will-change
 *
 * @example
 * const { ref, style } = useScrollReveal({ delay: 0.2 });
 * return <div ref={ref} style={style}>Content</div>
 */
export function useScrollReveal(
  options: ScrollRevealOptions = {}
): ScrollRevealReturn {
  const {
    threshold = 0.1,
    triggerOnce = true,
    rootMargin = "0px 0px -10% 0px",
    delay = 0,
  } = options;

  const { ref, inView } = useInView({
    threshold,
    triggerOnce,
    rootMargin,
  });

  const [hasAnimated, setHasAnimated] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (inView && !hasAnimated) {
      if (delay > 0) {
        timeoutRef.current = setTimeout(() => {
          setHasAnimated(true);
        }, delay * 1000);
      } else {
        setHasAnimated(true);
      }
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [inView, delay, hasAnimated]);

  // Estilos optimizados para prevenir flicker
  const style: React.CSSProperties = {
    // Propiedades GPU-accelerated
    transform: hasAnimated ? "translateY(0)" : "translateY(20px)",
    opacity: hasAnimated ? 1 : 0,

    // Transiciones suaves
    transition: `transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.6s cubic-bezier(0.16, 1, 0.3, 1)`,

    // Prevenir flicker con will-change
    willChange: hasAnimated ? "auto" : "transform, opacity",

    // Forzar compositing layer
    backfaceVisibility: "hidden",

    // Antialiasing
    WebkitFontSmoothing: "antialiased",
    MozOsxFontSmoothing: "grayscale",
  };

  return {
    ref,
    isVisible: hasAnimated,
    style,
  };
}

/**
 * Hook para animaciones escalonadas (stagger)
 * Útil para listas de elementos
 */
export function useStaggerReveal(
  index: number,
  options: ScrollRevealOptions = {}
): ScrollRevealReturn {
  const baseDelay = options.delay || 0;
  const staggerDelay = index * 0.1; // 100ms entre elementos

  return useScrollReveal({
    ...options,
    delay: baseDelay + staggerDelay,
  });
}

/**
 * Hook para animaciones de fade simple (sin translateY)
 */
export function useFadeReveal(
  options: ScrollRevealOptions = {}
): ScrollRevealReturn {
  const result = useScrollReveal(options);

  // Override style para solo fade
  const fadeStyle: React.CSSProperties = {
    ...result.style,
    transform: "none", // Sin movimiento
  };

  return {
    ...result,
    style: fadeStyle,
  };
}
