"use client";

/**
 * StatsView — Khidma Platform Stats interactive view
 * ----------------------------------------------
 * A dedicated full-page interactive analytics dashboard (different from the
 * landing-page `StatsDashboard` section). Reached via the ⌘K command palette
 * "Platform Stats" entry, or via the "View full stats" button on the landing
 * stats-dashboard section.
 *
 * Layout (mobile-first, stacks to single column on small screens):
 *   1. Header — title + subtitle + back-to-home + "Last updated: just now" + refresh
 *   2. Time range tabs — 7d / 30d / 90d / 1y (visual filter on mock data)
 *   3. 4 KPI cards — count-up + trend + mini sparkline
 *   4. Charts grid (2×2 on desktop):
 *      - Growth chart (AreaChart, full width row 1) — signups + completions
 *      - Category distribution (PieChart donut, row 2 left)
 *      - Revenue by month (BarChart, row 2 right)
 *      - Top cities (horizontal BarChart, row 3, full width)
 *   5. Activity feed — last 10 platform events with color-coded icons
 *   6. Geographic distribution — top 5 countries with flags + percentages
 *   7. Performance metrics — 4 stat cards
 *
 * Uses recharts (AreaChart, PieChart, BarChart). Respects `prefers-reduced-motion`.
 * Palette: Khidma teal only — #475959 #2b3d3d #748684 #192d2f #32504d #6e8580 #ffffff
 */

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip as RTooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  ArrowLeft,
  RefreshCw,
  Users,
  Briefcase,
  Wallet,
  Percent,
  TrendingUp,
  TrendingDown,
  ShieldCheck,
  CheckCircle2,
  CreditCard,
  Star,
  Clock,
  MapPin,
  Globe2,
  Heart,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useApp } from "@/lib/store";
import { formatNumber, formatTND } from "@/lib/khidma-data";

/* ------------------------------------------------------------------ */
/* Palette + helpers                                                   */
/* ------------------------------------------------------------------ */

const TEAL = {
  primary: "#32504d",
  secondary: "#748684",
  tertiary: "#6e8580",
  deep: "#2b3d3d",
  darker: "#192d2f",
  mid: "#475959",
  light: "#ffffff",
};

type TimeRange = "7d" | "30d" | "90d" | "1y";

const TIME_RANGES: { id: TimeRange; label: string }[] = [
  { id: "7d", label: "7 days" },
  { id: "30d", label: "30 days" },
  { id: "90d", label: "90 days" },
  { id: "1y", label: "1 year" },
];

/* ------------------------------------------------------------------ */
/* Count-up hook (rAF-based, respects prefers-reduced-motion)          */
/* ------------------------------------------------------------------ */

function useCountUp(target: number, active: boolean, duration = 1400) {
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
  delta: string;
  spark: { v: number }[];
}

const SPARK_BASE = [
  [22, 28, 25, 33, 30, 38, 42],
  [30, 32, 35, 33, 38, 40, 44],
  [40, 44, 48, 52, 58, 64, 72],
  [50, 55, 60, 62, 68, 74, 82],
];

const KPIS: Kpi[] = [
  {
    icon: Users,
    raw: 1248,
    format: (n) => formatNumber(Math.round(n)),
    label: "Total Freelancers",
    trend: "up",
    delta: "+12%",
    spark: SPARK_BASE[0].map((v) => ({ v })),
  },
  {
    icon: Briefcase,
    raw: 342,
    format: (n) => formatNumber(Math.round(n)),
    label: "Active Projects",
    trend: "up",
    delta: "+8%",
    spark: SPARK_BASE[1].map((v) => ({ v })),
  },
  {
    icon: Wallet,
    raw: 1240000,
    format: (n) => {
      const v = Math.round(n);
      if (v >= 1_000_000) return `TND ${(v / 1_000_000).toFixed(2)}M`;
      return formatTND(v);
    },
    label: "Total Paid Out",
    trend: "up",
    delta: "+15%",
    spark: SPARK_BASE[2].map((v) => ({ v })),
  },
  {
    icon: Percent,
    raw: 12400,
    format: (n) => formatTND(Math.round(n)),
    label: "Platform Fee Earned",
    trend: "up",
    delta: "+15%",
    spark: SPARK_BASE[3].map((v) => ({ v })),
  },
];

