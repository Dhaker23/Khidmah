"use client";
import { useT } from "@/lib/use-t";

import {
  ShieldCheck,
  Percent,
  Lock,
  Wallet,
  Star,
  Repeat,
  type LucideIcon,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Reveal } from "@/components/khidma/reveal";

interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
}

export function WhyKhidma() {
  const { t } = useT();
  const features: Feature[] = [
    {
      icon: ShieldCheck,
      title: t("section.whyKhidma.f1.title"),
      description: t("section.whyKhidma.f1.description"),
    },
    {
      icon: Percent,
      title: t("section.whyKhidma.f2.title"),
      description: t("section.whyKhidma.f2.description"),
    },
    {
      icon: Lock,
      title: t("section.whyKhidma.f3.title"),
      description: t("section.whyKhidma.f3.description"),
    },
    {
      icon: Wallet,
      title: t("section.whyKhidma.f4.title"),
      description: t("section.whyKhidma.f4.description"),
    },
    {
      icon: Star,
      title: t("section.whyKhidma.f5.title"),
      description: t("section.whyKhidma.f5.description"),
    },
    {
      icon: Repeat,
      title: t("section.whyKhidma.f6.title"),
      description: t("section.whyKhidma.f6.description"),
    },
  ];
  return (
    <section className="py-16 sm:py-24 bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* Left: heading */}
          <Reveal className="lg:col-span-5">
            <div className="lg:sticky lg:top-24">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#748684]">
                {t("section.whyKhidma")}
              </span>
              <h2 className="mt-2 font-display text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground leading-tight">
                {t("section.whyKhidma.title")}
              </h2>
              <p className="mt-4 text-base text-muted-foreground leading-relaxed">
                {t("section.whyKhidma.subtitle")}
              </p>

              <div className="mt-6 flex flex-wrap gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#32504d]/10 dark:bg-[#32504d]/20 px-3 py-1 text-xs font-medium text-[#32504d] dark:text-[#9bb3ae]">
                  <ShieldCheck className="size-3.5" />
                  {t("section.whyKhidma.badge.identityVerified")}
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#475959]/10 dark:bg-[#475959]/20 px-3 py-1 text-xs font-medium text-[#475959] dark:text-[#94a8a4]">
                  <Lock className="size-3.5" />
                  {t("section.whyKhidma.badge.escrowProtected")}
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#6e8580]/10 px-3 py-1 text-xs font-medium text-[#6e8580]">
                  <Percent className="size-3.5" />
                  {t("section.whyKhidma.badge.flatFee")}
                </span>
              </div>
            </div>
          </Reveal>

          {/* Right: feature cards */}
          <div className="lg:col-span-7">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
              {features.map((f, i) => {
                const Icon = f.icon;
                return (
                  <Reveal key={f.title} delay={0.05 * i}>
                    <Card className="group h-full p-5 border-border/60 hover:border-[#32504d]/40 khidma-card">
                      <div className="flex size-10 items-center justify-center rounded-lg bg-[#32504d]/10 dark:bg-[#32504d]/20 text-[#32504d] dark:text-[#9bb3ae] mb-3 transition-transform duration-200 ease-out group-hover:-translate-y-0.5">
                        <Icon className="size-5" />
                      </div>
                      <h3 className="font-display text-base font-semibold text-foreground">
                        {f.title}
                      </h3>
                      <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">
                        {f.description}
                      </p>
                    </Card>
                  </Reveal>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default WhyKhidma;
