"use client";

/**
 * Section Rhythm , decorative dividers between landing sections.
 * ------------------------------------------------------------
 * Adds visual rhythm + flow between the 26 landing sections on the Khidma
 * home page. Three variants, each 60-80px tall, full-width, Khidma teal palette:
 *
 *   - WaveDivider       , SVG wave shape (smooth light↔dark transition)
 *   - DotGridDivider    , 3 rows of small Khidma dots, fading at edges
 *   - GradientDivider   , thin 2px gradient line + Khidma logo mark center
 *
 * All dividers:
 *   - Respect `prefers-reduced-motion` (skip entrance animation)
 *   - framer-motion entrance (fade + slight y)
 *   - Use Khidma palette: #475959 #2b3d3d #748684 #192d2f #32504d #6e8580 #ffffff
 */

import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import { KhidmaLogo } from "./logo";

/* ------------------------------------------------------------------ */
/* Shared motion wrapper                                               */
/* ------------------------------------------------------------------ */

interface RhythmProps {
  className?: string;
  /** Background color override for the wrapper (defaults to transparent). */
  bgClassName?: string;
  /** Optional invert to flip the wave direction (used by WaveDivider). */
  flip?: boolean;
}

function RhythmShell({
  children,
  className,
  bgClassName,
  delay = 0,
}: RhythmProps & {
  children: React.ReactNode;
  delay?: number;
}) {
  const prefersReduced = useReducedMotion();
  return (
    <motion.div
      initial={prefersReduced ? undefined : { opacity: 0, y: 8 }}
      whileInView={prefersReduced ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] as const }}
      className={cn(
        "pointer-events-none w-full overflow-hidden",
        bgClassName,
        className,
      )}
      aria-hidden
    >
      {children}
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* 1. WaveDivider                                                      */
/* ------------------------------------------------------------------ */

export function WaveDivider({ className, bgClassName, flip = false }: RhythmProps) {
  // Smooth ~60px SVG wave with Khidma teal gradient.
  // `flip` reverses the wave direction so it can sit between dark→light or light→dark.
  return (
    <RhythmShell className={cn("h-[60px]", className)} bgClassName={bgClassName}>
      <svg
        viewBox="0 0 1440 60"
        preserveAspectRatio="none"
        className={cn("h-full w-full", flip && "rotate-180")}
        style={{ display: "block" }}
      >
        <defs>
          <linearGradient id="khidma-wave-grad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#32504d" stopOpacity={0.85} />
            <stop offset="50%" stopColor="#748684" stopOpacity={0.9} />
            <stop offset="100%" stopColor="#6e8580" stopOpacity={0.85} />
          </linearGradient>
        </defs>
        <path
          d="M0,30 C180,52 360,8 540,28 C720,48 900,12 1080,32 C1260,52 1380,28 1440,22 L1440,60 L0,60 Z"
          fill="url(#khidma-wave-grad)"
        />
        <path
          d="M0,38 C180,58 360,18 540,36 C720,54 900,22 1080,40 C1260,58 1380,36 1440,30 L1440,60 L0,60 Z"
          fill="#2b3d3d"
          fillOpacity={0.35}
        />
      </svg>
    </RhythmShell>
  );
}

/* ------------------------------------------------------------------ */
/* 2. DotGridDivider                                                   */
/* ------------------------------------------------------------------ */

function DotRow({ count, opacityScale }: { count: number; opacityScale: number }) {
  // Render a single row of `count` small dots, fading at the edges.
  return (
    <div
      className="flex items-center justify-center gap-2"
      style={{ opacity: opacityScale }}
    >
      {Array.from({ length: count }).map((_, i) => {
        // Fade in/out from center
        const center = (count - 1) / 2;
        const dist = Math.abs(i - center);
        const fade = 1 - Math.pow(dist / (count - 1), 2) * 0.85;
        return (
          <span
            key={i}
            className="size-1 rounded-full bg-[#32504d]"
            style={{ opacity: fade }}
          />
        );
      })}
    </div>
  );
}

export function DotGridDivider({ className, bgClassName }: RhythmProps) {
  // 3 rows of small Khidma dots, centered, fading at edges. ~70px tall.
  const counts = [12, 16, 12];
  const opacities = [0.55, 0.85, 0.55];
  return (
    <RhythmShell
      className={cn("h-[70px]", className)}
      bgClassName={bgClassName}
    >
      <div className="flex h-full w-full flex-col items-center justify-center gap-2.5">
        {counts.map((c, i) => (
          <DotRow key={i} count={c} opacityScale={opacities[i]} />
        ))}
      </div>
    </RhythmShell>
  );
}

/* ------------------------------------------------------------------ */
/* 3. GradientDivider                                                  */
/* ------------------------------------------------------------------ */

export function GradientDivider({ className, bgClassName }: RhythmProps) {
  // Thin 2px gradient line with a small Khidma logo mark in the center.
  return (
    <RhythmShell
      className={cn("h-[64px]", className)}
      bgClassName={bgClassName}
      delay={0.05}
    >
      <div className="flex h-full w-full items-center justify-center px-6">
        <div className="flex w-full max-w-3xl items-center gap-3">
          <div
            className="h-[2px] flex-1 rounded-full"
            style={{
              background:
                "linear-gradient(to right, transparent 0%, #6e8580 50%, #32504d 100%)",
            }}
          />
          <div className="flex items-center justify-center rounded-full bg-background/80 px-2 py-1 ring-1 ring-[#32504d]/20">
            <KhidmaLogo variant="symbol" size="sm" className="opacity-90" />
          </div>
          <div
            className="h-[2px] flex-1 rounded-full"
            style={{
              background:
                "linear-gradient(to left, transparent 0%, #6e8580 50%, #32504d 100%)",
            }}
          />
        </div>
      </div>
    </RhythmShell>
  );
}

/* ------------------------------------------------------------------ */
/* Barrel                                                              */
/* ------------------------------------------------------------------ */

export default GradientDivider;
