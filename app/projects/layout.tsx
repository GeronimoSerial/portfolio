import { Navigation } from "../components/nav";
import { Card } from "../components/card";

export default function AboutPage() {
	return (
		<div className="bg-gradient-to-tl from-zinc-900 via-zinc-900 to-zinc-900 min-h-screen">
			<Navigation />
			<div className="container flex items-center justify-center min-h-screen px-4 mx-auto">
				<div className="grid w-full grid-cols-1 gap-8 mx-auto mt-32 sm:mt-0">
					<Card>
						{/* <h1 className="text-4xl font-bold text-white">About Us</h1>
						<p className="mt-4 text-zinc-400">
							Welcome to our about page! Here you can find more information about our projects and team.
						</p> */}
						
					</Card>
				</div>
			</div>
		</div>
	);
}
