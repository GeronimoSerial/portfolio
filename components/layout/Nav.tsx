"use client";

import Link from "next/link";
import { Github } from "lucide-react";
import { ThemeToggle } from "@/components/shared/ThemeToggle";

export default function NavStatic() {
  const navItems = [
    { id: "hero", label: "Home" },
    { id: "services", label: "Services" },
    { id: "projects", label: "Projects" },
    { id: "testimonials", label: "Testimonials" },
    { id: "contact", label: "Contact" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 
                    bg-white/95 dark:bg-zinc-900/95 
                    backdrop-blur-lg 
                    border-b border-zinc-200 dark:border-zinc-800
                    transition-colors duration-300">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <a href="/" className="text-xl font-display 
                               text-zinc-950 dark:text-zinc-50
                               transition-colors">
            geroserial
          </a>

          {/* Desktop Navigation - Sin responsive, siempre visible */}
          <div className="flex items-center gap-1">
            {navItems.slice(1).map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className="px-4 py-2 text-sm font-medium 
                         text-zinc-600 dark:text-zinc-400 
                         hover:text-zinc-900 dark:hover:text-zinc-100 
                         hover:bg-black/5 dark:hover:bg-white/5 
                         rounded-lg transition-colors"
              >
                {item.label}
              </a>
            ))}
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-4">
            <Link
              href="/portfolio"
              className="px-4 py-2 text-sm font-medium 
                       text-zinc-600 dark:text-zinc-400 
                       hover:text-zinc-900 dark:hover:text-zinc-100 
                       hover:bg-black/5 dark:hover:bg-white/5 
                       rounded-lg transition-colors"
            >
              Portfolio
            </Link>
            <ThemeToggle />
            <a
              href="https://github.com/GeronimoSerial"
              target="_blank"
              rel="noopener noreferrer"
              className="text-zinc-600 dark:text-zinc-400 
                       hover:text-zinc-900 dark:hover:text-zinc-100 
                       transition-colors"
              aria-label="GitHub"
            >
              <Github className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}
