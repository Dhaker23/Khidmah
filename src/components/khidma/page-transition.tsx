"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

/* ----------------------------------------------------------------------------
 * Khidma page transition wrapper.
 *
 * Two responsibilities:
 *  1. Wrap children with a smooth opacity + slight-y fade between views.
 *  2. Render a brief teal "curtain" wipe that sweeps left-to-right (300ms)
 *     whenever the active view changes , adding a tactile premium feel.
 *
 * Accessibility:
 *  - When `prefers-reduced-motion` is set, the curtain is skipped entirely
 *    and the fade is instant (opacity-only, 0ms).
 *
 * Usage:
 *   <PageTransition viewKey={view}>
 *     {contentFor(view)}
 *   </PageTransition>
 * -------------------------------------------------------------------------- */

interface PageTransitionProps {
  /** Unique key per view , changing this triggers the curtain + fade. */
  viewKey: string | number;
  children: ReactNode;
  /** Optional className applied to the wrapping motion.div. */
  className?: string;
}

export function PageTransition({ viewKey, children, className }: PageTransitionProps) {
  const prefersReduced = useReducedMotion();
  const firstRender = useRef(true);
  const [curtainVisible, setCurtainVisible] = useState(false);

  // Trigger a fresh curtain wipe whenever the view changes , but skip
  // the very first mount so the page doesn't wipe on initial load.
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    if (prefersReduced) return;
    // Defer to next frame so React can settle the view change before the
    // curtain overlay mounts (avoids a sync layout reflow on the same tick).
    const raf = requestAnimationFrame(() => setCurtainVisible(true));
    const t = setTimeout(() => setCurtainVisible(false), 340);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(t);
    };
  }, [viewKey, prefersReduced]);

  return (
    <>
      <AnimatePresence mode="wait">
        <motion.div
          key={viewKey}
          initial={prefersReduced ? { opacity: 0 } : { opacity: 0, y: 6 }}
          animate={prefersReduced ? { opacity: 1 } : { opacity: 1, y: 0 }}
          exit={prefersReduced ? { opacity: 0 } : { opacity: 0, y: -6 }}
          transition={{
            duration: prefersReduced ? 0 : 0.25,
            ease: "easeOut",
          }}
          className={className}
        >
          {children}
        </motion.div>
      </AnimatePresence>

      {/* Curtain overlay , sits above main content but below modals (z-50) */}
      <AnimatePresence>
        {curtainVisible && (
          <motion.div
            aria-hidden="true"
            className="fixed inset-0 z-[60] pointer-events-none bg-khidma-gradient"
            initial={{ x: "-100%" }}
            animate={{ x: ["-100%", "0%", "100%"] }}
            transition={{
              duration: 0.3,
              ease: [0.22, 1, 0.36, 1] as const,
              times: [0, 0.5, 1],
            }}
            exit={{ opacity: 0 }}
          />
        )}
      </AnimatePresence>
    </>
  );
}

export default PageTransition;
