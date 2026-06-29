import { getProjects } from "@/lib/get-projects";
import { Background } from "@/components/layout/Background";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import fs from "fs/promises";
import path from "path";
import matter from "gray-matter";
import { compileMDX } from "next-mdx-remote/rsc";
import { defaultLocale } from "@/lib/i18n/config";
import { Separator } from "@/components/ui/separator";
import { ImpactGrid } from "@/components/projects/consejo-mec/impact";
import { TechStackSection } from "@/components/projects/consejo-mec/stack";
import Image from "next/image";
import { AppleStyleSection } from "@/app/portfolio/_components/ui/AppleStyleSection";

type MdxImageProps = React.ComponentProps<typeof Image> & {
	caption?: string;
};

function MdxImage({
	alt,
	className,
	width,
	height,
	sizes,
	caption,
	...props
}: MdxImageProps) {
	return (
		<figure className="my-6 sm:my-8">
			<Image
				alt={alt}
				width={width ?? 1600}
				height={height ?? 900}
				sizes={sizes ?? "(max-width: 768px) 100vw, 896px"}
				className={[
					"h-auto w-full rounded-2xl border border-zinc-200 object-cover dark:border-zinc-800",
					className,
				]
					.filter(Boolean)
					.join(" ")}
				{...props}
			/>
			{caption ? (
				<figcaption className="mt-2 text-xs leading-relaxed text-zinc-500 dark:text-zinc-500">
					{caption}
				</figcaption>
			) : null}
		</figure>
	);
}

export async function generateStaticParams() {
	const projects = await getProjects();
	return projects.map((project) => ({
		slug: project.slug,
	}));
}

export async function generateMetadata({
	params,
}: {
	params: Promise<{ slug: string }>;
}): Promise<Metadata> {
	const { slug } = await params;
	const projects = await getProjects();
	const project = projects.find((p) => p.slug === slug);

	if (!project) {
		return {
			title: "Project Not Found",
		};
	}

	return {
		title: project.title,
		description: project.description,
	};
}

export default async function Page({
	params,
}: {
	params: Promise<{ slug: string }>;
}) {
	const { slug } = await params;
	const dateLocale = "en-US";

	const projects = await getProjects();
	const project = projects.find((p) => p.slug === slug);

	if (!project) {
		notFound();
	}

	const filePath = path.join(
		process.cwd(),
		"content/projects",
		defaultLocale,
		`${slug}.mdx`,
	);
	const fileContents = await fs.readFile(filePath, "utf8");
	const { content } = matter(fileContents);

	const { content: MDXContent } = await compileMDX({
		source: content,
		options: {
			parseFrontmatter: false,
		},
		components: {
			Separator,
			ImpactGrid,
			TechStackSection,
			Image: MdxImage,
		},
	});

	return (
		<Background>
			<div className="relative min-h-screen px-4 py-16 sm:py-20">
				<div className="container mx-auto max-w-4xl">
					<Link
						href="/"
						className="mb-8 inline-flex min-h-11 items-center gap-2 rounded-full border border-zinc-200 px-4 text-sm text-zinc-600 transition-colors hover:text-zinc-900 dark:border-zinc-800 dark:text-zinc-400 dark:hover:text-zinc-50"
					>
						<ArrowLeft className="w-4 h-4" />
						Back to home
					</Link>

					<AppleStyleSection>
						<header className="mb-10 sm:mb-12">
							<h1 className="mb-4 text-3xl font-display font-bold text-zinc-900 dark:text-zinc-50 sm:text-4xl md:text-5xl lg:text-6xl">
								{project.title}
							</h1>
							<p className="text-base leading-relaxed text-zinc-600 dark:text-zinc-400 sm:text-lg">
								{project.description}
							</p>
							{project.date && (
								<p className="text-sm text-zinc-500 dark:text-zinc-500 mt-2">
									{new Date(project.date).toLocaleDateString(dateLocale, {
										year: "numeric",
										month: "long",
										day: "numeric",
									})}
								</p>
							)}
							<hr className="mt-8 border-zinc-200 dark:border-zinc-800" />
						</header>

						<article
							className="prose prose-zinc dark:prose-invert max-w-none prose-sm sm:prose-base lg:prose-lg
             prose-headings:font-display prose-headings:font-bold
							prose-h2:mt-10 prose-h2:mb-5 prose-h2:text-2xl sm:prose-h2:text-3xl
							prose-h3:mt-7 prose-h3:mb-3 prose-h3:text-xl sm:prose-h3:text-2xl
							prose-p:leading-7 sm:prose-p:leading-8
							prose-img:my-6
             prose-p:text-zinc-600 dark:prose-p:text-zinc-400
             prose-a:text-zinc-900 dark:prose-a:text-zinc-50
             prose-strong:text-zinc-900 dark:prose-strong:text-zinc-50
            prose-ul:text-zinc-600 dark:prose-ul:text-zinc-400
            prose-li:marker:text-zinc-500 dark:prose-li:marker:text-zinc-500"
						>
							{MDXContent}
						</article>
					</AppleStyleSection>
				</div>
			</div>
		</Background>
	);
}

export const dynamicParams = false;
