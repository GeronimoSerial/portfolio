"use client";

import { useState } from "react";
import Link from "next/link";
import { Github, Menu, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { LocaleSwitcher } from "./LocaleSwitcher";
import { SITE_CONFIG } from "@/config/site";

export default function Nav() {
  const t = useTranslations("nav");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { id: "hero", label: t("home") },
    { id: "cases", label: t("cases") },
    { id: "expertise", label: t("expertise") },
    { id: "methodology", label: t("methodology") },
    { id: "impact", label: t("impact") },
    { id: "contact", label: t("contact") },
  ];

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <nav className="sticky top-0 left-0 right-0 z-40 border-b border-border/30 bg-background/80 backdrop-blur-sm h-16">
      <div className="container mx-auto px-4 sm:px-6 h-full">
        <div className="flex items-center justify-between h-full">
          {/* Logo */}
          <Link
            href="/"
            className="text-xl sm:text-2xl font-display font-bold tracking-tight text-foreground hover:text-accent transition-colors"
          >
            geroserial
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navItems.map(({ id, label }) => (
              <button
                key={id}
                onClick={() => scrollToSection(id)}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {label}
              </button>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            <LocaleSwitcher />
            <Link
              href={SITE_CONFIG.links.github}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="GitHub"
            >
              <Github className="w-5 h-5" />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex md:hidden items-center gap-2">
            <LocaleSwitcher />
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-border/30 bg-background/95 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-4 space-y-2">
            {navItems.map(({ id, label }) => (
              <button
                key={id}
                onClick={() => scrollToSection(id)}
                className="block w-full text-left py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                {label}
              </button>
            ))}
            <div className="pt-4 border-t border-border/30">
              <Link
                href={SITE_CONFIG.links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <Github className="w-4 h-4" />
                GitHub
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
