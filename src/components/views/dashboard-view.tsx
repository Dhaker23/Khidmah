"use client";

import { useState, useMemo, type ComponentType } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  User,
  Briefcase,
  Sparkles,
  FileText,
  FileSignature,
  Wallet,
  Star,
  Settings,
  Bell,
  ArrowLeft,
  Menu,
  ChevronRight,
  Pencil,
  Plus,
  Trash2,
  Pause,
  Eye,
  CheckCircle2,
  Clock,
  TrendingUp,
  ArrowUpRight,
  ArrowDownLeft,
  ShieldCheck,
  Mail,
  Phone,
  Banknote,
  PiggyBank,
  MapPin,
  Globe,
  Calendar,
  Search,
  LogOut,
  ExternalLink,
  MessageSquare,
  Award,
  Lock,
  BellRing,
  EyeOff,
  CreditCard,
  ChevronDown,
  type LucideIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Sheet,
  SheetContent,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  CartesianGrid,
} from "recharts";

import { useApp } from "@/lib/store";
import {
  freelancers,
  formatTND,
  formatNumber,
  withdrawalMethods,
  reviews,
  type PortfolioItem,
} from "@/lib/khidma-data";
import {
  VerificationBadge,
  VerificationChecklist,
} from "@/components/khidma/verification";
import { AchievementBadges } from "@/components/khidma/achievement-badges";
import {
  kpis,
  earningsMonthly,
  activityFeed,
  profileCompletion,
  proposals,
  contracts,
  walletBalances,
  walletTransactions,
  ratingMetrics,
  applicationStatus,
  notificationDefaults,
  quickActions,
  proposalStatusStyles,
  contractStatusStyles,
  milestoneStatusStyles,
  txnStatusStyles,
  type ActivityType,
  type ProposalStatus,
} from "@/lib/dashboard-mock";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// ============================================================================
// Types & config
// ============================================================================

type TabKey =
  | "overview"
  | "profile"
  | "portfolio"
  | "services"
  | "proposals"
  | "contracts"
  | "wallet"
  | "reviews"
  | "settings";

interface NavItem {
  key: TabKey;
  label: string;
  icon: LucideIcon;
  badge?: number;
}

const NAV_ITEMS: NavItem[] = [
  { key: "overview", label: "Overview", icon: LayoutDashboard },
  { key: "profile", label: "My Profile", icon: User },
  { key: "portfolio", label: "Portfolio", icon: Briefcase, badge: 3 },
  { key: "services", label: "Services", icon: Sparkles, badge: 2 },
  { key: "proposals", label: "Proposals & Applications", icon: FileText, badge: 4 },
  { key: "contracts", label: "Contracts", icon: FileSignature, badge: 3 },
  { key: "wallet", label: "Wallet & Earnings", icon: Wallet },
  { key: "reviews", label: "Reviews", icon: Star },
  { key: "settings", label: "Settings", icon: Settings },
];

const ACTIVITY_ICONS: Record<ActivityType, LucideIcon> = {
  proposal: FileText,
  milestone: ShieldCheck,
  payment: Banknote,
  review: Star,
  portfolio: Briefcase,
};

const ACTIVITY_COLORS: Record<ActivityType, string> = {
  proposal: "#32504d",
  milestone: "#475959",
  payment: "#15803d",
  review: "#b45309",
  portfolio: "#2b3d3d",
};

const QUICK_ACTION_ICONS: Record<string, LucideIcon> = {
  User,
  Plus,
  Sparkles,
  Search,
};

// ============================================================================
// Small shared bits
// ============================================================================

function StatPill({
  icon: Icon,
  value,
  label,
  color,
}: {
  icon: LucideIcon;
  value: string;
  label: string;
  color: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <span
        className="size-8 rounded-lg flex items-center justify-center"
        style={{ backgroundColor: `${color}15` }}
      >
        <Icon className="size-4" style={{ color }} />
      </span>
      <div className="leading-tight">
        <div className="text-sm font-bold text-foreground">{value}</div>
        <div className="text-[10px] text-muted-foreground uppercase tracking-wider">
          {label}
        </div>
      </div>
    </div>
  );
}

function SectionTitle({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-3 mb-4">
      <div>
        <h2 className="font-display text-xl font-bold text-foreground tracking-tight">
          {title}
        </h2>
        {subtitle && (
          <p className="text-sm text-muted-foreground mt-0.5">{subtitle}</p>
        )}
      </div>
      {action}
    </div>
  );
}

function ChartTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-border/60 bg-card px-3 py-2 shadow-md">
      <p className="text-[11px] text-muted-foreground mb-1">{label}</p>
      {payload.map((p: any) => (
        <p
          key={p.dataKey}
          className="text-xs font-semibold"
          style={{ color: p.color }}
        >
          {p.name}: {formatTND(p.value)}
        </p>
      ))}
    </div>
  );
}

// ============================================================================
// Top bar
// ============================================================================

