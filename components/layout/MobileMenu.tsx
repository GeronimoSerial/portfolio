"use client";

import Link from "next/link";
import { Github } from "lucide-react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { useRef } from "react";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { SITE_CONFIG } from "@/config/site";
import { NavItem } from "@/config/navigation";
import {
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";

interface MobileMenuProps {
  navigationItems: NavItem[];
}

export function MobileMenu({ navigationItems }: MobileMenuProps) {
  const navLinksRef = useRef(null);
  const ctaRef = useRef(null);
  const actionsRef = useRef(null);
  useGSAP(
    () => {
      if (navLinksRef.current) {
        gsap.fromTo(
          navLinksRef.current,
          { opacity: 0, x: -20 },
          {
            opacity: 1,
            x: 0,
            duration: 0.3,
            stagger: 0.06,
            ease: "power2.out",
            force3D: true,
          }
        );
      }
    },
    { scope: navLinksRef }
  );

  useGSAP(
    () => {
      if (ctaRef.current) {
        gsap.fromTo(
          ctaRef.current,
          { opacity: 0, scale: 0.95 },
          {
            opacity: 1,
            scale: 1,
            delay: 0.3,
            duration: 0.3,
            ease: "power2.out",
            force3D: true,
          }
        );
      }
    },
    { scope: ctaRef }
  );

  useGSAP(
    () => {
      if (actionsRef.current) {
        gsap.fromTo(
          actionsRef.current,
          { opacity: 0 },
          {
            opacity: 1,
            delay: 0.35,
            duration: 0.3,
            ease: "power2.out",
            force3D: true,
          }
        );
      }
    },
    { scope: actionsRef }
  );

  return (
    <SheetContent
      side="left"
      className="w-[300px] sm:w-[400px] 
                 bg-white dark:bg-zinc-950 
                 border-zinc-200 dark:border-zinc-800
                  sticky  h-screen"
      onOpenAutoFocus={(e) => {
        // Prevent auto-focus from scrolling
        e.preventDefault();
      }}
    >
      <SheetHeader className="px-6 pb-4 border-b border-zinc-200 dark:border-zinc-800">
        <SheetTitle className="text-2xl font-display text-zinc-950 dark:text-zinc-50">
          Navigation
        </SheetTitle>
        <SheetDescription className="text-zinc-600 dark:text-zinc-400">
          Explore my work
        </SheetDescription>
      </SheetHeader>

      <div ref={navLinksRef} className="flex flex-col py-6 space-y-1">
        {/* Navigation Links */}
        {navigationItems.slice(1).map((item, index) => (
          <SheetClose key={item.id} asChild>
            <a
              href={`#${item.id}`}
              className="text-lg font-semibold 
                         text-zinc-700 dark:text-zinc-300
                         px-6 py-3
                         transition-colors duration-200
                         border-l-4 border-transparent
                        "
            >
              {item.label}
            </a>
          </SheetClose>
        ))}
      </div>
      {/* Divider */}
      <div className="my-4 mx-6 h-px bg-zinc-200 dark:bg-zinc-800" />

      {/* Portfolio CTA */}
      <div ref={ctaRef} className="px-6 pt-2">
        <SheetClose asChild>
          <Link
            href="/portfolio"
            className="block w-full px-6 py-3 text-center text-base font-bold
                         bg-zinc-950 dark:bg-zinc-100
                         text-zinc-50 dark:text-zinc-950
                         rounded-lg
                         shadow-md 
                         "
          >
            About me
          </Link>
        </SheetClose>
      </div>

      {/* Divider */}
      <div className="my-4 mx-6 h-px bg-zinc-200 dark:bg-zinc-800" />

      {/* Actions (Theme + GitHub) */}
      <div
        ref={actionsRef}
        className="flex items-center justify-center gap-6 px-6 pt-2"
      >
        <ThemeToggle />
        <a
          href={SITE_CONFIG.links.github}
          target="_blank"
          rel="noopener noreferrer"
          className="p-3 
                         text-zinc-600 dark:text-zinc-400
                         rounded-lg
                         transition-all duration-200
                        "
          aria-label="GitHub"
        >
          <Github className="w-6 h-6" />
        </a>
      </div>
    </SheetContent>
  );
}
