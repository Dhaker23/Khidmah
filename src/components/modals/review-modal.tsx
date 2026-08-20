"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Star } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogPortal,
  DialogOverlay,
  DialogTitle,
  DialogDescription,
  DialogHeader,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  MessageSquare,
  Sparkles,
  Clock,
  Briefcase,
  Star as StarIcon,
  Loader2,
} from "lucide-react";
import { useApp } from "@/lib/store";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface MetricDef {
  key: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const METRICS: MetricDef[] = [
  { key: "communication", label: "Communication", icon: MessageSquare },
  { key: "quality", label: "Quality of Work", icon: Sparkles },
  { key: "delivery", label: "On-time Delivery", icon: Clock },
  { key: "professionalism", label: "Professionalism", icon: Briefcase },
];

const MIN_PUBLIC_CHARS = 50;
const MAX_PUBLIC_CHARS = 500;

const RATING_LABELS: Record<number, string> = {
  0: "Tap a star to rate",
  1: "Poor",
  2: "Fair",
  3: "Good",
  4: "Very Good",
  5: "Excellent",
};

function StarRow({
  value,
  hover,
  size,
  onHover,
  onSelect,
  reduced,
  label,
}: {
  value: number;
  hover: number;
  size: number;
  onHover: (n: number) => void;
  onSelect: (n: number) => void;
  reduced: boolean | null;
  label?: string;
}) {
  const active = hover || value;
  return (
    <div
      className="flex items-center gap-1"
      role="radiogroup"
      aria-label={label ?? "Rating"}
    >
      {[1, 2, 3, 4, 5].map((n) => {
        const filled = n <= active;
        return (
          <motion.button
            key={n}
            type="button"
            role="radio"
            aria-checked={value === n}
            aria-label={`${n} star${n > 1 ? "s" : ""}`}
            onMouseEnter={() => onHover(n)}
            onMouseLeave={() => onHover(0)}
            onFocus={() => onHover(n)}
            onBlur={() => onHover(0)}
            onClick={() => onSelect(n)}
            className="rounded-md p-0.5 outline-none focus-visible:ring-2 focus-visible:ring-[#32504d]/40 focus-visible:ring-offset-1"
            whileHover={reduced ? undefined : { scale: 1.12 }}
            whileTap={reduced ? undefined : { scale: 0.92 }}
            transition={{ type: "spring", stiffness: 400, damping: 18 }}
          >
            <motion.span
              initial={false}
              animate={{
                color: filled ? "#f59e0b" : "#cbd5e1",
                scale: filled && !reduced ? 1 : 0.95,
              }}
              transition={{ type: "spring", stiffness: 380, damping: 20 }}
              className="block"
              style={{ width: size, height: size }}
            >
              <Star
                className="size-full"
                fill={filled ? "currentColor" : "none"}
                strokeWidth={2}
              />
            </motion.span>
          </motion.button>
        );
      })}
    </div>
  );
}

export function ReviewModal() {
  const {
    modal: { reviewOpen, reviewPayload },
    closeReview,
    pushNotification,
    currentUser,
    openAuth,
  } = useApp();
  const prefersReduced = useReducedMotion();

  const [overall, setOverall] = useState(0);
  const [overallHover, setOverallHover] = useState(0);
  const [metrics, setMetrics] = useState<Record<string, number>>({});
  const [metricHover, setMetricHover] = useState<Record<string, number>>({});
  const [publicReview, setPublicReview] = useState("");
  const [privateFeedback, setPrivateFeedback] = useState("");
  const [recommend, setRecommend] = useState(false);
  const [anonymous, setAnonymous] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Reset form state whenever the modal is (re)opened for a given contract.
  // We intentionally reset on open rather than close so any failed submit
  // attempt preserves its inputs for review. The setState-in-effect pattern
  // is required here because the form's lifetime is tied to the dialog open
  // state, which is owned by the global store — there is no parent prop
  // we can `key` on without breaking the dialog's transition animations.
  useEffect(() => {
    if (!reviewOpen) return;
    /* eslint-disable react-hooks/set-state-in-effect */
    setOverall(0);
    setOverallHover(0);
    setMetrics({});
    setMetricHover({});
    setPublicReview("");
    setPrivateFeedback("");
    setRecommend(false);
    setAnonymous(false);
    setSubmitting(false);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [reviewOpen, reviewPayload?.contractId]);

  if (!reviewOpen) return null;

  const allMetricsRated = METRICS.every((m) => (metrics[m.key] ?? 0) >= 1);
  const publicReviewValid =
    publicReview.trim().length >= MIN_PUBLIC_CHARS &&
    publicReview.length <= MAX_PUBLIC_CHARS;
  const canSubmit =
    overall >= 1 && allMetricsRated && publicReviewValid && !submitting;

  const handleSubmit = () => {
    if (!canSubmit || !reviewPayload) {
      if (!currentUser) {
        toast.info("Please log in to submit a review.", {
          action: { label: "Log in", onClick: () => openAuth("login") },
        });
        return;
      }
      return;
    }
    setSubmitting(true);
    // Simulate a brief network round-trip for tactile feedback
    setTimeout(() => {
      pushNotification({
        type: "review",
        title: "Review submitted",
        body: `Your review for ${reviewPayload.revieweeName} has been published.`,
        link: "dashboard",
      });
      toast.success("Review submitted! ⭐", {
        description: `${overall}/5 · ${RATING_LABELS[overall]}`,
      });
      setSubmitting(false);
      closeReview();
    }, 600);
  };

  const revieweeName = reviewPayload?.revieweeName ?? "this freelancer";
  const revieweeAvatar = reviewPayload?.revieweeAvatar;
  const initials = revieweeName
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <Dialog open={reviewOpen} onOpenChange={(o) => !o && closeReview()}>
      <DialogPortal>
        <DialogOverlay className="bg-[#192d2f]/70 backdrop-blur-sm" />
        <DialogContent
          className="max-w-lg w-[calc(100%-2rem)] p-0 gap-0 overflow-hidden"
          aria-describedby={undefined}
          showCloseButton
        >
          <DialogHeader className="relative px-5 sm:px-6 pt-5 pb-4 border-b border-border/60 bg-khidma-gradient text-white overflow-hidden">
            <div className="absolute -top-12 -right-8 size-40 rounded-full bg-white/5 blur-2xl pointer-events-none" aria-hidden />
            <div className="relative flex items-start gap-3">
              {revieweeAvatar ? (
                <Avatar className="size-10 ring-2 ring-white/30 shrink-0">
                  <AvatarImage src={revieweeAvatar} alt={revieweeName} />
                  <AvatarFallback className="bg-white/15 text-white text-xs font-semibold">
                    {initials}
                  </AvatarFallback>
                </Avatar>
              ) : (
                <span className="size-10 rounded-full bg-white/15 flex items-center justify-center text-white">
                  <StarIcon className="size-4" />
                </span>
              )}
              <div className="min-w-0 flex-1">
                <DialogTitle className="text-base font-display font-bold leading-tight">
                  Rate your experience
                </DialogTitle>
                <DialogDescription className="text-xs text-white/75 mt-0.5">
                  How was your experience with{" "}
                  <span className="font-semibold text-white">{revieweeName}</span>?
                </DialogDescription>
                {reviewPayload?.contractTitle && (
                  <p className="mt-1 text-[10px] text-white/60 truncate">
                    Contract: {reviewPayload.contractTitle}
                  </p>
                )}
              </div>
            </div>
          </DialogHeader>

          <div className="max-h-[62vh] overflow-y-auto px-5 sm:px-6 py-4 space-y-5">
            {/* Overall rating — large, centered */}
            <div className="flex flex-col items-center text-center pt-1 pb-1">
              <StarRow
                value={overall}
                hover={overallHover}
                size={40}
                onHover={setOverallHover}
                onSelect={(n) => setOverall(n)}
                reduced={prefersReduced}
                label="Overall rating"
              />
              <div className="mt-2 flex items-center gap-2 h-5">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.span
                    key={overall || "placeholder"}
                    initial={prefersReduced ? false : { opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={prefersReduced ? { opacity: 0 } : { opacity: 0, y: -4 }}
                    transition={{ duration: 0.18 }}
                    className="text-xs font-medium text-foreground"
                  >
                    {overall > 0 ? (
                      <>
                        <span className="font-bold">{overall}/5</span>
                        <span className="text-muted-foreground mx-1">·</span>
                        <span className="text-[#32504d] dark:text-[#9bb3ae]">
                          {RATING_LABELS[overall]}
                        </span>
                      </>
                    ) : (
                      <span className="text-muted-foreground">
                        {RATING_LABELS[0]}
                      </span>
                    )}
                  </motion.span>
                </AnimatePresence>
              </div>
            </div>

            {/* Metric ratings — 4 rows */}
            <div className="space-y-2">
              <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                Rate specific aspects <span className="text-[#32504d] dark:text-[#9bb3ae]">*</span>
              </span>
              <ul className="space-y-1.5">
                {METRICS.map((m) => {
                  const Icon = m.icon;
                  const value = metrics[m.key] ?? 0;
                  const hover = metricHover[m.key] ?? 0;
                  const rated = value >= 1;
                  return (
                    <li
                      key={m.key}
                      className={cn(
                        "flex items-center justify-between gap-3 rounded-lg border px-3 py-2 transition-colors",
                        rated
                          ? "border-[#32504d]/30 dark:border-[#32504d]/30 bg-[#32504d]/5 dark:bg-[#32504d]/15"
                          : "border-border/60 hover:bg-muted/30"
                      )}
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <span
                          className={cn(
                            "flex size-7 items-center justify-center rounded-md shrink-0 transition-colors",
                            rated
                              ? "bg-[#32504d]/15 dark:bg-[#32504d]/25 text-[#32504d] dark:text-[#9bb3ae]"
                              : "bg-muted text-muted-foreground"
                          )}
                        >
                          <Icon className="size-3.5" />
                        </span>
                        <span className="text-xs font-medium text-foreground truncate">
                          {m.label}
                        </span>
                      </div>
                      <StarRow
                        value={value}
                        hover={hover}
                        size={18}
                        onHover={(n) =>
                          setMetricHover((prev) => ({ ...prev, [m.key]: n }))
                        }
                        onSelect={(n) =>
                          setMetrics((prev) => ({ ...prev, [m.key]: n }))
                        }
                        reduced={prefersReduced}
                        label={m.label}
                      />
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Public review */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label
                  htmlFor="public-review"
                  className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground"
                >
                  Public review <span className="text-[#32504d] dark:text-[#9bb3ae]">*</span>
                </Label>
                <span
                  className={cn(
                    "text-[10px] tabular-nums",
                    publicReview.length < MIN_PUBLIC_CHARS
                      ? "text-muted-foreground"
                      : publicReview.length > MAX_PUBLIC_CHARS * 0.9
                        ? "text-amber-600"
                        : "text-[#32504d] dark:text-[#9bb3ae]"
                  )}
                >
                  {publicReview.length}/{MAX_PUBLIC_CHARS}
                  {publicReview.length < MIN_PUBLIC_CHARS && publicReview.length > 0 && (
                    <span className="text-muted-foreground ml-1">
                      (min {MIN_PUBLIC_CHARS})
                    </span>
                  )}
                </span>
              </div>
              <Textarea
                id="public-review"
                value={publicReview}
                onChange={(e) => setPublicReview(e.target.value)}
                placeholder="Share details about your experience working with this freelancer — what went well, what they excelled at, and how they delivered…"
                rows={4}
                maxLength={MAX_PUBLIC_CHARS}
                className="resize-none text-xs focus-visible:ring-[#32504d]/30"
              />
            </div>

            {/* Private feedback */}
            <div className="space-y-1.5">
              <Label
                htmlFor="private-feedback"
                className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground"
              >
                Private feedback{" "}
                <span className="text-muted-foreground/60">(optional)</span>
              </Label>
              <Textarea
                id="private-feedback"
                value={privateFeedback}
                onChange={(e) => setPrivateFeedback(e.target.value)}
                placeholder={`Private notes for Khidma (not visible to ${revieweeName})`}
                rows={2}
                maxLength={400}
                className="resize-none text-xs focus-visible:ring-[#32504d]/30"
              />
              <p className="text-[10px] text-muted-foreground leading-snug">
                Used to improve Khidma's trust & safety signals.
              </p>
            </div>

            {/* Would recommend toggle */}
            <div className="flex items-center justify-between gap-3 rounded-lg border border-border/60 bg-muted/30 px-3 py-2.5">
              <div className="min-w-0">
                <p className="text-xs font-semibold text-foreground">
                  Would recommend
                </p>
                <p className="text-[11px] text-muted-foreground leading-snug">
                  Would you recommend {revieweeName} to others?
                </p>
              </div>
              <Switch
                checked={recommend}
                onCheckedChange={setRecommend}
                aria-label={`Recommend ${revieweeName} to others`}
                className="data-[state=checked]:bg-[#32504d]"
              />
            </div>

            {/* Anonymous checkbox */}
            <Label
              htmlFor="anonymous"
              className="flex items-start gap-2.5 rounded-lg border border-border/60 px-3 py-2.5 cursor-pointer hover:bg-muted/40 transition-colors"
            >
              <Checkbox
                id="anonymous"
                checked={anonymous}
                onCheckedChange={(c) => setAnonymous(c === true)}
                className="mt-0.5 data-[state=checked]:bg-[#32504d] data-[state=checked]:border-[#32504d] data-[state=checked]:text-white"
              />
              <span className="text-[11px] text-muted-foreground leading-snug">
                Post this review anonymously — your name will not be shown on
                the public review.
              </span>
            </Label>
          </div>

          <DialogFooter className="px-5 sm:px-6 py-3 border-t border-border/60 bg-muted/20 flex-row items-center gap-2">
            <div className="mr-auto hidden sm:flex items-center gap-2">
              <Badge
                variant="outline"
                className={cn(
                  "text-[10px] gap-1",
                  canSubmit
                    ? "border-[#32504d]/30 dark:border-[#32504d]/30 text-[#32504d] dark:text-[#9bb3ae] bg-[#32504d]/5 dark:bg-[#32504d]/15"
                    : "text-muted-foreground"
                )}
              >
                {canSubmit ? (
                  <>
                    <Sparkles className="size-2.5" /> Ready to submit
                  </>
                ) : (
                  <>
                    {!currentUser ? "Log in required" : "Fill required fields"}
                  </>
                )}
              </Badge>
            </div>
            <DialogClose asChild>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={closeReview}
                disabled={submitting}
                className="text-xs"
              >
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="button"
              size="sm"
              onClick={handleSubmit}
              disabled={!canSubmit}
              className="text-xs bg-[#2b3d3d] hover:bg-[#192d2f] text-white"
            >
              {submitting ? (
                <>
                  <Loader2 className="size-3.5 animate-spin" /> Submitting…
                </>
              ) : (
                <>
                  <StarIcon className="size-3.5" /> Submit Review
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}

export default ReviewModal;
