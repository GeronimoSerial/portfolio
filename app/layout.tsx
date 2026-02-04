import "../global.css";
import { Geist, Inter, Space_Grotesk, JetBrains_Mono, Outfit } from "next/font/google";
import { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getLocale } from "next-intl/server";

import AnimatedNav from "@/components/layout/AnimatedNav";
import Contact from "./_components/Contact";
import Link from "next/link";

export const metadata: Metadata = {
  metadataBase: new URL("https://geroserial.com"),
  title: {
    default: "Geronimo Serial | Soluciones tecnológicas",
    template: "%s | Geroserial",
  },
  description:
    "Desarrollo web profesional y soluciones tecnológicas personalizadas. Especializado en Next.js, React, TypeScript y arquitecturas modernas. Transformo ideas en productos digitales escalables.",
  keywords: [
    "desarrollo web",
    "Next.js",
    "React",
    "TypeScript",
    "soluciones tecnológicas",
    "programación",
    "full stack developer",
    "diseño web",
    "aplicaciones web",
    "consultoría tecnológica",
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
    locale: "es_ES",
    alternateLocale: ["en_US"],
    url: "https://geroserial.com",
    siteName: "Geroserial",
    title: "Geronimo Serial | Soluciones tecnológicas",
    description:
      "Desarrollo web profesional y soluciones tecnológicas personalizadas. Especializado en Next.js, React, TypeScript y arquitecturas modernas.",
    images: [
      {
        url: "/assets/icons/portrait.png",
        width: 1200,
        height: 630,
        alt: "Geroserial - Soluciones Tecnológicas",
        type: "image/webp",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Geronimo Serial | Soluciones tecnológicas",
    description:
      "Desarrollo web profesional y soluciones tecnológicas personalizadas. Especializado en Next.js, React, TypeScript y arquitecturas modernas.",
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
    languages: {
      "es-ES": "https://geroserial.com/es",
      "en-US": "https://geroserial.com/en",
    },
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

              {/* Footer simple */}
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
            </NextIntlClientProvider>
          </div>
        </div>
      </body>
    </html>
  );
}
