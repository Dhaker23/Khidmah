"use client";

/**
 * TestimonialCarousel
 * -------------------
 * A premium, auto-rotating single-testimonial showcase. Sits alongside the
 * existing static `Testimonials` section (it's an addition, NOT a replacement)
 * to create a richer "social proof" cluster on the landing page.
 *
 * Layout:
 * - SectionHeading (eyebrow + title + description, centered).
 * - Featured testimonial card (max-w-4xl, centered):
 *     • Big decorative quote mark (font-display "❝")
 *     • Large italic quote text (font-display, 2xl-3xl, leading-relaxed)
 *     • 5-star rating (large)
 *     • Author row: 56px avatar + name + title/company + location flag
 *     • Project info: project title / budget (TND) / duration
 *     • Metric badges: On-time delivery ✓ / 5.0 communication ✓ / Would rehire ✓
 * - Auto-rotation: cycles through 5 testimonials every 6s.
 * - Controls:
 *     • Large circular glass prev/next arrows
 *     • 5 clickable dot indicators below
 *     • Progress bar at the bottom showing time until next rotation
 * - Pause on hover (progress bar pauses too).
 * - framer-motion direction-aware slide transitions (left/right based on arrow).
 * - prefers-reduced-motion: no auto-rotation, no slide, no progress bar;
 *   show first testimonial statically. Arrows still work for manual nav.
 *
 * Data: uses `reviews` from `@/lib/khidma-data` (4 entries) + 1 inline
 * extension to reach 5 testimonials, each enriched with mock project info
 * (budget, duration, author role/company, location flag).
 */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { ChevronLeft, ChevronRight, Star, CheckCircle2, Pause } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Reveal, SectionHeading } from "@/components/khidma/reveal";
import { reviews, formatTND } from "@/lib/khidma-data";
import { cn } from "@/lib/utils";

const ROTATION_MS = 6_000;

interface ShowcaseTestimonial {
  id: string;
  quote: string;
  rating: number;
  authorName: string;
  authorAvatar: string;
  authorTitle: string;
  authorCompany: string;
  locationLabel: string;
  projectTitle: string;
  projectBudget: number;
  projectDuration: string;
  metrics: { delivery: number; communication: number; wouldRehire: boolean };
}

/** Map the 4 mock reviews to extended showcase entries + add a 5th. */
const SHOWCASE: ShowcaseTestimonial[] = [
  {
    id: "tc1",
    quote:
      "Amira delivered an exceptional landing page. Communication was flawless, and the final result exceeded our expectations. Will definitely hire again.",
    rating: 5,
    authorName: "Sarah Chen",
    authorAvatar: reviews[0]?.fromAvatar ?? "",
    authorTitle: "Head of Product",
    authorCompany: "Cassurea Technologies",
    locationLabel: "Vancouver, Canada",
    projectTitle: "SaaS Landing Page Redesign",
    projectBudget: 4_200,
    projectDuration: "3 weeks",
    metrics: { delivery: 5, communication: 5, wouldRehire: true },
  },
  {
    id: "tc2",
    quote:
      "Outstanding work on our dashboard. Clean code, great attention to detail, and very responsive to feedback throughout the project.",
    rating: 5,
    authorName: "Karim Bouazizi",
    authorAvatar: reviews[1]?.fromAvatar ?? "",
    authorTitle: "CTO & Co-founder",
    authorCompany: "FinFlow Tunis",
    locationLabel: "Tunis, Tunisia",
    projectTitle: "Multi-tenant Admin Dashboard",
    projectBudget: 6_800,
    projectDuration: "6 weeks",
    metrics: { delivery: 4, communication: 5, wouldRehire: true },
  },
  {
    id: "tc3",
    quote:
      "Working with Yassine was a pleasure. He understood our brand perfectly and delivered a design system that our team still uses today.",
    rating: 5,
    authorName: "Lina Haddad",
    authorAvatar: reviews[2]?.fromAvatar ?? "",
    authorTitle: "Product Design Lead",
    authorCompany: "Najah Pay",
    locationLabel: "Dubai, UAE",
    projectTitle: "Fintech Mobile App Design",
    projectBudget: 5_400,
    projectDuration: "5 weeks",
    metrics: { delivery: 5, communication: 5, wouldRehire: true },
  },
  {
    id: "tc4",
    quote:
      "Great motion graphics work. Took a bit longer than expected but the final videos were excellent quality and exactly what our brand needed.",
    rating: 4,
    authorName: "Daniel Fischer",
    authorAvatar: reviews[3]?.fromAvatar ?? "",
    authorTitle: "Marketing Director",
    authorCompany: "Atlas Studios",
    locationLabel: "Berlin, Germany",
    projectTitle: "Brand Animation Reel",
    projectBudget: 3_200,
    projectDuration: "4 weeks",
    metrics: { delivery: 4, communication: 4, wouldRehire: true },
  },
  {
    id: "tc5",
    quote:
      "We hired Omar for a 3D product visualization project and the result was nothing short of stunning. The renders converted visitors into customers almost overnight.",
    rating: 5,
    authorName: "Amina Trabelsi",
    authorAvatar:
      "https://api.dicebear.com/7.x/avataaars/svg?seed=Amina%20Trabelsi&backgroundColor=32504d&radius=50",
    authorTitle: "Founder & CEO",
    authorCompany: "Maison Zitouna",
    locationLabel: "Lyon, France",
    projectTitle: "3D Product Visualization Suite",
    projectBudget: 7_500,
    projectDuration: "8 weeks",
    metrics: { delivery: 5, communication: 5, wouldRehire: true },
  },
];

