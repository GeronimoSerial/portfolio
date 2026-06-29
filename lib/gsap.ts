"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";

let pluginsRegistered = false;

/** Register GSAP plugins once — call at the top of any hook that needs them. */
export function ensureGsapPlugins(): void {
	if (typeof window === "undefined" || pluginsRegistered) return;
	gsap.registerPlugin(ScrollTrigger, SplitText);
	pluginsRegistered = true;
}

export { gsap, ScrollTrigger, SplitText };
