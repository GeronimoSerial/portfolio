"use client";

import { useEffect, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import type { Container, ISourceOptions } from "@tsparticles/engine";

interface ParticlesOptimizedProps {
  className?: string;
  quantity?: number;
  staticity?: number;
  ease?: number;
}

export default function ParticlesOptimized({
  className = "",
  quantity = 150,
  staticity = 50,
  ease = 50,
}: ParticlesOptimizedProps) {
  const [init, setInit] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      // Carga versión slim (optimizada, sin features innecesarias)
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  const particlesLoaded = async (container?: Container): Promise<void> => {
    // Callback opcional para debugging
    if (process.env.NODE_ENV === "development") {
      console.log("Particles container loaded", container);
    }
  };

  if (!init) {
    return null; // O un skeleton loader
  }

  // Configuración optimizada que replica el comportamiento original
  const options: ISourceOptions = {
    fullScreen: false,
    background: {
      color: {
        value: "transparent",
      },
    },
    fpsLimit: 60, // Limitar FPS para mejor rendimiento
    interactivity: {
      events: {
        onHover: {
          enable: true,
          mode: "attract", // Efecto magnetismo al mouse
        },
        resize: {
          enable: true,
          delay: 0.5,
        },
      },
      modes: {
        attract: {
          distance: 200,
          duration: 0.4,
          easing: "ease-out-quad",
          factor: staticity / 50, // Usa prop staticity
          maxSpeed: ease,
          speed: 1,
        },
      },
    },
    particles: {
      color: {
        value: "#ffffff", // Grayscale: partículas blancas
      },
      move: {
        enable: true,
        speed: 0.2, // Movimiento muy sutil
        direction: "none",
        random: true,
        straight: false,
        outModes: {
          default: "out", // Regenera partículas que salen del canvas
        },
        attract: {
          enable: true,
          rotateX: 600,
          rotateY: 1200,
        },
      },
      number: {
        value: quantity,
        density: {
          enable: true,
          width: 1920,
          height: 1080,
        },
      },
      opacity: {
        value: {
          min: 0.1,
          max: 0.6,
        },
        animation: {
          enable: true,
          speed: 0.5,
          sync: false,
        },
      },
      shape: {
        type: "circle",
      },
      size: {
        value: {
          min: 0.5,
          max: 2,
        },
      },
    },
    detectRetina: true,
    smooth: true,
    // Optimizaciones de rendimiento
    manualParticles: [],
    pauseOnBlur: true, // Pausa cuando el tab no está activo
    pauseOnOutsideViewport: true, // Pausa cuando no es visible
  };

  return (
    <Particles
      id="tsparticles-optimized"
      className={className}
      particlesLoaded={particlesLoaded}
      options={options}
    />
  );
}
