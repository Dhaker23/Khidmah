"use client";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

/**
 * Sophisticated skeleton loading states for Khidma.
 *
 * All skeletons use the global `shimmer` utility (defined in globals.css)
 * for a left-to-right shimmer sweep, vary their block widths/heights to
 * look realistic, and use Khidma-muted colors (`bg-muted`, `bg-muted/60`,
 * `bg-muted/40`).
 *
 * Accessibility:
 *  - Each individual card skeleton is `aria-hidden="true"` (it conveys no
 *    information to assistive tech).
 *  - Each grid/list skeleton wrapper carries `role="status"` +
 *    `aria-live="polite"` + `aria-label="Loading ..."` so screen readers
 *    announce the loading state exactly once.
 *
 * Staggered `animationDelay`s add visual interest without harming perceived
 * performance.
 */

interface BlockProps {
  className?: string;
  /** Stagger delay in seconds (applied to the shimmer animation). */
  delay?: number;
}

/** A single shimmering block. */
function Block({ className, delay = 0 }: BlockProps) {
  return (
    <div
      aria-hidden="true"
      className={cn("shimmer rounded-md bg-muted", className)}
      style={{ animationDelay: `${delay}s` }}
    />
  );
}

/* -------------------------------------------------------------------------- */
/*                              FreelancerCardSkeleton                        */
/* -------------------------------------------------------------------------- */

export function FreelancerCardSkeleton({ delay = 0 }: { delay?: number }) {
  return (
    <Card
      aria-hidden="true"
      className="khidma-card overflow-hidden p-0 border-border/60"
    >
      {/* Cover strip */}
      <Block className="h-20 w-full rounded-none bg-muted/70" delay={delay} />

      <div className="p-4 space-y-3">
        {/* Avatar + name + title (avatar overlaps cover via -mt-10) */}
        <div className="flex items-start gap-3 -mt-10">
          <Block
            className="size-14 rounded-full border-2 border-background bg-muted"
            delay={delay + 0.05}
          />
          <div className="flex-1 space-y-1.5 pt-7">
            <Block className="h-3.5 w-3/4 bg-muted" delay={delay + 0.1} />
            <Block className="h-3 w-1/2 bg-muted/60" delay={delay + 0.15} />
          </div>
        </div>

        {/* Rating + Location row */}
        <div className="flex items-center justify-between">
          <Block className="h-3 w-20 bg-muted/70" delay={delay + 0.2} />
          <Block className="h-3 w-24 bg-muted/60" delay={delay + 0.22} />
        </div>

        {/* Skills */}
        <div className="flex flex-wrap gap-1">
          <Block className="h-5 w-16 rounded-full bg-muted/70" delay={delay + 0.25} />
          <Block className="h-5 w-20 rounded-full bg-muted/60" delay={delay + 0.27} />
          <Block className="h-5 w-14 rounded-full bg-muted/40" delay={delay + 0.29} />
        </div>

        {/* Verification badges row (small icons) */}
        <div className="flex gap-1">
          <Block className="size-4 rounded-full bg-muted/60" delay={delay + 0.3} />
          <Block className="size-4 rounded-full bg-muted/40" delay={delay + 0.32} />
          <Block className="size-4 rounded-full bg-muted/60" delay={delay + 0.34} />
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-border/60 flex items-center justify-between">
          <div className="space-y-1">
            <Block className="h-2.5 w-10 bg-muted/60" delay={delay + 0.36} />
            <Block className="h-3.5 w-16 bg-muted" delay={delay + 0.38} />
          </div>
          <Block
            className="h-8 w-24 rounded-md bg-muted/70"
            delay={delay + 0.4}
          />
        </div>
      </div>
    </Card>
  );
}

/* -------------------------------------------------------------------------- */
/*                              ServiceCardSkeleton                           */
/* -------------------------------------------------------------------------- */