type Direction = 1 | -1;

function StarRow({ rating }: { rating: number }) {
  return (
    <div
      className="flex items-center gap-1"
      role="img"
      aria-label={`${rating} out of 5 stars`}
    >
      {Array.from({ length: 5 }).map((_, i) => (
        <motion.span
          key={i}
          initial={false}
          animate={i < rating ? { scale: [0.9, 1.1, 1] } : { scale: 1 }}
          transition={{ duration: 0.3, delay: i * 0.04 }}
          className={cn(
            "inline-flex",
            i < rating ? "text-amber-400" : "text-muted-foreground/30"
          )}
        >
          <Star className="size-5 fill-current" />
        </motion.span>
      ))}
    </div>
  );
}

function MetricBadge({
  label,
  value,
  positive,
}: {
  label: string;
  value: string;
  positive: boolean;
}) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium",
        positive
          ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-600 dark:text-emerald-300"
          : "border-amber-400/30 bg-amber-400/10 text-amber-600 dark:text-amber-300"
      )}
    >
      <CheckCircle2 className="size-3.5" aria-hidden />
      <span>{label}</span>
      <span className="font-bold tabular-nums">{value}</span>
    </div>
  );
}

function TestimonialCard({ item }: { item: ShowcaseTestimonial }) {
  return (
    <div className="relative">
      {/* Big decorative quote mark */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-6 left-6 select-none font-display text-[120px] leading-[0.8] text-[#32504d] dark:text-[#9bb3ae]/15 sm:text-[160px]"
      >
        ❝
      </div>

      {/* Star rating */}
      <div className="relative mb-5 flex justify-center sm:mb-6">
        <StarRow rating={item.rating} />
      </div>

      {/* Quote */}
      <blockquote
        className="relative mx-auto max-w-3xl text-center font-display text-xl italic leading-relaxed text-foreground sm:text-2xl lg:text-3xl"
        style={{ textWrap: "balance" } as React.CSSProperties}
      >
        {item.quote}
      </blockquote>

      {/* Author row */}
      <div className="mt-7 flex flex-col items-center gap-3 sm:mt-8 sm:flex-row sm:justify-center sm:gap-4">
        <Avatar className="size-14 border-2 border-[#32504d]/20 dark:border-[#32504d]/30 shadow-sm">
          <AvatarImage src={item.authorAvatar} alt={item.authorName} />
          <AvatarFallback className="bg-[#32504d]/10 dark:bg-[#32504d]/20 text-[#32504d] dark:text-[#9bb3ae] font-semibold">
            {item.authorName.charAt(0)}
          </AvatarFallback>
        </Avatar>
        <div className="text-center sm:text-left">
          <div className="flex items-center justify-center gap-1.5 sm:justify-start">
            <span className="font-semibold text-foreground">{item.authorName}</span>
          </div>
          <div className="text-sm text-muted-foreground">
            {item.authorTitle} · <span className="text-[#32504d] dark:text-[#9bb3ae] font-medium">{item.authorCompany}</span>
            <span className="mx-1.5 opacity-40">·</span>
            <span>{item.locationLabel}</span>
          </div>
        </div>
      </div>

      {/* Project info */}
      <div className="mt-6 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-muted-foreground">
        <div className="inline-flex items-center gap-1.5">
          <span className="font-semibold uppercase tracking-wide text-[#748684]">Project:</span>
          <span className="font-medium text-foreground">{item.projectTitle}</span>
        </div>
        <span className="hidden h-3 w-px bg-border sm:inline-block" aria-hidden />
        <div className="inline-flex items-center gap-1.5">
          <span className="font-semibold uppercase tracking-wide text-[#748684]">Budget:</span>
          <span className="font-medium text-foreground tabular-nums">{formatTND(item.projectBudget)}</span>
        </div>
        <span className="hidden h-3 w-px bg-border sm:inline-block" aria-hidden />
        <div className="inline-flex items-center gap-1.5">
          <span className="font-semibold uppercase tracking-wide text-[#748684]">Duration:</span>
          <span className="font-medium text-foreground">{item.projectDuration}</span>
        </div>
      </div>

      {/* Metric badges */}
      <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
        <MetricBadge
          label="On-time delivery"
          value={`${item.metrics.delivery}.0`}
          positive={item.metrics.delivery >= 5}
        />
        <MetricBadge
          label="Communication"
          value={`${item.metrics.communication}.0`}
          positive={item.metrics.communication >= 5}
        />
        <MetricBadge
          label="Would rehire"
          value={item.metrics.wouldRehire ? "Yes" : "Maybe"}
          positive={item.metrics.wouldRehire}
        />
      </div>
    </div>
  );
}

export function TestimonialCarousel() {
  const prefersReduced = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState<Direction>(1);
  const [paused, setPaused] = useState(false);
  const [progress, setProgress] = useState(0); // 0..1
  const rafRef = useRef<number | null>(null);
  const startRef = useRef<number>(0);
  const pausedAtRef = useRef<number | null>(null);

  const total = SHOWCASE.length;
  const current = SHOWCASE[index];

  const go = useCallback(
    (dir: Direction) => {
      setDirection(dir);
      setIndex((i) => (i + dir + total) % total);
      setProgress(0);
      startRef.current = performance.now();
    },
    [total]
  );

  const goTo = useCallback(
    (target: number) => {
      if (target === index) return;
      const dir: Direction = target > index ? 1 : -1;
      setDirection(dir);
      setIndex(target);
      setProgress(0);
      startRef.current = performance.now();
    },
    [index]
  );

  // Auto-rotation loop with rAF-driven progress bar
  useEffect(() => {
    if (prefersReduced) return; // no auto-rotation under reduced motion
    startRef.current = performance.now();

    const tick = (now: number) => {
      if (paused) {
        // While paused, freeze the start time so progress doesn't jump
        if (pausedAtRef.current === null) pausedAtRef.current = now;
        rafRef.current = requestAnimationFrame(tick);
        return;
      }
      // If we just resumed, advance the start time by the paused duration
      if (pausedAtRef.current !== null) {
        const pausedDuration = now - pausedAtRef.current;
        startRef.current += pausedDuration;
        pausedAtRef.current = null;
      }
      const elapsed = now - startRef.current;
      const p = Math.min(elapsed / ROTATION_MS, 1);
      setProgress(p);
      if (p >= 1) {
        setDirection(1);
        setIndex((i) => (i + 1) % total);
        setProgress(0);
        startRef.current = now;
      }
      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [prefersReduced, paused, total]);

  // Keyboard nav (left / right arrows when carousel has focus within)
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      go(-1);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      go(1);
    }
  };

  const variants = useMemo(
    () => ({
      enter: (dir: Direction) => ({
        x: prefersReduced ? 0 : dir * 60,
        opacity: prefersReduced ? 1 : 0,
      }),
      center: { x: 0, opacity: 1 },
      exit: (dir: Direction) => ({
        x: prefersReduced ? 0 : dir * -60,
        opacity: prefersReduced ? 1 : 0,
      }),
    }),
    [prefersReduced]
  );

  return (
    <section
      className="relative overflow-hidden py-16 sm:py-24"
      aria-roledescription="carousel"
      aria-label="Featured client testimonials"
      onKeyDown={onKeyDown}
      tabIndex={0}
    >
      {/* Background , subtle gradient + decorative dot grid */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 bg-gradient-to-b from-[#32504d]/5 via-background to-[#32504d]/5"
      />
      <div
        aria-hidden
        className="bg-dot-grid-light absolute inset-0 -z-10 opacity-60"
      />
      {/* Decorative blobs */}
      <div
        aria-hidden
        className="pointer-events-none absolute -left-32 top-10 -z-10 size-72 rounded-full bg-[#32504d]/10 dark:bg-[#32504d]/20 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-32 bottom-10 -z-10 size-80 rounded-full bg-[#748684]/10 blur-3xl"
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          align="center"
          eyebrow="WHAT CLIENTS SAY"
          title={
            <>
              Trusted by clients <span className="text-khidma-accent-gradient">worldwide</span>
            </>
          }
          description="Real stories from clients who found their perfect freelancer on Khidma."
        />

        <Reveal delay={0.05}>
          <div
            className="relative mx-auto max-w-4xl"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
            onFocus={() => setPaused(true)}
            onBlur={() => setPaused(false)}
          >
            {/* Featured testimonial card */}
            <div className="relative overflow-hidden rounded-3xl border border-border/60 bg-card/80 p-6 shadow-xl shadow-[#192d2f]/5 backdrop-blur-sm khidma-card sm:p-10 lg:p-12">
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={current.id}
                  custom={direction}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    duration: prefersReduced ? 0 : 0.5,
                    ease: [0.22, 1, 0.36, 1] as const,
                  }}
                >
                  <TestimonialCard item={current} />
                </motion.div>
              </AnimatePresence>

              {/* Arrow controls (top-right on desktop, side on mobile) */}
              <div className="mt-8 flex items-center justify-between gap-4 sm:mt-10">
                <button
                  type="button"
                  onClick={() => go(-1)}
                  aria-label="Previous testimonial"
                  className={cn(
                    "inline-flex size-11 items-center justify-center rounded-full border border-border/60",
                    "bg-background/70 text-foreground backdrop-blur-md shadow-sm transition-all",
                    "hover:border-[#32504d]/40 hover:bg-[#32504d]/5 dark:bg-[#32504d]/15 hover:text-[#32504d] dark:text-[#9bb3ae]",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#32504d]/40",
                    "active:scale-95"
                  )}
                >
                  <ChevronLeft className="size-5" aria-hidden />
                </button>

                {/* Dot indicators */}
                <div
                  className="flex items-center gap-2"
                  role="tablist"
                  aria-label="Choose testimonial"
                >
                  {SHOWCASE.map((t, i) => (
                    <button
                      key={t.id}
                      type="button"
                      role="tab"
                      aria-selected={i === index}
                      aria-label={`Go to testimonial ${i + 1}`}
                      onClick={() => goTo(i)}
                      className={cn(
                        "group relative h-2 rounded-full transition-all duration-300",
                        i === index
                          ? "w-8 bg-[#32504d]"
                          : "w-2 bg-border hover:bg-[#748684]/60"
                      )}
                    >
                      {i === index && !prefersReduced && (
                        <motion.span
                          layoutId="active-dot"
                          className="absolute inset-0 rounded-full bg-[#32504d]"
                          transition={{ duration: 0.3 }}
                        />
                      )}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => go(1)}
                  aria-label="Next testimonial"
                  className={cn(
                    "inline-flex size-11 items-center justify-center rounded-full border border-border/60",
                    "bg-background/70 text-foreground backdrop-blur-md shadow-sm transition-all",
                    "hover:border-[#32504d]/40 hover:bg-[#32504d]/5 dark:bg-[#32504d]/15 hover:text-[#32504d] dark:text-[#9bb3ae]",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#32504d]/40",
                    "active:scale-95"
                  )}
                >
                  <ChevronRight className="size-5" aria-hidden />
                </button>
              </div>
            </div>

            {/* Progress bar (below the card) , only animated when not reduced-motion */}
            {!prefersReduced && (
              <div className="mx-auto mt-5 h-1 w-full max-w-md overflow-hidden rounded-full bg-border/60">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-[#32504d] to-[#748684]"
                  style={{ width: `${progress * 100}%`, transition: paused ? "none" : "width 60ms linear" }}
                  aria-hidden
                />
              </div>
            )}

            {/* Caption: "Testimonial X of Y" , sr-only for screen readers, visible small caption */}
            <div className="mt-3 text-center text-xs text-muted-foreground tabular-nums">
              {String(index + 1).padStart(2, "0")} <span className="opacity-50">/</span>{" "}
              {String(total).padStart(2, "0")}
              {paused && !prefersReduced && (
                <span className="ml-2 inline-flex items-center gap-1 text-[#748684]">
                  <Pause className="size-3" aria-hidden /> paused
                </span>
              )}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export default TestimonialCarousel;
