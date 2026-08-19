"use client";

/**
 * AchievementBadges
 * ----------------
 * Animated achievement badge system for Khidma freelancers.
 *
 * 8 achievement types — each with icon, name, description, color, unlock
 * criteria. The component takes a `freelancerId` and looks up the freelancer
 * in mock data to compute which badges are unlocked, and what progress each
 * locked badge has made towards its threshold.
 *
 * Two display variants:
 *   - `grid` (default): a responsive grid (2 cols mobile, 3-4 desktop) of
 *     badge cards. Unlocked badges sparkle on first appearance via
 *     `whileInView` + framer-motion burst (0.6s). Locked badges are
 *     grayscale + 50% opacity + show a progress bar ("3/5 reviews").
 *   - `row` (compact): a horizontal row of small circular badges for
 *     embedding in dashboard sidebars / profile headers.
 *
 * Respects `prefers-reduced-motion`: no sparkle, instant appearance.
 */

import { motion, useReducedMotion } from "framer-motion";
import {
  Target,
  TrendingUp,
  Crown,
  Zap,
  Briefcase,
  ShieldCheck,
  Users,
  Award,
  Lock,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  getFreelancerById,
  type Freelancer,
} from "@/lib/khidma-data";

type AchievementKey =
  | "firstProject"
  | "risingStar"
  | "topRated"
  | "speedDemon"
  | "portfolioPro"
  | "trustedPro"
  | "mentor"
  | "centurion";

interface AchievementDef {
  key: AchievementKey;
  name: string;
  description: string;
  icon: LucideIcon;
  /** Tailwind text + bg classes for the badge color accent */
  color: string;
  bg: string;
  ring: string;
  glow: string;
  /** Returns { unlocked, current, target, suffix } */
  progress: (f: Freelancer) => {
    unlocked: boolean;
    current?: number;
    target?: number;
    suffix?: string;
  };
}

const ACHIEVEMENTS: AchievementDef[] = [
  {
    key: "firstProject",
    name: "First Project",
    description: "Completed your first project",
    icon: Target,
    color: "text-emerald-700",
    bg: "bg-emerald-500/15",
    ring: "ring-emerald-500/30",
    glow: "rgba(16,185,129,0.45)",
    progress: (f) => ({
      unlocked: f.completedProjects >= 1,
      current: Math.min(f.completedProjects, 1),
      target: 1,
      suffix: "project",
    }),
  },
  {
    key: "risingStar",
    name: "Rising Star",
    description: "Earned 5 five-star reviews",
    icon: TrendingUp,
    color: "text-amber-700",
    bg: "bg-amber-500/15",
    ring: "ring-amber-500/30",
    glow: "rgba(245,158,11,0.45)",
    progress: (f) => ({
      unlocked: f.reviewsCount >= 5,
      current: Math.min(f.reviewsCount, 5),
      target: 5,
      suffix: "reviews",
    }),
  },
  {
    key: "topRated",
    name: "Top Rated",
    description: "Maintained 4.9+ rating for 3 months",
    icon: Crown,
    color: "text-purple-700",
    bg: "bg-purple-500/15",
    ring: "ring-purple-500/30",
    glow: "rgba(126,34,206,0.45)",
    progress: (f) => ({
      // Mock the "3 months" requirement with topRated flag + rating threshold
      unlocked: f.topRated && f.rating >= 4.9,
      current: f.rating >= 4.9 ? 3 : f.rating >= 4.7 ? 2 : f.rating >= 4.5 ? 1 : 0,
      target: 3,
      suffix: "months",
    }),
  },
  {
    key: "speedDemon",
    name: "Speed Demon",
    description: "Responded within 1 hour, 50 times",
    icon: Zap,
    color: "text-blue-600",
    bg: "bg-blue-500/15",
    ring: "ring-blue-500/30",
    glow: "rgba(37,99,235,0.45)",
    // Mock progress — freelancers with fast response times accumulate speed
    progress: (f) => {
      // Fast response → counts as ~30+; "1 hour" qualifies
      const fast = f.responseTime.includes("1 hour") || f.responseTime.includes("minute");
      const current = fast ? 50 : f.completedProjects > 30 ? 32 : 18;
      return {
        unlocked: current >= 50,
        current,
        target: 50,
        suffix: "responses",
      };
    },
  },
  {
    key: "portfolioPro",
    name: "Portfolio Pro",
    description: "Published 5+ portfolio items",
    icon: Briefcase,
    color: "text-teal-700",
    bg: "bg-teal-500/15",
    ring: "ring-teal-500/30",
    glow: "rgba(15,118,110,0.45)",
    progress: (f) => ({
      unlocked: f.portfolio.length >= 5,
      current: Math.min(f.portfolio.length, 5),
      target: 5,
      suffix: "items",
    }),
  },
  {
    key: "trustedPro",
    name: "Trusted Pro",
    description: "Identity + Portfolio verified",
    icon: ShieldCheck,
    color: "text-green-700",
    bg: "bg-green-500/15",
    ring: "ring-green-500/30",
    glow: "rgba(21,128,61,0.45)",
    progress: (f) => {
      const checks = [
        f.verified.identity,
        f.verified.portfolio,
      ];
      const current = checks.filter(Boolean).length;
      return {
        unlocked: current >= 2,
        current,
        target: 2,
        suffix: "checks",
      };
    },
  },
  {
    key: "mentor",
    name: "Mentor",
    description: "Helped 10+ freelancers via community",
    icon: Users,
    color: "text-rose-600",
    bg: "bg-rose-500/15",
    ring: "ring-rose-500/30",
    glow: "rgba(225,29,72,0.45)",
    // Mock: senior freelancers with high project count = mentors
    progress: (f) => {
      const current =
        f.completedProjects >= 100 ? 12 : f.completedProjects >= 50 ? 7 : 3;
      return {
        unlocked: current >= 10,
        current,
        target: 10,
        suffix: "mentees",
      };
    },
  },
  {
    key: "centurion",
    name: "Centurion",
    description: "Completed 100+ projects",
    icon: Award,
    color: "text-yellow-700",
    bg: "bg-yellow-500/15",
    ring: "ring-yellow-500/30",
    glow: "rgba(202,138,4,0.45)",
    progress: (f) => ({
      unlocked: f.completedProjects >= 100,
      current: Math.min(f.completedProjects, 100),
      target: 100,
      suffix: "projects",
    }),
  },
];

