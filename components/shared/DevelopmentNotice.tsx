"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { Construction, X } from "lucide-react";

export function DevelopmentNotice() {
  const [open, setOpen] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  if (!open) return null;

  const dialogContent = (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/90 backdrop-blur-sm"
        style={{
          zIndex: 9998,
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        }}
        onClick={() => setOpen(false)}
      />

      {/* Content */}
      <div
        className="w-full max-w-md rounded-lg border border-zinc-800 bg-zinc-950 p-6 shadow-2xl"
        style={{
          zIndex: 9999,
          position: "fixed",
          transform: "translate(-50%, -50%)",
          top: "50vh",
          left: "50vw",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={() => setOpen(false)}
          className="absolute right-4 top-4 rounded-sm text-zinc-400 opacity-70 transition-opacity hover:text-zinc-50 hover:opacity-100"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>

        {/* Icon */}
        <div className="flex items-center justify-center mb-6">
          <div className="relative">
            <div className="absolute inset-0 bg-white/10 blur-xl rounded-full" />
            <Construction className="h-12 w-12 text-white relative animate-pulse" />
          </div>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-display text-zinc-50 text-center mb-4">
          Site Under Development
        </h2>

        {/* Description */}
        <div className="text-zinc-300 text-center space-y-3">
          <p className="text-base leading-relaxed">
            This portfolio is currently being rebuilt and redesigned.
          </p>
          <p className="text-sm text-zinc-400">
            Some features may not work as expected, and content might appear
            inconsistent. Please check back later for the complete experience.
          </p>
          <p className="text-sm text-zinc-500 italic">
            Thank you for your patience! 🚧
          </p>
        </div>

        {/* Button */}
        <div className="flex justify-center mt-6">
          <button
            onClick={() => setOpen(false)}
            className="px-6 py-2.5 bg-white/5 hover:bg-white/10 border border-zinc-800 hover:border-zinc-700 rounded-lg text-zinc-50 font-medium transition-all duration-200 hover:scale-105 active:scale-95"
          >
            I Understand
          </button>
        </div>
      </div>
    </>
  );

  // Try to render in portal-root first, fallback to document.body
  if (!mounted) return null;

  const portalRoot = document.getElementById("portal-root");
  if (portalRoot) {
    return createPortal(dialogContent, portalRoot);
  }

  return createPortal(dialogContent, document.body);
}
