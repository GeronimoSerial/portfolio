import { Metadata } from "next";
import { PortfolioBackground as Background } from "@/components/layout/PortfolioBackground";
import PortfolioHero from "./_components/PortfolioHero";
import ArchitectureDevOps from "./_components/ArchitectureDevOps";
import APIsIntegrations from "./_components/APIsIntegrations";
import DataPerformance from "./_components/DataPerformance";
import SoftwareArchitecture from "./_components/SoftwareArchitecture";
import ExperienceTimeline from "./_components/ExperienceTimeline";
import EducationSection from "./_components/EducationSection";
import Projects from "../_components/FeaturedProjects";
import ResumeDownload from "./_components/ResumeDownload";
import ContactOpportunities from "./_components/ContactOpportunities";
import { getProjects } from "@/lib/get-projects";
import { cookies } from "next/headers";
import { defaultLocale, locales } from "@/lib/i18n/config";

import { AppleStyleSection } from "./_components/ui/AppleStyleSection";

async function getLocale() {
  const cookieStore = await cookies();
  const localeCookie = cookieStore.get("NEXT_LOCALE")?.value;
  return locales.includes(localeCookie as any) ? localeCookie : defaultLocale;
}

export const metadata: Metadata = {
  title: "Portfolio | Geronimo Serial",
  description:
    "Full Stack Developer specialized in Infrastructure, System Architecture, and DevOps. Expert in Next.js, PostgreSQL, CI/CD, and API Design.",
  openGraph: {
    title: "Portfolio | Geronimo Serial",
    description: "Full Stack Developer | Infrastructure & System Architecture",
    type: "profile",
  },
};

export default async function PortfolioPage() {
  const locale = await getLocale();
  const projects = await getProjects(locale);

  return (
    <div className="dark contents">
      <main className="relative">
        <Background>
          <AppleStyleSection>
            <PortfolioHero />
          </AppleStyleSection>

          <AppleStyleSection>
            <ExperienceTimeline />
          </AppleStyleSection>

          <Projects projectsData={projects} maxWidth="6xl" />

          <AppleStyleSection>
            <ArchitectureDevOps />
          </AppleStyleSection>

          <AppleStyleSection>
            <APIsIntegrations />
          </AppleStyleSection>

          <AppleStyleSection>
            <DataPerformance />
          </AppleStyleSection>

          <AppleStyleSection>
            <SoftwareArchitecture />
          </AppleStyleSection>

          <AppleStyleSection>
            <EducationSection />
          </AppleStyleSection>

          <AppleStyleSection>
            <ContactOpportunities />
          </AppleStyleSection>

          <AppleStyleSection>
            <ResumeDownload />
          </AppleStyleSection>
        </Background>
      </main>
    </div>
  );
}
