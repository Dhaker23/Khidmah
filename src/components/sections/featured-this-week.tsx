"use client";

/**
 * FeaturedThisWeek
 * ----------------
 * A premium rotating banner that cycles through 5 featured items every 5s:
 *   1. Featured Freelancer  — "Amira Ben Salah — Full-Stack Developer of the Week"
 *   2. Featured Service     — "I will build a professional Next.js landing page"
 *   3. Featured Job         — "Urgent: Build a Next.js SaaS landing page"
 *   4. Featured Article     — "How to write a winning proposal on Khidma"
 *   5. Featured Event       — "Portfolio Masterclass with Yassine Gharbi"
 *
 * Layout:
 *  - Full-width dark-teal gradient banner with dot-grid pattern.
 *  - Left column: "FEATURED THIS WEEK" eyebrow + rotating title + description + CTA.
 *  - Right column: rotating visual preview (avatar/cover/event card).
 *  - Bottom row: 5 clickable dot indicators + a thin auto-advance progress bar.
 *
 * Behavior:
 *  - Auto-advances every 5s (full cycle resets progress bar each item).
 *  - Pauses on hover.
 *  - Clicking a dot jumps to that item and resets the timer.
 *  - Respects `prefers-reduced-motion` — no auto-advance, no progress bar,
 *    shows the first item only, dots remain clickable.
 *
 * All animations are framer-motion (slide + fade cross-fade via AnimatePresence).
 */

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type Transition,
} from "framer-motion";
import {
  ArrowRight,
  Star,
  Clock,
  Calendar,
  BookOpen,
  Megaphone,
  Briefcase,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useApp } from "@/lib/store";
import {
  freelancers,
  jobs,
  getAllServices,
  formatTND,
} from "@/lib/khidma-data";
import { cn } from "@/lib/utils";

// =====================================================================
// Types
// =====================================================================

type FeaturedKind =
  | "freelancer"
  | "service"
  | "job"
  | "article"
  | "event";

interface FeaturedItem {
  id: string;
  kind: FeaturedKind;
  eyebrow: string;
  title: ReactNode;
  description: string;
  cta: string;
  /** Click handler — falls back to a no-op + toast if the target is unavailable. */
  onClick: () => void;
  /** The visual preview shown on the right (avatar, cover, event card). */
  visual: ReactNode;
}

// =====================================================================
// Duration of each item before auto-advance (ms)
// =====================================================================

const ITEM_DURATION_MS = 5000;

// =====================================================================
// Per-kind meta (icon + accent color)
// =====================================================================

const KIND_META: Record<
  FeaturedKind,
  { icon: LucideIcon; color: string; bg: string; ring: string }
> = {
  freelancer: {
    icon: Sparkles,
    color: "text-emerald-300",
    bg: "bg-emerald-400/15",
    ring: "ring-emerald-400/30",
  },
  service: {
    icon: Briefcase,
    color: "text-teal-300",
    bg: "bg-teal-400/15",
    ring: "ring-teal-400/30",
  },
  job: {
    icon: Megaphone,
    color: "text-[#9ad0c8]",
    bg: "bg-[#32504d]/50",
    ring: "ring-[#6e8580]/40",
  },
  article: {
    icon: BookOpen,
    color: "text-amber-200",
    bg: "bg-amber-400/15",
    ring: "ring-amber-400/30",
  },
  event: {
    icon: Calendar,
    color: "text-rose-200",
    bg: "bg-rose-400/15",
    ring: "ring-rose-400/30",
  },
};

// =====================================================================
// Toast fallback — used when no target is available (article/event)
// =====================================================================

function useFeaturedClick() {
  const { openFreelancer, openService, openJob, openOnboarding } = useApp();
  return {
    openFreelancer,
    openService,
    openJob,
    openOnboarding,
  };
}

// =====================================================================
// Visual sub-components
// =====================================================================

