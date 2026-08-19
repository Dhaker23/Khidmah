"use client";

/**
 * NewsletterModal
 * ---------------
 * Premium newsletter signup modal — "Join the Khidma Insider".
 *
 * Self-renders based on `modal.newsletterOpen` from the global store.
 *
 * Layout:
 *   - Header: Khidma logo + title + custom close button (on gradient bg).
 *   - Benefits list (5 items, staggered framer-motion entrance, check icons).
 *   - Email input (with @ icon prefix) + Subscribe button (form).
 *   - Frequency preference (radio cards): Daily / Weekly (default,
 *     recommended) / Bi-weekly / Monthly.
 *   - Topics (toggle chips): Freelancing, Development, Design, Marketing,
 *     Payments, Tunisian Market.
 *   - Privacy note + social proof ("Join 8,420+ freelancers...").
 *
 * On submit:
 *   1. Validate email format.
 *   2. toast.success("Welcome to Khidma Insider! 🎉").
 *   3. pushNotification({ type:"system", title:"Newsletter subscribed",
 *      body:"You're now a Khidma Insider. Watch your inbox for weekly
 *      insights." }).
 *   4. closeNewsletter().
 *
 * Palette: Khidma teal only — #475959 #2b3d3d #748684 #192d2f #32504d #6e8580
 * Animations: framer-motion + stagger; respects prefers-reduced-motion.
 * Accessible: aria-labels, escape to close (built-in), focus management
 * (Radix Dialog handles focus trap), keyboard-navigable form controls.
 */

import { useMemo, useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Check, Lock, Sparkles, Mail, X, Loader2 } from "lucide-react";
import { useApp } from "@/lib/store";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const BENEFITS: string[] = [
  "Weekly market insights + earning trends",
  "Freelancer spotlight interviews",
  "Early access to new features",
  "Exclusive Pro discounts",
  "Community event invitations",
];

const FREQUENCIES: { value: "daily" | "weekly" | "biweekly" | "monthly"; label: string; recommended?: boolean }[] = [
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly", recommended: true },
  { value: "biweekly", label: "Bi-weekly" },
  { value: "monthly", label: "Monthly" },
];

