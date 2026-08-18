"use client";

import { motion } from "framer-motion";
import { HelpCircle, ShieldCheck, Wallet, CreditCard, Globe2, Scale, Percent, UserCheck } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card } from "@/components/ui/card";
import { useApp } from "@/lib/store";

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

export function FAQ() {
  const { openOnboarding, setView } = useApp();
  return (
    <section className="py-16 sm:py-24 bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
          {/* Left: heading */}
          <motion.div
            className="lg:col-span-5"
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.55 }}
          >
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
          </motion.div>

          {/* Right: accordion */}
          <motion.div
            className="lg:col-span-7"
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.55, delay: 0.1 }}
          >
            <Card className="p-2 sm:p-4 border-border/60">
              <Accordion type="single" collapsible className="w-full">
                {faqs.map((qa, i) => {
                  const Icon = qa.icon;
                  return (
                    <AccordionItem
                      key={qa.question}
                      value={`faq-${i}`}
                      className="px-3 sm:px-4 first:pt-2 last:pb-2"
                    >
                      <AccordionTrigger className="hover:no-underline">
                        <span className="flex items-center gap-3 text-left">
                          <span className="flex size-7 items-center justify-center rounded-lg bg-[#32504d]/10 text-[#32504d] shrink-0">
                            <Icon className="size-3.5" />
                          </span>
                          <span className="font-display text-sm sm:text-base font-semibold text-foreground">
                            {qa.question}
                          </span>
                        </span>
                      </AccordionTrigger>
                      <AccordionContent className="pl-10 sm:pl-11">
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {qa.answer}
                        </p>
                      </AccordionContent>
                    </AccordionItem>
                  );
                })}
              </Accordion>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default FAQ;
