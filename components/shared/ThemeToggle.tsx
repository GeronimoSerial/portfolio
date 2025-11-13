"use client";

import * as React from "react";
import { SunMoon } from "lucide-react";
import { useTheme } from "next-themes";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const handleThemeSwitch = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  if (!mounted) {
    return null;
  }

  return (
    <button
      onClick={handleThemeSwitch}
      className="gsap-element relative p-2 rounded-lg 
                 bg-white/5 dark:bg-white/5 hover:bg-white/10 dark:hover:bg-white/10"
      aria-label="Toggle theme"
    >
      <div className="gsap-element">
        <SunMoon className="w-5 h-5 text-zinc-400" />
      </div>
    </button>
  );
}
