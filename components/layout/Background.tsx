import { cn } from "@/lib/utils";
import React from "react";

export function Background({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative min-h-screen w-full">
      {children}
    </div>
  );
}
