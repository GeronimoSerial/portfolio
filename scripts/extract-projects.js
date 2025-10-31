const fs = require("fs");
const path = require("path");

const projectsDir = "./content/projects";
const files = fs.readdirSync(projectsDir);

const projects = files
  .map((file) => {
    const content = fs.readFileSync(path.join(projectsDir, file), "utf8");
    const match = content.match(/^---\n([\s\S]*?)\n---/);

    if (!match) return null;

    const frontmatter = match[1];
    const metadata = {};

    frontmatter.split("\n").forEach((line) => {
      const colonIndex = line.indexOf(":");
      if (colonIndex > 0) {
        const key = line.substring(0, colonIndex).trim();
        let value = line.substring(colonIndex + 1).trim();

        // Remove quotes if present
        if (value.startsWith('"') && value.endsWith('"')) {
          value = value.slice(1, -1);
        }

        // Convert published to boolean
        if (key === "published") {
          value = value === "true";
        }

        metadata[key] = value;
      }
    });

    metadata.slug = file.replace(".mdx", "");

    return metadata;
  })
  .filter(Boolean);

fs.writeFileSync("./data/projects.json", JSON.stringify(projects, null, 2));
console.log(`Extracted ${projects.length} projects to data/projects.json`);
