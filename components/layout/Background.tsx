import { cn } from "@/lib/utils";
import React from "react";

export function Background({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="fixed inset-0 -z-10 h-full w-full bg-white dark:bg-black">
        <svg
          className="decorative-svg absolute top-20 left-10 w-40 h-40 opacity-20 pointer-events-none"
          viewBox="0 0 200 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle
            cx="100"
            cy="100"
            r="80"
            className="stroke-zinc-400 dark:stroke-zinc-600"
            strokeWidth="2"
          />
          <path
            d="M100 20 L100 180 M20 100 L180 100"
            className="stroke-zinc-400 dark:stroke-zinc-600"
            strokeWidth="2"
          />
          <circle
            cx="100"
            cy="100"
            r="40"
            className="stroke-zinc-400 dark:stroke-zinc-600"
            strokeWidth="2"
          />
        </svg>

        <svg
          className="decorative-svg absolute bottom-20 right-10 w-32 h-32 opacity-20 pointer-events-none"
          viewBox="0 0 200 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M20 100 L60 20 L140 20 L180 100 L140 180 L60 180 Z"
            className="stroke-zinc-400 dark:stroke-zinc-600"
            strokeWidth="2"
          />
          <circle
            cx="100"
            cy="100"
            r="60"
            className="stroke-zinc-400 dark:stroke-zinc-600"
            strokeWidth="2"
          />
        </svg>
        <div
          className={cn(
            "absolute inset-0",
            "opacity-60",
            "[background-size:40px_40px]",
            "[background-image:linear-gradient(to_right,#e4e4e7_1px,transparent_1px),linear-gradient(to_bottom,#e4e4e7_1px,transparent_1px)]",
            "dark:[background-image:linear-gradient(to_right,#262626_1px,transparent_1px),linear-gradient(to_bottom,#262626_1px,transparent_1px)]"
          )}
        />

        {/* Radial gradient for the container to give a faded look */}
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] dark:bg-black" />
        <p className="relative z-20 bg-gradient-to-b from-neutral-200 to-neutral-500 bg-clip-text py-8 text-4xl font-bold text-transparent sm:text-7xl" />
      </div>
      {children}
    </>
  );
}
