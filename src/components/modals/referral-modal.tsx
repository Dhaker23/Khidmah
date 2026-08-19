"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import {
  Gift,
  Copy,
  Check,
  Link2,
  Users,
  UserPlus,
  Trophy,
  Award,
  Medal,
  Crown,
  Sparkles,
  Share2,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { useApp } from "@/lib/store";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

/* ----------------------------------------------------------------------------
 * Inline social SVGs (mirrors share-modal.tsx).
 * -------------------------------------------------------------------------- */
type IconProps = { className?: string };

function XIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}
function FacebookIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" fill="currentColor">
      <path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.69 1.69 0 0 0-.679.622c-.258.42-.371.995-.371 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647Z" />
    </svg>
  );
}
function WhatsAppIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" fill="currentColor">
      <path d="M.057 24l1.687-6.163a11.867 11.867 0 0 1-1.587-5.945C.16 5.335 5.495 0 12.05 0a11.817 11.817 0 0 1 8.413 3.488 11.824 11.824 0 0 1 3.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 0 1-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
    </svg>
  );
}
function LinkedInIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

const SHARE_SOCIALS = [
  {
    key: "x",
    label: "Share on X",
    Icon: XIcon,
    hover: "hover:bg-foreground hover:text-background",
    url: (u: string, t: string) =>
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(u)}&text=${encodeURIComponent(t)}`,
  },
  {
    key: "facebook",
    label: "Share on Facebook",
    Icon: FacebookIcon,
    hover: "hover:bg-[#32504d] hover:text-white",
    url: (u: string) => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(u)}`,
  },
  {
    key: "whatsapp",
    label: "Share on WhatsApp",
    Icon: WhatsAppIcon,
    hover: "hover:bg-[#32504d] hover:text-white",
    url: (u: string, t: string) =>
      `https://api.whatsapp.com/send?text=${encodeURIComponent(`${t} ${u}`)}`,
  },
  {
    key: "linkedin",
    label: "Share on LinkedIn",
    Icon: LinkedInIcon,
    hover: "hover:bg-[#475959] hover:text-white",
    url: (u: string, t: string) =>
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(u)}&summary=${encodeURIComponent(t)}`,
  },
];

const REFERRAL_LINK = "https://khidma.tn/r/AMIRA2025";
const REFERRAL_TEXT = "Join Khidma — Tunisia's most trusted freelance marketplace. We both earn 50 TND when you complete your first project.";

interface ReferralRow {
  name: string;
  initials: string;
  status: "Pending" | "Joined" | "Completed";
  date: string;
  earnings: string;
}

const REFERRALS: ReferralRow[] = [
  { name: "Sami Trabelsi", initials: "ST", status: "Completed", date: "12 Jan 2025", earnings: "+50 TND" },
  { name: "Leila Ben Othman", initials: "LB", status: "Completed", date: "04 Jan 2025", earnings: "+50 TND" },
  { name: "Mehdi Karoui", initials: "MK", status: "Completed", date: "22 Dec 2024", earnings: "+50 TND" },
  { name: "Rania Souissi", initials: "RS", status: "Joined", date: "10 Feb 2025", earnings: "Pending" },
  { name: "Omar Jelassi", initials: "OJ", status: "Pending", date: "18 Feb 2025", earnings: "—" },
];

const TIERS = [
  {
    id: "bronze",
    name: "Bronze",
    range: "1–4 referrals",
    reward: "50 TND per referral",
    icon: Medal,
    accent: "text-amber-700 bg-amber-500/15 border-amber-500/30",
  },
  {
    id: "silver",
    name: "Silver",
    range: "5–9 referrals",
    reward: "75 TND + priority support",
    icon: Award,
    accent: "text-slate-600 bg-slate-400/15 border-slate-400/40",
  },
  {
    id: "gold",
    name: "Gold",
    range: "10+ referrals",
    reward: "100 TND + 10% cashback",
    icon: Crown,
    accent: "text-[#32504d] bg-[#32504d]/15 border-[#32504d]/40",
  },
];

const STATUS_STYLES: Record<ReferralRow["status"], string> = {
  Pending: "bg-muted text-muted-foreground border-border/60",
  Joined: "bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-500/30",
  Completed: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30",
};

const STATS = [
  { label: "Friends Invited", value: 8, icon: Users, accent: "bg-[#32504d]/10 text-[#32504d]" },
  { label: "Joined", value: 5, icon: UserPlus, accent: "bg-amber-500/10 text-amber-700 dark:text-amber-300" },
  { label: "Earned", value: "200 TND", icon: Wallet, accent: "bg-emerald-500/10 text-emerald-700 dark:text-emerald-300" },
];

export function ReferralModal() {
  const { modal, closeReferral } = useApp();
  const prefersReduced = useReducedMotion();
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(REFERRAL_LINK);
      setCopied(true);
      toast.success("Referral link copied!", {
        description: "Share it anywhere — you earn 50 TND when a friend completes their first project.",
      });
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // fallback
      const ta = document.createElement("textarea");
      ta.value = REFERRAL_LINK;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand("copy");
        setCopied(true);
        toast.success("Referral link copied!");
        setTimeout(() => setCopied(false), 1800);
      } catch {
        toast.error("Couldn't copy — please copy the link manually.");
      }
      document.body.removeChild(ta);
    }
  };

  const handleShare = (key: string, url: string) => {
    window.open(url, "_blank", "noopener,noreferrer,width=620,height=640");
    toast.info(`Opening ${key}…`, { description: "Share your link to start earning." });
  };

  // Progress to Gold tier: 5 of 7 → next tier Silver/Gold boundary
  const current = 5;
  const target = 7;
  const pct = Math.min(100, Math.round((current / target) * 100));

  return (
    <Dialog open={modal.referralOpen} onOpenChange={(o) => !o && closeReferral()}>
      <DialogPortal>
        <DialogOverlay className="bg-[#192d2f]/70 backdrop-blur-sm" />
        <DialogContent
          className="max-w-2xl w-[calc(100%-1.5rem)] max-h-[90vh] overflow-y-auto p-0 gap-0"
          aria-describedby={undefined}
          showCloseButton
        >
          <DialogTitle className="sr-only">Invite friends. Earn together.</DialogTitle>
          <DialogDescription className="sr-only">
            Share your Khidma referral link with friends. Give 50 TND, get 50 TND when they complete their first project.
          </DialogDescription>

          {/* Header */}
          <div className="relative px-5 sm:px-6 pt-6 pb-5 border-b border-border/60 bg-gradient-to-br from-[#32504d] via-[#2b3d3d] to-[#192d2f] text-white overflow-hidden">
            <div className="absolute -top-10 -right-10 size-40 rounded-full bg-white/5 blur-2xl pointer-events-none" />
            <div className="absolute -bottom-12 -left-8 size-32 rounded-full bg-[#748684]/20 blur-2xl pointer-events-none" />
            <div className="relative flex items-start gap-3">
              <div className="size-11 rounded-2xl bg-white/15 backdrop-blur grid place-items-center shrink-0">
                <Gift className="size-6" />
              </div>
              <div>
                <h2 className="font-display font-bold text-xl sm:text-2xl tracking-tight">
                  Invite friends. Earn together.
                </h2>
                <p className="text-sm text-white/80 mt-1 max-w-md">
                  Give 50 TND, get 50 TND when they complete their first project.
                </p>
              </div>
            </div>
          </div>

          <div className="p-5 sm:p-6 space-y-5">
            {/* Referral link card */}
            <div className="rounded-xl border border-border/70 bg-card p-4 sm:p-4">
              <label
                htmlFor="referral-link"
                className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground"
              >
                Your referral link
              </label>
              <div className="mt-1.5 flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                  <Link2 className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
                  <Input
                    id="referral-link"
                    readOnly
                    value={REFERRAL_LINK}
                    onFocus={(e) => e.currentTarget.select()}
                    className="pl-8 pr-2 h-10 text-xs font-mono bg-muted/40 border-border/60 truncate focus-visible:ring-[#32504d]/30"
                    aria-label="Your referral link"
                  />
                </div>
                <Button
                  type="button"
                  size="sm"
                  onClick={handleCopy}
                  className={cn(
                    "h-10 px-3 shrink-0 transition-colors",
                    copied
                      ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                      : "bg-[#2b3d3d] hover:bg-[#192d2f] text-white"
                  )}
                >
                  {copied ? (
                    <>
                      <Check className="size-4" /> Copied
                    </>
                  ) : (
                    <>
                      <Copy className="size-4" /> Copy link
                    </>
                  )}
                </Button>
              </div>
              {/* Share row */}
              <div className="mt-3 flex flex-wrap gap-2">
                {SHARE_SOCIALS.map((s) => {
                  const Icon = s.Icon;
                  return (
                    <motion.button
                      key={s.key}
                      type="button"
                      whileHover={prefersReduced ? undefined : { y: -2 }}
                      whileTap={prefersReduced ? undefined : { scale: 0.94 }}
                      onClick={() =>
                        handleShare(s.label.replace("Share on ", ""), s.url(REFERRAL_LINK, REFERRAL_TEXT))
                      }
                      aria-label={s.label}
                      title={s.label}
                      className={cn(
                        "flex size-9 items-center justify-center rounded-full border border-border/70 bg-background text-foreground/80 transition-colors",
                        s.hover
                      )}
                    >
                      <Icon className="size-4" />
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-2.5">
              {STATS.map((stat) => {
                const Icon = stat.icon;
                return (
                  <div
                    key={stat.label}
                    className="rounded-xl border border-border/70 bg-card p-3 text-center"
                  >
                    <div className={cn("mx-auto size-7 rounded-lg grid place-items-center mb-1.5", stat.accent)}>
                      <Icon className="size-4" />
                    </div>
                    <p className="font-display text-lg font-bold leading-none">
                      {stat.value}
                    </p>
                    <p className="text-[10px] text-muted-foreground mt-1 leading-tight">
                      {stat.label}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Progress card */}
            <div className="rounded-xl border border-[#32504d]/30 bg-gradient-to-br from-[#32504d]/10 to-transparent p-4">
              <div className="flex items-center justify-between gap-2 mb-2">
                <p className="text-sm font-semibold inline-flex items-center gap-1.5">
                  <TrendingUp className="size-4 text-[#32504d]" />
                  You&apos;re 2 referrals away from Gold tier!
                </p>
                <Badge className="bg-[#32504d]/15 text-[#32504d] border-0">
                  {current} / {target}
                </Badge>
              </div>
              <Progress
                value={pct}
                className="h-2 bg-[#32504d]/15"
              />
              <p className="text-xs text-muted-foreground mt-2.5">
                Reach <span className="font-semibold text-[#32504d]">Gold tier</span> to unlock{" "}
                <span className="font-medium">10% cashback on all earnings for 30 days</span>.
              </p>
            </div>

            {/* How it works */}
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                How it works
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {[
                  {
                    n: 1,
                    title: "Share your link",
                    desc: "Send your unique referral link to friends.",
                    icon: Share2,
                  },
                  {
                    n: 2,
                    title: "Friend signs up",
                    desc: "They register & complete their first project.",
                    icon: UserPlus,
                  },
                  {
                    n: 3,
                    title: "You both earn 50 TND",
                    desc: "Credited automatically to your wallets.",
                    icon: Gift,
                  },
                ].map((step) => {
                  const Icon = step.icon;
                  return (
                    <div
                      key={step.n}
                      className="relative rounded-xl border border-border/70 bg-card p-3.5"
                    >
                      <div className="absolute -top-2 -left-2 size-6 rounded-full bg-[#32504d] text-white grid place-items-center text-[10px] font-bold shadow-sm">
                        {step.n}
                      </div>
                      <Icon className="size-5 text-[#32504d] mb-1.5 mt-1" />
                      <p className="text-sm font-semibold leading-tight">{step.title}</p>
                      <p className="text-[11px] text-muted-foreground mt-1 leading-snug">
                        {step.desc}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Recent referrals */}
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                Recent referrals
              </h3>
              <div className="rounded-xl border border-border/70 bg-card overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/40 hover:bg-muted/40">
                      <TableHead className="text-[10px] uppercase tracking-wider">Friend</TableHead>
                      <TableHead className="text-[10px] uppercase tracking-wider">Status</TableHead>
                      <TableHead className="text-[10px] uppercase tracking-wider hidden sm:table-cell">Date</TableHead>
                      <TableHead className="text-[10px] uppercase tracking-wider text-right">Earnings</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {REFERRALS.map((r) => (
                      <TableRow key={r.name}>
                        <TableCell className="py-2.5">
                          <div className="flex items-center gap-2">
                            <div className="size-7 rounded-full bg-[#32504d] text-white grid place-items-center text-[10px] font-bold">
                              {r.initials}
                            </div>
                            <span className="text-xs font-medium">{r.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={cn("text-[10px] font-medium", STATUS_STYLES[r.status])}
                          >
                            {r.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-[11px] text-muted-foreground hidden sm:table-cell">
                          {r.date}
                        </TableCell>
                        <TableCell className="text-right text-xs font-semibold">
                          {r.earnings}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>

            {/* Tier rewards */}
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 inline-flex items-center gap-1.5">
                <Trophy className="size-3.5 text-[#32504d]" />
                Tier rewards
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {TIERS.map((t) => {
                  const Icon = t.icon;
                  return (
                    <div
                      key={t.id}
                      className={cn(
                        "rounded-xl border p-3.5 bg-card",
                        t.id === "gold" ? "border-[#32504d]/40 ring-1 ring-[#32504d]/15" : "border-border/70"
                      )}
                    >
                      <div className={cn("inline-flex size-8 rounded-lg grid place-items-center border mb-2", t.accent)}>
                        <Icon className="size-4" />
                      </div>
                      <p className="text-sm font-bold">{t.name}</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">{t.range}</p>
                      <p className="text-xs font-medium text-foreground/90 mt-1.5 leading-snug">
                        {t.reward}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="px-5 sm:px-6 py-4 border-t border-border/60 bg-gradient-to-b from-[#32504d]/5 to-transparent flex flex-col sm:flex-row sm:items-center gap-2 sm:justify-between">
            <p className="text-xs text-muted-foreground inline-flex items-center gap-1.5">
              <Sparkles className="size-3.5 text-[#32504d]" />
              Start inviting your network today
            </p>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={closeReferral}
                className="text-xs text-muted-foreground"
              >
                Maybe later
              </Button>
              <Button
                type="button"
                size="sm"
                onClick={handleCopy}
                className="bg-[#2b3d3d] hover:bg-[#192d2f] text-white"
              >
                <Share2 className="size-3.5" />
                Share referral link
              </Button>
            </div>
          </div>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}

export default ReferralModal;
