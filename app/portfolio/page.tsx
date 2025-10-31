import { Metadata } from "next";
import Particles from "@/components/shared/particles";
import PortfolioNav from "@/components/navigation/PortfolioNav";
import PortfolioHero from "./_components/PortfolioHero";
import AboutExtended from "./_components/AboutExtended";
import SkillsComprehensive from "./_components/SkillsComprehensive";
import ExperienceTimeline from "./_components/ExperienceTimeline";
import EducationSection from "./_components/EducationSection";
import ProjectsShowcase from "./_components/ProjectsShowcase";
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
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-zinc-900 via-zinc-950 to-black" />
        <Particles
          className="absolute inset-0"
          quantity={150}
          staticity={30}
          ease={50}
        />
      </div>

      {/* Navigation */}
      <PortfolioNav />

      {/* Page Content */}
      <main className="relative">
        {/* Hero Section */}
        <PortfolioHero />

        {/* About Section */}
        <AboutExtended />

        {/* Skills Section */}
        <SkillsComprehensive />

        {/* Experience Section */}
        <ExperienceTimeline />

        {/* Education Section */}
        <EducationSection />

        {/* Projects Section */}
        <ProjectsShowcase />

        {/* Resume Download */}
        <ResumeDownload />

        {/* Contact Section */}
        <ContactOpportunities />
      </main>
    </div>
  );
}
