import "../global.css";
import { IBM_Plex_Sans, IBM_Plex_Mono, Bebas_Neue } from "next/font/google";
import { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getLocale } from "next-intl/server";
    import Nav from "@/components/layout/Nav";
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

const ibmPlexSans = IBM_Plex_Sans({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
  variable: "--font-ibm-plex-sans",
});

const ibmPlexMono = IBM_Plex_Mono({
  weight: ["400", "500", "600"],
  subsets: ["latin"],
  variable: "--font-ibm-plex-mono",
});

const bebasNeue = Bebas_Neue({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-bebas",
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
      className={`dark ${ibmPlexSans.variable} ${ibmPlexMono.variable} ${bebasNeue.variable}`}
      suppressHydrationWarning
    >
      <body className="bg-background text-foreground overflow-x-hidden antialiased font-sans">
        <NextIntlClientProvider messages={messages}>
          <Nav />
          {children}
          <Contact />

          <footer className="border-t border-border py-8 bg-background relative z-10">
            <div className="container mx-auto px-4 text-center">
              <p className="font-mono text-xs text-muted-foreground uppercase tracking-widest">
                © {new Date().getFullYear()}{" "}
                <Link
                  href="https://geroserial.com"
                  className="text-foreground hover:text-accent transition-colors"
                >
                  geroserial.com
                </Link>
              </p>
            </div>
          </footer>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
