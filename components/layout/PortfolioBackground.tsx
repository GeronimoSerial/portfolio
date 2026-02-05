import { cn } from "@/lib/utils";
import React from "react";

export function PortfolioBackground({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="fixed inset-0 -z-10 h-full w-full bg-zinc-950 selection:bg-zinc-200/20">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_90%_75%_at_50%_-10%,rgba(82,94,113,0.16),rgba(24,24,27,0))]" />

        <svg
          className="decorative-svg absolute top-24 left-12 w-32 h-32 opacity-[0.06] pointer-events-none"
          viewBox="0 0 200 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <title>Background decorative circle</title>
          <circle
            cx="100"
            cy="100"
            r="80"
            className="stroke-zinc-500"
            strokeWidth="2"
          />
          <path
            d="M100 20 L100 180 M20 100 L180 100"
            className="stroke-zinc-500"
            strokeWidth="2"
          />
          <circle
            cx="100"
            cy="100"
            r="40"
            className="stroke-zinc-500"
            strokeWidth="2"
          />
        </svg>

        <svg
          className="decorative-svg absolute bottom-24 right-12 w-28 h-28 opacity-[0.06] pointer-events-none"
          viewBox="0 0 200 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <title>Background decorative hexagon</title>
          <path
            d="M20 100 L60 20 L140 20 L180 100 L140 180 L60 180 Z"
            className="stroke-zinc-500"
            strokeWidth="2"
          />
          <circle
            cx="100"
            cy="100"
            r="60"
            className="stroke-zinc-500"
            strokeWidth="2"
          />
        </svg>
        <div
          className={cn(
            "absolute inset-0",
            "opacity-15",
            "[background-image:linear-gradient(to_right,#a1a1aa14_1px,transparent_1px),linear-gradient(to_bottom,#a1a1aa14_1px,transparent_1px)]",
            "[background-size:32px_32px]",
            "[mask-image:radial-gradient(ellipse_70%_55%_at_50%_0%,#000_68%,transparent_100%)]"
          )}
        />

        <p className="relative z-20 bg-gradient-to-b from-neutral-200 to-neutral-500 bg-clip-text py-8 text-4xl font-bold text-transparent sm:text-7xl" />
      </div>
      {children}
    </>
  );
}
