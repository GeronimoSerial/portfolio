import { Background } from "@/components/layout/Background";
import Hero from "@/app/_components/Hero";
import Services from "@/app/_components/Services";
import Process from "@/app/_components/Process";
import Results from "@/app/_components/Results";
import { getProjects } from "@/lib/get-projects";
import { cookies } from "next/headers";
import { defaultLocale, locales } from "@/lib/i18n/config";
import FeaturedProjects from "@/app/_components/FeaturedProjects";
// import SplineAutoRecorder from "@/components/shared/ScreenRecorder";

async function getLocale() {
  const cookieStore = await cookies();
  const localeCookie = cookieStore.get("NEXT_LOCALE")?.value;
  return locales.includes(localeCookie as any) ? localeCookie : defaultLocale;
}

export default async function Home() {
  const locale = await getLocale();
  const projects = await getProjects(locale as string);

  return (
    <>
      <Background>
        <main className="relative">
          <Hero />
          <Services />
          <Process />
          <FeaturedProjects projectsData={projects} />
          <Results />
        </main>
      </Background>
    </>
  );
}
