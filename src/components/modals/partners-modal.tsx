"use client";

/**
 * PartnersModal
 * -------------
 * "Khidma Partner Program" — for payment providers, banks, accelerators, and
 * educational institutions that want to integrate with / co-brand Khidma.
 *
 * Opened via `openPartners()` from the footer's Marketplace column.
 *
 * Structure:
 *   - Header (Khidma gradient) with title + close button
 *   - Hero strip with 3 trust badges (12+ active partners, TND 2.4M+ processed
 *     jointly, 41 countries reached)
 *   - 4 Partner-type cards (2×2 grid): Payment Providers / Banks & Financial
 *     Institutions / Accelerators & Incubators / Educational Institutions
 *   - 6-benefit grid (Revenue sharing / Co-marketing / Portal / API / Support
 *     / Quarterly business reviews)
 *   - 3 Partner tiers (Associate / Premier / Strategic)
 *   - Partner logos row (mock styled text pills)
 *   - CTA: "Become a partner" form (Name / Email / Company / Partner type /
 *     Message) → toast + pushNotification + close. Plus "Schedule a call"
 *     ghost button → toast.
 *   - 4-question FAQ accordion
 *
 * Self-renders based on `modal.partnersOpen` from `useApp()`.
 *
 * Palette: Khidma teal only — #475959 #2b3d3d #748684 #192d2f #32504d #6e8580
 * Animations: framer-motion (tier hover, partner-type entrance) — respects
 * prefers-reduced-motion.
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
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  X,
  Handshake,
  CreditCard,
  Landmark,
  Rocket,
  GraduationCap,
  TrendingUp,
  Megaphone,
  LayoutDashboard,
  Code2,
  Headphones,
  CalendarClock,
  Check,
  ArrowRight,
  PhoneCall,
  Send,
  Building2,
  ShieldCheck,
} from "lucide-react";
import { useApp } from "@/lib/store";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

/* ----------------------------------------------------------------------------
 * Data
 * -------------------------------------------------------------------------- */

interface PartnerType {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  tagline: string;
  description: string;
  features: string[];
}

const PARTNER_TYPES: PartnerType[] = [
  {
    icon: CreditCard,
    title: "Payment Providers",
    tagline: "Power Tunisian + international withdrawals",
    description:
      "Integrate your payment gateway for Tunisian + international withdrawals. Earn revenue share on every transaction processed through your gateway.",
    features: [
      "API integration",
      "Co-branded checkout",
      "Revenue share",
      "Fraud protection",
    ],
  },
  {
    icon: Landmark,
    title: "Banks & Financial Institutions",
    tagline: "Offer Khidma to your business customers",
    description:
      "Offer Khidma to your business customers. White-label the platform for your SME clients.",
    features: [
      "White-label licensing",
      "Co-branded cards",
      "SME onboarding",
      "Dedicated relationship manager",
    ],
  },
  {
    icon: Rocket,
    title: "Accelerators & Incubators",
    tagline: "Give startups vetted freelance talent",
    description:
      "Give your startups access to vetted freelance talent. Bulk hiring credits + team dashboards.",
    features: [
      "Bulk credits (up to 50% off)",
      "Team analytics",
      "Mentor matching",
      "Startup success tracking",
    ],
  },
  {
    icon: GraduationCap,
    title: "Educational Institutions",
    tagline: "Bridge education and employment",
    description:
      "Connect your students/graduates to real freelance work. Bridge the gap between education and employment.",
    features: [
      "Student verification",
      "Portfolio bootstrapping",
      "Skills matching",
      "Employment tracking",
    ],
  },
];

interface Benefit {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description: string;
}

