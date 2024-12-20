"use client";

import { useEffect, useRef } from "react";

export const DynamicTitle = () => {
  const originalTitle = useRef("");

  useEffect(() => {
    const updateOriginalTitle = () => {
      if (!document.hidden) {
        originalTitle.current = document.title;
      }
    };

    const handleVisibilityChange = () => {
      if (document.hidden) {
        document.title = "Ey, Volvé!";
      } else {
        document.title = originalTitle.current;
      }
    };

    // Actualizar el título inicial al cargar
    updateOriginalTitle();

    // Detectar cambios de visibilidad
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Detectar cambios en el título controlados por React
    const observer = setInterval(updateOriginalTitle, 500);

    return () => {
      clearInterval(observer); // Detener el intervalo
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return null;
};
