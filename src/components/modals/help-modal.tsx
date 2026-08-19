"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
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
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  HelpCircle,
  Search,
  LifeBuoy,
  FileText,
  Flag,
  CreditCard,
  Mail,
  MessageSquare,
  Users,
  ChevronRight,
  ThumbsUp,
  ThumbsDown,
  ShieldCheck,
  Sparkles,
  UserCheck,
} from "lucide-react";
import { useApp } from "@/lib/store";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

/* ----------------------------------------------------------------------------
 * FAQ data — 18 Q&A pairs across the 7 help categories.
 * -------------------------------------------------------------------------- */
type HelpCategory =
  | "getting-started"
  | "for-freelancers"
  | "for-clients"
  | "payments"
  | "verification"
  | "account"
  | "disputes";

interface FAQItem {
  id: string;
  category: HelpCategory;
  question: string;
  answer: string;
}

const CATEGORIES: { id: HelpCategory; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { id: "getting-started", label: "Getting Started", icon: Sparkles },
  { id: "for-freelancers", label: "For Freelancers", icon: LifeBuoy },
  { id: "for-clients", label: "For Clients", icon: UserCheck },
  { id: "payments", label: "Payments & Withdrawals", icon: CreditCard },
  { id: "verification", label: "Verification & Trust", icon: ShieldCheck },
  { id: "account", label: "Account & Security", icon: FileText },
  { id: "disputes", label: "Disputes", icon: Flag },
];

