"use client";

/**
 * TeamsModal
 * ----------
 * "Khidma for Teams" — for agencies, studios, and growing teams hiring
 * multiple freelancers. Opened via `openTeams()` from the footer or
 * the Pricing section's "Compare with Pro" upsell.
 *
 * Structure:
 *   - Header (Khidma gradient)
 *   - Hero strip with trust badges
 *   - 6-feature grid
 *   - 2-tier pricing comparison (Team / Enterprise)
 *   - 3-tab use cases (Marketing Agencies / Software Studios / Enterprise)
 *   - CTA: "Book a demo" + "Compare with Pro"
 *   - 4-question FAQ accordion
 *
 * Self-renders based on `modal.teamsOpen` from `useApp()`.
 */

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogContent,
  DialogTitle,
  DialogDescription,
  DialogHeader,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  X,
  Users,
  Briefcase,
  Wallet,
  FileText,
  BarChart3,
  Headphones,
  Check,
  ArrowRight,
  Quote,
  CalendarDays,
  Building2,
  Megaphone,
  Code2,
} from "lucide-react";
import { useApp } from "@/lib/store";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

/* ----------------------------------------------------------------------------
 * Data
 * -------------------------------------------------------------------------- */

interface Feature {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}

const FEATURES: Feature[] = [
  {
    icon: Briefcase,
    title: "Team Workspaces",
    description:
      "Separate workspaces for each project, shared freelancer pool, and role-based access for owners, managers, and reviewers.",
  },
  {
    icon: Users,
    title: "Bulk Hiring",
    description:
      "Post multiple roles, invite freelancers in batches, and track applicants in a unified dashboard.",
  },
  {
    icon: Wallet,
    title: "Team Wallet",
    description:
      "Shared funding pool, per-project budgets, automated splits, and real-time spending analytics.",
  },
  {
    icon: FileText,
    title: "White-label Proposals",
    description:
      "Send proposals under your agency brand, with custom contracts, NDAs, and templates.",
  },
  {
    icon: BarChart3,
    title: "Team Analytics",
    description:
      "Track team performance, freelancer ratings, project completion rates, and spend by category.",
  },
  {
    icon: Headphones,
    title: "Priority Support",
    description:
      "Dedicated account manager, 24-hour response SLA, and custom onboarding for your team.",
  },
];

interface Tier {
  name: string;
  price: string;
  cadence: string;
  tagline: string;
  highlight?: boolean;
  features: string[];
  cta: string;
}

const TIERS: Tier[] = [
  {
    name: "Team",
    price: "TND 79",
    cadence: "/mo per seat, min 3 seats",
    tagline: "For small agencies and growing studios.",
    features: [
      "Up to 5 team members",
      "Shared workspace + freelancer pool",
      "Team wallet with per-project budgets",
      "Basic team analytics",
      "Standard support (48h SLA)",
      "1% platform fee still applies",
    ],
    cta: "Book a demo",
  },
  {
    name: "Enterprise",
    price: "Custom",
    cadence: "annual contract",
    tagline: "For larger teams that need full control.",
    highlight: true,
    features: [
      "Unlimited members",
      "SSO / SAML + SCIM provisioning",
      "Custom contracts + NDAs",
      "White-label everything",
      "Dedicated CSM + 24h SLA",
      "On-premise option + API access",
    ],
    cta: "Talk to sales",
  },
];

interface UseCase {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  bullets: string[];
  quote: { text: string; author: string; role: string };
}

const USE_CASES: UseCase[] = [
  {
    id: "agencies",
    label: "Marketing Agencies",
    icon: Megaphone,
    description:
      "Run multiple client campaigns in parallel with shared creative talent and per-client budgets.",
    bullets: [
      "Pool of vetted designers, copywriters, and social media managers",
      "Per-client sub-workspaces with isolated budgets",
      "White-label client deliverables with agency branding",
    ],
    quote: {
      text: "We scaled from 4 to 22 active freelance contracts without adding operations overhead. Khidma Teams basically runs our talent ops now.",
      author: "Ines Khelifi",
      role: "Founder, Studio Nour (Tunis)",
    },
  },
  {
    id: "studios",
    label: "Software Studios",
    icon: Code2,
    description:
      "Staff product squads with the right mix of full-stack, design, and QA freelancers — without the procurement pain.",
    bullets: [
      "Pre-approved freelancer pool with role-based access",
      "Automated milestone-based payouts to multiple contributors",
      "Team analytics on velocity, completion rates, and spend per project",
    ],
    quote: {
      text: "Onboarding a senior contractor used to take us 2 weeks. With Khidma Teams it's 30 minutes — NDA, contract, wallet, all in one place.",
      author: "Mehdi Saidana",
      role: "CTO, Cassurea Technologies (Sfax)",
    },
  },
  {
    id: "enterprise",
    label: "Enterprise Teams",
    icon: Building2,
    description:
      "Bring procurement, legal, and engineering under one compliant, auditable platform with SSO and custom contracts.",
    bullets: [
      "SSO/SAML + SCIM provisioning + audit logs",
      "Custom MSA + DPA templates pre-approved by your legal team",
      "On-premise deployment option + dedicated CSM",
    ],
    quote: {
      text: "Khidma Enterprise replaced three separate tools we used for contractor management. The 24h SLA and dedicated CSM are genuinely felt.",
      author: "Sonia Ben Amor",
      role: "Head of Vendor Management, Tunisian Telecom",
    },
  },
];

