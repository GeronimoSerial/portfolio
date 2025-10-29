import React from "react";
import StickyNav from "@/components/navigation/StickyNav";
import ScrollProgress from "@/components/layout/ScrollProgress";
import BackToTop from "@/components/layout/BackToTop";
import Hero from "./sections/Hero";
import About from "./sections/About";
import Skills from "./sections/Skills";
import Experience from "./sections/Experience";
import Projects from "./sections/Projects";
import Testimonials from "./sections/Testimonials";
import Services from "./sections/Services";
import Contact from "./sections/Contact";

export default function Home() {
  return (
    <>
      <ScrollProgress />
      <StickyNav />
      
      <main className="relative">
        <Hero />
        <About />
        <Skills />
        <Experience />
        <Projects />
        <Testimonials />
        <Services />
        <Contact />
      </main>

      <BackToTop />
    </>
  );
}
