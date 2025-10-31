import { Download, FileText, File } from "lucide-react";

export default function ResumeDownloadStatic() {
  return (
    <section id="resume" className="relative py-20 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-16">
          <h2
            className="text-4xl md:text-5xl font-display 
                       text-zinc-950 dark:text-zinc-50 
                       mb-4 transition-colors"
          >
            Resume & CV
          </h2>
          <div
            className="w-20 h-1 
                        bg-linear-to-r from-transparent 
                        via-zinc-400 dark:via-zinc-300 
                        to-transparent 
                        mx-auto mb-4"
          />
          <p
            className="text-zinc-600 dark:text-zinc-400 
                      max-w-2xl mx-auto transition-colors"
          >
            Download my professional resume
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 max-w-2xl mx-auto">
          {/* English Resume */}
          <div
            className="p-6 
                        bg-black/5 dark:bg-white/5 
                        border border-zinc-200 dark:border-zinc-800 
                        rounded-lg 
                        hover:border-zinc-400 dark:hover:border-zinc-700 
                        hover:bg-black/10 dark:hover:bg-white/10 
                        transition-all duration-300"
          >
            <div className="flex flex-col items-center text-center">
              <div
                className="p-4 
                            bg-zinc-100 dark:bg-zinc-900 
                            border border-zinc-200 dark:border-zinc-800 
                            rounded-lg mb-4 transition-colors"
              >
                <FileText
                  className="w-8 h-8 
                                   text-zinc-600 dark:text-zinc-400 
                                   transition-colors"
                />
              </div>
              <h3
                className="text-xl 
                           text-zinc-950 dark:text-zinc-50 
                           font-semibold mb-2 transition-colors"
              >
                Resume (English)
              </h3>
              <p
                className="text-sm 
                          text-zinc-600 dark:text-zinc-400 
                          mb-6 transition-colors"
              >
                Professional resume in English format
              </p>
              <a
                href="/resume/geronimo-serial-resume-en.pdf"
                download
                className="flex items-center gap-2 px-6 py-3 text-sm font-medium 
                         text-white dark:text-black 
                         bg-black dark:bg-white 
                         rounded-lg 
                         hover:bg-zinc-800 dark:hover:bg-zinc-100 
                         transition-colors w-full justify-center"
              >
                <Download className="w-4 h-4" />
                Download PDF
              </a>
            </div>
          </div>

          {/* Spanish CV */}
          <div
            className="p-6 
                        bg-black/5 dark:bg-white/5 
                        border border-zinc-200 dark:border-zinc-800 
                        rounded-lg 
                        hover:border-zinc-400 dark:hover:border-zinc-700 
                        hover:bg-black/10 dark:hover:bg-white/10 
                        transition-all duration-300"
          >
            <div className="flex flex-col items-center text-center">
              <div
                className="p-4 
                            bg-zinc-100 dark:bg-zinc-900 
                            border border-zinc-200 dark:border-zinc-800 
                            rounded-lg mb-4 transition-colors"
              >
                <File
                  className="w-8 h-8 
                               text-zinc-600 dark:text-zinc-400 
                               transition-colors"
                />
              </div>
              <h3
                className="text-xl 
                           text-zinc-950 dark:text-zinc-50 
                           font-semibold mb-2 transition-colors"
              >
                CV (Español)
              </h3>
              <p
                className="text-sm 
                          text-zinc-600 dark:text-zinc-400 
                          mb-6 transition-colors"
              >
                Currículum vitae en formato español
              </p>
              <a
                href="/resume/geronimo-serial-cv-es.pdf"
                download
                className="flex items-center gap-2 px-6 py-3 text-sm font-medium 
                         text-white dark:text-black 
                         bg-black dark:bg-white 
                         rounded-lg 
                         hover:bg-zinc-800 dark:hover:bg-zinc-100 
                         transition-colors w-full justify-center"
              >
                <Download className="w-4 h-4" />
                Descargar PDF
              </a>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-12 text-center">
          <p
            className="text-sm 
                      text-zinc-500 dark:text-zinc-500 
                      mb-4 transition-colors"
          >
            Last updated: December 2024
          </p>
          <p
            className="text-xs 
                      text-zinc-400 dark:text-zinc-600 
                      transition-colors"
          >
            For custom formats or additional information, please{" "}
            <a
              href="#contact"
              className="text-zinc-600 dark:text-zinc-400 
                                        hover:text-zinc-900 dark:hover:text-zinc-100 
                                        transition-colors"
            >
              contact me
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
