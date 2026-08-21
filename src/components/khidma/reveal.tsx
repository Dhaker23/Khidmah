"use client";

import { motion, useReducedMotion } from "framer-motion";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface RevealProps {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
  once?: boolean;
}

/** Scroll-triggered reveal, optimized for performance.
 *  Uses opacity + transform (GPU-accelerated), shorter duration (0.35s),
 *  and larger viewport margin so elements trigger sooner (less pop-in). */
export function Reveal({
  children,
  delay = 0,
  y = 16,
  className,
  once = true,
}: RevealProps) {
  const prefersReduced = useReducedMotion();
  return (
    <motion.div
      initial={prefersReduced ? undefined : { opacity: 0, y }}
      whileInView={prefersReduced ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once, margin: "-40px" }}
      transition={{ duration: 0.35, delay, ease: "easeOut" }}
      className={className}
      style={{ willChange: "opacity, transform" }}
    >
      {children}
    </motion.div>
  );
}

/** Brand divider, Khidma logo mark + thin gradient line. */
export function BrandDivider({
  className,
  label,
}: {
  className?: string;
  label?: string;
}) {
  return (
    <div className={cn("flex items-center gap-3 my-2", className)}>
      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
      <div className="flex items-center gap-2">
        <div className="size-1.5 rounded-full bg-[#32504d]" />
        {label && (
          <span className="text-[10px] uppercase tracking-[0.25em] font-medium text-muted-foreground">
            {label}
          </span>
        )}
        <div className="size-1.5 rounded-full bg-[#748684]" />
      </div>
      <div className="h-px flex-1 bg-gradient-to-r from-transparent via-border to-transparent" />
    </div>
  );
}

/** Section wrapper with consistent spacing + max width. */
export function Section({
  children,
  className,
  id,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section id={id} className={cn("py-16 sm:py-24", className)}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">{children}</div>
    </section>
  );
}

/** Eyebrow + H2 + supporting paragraph header pattern.
 *  Optimized: single Reveal wrapper instead of 3 nested ones. */
export function SectionHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className,
}: {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  align?: "left" | "center";
  className?: string;
}) {
  const prefersReduced = useReducedMotion();
  return (
    <div
      className={cn(
        "max-w-2xl mb-10 sm:mb-14",
        align === "center" && "mx-auto text-center",
        className
      )}
    >
      <motion.div
        initial={prefersReduced ? undefined : { opacity: 0, y: 16 }}
        whileInView={prefersReduced ? undefined : { opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.35, ease: "easeOut" }}
        style={{ willChange: "opacity, transform" }}
      >
        {eyebrow && (
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-[#748684]">
            <span className="size-1 rounded-full bg-[#32504d]" />
            {eyebrow}
          </span>
        )}
        <h2 className="mt-2 font-display text-3xl sm:text-4xl font-bold tracking-tight text-foreground leading-tight">
          {title}
        </h2>
        {description && (
          <p
            className={cn(
              "mt-3 text-base text-muted-foreground",
              align === "center" && "mx-auto"
            )}
          >
            {description}
          </p>
        )}
      </motion.div>
    </div>
  );
}
