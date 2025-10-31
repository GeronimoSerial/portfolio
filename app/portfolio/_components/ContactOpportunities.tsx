import { Mail, MapPin, Github, Linkedin, Calendar } from 'lucide-react';

export default function ContactOpportunitiesStatic() {
  return (
    <section id="contact" className="relative py-20 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-display text-zinc-50 mb-4">
            Let's Connect
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-transparent via-zinc-300 to-transparent mx-auto mb-4" />
          <p className="text-zinc-400 max-w-2xl mx-auto">
            Open to new opportunities and collaborations
          </p>
        </div>

        {/* Contact Info Grid */}
        <div className="grid md:grid-cols-2 gap-6 mb-12">
          <a
            href="mailto:contacto@geroserial.com"
            className="p-6 bg-white/5 border border-zinc-800 rounded-lg hover:border-zinc-700 hover:bg-white/10 transition-all duration-300"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-lg">
                <Mail className="w-5 h-5 text-zinc-400" />
              </div>
              <div>
                <p className="text-xs text-zinc-500 mb-1">Email</p>
                <p className="text-sm text-zinc-100">contacto@geroserial.com</p>
              </div>
            </div>
          </a>

          <div className="p-6 bg-white/5 border border-zinc-800 rounded-lg">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-lg">
                <MapPin className="w-5 h-5 text-zinc-400" />
              </div>
              <div>
                <p className="text-xs text-zinc-500 mb-1">Location</p>
                <p className="text-sm text-zinc-100">Corrientes, Argentina</p>
              </div>
            </div>
          </div>

          <a
            href="https://github.com/geroserial"
            target="_blank"
            rel="noopener noreferrer"
            className="p-6 bg-white/5 border border-zinc-800 rounded-lg hover:border-zinc-700 hover:bg-white/10 transition-all duration-300"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-lg">
                <Github className="w-5 h-5 text-zinc-400" />
              </div>
              <div>
                <p className="text-xs text-zinc-500 mb-1">GitHub</p>
                <p className="text-sm text-zinc-100">@geroserial</p>
              </div>
            </div>
          </a>

          <a
            href="https://linkedin.com/in/geroserial"
            target="_blank"
            rel="noopener noreferrer"
            className="p-6 bg-white/5 border border-zinc-800 rounded-lg hover:border-zinc-700 hover:bg-white/10 transition-all duration-300"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-lg">
                <Linkedin className="w-5 h-5 text-zinc-400" />
              </div>
              <div>
                <p className="text-xs text-zinc-500 mb-1">LinkedIn</p>
                <p className="text-sm text-zinc-100">Geronimo Serial</p>
              </div>
            </div>
          </a>
        </div>

        {/* Availability Card */}
        <div className="p-8 bg-gradient-to-br from-white/10 to-white/5 border border-zinc-700 rounded-lg text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Calendar className="w-5 h-5 text-zinc-300" />
            <h3 className="text-xl text-zinc-50 font-semibold">
              Currently Available
            </h3>
          </div>
          <p className="text-zinc-300 mb-6 max-w-xl mx-auto">
            I'm open to freelance projects, consulting opportunities, and full-time positions.
            Let's discuss how I can help bring your ideas to life.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href="mailto:contacto@geroserial.com"
              className="px-6 py-3 text-sm font-medium text-black bg-white rounded-lg hover:bg-zinc-100 transition-colors"
            >
              Send Email
            </a>
            <a
              href="#resume"
              className="px-6 py-3 text-sm font-medium text-white bg-white/10 border border-zinc-700 rounded-lg hover:bg-white/20 hover:border-zinc-500 transition-all"
            >
              View Resume
            </a>
          </div>
        </div>

        {/* Footer Note */}
        <div className="mt-12 text-center">
          <p className="text-sm text-zinc-500">
            Response time: Usually within 24-48 hours
          </p>
        </div>
      </div>
    </section>
  );
}