const FAQS: FAQItem[] = [
  // Getting started
  {
    id: "gs1",
    category: "getting-started",
    question: "How do I create my Khidma account?",
    answer:
      "Click 'Sign up' in the top-right corner and choose whether you're joining as a freelancer or a client. You'll need a valid email or phone number, and you can complete your profile in a couple of minutes. We'll send a verification code to confirm your identity.",
  },
  {
    id: "gs2",
    category: "getting-started",
    question: "What's the difference between a freelancer and a client account?",
    answer:
      "A freelancer account lets you publish services, apply to jobs and receive payments. A client account lets you post jobs, hire freelancers and manage milestones. You can switch roles anytime from Settings, but each role needs its own verification step.",
  },
  {
    id: "gs3",
    category: "getting-started",
    question: "Is Khidma available outside Tunisia?",
    answer:
      "Yes. Khidma is open to Tunisian freelancers worldwide and to international clients who want to hire verified Tunisian talent. Payments are settled in TND by default, with USD/EUR options for cross-border contracts.",
  },
  // For freelancers
  {
    id: "fr1",
    category: "for-freelancers",
    question: "How do I publish my first service?",
    answer:
      "From your dashboard, click 'Create service', upload a cover image, write a clear title and description, set your starting price, and add up to 5 deliverable tiers. Once you hit Publish, our team reviews it within 24 hours before it goes live.",
  },
  {
    id: "fr2",
    category: "for-freelancers",
    question: "How many jobs can I apply to per month?",
    answer:
      "Starter (free) accounts can apply to up to 10 jobs per month. Khidma Pro unlocks unlimited applications plus priority review, so your proposals appear closer to the top of the client's inbox.",
  },
  {
    id: "fr3",
    category: "for-freelancers",
    question: "How can I make my profile stand out?",
    answer:
      "Add a professional headshot, complete every section (bio, skills, portfolio, certifications), request reviews from past clients, and stay active — Khidma rewards responsiveness in search ranking.",
  },
  // For clients
  {
    id: "cl1",
    category: "for-clients",
    question: "How do I post a job?",
    answer:
      "Click 'Post a job', describe what you need, set a budget range and a deadline, then publish. You'll start receiving proposals within hours. You can also directly invite freelancers you've saved or hired before.",
  },
  {
    id: "cl2",
    category: "for-clients",
    question: "Can I hire a freelancer without posting a public job?",
    answer:
      "Yes. Visit any freelancer profile, click 'Hire directly', and propose a private contract with milestones. Only you and the freelancer will see it.",
  },
  {
    id: "cl3",
    category: "for-clients",
    question: "How do I know a freelancer is trustworthy?",
    answer:
      "Every freelancer goes through identity verification (CIN / passport). Look for the verified badge, the Khidma Trust Score, response-time stats and recent reviews before hiring.",
  },
  // Payments
  {
    id: "pa1",
    category: "payments",
    question: "When do I receive my earnings?",
    answer:
      "Funds are released to your Khidma wallet as soon as the client approves a milestone (or automatically after 14 days if no action is taken). From there you can withdraw to your Tunisian bank account, D17, Flouci or PayPal.",
  },
  {
    id: "pa2",
    category: "payments",
    question: "What are the withdrawal fees?",
    answer:
      "Local bank transfers are free above 200 TND. D17 payouts cost 1 TND. PayPal withdrawals carry a 2% cross-border fee. You'll always see the exact fee before confirming.",
  },
  {
    id: "pa3",
    category: "payments",
    question: "How long do withdrawals take?",
    answer:
      "Bank transfers arrive within 1–2 business days, D17 is usually instant, PayPal lands within minutes. Holidays may delay things by 24h.",
  },
  {
    id: "pa4",
    category: "payments",
    question: "Does Khidma charge a service fee?",
    answer:
      "Khidma takes a 10% service fee on completed freelance earnings (5% for Pro members). Clients pay no platform fee — only the agreed amount plus applicable taxes.",
  },
  // Verification
  {
    id: "ve1",
    category: "verification",
    question: "How do I get the verified badge?",
    answer:
      "Upload a clear photo of your Tunisian CIN or passport, take a selfie matching the ID, and link a verified phone number. Most freelancers are verified within 24 hours.",
  },
  {
    id: "ve2",
    category: "verification",
    question: "What is the Khidma Trust Score?",
    answer:
      "The Trust Score is a 0–100 rating combining verification status, on-time delivery rate, response time, client reviews and dispute history. It updates weekly and is visible on every public profile.",
  },
  // Account & security
  {
    id: "ac1",
    category: "account",
    question: "I forgot my password — how do I reset it?",
    answer:
      "Click 'Forgot password' on the login screen, enter your email, and we'll send a secure reset link valid for 30 minutes. You can also reset via SMS if your phone is verified.",
  },
  {
    id: "ac2",
    category: "account",
    question: "How do I enable two-factor authentication?",
    answer:
      "Go to Settings → Security → Two-factor authentication, choose SMS or an authenticator app (Google Authenticator, Authy), and follow the on-screen steps. We strongly recommend 2FA for all active accounts.",
  },
  // Disputes
  {
    id: "di1",
    category: "disputes",
    question: "What if a client refuses to release a milestone?",
    answer:
      "Open a dispute from the contract page. Upload proof of delivery (screenshots, files, messages). Our mediation team reviews both sides within 72 hours and issues a binding decision.",
  },
  {
    id: "di2",
    category: "disputes",
    question: "Can I cancel a contract mid-way?",
    answer:
      "Yes. Either party can request cancellation. If work has already started, funds are split based on the milestones completed. Both parties can leave a public review unless the cancellation is mutual.",
  },
];

const QUICK_HELP = [
  {
    title: "Track your application",
    desc: "Check the status of your freelancer verification.",
    icon: FileText,
    cta: "Get help",
    onClick: () => toast.info("Opening your application…", { description: "Track your verification progress in the dashboard." }),
  },
  {
    title: "Payment & withdrawal issues",
    desc: "Problems with a payout or pending balance?",
    icon: CreditCard,
    cta: "Get help",
    onClick: () => toast.info("Loading payment troubleshooter…", { description: "Common fixes for delayed withdrawals appear here." }),
  },
  {
    title: "Report a problem",
    desc: "Flag suspicious behavior or content.",
    icon: Flag,
    cta: "Get help",
    onClick: () => toast.info("Opening report form…", { description: "Tell us what happened — we'll get back within 24h." }),
  },
];

