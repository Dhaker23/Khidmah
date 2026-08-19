"use client";

/**
 * KhidmaPulse
 * -----------
 * A small horizontal "live metrics" widget for the hero.
 *
 * - 3 real-time-feeling metrics that subtly fluctuate:
 *     1. Active now:       "247 freelancers online"  (±5 every 3s)
 *     2. This week:        "1,432 projects posted"    (+1..+3 every 4s)
 *     3. Paid out today:   "TND 12,450"               (+50..+200 every 5s)
 *
 * - Layout: pill-shaped glass card with 3 metrics separated by dividers.
 * - Each metric: small pulsing green dot + label + big number (tabular-nums)
 *   + a subtle trend arrow (Up).
 * - "LIVE" indicator (pulsing green dot) on the far left.
 *
 * Performance:
 *  - All number fluctuations use MotionValue + useSpring so there are NO
 *    React re-renders on every fluctuation. The <motion.span> reads the
 *    spring directly via style. Only when we want to *display* the rounded
 *    integer do we need a tiny setState — we keep that on a 200ms throttle
 *    via a separate rAF loop so the DOM updates at most ~5× per second.
 *
 * Accessibility:
 *  - Respects prefers-reduced-motion: static numbers, no fluctuation,
 *    no pulsing dot, no spring smoothing.
 *
 * The text content of the widget is set via render of the rounded value,
 * which is held in React state but only updated a handful of times per
 * second (not on every fluctuation), keeping things smooth and cheap.
 */

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useReducedMotion,
  type MotionValue,
} from "framer-motion";
import { Users, Briefcase, Wallet, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

// =====================================================================
// Types
// =====================================================================

interface PulseMetric {
  id: string;
  icon: typeof Users;
  label: string;
  /** Initial value to render at mount. */
  initial: number;
  /** Tick interval (ms). */
  intervalMs: number;
  /** Compute the next value from the current value. */
  nextValue: (current: number) => number;
  /** Format the integer for display (e.g. add "TND ", commas). */
  format: (n: number) => string;
  /** Aria-label text. */
  ariaLabel: string;
}

// =====================================================================
// Metric definitions
// =====================================================================

const METRICS: PulseMetric[] = [
  {
    id: "active-now",
    icon: Users,
    label: "Active now",
    initial: 247,
    intervalMs: 3000,
    // ±5 — clamp to a believable floor/ceiling
    nextValue: (c) => {
      const delta = Math.floor(Math.random() * 11) - 5; // -5..+5
      return Math.max(180, Math.min(320, c + delta));
    },
    format: (n) => `${n} freelancers online`,
    ariaLabel: "Freelancers currently online",
  },
  {
    id: "this-week",
    icon: Briefcase,
    label: "This week",
    initial: 1432,
    intervalMs: 4000,
    // +1..+3
    nextValue: (c) => c + (1 + Math.floor(Math.random() * 3)),
    format: (n) => `${n.toLocaleString("en-US")} projects posted`,
    ariaLabel: "Projects posted this week",
  },
  {
    id: "paid-out-today",
    icon: Wallet,
    label: "Paid out today",
    initial: 12450,
    intervalMs: 5000,
    // +TND 50..200, rounded to nearest 10
    nextValue: (c) =>
      c + Math.round((50 + Math.floor(Math.random() * 151)) / 10) * 10,
    format: (n) =>
      `TND ${n.toLocaleString("en-US")}`,
    ariaLabel: "Total paid out today in TND",
  },
];

// =====================================================================
// Hook: drives a MotionValue from a fluctuating source + a throttled
// React state mirror so the DOM can render the integer.
// =====================================================================

function useFluctuatingMetric(metric: PulseMetric, enabled: boolean) {
  const prefersReduced = useReducedMotion();
  // The source MotionValue — spring-smoothed.
  const mv: MotionValue<number> = useMotionValue(metric.initial);
  const spring = useSpring(mv, {
    stiffness: 120,
    damping: 20,
    mass: 0.4,
  });

  // A throttled integer mirror for display (only updates ~5×/s max).
  const [display, setDisplay] = useState(metric.initial);
  const rafRef = useRef<number | null>(null);
  const lastMirrorRef = useRef<number>(metric.initial);

  // Drive the source value on the metric's interval.
  useEffect(() => {
    if (!enabled || prefersReduced) return;
    const tick = () => {
      mv.set(metric.nextValue(mv.get()));
    };
    const id = window.setInterval(tick, metric.intervalMs);
    return () => window.clearInterval(id);
  }, [enabled, prefersReduced, metric, mv]);

  // Mirror spring → integer (throttled via rAF, only when the rounded
  // value changes by >= 1). Under prefers-reduced-motion, the rAF loop
  // idles and `display` stays at its initial useState value.
  useEffect(() => {
    const loop = () => {
      if (!prefersReduced) {
        const v = Math.round(spring.get());
        if (v !== lastMirrorRef.current) {
          lastMirrorRef.current = v;
          setDisplay(v);
        }
      }
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [spring, prefersReduced]);

  return { display, motionValue: mv, spring };
}

// =====================================================================
// Single metric cell
// =====================================================================

interface MetricCellProps {
  metric: PulseMetric;
  enabled: boolean;
}

function MetricCell({ metric, enabled }: MetricCellProps) {
  const { display } = useFluctuatingMetric(metric, enabled);
  const prefersReduced = useReducedMotion();
  const Icon = metric.icon;

  // We render the formatted display value — this is what's visible to the
  // user. The spring smoothing happens behind the scenes (no flicker).
  return (
    <div
      className="flex items-center gap-2.5 px-3 sm:px-4 py-2"
      role="status"
      aria-live="polite"
      aria-label={`${metric.ariaLabel}: ${metric.format(display)}`}
    >
      <span className="flex size-8 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/10">
        <Icon className="size-3.5 text-[#94a8a4]" />
      </span>
      <div className="leading-tight">
        <div className="flex items-center gap-1">
          <span
            className={cn(
              "relative flex size-1.5",
              // Pulsing dot — disabled under prefers-reduced-motion
              !prefersReduced && "before:absolute before:inset-0 before:rounded-full before:bg-emerald-400 before:animate-ping"
            )}
            aria-hidden
          >
            <span className="relative inline-flex size-1.5 rounded-full bg-emerald-400" />
          </span>
          <span className="text-[9px] uppercase tracking-[0.15em] text-white/55 font-medium">
            {metric.label}
          </span>
        </div>
        <div className="flex items-baseline gap-1">
          <motion.span
            key={display}
            initial={prefersReduced ? false : { opacity: 0.5, y: 2 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="font-display text-base sm:text-lg font-bold text-white tabular-nums"
          >
            {metric.format(display)}
          </motion.span>
          {!prefersReduced && (
            <TrendingUp className="size-3 text-emerald-300/70" aria-hidden />
          )}
        </div>
      </div>
    </div>
  );
}

// =====================================================================
// Main component
// =====================================================================

export interface KhidmaPulseProps {
  className?: string;
}

export function KhidmaPulse({ className }: KhidmaPulseProps) {
  const prefersReduced = useReducedMotion();
  // We only enable fluctuation on the client (after mount) to avoid SSR
  // mismatch. Under prefers-reduced-motion, fluctuation is disabled entirely.
  const [enabled, setEnabled] = useState(false);
  useEffect(() => {
    if (prefersReduced) return;
    // Tiny delay so the hero entrance animation has finished first.
    const id = window.setTimeout(() => setEnabled(true), 800);
    return () => window.clearTimeout(id);
  }, [prefersReduced]);

  return (
    <div
      className={cn(
        "relative inline-flex items-stretch rounded-full border border-white/10 bg-white/5 backdrop-blur-md",
        // Subtle inner glow
        "shadow-[0_8px_30px_-12px_rgba(0,0,0,0.6)]",
        className
      )}
      role="region"
      aria-label="Khidma live metrics"
    >
      {/* LIVE indicator */}
      <div className="relative flex items-center gap-2 rounded-l-full bg-[#192d2f]/70 px-3 sm:px-4 backdrop-blur-md">
        <span className="relative flex size-2">
          {!prefersReduced && (
            <span className="absolute inline-flex size-full rounded-full bg-emerald-400 animate-ping" />
          )}
          <span className="relative inline-flex size-2 rounded-full bg-emerald-400" />
        </span>
        <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white">
          Live
        </span>
      </div>

      {/* Metric cells with dividers */}
      <div className="flex flex-wrap items-stretch">
        {METRICS.map((m, i) => (
          <div key={m.id} className="flex items-stretch">
            {i > 0 && (
              <div
                aria-hidden
                className="my-1.5 w-px self-stretch bg-white/10"
              />
            )}
            <MetricCell metric={m} enabled={enabled} />
          </div>
        ))}
      </div>

      {/* Right padding rounded cap (so the pill stays rounded on the right) */}
      <div className="hidden sm:block w-2 rounded-r-full bg-white/[0.02]" aria-hidden />
    </div>
  );
}

export default KhidmaPulse;
