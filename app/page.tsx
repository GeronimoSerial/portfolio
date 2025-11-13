import { Background } from "@/components/layout/Background";
import Hero from "@/app/_components/Hero";
import Services from "@/app/_components/Services";
import Process from "@/app/_components/Process";
import Projects from "@/app/_components/Projects";
import Results from "@/app/_components/Results";
import Link from "next/link";
import { getTranslations } from "next-intl/server";
import { getProjects } from "@/lib/get-projects";

export default async function Home() {
  const t = await getTranslations("footer");
  const projects = await getProjects();

  return (
    <>
      <Background>
        <main className="relative">
          <Hero />
          <Services />
          <Process />
          <Projects projectsData={projects} />
          <Results />
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
