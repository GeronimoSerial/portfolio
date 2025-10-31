"use client";

import { motion } from "motion/react";
import { Download, FileText, File } from "lucide-react";

export default function ResumeDownload() {
  return (
    <section id="resume" className="relative py-20 px-4">
      <div className="container mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-display text-zinc-50 mb-4">
            Download Resume
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-transparent via-zinc-300 to-transparent mx-auto mb-4" />
          <p className="text-zinc-400 max-w-2xl mx-auto">
            Get a copy of my complete professional profile
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="group p-8 bg-white/5 border border-zinc-800 rounded-lg hover:border-zinc-700 transition-all duration-300 text-center"
          >
            <div className="mb-6 flex justify-center">
              <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-lg group-hover:border-zinc-700 transition-colors">
                <FileText className="w-8 h-8 text-zinc-400 group-hover:text-zinc-100 transition-colors" />
              </div>
            </div>

            <h3 className="text-xl text-zinc-50 mb-3">Full Resume</h3>
            <p className="text-sm text-zinc-400 mb-6">
              Complete professional profile with detailed experience, education,
              and skills
            </p>

            <button className="w-full flex items-center justify-center gap-2 px-6 py-3 text-sm font-medium text-black bg-white rounded-lg hover:bg-zinc-100 transition-colors">
              <Download className="w-4 h-4" />
              Download PDF
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="group p-8 bg-white/5 border border-zinc-800 rounded-lg hover:border-zinc-700 transition-all duration-300 text-center"
          >
            <div className="mb-6 flex justify-center">
              <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-lg group-hover:border-zinc-700 transition-colors">
                <File className="w-8 h-8 text-zinc-400 group-hover:text-zinc-100 transition-colors" />
              </div>
            </div>

            <h3 className="text-xl text-zinc-50 mb-3">Technical Skills Sheet</h3>
            <p className="text-sm text-zinc-400 mb-6">
              Detailed breakdown of technologies, frameworks, and tools with
              proficiency levels
            </p>

            <button className="w-full flex items-center justify-center gap-2 px-6 py-3 text-sm font-medium text-white bg-white/10 border border-zinc-700 rounded-lg hover:bg-white/20 hover:border-zinc-500 transition-all">
              <Download className="w-4 h-4" />
              Download PDF
            </button>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center mt-8"
        >
          <p className="text-sm text-zinc-500">
            Last updated: October 2025 | Available in English
          </p>
        </motion.div>
      </div>
    </section>
  );
}
