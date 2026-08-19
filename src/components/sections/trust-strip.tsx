"use client";

import {
  ShieldCheck,
  Briefcase,
  Users,
  Star,
  Globe2,
  Wallet,
} from "lucide-react";
import { TrustBadge } from "@/components/khidma/verification";
import { Reveal, BrandDivider } from "@/components/khidma/reveal";
import { trustStats, formatNumber, formatTND } from "@/lib/khidma-data";

const items = [
  {
    icon: ShieldCheck,
    label: "Verified Freelancers",
    value: `${formatNumber(trustStats.verifiedFreelancers)}+`,
  },
  {
    icon: Briefcase,
    label: "Projects Completed",
    value: `${formatNumber(trustStats.completedProjects)}+`,
  },
  {
    icon: Wallet,
    label: "Total Paid Out",
    value: formatTND(trustStats.totalPaidOut),
  },
  {
    icon: Star,
    label: "Average Rating",
    value: `${trustStats.avgRating.toFixed(1)} / 5.0`,
  },
  {
    icon: Globe2,
    label: "Countries Served",
    value: `${trustStats.countries}`,
  },
  {
    icon: Users,
    label: "Cities Covered",
    value: `${trustStats.cities}`,
  },
];

export function TrustStrip() {
  return (
    <section className="relative border-y border-border/60 bg-muted/40">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <Reveal>
          <p className="mb-5 text-center text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Trusted by Tunisian talent &amp; international clients
          </p>
        </Reveal>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {items.map((item, i) => (
            <Reveal key={item.label} delay={0.05 * i}>
              <TrustBadge
                icon={item.icon}
                label={item.label}
                value={item.value}
                className="h-full"
              />
            </Reveal>
          ))}
        </div>
        <BrandDivider label="Why Khidma" className="mt-8 sm:mt-10" />
      </div>
    </section>
  );
}

export default TrustStrip;
