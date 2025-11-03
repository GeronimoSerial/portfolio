// // Shared constants across the application

import { Lightbulb, Wrench, TrendingUp, Code } from "lucide-react";

// export const ANIMATION_DURATION = {
//   FAST: 150,
//   DEFAULT: 300,
//   SLOW: 500,
//   VERY_SLOW: 1000,
// } as const;

// export const BREAKPOINTS = {
//   SM: 640,
//   MD: 768,
//   LG: 1024,
//   XL: 1280,
//   "2XL": 1536,
// } as const;

// export const Z_INDEX = {
//   PARTICLES: -10,
//   BASE: 0,
//   DROPDOWN: 10,
//   STICKY: 20,
//   MODAL_BACKDROP: 40,
//   MODAL: 50,
//   TOOLTIP: 60,
// } as const;
export const services = [
  {
    icon: Lightbulb,
    title: "Technology Consulting",
    description: "Transform ideas into effective digital solutions.",
    features: [
      "Evaluation of current systems and tools",
      "Customized technology strategies",
      "Improvement of workflows and efficiency",
      "Practical guidance for decision-making",
    ],
    price: "From $xxx USD",
  },
  {
    icon: Wrench,
    title: "IT Support & Maintenance",
    description: "Reliable assistance to keep your systems running smoothly.",
    features: [
      "Preventive maintenance and updates",
      "Problem solving and incident response",
      "System monitoring and optimization",
      "Staff training and support",
    ],
    price: "From $xxx USD/month",
  },
  {
    icon: TrendingUp,
    title: "Digital Transformation",
    description: "Upgrade your business with modern tools and automation.",
    features: [
      "Digital strategy design",
      "Cloud solutions setup",
      "Automation of manual processes",
      "Data analysis for better decisions",
    ],
    price: "Custom Quote",
  },
  {
    icon: Code,
    title: "Website & Web App Development",
    description:
      "Professional websites and platforms that grow with your business.",
    features: [
      "Modern and responsive design",
      "Custom features and integrations",
      "Fast performance and security",
      "Ongoing updates and scalability",
    ],
    price: "From $xxx USD",
  },
];
