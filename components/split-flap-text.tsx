"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

interface SplitFlapTextProps {
  words: string[];
  duration?: number;
  className?: string;
  cycleDelay?: number;
}

export function SplitFlapText({
  words,
  duration = 0.5,
  cycleDelay = 3000,
  className = "",
}: SplitFlapTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState(words[0]);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    let isMounted = true;

    const cycleText = () => {
      const nextIndex = (currentIndex + 1) % words.length;
      const nextWord = words[nextIndex];
      const currentWord = words[currentIndex];

      // Animate transition
      const tl = gsap.timeline({
        onComplete: () => {
          if (isMounted) {
            setCurrentIndex(nextIndex);
            // Schedule next cycle
            timeoutRef.current = setTimeout(cycleText, cycleDelay);
          }
        },
      });

      // Split text logic
      // We will perform a "scramble" effect where characters change rapidly to the target
      // This mimics a fast-moving mechanic display
      const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*";
      
      const obj = { value: 0 };
      const len = Math.max(currentWord.length, nextWord.length);
      
      tl.to(obj, {
        duration: duration,
        value: 1,
        ease: "power2.inOut",
        onUpdate: () => {
          const progress = obj.value;
          let result = "";
          
          for (let i = 0; i < len; i++) {
            // If before the "wave" of change
            if (i < Math.floor(progress * len)) {
               result += nextWord[i] || "";
            } 
            // If roughly at the wave front, scramble
            else if (i < Math.floor((progress + 0.2) * len)) {
               result += chars[Math.floor(Math.random() * chars.length)];
            }
            // Otherwise show original
            else {
               result += currentWord[i] || "";
            }
          }
          setDisplayedText(result);
        }
      });
    };

    // Initial start delay
    timeoutRef.current = setTimeout(cycleText, cycleDelay);

    return () => {
      isMounted = false;
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      gsap.killTweensOf(containerRef.current);
    };
  }, [currentIndex, words, cycleDelay, duration]);

  return (
    <span ref={containerRef} className={`font-mono inline-block ${className}`}>
      {displayedText}
    </span>
  );
}
