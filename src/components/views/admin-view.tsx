"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  Briefcase,
  CheckCircle2,
  ClipboardList,
  Clock,
  Copy,
  ExternalLink,
  Eye,
  FileText,
  Flag,
  Globe,
  GraduationCap,
  HelpCircle,
  History,
  Info,
  Keyboard,
  Languages as LanguagesIcon,
  LayoutGrid,
  Lightbulb,
  ListChecks,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Pin as PinIcon,
  Plus,
  RefreshCw,
  Search,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  StickyNote,
  User,
  UserCheck,
  UserX,
  X,
  XCircle,
} from "lucide-react";

import { useApp } from "@/lib/store";
import {
  adminApplications,
  adminKPIs,
  adminReviewers,
  checklistCount,
  decisionConfig,
  formatDateTime,
  formatDate,
  riskConfig,
  signalConfig,
  statusConfig,
  timeAgo,
  verificationLabel,
  visibilityLabel,
  type AdminApplication,
  type AdminNote,
  type PortfolioReviewState,
  type ReviewChecklistItem,
} from "@/lib/admin-mock";
import { KhidmaLogo } from "@/components/khidma/logo";
import { VerificationBadge } from "@/components/khidma/verification";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// ============================================================================
// Helpers
// ============================================================================

type Decision = "APPROVE" | "REQUEST_INFORMATION" | "REJECT";

const decisionMeta: Record<
  Decision,
  {
    label: string;
    short: string;
    color: string;
    bg: string;
    icon: typeof ShieldCheck;
  }
> = {
  APPROVE: {
    label: "Approve",
    short: "A",
    color: "text-emerald-700",
    bg: "bg-emerald-600 hover:bg-emerald-700",
    icon: CheckCircle2,
  },
  REQUEST_INFORMATION: {
    label: "Request Info",
    short: "R",
    color: "text-amber-700",
    bg: "bg-amber-500 hover:bg-amber-600",
    icon: HelpCircle,
  },
  REJECT: {
    label: "Reject",
    short: "X",
    color: "text-red-700",
    bg: "bg-red-600 hover:bg-red-700",
    icon: XCircle,
  },
};

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 1023px)");
    const handler = () => setIsMobile(mq.matches);
    handler();
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return isMobile;
}

// ============================================================================
// Header + KPI strip
// ============================================================================

function KpiTile({
  label,
  value,
  icon: Icon,
  tone,
}: {
  label: string;
  value: number;
  icon: typeof Clock;
  tone: "default" | "info" | "amber" | "emerald" | "red";
}) {
  const tones: Record<string, string> = {
    default: "bg-[#475959]/10 dark:bg-[#475959]/20 text-[#475959] dark:text-[#94a8a4]",
    info: "bg-[#32504d]/10 dark:bg-[#32504d]/20 text-[#32504d] dark:text-[#9bb3ae]",
    amber: "bg-amber-50 text-amber-700",
    emerald: "bg-emerald-50 text-emerald-700",
    red: "bg-red-50 text-red-700",
  };
  return (
    <div className="flex items-center gap-3 rounded-xl border border-border/60 bg-card/60 px-3 py-2.5">
      <div
        className={cn(
          "flex size-9 items-center justify-center rounded-lg shrink-0",
          tones[tone],
        )}
      >
        <Icon className="size-4" />
      </div>
      <div className="min-w-0">
        <div className="text-[11px] uppercase tracking-wide text-muted-foreground truncate">
          {label}
        </div>
        <div className="font-display text-lg font-semibold leading-none text-foreground">
          {value.toLocaleString()}
        </div>
      </div>
    </div>
  );
}

