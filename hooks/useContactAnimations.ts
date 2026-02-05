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

			let split: SplitText | null = null;
			// ============================================
			// TITLE CHARACTER REVEAL - "Let's Collaborate"
			// ============================================
			const titleElement = containerRef.current.querySelector(".gsap-title");
			if (titleElement) {
				split = new SplitText(titleElement, { type: "chars,words" });

				gsap.from(split.chars, {
					opacity: 0,
					y: 50,
					rotationX: -90,
					stagger: 0.03,
					duration: 0.8,
					ease: "back.out(1.7)",
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
