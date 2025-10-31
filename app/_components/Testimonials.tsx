import { Star } from 'lucide-react';

export default function TestimonialsStatic() {
  const testimonials = [
    {
      name: 'Juan Pérez',
      role: 'CEO, Tech Solutions',
      content: 'Excellent work on our company website. Professional, timely, and exceeded expectations.',
      rating: 5,
    },
    {
      name: 'María González',
      role: 'Product Manager, StartupXYZ',
      content: 'The automation tools developed have saved us countless hours. Highly recommended.',
      rating: 5,
    },
    {
      name: 'Carlos Rodríguez',
      role: 'CTO, Innovation Labs',
      content: 'Outstanding technical expertise and problem-solving skills. A pleasure to work with.',
      rating: 5,
    },
  ];

  return (
    <section id="testimonials" className="relative min-h-screen py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-display text-zinc-50 mb-4">
            What Clients Say
          </h2>
          <div className="w-20 h-1 bg-linear-to-r from-transparent via-zinc-300 to-transparent mx-auto mb-4" />
          <p className="text-zinc-400 max-w-2xl mx-auto">
            Testimonials from satisfied clients
          </p>
        </div>

        {/* Grid de testimonials */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <article
              key={testimonial.name}
              className="p-6 bg-white/5 border border-zinc-800 rounded-lg"
            >
              {/* Estrellas */}
              <div className="flex gap-1 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-zinc-400 text-zinc-400" />
                ))}
              </div>

              {/* Content */}
              <p className="text-zinc-300 mb-6 leading-relaxed">
                "{testimonial.content}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-3 pt-4 border-t border-zinc-800">
                <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center">
                  <span className="text-sm font-medium text-zinc-400">
                    {testimonial.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-medium text-zinc-100">
                    {testimonial.name}
                  </p>
                  <p className="text-xs text-zinc-500">
                    {testimonial.role}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
