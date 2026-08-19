"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { ArrowUp } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

const VISIBILITY_THRESHOLD = 400;
const SIZE = 48;
const STROKE = 3;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export function BackToTop() {
  const reduceMotion = useReducedMotion();
  const [scrollY, setScrollY] = useState(0);
  const [docHeight, setDocHeight] = useState(0);
  const [hasPulsed, setHasPulsed] = useState(false);

  useEffect(() => {
    const update = () => {
      setScrollY(window.scrollY || document.documentElement.scrollTop);
      setDocHeight(
        document.documentElement.scrollHeight - window.innerHeight
      );
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  const visible = scrollY > VISIBILITY_THRESHOLD;
  const ratio = docHeight > 0 ? Math.min(scrollY / docHeight, 1) : 0;
  const progress = Math.round(ratio * 100) / 100;
  const dashOffset = CIRCUMFERENCE * (1 - progress);

  useEffect(() => {
    if (visible && !hasPulsed) {
      const t = setTimeout(() => setHasPulsed(true), 50);
      return () => clearTimeout(t);
    }
    return;
  }, [visible, hasPulsed]);

  const handleClick = () => {
    window.scrollTo({
      top: 0,
      behavior: reduceMotion ? "auto" : "smooth",
    });
  };

  return (
    <TooltipProvider delayDuration={200}>
      <AnimatePresence>
        {visible && (
          <motion.div
            key="back-to-top"
            initial={{ opacity: 0, scale: 0.5, y: 20 }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
              boxShadow: reduceMotion
                ? "0 4px 14px rgba(50,80,77,0.25)"
                : hasPulsed
                ? "0 4px 14px rgba(50,80,77,0.35)"
                : [
                    "0 0 0 0 rgba(50,80,77,0.55)",
                    "0 0 0 14px rgba(50,80,77,0)",
                    "0 4px 14px rgba(50,80,77,0.35)",
                  ],
            }}
            exit={{ opacity: 0, scale: 0.5, y: 20 }}
            transition={{
              duration: 0.35,
              ease: "easeOut",
              boxShadow: reduceMotion
                ? { duration: 0 }
                : hasPulsed
                ? { duration: 0.2 }
                : { duration: 1.4, repeat: 0 },
            }}
            className="fixed bottom-6 right-6 z-40"
          >
            <Tooltip>
              <TooltipTrigger asChild>
                <motion.button
                  onClick={handleClick}
                  aria-label="Back to top"
                  whileHover={reduceMotion ? undefined : { scale: 1.08 }}
                  whileTap={reduceMotion ? undefined : { scale: 0.94 }}
                  className={cn(
                    "relative grid place-items-center rounded-full",
                    "bg-[#2b3d3d] hover:bg-[#192d2f] text-white",
                    "shadow-lg shadow-[#2b3d3d]/30 transition-colors"
                  )}
                  style={{ width: SIZE, height: SIZE }}
                >
                  <svg
                    width={SIZE}
                    height={SIZE}
                    className="absolute inset-0 -rotate-90 pointer-events-none"
                    aria-hidden="true"
                  >
                    <circle
                      cx={SIZE / 2}
                      cy={SIZE / 2}
                      r={RADIUS}
                      fill="none"
                      stroke="rgba(255,255,255,0.18)"
                      strokeWidth={STROKE}
                    />
                    <circle
                      cx={SIZE / 2}
                      cy={SIZE / 2}
                      r={RADIUS}
                      fill="none"
                      stroke="#748684"
                      strokeWidth={STROKE}
                      strokeLinecap="round"
                      strokeDasharray={CIRCUMFERENCE}
                      strokeDashoffset={dashOffset}
                      style={{
                        transition: reduceMotion
                          ? "none"
                          : "stroke-dashoffset 0.1s linear",
                      }}
                    />
                  </svg>
                  <ArrowUp className="size-5 relative z-10" strokeWidth={2.5} />
                </motion.button>
              </TooltipTrigger>
              <TooltipContent side="left" sideOffset={8}>
                Back to top
              </TooltipContent>
            </Tooltip>
          </motion.div>
        )}
      </AnimatePresence>
    </TooltipProvider>
  );
}
