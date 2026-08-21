"use client";

/**
 * Pricing
 * -------
 * Landing-page pricing section: 3 tiers (Starter / Pro / Business),
 * Monthly/Annual billing toggle, "All plans include" comparison summary,
 * and a 30-day money-back guarantee trust badge.
 *
 * - Uses `SectionHeading` + `Reveal` from `@/components/khidma/reveal`.
 * - framer-motion for staggered entrance + Pro-tier hover lift/glow.
 * - Starter CTA → `openAuth("register")`.
 * - Pro CTA → `openPro()`.
 * - Business CTA → toast "Our sales team will reach out".
 * - Respects `prefers-reduced-motion`.
 */

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  Check,
  ShieldCheck,
  Star,
} from "lucide-react";
import { Reveal, SectionHeading } from "@/components/khidma/reveal";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { useApp } from "@/lib/store";
import { toast } from "sonner";

type Cycle = "monthly" | "annual";
type TierKey = "starter" | "pro" | "business";

interface Tier {
  key: TierKey;
  name: string;
  tagline: string;
  priceMonthly: number | null; // null = Free
  features: string[];
  cta: { label: string; action: () => void };
  highlight?: boolean;
}

const INCLUSIONS = [
  "Email verification",
  "Phone support",
  "Secure escrow",
  "1% flat platform fee",
  "No hidden charges",
];

