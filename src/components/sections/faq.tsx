"use client";

import { useState } from "react";
import {
  CreditCard,
  Globe2,
  HelpCircle,
  LifeBuoy,
  Mail,
  Percent,
  Scale,
  ShieldCheck,
  ThumbsDown,
  ThumbsUp,
  UserCheck,
  Wallet,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Reveal } from "@/components/khidma/reveal";
import { useApp } from "@/lib/store";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface QA {
  question: string;
  answer: string;
  icon: typeof ShieldCheck;
}

const faqs: QA[] = [
  {
    icon: ShieldCheck,
    question: "How does verification work?",
    answer:
      "Every freelancer goes through a multi-step verification: email confirmation, phone verification, national ID check, and a portfolio review by our team. Once all checks pass, the freelancer receives an Identity Verified badge that appears on their profile and proposals.",
  },
  {
    icon: Wallet,
    question: "Is Khidma free to join?",
    answer:
      "Yes. Account registration, profile creation, job applications, and service publishing are completely free. Khidma only charges a flat 1% marketplace fee on completed contract payments — no subscriptions, no proposal credits, no listing fees.",
  },
  {
    icon: CreditCard,
    question: "How are payments protected?",
    answer:
      "All contracts use milestone-based escrow. Clients fund milestones upfront and the funds are held safely by Khidma. Funds are only released to the freelancer once the client approves the delivered work — protecting both sides from non-payment and non-delivery.",
  },
  {
    icon: Percent,
    question: "How is the 1% fee calculated?",
    answer:
      "The fee is calculated on the total contract value at the time of milestone release. For example, on a 1,000 TND project, the platform fee is 10 TND and the freelancer receives 990 TND. There are no tier-based surcharges or hidden charges.",
  },
  {
    icon: Wallet,
    question: "How do withdrawals work?",
    answer:
      "Available earnings in your Khidma wallet can be withdrawn via local methods (D17, Tunisian Post), bank transfers (BIAT, TIJARI, Zitouna), or international options (Western Union, international bank transfer). Processing times range from instant to 3–5 business days depending on the method.",
  },
  {
    icon: Globe2,
    question: "Can international clients hire Tunisian freelancers?",
    answer:
      "Absolutely. Khidma is built to connect Tunisian talent with clients worldwide. International clients can post jobs, hire freelancers, fund escrow, and pay using major currencies. Withdrawals for freelancers support both local Tunisian and international methods.",
  },
  {
    icon: Scale,
    question: "What if there's a dispute?",
    answer:
      "If a client and freelancer cannot reach agreement on a milestone, either party can open a dispute. Khidma's resolution team reviews the contract terms, communications, and delivered work, then issues a binding decision. Escrow funds remain protected throughout the process.",
  },
  {
    icon: UserCheck,
    question: "Can anyone become a freelancer?",
    answer:
      "Anyone can register and start a profile, but to receive the Verified badge and apply for paid contracts, you must complete email, phone, and identity verification, and submit a portfolio for review. Our team reviews each application manually to maintain marketplace quality.",
  },
];

/** "Was this helpful?" mini-feedback row — Yes/No buttons with thumbs icons. */
function FeedbackRow() {
  const [vote, setVote] = useState<"yes" | "no" | null>(null);

  const handleVote = (choice: "yes" | "no") => {
    if (vote === choice) return;
    setVote(choice);
    toast("Thanks for your feedback!", {
      description:
        choice === "yes"
          ? "Glad this answer helped."
          : "We'll work on improving this answer.",
    });
  };

  return (
    <div className="mt-4 flex items-center gap-2 pt-3 border-t border-border/40">
      <span className="text-xs text-muted-foreground">Was this helpful?</span>
      <button
        type="button"
        onClick={() => handleVote("yes")}
        aria-pressed={vote === "yes"}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium transition-colors",
          vote === "yes"
            ? "bg-[#32504d]/15 text-[#32504d]"
            : "text-muted-foreground hover:bg-accent hover:text-foreground"
        )}
      >
        <ThumbsUp className="size-3.5" />
        Yes
      </button>
      <button
        type="button"
        onClick={() => handleVote("no")}
        aria-pressed={vote === "no"}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium transition-colors",
          vote === "no"
            ? "bg-[#32504d]/15 text-[#32504d]"
            : "text-muted-foreground hover:bg-accent hover:text-foreground"
        )}
      >
        <ThumbsDown className="size-3.5" />
        No
      </button>
    </div>
  );
}

