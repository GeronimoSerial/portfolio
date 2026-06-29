"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { ensureGsapPlugins, gsap, SplitText } from "@/lib/gsap";
import { SCROLL, getMotionPrefs } from "@/lib/motion";

ensureGsapPlugins();

export function useContactAnimations() {
	const containerRef = useRef<HTMLElement>(null);

	useGSAP(
		() => {
			const root = containerRef.current;
			if (!root) return;

			const { reduceMotion, isMobile } = getMotionPrefs();
			if (reduceMotion) return;

			let split: SplitText | null = null;
			const titleElement = root.querySelector(".gsap-title");
			if (!titleElement) return;

			split = new SplitText(titleElement, { type: "chars,words" });

			gsap.from(split.chars, {
				autoAlpha: 0,
				y: isMobile ? 16 : 24,
				rotationX: isMobile ? 0 : -18,
				stagger: 0.02,
				duration: isMobile ? 0.45 : 0.55,
				ease: "power2.out",
				scrollTrigger: {
					trigger: titleElement,
					start: SCROLL.header,
					once: true,
				},
			});

			return () => {
				split?.revert();
			};
		},
		{ scope: containerRef, dependencies: [] },
	);

	return containerRef;
}
