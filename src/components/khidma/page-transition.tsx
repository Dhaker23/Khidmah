"use client";

import { type ReactNode } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

/* ----------------------------------------------------------------------------
 * Optimized page transition wrapper.
 *
 * Performance optimizations:
 *  1. Uses mode="popLayout" instead of "wait" — the new view mounts immediately
 *     while the old one exits, eliminating the dead-time gap.
 *  2. Removed the curtain wipe overlay entirely — it added 340ms of blocking
 *     z-60 overlay on every view change, causing perceived lag.
 *  3. Reduced transition duration from 0.25s to 0.15s — snappier feel.
 *  4. Removed y-offset (no layout shift during transition).
 *  5. Uses CSS will-change: opacity for GPU acceleration.
 *
 * Accessibility:
 *  - When prefers-reduced-motion is set, transitions are instant (0ms).
 * -------------------------------------------------------------------------- */

interface PageTransitionProps {
  viewKey: string | number;
  children: ReactNode;
  className?: string;
}

export function PageTransition({ viewKey, children, className }: PageTransitionProps) {
  const prefersReduced = useReducedMotion();

  if (prefersReduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <AnimatePresence mode="popLayout">
      <motion.div
        key={viewKey}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.15, ease: "easeOut" }}
        className={className}
        style={{ willChange: "opacity" }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

export default PageTransition;
