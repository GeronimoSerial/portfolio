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
	{ id: "hero", label: "Overview" },
	{ id: "architecture", label: "Arquitectura" },
	{ id: "apis", label: "APIs" },
	{ id: "performance", label: "Data" },
	{ id: "experience", label: "Experiencia" },
	{ id: "education", label: "Educación" },
	{ id: "projects", label: "Proyectos" },
	{ id: "contact", label: "Contacto" },
] as NavItem[];

export const SECTION_IDS = NAVIGATION_ITEMS.map((item) => item.id);
