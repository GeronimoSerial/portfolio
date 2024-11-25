import { Metadata } from 'next'
import AboutContent from './about-content'
import Particles from "../components/particles";
import { Navigation } from '../components/nav';

export const metadata: Metadata = {
  title: 'Sobre Mí | Mi Currículum',
  description: 'Página de información personal y profesional de Juan Pérez',
}

export default function AboutPage() {
  return (
    <div className="relative min-h-screen">
      <div className="absolute inset-0 bg-gradient-to-tl from-indigo-900 via-indigo-400/10">
        <Particles
          className="absolute inset-0 -z-10 animate-fade-in"
          quantity={100}
        />
      </div>
      <Navigation />
      <main className="relative z-10 pt-16">
        <div className="container mx-auto px-4 py-8">
          <AboutContent />
        </div>
      </main>
    </div>
  )
}