export function HelpModal() {
  const { modal, closeHelp, openMessaging } = useApp();
  const prefersReduced = useReducedMotion();
  const [query, setQuery] = useState("");
  const [activeCat, setActiveCat] = useState<HelpCategory>("getting-started");
  const [mobileCatOpen, setMobileCatOpen] = useState(false);

  // Reset filters whenever the modal closes (deferred to avoid cascading renders).
  useEffect(() => {
    if (modal.helpOpen) return;
    const t = setTimeout(() => {
      setQuery("");
      setActiveCat("getting-started");
      setMobileCatOpen(false);
    }, 250);
    return () => clearTimeout(t);
  }, [modal.helpOpen]);

  const filteredFaqs = useMemo(() => {
    const q = query.trim().toLowerCase();
    return FAQS.filter((f) => {
      const matchesCat = f.category === activeCat;
      const matchesQuery =
        q === "" ||
        f.question.toLowerCase().includes(q) ||
        f.answer.toLowerCase().includes(q);
      // When searching globally, ignore the active category — search everything.
      if (q !== "") return matchesQuery;
      return matchesCat;
    });
  }, [query, activeCat]);

  const activeCatLabel =
    CATEGORIES.find((c) => c.id === activeCat)?.label ?? "Getting Started";

  const handleFeedback = (helpful: boolean) => {
    if (helpful) {
      toast.success("Thanks for the feedback!", {
        description: "We're glad this helped.",
      });
    } else {
      toast.info("We'll work on it", {
        description: "Tell us more via Contact Support — we read every message.",
      });
    }
  };

  const sidebarList = (
    <nav aria-label="Help categories" className="space-y-1">
      {CATEGORIES.map((c) => {
        const Icon = c.icon;
        const isActive = c.id === activeCat;
        return (
          <button
            key={c.id}
            type="button"
            onClick={() => {
              setActiveCat(c.id);
              setQuery("");
              setMobileCatOpen(false);
            }}
            aria-current={isActive ? "page" : undefined}
            className={cn(
              "flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm font-medium transition-colors",
              isActive
                ? "bg-[#32504d] text-white shadow-sm"
                : "text-muted-foreground hover:bg-[#32504d]/10 hover:text-[#192d2f]"
            )}
          >
            <Icon className="size-4 shrink-0" />
            <span className="flex-1 truncate">{c.label}</span>
            {isActive && <ChevronRight className="size-3.5 opacity-80" />}
          </button>
        );
      })}
    </nav>
  );

  return (
    <Dialog open={modal.helpOpen} onOpenChange={(o) => !o && closeHelp()}>
      <DialogPortal>
        <DialogOverlay className="bg-[#192d2f]/70 backdrop-blur-sm" />
        <DialogContent
          className="max-w-3xl w-[calc(100%-1.5rem)] max-h-[85vh] h-[80vh] p-0 gap-0 overflow-hidden flex flex-col"
          aria-describedby={undefined}
          showCloseButton
        >
          <DialogTitle className="sr-only">Help & Support Center</DialogTitle>
          <DialogDescription className="sr-only">
            Browse help categories, search frequently asked questions and contact our support team.
          </DialogDescription>

          {/* Header */}
          <div className="px-5 sm:px-6 pt-5 pb-4 border-b border-border/60 bg-gradient-to-b from-[#32504d]/5 to-transparent">
            <div className="flex items-start justify-between gap-3 flex-wrap">
              <div className="flex items-center gap-2.5">
                <div className="size-9 rounded-xl bg-[#32504d] text-white grid place-items-center shadow-sm">
                  <HelpCircle className="size-5" />
                </div>
                <div>
                  <h2 className="font-display font-bold text-lg leading-tight">
                    Help &amp; Support Center
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    Find answers, troubleshoot issues, talk to a human.
                  </p>
                </div>
              </div>
              {/* Status badge */}
              <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-[11px] font-medium text-emerald-700 dark:text-emerald-300">
                <span className="relative flex size-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500/60 opacity-75" />
                  <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
                </span>
                All systems operational
              </div>
            </div>

            {/* Search */}
            <div className="relative mt-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search help articles…  e.g. withdrawal, verification, disputes"
                aria-label="Search help articles"
                className="pl-9 pr-9 h-10 bg-background border-border/70 focus-visible:ring-[#32504d]/30"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  aria-label="Clear search"
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground text-xs"
                >
                  ✕
                </button>
              )}
            </div>
          </div>

          {/* Body: sidebar + content */}
          <div className="flex-1 flex min-h-0">
            {/* Desktop sidebar */}
            <aside className="hidden md:flex w-[220px] shrink-0 flex-col border-r border-border/60 bg-muted/30 p-3 overflow-y-auto">
              <span className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Categories
              </span>
              {sidebarList}
            </aside>

            {/* Mobile sidebar (Sheet) */}
            <div className="md:hidden px-5 pt-3">
              <Sheet open={mobileCatOpen} onOpenChange={setMobileCatOpen}>
                <SheetTrigger asChild>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="w-full justify-between border-[#32504d]/30 text-[#32504d] hover:bg-[#32504d]/5"
                  >
                    <span className="inline-flex items-center gap-2">
                      {(() => {
                        const Active = CATEGORIES.find((c) => c.id === activeCat)?.icon ?? Sparkles;
                        return <Active className="size-4" />;
                      })()}
                      {activeCatLabel}
                    </span>
                    <ChevronRight className="size-4" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[260px] p-4">
                  <SheetHeader>
                    <SheetTitle className="font-display">Categories</SheetTitle>
                  </SheetHeader>
                  <div className="mt-2">
                    {sidebarList}
                  </div>
                </SheetContent>
              </Sheet>
            </div>

            {/* Right content */}
            <div className="flex-1 min-w-0 overflow-y-auto px-5 sm:px-6 py-5 space-y-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={query ? `search-${query}` : activeCat}
                  initial={prefersReduced ? false : { opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={prefersReduced ? undefined : { opacity: 0, y: -8 }}
                  transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                  className="space-y-6"
                >
                  {/* Quick help cards (only when not searching) */}
                  {!query && (
                    <section aria-labelledby="quick-help-heading">
                      <h3
                        id="quick-help-heading"
                        className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2.5"
                      >
                        Quick help
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                        {QUICK_HELP.map((card) => {
                          const Icon = card.icon;
                          return (
                            <div
                              key={card.title}
                              className="group rounded-xl border border-border/70 bg-card p-3.5 transition-colors hover:border-[#32504d]/40 hover:bg-[#32504d]/5"
                            >
                              <div className="size-8 rounded-lg bg-[#32504d]/10 text-[#32504d] grid place-items-center mb-2">
                                <Icon className="size-4" />
                              </div>
                              <p className="text-sm font-semibold leading-tight">
                                {card.title}
                              </p>
                              <p className="text-[11px] text-muted-foreground mt-1 leading-snug">
                                {card.desc}
                              </p>
                              <Button
                                type="button"
                                size="sm"
                                variant="ghost"
                                className="mt-2 h-7 px-2 text-[11px] text-[#32504d] hover:bg-[#32504d]/10 hover:text-[#192d2f]"
                                onClick={card.onClick}
                              >
                                {card.cta}
                                <ChevronRight className="size-3" />
                              </Button>
                            </div>
                          );
                        })}
                      </div>
                    </section>
                  )}

                  {/* FAQ accordion */}
                  <section aria-labelledby="faq-heading">
                    <div className="flex items-center justify-between mb-2.5">
                      <h3
                        id="faq-heading"
                        className="text-xs font-semibold uppercase tracking-wider text-muted-foreground"
                      >
                        {query ? `Search results (${filteredFaqs.length})` : activeCatLabel}
                      </h3>
                      {query && (
                        <Badge
                          variant="outline"
                          className="text-[10px] font-normal text-muted-foreground"
                        >
                          “{query}”
                        </Badge>
                      )}
                    </div>

                    {filteredFaqs.length === 0 ? (
                      <div className="rounded-xl border border-dashed border-border/70 bg-muted/20 p-8 text-center">
                        <div className="mx-auto size-10 rounded-full bg-muted grid place-items-center mb-3">
                          <Search className="size-5 text-muted-foreground" />
                        </div>
                        <p className="text-sm font-medium">
                          No results for &lsquo;{query}&rsquo;
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Try a different keyword or browse all topics.
                        </p>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="mt-3 border-[#32504d]/40 text-[#32504d] hover:bg-[#32504d]/5"
                          onClick={() => setQuery("")}
                        >
                          Browse all topics
                        </Button>
                      </div>
                    ) : (
                      <Accordion type="single" collapsible className="rounded-xl border border-border/70 bg-card px-4">
                        {filteredFaqs.map((f) => (
                          <AccordionItem key={f.id} value={f.id}>
                            <AccordionTrigger className="text-sm font-medium hover:no-underline">
                              {f.question}
                            </AccordionTrigger>
                            <AccordionContent className="text-[13px] text-muted-foreground leading-relaxed">
                              {f.answer}
                            </AccordionContent>
                          </AccordionItem>
                        ))}
                      </Accordion>
                    )}
                  </section>

                  {/* Still need help? */}
                  {!query && (
                    <section aria-labelledby="contact-heading">
                      <h3
                        id="contact-heading"
                        className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2.5"
                      >
                        Still need help?
                      </h3>
                      <div className="rounded-xl border border-border/70 bg-gradient-to-br from-[#32504d]/10 via-[#748684]/5 to-transparent p-4 sm:p-5">
                        <p className="text-sm font-semibold text-foreground">
                          Our team is one message away.
                        </p>
                        <p className="text-xs text-muted-foreground mt-1 mb-3.5 max-w-md">
                          Average response time under 4 hours during business days.
                        </p>
                        <div className="flex flex-col sm:flex-row flex-wrap gap-2">
                          <Button
                            type="button"
                            size="sm"
                            className="bg-[#2b3d3d] hover:bg-[#192d2f] text-white"
                            onClick={() =>
                              toast.success("Support team will email you within 24h", {
                                description: "We've logged your ticket #KHD-4821.",
                              })
                            }
                          >
                            <Mail className="size-3.5" />
                            Contact Support
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            className="border-[#32504d]/30 text-[#32504d] hover:bg-[#32504d]/5 hover:text-[#192d2f]"
                            onClick={() => {
                              closeHelp();
                              openMessaging();
                            }}
                          >
                            <MessageSquare className="size-3.5" />
                            Live Chat
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            className="text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                            onClick={() =>
                              toast.info("Opening community…", {
                                description: "Discuss with 12,000+ Khidma members.",
                              })
                            }
                          >
                            <Users className="size-3.5" />
                            Community Forum
                          </Button>
                        </div>
                      </div>
                    </section>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* Footer */}
          <div className="px-5 sm:px-6 py-3 border-t border-border/60 bg-muted/30 flex flex-col sm:flex-row sm:items-center gap-2 sm:justify-between">
            <p className="text-[11px] text-muted-foreground">
              Was this helpful?
            </p>
            <div className="flex items-center gap-2">
              <Button
                type="button"
                size="sm"
                variant="outline"
                className="h-7 px-2.5 text-[11px] border-emerald-500/30 text-emerald-700 hover:bg-emerald-500/10 dark:text-emerald-300"
                onClick={() => handleFeedback(true)}
              >
                <ThumbsUp className="size-3" />
                Yes
              </Button>
              <Button
                type="button"
                size="sm"
                variant="outline"
                className="h-7 px-2.5 text-[11px] border-rose-400/40 text-rose-600 hover:bg-rose-500/10 dark:text-rose-300"
                onClick={() => handleFeedback(false)}
              >
                <ThumbsDown className="size-3" />
                No
              </Button>
              <Button
                type="button"
                size="sm"
                variant="ghost"
                className="h-7 px-2.5 text-[11px] text-muted-foreground"
                onClick={closeHelp}
              >
                Close
              </Button>
            </div>
          </div>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}

export default HelpModal;
