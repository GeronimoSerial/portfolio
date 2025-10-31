import Nav from "@/components/layout/Nav";
import Background from "@/components/layout/Background";
import Hero from "./_components/Hero";
import Services from "./_components/Services";
import Process from "./_components/Process";
import Projects from "./_components/Projects";
import Testimonials from "./_components/Testimonials";
import Contact from "./_components/Contact";

export default function Home() {
  return (
    <>
      <Background />
      <Nav />

      <main>
        <Hero />
        <Services />
        <Process />
        <Projects />
        <Testimonials />
        <Contact />
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
