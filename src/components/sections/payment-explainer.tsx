"use client";

import { motion } from "framer-motion";
import { Check, X, Wallet, TrendingUp } from "lucide-react";
import { Card } from "@/components/ui/card";
import { formatTND } from "@/lib/khidma-data";

const example = {
  project: 1000,
  feeRate: 0.01,
  get fee() {
    return Math.round(this.project * this.feeRate);
  },
  get freelancer() {
    return this.project - this.fee;
  },
};

const included = [
  { label: "Account registration", value: "Free" },
  { label: "Profile & portfolio", value: "Free" },
  { label: "Job applications", value: "Free" },
  { label: "Service publishing", value: "Free" },
  { label: "Withdrawals (local)", value: "0.5% – 1%" },
  { label: "Marketplace fee", value: "1% only" },
];

const excluded = [
  "Monthly subscription",
  "Proposal credits",
  "Listing fees",
  "Hidden service charges",
  "Tier-based fees",
  "Pay-to-rank boosts",
];

export function PaymentExplainer() {
  const freelancerPct = (example.freelancer / example.project) * 100;
  const feePct = (example.fee / example.project) * 100;

  return (
    <section className="py-16 sm:py-24 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-10 sm:mb-14">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#748684]">
            Transparent Pricing
          </span>
          <h2 className="mt-2 font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground leading-tight">
            Transparent Pricing. No Subscriptions. No Credits. No Limits.
          </h2>
          <p className="mt-3 text-base text-muted-foreground">
            Khidma charges a flat 1% marketplace fee on completed contracts.
            No subscriptions, no proposal credits, no listing fees. Just clear,
            predictable pricing.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5 sm:gap-6">
          {/* Example calculation card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-3"
          >
            <Card className="h-full p-6 sm:p-8 border-[#32504d]/20 bg-gradient-to-br from-[#192d2f] to-[#2b3d3d] text-white overflow-hidden relative">
              <div
                className="absolute inset-0 opacity-10 pointer-events-none"
                style={{
                  backgroundImage:
                    "radial-gradient(circle at 80% 20%, #748684 0%, transparent 45%), radial-gradient(circle at 20% 80%, #32504d 0%, transparent 50%)",
                }}
              />
              <div className="relative">
                <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-white/70 mb-1">
                  <Wallet className="size-3.5" />
                  Example calculation
                </div>
                <h3 className="font-display text-2xl sm:text-3xl font-bold text-white">
                  Project budget of {formatTND(example.project)}
                </h3>

                {/* Horizontal bar */}
                <div className="mt-6">
                  <div className="flex h-12 w-full overflow-hidden rounded-lg">
                    <div
                      className="flex items-center justify-center bg-[#748684]"
                      style={{ width: `${freelancerPct}%` }}
                    >
                      <span className="text-[10px] font-semibold text-white sm:text-xs">
                        {freelancerPct}% Freelancer
                      </span>
                    </div>
                    <div
                      className="flex items-center justify-center bg-[#32504d] border-l border-white/20"
                      style={{ width: `${feePct}%` }}
                    >
                      <span className="text-[10px] font-semibold text-white sm:text-xs whitespace-nowrap">
                        {feePct}%
                      </span>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-between text-xs text-white/70">
                    <span className="flex items-center gap-1.5">
                      <span className="size-2 rounded-sm bg-[#748684]" />
                      Freelancer receives
                    </span>
                    <span className="flex items-center gap-1.5">
                      1% fee
                      <span className="size-2 rounded-sm bg-[#32504d]" />
                    </span>
                  </div>
                </div>

                {/* Breakdown */}
                <div className="mt-7 grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="rounded-lg border border-white/10 bg-white/5 p-3">
                    <div className="text-[10px] uppercase tracking-wider text-white/60">
                      Project
                    </div>
                    <div className="font-display text-lg font-bold text-white">
                      {formatTND(example.project)}
                    </div>
                  </div>
                  <div className="rounded-lg border border-white/10 bg-white/5 p-3">
                    <div className="text-[10px] uppercase tracking-wider text-white/60">
                      Platform fee (1%)
                    </div>
                    <div className="font-display text-lg font-bold text-[#94a8a4]">
                      − {formatTND(example.fee)}
                    </div>
                  </div>
                  <div className="rounded-lg border border-[#94a8a4]/30 bg-[#94a8a4]/10 p-3">
                    <div className="text-[10px] uppercase tracking-wider text-white/70">
                      Freelancer receives
                    </div>
                    <div className="font-display text-lg font-bold text-white">
                      {formatTND(example.freelancer)}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Included vs Excluded */}
          <div className="lg:col-span-2 grid grid-cols-1 gap-5 sm:gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card className="h-full p-6 border-border/60">
                <div className="flex items-center gap-2 mb-4">
                  <span className="flex size-8 items-center justify-center rounded-lg bg-[#32504d]/10 text-[#32504d]">
                    <TrendingUp className="size-4" />
                  </span>
                  <h3 className="font-display text-base font-semibold text-foreground">
                    What&apos;s included
                  </h3>
                </div>
                <ul className="space-y-2.5">
                  {included.map((item) => (
                    <li
                      key={item.label}
                      className="flex items-center justify-between text-sm"
                    >
                      <span className="flex items-center gap-2 text-muted-foreground">
                        <Check className="size-4 text-[#32504d] shrink-0" />
                        {item.label}
                      </span>
                      <span className="font-semibold text-foreground">
                        {item.value}
                      </span>
                    </li>
                  ))}
                </ul>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.18 }}
            >
              <Card className="h-full p-6 border-border/60">
                <div className="flex items-center gap-2 mb-4">
                  <span className="flex size-8 items-center justify-center rounded-lg bg-[#748684]/10 text-[#748684]">
                    <X className="size-4" />
                  </span>
                  <h3 className="font-display text-base font-semibold text-foreground">
                    What we never charge
                  </h3>
                </div>
                <ul className="space-y-2.5">
                  {excluded.map((label) => (
                    <li
                      key={label}
                      className="flex items-center gap-2 text-sm text-muted-foreground line-through decoration-[#748684]/40"
                    >
                      <X className="size-4 text-[#748684]/70 shrink-0" />
                      {label}
                    </li>
                  ))}
                </ul>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default PaymentExplainer;
