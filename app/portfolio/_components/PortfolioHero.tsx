import { MapPin, Download, Linkedin, Github, Mail } from 'lucide-react';

export default function PortfolioHeroStatic() {
  return (
    <section
      id="hero"
      className="relative pt-32 pb-20 px-4 min-h-[60vh] flex items-center"
    >
      <div className="container mx-auto max-w-4xl">
        <div className="text-center">
          <h1 className="text-5xl md:text-7xl font-display text-zinc-50 mb-4">
            Geronimo Serial
          </h1>

          <p className="text-xl md:text-2xl text-zinc-400 mb-6">
            Systems Analyst & Full Stack Developer
          </p>

          <div className="flex items-center justify-center gap-2 text-zinc-500 mb-8">
            <MapPin className="w-4 h-4" />
            <span className="text-sm">Corrientes, Argentina</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 mb-8">
            <a
              href="mailto:contacto@geroserial.com"
              className="flex items-center gap-2 px-4 py-2 text-sm text-zinc-300 bg-white/5 border border-zinc-800 rounded-lg hover:bg-white/10 hover:border-zinc-500 transition-all"
            >
              <Mail className="w-4 h-4" />
              contacto@geroserial.com
            </a>

            <a
              href="https://github.com/geroserial"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 text-sm text-zinc-300 bg-white/5 border border-zinc-800 rounded-lg hover:bg-white/10 hover:border-zinc-500 transition-all"
            >
              <Github className="w-4 h-4" />
              GitHub
            </a>

            <a
              href="https://linkedin.com/in/geroserial"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 text-sm text-zinc-300 bg-white/5 border border-zinc-800 rounded-lg hover:bg-white/10 hover:border-zinc-500 transition-all"
            >
              <Linkedin className="w-4 h-4" />
              LinkedIn
            </a>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href="#resume"
              className="flex items-center gap-2 px-6 py-3 text-sm font-medium text-black bg-white rounded-lg hover:bg-zinc-100 transition-colors"
            >
              <Download className="w-4 h-4" />
              Download Resume
            </a>

            <a
              href="#contact"
              className="px-6 py-3 text-sm font-medium text-white bg-white/10 border border-zinc-700 rounded-lg hover:bg-white/20 hover:border-zinc-500 transition-all"
            >
              Open to Opportunities
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
