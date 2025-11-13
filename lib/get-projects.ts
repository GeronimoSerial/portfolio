import fs from "fs/promises";
import path from "path";
import matter from "gray-matter";
import { Project } from "@/types";

export async function getProjects(locale: string = "en"): Promise<Project[]> {
  const projectsDirectory = path.join(
    process.cwd(),
    "content/projects",
    locale
  );

  try {
    const files = await fs.readdir(projectsDirectory);
    const mdxFiles = files.filter((file) => file.endsWith(".mdx"));

    const projects = await Promise.all(
      mdxFiles.map(async (filename) => {
        const filePath = path.join(projectsDirectory, filename);
        const fileContents = await fs.readFile(filePath, "utf8");
        const { data } = matter(fileContents);

        const slug = filename.replace(/\.mdx$/, "");

        return {
          title: data.title || "",
          description: data.description || "",
          date: data.date || "",
          url: data.url,
          repository: data.repository,
          published: data.published ?? false,
          slug,
        } as Project;
      })
    );

    // Sort by date descending
    return projects.sort((a, b) => {
      const dateA = a.date ? new Date(a.date).getTime() : 0;
      const dateB = b.date ? new Date(b.date).getTime() : 0;
      return dateB - dateA;
    });
  } catch (error) {
    console.error("Error reading projects:", error);
    return [];
  }
}
