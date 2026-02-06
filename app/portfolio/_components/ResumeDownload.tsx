import { Download, FileText } from "lucide-react";

const documents = [
  {
    title: "CV (EN)",
    href: "https://geronimoserial.github.io/pdf-cge/english_resume.pdf",
    cta: "Descargar PDF",
  },
  {
    title: "CV (ES)",
    href: "https://geronimoserial.github.io/pdf-cge/Curriculum%2027-10.pdf",
    cta: "Descargar PDF",
  },
];

export default function ResumeDownload() {
  return (
    <section id="resume" className="relative px-4 pt-20 pb-28">
      <div className="container mx-auto max-w-6xl">
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-8 md:p-10">
          <div className="mb-8 max-w-3xl space-y-4">
            <p className="text-sm tracking-wide text-zinc-500">
              Currículum Vitae
            </p>
            <h2 className="text-3xl font-semibold tracking-tight text-zinc-100 md:text-4xl">
              Descarga de CV
            </h2>
            <p className="text-zinc-400">
              Podés ver o descargar mi currículum formato PDF en español e
              ingles.
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            {documents.map((doc) => (
              <article
                key={doc.title}
                className="rounded-xl border border-white/10 bg-white/[0.02] p-5"
              >
                <div className="mb-4 flex items-start gap-3">
                  <div className="rounded-lg border border-white/10 bg-white/[0.02] p-2.5">
                    <FileText className="h-5 w-5 text-zinc-300" />
                  </div>
                  <div>
                    <h3 className="text-base font-medium text-zinc-100">
                      {doc.title}
                    </h3>
                  </div>
                </div>

                <a
                  href={doc.href}
                  download
                  className="inline-flex items-center gap-2 rounded-lg border border-white/15 px-4 py-2 text-sm font-medium text-zinc-200 transition-colors hover:border-white/30 hover:bg-white/5"
                >
                  <Download className="h-4 w-4" />
                  {doc.cta}
                </a>
              </article>
            ))}
          </div>

          <p className="mt-8 text-xs text-zinc-500">
            Actualizado: septiembre 2025.
          </p>
        </div>
      </div>
    </section>
  );
}
