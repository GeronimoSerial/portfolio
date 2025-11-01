import { Search, Layers, Code, Rocket } from "lucide-react";

export default function ProcessStatic() {
  const steps = [
    {
      icon: Search,
      number: "01",
      title: "Discovery & Analysis",
      description:
        "Understanding your business challenges and technical requirements",
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
      items: ["2-week sprints", "Progressive demos", "Continuous testing & QA"],
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
    <section id="process" className="relative min-h-screen py-20 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-16">
          <h2
            className="text-4xl md:text-5xl font-display 
                       text-zinc-950 dark:text-zinc-50 
                       mb-4 transition-colors"
          >
            How I Work
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
            Proven methodology for predictable results
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.number}
                className="relative p-6 
                         bg-black/5 dark:bg-white/5 
                         border border-zinc-200 dark:border-zinc-800 
                         rounded-lg 
                         hover:border-zinc-400 dark:hover:border-zinc-700 
                         transition-all duration-300"
              >
                <div className="mb-4">
                  <span
                    className="text-5xl font-display 
                                 text-zinc-500 dark:text-zinc-800 
                                 transition-colors"
                  >
                    {step.number}
                  </span>
                </div>

                <div className="mb-4">
                  <Icon
                    className="w-8 h-8 
                                 text-zinc-600 dark:text-zinc-400 
                                 transition-colors"
                  />
                </div>

                <h3
                  className="text-xl 
                             text-zinc-950 dark:text-zinc-50 
                             mb-2 transition-colors"
                >
                  {step.title}
                </h3>
                <p
                  className="text-sm 
                            text-zinc-600 dark:text-zinc-400 
                            mb-4 transition-colors"
                >
                  {step.description}
                </p>

                <ul className="space-y-2">
                  {step.items.map((item) => (
                    <li
                      key={item}
                      className="flex items-start gap-2 text-sm 
                               text-zinc-500 dark:text-zinc-500 
                               transition-colors"
                    >
                      <span className="text-zinc-400 dark:text-zinc-700 mt-1">
                        •
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        <div className="text-center mt-12">
          <p className="text-sm text-zinc-500 dark:text-zinc-500 transition-colors">
            Methodical Approach. Real-World Solutions.
          </p>
        </div>
      </div>
    </section>
  );
}
