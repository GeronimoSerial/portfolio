import { MapPin } from 'lucide-react';

export default function HeroStatic() {
  return (
    <section id="hero" className="relative flex flex-col items-center justify-center w-full min-h-screen px-4">
      <div className="z-10 flex flex-col items-center text-center">
        {/* Título principal */}
        <div className="mb-6">
          <h1 className="text-6xl md:text-9xl font-display text-white">
            geroserial.com
          </h1>
        </div>

        {/* Subtítulo */}
        <h2 className="text-sm md:text-lg text-zinc-300 max-w-3xl">
          IT Specialist · Infrastructure, Automation & Web Systems Management
        </h2>

        <p className="mt-4 text-sm md:text-base text-zinc-500 max-w-xl leading-relaxed">
          Methodical Approach. Real-World Solutions.
        </p>

        {/* Trust Indicators */}
        <div className="flex flex-wrap items-center justify-center gap-3 mt-6 text-xs md:text-sm text-zinc-600">
          <span>+15 Projects Delivered</span>
          <span className="text-zinc-800">•</span>
          <span>+5 Satisfied Clients</span>
          <span className="text-zinc-800">•</span>
          <span>2+ Years Experience</span>
        </div>

        {/* Location */}
        <div className="flex items-center gap-2 mt-3 text-xs md:text-sm text-zinc-600">
          <MapPin className="w-3 h-3 md:w-4 md:h-4" />
          <span>Corrientes, Argentina</span>
          <span className="text-zinc-800">|</span>
          <span>Remote Services Available</span>
        </div>

        {/* Botones simples */}
        <div className="flex gap-4 mt-10">
          <a
            href="#services"
            className="px-6 py-3 text-sm font-medium text-zinc-300 bg-white/10 border border-zinc-700 rounded-lg hover:bg-white/20 hover:border-zinc-500 transition-colors"
          >
            View Services
          </a>
          <a
            href="#contact"
            className="px-6 py-3 text-sm font-medium text-black bg-white rounded-lg hover:bg-zinc-100 transition-colors"
          >
            Get in Touch
          </a>
        </div>
      </div>

      {/* Líneas decorativas estáticas */}
      <div className="absolute top-0 w-screen h-px bg-gradient-to-r from-zinc-300/0 via-zinc-300/50 to-zinc-300/0" />
      <div className="absolute bottom-0 w-screen h-px bg-gradient-to-r from-zinc-300/0 via-zinc-300/50 to-zinc-300/0" />
    </section>
  );
}
