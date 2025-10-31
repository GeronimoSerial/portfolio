import { Metadata } from "next";
import BackgroundStatic from "@/components/BackgroundStatic";
import NavStatic from "@/components/NavStatic";
import PortfolioHeroStatic from "./static-sections/PortfolioHeroStatic";
import AboutExtendedStatic from "./static-sections/AboutExtendedStatic";
import SkillsComprehensiveStatic from "./static-sections/SkillsComprehensiveStatic";
import ExperienceTimelineStatic from "./static-sections/ExperienceTimelineStatic";
import EducationSectionStatic from "./static-sections/EducationSectionStatic";
import ProjectsStatic from "../static-sections/ProjectsStatic";
import ResumeDownloadStatic from "./static-sections/ResumeDownloadStatic";
import ContactOpportunitiesStatic from "./static-sections/ContactOpportunitiesStatic";

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
      <BackgroundStatic />

      {/* Navigation */}
      <NavStatic />

      {/* Page Content */}
      <main className="relative">
        <PortfolioHeroStatic />
        <AboutExtendedStatic />
        <SkillsComprehensiveStatic />
        <ExperienceTimelineStatic />
        <EducationSectionStatic />
        <ProjectsStatic />
        <ResumeDownloadStatic />
        <ContactOpportunitiesStatic />
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
