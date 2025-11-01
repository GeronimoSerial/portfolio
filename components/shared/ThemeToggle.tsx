"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { motion } from "motion/react";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { theme, setTheme, systemTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Evitar renderizado en el servidor
  useEffect(() => {
    setMounted(true);

    // Detectar preferencia de movimiento reducido
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  if (!mounted) {
    return <div className="w-9 h-9" />;
  }

  // Resolver el tema actual (considerar "system")
  const currentTheme = theme === "system" ? systemTheme : theme;

  return (
    <button
      onClick={() => setTheme(currentTheme === "dark" ? "light" : "dark")}
      className="relative p-2 rounded-lg border border-zinc-800 dark:border-zinc-700 
                 bg-white/5 dark:bg-white/5 hover:bg-white/10 dark:hover:bg-white/10 
                 transition-colors"
      aria-label="Toggle theme"
    >
      <motion.div
        initial={false}
        animate={
          prefersReducedMotion
            ? { opacity: 1 }
            : { rotate: currentTheme === "dark" ? 0 : 180 }
        }
        transition={
          prefersReducedMotion
            ? { duration: 0 }
            : { duration: 0.2, ease: "easeInOut" }
        }
      >
        {currentTheme === "dark" ? (
          <Moon className="w-5 h-5 text-zinc-400" />
        ) : (
          <Sun className="w-5 h-5 text-zinc-600" />
        )}
      </motion.div>
    </button>
  );
}
