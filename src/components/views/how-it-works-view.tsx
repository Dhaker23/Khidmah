"use client";

import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  UserPlus,
  MailCheck,
  UserCircle,
  Camera,
  Briefcase,
  History,
  FolderKanban,
  Send,
  ShieldCheck,
  CheckCircle2,
  BadgeCheck,
  Search,
  FileText,
  Handshake,
  FileSignature,
  Wallet,
  Eye,
  Unlock,
  Star,
  Users2,
  Layers,
  Globe,
  Building2,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  withdrawalMethods,
  reviews,
  formatNumber,
} from "@/lib/khidma-data";
import { useApp } from "@/lib/store";
import { cn } from "@/lib/utils";

/* ---------- shared sub-components ---------- */

interface Step {
  title: string;
  description: string;
  icon: LucideIcon;
}

interface Phase {
  id: string;
  name: string;
  description: string;
  icon: LucideIcon;
  accent: string;
  steps: Step[];
}

function PhaseHeader({ phase, idx }: { phase: Phase; idx: number }) {
  const Icon = phase.icon;
  return (
    <div className="flex items-center gap-3 mb-5">
      <div className="relative flex size-12 items-center justify-center rounded-xl bg-[#32504d]/10 dark:bg-[#32504d]/20">
        <Icon className="size-6 text-[#32504d] dark:text-[#9bb3ae]" />
        <span className="absolute -top-2 -right-2 size-6 rounded-full bg-[#2b3d3d] text-white text-[10px] font-bold flex items-center justify-center">
          {idx}
        </span>
      </div>
      <div>
        <h3 className="font-display text-lg sm:text-xl font-semibold text-foreground">
          {phase.name}
        </h3>
        <p className="text-sm text-muted-foreground">{phase.description}</p>
      </div>
    </div>
  );
}

function VerticalTimeline({ steps }: { steps: Step[] }) {
  return (
    <div className="relative pl-8 sm:pl-10">
      {/* connecting line */}
      <div className="absolute left-3 sm:left-5 top-3 bottom-3 w-px bg-gradient-to-b from-[#32504d]/40 via-[#32504d]/15 to-transparent" />
      <ol className="space-y-4">
        {steps.map((step, i) => {
          const Icon = step.icon;
          return (
            <motion.li
              key={`${step.title}-${i}`}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.35, delay: i * 0.04 }}
              className="relative"
            >
              {/* number circle */}
              <div className="absolute -left-8 sm:-left-10 top-2 size-8 rounded-full bg-background border-2 border-[#32504d] flex items-center justify-center text-[11px] font-bold text-[#32504d] dark:text-[#9bb3ae]">
                {i + 1}
              </div>
              <Card className="khidma-card p-4 hover:border-[#32504d]/40">
                <div className="flex items-start gap-3">
                  <div className="size-8 shrink-0 rounded-lg bg-[#32504d]/10 dark:bg-[#32504d]/20 flex items-center justify-center">
                    <Icon className="size-4 text-[#32504d] dark:text-[#9bb3ae]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-sm text-foreground">
                      {step.title}
                    </h4>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                </div>
              </Card>
            </motion.li>
          );
        })}
      </ol>
    </div>
  );
}

