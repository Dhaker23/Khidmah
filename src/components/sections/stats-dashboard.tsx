"use client";

/**
 * Stats Dashboard , "Khidma by the numbers"
 * -----------------------------------------
 * Richer version of StatsBanner with live KPI cards + recharts visualizations.
 *
 * Sections:
 *   1. SectionHeading , eyebrow "PLATFORM ANALYTICS" + title + description
 *   2. 4 KPI cards with count-up + trend indicators
 *   3. Area chart (2/3 width) , Growth over 6 months (signups + completions)
 *   4. Donut chart (1/3 width) , Freelancers by category
 *   5. Bottom row , 3 mini-stats (Countries, Cities, Avg response time)
 *
 * Uses recharts (AreaChart + PieChart). Respects `prefers-reduced-motion`.
 * Palette: Khidma teal only , #475959 #2b3d3d #748684 #192d2f #32504d #6e8580 #ffffff
 */

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip as RTooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  ShieldCheck,
  Briefcase,
  Wallet,
  Star,
  TrendingUp,
  TrendingDown,
  Minus,
  Globe2,
  MapPin,
  Clock,
  type LucideIcon,
} from "lucide-react";
import { Reveal, SectionHeading, Section } from "@/components/khidma/reveal";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useApp } from "@/lib/store";
import { useT } from "@/lib/use-t";
import {
  trustStats,
  formatNumber,
  formatTND,
} from "@/lib/khidma-data";

/* ------------------------------------------------------------------ */
/* Count-up hook                                                       */
/* ------------------------------------------------------------------ */

function useCountUp(target: number, active: boolean, duration = 1500) {
  const [val, setVal] = useState(0);
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    if (!active) return;
    if (prefersReduced) {
      const raf = requestAnimationFrame(() => setVal(target));
      return () => cancelAnimationFrame(raf);
    }
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setVal(target * eased);
      if (progress < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, target, duration, prefersReduced]);

  return val;
}

/* ------------------------------------------------------------------ */
/* KPI cards                                                           */
/* ------------------------------------------------------------------ */

type Trend = "up" | "down" | "stable";

interface Kpi {
  icon: LucideIcon;
  raw: number;
  format: (n: number) => string;
  label: string;
  trend: Trend;
  delta: string; // e.g. "+12% MoM", "stable"
}

const KPIS: Kpi[] = [
  {
    icon: ShieldCheck,
    raw: trustStats.verifiedFreelancers,
    format: (n) => formatNumber(Math.round(n)),
    label: "Verified freelancers",
    trend: "up",
    delta: "+12% MoM",
  },
  {
    icon: Briefcase,
    raw: trustStats.completedProjects,
    format: (n) => formatNumber(Math.round(n)),
    label: "Completed projects",
    trend: "up",
    delta: "+8% MoM",
  },
  {
    icon: Wallet,
    raw: trustStats.totalPaidOut,
    format: (n) => formatTND(Math.round(n)),
    label: "Total paid out",
    trend: "up",
    delta: "+15% MoM",
  },
  {
    icon: Star,
    raw: trustStats.avgRating,
    format: (n) => n.toFixed(1),
    label: "Avg rating (out of 5.0)",
    trend: "stable",
    delta: "stable",
  },
];
function TrendBadge({ trend, delta }: { trend: Trend; delta: string }) {
  const Icon = trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : Minus;
  const color =
    trend === "up"
      ? "text-emerald-700 bg-emerald-500/10 ring-emerald-500/20"
      : trend === "down"
      ? "text-rose-700 bg-rose-500/10 ring-rose-500/20"
      : "text-muted-foreground bg-muted/60 ring-border/60";
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ring-1 ring-inset",
        color
      )}
    >
      <Icon className="size-3" />
      {delta}
    </span>
  );
}

