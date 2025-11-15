"use client";

import { useRef, useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import { Application } from "@splinetool/runtime";

export default function Robot() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const appRef = useRef<Application | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const mouseRef = useRef({ x: 0, y: 0 });
  const targetRotationRef = useRef({ x: 0, y: 0 });
  const currentRotationRef = useRef({ x: 0, y: 0 });
  const animationFrameRef = useRef<number | null>(null);

  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  useEffect(() => {
    if (!canvasRef.current || !inView) return;

    const app = new Application(canvasRef.current, {
      renderMode: "continuous",
    });
    appRef.current = app;

    app
      .load("/assets/spline/scene.splinecode")
      .then(() => {
        setIsLoading(false);

        let mainObject: any = null;
        mainObject =
          app.findObjectByName("Bot") || app.findObjectByName("Scene 1");

        // Throttle mouse events for better performance
        let ticking = false;
        const handleMouseMove = (e: MouseEvent) => {
          if (!ticking) {
            window.requestAnimationFrame(() => {
              mouseRef.current.x = (e.clientX / window.innerWidth) * 2 - 1;
              mouseRef.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
              targetRotationRef.current.y = mouseRef.current.x * 0.3;
              targetRotationRef.current.x = mouseRef.current.y * 0.2;
              ticking = false;
            });
            ticking = true;
          }
        };

        window.addEventListener("mousemove", handleMouseMove, {
          passive: true,
        });

        // Animation loop for smooth rotation
        const animate = () => {
          if (!mainObject) return;

          const lerpFactor = 0.05;
          currentRotationRef.current.x +=
            (targetRotationRef.current.x - currentRotationRef.current.x) *
            lerpFactor;
          currentRotationRef.current.y +=
            (targetRotationRef.current.y - currentRotationRef.current.y) *
            lerpFactor;

          // Apply rotation only if there's a meaningful change
          const threshold = 0.0001;
          if (
            Math.abs(mainObject.rotation.y - currentRotationRef.current.y) >
              threshold ||
            Math.abs(mainObject.rotation.x - currentRotationRef.current.x) >
              threshold
          ) {
            mainObject.rotation.y = currentRotationRef.current.y;
            mainObject.rotation.x = currentRotationRef.current.x;
          }

          animationFrameRef.current = requestAnimationFrame(animate);
        };

        animate();

        // Cleanup
        return () => {
          window.removeEventListener("mousemove", handleMouseMove);
          if (animationFrameRef.current) {
            cancelAnimationFrame(animationFrameRef.current);
          }
        };
      })
      .catch((error) => {
        console.error("Error loading Spline scene:", error);
        setIsLoading(false);
      });

    // Cleanup on unmount
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (appRef.current) {
        appRef.current.dispose();
      }
    };
  }, [inView]);

  // Handle visibility change to pause/resume animation
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden && animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return (
    <div
      ref={ref}
      className="absolute inset-0 z-0 opacity-60 -translate-y-16 lg:-translate-y-24"
    >
      {isLoading && (
        <div className="absolute inset-0 w-full h-full flex items-center justify-center bg-black/20 z-10">
          <div className="animate-pulse text-zinc-500 text-sm">
            Cargando escena 3D...
          </div>
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
