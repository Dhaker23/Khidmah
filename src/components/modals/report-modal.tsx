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
  DialogHeader,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Flag,
  ShieldAlert,
  AlertTriangle,
  Ban,
  Copyright,
  Users,
  MessageSquareWarning,
  CircleDot,
  Loader2,
} from "lucide-react";
import { useApp } from "@/lib/store";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

type ReasonKey =
  | "spam"
  | "fake"
  | "stolen"
  | "copyright"
  | "offensive"
  | "behavior"
  | "other";

interface ReasonDef {
  key: ReasonKey;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
}

const REASONS: ReasonDef[] = [
  {
    key: "spam",
    label: "Spam",
    description: "Repeated or irrelevant promotional content.",
    icon: Ban,
  },
  {
    key: "fake",
    label: "Fake / Misleading Information",
    description: "False claims about skills, identity, or results.",
    icon: AlertTriangle,
  },
  {
    key: "stolen",
    label: "Stolen Portfolio",
    description: "Work shown was created by someone else.",
    icon: ShieldAlert,
  },
  {
    key: "copyright",
    label: "Copyright Violation",
    description: "Uses protected material without permission.",
    icon: Copyright,
  },
  {
    key: "offensive",
    label: "Offensive Content",
    description: "Hate speech, harassment, or explicit material.",
    icon: MessageSquareWarning,
  },
  {
    key: "behavior",
    label: "Inappropriate Behavior",
    description: "Unprofessional or abusive conduct.",
    icon: Users,
  },
  {
    key: "other",
    label: "Other",
    description: "Tell us more below.",
    icon: CircleDot,
  },
];

const ENTITY_LABEL: Record<string, string> = {
  freelancer: "Freelancer",
  service: "Service",
  job: "Job",
  review: "Review",
};

