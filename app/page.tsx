import NavStatic from "@/components/NavStatic";
import BackgroundStatic from "@/components/BackgroundStatic";
import HeroStatic from "./static-sections/HeroStatic";
import ServicesStatic from "./static-sections/ServicesStatic";
import ProcessStatic from "./static-sections/ProcessStatic";
import ProjectsStatic from "./static-sections/ProjectsStatic";
import TestimonialsStatic from "./static-sections/TestimonialsStatic";
import ContactStatic from "./static-sections/ContactStatic";

export default function Home() {
  return (
    <>
      <BackgroundStatic />
      <NavStatic />

      <main>
        <HeroStatic />
        <ServicesStatic />
        <ProcessStatic />
        <ProjectsStatic />
        <TestimonialsStatic />
        <ContactStatic />
      </main>

      {/* Footer simple */}
      <footer className="border-t border-zinc-800 py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-zinc-500">
            © {new Date().getFullYear()} geroserial.com. All rights reserved.
          </p>
        </div>
      </footer>
    </>
  );
}
