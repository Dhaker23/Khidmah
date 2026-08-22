"use client";
import { useT } from "@/lib/use-t";

import {
  ShieldCheck,
  Percent,
  Lock,
  Wallet,
  Star,
  Repeat,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Reveal } from "@/components/khidma/reveal";

const features = [
  {
    icon: ShieldCheck,
    title: "Trust-first verification",
    description:
      "Email, phone, national ID, and portfolio reviews for every freelancer.",
  },
  {
    icon: Percent,
    title: "Transparent 1% fee",
    description:
      "A flat 1% marketplace fee. No tiers, no surcharges, no surprises.",
  },
  {
    icon: Lock,
    title: "Secure contracts & escrow",
    description:
      "Milestone-based escrow protects funds until work is approved.",
  },
  {
    icon: Wallet,
    title: "Local & international withdrawals",
    description:
      "BIAT, TIJARI, Tunisian Post, D17, Western Union, and bank transfers.",
  },
  {
    icon: Star,
    title: "Real reviews from real projects",
    description:
      "Reviews are tied to completed, paid contracts , never fakeable.",
  },
  {
    icon: Repeat,
    title: "Two-sided reputation",
    description:
      "Both clients and freelancers build public track records over time.",
  },
];

export function WhyKhidma() {
  const { t } = useT();
  return (
    <section className="py-16 sm:py-24 bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* Left: heading */}
          <Reveal className="lg:col-span-5">
            <div className="lg:sticky lg:top-24">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#748684]">
                {t("section.whyKhidma")}
              </span>
              <h2 className="mt-2 font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground leading-tight">
                Why clients and freelancers choose Khidma
              </h2>
              <p className="mt-4 text-base text-muted-foreground leading-relaxed">
                Most marketplaces optimise for volume. Khidma optimises for trust.
                We verify identity, protect payments, and let real work speak for
                itself , so both sides can focus on doing great work instead of
                chasing ghosts.
              </p>

              <div className="mt-6 flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#32504d]/10 dark:bg-[#32504d]/20 px-3 py-1 text-xs font-medium text-[#32504d] dark:text-[#9bb3ae]">
                  <ShieldCheck className="size-3.5" />
                  Identity Verified
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#475959]/10 dark:bg-[#475959]/20 px-3 py-1 text-xs font-medium text-[#475959] dark:text-[#94a8a4]">
                  <Lock className="size-3.5" />
                  Escrow Protected
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#6e8580]/10 px-3 py-1 text-xs font-medium text-[#6e8580]">
                  <Percent className="size-3.5" />
                  1% Flat Fee
                </span>
              </div>
            </div>
          </Reveal>

          {/* Right: feature cards */}
          <div className="lg:col-span-7">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
              {features.map((f, i) => {
                const Icon = f.icon;
                return (
                  <Reveal key={f.title} delay={0.05 * i}>
                    <Card className="group h-full p-5 border-border/60 hover:border-[#32504d]/40 khidma-card">
                      <div className="flex size-10 items-center justify-center rounded-lg bg-[#32504d]/10 dark:bg-[#32504d]/20 text-[#32504d] dark:text-[#9bb3ae] mb-3 transition-transform duration-200 ease-out group-hover:-translate-y-0.5">
                        <Icon className="size-5" />
                      </div>
                      <h3 className="font-display text-base font-semibold text-foreground">
                        {f.title}
                      </h3>
                      <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">
                        {f.description}
                      </p>
                    </Card>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default WhyKhidma;
