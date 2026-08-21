"use client";

/**
 * LiveActivityTicker
 * -----------------
 * A thin horizontal marquee strip that shows real-time platform events:
 * projects completed, reviews posted, payments released, new freelancers
 * verified, jobs posted, etc.
 *
 * - Infinite horizontal scroll via the existing `.animate-marquee` utility.
 * - Pauses on hover.
 * - "LIVE" indicator (pulsing green dot) on the left.
 * - Each event has a small color-coded icon + short copy + relative time.
 * - Respects `prefers-reduced-motion`: renders a static, non-animated list.
 *
 * Used in the hero, between the trust chips and the skills marquee.
 */

import { useReducedMotion } from "framer-motion";
import {
  Briefcase,
  Star,
  Megaphone,
  Eye,
  Wallet,
  ShieldCheck,
  TrendingUp,
  CheckCircle2,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

type ActivityType =
  | "project"
  | "review"
  | "job"
  | "service"
  | "portfolio"
  | "payment"
  | "verification"
  | "proposal";

interface ActivityEvent {
  id: string;
  type: ActivityType;
  text: string;
  timeAgo: string;
}

interface EventMeta {
  icon: LucideIcon;
  /** Tailwind text color + bg tint (Khidma-safe accent per type) */
  color: string;
  bg: string;
}

const EVENT_META: Record<ActivityType, EventMeta> = {
  project: {
    icon: Briefcase,
    color: "text-emerald-300",
    bg: "bg-emerald-400/15",
  },
  review: {
    icon: Star,
    color: "text-amber-300",
    bg: "bg-amber-400/15",
  },
  job: {
    icon: Megaphone,
    color: "text-[#94a8a4]",
    bg: "bg-white/10",
  },
  service: {
    icon: TrendingUp,
    color: "text-teal-300",
    bg: "bg-teal-400/15",
  },
  portfolio: {
    icon: Eye,
    color: "text-sky-300",
    bg: "bg-sky-400/15",
  },
  payment: {
    icon: Wallet,
    color: "text-emerald-300",
    bg: "bg-emerald-400/15",
  },
  verification: {
    icon: ShieldCheck,
    color: "text-[#9ad0c8]",
    bg: "bg-[#32504d]/40",
  },
  proposal: {
    icon: CheckCircle2,
    color: "text-rose-300",
    bg: "bg-rose-400/15",
  },
};

/** Mock live platform events (Tunisian-context). */
const ACTIVITY_EVENTS: ActivityEvent[] = [
  {
    id: "a1",
    type: "project",
    text: "Amira just completed a project for Cassurea Technologies",
    timeAgo: "12s ago",
  },
  {
    id: "a2",
    type: "review",
    text: "Yassine received a new 5-star review",
    timeAgo: "47s ago",
  },
  {
    id: "a3",
    type: "job",
    text: "New job posted: “Build a Next.js SaaS landing page”",
    timeAgo: "1m ago",
  },
  {
    id: "a4",
    type: "service",
    text: "Syrine’s service was ordered 3 times today",
    timeAgo: "2m ago",
  },
  {
    id: "a5",
    type: "portfolio",
    text: "Mehdi’s portfolio was viewed 24 times",
    timeAgo: "3m ago",
  },
  {
    id: "a6",
    type: "payment",
    text: "TND 4,250 withdrawn via BIAT Bank",
    timeAgo: "5m ago",
  },
  {
    id: "a7",
    type: "verification",
    text: "New freelancer verified: Omar Jlassi",
    timeAgo: "7m ago",
  },
  {
    id: "a8",
    type: "payment",
    text: "Payment of TND 990 released to Amira’s wallet",
    timeAgo: "9m ago",
  },
  {
    id: "a9",
    type: "proposal",
    text: "Rania’s proposal was accepted",
    timeAgo: "11m ago",
  },
  {
    id: "a10",
    type: "project",
    text: "New milestone funded: TND 500",
    timeAgo: "13m ago",
  },
  {
    id: "a11",
    type: "review",
    text: "Skander earned his 5th five-star review this month",
    timeAgo: "16m ago",
  },
  {
    id: "a12",
    type: "verification",
    text: "Portfolio reviewed: Yasmine B. (3 new items)",
    timeAgo: "19m ago",
  },
  {
    id: "a13",
    type: "job",
    text: "Urgent job posted: “Arabic UI translation, 48h”",
    timeAgo: "22m ago",
  },
  {
    id: "a14",
    type: "service",
    text: "Anas’s “Logo in 24h” service hit 50 orders",
    timeAgo: "26m ago",
  },
];

function ActivityChip({ event }: { event: ActivityEvent }) {
  const meta = EVENT_META[event.type];
  const Icon = meta.icon;
  return (
    <span className="inline-flex items-center gap-2 whitespace-nowrap">
      <span
        className={cn(
          "inline-flex size-5 shrink-0 items-center justify-center rounded-full",
          meta.bg
        )}
      >
        <Icon className={cn("size-3", meta.color)} />
      </span>
      <span className="text-xs text-white/85">{event.text}</span>
      <span className="text-[10px] text-white/40 tabular-nums">
        · {event.timeAgo}
      </span>
      {/* Khidma dot divider , rendered after each event */}
      <span
        aria-hidden
        className="ml-3 inline-block size-1 rounded-full bg-[#6e8580]"
      />
    </span>
  );
}

export interface LiveActivityTickerProps {
  className?: string;
}

export function LiveActivityTicker({ className }: LiveActivityTickerProps) {
  const prefersReduced = useReducedMotion();
  // Duplicate the list so the marquee loops seamlessly.
  const loop = [...ACTIVITY_EVENTS, ...ACTIVITY_EVENTS];

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-full border border-white/10 bg-white/5 backdrop-blur-md",
        className
      )}
      role="status"
      aria-live="polite"
      aria-label="Live platform activity"
    >
      <div className="flex items-stretch">
        {/* LIVE indicator , fixed on the left */}
        <div className="relative z-10 flex items-center gap-2 rounded-l-full bg-[#192d2f]/80 px-3.5 py-1.5 backdrop-blur-md">
          <span className="relative flex size-2">
            <span
              className={cn(
                "absolute inline-flex size-full rounded-full bg-emerald-400",
                !prefersReduced && "animate-ping"
              )}
            />
            <span className="relative inline-flex size-2 rounded-full bg-emerald-400" />
          </span>
          <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white">
            Live
          </span>
        </div>

        {/* Track */}
        <div className="relative flex-1 overflow-hidden">
          {/* Edge fades */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 left-0 z-10 w-8 bg-gradient-to-r from-[#192d2f]/80 to-transparent"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-y-0 right-0 z-10 w-8 bg-gradient-to-l from-[#192d2f]/80 to-transparent"
          />

          {prefersReduced ? (
            // Static (no animation) , flex with horizontal scroll as fallback
            <div className="flex items-center gap-3 overflow-x-auto py-1.5 pl-3 pr-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {ACTIVITY_EVENTS.map((e) => (
                <ActivityChip key={e.id} event={e} />
              ))}
            </div>
          ) : (
            <div
              className={cn(
                "flex w-max items-center gap-3 py-1.5 pl-3 pr-3",
                "animate-marquee",
                // pause on hover
                "group-hover:[animation-play-state:paused]"
              )}
            >
              {loop.map((e, i) => (
                <ActivityChip key={`${e.id}-${i}`} event={e} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default LiveActivityTicker;
