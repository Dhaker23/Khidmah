"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { KhidmaLogo } from "@/components/khidma/logo";
import {
  CreditCard,
  Building,
  Smartphone,
  Mail,
  Wallet,
  Check,
  Tag,
  Loader2,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { useApp } from "@/lib/store";
import { toast } from "sonner";
import { formatTND } from "@/lib/khidma-data";
import { cn } from "@/lib/utils";

type PaymentMethod = "card" | "bank" | "d17" | "post";

interface MethodDef {
  key: PaymentMethod;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

const METHODS: MethodDef[] = [
  {
    key: "card",
    label: "Credit / Debit Card",
    description: "Visa, Mastercard",
    icon: CreditCard,
  },
  {
    key: "bank",
    label: "Bank Transfer",
    description: "BIAT, TIJARI, Zitouna",
    icon: Building,
  },
  {
    key: "d17",
    label: "D17 Mobile",
    description: "Instant mobile payment",
    icon: Smartphone,
  },
  {
    key: "post",
    label: "Tunisian Post",
    description: "Post office transfer",
    icon: Mail,
  },
];

const QUICK_AMOUNTS = [50, 100, 250, 500, 1000];

const MIN_AMOUNT = 10;
const MAX_AMOUNT = 10000;

// Mock wallet balances , match WalletModal mock values
const AVAILABLE_BALANCE = 4250;
const PENDING_BALANCE = 1800;

// Mock valid promo codes
const VALID_PROMO_CODES: Record<string, number> = {
  KHIDMA10: 10,
  WELCOME: 5,
  TUNISIA: 15,
};

function formatAmount(value: number) {
  // Always show 2 decimal places for the top-up summary
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "TND",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function TopupModal() {
  const {
    modal: { topupOpen },
    closeTopup,
    pushNotification,
    currentUser,
    openAuth,
  } = useApp();
  const prefersReduced = useReducedMotion();

  const [amount, setAmount] = useState<number | "">("");
  const [method, setMethod] = useState<PaymentMethod>("card");
  const [promoInput, setPromoInput] = useState("");
  const [promoApplied, setPromoApplied] = useState<{
    code: string;
    discount: number;
  } | null>(null);
  const [promoStatus, setPromoStatus] = useState<"idle" | "valid" | "invalid">(
    "idle"
  );
  const [submitting, setSubmitting] = useState(false);

  // Card details
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvc, setCardCvc] = useState("");
  const [cardName, setCardName] = useState("");

  // Reset form state whenever the modal is (re)opened.
  // We intentionally reset on open rather than close so any failed submit
  // attempt preserves its inputs for review. The setState-in-effect pattern
  // is required here because the form's lifetime is tied to the dialog open
  // state, which is owned by the global store , there is no parent prop
  // we can `key` on without breaking the dialog's transition animations.
  useEffect(() => {
    if (!topupOpen) return;
    /* eslint-disable react-hooks/set-state-in-effect */
    setAmount(100);
    setMethod("card");
    setPromoInput("");
    setPromoApplied(null);
    setPromoStatus("idle");
    setSubmitting(false);
    setCardNumber("");
    setCardExpiry("");
    setCardCvc("");
    setCardName("");
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [topupOpen]);

  if (!topupOpen) return null;

  const numericAmount =
    typeof amount === "number"
      ? amount
      : amount === ""
        ? 0
        : Number(amount) || 0;
  const amountValid =
    numericAmount >= MIN_AMOUNT && numericAmount <= MAX_AMOUNT;

  const discount = promoApplied?.discount ?? 0;
  const discountedAmount = amountValid
    ? Math.max(0, numericAmount - (numericAmount * discount) / 100)
    : numericAmount;

  // Card fields validation (only when card method selected)
  const cardFieldsValid =
    method !== "card" ||
    (cardNumber.replace(/\s/g, "").length >= 12 &&
      /^\d{2}\/\d{2}$/.test(cardExpiry) &&
      cardCvc.length >= 3 &&
      cardName.trim().length >= 2);

  const canSubmit = amountValid && cardFieldsValid && !submitting;

  const handleQuickAmount = (n: number) => setAmount(n);

  const handleCustomAmount = (raw: string) => {
    // Allow digits only , clamp to MAX_AMOUNT
    const digits = raw.replace(/[^\d]/g, "");
    if (digits === "") {
      setAmount("");
      return;
    }
    const parsed = Number(digits);
    setAmount(Math.min(parsed, MAX_AMOUNT));
  };

  const handleApplyPromo = () => {
    const code = promoInput.trim().toUpperCase();
    if (!code) {
      setPromoStatus("idle");
      setPromoApplied(null);
      return;
    }
    if (VALID_PROMO_CODES[code]) {
      setPromoApplied({ code, discount: VALID_PROMO_CODES[code] });
      setPromoStatus("valid");
      toast.success("Promo code applied!", {
        description: `${VALID_PROMO_CODES[code]}% off your top-up`,
      });
    } else {
      setPromoApplied(null);
      setPromoStatus("invalid");
      toast.error("Invalid code", {
        description: "This promo code isn't recognised.",
      });
    }
  };

  // Mask card number , group into 4-digit blocks
  const formatCardNumber = (raw: string) =>
    raw
      .replace(/[^\d]/g, "")
      .slice(0, 16)
      .replace(/(\d{4})(?=\d)/g, "$1 ")
      .trim();

  // Mask expiry , MM/YY
  const formatExpiry = (raw: string) => {
    const digits = raw.replace(/[^\d]/g, "").slice(0, 4);
    if (digits.length <= 2) return digits;
    return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  };

  // Mask CVC , 3-4 digits
  const formatCvc = (raw: string) => raw.replace(/[^\d]/g, "").slice(0, 4);

  const handleSubmit = () => {
    if (!currentUser) {
      toast.info("Please log in to top up your wallet.", {
        action: { label: "Log in", onClick: () => openAuth("login") },
      });
      return;
    }
    if (!canSubmit) return;
    setSubmitting(true);
    // Simulate a brief payment round-trip for tactile feedback
    setTimeout(() => {
      pushNotification({
        type: "payment",
        title: "Top-up successful",
        body: `${formatAmount(discountedAmount)} added to your wallet.`,
        link: "dashboard",
      });
      toast.success("Payment successful!", {
        description: `${formatAmount(discountedAmount)} added to your wallet`,
      });
      setSubmitting(false);
      closeTopup();
    }, 800);
  };

  const selectedMethod = METHODS.find((m) => m.key === method);

  return (
    <Dialog open={topupOpen} onOpenChange={(o) => !o && closeTopup()}>
      <DialogPortal>
        <DialogOverlay className="bg-[#192d2f]/70 backdrop-blur-sm" />
        <DialogContent
          className="max-w-md w-[calc(100%-1rem)] sm:w-[calc(100%-2rem)] p-0 gap-0 overflow-hidden"
          aria-describedby={undefined}
          showCloseButton
        >
          <DialogHeader className="relative px-5 sm:px-6 pt-5 pb-4 border-b border-border/60 bg-khidma-gradient text-white overflow-hidden">
            <div className="absolute -top-10 -right-8 size-36 rounded-full bg-white/5 blur-2xl pointer-events-none" aria-hidden />
            <div className="relative flex items-start gap-3">
              <div className="hidden sm:block">
                <KhidmaLogo variant="symbol" size="sm" />
              </div>
              <div className="min-w-0 flex-1">
                <DialogTitle className="text-base font-display font-bold leading-tight flex items-center gap-2">
                  <Wallet className="size-4 sm:hidden" />
                  Top up your wallet
                </DialogTitle>
                <DialogDescription className="text-xs text-white/75 mt-0.5">
                  Add funds to hire freelancers faster.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="max-h-[62vh] overflow-y-auto px-5 sm:px-6 py-4 space-y-4">
            {/* Current balance card */}
            <div className="rounded-xl border border-border/70 bg-muted/30 p-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                    Available
                  </p>
                  <p className="text-sm font-bold text-foreground tabular-nums">
                    {formatAmount(AVAILABLE_BALANCE)}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                    Pending
                  </p>
                  <p className="text-sm font-bold text-foreground tabular-nums">
                    {formatAmount(PENDING_BALANCE)}
                  </p>
                </div>
              </div>
            </div>

            {/* Amount selection */}
            <div className="space-y-2">
              <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                Select amount
              </span>
              <div className="grid grid-cols-3 sm:grid-cols-5 gap-1.5">
                {QUICK_AMOUNTS.map((n) => {
                  const active = amount === n;
                  return (
                    <motion.button
                      key={n}
                      type="button"
                      onClick={() => handleQuickAmount(n)}
                      whileHover={prefersReduced ? undefined : { scale: 1.03 }}
                      whileTap={prefersReduced ? undefined : { scale: 0.97 }}
                      transition={{ type: "spring", stiffness: 400, damping: 18 }}
                      aria-pressed={active}
                      aria-label={`Top up ${formatAmount(n)}`}
                      className={cn(
                        "rounded-lg border px-2 py-2 text-xs font-semibold tabular-nums transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#32504d]/40 focus-visible:ring-offset-1",
                        active
                          ? "border-[#32504d] bg-[#32504d] text-white shadow-sm"
                          : "border-border/60 bg-background text-foreground hover:border-[#32504d]/40 hover:bg-[#32504d]/5 dark:bg-[#32504d]/15"
                      )}
                    >
                      {formatTND(n)}
                    </motion.button>
                  );
                })}
              </div>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-medium text-muted-foreground pointer-events-none">
                  TND
                </span>
                <Input
                  type="text"
                  inputMode="numeric"
                  value={amount === "" ? "" : String(amount)}
                  onChange={(e) => handleCustomAmount(e.target.value)}
                  placeholder="Custom amount"
                  aria-label="Custom top-up amount in TND"
                  className="pl-11 h-9 text-xs tabular-nums focus-visible:ring-[#32504d]/30"
                />
                {amount !== "" && amountValid && (
                  <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[#32504d] dark:text-[#9bb3ae]">
                    <Check className="size-3.5" />
                  </span>
                )}
              </div>
              {amount !== "" && !amountValid && (
                <p className="text-[10px] text-amber-600">
                  Amount must be between {formatAmount(MIN_AMOUNT)} and{" "}
                  {formatAmount(MAX_AMOUNT)}.
                </p>
              )}
            </div>

            {/* Payment method */}
            <div className="space-y-2">
              <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                Payment method
              </span>
              <RadioGroup
                value={method}
                onValueChange={(v) => setMethod(v as PaymentMethod)}
                className="gap-1.5"
              >
                {METHODS.map((m) => {
                  const Icon = m.icon;
                  const active = method === m.key;
                  return (
                    <Label
                      key={m.key}
                      htmlFor={`method-${m.key}`}
                      className={cn(
                        "flex items-start gap-3 rounded-lg border px-3 py-2 cursor-pointer transition-colors",
                        active
                          ? "border-[#32504d] bg-[#32504d]/5 dark:bg-[#32504d]/15"
                          : "border-border/60 hover:border-border hover:bg-muted/30"
                      )}
                    >
                      <RadioGroupItem
                        id={`method-${m.key}`}
                        value={m.key}
                        className="mt-0.5 data-[state=checked]:border-[#32504d] data-[state=checked]:text-[#32504d] dark:text-[#9bb3ae]"
                      />
                      <span
                        className={cn(
                          "flex size-7 items-center justify-center rounded-md shrink-0 transition-colors",
                          active
                            ? "bg-[#32504d]/15 dark:bg-[#32504d]/25 text-[#32504d] dark:text-[#9bb3ae]"
                            : "bg-muted text-muted-foreground"
                        )}
                      >
                        <Icon className="size-3.5" />
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-semibold text-foreground">
                          {m.label}
                        </div>
                        <div className="text-[10px] text-muted-foreground leading-snug">
                          {m.description}
                        </div>
                      </div>
                    </Label>
                  );
                })}
              </RadioGroup>
            </div>

            {/* Card details , only when card method selected */}
            <AnimatePresence initial={false} mode="wait">
              {method === "card" && (
                <motion.div
                  key="card-details"
                  initial={prefersReduced ? false : { opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={prefersReduced ? { opacity: 0 } : { opacity: 0, height: 0 }}
                  transition={{ duration: 0.22, ease: "easeOut" }}
                  className="overflow-hidden"
                >
                  <div className="space-y-2 rounded-lg border border-border/60 bg-muted/20 p-3">
                    <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                      Card details
                    </span>
                    <div className="space-y-2">
                      <div>
                        <Label
                          htmlFor="card-number"
                          className="text-[10px] text-muted-foreground"
                        >
                          Card number
                        </Label>
                        <Input
                          id="card-number"
                          type="text"
                          inputMode="numeric"
                          autoComplete="cc-number"
                          value={cardNumber}
                          onChange={(e) =>
                            setCardNumber(formatCardNumber(e.target.value))
                          }
                          placeholder="4242 4242 4242 4242"
                          className="h-9 text-xs tabular-nums tracking-wider focus-visible:ring-[#32504d]/30"
                          aria-label="Card number"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label
                            htmlFor="card-expiry"
                            className="text-[10px] text-muted-foreground"
                          >
                            Expiry
                          </Label>
                          <Input
                            id="card-expiry"
                            type="text"
                            inputMode="numeric"
                            autoComplete="cc-exp"
                            value={cardExpiry}
                            onChange={(e) =>
                              setCardExpiry(formatExpiry(e.target.value))
                            }
                            placeholder="MM/YY"
                            className="h-9 text-xs tabular-nums focus-visible:ring-[#32504d]/30"
                            aria-label="Card expiry"
                          />
                        </div>
                        <div>
                          <Label
                            htmlFor="card-cvc"
                            className="text-[10px] text-muted-foreground"
                          >
                            CVC
                          </Label>
                          <Input
                            id="card-cvc"
                            type="text"
                            inputMode="numeric"
                            autoComplete="cc-csc"
                            value={cardCvc}
                            onChange={(e) =>
                              setCardCvc(formatCvc(e.target.value))
                            }
                            placeholder="123"
                            className="h-9 text-xs tabular-nums focus-visible:ring-[#32504d]/30"
                            aria-label="Card CVC"
                          />
                        </div>
                      </div>
                      <div>
                        <Label
                          htmlFor="card-name"
                          className="text-[10px] text-muted-foreground"
                        >
                          Name on card
                        </Label>
                        <Input
                          id="card-name"
                          type="text"
                          autoComplete="cc-name"
                          value={cardName}
                          onChange={(e) => setCardName(e.target.value)}
                          placeholder="As shown on card"
                          className="h-9 text-xs focus-visible:ring-[#32504d]/30"
                          aria-label="Name on card"
                        />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Summary card */}
            <div className="rounded-xl border border-[#32504d]/20 dark:border-[#32504d]/30 bg-[#32504d]/5 dark:bg-[#32504d]/15 p-3 space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Amount</span>
                <span className="font-semibold tabular-nums">
                  {formatAmount(numericAmount)}
                </span>
              </div>
              {promoApplied && (
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">
                    Discount ({promoApplied.code} · −{promoApplied.discount}%)
                  </span>
                  <span className="font-semibold tabular-nums text-[#32504d] dark:text-[#9bb3ae]">
                    −{formatAmount(numericAmount - discountedAmount)}
                  </span>
                </div>
              )}
              <div className="flex items-center justify-between text-xs">
                <span className="text-muted-foreground">Processing fee</span>
                <span className="font-semibold text-[#32504d] dark:text-[#9bb3ae]">Free</span>
              </div>
              <div className="border-t border-[#32504d]/15 my-1" />
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-foreground">
                  Total
                </span>
                <span className="text-base font-bold tabular-nums text-[#2b3d3d] dark:text-[#94a8a4]">
                  {formatAmount(discountedAmount)}
                </span>
              </div>
              <div className="flex items-center gap-1.5 pt-1">
                <Zap className="size-3 text-[#32504d] dark:text-[#9bb3ae]" />
                <span className="text-[10px] text-muted-foreground">
                  Funds available instantly
                </span>
              </div>
            </div>

            {/* Promo code */}
            <div className="space-y-1.5">
              <Label
                htmlFor="promo"
                className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground"
              >
                Promo code{" "}
                <span className="text-muted-foreground/60">(optional)</span>
              </Label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="size-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
                  <Input
                    id="promo"
                    type="text"
                    value={promoInput}
                    onChange={(e) => {
                      setPromoInput(e.target.value.toUpperCase().slice(0, 20));
                      if (promoStatus !== "idle") setPromoStatus("idle");
                    }}
                    placeholder="KHIDMA10"
                    className="pl-8 h-9 text-xs uppercase tracking-wider focus-visible:ring-[#32504d]/30"
                    aria-label="Promo code"
                    aria-invalid={promoStatus === "invalid"}
                  />
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleApplyPromo}
                  disabled={!promoInput.trim()}
                  className="h-9 text-xs border-[#32504d]/30 dark:border-[#32504d]/30 text-[#32504d] dark:text-[#9bb3ae] hover:bg-[#32504d]/5 dark:bg-[#32504d]/15 hover:text-[#32504d] dark:text-[#9bb3ae]"
                >
                  Apply
                </Button>
              </div>
              {promoStatus === "valid" && promoApplied && (
                <p className="text-[10px] text-[#32504d] dark:text-[#9bb3ae] flex items-center gap-1">
                  <Check className="size-3" />
                  {promoApplied.code} applied , {promoApplied.discount}% off
                </p>
              )}
              {promoStatus === "invalid" && (
                <p className="text-[10px] text-rose-600">
                  Invalid code , try KHIDMA10, WELCOME, or TUNISIA.
                </p>
              )}
            </div>

            {/* Trust signal */}
            <div className="flex items-start gap-2 text-[10px] text-muted-foreground leading-snug">
              <ShieldCheck className="size-3.5 text-[#32504d] dark:text-[#9bb3ae] shrink-0 mt-0.5" />
              <span>
                Khidma uses 256-bit TLS encryption. Card details are processed
                by our PCI-DSS payment partner and never stored on our servers.
              </span>
            </div>
          </div>

          <DialogFooter className="px-5 sm:px-6 py-3 border-t border-border/60 bg-muted/20 flex-row items-center gap-2">
            <div className="mr-auto hidden sm:flex items-center gap-2">
              {selectedMethod && (
                <Badge
                  variant="outline"
                  className="text-[10px] gap-1 border-[#32504d]/30 dark:border-[#32504d]/30 text-[#32504d] dark:text-[#9bb3ae]"
                >
                  <selectedMethod.icon className="size-2.5" />
                  {selectedMethod.label}
                </Badge>
              )}
            </div>
            <DialogClose asChild>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={closeTopup}
                disabled={submitting}
                className="text-xs"
              >
                Cancel
              </Button>
            </DialogClose>
            <Button
              type="button"
              size="sm"
              onClick={handleSubmit}
              disabled={!canSubmit}
              className="text-xs bg-[#2b3d3d] hover:bg-[#192d2f] text-white"
            >
              {submitting ? (
                <>
                  <Loader2 className="size-3.5 animate-spin" /> Processing…
                </>
              ) : (
                <>
                  <Wallet className="size-3.5" /> Top up {formatAmount(discountedAmount)}
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}

export default TopupModal;
