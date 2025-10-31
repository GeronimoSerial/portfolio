"use client";

import { motion } from "motion/react";
import { useSectionInView } from "@/hooks/useSectionInView";
import { Search, Layers, Code, Rocket } from "lucide-react";

export default function Process() {
  const { ref, inView } = useSectionInView();

  const steps = [
    {
      icon: Search,
      number: "01",
      title: "Discovery & Analysis",
      description: "Understanding your business challenges and technical requirements",
      items: [
        "Requirements gathering",
        "Technical audit (if applicable)",
        "Solution proposal & roadmap",
      ],
    },
    {
      icon: Layers,
      number: "02",
      title: "Architecture Design",
      description: "Planning scalable and maintainable solutions",
      items: [
        "System architecture diagram",
        "Technology stack selection",
        "Implementation timeline",
      ],
    },
    {
      icon: Code,
      number: "03",
      title: "Agile Development",
      description: "Iterative development with continuous feedback",
      items: [
        "2-week sprints",
        "Progressive demos",
        "Continuous testing & QA",
      ],
    },
    {
      icon: Rocket,
      number: "04",
      title: "Deployment & Support",
      description: "Controlled launch with ongoing assistance",
      items: [
        "Staged rollout",
        "Technical documentation",
        "30-day post-launch support",
      ],
    },
  ];

  return (
    <section id="process" ref={ref} className="relative min-h-screen py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-display text-zinc-50 mb-4">
            How I Work
          </h2>
          <div className="w-20 h-1 bg-gradient-to-r from-transparent via-zinc-300 to-transparent mx-auto mb-4" />
          <p className="text-zinc-400 max-w-2xl mx-auto">
            Proven methodology for predictable results
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="relative p-6 bg-white/5 border border-zinc-800 rounded-lg hover:border-zinc-700 transition-all duration-300"
              >
                <div className="mb-4">
                  <span className="text-5xl font-display text-zinc-800">
                    {step.number}
                  </span>
                </div>

                <div className="mb-4">
                  <Icon className="w-8 h-8 text-zinc-400" />
                </div>

                <h3 className="text-xl text-zinc-50 mb-2">{step.title}</h3>
                <p className="text-sm text-zinc-400 mb-4">
                  {step.description}
                </p>

                <ul className="space-y-2">
                  {step.items.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2 text-sm text-zinc-500"
                    >
                      <span className="text-zinc-700 mt-1">•</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-center mt-12"
        >
          <p className="text-sm text-zinc-500">
            Methodical Approach. Real-World Solutions.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
