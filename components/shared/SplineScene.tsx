"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { Application } from "@splinetool/runtime";

export default function Robot() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const appRef = useRef<Application | null>(null);
  const isLoadedRef = useRef(false);
  const isLoadingRef = useRef(false);
  const lastSizeRef = useRef({ width: 0, height: 0 });
  const dprRef = useRef<number | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isIOS, setIsIOS] = useState(false);

  // Detectar mobile para optimizar DPR
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const isiOSDevice =
      /iP(hone|ad|od)/.test(navigator.userAgent) ||
      (navigator.userAgent.includes("Mac") && navigator.maxTouchPoints > 1);
    setIsIOS(isiOSDevice);
  }, []);

  const optimizarResolucion = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const { clientWidth, clientHeight } = canvas;

    // DPR más agresivo en mobile para mejor performance
    if (!dprRef.current) {
      const dprMaximo = isMobile ? 0.6 : 1.0;
      dprRef.current = Math.min(window.devicePixelRatio, dprMaximo);
    }
    const dpr = dprRef.current;

    const newWidth = Math.round(clientWidth * dpr);
    const newHeight = Math.round(clientHeight * dpr);

    if (
      isIOS &&
      lastSizeRef.current.width === newWidth &&
      lastSizeRef.current.height !== 0
    ) {
      return;
    }

    if (canvas.width !== newWidth || canvas.height !== newHeight) {
      canvas.width = newWidth;
      canvas.height = newHeight;

      lastSizeRef.current = { width: newWidth, height: newHeight };

      if (appRef.current?.setSize) {
        /* @ts-ignore */
        appRef.current.setSize(newWidth, newHeight);
      }
    }
  }, [isIOS, isMobile]);

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
    <div
      ref={containerRef}
      className="absolute inset-0 z-0 overflow-hidden spline-scene"
    >
      <canvas
        ref={canvasRef}
        className={`w-full h-full block spline-canvas ${
          isMobile ? "pointer-events-none" : ""
        }`}
      />
    </div>
  );
}
