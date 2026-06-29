export interface NavItem {
	id: string;
	label: string;
}

export const NAVIGATION_ITEMS = [
	{ id: "hero", label: "Home" },
	{ id: "services", label: "Services" },
	{ id: "process", label: "Process" },
	{ id: "projects", label: "Projects" },
	{ id: "results", label: "Results" },
	{ id: "contact", label: "Contact" },
] as NavItem[];

export const PORTFOLIO_ITEMS = [
	{ id: "hero", label: "Home" },
	{ id: "experience", label: "Experience" },
	{ id: "projects", label: "Projects" },
	{ id: "architecture", label: "Architecture" },
	{ id: "apis", label: "APIs" },
	{ id: "performance", label: "Data" },
	{ id: "software", label: "Software" },
	{ id: "education", label: "Education" },
	{ id: "contact-opp", label: "Contact" },
	{ id: "resume", label: "Resume" },
] as NavItem[];

export const PORTFOLIO_VISIBLE_NAV_IDS = [
	"experience",
	"projects",
	"architecture",
	"apis",
	"performance",
	"contact-opp",
] as const;

export const SECTION_IDS = NAVIGATION_ITEMS.map((item) => item.id);