export function FAQ() {
  const { openOnboarding, setView, openHelp } = useApp();
  return (
    <section id="faq" className="py-16 sm:py-24 bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
          {/* Left: heading */}
          <Reveal className="lg:col-span-5">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#748684]">
              FAQ
            </span>
            <h2 className="mt-2 font-display text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
              Questions, answered.
            </h2>
            <p className="mt-3 text-base text-muted-foreground leading-relaxed">
              Everything you need to know about verification, payments,
              contracts, and withdrawals on Khidma.
            </p>

            <div className="mt-6 rounded-xl border border-[#32504d]/20 bg-[#32504d]/5 p-5">
              <div className="flex items-start gap-3">
                <HelpCircle className="size-5 text-[#32504d] shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    Still have questions?
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Start the freelancer onboarding — our team walks you
                    through every step.
                  </p>
                  <div className="mt-3 flex flex-col sm:flex-row gap-2">
                    <button
                      type="button"
                      onClick={openOnboarding}
                      className="inline-flex h-8 items-center justify-center rounded-md bg-[#2b3d3d] px-3 text-xs font-medium text-white hover:bg-[#32504d] transition-colors"
                    >
                      Become a freelancer
                    </button>
                    <button
                      type="button"
                      onClick={() => setView("freelancers")}
                      className="inline-flex h-8 items-center justify-center rounded-md border border-border px-3 text-xs font-medium text-foreground hover:bg-accent transition-colors"
                    >
                      Hire talent
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>

          {/* Right: accordion */}
          <Reveal className="lg:col-span-7" delay={0.1}>
            <Card className="p-2 sm:p-4 border-border/60">
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((qa, i) => {
                  const Icon = qa.icon;
                  return (
                    <AccordionItem
                      key={qa.question}
                      value={`faq-${i}`}
                      className={cn(
                        "px-3 sm:px-4 first:pt-2 last:pb-2 rounded-md transition-colors duration-200",
                        // Subtle teal background tint on expanded item
                        "data-[state=open]:bg-[#32504d]/[0.04]",
                        // Left-border accent (teal) on expanded item via inset shadow (no layout shift)
                        "data-[state=open]:shadow-[inset_2px_0_0_0_#32504d]"
                      )}
                    >
                      <AccordionTrigger className="hover:no-underline [&>svg]:duration-300 [&>svg]:ease-out">
                        <span className="flex items-center gap-3 text-left">
                          <span className="flex size-7 items-center justify-center rounded-lg bg-[#32504d]/10 text-[#32504d] shrink-0">
                            <Icon className="size-3.5" />
                          </span>
                          <span className="font-display text-base sm:text-lg font-semibold tracking-tight text-foreground">
                            {qa.question}
                          </span>
                        </span>
                      </AccordionTrigger>
                      <AccordionContent className="pl-10 sm:pl-11">
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {qa.answer}
                        </p>
                        <FeedbackRow />
                      </AccordionContent>
                    </AccordionItem>
                  );
                })}
              </Accordion>
            </Card>
          </Reveal>
        </div>

        {/* Contact support CTA card — at the bottom of the FAQ section */}
        <Reveal delay={0.1} className="mt-10">
          <Card className="mx-auto max-w-3xl p-6 sm:p-8 border-[#32504d]/20 bg-gradient-to-br from-[#32504d]/[0.05] via-[#748684]/[0.03] to-transparent">
            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 text-center sm:text-left">
              <div className="flex size-12 items-center justify-center rounded-full bg-[#32504d]/10 text-[#32504d] shrink-0">
                <LifeBuoy className="size-6" />
              </div>
              <div className="flex-1">
                <h3 className="font-display text-lg sm:text-xl font-semibold tracking-tight text-foreground">
                  Still have questions?
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Our support team replies within 24 hours, 7 days a week.
                  We&apos;re here to help with verification, payments,
                  contracts, and anything else.
                </p>
              </div>
              <Button
                onClick={openHelp}
                className="bg-[#2b3d3d] hover:bg-[#32504d] text-white shrink-0"
              >
                <Mail className="size-4" />
                Contact support
              </Button>
            </div>
          </Card>
        </Reveal>
      </div>
    </section>
  );
}

export default FAQ;
