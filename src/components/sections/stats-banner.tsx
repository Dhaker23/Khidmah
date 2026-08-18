"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Briefcase, Wallet, Globe2 } from "lucide-react";
import {
  trustStats,
  formatNumber,
  formatTND,
} from "@/lib/khidma-data";

const stats = [
  {
    icon: ShieldCheck,
    value: `${formatNumber(trustStats.verifiedFreelancers)}`,
    label: "verified freelancers",
  },
  {
    icon: Briefcase,
    value: `${formatNumber(trustStats.completedProjects)}`,
    label: "completed projects",
  },
  {
    icon: Wallet,
    value: formatTND(trustStats.totalPaidOut),
    label: "total paid out",
  },
  {
    icon: Globe2,
    value: `${trustStats.countries}`,
    label: "countries served",
  },
];

export function StatsBanner() {
  return (
    <section className="relative bg-khidma-gradient overflow-hidden">
      <div
        className="absolute inset-0 opacity-25 pointer-events-none bg-dot-grid"
        aria-hidden
      />
      <div
        className="absolute inset-0 opacity-50 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 30%, rgba(116,134,132,0.25) 0%, transparent 45%), radial-gradient(circle at 85% 70%, rgba(50,80,77,0.3) 0%, transparent 50%)",
        }}
      />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.55 }}
          className="max-w-2xl mb-10 sm:mb-14"
        >
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60">
            By the numbers
          </span>
          <h2 className="mt-2 font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight">
            A marketplace built on real, measurable trust
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {stats.map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="border-l-2 border-white/15 pl-4 sm:pl-5"
              >
                <div className="flex items-center gap-2 mb-2 text-white/70">
                  <Icon className="size-4" />
                  <span className="text-[10px] uppercase tracking-wider">
                    {s.label.split(" ")[0]}
                  </span>
                </div>
                <div className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight">
                  {s.value}
                </div>
                <div className="mt-1 text-sm text-white/70">{s.label}</div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default StatsBanner;
