import { Metadata } from 'next'
import AboutContent from './about-content'
import Particles from "../components/particles";
import { Navigation } from '../components/nav';
import { Card } from '../components/card';


export const metadata: Metadata = {
  title: 'Sobre Mí | Mi Currículum',
  description: 'Página de información personal y profesional de Juan Pérez',
}

export default function AboutPage() {
  return (
    <div className="mt-16">
    <div className="bg-gradient-to-tl from-indigo-900 via-indigo-400/10">
      <Navigation/>
      <div className="container flex items-center justify-center min-h-screen px-4 mx-auto">
      <AboutContent />
      <Particles
				className="absolute inset-0 -z-10 animate-fade-in"
				quantity={100}
        />
        </div>
        </div>
    </div>
  )
}