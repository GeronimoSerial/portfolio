"use client";

import { useTranslations } from "next-intl";
import { useScrollReveal, useCountUp } from "@/hooks/useGsapAnimations";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ArrowRight } from "lucide-react";

function ProofPoint({ value, label, delay }: { value: string; label: string; delay: number }) {
  // Animamos la entrada del contenedor
  const containerRef = useScrollReveal<HTMLDivElement>({ delay, y: 30 });
  
  // Animamos el número usando nuestro hook personalizado
  const countRef = useCountUp<HTMLSpanElement>(value, 2.5);

  return (
    <div ref={containerRef} className="flex flex-col items-center text-center">
      <span 
        ref={countRef}
        className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-foreground mb-2"
      >
        0
      </span>
      <span className="text-xs md:text-sm font-mono uppercase tracking-[0.2em] text-muted-foreground/60">
        {label}
      </span>
    </div>
  );
}

export default function ValueProposition() {
  const t = useTranslations("valueProposition");
  const sectionRef = useRef<HTMLElement>(null);
  
  // Orquestación de la entrada principal
  useGSAP(() => {
    const section = sectionRef.current;
    if(!section) return;
    
    const tl = gsap.timeline({
        scrollTrigger: {
            trigger: section,
            start: "top 70%",
        }
    });
    
    tl.from(".vp-headline", {
        y: 80,
        opacity: 0,
        duration: 1.2,
        ease: "power3.out"
    })
    .from(".vp-subheadline", {
        y: 40,
        opacity: 0,
        duration: 1,
        ease: "power3.out"
    }, "-=0.8")
    .from(".vp-cta", {
        y: 20,
        opacity: 0,
        duration: 0.8,
        ease: "power3.out"
    }, "-=0.6");

  }, { scope: sectionRef });

  return (
    <section 
        ref={sectionRef} 
        id="impact" 
        className="relative py-32 px-6 md:px-12 bg-background border-b border-white/5 overflow-hidden"
    >
        <div className="max-w-6xl mx-auto text-center relative z-10">
            <h2 className="vp-headline text-5xl md:text-7xl lg:text-8xl font-display font-bold uppercase tracking-tight text-foreground leading-[0.85]">
                {t("headline")}
            </h2>
            
            <p className="vp-subheadline mt-10 text-lg md:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed font-light text-balance">
                {t("subheadline")}
            </p>
            
            <div className="mt-24 flex flex-wrap justify-center gap-x-16 gap-y-12 md:gap-x-32">
                <ProofPoint 
                    value={t("proofPoints.paperless.value")} 
                    label={t("proofPoints.paperless.label")} 
                    delay={0.2}
                />
                <ProofPoint 
                    value={t("proofPoints.users.value")} 
                    label={t("proofPoints.users.label")} 
                    delay={0.4}
                />
                <ProofPoint 
                    value={t("proofPoints.uptime.value")} 
                    label={t("proofPoints.uptime.label")} 
                    delay={0.6}
                />
            </div>
            
            <div className="vp-cta mt-24">
                <a 
                    href="#cases" 
                    className="inline-flex items-center gap-3 text-xs font-mono uppercase tracking-[0.25em] text-foreground hover:text-muted-foreground transition-colors group p-4"
                >
                    {t("cta")}
                    <ArrowRight className="w-4 h-4 transition-transform duration-500 group-hover:translate-x-2" />
                </a>
            </div>
        </div>
    </section>
  );
}
