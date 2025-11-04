/**
 * Skills data structure with svgl.dev icon names
 * Icon URLs: https://svgl.app/library/{name}
 */

export interface Skill {
  name: string;
  svglId: string; // ID from svgl.dev
}

export interface SkillCategory {
  key: string;
  skills: Skill[];
}

export const skillsData: SkillCategory[] = [
  {
    key: "frontend",
    skills: [
      { name: "React", svglId: "react_dark" },
      { name: "Next.js", svglId: "nextjs_icon_dark" },
      { name: "Tailwind CSS", svglId: "tailwindcss" },
      { name: "Bootstrap", svglId: "bootstrap" },
    ],
  },
  {
    key: "backend",
    skills: [
      { name: "Node.js", svglId: "nodejs" },
      { name: "Express", svglId: "expressjs_dark" },
      { name: "ASP.NET", svglId: "dotnet" },
      { name: "Strapi", svglId: "strapi" },
      { name: "Redis", svglId: "redis" },
      { name: "Prisma", svglId: "prisma_dark" },
      { name: "Git", svglId: "git" },
      { name: "GitHub", svglId: "github_dark" },
    ],
  },
  {
    key: "data",
    skills: [
      { name: "SQL Server", svglId: "sql-server" },
      { name: "PostgreSQL", svglId: "postgresql" },
      { name: "SQLite", svglId: "sqlite" },
      { name: "Power BI", svglId: "microsoft-power-bi" },
      { name: "Excel", svglId: "microsoft-excel" },
    ],
  },
  {
    key: "languages",
    skills: [
      { name: "C", svglId: "c" },
      { name: "C#", svglId: "csharp" },
      { name: "Java", svglId: "java" },
      { name: "JavaScript", svglId: "javascript" },
      { name: "TypeScript", svglId: "typescript" },
      { name: "PHP", svglId: "php_dark" },
      { name: "Common Lisp", svglId: "lisp" },
    ],
  },
];
