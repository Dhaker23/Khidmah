"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Cookie, Settings, X } from "lucide-react";
import { useApp } from "@/lib/store";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "khidma:cookie-consent";
type ConsentValue = "all" | "essential";

/**
 * Bottom cookie consent banner — appears on first visit.
 * Self-mounts globally; hides once the user accepts or rejects.
 */
export function CookieConsent() {
  const { openPrivacy } = useApp();
  const prefersReduced = useReducedMotion();
  const [visible, setVisible] = useState(false);

  // Read consent on mount — wait a beat so it doesn't pop during SSR hydration.
  useEffect(() => {
    let stored: string | null = null;
    try {
      stored = window.localStorage.getItem(STORAGE_KEY);
    } catch {
      /* ignore */
    }
    if (!stored) {
      const t = setTimeout(() => setVisible(true), prefersReduced ? 0 : 600);
      return () => clearTimeout(t);
    }
  }, [prefersReduced]);

  const persist = (value: ConsentValue) => {
    try {
      window.localStorage.setItem(STORAGE_KEY, value);
    } catch {
      /* ignore */
    }
  };

  const handleAccept = () => {
    persist("all");
    setVisible(false);
    toast.success("Cookies accepted", {
      description: "You can change your preferences anytime from Privacy settings.",
    });
  };

  const handleReject = () => {
    persist("essential");
    setVisible(false);
    toast.info("Only essential cookies enabled", {
      description: "Analytics, marketing and social cookies were disabled.",
    });
  };

  const handleOpenSettings = () => {
    setVisible(false);
    openPrivacy();
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          role="dialog"
          aria-live="polite"
          aria-label="Cookie consent"
          initial={prefersReduced ? { opacity: 0 } : { opacity: 0, y: 40 }}
          animate={prefersReduced ? { opacity: 1 } : { opacity: 1, y: 0 }}
          exit={prefersReduced ? { opacity: 0 } : { opacity: 0, y: 40 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className={cn(
            "fixed bottom-0 left-0 right-0 z-50 px-3 pb-3 sm:px-4 sm:pb-4 pointer-events-none"
          )}
        >
          <div
            className={cn(
              "pointer-events-auto mx-auto max-w-4xl rounded-2xl border border-white/10 bg-[#192d2f]/95 backdrop-blur-md text-white shadow-2xl"
            )}
          >
            <div className="flex flex-col md:flex-row md:items-center gap-3 p-3.5 sm:p-4">
              {/* Icon + text */}
              <div className="flex items-start gap-3 flex-1 min-w-0">
                <div className="size-9 rounded-xl bg-white/10 grid place-items-center shrink-0">
                  <Cookie className="size-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold inline-flex items-center gap-2">
                    We use cookies
                    <button
                      type="button"
                      onClick={handleReject}
                      aria-label="Dismiss cookie banner"
                      className="md:hidden text-white/60 hover:text-white transition-colors"
                    >
                      <X className="size-3.5" />
                    </button>
                  </p>
                  <p className="text-xs text-white/70 mt-0.5 leading-snug max-w-2xl">
                    We use cookies to operate the marketplace, analyze traffic and personalize your
                    experience. You can accept all cookies or reject non-essential ones.
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2 shrink-0">
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  className="text-xs text-white/80 hover:bg-white/10 hover:text-white h-8"
                  onClick={handleOpenSettings}
                >
                  <Settings className="size-3.5" />
                  Privacy settings
                </Button>
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  className="text-xs text-white/80 hover:bg-white/10 hover:text-white h-8 border border-white/15"
                  onClick={handleReject}
                >
                  Reject non-essential
                </Button>
                <Button
                  type="button"
                  size="sm"
                  className="text-xs h-8 bg-[#748684] hover:bg-[#6e8580] text-[#192d2f] font-semibold"
                  onClick={handleAccept}
                >
                  Accept all
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default CookieConsent;
