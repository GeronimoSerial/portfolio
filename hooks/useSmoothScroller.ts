import { useLayoutEffect } from "react";
import { ensureGsapPlugins, gsap, ScrollTrigger } from "@/lib/gsap";
import { ScrollSmoother } from "gsap/ScrollSmoother";

ensureGsapPlugins();
gsap.registerPlugin(ScrollSmoother);

export const useSmoothScroll = () => {
	useLayoutEffect(() => {
		const wrapper = document.querySelector("#smooth-wrapper");
		const content = document.querySelector("#smooth-content");
		if (!wrapper || !content || ScrollSmoother.get()) return;

		const smoother = ScrollSmoother.create({
			wrapper: "#smooth-wrapper",
			content: "#smooth-content",
			smooth: 1.5,
			normalizeScroll: true,
			effects: true,
		});

		return () => {
			smoother.kill();
			ScrollTrigger.refresh();
		};
	}, []);
};
