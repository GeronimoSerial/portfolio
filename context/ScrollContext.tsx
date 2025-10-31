"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";

interface ScrollContextType {
  activeSection: string;
  isScrolled: boolean;
  showBackToTop: boolean;
  scrollY: number;
}

const ScrollContext = createContext<ScrollContextType>({
  activeSection: "hero",
  isScrolled: false,
  showBackToTop: false,
  scrollY: 0,
});

export function ScrollProvider({ children }: { children: React.ReactNode }) {
  const [activeSection, setActiveSection] = useState("hero");
  const [scrollY, setScrollY] = useState(0);

  // Single RAF-throttled scroll listener para optimizar rendimiento
  useEffect(() => {
    let rafId: number | null = null;

    const handleScroll = () => {
      // Si ya hay un RAF pendiente, no crear otro
      if (rafId !== null) return;

      rafId = requestAnimationFrame(() => {
        setScrollY(window.scrollY);
        rafId = null;
      });
    };

    // Escuchar scroll una sola vez con passive: true para mejor performance
    window.addEventListener("scroll", handleScroll, { passive: true });

    // Cleanup
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
      }
    };
  }, []);

  // Single Intersection Observer para detectar sección activa
  useEffect(() => {
    const sections = [
      "hero",
      "services",
      "process",
      "projects",
      "testimonials",
      "contact",
    ];

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        // Ajusta estos valores según necesites
        rootMargin: "-20% 0px -35% 0px",
        threshold: 0,
      }
    );

    // Observar todas las secciones
    sections.forEach((id) => {
      const element = document.getElementById(id);
      if (element) {
        observer.observe(element);
      }
    });

    // Cleanup
    return () => {
      observer.disconnect();
    };
  }, []);

  // Valores derivados calculados una sola vez
  const contextValue: ScrollContextType = {
    activeSection,
    isScrolled: scrollY > 50,
    showBackToTop: scrollY > 300,
    scrollY,
  };

  return (
    <ScrollContext.Provider value={contextValue}>
      {children}
    </ScrollContext.Provider>
  );
}

// Hook personalizado para acceder al contexto
export const useScroll = () => {
  const context = useContext(ScrollContext);

  if (!context) {
    throw new Error("useScroll must be used within ScrollProvider");
  }

  return context;
};
