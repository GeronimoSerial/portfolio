"use client";

import { motion } from "motion/react";
import { useSectionInView } from "@/hooks/useSectionInView";
import { Mail, MapPin, Github, Linkedin, Send } from "lucide-react";
import { useState } from "react";

export default function Contact() {
  const { ref, inView } = useSectionInView();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "proyecto",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // TODO: Implement form submission logic
    console.log("Form data:", formData);
    
    // Simulate submission
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    alert("¡Mensaje enviado! Te contactaré pronto.");
    setFormData({ name: "", email: "", subject: "proyecto", message: "" });
    setIsSubmitting(false);
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <section
      id="contact"
      ref={ref}
      className="relative min-h-screen py-20 px-4 bg-black"
    >
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-display text-zinc-50 mb-4">
            Contacto
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-transparent via-zinc-300 to-transparent mx-auto mb-4" />
          <p className="text-zinc-400 max-w-2xl mx-auto">
            ¿Tienes un proyecto en mente? Hablemos sobre cómo puedo ayudarte.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-zinc-300 mb-2"
                >
                  Nombre completo *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/5 border border-zinc-800 rounded-lg text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-zinc-500 transition-colors"
                  placeholder="Tu nombre"
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-zinc-300 mb-2"
                >
                  Email *
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/5 border border-zinc-800 rounded-lg text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-zinc-500 transition-colors"
                  placeholder="tu@email.com"
                />
              </div>

              <div>
                <label
                  htmlFor="subject"
                  className="block text-sm font-medium text-zinc-300 mb-2"
                >
                  Asunto
                </label>
                <select
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white/5 border border-zinc-800 rounded-lg text-zinc-100 focus:outline-none focus:border-zinc-500 transition-colors"
                >
                  <option value="proyecto">Nuevo Proyecto</option>
                  <option value="consulta">Consulta</option>
                  <option value="soporte">Soporte Técnico</option>
                  <option value="otro">Otro</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-zinc-300 mb-2"
                >
                  Mensaje *
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  value={formData.message}
                  onChange={handleChange}
                  rows={5}
                  className="w-full px-4 py-3 bg-white/5 border border-zinc-800 rounded-lg text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-zinc-500 transition-colors resize-none"
                  placeholder="Cuéntame sobre tu proyecto..."
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full px-6 py-3 text-sm font-medium text-black bg-white rounded-lg hover:bg-zinc-100 transition-colors duration-200 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  "Enviando..."
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Enviar Mensaje
                  </>
                )}
              </button>
            </form>
          </motion.div>

          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="space-y-8"
          >
            <div>
              <h3 className="text-2xl font-display text-zinc-50 mb-6">
                Información de Contacto
              </h3>

              <div className="space-y-4">
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
                    <p className="text-sm text-zinc-500 mb-1">Ubicación</p>
                    <p className="text-zinc-300">Corrientes, Argentina</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-display text-zinc-50 mb-4">
                Redes Sociales
              </h4>
              <div className="flex gap-4">
                <a
                  href="https://github.com/geroserial"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-white/5 border border-zinc-800 rounded-lg hover:border-zinc-500 hover:bg-white/10 transition-all duration-200"
                >
                  <Github className="w-6 h-6 text-zinc-400 hover:text-white transition-colors" />
                </a>
                <a
                  href="https://linkedin.com/in/geroserial"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-white/5 border border-zinc-800 rounded-lg hover:border-zinc-500 hover:bg-white/10 transition-all duration-200"
                >
                  <Linkedin className="w-6 h-6 text-zinc-400 hover:text-white transition-colors" />
                </a>
              </div>
            </div>

            <div className="p-6 bg-white/5 border border-zinc-800 rounded-lg">
              <h4 className="text-lg font-display text-zinc-50 mb-3">
                Horario de Respuesta
              </h4>
              <p className="text-sm text-zinc-400">
                Respondo mensajes de Lunes a Viernes, de 9:00 a 18:00 (GMT-3).
                Tiempo promedio de respuesta: 24 horas.
              </p>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="text-center mt-20 pt-8 border-t border-zinc-800"
      >
        <p className="text-sm text-zinc-500">
          © {new Date().getFullYear()} Geronimo Serial. Todos los derechos reservados.
        </p>
      </motion.div>
    </section>
  );
}
