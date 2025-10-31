"use client";

import Link from "next/link";
import { ArrowLeft, Download } from "lucide-react";

export default function PortfolioNav() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-zinc-800 bg-zinc-900/80 backdrop-blur-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="text-zinc-50 font-display text-xl">
            geroserial.com
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <a
              href="#about"
              className="text-sm text-zinc-400 hover:text-zinc-100 transition-colors"
            >
              About
            </a>
            <a
              href="#skills"
              className="text-sm text-zinc-400 hover:text-zinc-100 transition-colors"
            >
              Skills
            </a>
            <a
              href="#experience"
              className="text-sm text-zinc-400 hover:text-zinc-100 transition-colors"
            >
              Experience
            </a>
            <a
              href="#education"
              className="text-sm text-zinc-400 hover:text-zinc-100 transition-colors"
            >
              Education
            </a>
            <a
              href="#projects"
              className="text-sm text-zinc-400 hover:text-zinc-100 transition-colors"
            >
              Projects
            </a>

            <a
              href="#resume"
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-zinc-300 bg-white/5 border border-zinc-800 rounded-lg hover:bg-white/10 hover:border-zinc-500 transition-all"
            >
              <Download className="w-4 h-4" />
              Resume
            </a>

            <Link
              href="/"
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-black bg-white rounded-lg hover:bg-zinc-100 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Main Site
            </Link>
          </div>

          {/* Mobile menu - simplified */}
          <Link
            href="/"
            className="md:hidden flex items-center gap-2 px-3 py-2 text-sm font-medium text-black bg-white rounded-lg"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Link>
        </div>
      </div>
    </nav>
  );
}
