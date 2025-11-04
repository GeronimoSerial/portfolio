"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function ThemeDebug() {
	const { theme, setTheme, resolvedTheme } = useTheme();
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) return null;

	return (
		<div className="fixed top-4 right-4 z-50 p-4 bg-white dark:bg-black border border-zinc-300 dark:border-zinc-700 rounded-lg shadow-lg">
			<h3 className="text-sm font-bold text-zinc-900 dark:text-zinc-100 mb-2">
				Theme Debug
			</h3>
			<div className="text-xs space-y-1">
				<div className="text-zinc-700 dark:text-zinc-300">Theme: {theme}</div>
				<div className="text-zinc-700 dark:text-zinc-300">
					Resolved: {resolvedTheme}
				</div>
				<div className="text-zinc-700 dark:text-zinc-300">
					HTML class:{" "}
					{typeof window !== "undefined"
						? document.documentElement.className
						: "N/A"}
				</div>
				<div className="flex gap-2 mt-2">
					<button
						onClick={() => setTheme("light")}
						className="px-2 py-1 text-xs bg-zinc-200 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 rounded"
					>
						Light
					</button>
					<button
						onClick={() => setTheme("dark")}
						className="px-2 py-1 text-xs bg-zinc-200 dark:bg-zinc-800 text-zinc-800 dark:text-zinc-200 rounded"
					>
						Dark
					</button>
				</div>
			</div>
		</div>
	);
}
