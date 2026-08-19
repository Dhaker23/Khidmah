"use client";

import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import {
  ShieldCheck,
  BadgeCheck,
  IdCard,
  FolderCheck,
  Star,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

/* ----------------------------------------------------------------------------
 * Khidma Trust Seal — premium animated badge signalling verified Tunisian
 * talent. Two variants:
 *   - "compact": small circular badge (cards)
 *   - "full":    horizontal seal with checkmarks (hero / profile)
 *
 * Animations:
 *   - Subtle conic-gradient ring rotation (8s linear infinite)
 *   - Soft pulse on the inner seal
 *   - Respects `prefers-reduced-motion` (static fallback)
 * Palette: #475959 #2b3d3d #748684 #192d2f #32504d #6e8580 #ffffff only.
 * -------------------------------------------------------------------------- */

export interface TrustSealProps {
  variant?: "compact" | "full";
  className?: string;
  /** Show the rotating gradient ring (default true). */
  animated?: boolean;
}

/* SVG Khidma "K" mark — crisp at any size, single-color currentColor stroke. */
function KhidmaMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={className}
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.4}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {/* Stylized K with a hook on top — Khidma's signature mark */}
      <path d="M10 26V6" />
      <path d="M10 16l9-10" />
      <path d="M10 16l9 10" />
      <circle cx="10" cy="4.5" r="1.4" fill="currentColor" stroke="none" />
    </svg>
  );
}

const ROTATING_RING_STYLE: React.CSSProperties = {
  background:
    "conic-gradient(from 0deg, #32504d 0deg, #748684 90deg, #ffffff 180deg, #6e8580 270deg, #32504d 360deg)",
};

export function TrustSeal({
  variant = "full",
  className,
  animated = true,
}: TrustSealProps) {
  const prefersReduced = useReducedMotion();
  const animate = animated && !prefersReduced;

  if (variant === "compact") {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1.5 select-none",
          className
        )}
        role="img"
        aria-label="Khidma Trust Seal — verified Tunisian talent"
      >
        {/* Circular badge */}
        <span className="relative inline-flex size-7 items-center justify-center">
          {/* Rotating conic-gradient ring */}
          <span
            aria-hidden
            className={cn(
              "absolute inset-0 rounded-full",
              animate && "animate-[spin_8s_linear_infinite]"
            )}
            style={{
              ...ROTATING_RING_STYLE,
              maskImage:
                "radial-gradient(closest-side, transparent 62%, black 64%, black 100%)",
              WebkitMaskImage:
                "radial-gradient(closest-side, transparent 62%, black 64%, black 100%)",
            }}
          />
          {/* Inner seal — uses the real Khidma logo image */}
          <motion.span
            aria-hidden
            className={cn(
              "relative flex size-5 items-center justify-center rounded-full overflow-hidden",
              "bg-khidma-gradient text-white shadow-sm"
            )}
            animate={animate ? { scale: [1, 1.04, 1] } : undefined}
            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <Image
              src="/khidma-logo-v2.png"
              alt=""
              width={20}
              height={20}
              className="size-full object-cover"
            />
          </motion.span>
        </span>
        <span className="text-[10px] font-semibold uppercase tracking-wider text-[#32504d] leading-none">
          Verified
        </span>
      </span>
    );
  }

  // === Full horizontal seal ===
  return <FullSeal className={className} animated={animate} />;
}

interface CheckRow {
  icon: LucideIcon;
  label: string;
  hint: string;
}

const CHECKS: CheckRow[] = [
  { icon: IdCard, label: "Identity", hint: "Government ID + selfie match" },
  { icon: FolderCheck, label: "Portfolio", hint: "Original work samples audited" },
  { icon: Star, label: "Reviews", hint: "From real, paid clients only" },
];

function FullSeal({ className, animated }: { className?: string; animated: boolean }) {
  return (
    <motion.div
      initial={animated ? { opacity: 0, y: 8 } : undefined}
      animate={animated ? { opacity: 1, y: 0 } : undefined}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] as const }}
      className={cn(
        "relative inline-flex items-center gap-3 rounded-2xl",
        "border border-white/15 bg-[#32504d]/15 backdrop-blur-md",
        "px-3.5 py-2.5 shadow-lg shadow-[#192d2f]/10",
        className
      )}
      role="img"
      aria-label="Khidma Trust Seal — verified Tunisian talent across Identity, Portfolio, and Reviews"
    >
      {/* Rotating conic ring + K mark */}
      <span className="relative inline-flex size-10 shrink-0 items-center justify-center">
        <span
          aria-hidden
          className={cn(
            "absolute inset-0 rounded-full opacity-80",
            animated && "animate-[spin_8s_linear_infinite]"
          )}
          style={{
            ...ROTATING_RING_STYLE,
            maskImage:
              "radial-gradient(closest-side, transparent 56%, black 58%, black 100%)",
            WebkitMaskImage:
              "radial-gradient(closest-side, transparent 56%, black 58%, black 100%)",
          }}
        />
        <span className="relative flex size-8 items-center justify-center rounded-full overflow-hidden bg-khidma-gradient text-white shadow-md">
          <Image
            src="/khidma-logo-v2.png"
            alt=""
            width={32}
            height={32}
            className="size-full object-cover"
          />
        </span>
      </span>

      {/* Center text */}
      <div className="min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="font-display text-sm font-bold tracking-tight text-foreground">
            Trust Seal
          </span>
          <BadgeCheck className="size-3.5 text-[#32504d]" />
        </div>
        <p className="text-[11px] text-muted-foreground leading-tight">
          Verified Tunisian Talent
        </p>

        {/* Checkmarks */}
        <ul className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1">
          {CHECKS.map((c, i) => {
            const Icon = c.icon;
            return (
              <li
                key={c.label}
                className="inline-flex items-center gap-1"
                title={c.hint}
              >
                <Icon className="size-3 text-[#32504d]" />
                <span className="text-[10px] font-medium text-foreground/80">
                  {c.label}
                </span>
                {i < CHECKS.length - 1 && (
                  <span className="ml-1 text-muted-foreground/40" aria-hidden>
                    ·
                  </span>
                )}
              </li>
            );
          })}
        </ul>
      </div>

      {/* Right edge accent — shield */}
      <span className="hidden sm:flex size-8 items-center justify-center rounded-lg bg-[#32504d]/15 ml-1">
        <ShieldCheck className="size-4 text-[#32504d]" />
      </span>
    </motion.div>
  );
}

export default TrustSeal;
