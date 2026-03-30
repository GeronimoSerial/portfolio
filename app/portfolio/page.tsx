import type { Metadata } from "next";
import { cookies } from "next/headers";
import { PortfolioBackground as Background } from "@/components/layout/PortfolioBackground";
import { getProjects } from "@/lib/get-projects";
import { defaultLocale, locales } from "@/lib/i18n/config";
import Projects from "../_components/FeaturedProjects";
import APIsIntegrations from "./_components/APIsIntegrations";
import ArchitectureDevOps from "./_components/ArchitectureDevOps";
import ContactOpportunities from "./_components/ContactOpportunities";
import DataPerformance from "./_components/DataPerformance";
import EducationSection from "./_components/EducationSection";
import ExperienceTimeline from "./_components/ExperienceTimeline";
import PortfolioHero from "./_components/PortfolioHero";
import ResumeDownload from "./_components/ResumeDownload";
import SoftwareArchitecture from "./_components/SoftwareArchitecture";

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
