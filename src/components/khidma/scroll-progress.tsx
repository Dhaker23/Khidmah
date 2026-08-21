"use client";

/**
 * ScrollProgress
 * --------------
 * A premium reading-progress indicator fixed at the very top of the viewport.
 *
 * - A thin (3px) horizontal bar at `fixed top-0 left-0 right-0 z-[60]`,
 *   sitting above the sticky Header (which is z-50).
 * - Width animates 0% → 100% based on scroll position
 *   (`scrollY / (scrollHeight - innerHeight) * 100`).
 * - Uses `useMotionValue` + `useSpring` so the width updates without ever
 *   triggering a React re-render on scroll.
 * - A scroll listener throttled via `requestAnimationFrame` writes the raw
 *   percentage into the MotionValue. The only React state is the boolean
 *   "visible" flag, which flips once when crossing the visibility threshold
 *   (scrollY > 100) , never on every scroll.
 * - Background: gradient `#32504d → #475959 → #748684` (Khidma teal palette).
 * - A subtle blurred glow sits at the leading (right) edge of the bar.
 * - Only visible when `scrollY > 100` (fades in via `AnimatePresence`).
 * - Respects `prefers-reduced-motion`: spring stiffness is maxed-out so the
 *   bar tracks instantly, and the leading-edge glow is hidden.
 */

import { useEffect, useState } from "react";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useTransform,
  useReducedMotion,
} from "framer-motion";

const VISIBILITY_THRESHOLD = 100; // px , bar fades in once user scrolls past this
const BAR_HEIGHT = 3; // px

export function ScrollProgress() {
  const prefersReduced = useReducedMotion();

  // Raw scroll-progress MotionValue (0..100). The scroll listener writes
  // directly to this , no React state involved per scroll event.
  const progress = useMotionValue(0);

  // Spring-smoothed value for the actual bar width. Under reduced-motion we
  // max-out stiffness so it tracks the raw value instantly (no smoothing).
  const spring = useSpring(
    progress,
    prefersReduced
      ? { stiffness: 1000, damping: 100, mass: 0.1, restDelta: 0.001 }
      : { stiffness: 400, damping: 40, mass: 0.3, restDelta: 0.001 }
  );

  // Derive the CSS width string from the (springy) MotionValue. Updates to
  // this output MotionValue mutate the DOM directly via `style.width` on the
  // motion.div below , no React re-render involved.
  const widthPct = useTransform(spring, (v) => `${Math.min(Math.max(v, 0), 100).toFixed(3)}%`);

  // Visibility flag , flips only when the threshold is crossed, so it causes
  // at most one React re-render per crossing (not per scroll event).
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let rafId: number | null = null;
    let lastVisible = false;

    const compute = () => {
      rafId = null;
      const scrollY =
        window.scrollY || document.documentElement.scrollTop || 0;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const pct =
        docHeight > 0
          ? Math.min(Math.max((scrollY / docHeight) * 100, 0), 100)
          : 0;
      progress.set(pct);

      const vis = scrollY > VISIBILITY_THRESHOLD;
      if (vis !== lastVisible) {
        lastVisible = vis;
        setVisible(vis);
      }
    };

    // rAF-throttled scroll handler , coalesces multiple scroll events per
    // frame into a single MotionValue write.
    const onScroll = () => {
      if (rafId !== null) return;
      rafId = requestAnimationFrame(compute);
    };

    // Run once on mount (in case the page was reloaded mid-scroll).
    compute();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, [progress]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="khidma-scroll-progress"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="fixed top-0 left-0 right-0 z-[60] pointer-events-none"
          style={{ height: BAR_HEIGHT }}
          aria-hidden
        >
          <motion.div
            className="relative h-full"
            style={{
              width: widthPct,
              background:
                "linear-gradient(90deg, #32504d 0%, #475959 50%, #748684 100%)",
              boxShadow: prefersReduced
                ? undefined
                : "0 0 8px rgba(116,134,132,0.45)",
            }}
          >
            {/* Subtle glow at the leading (right) edge of the bar.
                Hidden under prefers-reduced-motion. */}
            {!prefersReduced && (
              <span
                className="absolute top-1/2 right-0 -translate-y-1/2 translate-x-1/2 rounded-full pointer-events-none"
                style={{
                  width: 16,
                  height: 16,
                  background:
                    "radial-gradient(circle, rgba(116,134,132,0.85) 0%, rgba(116,134,132,0) 70%)",
                  filter: "blur(2px)",
                }}
              />
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default ScrollProgress;
