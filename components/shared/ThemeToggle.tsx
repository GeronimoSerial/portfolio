"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/app/providers/ThemeProvider";
import { motion } from "motion/react";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Evitar renderizado en el servidor
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="w-9 h-9 rounded-lg border border-zinc-800 bg-white/5" />
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className="relative p-2 rounded-lg border border-zinc-800 dark:border-zinc-700 
                 bg-white/5 dark:bg-white/5 hover:bg-white/10 dark:hover:bg-white/10 
                 transition-colors"
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      aria-pressed={theme === "dark"}
    >
      <motion.div
        initial={false}
        animate={{ rotate: theme === "dark" ? 0 : 180 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        {theme === "dark" ? (
          <Moon className="w-5 h-5 text-zinc-400" />
        ) : (
          <Sun className="w-5 h-5 text-zinc-600" />
        )}
      </motion.div>
    </button>
  );
}
