import { useLayoutEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollSmoother } from "gsap/ScrollSmoother";

gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

export const useSmoothScroll = () => {
  useLayoutEffect(() => {
    if (!ScrollSmoother.get()) {
      ScrollSmoother.create({
        wrapper: "#smooth-wrapper", // usa IDs, no clases
        content: "#smooth-content",
        smooth: 1.5,
        normalizeScroll: true,
        effects: true,
      });
    }
  }, []);
};
