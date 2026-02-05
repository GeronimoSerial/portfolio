import { Button } from "@/components/ui/button";
import { ArrowUpRight, Github, Linkedin, Mail, MapPin } from "lucide-react";

const channels = [
  {
    label: "Correo",
    value: "contacto@geroserial.com",
    href: "mailto:contacto@geroserial.com",
    icon: Mail,
  },
  {
    label: "GitHub",
    value: "@geroserial",
    href: "https://github.com/geroserial",
    icon: Github,
  },
  {
    label: "LinkedIn",
    value: "Geronimo Serial",
    href: "https://linkedin.com/in/geroserial",
    icon: Linkedin,
  },
];

export default function ContactOpportunities() {
  return (
    <section id="contact" className="relative px-4 py-20">
      <div className="container mx-auto max-w-6xl">
        <div className="mb-12 max-w-3xl space-y-4">
          <p className="text-sm tracking-wide text-zinc-500">Contacto</p>
          <h2 className="text-3xl font-semibold tracking-tight text-zinc-100 md:text-4xl">
            Estoy disponible para nuevos desafios
          </h2>
          <p className="text-zinc-400">
            Si queres conversar una colaboracion, consultoria o posicion,
            escribime por correo o LinkedIn.
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <div className="space-y-4">
              {channels.map((channel) => (
                <a
                  key={channel.label}
                  href={channel.href}
                  target={
                    channel.href.startsWith("http") ? "_blank" : undefined
                  }
                  rel={
                    channel.href.startsWith("http")
                      ? "noopener noreferrer"
                      : undefined
                  }
                  className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.02] p-4 transition-colors hover:border-white/20 hover:bg-white/[0.04]"
                >
                  <div className="flex items-center gap-3">
                    <div className="rounded-lg border border-white/10 bg-white/[0.02] p-2.5">
                      <channel.icon className="h-5 w-5 text-zinc-300" />
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wide text-zinc-500">
                        {channel.label}
                      </p>
                      <p className="text-sm text-zinc-200">{channel.value}</p>
                    </div>
                  </div>
                  <ArrowUpRight className="h-4 w-4 text-zinc-500" />
                </a>
              ))}
            </div>
          </div>

          <aside className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <div className="mb-4 flex items-center gap-2 text-zinc-300">
              <MapPin className="h-4 w-4" />
              <span className="text-sm">Corrientes, Argentina</span>
            </div>
            <p className="text-sm leading-relaxed text-zinc-400">
              Respuesta clara y directa para que puedas decidir rapido los
              siguientes pasos.
            </p>
            <a
              href="#"
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-zinc-100 px-4 py-2 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-200"
            >
              Enviar mensaje
              <ArrowUpRight className="h-4 w-4" />
            </a>
          </aside>
        </div>
      </div>
    </section>
  );
}
