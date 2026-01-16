"use client";

import Link from "next/link";
import { Github } from "lucide-react";
import { SITE_CONFIG } from "@/config/site";
import { NavItem } from "@/config/navigation";
import {
	SheetContent,
	SheetDescription,
	SheetHeader,
	SheetTitle,
	SheetClose,
} from "@/components/ui/sheet";

interface MobileMenuProps {
	navigationItems: NavItem[];
}

export function MobileMenu({ navigationItems }: MobileMenuProps) {
	return (
		<SheetContent
			side="left"
			className="w-[300px] sm:w-[400px] 
                 bg-background border-r border-border/30 sticky h-dvh p-0"
			onOpenAutoFocus={(e) => {
				e.preventDefault();
			}}
		>
			<SheetHeader className="px-6 py-8 border-b border-border/30">
				<SheetTitle className="text-4xl font-display text-foreground tracking-tight">
					MENU
				</SheetTitle>
				<SheetDescription className="font-mono text-xs text-muted-foreground uppercase tracking-widest">
					Navigation / v.01
				</SheetDescription>
			</SheetHeader>

			<div className="flex flex-col py-8 px-6 space-y-6">
				{navigationItems.slice(1).map((item, index) => (
					<SheetClose key={item.id} asChild>
						<a
							href={`#${item.id}`}
							className="group flex items-baseline gap-4 text-xl font-display tracking-wide
                         text-muted-foreground hover:text-foreground
                         transition-colors duration-200"
						>
              <span className="font-mono text-xs text-accent opacity-60 group-hover:opacity-100 transition-opacity">
                {String(index + 1).padStart(2, "0")}
              </span>
							{item.label}
						</a>
					</SheetClose>
				))}
			</div>

			{/* Footer area */}
			<div className="absolute bottom-0 left-0 right-0 p-6 border-t border-border/30 bg-background/50 backdrop-blur-sm">
				<div className="flex items-center justify-between">
					<span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            Connect
          </span>
					<a
						href={SITE_CONFIG.links.github}
						target="_blank"
						rel="noopener noreferrer"
						className="p-2
                         text-muted-foreground hover:text-foreground
                         transition-colors duration-200"
						aria-label="GitHub"
					>
						<Github className="w-5 h-5" />
					</a>
				</div>
			</div>
		</SheetContent>
	);
}
