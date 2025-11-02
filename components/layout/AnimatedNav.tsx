"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { Github, Menu } from "lucide-react";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { NAVIGATION_ITEMS } from "@/config/navigation";
import { SITE_CONFIG } from "@/config/site";
import { useAnimatedNav } from "@/hooks/useAnimatedNav";
import { MobileMenu } from "./MobileMenu";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";

export default function AnimatedNav() {
  const navRef = useRef<HTMLElement>(null!);
  const logoRef = useRef<HTMLAnchorElement>(null!);
  const navItemsRef = useRef<HTMLDivElement>(null!);
  const actionsRef = useRef<HTMLDivElement>(null!);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { isExpanded } = useAnimatedNav(
    navRef,
    logoRef,
    navItemsRef,
    actionsRef
  );

  return (
    <nav
      ref={navRef}
      className="sticky top-0 left-0 right-0 z-50
         
        
        will-change-transform"
      style={{ height: "5rem" }}
    >
      <div className="container mx-auto px-4 sm:px-6 h-full">
        <div className="relative flex items-center justify-between h-full">
          <a
            ref={logoRef}
            href="/"
            className="mr-auto ml-4 md:mr-0 md:ml-0
                         text-xl sm:text-2xl font-display font-bold
                         text-zinc-950 dark:text-zinc-50
                         hover:text-zinc-700 dark:hover:text-zinc-300
                         transition-colors duration-300
                         relative group
                         will-change-transform"
          >
            <span className="relative z-10">geroserial</span>
            <span className="absolute inset-0 bg-gradient-to-r from-zinc-400/20 to-zinc-600/20 dark:from-zinc-500/20 dark:to-zinc-300/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </a>

          {/* Desktop Nav Items */}
          <div ref={navItemsRef} className="hidden md:flex items-center gap-1">
            {NAVIGATION_ITEMS.slice(1).map((item, index) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className="px-4 py-2 text-sm font-medium
                             text-zinc-600 dark:text-zinc-400
                             hover:text-zinc-900 dark:hover:text-zinc-100
                             hover:bg-zinc-100/80 dark:hover:bg-zinc-800/80
                             rounded-lg
                             relative group overflow-hidden
                             will-change-transform"
                style={{
                  animationDelay: `${index * 50}ms`,
                }}
              >
                <span className="relative z-10">{item.label}</span>
                <span className="absolute inset-0 bg-gradient-to-r from-zinc-200 to-zinc-300 dark:from-zinc-700 dark:to-zinc-600 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
              </a>
            ))}
          </div>

          {/* Mobile Menu Trigger */}
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <button
                className="md:hidden p-2 
                text-zinc-600 dark:text-zinc-400
                rounded-lg
                transition-all duration-300
                hover:scale-110 active:scale-95"
                aria-label="Toggle mobile menu"
              >
                <Menu className="w-6 h-6" />
              </button>
            </SheetTrigger>
            <MobileMenu navigationItems={NAVIGATION_ITEMS} />
          </Sheet>

          {/* Desktop Actions */}
          <div ref={actionsRef} className="hidden md:flex items-center gap-3">
            <Link
              href="/portfolio"
              className="px-4 py-2 text-sm font-medium
                bg-zinc-950 dark:bg-zinc-100
                text-zinc-50 dark:text-zinc-950
                hover:bg-zinc-800 dark:hover:bg-zinc-300
                rounded-lg
                shadow-md hover:shadow-xl
                hover:scale-105 active:scale-95
                relative overflow-hidden group
                will-change-transform"
            >
              <span className="relative z-10">Portfolio</span>
              <span className="absolute inset-0 bg-gradient-to-r from-zinc-700 to-zinc-900 dark:from-zinc-300 dark:to-zinc-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Link>

            <ThemeToggle />

            <a
              href={SITE_CONFIG.links.github}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-zinc-600 dark:text-zinc-400
                hover:text-zinc-900 dark:hover:text-zinc-100
                hover:bg-zinc-100 dark:hover:bg-zinc-800
                rounded-lg
                hover:scale-110 active:scale-95
                will-change-transform"
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
