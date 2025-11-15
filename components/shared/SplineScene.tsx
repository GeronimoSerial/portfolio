"use client";

import { useRef, useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { Application } from "@splinetool/runtime";

export default function Robot() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const appRef = useRef<Application | null>(null);

  const mainObjRef = useRef<any>(null);

  const [isLoading, setIsLoading] = useState(true);

  const pointer = useRef({ x: 0, y: 0 });
  const targetRot = useRef({ x: 0, y: 0 });
  const currentRot = useRef({ x: 0, y: 0 });

  const animationFrame = useRef<number | null>(null);

  // Observa si el robot está en viewport
  const { ref: inViewRef, inView } = useInView({
    threshold: 0.1,
  });

  // --- Pointer tracking optimizado ---
  useEffect(() => {
    const handlePointer = (e: PointerEvent) => {
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = -(e.clientY / window.innerHeight) * 2 + 1;

      // sensibilidad del robot (ajustable)
      targetRot.current.y = pointer.current.x * 0.28;
      targetRot.current.x = pointer.current.y * 0.18;
    };

    window.addEventListener("pointermove", handlePointer, { passive: true });
    return () => window.removeEventListener("pointermove", handlePointer);
  }, []);

  // --- Main animation loop ---
  const loop = () => {
    const obj = mainObjRef.current;
    if (obj) {
      const ease = 0.06; // easing suave real

      currentRot.current.x +=
        (targetRot.current.x - currentRot.current.x) * ease;
      currentRot.current.y +=
        (targetRot.current.y - currentRot.current.y) * ease;

      // clamp para evitar jitter
      currentRot.current.x = Math.max(
        -0.3,
        Math.min(0.3, currentRot.current.x)
      );
      currentRot.current.y = Math.max(
        -0.5,
        Math.min(0.5, currentRot.current.y)
      );

      obj.rotation.x = currentRot.current.x;
      obj.rotation.y = currentRot.current.y;
    }

    animationFrame.current = requestAnimationFrame(loop);
  };

  // --- Loading de la escena + setup inicial ---
  useEffect(() => {
    if (!canvasRef.current) return;

    const app = new Application(canvasRef.current, {
      renderMode: "continuous",
    });
    appRef.current = app;

    app
      .load("/assets/spline/scene.splinecode")
      .then(() => {
        setIsLoading(false);

        // Cache principal
        mainObjRef.current =
          app.findObjectByName("Bot") || app.findObjectByName("Scene 1");

        // Inicia el loop sólo si está visible
        if (inView && !animationFrame.current) loop();
      })
      .catch((err) => {
        console.error("Spline load error:", err);
        setIsLoading(false);
      });

    return () => {
      if (animationFrame.current) cancelAnimationFrame(animationFrame.current);
      appRef.current?.dispose();
    };
  }, []);

  // --- Pausa / resume cuando entra o sale del viewport ---
  useEffect(() => {
    if (inView) {
      if (!animationFrame.current) loop();
    } else {
      if (animationFrame.current) cancelAnimationFrame(animationFrame.current);
      animationFrame.current = null;
    }
  }, [inView]);

  // --- Pausar si la pestaña no está visible ---
  useEffect(() => {
    const onVisibilityChange = () => {
      if (document.hidden) {
        if (animationFrame.current) {
          cancelAnimationFrame(animationFrame.current);
          animationFrame.current = null;
        }
      } else if (inView && !animationFrame.current) {
        loop();
      }
    };

    document.addEventListener("visibilitychange", onVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", onVisibilityChange);
  }, [inView]);

  return (
    <div
      ref={inViewRef}
      className="absolute inset-0 z-0 opacity-60 -translate-y-16 lg:-translate-y-24"
    >
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/20 z-10">
          <span className="animate-pulse text-zinc-400">Cargando escena…</span>
        </div>
      )}
      <canvas
        ref={canvasRef}
        className="w-full h-full"
        style={{ willChange: "transform" }}
      />
    </div>
  );
}