function HorizontalStepGrid({ steps }: { steps: Step[] }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {steps.map((step, i) => {
        const Icon = step.icon;
        return (
          <motion.div
            key={`${step.title}-${i}`}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
          >
            <Card className="khidma-card h-full p-4 hover:border-[#475959]/40">
              <div className="flex items-center justify-between mb-3">
                <div className="size-9 rounded-lg bg-[#475959]/10 dark:bg-[#475959]/20 flex items-center justify-center">
                  <Icon className="size-4 text-[#475959] dark:text-[#94a8a4]" />
                </div>
                <span className="font-display text-2xl font-bold text-[#475959] dark:text-[#94a8a4]/15 leading-none">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
              <h4 className="font-semibold text-sm text-foreground">
                {step.title}
              </h4>
              <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                {step.description}
              </p>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}

/* ---------- phase data ---------- */

const freelancerPhases: Phase[] = [
  {
    id: "onboarding",
    name: "Phase 1 , Onboarding",
    description: "Open your account and prove who you are.",
    icon: UserPlus,
    accent: "#32504d",
    steps: [
      {
        title: "Register your account",
        description:
          "Sign up with email, set a username and password, choose the freelancer role.",
        icon: UserPlus,
      },
      {
        title: "Email verification",
        description:
          "Confirm your email address by clicking the verification link we send you.",
        icon: MailCheck,
      },
      {
        title: "Create your profile",
        description:
          "Add basic personal info , first/last name, country, city, and a short intro.",
        icon: UserCircle,
      },
      {
        title: "Upload profile photo",
        description:
          "Upload a clear, professional headshot. Photo must match your national ID.",
        icon: Camera,
      },
    ],
  },
  {
    id: "profile",
    name: "Phase 2 , Build Your Profile",
    description: "Tell us what you do and prove you can do it.",
    icon: Briefcase,
    accent: "#475959",
    steps: [
      {
        title: "Add professional info",
        description:
          "Set your title, bio, years of experience, hourly rate, and starting price.",
        icon: Briefcase,
      },
      {
        title: "Add skills",
        description:
          "Pick from category-organized skill chips. Skills power your matching.",
        icon: Layers,
      },
      {
        title: "Add experience",
        description:
          "List previous positions, companies, durations, and key skills used.",
        icon: History,
      },
      {
        title: "Add portfolio",
        description:
          "Upload projects with covers, descriptions, roles, and live/repo links.",
        icon: FolderKanban,
      },
      {
        title: "Submit application",
        description:
          "Review everything, preview your public profile, and submit for review.",
        icon: Send,
      },
    ],
  },
  {
    id: "verification",
    name: "Phase 3 , Verification & Approval",
    description: "Our team reviews your application and grants badges.",
    icon: ShieldCheck,
    accent: "#2b3d3d",
    steps: [
      {
        title: "Admin review",
        description:
          "Our moderation team manually reviews your profile within 48 hours.",
        icon: Eye,
      },
      {
        title: "Approved",
        description:
          "Once approved, you can apply for jobs and publish services on Khidma.",
        icon: CheckCircle2,
      },
      {
        title: "Verified",
        description:
          "Email, phone, identity, and portfolio badges appear on your public profile.",
        icon: BadgeCheck,
      },
    ],
  },
  {
    id: "work",
    name: "Phase 4 , Work, Earn, Grow",
    description: "Find clients, deliver, and get paid , protected every step.",
    icon: Wallet,
    accent: "#6e8580",
    steps: [
      {
        title: "Apply for jobs",
        description:
          "Submit proposals to open jobs posted by verified clients.",
        icon: Send,
      },
      {
        title: "Create services",
        description:
          "Publish pre-packaged services with tiered pricing (Basic/Standard/Premium).",
        icon: Layers,
      },
      {
        title: "Get clients",
        description:
          "Receive invites and direct messages from clients interested in your work.",
        icon: Users2,
      },
      {
        title: "Contracts",
        description:
          "Sign escrow-protected contracts with milestones, deadlines, and scope.",
        icon: FileSignature,
      },
      {
        title: "Milestones",
        description:
          "Break work into milestones. Each is funded before you start.",
        icon: Briefcase,
      },
      {
        title: "Work & deliver",
        description:
          "Submit deliverables against milestones and communicate progress.",
        icon: FolderKanban,
      },
      {
        title: "Client approval",
        description:
          "Client reviews deliverables and approves each milestone.",
        icon: CheckCircle2,
      },
      {
        title: "Earnings",
        description:
          "Approved milestones release funds to your available balance.",
        icon: Wallet,
      },
      {
        title: "Withdrawal",
        description:
          "Withdraw earnings via BIAT, Zitouna, D17, Tunisian Post, or international transfer.",
        icon: Unlock,
      },
    ],
  },
];

const clientPhases: Phase[] = [
  {
    id: "post-find",
    name: "Phase 1 , Post & Find",
    description: "Describe your project and start receiving interest.",
    icon: FileText,
    accent: "#32504d",
    steps: [
      {
        title: "Post a job",
        description:
          "Describe scope, budget, timeline, and required skills. Free to post.",
        icon: FileText,
      },
      {
        title: "Search freelancers",
        description:
          "Browse 1,248+ verified freelancers filtered by category, skill, rate.",
        icon: Search,
      },
      {
        title: "Invite freelancers",
        description:
          "Send targeted invitations to freelancers who match your project.",
        icon: Handshake,
      },
    ],
  },
  {
    id: "contract-fund",
    name: "Phase 2 , Contract & Fund",
    description: "Lock scope, agree on milestones, and fund safely.",
    icon: FileSignature,
    accent: "#475959",
    steps: [
      {
        title: "Compare profiles",
        description:
          "Review proposals, portfolios, ratings, and reviews side-by-side.",
        icon: Layers,
      },
      {
        title: "Sign contract",
        description:
          "Agree on scope, milestones, deadlines. The contract is escrow-protected.",
        icon: FileSignature,
      },
      {
        title: "Fund milestone",
        description:
          "Deposit milestone funds into escrow. Funds are held safely until approval.",
        icon: Wallet,
      },
    ],
  },
  {
    id: "review-pay",
    name: "Phase 3 , Review & Pay",
    description: "Approve work, release payment, and build reputation.",
    icon: CheckCircle2,
    accent: "#6e8580",
    steps: [
      {
        title: "Review work",
        description:
          "Receive deliverables per milestone. Request revisions or approve.",
        icon: Eye,
      },
      {
        title: "Release payment",
        description:
          "On approval, escrow funds release instantly to the freelancer.",
        icon: Unlock,
      },
      {
        title: "Leave review",
        description:
          "Rate the freelancer across communication, quality, delivery, professionalism.",
        icon: Star,
      },
    ],
  },
];

/* ---------- trust, payment, reviews sections ---------- */

const trustCards = [
  {
    icon: ShieldCheck,
    title: "Verification Badges",
    description:
      "Every freelancer passes email, phone, identity, and portfolio verification. Top Rated status is earned after 10+ 5-star reviews.",
    points: ["Email Verified", "Phone Verified", "Identity Verified", "Portfolio Reviewed", "Top Rated"],
  },
  {
    icon: Wallet,
    title: "1% Platform Fee",
    description:
      "Khima charges a flat 1% fee on every transaction , no subscriptions, no credits, no hidden cuts. Freelancers keep 99% of their earnings.",
    points: ["No subscriptions", "No credits", "No bid limits", "Transparent pricing", "99% to the freelancer"],
  },
  {
    icon: FileSignature,
    title: "Escrow Protection",
    description:
      "Milestone funds are held safely in escrow. Released to the freelancer only when you approve the work. Disputes resolved within 7 days.",
    points: ["Funds held safely", "Release on approval", "7-day dispute resolution", "Protected for both sides", "Full audit trail"],
  },
];

const reviewMetrics = [
  { key: "communication", label: "Communication", value: 4.9, color: "#32504d" },
  { key: "quality", label: "Quality of Work", value: 4.8, color: "#475959" },
  { key: "delivery", label: "On-time Delivery", value: 4.7, color: "#748684" },
  { key: "professionalism", label: "Professionalism", value: 4.9, color: "#6e8580" },
];

/* ---------- main view ---------- */

export function HowItWorksView() {
  const { setView, openOnboarding } = useApp();

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-10 sm:mb-14"
      >
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setView("home")}
          className="mb-4 text-muted-foreground hover:text-[#2b3d3d] dark:text-[#94a8a4] -ml-2"
        >
          <ArrowLeft className="size-4" />
          Back to home
        </Button>
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#748684]">
          How Khidma Works
        </span>
        <h1 className="mt-2 font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground max-w-3xl">
          A transparent path from sign-up to payout
        </h1>
        <p className="mt-4 text-base text-muted-foreground max-w-2xl">
          Khidma is built around trust. Every freelancer is verified, every
          contract is escrow-protected, and every payment is transparent.
          Here&apos;s the full picture , for freelancers, for clients, and
          for the platform itself.
        </p>
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Badge variant="secondary" className="gap-1">
            <ShieldCheck className="size-3" /> 1,248 verified freelancers
          </Badge>
          <Badge variant="secondary" className="gap-1">
            <Wallet className="size-3" /> TND 1.24M paid out
          </Badge>
          <Badge variant="secondary" className="gap-1">
            <Globe className="size-3" /> 41 countries
          </Badge>
        </div>
      </motion.div>

      {/* ==================== FOR FREELANCERS ==================== */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mb-16 sm:mb-24"
      >
        <div className="flex items-center gap-3 mb-2">
          <span className="inline-flex items-center gap-2 rounded-full bg-[#32504d]/10 dark:bg-[#32504d]/20 px-3 py-1 text-xs font-semibold text-[#32504d] dark:text-[#9bb3ae]">
            <UserPlus className="size-3.5" />
            For Freelancers
          </span>
          <span className="text-xs text-muted-foreground">
            21-step lifecycle
          </span>
        </div>
        <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground mb-2">
          From sign-up to your first withdrawal
        </h2>
        <p className="text-sm sm:text-base text-muted-foreground mb-10 max-w-2xl">
          Four phases: onboarding, profile building, verification, and work.
          Each step is intentional , designed to build real trust and earn
          you real money.
        </p>

        <div className="space-y-12">
          {freelancerPhases.map((phase, i) => (
            <div key={phase.id}>
              <PhaseHeader phase={phase} idx={i + 1} />
              <VerticalTimeline steps={phase.steps} />
            </div>
          ))}
        </div>
      </motion.section>

      <Separator className="mb-16 sm:mb-24" />

      {/* ==================== FOR CLIENTS ==================== */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mb-16 sm:mb-24"
      >
        <div className="flex items-center gap-3 mb-2">
          <span className="inline-flex items-center gap-2 rounded-full bg-[#475959]/10 dark:bg-[#475959]/20 px-3 py-1 text-xs font-semibold text-[#475959] dark:text-[#94a8a4]">
            <FileText className="size-3.5" />
            For Clients
          </span>
          <span className="text-xs text-muted-foreground">
            9-step lifecycle
          </span>
        </div>
        <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground mb-2">
          From posting your job to leaving a review
        </h2>
        <p className="text-sm sm:text-base text-muted-foreground mb-10 max-w-2xl">
          Three phases: post & find, contract & fund, review & pay. Escrow
          protects every milestone , you only release payment when work is
          approved.
        </p>

        <div className="space-y-10">
          {clientPhases.map((phase, i) => (
            <div key={phase.id}>
              <PhaseHeader phase={phase} idx={i + 1} />
              <HorizontalStepGrid steps={phase.steps} />
            </div>
          ))}
        </div>
      </motion.section>

      <Separator className="mb-16 sm:mb-24" />

      {/* ==================== TRUST SYSTEM ==================== */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mb-16 sm:mb-24"
      >
        <div className="flex items-center gap-3 mb-2">
          <span className="inline-flex items-center gap-2 rounded-full bg-[#2b3d3d]/10 dark:bg-[#2b3d3d]/25 px-3 py-1 text-xs font-semibold text-[#2b3d3d] dark:text-[#94a8a4]">
            <ShieldCheck className="size-3.5" />
            Trust System
          </span>
        </div>
        <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground mb-2">
          Three layers of trust, working together
        </h2>
        <p className="text-sm sm:text-base text-muted-foreground mb-10 max-w-2xl">
          Verification badges, transparent 1% fee, and escrow protection.
          Together they make Khidma the safest place to freelance in Tunisia.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {trustCards.map((card, i) => {
            const Icon = card.icon;
            return (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
              >
                <Card className="khidma-card h-full p-6 hover:border-[#32504d]/40">
                  <div className="size-12 rounded-xl bg-[#32504d]/10 dark:bg-[#32504d]/20 flex items-center justify-center mb-4">
                    <Icon className="size-6 text-[#32504d] dark:text-[#9bb3ae]" />
                  </div>
                  <h3 className="font-display text-lg font-semibold text-foreground">
                    {card.title}
                  </h3>
                  <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                    {card.description}
                  </p>
                  <Separator className="my-4" />
                  <ul className="space-y-1.5">
                    {card.points.map((pt) => (
                      <li
                        key={pt}
                        className="flex items-center gap-2 text-xs text-muted-foreground"
                      >
                        <CheckCircle2 className="size-3.5 text-[#32504d] dark:text-[#9bb3ae]" />
                        {pt}
                      </li>
                    ))}
                  </ul>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </motion.section>

      {/* ==================== PAYMENT & WITHDRAWALS ==================== */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mb-16 sm:mb-24"
      >
        <div className="flex items-center gap-3 mb-2">
          <span className="inline-flex items-center gap-2 rounded-full bg-[#6e8580]/10 px-3 py-1 text-xs font-semibold text-[#6e8580]">
            <Wallet className="size-3.5" />
            Payment & Withdrawals
          </span>
        </div>
        <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground mb-2">
          Get paid your way
        </h2>
        <p className="text-sm sm:text-base text-muted-foreground mb-8 max-w-2xl">
          Withdraw your earnings through local Tunisian banks, mobile money,
          Tunisian Post, or international transfers. Transparent fees, fast
          processing.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {withdrawalMethods.map((m, i) => (
            <motion.div
              key={m.id}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ duration: 0.35, delay: i * 0.03 }}
            >
              <Card className="khidma-card h-full p-4 hover:border-[#32504d]/40 flex items-start gap-3">
                <div className="size-11 rounded-xl bg-[#32504d]/10 dark:bg-[#32504d]/20 flex items-center justify-center text-xl shrink-0">
                  {m.logo}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="font-semibold text-sm text-foreground truncate">
                      {m.name}
                    </h4>
                  </div>
                  <div className="flex items-center gap-2 mt-1.5">
                    <Badge
                      variant="outline"
                      className="text-[10px] py-0 h-5"
                    >
                      {m.type}
                    </Badge>
                    <span className="text-[11px] text-muted-foreground">
                      Fee: <span className="font-medium text-foreground">{m.fee}</span>
                    </span>
                  </div>
                  <p className="text-[11px] text-muted-foreground mt-1">
                    ⏱ {m.time}
                  </p>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* payment explainer strip */}
        <Card className="mt-6 p-5 bg-gradient-to-r from-[#192d2f] to-[#2b3d3d] border-0 text-white">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 justify-between">
            <div className="flex items-center gap-3">
              <Wallet className="size-6 text-white/80" />
              <div>
                <h4 className="font-display font-semibold">
                  99% to you. 1% to Khidma. Always.
                </h4>
                <p className="text-xs text-white/70">
                  No subscriptions, no credits, no bid limits. Transparent
                  pricing on every transaction.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="rounded-full bg-white/10 px-3 py-1">
                Project: <span className="font-semibold">1,000 TND</span>
              </span>
              <ArrowRight className="size-4 opacity-50" />
              <span className="rounded-full bg-white px-3 py-1 text-[#192d2f] font-semibold">
                You receive: 990 TND
              </span>
            </div>
          </div>
        </Card>
      </motion.section>

      <Separator className="mb-16 sm:mb-24" />

      {/* ==================== REVIEWS & REPUTATION ==================== */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="mb-16 sm:mb-24"
      >
        <div className="flex items-center gap-3 mb-2">
          <span className="inline-flex items-center gap-2 rounded-full bg-[#748684]/10 px-3 py-1 text-xs font-semibold text-[#748684]">
            <Star className="size-3.5" />
            Reviews & Reputation
          </span>
        </div>
        <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground mb-2">
          Two-sided reputation that actually means something
        </h2>
        <p className="text-sm sm:text-base text-muted-foreground mb-8 max-w-2xl">
          Every contract ends with a 4-metric review. Freelancers are rated
          on Communication, Quality, Delivery, and Professionalism. Clients
          are rated on clarity, payment speed, and respect.
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* metric breakdown */}
          <Card className="p-6">
            <h3 className="font-display text-lg font-semibold text-foreground mb-5">
              Freelancer metrics , average on Khidma
            </h3>
            <div className="space-y-4">
              {reviewMetrics.map((m, i) => (
                <motion.div
                  key={m.key}
                  initial={{ opacity: 0, width: 0 }}
                  whileInView={{ opacity: 1, width: "100%" }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.08 }}
                >
                  <div className="flex items-center justify-between text-sm mb-1.5">
                    <span className="font-medium text-foreground">
                      {m.label}
                    </span>
                    <span className="font-semibold text-foreground">
                      {m.value.toFixed(1)}
                      <span className="text-muted-foreground font-normal text-xs">
                        /5
                      </span>
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${(m.value / 5) * 100}%`,
                        backgroundColor: m.color,
                      }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
            <div className="mt-5 pt-5 border-t border-border/60 flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Overall rating</span>
              <div className="flex items-center gap-1">
                <Star className="size-4 fill-amber-400 text-amber-400" />
                <span className="font-bold text-foreground">4.9</span>
                <span className="text-muted-foreground text-xs">
                  / 5 · {formatNumber(8420)} reviews
                </span>
              </div>
            </div>
          </Card>

          {/* sample review */}
          <Card className="p-6 bg-gradient-to-br from-[#192d2f] to-[#2b3d3d] border-0 text-white">
            <div className="flex items-center gap-1 mb-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className="size-4 fill-amber-400 text-amber-400"
                />
              ))}
            </div>
            <p className="text-base text-white/90 leading-relaxed">
              &ldquo;{reviews[0]?.comment}&rdquo;
            </p>
            <div className="mt-5 pt-5 border-t border-white/10 flex items-center justify-between">
              <div>
                <div className="font-semibold">{reviews[0]?.fromName}</div>
                <div className="text-xs text-white/70">
                  {reviews[0]?.project}
                </div>
              </div>
              <div className="text-xs text-white/60">
                {reviews[0]?.date}
              </div>
            </div>
            {/* metrics mini */}
            <div className="mt-5 grid grid-cols-4 gap-2 text-center">
              {(["communication", "quality", "delivery", "professionalism"] as const).map((k) => (
                <div
                  key={k}
                  className="rounded-lg bg-white/5 py-2 px-1"
                >
                  <div className="text-[10px] text-white/60 uppercase tracking-wider">
                    {k.slice(0, 4)}
                  </div>
                  <div className="text-sm font-semibold mt-0.5">
                    {reviews[0]?.metrics[k]}.0
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </motion.section>

      {/* ==================== CTA ==================== */}
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <Card className="relative overflow-hidden border-0 bg-[#192d2f] text-white p-8 sm:p-12">
          <div
            className="absolute inset-0 opacity-25 pointer-events-none"
            style={{
              backgroundImage:
                "radial-gradient(circle at 20% 30%, rgba(116,134,132,0.4) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(50,80,77,0.4) 0%, transparent 55%)",
            }}
          />
          <div className="relative flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.2em] text-[#94a8a4] mb-3">
                <Building2 className="size-3.5" />
                Ready to start?
              </div>
              <h2 className="font-display text-2xl sm:text-3xl font-bold">
                Join Khidma today.
              </h2>
              <p className="text-sm sm:text-base text-white/70 mt-2 max-w-xl">
                Become a verified freelancer and unlock jobs, services, and
                escrow-protected contracts. Or post a job and start receiving
                proposals in minutes.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 shrink-0">
              <Button
                size="lg"
                onClick={openOnboarding}
                className="bg-white text-[#192d2f] hover:bg-white/90 group"
              >
                Become a Verified Freelancer
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => setView("jobs")}
                className="border-white/30 text-white hover:bg-white/10 hover:text-white group"
              >
                Post a Job
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
              </Button>
            </div>
          </div>
        </Card>
      </motion.section>
    </div>
  );
}

export default HowItWorksView;
