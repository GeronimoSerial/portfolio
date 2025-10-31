import { Mail, MapPin, Github, Linkedin, Calendar } from 'lucide-react';

export default function ContactOpportunitiesStatic() {
  return (
    <section id="contact" className="relative py-20 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-display 
                       text-zinc-950 dark:text-zinc-50 
                       mb-4 transition-colors">
            Let's Connect
          </h2>
          <div className="w-20 h-1 
                        bg-linear-to-r from-transparent 
                        via-zinc-400 dark:via-zinc-300 
                        to-transparent 
                        mx-auto mb-4" />
          <p className="text-zinc-600 dark:text-zinc-400 
                      max-w-2xl mx-auto transition-colors">
            Open to new opportunities and collaborations
          </p>
        </div>

        {/* Contact Info Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <a
            href="mailto:contacto@geroserial.com"
            className="p-6 
                     bg-black/5 dark:bg-white/5 
                     border border-zinc-200 dark:border-zinc-800 
                     rounded-lg 
                     hover:border-zinc-400 dark:hover:border-zinc-700 
                     hover:bg-black/10 dark:hover:bg-white/10 
                     transition-all duration-300"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 
                            bg-zinc-100 dark:bg-zinc-900 
                            border border-zinc-200 dark:border-zinc-800 
                            rounded-lg transition-colors">
                <Mail className="w-5 h-5 
                               text-zinc-600 dark:text-zinc-400 
                               transition-colors" />
              </div>
              <div>
                <p className="text-xs 
                            text-zinc-500 dark:text-zinc-500 
                            mb-1 transition-colors">Email</p>
                <p className="text-sm 
                            text-zinc-900 dark:text-zinc-100 
                            transition-colors">contacto@geroserial.com</p>
              </div>
            </div>
          </a>

          <div className="p-6 
                        bg-black/5 dark:bg-white/5 
                        border border-zinc-200 dark:border-zinc-800 
                        rounded-lg transition-colors">
            <div className="flex items-center gap-4">
              <div className="p-3 
                            bg-zinc-100 dark:bg-zinc-900 
                            border border-zinc-200 dark:border-zinc-800 
                            rounded-lg transition-colors">
                <MapPin className="w-5 h-5 
                                 text-zinc-600 dark:text-zinc-400 
                                 transition-colors" />
              </div>
              <div>
                <p className="text-xs 
                            text-zinc-500 dark:text-zinc-500 
                            mb-1 transition-colors">Location</p>
                <p className="text-sm 
                            text-zinc-900 dark:text-zinc-100 
                            transition-colors">Corrientes, Argentina</p>
              </div>
            </div>
          </div>

          <a
            href="https://github.com/geroserial"
            target="_blank"
            rel="noopener noreferrer"
            className="p-6 
                     bg-black/5 dark:bg-white/5 
                     border border-zinc-200 dark:border-zinc-800 
                     rounded-lg 
                     hover:border-zinc-400 dark:hover:border-zinc-700 
                     hover:bg-black/10 dark:hover:bg-white/10 
                     transition-all duration-300"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 
                            bg-zinc-100 dark:bg-zinc-900 
                            border border-zinc-200 dark:border-zinc-800 
                            rounded-lg transition-colors">
                <Github className="w-5 h-5 
                                 text-zinc-600 dark:text-zinc-400 
                                 transition-colors" />
              </div>
              <div>
                <p className="text-xs 
                            text-zinc-500 dark:text-zinc-500 
                            mb-1 transition-colors">GitHub</p>
                <p className="text-sm 
                            text-zinc-900 dark:text-zinc-100 
                            transition-colors">@geroserial</p>
              </div>
            </div>
          </a>

          <a
            href="https://linkedin.com/in/geroserial"
            target="_blank"
            rel="noopener noreferrer"
            className="p-6 
                     bg-black/5 dark:bg-white/5 
                     border border-zinc-200 dark:border-zinc-800 
                     rounded-lg 
                     hover:border-zinc-400 dark:hover:border-zinc-700 
                     hover:bg-black/10 dark:hover:bg-white/10 
                     transition-all duration-300"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 
                            bg-zinc-100 dark:bg-zinc-900 
                            border border-zinc-200 dark:border-zinc-800 
                            rounded-lg transition-colors">
                <Linkedin className="w-5 h-5 
                                   text-zinc-600 dark:text-zinc-400 
                                   transition-colors" />
              </div>
              <div>
                <p className="text-xs 
                            text-zinc-500 dark:text-zinc-500 
                            mb-1 transition-colors">LinkedIn</p>
                <p className="text-sm 
                            text-zinc-900 dark:text-zinc-100 
                            transition-colors">Geronimo Serial</p>
              </div>
            </div>
          </a>
        </div>

        {/* Availability Card */}
        <div className="p-8 
                      bg-linear-to-br 
                      from-black/10 to-black/5
                      dark:from-white/10 dark:to-white/5 
                      border 
                      border-zinc-300 dark:border-zinc-700 
                      rounded-lg text-center transition-colors">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Calendar className="w-5 h-5 
                               text-zinc-700 dark:text-zinc-300 
                               transition-colors" />
            <h3 className="text-xl 
                         text-zinc-950 dark:text-zinc-50 
                         font-semibold transition-colors">
              Currently Available
            </h3>
          </div>
          <p className="text-zinc-700 dark:text-zinc-300 
                      mb-6 max-w-xl mx-auto transition-colors">
            I'm open to freelance projects, consulting opportunities, and full-time positions.
            Let's discuss how I can help bring your ideas to life.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href="mailto:contacto@geroserial.com"
              className="px-6 py-3 text-sm font-medium 
                       text-white dark:text-black 
                       bg-black dark:bg-white 
                       rounded-lg 
                       hover:bg-zinc-800 dark:hover:bg-zinc-100 
                       transition-colors"
            >
              Send Email
            </a>
            <a
              href="#resume"
              className="px-6 py-3 text-sm font-medium 
                       text-zinc-700 dark:text-white 
                       bg-black/10 dark:bg-white/10 
                       border border-zinc-300 dark:border-zinc-700 
                       rounded-lg 
                       hover:bg-black/20 dark:hover:bg-white/20 
                       hover:border-zinc-500 dark:hover:border-zinc-500 
                       transition-all"
            >
              View Resume
            </a>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-12 text-center">
          <p className="text-sm 
                      text-zinc-500 dark:text-zinc-500 
                      transition-colors">
            Response time: Usually within 24-48 hours
          </p>
        </div>
      </div>
    </section>
  );
}
