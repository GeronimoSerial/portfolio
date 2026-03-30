export interface NavItem {
	id: string;
	label: string;
}

// Navigation items for the home page
export const NAVIGATION_ITEMS = [
	{ id: "hero", label: "Home" },
	{ id: "services", label: "Services" },
	{ id: "process", label: "Process" },
	{ id: "projects", label: "Projects" },
	{ id: "results", label: "Results" },
	{ id: "contact", label: "Contact" },
] as NavItem[];

// Navigation items for the portfolio page
export const PORTFOLIO_ITEMS = [
	{ id: "hero", label: "Inicio" },
	{ id: "experience", label: "Experiencia" },
	{ id: "projects", label: "Proyectos" },
	{ id: "architecture", label: "Arquitectura" },
	{ id: "apis", label: "APIs" },
	{ id: "performance", label: "Data" },
	{ id: "software", label: "Software" },
	{ id: "education", label: "Educación" },
	{ id: "contact-opp", label: "Contacto" },
	{ id: "resume", label: "CV" },
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
