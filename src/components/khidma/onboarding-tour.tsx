"use client";

/**
 * Onboarding Tour — first-visit guided walkthrough
 * -----------------------------------------------
 * Highlights key UI elements on the landing page the first time a guest
 * visits Khidma. Uses a spotlight overlay (huge box-shadow) to dim the rest
 * of the page + a tooltip card that floats near the highlighted target.
 *
 * Six steps:
 *   1. Welcome (centered modal)
 *   2. Search → header search bar
 *   3. Navigation → header nav buttons
 *   4. CTA → "Join Khidma" button
 *   5. Trust → hero trust chips / Trust Seal
 *   6. Final (centered modal → openAuth("register"))
 *
 * Auto-starts 1.5s after first load when:
 *   `!localStorage["khidma:tour-completed"]` && `!currentUser`
 *
 * Respects `prefers-reduced-motion` (instant transitions).
 * Mobile responsive: tooltip becomes a bottom sheet on small screens.
 *
 * Palette: Khidma teal only — #475959 #2b3d3d #748684 #192d2f #32504d #6e8580 #ffffff
 */

import {
  useEffect,
  useState,
  useRef,
  useLayoutEffect,
  type ReactNode,
} from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  Sparkles,
  Search,
  Compass,
  Rocket,
  ShieldCheck,
  PartyPopper,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useApp } from "@/lib/store";
import { cn } from "@/lib/utils";

interface TourStepDef {
  /** Spotlight target selector. `null` = centered modal step. */
  selector?: string;
  title: string;
  description: string;
  icon: typeof Search;
  /** Preferred tooltip placement relative to target. */
  placement?: "below" | "above" | "center";
}

const TOUR_STEPS: TourStepDef[] = [
  {
    title: "Welcome to Khidma 👋",
    description:
      "The trusted marketplace for verified Tunisian talent. Let's take a quick tour.",
    icon: Sparkles,
    placement: "center",
  },
  {
    selector: '[data-tour="search"], header button[aria-label*="Search"]',
    title: "Find anyone, anything",
    description:
      "Use ⌘K or the search bar to find freelancers, services, jobs, or jump to any page.",
    icon: Search,
    placement: "below",
  },
  {
    selector: '[data-tour="nav"], header nav',
    title: "Explore the marketplace",
    description:
      "Browse freelancers, find work, or check out services.",
    icon: Compass,
    placement: "below",
  },
  {
    selector: '[data-tour="join"]',
    title: "Get started free",
    description:
      "Join Khidma as a freelancer or client — it's free and takes 2 minutes.",
    icon: Rocket,
    placement: "below",
  },
  {
    selector: '[data-tour="trust-seal"], [data-tour="trust-chips"]',
    title: "Real people. Real trust.",
    description:
      "Every freelancer is verified: identity, portfolio, reviews.",
    icon: ShieldCheck,
    placement: "above",
  },
  {
    title: "You're all set! 🎉",
    description:
      "Explore the marketplace, save your favorites, and start your Khidma journey today.",
    icon: PartyPopper,
    placement: "center",
  },
];

const TOTAL_STEPS = TOUR_STEPS.length;

/** Resolve a CSS-selector target to a visible DOM element, if present. */
function resolveTarget(selector?: string): HTMLElement | null {
  if (!selector || typeof document === "undefined") return null;
  // Try each comma-separated part individually (some selectors like `:has`
  // are valid CSS but not always supported by querySelector in older engines).
  const parts = selector.split(",").map((s) => s.trim()).filter(Boolean);
  let found: HTMLElement | null = null;
  for (const p of parts) {
    try {
      const el = document.querySelector<HTMLElement>(p);
      if (!el) continue;
      // Element exists — check it's actually visible (not display:none).
      // `offsetParent` is null for fixed elements, so also check rect size.
      const rect = el.getBoundingClientRect();
      const isVisible =
        (el.offsetParent !== null || rect.width > 0) &&
        rect.width > 0 &&
        rect.height > 0;
      if (isVisible) {
        found = el;
        break;
      }
      // Not visible — remember as a fallback (last non-visible hit) if we
      // haven't found a visible one yet.
      if (!found) found = el;
    } catch {
      /* invalid selector — keep going */
    }
  }
  // If the specific target wasn't visible (e.g., on mobile where the desktop
  // nav/search isn't shown), fall back to the header element so the spotlight
  // still has something to anchor to.
  if (!found) {
    const header = document.querySelector<HTMLElement>("header");
    if (header) return header;
  }
  return found;
}

