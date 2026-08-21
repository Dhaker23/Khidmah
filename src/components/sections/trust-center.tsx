"use client";

/**
 * TrustCenter
 * -----------
 * Consolidates every Khidma trust signal in one place: identity verification,
 * portfolio review, escrow protection, two-sided reviews, the verification
 * process timeline, security/compliance badges, hard stats, dispute
 * resolution, and a final CTA.
 *
 * Layout:
 *   1. SectionHeading (eyebrow + title + description)
 *   2. 4 pillar cards (icon + title + description)
 *   3. BrandDivider
 *   4. Process timeline (5 steps, horizontal on desktop, vertical on mobile)
 *   5. BrandDivider
 *   6. Security badges row (6 badges)
 *   7. Stats grid (4 cards)
 *   8. Dispute resolution card (3-step process + Learn more)
 *   9. CTA (Become a verified freelancer + Hire trusted talent)
 *
 * Animations respect `prefers-reduced-motion`.
 */

import { motion, useReducedMotion } from "framer-motion";
import {
  ShieldCheck,
  Briefcase,
  Lock,
  Star,
  UserPlus,
  Mail,
  Image as ImageIcon,
  ClipboardCheck,
  BadgeCheck,
  FileCheck2,
  CreditCard,
  KeyRound,
  ScrollText,
  Clock,
  ArrowRight,
  Scale,
  LifeBuoy,
  Users,
  AlertTriangle,
  Gavel,
  CheckCircle2,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Reveal,
  SectionHeading,
  BrandDivider,
} from "@/components/khidma/reveal";
import { useApp } from "@/lib/store";
import { formatNumber, trustStats } from "@/lib/khidma-data";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

/* ----------------------------------------------------------------------------
 * Mock data
 * -------------------------------------------------------------------------- */

interface Pillar {
  icon: LucideIcon;
  title: string;
  description: string;
}

const PILLARS: Pillar[] = [
  {
    icon: ShieldCheck,
    title: "Identity Verification",
    description:
      "Every freelancer's identity is verified via government ID + phone + email. No anonymous accounts, ever.",
  },
  {
    icon: Briefcase,
    title: "Portfolio Review",
    description:
      "Our team reviews portfolio items for authenticity. Admin-verified items display a strong, unmistakable badge.",
  },
  {
    icon: Lock,
    title: "Escrow Protection",
    description:
      "Client funds are held in escrow until milestones are approved. Freelancers get paid for completed work, always.",
  },
  {
    icon: Star,
    title: "Two-sided Reviews",
    description:
      "Both clients and freelancers review each other after every contract. No fake reviews, all tied to real, paid projects.",
  },
];

interface ProcessStep {
  number: number;
  icon: LucideIcon;
  title: string;
  description: string;
}

const PROCESS_STEPS: ProcessStep[] = [
  {
    number: 1,
    icon: UserPlus,
    title: "Registration",
    description: "Create your account with a valid email address.",
  },
  {
    number: 2,
    icon: Mail,
    title: "Email Verify",
    description: "Confirm your email to activate your account.",
  },
  {
    number: 3,
    icon: ImageIcon,
    title: "Profile + Portfolio",
    description: "Complete your profile and upload portfolio items.",
  },
  {
    number: 4,
    icon: ClipboardCheck,
    title: "Admin Review",
    description: "Our team reviews your identity and portfolio.",
  },
  {
    number: 5,
    icon: BadgeCheck,
    title: "Verified Badge",
    description: "Earn the verified badge and unlock Top Rated perks.",
  },
];

interface SecurityBadge {
  icon: LucideIcon;
  label: string;
  sub: string;
}

const SECURITY_BADGES: SecurityBadge[] = [
  { icon: ShieldCheck, label: "GDPR Compliant", sub: "EU regulation" },
  { icon: Lock, label: "Data Encrypted", sub: "AES-256 at rest" },
  { icon: FileCheck2, label: "SOC 2 Ready", sub: "Type II in progress" },
  { icon: CreditCard, label: "PCI DSS", sub: "Via partners" },
  { icon: KeyRound, label: "2FA Available", sub: "TOTP & SMS" },
  { icon: ScrollText, label: "Audit Logs", sub: "All actions tracked" },
];

interface StatItem {
  icon: LucideIcon;
  value: string;
  label: string;
}

