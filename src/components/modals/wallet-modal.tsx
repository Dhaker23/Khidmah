"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogPortal,
  DialogOverlay,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Wallet,
  ArrowDownLeft,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  Plus,
  TrendingUp,
  PiggyBank,
  Banknote,
  ArrowRight,
  CreditCard,
  Wallet as WalletIcon,
} from "lucide-react";
import { useApp } from "@/lib/store";
import { toast } from "sonner";
import { withdrawalMethods, formatTND } from "@/lib/khidma-data";
import { cn } from "@/lib/utils";

const balances = [
  {
    key: "available",
    label: "Available",
    value: 8420,
    sub: "Ready to withdraw",
    icon: CheckCircle2,
    color: "#32504d",
  },
  {
    key: "pending",
    label: "Pending",
    value: 2350,
    sub: "In clearance (7 days)",
    icon: Clock,
    color: "#475959",
  },
  {
    key: "processing",
    label: "Processing",
    value: 1200,
    sub: "Withdrawal in progress",
    icon: TrendingUp,
    color: "#748684",
  },
  {
    key: "withdrawn",
    label: "Withdrawn",
    value: 18420,
    sub: "All-time total",
    icon: PiggyBank,
    color: "#192d2f",
  },
];

const transactions = [
  {
    id: "t1",
    date: "Aug 17, 2025",
    desc: "Service payment — Next.js landing page",
    project: "Order #1029",
    type: "credit" as const,
    amount: 750,
    status: "AVAILABLE" as const,
  },
  {
    id: "t2",
    date: "Aug 15, 2025",
    desc: "Withdrawal — BIAT Bank",
    project: "W-2451",
    type: "debit" as const,
    amount: 2000,
    status: "WITHDRAWN" as const,
  },
  {
    id: "t3",
    date: "Aug 12, 2025",
    desc: "Service payment — SaaS dashboard",
    project: "Order #1021",
    type: "credit" as const,
    amount: 2500,
    status: "PROCESSING" as const,
  },
  {
    id: "t4",
    date: "Aug 8, 2025",
    desc: "Service payment — Brand identity design",
    project: "Order #1015",
    type: "credit" as const,
    amount: 600,
    status: "PENDING" as const,
  },
  {
    id: "t5",
    date: "Aug 3, 2025",
    desc: "Withdrawal — D17 Mobile",
    project: "W-2448",
    type: "debit" as const,
    amount: 1500,
    status: "WITHDRAWN" as const,
  },
  {
    id: "t6",
    date: "Jul 28, 2025",
    desc: "Refund — Cancelled order #982",
    project: "Refund",
    type: "debit" as const,
    amount: 350,
    status: "REFUNDED" as const,
  },
];

const statusStyles: Record<string, string> = {
  AVAILABLE: "bg-emerald-500/10 text-emerald-700 border-emerald-200",
  PENDING: "bg-amber-500/10 text-amber-700 border-amber-200",
  PROCESSING: "bg-blue-500/10 text-blue-700 border-blue-200",
  WITHDRAWN: "bg-[#32504d]/10 dark:bg-[#32504d]/20 text-[#32504d] dark:text-[#9bb3ae] border-[#32504d]/20 dark:border-[#32504d]/30",
  REFUNDED: "bg-rose-500/10 text-rose-700 border-rose-200",
};

