"use client";

import { motion } from "motion/react";
import { Mail, MapPin, Github, Linkedin, Calendar } from "lucide-react";

export default function ContactOpportunities() {
  return (
    <section id="contact" className="relative py-20 px-4">
      <div className="container mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-display text-zinc-50 mb-4">
            Open to Opportunities
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-transparent via-zinc-300 to-transparent mx-auto mb-4" />
          <p className="text-zinc-400 max-w-2xl mx-auto">
            Interested in full-time positions, contract work, or collaboration
            opportunities
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-6"
          >
            <div className="flex items-center gap-4 p-4 bg-white/5 border border-zinc-800 rounded-lg">
              <Mail className="w-5 h-5 text-zinc-400 flex-shrink-0" />
              <div>
                <p className="text-sm text-zinc-500 mb-1">Email</p>
                <a
                  href="mailto:contacto@geroserial.com"
                  className="text-zinc-300 hover:text-white transition-colors"
                >
                  contacto@geroserial.com
                </a>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 bg-white/5 border border-zinc-800 rounded-lg">
              <MapPin className="w-5 h-5 text-zinc-400 flex-shrink-0" />
              <div>
                <p className="text-sm text-zinc-500 mb-1">Location</p>
                <p className="text-zinc-300">Corrientes, Argentina</p>
                <p className="text-xs text-zinc-500 mt-1">
                  Open to remote opportunities worldwide
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <a
                href="https://github.com/geroserial"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 p-3 bg-white/5 border border-zinc-800 rounded-lg hover:border-zinc-500 hover:bg-white/10 transition-all duration-200"
              >
                <Github className="w-5 h-5 text-zinc-400" />
                <span className="text-sm text-zinc-300">GitHub</span>
              </a>
              <a
                href="https://linkedin.com/in/geroserial"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 p-3 bg-white/5 border border-zinc-800 rounded-lg hover:border-zinc-500 hover:bg-white/10 transition-all duration-200"
              >
                <Linkedin className="w-5 h-5 text-zinc-400" />
                <span className="text-sm text-zinc-300">LinkedIn</span>
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="space-y-6"
          >
            <div className="p-6 bg-white/5 border border-zinc-800 rounded-lg">
              <h3 className="text-lg font-display text-zinc-50 mb-4">
                What I'm Looking For
              </h3>
              <ul className="space-y-3 text-sm text-zinc-400">
                <li className="flex items-start gap-2">
                  <span className="text-zinc-600 mt-1">•</span>
                  <span>
                    Full-time or contract roles in full-stack development
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-zinc-600 mt-1">•</span>
                  <span>
                    Infrastructure and system architecture opportunities
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-zinc-600 mt-1">•</span>
                  <span>
                    Technical consulting or advisory positions
                  </span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-zinc-600 mt-1">•</span>
                  <span>Remote-first companies with global teams</span>
                </li>
              </ul>
            </div>

            <div className="p-6 bg-white/5 border border-zinc-800 rounded-lg">
              <h3 className="text-lg font-display text-zinc-50 mb-3">
                Availability
              </h3>
              <p className="text-sm text-zinc-400 mb-4">
                Currently employed, but open to discussing new opportunities.
                Available for interviews and can start within 30 days notice.
              </p>
              <a
                href="mailto:contacto@geroserial.com?subject=Career Opportunity"
                className="flex items-center justify-center gap-2 w-full px-6 py-3 text-sm font-medium text-black bg-white rounded-lg hover:bg-zinc-100 transition-colors"
              >
                <Calendar className="w-4 h-4" />
                Schedule Interview
              </a>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center pt-8 border-t border-zinc-800"
        >
          <p className="text-sm text-zinc-500">
            © {new Date().getFullYear()} Geronimo Serial. All rights reserved.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