const BENEFITS: Benefit[] = [
  {
    icon: TrendingUp,
    title: "Revenue sharing",
    description: "Earn up to 30% revenue share on every transaction routed through your integration.",
  },
  {
    icon: Megaphone,
    title: "Co-marketing budget",
    description: "Tap into a shared co-marketing pool — events, content, and joint campaigns.",
  },
  {
    icon: LayoutDashboard,
    title: "Dedicated partner portal",
    description: "Real-time dashboards for transactions, referrals, revenue share, and support tickets.",
  },
  {
    icon: Code2,
    title: "API access",
    description: "Full Khidma API access with sandbox environment, webhooks, and SDKs in 4 languages.",
  },
  {
    icon: Headphones,
    title: "Priority support",
    description: "Direct line to our partner success team — 24h response SLA on all partner tickets.",
  },
  {
    icon: CalendarClock,
    title: "Quarterly business reviews",
    description: "Structured QBRs with executive sponsors to align on roadmap, growth, and KPIs.",
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
    name: "Associate",
    price: "Free",
    cadence: "to join",
    tagline: "Get started and explore the ecosystem.",
    features: [
      "Basic API access",
      "Standard revenue share (10%)",
      "Co-branded assets",
      "Community support",
    ],
    cta: "Join free",
  },
  {
    name: "Premier",
    price: "TND 5,000",
    cadence: "/year",
    tagline: "For partners scaling serious volume.",
    highlight: true,
    features: [
      "Enhanced API",
      "Higher revenue share (20%)",
      "Co-marketing budget (TND 5,000)",
      "Dedicated account manager",
    ],
    cta: "Choose Premier",
  },
  {
    name: "Strategic",
    price: "Custom",
    cadence: "annual contract",
    tagline: "Full white-label, joint product roadmap.",
    features: [
      "Full white-label",
      "Highest revenue share (30%)",
      "Joint product roadmap",
      "Executive sponsor",
    ],
    cta: "Talk to sales",
  },
];

const PARTNER_LOGOS: string[] = [
  "BIAT Bank",
  "Tunisian Post",
  "D17",
  "Flat6Labs Tunis",
  "Esprit University",
];

const FAQ_ITEMS: { question: string; answer: string }[] = [
  {
    question: "What are the revenue share terms?",
    answer:
      "Revenue share ranges from 10% (Associate) to 30% (Strategic) of Khidma's net platform fee on transactions routed through your integration. Share is calculated monthly and paid out by the 15th of the following month in TND or USD.",
  },
  {
    question: "How long is the onboarding?",
    answer:
      "Associate partners can self-serve and integrate in under a day using our docs. Premier onboarding takes ~2 weeks (KYB, contract, sandbox → production). Strategic partnerships are scoped jointly with your dedicated account manager — typically 4–6 weeks end-to-end.",
  },
  {
    question: "What technical requirements?",
    answer:
      "You need HTTPS endpoints, support for HMAC-SHA256 webhook signing, and a sandbox environment for testing. We provide SDKs in JavaScript, Python, PHP, and cURL. Minimum TLS 1.2 is enforced on all partner API calls.",
  },
  {
    question: "Can we white-label?",
    answer:
      "Yes — Strategic partners get full white-label licensing: your branding on the Khidma platform, custom domain (e.g., freelance.yourbank.tn), co-branded cards, and a dedicated relationship manager. Premier partners get co-branded assets (logos, email templates) but not full white-label.",
  },
];

const PARTNER_TYPE_OPTIONS = [
  { value: "payment", label: "Payment Provider" },
  { value: "bank", label: "Bank / Financial Institution" },
  { value: "accelerator", label: "Accelerator / Incubator" },
  { value: "education", label: "Educational Institution" },
  { value: "other", label: "Other" },
];

/* ----------------------------------------------------------------------------
 * Sub-components
 * -------------------------------------------------------------------------- */

