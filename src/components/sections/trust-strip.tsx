"use client";

import { motion } from "framer-motion";
import {
  ShieldCheck,
  Briefcase,
  Users,
  Star,
  Globe2,
  Wallet,
} from "lucide-react";
import { TrustBadge } from "@/components/khidma/verification";
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
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5 }}
        >
          <p className="mb-5 text-center text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Trusted by Tunisian talent & international clients
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
            {items.map((item, i) => (
              <motion.div
                key={item.label}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
              >
                <TrustBadge
                  icon={item.icon}
                  label={item.label}
                  value={item.value}
                  className="h-full"
                />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default TrustStrip;