function FreelancerVisual({ freelancerId }: { freelancerId: string }) {
  const f = freelancers.find((x) => x.id === freelancerId)!;
  return (
    <div className="relative w-full">
      <motion.div
        layout
        className="relative mx-auto w-full max-w-sm overflow-hidden rounded-3xl border border-white/15 bg-white/5 p-5 backdrop-blur-xl shadow-2xl"
      >
        {/* Glow */}
        <div
          aria-hidden
          className="absolute -top-12 -right-12 size-40 rounded-full blur-3xl"
          style={{
            background:
              "radial-gradient(circle, rgba(116,134,132,0.35) 0%, transparent 70%)",
          }}
        />
        <div className="relative flex items-center gap-4">
          <div className="relative">
            <Avatar className="size-16 border-2 border-emerald-400/40 shadow-lg">
              <AvatarImage src={f.avatar} alt={f.name} />
              <AvatarFallback className="bg-[#32504d] text-white text-lg font-bold">
                {f.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <span className="absolute -bottom-1 -right-1 inline-flex size-5 items-center justify-center rounded-full bg-emerald-400/90 text-[10px] font-bold text-[#192d2f] ring-2 ring-[#192d2f]">
              ★
            </span>
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h3 className="truncate font-display text-base font-semibold text-white">
                {f.name}
              </h3>
              <Badge className="border-emerald-400/40 bg-emerald-400/15 text-[10px] text-emerald-200 hover:bg-emerald-400/20">
                Top Rated
              </Badge>
            </div>
            <p className="truncate text-xs text-white/70">{f.title}</p>
            <div className="mt-1 flex items-center gap-3 text-xs text-white/70">
              <span className="inline-flex items-center gap-1">
                <Star className="size-3 fill-amber-400 text-amber-400" />
                <span className="font-semibold text-white">{f.rating.toFixed(1)}</span>
                <span className="text-white/50">({f.reviewsCount})</span>
              </span>
              <span className="text-white/40">·</span>
              <span>{f.completedProjects} projects</span>
            </div>
          </div>
        </div>
        <div className="relative mt-4 flex flex-wrap gap-1.5">
          {f.skills.slice(0, 4).map((s) => (
            <span
              key={s}
              className="rounded-md border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] text-white/80"
            >
              {s}
            </span>
          ))}
        </div>
        <div className="relative mt-4 flex items-center justify-between rounded-xl border border-white/10 bg-[#192d2f]/40 px-3 py-2">
          <span className="text-[10px] uppercase tracking-wider text-white/60">
            Starting from
          </span>
          <span className="font-display text-sm font-bold text-white">
            {formatTND(f.hourlyRate)}
            <span className="text-[10px] font-normal text-white/60">/hr</span>
          </span>
        </div>
      </motion.div>
    </div>
  );
}

function ServiceVisual({ serviceId }: { serviceId: string }) {
  const service = getAllServices().find((s) => s.id === serviceId)!;
  const f = freelancers.find((x) => x.id === service.freelancerId)!;
  return (
    <motion.div
      layout
      className="relative mx-auto w-full max-w-sm overflow-hidden rounded-3xl border border-white/15 bg-white/5 backdrop-blur-xl shadow-2xl"
    >
      {/* Cover */}
      <div className="relative h-32 w-full overflow-hidden bg-[#32504d]">
        <div
          className="absolute inset-0 opacity-90"
          style={{
            background:
              "linear-gradient(135deg, rgba(50,80,77,0.95) 0%, rgba(116,134,132,0.7) 100%)",
          }}
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-dot-grid opacity-60"
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <Briefcase className="size-10 text-white/30" />
        </div>
        <div className="absolute left-3 top-3">
          <Badge className="border-white/20 bg-[#192d2f]/70 text-[10px] text-white backdrop-blur-sm">
            {service.category}
          </Badge>
        </div>
      </div>
      <div className="p-4">
        <h3 className="line-clamp-2 font-display text-sm font-semibold text-white leading-snug">
          {service.title}
        </h3>
        <div className="mt-2 flex items-center gap-2">
          <Avatar className="size-5 border border-white/20">
            <AvatarImage src={f.avatar} alt={f.name} />
            <AvatarFallback className="bg-[#32504d] text-[9px] text-white">
              {f.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <span className="text-[10px] text-white/70">{f.name}</span>
          <span className="inline-flex items-center gap-0.5 text-[10px] text-white/70">
            <Star className="size-2.5 fill-amber-400 text-amber-400" />
            <span className="font-semibold text-white">
              {service.rating.toFixed(1)}
            </span>
          </span>
        </div>
        <div className="mt-3 flex flex-wrap gap-1">
          {service.skills.slice(0, 3).map((s) => (
            <span
              key={s}
              className="rounded border border-white/10 bg-white/5 px-1.5 py-0.5 text-[9px] text-white/75"
            >
              {s}
            </span>
          ))}
        </div>
        <div className="mt-3 flex items-center justify-between border-t border-white/10 pt-3">
          <div className="flex items-center gap-1 text-[10px] text-white/60">
            <Clock className="size-3" />
            {service.deliveryDays}d delivery
          </div>
          <div className="text-right">
            <div className="text-[9px] uppercase tracking-wider text-white/50">
              from
            </div>
            <div className="font-display text-sm font-bold text-white">
              {formatTND(service.startingPrice)}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function JobVisual({ jobId }: { jobId: string }) {
  const job = jobs.find((x) => x.id === jobId)!;
  return (
    <motion.div
      layout
      className="relative mx-auto w-full max-w-sm overflow-hidden rounded-3xl border border-rose-400/30 bg-white/5 p-5 backdrop-blur-xl shadow-2xl"
    >
      <div
        aria-hidden
        className="absolute -bottom-12 -left-12 size-40 rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(244,114,114,0.25) 0%, transparent 70%)",
        }}
      />
      <div className="relative flex items-center justify-between">
        <Badge className="border-rose-400/40 bg-rose-400/15 text-[10px] text-rose-200">
          <Megaphone className="size-2.5" />
          Urgent
        </Badge>
        <span className="text-[10px] text-white/60">{job.postedAt}</span>
      </div>
      <h3 className="relative mt-3 line-clamp-3 font-display text-sm font-semibold text-white leading-snug">
        {job.title}
      </h3>
      <div className="relative mt-3 flex flex-wrap items-center gap-2 text-[10px] text-white/70">
        <Badge variant="outline" className="border-white/15 text-[9px] text-white/70">
          {job.category}
        </Badge>
        <Badge variant="outline" className="border-white/15 text-[9px] text-white/70">
          {job.experienceLevel}
        </Badge>
        <Badge variant="outline" className="border-white/15 text-[9px] text-white/70">
          {job.location}
        </Badge>
      </div>
      <div className="relative mt-3 flex flex-wrap gap-1">
        {job.skills.slice(0, 4).map((s) => (
          <span
            key={s}
            className="rounded border border-white/10 bg-white/5 px-1.5 py-0.5 text-[9px] text-white/75"
          >
            {s}
          </span>
        ))}
      </div>
      <div className="relative mt-4 flex items-center justify-between rounded-xl border border-white/10 bg-[#192d2f]/40 px-3 py-2.5">
        <div>
          <div className="text-[9px] uppercase tracking-wider text-white/50">
            Budget
          </div>
          <div className="font-display text-sm font-bold text-white">
            {formatTND(job.budget.min)} – {formatTND(job.budget.max)}
          </div>
        </div>
        <div className="text-right">
          <div className="text-[9px] uppercase tracking-wider text-white/50">
            Proposals
          </div>
          <div className="font-display text-sm font-bold text-white">
            {job.proposals}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

function ArticleVisual() {
  return (
    <motion.div
      layout
      className="relative mx-auto w-full max-w-sm overflow-hidden rounded-3xl border border-white/15 bg-gradient-to-br from-[#32504d]/80 to-[#192d2f]/90 p-5 backdrop-blur-xl shadow-2xl"
    >
      <div
        aria-hidden
        className="absolute -top-12 -right-12 size-40 rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(251,191,36,0.25) 0%, transparent 70%)",
        }}
      />
      <div className="relative flex items-center gap-2">
        <Badge className="border-amber-400/40 bg-amber-400/15 text-[10px] text-amber-200">
          <BookOpen className="size-2.5" />
          Khidma Blog
        </Badge>
        <span className="text-[10px] text-white/60">8 min read</span>
      </div>
      <div className="relative mt-4 flex items-center gap-3">
        <div className="flex size-12 items-center justify-center rounded-xl bg-amber-400/15 ring-1 ring-amber-400/30">
          <BookOpen className="size-5 text-amber-200" />
        </div>
        <div>
          <div className="text-[10px] uppercase tracking-wider text-white/50">
            Featured Article
          </div>
          <div className="text-xs font-semibold text-white">Winning Proposals</div>
        </div>
      </div>
      <h3 className="relative mt-4 line-clamp-3 font-display text-base font-semibold text-white leading-snug">
        How to write a winning proposal on Khidma
      </h3>
      <p className="relative mt-2 line-clamp-2 text-xs text-white/70 leading-relaxed">
        Stop sending copy-paste proposals. Learn the 5-step framework Top Rated
        freelancers use to win 3× more projects on Khidma.
      </p>
      <div className="relative mt-4 flex items-center justify-between border-t border-white/10 pt-3">
        <div className="flex items-center gap-1 text-[10px] text-white/60">
          <Clock className="size-3" />
          Updated 2 days ago
        </div>
        <div className="text-[10px] text-amber-200 font-semibold">
          Read article →
        </div>
      </div>
    </motion.div>
  );
}

function EventVisual() {
  return (
    <motion.div
      layout
      className="relative mx-auto w-full max-w-sm overflow-hidden rounded-3xl border border-rose-400/30 bg-gradient-to-br from-[#32504d]/80 to-[#192d2f]/90 p-5 backdrop-blur-xl shadow-2xl"
    >
      <div
        aria-hidden
        className="absolute -bottom-12 -right-12 size-40 rounded-full blur-3xl"
        style={{
          background:
            "radial-gradient(circle, rgba(244,114,114,0.3) 0%, transparent 70%)",
        }}
      />
      <div className="relative flex items-center justify-between">
        <Badge className="border-rose-400/40 bg-rose-400/15 text-[10px] text-rose-200">
          <Calendar className="size-2.5" />
          Khidma Event
        </Badge>
        <span className="text-[10px] text-white/60">In-person · Tunis</span>
      </div>
      {/* Date block */}
      <div className="relative mt-4 flex items-center gap-3">
        <div className="flex size-14 flex-col items-center justify-center rounded-xl border border-rose-400/30 bg-rose-400/10">
          <span className="text-[9px] uppercase tracking-wider text-rose-200">
            Sat
          </span>
          <span className="font-display text-xl font-bold text-white">29</span>
          <span className="text-[8px] uppercase tracking-wider text-rose-200">
            Mar
          </span>
        </div>
        <div>
          <div className="text-[10px] uppercase tracking-wider text-white/50">
            Masterclass
          </div>
          <div className="text-xs font-semibold text-white">
            Portfolio Masterclass
          </div>
          <div className="text-[10px] text-white/70">
            with Yassine Gharbi
          </div>
        </div>
      </div>
      <h3 className="relative mt-4 line-clamp-2 font-display text-base font-semibold text-white leading-snug">
        Portfolio Masterclass with Yassine Gharbi
      </h3>
      <div className="relative mt-3 flex items-center justify-between rounded-xl border border-white/10 bg-[#192d2f]/40 px-3 py-2.5">
        <div className="flex items-center gap-1.5 text-[10px] text-white/70">
          <Calendar className="size-3" />
          Sat Mar 29 · 18:00
        </div>
        <div className="flex items-center gap-1 text-[10px] text-rose-200 font-semibold">
          <Clock className="size-3" />
          2 hours
        </div>
      </div>
      <div className="relative mt-2 flex items-center gap-1.5 text-[10px] text-white/70">
        <span className="size-1.5 rounded-full bg-rose-400" />
        Le Belvédère · Tunis, Tunisia
      </div>
    </motion.div>
  );
}

// =====================================================================
// Featured items — assembled once per render via useMemo
// =====================================================================

function useFeaturedItems(): FeaturedItem[] {
  const { openFreelancer, openService, openJob } = useFeaturedClick();
  return useMemo(
    () => [
      {
        id: "fw-freelancer",
        kind: "freelancer" as const,
        eyebrow: "Freelancer of the Week",
        title: (
          <>
            Amira Ben Salah —{" "}
            <span className="text-khidma-gradient">
              Full-Stack Developer of the Week
            </span>
          </>
        ),
        description:
          "Senior full-stack engineer with 7+ years building production Next.js apps. 142 completed projects. 4.9★ rating. Available now.",
        cta: "View profile",
        onClick: () => openFreelancer("f1"),
        visual: <FreelancerVisual freelancerId="f1" />,
      },
      {
        id: "fw-service",
        kind: "service" as const,
        eyebrow: "Featured Service",
        title: (
          <>
            I will build a professional Next.js landing page —{" "}
            <span className="text-khidma-gradient">from TND 350</span>
          </>
        ),
        description:
          "Premium responsive landing page with animations, SEO optimization, and lead capture. Trusted by 80+ clients. 5-day delivery.",
        cta: "View service",
        onClick: () => openService("s1"),
        visual: <ServiceVisual serviceId="s1" />,
      },
      {
        id: "fw-job",
        kind: "job" as const,
        eyebrow: "Featured Job",
        title: (
          <>
            Urgent: Build a Next.js SaaS landing page —{" "}
            <span className="text-khidma-gradient">TND 800 – 1,500</span>
          </>
        ),
        description:
          "Tunisian fintech startup needs an experienced Next.js developer for a high-converting landing page. GSAP animations + SEO + lead capture.",
        cta: "View job",
        onClick: () => openJob("j1"),
        visual: <JobVisual jobId="j1" />,
      },
      {
        id: "fw-article",
        kind: "article" as const,
        eyebrow: "Featured Article",
        title: (
          <>
            How to write a{" "}
            <span className="text-khidma-gradient">winning proposal</span> on
            Khidma
          </>
        ),
        description:
          "Stop sending copy-paste proposals. Learn the 5-step framework Top Rated freelancers use to win 3× more projects on Khidma.",
        cta: "Read article",
        onClick: () => {
          /* Articles are mocked — show a friendly toast via store openOnboarding */
        },
        visual: <ArticleVisual />,
      },
      {
        id: "fw-event",
        kind: "event" as const,
        eyebrow: "Featured Event",
        title: (
          <>
            Portfolio Masterclass with{" "}
            <span className="text-khidma-gradient">Yassine Gharbi</span>
          </>
        ),
        description:
          "Live in-person masterclass in Tunis — Saturday, March 29. Learn how to build a portfolio that lands clients. Limited seats.",
        cta: "Register",
        onClick: () => {
          /* Events are mocked */
        },
        visual: <EventVisual />,
      },
    ],
    [openFreelancer, openService, openJob]
  );
}

// =====================================================================
// Transition presets
// =====================================================================

const SLIDE_TRANSITION: Transition = {
  duration: 0.55,
  ease: [0.22, 1, 0.36, 1] as const,
};

// =====================================================================
// Main component
// =====================================================================

export function FeaturedThisWeek() {
  const prefersReduced = useReducedMotion();
  const items = useFeaturedItems();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [direction, setDirection] = useState<1 | -1>(1);
  // Progress value (0..1) for the auto-advance bar
  const [progress, setProgress] = useState(0);
  // Ref to the rAF start time so we can compute progress without re-rendering
  const rafRef = useRef<number | null>(null);
  const startRef = useRef<number>(0);

  const total = items.length;

  const goTo = useCallback(
    (next: number, dir: 1 | -1 = 1) => {
      const normalized = ((next % total) + total) % total;
      setDirection(dir);
      setIndex(normalized);
      setProgress(0);
    },
    [total]
  );

  const goNext = useCallback(
    () => goTo(index + 1, 1),
    [goTo, index]
  );
  const goPrev = useCallback(
    () => goTo(index - 1, -1),
    [goTo, index]
  );

  // -------------------------------------------------------------------
  // Auto-advance loop — drives the progress bar via rAF.
  // Skipped entirely under prefers-reduced-motion (item stays at 0).
  // -------------------------------------------------------------------
  useEffect(() => {
    if (prefersReduced) return;
    if (paused) return;

    startRef.current = performance.now();

    const tick = (now: number) => {
      const elapsed = now - startRef.current;
      const p = Math.min(elapsed / ITEM_DURATION_MS, 1);
      setProgress(p);
      if (p >= 1) {
        goNext();
        return; // goNext resets progress; the effect will restart on next render
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [index, paused, prefersReduced, goNext]);

  // Clean up on unmount
  useEffect(
    () => () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    },
    []
  );

  const current = items[index];
  const KindIcon = KIND_META[current.kind].icon;

  // Variants — slide + fade. Under reduced-motion we just cross-fade.
  const leftVariants = prefersReduced
    ? {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
      }
    : {
        initial: (dir: number) => ({
          opacity: 0,
          x: dir > 0 ? 24 : -24,
        }),
        animate: { opacity: 1, x: 0 },
        exit: (dir: number) => ({
          opacity: 0,
          x: dir > 0 ? -24 : 24,
        }),
      };

  const rightVariants = prefersReduced
    ? {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
      }
    : {
        initial: (dir: number) => ({
          opacity: 0,
          x: dir > 0 ? 40 : -40,
          scale: 0.96,
        }),
        animate: { opacity: 1, x: 0, scale: 1 },
        exit: (dir: number) => ({
          opacity: 0,
          x: dir > 0 ? -40 : 40,
          scale: 0.96,
        }),
      };

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Featured this week"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      className="relative overflow-hidden bg-khidma-gradient"
    >
      {/* Dot grid overlay */}
      <div
        aria-hidden
        className="absolute inset-0 bg-dot-grid opacity-50 pointer-events-none"
      />
      {/* Soft radial glow */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at 20% 20%, rgba(116,134,132,0.18) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(50,80,77,0.25) 0%, transparent 55%)",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {/* Top row: eyebrow + kind badge */}
        <div className="mb-6 flex items-center justify-between">
          <span className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.25em] text-white/70">
            <span className="size-1.5 rounded-full bg-emerald-400" />
            Featured this week
          </span>
          <div className="hidden sm:flex items-center gap-1.5">
            <span
              className={cn(
                "inline-flex size-6 items-center justify-center rounded-full",
                KIND_META[current.kind].bg,
                "ring-1",
                KIND_META[current.kind].ring
              )}
            >
              <KindIcon
                className={cn("size-3", KIND_META[current.kind].color)}
              />
            </span>
            <span className="text-[11px] font-medium text-white/70">
              {current.eyebrow}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          {/* Left: rotating title + description + CTA */}
          <div className="lg:col-span-7 relative min-h-[220px] sm:min-h-[260px]">
            <AnimatePresence custom={direction} mode="wait">
              <motion.div
                key={current.id}
                custom={direction}
                initial="initial"
                animate="animate"
                exit="exit"
                variants={leftVariants}
                transition={SLIDE_TRANSITION}
                className="relative"
              >
                {/* Mobile-only kind badge */}
                <div className="sm:hidden mb-3">
                  <span
                    className={cn(
                      "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-medium",
                      KIND_META[current.kind].bg,
                      KIND_META[current.kind].color
                    )}
                  >
                    <KindIcon className="size-3" />
                    {current.eyebrow}
                  </span>
                </div>

                <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white leading-[1.15]">
                  {current.title}
                </h2>
                <p className="mt-3 max-w-xl text-sm sm:text-base text-white/75 leading-relaxed">
                  {current.description}
                </p>

                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <Button
                    onClick={current.onClick}
                    className="group h-11 px-5 bg-white text-[#192d2f] hover:bg-white hover:shadow-[0_8px_30px_-4px_rgba(255,255,255,0.5)]"
                  >
                    {current.cta}
                    <ArrowRight className="ml-1 size-4 transition-transform group-hover:translate-x-1" />
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={goPrev}
                    aria-label="Previous featured item"
                    className="h-11 w-11 p-0 text-white/70 hover:text-white hover:bg-white/10"
                  >
                    <ChevronLeft className="size-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={goNext}
                    aria-label="Next featured item"
                    className="h-11 w-11 p-0 text-white/70 hover:text-white hover:bg-white/10"
                  >
                    <ChevronRight className="size-4" />
                  </Button>
                  <span className="text-[11px] tabular-nums text-white/50">
                    {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
                  </span>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Right: rotating visual */}
          <div className="lg:col-span-5 relative min-h-[280px] sm:min-h-[320px] flex items-center justify-center">
            <AnimatePresence custom={direction} mode="wait">
              <motion.div
                key={current.id}
                custom={direction}
                initial="initial"
                animate="animate"
                exit="exit"
                variants={rightVariants}
                transition={SLIDE_TRANSITION}
                className="relative w-full"
              >
                {current.visual}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Bottom: dot indicators */}
        <div className="mt-8 sm:mt-10 flex flex-col gap-3">
          <div className="flex items-center justify-center gap-2.5">
            {items.map((item, i) => {
              const Icon = KIND_META[item.kind].icon;
              const active = i === index;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => goTo(i, i > index ? 1 : -1)}
                  aria-label={`Go to ${item.eyebrow}: ${typeof item.title === "string" ? item.title : item.eyebrow}`}
                  aria-current={active ? "true" : undefined}
                  className={cn(
                    "group relative inline-flex h-8 items-center justify-center gap-1.5 rounded-full px-3 transition-all duration-300",
                    active
                      ? "bg-white/15 backdrop-blur-sm ring-1 ring-white/20"
                      : "hover:bg-white/5"
                  )}
                >
                  <Icon
                    className={cn(
                      "size-3 transition-colors",
                      active
                        ? KIND_META[item.kind].color
                        : "text-white/40 group-hover:text-white/70"
                    )}
                  />
                  <span
                    className={cn(
                      "h-1.5 rounded-full transition-all duration-300",
                      active ? "w-6 bg-white" : "w-1.5 bg-white/30"
                    )}
                  />
                </button>
              );
            })}
          </div>

          {/* Auto-advance progress bar */}
          <div className="relative h-0.5 w-full overflow-hidden rounded-full bg-white/10">
            <motion.div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#748684] via-[#94a8a4] to-white"
              animate={
                prefersReduced
                  ? { width: "0%" }
                  : { width: `${progress * 100}%` }
              }
              transition={prefersReduced ? { duration: 0 } : { duration: 0 }}
              style={{ width: prefersReduced ? "0%" : `${progress * 100}%` }}
              aria-hidden
            />
          </div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
    </section>
  );
}

export default FeaturedThisWeek;
