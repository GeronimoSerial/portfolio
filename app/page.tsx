"use client";

import AnimatedNav from "@/components/layout/AnimatedNav";
import { Background } from "@/components/layout/Background";
import Hero from "@/app/_components/Hero";
import Services from "@/app/_components/Services";
import Process from "@/app/_components/Process";
import Projects from "@/app/_components/Projects";
import Results from "@/app/_components/Results";
import Contact from "@/app/_components/Contact";
import Link from "next/link";
import { useTranslations } from "next-intl";

export default function Home() {
  const t = useTranslations("footer");
  return (
    <>
      {/* <AnimatedNav /> */}

      <Background>
        <main className="relative">
          <Hero />
          <Services />
          <Process />
          <Projects />
          <Results />
          <Contact />
        </main>

        {/* Footer simple */}
        <footer className="border-t border-zinc-800 py-8">
          <div className="container mx-auto px-4 text-center">
            <p className="text-sm text-zinc-500">
              © {new Date().getFullYear()}{" "}
              <Link
                href="https://geroserial.com"
                className="text-black hover:underline dark:text-white"
              >
                geroserial.com
              </Link>
              . {t("rights")}
            </p>
          </div>
        </footer>
      </Background>
    </>
  );
}
