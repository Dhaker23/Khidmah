"use client";

/**
 * ProModal
 * --------
 * Lightweight upgrade modal opened via `openPro()` from the Pricing section
 * (and from other Pro CTAs across the app). Summarises Pro tier perks and
 * lets the user "start a 14-day trial" (mock) or contact sales.
 */

import {
  Dialog,
  DialogContent,
  DialogPortal,
  DialogOverlay,
  DialogTitle,
  DialogDescription,
  DialogHeader,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Sparkles,
  Check,
  Star,
  ShieldCheck,
  Zap,
  TrendingUp,
  ArrowRight,
} from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { useApp } from "@/lib/store";
import { toast } from "sonner";

const PRO_PERKS = [
  { icon: Zap, label: "Unlimited job applications" },
  { icon: TrendingUp, label: "Up to 5 active services" },
  { icon: Star, label: "Featured profile badge + priority verification" },
  { icon: Sparkles, label: "Advanced analytics & custom offers" },
  { icon: ShieldCheck, label: "Priority support — still 1% platform fee" },
];

export function ProModal() {
  const prefersReduced = useReducedMotion();
  const {
    modal: { proOpen },
    closePro,
    currentUser,
    openAuth,
  } = useApp();

  const handleStartTrial = () => {
    if (!currentUser) {
      closePro();
      openAuth("register");
      toast.info("Sign up to start your Pro trial.", {
        description: "You'll get 14 days of Khidma Pro — free.",
      });
      return;
    }
    toast.success("Pro trial activated!", {
      description: "14 days of Khidma Pro — enjoy unlimited applications.",
    });
    closePro();
  };

  return (
    <Dialog open={proOpen} onOpenChange={(o) => !o && closePro()}>
      <DialogPortal>
        <DialogOverlay className="bg-[#192d2f]/70 backdrop-blur-sm" />
        <DialogContent
          className="max-w-md w-[calc(100%-2rem)] p-0 gap-0 overflow-hidden"
          aria-describedby={undefined}
          showCloseButton
        >
          <DialogHeader className="relative px-5 pt-6 pb-4 bg-khidma-gradient text-white overflow-hidden">
            <div className="absolute -top-8 -right-8 size-32 rounded-full bg-white/5 blur-2xl pointer-events-none" />
            <DialogTitle className="flex items-center gap-2 text-lg font-display font-bold">
              <Sparkles className="size-4 text-amber-300" />
              Khidma Pro
            </DialogTitle>
            <DialogDescription className="text-white/80 text-xs">
              Unlock the full toolkit ambitious Tunisian freelancers use to win
              more contracts.
            </DialogDescription>
            <div className="mt-3 flex items-end gap-1">
              <span className="font-display text-3xl font-bold">TND 39</span>
              <span className="text-white/70 text-sm mb-1">/ month</span>
              <Badge className="ml-2 bg-emerald-400/20 text-emerald-100 border-emerald-300/30 text-[10px] uppercase tracking-wider mb-1.5">
                14-day free trial
              </Badge>
            </div>
          </DialogHeader>

          <div className="p-5 space-y-4">
            <ul className="space-y-2.5">
              {PRO_PERKS.map((perk, i) => {
                const Icon = perk.icon;
                return (
                  <motion.li
                    key={perk.label}
                    initial={
                      prefersReduced ? undefined : { opacity: 0, x: -8 }
                    }
                    animate={
                      prefersReduced ? undefined : { opacity: 1, x: 0 }
                    }
                    transition={{ delay: i * 0.06, duration: 0.3 }}
                    className="flex items-center gap-2.5 text-sm"
                  >
                    <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-[#32504d]/10 dark:bg-[#32504d]/20 text-[#32504d] dark:text-[#9bb3ae]">
                      <Icon className="size-3.5" />
                    </span>
                    <span className="text-foreground">{perk.label}</span>
                    <Check className="ml-auto size-3.5 text-emerald-600" />
                  </motion.li>
                );
              })}
            </ul>

            <Separator />

            <div className="rounded-xl bg-[#32504d]/5 dark:bg-[#32504d]/15 border border-[#32504d]/15 p-3 flex items-start gap-2.5">
              <ShieldCheck className="size-4 text-[#32504d] dark:text-[#9bb3ae] shrink-0 mt-0.5" />
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                <span className="font-medium text-foreground">
                  30-day money-back guarantee.
                </span>{" "}
                Cancel anytime — no questions asked. The 1% platform fee still
                applies on completed contracts.
              </p>
            </div>
          </div>

          <DialogFooter className="px-5 pb-5 pt-0 flex-col sm:flex-row gap-2">
            <DialogClose asChild>
              <Button variant="outline" className="w-full sm:w-auto">
                Maybe later
              </Button>
            </DialogClose>
            <Button
              onClick={handleStartTrial}
              className="w-full sm:flex-1 bg-[#32504d] text-white hover:bg-[#2b3d3d]"
            >
              Start free trial
              <ArrowRight className="size-3.5 ml-1" />
            </Button>
          </DialogFooter>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}

export default ProModal;