const TOPICS: string[] = [
  "Freelancing",
  "Development",
  "Design",
  "Marketing",
  "Payments",
  "Tunisian Market",
];

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function NewsletterModal() {
  const prefersReduced = useReducedMotion();
  const open = useApp((s) => s.modal.newsletterOpen);
  const closeNewsletter = useApp((s) => s.closeNewsletter);
  const pushNotification = useApp((s) => s.pushNotification);

  const [email, setEmail] = useState("");
  const [frequency, setFrequency] = useState<"daily" | "weekly" | "biweekly" | "monthly">("weekly");
  const [topics, setTopics] = useState<Set<string>>(
    () => new Set<string>(["Freelancing", "Tunisian Market"])
  );
  const [submitting, setSubmitting] = useState(false);

  // Reset transient form state whenever the modal opens.
  // (We deliberately keep last-typed email when closed so re-open feels
  // continuous, but clear after a successful submit.)
  const toggleTopic = (topic: string) => {
    setTopics((prev) => {
      const next = new Set(prev);
      if (next.has(topic)) next.delete(topic);
      else next.add(topic);
      return next;
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed || !EMAIL_REGEX.test(trimmed)) {
      toast.error("Please enter a valid email address.");
      return;
    }
    if (topics.size === 0) {
      toast.error("Pick at least one topic you'd like to hear about.");
      return;
    }
    setSubmitting(true);
    // Simulate a brief network round-trip for the button feedback.
    window.setTimeout(() => {
      setSubmitting(false);
      toast.success("Welcome to Khidma Insider! 🎉", {
        description: `Insights will land in ${trimmed} — frequency: ${frequency}.`,
      });
      pushNotification({
        type: "system",
        title: "Newsletter subscribed",
        body: "You're now a Khidma Insider. Watch your inbox for weekly insights.",
        link: "dashboard",
      });
      // Reset + close
      setEmail("");
      setFrequency("weekly");
      setTopics(new Set(["Freelancing", "Tunisian Market"]));
      closeNewsletter();
    }, 650);
  };

  // Stable list of benefit items — useMemo not strictly needed but keeps
  // the reference stable across renders.
  const benefits = useMemo(() => BENEFITS, []);

  return (
    <Dialog open={open} onOpenChange={(o) => !o && closeNewsletter()}>
      <DialogContent
        className="max-w-md w-[calc(100%-2rem)] p-0 gap-0 overflow-hidden"
        aria-describedby={undefined}
        showCloseButton={false}
      >
        <DialogHeader className="relative px-5 pt-6 pb-5 bg-khidma-gradient text-white overflow-hidden">
          {/* Decorative blobs */}
          <div
            className="absolute -top-10 -right-10 size-32 rounded-full bg-white/5 blur-2xl pointer-events-none"
            aria-hidden
          />
          <div
            className="absolute -bottom-12 -left-8 size-28 rounded-full bg-[#748684]/10 blur-2xl pointer-events-none"
            aria-hidden
          />

          {/* Custom close button (sits inside header for visibility) */}
          <DialogClose
            aria-label="Close newsletter signup"
            className="absolute right-3 top-3 inline-flex size-8 items-center justify-center rounded-md text-white/70 hover:text-white hover:bg-white/10 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40"
          >
            <X className="size-4" />
          </DialogClose>

          <div className="flex items-center gap-2.5">
            <Image
              src="/khidma-logo-v2.png"
              alt="Khidma logo"
              width={36}
              height={36}
              className="rounded-md ring-1 ring-white/20"
            />
            <div>
              <DialogTitle className="font-display text-lg font-bold leading-tight">
                Join the Khidma Insider
              </DialogTitle>
              <DialogDescription className="text-white/75 text-xs mt-0.5">
                Weekly insights for ambitious Tunisian freelancers.
              </DialogDescription>
            </div>
          </div>

          {/* Social proof chip */}
          <div className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-white/10 border border-white/15 px-2.5 py-1 w-fit">
            <Sparkles className="size-3 text-amber-200" />
            <span className="text-[11px] font-medium text-white/90">
              Join 8,420+ freelancers already getting insights.
            </span>
          </div>
        </DialogHeader>

        {/* Scrollable body for small screens */}
        <div className="max-h-[70vh] overflow-y-auto p-5 space-y-5">
          {/* Benefits */}
          <ul className="space-y-2">
            {benefits.map((b, i) => (
              <motion.li
                key={b}
                initial={prefersReduced ? undefined : { opacity: 0, x: -8 }}
                animate={prefersReduced ? undefined : { opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05, duration: 0.3 }}
                className="flex items-center gap-2.5 text-sm"
              >
                <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-[#32504d]/15 text-[#32504d]">
                  <Check className="size-3.5" />
                </span>
                <span className="text-foreground/90">{b}</span>
              </motion.li>
            ))}
          </ul>

          {/* Email form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            <label htmlFor="newsletter-email" className="sr-only">
              Email address
            </label>
            <div className="relative">
              <Mail
                className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none"
                aria-hidden
              />
              <input
                id="newsletter-email"
                type="email"
                inputMode="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@email.com"
                disabled={submitting}
                aria-label="Email address"
                className="h-12 w-full rounded-md border border-input bg-background pl-10 pr-3 text-sm shadow-sm transition-[color,box-shadow] placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#32504d]/40 focus-visible:border-[#32504d] disabled:cursor-not-allowed disabled:opacity-60"
              />
            </div>

            <Button
              type="submit"
              disabled={submitting}
              className="h-12 w-full bg-[#32504d] text-white hover:bg-[#2b3d3d] font-semibold"
            >
              {submitting ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Subscribing…
                </>
              ) : (
                <>
                  Subscribe
                  <Sparkles className="size-4 ml-1" />
                </>
              )}
            </Button>
          </form>

          {/* Frequency preference */}
          <div>
            <fieldset>
              <legend className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                Frequency
              </legend>
              <RadioGroup
                value={frequency}
                onValueChange={(v) =>
                  setFrequency(v as "daily" | "weekly" | "biweekly" | "monthly")
                }
                className="grid grid-cols-2 gap-2 sm:grid-cols-4"
              >
                {FREQUENCIES.map((f) => {
                  const selected = frequency === f.value;
                  return (
                    <label
                      key={f.value}
                      className={cn(
                        "relative flex flex-col items-center justify-center cursor-pointer rounded-lg border px-2 py-2.5 text-center transition-colors",
                        selected
                          ? "border-[#32504d] bg-[#32504d]/8"
                          : "border-border hover:bg-accent/60"
                      )}
                    >
                      <RadioGroupItem
                        value={f.value}
                        className="sr-only"
                        aria-label={f.label}
                      />
                      <span
                        className={cn(
                          "text-xs font-semibold",
                          selected ? "text-[#32504d]" : "text-foreground"
                        )}
                      >
                        {f.label}
                      </span>
                      {f.recommended && (
                        <span className="mt-0.5 text-[9px] uppercase tracking-wider text-[#748684]">
                          Recommended
                        </span>
                      )}
                    </label>
                  );
                })}
              </RadioGroup>
            </fieldset>
          </div>

          {/* Topics */}
          <div>
            <fieldset>
              <legend className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                Topics you care about
              </legend>
              <div className="flex flex-wrap gap-2">
                {TOPICS.map((t) => {
                  const selected = topics.has(t);
                  return (
                    <button
                      key={t}
                      type="button"
                      onClick={() => toggleTopic(t)}
                      aria-pressed={selected}
                      className={cn(
                        "inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#32504d]/40",
                        selected
                          ? "border-[#32504d] bg-[#32504d] text-white"
                          : "border-border text-foreground hover:bg-accent/60"
                      )}
                    >
                      {selected && <Check className="size-3" />}
                      {t}
                    </button>
                  );
                })}
              </div>
            </fieldset>
          </div>

          {/* Privacy note */}
          <div className="flex items-start gap-2 rounded-lg bg-muted/40 border border-border/60 p-2.5">
            <Lock className="size-3.5 text-[#32504d] shrink-0 mt-0.5" />
            <p className="text-[11px] text-muted-foreground leading-relaxed">
              We respect your privacy. Unsubscribe anytime. No spam.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default NewsletterModal;
