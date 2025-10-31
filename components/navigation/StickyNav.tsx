"use client";

import { useState, useEffect } from "react";
import { useScrollSpy } from "@/hooks/useScrollSpy";
import { useScrollTo } from "@/hooks/useScrollTo";
import { Menu, X, Github } from "lucide-react";

export default function StickyNav() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const sections = [
    "hero",
    "services",
    "process",
    "projects",
    "testimonials",
    "contact",
  ];

  const navItems = [
    { id: "hero", label: "Home" },
    { id: "services", label: "Services" },
    { id: "process", label: "Process" },
    { id: "projects", label: "Projects" },
    { id: "testimonials", label: "Testimonials" },
    { id: "contact", label: "Contact" },
  ];

  const activeSection = useScrollSpy(sections);
  const { scrollToSection } = useScrollTo();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (sectionId: string) => {
    scrollToSection(sectionId);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? "bg-zinc-900/80 backdrop-blur-lg border-b border-zinc-800"
            : "bg-transparent"
        }`}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <button
              onClick={() => handleNavClick("hero")}
              className="text-xl font-display text-zinc-50 hover:text-white transition-colors"
            >
              geroserial
            </button>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-1">
              {navItems.slice(1).map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                    activeSection === item.id
                      ? "text-white bg-white/10"
                      : "text-zinc-400 hover:text-zinc-100 hover:bg-white/5"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* Right Side */}
            <div className="flex items-center gap-4">
              <a
                href="/portfolio"
                className="hidden md:block px-4 py-2 text-sm font-medium text-zinc-400 hover:text-zinc-100 hover:bg-white/5 rounded-lg transition-all duration-200"
              >
                Portfolio
              </a>
              <a
                href="https://github.com/GeronimoSerial"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden md:block text-zinc-400 hover:text-zinc-100 transition-colors"
                aria-label="GitHub"
              >
                <Github className="w-5 h-5" />
              </a>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden text-zinc-400 hover:text-zinc-100 transition-colors"
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
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 md:hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Menu */}
          <div className="absolute top-16 left-0 right-0 bg-zinc-900/95 backdrop-blur-lg border-b border-zinc-800 p-4">
            <div className="flex flex-col gap-2">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`px-4 py-3 text-left text-sm font-medium rounded-lg transition-all duration-200 ${
                    activeSection === item.id
                      ? "text-white bg-white/10"
                      : "text-zinc-400 hover:text-zinc-100 hover:bg-white/5"
                  }`}
                >
                  {item.label}
                </button>
              ))}

              <div className="border-t border-zinc-800 my-2" />

              <a
                href="/portfolio"
                className="px-4 py-3 text-sm font-medium text-zinc-400 hover:text-zinc-100 hover:bg-white/5 rounded-lg transition-all duration-200"
              >
                Portfolio
              </a>

              <a
                href="https://github.com/GeronimoSerial"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-zinc-400 hover:text-zinc-100 hover:bg-white/5 rounded-lg transition-all duration-200"
              >
                <Github className="w-5 h-5" />
                GitHub
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
