"use client";

import { useRef } from "react";
import { gsap } from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export const useProcessAnimations = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!containerRef.current) return;

      const rows = gsap.utils.toArray<HTMLDivElement>(".process-step-row");

      // Header Animation
      gsap.from(".process-header > *", {
        opacity: 0,
        y: 20,
        stagger: 0.1,
        duration: 1,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".process-header",
          start: "top 80%",
        }
      });

      rows.forEach((row, i) => {
        const textContent = row.querySelector(".process-text-content");
        const visual = row.querySelector(".process-visual-container");
        
        // Text Entrance
        gsap.from(textContent, {
          opacity: 0,
          x: -30,
          duration: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: row,
            start: "top 70%",
          }
        });

        // Visual Container Entrance
        gsap.from(visual, {
          opacity: 0,
          scale: 0.9,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: row,
            start: "top 70%",
          }
        });

        // Specific SVG Animations based on step index
        const triggerOptions = {
          trigger: row,
          start: "top 60%",
          toggleActions: "play none none reverse"
        };

        if (i === 0) { // Discover
          const scanner = row.querySelector(".discover-scanner");
          const nodes = row.querySelectorAll(".discover-node");
          const bgCircles = row.querySelectorAll(".discover-bg-circle");
          const chart = row.querySelector(".discover-chart");
          const bars = row.querySelectorAll(".discover-bar");
          const lines = row.querySelectorAll(".discover-line");
          const waves = row.querySelectorAll(".discover-wave");

          // Scanner animation - scanning down the chart
          if (scanner) {
            gsap.to(scanner, {
              y: 78,
              duration: 2.5,
              repeat: -1,
              yoyo: true,
              ease: "sine.inOut"
            });
          }

          // Background circles fade in
          gsap.from(bgCircles, {
            opacity: 0,
            scale: 0.8,
            duration: 1,
            stagger: 0.15,
            ease: "power2.out",
            scrollTrigger: triggerOptions
          });

          // Chart entrance
          if (chart) {
            gsap.from(chart, {
              opacity: 0,
              scale: 0.9,
              y: 10,
              duration: 0.8,
              ease: "power2.out",
              scrollTrigger: triggerOptions
            });
          }

          // Bars grow from bottom with stagger
          gsap.from(bars, {
            scaleY: 0,
            transformOrigin: "bottom",
            duration: 0.6,
            stagger: 0.1,
            ease: "power2.out",
            scrollTrigger: triggerOptions
          });

          // Connection lines draw in
          lines.forEach((line) => {
            const pathLine = line as SVGPathElement;
            if (pathLine.getTotalLength) {
              const len = pathLine.getTotalLength();
              gsap.fromTo(line,
                { strokeDasharray: len, strokeDashoffset: len },
                { strokeDashoffset: 0, duration: 1.2, ease: "power2.inOut", scrollTrigger: triggerOptions }
              );
            }
          });

          // Nodes pop in
          gsap.from(nodes, {
            scale: 0,
            opacity: 0,
            stagger: 0.15,
            duration: 0.5,
            ease: "back.out(1.7)",
            scrollTrigger: triggerOptions
          });

          // Wave lines subtle animation
          gsap.to(waves, {
            y: -3,
            duration: 2,
            repeat: -1,
            yoyo: true,
            ease: "sine.inOut",
            stagger: 0.3
          });
        }

        if (i === 1) { // Design
          const whiteboard = row.querySelector(".design-whiteboard");
          const gridLines = row.querySelectorAll(".design-grid-lines line");
          const chartLine = row.querySelector(".design-chart-line");
          const chartPoints = row.querySelectorAll(".design-chart-point");
          const person = row.querySelector(".design-person");
          const head = row.querySelector(".design-head");
          const body = row.querySelector(".design-body");
          const rightArm = row.querySelector(".design-arm-right");
          const marker = row.querySelector(".design-marker-body");
          const leftArm = row.querySelector(".design-arm-left");
          const legs = row.querySelectorAll(".design-leg-left, .design-leg-right");
          const shoes = row.querySelectorAll(".design-shoe-left, .design-shoe-right");
          
          // Whiteboard scales in from center
          if (whiteboard) {
            gsap.from(whiteboard, {
              scale: 0.9,
              opacity: 0,
              duration: 0.8,
              ease: "back.out(1.4)",
              scrollTrigger: triggerOptions
            });
          }
          
          // Grid lines draw in
          gridLines.forEach((line, idx) => {
            const lineEl = line as SVGLineElement;
            const len = Math.sqrt(
              Math.pow(parseFloat(lineEl.getAttribute('x2') || '0') - parseFloat(lineEl.getAttribute('x1') || '0'), 2) +
              Math.pow(parseFloat(lineEl.getAttribute('y2') || '0') - parseFloat(lineEl.getAttribute('y1') || '0'), 2)
            );
            gsap.fromTo(line, 
              { strokeDasharray: len, strokeDashoffset: len },
              { strokeDashoffset: 0, duration: 1, ease: "power2.inOut", delay: 0.2 + idx * 0.05, scrollTrigger: triggerOptions }
            );
          });
          
          // Chart line draws from left to right
          if (chartLine) {
            const pathLine = chartLine as SVGPathElement;
            const len = pathLine.getTotalLength ? pathLine.getTotalLength() : 200;
            gsap.fromTo(chartLine,
              { strokeDasharray: len, strokeDashoffset: len },
              { strokeDashoffset: 0, duration: 2, ease: "power2.inOut", delay: 0.5, scrollTrigger: triggerOptions }
            );
          }
          
          // Chart points pop in after line
          gsap.from(chartPoints, {
            scale: 0,
            opacity: 0,
            duration: 0.4,
            stagger: 0.2,
            ease: "back.out(1.7)",
            delay: 0.8,
            scrollTrigger: triggerOptions
          });
          
          // Person entrance from right
          if (person) {
            gsap.from(person, {
              x: 30,
              opacity: 0,
              duration: 0.8,
              ease: "power2.out",
              scrollTrigger: triggerOptions
            });
          }
          
          // Head appears
          if (head) {
            gsap.from(head, {
              scale: 0,
              opacity: 0,
              duration: 0.5,
              delay: 0.2,
              ease: "back.out(1.7)",
              scrollTrigger: triggerOptions
            });
          }
          
          // Body scales from bottom
          if (body) {
            gsap.from(body, {
              scaleY: 0,
              transformOrigin: "bottom",
              opacity: 0,
              duration: 0.6,
              delay: 0.3,
              ease: "power2.out",
              scrollTrigger: triggerOptions
            });
          }
          
          // Right arm sketching motion (continuous)
          if (rightArm) {
            gsap.from(rightArm, {
              opacity: 0,
              x: -10,
              duration: 0.5,
              delay: 0.5,
              ease: "power2.out",
              scrollTrigger: triggerOptions
            });
            
            // Sketching motion loop
            gsap.to(rightArm, {
              rotation: 3,
              transformOrigin: "90% 20%",
              duration: 1.5,
              repeat: -1,
              yoyo: true,
              ease: "sine.inOut",
              delay: 1
            });
          }
          
          // Marker subtle movement
          if (marker) {
            gsap.to(marker, {
              x: -2,
              y: 1,
              duration: 1.5,
              repeat: -1,
              yoyo: true,
              ease: "sine.inOut",
              delay: 1
            });
          }
          
          // Left arm fades in
          if (leftArm) {
            gsap.from(leftArm, {
              opacity: 0,
              duration: 0.5,
              delay: 0.6,
              ease: "power2.out",
              scrollTrigger: triggerOptions
            });
          }
          
          // Legs stagger in
          gsap.from(legs, {
            scaleY: 0,
            transformOrigin: "top",
            opacity: 0,
            duration: 0.5,
            stagger: 0.1,
            delay: 0.4,
            ease: "power2.out",
            scrollTrigger: triggerOptions
          });
          
          // Shoes pop in
          gsap.from(shoes, {
            scale: 0,
            opacity: 0,
            duration: 0.4,
            stagger: 0.1,
            delay: 0.7,
            ease: "back.out(1.4)",
            scrollTrigger: triggerOptions
          });
        }

        if (i === 2) { // Build
          const flow = row.querySelector(".build-flow");
          if (flow) {
            gsap.to(flow, {
              strokeDashoffset: -20,
              duration: 2,
              repeat: -1,
              ease: "none"
            });
          }
          
          gsap.from(row.querySelectorAll("rect, text"), {
            opacity: 0,
            scale: 0.9,
            stagger: 0.1,
            duration: 1,
            ease: "power2.out",
            scrollTrigger: triggerOptions
          });
        }

        if (i === 3) { // Launch
          const path = row.querySelector(".launch-path");
          const waves = row.querySelectorAll(".launch-wave");
          
          if (path) {
            const len = (path as SVGPathElement).getTotalLength();
            gsap.fromTo(path, 
              { strokeDasharray: len, strokeDashoffset: len },
              { strokeDashoffset: 0, duration: 2, ease: "power2.inOut", scrollTrigger: triggerOptions }
            );
          }
          
          gsap.to(waves, {
            scale: 1.5,
            opacity: 0,
            stagger: 0.4,
            duration: 2,
            repeat: -1,
            ease: "power1.out"
          });
        }
      });

      // Footer Animation
      gsap.from(".process-footer", {
        opacity: 0,
        y: 20,
        duration: 1,
        scrollTrigger: {
          trigger: ".process-footer",
          start: "top 90%",
        }
      });
    },
    { scope: containerRef }
  );

  return containerRef;
};
