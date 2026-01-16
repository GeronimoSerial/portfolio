"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Github, Menu } from "lucide-react";
import { useTranslations } from "next-intl";
import { LocaleSwitcher } from "./LocaleSwitcher";
import { SITE_CONFIG } from "@/config/site";
import { useAnimatedNav } from "@/hooks/useAnimatedNav";
import { MobileMenu } from "./MobileMenu";
import { Sheet, SheetTrigger } from "@/components/ui/sheet";

export default function AnimatedNav() {
  const t = useTranslations("nav");
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
  const router = useRouter();

  const navItems = [
    { id: "cases", label: t("cases") },
    { id: "expertise", label: t("expertise") },
    { id: "methodology", label: t("methodology") },
    { id: "impact", label: t("impact") },
    { id: "contact", label: t("contact") },
  ];
  return (
    <nav
      ref={navRef}
      className="sticky top-0 left-0 right-0 z-40 will-change-transform border-b border-border/30 bg-background/80 backdrop-blur-sm md:pl-20"
      style={{ height: "5rem" }}
    >
      <div className="container mx-auto px-4 sm:px-6 h-full">
        <div className="relative flex items-center justify-between h-full">
          <Link
            ref={logoRef}
            href="/"
            className="mr-auto ml-4 md:mr-0 md:ml-0
                         text-xl sm:text-2xl font-display font-bold tracking-tight
                         text-foreground
                         hover:text-accent
                         transition-colors duration-300
                         relative group
                         will-change-transform"
          >
            <span className="relative z-10">geroserial</span>
          </Link>

          {/* Desktop Nav Items - HIDDEN as we use SideNav */}
          <div ref={navItemsRef} className="hidden md:flex items-center gap-1">
             {/* Empty by design */}
          </div>

          {/* Mobile Actions */}
          <div className="flex md:hidden items-center gap-2">
            <LocaleSwitcher />

            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <button
                  className="p-2
                  text-muted-foreground
                  rounded-none
                  transition-all duration-300
                  hover:text-foreground active:scale-95"
                  aria-label="Toggle mobile menu"
                >
                  <Menu className="w-6 h-6" />
                </button>
              </SheetTrigger>
              <MobileMenu
                navigationItems={[
                  { id: "hero", label: t("home") },
                  ...navItems,
                ]}
              />
            </Sheet>
          </div>

          {/* Desktop Actions */}
          <div ref={actionsRef} className="hidden md:flex items-center gap-3">
            <LocaleSwitcher />

            <Link
              href={SITE_CONFIG.links.github}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-muted-foreground
                hover:text-foreground
                hover:bg-zinc-800
                rounded-none
                transition-colors
                will-change-transform"
              aria-label="GitHub"
            >
              <Github className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
