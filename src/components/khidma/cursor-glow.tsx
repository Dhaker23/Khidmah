"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring, useReducedMotion } from "framer-motion";

/**
 * CursorGlow , a subtle cursor-following radial glow that appears
 * only when the pointer is over a `[data-cursor-glow]` element.
 *
 * - Uses `useMotionValue` + `useSpring` (stiffness 150, damping 20) for
 *   smooth, performant cursor tracking (no React re-renders on mousemove).
 * - Fixed, full-viewport overlay (size 400px), `pointer-events-none`,
 *   `mix-blend-mode: screen`, z-30.
 * - Fades in/out based on hover state of any `[data-cursor-glow]` ancestor.
 * - Respects `prefers-reduced-motion` (renders nothing).
 * - Respects `prefers-reduced-transparency` (renders nothing if supported
 *   and requested).
 */
export function CursorGlow() {
  const prefersReducedMotion = useReducedMotion();
  const [supportsTransparency, setSupportsTransparency] = useState(true);
  const [active, setActive] = useState(false);

  // Track pointer via motion values (no re-renders on mousemove).
  const x = useMotionValue(-1000);
  const y = useMotionValue(-1000);
  const springX = useSpring(x, { stiffness: 150, damping: 20, mass: 0.3 });
  const springY = useSpring(y, { stiffness: 150, damping: 20, mass: 0.3 });

  useEffect(() => {
    if (prefersReducedMotion) return;

    // Detect prefers-reduced-transparency (deferred via rAF to satisfy the
    // project's `react-hooks/set-state-in-effect` rule).
    const mql = window.matchMedia("(prefers-reduced-transparency: reduce)");
    const applyTransparency = () =>
      setSupportsTransparency(!mql.matches);
    requestAnimationFrame(applyTransparency);
    const onTransparencyChange = (e: MediaQueryListEvent) =>
      setSupportsTransparency(!e.matches);
    mql.addEventListener?.("change", onTransparencyChange);

    const onMove = (e: MouseEvent) => {
      const target = e.target as Element | null;
      const overGlow = !!target?.closest?.("[data-cursor-glow]");
      // Only update active state when it changes (avoids spurious renders).
      setActive((prev) => (prev === overGlow ? prev : overGlow));
      if (overGlow) {
        // Center the 400px glow on the cursor.
        x.set(e.clientX - 200);
        y.set(e.clientY - 200);
      }
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      mql.removeEventListener?.("change", onTransparencyChange);
    };
  }, [prefersReducedMotion, x, y]);

  // Reduced-motion / reduced-transparency users get nothing.
  if (prefersReducedMotion || !supportsTransparency) return null;

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-30 size-[400px] rounded-full mix-blend-screen"
      style={{
        x: springX,
        y: springY,
        background:
          "radial-gradient(circle, rgba(116,134,132,0.15) 0%, transparent 70%)",
      }}
      animate={{ opacity: active ? 1 : 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    />
  );
}

export default CursorGlow;
