"use client";

interface TechBadgeProps {
  children: React.ReactNode;
  variant?: "primary" | "secondary";
}

function TechBadge({ children, variant = "primary" }: TechBadgeProps) {
  const variants = {
    primary: "bg-zinc-900 dark:bg-zinc-100 text-zinc-50 dark:text-zinc-900",
    secondary:
      "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-zinc-50 border border-zinc-200 dark:border-zinc-700",
  };

  return (
    <span
      className={`inline-flex items-center px-3 py-1.5 rounded-md text-sm font-medium transition-colors duration-300 ${variants[variant]}`}
    >
      {children}
    </span>
  );
}

export function TechStackSection() {
  return (
    <div className="flex flex-wrap gap-2">
      <TechBadge>Next.js 15</TechBadge>
      <TechBadge>TypeScript</TechBadge>
      <TechBadge>React 19</TechBadge>
      <TechBadge>Tailwind CSS</TechBadge>
      <TechBadge variant="secondary">shadcn/ui</TechBadge>
      <TechBadge variant="secondary">MDX</TechBadge>
      <TechBadge variant="secondary">Nginx</TechBadge>
      <TechBadge variant="secondary">PM2</TechBadge>
      <TechBadge variant="secondary">Google Analytics 4</TechBadge>
    </div>
  );
}
