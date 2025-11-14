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
import { cookies } from "next/headers";
import { defaultLocale, locales } from "@/lib/i18n/config";
import { Separator } from "@/components/ui/separator";
import { ImpactGrid } from "@/components/projects/consejo-mec/impact";
import { TechStackSection } from "@/components/projects/consejo-mec/stack";

async function getLocale() {
  const cookieStore = await cookies();
  const localeCookie = cookieStore.get("NEXT_LOCALE")?.value;
  return locales.includes(localeCookie as any) ? localeCookie : defaultLocale;
}

export async function generateStaticParams() {
  // Generate static params for all locales
  const allParams = [];
  for (const locale of locales) {
    const projects = await getProjects(locale);
    const params = projects.map((project) => ({
      slug: project.slug,
    }));
    allParams.push(...params);
  }
  // Remove duplicates based on slug
  const uniqueParams = Array.from(
    new Map(allParams.map((p) => [p.slug, p])).values()
  );
  return uniqueParams;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const locale = await getLocale();
  const projects = await getProjects(locale as string);
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
  const locale = await getLocale();

  // Verify project exists
  const projects = await getProjects(locale as string);
  const project = projects.find((p) => p.slug === slug);

  if (!project) {
    notFound();
  }

  // Read and process MDX file
  const filePath = path.join(
    process.cwd(),
    "content/projects",
    locale as string,
    `${slug}.mdx`
  );
  const fileContents = await fs.readFile(filePath, "utf8");
  const { content } = matter(fileContents);

  // Compile MDX without frontmatter, with custom components
  const { content: MDXContent } = await compileMDX({
    source: content,
    options: {
      parseFrontmatter: false,
    },
    components: {
      Separator,
      ImpactGrid,
      TechStackSection,
    },
  });

  return (
    <Background>
      <div className="relative min-h-screen py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          {/* Back button */}
          <Link
            href="/projects"
            className="inline-flex items-center gap-2 mb-8 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-50 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Projects
          </Link>

          {/* Project header */}
          <header className="mb-12">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-zinc-900 dark:text-zinc-50 mb-4">
              {project.title}
            </h1>
            <p className="text-lg text-zinc-600 dark:text-zinc-400">
              {project.description}
            </p>
            {project.date && (
              <p className="text-sm text-zinc-500 dark:text-zinc-500 mt-2">
                {new Date(project.date).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            )}
            <hr className="mt-8 border-zinc-200 dark:border-zinc-800" />
          </header>

          {/* MDX Content */}
          <article
            className="prose prose-zinc dark:prose-invert prose-lg max-w-none
            prose-headings:font-display prose-headings:font-bold
            prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6
            prose-h3:text-2xl prose-h3:mt-8 prose-h3:mb-4
            prose-p:text-zinc-600 dark:prose-p:text-zinc-400
            prose-a:text-zinc-900 dark:prose-a:text-zinc-50
            prose-strong:text-zinc-900 dark:prose-strong:text-zinc-50
            prose-ul:text-zinc-600 dark:prose-ul:text-zinc-400
            prose-li:marker:text-zinc-500 dark:prose-li:marker:text-zinc-500"
          >
            {MDXContent}
          </article>
        </div>
      </div>
    </Background>
  );
}

export const dynamicParams = false;
