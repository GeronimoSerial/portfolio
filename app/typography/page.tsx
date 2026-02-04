import Link from "next/link";

export default function TypographyShowcase() {
  const sections = [
    {
      name: "Inter",
      fontClass: "font-inter",
      description: "Moderna, limpia y legible. Usada por Vercel, Linear, GitHub.",
      color: "text-blue-400",
    },
    {
      name: "Space Grotesk",
      fontClass: "font-space-grotesk",
      description: "Geométrica con carácter futurista. Perfecta para tech portfolios.",
      color: "text-purple-400",
    },
    {
      name: "JetBrains Mono",
      fontClass: "font-jetbrains-mono",
      description: "Monospace moderna. Transmite programación y desarrollo.",
      color: "text-green-400",
    },
    {
      name: "Outfit",
      fontClass: "font-outfit",
      description: "Geométrica redondeada. Moderna pero accesible y amigable.",
      color: "text-orange-400",
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="mb-16 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Selección Tipográfica
          </h1>
          <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
            Elige la tipografía que mejor represente tu identidad tecnológica. 
            Cada opción transmite una sensación diferente.
          </p>
        </div>

        <div className="space-y-16">
          {sections.map((section) => (
            <div
              key={section.name}
              className="border border-zinc-800 rounded-2xl p-8 md:p-12 hover:border-zinc-700 transition-colors"
            >
              <div className="flex items-center gap-3 mb-6">
                <span className={`text-sm font-mono ${section.color}`}>
                  {section.name}
                </span>
              </div>

              <div className={section.fontClass}>
                <h2 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
                  Soluciones
                  <br />
                  Tecnológicas
                </h2>
                <p className="text-xl md:text-2xl text-zinc-400 mb-8 max-w-3xl leading-relaxed">
                  Desarrollo web profesional con Next.js, React y TypeScript. 
                  Transformando ideas en productos digitales escalables.
                </p>
              </div>

              <div className="flex flex-wrap gap-4 text-sm text-zinc-500">
                <span className="px-3 py-1 bg-zinc-900 rounded-full">
                  {section.description}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-white text-black rounded-full font-medium hover:bg-zinc-200 transition-colors"
          >
            Volver al inicio
          </Link>
        </div>
      </div>
    </div>
  );
}
