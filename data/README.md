# Data Directory

This directory contains static JSON files used throughout the application.

## Projects Data

The `projects.json` file contains all project information previously managed by Contentlayer.

### Updating Projects

To update the projects data after modifying MDX files in `content/projects/`:

```bash
node scripts/extract-projects.js
```

This will regenerate `projects.json` from the MDX frontmatter.

### Project Schema

Each project object has the following structure:

```typescript
{
  title: string;           // Project title
  description: string;     // Brief description
  date?: string;          // ISO date string (optional)
  url?: string;           // Live project URL (optional)
  repository?: string;    // GitHub repository (optional)
  published: boolean;     // Whether to show the project
  slug: string;           // Unique identifier (auto-generated from filename)
}
```

### Adding New Projects

1. Create a new `.mdx` file in `content/projects/`
2. Add frontmatter with the required fields
3. Run the extraction script: `node scripts/extract-projects.js`
4. Rebuild the application: `pnpm build`
