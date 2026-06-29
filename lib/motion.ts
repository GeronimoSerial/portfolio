// Centralized motion configuration — single source of truth for the home
// motion pass. Consumed by the Hero animation hook and the mobile branches of
// the section animation hooks so timing/easing/stagger stay consistent.
//
// Principle: expressiveness comes from technique (masked reveals, clip-path
// wipes, directional staggers), not from expensive properties. On mobile we
// animate only transform / opacity / clip-path — never filter: blur.

import { gsap } from "@/lib/gsap";

export const MOBILE_BREAKPOINT = 768;

/** Primary easings used across the home motion pass. */
export const EASE = {
  reveal: "power3.out", // main entrance
  soft: "power2.out", // secondary text / details
  scrub: "none", // scroll-linked (linear feels best under scrub)
} as const;

/** Character-rich easings for accents. */
export const EASE2 = {
  pop: "back.out(1.5)", // icons / badges / cards pop-in
  wipe: "circ.out", // clip-path wipes
  sharp: "expo.out", // headlines (masked reveals)
} as const;

/** Mobile-tuned values: fast but expressive. */
export const MOBILE = {
  duration: { reveal: 0.6, soft: 0.5, wipe: 0.7 },
  y: 28, // enough travel for masked reveals to read
  stagger: 0.07,
} as const;

export interface MotionPrefs {
  reduceMotion: boolean;
  isMobile: boolean;
  canHover: boolean;
}

/** True when the device has a fine pointer and supports real hover (not touch). */
export const HOVER_MEDIA = "(hover: hover) and (pointer: fine)";

/** Shared ScrollTrigger start positions — keeps triggers aligned across sections. */
export const SCROLL = {
  enter: "top 85%",
  header: "top 80%",
  section: "top 90%",
  row: "top 70%",
} as const;

/**
 * Reads the current motion preferences. Must run client-side (inside useGSAP /
 * useEffect). Mirrors the matchMedia pattern already used across the hooks.
 */
export function getMotionPrefs(): MotionPrefs {
  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  const isMobile = window.matchMedia(
    `(max-width: ${MOBILE_BREAKPOINT}px)`,
  ).matches;
  const canHover = window.matchMedia(HOVER_MEDIA).matches;
  return { reduceMotion, isMobile, canHover };
}

/** Clears GSAP inline styles on elements when reduced motion is preferred. */
export function clearMotionProps(
  root: ParentNode,
  selector = "*",
): void {
  gsap.set(root.querySelectorAll(selector), { clearProps: "all" });
}
