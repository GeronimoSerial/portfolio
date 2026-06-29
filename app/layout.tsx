import "../global.css";
import type { Metadata } from "next";
import {
	Geist,
	Inter,
	JetBrains_Mono,
	Outfit,
	Space_Grotesk,
} from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import AnimatedNav from "@/components/layout/AnimatedNav";
import Footer from "@/components/layout/Footer";
import Contact from "./_components/Contact";
// import DevelopmentToast from "@/components/DevelopmentToast";

export const metadata: Metadata = {
	metadataBase: new URL("https://geroserial.com"),
	title: {
		default: "Geronimo Serial | Technology Solutions",
		template: "%s | Geroserial",
	},
	description:
		"Professional web development and custom technology solutions. Specialized in Next.js, React, TypeScript, and modern architectures. I turn ideas into scalable digital products.",
	keywords: [
		"web development",
		"Next.js",
		"React",
		"TypeScript",
		"technology solutions",
		"programming",
		"full stack developer",
		"web design",
		"web applications",
		"technology consulting",
		"corrientes",
		"argentina",
		"freelance",
	],
	authors: [{ name: "Geroserial", url: "https://geroserial.com" }],
	creator: "geroserial",
	publisher: "geroserial",
	formatDetection: {
		email: false,
		address: false,
		telephone: false,
	},
	openGraph: {
		type: "website",
		locale: "en_US",
		url: "https://geroserial.com",
		siteName: "Geroserial",
		title: "Geronimo Serial | Technology Solutions",
		description:
			"Professional web development and custom technology solutions. Specialized in Next.js, React, TypeScript, and modern architectures.",
		images: [
			{
				url: "/assets/icons/portrait.png",
				width: 1200,
				height: 630,
				alt: "Geroserial - Technology Solutions",
				type: "image/webp",
			},
		],
	},
	twitter: {
		card: "summary_large_image",
		title: "Geronimo Serial | Technology Solutions",
		description:
			"Professional web development and custom technology solutions. Specialized in Next.js, React, TypeScript, and modern architectures.",
		images: ["/assets/icons/portrait.png"],
		creator: "@geroserial",
		site: "@geroserial",
	},
	robots: {
		index: true,
		follow: true,
		googleBot: {
			index: true,
			follow: true,
			"max-video-preview": -1,
			"max-image-preview": "large",
			"max-snippet": -1,
		},
	},
	icons: {
		icon: "/assets/icons/favicon.png",
		shortcut: "/assets/icons/favicon.png",
		apple: "/assets/icons/favicon.png",
	},
	manifest: "/site.webmanifest",
	alternates: {
		canonical: "https://geroserial.com",
	},
};

const geist = Geist({
	subsets: ["latin"],
	weight: ["400", "500", "600", "700"],
	variable: "--font-geist",
});

const inter = Inter({
	subsets: ["latin"],
	weight: ["400", "500", "600", "700", "800"],
	variable: "--font-inter",
});

const spaceGrotesk = Space_Grotesk({
	subsets: ["latin"],
	weight: ["400", "500", "600", "700"],
	variable: "--font-space-grotesk",
});

const jetbrainsMono = JetBrains_Mono({
	subsets: ["latin"],
	weight: ["400", "500", "600", "700"],
	variable: "--font-jetbrains-mono",
});

const outfit = Outfit({
	subsets: ["latin"],
	weight: ["400", "500", "600", "700"],
	variable: "--font-outfit",
});

export default async function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const locale = await getLocale();
	const messages = await getMessages();

	return (
		<html
			lang={locale}
			className={[
				geist.variable,
				inter.variable,
				spaceGrotesk.variable,
				jetbrainsMono.variable,
				outfit.variable,
				"dark",
			].join(" ")}
		>
			<head>
				<link
					rel="preload"
					href="/assets/spline/scene.splinecode"
					as="fetch"
					crossOrigin="anonymous"
				/>
			</head>
			<body
				className={`${
					process.env.NODE_ENV === "development" ? "debug-screens" : undefined
				}`}
			>
				<div id="smooth-wrapper">
					<div id="smooth-content">
						<NextIntlClientProvider messages={messages}>
							<AnimatedNav />
							{children}
							<Contact />
							<Footer />
						</NextIntlClientProvider>
					</div>
				</div>
			</body>
		</html>
	);
}
