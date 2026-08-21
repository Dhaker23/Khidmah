"use client";

/**
 * LiveNotifications
 * ----------------
 * Periodically fires sonner toast notifications about real-time Khidma
 * platform activity , "Amira just completed a project worth TND 4,200",
 * "Yassine received a new 5-star review", and so on. Creates a "live,
 * bustling marketplace" feel for first-time visitors.
 *
 * Behaviour:
 * - Mounts its OWN `<Toaster />` (sonner v2) with `id="khidma-live"`
 *   routed via `toasterId`, so live toasts appear ONLY at `bottom-left`
 *   (the existing global Toaster at top-right is untouched).
 * - Auto-fires a random toast every 12-18 seconds (randomized interval).
 * - Each toast: custom pulsing green dot icon, 5-second duration, glass
 *   card with teal accent.
 * - Fires ONLY when:
 *     • view === "home" (not dashboard/admin/jobs/etc. , "working" contexts)
 *     • No modal is open (don't fire during auth/onboarding/profile/etc.)
 *     • !prefers-reduced-motion
 *     • document.visibilityState === "visible"
 *     • auto-fire is enabled (toggle pill)
 *     • User is NOT currently hovering any toast (respects reading)
 * - Floating "Live activity" pill in the bottom-left corner with a pulsing
 *   green dot , click fires one immediately + toggles auto-fire on/off.
 * - Reduced-motion users see the pill but no auto-toasts.
 */

import { useEffect, useRef, useState, useCallback } from "react";
import { toast, Toaster } from "sonner";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Activity, Pause, Play, Radio } from "lucide-react";
import { useApp } from "@/lib/store";
import { cn } from "@/lib/utils";

/** Mock live platform activity messages (Tunisian-context freelancers). */
const LIVE_NOTIFICATIONS: string[] = [
  "Amira just completed a project worth TND 4,200",
  "Yassine received a new 5-star review",
  "New job posted: 'Build a Next.js dashboard'",
  "TND 990 withdrawn via BIAT Bank",
  "Omar's portfolio was just verified",
  "Syrine's service was ordered 3 times today",
  "Rania received a 5.0 rating from a client",
  "Mehdi reached 100 completed projects",
  "12 new freelancers joined Khidma today",
  "Amira won 'Freelancer of the Week'",
  "New milestone funded: TND 1,500",
  "Yassine just responded to a client in 8 minutes",
  "Omar's 3D render was viewed 47 times",
  "TND 12,450 paid out to freelancers today",
  "5 new Top Rated freelancers this week",
  "New escrow contract funded: TND 2,800",
  "3 urgent jobs posted in the last hour",
  "Karim's hourly rate just went up to TND 95",
];

const TOASTER_ID = "khidma-live";
const FIRE_MIN_MS = 12_000;
const FIRE_MAX_MS = 18_000;
const TOAST_DURATION_MS = 5_000;
const HOVER_DEBOUNCE_MS = 1_500;

/** A small pulsing green dot icon used as the toast's leading accent. */
function LiveDotIcon() {
  return (
    <span className="relative flex size-3" aria-hidden>
      <motion.span
        className="absolute inline-flex size-full rounded-full bg-emerald-400/70"
        animate={{ scale: [1, 2.2, 1], opacity: [0.7, 0, 0.7] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: "easeOut" }}
      />
      <span className="relative inline-flex size-3 rounded-full bg-emerald-500" />
    </span>
  );
}

/** Pulsing "LIVE" pill , click to fire a toast immediately + toggle auto-fire. */
function LiveActivityPill({
  enabled,
  onToggle,
  onFire,
}: {
  enabled: boolean;
  onToggle: () => void;
  onFire: () => void;
}) {
  const prefersReduced = useReducedMotion();
  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1], delay: 0.4 }}
      className="fixed bottom-6 left-6 z-40"
    >
      <div className="flex items-center gap-2">
        {/* Primary "Live activity" pill , click fires a toast immediately */}
        <button
          type="button"
          onClick={onFire}
          aria-label="Show a live activity notification now"
          className={cn(
            "group relative inline-flex items-center gap-2 rounded-full border border-white/15 py-1.5 pl-2.5 pr-3.5",
            "bg-[#192d2f]/85 backdrop-blur-md shadow-lg shadow-[#192d2f]/40",
            "hover:border-emerald-400/50 hover:bg-[#192d2f]/95 transition-all",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/60"
          )}
        >
          {/* Pulsing green dot */}
          <span className="relative flex size-2.5" aria-hidden>
            {!prefersReduced && (
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400/80" />
            )}
            <span className="relative inline-flex size-2.5 rounded-full bg-emerald-400" />
          </span>
          <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/90">
            Live activity
          </span>
          <Activity className="size-3 text-emerald-300/80" aria-hidden />
        </button>

        {/* Auto-fire toggle button */}
        <button
          type="button"
          onClick={onToggle}
          aria-pressed={enabled}
          aria-label={
            enabled ? "Pause live activity notifications" : "Resume live activity notifications"
          }
          className={cn(
            "inline-flex size-8 items-center justify-center rounded-full border",
            "backdrop-blur-md transition-all shadow-lg",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/60",
            enabled
              ? "border-emerald-400/40 bg-emerald-400/15 text-emerald-300 hover:bg-emerald-400/25"
              : "border-white/15 bg-[#192d2f]/85 text-white/60 hover:text-white/90"
          )}
          title={enabled ? "Auto-fire on, click to pause" : "Auto-fire paused, click to resume"}
        >
          {enabled ? (
            <Pause className="size-3.5" aria-hidden />
          ) : (
            <Play className="size-3.5 ml-0.5" aria-hidden />
          )}
        </button>
      </div>
    </motion.div>
  );
}

