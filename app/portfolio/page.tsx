import { Metadata } from "next";
import { Background } from "@/components/layout/Background";
import Nav from "@/components/layout/Nav";
import PortfolioHero from "./_components/PortfolioHero";
import About from "./_components/About";
import SkillsComprehensive from "./_components/SkillsComprehensive";
import ExperienceTimeline from "./_components/ExperienceTimeline";
import EducationSection from "./_components/EducationSection";
import Projects from "../_components/Projects";
import ResumeDownload from "./_components/ResumeDownload";
import ContactOpportunities from "./_components/ContactOpportunities";

export const metadata: Metadata = {
  title: "Portfolio | Geronimo Serial",
  description:
    "Complete portfolio and resume for Geronimo Serial - Full-stack Developer & Technical Consultant specializing in Next.js, React, and modern web technologies.",
  openGraph: {
    title: "Portfolio | Geronimo Serial",
    description:
      "Complete portfolio and resume for Geronimo Serial - Full-stack Developer & Technical Consultant",
    type: "profile",
  },
};

export default function PortfolioPage() {
  return (
    <>
      <main className="relative">
        <Background>
          <About />
          <SkillsComprehensive />
          <ExperienceTimeline />
          <EducationSection />
          <Projects />
          <ResumeDownload />
          <ContactOpportunities />
        </Background>
      </main>

      <footer
        className="border-t 
        border-zinc-200 dark:border-zinc-800 
        py-8 gsap-element"
      >
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-zinc-500 dark:text-zinc-500 gsap-element">
            © {new Date().getFullYear()} Geronimo Serial.
          </p>
        </div>
      </footer>
    </>
  );
}