function KpiCard({ kpi, index }: { kpi: Kpi; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-50px" });
  const count = useCountUp(kpi.raw, inView);
  const prefersReduced = useReducedMotion();
  const Icon = kpi.icon;

  return (
    <motion.div
      ref={ref}
      initial={prefersReduced ? undefined : { opacity: 0, y: 16 }}
      whileInView={prefersReduced ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
    >
      <Card className="relative h-full overflow-hidden p-5 sm:p-6">
        {/* Decorative corner glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute -top-12 -right-12 size-32 rounded-full blur-2xl opacity-40"
          style={{
            background:
              "radial-gradient(circle, rgba(116,134,132,0.4) 0%, transparent 70%)",
          }}
        />
        <div className="relative flex items-start justify-between gap-2">
          <span className="flex size-10 items-center justify-center rounded-xl bg-[#32504d]/10 dark:bg-[#32504d]/20 ring-1 ring-[#32504d]/15">
            <Icon className="size-5 text-[#32504d] dark:text-[#9bb3ae]" />
          </span>
          <TrendBadge trend={kpi.trend} delta={kpi.delta} />
        </div>
        <div className="relative mt-4">
          <div className="font-display text-3xl sm:text-4xl font-bold tracking-tight tabular-nums text-foreground">
            {kpi.format(count)}
          </div>
          <div className="mt-1 text-sm text-muted-foreground">
            {kpi.label}
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* Charts data                                                         */
/* ------------------------------------------------------------------ */

const GROWTH_DATA = [
  { month: "Mar", signups: 142, completions: 980 },
  { month: "Apr", signups: 178, completions: 1120 },
  { month: "May", signups: 196, completions: 1280 },
  { month: "Jun", signups: 224, completions: 1340 },
  { month: "Jul", signups: 252, completions: 1490 },
  { month: "Aug", signups: 286, completions: 1660 },
];

interface CategorySlice {
  name: string;
  value: number;
  color: string;
}

const CATEGORY_DATA: CategorySlice[] = [
  { name: "Development", value: 35, color: "#32504d" },
  { name: "Design", value: 22, color: "#748684" },
  { name: "Video", value: 12, color: "#6e8580" },
  { name: "Writing", value: 10, color: "#475959" },
  { name: "Other", value: 21, color: "#2b3d3d" },
];

/* ------------------------------------------------------------------ */
/* Custom tooltips (recharts)                                          */
/* ------------------------------------------------------------------ */

function GrowthTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
  label?: string;
}) {
  if (!active || !payload || payload.length === 0) return null;
  return (
    <div className="rounded-lg border border-border bg-background/95 backdrop-blur-sm p-3 shadow-xl">
      <div className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
        {label}
      </div>
      <div className="space-y-1">
        {payload.map((p) => (
          <div key={p.name} className="flex items-center gap-2 text-xs">
            <span
              className="size-2 rounded-full"
              style={{ background: p.color }}
              aria-hidden
            />
            <span className="text-foreground/70">{p.name}:</span>
            <span className="font-semibold tabular-nums text-foreground">
              {formatNumber(p.value)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function CategoryTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ name: string; value: number; payload: CategorySlice }>;
}) {
  const { t } = useT();
  if (!active || !payload || payload.length === 0) return null;
  const p = payload[0];
  return (
    <div className="rounded-lg border border-border bg-background/95 backdrop-blur-sm p-2.5 shadow-xl">
      <div className="flex items-center gap-2 text-xs">
        <span
          className="size-2 rounded-full"
          style={{ background: p.payload.color }}
          aria-hidden
        />
        <span className="font-semibold text-foreground">{p.name}</span>
      </div>
      <div className="mt-0.5 text-[11px] text-muted-foreground">
        {p.value}% {t("section.statsDashboard.donut.tooltip")}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Chart cards                                                         */
/* ------------------------------------------------------------------ */

function GrowthChart() {
  const prefersReduced = useReducedMotion();
  const isAnimationActive = !prefersReduced;
  const { t } = useT();

  return (
    <Card className="h-full p-5 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div>
          <h3 className="font-display text-base sm:text-lg font-bold tracking-tight">
            {t("section.statsDashboard.growth.title")}
          </h3>
          <p className="text-xs text-muted-foreground">
            {t("section.statsDashboard.growth.subtitle")}
          </p>
        </div>
        <div className="flex items-center gap-4 text-[11px]">
          <div className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-sm bg-[#32504d]" aria-hidden />
            <span className="text-muted-foreground">{t("section.statsDashboard.legend.signups")}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-sm bg-[#748684]" aria-hidden />
            <span className="text-muted-foreground">{t("section.statsDashboard.legend.completions")}</span>
          </div>
        </div>
      </div>
      <div className="h-64 sm:h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={GROWTH_DATA}
            margin={{ top: 10, right: 10, left: -8, bottom: 0 }}
          >
            <defs>
              <linearGradient id="grad-signups" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#32504d" stopOpacity={0.55} />
                <stop offset="100%" stopColor="#32504d" stopOpacity={0.02} />
              </linearGradient>
              <linearGradient id="grad-completions" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#748684" stopOpacity={0.55} />
                <stop offset="100%" stopColor="#748684" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="currentColor"
              strokeOpacity={0.1}
              vertical={false}
            />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 11 }}
              stroke="currentColor"
              strokeOpacity={0.4}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              tick={{ fontSize: 11 }}
              stroke="currentColor"
              strokeOpacity={0.4}
              tickLine={false}
              axisLine={false}
              width={42}
            />
            <RTooltip content={<GrowthTooltip />} cursor={{ stroke: "#748684", strokeDasharray: 4, strokeOpacity: 0.4 }} />
            <Area
              type="monotone"
              dataKey="signups"
              name="Signups"
              stroke="#32504d"
              strokeWidth={2.5}
              fill="url(#grad-signups)"
              isAnimationActive={isAnimationActive}
              animationDuration={900}
              dot={{ r: 3, fill: "#32504d", strokeWidth: 0 }}
              activeDot={{ r: 5, fill: "#32504d", stroke: "#ffffff", strokeWidth: 2 }}
            />
            <Area
              type="monotone"
              dataKey="completions"
              name="Completions"
              stroke="#748684"
              strokeWidth={2.5}
              fill="url(#grad-completions)"
              isAnimationActive={isAnimationActive}
              animationDuration={1100}
              dot={{ r: 3, fill: "#748684", strokeWidth: 0 }}
              activeDot={{ r: 5, fill: "#748684", stroke: "#ffffff", strokeWidth: 2 }}
            />
            <Legend
              wrapperStyle={{ fontSize: 11, paddingTop: 8 }}
              iconType="circle"
              iconSize={8}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}

function CategoryDonut() {
  const prefersReduced = useReducedMotion();
  const isAnimationActive = !prefersReduced;
  const total = trustStats.verifiedFreelancers;
  const { t } = useT();

  return (
    <Card className="h-full p-5 sm:p-6">
      <div className="mb-4">
        <h3 className="font-display text-base sm:text-lg font-bold tracking-tight">
          {t("section.statsDashboard.donut.title")}
        </h3>
        <p className="text-xs text-muted-foreground">
          {t("section.statsDashboard.donut.subtitle")}
        </p>
      </div>
      <div className="relative h-48 sm:h-52 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={CATEGORY_DATA}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius="62%"
              outerRadius="92%"
              paddingAngle={2}
              stroke="hsl(var(--background, 0 0% 100%))"
              strokeWidth={2}
              isAnimationActive={isAnimationActive}
              animationDuration={800}
            >
              {CATEGORY_DATA.map((entry, i) => (
                <Cell key={`cell-${i}`} fill={entry.color} />
              ))}
            </Pie>
            <RTooltip content={<CategoryTooltip />} />
          </PieChart>
        </ResponsiveContainer>
        {/* Center label */}
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <div className="font-display text-2xl font-bold tabular-nums text-foreground">
            {formatNumber(total)}
          </div>
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
            {t("section.statsDashboard.donut.center")}
          </div>
        </div>
      </div>
      {/* Legend */}
      <ul className="mt-4 grid grid-cols-2 gap-x-3 gap-y-1.5">
        {CATEGORY_DATA.map((c) => (
          <li key={c.name} className="flex items-center gap-1.5 text-[11px]">
            <span
              className="size-2 rounded-sm"
              style={{ background: c.color }}
              aria-hidden
            />
            <span className="text-muted-foreground flex-1 truncate">{c.name}</span>
            <span className="font-semibold tabular-nums text-foreground">
              {c.value}%
            </span>
          </li>
        ))}
      </ul>
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/* Mini stats bottom row                                               */
/* ------------------------------------------------------------------ */

const MINI_STATS_RAW = [
  { icon: Globe2, key: "countries", value: "41" },
  { icon: MapPin, key: "cities", value: "24" },
  { icon: Clock, key: "responseTime", value: "1.2h" },
] as const;

function MiniStat({
  icon: Icon,
  label,
  value,
  index,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  index: number;
}) {
  const prefersReduced = useReducedMotion();
  return (
    <motion.div
      initial={prefersReduced ? undefined : { opacity: 0, y: 12 }}
      whileInView={prefersReduced ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, delay: index * 0.08 }}
      className="flex items-center gap-3 rounded-xl border border-border/60 bg-card/50 px-4 py-3"
    >
      <span className="flex size-9 items-center justify-center rounded-lg bg-[#32504d]/10 dark:bg-[#32504d]/20 ring-1 ring-[#32504d]/15">
        <Icon className="size-4 text-[#32504d] dark:text-[#9bb3ae]" />
      </span>
      <div className="leading-tight">
        <div className="font-display text-lg font-bold tabular-nums text-foreground">
          {value}
        </div>
        <div className="text-[11px] text-muted-foreground">{label}</div>
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* Section                                                             */
/* ------------------------------------------------------------------ */

export function StatsDashboard() {
  const prefersReduced = useReducedMotion();
  const setView = useApp((s) => s.setView);
  const { t } = useT();
  return (
    <Section className="bg-gradient-to-b from-background to-muted/30">
      <SectionHeading
        eyebrow={t("section.eyebrow.platformAnalytics")}
        title={
          <>
            Khidma by the{" "}
            <span className="text-[#32504d] dark:text-[#9bb3ae]">numbers</span>
          </>
        }
        description={t("section.statsDashboard.description")}
      />

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
        {KPIS.map((k, i) => (
          <KpiCard key={k.label} kpi={k} index={i} />
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mb-8">
        <Reveal className="lg:col-span-2">
          <GrowthChart />
        </Reveal>
        <Reveal delay={0.1}>
          <CategoryDonut />
        </Reveal>
      </div>

      {/* Bottom mini stats */}
      <Reveal delay={0.05}>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {MINI_STATS_RAW.map((s, i) => (
            <MiniStat
              key={s.key}
              icon={s.icon}
              label={t(`section.statsDashboard.mini.${s.key}`)}
              value={s.value}
              index={i}
            />
          ))}
        </div>
      </Reveal>

      {/* Subtle live indicator */}
      <motion.div
        initial={prefersReduced ? undefined : { opacity: 0 }}
        whileInView={prefersReduced ? undefined : { opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 text-[11px] text-muted-foreground"
      >
        <div className="flex items-center gap-2">
          <motion.span
            className="size-1.5 rounded-full bg-emerald-500"
            animate={
              prefersReduced ? undefined : { scale: [1, 1.4, 1], opacity: [1, 0.6, 1] }
            }
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            aria-hidden
          />
          <span>{t("section.statsDashboard.live")}</span>
        </div>
        <button
          type="button"
          onClick={() => setView("stats")}
          className="group inline-flex items-center gap-1.5 rounded-full border border-[#32504d]/30 dark:border-[#32504d]/30 bg-[#32504d]/5 dark:bg-[#32504d]/15 px-3 py-1.5 text-xs font-semibold text-[#32504d] dark:text-[#9bb3ae] transition-colors hover:bg-[#32504d]/10 dark:bg-[#32504d]/20 hover:border-[#32504d]/50"
        >
          {t("section.statsDashboard.viewFull")}
          <TrendingUp className="size-3.5 transition-transform group-hover:translate-x-0.5" aria-hidden />
        </button>
      </motion.div>
    </Section>
  );
}

export default StatsDashboard;