/** Custom toast body , glass card with teal accent + message + LIVE badge. */
function LiveToastBody({ message }: { message: string }) {
  return (
    <div className="flex w-full items-start gap-3">
      <div className="mt-0.5 shrink-0">
        <LiveDotIcon />
      </div>
      <div className="min-w-0 flex-1">
        <div className="mb-1 flex items-center gap-1.5">
          <Radio className="size-3 text-emerald-400" aria-hidden />
          <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-emerald-400">
            Live on Khidma
          </span>
        </div>
        <p className="text-sm font-medium leading-snug text-white">{message}</p>
      </div>
    </div>
  );
}

export function LiveNotifications() {
  const prefersReduced = useReducedMotion();

  // View from the Zustand store , used for pill visibility (home/how-it-works only).
  // Modal state is read directly inside the firing callback via `useApp.getState()`
  // so we don't need to subscribe to it here.
  const view = useApp((s) => s.view);

  // Local UI state
  const [enabled, setEnabled] = useState(true);
  const hoveringRef = useRef(false);
  const hoverReleaseRef = useRef<number | null>(null);
  const lastFiredIndexRef = useRef(-1);

  /** Fire one random live-activity toast (avoids immediately repeating). */
  const fireOne = useCallback(() => {
    let next = lastFiredIndexRef.current;
    if (LIVE_NOTIFICATIONS.length > 1) {
      while (next === lastFiredIndexRef.current) {
        next = Math.floor(Math.random() * LIVE_NOTIFICATIONS.length);
      }
    } else {
      next = 0;
    }
    lastFiredIndexRef.current = next;
    const message = LIVE_NOTIFICATIONS[next];

    toast.custom(
      (t) => (
        <button
          type="button"
          onClick={() => toast.dismiss(t)}
          className="pointer-events-auto relative w-full overflow-hidden rounded-xl border border-emerald-400/20 bg-[#192d2f]/90 p-3.5 pr-9 text-left shadow-xl shadow-[#192d2f]/40 backdrop-blur-md"
          style={{
            background:
              "linear-gradient(135deg, rgba(25,45,47,0.95) 0%, rgba(43,61,61,0.92) 60%, rgba(50,80,77,0.9) 100%)",
          }}
        >
          {/* Teal accent strip on the left */}
          <span
            aria-hidden
            className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-emerald-400/70 via-emerald-400/40 to-emerald-400/70"
          />
          <LiveToastBody message={message} />
          {/* Close affordance */}
          <span
            aria-hidden
            className="absolute right-3 top-3 text-white/40 transition-colors hover:text-white/80"
          >
            ×
          </span>
        </button>
      ),
      {
        toasterId: TOASTER_ID,
        duration: TOAST_DURATION_MS,
        // no close button (we render our own ×), keep it unstyled by sonner
        className: "khidma-live-toast",
        // Position-per-toast override (also set on Toaster) ensures bottom-left
        position: "bottom-left",
      }
    );
  }, []);

  /** Track hover state over any sonner toast (so we don't fire while reading). */
  useEffect(() => {
    const isAnyToast = (el: EventTarget | null) =>
      el instanceof Element ? el.closest("[data-sonner-toast]") !== null : false;
    const onEnter = (e: Event) => {
      if (!isAnyToast(e.target)) return;
      if (hoverReleaseRef.current !== null) {
        window.clearTimeout(hoverReleaseRef.current);
        hoverReleaseRef.current = null;
      }
      hoveringRef.current = true;
    };
    const onLeave = (e: Event) => {
      if (!isAnyToast(e.target)) return;
      // Small debounce so flicker between adjacent toasts doesn't resume early
      if (hoverReleaseRef.current !== null) {
        window.clearTimeout(hoverReleaseRef.current);
      }
      hoverReleaseRef.current = window.setTimeout(() => {
        hoveringRef.current = false;
        hoverReleaseRef.current = null;
      }, HOVER_DEBOUNCE_MS);
    };
    document.addEventListener("mouseover", onEnter, true);
    document.addEventListener("mouseout", onLeave, true);
    return () => {
      document.removeEventListener("mouseover", onEnter, true);
      document.removeEventListener("mouseout", onLeave, true);
      if (hoverReleaseRef.current !== null) {
        window.clearTimeout(hoverReleaseRef.current);
      }
    };
  }, []);

  /** Auto-fire loop , only when ALL conditions met. */
  useEffect(() => {
    // Reduced-motion users get no auto-toasts at all (but pill + manual fire still work).
    if (prefersReduced) return;

    let cancelled = false;
    let timeoutId: number | null = null;

    const scheduleNext = () => {
      if (cancelled) return;
      const delay = FIRE_MIN_MS + Math.random() * (FIRE_MAX_MS - FIRE_MIN_MS);
      timeoutId = window.setTimeout(() => {
        if (cancelled) return;

        // Gate checks
        const currentView = useApp.getState().view;
        const m = useApp.getState().modal;
        const modalOpen =
          m.authOpen ||
          m.onboardingOpen ||
          m.selectedFreelancerId !== null ||
          m.selectedServiceId !== null ||
          m.selectedJobId !== null ||
          m.walletOpen ||
          m.messagingOpen ||
          m.postJobOpen ||
          m.createServiceOpen ||
          m.commandPaletteOpen ||
          m.compareOpen ||
          m.favoritesOpen ||
          m.shareOpen ||
          m.reportOpen ||
          m.helpOpen ||
          m.proOpen ||
          m.referralOpen ||
          m.privacyOpen ||
          m.teamsOpen ||
          m.apiDocsOpen ||
          m.partnersOpen ||
          m.newsletterOpen;
        const tourActive = useApp.getState().tourActive;

        const shouldFire =
          enabled &&
          currentView === "home" &&
          !modalOpen &&
          !tourActive &&
          !hoveringRef.current &&
          document.visibilityState === "visible";

        if (shouldFire) {
          fireOne();
        }
        scheduleNext();
      }, delay);
    };

    // Initial delay , don't fire immediately on mount (give the user a moment to land)
    const initialDelay = 4_000 + Math.random() * 2_000;
    timeoutId = window.setTimeout(scheduleNext, initialDelay);

    return () => {
      cancelled = true;
      if (timeoutId !== null) window.clearTimeout(timeoutId);
    };
  }, [enabled, prefersReduced, fireOne]);

  // Note: pill is always rendered (so reduced-motion users can manually fire).
  // Auto-fire gating is handled inside the effect above.
  // `modal` and `view` are subscribed above so the component re-renders when they
  // change , but the actual gate reads happen inside the timeout (via getState),
  // which avoids stale-closure issues.

  const handleToggle = () => setEnabled((v) => !v);
  const handleFire = () => {
    // Manual fire respects only visibility + (optionally) reduced-motion.
    // Reduced-motion users CAN manually trigger , but show a tiny "muted" toast
    // because sonner animations are still mild. We allow it.
    if (document.visibilityState === "visible") {
      fireOne();
    }
  };

  return (
    <>
      {/* Dedicated Toaster , routes ONLY toasts with toasterId="khidma-live" */}
      <Toaster
        id={TOASTER_ID}
        position="bottom-left"
        duration={TOAST_DURATION_MS}
        closeButton={false}
        richColors={false}
        expand={false}
        gap={8}
        visibleToasts={3}
        offset={{ bottom: "5.5rem", left: "1.5rem" }}
        mobileOffset={{ bottom: "5.5rem", left: "1rem" }}
        containerAriaLabel="Live Khidma activity notifications"
        toastOptions={{
          toasterId: TOASTER_ID,
          className: "khidma-live-toast",
          // Unstyled by sonner so our custom glass card shines
          unstyled: true,
          classNames: {
            toast: "!p-0 !bg-transparent !border-0 !shadow-none",
          },
        }}
      />

      <AnimatePresence>
        {(view === "home" || view === "how-it-works") && (
          <LiveActivityPill
            enabled={enabled && !prefersReduced}
            onToggle={handleToggle}
            onFire={handleFire}
          />
        )}
      </AnimatePresence>
    </>
  );
}

export default LiveNotifications;
