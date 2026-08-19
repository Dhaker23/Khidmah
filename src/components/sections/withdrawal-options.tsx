"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Banknote, MapPin, Globe2, Clock, Wallet } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Reveal, SectionHeading } from "@/components/khidma/reveal";
import { withdrawalMethods } from "@/lib/khidma-data";

type GroupKey = "Local" | "Bank" | "International";

const groups: { key: GroupKey; label: string; icon: typeof MapPin; description: string }[] = [
  {
    key: "Local",
    label: "Local Methods",
    icon: MapPin,
    description: "Fast, mobile-first payouts inside Tunisia",
  },
  {
    key: "Bank",
    label: "Bank Transfers",
    icon: Banknote,
    description: "Direct transfers to Tunisian bank accounts",
  },
  {
    key: "International",
    label: "International",
    icon: Globe2,
    description: "Receive funds abroad with global providers",
  },
];

const typeColors: Record<string, string> = {
  Local: "bg-[#32504d]/10 text-[#32504d] border-[#32504d]/20",
  Bank: "bg-[#475959]/10 text-[#475959] border-[#475959]/20",
  International: "bg-[#6e8580]/10 text-[#6e8580] border-[#6e8580]/20",
};

export function WithdrawalOptions() {
  const [active, setActive] = useState<GroupKey>("Local");
  const filtered = withdrawalMethods.filter((m) => m.type === active);

  return (
    <section className="py-16 sm:py-24 bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Withdrawals"
          title="Withdraw Your Earnings — Your Way"
          description="Pick the payout method that fits your workflow. Mobile wallets for instant cash, bank transfers for larger amounts, and international options when you're working with clients abroad."
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
                      ? "border-[#32504d] bg-[#32504d]/5 shadow-sm"
                      : "border-border/60 bg-card hover:border-[#32504d]/40"
                  )}
                >
                  <span
                    className={cn(
                      "flex size-9 items-center justify-center rounded-lg",
                      isActive
                        ? "bg-[#32504d] text-white"
                        : "bg-[#32504d]/10 text-[#32504d]"
                    )}
                  >
                    <Icon className="size-4" />
                  </span>
                  <span className="min-w-0">
                    <span
                      className={cn(
                        "block text-sm font-semibold",
                        isActive ? "text-[#32504d]" : "text-foreground"
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
                <Card className="p-5 border-border/60 hover:border-[#32504d]/40 khidma-card">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex size-12 items-center justify-center rounded-xl bg-[#32504d]/5 text-2xl">
                      <span aria-hidden>{m.logo}</span>
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
                        Fee
                      </div>
                      <div className="flex items-center gap-1 text-sm font-semibold text-foreground">
                        <Wallet className="size-3.5 text-[#32504d]" />
                        {m.fee}
                      </div>
                    </div>
                    <div>
                      <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                        Time
                      </div>
                      <div className="flex items-center gap-1 text-sm font-semibold text-foreground">
                        <Clock className="size-3.5 text-[#475959]" />
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
          Withdrawal fees may vary based on the method and currency conversion
          rates. All transactions are processed via Khidma&apos;s secure wallet
          system.
        </p>
      </div>
    </section>
  );
}

export default WithdrawalOptions;
