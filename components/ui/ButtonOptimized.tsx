"use client";

import React from "react";
import { cn } from "@/lib/utils";

export function ButtonOptimized({
  children,
  className,
  containerClassName,
  duration = 5,
  borderRadius = "0.75rem",
  as: Component = "button",
  ...props
}: {
  children: React.ReactNode;
  className?: string;
  containerClassName?: string;
  duration?: number;
  borderRadius?: string;
  as?: React.ElementType;
  [key: string]: unknown;
}) {
  return (
    <Component
      className={cn(
        "relative overflow-hidden p-[1px] bg-transparent",
        containerClassName,
      )}
      style={{
        borderRadius: borderRadius,
        ["--border-duration" as string]: `${duration}s`,
      }}
      {...props}
    >
      {/* Animated border gradient - GPU accelerated */}
      <div
        className="absolute inset-0 animate-border-spin"
        style={{ borderRadius: borderRadius }}
      >
        <div className="h-full w-full bg-gradient-conic from-transparent via-white/40 to-transparent" />
      </div>

      {/* Content */}
      <div
        className={cn(
          "relative z-10 flex h-full w-full items-center justify-center bg-zinc-900/80 backdrop-blur-sm border border-zinc-700 px-6 py-3 text-sm font-medium text-zinc-300 antialiased transition-colors hover:bg-zinc-900/90 hover:text-zinc-50",
          className,
        )}
        style={{
          borderRadius: `calc(${borderRadius} * 0.96)`,
        }}
      >
        {children}
      </div>
    </Component>
  );
}
