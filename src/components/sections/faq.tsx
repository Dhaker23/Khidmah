"use client";
import { useT } from "@/lib/use-t";

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

/** "Was this helpful?" mini-feedback row , Yes/No buttons with thumbs icons. */
function FeedbackRow() {
  const { t } = useT();
  const [vote, setVote] = useState<"yes" | "no" | null>(null);

  const handleVote = (choice: "yes" | "no") => {
    if (vote === choice) return;
    setVote(choice);
    toast(t("section.faq.feedback.thanks"), {
      description:
        choice === "yes"
          ? t("section.faq.feedback.helped")
          : t("section.faq.feedback.improve"),
    });
  };

  return (
    <div className="mt-4 flex items-center gap-2 pt-3 border-t border-border/40">
      <span className="text-xs text-muted-foreground">{t("section.faq.feedback.question")}</span>
      <button
        type="button"
        onClick={() => handleVote("yes")}
        aria-pressed={vote === "yes"}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium transition-colors",
          vote === "yes"
            ? "bg-[#32504d]/15 dark:bg-[#32504d]/25 text-[#32504d] dark:text-[#9bb3ae]"
            : "text-muted-foreground hover:bg-accent hover:text-foreground"
        )}
      >
        <ThumbsUp className="size-3.5" />
        {t("section.faq.feedback.yes")}
      </button>
      <button
        type="button"
        onClick={() => handleVote("no")}
        aria-pressed={vote === "no"}
        className={cn(
          "inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-medium transition-colors",
          vote === "no"
            ? "bg-[#32504d]/15 dark:bg-[#32504d]/25 text-[#32504d] dark:text-[#9bb3ae]"
            : "text-muted-foreground hover:bg-accent hover:text-foreground"
        )}
      >
        <ThumbsDown className="size-3.5" />
        {t("section.faq.feedback.no")}
      </button>
    </div>
  );
}

export function FAQ() {
  const { t } = useT();
  const { openOnboarding, setView, openHelp } = useApp();

  const faqs: QA[] = [
    { icon: ShieldCheck, question: t("section.faq.items.q1"), answer: t("section.faq.items.a1") },
    { icon: Wallet, question: t("section.faq.items.q2"), answer: t("section.faq.items.a2") },
    { icon: CreditCard, question: t("section.faq.items.q3"), answer: t("section.faq.items.a3") },
    { icon: Percent, question: t("section.faq.items.q4"), answer: t("section.faq.items.a4") },
    { icon: Wallet, question: t("section.faq.items.q5"), answer: t("section.faq.items.a5") },
    { icon: Globe2, question: t("section.faq.items.q6"), answer: t("section.faq.items.a6") },
    { icon: Scale, question: t("section.faq.items.q7"), answer: t("section.faq.items.a7") },
    { icon: UserCheck, question: t("section.faq.items.q8"), answer: t("section.faq.items.a8") },
  ];

  return (
    <section id="faq" className="py-16 sm:py-24 bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
          {/* Left: heading */}
          <Reveal className="lg:col-span-5">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#748684]">
              {t("section.eyebrow.faqShort")}
            </span>
            <h2 className="mt-2 font-display text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
              {t("section.faq")}
            </h2>
            <p className="mt-3 text-base text-muted-foreground leading-relaxed">
              {t("section.faq.subtitle")}
            </p>

            <div className="mt-6 rounded-xl border border-[#32504d]/20 dark:border-[#32504d]/30 bg-[#32504d]/5 dark:bg-[#32504d]/15 p-5">
              <div className="flex items-start gap-3">
                <HelpCircle className="size-5 text-[#32504d] dark:text-[#9bb3ae] shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    {t("section.faq.helpCard.title")}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {t("section.faq.helpCard.body")}
                  </p>
                  <div className="mt-3 flex flex-col sm:flex-row gap-2">
                    <button
                      type="button"
                      onClick={openOnboarding}
                      className="inline-flex h-8 items-center justify-center rounded-md bg-[#2b3d3d] px-3 text-xs font-medium text-white hover:bg-[#32504d] transition-colors"
                    >
                      {t("section.faq.helpCard.ctaFreelancer")}
                    </button>
                    <button
                      type="button"
                      onClick={() => setView("freelancers")}
                      className="inline-flex h-8 items-center justify-center rounded-md border border-border px-3 text-xs font-medium text-foreground hover:bg-accent transition-colors"
                    >
                      {t("section.faq.helpCard.ctaHire")}
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
                          <Icon className="size-3.5 text-[#32504d] dark:text-[#9bb3ae] shrink-0" />
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

        {/* Contact support CTA card , at the bottom of the FAQ section */}
        <Reveal delay={0.1} className="mt-10">
          <Card className="mx-auto max-w-3xl p-6 sm:p-8 border-[#32504d]/20 dark:border-[#32504d]/30 bg-gradient-to-br from-[#32504d]/[0.05] via-[#748684]/[0.03] to-transparent">
            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 text-center sm:text-left">
              <LifeBuoy className="size-6 text-[#32504d] dark:text-[#9bb3ae] shrink-0" />
              <div className="flex-1">
                <h3 className="font-display text-lg sm:text-xl font-semibold tracking-tight text-foreground">
                  {t("section.faq.supportCard.title")}
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {t("section.faq.supportCard.body")}
                </p>
              </div>
              <Button
                onClick={openHelp}
                className="bg-[#2b3d3d] hover:bg-[#32504d] text-white shrink-0"
              >
                <Mail className="size-4" />
                {t("section.faq.supportCard.cta")}
              </Button>
            </div>
          </Card>
        </Reveal>
      </div>
    </section>
  );
}

export default FAQ;
