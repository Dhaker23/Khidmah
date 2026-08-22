"use client";
import { useT } from "@/lib/use-t";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Banknote, MapPin, Globe2, Clock, Wallet } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Reveal, SectionHeading } from "@/components/khidma/reveal";
import { withdrawalMethods } from "@/lib/khidma-data";

type GroupKey = "Local" | "Bank" | "International";

const typeColors: Record<string, string> = {
  Local: "bg-[#32504d]/10 text-[#32504d] border-[#32504d]/20 dark:bg-[#32504d]/25 dark:text-[#9bb3ae] dark:border-[#32504d]/30",
  Bank: "bg-[#475959]/10 text-[#475959] border-[#475959]/20 dark:bg-[#475959]/25 dark:text-[#94a8a4] dark:border-[#475959]/30",
  International: "bg-[#6e8580]/10 text-[#6e8580] border-[#6e8580]/20 dark:bg-[#6e8580]/25 dark:text-[#9bb3ae] dark:border-[#6e8580]/30",
};

export function WithdrawalOptions() {
  const { t } = useT();
  const [active, setActive] = useState<GroupKey>("Local");
  const filtered = withdrawalMethods.filter((m) => m.type === active);

  const groups: { key: GroupKey; label: string; icon: typeof MapPin; description: string }[] = [
    {
      key: "Local",
      label: t("section.withdrawalOptions.localMethods"),
      icon: MapPin,
      description: t("section.withdrawalOptions.localMethodsDesc"),
    },
    {
      key: "Bank",
      label: t("section.withdrawalOptions.bankTransfers"),
      icon: Banknote,
      description: t("section.withdrawalOptions.bankTransfersDesc"),
    },
    {
      key: "International",
      label: t("section.withdrawalOptions.international"),
      icon: Globe2,
      description: t("section.withdrawalOptions.internationalDesc"),
    },
  ];

  return (
    <section className="py-16 sm:py-24 bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow={t("section.eyebrow.withdrawals")}
          title={t("section.withdrawalOptions")}
          description={t("section.withdrawalOptions.subtitle")}
        />

        {/* Tabs */}
        <Reveal className="mb-8">
          <div className="flex flex-col sm:flex-row gap-3">
            {groups.map((g) => {
              const Icon = g.icon;
              const isActive = active === g.key;
              return (
                <button
                  key={g.key}
                  type="button"
                  onClick={() => setActive(g.key)}
                  className={cn(
                    "flex-1 flex items-center gap-3 rounded-xl border px-4 py-3 text-left transition-all",
                    isActive
                      ? "border-[#32504d] dark:border-[#32504d]/60 bg-[#32504d]/5 dark:bg-[#32504d]/15 shadow-sm"
                      : "border-border/60 bg-card hover:border-[#32504d]/40 dark:hover:border-[#32504d]/40"
                  )}
                >
                  <span
                    className={cn(
                      "flex size-9 items-center justify-center rounded-lg",
                      isActive
                        ? "bg-[#32504d] text-white dark:bg-[#32504d]/80"
                        : "bg-[#32504d]/10 text-[#32504d] dark:bg-[#32504d]/25 dark:text-[#9bb3ae]"
                    )}
                  >
                    <Icon className="size-4" />
                  </span>
                  <span className="min-w-0">
                    <span
                      className={cn(
                        "block text-sm font-semibold",
                        isActive ? "text-[#32504d] dark:text-[#9bb3ae]" : "text-foreground"
                      )}
                    >
                      {g.label}
                    </span>
                    <span className="block text-xs text-muted-foreground truncate">
                      {g.description}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </Reveal>

        {/* Cards grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.3 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5"
          >
            {filtered.map((m, i) => (
              <Reveal key={m.id} delay={0.05 * i}>
                <Card className="p-5 border-border/60 hover:border-[#32504d]/40 dark:hover:border-[#32504d]/40 khidma-card">
                  <div className="flex items-start justify-between mb-4">
                    <div className="relative size-14 flex items-center justify-center rounded-xl bg-white/95 dark:bg-white/95 p-1.5 shadow-sm">
                      <Image
                        src={m.image}
                        alt={m.name}
                        width={48}
                        height={48}
                        className="max-w-full max-h-full object-contain"
                      />
                    </div>
                    <Badge
                      variant="outline"
                      className={cn("text-[10px] h-5", typeColors[m.type])}
                    >
                      {m.type}
                    </Badge>
                  </div>
                  <h3 className="font-display text-base font-semibold text-foreground">
                    {m.name}
                  </h3>
                  <div className="mt-3 pt-3 border-t border-border/60 grid grid-cols-2 gap-3">
                    <div>
                      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                        {t("section.withdrawalOptions.fee")}
                      </div>
                      <div className="flex items-center gap-1 text-sm font-semibold text-foreground">
                        <Wallet className="size-3.5 text-[#32504d] dark:text-[#9bb3ae]" />
                        {m.fee}
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                        {t("section.withdrawalOptions.time")}
                      </div>
                      <div className="flex items-center gap-1 text-sm font-semibold text-foreground">
                        <Clock className="size-3.5 text-[#475959] dark:text-[#94a8a4]" />
                        {m.time}
                      </div>
                    </div>
                  </div>
                </Card>
              </Reveal>
            ))}
          </motion.div>
        </AnimatePresence>

        <p className="mt-6 text-xs text-muted-foreground">
          {t("section.withdrawalOptions.footnote")}
        </p>
      </div>
    </section>
  );
}

export default WithdrawalOptions;