interface TargetRect {
  top: number;
  left: number;
  width: number;
  height: number;
}

const ZERO_RECT: TargetRect = { top: 0, left: 0, width: 0, height: 0 };

function getRect(el: HTMLElement | null): TargetRect {
  if (!el) return ZERO_RECT;
  const r = el.getBoundingClientRect();
  // Clamp width/height to >= 0 to avoid layout warnings.
  return {
    top: r.top,
    left: r.left,
    width: Math.max(0, r.width),
    height: Math.max(0, r.height),
  };
}

export function OnboardingTour() {
  const prefersReduced = useReducedMotion();
  const {
    tourActive,
    tourStep,
    currentUser,
    startTour,
    nextTourStep,
    prevTourStep,
    endTour,
    skipTour,
    openAuth,
  } = useApp();

  const [targetRect, setTargetRect] = useState<TargetRect>(ZERO_RECT);
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);

  // Mount guard — client only
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);

  // Auto-start the tour 1.5s after first load if conditions are met.
  useEffect(() => {
    if (!mounted) return;
    if (typeof window === "undefined") return;
    let completed = false;
    try {
      completed = window.localStorage.getItem("khidma:tour-completed") === "true";
    } catch {
      /* ignore */
    }
    if (completed || currentUser) return;
    const timer = window.setTimeout(() => {
      // Only auto-start on the home view (avoid running on sub-views).
      const view = useApp.getState().view;
      if (view === "home") startTour();
    }, 1500);
    return () => window.clearTimeout(timer);
  }, [mounted, currentUser, startTour]);

  // Mobile breakpoint listener.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(max-width: 640px)");
    const on = () => setIsMobile(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);

  // Track the spotlight target's bounding rect and update on resize/scroll.
  useLayoutEffect(() => {
    if (!tourActive) return;
    const stepDef = TOUR_STEPS[tourStep];
    const target = resolveTarget(stepDef?.selector);

    // Defer the initial rect measurement via rAF so we don't call setState
    // synchronously inside the effect body (avoids cascading renders).
    const update = (el: HTMLElement | null) => setTargetRect(getRect(el));

    if (!target) {
      const raf = requestAnimationFrame(() => update(null));
      return () => cancelAnimationFrame(raf);
    }

    // Scroll the target into view (smooth unless reduced-motion) before measuring.
    try {
      target.scrollIntoView({
        behavior: prefersReduced ? "auto" : "smooth",
        block: "center",
      });
    } catch {
      /* ignore — older browsers */
    }
    const onResizeScroll = () => update(target);
    const raf = requestAnimationFrame(() => update(target));
    // Re-measure after smooth-scroll settles.
    const t = window.setTimeout(onResizeScroll, prefersReduced ? 0 : 350);
    window.addEventListener("resize", onResizeScroll);
    window.addEventListener("scroll", onResizeScroll, true);
    return () => {
      window.clearTimeout(t);
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResizeScroll);
      window.removeEventListener("scroll", onResizeScroll, true);
    };
  }, [tourActive, tourStep, prefersReduced]);

  // ESC to skip the tour.
  useEffect(() => {
    if (!tourActive) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") skipTour();
      else if (e.key === "ArrowRight") nextTourStep();
      else if (e.key === "ArrowLeft" && tourStep > 0) prevTourStep();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [tourActive, tourStep, nextTourStep, prevTourStep, skipTour]);

  if (!mounted || !tourActive) return null;

  const stepDef = TOUR_STEPS[tourStep];
  const isCenter = !stepDef?.selector;
  const isLast = tourStep === TOTAL_STEPS - 1;
  const isFirst = tourStep === 0;

  // Spotlight positioning (with padding so target has a visible margin).
  const PADDING = 8;
  const spotTop = Math.max(0, targetRect.top - PADDING);
  const spotLeft = Math.max(0, targetRect.left - PADDING);
  const spotW = targetRect.width + PADDING * 2;
  const spotH = targetRect.height + PADDING * 2;
  const hasSpotlight = !isCenter && targetRect.width > 0;

  // Tooltip placement — below target (header) or above (hero). Mobile = bottom sheet.
  const placeBelow = stepDef?.placement !== "above";
  const tooltipStyle: React.CSSProperties =
    isCenter || isMobile
      ? {}
      : {
          position: "fixed",
          top: placeBelow
            ? Math.min(
                window.innerHeight - 220,
                spotTop + spotH + 12
              )
            : Math.max(16, spotTop - 220),
          left: Math.max(
            16,
            Math.min(
              window.innerWidth - 360 - 16,
              spotLeft + spotW / 2 - 180
            )
          ),
          width: 360,
          zIndex: 70,
        };

  const onPrimaryClick = () => {
    if (isLast) {
      endTour();
      openAuth("register");
    } else {
      nextTourStep();
    }
  };

  const backdrop = prefersReduced ? undefined : { duration: 0.25 };
  const tooltipEnter = prefersReduced
    ? { duration: 0 }
    : { duration: 0.32, ease: [0.22, 1, 0.36, 1] as const };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Khidma tour — step ${tourStep + 1} of ${TOTAL_STEPS}: ${stepDef?.title}`}
      className="fixed inset-0 z-[60]"
    >
      {/* Spotlight backdrop */}
      <motion.div
        aria-hidden
        initial={backdrop ? { opacity: 0 } : undefined}
        animate={backdrop ? { opacity: 1 } : undefined}
        exit={backdrop ? { opacity: 0 } : undefined}
        transition={backdrop}
        className="absolute inset-0 bg-black/70"
      />

      {/* Spotlight cutout — a div with a huge box-shadow that punches a hole */}
      {hasSpotlight && (
        <motion.div
          aria-hidden
          initial={
            prefersReduced
              ? undefined
              : { opacity: 0, scale: 0.96 }
          }
          animate={
            prefersReduced
              ? undefined
              : { opacity: 1, scale: 1 }
          }
          transition={tooltipEnter}
          style={{
            position: "fixed",
            top: spotTop,
            left: spotLeft,
            width: spotW,
            height: spotH,
            borderRadius: 12,
            boxShadow: "0 0 0 9999px rgba(0,0,0,0.72)",
            border: "1.5px solid rgba(116,134,132,0.6)",
            pointerEvents: "none",
            zIndex: 65,
          }}
        />
      )}

      {/* Centered modal step (welcome / final) */}
      {isCenter && (
        <CenterModal
          key={`step-${tourStep}`}
          reduced={!!prefersReduced}
          stepIndex={tourStep}
          title={stepDef!.title}
          description={stepDef!.description}
          Icon={stepDef!.icon}
          isLast={isLast}
          isFirst={isFirst}
          onPrimary={onPrimaryClick}
          onBack={prevTourStep}
          onSkip={skipTour}
        />
      )}

      {/* Floating tooltip (non-center steps on desktop) */}
      {!isCenter && !isMobile && (
        <motion.div
          key={`tooltip-${tourStep}`}
          ref={tooltipRef}
          initial={
            prefersReduced ? undefined : { opacity: 0, y: 8, scale: 0.96 }
          }
          animate={
            prefersReduced ? undefined : { opacity: 1, y: 0, scale: 1 }
          }
          transition={tooltipEnter}
          style={tooltipStyle}
          className="rounded-2xl border border-white/15 bg-[#192d2f] text-white shadow-2xl overflow-hidden"
          role="document"
        >
          <TooltipBody
            stepIndex={tourStep}
            title={stepDef!.title}
            description={stepDef!.description}
            Icon={stepDef!.icon}
            isLast={isLast}
            isFirst={isFirst}
            onPrimary={onPrimaryClick}
            onBack={prevTourStep}
            onSkip={skipTour}
          />
        </motion.div>
      )}

      {/* Mobile bottom-sheet (non-center steps) */}
      {!isCenter && isMobile && (
        <AnimatePresence>
          <motion.div
            key={`sheet-${tourStep}`}
            initial={prefersReduced ? undefined : { y: "100%" }}
            animate={prefersReduced ? undefined : { y: 0 }}
            exit={prefersReduced ? undefined : { y: "100%" }}
            transition={tooltipEnter}
            className="fixed inset-x-0 bottom-0 z-[70] rounded-t-3xl border-t border-white/15 bg-[#192d2f] text-white shadow-2xl pb-[env(safe-area-inset-bottom)]"
          >
            <div className="mx-auto max-w-md p-4 sm:p-5">
              <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-white/25" />
              <TooltipBody
                stepIndex={tourStep}
                title={stepDef!.title}
                description={stepDef!.description}
                Icon={stepDef!.icon}
                isLast={isLast}
                isFirst={isFirst}
                onPrimary={onPrimaryClick}
                onBack={prevTourStep}
                onSkip={skipTour}
              />
            </div>
          </motion.div>
        </AnimatePresence>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Tooltip + modal bodies                                              */
/* ------------------------------------------------------------------ */

function TooltipBody({
  stepIndex,
  title,
  description,
  Icon,
  isLast,
  isFirst,
  onPrimary,
  onBack,
  onSkip,
}: {
  stepIndex: number;
  title: string;
  description: string;
  Icon: typeof Search;
  isLast: boolean;
  isFirst: boolean;
  onPrimary: () => void;
  onBack: () => void;
  onSkip: () => void;
}) {
  return (
    <div className="p-5">
      <div className="flex items-start gap-3">
        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#32504d]/30 ring-1 ring-[#32504d]/40">
          <Icon className="size-5 text-[#94a8a4]" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#748684]">
            Step {stepIndex + 1} of {TOTAL_STEPS}
          </div>
          <h3 className="mt-0.5 font-display text-base font-bold leading-tight text-white">
            {title}
          </h3>
        </div>
      </div>

      <p className="mt-3 text-sm text-white/75 leading-relaxed">
        {description}
      </p>

      {/* Progress dots */}
      <div className="mt-4 flex items-center gap-1.5">
        {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
          <span
            key={i}
            className={cn(
              "h-1.5 rounded-full transition-all duration-300",
              i === stepIndex
                ? "w-6 bg-[#748684]"
                : i < stepIndex
                ? "w-1.5 bg-[#32504d]"
                : "w-1.5 bg-white/20"
            )}
            aria-hidden
          />
        ))}
      </div>

      {/* Action row */}
      <div className="mt-5 flex items-center gap-2">
        <button
          onClick={onSkip}
          className="text-xs font-medium text-white/55 hover:text-white/80 transition-colors underline-offset-2 hover:underline"
        >
          Skip tour
        </button>
        <div className="ml-auto flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onBack}
            disabled={isFirst}
            className="text-white/75 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent"
          >
            <ChevronLeft className="size-4" />
            Back
          </Button>
          <Button
            size="sm"
            onClick={onPrimary}
            className="bg-[#32504d] hover:bg-[#475959] text-white gap-1.5 group"
          >
            {isLast ? (
              <>
                Get started
                <Rocket className="size-3.5 transition-transform group-hover:translate-x-0.5" />
              </>
            ) : (
              <>
                Next
                <ChevronRight className="size-4 transition-transform group-hover:translate-x-0.5" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}

function CenterModal({
  reduced,
  stepIndex,
  title,
  description,
  Icon,
  isLast,
  isFirst,
  onPrimary,
  onBack,
  onSkip,
}: {
  reduced: boolean;
  stepIndex: number;
  title: string;
  description: string;
  Icon: typeof Search;
  isLast: boolean;
  isFirst: boolean;
  onPrimary: () => void;
  onBack: () => void;
  onSkip: () => void;
}) {
  const enter = reduced
    ? { duration: 0 }
    : { duration: 0.32, ease: [0.22, 1, 0.36, 1] as const };
  return (
    <div className="absolute inset-0 z-[70] flex items-center justify-center p-4">
      <motion.div
        key={`modal-${stepIndex}`}
        initial={reduced ? undefined : { opacity: 0, scale: 0.92, y: 12 }}
        animate={reduced ? undefined : { opacity: 1, scale: 1, y: 0 }}
        exit={reduced ? undefined : { opacity: 0, scale: 0.96 }}
        transition={enter}
        className="relative w-full max-w-md rounded-3xl border border-white/15 bg-gradient-to-br from-[#192d2f] via-[#1f3434] to-[#0e1a1b] p-6 sm:p-8 text-white shadow-2xl overflow-hidden"
        role="dialog"
        aria-label={`Khidma tour step ${stepIndex + 1}: ${title}`}
      >
        {/* Decorative glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute -top-20 -right-20 size-64 rounded-full blur-3xl"
          style={{
            background:
              "radial-gradient(circle, rgba(116,134,132,0.35) 0%, transparent 70%)",
          }}
        />
        {/* Skip X button */}
        <button
          onClick={onSkip}
          aria-label="Skip tour"
          className="absolute right-3 top-3 flex size-8 items-center justify-center rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-colors"
        >
          <X className="size-4" />
        </button>

        <div className="relative">
          {/* Icon */}
          <div className="mx-auto flex size-16 items-center justify-center rounded-2xl bg-[#32504d]/30 ring-1 ring-[#32504d]/40">
            <Icon className="size-8 text-[#94a8a4]" />
          </div>

          <div className="mt-5 text-center">
            <div className="text-[10px] font-semibold uppercase tracking-[0.25em] text-[#748684]">
              Step {stepIndex + 1} of {TOTAL_STEPS}
            </div>
            <h3 className="mt-2 font-display text-2xl sm:text-3xl font-bold tracking-tight text-white leading-tight">
              {title}
            </h3>
            <p className="mt-3 text-sm sm:text-base text-white/75 leading-relaxed">
              {description}
            </p>
          </div>

          {/* Progress dots */}
          <div className="mt-6 flex items-center justify-center gap-1.5">
            {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
              <span
                key={i}
                className={cn(
                  "h-1.5 rounded-full transition-all duration-300",
                  i === stepIndex
                    ? "w-7 bg-[#748684]"
                    : i < stepIndex
                    ? "w-1.5 bg-[#32504d]"
                    : "w-1.5 bg-white/20"
                )}
                aria-hidden
              />
            ))}
          </div>

          {/* Action row */}
          <div className="mt-6 flex flex-col sm:flex-row items-center gap-3">
            <button
              onClick={onSkip}
              className="text-xs font-medium text-white/55 hover:text-white/80 transition-colors underline-offset-2 hover:underline order-3 sm:order-1"
            >
              Skip tour
            </button>
            <div className="flex items-center gap-2 sm:ml-auto order-1 sm:order-2 w-full sm:w-auto">
              <Button
                variant="ghost"
                onClick={onBack}
                disabled={isFirst}
                className="flex-1 sm:flex-initial text-white/75 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:hover:bg-transparent"
              >
                <ChevronLeft className="size-4" />
                Back
              </Button>
              <Button
                onClick={onPrimary}
                className="flex-1 sm:flex-initial bg-[#32504d] hover:bg-[#475959] text-white gap-1.5 group"
              >
                {isLast ? (
                  <>
                    Get started
                    <Rocket className="size-4 transition-transform group-hover:translate-x-0.5" />
                  </>
                ) : (
                  <>
                    Next
                    <ChevronRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default OnboardingTour;

/** Re-export for the "Take the tour" button used elsewhere (footer, etc). */
export function TakeTourButton({
  className,
  children,
}: {
  className?: string;
  children?: ReactNode;
}) {
  const startTour = useApp((s) => s.startTour);
  return (
    <Button
      variant="outline"
      size="sm"
      className={cn("gap-1.5", className)}
      onClick={() => startTour()}
    >
      {children ?? (
        <>
          <Sparkles className="size-3.5" />
          Take the tour
        </>
      )}
    </Button>
  );
}
