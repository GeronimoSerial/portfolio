"use client";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { motion, useMotionTemplate, useSpring } from "motion/react";

interface SocialCardProps {
  href: string;
  icon: ReactNode;
  handle: string;
  label: string;
  className?: string;
}

export const SocialCard = ({
  href,
  icon,
  handle,
  label,
  className,
}: SocialCardProps) => {
  const mouseX = useSpring(0, { stiffness: 500, damping: 100 });
  const mouseY = useSpring(0, { stiffness: 500, damping: 100 });

  const onMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const { currentTarget, clientX, clientY } = event;
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  };

  const maskImage = useMotionTemplate`radial-gradient(240px at ${mouseX}px ${mouseY}px, white, transparent)`;
  const style = { maskImage, WebkitMaskImage: maskImage };

  return (
    <div
      onMouseMove={onMouseMove}
      className="overflow-hidden relative duration-700 border rounded-xl hover:bg-zinc-800/10 group md:gap-8 hover:border-zinc-400/50 border-zinc-600"
    >
      <div className="pointer-events-none">
        <div className="absolute inset-0 z-0 transition duration-1000 [mask-image:linear-gradient(black,transparent)]" />
        <motion.div
          className="absolute inset-0 z-10 bg-gradient-to-br opacity-100 via-zinc-100/10 transition duration-1000 group-hover:opacity-50"
          style={style}
        />
        <motion.div
          className="absolute inset-0 z-10 opacity-0 mix-blend-overlay transition duration-1000 group-hover:opacity-100"
          style={style}
        />
      </div>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(
          "mt-10 p-4 mx-auto relative flex flex-col items-center gap-4 duration-700 group md:gap-8 md:py-24 lg:pb-48 md:p-16 h-80 w-80 md:h-96 md:w-96 lg:h-[350px] lg:w-[350px]",
          className
        )}
      >
        <span
          className="absolute w-px h-2/3 bg-gradient-to-b from-zinc-500 via-zinc-500/50 to-transparent"
          aria-hidden="true"
        />
        <span 
          className="relative z-10 flex items-center justify-center w-10 h-10 text-sm duration-1000 border rounded-full text-zinc-200 group-hover:text-white group-hover:bg-zinc-900 border-zinc-500 bg-zinc-900 group-hover:border-zinc-200 drop-shadow-orange aspect-square"
        >
          {icon}
        </span>
        <div className="z-10 flex flex-col items-center">
          <span className="text-xl lg:text-xl font-medium duration-150 xl:text-2xl text-zinc-200 group-hover:text-white font-display">
            {handle}
          </span>
          <span className="mt-4 text-sm text-center duration-1000 text-zinc-400 group-hover:text-zinc-200">
            {label}
          </span>
        </div>
      </a>
    </div>
  );
}
