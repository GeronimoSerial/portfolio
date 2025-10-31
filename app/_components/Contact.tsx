import { Mail, MapPin, Github, Linkedin } from 'lucide-react';

export default function ContactStatic() {
  const contactInfo = [
    {
      icon: Mail,
      label: 'Email',
      value: 'contact@geroserial.com',
      href: 'mailto:contact@geroserial.com',
    },
    {
      icon: MapPin,
      label: 'Location',
      value: 'Corrientes, Argentina',
      href: null,
    },
    {
      icon: Github,
      label: 'GitHub',
      value: '@GeronimoSerial',
      href: 'https://github.com/GeronimoSerial',
    },
    {
      icon: Linkedin,
      label: 'LinkedIn',
      value: 'Geronimo Serial',
      href: 'https://linkedin.com/in/geronimoserial',
    },
  ];

  return (
    <section id="contact" className="relative min-h-screen py-20 px-4">
      <div className="container mx-auto max-w-4xl">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-display text-zinc-50 mb-4">
            Get in Touch
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-transparent via-zinc-300 to-transparent mx-auto mb-4" />
          <p className="text-zinc-400 max-w-2xl mx-auto">
            Let's discuss your next project
          </p>
        </div>

        {/* Contact Info Grid */}
        <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
          {contactInfo.map((info) => {
            const Icon = info.icon;
            const content = (
              <div className="p-6 bg-white/5 border border-zinc-800 rounded-lg hover:border-zinc-700 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-zinc-900 border border-zinc-800 rounded-lg">
                    <Icon className="w-5 h-5 text-zinc-400" />
                  </div>
                  <div>
                    <p className="text-xs text-zinc-500 mb-1">{info.label}</p>
                    <p className="text-sm text-zinc-100">{info.value}</p>
                  </div>
                </div>
              </div>
            );

            return info.href ? (
              <a key={info.label} href={info.href} target="_blank" rel="noopener noreferrer">
                {content}
              </a>
            ) : (
              <div key={info.label}>{content}</div>
            );
          })}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <p className="text-zinc-500 mb-4">
            Available for freelance projects and consulting opportunities
          </p>
          <a
            href="mailto:contact@geroserial.com"
            className="inline-block px-6 py-3 text-sm font-medium text-black bg-white rounded-lg hover:bg-zinc-100 transition-colors"
          >
            Send Email
          </a>
        </div>
      </div>
    </section>
  );
}
