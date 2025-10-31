import { Metadata } from "next";
import Background from "@/components/layout/Background";
import Nav from "@/components/layout/Nav";
import PortfolioHero from "./_components/PortfolioHero";
import AboutExtended from "./_components/AboutExtended";
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
    <div className="relative min-h-screen bg-gradient-to-b from-black via-zinc-950 to-black">
      {/* Background Effects */}
      <Background />

      {/* Navigation */}
      <Nav />

      {/* Page Content */}
      <main className="relative">
        <PortfolioHero />
        <AboutExtended />
        <SkillsComprehensive />
        <ExperienceTimeline />
        <EducationSection />
        <Projects />
        <ResumeDownload />
        <ContactOpportunities />
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-800 py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-zinc-500">
            © {new Date().getFullYear()} Geronimo Serial. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
