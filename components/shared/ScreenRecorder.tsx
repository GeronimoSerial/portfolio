"use client";

import { useRef, useEffect, useState } from "react";
import { Application } from "@splinetool/runtime";

export default function SplineAutoRecorder() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const appRef = useRef<Application | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Refs para la grabación
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  // --- 1. Lógica de Grabación Automática ---
  useEffect(() => {
    // Solo iniciamos si ya terminó de cargar la escena y tenemos canvas
    if (!isLoading && canvasRef.current) {
      console.log("🎬 INICIANDO GRABACIÓN (7 segundos)...");

      const canvas = canvasRef.current;

      // Capturamos el stream a 60 FPS
      const stream = canvas.captureStream(60);

      // Preferimos VP9 para mejor calidad, fallback a default si no hay soporte
      let options = { mimeType: "video/webm; codecs=vp9" };
      if (!MediaRecorder.isTypeSupported("video/webm; codecs=vp9")) {
        console.warn("VP9 no soportado, usando codec por defecto");
        options = { mimeType: "video/webm" };
      }

      const recorder = new MediaRecorder(stream, options);
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        console.log("✅ GRABACIÓN FINALIZADA. Descargando...");
        const blob = new Blob(chunksRef.current, { type: "video/webm" });
        const url = URL.createObjectURL(blob);

        // Auto-descarga
        const a = document.createElement("a");
        a.href = url;
        a.download = "spline-fallback-7s.webm";
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);

        chunksRef.current = []; // Limpieza
      };

      // Iniciar
      recorder.start();

      // Programar el corte a los 7 segundos
      setTimeout(() => {
        if (recorder.state === "recording") {
          recorder.stop();
        }
      }, 15000);
    }
  }, [isLoading]); // <--- Se dispara en cuanto isLoading cambia a false

  // --- 2. Carga de Spline (Tu código original simplificado) ---
  useEffect(() => {
    if (!canvasRef.current) return;

    const app = new Application(canvasRef.current);
    appRef.current = app;

    app
      .load("https://prod.spline.design/gh61HwXWODzhB-Id/scene.splinecode")
      .then(() => {
        // Aquí podrías ajustar la resolución si quieres calidad 4K para el video
        // app.setResolution(window.devicePixelRatio);

        // Importante: Damos un pequeño delay de seguridad para asegurar que
        // el primer frame ya se pintó antes de marcar "cargado"
        setTimeout(() => {
          setIsLoading(false); // <--- Esto disparará el useEffect de grabación
        }, 100);

        // Si tienes animación automática en Spline, asegúrate que corra aquí.
      })
      .catch(console.error);

    return () => app.dispose();
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
      {/* Mostrar estado visualmente */}
      {isLoading && (
        <div className="text-white absolute top-10 font-mono">
          Cargando escena...
        </div>
      )}
      {!isLoading && (
        <div className="text-red-500 absolute top-10 font-mono animate-pulse">
          ● GRABANDO (No cierres la pestaña)...
        </div>
      )}

      <canvas
        ref={canvasRef}
        className="w-full h-full"
        // Si quieres fondo transparente en el video, asegúrate que en Spline
        // el background sea transparente. Si no, aquí será negro por el div padre.
      />
    </div>
  );
}