function TopBar({ me }: { me: (typeof freelancers)[number] }) {
  const { setView, openWallet } = useApp();
  const [bellOpen, setBellOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 bg-background/85 backdrop-blur-md border-b border-border/60">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center gap-3">
        {/* Back */}
        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground hover:text-foreground gap-1 -ml-2"
          onClick={() => setView("home")}
        >
          <ArrowLeft className="size-4" />
          <span className="hidden sm:inline">Back to Home</span>
        </Button>

        <Separator orientation="vertical" className="hidden sm:block h-6" />

        {/* Welcome */}
        <div className="flex items-center gap-2.5 min-w-0">
          <Avatar className="size-8 border border-border/60 shrink-0">
            <AvatarImage src={me.avatar} alt={me.name} />
            <AvatarFallback>{me.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="min-w-0 hidden sm:block">
            <p className="text-sm font-semibold text-foreground truncate leading-tight">
              Welcome back, {me.name.split(" ")[0]}
            </p>
            <p className="text-[10px] text-muted-foreground truncate leading-tight">
              {me.title}
            </p>
          </div>
        </div>

        {/* Right side */}
        <div className="ml-auto flex items-center gap-2 sm:gap-3">
          {/* Bell */}
          <div className="relative">
            <Button
              variant="outline"
              size="icon"
              className="relative size-9 rounded-full border-border/60 bg-card"
              onClick={() => setBellOpen((p) => !p)}
              aria-label="Notifications"
            >
              <Bell className="size-4 text-foreground" />
              <span className="absolute top-1.5 right-1.5 size-2 rounded-full bg-rose-500 ring-2 ring-card" />
            </Button>
            <AnimatePresence>
              {bellOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.96 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-72 rounded-xl border border-border/60 bg-card shadow-xl p-2 z-40"
                >
                  <div className="px-2 py-2 flex items-center justify-between">
                    <span className="text-xs font-semibold">
                      Notifications
                    </span>
                    <Badge
                      variant="outline"
                      className="text-[9px] h-4 px-1 border-[#32504d]/30 dark:border-[#32504d]/30 text-[#32504d] dark:text-[#9bb3ae]"
                    >
                      3 new
                    </Badge>
                  </div>
                  <Separator className="mb-1" />
                  <ul className="space-y-0.5 max-h-64 overflow-y-auto">
                    {activityFeed.slice(0, 3).map((a) => {
                      const Icon = ACTIVITY_ICONS[a.type];
                      return (
                        <li
                          key={a.id}
                          className="flex items-start gap-2 p-2 rounded-lg hover:bg-muted/60 cursor-pointer"
                        >
                          <span
                            className="size-7 rounded-md flex items-center justify-center shrink-0"
                            style={{
                              backgroundColor: `${ACTIVITY_COLORS[a.type]}15`,
                            }}
                          >
                            <Icon
                              className="size-3.5"
                              style={{ color: ACTIVITY_COLORS[a.type] }}
                            />
                          </span>
                          <div className="min-w-0">
                            <p className="text-xs font-semibold truncate">
                              {a.title}
                            </p>
                            <p className="text-[10px] text-muted-foreground line-clamp-2">
                              {a.description}
                            </p>
                            <p className="text-[10px] text-muted-foreground/70 mt-0.5">
                              {a.time}
                            </p>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Wallet mini-card */}
          <button
            onClick={openWallet}
            className="flex items-center gap-2.5 rounded-xl border border-border/60 bg-card pl-2.5 pr-3 py-1.5 hover:border-[#32504d]/40 hover:bg-[#32504d]/5 dark:bg-[#32504d]/15 transition-colors"
            aria-label="Open wallet"
          >
            <span className="size-7 rounded-lg bg-khidma-gradient flex items-center justify-center">
              <Wallet className="size-3.5 text-white" />
            </span>
            <div className="text-left leading-tight">
              <div className="text-[9px] uppercase tracking-wider text-muted-foreground">
                Available
              </div>
              <div className="text-sm font-bold text-foreground">
                {formatTND(kpis.availableBalance)}
              </div>
            </div>
          </button>
        </div>
      </div>
    </header>
  );
}

// ============================================================================
// Sidebar
// ============================================================================

function SidebarContent({
  activeTab,
  onTabChange,
  me,
}: {
  activeTab: TabKey;
  onTabChange: (t: TabKey) => void;
  me: (typeof freelancers)[number];
}) {
  return (
    <div className="flex flex-col gap-4 h-full">
      {/* Profile mini */}
      <div className="rounded-xl border border-border/60 bg-card p-3 flex items-center gap-3">
        <Avatar className="size-10 border border-border/60">
          <AvatarImage src={me.avatar} alt={me.name} />
          <AvatarFallback>{me.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="min-w-0">
          <div className="flex items-center gap-1">
            <p className="text-sm font-semibold truncate">{me.name}</p>
            {me.topRated && (
              <Star className="size-3 fill-amber-400 text-amber-400 shrink-0" />
            )}
          </div>
          <p className="text-[10px] text-muted-foreground truncate">
            {me.username}
          </p>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-0.5">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = activeTab === item.key;
          return (
            <button
              key={item.key}
              onClick={() => onTabChange(item.key)}
              className={cn(
                "group relative flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors",
                active
                  ? "bg-[#2b3d3d] text-white"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
              )}
            >
              <Icon
                className={cn(
                  "size-4 shrink-0",
                  active ? "text-white" : "group-hover:text-[#32504d] dark:text-[#9bb3ae]"
                )}
              />
              <span className="truncate">{item.label}</span>
              {item.badge ? (
                <Badge
                  variant="outline"
                  className={cn(
                    "ml-auto h-5 px-1.5 text-[10px] font-semibold",
                    active
                      ? "bg-white/15 text-white border-white/20"
                      : "bg-[#32504d]/10 dark:bg-[#32504d]/20 text-[#32504d] dark:text-[#9bb3ae] border-[#32504d]/25 dark:border-[#32504d]/30"
                  )}
                >
                  {item.badge}
                </Badge>
              ) : null}
            </button>
          );
        })}
      </nav>

      <div className="mt-auto">
        <Separator className="mb-3" />
        {/* Submit for Review status */}
        <div className="rounded-xl border border-emerald-200/60 bg-emerald-50/60 dark:bg-emerald-500/5 dark:border-emerald-500/20 p-3">
          <div className="flex items-center gap-2">
            <span className="size-7 rounded-lg bg-emerald-500/15 flex items-center justify-center">
              <CheckCircle2 className="size-4 text-emerald-700" />
            </span>
            <div className="flex-1">
              <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                Application
              </p>
              <p className="text-xs font-semibold text-foreground">Approved</p>
            </div>
            <Badge className="bg-emerald-500/15 text-emerald-700 border-emerald-200 hover:bg-emerald-500/15 text-[9px]">
              LIVE
            </Badge>
          </div>
          <p className="text-[10px] text-muted-foreground mt-2 leading-relaxed">
            Approved on {applicationStatus.approvedAt}. Your profile is visible
            to clients worldwide.
          </p>
        </div>
      </div>
    </div>
  );
}

function DesktopSidebar({
  activeTab,
  onTabChange,
  me,
}: {
  activeTab: TabKey;
  onTabChange: (t: TabKey) => void;
  me: (typeof freelancers)[number];
}) {
  return (
    <aside className="hidden lg:block w-60 shrink-0">
      <div className="sticky top-20 h-[calc(100vh-6rem)]">
        <SidebarContent
          activeTab={activeTab}
          onTabChange={onTabChange}
          me={me}
        />
      </div>
    </aside>
  );
}

function MobileSidebar({
  activeTab,
  onTabChange,
  me,
  open,
  setOpen,
}: {
  activeTab: TabKey;
  onTabChange: (t: TabKey) => void;
  me: (typeof freelancers)[number];
  open: boolean;
  setOpen: (o: boolean) => void;
}) {
  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent
        side="left"
        className="w-[280px] p-4 bg-background"
        aria-describedby={undefined}
      >
        <SheetTitle className="sr-only">Dashboard navigation</SheetTitle>
        <div
          onClick={() => setOpen(false)}
          className="contents"
        >
          <SidebarContent
            activeTab={activeTab}
            onTabChange={onTabChange}
            me={me}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}

// ============================================================================
// 1. Overview tab
// ============================================================================

function OverviewTab({
  me,
  onTabChange,
}: {
  me: (typeof freelancers)[number];
  onTabChange: (t: TabKey) => void;
}) {
  const { openWallet, setView, openFreelancer } = useApp();

  const kpiCards = [
    {
      label: "Available Balance",
      value: formatTND(kpis.availableBalance),
      sub: "Ready to withdraw",
      icon: Wallet,
      color: "#32504d",
      action: () => openWallet(),
    },
    {
      label: "Pending Clearance",
      value: formatTND(kpis.pendingClearance),
      sub: "In 7-day escrow",
      icon: Clock,
      color: "#475959",
    },
    {
      label: "Active Contracts",
      value: formatNumber(kpis.activeContracts),
      sub: "2 milestones due this week",
      icon: FileSignature,
      color: "#748684",
    },
    {
      label: "Completed Projects",
      value: formatNumber(kpis.completedProjects),
      sub: "+8 this quarter",
      icon: Award,
      color: "#192d2f",
    },
  ];

  return (
    <div className="space-y-6">
      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {kpiCards.map((k, i) => {
          const Icon = k.icon;
          return (
            <motion.div
              key={k.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.05 }}
            >
              <Card className="p-4 border-border/60 hover:border-[#32504d]/30 dark:border-[#32504d]/30 transition-colors h-full">
                <div className="flex items-start justify-between">
                  <span
                    className="size-9 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${k.color}15` }}
                  >
                    <Icon className="size-4" style={{ color: k.color }} />
                  </span>
                  {k.action ? (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-7 -mt-1 -mr-1"
                      onClick={k.action}
                    >
                      <ChevronRight className="size-3.5 text-muted-foreground" />
                    </Button>
                  ) : null}
                </div>
                <div className="mt-3 text-2xl font-bold text-foreground font-display">
                  {k.value}
                </div>
                <div className="text-xs text-muted-foreground mt-0.5">
                  {k.label}
                </div>
                <div className="text-[10px] text-muted-foreground/80 mt-1">
                  {k.sub}
                </div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Earnings chart + Activity feed */}
      <div className="grid lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2 p-5 border-border/60">
          <div className="flex items-start justify-between gap-3 mb-4">
            <div>
              <h3 className="font-display text-lg font-bold">Earnings</h3>
              <p className="text-xs text-muted-foreground">
                Last 6 months · {formatTND(kpis.monthlyEarningsTotal)} this
                month
              </p>
            </div>
            <Badge className="bg-emerald-500/10 text-emerald-700 border-emerald-200 gap-0.5">
              <TrendingUp className="size-3" />+{kpis.monthlyGrowth}%
            </Badge>
          </div>
          <div className="h-[260px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={earningsMonthly}
                margin={{ top: 8, right: 8, left: -8, bottom: 0 }}
              >
                <defs>
                  <linearGradient
                    id="earningsGrad"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop
                      offset="5%"
                      stopColor="#32504d"
                      stopOpacity={0.4}
                    />
                    <stop
                      offset="95%"
                      stopColor="#32504d"
                      stopOpacity={0}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#e3e8e6"
                  vertical={false}
                />
                <XAxis
                  dataKey="month"
                  stroke="#6e8580"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#6e8580"
                  fontSize={11}
                  tickFormatter={(v) => `${v / 1000}k`}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip content={<ChartTooltip />} />
                <Area
                  type="monotone"
                  dataKey="earnings"
                  name="Earnings"
                  stroke="#2b3d3d"
                  strokeWidth={2.5}
                  fill="url(#earningsGrad)"
                  dot={{ r: 3, fill: "#2b3d3d", strokeWidth: 0 }}
                  activeDot={{ r: 5, fill: "#2b3d3d", strokeWidth: 2, stroke: "#fff" }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="p-5 border-border/60">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-lg font-bold">Recent Activity</h3>
            <button className="text-[11px] text-[#32504d] dark:text-[#9bb3ae] hover:underline">
              View all
            </button>
          </div>
          <ul className="space-y-1 max-h-[260px] overflow-y-auto pr-1">
            {activityFeed.map((a, i) => {
              const Icon = ACTIVITY_ICONS[a.type];
              return (
                <motion.li
                  key={a.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-start gap-3 p-2 rounded-lg hover:bg-muted/50"
                >
                  <span
                    className="size-8 rounded-lg flex items-center justify-center shrink-0"
                    style={{
                      backgroundColor: `${ACTIVITY_COLORS[a.type]}15`,
                    }}
                  >
                    <Icon
                      className="size-3.5"
                      style={{ color: ACTIVITY_COLORS[a.type] }}
                    />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-foreground">
                      {a.title}
                    </p>
                    <p className="text-[11px] text-muted-foreground line-clamp-2">
                      {a.description}
                    </p>
                    <p className="text-[10px] text-muted-foreground/70 mt-0.5">
                      {a.time}
                    </p>
                  </div>
                </motion.li>
              );
            })}
          </ul>
        </Card>
      </div>

      {/* Quick actions */}
      <Card className="p-5 border-border/60">
        <SectionTitle
          title="Quick Actions"
          subtitle="Jump back into your workflow"
        />
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {quickActions.map((q, i) => {
            const Icon = QUICK_ACTION_ICONS[q.icon] ?? Sparkles;
            return (
              <motion.button
                key={q.key}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                whileHover={{ y: -2 }}
                onClick={() => {
                  if (q.target === "browse") {
                    setView("jobs");
                  } else {
                    onTabChange(q.target as TabKey);
                  }
                  toast.info(`${q.label} — coming up`);
                }}
                className="text-left rounded-xl border border-border/60 bg-card hover:border-[#32504d]/40 hover:bg-[#32504d]/5 dark:bg-[#32504d]/15 p-3 transition-colors"
              >
                <span className="size-9 rounded-lg bg-[#2b3d3d] flex items-center justify-center mb-2">
                  <Icon className="size-4 text-white" />
                </span>
                <p className="text-sm font-semibold text-foreground">
                  {q.label}
                </p>
                <p className="text-[11px] text-muted-foreground line-clamp-2">
                  {q.description}
                </p>
              </motion.button>
            );
          })}
        </div>
      </Card>

      {/* Profile completion + verification */}
      <div className="grid lg:grid-cols-2 gap-4">
        <Card className="p-5 border-border/60">
          <SectionTitle
            title="Profile Completion"
            subtitle={`${profileCompletion.total}% — keep going to rank higher in search`}
            action={
              <Button
                size="sm"
                variant="outline"
                className="h-8 text-xs"
                onClick={() => onTabChange("profile")}
              >
                <Pencil className="size-3" /> Edit
              </Button>
            }
          />
          <div className="space-y-3">
            <Progress
              value={profileCompletion.total}
              className="h-2 bg-muted [&>div]:bg-[#32504d]"
            />
            <ul className="grid sm:grid-cols-2 gap-x-4 gap-y-2">
              {profileCompletion.items.map((it) => (
                <li
                  key={it.label}
                  className="flex items-center gap-2 text-xs"
                >
                  <CheckCircle2
                    className={cn(
                      "size-3.5 shrink-0",
                      it.done
                        ? "text-emerald-600"
                        : "text-muted-foreground/40"
                    )}
                  />
                  <span
                    className={cn(
                      "truncate",
                      it.done
                        ? "text-foreground"
                        : "text-muted-foreground"
                    )}
                  >
                    {it.label}
                  </span>
                  <span className="ml-auto text-[10px] text-muted-foreground">
                    {it.value}%
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </Card>

        <Card className="p-5 border-border/60">
          <SectionTitle
            title="Verification Status"
            subtitle="Build trust, win more contracts"
          />
          <div className="space-y-3">
            <div className="flex flex-wrap gap-1.5">
              {me.verified.email && (
                <VerificationBadge type="email" size="md" />
              )}
              {me.verified.phone && (
                <VerificationBadge type="phone" size="md" />
              )}
              {me.verified.identity && (
                <VerificationBadge type="identity" size="md" />
              )}
              {me.verified.portfolio && (
                <VerificationBadge type="portfolio" size="md" />
              )}
              {me.topRated && (
                <VerificationBadge type="topRated" size="md" />
              )}
            </div>
            <Separator />
            <VerificationChecklist
              verified={me.verified}
              completed={me.completedProjects}
              reviews={me.reviewsCount}
              memberSince={me.memberSince}
            />
          </div>
        </Card>
      </div>

      {/* Your Achievements — compact row of unlocked/locked badges */}
      <Card className="p-5 border-border/60">
        <SectionTitle
          title="Your Achievements"
          subtitle="Badges earned through real activity on Khidma"
          action={
            <Button
              size="sm"
              variant="outline"
              className="h-8 text-xs"
              onClick={() => openFreelancer(me.id)}
            >
              View all
            </Button>
          }
        />
        <AchievementBadges
          freelancerId={me.id}
          variant="row"
          className="mb-3"
        />
        <p className="text-[11px] text-muted-foreground">
          Hover any badge to see its unlock criteria. Locked badges are
          grayscale — keep completing projects, collecting reviews, and
          responding fast to unlock more.
        </p>
      </Card>
    </div>
  );
}

// ============================================================================
// 2. My Profile tab
// ============================================================================

function ProfileTab({ me }: { me: (typeof freelancers)[number] }) {
  const { openFreelancer } = useApp();

  const sections = [
    {
      key: "personal",
      title: "Personal Information",
      icon: User,
      fields: [
        { label: "Full name", value: me.name },
        { label: "Username", value: me.username },
        { label: "Location", value: `${me.location.city}, ${me.location.country}` },
        { label: "Member since", value: me.memberSince },
      ],
    },
    {
      key: "professional",
      title: "Professional Information",
      icon: Briefcase,
      fields: [
        { label: "Title", value: me.title },
        { label: "Years of experience", value: "7+ years" },
        { label: "Response time", value: me.responseTime },
        { label: "Availability", value: me.availability },
      ],
    },
    {
      key: "languages",
      title: "Languages",
      icon: Globe,
      custom: (
        <div className="flex flex-wrap gap-1.5">
          {me.languages.map((l) => (
            <Badge
              key={l}
              variant="secondary"
              className="bg-[#32504d]/10 dark:bg-[#32504d]/20 text-[#32504d] dark:text-[#9bb3ae] border-[#32504d]/20 dark:border-[#32504d]/30"
            >
              {l} — Native / Fluent
            </Badge>
          ))}
        </div>
      ),
    },
    {
      key: "skills",
      title: "Skills",
      icon: Sparkles,
      custom: (
        <div className="flex flex-wrap gap-1.5">
          {me.skills.map((s) => (
            <Badge
              key={s}
              variant="outline"
              className="border-border/60 bg-card"
            >
              {s}
            </Badge>
          ))}
        </div>
      ),
    },
    {
      key: "rates",
      title: "Rates",
      icon: Banknote,
      fields: [
        { label: "Hourly rate", value: `${formatTND(me.hourlyRate)}/hr` },
        { label: "Starting price", value: formatTND(me.services[0]?.startingPrice ?? 0) },
        { label: "Project minimum", value: formatTND(350) },
        { label: "Currency", value: "TND" },
      ],
    },
    {
      key: "availability",
      title: "Availability",
      icon: Calendar,
      fields: [
        { label: "Status", value: me.availability },
        { label: "Weekly hours", value: "30-40 hrs" },
        { label: "Timezone", value: "Tunis (UTC+1)" },
        { label: "Next opening", value: "Aug 25, 2025" },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="overflow-hidden border-border/60 p-0">
        <div className="h-28 bg-khidma-gradient relative">
          <div className="absolute inset-0 bg-dot-grid opacity-30" />
        </div>
        <div className="p-5 sm:p-6 -mt-12 relative">
          <div className="flex flex-col sm:flex-row sm:items-end gap-4">
            <Avatar className="size-20 border-4 border-card shrink-0">
              <AvatarImage src={me.avatar} alt={me.name} />
              <AvatarFallback>{me.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="font-display text-2xl font-bold tracking-tight">
                  {me.name}
                </h2>
                {me.verified.identity && (
                  <VerificationBadge type="identity" size="md" />
                )}
                {me.verified.portfolio && (
                  <VerificationBadge type="portfolio" size="md" />
                )}
                {me.topRated && (
                  <VerificationBadge type="topRated" size="md" />
                )}
              </div>
              <p className="text-sm text-muted-foreground mt-1">{me.title}</p>
              <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                <span className="flex items-center gap-1">
                  <MapPin className="size-3" /> {me.location.city},{" "}
                  {me.location.country}
                </span>
                <span className="flex items-center gap-1">
                  <Star className="size-3 fill-amber-400 text-amber-400" />
                  {me.rating.toFixed(1)} ({formatNumber(me.reviewsCount)})
                </span>
                <span className="hidden sm:flex items-center gap-1">
                  <Globe className="size-3" /> {me.languages.join(", ")}
                </span>
              </div>
            </div>
            <Button
              className="bg-[#2b3d3d] hover:bg-[#192d2f] text-white"
              onClick={() => openFreelancer("f1")}
            >
              <ExternalLink className="size-4" /> Preview Public Profile
            </Button>
          </div>
        </div>
      </Card>

      {/* Bio */}
      <Card className="p-5 border-border/60">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-display text-lg font-bold">About</h3>
          <Button
            variant="outline"
            size="sm"
            className="h-8 text-xs"
            onClick={() => toast.info("Edit mode — coming up")}
          >
            <Pencil className="size-3" /> Edit
          </Button>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {me.bio}
        </p>
      </Card>

      {/* Sections grid */}
      <div className="grid sm:grid-cols-2 gap-4">
        {sections.map((s) => {
          const Icon = s.icon;
          return (
            <Card key={s.key} className="p-5 border-border/60">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="size-8 rounded-lg bg-[#32504d]/10 dark:bg-[#32504d]/20 flex items-center justify-center">
                    <Icon className="size-4 text-[#32504d] dark:text-[#9bb3ae]" />
                  </span>
                  <h3 className="font-display text-base font-semibold">
                    {s.title}
                  </h3>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 text-xs"
                  onClick={() => toast.info(`Editing ${s.title} — coming up`)}
                >
                  <Pencil className="size-3" /> Edit
                </Button>
              </div>
              {s.custom ? (
                <div className="mt-1">{s.custom}</div>
              ) : (
                <dl className="grid grid-cols-2 gap-x-4 gap-y-3">
                  {s.fields?.map((f) => (
                    <div key={f.label}>
                      <dt className="text-[10px] uppercase tracking-wider text-muted-foreground">
                        {f.label}
                      </dt>
                      <dd className="text-sm font-medium text-foreground capitalize">
                        {f.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
}

// ============================================================================
// 3. Portfolio tab
// ============================================================================

function PortfolioTab({ me }: { me: (typeof freelancers)[number] }) {
  const items: PortfolioItem[] = me.portfolio;

  if (items.length === 0) {
    return (
      <Card className="p-10 border-dashed border-border/60 text-center">
        <div className="size-14 rounded-xl bg-muted mx-auto flex items-center justify-center mb-3">
          <Briefcase className="size-6 text-muted-foreground" />
        </div>
        <h3 className="font-display text-lg font-semibold mb-1">
          No portfolio items yet
        </h3>
        <p className="text-sm text-muted-foreground mb-4 max-w-md mx-auto">
          Showcase your best work to win more clients. Add your first portfolio
          item to get verified and rank higher.
        </p>
        <Button className="bg-[#2b3d3d] hover:bg-[#192d2f] text-white">
          <Plus className="size-4" /> Add your first portfolio item
        </Button>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <SectionTitle
        title="Portfolio"
        subtitle={`${items.length} items · ${items.filter((p) => p.verification === "ADMIN_VERIFIED").length} admin-verified`}
        action={
          <Button
            className="bg-[#2b3d3d] hover:bg-[#192d2f] text-white"
            onClick={() => toast.success("Opening portfolio editor — demo")}
          >
            <Plus className="size-4" /> Add Portfolio Item
          </Button>
        }
      />
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map((p, i) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.05 }}
          >
            <Card className="khidma-card overflow-hidden border-border/60 p-0 group">
              <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                <Image
                  src={p.cover}
                  alt={p.title}
                  fill
                  sizes="(max-width: 640px) 100vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-2 left-2 flex gap-1">
                  <Badge className="bg-black/60 text-white border-0 backdrop-blur-sm text-[10px]">
                    {p.type.toUpperCase()}
                  </Badge>
                </div>
                <div className="absolute top-2 right-2 flex gap-1">
                  {p.verification === "ADMIN_VERIFIED" && (
                    <Badge className="bg-[#32504d] text-white border-0 text-[10px] gap-0.5">
                      <ShieldCheck className="size-2.5" /> Verified
                    </Badge>
                  )}
                  {p.verification === "EXTERNALLY_VERIFIED" && (
                    <Badge className="bg-[#475959] text-white border-0 text-[10px] gap-0.5">
                      <ExternalLink className="size-2.5" /> External
                    </Badge>
                  )}
                  {p.verification === "SELF_DECLARED" && (
                    <Badge className="bg-amber-500/90 text-white border-0 text-[10px]">
                      Self-declared
                    </Badge>
                  )}
                </div>
              </div>
              <div className="p-4 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-semibold text-sm leading-tight line-clamp-2">
                    {p.title}
                  </h3>
                </div>
                <p className="text-[11px] text-muted-foreground">
                  {p.category} · {p.role}
                </p>
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {p.description}
                </p>
                <div className="flex flex-wrap gap-1">
                  {p.skills.slice(0, 3).map((s) => (
                    <Badge
                      key={s}
                      variant="secondary"
                      className="text-[10px] h-5"
                    >
                      {s}
                    </Badge>
                  ))}
                </div>
                {p.results && (
                  <div className="rounded-md bg-emerald-500/10 px-2 py-1.5 text-[11px] text-emerald-700">
                    📈 {p.results}
                  </div>
                )}
                <div className="flex items-center justify-between pt-2 border-t border-border/60">
                  <Badge
                    variant="outline"
                    className="text-[10px] h-5 border-border/60"
                  >
                    <Eye className="size-2.5 mr-1" /> {p.visibility}
                  </Badge>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-7"
                      onClick={() => toast.info("Edit — demo")}
                    >
                      <Pencil className="size-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-7 text-rose-600 hover:text-rose-700"
                      onClick={() => toast.error("Delete blocked in demo")}
                    >
                      <Trash2 className="size-3.5" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// 4. Services tab
// ============================================================================

function ServicesTab({ me }: { me: (typeof freelancers)[number] }) {
  const services = me.services;

  return (
    <div className="space-y-4">
      <SectionTitle
        title="Your Services"
        subtitle={`${services.length} services · ${services.reduce(
          (acc, s) => acc + s.ordersCount,
          0
        )} total orders`}
        action={
          <Button
            className="bg-[#2b3d3d] hover:bg-[#192d2f] text-white"
            onClick={() => toast.success("Service editor — demo")}
          >
            <Plus className="size-4" /> Create Service
          </Button>
        }
      />
      <div className="grid sm:grid-cols-2 gap-4">
        {services.map((s, i) => (
          <motion.div
            key={s.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
          >
            <Card className="khidma-card border-border/60 p-0 overflow-hidden">
              <div className="flex">
                <div className="relative w-32 shrink-0 bg-muted">
                  <Image
                    src={s.cover}
                    alt={s.title}
                    fill
                    sizes="128px"
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 p-4 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-semibold text-sm leading-tight line-clamp-2">
                      {s.title}
                    </h3>
                    <Badge className="bg-emerald-500/10 text-emerald-700 border-emerald-200 text-[10px] h-5 shrink-0">
                      PUBLISHED
                    </Badge>
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-1 line-clamp-2">
                    {s.description}
                  </p>
                  <div className="flex items-center gap-3 mt-3 text-[11px] text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Star className="size-3 fill-amber-400 text-amber-400" />
                      {s.rating.toFixed(1)}
                    </span>
                    <span className="flex items-center gap-1">
                      <FileText className="size-3" />
                      {s.ordersCount} orders
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="size-3" />
                      {s.deliveryDays}d delivery
                    </span>
                  </div>
                  <div className="flex items-center justify-between pt-3 mt-2 border-t border-border/60">
                    <div>
                      <div className="text-[10px] text-muted-foreground uppercase tracking-wider">
                        Starting at
                      </div>
                      <div className="text-sm font-bold text-foreground">
                        {formatTND(s.startingPrice)}
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-7"
                        onClick={() => toast.info("Edit service — demo")}
                      >
                        <Pencil className="size-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-7"
                        onClick={() => toast.info("Service paused — demo")}
                      >
                        <Pause className="size-3.5" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-7 text-rose-600 hover:text-rose-700"
                        onClick={() => toast.error("Delete blocked in demo")}
                      >
                        <Trash2 className="size-3.5" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// 5. Proposals tab
// ============================================================================

type ProposalFilter = "all" | "active" | "awarded" | "declined";

function ProposalsTab() {
  const [filter, setFilter] = useState<ProposalFilter>("all");

  const filtered = useMemo(() => {
    if (filter === "all") return proposals;
    if (filter === "active")
      return proposals.filter((p) =>
        ["PENDING", "VIEWED", "SHORTLISTED"].includes(p.status)
      );
    if (filter === "awarded") return proposals.filter((p) => p.status === "HIRED");
    if (filter === "declined")
      return proposals.filter((p) => p.status === "DECLINED");
    return proposals;
  }, [filter]);

  const filters: { key: ProposalFilter; label: string; count: number }[] = [
    { key: "all", label: "All", count: proposals.length },
    {
      key: "active",
      label: "Active",
      count: proposals.filter((p) =>
        ["PENDING", "VIEWED", "SHORTLISTED"].includes(p.status)
      ).length,
    },
    {
      key: "awarded",
      label: "Awarded",
      count: proposals.filter((p) => p.status === "HIRED").length,
    },
    {
      key: "declined",
      label: "Declined",
      count: proposals.filter((p) => p.status === "DECLINED").length,
    },
  ];

  return (
    <div className="space-y-4">
      <SectionTitle
        title="Proposals & Applications"
        subtitle={`${proposals.length} proposals submitted · ${proposals.filter((p) => p.status === "HIRED").length} awarded`}
      />
      {/* Filter tabs */}
      <div className="flex flex-wrap gap-1.5">
        {filters.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={cn(
              "rounded-lg px-3 py-1.5 text-xs font-medium border transition-colors",
              filter === f.key
                ? "bg-[#2b3d3d] text-white border-[#2b3d3d]"
                : "bg-card text-muted-foreground border-border/60 hover:text-foreground hover:border-[#32504d]/30 dark:border-[#32504d]/30"
            )}
          >
            {f.label}
            <span
              className={cn(
                "ml-1.5 inline-flex items-center justify-center min-w-4 h-4 rounded-full px-1 text-[9px]",
                filter === f.key
                  ? "bg-white/20 text-white"
                  : "bg-muted text-muted-foreground"
              )}
            >
              {f.count}
            </span>
          </button>
        ))}
      </div>

      {/* List */}
      <Card className="border-border/60 p-0 overflow-hidden">
        <ul className="divide-y divide-border/60">
          {filtered.map((p, i) => {
            const style = proposalStatusStyles[p.status];
            return (
              <motion.li
                key={p.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
                className="p-4 hover:bg-muted/30 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <Avatar className="size-10 border border-border/60 shrink-0">
                    <AvatarImage src={p.clientAvatar} alt={p.client} />
                    <AvatarFallback>{p.client.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-sm font-semibold text-foreground line-clamp-1">
                        {p.jobTitle}
                      </h3>
                      <Badge
                        variant="outline"
                        className={cn("text-[10px] h-5", style.className)}
                      >
                        {style.label}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {p.client} · submitted {p.submitted}
                    </p>
                    <p className="text-xs text-muted-foreground/80 mt-1 line-clamp-2">
                      “{p.coverLetter}”
                    </p>
                  </div>
                  <div className="text-right shrink-0 sm:w-24">
                    <div className="text-sm font-bold text-foreground">
                      {formatTND(p.bid)}
                      {p.isHourly ? (
                        <span className="text-[10px] font-normal text-muted-foreground">
                          /hr
                        </span>
                      ) : null}
                    </div>
                    <div className="text-[10px] text-muted-foreground uppercase tracking-wider">
                      Bid
                    </div>
                  </div>
                </div>
              </motion.li>
            );
          })}
          {filtered.length === 0 && (
            <li className="p-8 text-center text-sm text-muted-foreground">
              No proposals in this filter yet.
            </li>
          )}
        </ul>
      </Card>
    </div>
  );
}

// ============================================================================
// 6. Contracts tab
// ============================================================================

function ContractsTab() {
  const [expanded, setExpanded] = useState<string | null>(contracts[0]?.id ?? null);

  return (
    <div className="space-y-4">
      <SectionTitle
        title="Contracts"
        subtitle={`${contracts.length} contracts · ${contracts.filter((c) => c.status === "IN_PROGRESS" || c.status === "FUNDED").length} active`}
      />
      <div className="space-y-3">
        {contracts.map((c, i) => {
          const style = contractStatusStyles[c.status];
          const isOpen = expanded === c.id;
          const progressPct = c.milestonesTotal
            ? (c.milestonesDone / c.milestonesTotal) * 100
            : 0;
          return (
            <motion.div
              key={c.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
            >
              <Card className="border-border/60 p-0 overflow-hidden">
                <button
                  onClick={() => setExpanded(isOpen ? null : c.id)}
                  className="w-full text-left p-4 hover:bg-muted/30 transition-colors"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    <Avatar className="size-10 border border-border/60 shrink-0">
                      <AvatarImage src={c.clientAvatar} alt={c.client} />
                      <AvatarFallback>{c.client.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-sm font-semibold text-foreground line-clamp-1">
                          {c.title}
                        </h3>
                        <Badge
                          variant="outline"
                          className={cn("text-[10px] h-5", style.className)}
                        >
                          {style.label}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {c.client} · started {c.startedAt}
                      </p>
                      <div className="flex items-center gap-3 mt-2 text-[11px] text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <FileSignature className="size-3" />
                          {c.milestonesDone}/{c.milestonesTotal} milestones
                        </span>
                        {c.nextDue !== "—" && (
                          <span className="flex items-center gap-1 text-amber-700">
                            <Calendar className="size-3" />
                            Next: {c.nextDue}
                          </span>
                        )}
                      </div>
                      <Progress
                        value={progressPct}
                        className="h-1.5 mt-2 bg-muted [&>div]:bg-[#32504d]"
                      />
                    </div>
                    <div className="text-right shrink-0 sm:w-28">
                      <div className="text-sm font-bold text-foreground">
                        {formatTND(c.totalValue)}
                      </div>
                      <div className="text-[10px] text-muted-foreground uppercase tracking-wider">
                        Total value
                      </div>
                    </div>
                    <ChevronDown
                      className={cn(
                        "size-4 text-muted-foreground transition-transform shrink-0",
                        isOpen && "rotate-180"
                      )}
                    />
                  </div>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden border-t border-border/60 bg-muted/30"
                    >
                      <div className="p-4 space-y-2">
                        <p className="text-xs font-semibold text-foreground mb-2">
                          Milestones
                        </p>
                        {c.milestones.map((m, idx) => {
                          const mStyle = milestoneStatusStyles[m.status];
                          return (
                            <div
                              key={idx}
                              className="flex items-center gap-3 rounded-lg border border-border/60 bg-card p-3"
                            >
                              <div className="flex items-center justify-center size-7 rounded-full bg-[#32504d]/10 dark:bg-[#32504d]/20 text-xs font-bold text-[#32504d] dark:text-[#9bb3ae] shrink-0">
                                {idx + 1}
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-foreground truncate">
                                  {m.title}
                                </p>
                                <p className="text-[11px] text-muted-foreground">
                                  Due {m.due}
                                </p>
                              </div>
                              <div className="text-right shrink-0">
                                <div className="text-sm font-semibold text-foreground">
                                  {formatTND(m.amount)}
                                </div>
                                <Badge
                                  variant="outline"
                                  className={cn(
                                    "text-[9px] h-4 mt-0.5",
                                    mStyle.className
                                  )}
                                >
                                  {mStyle.label}
                                </Badge>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

// ============================================================================
// 7. Wallet & Earnings tab
// ============================================================================

function WalletTab() {
  const { openWallet } = useApp();

  return (
    <div className="space-y-6">
      <SectionTitle
        title="Wallet & Earnings"
        subtitle="Track every dinar. Withdraw any time."
        action={
          <Button
            className="bg-[#2b3d3d] hover:bg-[#192d2f] text-white"
            onClick={openWallet}
          >
            <Banknote className="size-4" /> Request Withdrawal
          </Button>
        }
      />

      {/* Balance cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {walletBalances.map((b, i) => {
          const IconMap: Record<string, LucideIcon> = {
            available: CheckCircle2,
            pending: Clock,
            processing: TrendingUp,
            withdrawn: PiggyBank,
          };
          const Icon = IconMap[b.key];
          return (
            <motion.div
              key={b.key}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card className="p-4 border-border/60 h-full">
                <div className="flex items-center gap-2">
                  <span
                    className="size-9 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${b.color}15` }}
                  >
                    <Icon className="size-4" style={{ color: b.color }} />
                  </span>
                  <span className="text-xs font-semibold">{b.label}</span>
                </div>
                <div className="mt-3 text-2xl font-bold font-display text-foreground">
                  {formatTND(b.value)}
                </div>
                <div className="text-[10px] text-muted-foreground">{b.sub}</div>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Earnings chart */}
      <Card className="p-5 border-border/60">
        <div className="flex items-start justify-between gap-3 mb-4">
          <div>
            <h3 className="font-display text-lg font-bold">Earnings vs Withdrawals</h3>
            <p className="text-xs text-muted-foreground">Last 6 months</p>
          </div>
          <Badge className="bg-emerald-500/10 text-emerald-700 border-emerald-200 gap-0.5">
            <TrendingUp className="size-3" />+{kpis.monthlyGrowth}%
          </Badge>
        </div>
        <div className="h-[280px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={earningsMonthly}
              margin={{ top: 8, right: 8, left: -8, bottom: 0 }}
              barGap={4}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#e3e8e6"
                vertical={false}
              />
              <XAxis
                dataKey="month"
                stroke="#6e8580"
                fontSize={11}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#6e8580"
                fontSize={11}
                tickFormatter={(v) => `${v / 1000}k`}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                cursor={{ fill: "#32504d10" }}
                content={<ChartTooltip />}
              />
              <Bar
                dataKey="earnings"
                name="Earnings"
                fill="#2b3d3d"
                radius={[4, 4, 0, 0]}
                maxBarSize={28}
              />
              <Bar
                dataKey="withdrawals"
                name="Withdrawals"
                fill="#748684"
                radius={[4, 4, 0, 0]}
                maxBarSize={28}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Transactions table */}
      <Card className="border-border/60 p-0 overflow-hidden">
        <div className="p-5 pb-3 flex items-center justify-between">
          <h3 className="font-display text-lg font-bold">Recent Transactions</h3>
          <Badge variant="outline" className="text-[10px]">
            Last 30 days
          </Badge>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="text-[11px] uppercase tracking-wider">
                  Date
                </TableHead>
                <TableHead className="text-[11px] uppercase tracking-wider">
                  Description
                </TableHead>
                <TableHead className="text-[11px] uppercase tracking-wider hidden sm:table-cell">
                  Project
                </TableHead>
                <TableHead className="text-[11px] uppercase tracking-wider text-right">
                  Amount
                </TableHead>
                <TableHead className="text-[11px] uppercase tracking-wider hidden md:table-cell">
                  Status
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {walletTransactions.map((t) => {
                const isCredit = t.type === "credit";
                return (
                  <TableRow key={t.id} className="text-xs">
                    <TableCell className="whitespace-nowrap text-muted-foreground">
                      {t.date}
                    </TableCell>
                    <TableCell className="font-medium text-foreground">
                      <div className="flex items-center gap-2">
                        <span
                          className={cn(
                            "size-6 rounded-full flex items-center justify-center shrink-0",
                            isCredit
                              ? "bg-emerald-500/10 text-emerald-700"
                              : "bg-rose-500/10 text-rose-700"
                          )}
                        >
                          {isCredit ? (
                            <ArrowDownLeft className="size-3" />
                          ) : (
                            <ArrowUpRight className="size-3" />
                          )}
                        </span>
                        <span className="truncate max-w-[200px]">{t.desc}</span>
                      </div>
                    </TableCell>
                    <TableCell className="hidden sm:table-cell text-muted-foreground">
                      {t.project}
                    </TableCell>
                    <TableCell
                      className={cn(
                        "text-right font-semibold whitespace-nowrap",
                        isCredit ? "text-emerald-700" : "text-rose-700"
                      )}
                    >
                      {isCredit ? "+" : "−"}
                      {formatTND(t.amount)}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <Badge
                        variant="outline"
                        className={cn(
                          "text-[9px] h-5",
                          txnStatusStyles[t.status]
                        )}
                      >
                        {t.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </Card>

      {/* Withdrawal methods */}
      <Card className="p-5 border-border/60">
        <SectionTitle
          title="Withdrawal Methods"
          subtitle="Pick your preferred way to receive your earnings"
        />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {withdrawalMethods.map((m) => (
            <div
              key={m.id}
              className="rounded-xl border border-border/60 p-3 hover:border-[#32504d]/40 hover:bg-[#32504d]/5 dark:bg-[#32504d]/15 transition-colors"
            >
              <div className="flex items-start gap-2.5">
                <span className="size-9 rounded-lg bg-muted flex items-center justify-center text-lg shrink-0">
                  {m.logo}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold truncate">{m.name}</p>
                  <p className="text-[10px] text-muted-foreground">
                    {m.type} · {m.fee} fee
                  </p>
                  <div className="flex items-center gap-1 mt-1 text-[10px] text-[#32504d] dark:text-[#9bb3ae]">
                    <Clock className="size-2.5" />
                    {m.time}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 rounded-xl border border-[#32504d]/20 dark:border-[#32504d]/30 bg-[#32504d]/5 dark:bg-[#32504d]/15 p-3 flex gap-2.5">
          <ShieldCheck className="size-4 text-[#32504d] dark:text-[#9bb3ae] shrink-0 mt-0.5" />
          <p className="text-xs text-muted-foreground leading-relaxed">
            Khidma uses secure escrow for all transactions. Withdrawals are
            processed within 1-3 business days depending on the method chosen.
          </p>
        </div>
      </Card>
    </div>
  );
}

// ============================================================================
// 8. Reviews tab
// ============================================================================

function ReviewsTab() {
  // Show all reviews from data plus Amira-specific
  const amiraReviews = reviews.slice(0, 4);

  return (
    <div className="space-y-6">
      {/* Summary */}
      <Card className="p-5 sm:p-6 border-border/60">
        <div className="grid sm:grid-cols-2 gap-6 items-center">
          {/* Big number */}
          <div className="text-center sm:text-left">
            <div className="flex items-end gap-2 justify-center sm:justify-start">
              <span className="font-display text-6xl font-bold text-foreground">
                {ratingMetrics.overall.toFixed(1)}
              </span>
              <span className="text-muted-foreground mb-2">/ 5</span>
            </div>
            <div className="flex items-center gap-1 mt-2 justify-center sm:justify-start">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={cn(
                    "size-5",
                    i < Math.round(ratingMetrics.overall)
                      ? "fill-amber-400 text-amber-400"
                      : "text-muted-foreground/30"
                  )}
                />
              ))}
              <span className="ml-2 text-sm text-muted-foreground">
                {ratingMetrics.reviewsCount} reviews
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-3 max-w-sm">
              Based on client feedback collected after every completed contract.
            </p>
          </div>

          {/* Metrics breakdown */}
          <div className="space-y-3">
            {ratingMetrics.metrics.map((m) => {
              const pct = (m.value / m.max) * 100;
              return (
                <div key={m.key}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-medium text-foreground">
                      {m.label}
                    </span>
                    <span className="text-xs font-semibold text-foreground">
                      {m.value.toFixed(2)}
                    </span>
                  </div>
                  <Progress
                    value={pct}
                    className="h-2 bg-muted [&>div]:bg-gradient-to-r [&>div]:from-[#748684] [&>div]:to-[#2b3d3d]"
                  />
                </div>
              );
            })}
          </div>
        </div>
      </Card>

      {/* Reviews list */}
      <SectionTitle title="Client Reviews" subtitle={`${amiraReviews.length} most recent`} />
      <div className="space-y-4">
        {amiraReviews.map((r, i) => (
          <motion.div
            key={r.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04 }}
          >
            <Card className="p-5 border-border/60">
              <div className="flex items-start gap-3">
                <Avatar className="size-10 border border-border/60 shrink-0">
                  <AvatarImage src={r.fromAvatar} alt={r.fromName} />
                  <AvatarFallback>{r.fromName.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        {r.fromName}
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        {r.project} · {r.date}
                      </p>
                    </div>
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: 5 }).map((_, idx) => (
                        <Star
                          key={idx}
                          className={cn(
                            "size-3.5",
                            idx < r.rating
                              ? "fill-amber-400 text-amber-400"
                              : "text-muted-foreground/30"
                          )}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-foreground mt-2 leading-relaxed">
                    “{r.comment}”
                  </p>
                  {/* Metrics mini */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3 pt-3 border-t border-border/60">
                    {[
                      { label: "Communication", value: r.metrics.communication },
                      { label: "Quality", value: r.metrics.quality },
                      { label: "Delivery", value: r.metrics.delivery },
                      { label: "Professionalism", value: r.metrics.professionalism },
                    ].map((m) => (
                      <div key={m.label}>
                        <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                          {m.label}
                        </div>
                        <div className="text-sm font-semibold text-foreground">
                          {m.value.toFixed(1)}
                          <span className="text-[10px] font-normal text-muted-foreground">
                            /5
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// ============================================================================
// 9. Settings tab
// ============================================================================

function SettingsTab({ me }: { me: (typeof freelancers)[number] }) {
  const [notifState, setNotifState] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(notificationDefaults.map((n) => [n.key, n.enabled]))
  );

  return (
    <div className="space-y-4">
      <SectionTitle
        title="Settings"
        subtitle="Manage your account, security, and preferences"
      />

      {/* Account info */}
      <Card className="p-5 border-border/60">
        <div className="flex items-center gap-2 mb-4">
          <span className="size-8 rounded-lg bg-[#32504d]/10 dark:bg-[#32504d]/20 flex items-center justify-center">
            <User className="size-4 text-[#32504d] dark:text-[#9bb3ae]" />
          </span>
          <h3 className="font-display text-base font-semibold">Account Information</h3>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <Label htmlFor="acc-name" className="text-[11px] uppercase tracking-wider">
              Full name
            </Label>
            <Input id="acc-name" defaultValue={me.name} />
          </div>
          <div className="space-y-1">
            <Label htmlFor="acc-username" className="text-[11px] uppercase tracking-wider">
              Username
            </Label>
            <Input id="acc-username" defaultValue={me.username} />
          </div>
          <div className="space-y-1">
            <Label htmlFor="acc-email" className="text-[11px] uppercase tracking-wider">
              Email
            </Label>
            <Input id="acc-email" type="email" defaultValue="amira.bensalah@example.com" />
          </div>
          <div className="space-y-1">
            <Label htmlFor="acc-phone" className="text-[11px] uppercase tracking-wider">
              Phone
            </Label>
            <Input id="acc-phone" defaultValue="+216 22 123 456" />
          </div>
        </div>
        <div className="flex justify-end mt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => toast.success("Account info saved (demo)")}
          >
            Save changes
          </Button>
        </div>
      </Card>

      {/* Security */}
      <Card className="p-5 border-border/60">
        <div className="flex items-center gap-2 mb-4">
          <span className="size-8 rounded-lg bg-[#32504d]/10 dark:bg-[#32504d]/20 flex items-center justify-center">
            <Lock className="size-4 text-[#32504d] dark:text-[#9bb3ae]" />
          </span>
          <h3 className="font-display text-base font-semibold">Security</h3>
        </div>
        <ul className="space-y-3">
          <li className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-medium">Password</p>
              <p className="text-[11px] text-muted-foreground">
                Last changed 3 months ago
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => toast.info("Password reset link sent (demo)")}
            >
              Change
            </Button>
          </li>
          <Separator />
          <li className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-medium">Two-factor authentication</p>
              <p className="text-[11px] text-muted-foreground">
                Add an extra layer of security
              </p>
            </div>
            <Switch onCheckedChange={() => toast.info("2FA setup — demo")} />
          </li>
          <Separator />
          <li className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-medium">Active sessions</p>
              <p className="text-[11px] text-muted-foreground">
                2 devices · Tunis, Sfax
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => toast.info("Showing active sessions — demo")}
            >
              View
            </Button>
          </li>
        </ul>
      </Card>

      {/* Notifications */}
      <Card className="p-5 border-border/60">
        <div className="flex items-center gap-2 mb-4">
          <span className="size-8 rounded-lg bg-[#32504d]/10 dark:bg-[#32504d]/20 flex items-center justify-center">
            <BellRing className="size-4 text-[#32504d] dark:text-[#9bb3ae]" />
          </span>
          <h3 className="font-display text-base font-semibold">Notifications</h3>
        </div>
        <ul className="space-y-3">
          {notificationDefaults.map((n) => (
            <li key={n.key}>
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-medium">{n.title}</p>
                  <p className="text-[11px] text-muted-foreground">{n.description}</p>
                </div>
                <Switch
                  checked={notifState[n.key]}
                  onCheckedChange={(checked) => {
                    setNotifState((p) => ({ ...p, [n.key]: checked }));
                    toast.success(
                      `${n.title} ${checked ? "enabled" : "disabled"} (demo)`
                    );
                  }}
                />
              </div>
              <Separator className="mt-3 last:hidden" />
            </li>
          ))}
        </ul>
      </Card>

      {/* Privacy */}
      <Card className="p-5 border-border/60">
        <div className="flex items-center gap-2 mb-4">
          <span className="size-8 rounded-lg bg-[#32504d]/10 dark:bg-[#32504d]/20 flex items-center justify-center">
            <EyeOff className="size-4 text-[#32504d] dark:text-[#9bb3ae]" />
          </span>
          <h3 className="font-display text-base font-semibold">Privacy</h3>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-medium">Profile visibility</p>
              <p className="text-[11px] text-muted-foreground">
                Who can see your public profile
              </p>
            </div>
            <Select defaultValue="everyone">
              <SelectTrigger className="w-32 h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="everyone">Everyone</SelectItem>
                <SelectItem value="clients">Clients only</SelectItem>
                <SelectItem value="verified">Verified clients</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Separator />
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-medium">Show earnings publicly</p>
              <p className="text-[11px] text-muted-foreground">
                Display total earnings on your profile
              </p>
            </div>
            <Switch defaultChecked={false} />
          </div>
          <Separator />
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-medium">Search engine indexing</p>
              <p className="text-[11px] text-muted-foreground">
                Allow Google to index your profile
              </p>
            </div>
            <Switch defaultChecked />
          </div>
        </div>
      </Card>

      {/* Payment methods */}
      <Card className="p-5 border-border/60">
        <div className="flex items-center gap-2 mb-4">
          <span className="size-8 rounded-lg bg-[#32504d]/10 dark:bg-[#32504d]/20 flex items-center justify-center">
            <CreditCard className="size-4 text-[#32504d] dark:text-[#9bb3ae]" />
          </span>
          <h3 className="font-display text-base font-semibold">Payment Methods</h3>
        </div>
        <ul className="space-y-2">
          {withdrawalMethods.slice(0, 3).map((m) => (
            <li
              key={m.id}
              className="flex items-center justify-between rounded-lg border border-border/60 p-3"
            >
              <div className="flex items-center gap-2.5">
                <span className="size-8 rounded-lg bg-muted flex items-center justify-center text-base">
                  {m.logo}
                </span>
                <div>
                  <p className="text-sm font-medium">{m.name}</p>
                  <p className="text-[11px] text-muted-foreground">
                    {m.type} · {m.time}
                  </p>
                </div>
              </div>
              <Badge
                variant="outline"
                className="bg-emerald-500/10 text-emerald-700 border-emerald-200 text-[10px]"
              >
                Active
              </Badge>
            </li>
          ))}
        </ul>
        <Button
          variant="outline"
          size="sm"
          className="w-full mt-3"
          onClick={() => toast.info("Add new payment method — demo")}
        >
          <Plus className="size-3.5" /> Add new method
        </Button>
      </Card>

      {/* Danger zone */}
      <Card className="p-5 border-rose-200 bg-rose-50/40 dark:bg-rose-500/5 dark:border-rose-500/20">
        <div className="flex items-center gap-2 mb-4">
          <span className="size-8 rounded-lg bg-rose-500/10 flex items-center justify-center">
            <LogOut className="size-4 text-rose-600" />
          </span>
          <h3 className="font-display text-base font-semibold text-rose-700">
            Close Account
          </h3>
        </div>
        <p className="text-sm text-muted-foreground mb-4">
          Closing your account will permanently delete your profile, portfolio,
          services, and reviews. Pending withdrawals will be processed first.
          This action cannot be undone.
        </p>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => toast.info("Account deactivation flow — demo")}
          >
            Deactivate temporarily
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="text-rose-700 border-rose-200 hover:bg-rose-500/10"
            onClick={() =>
              toast.error("Account closure requires confirmation — blocked in demo")
            }
          >
            Close account permanently
          </Button>
        </div>
      </Card>
    </div>
  );
}

// ============================================================================
// Main view
// ============================================================================

const TAB_RENDERERS: Record<
  TabKey,
  ComponentType<{ me: (typeof freelancers)[number]; onTabChange: (t: TabKey) => void }>
> = {
  overview: OverviewTab,
  profile: ProfileTab,
  portfolio: PortfolioTab,
  services: ServicesTab,
  proposals: (props: any) => <ProposalsTab {...props} />,
  contracts: (props: any) => <ContractsTab {...props} />,
  wallet: (props: any) => <WalletTab {...props} />,
  reviews: (props: any) => <ReviewsTab {...props} />,
  settings: SettingsTab,
};

export function DashboardView() {
  const me = freelancers[0]; // Amira Ben Salah
  const [tab, setTab] = useState<TabKey>("overview");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const Renderer = TAB_RENDERERS[tab];
  const currentNav = NAV_ITEMS.find((n) => n.key === tab);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <TopBar me={me} />

      {/* Mobile nav trigger */}
      <div className="lg:hidden sticky top-16 z-20 bg-background/85 backdrop-blur-md border-b border-border/60">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-12 flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="gap-1 -ml-2"
            onClick={() => setMobileNavOpen(true)}
          >
            <Menu className="size-4" /> Menu
          </Button>
          <Separator orientation="vertical" className="h-5" />
          <div className="flex items-center gap-1.5">
            {currentNav && (
              <>
                <currentNav.icon className="size-3.5 text-[#32504d] dark:text-[#9bb3ae]" />
                <span className="text-sm font-medium">{currentNav.label}</span>
              </>
            )}
          </div>
        </div>
      </div>
      {/* Mobile sidebar (always rendered so it can open) */}
      <MobileSidebar
        activeTab={tab}
        onTabChange={(t) => {
          setTab(t);
          setMobileNavOpen(false);
        }}
        me={me}
        open={mobileNavOpen}
        setOpen={setMobileNavOpen}
      />

      <div className="mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-8 flex gap-6 flex-1">
        <DesktopSidebar activeTab={tab} onTabChange={setTab} me={me} />
        <main className="flex-1 min-w-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={tab}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
            >
              <Renderer me={me} onTabChange={setTab} />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

export default DashboardView;