function TrendBadge({ trend, delta }: { trend: Trend; delta: string }) {
  const Icon = trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : null;
  const color =
    trend === "up"
      ? "text-emerald-700 bg-emerald-500/10 ring-emerald-500/20"
      : trend === "down"
        ? "text-rose-700 bg-rose-500/10 ring-rose-500/20"
        : "text-muted-foreground bg-muted/60 ring-border/60";
  if (!Icon) return null;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold ring-1 ring-inset",
        color,
      )}
    >
      <Icon className="size-3" />
      {delta}
    </span>
  );
}

function Sparkline({ data, color }: { data: { v: number }[]; color: string }) {
  const prefersReduced = useReducedMotion();
  return (
    <div className="h-8 w-full" aria-hidden>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart
          data={data}
          margin={{ top: 2, right: 0, left: 0, bottom: 2 }}
        >
          <Line
            type="monotone"
            dataKey="v"
            stroke={color}
            strokeWidth={1.8}
            dot={false}
            isAnimationActive={!prefersReduced}
            animationDuration={700}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
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
          <div className="font-display text-2xl sm:text-3xl font-bold tracking-tight tabular-nums text-foreground">
            {kpi.format(count)}
          </div>
          <div className="mt-1 text-sm text-muted-foreground">{kpi.label}</div>
        </div>
        <div className="relative mt-3">
          <Sparkline data={kpi.spark} color={TEAL.primary} />
        </div>
      </Card>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* Time-range-filtered growth data                                     */
/* ------------------------------------------------------------------ */

function buildGrowthData(range: TimeRange) {
  const samples: Record<TimeRange, { label: string; signups: number; completions: number }[]> = {
    "7d": [
      { label: "Mon", signups: 18, completions: 12 },
      { label: "Tue", signups: 22, completions: 15 },
      { label: "Wed", signups: 27, completions: 19 },
      { label: "Thu", signups: 24, completions: 22 },
      { label: "Fri", signups: 31, completions: 25 },
      { label: "Sat", signups: 19, completions: 17 },
      { label: "Sun", signups: 16, completions: 14 },
    ],
    "30d": [
      { label: "W1", signups: 142, completions: 98 },
      { label: "W2", signups: 168, completions: 122 },
      { label: "W3", signups: 184, completions: 138 },
      { label: "W4", signups: 212, completions: 156 },
    ],
    "90d": [
      { label: "M1", signups: 540, completions: 412 },
      { label: "M2", signups: 612, completions: 468 },
      { label: "M3", signups: 698, completions: 534 },
    ],
    "1y": [
      { label: "Q1", signups: 1420, completions: 1180 },
      { label: "Q2", signups: 1680, completions: 1340 },
      { label: "Q3", signups: 1820, completions: 1520 },
      { label: "Q4", signups: 2120, completions: 1680 },
    ],
  };
  return samples[range];
}

function buildRevenueData(range: TimeRange) {
  const base: Record<TimeRange, { month: string; fee: number }[]> = {
    "7d": [
      { month: "Mon", fee: 280 },
      { month: "Tue", fee: 320 },
      { month: "Wed", fee: 360 },
      { month: "Thu", fee: 420 },
      { month: "Fri", fee: 510 },
      { month: "Sat", fee: 380 },
      { month: "Sun", fee: 290 },
    ],
    "30d": [
      { month: "W1", fee: 1620 },
      { month: "W2", fee: 1840 },
      { month: "W3", fee: 2120 },
      { month: "W4", fee: 2480 },
      { month: "W5", fee: 2680 },
      { month: "W6", fee: 2940 },
    ],
    "90d": [
      { month: "Apr", fee: 4200 },
      { month: "May", fee: 5180 },
      { month: "Jun", fee: 6240 },
      { month: "Jul", fee: 7820 },
      { month: "Aug", fee: 9460 },
      { month: "Sep", fee: 11240 },
    ],
    "1y": [
      { month: "Oct", fee: 8200 },
      { month: "Nov", fee: 9100 },
      { month: "Dec", fee: 10800 },
      { month: "Jan", fee: 11200 },
      { month: "Feb", fee: 11800 },
      { month: "Mar", fee: 12400 },
    ],
  };
  return base[range];
}

const CATEGORY_DATA = [
  { name: "Development", value: 35, color: TEAL.primary },
  { name: "Design", value: 22, color: TEAL.secondary },
  { name: "Video", value: 12, color: TEAL.tertiary },
  { name: "Writing", value: 10, color: TEAL.mid },
  { name: "Audio", value: 8, color: TEAL.deep },
  { name: "Other", value: 13, color: TEAL.darker },
];

const CITIES_DATA = [
  { city: "Tunis", count: 412 },
  { city: "Sfax", count: 268 },
  { city: "Sousse", count: 184 },
  { city: "Kairouan", count: 96 },
  { city: "Bizerte", count: 78 },
  { city: "Gabès", count: 64 },
  { city: "Ariana", count: 52 },
  { city: "Gafsa", count: 38 },
];

const COUNTRIES = [
  { code: "TN", name: "Tunisia", count: 1012, flag: "🇹🇳" },
  { code: "FR", name: "France", count: 89, flag: "🇫🇷" },
  { code: "DE", name: "Germany", count: 47, flag: "🇩🇪" },
  { code: "CA", name: "Canada", count: 32, flag: "🇨🇦" },
  { code: "AE", name: "UAE", count: 28, flag: "🇦🇪" },
];

const PERFORMANCE = [
  { icon: Clock, label: "Avg response time", value: "1.2h", hint: "across all freelancers" },
  { icon: Briefcase, label: "Avg project completion", value: "14 days", hint: "fixed-price projects" },
  { icon: Heart, label: "Client satisfaction", value: "94%", hint: "based on 8.4k reviews" },
  { icon: RefreshCw, label: "Repeat hire rate", value: "67%", hint: "clients who hire again" },
];

const ACTIVITY_EVENTS: {
  id: string;
  type: "verified" | "completed" | "payment" | "review" | "joined" | "milestone";
  text: string;
  time: string;
}[] = [
  { id: "e1", type: "verified", text: "New freelancer verified — Aymen K. (Developer)", time: "just now" },
  { id: "e2", type: "completed", text: "Project completed — 'SaaS landing page'", time: "2 min ago" },
  { id: "e3", type: "payment", text: "Payment released — TND 1,240 to wallet", time: "6 min ago" },
  { id: "e4", type: "review", text: "5-star review left by Sarah Chen", time: "12 min ago" },
  { id: "e5", type: "joined", text: "New client registered — Digital Agency TN", time: "18 min ago" },
  { id: "e6", type: "milestone", text: "Milestone approved — 'Design system kit'", time: "27 min ago" },
  { id: "e7", type: "verified", text: "Identity verified — Rania B. (Designer)", time: "34 min ago" },
  { id: "e8", type: "payment", text: "Withdrawal processed — TND 3,200", time: "41 min ago" },
  { id: "e9", type: "completed", text: "Project completed — 'Mobile onboarding flow'", time: "52 min ago" },
  { id: "e10", type: "review", text: "5-star review left by Karim Bouazizi", time: "1 hour ago" },
];

const ACTIVITY_META: Record<
  (typeof ACTIVITY_EVENTS)[number]["type"],
  { icon: LucideIcon; ring: string; bg: string; text: string }
> = {
  verified: { icon: ShieldCheck, ring: "ring-[#32504d]/25", bg: "bg-[#32504d]/10 dark:bg-[#32504d]/20", text: "text-[#32504d] dark:text-[#9bb3ae]" },
  completed: { icon: CheckCircle2, ring: "ring-[#6e8580]/25", bg: "bg-[#6e8580]/15", text: "text-[#6e8580]" },
  payment: { icon: CreditCard, ring: "ring-[#748684]/25", bg: "bg-[#748684]/15", text: "text-[#748684]" },
  review: { icon: Star, ring: "ring-[#475959]/25", bg: "bg-[#475959]/15 dark:bg-[#475959]/25", text: "text-[#475959] dark:text-[#94a8a4]" },
  joined: { icon: Users, ring: "ring-[#2b3d3d]/25", bg: "bg-[#2b3d3d]/15 dark:bg-[#2b3d3d]/30", text: "text-[#2b3d3d] dark:text-[#94a8a4]" },
  milestone: { icon: Sparkles, ring: "ring-[#32504d]/25", bg: "bg-[#32504d]/10 dark:bg-[#32504d]/20", text: "text-[#32504d] dark:text-[#9bb3ae]" },
};

/* ------------------------------------------------------------------ */
/* Custom tooltips                                                     */
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
  payload?: Array<{ name: string; value: number; payload: { color: string } }>;
}) {
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
        {p.value}% of freelancers
      </div>
    </div>
  );
}

