import Link from "next/link";

export default function TypographyShowcase() {
	const sections = [
		{
			name: "Inter",
			fontClass: "font-inter",
			description: "Modern, clean, and readable. Used by Vercel, Linear, GitHub.",
			color: "text-blue-400",
		},
		{
			name: "Space Grotesk",
			fontClass: "font-space-grotesk",
			description: "Geometric with a futuristic character. Perfect for tech portfolios.",
			color: "text-purple-400",
		},
		{
			name: "JetBrains Mono",
			fontClass: "font-jetbrains-mono",
			description: "Modern monospace. Conveys programming and development.",
			color: "text-green-400",
		},
		{
			name: "Outfit",
			fontClass: "font-outfit",
			description: "Rounded geometric. Modern yet accessible and friendly.",
			color: "text-orange-400",
		},
	];

	return (
		<div className="min-h-screen bg-black text-white py-20 px-4">
			<div className="max-w-6xl mx-auto">
				<div className="mb-16 text-center">
					<h1 className="text-4xl md:text-5xl font-bold mb-4">
						Typography Selection
					</h1>
					<p className="text-zinc-400 text-lg max-w-2xl mx-auto">
						Choose the typography that best represents your tech identity. Each
						option conveys a different feel.
					</p>
				</div>

				<div className="space-y-16">
					{sections.map((section) => (
						<div
							key={section.name}
							className="border border-zinc-800 rounded-2xl p-8 md:p-12 hover:border-zinc-700 transition-colors"
						>
							<div className="flex items-center gap-3 mb-6">
								<span className={`text-sm font-mono ${section.color}`}>
									{section.name}
								</span>
							</div>

							<div className={section.fontClass}>
								<h2 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
									Technology
									<br />
									Solutions
								</h2>
								<p className="text-xl md:text-2xl text-zinc-400 mb-8 max-w-3xl leading-relaxed">
									Professional web development with Next.js, React, and
									TypeScript. Turning ideas into scalable digital products.
								</p>
							</div>

							<div className="flex flex-wrap gap-4 text-sm text-zinc-500">
								<span className="px-3 py-1 bg-zinc-900 rounded-full">
									{section.description}
								</span>
							</div>
						</div>
					))}
				</div>

				<div className="mt-16 text-center">
					<Link
						href="/"
						className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black rounded-full font-medium hover:bg-zinc-200 transition-colors"
					>
						Back to home
					</Link>
				</div>
			</div>
		</div>
	);
}
