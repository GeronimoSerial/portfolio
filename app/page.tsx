import React from "react";
import BackToTop from "@/components/layout/BackToTop";
import ParticlesOptimized from "@/components/shared/ParticlesOptimized";
import Hero from "@/components/sections/Hero";
import Services from "@/components/sections/Services";
import Process from "@/components/sections/Process";
import Projects from "@/components/sections/Projects";
import Testimonials from "@/components/sections/Testimonials";
import Contact from "@/components/sections/Contact";
import StickyNav from "@/components/navigation/StickyNav";

export default function Home() {
  return (
    <>
      {/* Fixed Background Layer */}
      <ParticlesOptimized
        className="pointer-events-none fixed inset-0 -z-50"
        quantity={150}
      />

      <StickyNav />
      <Hero />
      <Services />
      <Process />
      <Projects />
      <Testimonials />
      <Contact />

      <BackToTop />
    </>
  );
}