export function WalletModal() {
  const {
    modal: { walletOpen },
    closeWallet,
    openAuth,
    currentUser,
    openTopup,
  } = useApp();
  const [tab, setTab] = useState<"balance" | "history" | "methods">("balance");

  useEffect(() => {
    if (walletOpen) {
      const orig = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = orig;
      };
    }
  }, [walletOpen]);

  if (!walletOpen) return null;

  const totalBalance =
    balances[0].value + balances[1].value + balances[2].value;

  const handleWithdraw = () => {
    if (!currentUser) {
      toast.info("Please log in to withdraw funds.", {
        action: { label: "Log in", onClick: () => openAuth("login") },
      });
      return;
    }
    toast.success("Withdrawal request submitted", {
      description: "Funds will arrive in 1-2 business days.",
    });
  };

  return (
    <Dialog open={walletOpen} onOpenChange={(o) => !o && closeWallet()}>
      <DialogPortal>
        <DialogOverlay className="bg-[#192d2f]/70 backdrop-blur-sm" />
        <DialogContent
          className="p-0 gap-0 max-w-2xl w-[calc(100%-2rem)] max-h-[92vh] flex flex-col overflow-hidden"
          aria-describedby={undefined}
          showCloseButton
        >
          <DialogTitle className="sr-only">Your Khidma wallet</DialogTitle>
          <DialogDescription className="sr-only">
            Wallet balances and recent transactions.
          </DialogDescription>

          {/* Header */}
          <div className="relative px-5 sm:px-7 py-5 border-b border-border/60 bg-khidma-gradient text-white overflow-hidden">
            <div className="absolute -top-10 -right-8 size-40 rounded-full bg-white/5 blur-2xl" />
            <div className="relative flex items-center gap-2">
              <span className="size-9 rounded-lg bg-white/10 flex items-center justify-center">
                <Wallet className="size-4 text-white" />
              </span>
              <div>
                <h2 className="text-base font-semibold">Khidma Wallet</h2>
                <p className="text-[11px] text-white/70">
                  Track earnings, withdrawals, and pending payments
                </p>
              </div>
            </div>
            <div className="relative mt-4 flex items-end gap-2">
              <span className="text-3xl font-bold">
                {formatTND(totalBalance)}
              </span>
              <span className="text-xs text-white/70 mb-1">total balance</span>
            </div>
          </div>

          {/* Tabs */}
          <div className="px-5 sm:px-7 pt-3 border-b border-border/60">
            <Tabs value={tab} onValueChange={(v) => setTab(v as typeof tab)}>
              <TabsList className="bg-transparent p-0 h-auto gap-1 w-full justify-start">
                {[
                  { v: "balance" as const, l: "Balances" },
                  { v: "history" as const, l: "History" },
                  { v: "methods" as const, l: "Withdrawal methods" },
                ].map((t) => (
                  <TabsTrigger
                    key={t.v}
                    value={t.v}
                    className="rounded-md data-[state=active]:bg-[#32504d]/10 dark:bg-[#32504d]/20 data-[state=active]:text-[#32504d] dark:text-[#9bb3ae] data-[state=active]:shadow-none text-xs px-3 h-8"
                  >
                    {t.l}
                  </TabsTrigger>
                ))}
              </TabsList>

              {/* Balance tab */}
              <TabsContent value="balance" className="mt-0">
                <ScrollArea className="h-[55vh] sm:h-[50vh]">
                  <div className="p-5 space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      {balances.map((b, i) => {
                        const Icon = b.icon;
                        return (
                          <motion.div
                            key={b.key}
                            initial={{ opacity: 0, y: 8 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="rounded-xl border border-border/70 p-3"
                          >
                            <div className="flex items-center gap-2">
                              <span
                                className="size-8 rounded-lg flex items-center justify-center"
                                style={{ backgroundColor: `${b.color}10` }}
                              >
                                <Icon
                                  className="size-4"
                                  style={{ color: b.color }}
                                />
                              </span>
                              <span className="text-xs font-semibold">
                                {b.label}
                              </span>
                            </div>
                            <div className="mt-2 text-lg font-bold text-foreground">
                              {formatTND(b.value)}
                            </div>
                            <div className="text-[10px] text-muted-foreground">
                              {b.sub}
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>

                    {/* Mini chart placeholder */}
                    <div className="rounded-xl border border-border/70 p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h3 className="text-sm font-semibold">Earnings (last 30 days)</h3>
                          <p className="text-[11px] text-muted-foreground">
                            3,250 TND total
                          </p>
                        </div>
                        <Badge className="bg-emerald-500/10 text-emerald-700 gap-0.5">
                          <TrendingUp className="size-2.5" />
                          +12%
                        </Badge>
                      </div>
                      <div className="flex items-end gap-1.5 h-24">
                        {[40, 55, 35, 70, 50, 85, 60, 75, 45, 90, 65, 80].map(
                          (h, i) => (
                            <div
                              key={i}
                              className="flex-1 rounded-t bg-gradient-to-t from-[#6e8580] to-[#32504d] transition-all"
                              style={{ height: `${h}%` }}
                            />
                          )
                        )}
                      </div>
                    </div>

                    <Button
                      className="w-full bg-[#2b3d3d] hover:bg-[#192d2f] text-white h-11"
                      onClick={handleWithdraw}
                    >
                      <Banknote className="size-4" />
                      Request Withdrawal
                    </Button>

                    <Button
                      variant="outline"
                      className="w-full border-[#32504d]/40 text-[#32504d] dark:text-[#9bb3ae] hover:bg-[#32504d]/5 dark:bg-[#32504d]/15 hover:text-[#32504d] dark:text-[#9bb3ae]"
                      onClick={() => {
                        closeWallet();
                        // Defer to allow close transition to start cleanly
                        setTimeout(() => openTopup(), 120);
                      }}
                    >
                      <WalletIcon className="size-4" />
                      Top up wallet
                    </Button>

                    <div className="text-center text-xs">
                      <button
                        onClick={() => setTab("history")}
                        className="text-[#32504d] dark:text-[#9bb3ae] hover:underline inline-flex items-center gap-1"
                      >
                        View full history <ArrowRight className="size-3" />
                      </button>
                    </div>
                  </div>
                </ScrollArea>
              </TabsContent>

              {/* History tab */}
              <TabsContent value="history" className="mt-0">
                <ScrollArea className="h-[55vh] sm:h-[50vh]">
                  <div className="p-5">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-semibold">Recent transactions</h3>
                      <Badge variant="outline" className="text-[10px]">
                        Last 30 days
                      </Badge>
                    </div>
                    <ul className="space-y-2">
                      {transactions.map((t, i) => {
                        const isCredit = t.type === "credit";
                        return (
                          <motion.li
                            key={t.id}
                            initial={{ opacity: 0, x: -8 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: i * 0.04 }}
                            className="rounded-lg border border-border/70 p-3 flex items-center gap-3"
                          >
                            <span
                              className={cn(
                                "size-9 rounded-full flex items-center justify-center shrink-0",
                                isCredit
                                  ? "bg-emerald-500/10 text-emerald-700"
                                  : "bg-rose-500/10 text-rose-700"
                              )}
                            >
                              {isCredit ? (
                                <ArrowDownLeft className="size-4" />
                              ) : (
                                <ArrowUpRight className="size-4" />
                              )}
                            </span>
                            <div className="min-w-0 flex-1">
                              <p className="text-xs font-semibold truncate">
                                {t.desc}
                              </p>
                              <p className="text-[10px] text-muted-foreground">
                                {t.date} · {t.project}
                              </p>
                            </div>
                            <div className="text-right shrink-0">
                              <div
                                className={cn(
                                  "text-sm font-bold",
                                  isCredit
                                    ? "text-emerald-700"
                                    : "text-rose-700"
                                )}
                              >
                                {isCredit ? "+" : "−"}
                                {formatTND(t.amount)}
                              </div>
                              <Badge
                                variant="outline"
                                className={cn(
                                  "text-[9px] mt-0.5 px-1 py-0 h-4",
                                  statusStyles[t.status]
                                )}
                              >
                                {t.status}
                              </Badge>
                            </div>
                          </motion.li>
                        );
                      })}
                    </ul>
                  </div>
                </ScrollArea>
              </TabsContent>

              {/* Methods tab */}
              <TabsContent value="methods" className="mt-0">
                <ScrollArea className="h-[55vh] sm:h-[50vh]">
                  <div className="p-5 space-y-3">
                    <div>
                      <h3 className="text-sm font-semibold">Withdrawal methods</h3>
                      <p className="text-[11px] text-muted-foreground">
                        Pick your preferred way to receive your earnings.
                      </p>
                    </div>
                    <ul className="grid sm:grid-cols-2 gap-2.5">
                      {withdrawalMethods.map((m, i) => (
                        <motion.li
                          key={m.id}
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.04 }}
                          className="rounded-xl border border-border/70 p-3 hover:border-[#32504d]/40 hover:bg-[#32504d]/5 dark:bg-[#32504d]/15 transition-colors"
                        >
                          <div className="flex items-start gap-2.5">
                            <span className="size-9 rounded-lg bg-muted flex items-center justify-center text-lg shrink-0">
                              {m.logo}
                            </span>
                            <div className="min-w-0">
                              <p className="text-xs font-semibold">{m.name}</p>
                              <p className="text-[10px] text-muted-foreground">
                                {m.type} · {m.fee} fee
                              </p>
                              <div className="flex items-center gap-1 mt-1 text-[10px] text-[#32504d] dark:text-[#9bb3ae]">
                                <Clock className="size-2.5" />
                                {m.time}
                              </div>
                            </div>
                          </div>
                        </motion.li>
                      ))}
                    </ul>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() =>
                        toast.info("Add new withdrawal method — coming soon")
                      }
                    >
                      <Plus className="size-3.5" /> Add new method
                    </Button>

                    <div className="rounded-xl border border-[#32504d]/20 dark:border-[#32504d]/30 bg-[#32504d]/5 dark:bg-[#32504d]/15 p-3 flex gap-2.5">
                      <CreditCard className="size-4 text-[#32504d] dark:text-[#9bb3ae] shrink-0 mt-0.5" />
                      <p className="text-[11px] text-muted-foreground leading-relaxed">
                        Khidma uses secure escrow for all transactions. Withdrawals
                        are processed within 1-3 business days depending on the
                        method chosen.
                      </p>
                    </div>
                  </div>
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sticky footer */}
          <div className="border-t border-border/60 bg-card/60 px-5 sm:px-7 py-3 flex flex-col sm:flex-row items-center gap-2 sm:gap-3">
            <div className="text-xs text-muted-foreground mr-auto">
              <span className="text-foreground font-semibold">
                {formatTND(balances[0].value)}
              </span>{" "}
              available to withdraw
            </div>
            <Button
              size="sm"
              variant="outline"
              className="w-full sm:w-auto border-[#32504d]/40 text-[#32504d] dark:text-[#9bb3ae] hover:bg-[#32504d]/5 dark:bg-[#32504d]/15 hover:text-[#32504d] dark:text-[#9bb3ae]"
              onClick={() => {
                closeWallet();
                setTimeout(() => openTopup(), 120);
              }}
            >
              <Plus className="size-3.5" /> Top up
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="w-full sm:w-auto"
              onClick={() => setTab("methods")}
            >
              Manage methods
            </Button>
            <Button
              size="sm"
              className="w-full sm:w-auto bg-[#2b3d3d] hover:bg-[#192d2f] text-white"
              onClick={handleWithdraw}
            >
              <Banknote className="size-3.5" /> Request Withdrawal
            </Button>
          </div>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}
