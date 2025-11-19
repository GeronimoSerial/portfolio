"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { Application } from "@splinetool/runtime";
export default function Robot() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // Refs para controlar la lógica sin re-renders
  const appRef = useRef<Application | null>(null);
  const isLoadedRef = useRef(false);
  const mouse = useRef({ x: 0, y: 0 });

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

    const dprMaximo = 1.5; // <--- AJUSTA ESTE VALOR (Menor = Más FPS)
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
  }, []);

  useEffect(() => {
    if (!canvasRef.current) return;

    const app = new Application(canvasRef.current);
    appRef.current = app;

    app.load("/assets/spline/scene.splinecode").then(() => {
      isLoadedRef.current = true;

      optimizarResolucion();
    });

    const handleResize = () => {
      requestAnimationFrame(optimizarResolucion);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      app.dispose();
    };
  }, [optimizarResolucion]);

  return (
    <div className="absolute inset-0 z-0 overflow-hidden">
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
}
