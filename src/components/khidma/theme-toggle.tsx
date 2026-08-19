"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";
import { Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useApp } from "@/lib/store";
import { cn } from "@/lib/utils";

/**
 * ThemeToggle — Khidma dark mode toggle button.
 *
 * Source of truth: `next-themes` (mounted in `src/app/layout.tsx`).
 * - `useTheme()` returns `{ theme, setTheme }` from next-themes.
 * - On click → `setTheme(theme === "dark" ? "light" : "dark")`.
 * - useEffect keeps the Khidma Zustand store's `theme` field in sync,
 *   so other components (e.g. command palette) can read the current theme
 *   from either source.
 *
 * The button uses Lucide `Sun` / `Moon` icons and animates the swap with
 * framer-motion (rotate + fade).
 *
 * SSR-safe: only renders the active icon after mount to avoid hydration
 * mismatch (next-themes returns undefined on the server).
 */
export function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme();
  const setStoreTheme = useApp((s) => s.setTheme);
  const [mounted, setMounted] = React.useState(false);

  // Mount flag — prevents SSR/CSR theme mismatch.
  React.useEffect(() => setMounted(true), []);

  // Sync next-themes → Zustand store (single source of truth = next-themes).
  React.useEffect(() => {
    if (theme === "light" || theme === "dark") {
      setStoreTheme(theme);
    }
  }, [theme, setStoreTheme]);

  const isDark = theme === "dark";

  const handleToggle = React.useCallback(() => {
    setTheme(isDark ? "light" : "dark");
  }, [isDark, setTheme]);

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleToggle}
      aria-label="Toggle dark mode"
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className={cn("relative size-9 overflow-hidden", className)}
    >
      {/* Mounted placeholder — keeps the button sized before client hydration */}
      {!mounted && <span className="size-[18px] rounded-full bg-muted-foreground/20" />}

      <AnimatePresence mode="wait" initial={false}>
        {mounted && (
          <motion.span
            key={isDark ? "moon" : "sun"}
            initial={{ opacity: 0, rotate: -90, scale: 0.5 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={{ opacity: 0, rotate: 90, scale: 0.5 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="absolute inset-0 flex items-center justify-center"
          >
            {isDark ? (
              <Moon className="size-[18px] text-foreground" />
            ) : (
              <Sun className="size-[18px] text-foreground" />
            )}
          </motion.span>
        )}
      </AnimatePresence>
    </Button>
  );
}

export default ThemeToggle;
