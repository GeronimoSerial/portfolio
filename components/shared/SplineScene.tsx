"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { Application } from "@splinetool/runtime";

export default function Robot() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const appRef = useRef<Application | null>(null);
  const isLoadedRef = useRef(false);
  const isLoadingRef = useRef(false);
  const mouse = useRef({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);

  // Detectar mobile para optimizar DPR
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  const optimizarResolucion = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const { clientWidth, clientHeight } = canvas;

    // DPR más agresivo en mobile para mejor performance
    const dprMaximo = isMobile ? 0.8 : 1.2;
    const dpr = Math.min(window.devicePixelRatio, dprMaximo);

    const newWidth = clientWidth * dpr;
    const newHeight = clientHeight * dpr;

    if (canvas.width !== newWidth || canvas.height !== newHeight) {
      canvas.width = newWidth;
      canvas.height = newHeight;

      if (appRef.current?.setSize) {
        /* @ts-ignore */
        appRef.current.setSize(newWidth, newHeight);
      }
    }
  }, [isMobile]);

  // Función de carga diferida con requestIdleCallback
  const loadSplineScene = useCallback(() => {
    if (isLoadingRef.current || isLoadedRef.current || !canvasRef.current)
      return;

    isLoadingRef.current = true;

    const loadScene = () => {
      const app = new Application(canvasRef.current!);
      appRef.current = app;

      app
        .load("/assets/spline/scene.splinecode")
        .then(() => {
          isLoadedRef.current = true;
          isLoadingRef.current = false;
          optimizarResolucion();
        })
        .catch((error) => {
          console.error("Error loading Spline scene:", error);
          isLoadingRef.current = false;
        });
    };

    // Usar requestIdleCallback si está disponible, sino setTimeout
    if ("requestIdleCallback" in window) {
      requestIdleCallback(loadScene, { timeout: 2000 });
    } else {
      setTimeout(loadScene, 100);
    }
  }, [optimizarResolucion]);

  // IntersectionObserver para cargar solo cuando el componente esté visible
  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            loadSplineScene();
            observer.disconnect(); // Solo cargar una vez
          }
        });
      },
      {
        rootMargin: "200px", // Precargar 200px antes de entrar en viewport
        threshold: 0.1,
      }
    );

    observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, [loadSplineScene]);

  useEffect(() => {
    const handleResize = () => {
      requestAnimationFrame(optimizarResolucion);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      if (appRef.current) {
        appRef.current.dispose();
      }
    };
  }, [optimizarResolucion]);

  return (
    <div ref={containerRef} className="absolute inset-0 z-0 overflow-hidden">
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
}
