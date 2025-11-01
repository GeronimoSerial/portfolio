export interface NavItem {
	id: string;
	label: string;
}

export const NAVIGATION_ITEMS = [
	{ id: "hero", label: "Home" },
	{ id: "services", label: "Services" },
	{ id: "process", label: "Process" },
	{ id: "projects", label: "Projects" },
	{ id: "testimonials", label: "Testimonials" },
	{ id: "contact", label: "Contact" },
] as const satisfies readonly NavItem[];

export const SECTION_IDS = NAVIGATION_ITEMS.map((item) => item.id);