const FAQ_ITEMS: { question: string; answer: string }[] = [
  {
    question: "How does billing work?",
    answer:
      "Team tier is billed per seat (TND 79/mo, min 3 seats). You can add or remove seats anytime — prorated automatically. Enterprise is an annual contract with custom invoicing and NET-30 terms.",
  },
  {
    question: "Can I switch from Pro to Teams?",
    answer:
      "Yes. Your existing Pro subscription is credited toward your first Teams invoice. Your personal workspace becomes a Team workspace, and you can invite members immediately.",
  },
  {
    question: "What happens to my existing freelancers?",
    answer:
      "Nothing changes for active contracts. Freelancers you've already hired are added to your Team's shared pool so other members can collaborate or re-hire without repeating onboarding.",
  },
  {
    question: "Is there a free trial?",
    answer:
      "Team tier includes a 14-day free trial with full features (no card required). Enterprise offers a 30-day guided pilot with your dedicated CSM.",
  },
];

/* ----------------------------------------------------------------------------
 * Sub-components
 * -------------------------------------------------------------------------- */

function FeatureCard({ feature, index }: { feature: Feature; index: number }) {
  const prefersReduced = useReducedMotion();
  const Icon = feature.icon;
  return (
    <motion.div
      initial={prefersReduced ? undefined : { opacity: 0, y: 16 }}
      animate={prefersReduced ? undefined : { opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: prefersReduced ? 0 : 0.04 * index }}
      className="group rounded-xl border border-border/60 bg-card hover:border-[#32504d]/40 hover:shadow-md hover:shadow-[#32504d]/5 transition-all p-4 sm:p-5"
    >
      <div className="size-9 rounded-lg bg-[#32504d]/10 text-[#32504d] dark:text-[#9bb3ae] flex items-center justify-center mb-3 group-hover:bg-[#32504d] group-hover:text-white transition-colors">
        <Icon className="size-4.5" />
      </div>
      <h4 className="font-display text-sm font-semibold text-foreground mb-1.5">
        {feature.title}
      </h4>
      <p className="text-xs text-muted-foreground leading-relaxed">
        {feature.description}
      </p>
    </motion.div>
  );
}

