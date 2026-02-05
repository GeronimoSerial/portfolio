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

export const metadata: Metadata = {
	title: "Portfolio | Geronimo Serial",
	description:
		"Full Stack Developer specialized in Infrastructure, System Architecture, and DevOps. Expert in Next.js, PostgreSQL, CI/CD, and API Design.",
	openGraph: {
		title: "Portfolio | Geronimo Serial",
		description:
			"Full Stack Developer | Infrastructure & System Architecture",
		type: "profile",
	},
};

export default async function PortfolioPage() {
	const projects = await getProjects();

	return (
		<div className="dark contents">
			<main className="relative">
				<Background>
					<PortfolioHero />
					<ArchitectureDevOps />
					<APIsIntegrations />
					<DataPerformance />
					<SoftwareArchitecture />
					<ExperienceTimeline />
					<EducationSection />
					<Projects projectsData={projects} />
					<ContactOpportunities />
					<ResumeDownload />
				</Background>
			</main>

			<footer
				className="border-t
        border-zinc-800
        py-8 gsap-element bg-zinc-950"
			>
				<div className="container mx-auto px-4 text-center">
					<p className="text-sm text-zinc-500 gsap-element">
						© {new Date().getFullYear()} Geronimo Serial.
					</p>
				</div>
			</footer>
		</div>
	);
}
