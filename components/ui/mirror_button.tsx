"use client";

import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, AnchorHTMLAttributes, ReactNode } from "react";
import Link from "next/link";

// Props para cuando se usa como botón
interface MirrorButtonBaseProps {
  children: ReactNode;
  variant?: "default" | "outline" | "ghost";
  size?: "xs" | "sm" | "md" | "lg" | "full";
  icon?: ReactNode;
  iconPosition?: "left" | "right";
  isLoading?: boolean;
  className?: string;
}

interface MirrorButtonAsButton
  extends MirrorButtonBaseProps,
    Omit<ButtonHTMLAttributes<HTMLButtonElement>, keyof MirrorButtonBaseProps> {
  href?: never;
}

interface MirrorButtonAsLink
  extends MirrorButtonBaseProps,
    Omit<AnchorHTMLAttributes<HTMLAnchorElement>, keyof MirrorButtonBaseProps> {
  href: string;
  target?: string;
  rel?: string;
}

type MirrorButtonProps = MirrorButtonAsButton | MirrorButtonAsLink;

export function MirrorButton({
  children,
  variant = "default",
  size = "full",
  icon,
  iconPosition = "right",
  isLoading = false,
  className,
  ...props
}: MirrorButtonProps) {
  // Size variants
  const sizeClasses = {
    xs: "py-1 px-2 text-xs",
    sm: "py-2 px-4 text-xs",
    md: "py-3 px-6 text-sm",
    lg: "py-4 px-8 text-sm",
    full: "w-full py-4 text-sm",
  };

  // Variant styles (sin hover:tracking)
  const variantClasses = {
    default: "text-white dark:text-black bg-zinc-950 dark:bg-zinc-50",
    outline:
      "text-zinc-950 dark:text-zinc-50 bg-transparent border-2 border-zinc-950 dark:border-zinc-50 hover:bg-zinc-950 dark:hover:bg-zinc-50 hover:text-white dark:hover:text-black",
    ghost:
      "text-zinc-950 dark:text-zinc-50 bg-transparent hover:bg-zinc-100 dark:hover:bg-zinc-900",
  };

  // Mirror effect backgrounds
  const mirrorEffects = {
    default:
      "bg-zinc-800 dark:bg-zinc-200 transform translate-y-full group-hover:translate-y-0",
    outline:
      "bg-zinc-950 dark:bg-zinc-50 transform translate-y-full group-hover:translate-y-0",
    ghost:
      "bg-zinc-100 dark:bg-zinc-900 transform translate-y-full group-hover:translate-y-0",
  };

  // Clases compartidas
  const sharedClasses = cn(
    "group rounded-sm relative overflow-hidden font-medium  tracking-widest transition-all duration-500 inline-flex items-center justify-center",
    "disabled:opacity-50 disabled:cursor-not-allowed",
    sizeClasses[size],
    variantClasses[variant],
    className,
  );

  // Contenido compartido
  const content = (
    <>
      <span className="relative z-10 flex items-center justify-center gap-2">
        {isLoading ? (
          <>
            <svg
              className="animate-spin h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span>Loading...</span>
          </>
        ) : (
          <>
            {icon && iconPosition === "left" && <span>{icon}</span>}
            {children}
            {icon && iconPosition === "right" && <span>{icon}</span>}
          </>
        )}
      </span>
      <div
        className={cn(
          "absolute inset-0 transition-transform duration-500",
          mirrorEffects[variant],
        )}
      />
    </>
  );

  // Si tiene href, renderizar como Link
  if ("href" in props && props.href) {
    const { href, target, rel, ...linkProps } = props as MirrorButtonAsLink;
    return (
      <Link
        href={href}
        target={target}
        rel={rel || (target === "_blank" ? "noopener noreferrer" : undefined)}
        className={sharedClasses}
        {...linkProps}
      >
        {content}
      </Link>
    );
  }

  // Si no tiene href, renderizar como button
  const {
    disabled,
    type = "button",
    ...buttonProps
  } = props as MirrorButtonAsButton;
  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      className={sharedClasses}
      {...buttonProps}
    >
      {content}
    </button>
  );
}