function PartnerTypeCard({
  type,
  index,
}: {
  type: PartnerType;
  index: number;
}) {
  const prefersReduced = useReducedMotion();
  const Icon = type.icon;
  return (
    <motion.div
      initial={prefersReduced ? undefined : { opacity: 0, y: 16 }}
      whileInView={prefersReduced ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{
        duration: 0.45,
        delay: prefersReduced ? 0 : 0.05 + index * 0.08,
      }}
      className="group rounded-xl border border-border/60 bg-card hover:border-[#32504d]/40 hover:shadow-md hover:shadow-[#32504d]/5 transition-all p-5"
    >
      <div className="flex items-start gap-3">
        <div className="size-10 rounded-lg bg-[#32504d]/10 dark:bg-[#32504d]/20 text-[#32504d] dark:text-[#9bb3ae] flex items-center justify-center shrink-0 group-hover:bg-[#32504d] group-hover:text-white transition-colors">
          <Icon className="size-5" />
        </div>
        <div className="min-w-0">
          <h4 className="font-display text-base font-semibold text-foreground leading-tight">
            {type.title}
          </h4>
          <p className="text-[11px] text-[#748684] mt-0.5 uppercase tracking-wider">
            {type.tagline}
          </p>
        </div>
      </div>
      <p className="text-xs text-muted-foreground leading-relaxed mt-3">
        {type.description}
      </p>
      <ul className="grid grid-cols-2 gap-x-2 gap-y-1.5 mt-3">
        {type.features.map((f) => (
          <li
            key={f}
            className="flex items-center gap-1.5 text-[11px] text-foreground/75"
          >
            <Check className="size-3 text-[#32504d] dark:text-[#9bb3ae] shrink-0" />
            {f}
          </li>
        ))}
      </ul>
    </motion.div>
  );
}

function BenefitCard({ benefit, index }: { benefit: Benefit; index: number }) {
  const prefersReduced = useReducedMotion();
  const Icon = benefit.icon;
  return (
    <motion.div
      initial={prefersReduced ? undefined : { opacity: 0, y: 12 }}
      whileInView={prefersReduced ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{
        duration: 0.4,
        delay: prefersReduced ? 0 : 0.04 * index,
      }}
      className="flex items-start gap-3 rounded-xl border border-border/60 bg-card p-4"
    >
      <span className="size-9 rounded-lg bg-[#32504d]/10 dark:bg-[#32504d]/20 text-[#32504d] dark:text-[#9bb3ae] flex items-center justify-center shrink-0">
        <Icon className="size-4.5" />
      </span>
      <div className="min-w-0">
        <h4 className="font-display text-sm font-semibold text-foreground">
          {benefit.title}
        </h4>
        <p className="text-xs text-muted-foreground leading-relaxed mt-1">
          {benefit.description}
        </p>
      </div>
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
        "relative rounded-2xl border p-5 flex flex-col h-full",
        tier.highlight
          ? "border-[#32504d] bg-gradient-to-b from-[#32504d]/8 to-[#32504d]/3 dark:from-[#32504d]/20 dark:to-[#32504d]/8 shadow-lg shadow-[#32504d]/10"
          : "border-border/60 bg-card"
      )}
    >
      {tier.highlight && (
        <Badge className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-[#32504d] text-white border-[#32504d]">
          Most popular
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
          toast.success(`${tier.name} — application started`, {
            description: "Scroll down to complete the partner application form.",
          })
        }
      >
        {tier.cta}
        <ArrowRight className="ml-1.5 size-4" />
      </Button>
    </motion.div>
  );
}

/* ----------------------------------------------------------------------------
 * Partner application form
 * -------------------------------------------------------------------------- */

