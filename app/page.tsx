import { Background } from "@/components/layout/Background";
import Hero from "@/app/_components/Hero";
import Services from "@/app/_components/Services";
import Process from "@/app/_components/Process";
import Results from "@/app/_components/Results";
import { getProjects } from "@/lib/get-projects";
import FeaturedProjects from "@/app/_components/FeaturedProjects";

export default async function Home() {
	const projects = await getProjects();

	return (
		<>
			<Background>
				<main className="relative">
					<Hero />
					<Services />
					<Process />
					<FeaturedProjects projectsData={projects} />
					<Results />
				</main>
			</Background>
		</>
	);
}
