"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
export default function Footer() {
	const pathname = usePathname();

	if (pathname === "/cv") {
		return null; // No renderizar el pie de página en la ruta /cv
	}

	return (
		<footer className="border-t border-zinc-800 py-8">
			<div className="container mx-auto px-4 text-center">
				<p className="text-sm text-zinc-500">
					© {new Date().getFullYear()}{" "}
					<Link
						href="https://geroserial.com"
						className="text-white hover:underline"
					>
						geroserial.com
					</Link>
				</p>
			</div>
		</footer>
	);
}
