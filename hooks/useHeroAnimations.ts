"use client";

import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import { ensureGsapPlugins, gsap, SplitText } from "@/lib/gsap";
import { EASE, EASE2, MOBILE, getMotionPrefs } from "@/lib/motion";

ensureGsapPlugins();

/**
 * Cinematic entrance + scroll-linked exit for the Hero content block.
 *
 * Entrance: masked word reveal on the title, the divider draws in (scaleX),
 * the rest cascades up, and the scroll-down arrow gets a looping hint.
 * Exit: as the hero scrolls away, the text block fades and recedes (scale)
 * to create continuity toward the next section. Only transform/opacity — no
 * blur, no background parallax. Honors prefers-reduced-motion.
 *
 * Returns a ref for the hero content wrapper and `entranceComplete` so heavy
 * background work (3D scene, CPU benchmark) can wait until text has priority.
 */
export function useHeroAnimations() {
	const contentRef = useRef<HTMLDivElement>(null);
	const [entranceComplete, setEntranceComplete] = useState(false);

	useGSAP(
		() => {
			const root = contentRef.current;
			if (!root) return;

			const { reduceMotion, isMobile } = getMotionPrefs();
			if (reduceMotion) {
				setEntranceComplete(true);
				return;
			}

			const q = gsap.utils.selector(root);
			const titleEl = root.querySelector<HTMLElement>(".hero-title");
			const divider = q(".hero-divider");
			const midtitle = q(".hero-midtitle");
			const blocks = q(".hero-reveal");
			const ctas = q(".hero-cta");
			const arrow = root.querySelector<HTMLElement>(".hero-arrow");

			const y = isMobile ? MOBILE.y : 32;
			const dur = isMobile ? MOBILE.duration.reveal : 0.7;

			let split: SplitText | null = null;

			const tl = gsap.timeline({
				defaults: { ease: EASE.reveal },
			});

			if (titleEl) {
				split = new SplitText(titleEl, { type: "words", mask: "words" });
				gsap.set(titleEl, { autoAlpha: 1 });
				tl.from(split.words, {
					yPercent: 115,
					rotate: 2,
					duration: isMobile ? 0.7 : 0.85,
					ease: EASE2.sharp,
					stagger: 0.06,
				});
			}

			if (divider.length) {
				tl.from(
					divider,
					{ scaleX: 0, transformOrigin: "left center", duration: dur },
					"-=0.4",
				);
			}

			if (midtitle.length) {
				tl.from(midtitle, { autoAlpha: 0, y: y * 0.6, duration: dur }, "<");
			}
			if (blocks.length) {
				tl.from(
					blocks,
					{ autoAlpha: 0, y, duration: dur, stagger: MOBILE.stagger },
					"-=0.3",
				);
			}

			if (ctas.length) {
				// Opacity + y only — no scale. clearProps must include transform so
				// CSS :active / hover transforms on the buttons are not blocked.
				tl.from(
					ctas,
					{
						opacity: 0,
						y: y * 0.7,
						duration: dur,
						ease: EASE2.pop,
						stagger: 0.08,
						clearProps: "transform",
					},
					"-=0.25",
				);
			}

			if (arrow) {
				tl.add(() => {
					arrow.classList.add("hero-arrow-hint");
				}, ">");
			}

			tl.eventCallback("onComplete", () => {
				setEntranceComplete(true);
			});

			const stopHint = () => {
				arrow?.classList.remove("hero-arrow-hint");
				window.removeEventListener("scroll", stopHint);
			};
			window.addEventListener("scroll", stopHint, { passive: true });

			const section = root.closest("section");
			gsap.to(root, {
				autoAlpha: 0,
				y: isMobile ? -36 : -64,
				scale: 0.97,
				ease: EASE.scrub,
				scrollTrigger: {
					trigger: section ?? root,
					start: "top top",
					end: "bottom 35%",
					scrub: true,
				},
			});

			return () => {
				window.removeEventListener("scroll", stopHint);
				arrow?.classList.remove("hero-arrow-hint");
				tl.kill();
				split?.revert();
			};
		},
		{ scope: contentRef, dependencies: [] },
	);

	return { contentRef, entranceComplete };
}
