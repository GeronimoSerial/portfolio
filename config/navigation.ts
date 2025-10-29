export interface NavItem {
  id: string;
  label: string;
}

export const NAVIGATION_ITEMS: NavItem[] = [
  { id: "hero", label: "Inicio" },
  { id: "about", label: "Sobre Mí" },
  { id: "skills", label: "Habilidades" },
  { id: "experience", label: "Experiencia" },
  { id: "projects", label: "Proyectos" },
  { id: "testimonials", label: "Testimonios" },
  { id: "services", label: "Servicios" },
  { id: "contact", label: "Contacto" },
] as const;

export const SECTION_IDS = NAVIGATION_ITEMS.map((item) => item.id);
