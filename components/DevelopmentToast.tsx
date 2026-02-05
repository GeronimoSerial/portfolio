"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { X, AlertTriangle } from "lucide-react";

export default function DevelopmentToast() {
  const t = useTranslations("development");
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has already dismissed the toast
    const hasSeenToast = sessionStorage.getItem("development-toast-seen");
    if (!hasSeenToast) {
      // Small delay for better UX
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleClose = () => {
    setIsVisible(false);
    sessionStorage.setItem("development-toast-seen", "true");
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center animate-in fade-in duration-300">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      
      {/* Toast */}
      <div className="relative max-w-md bg-zinc-900 border border-zinc-700 backdrop-blur-md rounded-xl p-6 shadow-2xl mx-4">
        {/* Close button */}
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-3 right-3 p-1.5 rounded-full hover:bg-zinc-800 transition-colors group"
          aria-label={t("close")}
        >
          <X className="w-5 h-5 text-zinc-500 group-hover:text-zinc-300 transition-colors" />
        </button>

        {/* Content */}
        <div className="flex items-start gap-4 pr-8">
          <div className="flex-shrink-0">
            <AlertTriangle className="w-6 h-6 text-zinc-400" />
          </div>
          <div>
            <h3 className="font-semibold text-zinc-200 text-base mb-2">
              {t("title")}
            </h3>
            <p className="text-zinc-400 text-sm leading-relaxed">
              {t("description")}
            </p>
          </div>
        </div>

        {/* Close button at bottom */}
        <div className="mt-5 flex justify-end">
          <button
            type="button"
            onClick={handleClose}
            className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-sm font-medium rounded-lg transition-colors"
          >
            {t("close")}
          </button>
        </div>

        {/* Signature */}
        <div className="mt-4 pt-3 border-t border-zinc-800 text-center">
          <span className="text-xs text-zinc-600 font-mono tracking-wide">
            built by: geroserial.com
          </span>
        </div>
      </div>
    </div>
  );
}
