"use client";
import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef } from "react";

gsap.registerPlugin(ScrollTrigger);

export const useServicesAnimations = () => {
	const containerRef = useRef<HTMLElement>(null);
	const headerRef = useRef<HTMLDivElement>(null);

	useGSAP(
		() => {
			if (!containerRef.current) return;

			gsap.config({ force3D: true });

			const mm = gsap.matchMedia();

			mm.add(
				{
					isMobile: "(max-width: 768px)",
					isDesktop: "(min-width: 769px)",
				},
				(context) => {
					// ============================================
					// 1. ANIMACIÓN DEL HEADER
					// ============================================
					if (headerRef.current) {
						const headline = headerRef.current.querySelector("h2");
						const subtitle = headerRef.current.querySelector("p");

						gsap.set([headline, subtitle], {
							opacity: 0,
							y: 50,
						});

						ScrollTrigger.create({
							trigger: headerRef.current,
							start: "top 85%",
							onEnter: () => {
								gsap.to(headline, {
									opacity: 1,
									y: 0,
									duration: 1,
									ease: "power3.out",
								});
								gsap.to(subtitle, {
									opacity: 1,
									y: 0,
									duration: 1,
									delay: 0.2,
									ease: "power3.out",
								});
							},
							once: true,
						});
					}

					// ============================================
					// 2. ANIMACIÓN DE LAS TARJETAS DE SERVICIO
					// ============================================
					const cards = gsap.utils.toArray<HTMLElement>(".service-card");

					cards.forEach((card) => {
						const border = card.querySelector(".card-border-svg rect");
						const iconContainer = card.querySelector(".icon-container");
						const title = card.querySelector("h3");
						const description = card.querySelector("p");
						const features = gsap.utils.toArray<HTMLElement>(
							card.querySelectorAll(".feature-item"),
						);
						const footer = card.querySelector(".service-footer");

						gsap.set(card, { opacity: 0, y: 50 });
						if (border) {
							const length = (border as SVGPathElement).getTotalLength();
							gsap.set(border, {
								strokeDasharray: length,
								strokeDashoffset: length,
							});
						}
						gsap.set(iconContainer, { scale: 0, opacity: 0 });
						gsap.set([title, description], { opacity: 0, x: -30 });
						gsap.set(features, { opacity: 0, y: 20 });
						gsap.set(footer, { opacity: 0 });

						ScrollTrigger.create({
							trigger: card,
							start: "top 85%",
							once: true,
							onEnter: () => {
								const tl = gsap.timeline();

								tl.to(card, {
									opacity: 1,
									y: 0,
									duration: 0.8,
									ease: "power2.out",
								})
									.to(
										border,
										{
											strokeDashoffset: 0,
											duration: 1.2, // Faster duration
											ease: "circ.out", // Snappier ease
										},
										"-=0.6", // Overlap more
									)
									.to(
										iconContainer,
										{
											scale: 1,
											opacity: 1,
											duration: 0.8,
											ease: "back.out(1.7)",
										},
										"-=1.0", // Adjust timing
									)
									.to(
										[title, description],
										{
											opacity: 1,
											x: 0,
											duration: 0.7,
											stagger: 0.1,
											ease: "power2.out",
										},
										"-=0.8",
									)
									.to(
										features,
										{
											opacity: 1,
											y: 0,
											duration: 0.5,
											stagger: 0.08,
											ease: "power2.out",
										},
										"-=0.5",
									)
									.to(
										footer,
										{
											opacity: 1,
											duration: 0.6,
											ease: "power2.out",
										},
										"-=0.3",
									);
							},
						});
					});
				},
			);

			// Cleanup
			return () => {
				mm.revert();
				ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
			};
		},
		{ scope: containerRef },
	);

	return {
		containerRef,
		headerRef,
	};
};
