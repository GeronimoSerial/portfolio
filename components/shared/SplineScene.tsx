"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import { Application } from "@splinetool/runtime";

export default function Robot() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // Refs para controlar la lógica sin re-renders
  const appRef = useRef<Application | null>(null);
  const isLoadedRef = useRef(false);
  const mouse = useRef({ x: 0, y: 0 });

  // ... (Tu lógica de mouse/pointer sigue igual) ...
  // / 1. Lógica de Mouse optimizada (fuera del ciclo de React)
  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  // Función para forzar la resolución (El Core de la optimización)
  const optimizarResolucion = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // 1. Obtenemos el tamaño visual real del contenedor
    const { clientWidth, clientHeight } = canvas;

    // 2. Definimos un límite de calidad.
    //    En lugar de usar window.devicePixelRatio (que puede ser 3 en iPhone),
    //    lo limitamos a máximo 1.2 o 1.5.
    //    Si es gama baja (puedes integrar detect-gpu aqui), usas 0.8 o 1.
    const dprMaximo = 0.3; // <--- AJUSTA ESTE VALOR (Menor = Más FPS)
    const dpr = Math.min(window.devicePixelRatio, dprMaximo);

    // 3. Forzamos el tamaño del buffer interno
    //    Esto reduce la cantidad de píxeles que la GPU debe calcular
    const newWidth = clientWidth * dpr;
    const newHeight = clientHeight * dpr;

    // Solo aplicamos si hay un cambio para evitar parpadeos
    if (canvas.width !== newWidth || canvas.height !== newHeight) {
      canvas.width = newWidth;
      canvas.height = newHeight;

      // Importante: Algunas versiones de Spline necesitan saber que el tamaño cambió.
      // Si existe el método setSize lo usamos, si no, el cambio de atributos basta
      // para el siguiente frame de renderizado WebGL.
      /* @ts-ignore */
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

      // APLICAMOS LA OPTIMIZACIÓN INICIAL
      optimizarResolucion();

      // Buscamos objetos e iniciamos loops si es necesario...
    });

    // --- OVERRIDE DEL RESIZE ---
    // Spline intenta ajustar el tamaño automáticamente al hacer resize.
    // Nosotros agregamos nuestro listener para "corregirlo" inmediatamente después.
    const handleResize = () => {
      // Le damos un pequeño delay para que ocurra después del resize interno de Spline
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
      {/* style={{ width: '100%', height: '100%' }} es CRÍTICO.
         El canvas se estira visualmente por CSS, pero internamente (atributos width/height)
         tiene la resolución baja que calculamos en la función.
      */}
      <canvas ref={canvasRef} className="w-full h-full block" />
    </div>
  );
}
