"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * ScrollToSection , premium floating dot navigation.
 *
 * - Fixed vertical stack of dots on the right side (desktop only, `hidden lg:flex`).
 * - One dot per major landing section.
 * - Active dot is filled with Khidma teal; the fill slides between dots
 *   via framer-motion `layoutId`.
 * - Hover: muted dot expands 8px → 16px and a tooltip with the section
 *   name appears to the left of the dot.
 * - Click: smooth scroll to the section. Respects `prefers-reduced-motion`
 *   (instant jump, no smooth scroll, no layout spring).
 * - Active section is tracked via a single IntersectionObserver with a
 *   thin middle-of-viewport rootMargin.
 */

interface NavSection {
  id: string;
  label: string;
}

const SECTIONS: NavSection[] = [
  { id: "hero", label: "Home" },
  { id: "categories", label: "Categories" },
  { id: "featured-freelancers", label: "Featured Freelancers" },
  { id: "featured-services", label: "Services" },
  { id: "open-jobs", label: "Jobs" },
  { id: "stats", label: "Stats" },
  { id: "pricing", label: "Pricing" },
  { id: "testimonials", label: "Testimonials" },
  { id: "blog", label: "Blog" },
  { id: "faq", label: "FAQ" },
];

const ACTIVE_FILL_LAYOUT_ID = "khidma-scroll-dot-active-fill";

export function ScrollToSection() {
  const prefersReduced = useReducedMotion();
  const [activeId, setActiveId] = useState<string>("");
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Track active section using IntersectionObserver on each section element.
  useEffect(() => {
    if (typeof window === "undefined" || typeof IntersectionObserver === "undefined") {
      return;
    }

    // A thin slice in the middle of the viewport , whichever section's
    // center crosses this slice is considered "active".
    const options: IntersectionObserverInit = {
      root: null,
      rootMargin: "-45% 0px -45% 0px",
      threshold: [0, 0.1, 0.5, 1],
    };

    const visible = new Map<string, number>();

    const callback: IntersectionObserverCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          visible.set(entry.target.id, entry.intersectionRatio);
        } else {
          visible.delete(entry.target.id);
        }
      });
      // Pick the most-visible section.
      let best: string | null = null;
      let bestRatio = 0;
      visible.forEach((ratio, id) => {
        if (ratio > bestRatio) {
          bestRatio = ratio;
          best = id;
        }
      });
      if (best) setActiveId(best);
    };

    observerRef.current = new IntersectionObserver(callback, options);

    // Defer observing to the next frame so all sections are mounted.
    const raf = window.requestAnimationFrame(() => {
      SECTIONS.forEach((s) => {
        const el = document.getElementById(s.id);
        if (el && observerRef.current) {
          observerRef.current.observe(el);
        }
      });
    });

    return () => {
      window.cancelAnimationFrame(raf);
      observerRef.current?.disconnect();
      observerRef.current = null;
    };
  }, []);

  const handleClick = useCallback(
    (id: string) => {
      const el = document.getElementById(id);
      if (!el) return;
      el.scrollIntoView({
        behavior: prefersReduced ? "auto" : "smooth",
        block: "start",
      });
    },
    [prefersReduced]
  );

  return (
    <nav
      aria-label="On-page section navigation"
      className="hidden lg:flex fixed right-6 top-1/2 -translate-y-1/2 z-40 flex-col items-end gap-3"
    >
      {SECTIONS.map((section) => {
        const isActive = activeId === section.id;
        const isHovered = hoveredId === section.id;
        return (
          <button
            key={section.id}
            type="button"
            onClick={() => handleClick(section.id)}
            onMouseEnter={() => setHoveredId(section.id)}
            onMouseLeave={() => setHoveredId(null)}
            onFocus={() => setHoveredId(section.id)}
            onBlur={() => setHoveredId(null)}
            aria-label={`Scroll to ${section.label} section`}
            aria-current={isActive ? "location" : undefined}
            className="group relative flex items-center justify-end gap-2 py-1 focus-visible:outline-none"
          >
            {/* Tooltip , appears to the LEFT of the dot */}
            <AnimatePresence>
              {isHovered && (
                <motion.span
                  initial={prefersReduced ? { opacity: 1 } : { opacity: 0, x: 6 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={prefersReduced ? { opacity: 0 } : { opacity: 0, x: 6 }}
                  transition={{ duration: 0.18 }}
                  className="pointer-events-none rounded-md bg-[#192d2f] px-2.5 py-1 text-xs font-medium text-white shadow-md ring-1 ring-white/5"
                >
                  {section.label}
                </motion.span>
              )}
            </AnimatePresence>

            {/* Dot , 16px container holding an 8px muted dot OR a 16px teal active fill */}
            <span className="relative flex size-4 items-center justify-center">
              {/* Muted base dot , 8px normally, 16px on hover, 0 when active */}
              <motion.span
                aria-hidden
                className={cn(
                  "block rounded-full",
                  isActive
                    ? "bg-transparent"
                    : "bg-foreground/25 group-hover:bg-foreground/45 group-focus-visible:bg-foreground/45"
                )}
                animate={{
                  width: isActive ? 0 : isHovered ? 16 : 8,
                  height: isActive ? 0 : isHovered ? 16 : 8,
                }}
                transition={
                  prefersReduced
                    ? { duration: 0 }
                    : { type: "spring", stiffness: 380, damping: 28 }
                }
              />
              {/* Active fill , slides between dots via layoutId */}
              {isActive && (
                <motion.span
                  aria-hidden
                  layoutId={ACTIVE_FILL_LAYOUT_ID}
                  className="absolute inset-0 rounded-full bg-[#32504d] shadow-[0_0_8px_rgba(50,80,77,0.55)]"
                  transition={
                    prefersReduced
                      ? { duration: 0 }
                      : { type: "spring", stiffness: 380, damping: 28 }
                  }
                />
              )}
            </span>
          </button>
        );
      })}
    </nav>
  );
}

export default ScrollToSection;