function TierCard({ tier }: { tier: Tier }) {
  const prefersReduced = useReducedMotion();
  return (
    <motion.div
      whileHover={prefersReduced ? undefined : { y: -4 }}
      transition={{ duration: 0.25 }}
      className={cn(
        "relative rounded-2xl border p-5 sm:p-6 flex flex-col",
        tier.highlight
          ? "border-[#32504d] bg-gradient-to-b from-[#32504d]/8 to-[#32504d]/3 dark:from-[#32504d]/20 dark:to-[#32504d]/8 shadow-lg shadow-[#32504d]/10"
          : "border-border/60 bg-card"
      )}
    >
      {tier.highlight && (
        <Badge className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-[#32504d] text-white border-[#32504d]">
          Recommended
        </Badge>
      )}
      <div className="mb-3">
        <h4 className="font-display text-lg font-bold tracking-tight">
          {tier.name}
        </h4>
        <p className="text-xs text-muted-foreground mt-0.5">{tier.tagline}</p>
      </div>
      <div className="mb-4 flex items-baseline gap-1">
        <span className="font-display text-3xl font-bold">{tier.price}</span>
        <span className="text-xs text-muted-foreground">{tier.cadence}</span>
      </div>
      <ul className="space-y-2 mb-5 flex-1">
        {tier.features.map((f) => (
          <li key={f} className="flex items-start gap-2 text-xs">
            <Check className="size-3.5 text-[#32504d] dark:text-[#9bb3ae] shrink-0 mt-0.5" />
            <span className="text-foreground/80">{f}</span>
          </li>
        ))}
      </ul>
      <Button
        className={
          tier.highlight
            ? "bg-[#32504d] hover:bg-[#475959] text-white w-full"
            : "w-full"
        }
        variant={tier.highlight ? "default" : "outline"}
        onClick={() =>
          toast.success("Demo request received", {
            description: `Our team will contact you about the ${tier.name} plan within 24h.`,
          })
        }
      >
        {tier.cta}
        <ArrowRight className="ml-1.5 size-4" />
      </Button>
    </motion.div>
  );
}

function UseCaseTab({ uc }: { uc: UseCase }) {
  const prefersReduced = useReducedMotion();
  const Icon = uc.icon;
  return (
    <motion.div
      initial={prefersReduced ? undefined : { opacity: 0, y: 8 }}
      animate={prefersReduced ? undefined : { opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="grid grid-cols-1 md:grid-cols-2 gap-5 p-1"
    >
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <span className="size-8 rounded-lg bg-[#32504d]/10 text-[#32504d] dark:text-[#9bb3ae] flex items-center justify-center">
            <Icon className="size-4" />
          </span>
          <h4 className="font-display text-base font-semibold">{uc.label}</h4>
        </div>
        <p className="text-sm text-muted-foreground leading-relaxed">
          {uc.description}
        </p>
        <ul className="space-y-2">
          {uc.bullets.map((b) => (
            <li key={b} className="flex items-start gap-2 text-sm">
              <Check className="size-4 text-[#32504d] dark:text-[#9bb3ae] shrink-0 mt-0.5" />
              <span className="text-foreground/80">{b}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="relative rounded-xl border border-[#32504d]/20 bg-gradient-to-br from-[#32504d]/8 to-[#6e8580]/5 p-5">
        <Quote className="size-6 text-[#32504d]/30 mb-2" aria-hidden />
        <p className="text-sm text-foreground/90 leading-relaxed italic mb-3">
          "{uc.quote.text}"
        </p>
        <div className="text-xs">
          <p className="font-semibold text-foreground">{uc.quote.author}</p>
          <p className="text-muted-foreground">{uc.quote.role}</p>
        </div>
      </div>
    </motion.div>
  );
}

/* ----------------------------------------------------------------------------
 * Modal
 * -------------------------------------------------------------------------- */

export function TeamsModal() {
  const prefersReduced = useReducedMotion();
  const {
    modal: { teamsOpen },
    closeTeams,
    openPro,
    pushNotification,
  } = useApp();
  const [activeTab, setActiveTab] = useState<string>("agencies");

  const handleBookDemo = () => {
    toast.success("Demo request received!", {
      description: "Our team will reach out within 24 hours to schedule your Khidma for Teams demo.",
    });
    pushNotification({
      type: "system",
      title: "Teams demo requested",
      body: "We'll contact you within 24h to schedule your Khidma for Teams walkthrough.",
      link: "dashboard",
    });
    closeTeams();
  };

  return (
    <Dialog open={teamsOpen} onOpenChange={(o) => !o && closeTeams()}>
      <DialogPortal>
        <DialogOverlay className="bg-[#192d2f]/70 backdrop-blur-sm" />
        <DialogContent
          className="max-w-4xl w-[calc(100%-2rem)] max-h-[90vh] p-0 gap-0 overflow-hidden"
          aria-describedby={undefined}
          showCloseButton={false}
        >
          {/* Header */}
          <DialogHeader className="relative px-6 pt-6 pb-5 bg-gradient-to-br from-[#192d2f] via-[#2b3d3d] to-[#32504d] text-white overflow-hidden">
            <div
              className="absolute inset-0 opacity-[0.06] pointer-events-none"
              style={{
                backgroundImage:
                  "radial-gradient(circle, #ffffff 1px, transparent 1px)",
                backgroundSize: "28px 28px",
              }}
              aria-hidden
            />
            <div className="absolute -top-12 -right-12 size-48 rounded-full bg-white/5 blur-3xl pointer-events-none" aria-hidden />
            <div className="relative flex items-start justify-between gap-4">
              <div>
                <DialogTitle className="flex items-center gap-2 text-xl font-display font-bold">
                  <Users className="size-5 text-[#9bb3ae]" />
                  Khidma for Teams
                </DialogTitle>
                <DialogDescription className="text-white/75 text-sm mt-1.5">
                  Hire, manage, and pay your freelance team — all in one place.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <ScrollArea className="h-[calc(90vh-100px)]">
            <div className="px-6 pb-6 pt-5 space-y-8">
              {/* Hero strip */}
              <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-[#32504d] via-[#475959] to-[#6e8580] p-5 sm:p-6 text-white">
                <div className="absolute -bottom-8 -right-8 size-32 rounded-full bg-white/5 blur-2xl pointer-events-none" aria-hidden />
                <div className="relative">
                  <h3 className="font-display text-base sm:text-lg font-semibold leading-snug mb-3">
                    Built for agencies, studios, and growing teams.
                  </h3>
                  <div className="grid grid-cols-3 gap-3 sm:gap-4">
                    {[
                      { value: "5", label: "team members" },
                      { value: "50+", label: "active freelancers" },
                      { value: "TND 124K+", label: "managed" },
                    ].map((s) => (
                      <div key={s.label}>
                        <div className="font-display text-lg sm:text-2xl font-bold leading-tight">
                          {s.value}
                        </div>
                        <div className="text-[10px] sm:text-xs text-white/70">
                          {s.label}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Features grid */}
              <section aria-labelledby="teams-features-heading">
                <h3
                  id="teams-features-heading"
                  className="font-display text-sm font-semibold uppercase tracking-wider text-[#748684] mb-3"
                >
                  What's included
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                  {FEATURES.map((f, i) => (
                    <FeatureCard key={f.title} feature={f} index={i} />
                  ))}
                </div>
              </section>

              {/* Pricing comparison */}
              <section aria-labelledby="teams-pricing-heading">
                <h3
                  id="teams-pricing-heading"
                  className="font-display text-sm font-semibold uppercase tracking-wider text-[#748684] mb-3"
                >
                  Pricing
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 pt-2">
                  {TIERS.map((t) => (
                    <TierCard key={t.name} tier={t} />
                  ))}
                </div>
              </section>

              {/* Use cases */}
              <section aria-labelledby="teams-usecases-heading">
                <h3
                  id="teams-usecases-heading"
                  className="font-display text-sm font-semibold uppercase tracking-wider text-[#748684] mb-3"
                >
                  Use cases
                </h3>
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="bg-muted/60 h-auto p-1 flex flex-wrap">
                    {USE_CASES.map((uc) => {
                      const Icon = uc.icon;
                      return (
                        <TabsTrigger
                          key={uc.id}
                          value={uc.id}
                          className="gap-1.5 px-3 py-1.5 text-xs sm:text-sm"
                        >
                          <Icon className="size-3.5" />
                          {uc.label}
                        </TabsTrigger>
                      );
                    })}
                  </TabsList>
                  {USE_CASES.map((uc) => (
                    <TabsContent key={uc.id} value={uc.id} className="mt-4">
                      <UseCaseTab uc={uc} />
                    </TabsContent>
                  ))}
                </Tabs>
              </section>

              {/* CTA */}
              <section className="rounded-xl border border-[#32504d]/30 bg-gradient-to-br from-[#32504d]/8 to-[#6e8580]/5 dark:from-[#32504d]/15 dark:to-[#6e8580]/8 p-5 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h3 className="font-display text-base sm:text-lg font-semibold flex items-center gap-2">
                      <CalendarDays className="size-4 text-[#32504d] dark:text-[#9bb3ae]" />
                      Ready to scale your freelance ops?
                    </h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      Get a 30-minute walkthrough tailored to your team's workflow.
                    </p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2 sm:shrink-0">
                    <Button
                      variant="ghost"
                      className="border border-border/60"
                      onClick={() => {
                        closeTeams();
                        openPro();
                      }}
                    >
                      Compare with Pro
                    </Button>
                    <Button
                      className="bg-[#32504d] hover:bg-[#475959] text-white"
                      onClick={handleBookDemo}
                    >
                      Book a demo
                      <ArrowRight className="ml-1.5 size-4" />
                    </Button>
                  </div>
                </div>
              </section>

              {/* FAQ */}
              <section aria-labelledby="teams-faq-heading">
                <h3
                  id="teams-faq-heading"
                  className="font-display text-sm font-semibold uppercase tracking-wider text-[#748684] mb-2"
                >
                  Frequently asked
                </h3>
                <Accordion type="single" collapsible className="w-full">
                  {FAQ_ITEMS.map((item, i) => (
                    <AccordionItem key={item.question} value={`faq-${i}`}>
                      <AccordionTrigger className="text-sm hover:no-underline">
                        {item.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground leading-relaxed">
                        {item.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </section>
            </div>
          </ScrollArea>

          <DialogClose
            className="absolute top-4 right-4 z-10 size-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors"
            aria-label="Close"
          >
            <X className="size-4" />
          </DialogClose>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}
