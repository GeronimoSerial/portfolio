import "../global.css";
import { DM_Sans, Geist, Geist_Mono } from "next/font/google";
import LocalFont from "next/font/local";
import { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getLocale } from "next-intl/server";
import { ThemeProvider } from "./providers/ThemeProvider";
import AnimatedNav from "@/components/layout/AnimatedNav";

export const metadata: Metadata = {
  title: {
    default: "geroserial.com",
    template: "%s | geroserial.com",
  },
  description:
    "Brindando soluciones tecnológicas que simplifican y potencian proyectos.",
  openGraph: {
    title: "geroserial.com",
    description:
      "Brindando soluciones tecnológicas que simplifican y potencian proyectos.",
    url: "https://geroserial.com",
    siteName: "geroserial.com",
    images: [
      {
        url: "https://geroserial.com/assets/images/og.png",
        width: 1920,
        height: 1080,
      },
    ],
    locale: "en-US",
    type: "website",
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
  twitter: {
    title: "Geroserial",
    card: "summary_large_image",
  },
  icons: {
    shortcut: "/assets/icons/favicon.png",
  },
};
const geist = Geist({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-geist",
});

const calSans = LocalFont({
  src: "../public/fonts/CalSans-SemiBold.ttf",
  variable: "--font-calsans",
});

const dm_sans = DM_Sans({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700"],
  variable: "--font-dm_sans",
});

const geist_mono = Geist_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-geist-mono",
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
        calSans.variable,
        dm_sans.variable,
        geist_mono.variable,
      ].join(" ")}
      suppressHydrationWarning
    >
      <body
        className={`${
          process.env.NODE_ENV === "development" ? "debug-screens" : undefined
        }`}
      >
        <div id="smooth-wrapper">
          <div id="smooth-content">
            <NextIntlClientProvider messages={messages}>
              <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
              >
                <AnimatedNav />
                {children}
              </ThemeProvider>
            </NextIntlClientProvider>
          </div>
        </div>
      </body>
    </html>
  );
}