function AdminHeader({ onBack }: { onBack: () => void }) {
  return (
    <header className="border-b border-border bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40">
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <KhidmaLogo size="sm" />
            <Separator orientation="vertical" className="hidden sm:block h-8" />
            <Badge className="hidden sm:inline-flex gap-1.5 bg-[#192d2f] text-white hover:bg-[#192d2f] border-transparent">
              <ShieldCheck className="size-3" />
              Admin Console
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant="ghost" size="icon" className="size-9">
                  <Keyboard className="size-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <div className="space-y-0.5">
                  <div className="font-semibold">Keyboard shortcuts</div>
                  <div className="text-[11px] opacity-90">
                    A = Approve · R = Request Info · X = Reject
                  </div>
                </div>
              </TooltipContent>
            </Tooltip>
            <Button variant="outline" size="sm" onClick={onBack}>
              <ArrowLeft className="size-4" />
              <span className="hidden sm:inline">Back to Home</span>
              <span className="sm:hidden">Home</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}

function KpiStrip() {
  return (
    <section className="border-b border-border bg-muted/30">
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8 py-3">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
          <KpiTile
            label="Pending Review"
            value={adminKPIs.pendingReview}
            icon={ClipboardList}
            tone="info"
          />
          <KpiTile
            label="Under Review"
            value={adminKPIs.underReview}
            icon={Clock}
            tone="default"
          />
          <KpiTile
            label="Approved Today"
            value={adminKPIs.approvedToday}
            icon={CheckCircle2}
            tone="emerald"
          />
          <KpiTile
            label="Rejected Today"
            value={adminKPIs.rejectedToday}
            icon={XCircle}
            tone="red"
          />
          <KpiTile
            label="Total Verified"
            value={adminKPIs.totalVerified}
            icon={ShieldCheck}
            tone="emerald"
          />
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// Application queue (left rail / dropdown on mobile)
// ============================================================================

function ApplicationQueue({
  apps,
  activeId,
  onSelect,
  isMobile,
}: {
  apps: AdminApplication[];
  activeId: string;
  onSelect: (id: string) => void;
  isMobile: boolean;
}) {
  if (isMobile) {
    return (
      <Card className="p-0 overflow-hidden">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <ListChecks className="size-4 text-[#32504d] dark:text-[#9bb3ae]" />
            Application Queue
            <Badge className="ml-auto bg-muted text-muted-foreground border-transparent">
              {apps.length}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <Select value={activeId} onValueChange={onSelect}>
            <SelectTrigger className="w-full" size="default">
              <SelectValue placeholder="Select application" />
            </SelectTrigger>
            <SelectContent>
              {apps.map((app) => {
                const cfg = statusConfig[app.status];
                return (
                  <SelectItem key={app.id} value={app.id}>
                    <span className="flex items-center gap-2">
                      <span
                        className={cn("size-1.5 rounded-full", cfg.dot)}
                      />
                      <span className="font-medium">{app.id}</span>
                      <span className="text-muted-foreground">·</span>
                      <span className="truncate">{app.freelancer.name}</span>
                    </span>
                  </SelectItem>
                );
              })}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="p-0 overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <ListChecks className="size-4 text-[#32504d] dark:text-[#9bb3ae]" />
            Application Queue
          </CardTitle>
          <Badge className="bg-muted text-muted-foreground border-transparent">
            {apps.length} pending
          </Badge>
        </div>
        <CardDescription className="text-xs">
          Pending applications awaiting review.
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <ScrollArea className="h-[260px] pr-2">
          <div className="space-y-1.5">
            {apps.map((app) => {
              const cfg = statusConfig[app.status];
              const active = app.id === activeId;
              return (
                <button
                  key={app.id}
                  onClick={() => onSelect(app.id)}
                  className={cn(
                    "group w-full text-left rounded-lg border px-3 py-2.5 transition-colors",
                    active
                      ? "border-[#32504d] bg-[#32504d]/5 dark:bg-[#32504d]/15"
                      : "border-border bg-card hover:border-[#748684]/60 hover:bg-muted/50",
                  )}
                >
                  <div className="flex items-center gap-2.5">
                    <Avatar className="size-8 shrink-0 border border-border">
                      <AvatarImage src={app.freelancer.avatar} alt={app.freelancer.name} />
                      <AvatarFallback className="text-[10px] bg-muted text-muted-foreground">
                        {app.freelancer.name.split(" ").map((n) => n[0]).slice(0,2).join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <div className="text-sm font-medium truncate text-foreground">
                          {app.freelancer.name}
                        </div>
                        <span
                          className={cn(
                            "inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[10px] font-medium",
                            cfg.bg,
                            cfg.color,
                          )}
                        >
                          <span className={cn("size-1 rounded-full", cfg.dot)} />
                          {cfg.label}
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-2 mt-0.5">
                        <div className="text-[11px] text-muted-foreground truncate">
                          {app.id} · {app.freelancer.title}
                        </div>
                        <div className="text-[10px] text-muted-foreground/70 shrink-0">
                          {timeAgo(app.appliedAt)}
                        </div>
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// LEFT COLUMN — Freelancer information
// ============================================================================

function InfoRow({
  icon: Icon,
  label,
  value,
  mono,
}: {
  icon: typeof User;
  label: string;
  value?: React.ReactNode;
  mono?: boolean;
}) {
  return (
    <div className="flex items-start gap-2.5 py-1.5">
      <Icon className="size-3.5 text-muted-foreground/70 shrink-0 mt-0.5" />
      <div className="min-w-0 flex-1">
        <div className="text-[11px] uppercase tracking-wide text-muted-foreground/70">
          {label}
        </div>
        <div
          className={cn(
            "text-sm text-foreground break-words",
            mono && "font-mono",
          )}
        >
          {value || "—"}
        </div>
      </div>
    </div>
  );
}

function SkillChip({ skill }: { skill: string }) {
  return (
    <span className="inline-flex items-center rounded-full border border-[#748684]/30 bg-[#748684]/5 px-2 py-0.5 text-[11px] font-medium text-[#475959] dark:text-[#94a8a4]">
      {skill}
    </span>
  );
}

function ExperienceList({ app }: { app: AdminApplication }) {
  // Synthesise compact experience entries from freelancer bio / data
  const experiences = [
    {
      role: app.freelancer.title,
      company: "Independent / Freelance",
      period: `${app.yearsOfExperience - 3} yrs ago — Present`,
      skills: app.freelancer.skills.slice(0, 3),
    },
    {
      role: `${app.primaryCategory} Specialist`,
      company: "Tunis-based agency",
      period: `${app.yearsOfExperience - 6} yrs ago — ${app.yearsOfExperience - 3} yrs ago`,
      skills: app.freelancer.skills.slice(2, 5),
    },
  ];
  return (
    <ol className="space-y-3">
      {experiences.map((e, i) => (
        <li key={i} className="relative pl-5">
          <span className="absolute left-0 top-1.5 size-2 rounded-full border-2 border-[#32504d] bg-background" />
          {i < experiences.length - 1 && (
            <span className="absolute left-[3.5px] top-3.5 bottom-[-12px] w-px bg-border" />
          )}
          <div className="text-sm font-medium text-foreground">{e.role}</div>
          <div className="text-xs text-muted-foreground">
            {e.company} · {e.period}
          </div>
          {e.skills.length > 0 && (
            <div className="mt-1 flex flex-wrap gap-1">
              {e.skills.map((s) => (
                <SkillChip key={s} skill={s} />
              ))}
            </div>
          )}
        </li>
      ))}
    </ol>
  );
}

function FreelancerInfoColumn({
  app,
  onOpenPublic,
}: {
  app: AdminApplication;
  onOpenPublic: (id: string) => void;
}) {
  const f = app.freelancer;
  const cfg = statusConfig[app.status];
  return (
    <div className="space-y-4">
      {/* Application header */}
      <Card className="p-0 overflow-hidden">
        <div className="bg-khidma-gradient px-4 py-3 text-white">
          <div className="flex items-center justify-between gap-2">
            <div className="min-w-0">
              <div className="text-[11px] uppercase tracking-wider text-white/70">
                Application
              </div>
              <div className="font-display text-sm font-semibold truncate">
                {app.id}
              </div>
            </div>
            <span
              className={cn(
                "inline-flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-semibold",
                cfg.bg,
                cfg.color,
              )}
            >
              <span className={cn("size-1.5 rounded-full", cfg.dot)} />
              {cfg.label}
            </span>
          </div>
        </div>
        <CardContent className="pt-4">
          <div className="flex items-center gap-3">
            <Avatar className="size-12 shrink-0 border border-border">
              <AvatarImage src={f.avatar} alt={f.name} />
              <AvatarFallback className="bg-muted text-muted-foreground text-xs">
                {f.name.split(" ").map((n) => n[0]).slice(0,2).join("")}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <div className="font-display text-base font-semibold text-foreground truncate">
                {f.name}
              </div>
              <div className="text-xs text-muted-foreground truncate">
                {f.username} · applied {formatDate(app.appliedAt)}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Profile photo + verification */}
      <Card className="p-0 overflow-hidden">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm flex items-center gap-2">
            <User className="size-4 text-[#32504d] dark:text-[#9bb3ae]" />
            Profile Photo
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex items-center gap-3">
            <Avatar className="size-16 shrink-0 border-2 border-border">
              <AvatarImage src={f.avatar} alt={f.name} />
              <AvatarFallback className="bg-muted text-muted-foreground">
                {f.name.split(" ").map((n) => n[0]).slice(0,2).join("")}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <div className="text-xs text-muted-foreground">
                Submitted on application
              </div>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {f.verified.email && (
                  <VerificationBadge type="email" size="sm" />
                )}
                {f.verified.phone && (
                  <VerificationBadge type="phone" size="sm" />
                )}
                {f.verified.identity && (
                  <VerificationBadge type="identity" size="sm" />
                )}
                {f.verified.portfolio && (
                  <VerificationBadge type="portfolio" size="sm" />
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Personal info */}
      <Card className="p-0 overflow-hidden">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <FileText className="size-4 text-[#32504d] dark:text-[#9bb3ae]" />
            Personal Information
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0 space-y-0.5">
          <InfoRow icon={User} label="Full Name" value={f.name} />
          <InfoRow
            icon={MapPin}
            label="Location"
            value={`${f.location.city}, ${f.location.country}`}
          />
          <InfoRow icon={Phone} label="Phone" value={app.phone} mono />
          <InfoRow icon={Mail} label="Email" value={app.email} mono />
          <InfoRow
            icon={LanguagesIcon}
            label="Languages"
            value={f.languages.join(" · ")}
          />
        </CardContent>
      </Card>

      {/* Professional info */}
      <Card className="p-0 overflow-hidden">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <Briefcase className="size-4 text-[#32504d] dark:text-[#9bb3ae]" />
            Professional Information
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0 space-y-0.5">
          <InfoRow icon={User} label="Title" value={f.title} />
          <InfoRow icon={FileText} label="Bio" value={f.bio} />
          <InfoRow
            icon={Clock}
            label="Experience"
            value={`${app.yearsOfExperience}+ years`}
          />
          <InfoRow
            icon={LayoutGrid}
            label="Primary Category"
            value={app.primaryCategory}
          />
          <InfoRow
            icon={GraduationCap}
            label="Hourly Rate"
            value={`${f.hourlyRate} TND/hr`}
          />
          <InfoRow
            icon={Lightbulb}
            label="Starting Price"
            value={`${app.startingPrice} TND`}
          />
          <InfoRow
            icon={UserCheck}
            label="Availability"
            value={
              <span className="capitalize">{f.availability.replace("_", " ")}</span>
            }
          />
          <InfoRow
            icon={RefreshCw}
            label="Response Time"
            value={f.responseTime}
          />
        </CardContent>
      </Card>

      {/* Skills */}
      <Card className="p-0 overflow-hidden">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <Sparkles className="size-4 text-[#32504d] dark:text-[#9bb3ae]" />
            Skills
            <Badge className="ml-auto bg-muted text-muted-foreground border-transparent">
              {f.skills.length}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex flex-wrap gap-1.5">
            {f.skills.map((s) => (
              <SkillChip key={s} skill={s} />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Experience */}
      <Card className="p-0 overflow-hidden">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <History className="size-4 text-[#32504d] dark:text-[#9bb3ae]" />
            Experience
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <ExperienceList app={app} />
        </CardContent>
      </Card>

      {/* Public profile CTA */}
      <Button
        variant="outline"
        className="w-full border-[#32504d]/40 text-[#32504d] dark:text-[#9bb3ae] hover:bg-[#32504d]/5 dark:bg-[#32504d]/15 hover:text-[#32504d] dark:text-[#9bb3ae]"
        onClick={() => onOpenPublic(f.id)}
      >
        <Eye className="size-4" />
        View Public Profile
      </Button>
    </div>
  );
}

// ============================================================================
// CENTER COLUMN — Portfolio Review
// ============================================================================

function PortfolioItemCard({
  app,
  item,
  review,
  onVerificationChange,
  onDecision,
  onNoteChange,
}: {
  app: AdminApplication;
  item: AdminApplication["freelancer"]["portfolio"][number];
  review: PortfolioReviewState;
  onVerificationChange: (v: PortfolioReviewState["verification"]) => void;
  onDecision: (
    decision: "APPROVED" | "FLAGGED" | "REJECTED",
    reason?: string,
  ) => void;
  onNoteChange: (note: string) => void;
}) {
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectReason, setRejectReason] = useState("");
  const decision = review.decision;
  const dCfg = decisionConfig[decision];
  const verif = verificationLabel[review.verification];
  const vis = visibilityLabel[review.visibility];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
    >
      <Card
        className={cn(
          "p-0 overflow-hidden",
          decision === "REJECTED" && "border-red-200",
          decision === "FLAGGED" && "border-amber-200",
          decision === "APPROVED" && "border-emerald-200",
        )}
      >
        {/* Cover */}
        <div className="relative aspect-[16/9] bg-muted overflow-hidden">
          <img
            src={item.cover}
            alt={item.title}
            className="size-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#192d2f]/70 via-transparent to-transparent" />
          <div className="absolute top-3 left-3 flex items-center gap-1.5">
            <Badge className="bg-[#192d2f]/90 text-white border-transparent backdrop-blur">
              {item.category}
            </Badge>
            <Badge className="bg-white/90 text-[#2b3d3d] dark:text-[#94a8a4] border-transparent backdrop-blur">
              Role: {item.role}
            </Badge>
          </div>
          <div className="absolute top-3 right-3">
            <span
              className={cn(
                "inline-flex items-center gap-1 rounded-full px-2 py-1 text-[10px] font-semibold backdrop-blur",
                dCfg.bg,
                dCfg.color,
              )}
            >
              {decision === "APPROVED" && <CheckCircle2 className="size-3" />}
              {decision === "FLAGGED" && <Flag className="size-3" />}
              {decision === "REJECTED" && <XCircle className="size-3" />}
              {decision === "PENDING" && <Clock className="size-3" />}
              {dCfg.label}
            </span>
          </div>
          <div className="absolute bottom-3 left-3 right-3">
            <h4 className="font-display text-base font-semibold text-white line-clamp-2">
              {item.title}
            </h4>
          </div>
        </div>

        <CardContent className="pt-4 space-y-4">
          {/* Description */}
          <p className="text-sm text-foreground/90 leading-relaxed">
            {item.description}
          </p>

          {/* Skills tags */}
          {item.skills.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {item.skills.map((s) => (
                <SkillChip key={s} skill={s} />
              ))}
            </div>
          )}

          <Separator />

          {/* Verification + Visibility row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-[11px] uppercase tracking-wide text-muted-foreground/80">
                Verification Status
              </Label>
              <Select
                value={review.verification}
                onValueChange={(v) =>
                  onVerificationChange(
                    v as PortfolioReviewState["verification"],
                  )
                }
              >
                <SelectTrigger className="mt-1 w-full" size="sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="UNVERIFIED">Unverified</SelectItem>
                  <SelectItem value="SELF_DECLARED">Self-declared</SelectItem>
                  <SelectItem value="ADMIN_VERIFIED">
                    Admin verified
                  </SelectItem>
                  <SelectItem value="EXTERNALLY_VERIFIED">
                    Externally verified
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-[11px] uppercase tracking-wide text-muted-foreground/80">
                Visibility
              </Label>
              <div className="mt-1 flex items-center gap-1.5 h-8 rounded-md border border-input px-3 bg-muted/30">
                <Eye className="size-3.5 text-muted-foreground" />
                <span className="text-sm">{vis}</span>
              </div>
            </div>
          </div>

          {/* URLs */}
          {(item.liveUrl || item.repoUrl) && (
            <div className="flex flex-wrap gap-2">
              {item.liveUrl && (
                <a
                  href={item.liveUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex items-center gap-1.5 rounded-md border border-[#32504d]/40 bg-[#32504d]/5 dark:bg-[#32504d]/15 px-2.5 py-1 text-xs font-medium text-[#32504d] dark:text-[#9bb3ae] hover:bg-[#32504d]/10 dark:bg-[#32504d]/20"
                >
                  <Globe className="size-3" />
                  Live URL
                  <ExternalLink className="size-3 opacity-60" />
                </a>
              )}
              {item.repoUrl && (
                <a
                  href={item.repoUrl}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="inline-flex items-center gap-1.5 rounded-md border border-[#475959]/40 bg-[#475959]/5 dark:bg-[#475959]/15 px-2.5 py-1 text-xs font-medium text-[#475959] dark:text-[#94a8a4] hover:bg-[#475959]/10 dark:bg-[#475959]/20"
                >
                  <ExternalLink className="size-3" />
                  Repo URL
                </a>
              )}
            </div>
          )}

          {/* Existing note (if any) */}
          {review.note && (
            <div className="rounded-md border border-amber-200 bg-amber-50 px-3 py-2">
              <div className="text-[11px] uppercase tracking-wide text-amber-700/80 flex items-center gap-1">
                <StickyNote className="size-3" />
                Item Note
              </div>
              <div className="text-xs text-amber-900/90 mt-1">
                {review.note}
              </div>
            </div>
          )}

          {/* Action buttons */}
          <div className="grid grid-cols-3 gap-2">
            <Button
              size="sm"
              variant="outline"
              className={cn(
                "border-emerald-200 text-emerald-700 hover:bg-emerald-50 hover:text-emerald-700",
                decision === "APPROVED" && "bg-emerald-600 text-white hover:bg-emerald-700 border-emerald-600",
              )}
              onClick={() => onDecision("APPROVED")}
            >
              <CheckCircle2 className="size-4" />
              Approve
            </Button>
            <Button
              size="sm"
              variant="outline"
              className={cn(
                "border-amber-200 text-amber-700 hover:bg-amber-50 hover:text-amber-700",
                decision === "FLAGGED" && "bg-amber-500 text-white hover:bg-amber-600 border-amber-500",
              )}
              onClick={() => onDecision("FLAGGED")}
            >
              <Flag className="size-4" />
              Flag
            </Button>
            <Button
              size="sm"
              variant="outline"
              className={cn(
                "border-red-200 text-red-700 hover:bg-red-50 hover:text-red-700",
                decision === "REJECTED" && "bg-red-600 text-white hover:bg-red-700 border-red-600",
              )}
              onClick={() => {
                setRejectReason("");
                setShowRejectDialog(true);
              }}
            >
              <XCircle className="size-4" />
              Reject
            </Button>
          </div>

          {/* Per-item admin note */}
          <div>
            <Label className="text-[11px] uppercase tracking-wide text-muted-foreground/80 flex items-center gap-1">
              <StickyNote className="size-3" />
              Per-item Admin Note
            </Label>
            <Textarea
              placeholder="Add private note for this portfolio item…"
              value={review.note}
              onChange={(e) => onNoteChange(e.target.value)}
              className="mt-1 min-h-[60px] text-xs"
            />
          </div>
        </CardContent>

        {/* Reject dialog */}
        <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Reject Portfolio Item</DialogTitle>
              <DialogDescription>
                Provide a reason for rejecting &ldquo;{item.title}&rdquo;. This
                reason will be logged in the audit trail and is visible to the
                freelancer.
              </DialogDescription>
            </DialogHeader>
            <Textarea
              placeholder="Reason for rejection…"
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              className="min-h-[80px]"
            />
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setShowRejectDialog(false)}
              >
                Cancel
              </Button>
              <Button
                className="bg-red-600 text-white hover:bg-red-700"
                onClick={() => {
                  onDecision("REJECTED", rejectReason || "No reason provided");
                  setShowRejectDialog(false);
                }}
              >
                <XCircle className="size-4" />
                Reject Item
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </Card>
    </motion.div>
  );
}

function PortfolioReviewColumn({
  app,
  onUpdateItem,
  onToast,
}: {
  app: AdminApplication;
  onUpdateItem: (
    itemId: string,
    patch: Partial<PortfolioReviewState>,
  ) => void;
  onToast: (msg: string, kind?: "info" | "success" | "warning" | "error") => void;
}) {
  const items = app.freelancer.portfolio;
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-2">
        <div>
          <h3 className="font-display text-lg font-semibold text-foreground flex items-center gap-2">
            <LayoutGrid className="size-5 text-[#32504d] dark:text-[#9bb3ae]" />
            Portfolio Review
          </h3>
          <p className="text-xs text-muted-foreground">
            Review each portfolio item. Verify ownership, then approve, flag, or
            reject.
          </p>
        </div>
        <Badge className="bg-[#32504d]/10 dark:bg-[#32504d]/20 text-[#32504d] dark:text-[#9bb3ae] border-transparent">
          {items.length} {items.length === 1 ? "item" : "items"}
        </Badge>
      </div>

      {items.length === 0 ? (
        <Card className="p-0">
          <CardContent className="pt-12 pb-12 flex flex-col items-center justify-center text-center gap-3">
            <div className="size-12 rounded-full bg-muted flex items-center justify-center">
              <LayoutGrid className="size-6 text-muted-foreground" />
            </div>
            <div>
              <div className="font-display text-base font-semibold">
                No portfolio items
              </div>
              <div className="text-xs text-muted-foreground mt-1 max-w-xs">
                This freelancer did not submit any portfolio items. Request
                information or reject the application.
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {items.map((item) => {
            const review = app.portfolioReviews[item.id];
            return (
              <PortfolioItemCard
                key={item.id}
                app={app}
                item={item}
                review={review}
                onVerificationChange={(v) => {
                  onUpdateItem(item.id, { verification: v });
                  onToast(
                    `Verification set to ${verificationLabel[v]} for "${item.title}".`,
                  );
                }}
                onDecision={(decision, reason) => {
                  onUpdateItem(item.id, {
                    decision,
                    rejectReason: reason,
                  });
                  const cfg = decisionConfig[decision];
                  onToast(
                    `Item "${item.title}" → ${cfg.label}`,
                    decision === "APPROVED"
                      ? "success"
                      : decision === "REJECTED"
                        ? "error"
                        : "warning",
                  );
                }}
                onNoteChange={(note) =>
                  onUpdateItem(item.id, { note })
                }
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

// ============================================================================
// RIGHT COLUMN — Verification + Risk + Checklist + Decision
// ============================================================================

function VerificationPanel({ app }: { app: AdminApplication }) {
  const f = app.freelancer;
  const portfolioTotal = f.portfolio.length;
  const portfolioApproved = Object.values(app.portfolioReviews).filter(
    (r) => r.decision === "APPROVED",
  ).length;

  const items = [
    {
      label: "Email",
      value: f.verified.email,
      icon: Mail,
    },
    {
      label: "Phone",
      value: f.verified.phone,
      icon: Phone,
    },
    {
      label: "Identity",
      value: app.identityStatus === "VERIFIED",
      pending: app.identityStatus === "PENDING",
      icon: Shield,
    },
    {
      label: `Portfolio (${portfolioApproved}/${portfolioTotal})`,
      value: portfolioApproved === portfolioTotal && portfolioTotal > 0,
      pending: portfolioApproved < portfolioTotal,
      icon: FileText,
    },
  ];

  return (
    <Card className="p-0 overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm flex items-center gap-2">
          <ShieldCheck className="size-4 text-[#32504d] dark:text-[#9bb3ae]" />
          Verification Status
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <ul className="space-y-1">
          {items.map((it) => (
            <li
              key={it.label}
              className="flex items-center justify-between gap-2 rounded-md border border-border/60 bg-muted/20 px-2.5 py-1.5"
            >
              <div className="flex items-center gap-2 min-w-0">
                <it.icon className="size-3.5 text-muted-foreground shrink-0" />
                <span className="text-xs text-foreground truncate">
                  {it.label}
                </span>
              </div>
              {it.pending ? (
                <span className="inline-flex items-center gap-1 text-[10px] font-medium text-amber-700">
                  <Clock className="size-3" />
                  Pending
                </span>
              ) : it.value ? (
                <span className="inline-flex items-center gap-1 text-[10px] font-medium text-emerald-700">
                  <CheckCircle2 className="size-3" />
                  Verified
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-[10px] font-medium text-red-700">
                  <XCircle className="size-3" />
                  Failed
                </span>
              )}
            </li>
          ))}
        </ul>
        <div className="mt-2 flex items-center justify-between gap-2 rounded-md bg-[#32504d]/5 dark:bg-[#32504d]/15 px-3 py-1.5">
          <span className="text-[11px] font-medium text-[#32504d] dark:text-[#9bb3ae]">
            Overall
          </span>
          <span
            className={cn(
              "inline-flex items-center gap-1 text-[10px] font-semibold rounded-full px-2 py-0.5",
              statusConfig[app.status].bg,
              statusConfig[app.status].color,
            )}
          >
            <span className={cn("size-1 rounded-full", statusConfig[app.status].dot)} />
            {statusConfig[app.status].label}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

function RiskPanel({ app }: { app: AdminApplication }) {
  const r = app.risk;
  const cfg = riskConfig[r.overall];
  return (
    <Card
      className={cn(
        "p-0 overflow-hidden ring-1 ring-inset",
        cfg.ring,
      )}
    >
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <ShieldAlert className="size-4 text-[#32504d] dark:text-[#9bb3ae]" />
            Risk Signals
          </CardTitle>
          <span
            className={cn(
              "inline-flex items-center gap-1 text-[10px] font-semibold rounded-full px-2 py-0.5",
              cfg.bg,
              cfg.color,
            )}
          >
            {r.overall === "HIGH" && <AlertTriangle className="size-3" />}
            {r.overall === "MEDIUM" && <AlertTriangle className="size-3" />}
            {r.overall === "LOW" && <ShieldCheck className="size-3" />}
            {cfg.label}
          </span>
        </div>
      </CardHeader>
      <CardContent className="pt-0 space-y-2">
        <RiskRow
          icon={Copy}
          label="Duplicate accounts"
          strength={r.duplicateAccounts}
        />
        <RiskRow
          icon={AlertTriangle}
          label="Suspicious activity"
          strength={r.suspiciousActivity}
        />
        <div className="flex items-center justify-between gap-2 rounded-md border border-border/60 bg-muted/20 px-2.5 py-1.5">
          <div className="flex items-center gap-2 min-w-0">
            <History className="size-3.5 text-muted-foreground shrink-0" />
            <span className="text-xs text-foreground truncate">
              Previous rejections
            </span>
          </div>
          <span
            className={cn(
              "text-[10px] font-semibold",
              r.previousRejections === 0
                ? "text-emerald-700"
                : r.previousRejections === 1
                  ? "text-amber-700"
                  : "text-red-700",
            )}
          >
            {r.previousRejections}
          </span>
        </div>
        <div className="flex items-center justify-between gap-2 rounded-md border border-border/60 bg-muted/20 px-2.5 py-1.5">
          <div className="flex items-center gap-2 min-w-0">
            <Flag className="size-3.5 text-muted-foreground shrink-0" />
            <span className="text-xs text-foreground truncate">
              Client reports
            </span>
          </div>
          <span
            className={cn(
              "text-[10px] font-semibold",
              r.reportsCount === 0
                ? "text-emerald-700"
                : "text-red-700",
            )}
          >
            {r.reportsCount}
          </span>
        </div>
        {r.internalFlags.length > 0 && (
          <div className="rounded-md border border-amber-200 bg-amber-50 px-2.5 py-2">
            <div className="text-[10px] uppercase tracking-wide text-amber-700/80 flex items-center gap-1">
              <Info className="size-3" />
              Internal Flags
            </div>
            <ul className="mt-1 space-y-1">
              {r.internalFlags.map((flag, i) => (
                <li
                  key={i}
                  className="text-[11px] text-amber-900/90 flex items-start gap-1.5"
                >
                  <span className="size-1 rounded-full bg-amber-600 mt-1.5 shrink-0" />
                  <span>{flag}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function RiskRow({
  icon: Icon,
  label,
  strength,
}: {
  icon: typeof AlertTriangle;
  label: string;
  strength: "NONE" | "WATCH" | "SUSPICIOUS";
}) {
  const cfg = signalConfig[strength];
  return (
    <div className="flex items-center justify-between gap-2 rounded-md border border-border/60 bg-muted/20 px-2.5 py-1.5">
      <div className="flex items-center gap-2 min-w-0">
        <Icon className="size-3.5 text-muted-foreground shrink-0" />
        <span className="text-xs text-foreground truncate">{label}</span>
      </div>
      <span
        className={cn(
          "inline-flex items-center gap-1 text-[10px] font-medium rounded-full px-1.5 py-0.5",
          cfg.bg,
          cfg.color,
        )}
      >
        {strength === "NONE" && <CheckCircle2 className="size-3" />}
        {strength === "WATCH" && <AlertTriangle className="size-3" />}
        {strength === "SUSPICIOUS" && <ShieldAlert className="size-3" />}
        {cfg.label}
      </span>
    </div>
  );
}

function ChecklistPanel({
  app,
  onToggle,
}: {
  app: AdminApplication;
  onToggle: (id: string) => void;
}) {
  const groups = useMemo(() => {
    const map = new Map<string, ReviewChecklistItem[]>();
    for (const it of app.checklist) {
      const arr = map.get(it.group) ?? [];
      arr.push(it);
      map.set(it.group, arr);
    }
    return Array.from(map.entries());
  }, [app.checklist]);

  const checked = checklistCount(app.checklist);
  const total = app.checklist.length;
  const pct = Math.round((checked / total) * 100);

  return (
    <Card className="p-0 overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between gap-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <ListChecks className="size-4 text-[#32504d] dark:text-[#9bb3ae]" />
            Admin Review Checklist
          </CardTitle>
          <Badge className="bg-[#32504d]/10 dark:bg-[#32504d]/20 text-[#32504d] dark:text-[#9bb3ae] border-transparent">
            {checked}/{total}
          </Badge>
        </div>
        <Progress value={pct} className="h-1.5 mt-1" />
      </CardHeader>
      <CardContent className="pt-0">
        <ScrollArea className="max-h-[280px] pr-2">
          <div className="space-y-3">
            {groups.map(([group, items]) => (
              <div key={group}>
                <div className="text-[10px] uppercase tracking-wider text-muted-foreground/70 mb-1">
                  {group}
                </div>
                <ul className="space-y-1">
                  {items.map((it) => (
                    <li key={it.id}>
                      <label className="flex items-start gap-2 rounded-md px-1.5 py-1 cursor-pointer hover:bg-muted/40">
                        <Checkbox
                          checked={it.checked}
                          onCheckedChange={() => onToggle(it.id)}
                          className="mt-0.5"
                        />
                        <span
                          className={cn(
                            "text-xs",
                            it.checked
                              ? "text-foreground line-through decoration-1 decoration-muted-foreground/40"
                              : "text-foreground/90",
                          )}
                        >
                          {it.label}
                        </span>
                      </label>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

function DecisionPanel({
  app,
  onSubmit,
  registerShortcut,
}: {
  app: AdminApplication;
  onSubmit: (decision: Decision, message: string, note: string) => void;
  registerShortcut: (fn: (d: Decision) => void) => void;
}) {
  const [decision, setDecision] = useState<Decision | null>(null);
  const [message, setMessage] = useState("");
  const [note, setNote] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [prevAppId, setPrevAppId] = useState(app.id);

  // Reset internal state when the active application changes
  if (prevAppId !== app.id) {
    setPrevAppId(app.id);
    setDecision(null);
    setMessage("");
    setNote("");
  }

  // Register the shortcut handler with the parent so keyboard shortcuts
  // can drive the decision selection without DOM traversal. `setDecision`
  // from useState is stable across renders, so this effect runs once.
  useEffect(() => {
    registerShortcut(setDecision);
  }, [registerShortcut, setDecision]);

  const canSubmit =
    decision !== null &&
    (decision === "APPROVE" || message.trim().length > 0);

  const handleConfirm = () => {
    if (!decision) return;
    onSubmit(decision, message, note);
    setConfirmOpen(false);
    setDecision(null);
    setMessage("");
    setNote("");
  };

  return (
    <Card className="p-0 overflow-hidden border-[#192d2f]/20">
      <CardHeader className="pb-2 bg-[#192d2f] text-white rounded-t-xl">
        <CardTitle className="text-sm flex items-center gap-2">
          <Shield className="size-4" />
          Decision
        </CardTitle>
        <CardDescription className="text-white/70 text-xs">
          Submitting a decision will notify the freelancer and log to the audit
          trail.
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-4 space-y-3">
        {/* Decision buttons */}
        <div className="grid grid-cols-3 gap-2">
          {(Object.keys(decisionMeta) as Decision[]).map((d) => {
            const m = decisionMeta[d];
            const Icon = m.icon;
            const active = decision === d;
            return (
              <Tooltip key={d}>
                <TooltipTrigger asChild>
                  <motion.button
                    whileTap={{ scale: 0.96 }}
                    onClick={() => setDecision(d)}
                    className={cn(
                      "flex flex-col items-center justify-center gap-1 rounded-lg border px-2 py-2.5 text-xs font-medium transition-all",
                      active
                        ? cn(m.bg, "text-white border-transparent shadow-md")
                        : "border-border bg-card hover:bg-muted",
                    )}
                  >
                    <Icon className="size-4" />
                    <span>{m.label}</span>
                    <span className="text-[9px] uppercase opacity-60">
                      [{m.short}]
                    </span>
                  </motion.button>
                </TooltipTrigger>
                <TooltipContent>
                  Press <span className="font-mono">{m.short}</span> to select
                </TooltipContent>
              </Tooltip>
            );
          })}
        </div>

        <AnimatePresence mode="wait">
          {decision === "REJECT" && (
            <motion.div
              key="reject"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <Label className="text-[11px] uppercase tracking-wide text-red-700 flex items-center gap-1">
                <XCircle className="size-3" />
                Rejection Reason
              </Label>
              <Textarea
                placeholder="Provide a clear reason for rejection…"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="mt-1 min-h-[70px] text-xs"
              />
            </motion.div>
          )}
          {decision === "REQUEST_INFORMATION" && (
            <motion.div
              key="info"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <Label className="text-[11px] uppercase tracking-wide text-amber-700 flex items-center gap-1">
                <HelpCircle className="size-3" />
                Request Info Message
              </Label>
              <Textarea
                placeholder="List exactly what the freelancer needs to provide…"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="mt-1 min-h-[70px] text-xs"
              />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Internal admin note (always visible) */}
        <div>
          <Label className="text-[11px] uppercase tracking-wide text-muted-foreground/80 flex items-center gap-1">
            <StickyNote className="size-3" />
            Internal Admin Note
          </Label>
          <Textarea
            placeholder="Private note for the team (never shown to freelancer)…"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="mt-1 min-h-[60px] text-xs"
          />
        </div>

        <Button
          className={cn(
            "w-full text-white",
            !canSubmit && "opacity-50 cursor-not-allowed",
            decision === "APPROVE" && "bg-emerald-600 hover:bg-emerald-700",
            decision === "REJECT" && "bg-red-600 hover:bg-red-700",
            decision === "REQUEST_INFORMATION" && "bg-amber-500 hover:bg-amber-600",
            !decision && "bg-[#32504d] hover:bg-[#32504d]/90",
          )}
          disabled={!canSubmit}
          onClick={() => setConfirmOpen(true)}
        >
          <ShieldCheck className="size-4" />
          Submit Decision
        </Button>
      </CardContent>

      {/* Confirm dialog */}
      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Decision</DialogTitle>
            <DialogDescription>
              You are about to{" "}
              <span className="font-semibold">
                {decision ? decisionMeta[decision].label.toUpperCase() : "—"}
              </span>{" "}
              application{" "}
              <span className="font-mono text-[#32504d] dark:text-[#9bb3ae]">{app.id}</span> for{" "}
              <span className="font-semibold">{app.freelancer.name}</span>. This
              action will be logged and the freelancer will be notified.
            </DialogDescription>
          </DialogHeader>
          {(message || note) && (
            <div className="rounded-md border border-border bg-muted/30 p-3 space-y-1.5 max-h-[200px] overflow-y-auto">
              {message && (
                <div>
                  <div className="text-[10px] uppercase tracking-wide text-muted-foreground">
                    Message to freelancer
                  </div>
                  <div className="text-xs text-foreground">{message}</div>
                </div>
              )}
              {note && (
                <div>
                  <div className="text-[10px] uppercase tracking-wide text-muted-foreground">
                    Internal note
                  </div>
                  <div className="text-xs text-foreground">{note}</div>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmOpen(false)}>
              Cancel
            </Button>
            <Button
              className={cn(
                "text-white",
                decision === "APPROVE" && "bg-emerald-600 hover:bg-emerald-700",
                decision === "REJECT" && "bg-red-600 hover:bg-red-700",
                decision === "REQUEST_INFORMATION" && "bg-amber-500 hover:bg-amber-600",
              )}
              onClick={handleConfirm}
            >
              <ShieldCheck className="size-4" />
              Confirm & Submit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}

// ============================================================================
// BOTTOM SECTION — Notes + History + Audit Log
// ============================================================================

function AdminNotesTab({
  app,
  onAddNote,
}: {
  app: AdminApplication;
  onAddNote: (appId: string, content: string, pinned: boolean) => void;
}) {
  const [content, setContent] = useState("");
  const [pinned, setPinned] = useState(false);
  const [prevAppId, setPrevAppId] = useState(app.id);
  if (prevAppId !== app.id) {
    setPrevAppId(app.id);
    setContent("");
    setPinned(false);
  }

  const sorted = [...app.notes].sort((a, b) => {
    if (!!a.pinned !== !!b.pinned) return a.pinned ? -1 : 1;
    return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
  });

  const submit = () => {
    if (!content.trim()) return;
    onAddNote(app.id, content.trim(), pinned);
    setContent("");
    setPinned(false);
  };

  return (
    <div className="space-y-4">
      {/* Add note form */}
      <Card className="p-0 overflow-hidden border-[#32504d]/30 dark:border-[#32504d]/30">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <Plus className="size-4 text-[#32504d] dark:text-[#9bb3ae]" />
            Add Admin Note
          </CardTitle>
          <CardDescription className="text-xs">
            Private. Never exposed to the freelancer.
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-0 space-y-2">
          <Textarea
            placeholder="Write a private note for your team…"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[80px] text-sm"
          />
          <div className="flex items-center justify-between gap-2">
            <label className="flex items-center gap-2 text-xs text-muted-foreground cursor-pointer">
              <Checkbox
                checked={pinned}
                onCheckedChange={(v) => setPinned(v === true)}
              />
              <PinIcon className="size-3" />
              Pin to top
            </label>
            <Button
              size="sm"
              className="bg-[#32504d] hover:bg-[#32504d]/90 text-white"
              onClick={submit}
              disabled={!content.trim()}
            >
              <Plus className="size-4" />
              Add Note
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Notes list */}
      <div className="space-y-2.5">
        <div className="text-[11px] uppercase tracking-wider text-muted-foreground/70 flex items-center gap-1.5">
          <MessageSquare className="size-3" />
          {sorted.length} note{sorted.length === 1 ? "" : "s"}
        </div>
        {sorted.length === 0 ? (
          <Card className="p-0">
            <CardContent className="pt-6 pb-6 text-center text-xs text-muted-foreground">
              No notes yet.
            </CardContent>
          </Card>
        ) : (
          sorted.map((n) => (
            <motion.div
              layout
              key={n.id}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card
                className={cn(
                  "p-0 overflow-hidden",
                  n.pinned && "border-amber-200 bg-amber-50/40",
                )}
              >
                <CardContent className="pt-4">
                  <div className="flex items-start gap-2.5">
                    {n.authorAvatar ? (
                      <Avatar className="size-7 shrink-0 border border-border">
                        <AvatarImage src={n.authorAvatar} alt={n.author} />
                        <AvatarFallback className="text-[10px] bg-muted text-muted-foreground">
                          {n.author.split(" ").map((p) => p[0]).slice(0,2).join("")}
                        </AvatarFallback>
                      </Avatar>
                    ) : (
                      <div className="size-7 rounded-full bg-muted flex items-center justify-center shrink-0">
                        <Shield className="size-3.5 text-muted-foreground" />
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center gap-1.5 min-w-0">
                          <span className="text-xs font-semibold text-foreground truncate">
                            {n.author}
                          </span>
                          {n.pinned && (
                            <Badge className="bg-amber-100 text-amber-800 border-transparent text-[9px] px-1">
                              <PinIcon className="size-2.5" />
                              Pinned
                            </Badge>
                          )}
                        </div>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <span className="text-[10px] text-muted-foreground cursor-help">
                              {timeAgo(n.timestamp)}
                            </span>
                          </TooltipTrigger>
                          <TooltipContent>
                            {formatDateTime(n.timestamp)}
                          </TooltipContent>
                        </Tooltip>
                      </div>
                      <p className="text-sm text-foreground/90 mt-1 whitespace-pre-wrap">
                        {n.content}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}

function HistoryTab({ app }: { app: AdminApplication }) {
  const events = [...app.history].sort(
    (a, b) =>
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
  );
  return (
    <div className="space-y-4">
      <div className="text-[11px] uppercase tracking-wider text-muted-foreground/70 flex items-center gap-1.5">
        <History className="size-3" />
        Application Timeline
      </div>
      <ol className="relative space-y-4 pl-6">
        <span className="absolute left-[7px] top-2 bottom-2 w-px bg-border" />
        {events.map((e, i) => {
          const cfg = statusConfig[e.status];
          const Icon =
            e.status === "APPROVED"
              ? CheckCircle2
              : e.status === "REJECTED"
                ? XCircle
                : e.status === "MORE_INFORMATION_REQUIRED"
                  ? HelpCircle
                  : e.status === "UNDER_REVIEW"
                    ? Clock
                    : FileText;
          return (
            <motion.li
              key={e.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04 }}
              className="relative"
            >
              <span
                className={cn(
                  "absolute -left-6 top-1 size-3.5 rounded-full border-2 border-background flex items-center justify-center",
                  cfg.bg,
                )}
              >
                <Icon className={cn("size-2", cfg.color)} />
              </span>
              <Card className="p-0 overflow-hidden">
                <CardContent className="pt-3 pb-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="text-sm font-medium text-foreground">
                        {e.label}
                      </div>
                      <div className="text-xs text-muted-foreground mt-0.5">
                        by{" "}
                        <span className="font-medium text-foreground/80">
                          {e.actor}
                        </span>
                      </div>
                    </div>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span
                          className={cn(
                            "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium shrink-0 cursor-help",
                            cfg.bg,
                            cfg.color,
                          )}
                        >
                          <span className={cn("size-1 rounded-full", cfg.dot)} />
                          {cfg.label}
                        </span>
                      </TooltipTrigger>
                      <TooltipContent>
                        {formatDateTime(e.timestamp)}
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <div className="text-[11px] text-muted-foreground mt-1">
                    {timeAgo(e.timestamp)}
                  </div>
                  {e.note && (
                    <p className="mt-2 text-xs text-foreground/80 rounded-md bg-muted/40 px-2.5 py-1.5 border border-border/60">
                      {e.note}
                    </p>
                  )}
                </CardContent>
              </Card>
            </motion.li>
          );
        })}
      </ol>
    </div>
  );
}

function AuditLogTab({ app }: { app: AdminApplication }) {
  const rows = [...app.auditLog].sort(
    (a, b) =>
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
  );
  return (
    <Card className="p-0 overflow-hidden">
      <CardContent className="pt-4">
        <div className="text-[11px] uppercase tracking-wider text-muted-foreground/70 flex items-center gap-1.5 mb-2">
          <ClipboardList className="size-3" />
          Admin Actions Audit Trail
        </div>
        <ScrollArea className="max-h-[420px]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[160px]">Timestamp</TableHead>
                <TableHead className="w-[140px]">Actor</TableHead>
                <TableHead className="w-[200px]">Action</TableHead>
                <TableHead>Reason / Details</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map((row) => (
                <TableRow key={row.id}>
                  <TableCell className="text-xs text-muted-foreground whitespace-normal">
                    {formatDateTime(row.timestamp)}
                  </TableCell>
                  <TableCell className="text-xs">
                    <span className="font-medium">{row.actor}</span>
                  </TableCell>
                  <TableCell>
                    <code className="text-[11px] font-mono rounded bg-muted px-1.5 py-0.5 text-[#32504d] dark:text-[#9bb3ae]">
                      {row.action}
                    </code>
                  </TableCell>
                  <TableCell className="text-xs text-muted-foreground whitespace-normal">
                    {row.reason && (
                      <div className="font-medium text-foreground/80 mb-0.5">
                        {row.reason}
                      </div>
                    )}
                    {row.details}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}

function BottomSection({
  app,
  onAddNote,
}: {
  app: AdminApplication;
  onAddNote: (appId: string, content: string, pinned: boolean) => void;
}) {
  return (
    <Card className="p-0 overflow-hidden">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-display flex items-center gap-2">
          <FileText className="size-4 text-[#32504d] dark:text-[#9bb3ae]" />
          Notes · History · Audit Log
        </CardTitle>
        <CardDescription>
          Internal collaboration record for application{" "}
          <span className="font-mono text-[#32504d] dark:text-[#9bb3ae]">{app.id}</span>.
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <Tabs defaultValue="notes">
          <TabsList className="grid w-full grid-cols-3 max-w-md">
            <TabsTrigger value="notes" className="gap-1.5">
              <StickyNote className="size-3.5" />
              Admin Notes
            </TabsTrigger>
            <TabsTrigger value="history" className="gap-1.5">
              <History className="size-3.5" />
              History
            </TabsTrigger>
            <TabsTrigger value="audit" className="gap-1.5">
              <ClipboardList className="size-3.5" />
              Audit Log
            </TabsTrigger>
          </TabsList>
          <TabsContent value="notes" className="mt-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={app.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2 }}
              >
                <AdminNotesTab app={app} onAddNote={onAddNote} />
              </motion.div>
            </AnimatePresence>
          </TabsContent>
          <TabsContent value="history" className="mt-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={app.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2 }}
              >
                <HistoryTab app={app} />
              </motion.div>
            </AnimatePresence>
          </TabsContent>
          <TabsContent value="audit" className="mt-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={app.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2 }}
              >
                <AuditLogTab app={app} />
              </motion.div>
            </AnimatePresence>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}

// ============================================================================
// Main AdminView
// ============================================================================

export default function AdminView() {
  const setView = useApp((s) => s.setView);
  const openFreelancer = useApp((s) => s.openFreelancer);
  const isMobile = useIsMobile();

  const [applications, setApplications] = useState<AdminApplication[]>(
    () => adminApplications,
  );
  const [activeId, setActiveId] = useState<string>(
    () => adminApplications[0].id,
  );

  const activeApp = useMemo(
    () => applications.find((a) => a.id === activeId) ?? applications[0],
    [applications, activeId],
  );

  const toastMsg = useCallback(
    (msg: string, kind: "info" | "success" | "warning" | "error" = "info") => {
      if (kind === "success") return toast.success(msg);
      if (kind === "error") return toast.error(msg);
      if (kind === "warning") return toast.warning(msg);
      toast(msg);
    },
    [],
  );

  // --- Local mutation helpers ---
  const updateApplication = useCallback(
    (id: string, patch: Partial<AdminApplication>) => {
      setApplications((prev) =>
        prev.map((a) => (a.id === id ? { ...a, ...patch } : a)),
      );
    },
    [],
  );

  const updatePortfolioReview = useCallback(
    (appId: string, itemId: string, patch: Partial<PortfolioReviewState>) => {
      setApplications((prev) =>
        prev.map((a) =>
          a.id === appId
            ? {
                ...a,
                portfolioReviews: {
                  ...a.portfolioReviews,
                  [itemId]: { ...a.portfolioReviews[itemId], ...patch },
                },
              }
            : a,
        ),
      );
    },
    [],
  );

  const toggleChecklist = useCallback(
    (appId: string, itemId: string) => {
      setApplications((prev) =>
        prev.map((a) =>
          a.id === appId
            ? {
                ...a,
                checklist: a.checklist.map((c) =>
                  c.id === itemId ? { ...c, checked: !c.checked } : c,
                ),
              }
            : a,
        ),
      );
    },
    [],
  );

  const addNote = useCallback(
    (appId: string, content: string, pinned: boolean) => {
      setApplications((prev) =>
        prev.map((a) => {
          if (a.id !== appId) return a;
          const reviewer = adminReviewers[0];
          const newNote: AdminNote = {
            id: `n-${Date.now()}`,
            applicationId: appId,
            author: reviewer.name,
            authorAvatar: reviewer.avatar,
            timestamp: new Date().toISOString(),
            content,
            pinned,
          };
          const audit = [
            ...a.auditLog,
            {
              id: `a-${Date.now()}`,
              applicationId: appId,
              timestamp: new Date().toISOString(),
              actor: reviewer.name,
              action: pinned ? "ADD_PINNED_NOTE" : "ADD_NOTE",
              details: content.slice(0, 80),
            },
          ];
          return {
            ...a,
            notes: [...a.notes, newNote],
            auditLog: audit,
          };
        }),
      );
      toastMsg("Admin note added.", "success");
    },
    [toastMsg],
  );

  const submitDecision = useCallback(
    (decision: Decision, message: string, note: string) => {
      const appId = activeApp.id;
      const newStatus: AdminApplication["status"] =
        decision === "APPROVE"
          ? "APPROVED"
          : decision === "REJECT"
            ? "REJECTED"
            : "MORE_INFORMATION_REQUIRED";

      const reviewer = adminReviewers[0];
      const nowIso = new Date().toISOString();
      const statusLabel =
        decision === "APPROVE"
          ? "Application Approved"
          : decision === "REJECT"
            ? "Application Rejected"
            : "Information Requested";

      setApplications((prev) =>
        prev.map((a) => {
          if (a.id !== appId) return a;
          const newEvent = {
            id: `h-${Date.now()}`,
            applicationId: appId,
            status: newStatus,
            label: statusLabel,
            timestamp: nowIso,
            actor: reviewer.name,
            note:
              decision === "REJECT"
                ? message
                : decision === "REQUEST_INFORMATION"
                  ? `Requested: ${message}`
                  : "Approved by admin review.",
          };
          const newAudit = {
            id: `a-${Date.now()}`,
            applicationId: appId,
            timestamp: nowIso,
            actor: reviewer.name,
            action:
              decision === "APPROVE"
                ? "APPROVE_APPLICATION"
                : decision === "REJECT"
                  ? "REJECT_APPLICATION"
                  : "REQUEST_INFORMATION",
            reason:
              decision === "REJECT"
                ? message
                : decision === "REQUEST_INFORMATION"
                  ? "Information requested"
                  : "Approved",
            details:
              decision === "APPROVE"
                ? `Status changed ${newStatus}. Profile published.`
                : `Status changed ${newStatus}.`,
          };
          const newNote: AdminNote | null = note.trim()
            ? {
                id: `n-${Date.now()}`,
                applicationId: appId,
                author: reviewer.name,
                authorAvatar: reviewer.avatar,
                timestamp: nowIso,
                content: note.trim(),
              }
            : null;
          return {
            ...a,
            status: newStatus,
            history: [...a.history, newEvent],
            auditLog: [...a.auditLog, newAudit],
            notes: newNote ? [...a.notes, newNote] : a.notes,
          };
        }),
      );

      const actionLabel =
        decision === "APPROVE"
          ? "approved"
          : decision === "REJECT"
            ? "rejected"
            : "marked for more info";
      toastMsg(
        `Application ${appId} ${actionLabel}.`,
        decision === "APPROVE"
          ? "success"
          : decision === "REJECT"
            ? "error"
            : "warning",
      );
    },
    [activeApp.id, toastMsg],
  );

  // --- Navigation ---
  const goToNext = useCallback(() => {
    const idx = applications.findIndex((a) => a.id === activeId);
    const next = applications[(idx + 1) % applications.length];
    setActiveId(next.id);
    toastMsg(`Loaded ${next.id} — ${next.freelancer.name}.`);
  }, [applications, activeId, toastMsg]);

  // --- Keyboard shortcuts ---
  // DecisionPanel registers its setDecision via this ref so keyboard
  // shortcuts can pick APPROVE / REQUEST_INFORMATION / REJECT.
  const setDecisionViaShortcut = useRef<(d: Decision) => void>(() => {});
  const registerShortcut = useCallback(
    (fn: (d: Decision) => void) => {
      setDecisionViaShortcut.current = fn;
    },
    [],
  );

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable ||
          target.tagName === "SELECT")
      ) {
        return;
      }
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const key = e.key.toLowerCase();
      if (key === "a") {
        e.preventDefault();
        setDecisionViaShortcut.current("APPROVE");
        toastMsg("Selected: APPROVE", "success");
      } else if (key === "r") {
        e.preventDefault();
        setDecisionViaShortcut.current("REQUEST_INFORMATION");
        toastMsg("Selected: Request Info", "warning");
      } else if (key === "x") {
        e.preventDefault();
        setDecisionViaShortcut.current("REJECT");
        toastMsg("Selected: Reject", "error");
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [toastMsg]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <AdminHeader onBack={() => setView("home")} />
      <KpiStrip />

        <main className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8 py-6 w-full flex-1">
          {/* Queue + Next */}
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <ApplicationQueue
              apps={applications}
              activeId={activeId}
              onSelect={setActiveId}
              isMobile={isMobile}
            />
            <div className="flex items-center gap-2 ml-auto">
              <div className="hidden md:flex items-center gap-1.5 rounded-md border border-border bg-muted/30 px-2.5 py-1.5 text-[11px] text-muted-foreground">
                <Keyboard className="size-3" />
                <span>
                  <kbd className="font-mono text-[10px] px-1 py-0.5 rounded bg-background border">A</kbd>{" "}
                  Approve ·{" "}
                  <kbd className="font-mono text-[10px] px-1 py-0.5 rounded bg-background border">R</kbd>{" "}
                  Request Info ·{" "}
                  <kbd className="font-mono text-[10px] px-1 py-0.5 rounded bg-background border">X</kbd>{" "}
                  Reject
                </span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={goToNext}
                className="border-[#32504d]/40 text-[#32504d] dark:text-[#9bb3ae] hover:bg-[#32504d]/5 dark:bg-[#32504d]/15 hover:text-[#32504d] dark:text-[#9bb3ae]"
              >
                Next Application
                <ArrowRight className="size-4" />
              </Button>
            </div>
          </div>

          {/* Main 3-column layout */}
          <div className="grid grid-cols-1 lg:grid-cols-[360px_minmax(0,1fr)_380px] gap-4">
            {/* LEFT — Freelancer info */}
            <div className="lg:sticky lg:top-[140px] lg:self-start lg:max-h-[calc(100vh-160px)] lg:overflow-y-auto lg:pr-1 lg:-mr-1">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeApp.id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -8 }}
                  transition={{ duration: 0.2 }}
                >
                  <FreelancerInfoColumn
                    app={activeApp}
                    onOpenPublic={(fid) => {
                      openFreelancer(fid);
                    }}
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* CENTER — Portfolio review */}
            <div className="min-w-0">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeApp.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                >
                  <PortfolioReviewColumn
                    app={activeApp}
                    onUpdateItem={(itemId, patch) =>
                      updatePortfolioReview(activeApp.id, itemId, patch)
                    }
                    onToast={toastMsg}
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* RIGHT — Verification + Risk + Checklist + Decision */}
            <div className="lg:sticky lg:top-[140px] lg:self-start space-y-4 lg:max-h-[calc(100vh-160px)] lg:overflow-y-auto lg:pr-1 lg:-mr-1">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeApp.id}
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 8 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-4"
                >
                  <VerificationPanel app={activeApp} />
                  <RiskPanel app={activeApp} />
                  <ChecklistPanel
                    app={activeApp}
                    onToggle={(id) => toggleChecklist(activeApp.id, id)}
                  />
                  <DecisionPanel
                    app={activeApp}
                    onSubmit={submitDecision}
                    registerShortcut={registerShortcut}
                  />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* BOTTOM — Notes + History + Audit */}
          <div className="mt-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeApp.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
              >
                <BottomSection app={activeApp} onAddNote={addNote} />
              </motion.div>
            </AnimatePresence>
          </div>
        </main>

        {/* Footer */}
        <footer className="mt-auto border-t border-border bg-muted/30">
          <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8 py-4 text-xs text-muted-foreground flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <ShieldCheck className="size-3.5 text-[#32504d] dark:text-[#9bb3ae]" />
              Khidma Admin Review Console · Restricted access
            </div>
            <div>
              Designed &amp; Developed by{" "}
              <span className="font-medium text-foreground">Amara Dhaker</span>
            </div>
          </div>
        </footer>
    </div>
  );
}
