import fs from "fs/promises";
import path from "path";
import matter from "gray-matter";

/**
 * Get MDX content without frontmatter for rendering
 * @param slug - The project slug
 * @returns The MDX content stripped of frontmatter
 */
export async function getMDXContent(slug: string): Promise<string> {
  const filePath = path.join(process.cwd(), "content/projects", `${slug}.mdx`);
  const fileContents = await fs.readFile(filePath, "utf8");
  const { content } = matter(fileContents);
  return content;
}
