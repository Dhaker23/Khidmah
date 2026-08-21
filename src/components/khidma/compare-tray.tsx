"use client";

import { useMemo } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { GitCompare, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useApp } from "@/lib/store";
import { getFreelancerById, type Freelancer } from "@/lib/khidma-data";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const MAX = 3;

export function CompareTray() {
  const reduceMotion = useReducedMotion();
  const compareIds = useApp((s) => s.compareIds);
  const removeFromCompare = useApp((s) => s.removeFromCompare);
  const clearCompare = useApp((s) => s.clearCompare);
  const openCompare = useApp((s) => s.openCompare);

  const freelancers = useMemo(
    () =>
      compareIds
        .map((id) => getFreelancerById(id))
        .filter((f): f is Freelancer => Boolean(f)),
    [compareIds]
  );

  const count = compareIds.length;
  const visible = count > 0;
  const atMax = count >= MAX;

  const handleRemove = (id: string, name: string) => {
    removeFromCompare(id);
    toast.success("Removed from compare", { description: name });
  };

  const handleClear = () => {
    clearCompare();
    toast.success("Compare queue cleared");
  };

  const handleCompareNow = () => {
    if (count < 2) {
      toast.error("Add at least 2 freelancers to compare", {
        description: `Currently ${count} of ${MAX} selected`,
      });
      return;
    }
    openCompare();
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="compare-tray"
          initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 24, scale: 0.96 }}
          animate={reduceMotion ? { opacity: 1 } : { opacity: 1, y: 0, scale: 1 }}
          exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 24, scale: 0.96 }}
          transition={{ duration: 0.28, ease: "easeOut" }}
          className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-[calc(100vw-2rem)] max-w-3xl"
          aria-live="polite"
        >
          <div
            className={cn(
              "flex items-center gap-2 sm:gap-3 rounded-2xl border border-border/70 bg-background/95 backdrop-blur-xl shadow-2xl shadow-black/15",
              "px-3 py-2 sm:px-4 sm:py-2.5"
            )}
          >
            {/* Left: label + count */}
            <div className="hidden sm:flex flex-col shrink-0 min-w-[88px]">
              <div className="flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
                <GitCompare className="size-3.5 text-[#32504d] dark:text-[#9bb3ae]" />
                Comparing
              </div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-sm font-semibold text-foreground tabular-nums">
                  {count}/{MAX}
                </span>
                {atMax && (
                  <span className="inline-flex items-center gap-0.5 text-[10px] font-medium text-amber-600 dark:text-amber-500">
                    Max reached
                  </span>
                )}
              </div>
            </div>

            {/* Mobile count badge */}
            <div className="sm:hidden flex flex-col items-center justify-center shrink-0 min-w-[44px]">
              <GitCompare className="size-4 text-[#32504d] dark:text-[#9bb3ae]" />
              <span className="text-[10px] font-semibold tabular-nums mt-0.5">
                {count}/{MAX}
              </span>
            </div>

            {/* Middle: avatar stack + names (names hidden on mobile) */}
            <div className="flex-1 min-w-0 flex items-center justify-center gap-3">
              <div className="flex items-center">
                {freelancers.map((f, i) => (
                  <div
                    key={f.id}
                    className="group/avatar relative -ml-2 first:ml-0"
                    style={{ zIndex: freelancers.length - i }}
                  >
                    <Avatar
                      className={cn(
                        "size-8 ring-2 ring-background border border-border/60 transition-transform",
                        "group-hover/avatar:scale-110"
                      )}
                    >
                      <AvatarImage src={f.avatar} alt={f.name} />
                      <AvatarFallback className="text-[10px] bg-[#32504d]/10 text-[#32504d] dark:bg-[#32504d]/25 dark:text-[#9bb3ae]">
                        {f.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    {/* Remove on hover */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemove(f.id, f.name);
                      }}
                      aria-label={`Remove ${f.name} from compare`}
                      className="absolute -top-1 -right-1 size-4 rounded-full bg-rose-500 text-white grid place-items-center opacity-0 group-hover/avatar:opacity-100 transition-opacity shadow-sm"
                    >
                      <X className="size-2.5" strokeWidth={3} />
                    </button>
                  </div>
                ))}
              </div>

              {/* Names , hidden on mobile to save space */}
              <div className="hidden md:flex flex-col min-w-0 max-w-[260px]">
                <div className="text-xs font-medium text-foreground truncate">
                  {freelancers.map((f) => f.name).join(" · ")}
                </div>
                <div className="text-[10px] text-muted-foreground truncate">
                  {freelancers.length === 1
                    ? "Add another to compare"
                    : `${freelancers.length} freelancers selected`}
                </div>
              </div>
            </div>

            {/* Right: actions */}
            <div className="flex items-center gap-1.5 shrink-0">
              <Button
                size="sm"
                onClick={handleCompareNow}
                disabled={count < 2}
                className={cn(
                  "h-8 gap-1.5 text-xs bg-[#32504d] hover:bg-[#2b3d3d] text-white",
                  "dark:bg-[#32504d] dark:hover:bg-[#475959]",
                  "disabled:opacity-50 disabled:cursor-not-allowed"
                )}
              >
                <GitCompare className="size-3.5" />
                <span className="hidden sm:inline">Compare now</span>
                <span className="sm:hidden">Compare</span>
              </Button>
              <Button
                size="icon"
                variant="ghost"
                onClick={handleClear}
                aria-label="Clear compare queue"
                className="size-8 text-muted-foreground hover:text-foreground"
              >
                <X className="size-4" />
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