export function ReportModal() {
  const {
    modal: { reportOpen, reportPayload },
    closeReport,
    pushNotification,
  } = useApp();

  const [reason, setReason] = useState<ReasonKey | "">("");
  const [customReason, setCustomReason] = useState("");
  const [details, setDetails] = useState("");
  const [email, setEmail] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Reset form state whenever the modal is (re)opened for a given entity.
  // We intentionally reset on open rather than close so any failed submit
  // attempt preserves its inputs for review. The setState-in-effect pattern
  // is required here because the form's lifetime is tied to the dialog open
  // state, which is owned by the global store , there is no parent prop
  // we can `key` on without breaking the dialog's transition animations.
  useEffect(() => {
    if (!reportOpen) return;
    /* eslint-disable react-hooks/set-state-in-effect */
    setReason("");
    setCustomReason("");
    setDetails("");
    setEmail("");
    setConfirmed(false);
    setSubmitting(false);
    /* eslint-enable react-hooks/set-state-in-effect */
  }, [reportOpen, reportPayload?.entityId]);

  const selectedReason = REASONS.find((r) => r.key === reason);
  const isOther = reason === "other";
  const canSubmit =
    reason !== "" && (!isOther || customReason.trim().length >= 4) && confirmed && !submitting;

  const handleSubmit = () => {
    if (!canSubmit || !reportPayload) return;
    setSubmitting(true);
    // Simulate a brief network round-trip for tactile feedback
    setTimeout(() => {
      const reasonLabel =
        isOther && customReason.trim()
          ? `Other: ${customReason.trim().slice(0, 80)}`
          : selectedReason?.label ?? "Unknown";

      pushNotification({
        type: "system",
        title: "Report submitted",
        body: `Your report "${reasonLabel}" for ${reportPayload.entityType} "${reportPayload.entityTitle}" was received. Our team will review within 48 hours.`,
        link: "dashboard",
      });

      toast.success("Report submitted , our team will review within 48 hours.", {
        description: `Reason: ${reasonLabel}`,
      });

      setSubmitting(false);
      closeReport();
    }, 600);
  };

  const entityLabel = reportPayload
    ? ENTITY_LABEL[reportPayload.entityType] ?? "Item"
    : "Item";

  return (
    <Dialog open={reportOpen} onOpenChange={(o) => !o && closeReport()}>
      <DialogPortal>
        <DialogOverlay className="bg-[#192d2f]/70 backdrop-blur-sm" />
        <DialogContent
          className="max-w-md w-[calc(100%-1rem)] sm:w-[calc(100%-2rem)] p-0 gap-0 overflow-hidden"
          aria-describedby={undefined}
          showCloseButton
        >
          <DialogHeader className="px-5 pt-5 pb-3 border-b border-border/60">
            <DialogTitle className="flex items-center gap-2 text-base font-display font-bold">
              <span className="flex size-7 items-center justify-center rounded-lg bg-rose-500/10 text-rose-600">
                <Flag className="size-3.5" />
              </span>
              Report {entityLabel}
            </DialogTitle>
            <DialogDescription className="text-xs">
              {reportPayload ? (
                <span className="block truncate">
                  Flagging:{" "}
                  <span className="font-medium text-foreground">
                    {reportPayload.entityTitle}
                  </span>
                </span>
              ) : (
                "Flag this content for our team to review."
              )}
            </DialogDescription>
          </DialogHeader>

          <div className="max-h-[60vh] overflow-y-auto px-5 py-4 space-y-5">
            {/* Reason selector */}
            <div className="space-y-2">
              <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                Reason <span className="text-rose-500">*</span>
              </span>
              <RadioGroup
                value={reason}
                onValueChange={(v) => setReason(v as ReasonKey)}
                className="gap-1.5"
              >
                {REASONS.map((r) => {
                  const Icon = r.icon;
                  const active = reason === r.key;
                  return (
                    <Label
                      key={r.key}
                      htmlFor={`reason-${r.key}`}
                      className={cn(
                        "flex items-start gap-3 rounded-lg border px-3 py-2 cursor-pointer transition-colors",
                        active
                          ? "border-rose-500/40 bg-rose-500/5"
                          : "border-border/60 hover:border-border hover:bg-muted/40"
                      )}
                    >
                      <RadioGroupItem
                        id={`reason-${r.key}`}
                        value={r.key}
                        className="mt-0.5 data-[state=checked]:border-rose-500 data-[state=checked]:text-rose-500"
                      />
                      <Icon
                        className={cn(
                          "size-3.5 mt-0.5 shrink-0",
                          active ? "text-rose-600" : "text-muted-foreground"
                        )}
                      />
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-semibold text-foreground">{r.label}</div>
                        <div className="text-[11px] text-muted-foreground leading-snug">
                          {r.description}
                        </div>
                      </div>
                    </Label>
                  );
                })}
              </RadioGroup>

              {/* Custom reason textarea , only when "Other" selected */}
              <AnimatePresence initial={false}>
                {isOther && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.22, ease: "easeOut" }}
                    className="overflow-hidden"
                  >
                    <Textarea
                      value={customReason}
                      onChange={(e) => setCustomReason(e.target.value)}
                      placeholder="Briefly describe the reason for your report…"
                      className="mt-1 min-h-[80px] resize-none text-xs focus-visible:ring-rose-500/30"
                      maxLength={300}
                    />
                    <div className="mt-1 text-right text-[10px] text-muted-foreground">
                      {customReason.length}/300
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Additional details */}
            <div className="space-y-1.5">
              <Label
                htmlFor="report-details"
                className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground"
              >
                Additional details <span className="text-muted-foreground/60">(optional)</span>
              </Label>
              <Textarea
                id="report-details"
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="Provide more context (links, screenshots, dates)…"
                className="min-h-[80px] resize-none text-xs focus-visible:ring-[#32504d]/30"
                maxLength={600}
              />
              <div className="text-right text-[10px] text-muted-foreground">
                {details.length}/600
              </div>
            </div>

            {/* Reporter email */}
            <div className="space-y-1.5">
              <Label
                htmlFor="report-email"
                className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground"
              >
                Your email <span className="text-muted-foreground/60">(optional)</span>
              </Label>
              <Input
                id="report-email"
                type="email"
                inputMode="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="So we can follow up"
                className="h-9 text-xs focus-visible:ring-[#32504d]/30"
              />
            </div>

            {/* Confirmation checkbox */}
            <Label
              htmlFor="report-confirm"
              className="flex items-start gap-2.5 rounded-lg border border-border/60 bg-muted/30 px-3 py-2.5 cursor-pointer hover:bg-muted/50 transition-colors"
            >
              <Checkbox
                id="report-confirm"
                checked={confirmed}
                onCheckedChange={(c) => setConfirmed(c === true)}
                className="mt-0.5 data-[state=checked]:bg-rose-500 data-[state=checked]:border-rose-500 data-[state=checked]:text-white"
              />
              <span className="text-[11px] text-muted-foreground leading-snug">
                I confirm this report is accurate and submitted in good faith.
                Misuse of the report system may result in account restrictions.
              </span>
            </Label>
          </div>

          <DialogFooter className="px-5 py-3 border-t border-border/60 bg-muted/20 flex-row items-center gap-2">
            <p className="text-[11px] text-muted-foreground leading-snug mr-auto hidden sm:block">
              <ShieldAlert className="size-3 inline mr-1 -mt-0.5 text-[#32504d] dark:text-[#9bb3ae]" />
              Confidential , only Khidma moderation sees this.
            </p>
            <DialogClose asChild>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={closeReport}
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
              className="text-xs bg-rose-600 hover:bg-rose-700 text-white"
            >
              {submitting ? (
                <>
                  <Loader2 className="size-3.5 animate-spin" /> Submitting…
                </>
              ) : (
                <>
                  <Flag className="size-3.5" /> Submit Report
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}

export default ReportModal;