export function ServiceCardSkeleton({ delay = 0 }: { delay?: number }) {
  return (
    <Card
      aria-hidden="true"
      className="khidma-card overflow-hidden p-0 border-border/60"
    >
      {/* Cover (16:9) */}
      <Block
        className="aspect-[16/9] w-full rounded-none bg-muted/70"
        delay={delay}
      />

      <div className="p-4 space-y-3">
        {/* Freelancer mini row */}
        <div className="flex items-center gap-2">
          <Block className="size-6 rounded-full bg-muted" delay={delay + 0.05} />
          <Block className="h-3 w-28 bg-muted/60" delay={delay + 0.08} />
        </div>

        {/* Title (2 lines, varied widths) */}
        <div className="space-y-1.5 min-h-[2.5rem]">
          <Block className="h-3.5 w-full bg-muted" delay={delay + 0.12} />
          <Block className="h-3.5 w-2/3 bg-muted/70" delay={delay + 0.16} />
        </div>

        {/* Rating + delivery row */}
        <div className="flex items-center justify-between">
          <Block className="h-3 w-20 bg-muted/70" delay={delay + 0.2} />
          <Block className="h-3 w-10 bg-muted/60" delay={delay + 0.22} />
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-border/60 flex items-end justify-between">
          <div className="space-y-1">
            <Block className="h-2.5 w-14 bg-muted/60" delay={delay + 0.26} />
            <Block className="h-4 w-20 bg-muted" delay={delay + 0.28} />
          </div>
          <Block
            className="h-8 w-24 rounded-md bg-muted/70"
            delay={delay + 0.3}
          />
        </div>
      </div>
    </Card>
  );
}

/* -------------------------------------------------------------------------- */
/*                              JobCardSkeleton                               */
/* -------------------------------------------------------------------------- */

export function JobCardSkeleton({ delay = 0 }: { delay?: number }) {
  return (
    <Card
      aria-hidden="true"
      className="khidma-card p-5 border-border/60"
    >
      {/* Badges row */}
      <div className="flex items-center gap-2 mb-2">
        <Block className="h-5 w-20 rounded-full bg-muted/70" delay={delay} />
        <Block className="h-5 w-16 rounded-full bg-muted/60" delay={delay + 0.04} />
        <Block className="h-5 w-24 rounded-full bg-muted/40" delay={delay + 0.06} />
      </div>

      {/* Title */}
      <Block className="h-5 w-3/4 bg-muted mb-2" delay={delay + 0.1} />

      {/* Description (2 lines) */}
      <div className="space-y-1.5 mb-3">
        <Block className="h-3.5 w-full bg-muted/70" delay={delay + 0.14} />
        <Block className="h-3.5 w-5/6 bg-muted/60" delay={delay + 0.18} />
      </div>

      {/* Skills row */}
      <div className="flex flex-wrap gap-1 mb-3">
        <Block className="h-5 w-16 rounded-full bg-muted/70" delay={delay + 0.22} />
        <Block className="h-5 w-20 rounded-full bg-muted/60" delay={delay + 0.24} />
        <Block className="h-5 w-12 rounded-full bg-muted/40" delay={delay + 0.26} />
        <Block className="h-5 w-14 rounded-full bg-muted/60" delay={delay + 0.28} />
      </div>

      {/* Footer: budget + meta */}
      <div className="pt-3 border-t border-border/60 flex items-center justify-between">
        <Block className="h-4 w-32 bg-muted" delay={delay + 0.32} />
        <div className="flex items-center gap-3">
          <Block className="h-3 w-12 bg-muted/60" delay={delay + 0.34} />
          <Block className="h-3 w-10 bg-muted/40" delay={delay + 0.36} />
        </div>
      </div>
    </Card>
  );
}

/* -------------------------------------------------------------------------- */
/*                              Grid/List wrappers                            */
/* -------------------------------------------------------------------------- */

export function FreelancerGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Loading freelancers..."
      className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
    >
      {Array.from({ length: count }).map((_, i) => (
        <FreelancerCardSkeleton key={i} delay={i * 0.08} />
      ))}
      <span className="sr-only">Loading freelancers…</span>
    </div>
  );
}

export function ServiceGridSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Loading services..."
      className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
    >
      {Array.from({ length: count }).map((_, i) => (
        <ServiceCardSkeleton key={i} delay={i * 0.08} />
      ))}
      <span className="sr-only">Loading services…</span>
    </div>
  );
}

export function JobListSkeleton({ count = 4 }: { count?: number }) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Loading jobs..."
      className="space-y-4"
    >
      {Array.from({ length: count }).map((_, i) => (
        <JobCardSkeleton key={i} delay={i * 0.07} />
      ))}
      <span className="sr-only">Loading jobs…</span>
    </div>
  );
}
