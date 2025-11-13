// Central barrel export for types
// Note: mdx.d.ts is a declaration file (ambient types), not exported here

// Global types
export interface SectionProps {
  id: string;
  className?: string;
}

export interface NavItem {
  id: string;
  label: string;
}

export interface Project {
  title: string;
  description: string;
  date?: string;
  url?: string;
  repository?: string;
  published: boolean;
  slug: string;
}
