"use client";

import { useTranslations } from "next-intl";
import { Project } from "@/types";
import { useRef } from "react";
import Link from "next/link";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import { useStaggerReveal, useMagneticEffect } from "@/hooks/useGsapAnimations";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

function ProjectCard({ project, className, index }: { project: Project; className?: string; index: number }) {
  const containerRef = useMagneticEffect<HTMLAnchorElement>(0.3);
  
  useGSAP(() => {
    const card = containerRef.current;
    if(!card) return;
    
    // Hover effect: Scale up + darken bg
    const tl = gsap.timeline({ paused: true });
    tl.to(card.querySelector('.project-bg'), { scale: 1.05, duration: 0.5, ease: "power2.out" })
      .to(card.querySelector('.project-overlay'), { opacity: 0.8, duration: 0.3 }, 0)
      .to(card.querySelector('.project-info'), { y: 0, opacity: 1, duration: 0.4 }, 0.1);

    const onMouseEnter = () => tl.play();
    const onMouseLeave = () => tl.reverse();

    card.addEventListener('mouseenter', onMouseEnter);
    card.addEventListener('mouseleave', onMouseLeave);
    
    return () => {
        card.removeEventListener('mouseenter', onMouseEnter);
        card.removeEventListener('mouseleave', onMouseLeave);
    }
  }, { scope: containerRef });

  return (
    <Link 
        href={`/projects/${project.slug}`} 
        className={`project-card relative block overflow-hidden rounded-xl bg-zinc-900 border border-white/5 group ${className}`}
        ref={containerRef}
    >
      <div className="project-bg absolute inset-0 bg-gradient-to-br from-zinc-800 to-black transition-colors duration-500" />
      
      <div className="project-overlay absolute inset-0 bg-black/40 opacity-0 transition-opacity duration-300" />

      <div className="relative z-10 h-full p-6 md:p-8 flex flex-col justify-between">
        <div className="flex justify-between items-start">
            <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground/60 mix-blend-difference">
                {String(index + 1).padStart(2, '0')}
            </span>
            <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/50 backdrop-blur-sm">
                <ArrowUpRight className="w-4 h-4 text-white" />
            </div>
        </div>
        
        <div className="project-info translate-y-4 opacity-80 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
             <h3 className="font-display text-2xl md:text-3xl font-bold uppercase tracking-tight text-white mb-2">
                {project.title}
             </h3>
             <p className="text-sm text-zinc-400 line-clamp-2 max-w-[90%] font-light">
                {project.description}
             </p>
        </div>
      </div>
    </Link>
  );
}

export default function ProjectsGrid({ projectsData }: { projectsData: Project[] }) {
  const t = useTranslations("cases");
  const containerRef = useStaggerReveal<HTMLDivElement>({ selector: ".project-card", stagger: 0.1 });
  
  // Tomar los primeros 6 proyectos
  const projects = projectsData.slice(0, 6);

  // Configuración de Layout Asimétrico (Bento Grid)
  const getClassForIndex = (index: number) => {
    switch(index) {
        case 0: return "md:col-span-2 md:row-span-2 min-h-[400px]"; // Hero project
        case 1: return "md:col-span-1 md:row-span-1 min-h-[300px]";
        case 2: return "md:col-span-1 md:row-span-1 min-h-[300px]";
        case 3: return "md:col-span-1 md:row-span-1 min-h-[300px]";
        case 4: return "md:col-span-1 md:row-span-1 min-h-[300px]";
        case 5: return "md:col-span-3 min-h-[250px]"; // Footer project
        default: return "md:col-span-1";
    }
  };

  return (
    <section id="cases" className="py-32 px-6 md:px-12 bg-background border-b border-white/5">
       <div className="max-w-7xl mx-auto">
          <div className="mb-20 flex flex-col md:flex-row justify-between items-end gap-8">
             <div>
                <h2 className="text-5xl md:text-7xl font-display font-bold uppercase tracking-tight text-foreground leading-none">
                    {t("title")}
                </h2>
             </div>
             <p className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground/60 max-w-md text-right">
                {t("subtitle")}
             </p>
          </div>
          
          <div ref={containerRef} className="grid grid-cols-1 md:grid-cols-3 gap-4 auto-rows-min">
             {projects.map((project, index) => (
                <ProjectCard 
                    key={project.slug} 
                    project={project} 
                    index={index} 
                    className={getClassForIndex(index)}
                />
             ))}
          </div>
          
          <div className="mt-16 flex justify-center">
             <Link href="/projects" className="inline-flex items-center gap-3 text-sm font-mono uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground transition-colors p-4 group">
                {t("cta")} <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
             </Link>
          </div>
       </div>
    </section>
  );
}
