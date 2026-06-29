"use client";

import { Github, Home } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import {
	SheetClose,
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
} from "@/components/ui/sheet";
import type { NavItem } from "@/config/navigation";
import {
	NAVIGATION_ITEMS,
	PORTFOLIO_ITEMS,
	PORTFOLIO_VISIBLE_NAV_IDS,
} from "@/config/navigation";
import { SITE_CONFIG } from "@/config/site";

interface MobileMenuProps {
	navigationItems?: NavItem[];
}

export function MobileMenu({ navigationItems }: MobileMenuProps) {
	const t = useTranslations("nav");
	const pathname = usePathname();
	const normalizedPath = pathname.replace(/\/+$/, "") || "/";
	const isPortfolio =
		normalizedPath === "/portfolio" || normalizedPath.endsWith("/portfolio");
	const visiblePortfolioIds = new Set<string>(PORTFOLIO_VISIBLE_NAV_IDS);

	// Use navigation items based on current page
	const items =
		navigationItems || (isPortfolio ? PORTFOLIO_ITEMS : NAVIGATION_ITEMS);
	const visiblePortfolioItems = items.filter((item) =>
		visiblePortfolioIds.has(item.id),
	);

	return (
		<SheetContent
			side="left"
			className="w-[min(88vw,22rem)] overflow-y-auto bg-white dark:bg-zinc-950 border-zinc-200 dark:border-zinc-800"
			onOpenAutoFocus={(e) => {
				e.preventDefault();
			}}
		>
			<SheetHeader className="border-b border-zinc-200 px-5 pb-4 pr-12 dark:border-zinc-800 sm:px-6">
				<SheetTitle className="text-2xl font-display text-zinc-950 dark:text-zinc-50">
					{isPortfolio ? "Portfolio" : "Navigation"}
				</SheetTitle>
				<SheetDescription className="text-zinc-600 dark:text-zinc-400">
					{isPortfolio ? "Explore my experience" : "Explore my work"}
				</SheetDescription>
			</SheetHeader>

			{/* Home Link */}
			{isPortfolio && (
				<div className="flex flex-col space-y-1 pt-4">
					<SheetClose asChild>
						<Link
							href="/"
							className="inline-flex min-h-11 items-center gap-2 rounded-xl text-base font-semibold 
                         text-zinc-900 dark:text-zinc-100
								 px-5 py-3 sm:px-6
                          transition-colors duration-200
                          border-l-4 border-transparent
                          hover:bg-zinc-100 dark:hover:bg-zinc-800"
						>
							<Home className="w-5 h-5" />
							<span>{t("home")}</span>
						</Link>
					</SheetClose>
				</div>
			)}

			<div className="flex flex-col space-y-1 py-6">
				{(isPortfolio ? visiblePortfolioItems : items.slice(1)).map((item) => (
					<SheetClose key={item.id} asChild>
						<a
							href={`#${item.id}`}
							className="inline-flex min-h-11 items-center rounded-xl text-base font-semibold 
                         text-zinc-700 dark:text-zinc-300
								 px-5 py-3 sm:px-6
                          transition-colors duration-200
                          border-l-4 border-transparent
                          hover:bg-zinc-100 dark:hover:bg-zinc-800"
						>
							{isPortfolio ? item.label : t(item.id) || item.label}
						</a>
					</SheetClose>
				))}
			</div>

			{/* Divider */}
			<div className="my-4 mx-5 h-px bg-zinc-200 dark:bg-zinc-800 sm:mx-6" />

			{/* Portfolio CTA - shown when on home page */}
			{!isPortfolio && (
				<div className="px-5 pt-2 sm:px-6">
					<SheetClose asChild>
						<Link
							href="/portfolio#hero"
							className="flex min-h-11 w-full items-center justify-center rounded-xl px-6 py-3 text-center text-base font-bold
                         bg-zinc-950 dark:bg-zinc-100
                         text-zinc-50 dark:text-zinc-950
                          shadow-md 
								 active:scale-[0.99] transition-transform"
						>
							{t("portfolio")}
						</Link>
					</SheetClose>
				</div>
			)}

			{/* Divider */}
			<div className="my-4 mx-5 h-px bg-zinc-200 dark:bg-zinc-800 sm:mx-6" />

			<div className="flex items-center justify-center gap-4 px-5 pt-2 sm:px-6">
				<a
					href={SITE_CONFIG.links.github}
					target="_blank"
					rel="noopener noreferrer"
					className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-zinc-200 p-0
                          text-zinc-600 dark:text-zinc-400
						  transition-colors duration-200
                          hover:bg-zinc-100 dark:hover:bg-zinc-800"
					aria-label="GitHub"
				>
					<Github className="w-6 h-6" />
				</a>
			</div>
		</SheetContent>
	);
}
