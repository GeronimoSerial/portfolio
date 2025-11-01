import { MapPin } from "lucide-react";

export default function HeroStatic() {
  return (
    <section
      id="hero"
      className=" relative flex flex-col items-center justify-center w-full min-h-screen px-4"
    >
      <div className="z-10 flex flex-col items-center text-center">
        {/* Título principal */}
        <div className="mb-6">
          <h1
            className="text-6xl md:text-9xl font-display 
                       text-zinc-950 dark:text-white
                       transition-colors animate-hero-reveal"
          >
            geroserial.com
          </h1>
        </div>

        <h2
          className="text-sm md:text-lg 
                     text-zinc-700 dark:text-zinc-300 
                     max-w-3xl
                     transition-colors"
        >
          IT Specialist · Infrastructure, Automation & Web Systems Management
        </h2>

        <p
          className="mt-4 text-sm md:text-base 
                    text-zinc-500 dark:text-zinc-500 
                    max-w-xl leading-relaxed
                    transition-colors"
        >
          Methodical Approach. Real-World Solutions.
        </p>

        {/* Trust Indicators */}
        <div
          className="flex flex-wrap items-center justify-center gap-3 mt-6 
                      text-xs md:text-sm 
                      text-zinc-400 dark:text-zinc-600
                      transition-colors"
        >
          <span>+15 Projects Delivered</span>
          <span className="text-zinc-300 dark:text-zinc-800">•</span>
          <span>+5 Satisfied Clients</span>
          <span className="text-zinc-300 dark:text-zinc-800">•</span>
          <span>2+ Years Experience</span>
        </div>

        {/* Location */}
        <div
          className="flex items-center gap-2 mt-3 
                      text-xs md:text-sm 
                      text-zinc-400 dark:text-zinc-600
                      transition-colors"
        >
          <MapPin className="w-3 h-3 md:w-4 md:h-4" />
          <span>Corrientes, Argentina</span>
          <span className="text-zinc-300 dark:text-zinc-800">|</span>
          <span>Remote Services Available</span>
        </div>

        {/* Botones simples */}
        <div className="flex gap-4 mt-10">
          <a
            href="#services"
            className="px-6 py-3 text-sm font-medium 
                     text-zinc-700 dark:text-zinc-300 
                     bg-black/10 dark:bg-white/10 
                     border border-zinc-300 dark:border-zinc-700 
                     rounded-lg 
                     hover:bg-black/20 dark:hover:bg-white/20 
                     hover:border-zinc-500 dark:hover:border-zinc-500 
                     transition-colors"
          >
            View Services
          </a>
          <a
            href="#contact"
            className="px-6 py-3 text-sm font-medium 
                     text-white dark:text-black 
                     bg-black dark:bg-white 
                     rounded-lg 
                     hover:bg-zinc-800 dark:hover:bg-zinc-100 
                     transition-colors"
          >
            Get in Touch
          </a>
        </div>
      </div>

      {/* Líneas decorativas adaptativas */}
      <div
        className="absolute top-0 w-screen h-px 
                    bg-linear-to-r 
                    from-zinc-700/0 via-zinc-700/50 to-zinc-700/0
                    dark:from-zinc-300/0 dark:via-zinc-300/50 dark:to-zinc-300/0"
      />
      <div
        className="absolute bottom-0 w-screen h-px 
                    bg-linear-to-r 
                    from-zinc-700/0 via-zinc-700/50 to-zinc-700/0
                    dark:from-zinc-300/0 dark:via-zinc-300/50 dark:to-zinc-300/0"
      />
    </section>
  );
}
