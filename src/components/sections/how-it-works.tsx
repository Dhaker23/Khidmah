"use client";
import { useT } from "@/lib/use-t";

import { motion, useReducedMotion } from "framer-motion";
import {
  UserCheck,
  FolderKanban,
  BadgeCheck,
  FileText,
  Users2,
  ShieldCheck,
  Wallet,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { Reveal, BrandDivider, SectionHeading } from "@/components/khidma/reveal";

export function HowItWorks() {
  const { t } = useT();
  const prefersReduced = useReducedMotion();

  const freelancerSteps = [
    {
      icon: UserCheck,
      title: t("section.howItWorks.freelancers.step1.title"),
      description: t("section.howItWorks.freelancers.step1.description"),
      action: t("section.howItWorks.freelancers.step1.action"),
    },
    {
      icon: FolderKanban,
      title: t("section.howItWorks.freelancers.step2.title"),
      description: t("section.howItWorks.freelancers.step2.description"),
      action: t("section.howItWorks.freelancers.step2.action"),
    },
    {
      icon: BadgeCheck,
      title: t("section.howItWorks.freelancers.step3.title"),
      description: t("section.howItWorks.freelancers.step3.description"),
      action: t("section.howItWorks.freelancers.step3.action"),
    },
  ];

  const clientSteps = [
    {
      icon: FileText,
      label: t("section.howItWorks.clients.step1.label"),
      description: t("section.howItWorks.clients.step1.description"),
    },
    {
      icon: Users2,
      label: t("section.howItWorks.clients.step2.label"),
      description: t("section.howItWorks.clients.step2.description"),
    },
    {
      icon: ShieldCheck,
      label: t("section.howItWorks.clients.step3.label"),
      description: t("section.howItWorks.clients.step3.description"),
    },
    {
      icon: CheckCircle2,
      label: t("section.howItWorks.clients.step4.label"),
      description: t("section.howItWorks.clients.step4.description"),
    },
  ];

  return (
    <section className="py-16 sm:py-24 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow={t("section.howItWorks")}
          title={t("section.howItWorks.freelancers.title")}
          description={t("section.howItWorks.freelancers.subtitle")}
        />

        {/* Freelancer flow */}
        <div className="relative">
          <Reveal>
            <div className="mb-6 flex items-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-full bg-[#32504d]/10 dark:bg-[#32504d]/20 px-3 py-1 text-xs font-semibold text-[#32504d] dark:text-[#9bb3ae]">
                <UserCheck className="size-3.5" />
                {t("section.howItWorks.freelancers.forFreelancers")}
              </span>
            </div>
          </Reveal>

          {/* Animated connecting line (decorative) */}
          <motion.div
            aria-hidden
            initial={prefersReduced ? undefined : { width: 0 }}
            whileInView={prefersReduced ? undefined : { width: "100%" }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="hidden md:block absolute top-[88px] left-[16.66%] right-[16.66%] h-px origin-left bg-gradient-to-r from-transparent via-[#32504d]/30 to-transparent"
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6">
            {freelancerSteps.map((step, i) => {
              const Icon = step.icon;
              return (
                <Reveal key={step.title} delay={0.05 * i}>
                  <Card className="relative h-full p-6 border-border/60 hover:border-[#32504d]/40 khidma-card">
                    {/* Number badge */}
                    <div className="flex items-center justify-between mb-4">
                      <Icon className="size-6 text-[#32504d] dark:text-[#9bb3ae]" />
                      <span className="font-display text-5xl font-bold text-[#32504d] dark:text-[#9bb3ae]/10 leading-none">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    </div>
                    <h3 className="font-display text-lg font-semibold text-foreground">
                      {step.title}
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                      {step.description}
                    </p>
                    <div className="mt-4 pt-4 border-t border-border/60">
                      <div className="flex items-center gap-2 text-xs">
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-[#748684]">
                          {t("section.howItWorks.freelancers.keyAction")}
                        </span>
                      </div>
                      <p className="mt-1 text-sm font-medium text-[#2b3d3d] dark:text-[#94a8a4]">
                        {step.action}
                      </p>
                    </div>
                  </Card>
                </Reveal>
              );
            })}
          </div>
        </div>

        {/* Brand divider between flows */}
        <BrandDivider label={t("section.howItWorks.freelancers.forClients")} className="my-12 sm:my-16" />

        {/* Client flow */}
        <div className="relative">
          <Reveal>
            <div className="mb-6 flex items-center gap-3">
              <span className="inline-flex items-center gap-2 rounded-full bg-[#475959]/10 dark:bg-[#475959]/20 px-3 py-1 text-xs font-semibold text-[#475959] dark:text-[#94a8a4]">
                <FileText className="size-3.5" />
                {t("section.howItWorks.freelancers.forClients")}
              </span>
            </div>
          </Reveal>

          {/* Animated connecting line (decorative) */}
          <motion.div
            aria-hidden
            initial={prefersReduced ? undefined : { width: 0 }}
            whileInView={prefersReduced ? undefined : { width: "100%" }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="hidden md:block absolute top-[60px] left-[12.5%] right-[12.5%] h-px origin-left bg-gradient-to-r from-transparent via-[#475959]/25 to-transparent"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
            {clientSteps.map((step, i) => {
              const Icon = step.icon;
              return (
                <Reveal key={step.label} delay={0.05 * i}>
                  <Card className="group h-full p-5 border-border/60 hover:border-[#475959]/40 khidma-card">
                    <div className="flex items-center gap-3 mb-3">
                      <Icon className="size-4 text-[#475959] dark:text-[#94a8a4]" />
                      <span className="font-display text-sm font-semibold text-foreground">
                        {i + 1}. {step.label}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {step.description}
                    </p>
                    {i < clientSteps.length - 1 && (
                      <ArrowRight
                        className={cn(
                          "hidden lg:block size-4 text-[#748684]/60 absolute -right-2.5 top-1/2 -translate-y-1/2 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:text-[#475959] dark:text-[#94a8a4]"
                        )}
                      />
                    )}
                  </Card>
                </Reveal>
              );
            })}
          </div>
        </div>

        {/* Trust callout */}
        <Reveal className="mt-10 sm:mt-14">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 rounded-2xl border border-[#32504d]/20 dark:border-[#32504d]/30 bg-[#32504d]/5 dark:bg-[#32504d]/15 p-5">
            <Wallet className="size-5 text-[#32504d] dark:text-[#9bb3ae] shrink-0" />
            <p className="text-sm text-foreground">
              <span className="font-semibold">{t("section.howItWorks.freelancers.escrow.headline")}</span>{" "}
              <span className="text-muted-foreground">
                {t("section.howItWorks.freelancers.escrow.body")}
              </span>
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export default HowItWorks;
