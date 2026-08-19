"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { ShieldCheck, Briefcase, Wallet, Globe2, type LucideIcon } from "lucide-react";
import { Reveal } from "@/components/khidma/reveal";
import {
  trustStats,
  formatNumber,
  formatTND,
} from "@/lib/khidma-data";

interface Stat {
  icon: LucideIcon;
  raw: number;
  format: (n: number) => string;
  label: string;
}

const stats: Stat[] = [
  {
    icon: ShieldCheck,
    raw: trustStats.verifiedFreelancers,
    format: (n) => `${formatNumber(Math.round(n))}`,
    label: "verified freelancers",
  },
  {
    icon: Briefcase,
    raw: trustStats.completedProjects,
    format: (n) => `${formatNumber(Math.round(n))}`,
    label: "completed projects",
  },
  {
    icon: Wallet,
    raw: trustStats.totalPaidOut,
    format: (n) => formatTND(Math.round(n)),
    label: "total paid out",
  },
  {
    icon: Globe2,
    raw: trustStats.countries,
    format: (n) => Math.round(n).toString(),
    label: "countries served",
  },
];

/** Count-up hook — animates from 0 → target once `active` is true. */
function useCountUp(target: number, active: boolean, duration = 1500) {
  const [val, setVal] = useState(0);
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    if (!active) return;
    // Reduced motion: defer the state update via rAF (avoids synchronous
    // setState inside the effect body, and still lands on the target value).
    if (prefersReduced) {
      const raf = requestAnimationFrame(() => setVal(target));
      return () => cancelAnimationFrame(raf);
    }
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      // easeOutCubic
      const eased = 1 - Math.pow(1 - progress, 3);
      setVal(target * eased);
      if (progress < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, target, duration, prefersReduced]);

  return val;
}

function StatItem({ stat, index }: { stat: Stat; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const count = useCountUp(stat.raw, inView);
  const Icon = stat.icon;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="border-l-2 border-white/15 pl-4 sm:pl-5"
    >
      <div className="flex items-center gap-2 mb-2 text-white/70">
        <Icon className="size-4" />
        <span className="text-[10px] uppercase tracking-wider">
          {stat.label.split(" ")[0]}
        </span>
      </div>
      <div className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-white tracking-tight tabular-nums">
        {stat.format(count)}
      </div>
      <div className="mt-1 text-sm text-white/70">{stat.label}</div>
    </motion.div>
  );
}

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
        <div className="max-w-2xl mb-10 sm:mb-14">
          <Reveal>
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60">
              By the numbers
            </span>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="mt-2 font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight">
              A marketplace built on real, measurable trust
            </h2>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {stats.map((s, i) => (
            <StatItem key={s.label} stat={s} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default StatsBanner;