function RevenueTooltip({
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
      <div className="flex items-center gap-2 text-xs">
        <span
          className="size-2 rounded-full"
          style={{ background: payload[0].color }}
          aria-hidden
        />
        <span className="text-foreground/70">Platform fee:</span>
        <span className="font-semibold tabular-nums text-foreground">
          {formatTND(payload[0].value)}
        </span>
      </div>
    </div>
  );
}

function CityTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ name: string; value: number; payload: { count: number } }>;
}) {
  if (!active || !payload || payload.length === 0) return null;
  const p = payload[0];
  return (
    <div className="rounded-lg border border-border bg-background/95 backdrop-blur-sm p-2.5 shadow-xl">
      <div className="text-xs font-semibold text-foreground">{p.name}</div>
      <div className="mt-0.5 text-[11px] text-muted-foreground tabular-nums">
        {formatNumber(p.payload.count)} freelancers
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Chart cards                                                         */
/* ------------------------------------------------------------------ */

function GrowthChartCard({ range }: { range: TimeRange }) {
  const prefersReduced = useReducedMotion();
  const data = useMemo(() => buildGrowthData(range), [range]);

  return (
    <Card className="h-full p-5 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div>
          <h3 className="font-display text-base sm:text-lg font-bold tracking-tight">
            Growth chart
          </h3>
          <p className="text-xs text-muted-foreground">
            Freelancer signups vs project completions · {TIME_RANGES.find((t) => t.id === range)?.label}
          </p>
        </div>
        <div className="flex items-center gap-4 text-[11px]">
          <div className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-sm bg-[#32504d]" aria-hidden />
            <span className="text-muted-foreground">Signups</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-sm bg-[#748684]" aria-hidden />
            <span className="text-muted-foreground">Completions</span>
          </div>
        </div>
      </div>
      <div className="h-64 sm:h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -8, bottom: 0 }}>
            <defs>
              <linearGradient id="stats-grad-signups" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={TEAL.primary} stopOpacity={0.55} />
                <stop offset="100%" stopColor={TEAL.primary} stopOpacity={0.02} />
              </linearGradient>
              <linearGradient id="stats-grad-completions" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={TEAL.secondary} stopOpacity={0.55} />
                <stop offset="100%" stopColor={TEAL.secondary} stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="currentColor"
              strokeOpacity={0.1}
              vertical={false}
            />
            <XAxis
              dataKey="label"
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
            <RTooltip
              content={<GrowthTooltip />}
              cursor={{ stroke: TEAL.secondary, strokeDasharray: 4, strokeOpacity: 0.4 }}
            />
            <Area
              type="monotone"
              dataKey="signups"
              name="Signups"
              stroke={TEAL.primary}
              strokeWidth={2.5}
              fill="url(#stats-grad-signups)"
              isAnimationActive={!prefersReduced}
              animationDuration={900}
              dot={{ r: 3, fill: TEAL.primary, strokeWidth: 0 }}
              activeDot={{ r: 5, fill: TEAL.primary, stroke: "#ffffff", strokeWidth: 2 }}
            />
            <Area
              type="monotone"
              dataKey="completions"
              name="Completions"
              stroke={TEAL.secondary}
              strokeWidth={2.5}
              fill="url(#stats-grad-completions)"
              isAnimationActive={!prefersReduced}
              animationDuration={1100}
              dot={{ r: 3, fill: TEAL.secondary, strokeWidth: 0 }}
              activeDot={{ r: 5, fill: TEAL.secondary, stroke: "#ffffff", strokeWidth: 2 }}
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

function CategoryDonutCard() {
  const prefersReduced = useReducedMotion();
  const total = CATEGORY_DATA.reduce((sum, c) => sum + c.value, 0);

  return (
    <Card className="h-full p-5 sm:p-6">
      <div className="mb-4">
        <h3 className="font-display text-base sm:text-lg font-bold tracking-tight">
          Category distribution
        </h3>
        <p className="text-xs text-muted-foreground">Freelancers across top categories</p>
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
              isAnimationActive={!prefersReduced}
              animationDuration={800}
            >
              {CATEGORY_DATA.map((entry, i) => (
                <Cell key={`cell-${i}`} fill={entry.color} />
              ))}
            </Pie>
            <RTooltip content={<CategoryTooltip />} />
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <div className="font-display text-2xl font-bold tabular-nums text-foreground">
            {total}%
          </div>
          <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
            total
          </div>
        </div>
      </div>
      <ul className="mt-4 grid grid-cols-2 gap-x-3 gap-y-1.5">
        {CATEGORY_DATA.map((c) => (
          <li key={c.name} className="flex items-center gap-1.5 text-[11px]">
            <span
              className="size-2 rounded-sm"
              style={{ background: c.color }}
              aria-hidden
            />
            <span className="text-muted-foreground flex-1 truncate">{c.name}</span>
            <span className="font-semibold tabular-nums text-foreground">{c.value}%</span>
          </li>
        ))}
      </ul>
    </Card>
  );
}

function RevenueBarCard({ range }: { range: TimeRange }) {
  const prefersReduced = useReducedMotion();
  const data = useMemo(() => buildRevenueData(range), [range]);

  return (
    <Card className="h-full p-5 sm:p-6">
      <div className="mb-4">
        <h3 className="font-display text-base sm:text-lg font-bold tracking-tight">
          Revenue by month
        </h3>
        <p className="text-xs text-muted-foreground">Platform fee earned · last 6 periods</p>
      </div>
      <div className="h-48 sm:h-56 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -8, bottom: 0 }}>
            <defs>
              <linearGradient id="stats-bar-fee" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={TEAL.primary} stopOpacity={1} />
                <stop offset="100%" stopColor={TEAL.tertiary} stopOpacity={0.6} />
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
            <RTooltip
              content={<RevenueTooltip />}
              cursor={{ fill: TEAL.tertiary, fillOpacity: 0.08 }}
            />
            <Bar
              dataKey="fee"
              name="Platform fee"
              fill="url(#stats-bar-fee)"
              radius={[4, 4, 0, 0]}
              isAnimationActive={!prefersReduced}
              animationDuration={900}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}

function TopCitiesCard() {
  const prefersReduced = useReducedMotion();
  const max = Math.max(...CITIES_DATA.map((c) => c.count));

  return (
    <Card className="h-full p-5 sm:p-6">
      <div className="mb-4">
        <h3 className="font-display text-base sm:text-lg font-bold tracking-tight">
          Top cities
        </h3>
        <p className="text-xs text-muted-foreground">Top 8 cities by freelancer count</p>
      </div>
      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={CITIES_DATA}
            layout="vertical"
            margin={{ top: 0, right: 16, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="stats-city-bar" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor={TEAL.primary} stopOpacity={1} />
                <stop offset="100%" stopColor={TEAL.tertiary} stopOpacity={0.6} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="currentColor"
              strokeOpacity={0.1}
              horizontal={false}
            />
            <XAxis
              type="number"
              tick={{ fontSize: 11 }}
              stroke="currentColor"
              strokeOpacity={0.4}
              tickLine={false}
              axisLine={false}
              domain={[0, Math.ceil(max / 100) * 100]}
            />
            <YAxis
              type="category"
              dataKey="city"
              tick={{ fontSize: 12 }}
              stroke="currentColor"
              strokeOpacity={0.5}
              tickLine={false}
              axisLine={false}
              width={72}
            />
            <RTooltip
              content={<CityTooltip />}
              cursor={{ fill: TEAL.tertiary, fillOpacity: 0.08 }}
            />
            <Bar
              dataKey="count"
              name="Freelancers"
              fill="url(#stats-city-bar)"
              radius={[0, 4, 4, 0]}
              isAnimationActive={!prefersReduced}
              animationDuration={900}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/* Activity feed                                                       */
/* ------------------------------------------------------------------ */

function ActivityFeed() {
  const prefersReduced = useReducedMotion();
  return (
    <Card className="h-full p-5 sm:p-6">
      <div className="mb-4 flex items-center justify-between gap-2">
        <div>
          <h3 className="font-display text-base sm:text-lg font-bold tracking-tight">
            Activity feed
          </h3>
          <p className="text-xs text-muted-foreground">Live platform events</p>
        </div>
        <motion.span
          className="size-2 rounded-full bg-emerald-500"
          animate={
            prefersReduced ? undefined : { scale: [1, 1.5, 1], opacity: [1, 0.5, 1] }
          }
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          aria-hidden
        />
      </div>
      <ul className="max-h-[26rem] overflow-y-auto pr-1 khidma-scroll">
        {ACTIVITY_EVENTS.map((ev, i) => {
          const meta = ACTIVITY_META[ev.type];
          const Icon = meta.icon;
          return (
            <motion.li
              key={ev.id}
              initial={prefersReduced ? undefined : { opacity: 0, x: -8 }}
              whileInView={prefersReduced ? undefined : { opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.04 }}
              className="flex items-start gap-3 py-2.5 border-b border-border/50 last:border-0"
            >
              <span
                className={cn(
                  "mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-full ring-1",
                  meta.bg,
                  meta.ring,
                )}
              >
                <Icon className={cn("size-3.5", meta.text)} />
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] leading-snug text-foreground">{ev.text}</p>
                <p className="text-[11px] text-muted-foreground mt-0.5">{ev.time}</p>
              </div>
            </motion.li>
          );
        })}
      </ul>
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/* Geographic distribution                                             */
/* ------------------------------------------------------------------ */

function GeographicDistribution() {
  const prefersReduced = useReducedMotion();
  const total = COUNTRIES.reduce((s, c) => s + c.count, 0);

  return (
    <Card className="p-5 sm:p-6">
      <div className="mb-4 flex items-center gap-2">
        <Globe2 className="size-4 text-[#32504d] dark:text-[#9bb3ae]" />
        <h3 className="font-display text-base sm:text-lg font-bold tracking-tight">
          Geographic distribution
        </h3>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        {COUNTRIES.map((c, i) => {
          const pct = (c.count / total) * 100;
          return (
            <motion.div
              key={c.code}
              initial={prefersReduced ? undefined : { opacity: 0, y: 12 }}
              whileInView={prefersReduced ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.06 }}
              className="rounded-xl border border-border/60 bg-card/50 p-4"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-2xl leading-none" aria-hidden>
                  {c.flag}
                </span>
                <span className="text-[11px] font-semibold tabular-nums text-muted-foreground">
                  {pct.toFixed(1)}%
                </span>
              </div>
              <div className="mt-2 font-display text-xl font-bold tabular-nums text-foreground">
                {formatNumber(c.count)}
              </div>
              <div className="text-[11px] text-muted-foreground">{c.name}</div>
              <div className="mt-2 h-1 w-full rounded-full bg-muted overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-[#32504d] to-[#748684]"
                  initial={prefersReduced ? undefined : { width: 0 }}
                  whileInView={prefersReduced ? undefined : { width: `${pct}%` }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.9, delay: 0.15 + i * 0.06, ease: "easeOut" }}
                />
              </div>
            </motion.div>
          );
        })}
      </div>
    </Card>
  );
}

/* ------------------------------------------------------------------ */
/* Performance metrics                                                 */
/* ------------------------------------------------------------------ */

function PerformanceMetrics() {
  const prefersReduced = useReducedMotion();
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {PERFORMANCE.map((m, i) => {
        const Icon = m.icon;
        return (
          <motion.div
            key={m.label}
            initial={prefersReduced ? undefined : { opacity: 0, y: 12 }}
            whileInView={prefersReduced ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45, delay: i * 0.06 }}
          >
            <Card className="h-full p-5">
              <span className="flex size-9 items-center justify-center rounded-lg bg-[#32504d]/10 dark:bg-[#32504d]/20 ring-1 ring-[#32504d]/15">
                <Icon className="size-4 text-[#32504d] dark:text-[#9bb3ae]" />
              </span>
              <div className="mt-3 font-display text-2xl font-bold tabular-nums text-foreground">
                {m.value}
              </div>
              <div className="text-sm font-medium text-foreground">{m.label}</div>
              <div className="text-[11px] text-muted-foreground mt-0.5">{m.hint}</div>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Sticky scroll-to-top on view change                                 */
/* ------------------------------------------------------------------ */

function useScrollTopOnMount() {
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, []);
}

/* ------------------------------------------------------------------ */
/* Main view                                                           */
/* ------------------------------------------------------------------ */

export function StatsView() {
  const prefersReduced = useReducedMotion();
  const setView = useApp((s) => s.setView);
  const [range, setRange] = useState<TimeRange>("30d");
  const [lastUpdated, setLastUpdated] = useState("just now");
  const [refreshing, setRefreshing] = useState(false);
  useScrollTopOnMount();

  // Tick the "last updated" label every 30s for a live feel.
  useEffect(() => {
    const tick = () => setLastUpdated("just now");
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, []);

  const onRefresh = () => {
    if (refreshing) return;
    setRefreshing(true);
    setLastUpdated("just now");
    setTimeout(() => setRefreshing(false), 800);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* ─── Header ─── */}
      <motion.div
        initial={prefersReduced ? undefined : { opacity: 0, y: 12 }}
        animate={prefersReduced ? undefined : { opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"
      >
        <div>
          <Button
            variant="ghost"
            size="sm"
            className="mb-3 -ml-2 text-muted-foreground hover:text-foreground"
            onClick={() => setView("home")}
          >
            <ArrowLeft className="size-4" />
            Back to home
          </Button>
          <h1 className="font-display text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            Khidma Platform Stats
          </h1>
          <p className="mt-2 text-base text-muted-foreground">
            Real-time marketplace metrics and growth analytics
          </p>
        </div>
        <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-muted/40 px-2.5 py-1">
            <span className="size-1.5 rounded-full bg-emerald-500" aria-hidden />
            Last updated: {lastUpdated}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            disabled={refreshing}
            className="h-8"
          >
            <RefreshCw
              className={cn("size-3.5", refreshing && "animate-spin")}
              aria-hidden
            />
            Refresh
          </Button>
        </div>
      </motion.div>

      {/* ─── Time range selector ─── */}
      <motion.div
        initial={prefersReduced ? undefined : { opacity: 0, y: 8 }}
        animate={prefersReduced ? undefined : { opacity: 1, y: 0 }}
        transition={{ duration: 0.45, delay: 0.05 }}
        className="mt-6 flex flex-wrap items-center gap-1.5 rounded-xl border border-border/60 bg-card/40 p-1"
        role="tablist"
        aria-label="Time range"
      >
        {TIME_RANGES.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={range === t.id}
            onClick={() => setRange(t.id)}
            className={cn(
              "rounded-lg px-3 py-1.5 text-xs font-semibold transition-colors",
              range === t.id
                ? "bg-[#32504d] text-white shadow-sm"
                : "text-muted-foreground hover:bg-muted/60 hover:text-foreground",
            )}
          >
            {t.label}
          </button>
        ))}
      </motion.div>

      {/* ─── 4 KPI cards ─── */}
      <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {KPIS.map((k, i) => (
          <KpiCard key={k.label} kpi={k} index={i} />
        ))}
      </div>

      {/* ─── Charts grid (2×2 desktop) ─── */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <motion.div
          initial={prefersReduced ? undefined : { opacity: 0, y: 16 }}
          animate={prefersReduced ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="lg:col-span-2"
        >
          <GrowthChartCard range={range} />
        </motion.div>
        <motion.div
          initial={prefersReduced ? undefined : { opacity: 0, y: 16 }}
          animate={prefersReduced ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          <CategoryDonutCard />
        </motion.div>
        <motion.div
          initial={prefersReduced ? undefined : { opacity: 0, y: 16 }}
          animate={prefersReduced ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <RevenueBarCard range={range} />
        </motion.div>
        <motion.div
          initial={prefersReduced ? undefined : { opacity: 0, y: 16 }}
          animate={prefersReduced ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="lg:col-span-2"
        >
          <TopCitiesCard />
        </motion.div>
      </div>

      {/* ─── Activity feed + geographic distribution ─── */}
      <div className="mt-6 grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <motion.div
          initial={prefersReduced ? undefined : { opacity: 0, y: 16 }}
          animate={prefersReduced ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="lg:col-span-2"
        >
          <GeographicDistribution />
        </motion.div>
        <motion.div
          initial={prefersReduced ? undefined : { opacity: 0, y: 16 }}
          animate={prefersReduced ? undefined : { opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
        >
          <ActivityFeed />
        </motion.div>
      </div>

      {/* ─── Performance metrics ─── */}
      <div className="mt-6">
        <PerformanceMetrics />
      </div>
    </div>
  );
}

export default StatsView;
