"use client";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useRef, useLayoutEffect } from "react";

// Registrar plugins
gsap.registerPlugin(ScrollTrigger);

/**
 * Hook master para todas las animaciones - Solo GSAP
 * Elimina conflictos con CSS transitions y garantiza performance óptimo
 */
export const useGSAPOnly = () => {
	// Configuración global optimizada
	useLayoutEffect(() => {
		gsap.config({
			force3D: true,
			nullTargetWarn: false,
		});

		// Set GPU properties en todos los elementos animados
		gsap.set(".gsap-element", {
			force3D: true,
			transformStyle: "preserve-3d",
		});
	}, []);

	return {
		// Animación de entrada básica
		fadeIn: (target: string | Element, options = {}) => {
			const { delay = 0, duration = 0.6, y = 30 } = options as any;

			return gsap.fromTo(
				target,
				{
					opacity: 0,
					y,
					force3D: true,
				},
				{
					opacity: 1,
					y: 0,
					delay,
					duration,
					ease: "power2.out",
				},
			);
		},

		// Animación escalonada
		stagger: (targets: string | Element[], options = {}) => {
			const { delay = 0.1, duration = 0.5, scale = 0.95 } = options as any;

			return gsap.fromTo(
				targets,
				{
					opacity: 0,
					scale,
					force3D: true,
				},
				{
					opacity: 1,
					scale: 1,
					stagger: delay,
					duration,
					ease: "power2.out",
				},
			);
		},

		// Entrada heroica compleja
		heroEntrance: (container: Element) => {
			const tl = gsap.timeline({ delay: 0.5 });

			return tl
				.fromTo(
					".hero-title",
					{
						opacity: 0,
						y: 120,
						rotationX: 90,
						transformOrigin: "50% 0%",
						force3D: true,
					},
					{
						opacity: 1,
						y: 0,
						rotationX: 0,
						duration: 1.2,
						ease: "power3.out",
					},
				)
				.fromTo(
					".hero-subtitle",
					{
						opacity: 0,
						y: 60,
						scale: 0.9,
						force3D: true,
					},
					{
						opacity: 1,
						y: 0,
						scale: 1,
						duration: 0.8,
						stagger: 0.15,
						ease: "power2.out",
					},
					"-=0.6",
				)
				.fromTo(
					".hero-details",
					{
						opacity: 0,
						y: 40,
						force3D: true,
					},
					{
						opacity: 1,
						y: 0,
						duration: 0.6,
						stagger: 0.1,
						ease: "power2.out",
					},
					"-=0.4",
				)
				.fromTo(
					".hero-buttons",
					{
						opacity: 0,
						y: 60,
						scale: 0.8,
						force3D: true,
					},
					{
						opacity: 1,
						y: 0,
						scale: 1,
						duration: 0.7,
						ease: "back.out(1.7)",
					},
					"-=0.3",
				);
		},

		// Parallax de scroll
		parallaxScroll: (target: string | Element, options = {}) => {
			const {
				yPercent = -30,
				trigger,
				start = "top top",
				end = "bottom top",
			} = options as any;

			return gsap.to(target, {
				yPercent,
				ease: "none",
				scrollTrigger: {
					trigger,
					start,
					end,
					scrub: 1,
					refreshPriority: -1,
				},
			});
		},

		// Fade out en scroll
		fadeOnScroll: (target: string | Element, options = {}) => {
			const {
				opacity = 0.3,
				trigger,
				start = "top top",
				end = "bottom top",
			} = options as any;

			return gsap.to(target, {
				opacity,
				ease: "none",
				scrollTrigger: {
					trigger,
					start,
					end,
					scrub: 1,
				},
			});
		},

		// Theme switching suave
		themeSwitch: (callback: () => void) => {
			return gsap.to(document.body, {
				opacity: 0.98,
				duration: 0.1,
				ease: "power2.inOut",
				onComplete: () => {
					callback();
					gsap.to(document.body, {
						opacity: 1,
						duration: 0.1,
						ease: "power2.inOut",
					});
				},
			});
		},

		// Rotación de iconos
		rotateIcon: (target: string | Element, rotation: number) => {
			return gsap.to(target, {
				rotation,
				duration: 0.3,
				ease: "power2.inOut",
			});
		},

		// Cleanup de ScrollTriggers
		cleanup: () => {
			ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
		},
	};
};

/**
 * Hook simplificado para componentes que solo necesitan animaciones básicas
 */
export const useGSAPSimple = () => {
	const { fadeIn, stagger } = useGSAPOnly();
	return { fadeIn, stagger };
};

/**
 * Hook para componentes con scroll triggers
 */
export const useGSAPScroll = () => {
	const { parallaxScroll, fadeOnScroll, cleanup } = useGSAPOnly();

	useLayoutEffect(() => {
		return cleanup; // Cleanup automático
	}, [cleanup]);

	return { parallaxScroll, fadeOnScroll };
};
