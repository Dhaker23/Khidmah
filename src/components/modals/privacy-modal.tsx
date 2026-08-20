"use client";

import { useState } from "react";
import {
  Dialog,
  DialogPortal,
  DialogOverlay,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import {
  ShieldCheck,
  Lock,
  BarChart3,
  Megaphone,
  Sparkles,
  Share2,
  Download,
  Trash2,
  FileText,
  Save,
} from "lucide-react";
import { useApp } from "@/lib/store";
import { Reveal } from "@/components/khidma/reveal";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "khidma:cookie-preferences";

interface CookiePrefs {
  essential: true; // always true
  analytics: boolean;
  marketing: boolean;
  functional: boolean;
  social: boolean;
}

const DEFAULT_PREFS: CookiePrefs = {
  essential: true,
  analytics: true,
  marketing: false,
  functional: true,
  social: false,
};

const COOKIE_CATEGORIES: {
  id: keyof CookiePrefs;
  title: string;
  desc: string;
  icon: React.ComponentType<{ className?: string }>;
  locked?: boolean;
}[] = [
  {
    id: "essential",
    title: "Essential",
    desc: "Required for core functionality — authentication, security, session handling. These cannot be disabled.",
    icon: Lock,
    locked: true,
  },
  {
    id: "analytics",
    title: "Analytics",
    desc: "Help us understand how the platform is used so we can improve performance and design.",
    icon: BarChart3,
  },
  {
    id: "marketing",
    title: "Marketing",
    desc: "Personalized ads and promotional content tailored to your interests.",
    icon: Megaphone,
  },
  {
    id: "functional",
    title: "Functional",
    desc: "Enhanced features like saved preferences, language and recently-viewed items.",
    icon: Sparkles,
  },
  {
    id: "social",
    title: "Social Media",
    desc: "Social sharing, embedded posts and engagement tracking across networks.",
    icon: Share2,
  },
];

export function PrivacyModal() {
  const { modal, closePrivacy } = useApp();
  const [prefs, setPrefs] = useState<CookiePrefs>(() => {
    if (typeof window === "undefined") return DEFAULT_PREFS;
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as Partial<CookiePrefs>;
        return { ...DEFAULT_PREFS, ...parsed, essential: true };
      }
    } catch {
      /* ignore */
    }
    return DEFAULT_PREFS;
  });
  const [confirmDelete, setConfirmDelete] = useState(false);

  const togglePref = (id: keyof CookiePrefs, value: boolean) => {
    if (id === "essential") return; // locked
    setPrefs((p) => ({ ...p, [id]: value }));
  };

  const handleSave = () => {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
    } catch {
      /* ignore */
    }
    toast.success("Privacy preferences saved", {
      description: "Your settings apply across this device immediately.",
    });
    closePrivacy();
  };

  const handleDownloadData = () => {
    toast.info("Your data export will be ready in 24h", {
      description: "We'll email a secure download link to your verified address.",
    });
  };

  const handleDeleteAccount = () => {
    setConfirmDelete(false);
    toast.error("Account deletion requested", {
      description: "A confirmation email has been sent. Your account will be erased in 30 days.",
    });
    closePrivacy();
  };

  return (
    <Dialog open={modal.privacyOpen} onOpenChange={(o) => !o && closePrivacy()}>
      <DialogPortal>
        <DialogOverlay className="bg-[#192d2f]/70 backdrop-blur-sm" />
        <DialogContent
          className="max-w-2xl w-[calc(100%-1.5rem)] max-h-[90vh] overflow-y-auto p-0 gap-0"
          aria-describedby={undefined}
          showCloseButton
        >
          <DialogTitle className="sr-only">Privacy Settings</DialogTitle>
          <DialogDescription className="sr-only">
            Manage how Khidma uses your data — control cookies, download your data, or request account deletion.
          </DialogDescription>

          {/* Header */}
          <div className="px-5 sm:px-6 pt-6 pb-5 border-b border-border/60 bg-gradient-to-b from-[#32504d]/10 to-transparent">
            <div className="flex items-center gap-3">
              <div className="size-10 rounded-xl bg-[#32504d] text-white grid place-items-center shadow-sm">
                <ShieldCheck className="size-5" />
              </div>
              <div>
                <h2 className="font-display font-bold text-lg leading-tight">
                  Privacy Settings
                </h2>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Manage how Khidma uses your data.
                </p>
              </div>
            </div>
          </div>

          <div className="p-5 sm:p-6 space-y-6">
            {/* Cookie categories */}
            <Reveal>
              <section aria-labelledby="cookies-heading">
                <h3
                  id="cookies-heading"
                  className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3"
                >
                  Cookie categories
                </h3>
                <div className="rounded-xl border border-border/70 bg-card overflow-hidden divide-y divide-border/60">
                  {COOKIE_CATEGORIES.map((cat) => {
                    const Icon = cat.icon;
                    const value = prefs[cat.id];
                    return (
                      <div
                        key={cat.id}
                        className="flex items-start gap-3 p-3.5 hover:bg-muted/30 transition-colors"
                      >
                        <div
                          className={cn(
                            "size-8 rounded-lg grid place-items-center shrink-0",
                            cat.id === "essential"
                              ? "bg-[#32504d] text-white"
                              : "bg-[#32504d]/10 dark:bg-[#32504d]/20 text-[#32504d] dark:text-[#9bb3ae]"
                          )}
                        >
                          <Icon className="size-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-semibold leading-tight">
                              {cat.title}
                            </p>
                            {cat.locked && (
                              <Badge className="bg-[#32504d]/10 dark:bg-[#32504d]/20 text-[#32504d] dark:text-[#9bb3ae] border-0 text-[10px] uppercase tracking-wider">
                                Always on
                              </Badge>
                            )}
                          </div>
                          <p className="text-[11px] text-muted-foreground mt-1 leading-snug pr-2">
                            {cat.desc}
                          </p>
                        </div>
                        <Switch
                          checked={value}
                          disabled={cat.locked}
                          onCheckedChange={(v) => togglePref(cat.id, v)}
                          aria-label={`Toggle ${cat.title} cookies`}
                          className={cn(
                            "data-[state=checked]:bg-[#32504d]",
                            cat.locked && "opacity-60 cursor-not-allowed"
                          )}
                        />
                      </div>
                    );
                  })}
                </div>
              </section>
            </Reveal>

            {/* Data controls */}
            <Reveal delay={0.05}>
              <section aria-labelledby="data-controls-heading">
                <h3
                  id="data-controls-heading"
                  className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3"
                >
                  Data controls
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={handleDownloadData}
                    className="flex items-start gap-2.5 rounded-xl border border-border/70 bg-card p-3.5 text-left hover:border-[#32504d]/40 hover:bg-[#32504d]/5 dark:bg-[#32504d]/15 transition-colors"
                  >
                    <Download className="size-5 text-[#32504d] dark:text-[#9bb3ae] shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-semibold">Download my data</p>
                      <p className="text-[11px] text-muted-foreground mt-0.5 leading-snug">
                        Export everything Khidma stores about you (JSON).
                      </p>
                    </div>
                  </button>

                  <AlertDialog open={confirmDelete} onOpenChange={setConfirmDelete}>
                    <AlertDialogTrigger asChild>
                      <button
                        type="button"
                        className="flex items-start gap-2.5 rounded-xl border border-rose-400/40 bg-rose-500/5 p-3.5 text-left hover:bg-rose-500/10 transition-colors"
                      >
                        <Trash2 className="size-5 text-rose-600 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-semibold text-rose-700 dark:text-rose-300">
                            Delete my account
                          </p>
                          <p className="text-[11px] text-rose-700/80 dark:text-rose-300/80 mt-0.5 leading-snug">
                            Permanently erase your account and all related data.
                          </p>
                        </div>
                      </button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete your Khidma account?</AlertDialogTitle>
                        <AlertDialogDescription>
                          This action is irreversible. All your services, proposals, messages and
                          earnings history will be permanently erased. Active contracts will be
                          cancelled and funds returned to clients.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={handleDeleteAccount}
                          className="bg-rose-600 hover:bg-rose-700 text-white"
                        >
                          Yes, delete my account
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </section>
            </Reveal>

            {/* Privacy policy summary */}
            <Reveal delay={0.1}>
              <section aria-labelledby="policy-heading">
                <h3
                  id="policy-heading"
                  className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 inline-flex items-center gap-1.5"
                >
                  <FileText className="size-3.5 text-[#32504d] dark:text-[#9bb3ae]" />
                  Privacy policy summary
                </h3>
                <div className="space-y-2.5 text-[12px] text-muted-foreground leading-relaxed">
                  <p>
                    <span className="font-semibold text-foreground">What we collect.</span>{" "}
                    Your name, email, phone number, profile photo, portfolio, transaction history and
                    activity logs needed to operate the marketplace. We never sell your personal data.
                  </p>
                  <p>
                    <span className="font-semibold text-foreground">How we use it.</span>{" "}
                    To verify your identity, match you with relevant jobs, process payments, prevent
                    fraud and improve product features. Analytics help us understand usage patterns
                    in aggregate.
                  </p>
                  <p>
                    <span className="font-semibold text-foreground">Your rights.</span>{" "}
                    You can access, correct, export or delete your data at any time. To exercise any
                    of these rights, use the controls above or email{" "}
                    <a
                      href="mailto:privacy@khidma.tn"
                      className="text-[#32504d] dark:text-[#9bb3ae] underline underline-offset-2 hover:text-[#192d2f]"
                    >
                      privacy@khidma.tn
                    </a>
                    .
                  </p>
                </div>
              </section>
            </Reveal>
          </div>

          {/* Footer */}
          <div className="px-5 sm:px-6 py-4 border-t border-border/60 bg-muted/30 flex flex-col-reverse sm:flex-row sm:items-center gap-2 sm:justify-end">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={closePrivacy}
              className="text-xs text-muted-foreground"
            >
              Cancel
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={handleSave}
              className="bg-[#2b3d3d] hover:bg-[#192d2f] text-white"
            >
              <Save className="size-3.5" />
              Save preferences
            </Button>
          </div>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}

export default PrivacyModal;