export interface AchievementBadgesProps {
  freelancerId: string;
  variant?: "grid" | "row";
  className?: string;
  /** grid: how many columns on desktop. Default 4. */
  columns?: 3 | 4;
}

/** Sparkle burst overlay rendered on top of an unlocked badge icon. */
function SparkleBurst({ color }: { color: string }) {
  const prefersReduced = useReducedMotion();
  if (prefersReduced) return null;
  return (
    <motion.span
      aria-hidden
      className="pointer-events-none absolute inset-0"
      initial={{ opacity: 0, scale: 0.6 }}
      whileInView={{ opacity: [0, 1, 0], scale: [0.6, 1.4, 1] }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      style={{
        background: `radial-gradient(circle, ${color} 0%, transparent 60%)`,
        borderRadius: "9999px",
      }}
    />
  );
}

export function AchievementBadges({
  freelancerId,
  variant = "grid",
  className,
  columns = 4,
}: AchievementBadgesProps) {
  const prefersReduced = useReducedMotion();
  const f = getFreelancerById(freelancerId);
  if (!f) return null;

  const computed = ACHIEVEMENTS.map((def) => ({
    def,
    state: def.progress(f),
  }));

  if (variant === "row") {
    return (
      <div
        className={cn("flex flex-wrap items-center gap-2", className)}
        role="list"
        aria-label="Achievements"
      >
        {computed.map(({ def, state }) => {
          const Icon = def.icon;
          const unlocked = state.unlocked;
          return (
            <motion.div
              key={def.key}
              role="listitem"
              title={
                unlocked
                  ? `${def.name} — ${def.description} (Unlocked)`
                  : `${def.name} — ${def.description} (Locked)`
              }
              initial={prefersReduced ? undefined : { opacity: 0, scale: 0.7 }}
              whileInView={
                prefersReduced ? undefined : { opacity: 1, scale: 1 }
              }
              viewport={{ once: true }}
              transition={{ duration: 0.3 }}
              className={cn(
                "relative flex size-9 items-center justify-center rounded-full ring-1 transition-transform",
                unlocked
                  ? cn(def.bg, def.ring, def.color, "hover:scale-110")
                  : "bg-muted/60 ring-border/60 text-muted-foreground grayscale opacity-50"
              )}
            >
              {unlocked && <SparkleBurst color={def.glow} />}
              <Icon className="relative size-4" />
              {!unlocked && (
                <Lock className="absolute -bottom-0.5 -right-0.5 size-2.5 text-muted-foreground bg-background rounded-full p-px" />
              )}
            </motion.div>
          );
        })}
      </div>
    );
  }

  // Grid variant
  const colsClass =
    columns === 3
      ? "grid-cols-2 sm:grid-cols-3"
      : "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4";

  return (
    <div
      className={cn("grid gap-3 sm:gap-4", colsClass, className)}
      role="list"
      aria-label="Achievements"
    >
      {computed.map(({ def, state }, i) => {
        const Icon = def.icon;
        const unlocked = state.unlocked;
        const pct =
          state.target && state.current !== undefined
            ? Math.min(100, Math.round((state.current / state.target) * 100))
            : 0;

        return (
          <motion.div
            key={def.key}
            role="listitem"
            initial={prefersReduced ? undefined : { opacity: 0, y: 14 }}
            whileInView={
              prefersReduced ? undefined : { opacity: 1, y: 0 }
            }
            viewport={{ once: true, margin: "-40px" }}
            transition={{
              duration: 0.45,
              delay: prefersReduced ? 0 : i * 0.06,
              ease: [0.22, 1, 0.36, 1] as const,
            }}
            className={cn(
              "relative rounded-xl border p-4 transition-colors",
              unlocked
                ? "border-border/70 bg-card hover:border-[#32504d]/40"
                : "border-border/50 bg-muted/30"
            )}
          >
            {/* Glow ring for unlocked badges */}
            {unlocked && !prefersReduced && (
              <motion.div
                aria-hidden
                className="pointer-events-none absolute -inset-px rounded-xl"
                style={{
                  background: `radial-gradient(80% 60% at 50% 0%, ${def.glow}, transparent 70%)`,
                  opacity: 0.18,
                }}
                animate={{ opacity: [0.12, 0.22, 0.12] }}
                transition={{
                  duration: 3 + (i % 3),
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
            )}

            <div className="relative flex items-start gap-3">
              <div
                className={cn(
                  "relative flex size-10 shrink-0 items-center justify-center rounded-full ring-1",
                  unlocked
                    ? cn(def.bg, def.ring, def.color)
                    : "bg-muted/60 ring-border/60 text-muted-foreground grayscale opacity-50"
                )}
              >
                {unlocked && <SparkleBurst color={def.glow} />}
                <Icon className="relative size-5" />
                {!unlocked && (
                  <Lock className="absolute -bottom-0.5 -right-0.5 size-3 text-muted-foreground bg-background rounded-full p-0.5" />
                )}
              </div>

              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5">
                  <h4
                    className={cn(
                      "text-sm font-semibold truncate",
                      unlocked ? "text-foreground" : "text-muted-foreground"
                    )}
                  >
                    {def.name}
                  </h4>
                </div>
                <p className="text-[11px] text-muted-foreground leading-snug mt-0.5 line-clamp-2">
                  {def.description}
                </p>
              </div>
            </div>

            <div className="relative mt-3">
              {unlocked ? (
                <div className="flex items-center justify-between text-[11px]">
                  <span className="inline-flex items-center gap-1 font-semibold text-emerald-700">
                    <ShieldCheck className="size-3" />
                    Unlocked
                  </span>
                  <span className={cn("text-[10px] uppercase tracking-wider", def.color)}>
                    Earned
                  </span>
                </div>
              ) : (
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="inline-flex items-center gap-1 text-muted-foreground">
                      <Lock className="size-3" />
                      Locked
                    </span>
                    <span className="text-muted-foreground tabular-nums">
                      {state.current}/{state.target} {state.suffix}
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                    <motion.div
                      className={cn("h-full rounded-full", def.color, "bg-current opacity-80")}
                      initial={prefersReduced ? undefined : { width: 0 }}
                      whileInView={
                        prefersReduced ? undefined : { width: `${pct}%` }
                      }
                      viewport={{ once: true }}
                      transition={{
                        duration: 0.8,
                        delay: 0.2 + i * 0.05,
                        ease: "easeOut",
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

export default AchievementBadges;
