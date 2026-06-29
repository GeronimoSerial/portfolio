"use client";
// Performance-Optimized Version
import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";

if (typeof window !== "undefined") {
	gsap.registerPlugin(ScrollTrigger, SplitText);
	// Set global defaults for optimal performance
	gsap.defaults({ lazy: false });
}

export function useContactAnimations() {
	const containerRef = useRef<HTMLElement>(null);

	useGSAP(
		() => {
			if (!containerRef.current) return;
			if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
				return;
			}

			let split: SplitText | null = null;
			// ============================================
			// TITLE CHARACTER REVEAL - "Let's Collaborate"
			// ============================================
			const titleElement = containerRef.current.querySelector(".gsap-title");
			if (titleElement) {
				split = new SplitText(titleElement, { type: "chars,words" });

				gsap.from(split.chars, {
					opacity: 0,
					y: 24,
					rotationX: -18,
					stagger: 0.02,
					duration: 0.55,
					ease: "power2.out",
					scrollTrigger: {
						trigger: titleElement,
						start: "top 75%",
						toggleActions: "play none none reset",
					},
				});
			}

			ScrollTrigger.refresh();

			return () => {
				split?.revert();
			};
		},
		{ scope: containerRef, dependencies: [] }
	);

	return containerRef;
}
