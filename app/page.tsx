import React from "react";
import BackToTop from "@/components/layout/BackToTop";
import Particles from "@/components/shared/particles";
import Hero from "./sections/Hero";
import About from "./sections/About";
import Skills from "./sections/Skills";
import Experience from "./sections/Experience";
import Projects from "./sections/Projects";
import Testimonials from "./sections/Testimonials";
import Services from "./sections/Services";
import Contact from "./sections/Contact";
import StickyNav from "@/components/navigation/StickyNav";

export default function Home() {
  return (
    <>
      {/* Fixed Background Layer */}
      <Particles
        className="pointer-events-none fixed inset-0 -z-50"
        quantity={150}
      />

      <StickyNav />
      <Hero /> 
      <About />
      <Skills />
      <Experience />
      <Projects />
      <Testimonials />
      <Services />
      <Contact />

      <BackToTop />
    </>
  );
}