function PartnerApplicationForm({ onClose }: { onClose: () => void }) {
  const { pushNotification } = useApp();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [partnerType, setPartnerType] = useState<string>("");
  const [message, setMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return toast.error("Please enter your name.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return toast.error("Please enter a valid email address.");
    if (!company.trim()) return toast.error("Please enter your company name.");
    if (!partnerType) return toast.error("Please choose a partner type.");

    setSubmitting(true);
    window.setTimeout(() => {
      setSubmitting(false);
      const typeLabel =
        PARTNER_TYPE_OPTIONS.find((o) => o.value === partnerType)?.label ??
        partnerType;
      toast.success("Application received!", {
        description: `Our partnerships team will contact ${email} within 48h.`,
      });
      pushNotification({
        type: "system",
        title: "Partner application submitted",
        body: `${name} (${company}) applied as ${typeLabel}.`,
        link: "dashboard",
      });
      setName("");
      setEmail("");
      setCompany("");
      setPartnerType("");
      setMessage("");
      onClose();
    }, 700);
  };

  return (
    <form onSubmit={handleSubmit} className="grid gap-3 sm:grid-cols-2">
      <div className="space-y-1.5">
        <Label htmlFor="partner-name" className="text-xs font-medium">
          Full name <span className="text-destructive">*</span>
        </Label>
        <Input
          id="partner-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Amira Ben Salah"
          autoComplete="name"
          required
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="partner-email" className="text-xs font-medium">
          Work email <span className="text-destructive">*</span>
        </Label>
        <Input
          id="partner-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="amira@company.com"
          autoComplete="email"
          required
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="partner-company" className="text-xs font-medium">
          Company <span className="text-destructive">*</span>
        </Label>
        <Input
          id="partner-company"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          placeholder="BIAT Bank"
          required
        />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="partner-type" className="text-xs font-medium">
          Partner type <span className="text-destructive">*</span>
        </Label>
        <Select value={partnerType} onValueChange={setPartnerType}>
          <SelectTrigger
            id="partner-type"
            className="w-full h-9"
            aria-label="Partner type"
          >
            <SelectValue placeholder="Select a partner type" />
          </SelectTrigger>
          <SelectContent>
            {PARTNER_TYPE_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="space-y-1.5 sm:col-span-2">
        <Label htmlFor="partner-message" className="text-xs font-medium">
          Message <span className="text-muted-foreground">(optional)</span>
        </Label>
        <Textarea
          id="partner-message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Tell us about your goals, expected volume, integration timeline…"
          className="min-h-24"
        />
      </div>
      <div className="sm:col-span-2 flex flex-col sm:flex-row gap-2 sm:items-center sm:justify-between pt-1">
        <p className="text-[11px] text-muted-foreground">
          By applying, you agree to Khidma&apos;s partner program terms. We
          respond within 48h.
        </p>
        <div className="flex gap-2 shrink-0">
          <Button
            type="button"
            variant="ghost"
            onClick={() =>
              toast.info("Our team will reach out", {
                description: "We'll email you to schedule a 30-min call.",
              })
            }
          >
            <PhoneCall className="mr-1.5 size-4" />
            Schedule a call
          </Button>
          <Button
            type="submit"
            disabled={submitting}
            className="bg-[#32504d] hover:bg-[#475959] text-white"
          >
            {submitting ? (
              <>
                <span className="size-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                Applying…
              </>
            ) : (
              <>
                Apply now
                <Send className="ml-1.5 size-4" />
              </>
            )}
          </Button>
        </div>
      </div>
    </form>
  );
}

/* ----------------------------------------------------------------------------
 * Modal
 * -------------------------------------------------------------------------- */

export function PartnersModal() {
  const prefersReduced = useReducedMotion();
  const {
    modal: { partnersOpen },
    closePartners,
  } = useApp();

  return (
    <Dialog open={partnersOpen} onOpenChange={(o) => !o && closePartners()}>
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
            <div
              className="absolute -top-12 -right-12 size-48 rounded-full bg-white/5 blur-3xl pointer-events-none"
              aria-hidden
            />
            <div className="relative flex items-start justify-between gap-4">
              <div>
                <DialogTitle className="flex items-center gap-2 text-xl font-display font-bold">
                  <Handshake className="size-5 text-[#9bb3ae]" />
                  Khidma Partner Program
                </DialogTitle>
                <DialogDescription className="text-white/75 text-sm mt-1.5">
                  Join the Khidma ecosystem. Grow with us.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <ScrollArea className="h-[calc(90vh-100px)]">
            <div className="px-6 pb-6 pt-5 space-y-8">
              {/* Hero strip */}
              <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-[#32504d] via-[#475959] to-[#6e8580] p-5 sm:p-6 text-white">
                <div
                  className="absolute -bottom-8 -right-8 size-32 rounded-full bg-white/5 blur-2xl pointer-events-none"
                  aria-hidden
                />
                <div className="relative">
                  <h3 className="font-display text-base sm:text-lg font-semibold leading-snug mb-3 max-w-2xl">
                    Built for payment providers, banks, accelerators, and
                    educational institutions.
                  </h3>
                  <div className="grid grid-cols-3 gap-3 sm:gap-4">
                    {[
                      { value: "12+", label: "active partners" },
                      { value: "TND 2.4M+", label: "processed jointly" },
                      { value: "41", label: "countries reached" },
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

              {/* Partner types (2×2 grid) */}
              <section aria-labelledby="partners-types-heading">
                <h3
                  id="partners-types-heading"
                  className="font-display text-sm font-semibold uppercase tracking-wider text-[#748684] mb-3"
                >
                  Partner types
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  {PARTNER_TYPES.map((t, i) => (
                    <PartnerTypeCard key={t.title} type={t} index={i} />
                  ))}
                </div>
              </section>

              {/* Benefits grid (6) */}
              <section aria-labelledby="partners-benefits-heading">
                <h3
                  id="partners-benefits-heading"
                  className="font-display text-sm font-semibold uppercase tracking-wider text-[#748684] mb-3"
                >
                  Partner benefits
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                  {BENEFITS.map((b, i) => (
                    <BenefitCard key={b.title} benefit={b} index={i} />
                  ))}
                </div>
              </section>

              {/* Partner tiers (3) */}
              <section aria-labelledby="partners-tiers-heading">
                <h3
                  id="partners-tiers-heading"
                  className="font-display text-sm font-semibold uppercase tracking-wider text-[#748684] mb-3"
                >
                  Partner tiers
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5 pt-2">
                  {TIERS.map((t) => (
                    <TierCard key={t.name} tier={t} />
                  ))}
                </div>
              </section>

              {/* Partner logos row */}
              <section aria-labelledby="partners-logos-heading">
                <h3
                  id="partners-logos-heading"
                  className="font-display text-sm font-semibold uppercase tracking-wider text-[#748684] mb-3"
                >
                  Trusted by leading institutions
                </h3>
                <div className="flex flex-wrap items-center gap-2.5">
                  {PARTNER_LOGOS.map((logo) => (
                    <motion.span
                      key={logo}
                      whileHover={
                        prefersReduced ? undefined : { y: -2 }
                      }
                      transition={{ duration: 0.2 }}
                      className="inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-card px-3.5 py-1.5 text-xs sm:text-sm font-medium text-foreground/80 hover:border-[#32504d]/40 hover:text-foreground transition-colors"
                    >
                      <Building2 className="size-3.5 text-[#748684]" />
                      {logo}
                    </motion.span>
                  ))}
                </div>
                <p className="text-[11px] text-muted-foreground mt-2.5">
                  A representative sample of partner categories — illustrative.
                </p>
              </section>

              {/* CTA — Become a partner form */}
              <section
                aria-labelledby="partners-cta-heading"
                className="rounded-xl border border-[#32504d]/30 dark:border-[#32504d]/30 bg-gradient-to-br from-[#32504d]/8 to-[#6e8580]/5 dark:from-[#32504d]/15 dark:to-[#6e8580]/8 p-5 sm:p-6"
              >
                <div className="flex items-center gap-2 mb-4">
                  <span className="size-8 rounded-lg bg-[#32504d] text-white flex items-center justify-center">
                    <ShieldCheck className="size-4" />
                  </span>
                  <div>
                    <h3
                      id="partners-cta-heading"
                      className="font-display text-base sm:text-lg font-semibold"
                    >
                      Become a partner
                    </h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Tell us about your organization — we&apos;ll get back within
                      48 hours.
                    </p>
                  </div>
                </div>
                <PartnerApplicationForm onClose={closePartners} />
              </section>

              {/* FAQ mini-section */}
              <section aria-labelledby="partners-faq-heading">
                <h3
                  id="partners-faq-heading"
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
                      <AccordionContent className="text-muted-foreground leading-relaxed text-xs sm:text-sm">
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
