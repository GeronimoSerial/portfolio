"use client";

import { motion, AnimatePresence } from "motion/react";
import { ArrowUp } from "lucide-react";
import { useScroll } from "@/context/ScrollContext";

export default function BackToTop() {
  const { showBackToTop } = useScroll();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <AnimatePresence>
      {showBackToTop && (
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-40 p-3 bg-white text-black rounded-full shadow-lg hover:bg-zinc-100 transition-colors duration-200"
          aria-label="Volver arriba"
        >
          <ArrowUp className="w-5 h-5" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