const STATS: StatItem[] = [
  {
    icon: ShieldCheck,
    value: "100%",
    label: "of freelancers identity-verified",
  },
  {
    icon: Lock,
    value: "TND 0",
    label: "lost to scams (escrow protected)",
  },
  {
    icon: Clock,
    value: "< 24h",
    label: "average dispute resolution",
  },
  {
    icon: ClipboardCheck,
    value: formatNumber(trustStats.verifiedFreelancers),
    label: "admin-reviewed portfolios",
  },
];

interface DisputeStep {
  step: string;
  title: string;
  description: string;
  icon: LucideIcon;
}

const DISPUTE_STEPS: DisputeStep[] = [
  {
    step: "1",
    title: "Open a dispute",
    description:
      "Either party can flag a contract from the project page. Provide context and any supporting evidence.",
    icon: AlertTriangle,
  },
  {
    step: "2",
    title: "Our team reviews evidence",
    description:
      "A Khidma mediator examines milestones, messages, deliverables, and escrow status, fairly and neutrally.",
    icon: Gavel,
  },
  {
    step: "3",
    title: "Fair resolution within 48h",
    description:
      "Funds are released to the rightful party. Both sides receive a written decision with full reasoning.",
    icon: CheckCircle2,
  },
];

/* ----------------------------------------------------------------------------
 * Pillar card
 * -------------------------------------------------------------------------- */

