"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { Application } from "@splinetool/runtime";

type RobotProps = {
  onPerformanceIssue?: () => void;
};

export default function Robot({ onPerformanceIssue }: RobotProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const appRef = useRef<Application | null>(null);
  const isLoadedRef = useRef(false);
  const isLoadingRef = useRef(false);
  const isUnmountedRef = useRef(false);
  const hasReportedPerfIssueRef = useRef(false);
  const lastSizeRef = useRef({ width: 0, height: 0 });
  const lastMobileRef = useRef<boolean | null>(null);
  const dprRef = useRef<number | null>(null);
  const isIOSRef = useRef(false);
  const idleCallbackIdRef = useRef<number | null>(null);
  const timeoutIdRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isSceneReady, setIsSceneReady] = useState(false);

  const cancelPendingLoad = useCallback(() => {
    if (idleCallbackIdRef.current !== null && "cancelIdleCallback" in window) {
      window.cancelIdleCallback(idleCallbackIdRef.current);
      idleCallbackIdRef.current = null;
    }

    if (timeoutIdRef.current !== null) {
      window.clearTimeout(timeoutIdRef.current);
      timeoutIdRef.current = null;
    }
  }, []);

  useEffect(() => {
    const isiOSDevice =
      /iP(hone|ad|od)/.test(navigator.userAgent) ||
      (navigator.userAgent.includes("Mac") && navigator.maxTouchPoints > 1);
    isIOSRef.current = isiOSDevice;
  }, []);

  const optimizarResolucion = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const { clientWidth, clientHeight } = canvas;
    const currentIsMobile = window.innerWidth < 768;

    if (lastMobileRef.current !== currentIsMobile) {
      dprRef.current = null;
      lastMobileRef.current = currentIsMobile;
    }

    // DPR más agresivo en mobile para mejor performance
    if (dprRef.current === null) {
      const dprMaximo = currentIsMobile ? 0.6 : 1.0;
      dprRef.current = Math.min(window.devicePixelRatio, dprMaximo);
    }
    const dpr = dprRef.current;

    const newWidth = Math.round(clientWidth * dpr);
    const newHeight = Math.round(clientHeight * dpr);

    if (
      isIOSRef.current &&
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
  }, []);

  // Función de carga diferida con requestIdleCallback
  const loadSplineScene = useCallback(() => {
    if (isLoadingRef.current || isLoadedRef.current || !canvasRef.current)
      return;

    cancelPendingLoad();
    isLoadingRef.current = true;

    const loadScene = () => {
      idleCallbackIdRef.current = null;
      timeoutIdRef.current = null;

      if (isUnmountedRef.current || !canvasRef.current) {
        isLoadingRef.current = false;
        return;
      }

      const app = new Application(canvasRef.current!);
      appRef.current = app;

      app
        .load("/assets/spline/scene.splinecode")
        .then(() => {
          if (isUnmountedRef.current) {
            app.dispose();
            return;
          }

          isLoadedRef.current = true;
          isLoadingRef.current = false;
          hasReportedPerfIssueRef.current = false;
          setIsSceneReady(true);
          optimizarResolucion();
        })
        .catch((error) => {
          if (!isUnmountedRef.current) {
            console.error("Error loading Spline scene:", error);
          }
          isLoadingRef.current = false;
        });
    };

    // Usar requestIdleCallback si está disponible, sino setTimeout
    if ("requestIdleCallback" in window) {
      idleCallbackIdRef.current = window.requestIdleCallback(loadScene, {
        timeout: 500,
      });
    } else {
      timeoutIdRef.current = setTimeout(loadScene, 50);
    }
  }, [cancelPendingLoad, optimizarResolucion]);

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
    if (!isSceneReady || !onPerformanceIssue) return;

    let rafId = 0;
    let lastTs = performance.now();
    let badWindows = 0;
    let goodWindows = 0;
    const frameTimes: number[] = [];

    const loop = (ts: number) => {
      if (document.hidden) {
        lastTs = ts;
        rafId = requestAnimationFrame(loop);
        return;
      }

      const delta = ts - lastTs;
      lastTs = ts;

      if (delta > 0) frameTimes.push(delta);

      if (frameTimes.length >= 120) {
        const total = frameTimes.reduce((acc, value) => acc + value, 0);
        const avgFrameTime = total / frameTimes.length;
        const fps = 1000 / avgFrameTime;
        const slowFrames = frameTimes.filter((value) => value > 32).length;
        const slowRatio = slowFrames / frameTimes.length;

        if (fps < 50 || slowRatio > 0.2) {
          badWindows += 1;
          goodWindows = 0;
        } else {
          badWindows = 0;
          goodWindows += 1;
        }

        frameTimes.length = 0;

        if (badWindows >= 2 && !hasReportedPerfIssueRef.current) {
          hasReportedPerfIssueRef.current = true;
          onPerformanceIssue();
          return;
        }

        if (goodWindows >= 3) {
          return;
        }
      }

      rafId = requestAnimationFrame(loop);
    };

    rafId = requestAnimationFrame(loop);

    return () => cancelAnimationFrame(rafId);
  }, [isSceneReady, onPerformanceIssue]);

  useEffect(() => {
    const handleResize = () => {
      const nextIsMobile = window.innerWidth < 768;
      setIsMobile((prev) => (prev === nextIsMobile ? prev : nextIsMobile));
      requestAnimationFrame(optimizarResolucion);
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [optimizarResolucion]);

  useEffect(() => {
    isUnmountedRef.current = false;

    return () => {
      isUnmountedRef.current = true;
      cancelPendingLoad();

      if (appRef.current) {
        appRef.current.dispose();
        appRef.current = null;
      }
    };
  }, [cancelPendingLoad]);

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
