/**
 * Skills data structure with svgl.dev icon names
 * Icon URLs: https://svgl.app/library/{name}
 */

export interface Skill {
	name: string;
	svglId: string;
}

export interface SkillCategory {
	key: string;
	skills: Skill[];
}

export const skillsData: SkillCategory[] = [
	{
		key: "architecture",
		skills: [
			{ name: "Next.js App Router", svglId: "nextjs_icon_dark" },
			{ name: "React Server Components", svglId: "react_dark" },
			{ name: "Server Actions", svglId: "nextjs_icon_dark" },
			{ name: "ISR / SSG / SSR", svglId: "vercel" },
			{ name: "PWA", svglId: "pwa" },
			{ name: "Service Workers", svglId: "javascript" },
		],
	},
	{
		key: "data",
		skills: [
			{ name: "PostgreSQL", svglId: "postgresql" },
			{ name: "JSON / JSONB", svglId: "json" },
			{ name: "Prisma", svglId: "prisma_dark" },
			{ name: "Kysely", svglId: "typescript" },
			{ name: "DuckDB", svglId: "duckdb" },
			{ name: "Row Level Security", svglId: "postgresql" },
			{ name: "Multi-tenant SaaS", svglId: "vercel" },
		],
	},
	{
		key: "backend",
		skills: [
			{ name: "Webhooks", svglId: "webhook" },
			{ name: "API Design", svglId: "api" },
			{ name: "RAG", svglId: "openai" },
			{ name: "Real-time Events", svglId: "websocket" },
			{ name: "Cron Jobs", svglId: "github_actions" },
			{ name: "n8n", svglId: "n8n" },
		],
	},
	{
		key: "infrastructure",
		skills: [
			{ name: "Docker", svglId: "docker" },
			{ name: "GitHub Actions", svglId: "github_actions" },
			{ name: "CI/CD", svglId: "github_actions" },
			{ name: "VPS / Linux", svglId: "linux" },
			{ name: "Vercel", svglId: "vercel" },
			{ name: "Ngrok", svglId: "ngrok" },
			{ name: "Git", svglId: "git" },
		],
	},
	{
		key: "performance",
		skills: [
			{ name: "Caching Strategies", svglId: "redis" },
			{ name: "Database Indexing", svglId: "postgresql" },
			{ name: "SRE Practices", svglId: "datadog" },
			{ name: "CDN", svglId: "cloudflare" },
			{ name: "Sparse Checkout", svglId: "git" },
		],
	},
	{
		key: "software",
		skills: [
			{ name: "Domain-Driven Design", svglId: "ddd" },
			{ name: "Layered Architecture", svglId: "architecture" },
			{ name: "Modularización", svglId: "typescript" },
			{ name: "Unit Testing", svglId: "vitest" },
		],
	},
	{
		key: "security",
		skills: [
			{ name: "OAuth", svglId: "oauth" },
			{ name: "Rate Limiting", svglId: "security" },
			{ name: "ETL Pipelines", svglId: "data" },
			{ name: "Google Sheets API", svglId: "google" },
		],
	},
];
