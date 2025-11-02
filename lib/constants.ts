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
    description: "Expert technical guidance for complex challenges",
    features: [
      "Code audits & reviews",
      "Software architecture design",
      "System optimization",
      "Best practices implementation",
    ],
    price: "From $xxx USD",
  },
  {
    icon: Wrench,
    title: "IT Technical Support",
    description: "Ongoing maintenance and incident resolution",
    features: [
      "Preventive maintenance",
      "Incident resolution",
      "System monitoring",
      "Technical training",
    ],
    price: "From $xxx USD/month",
  },
  {
    icon: TrendingUp,
    title: "Digital Transformation",
    description: "Modernize business processes and infrastructure",
    features: [
      "Digital strategy planning",
      "Cloud migration",
      "Process automation",
      "Data analytics implementation",
    ],
    price: "Custom Quote",
  },
  {
    icon: Code,
    title: "Full Stack Web Development",
    description: "Scalable web applications built with modern technologies",
    features: [
      "Responsive web applications",
      "Robust RESTful APIs",
      "Third-party integrations",
      "Performance optimization",
    ],
    price: "From $xxx USD",
  },
];
