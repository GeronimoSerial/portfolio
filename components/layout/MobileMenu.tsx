"use client";

import Link from "next/link";
import { Github } from "lucide-react";
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
  return (
    <SheetContent
      side="left"
      className="w-[300px] sm:w-[400px] 
                 bg-white dark:bg-zinc-950 
                 border-zinc-200 dark:border-zinc-800 sticky h-dvh"
      onOpenAutoFocus={(e) => {
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

      <div className="flex flex-col py-6 space-y-1">
        {navigationItems.slice(1).map((item) => (
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
      <div className="px-6 pt-2">
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

      <div className="flex items-center justify-center gap-6 px-6 pt-2">
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
