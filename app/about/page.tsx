import { Metadata } from 'next'
import AboutContent from './about-content'
import Particles from "../components/particles";
import { Navigation } from "../components/nav";


export const metadata: Metadata = {
  title: 'Sobre Mí | Mi Currículum',
  description: 'Página de información personal y profesional de Juan Pérez',
}

export default function AboutPage() {
  return (
    <main className="container flex items-center justify-center min-h-screen px-4 mx-auto mt-16">
    
      <AboutContent />
      <Particles
				className="absolute inset-0 -z-10 animate-fade-in"
				quantity={100}
			/>
    </main>
  )
}