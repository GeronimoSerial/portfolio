import { Navigation } from '../components/nav';
import Particles from '../components/particles';
import {CarouselComponent} from './carouselComponent';
import { Metadata } from 'next';


export const metadata: Metadata = {
  title: 'Contacto',
  description: 'Página de información personal y profesional de Geronimo Serial',
 }

export default function Contact() {
  return (
    <div className="bg-gradient-to-tl from-indigo-900 via-indigo-400/10 fixed inset-0">
      <Navigation />
      <Particles className="absolute inset-0 -z-10" />
        <CarouselComponent />
        </div>
  );
}