function PillarCard({
  pillar,
  index,
}: {
  pillar: Pillar;
  index: number;
}) {
  const prefersReduced = useReducedMotion();
  const Icon = pillar.icon;
  return (
    <motion.div
      initial={prefersReduced ? undefined : { opacity: 0, y: 18 }}
      whileInView={prefersReduced ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{
        duration: 0.5,
        delay: prefersReduced ? 0 : index * 0.08,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={prefersReduced ? undefined : { y: -4 }}
      className="h-full"
    >
      <Card className="group h-full p-5 sm:p-6 border-border/60 hover:border-[#32504d]/40 hover:shadow-lg hover:shadow-[#32504d]/8 transition-all duration-300">
        <Icon className="size-5 text-[#32504d] dark:text-[#9bb3ae] mb-4 transition-transform duration-200 group-hover:-translate-y-0.5" />
        <h3 className="font-display text-base font-semibold text-foreground mb-1.5">
          {pillar.title}
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {pillar.description}
        </p>
      </Card>
    </motion.div>
  );
}

/* ----------------------------------------------------------------------------
 * Process timeline
 * -------------------------------------------------------------------------- */

function ProcessTimeline() {
  const prefersReduced = useReducedMotion();
  return (
    <div className="relative">
      {/* Desktop: horizontal line */}
      <div
        className="hidden lg:block absolute top-7 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#32504d]/30 to-transparent"
        aria-hidden
      />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 lg:gap-3 relative">
        {PROCESS_STEPS.map((step, i) => {
          const Icon = step.icon;
          return (
            <motion.div
              key={step.number}
              initial={prefersReduced ? undefined : { opacity: 0, y: 16 }}
              whileInView={prefersReduced ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{
                duration: 0.5,
                delay: prefersReduced ? 0 : i * 0.1,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="relative flex flex-col items-center text-center lg:items-start lg:text-left"
            >
              {/* Mobile vertical connector */}
              {i < PROCESS_STEPS.length - 1 && (
                <div
                  className="lg:hidden absolute left-7 top-14 bottom-[-1.25rem] w-px bg-gradient-to-b from-[#32504d]/30 to-transparent"
                  aria-hidden
                />
              )}
              <div className="relative z-10 flex size-14 items-center justify-center rounded-full bg-background border-2 border-[#32504d]/40 shadow-sm">
                <Icon className="size-6 text-[#32504d] dark:text-[#9bb3ae]" />
                <span className="absolute -top-2 -right-2 size-6 rounded-full bg-[#32504d] text-white text-[11px] font-bold flex items-center justify-center border-2 border-background">
                  {step.number}
                </span>
              </div>
              <h4 className="mt-4 font-display text-sm font-semibold text-foreground">
                {step.title}
              </h4>
              <p className="mt-1 text-xs text-muted-foreground leading-relaxed max-w-[14rem]">
                {step.description}
              </p>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

/* ----------------------------------------------------------------------------
 * Security badge
 * -------------------------------------------------------------------------- */

function SecurityBadgeTile({
  badge,
  index,
}: {
  badge: SecurityBadge;
  index: number;
}) {
  const prefersReduced = useReducedMotion();
  const Icon = badge.icon;
  return (
    <motion.div
      initial={prefersReduced ? undefined : { opacity: 0, scale: 0.96 }}
      whileInView={prefersReduced ? undefined : { opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{
        duration: 0.4,
        delay: prefersReduced ? 0 : index * 0.06,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={prefersReduced ? undefined : { y: -3 }}
      className="group flex items-center gap-3 rounded-xl border border-border/60 bg-card/60 backdrop-blur-sm px-4 py-3 hover:border-[#32504d]/40 transition-colors"
    >
      <Icon className="size-4 text-[#32504d] dark:text-[#9bb3ae] shrink-0 transition-transform duration-200 group-hover:scale-110" />
      <div className="min-w-0">
        <div className="text-sm font-semibold text-foreground truncate">
          {badge.label}
        </div>
        <div className="text-[11px] text-muted-foreground truncate">
          {badge.sub}
        </div>
      </div>
    </motion.div>
  );
}

/* ----------------------------------------------------------------------------
 * Stat card
 * -------------------------------------------------------------------------- */

function StatCard({ stat, index }: { stat: StatItem; index: number }) {
  const prefersReduced = useReducedMotion();
  const Icon = stat.icon;
  return (
    <motion.div
      initial={prefersReduced ? undefined : { opacity: 0, y: 16 }}
      whileInView={prefersReduced ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        duration: 0.5,
        delay: prefersReduced ? 0 : index * 0.08,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="group"
    >
      <Card className="h-full p-5 sm:p-6 border-border/60 hover:border-[#32504d]/40 transition-colors text-center">
        <Icon className="size-5 text-[#32504d] dark:text-[#9bb3ae] mb-3 mx-auto transition-transform duration-200 group-hover:-translate-y-0.5" />
        <div className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          {stat.value}
        </div>
        <div className="mt-1 text-xs sm:text-sm text-muted-foreground leading-snug">
          {stat.label}
        </div>
      </Card>
    </motion.div>
  );
}

/* ----------------------------------------------------------------------------
 * Dispute resolution card
 * -------------------------------------------------------------------------- */

function DisputeCard() {
  const openHelp = useApp((s) => s.openHelp);
  const prefersReduced = useReducedMotion();

  return (
    <Reveal>
      <Card className="overflow-hidden border-[#32504d]/20 dark:border-[#32504d]/30 p-0">
        <div className="grid grid-cols-1 lg:grid-cols-12">
          {/* Left: heading + CTA */}
          <div className="lg:col-span-4 p-6 sm:p-8 bg-gradient-to-br from-[#192d2f] to-[#2b3d3d] text-white relative overflow-hidden">
            <div
              className="absolute inset-0 opacity-[0.06] pointer-events-none"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 30% 20%, #748684 0%, transparent 50%)",
              }}
              aria-hidden
            />
            <div className="relative">
              <Scale className="size-5 text-[#9bb3ae] mb-4" />
              <h3 className="font-display text-xl sm:text-2xl font-bold text-white">
                If something goes wrong
              </h3>
              <p className="mt-2 text-sm text-white/75 leading-relaxed">
                Disputes are rare on Khidma, but when they happen, our team
                resolves them quickly and fairly, with full transparency for
                both sides.
              </p>
              <Button
                type="button"
                variant="secondary"
                onClick={openHelp}
                className="mt-5 bg-white text-[#192d2f] hover:bg-white/90 group"
              >
                <LifeBuoy className="mr-2 size-4" />
                Learn more
                <ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-0.5" />
              </Button>
            </div>
          </div>

          {/* Right: 3 steps */}
          <div className="lg:col-span-8 p-6 sm:p-8">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {DISPUTE_STEPS.map((s, i) => {
                const Icon = s.icon;
                return (
                  <motion.div
                    key={s.step}
                    initial={
                      prefersReduced ? undefined : { opacity: 0, y: 14 }
                    }
                    whileInView={
                      prefersReduced ? undefined : { opacity: 1, y: 0 }
                    }
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{
                      duration: 0.45,
                      delay: prefersReduced ? 0 : 0.1 + i * 0.1,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="relative"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <span className="flex size-7 items-center justify-center rounded-full bg-[#32504d] text-white text-xs font-bold">
                        {s.step}
                      </span>
                      <Icon className="size-4 text-[#32504d] dark:text-[#9bb3ae]" />
                    </div>
                    <h4 className="font-display text-sm font-semibold text-foreground">
                      {s.title}
                    </h4>
                    <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                      {s.description}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </Card>
    </Reveal>
  );
}

/* ----------------------------------------------------------------------------
 * Section
 * -------------------------------------------------------------------------- */

export function TrustCenter() {
  const openOnboarding = useApp((s) => s.openOnboarding);
  const setView = useApp((s) => s.setView);

  return (
    <section
      id="trust-center"
      aria-labelledby="trust-center-heading"
      className="py-16 sm:py-24 bg-gradient-to-b from-[#f7f9f8] via-background to-background dark:from-[#0e1a1b]/40"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="TRUST & SAFETY"
          title={
            <>
              The Khidma{" "}
              <span className="text-[#32504d] dark:text-[#9bb3ae]">
                Trust Center
              </span>
            </>
          }
          description="Everything we do is built around trust. Here's exactly how we protect both freelancers and clients, from identity verification to escrow, reviews, and dispute resolution."
        />

        {/* 4 pillar cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 mb-12 sm:mb-16">
          {PILLARS.map((p, i) => (
            <PillarCard key={p.title} pillar={p} index={i} />
          ))}
        </div>

        <BrandDivider label="VERIFICATION PROCESS" className="mb-10" />

        {/* Process timeline */}
        <Reveal>
          <h3 className="font-display text-xl sm:text-2xl font-bold tracking-tight text-foreground mb-2">
            How a freelancer earns the verified badge
          </h3>
          <p className="text-sm text-muted-foreground mb-8 max-w-2xl">
            Five steps stand between a new signup and a verified profile. Each
            one adds a layer of trust, for clients and for the freelancer's
            own reputation.
          </p>
        </Reveal>
        <ProcessTimeline />

        <BrandDivider label="SECURITY & COMPLIANCE" className="mt-12 mb-10" />

        {/* Security badges */}
        <Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 mb-12 sm:mb-16">
            {SECURITY_BADGES.map((b, i) => (
              <SecurityBadgeTile key={b.label} badge={b} index={i} />
            ))}
          </div>
        </Reveal>

        {/* Stats grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 mb-12 sm:mb-16">
          {STATS.map((s, i) => (
            <StatCard key={s.label} stat={s} index={i} />
          ))}
        </div>

        {/* Dispute resolution */}
        <DisputeCard />

        {/* CTA */}
        <Reveal>
          <div className="mt-12 sm:mt-16 rounded-2xl border border-[#32504d]/20 dark:border-[#32504d]/30 bg-gradient-to-br from-[#32504d]/10 via-[#6e8580]/8 to-[#748684]/10 dark:from-[#32504d]/20 dark:via-[#6e8580]/12 dark:to-[#748684]/15 p-6 sm:p-8 lg:p-10 text-center">
            <div className="flex size-12 items-center justify-center rounded-xl bg-[#32504d] text-white mx-auto mb-4">
              <ShieldCheck className="size-6" />
            </div>
            <h3 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              Start with confidence
            </h3>
            <p className="mt-2 text-sm sm:text-base text-muted-foreground max-w-xl mx-auto">
              Join a marketplace where every freelancer is verified, every
              payment is escrow-protected, and every review is real.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
              <Button
                type="button"
                onClick={openOnboarding}
                className="bg-[#32504d] hover:bg-[#475959] text-white h-11 px-6 group"
              >
                Become a verified freelancer
                <ArrowRight className="ml-2 size-4 transition-transform group-hover:translate-x-0.5" />
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setView("freelancers")}
                className="h-11 px-6 border-[#32504d]/40 text-[#32504d] dark:text-[#9bb3ae] hover:bg-[#32504d]/10 dark:bg-[#32504d]/20 group"
              >
                <Users className="mr-2 size-4" />
                Hire trusted talent
              </Button>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export default TrustCenter;