export function Pricing() {
  const prefersReduced = useReducedMotion();
  const { openAuth, openPro } = useApp();
  const [cycle, setCycle] = useState<Cycle>("monthly");

  // Annual = 20% off (12 * 0.8 = 9.6 months billed annually)
  const annualDiscount = 0.2;
  const fmtPrice = (monthly: number | null) => {
    if (monthly === null) return { value: "Free", suffix: "" };
    if (cycle === "annual") {
      const annual = Math.round(monthly * 12 * (1 - annualDiscount));
      const perMonthEq = Math.round(annual / 12);
      return { value: `TND ${perMonthEq}`, suffix: "/mo" };
    }
    return { value: `TND ${monthly}`, suffix: "/mo" };
  };

  const tiers: Tier[] = [
    {
      key: "starter",
      name: "Starter",
      tagline: "For new freelancers getting started.",
      priceMonthly: null,
      features: [
        "Apply to up to 10 jobs/month",
        "1 active service",
        "Standard verification",
        "Community support",
        "1% platform fee",
      ],
      cta: { label: "Get started free", action: () => openAuth("register") },
    },
    {
      key: "pro",
      name: "Pro",
      tagline: "For active freelancers ready to grow faster.",
      priceMonthly: 39,
      features: [
        "Unlimited job applications",
        "Up to 5 active services",
        "Priority verification (faster review)",
        "Featured profile badge",
        "Advanced analytics",
        "Priority support",
        "Custom offers",
        "Still 1% platform fee",
      ],
      cta: { label: "Upgrade to Pro", action: () => openPro() },
      highlight: true,
    },
    {
      key: "business",
      name: "Business",
      tagline: "For agencies & teams.",
      priceMonthly: 99,
      features: [
        "Everything in Pro",
        "Up to 20 active services",
        "Team seats (up to 5 members)",
        "White-label proposals",
        "API access",
        "Dedicated account manager",
        "Early access to features",
        "Still 1% platform fee",
      ],
      cta: {
        label: "Contact sales",
        action: () =>
          toast.success("Our sales team will reach out within 24 hours."),
      },
    },
  ];

  // staggered entrance
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: prefersReduced ? 0 : 0.1 },
    },
  };
  const cardVariants = {
    hidden: { opacity: 0, y: 24 },
    show: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] as const },
    },
  };

  return (
    <section id="pricing" className="py-16 sm:py-24 bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          align="center"
          eyebrow="Pricing"
          title={
            <>
              Simple, transparent <span className="text-[#32504d] dark:text-[#9bb3ae]">pricing</span>
            </>
          }
          description="Free to join. 1% fee per project. Optional Pro upgrades."
        />

        {/* Billing toggle */}
        <Reveal className="mb-10 sm:mb-12">
          <div className="flex items-center justify-center gap-3">
            <span
              className={cn(
                "text-sm font-medium transition-colors",
                cycle === "monthly" ? "text-foreground" : "text-muted-foreground"
              )}
            >
              Monthly
            </span>
            <Switch
              checked={cycle === "annual"}
              onCheckedChange={(v) => setCycle(v ? "annual" : "monthly")}
              aria-label="Toggle billing cycle"
            />
            <span
              className={cn(
                "text-sm font-medium transition-colors",
                cycle === "annual" ? "text-foreground" : "text-muted-foreground"
              )}
            >
              Annual
            </span>
            <Badge className="bg-emerald-500/15 text-emerald-700 border-emerald-200 text-[10px] uppercase tracking-wider">
              Save 20%
            </Badge>
          </div>
        </Reveal>

        {/* Tier cards */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-5 lg:gap-6 items-stretch"
        >
          {tiers.map((tier) => {
            const price = fmtPrice(tier.priceMonthly);
            const isPro = tier.highlight;
            return (
              <motion.div
                key={tier.key}
                variants={cardVariants}
                whileHover={
                  prefersReduced
                    ? undefined
                    : isPro
                      ? { y: -8, transition: { duration: 0.25 } }
                      : { y: -4, transition: { duration: 0.25 } }
                }
                className={cn(
                  "relative flex flex-col rounded-2xl border bg-card p-6 sm:p-7 transition-colors",
                  isPro
                    ? "border-[#32504d] dark:border-[#32504d]/60 shadow-xl shadow-[#32504d]/10 lg:-translate-y-3"
                    : "border-border/70 hover:border-[#32504d]/40 dark:hover:border-[#32504d]/40"
                )}
              >
                {isPro && (
                  <>
                    {/* glow */}
                    {!prefersReduced && (
                      <motion.div
                        aria-hidden
                        className="pointer-events-none absolute -inset-px rounded-2xl"
                        style={{
                          background:
                            "radial-gradient(60% 50% at 50% 0%, rgba(50,80,77,0.15), transparent 70%)",
                        }}
                        animate={{ opacity: [0.5, 0.9, 0.5] }}
                        transition={{
                          duration: 3.5,
                          repeat: Infinity,
                          ease: "easeInOut",
                        }}
                      />
                    )}
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                      <Badge className="bg-[#32504d] text-white border-0 px-3 py-1 gap-1 shadow-md dark:bg-[#32504d]/80">
                        <Star className="size-3 fill-amber-300 text-amber-300" />
                        Most Popular
                      </Badge>
                    </div>
                  </>
                )}

                <div className="relative">
                  <h3 className="font-display text-lg font-bold text-foreground">
                    {tier.name}
                  </h3>
                  <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                    {tier.tagline}
                  </p>

                  <div className="mt-5 flex items-baseline gap-1">
                    <span className="font-display text-3xl sm:text-4xl font-bold text-foreground">
                      {price.value}
                    </span>
                    {price.suffix && (
                      <span className="text-sm text-muted-foreground">
                        {price.suffix}
                      </span>
                    )}
                  </div>
                  {tier.priceMonthly !== null && cycle === "annual" && (
                    <p className="mt-1 text-[11px] text-muted-foreground">
                      Billed annually (TND{" "}
                      {Math.round(tier.priceMonthly * 12 * (1 - annualDiscount))}/yr)
                    </p>
                  )}
                  {tier.priceMonthly === null && (
                    <p className="mt-1 text-[11px] text-muted-foreground">
                      No credit card required
                    </p>
                  )}

                  <Button
                    onClick={tier.cta.action}
                    className={cn(
                      "mt-5 w-full",
                      isPro
                        ? "bg-[#32504d] text-white hover:bg-[#2b3d3d] dark:hover:bg-[#475959]"
                        : "bg-[#2b3d3d] text-white hover:bg-[#192d2f] dark:bg-[#475959] dark:hover:bg-[#32504d]"
                    )}
                  >
                    {tier.cta.label}
                  </Button>

                  <ul className="mt-6 space-y-3">
                    {tier.features.map((feat) => (
                      <li key={feat} className="flex items-start gap-2.5 text-sm">
                        <span
                          className={cn(
                            "mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full",
                            isPro
                              ? "bg-[#32504d] text-white"
                              : "bg-[#32504d]/10 text-[#32504d] dark:bg-[#32504d]/25 dark:text-[#9bb3ae]"
                          )}
                        >
                          <Check className="size-3" />
                        </span>
                        <span className="text-foreground/90">{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* All plans include + money-back guarantee */}
        <Reveal delay={0.1} className="mt-10 sm:mt-12">
          <div className="rounded-2xl border border-border/70 bg-card p-5 sm:p-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <h4 className="text-sm font-semibold text-foreground">
                  All plans include
                </h4>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {INCLUSIONS.map((inc, i) => (
                  <span key={inc}>
                    {inc}
                    {i < INCLUSIONS.length - 1 && (
                      <span className="mx-2 text-muted-foreground/40">·</span>
                    )}
                  </span>
                ))}
              </p>
            </div>
            <div className="flex items-center gap-2 rounded-xl bg-[#32504d]/5 dark:bg-[#32504d]/15 border border-[#32504d]/20 dark:border-[#32504d]/30 px-4 py-3 shrink-0">
              <ShieldCheck className="size-5 text-[#32504d] dark:text-[#9bb3ae] shrink-0" />
              <div>
                <div className="text-xs font-semibold text-foreground">
                  30-day money-back guarantee
                </div>
                <div className="text-[10px] text-muted-foreground">
                  No questions asked on all paid plans
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export default Pricing;
