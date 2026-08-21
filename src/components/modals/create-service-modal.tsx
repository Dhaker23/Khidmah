"use client";

import { useEffect, useMemo, useState } from "react";
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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Package,
  HelpCircle,
  Rocket,
  ArrowLeft,
  ArrowRight,
  Check,
  Plus,
  FileText,
  DollarSign,
  Image as ImageIcon,
  Lock,
  ShieldCheck,
  Clock,
  Trash2,
  Tag,
  Save,
  Code,
  PenTool,
} from "lucide-react";
import { useApp } from "@/lib/store";
import { toast } from "sonner";
import { categories, formatTND } from "@/lib/khidma-data";
import { KhidmaLogo } from "@/components/khidma/logo";
import { cn } from "@/lib/utils";

type PkgKey = "basic" | "standard" | "premium";

interface ServicePackage {
  name: string;
  price: string;
  deliveryDays: string;
  revisions: string;
  features: string[];
}
interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

interface ServiceFormState {
  title: string;
  category: string;
  description: string;
  skills: string[];
  packages: Record<PkgKey, ServicePackage>;
  faq: FAQItem[];
}

const TOTAL_STEPS = 4;

const stepMeta = [
  { name: "Service Basics", desc: "Title, category & description", icon: Tag },
  { name: "Packages", desc: "Pricing & deliverables", icon: Package },
  { name: "FAQ", desc: "Answer common questions", icon: HelpCircle },
  { name: "Review & Publish", desc: "Final check", icon: Rocket },
];

const PKG_LABELS: Record<PkgKey, { label: string; badge: string }> = {
  basic: { label: "Basic", badge: "Starting price" },
  standard: { label: "Standard", badge: "Most popular" },
  premium: { label: "Premium", badge: "Full scope" },
};

const initialForm: ServiceFormState = {
  title: "",
  category: "",
  description: "",
  skills: [],
  packages: {
    basic: {
      name: "Basic",
      price: "",
      deliveryDays: "3",
      revisions: "1",
      features: [""],
    },
    standard: {
      name: "Standard",
      price: "",
      deliveryDays: "5",
      revisions: "2",
      features: ["", ""],
    },
    premium: {
      name: "Premium",
      price: "",
      deliveryDays: "7",
      revisions: "3",
      features: ["", "", ""],
    },
  },
  faq: [
    { id: "f1", question: "", answer: "" },
  ],
};

let faqCounter = 1;
const newFaqId = () => `f${++faqCounter}_${Date.now()}`;

export function CreateServiceModal() {
  const {
    modal: { createServiceOpen },
    closeCreateService,
    currentUser,
    openOnboarding,
    pushNotification,
    setView,
  } = useApp();

  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [form, setForm] = useState<ServiceFormState>(initialForm);
  const [skillInput, setSkillInput] = useState("");
  const [publishing, setPublishing] = useState(false);
  const [lastOpen, setLastOpen] = useState(createServiceOpen);

  // React 19 render-time adjustment: reset all local state when the modal
  // transitions from closed → open. This avoids setState-in-effect cascades.
  if (createServiceOpen !== lastOpen) {
    setLastOpen(createServiceOpen);
    if (createServiceOpen) {
      setStep(0);
      setDirection(1);
      setForm(initialForm);
      setSkillInput("");
      setPublishing(false);
    }
  }

  // Body scroll lock.
  useEffect(() => {
    if (!createServiceOpen) return;
    const orig = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = orig;
    };
  }, [createServiceOpen]);

  const update = <K extends keyof ServiceFormState>(
    key: K,
    value: ServiceFormState[K]
  ) => setForm((f) => ({ ...f, [key]: value }));

  const updatePkg = (key: PkgKey, patch: Partial<ServicePackage>) =>
    setForm((f) => ({
      ...f,
      packages: { ...f.packages, [key]: { ...f.packages[key], ...patch } },
    }));

  // "starting price" = the basic package's price (auto-updates).
  const startingPrice = useMemo(() => {
    const p = Number(form.packages.basic.price);
    return Number.isFinite(p) && p > 0 ? p : null;
  }, [form.packages.basic.price]);

  // Per-step validation.
  const stepValid = useMemo(() => {
    switch (step) {
      case 0:
        return (
          form.title.trim().length >= 6 &&
          form.category.length > 0 &&
          form.description.trim().length >= 30
        );
      case 1: {
        // At least the basic package must be filled.
        const b = form.packages.basic;
        const basicValid =
          b.name.trim().length > 0 &&
          Number(b.price) > 0 &&
          Number(b.deliveryDays) > 0 &&
          Number(b.revisions) >= 0 &&
          b.features.some((f) => f.trim().length > 0);
        return basicValid;
      }
      case 2:
        // Recommend at least 1 FAQ, but allow 0 , we only require no empty
        // rows (each FAQ must have both question + answer or be removed).
        return true;
      case 3:
        return true;
      default:
        return false;
    }
  }, [step, form]);

  if (!createServiceOpen) return null;

  const next = () => {
    if (!stepValid) return;
    setDirection(1);
    setStep((s) => Math.min(TOTAL_STEPS - 1, s + 1));
  };
  const back = () => {
    setDirection(-1);
    setStep((s) => Math.max(0, s - 1));
  };

  const addSkill = (skill?: string) => {
    const s = (skill ?? skillInput).trim();
    if (!s) return;
    if (form.skills.includes(s)) {
      setSkillInput("");
      return;
    }
    update("skills", [...form.skills, s]);
    setSkillInput("");
  };
  const removeSkill = (s: string) =>
    update(
      "skills",
      form.skills.filter((x) => x !== s)
    );

  const addFeature = (key: PkgKey) =>
    updatePkg(key, { features: [...form.packages[key].features, ""] });
  const removeFeature = (key: PkgKey, idx: number) =>
    updatePkg(key, {
      features: form.packages[key].features.filter((_, i) => i !== idx),
    });
  const setFeature = (key: PkgKey, idx: number, value: string) => {
    const next = [...form.packages[key].features];
    next[idx] = value;
    updatePkg(key, { features: next });
  };

  const addFaq = () =>
    update("faq", [
      ...form.faq,
      { id: newFaqId(), question: "", answer: "" },
    ]);
  const removeFaq = (id: string) =>
    update(
      "faq",
      form.faq.filter((f) => f.id !== id)
    );
  const setFaq = (
    id: string,
    field: "question" | "answer",
    value: string
  ) => {
    update(
      "faq",
      form.faq.map((f) => (f.id === id ? { ...f, [field]: value } : f))
    );
  };

  const handleSaveDraft = () => {
    toast.success("Draft saved", {
      description:
        "You can resume creating this service anytime from your dashboard.",
    });
    closeCreateService();
    setView("dashboard");
  };

  const handlePublish = () => {
    setPublishing(true);
    setTimeout(() => {
      setPublishing(false);
      pushNotification({
        type: "service",
        title: "Service published",
        body: `Your service '${form.title.trim()}' is now live in the marketplace.`,
        link: "services",
      });
      toast.success("Service published!", {
        description: `'${form.title.trim()}' is now live in the marketplace.`,
      });
      closeCreateService();
      setView("services");
    }, 600);
  };

  // ---- login / role gate ----
  if (!currentUser || currentUser.type === "client") {
    return (
      <Dialog open onOpenChange={(o) => !o && closeCreateService()}>
        <DialogPortal>
          <DialogOverlay className="bg-[#192d2f]/70 backdrop-blur-sm" />
          <DialogContent
            className="max-w-md gap-0 p-0 overflow-hidden"
            aria-describedby={undefined}
            showCloseButton
          >
            <DialogTitle className="sr-only">Create a service</DialogTitle>
            <DialogDescription className="sr-only">
              Creating services is for verified freelancers only.
            </DialogDescription>
            <div className="bg-khidma-gradient text-white px-6 py-8 text-center">
              <ShieldCheck className="mx-auto size-6 text-white mb-3" />
              <h2 className="text-lg font-semibold">Freelancers only</h2>
              <p className="text-xs text-white/70 mt-1">
                {currentUser
                  ? "Creating services is for verified freelancers only."
                  : "Log in as a verified freelancer to create a service."}
              </p>
            </div>
            <div className="p-6 flex flex-col gap-3">
              {currentUser && (
                <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-[11px] text-amber-800 flex items-start gap-2">
                  <ShieldCheck className="size-4 shrink-0 mt-0.5" />
                  <span>
                    You are currently signed in as a{" "}
                    <strong>client</strong>. Become a verified freelancer to
                    publish services.
                  </span>
                </div>
              )}
              <Button
                className="bg-[#2b3d3d] hover:bg-[#192d2f] text-white h-11"
                onClick={() => {
                  closeCreateService();
                  openOnboarding();
                }}
              >
                Become a freelancer
              </Button>
              <p className="text-center text-[10px] text-muted-foreground">
                Onboarding takes ~5 minutes. Once your profile is approved, you
                can publish unlimited services.
              </p>
            </div>
          </DialogContent>
        </DialogPortal>
      </Dialog>
    );
  }

  const progress = ((step + 1) / TOTAL_STEPS) * 100;
  const StepIcon = stepMeta[step].icon;
  const selectedCategory = categories.find((c) => c.id === form.category);

  return (
    <Dialog open onOpenChange={(o) => !o && closeCreateService()}>
      <DialogPortal>
        <DialogOverlay className="bg-[#192d2f]/70 backdrop-blur-sm" />
        <DialogContent
          className="max-w-3xl w-[calc(100%-1.5rem)] max-h-[92vh] p-0 gap-0 overflow-hidden flex flex-col"
          aria-describedby={undefined}
          showCloseButton
        >
          <DialogTitle className="sr-only">Create a service</DialogTitle>
          <DialogDescription className="sr-only">
            Publish a new service in a few quick steps.
          </DialogDescription>

          {/* Header with progress */}
          <div className="px-5 sm:px-7 py-4 border-b border-border/60 bg-khidma-gradient text-white">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <KhidmaLogo variant="symbol" size="sm" />
                <div className="min-w-0">
                  <h2 className="text-base font-semibold leading-tight truncate">
                    Create a Service
                  </h2>
                  <p className="text-[11px] text-white/70 truncate">
                    Step {step + 1} of {TOTAL_STEPS} , {stepMeta[step].name}
                  </p>
                </div>
              </div>
              <div className="hidden sm:flex items-center gap-2">
                <div className="text-right">
                  <p className="text-[9px] uppercase tracking-wider text-white/60">
                    Starting price
                  </p>
                  <p className="text-sm font-bold tabular-nums">
                    {startingPrice ? formatTND(startingPrice) : ","}
                  </p>
                </div>
                <span className="size-9 rounded-lg bg-white/10 flex-shrink-0 flex items-center justify-center">
                  <StepIcon className="size-4 text-white" />
                </span>
              </div>
            </div>
            <div className="mt-3 flex items-center gap-3">
              <Progress
                value={progress}
                className="h-1.5 bg-white/15 [&>div]:bg-white"
              />
              <span className="text-[10px] text-white/80 tabular-nums">
                {Math.round(progress)}%
              </span>
            </div>
          </div>

          {/* Step pills */}
          <div className="px-5 sm:px-7 pt-3 pb-2 border-b border-border/60 bg-card/40 overflow-x-auto">
            <ol className="flex items-center gap-1.5 min-w-max">
              {stepMeta.map((s, i) => {
                const Icon = s.icon;
                const done = i < step;
                const active = i === step;
                return (
                  <li
                    key={s.name}
                    className={cn(
                      "flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] transition-colors",
                      active && "bg-[#32504d]/10 dark:bg-[#32504d]/20 text-[#32504d] dark:text-[#9bb3ae] font-semibold",
                      done && "text-[#32504d] dark:text-[#9bb3ae]",
                      !active && !done && "text-muted-foreground"
                    )}
                  >
                    <span
                      className={cn(
                        "size-4 rounded-full flex items-center justify-center text-[9px]",
                        active && "bg-[#32504d] text-white",
                        done && "bg-[#32504d]/15 dark:bg-[#32504d]/25 text-[#32504d] dark:text-[#9bb3ae]",
                        !active && !done && "bg-muted text-muted-foreground"
                      )}
                    >
                      {done ? <Check className="size-2.5" /> : i + 1}
                    </span>
                    <span className="hidden sm:inline">{s.name}</span>
                    <Icon className="size-3 sm:hidden" />
                  </li>
                );
              })}
            </ol>
          </div>

          {/* Body */}
          <ScrollArea className="flex-1 min-h-0">
            <div className="px-5 sm:px-7 py-5">
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={step}
                  custom={direction}
                  initial={{ opacity: 0, x: direction * 16 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: direction * -16 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                >
                  {/* STEP 0 , Service Basics */}
                  {step === 0 && (
                    <div className="space-y-5">
                      <StepHeader
                        icon={Tag}
                        title="Service Basics"
                        desc="What will you deliver? Be specific and benefit-driven."
                      />
                      <div className="space-y-1.5">
                        <Label htmlFor="stitle">
                          Service title <span className="text-rose-500">*</span>
                        </Label>
                        <div className="relative">
                          <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[11px] text-muted-foreground font-medium">
                            I will
                          </span>
                          <Input
                            id="stitle"
                            value={form.title}
                            onChange={(e) => update("title", e.target.value)}
                            placeholder="build a modern Next.js landing page with animations"
                            className="pl-14"
                            maxLength={80}
                          />
                        </div>
                        <p className="text-[10px] text-muted-foreground">
                          {form.title.length}/80 , min 6 characters, keep it short &amp; benefit-focused.
                        </p>
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="scat">
                          Category <span className="text-rose-500">*</span>
                        </Label>
                        <Select
                          value={form.category}
                          onValueChange={(v) => update("category", v)}
                        >
                          <SelectTrigger id="scat" className="w-full">
                            <SelectValue placeholder="Choose a category" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((c) => {
                              const Icon = c.icon;
                              return (
                                <SelectItem key={c.id} value={c.id}>
                                  <div className="flex items-center gap-2">
                                    <Icon className="size-3.5 text-[#32504d] dark:text-[#9bb3ae]" />
                                    <span>{c.name}</span>
                                    <span className="text-muted-foreground text-[10px]">
                                      ({c.count})
                                    </span>
                                  </div>
                                </SelectItem>
                              );
                            })}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="sdesc">
                          Description <span className="text-rose-500">*</span>
                        </Label>
                        <Textarea
                          id="sdesc"
                          value={form.description}
                          onChange={(e) =>
                            update("description", e.target.value)
                          }
                          placeholder={
                            "Describe what's included, your process, deliverables, and why clients should pick you.\n\nMarkdown is supported (## headings, **bold**, - lists, [links](https://))."
                          }
                          rows={6}
                          maxLength={3000}
                        />
                        <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                          <Code className="size-3" /> Markdown supported ·{" "}
                          {form.description.length}/3000 , min 30 characters
                        </p>
                      </div>
                      <div className="space-y-1.5">
                        <Label>Skills</Label>
                        <div className="flex gap-2">
                          <Input
                            value={skillInput}
                            onChange={(e) => setSkillInput(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                addSkill();
                              }
                            }}
                            placeholder="Add a skill and press Enter"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => addSkill()}
                            disabled={!skillInput.trim()}
                          >
                            <Plus className="size-4" /> Add
                          </Button>
                        </div>
                        {selectedCategory && (
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {selectedCategory.skills
                              .filter((s) => !form.skills.includes(s))
                              .slice(0, 8)
                              .map((s) => (
                                <button
                                  key={s}
                                  type="button"
                                  onClick={() => addSkill(s)}
                                  className="text-[10px] px-2 py-0.5 rounded-full bg-muted hover:bg-[#32504d]/10 dark:bg-[#32504d]/20 hover:text-[#32504d] dark:text-[#9bb3ae] transition-colors"
                                >
                                  + {s}
                                </button>
                              ))}
                          </div>
                        )}
                        {form.skills.length > 0 && (
                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {form.skills.map((s) => (
                              <Badge
                                key={s}
                                className="bg-[#32504d]/10 dark:bg-[#32504d]/20 text-[#32504d] dark:text-[#9bb3ae] border-[#32504d]/20 dark:border-[#32504d]/30 gap-1 pr-1"
                              >
                                <Tag className="size-2.5" />
                                {s}
                                <button
                                  type="button"
                                  aria-label={`Remove ${s}`}
                                  onClick={() => removeSkill(s)}
                                  className="hover:bg-[#32504d]/20 dark:bg-[#32504d]/30 rounded-full size-4 flex items-center justify-center"
                                >
                                  <span className="text-[10px]">×</span>
                                </button>
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="space-y-1.5">
                        <Label>Cover image</Label>
                        <div className="rounded-lg border-2 border-dashed border-border/70 hover:border-[#32504d]/40 transition-colors p-6 text-center">
                          <ImageIcon className="size-6 mx-auto text-muted-foreground/60 mb-2" />
                          <p className="text-xs text-muted-foreground">
                            Drag &amp; drop an image, or{" "}
                            <button
                              type="button"
                              onClick={() =>
                                toast.info("Cover image upload coming soon")
                              }
                              className="text-[#32504d] dark:text-[#9bb3ae] hover:underline"
                            >
                              browse
                            </button>
                          </p>
                          <p className="text-[10px] text-muted-foreground/70 mt-1">
                            Recommended 1280×720 · PNG, JPG up to 5 MB
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* STEP 1 , Packages */}
                  {step === 1 && (
                    <div className="space-y-5">
                      <StepHeader
                        icon={Package}
                        title="Packages"
                        desc="Offer 3 tiers. The Basic package sets your starting price."
                      />
                      <div className="grid sm:grid-cols-3 gap-3">
                        {(["basic", "standard", "premium"] as PkgKey[]).map(
                          (k) => (
                            <PackageCard
                              key={k}
                              pkgKey={k}
                              pkg={form.packages[k]}
                              startingPriceRef={
                                k === "basic" ? startingPrice : null
                              }
                              onPatch={(patch) => updatePkg(k, patch)}
                              onAddFeature={() => addFeature(k)}
                              onRemoveFeature={(idx) => removeFeature(k, idx)}
                              onSetFeature={(idx, v) => setFeature(k, idx, v)}
                            />
                          )
                        )}
                      </div>
                      <div className="rounded-lg border border-[#32504d]/20 dark:border-[#32504d]/30 bg-[#32504d]/5 dark:bg-[#32504d]/15 p-3 flex items-start gap-2.5">
                        <DollarSign className="size-4 text-[#32504d] dark:text-[#9bb3ae] shrink-0 mt-0.5" />
                        <p className="text-[11px] text-muted-foreground leading-relaxed">
          Khidma takes a <strong>1% platform fee</strong> on completed orders ,
          the lowest in the industry. Your starting price (shown in the header)
          updates live as you edit the Basic package.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* STEP 2 , FAQ */}
                  {step === 2 && (
                    <div className="space-y-5">
                      <StepHeader
                        icon={HelpCircle}
                        title="FAQ"
                        desc="Anticipate client questions. At least one is recommended."
                      />
                      <div className="space-y-3">
                        <AnimatePresence initial={false}>
                          {form.faq.map((f) => (
                            <motion.div
                              key={f.id}
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.2 }}
                              className="rounded-xl border border-border/70 overflow-hidden"
                            >
                              <div className="flex items-center gap-2 px-3 py-2 bg-muted/40 border-b border-border/60">
                                <HelpCircle className="size-4 text-[#32504d] dark:text-[#9bb3ae] shrink-0" />
                                <Input
                                  value={f.question}
                                  onChange={(e) =>
                                    setFaq(f.id, "question", e.target.value)
                                  }
                                  placeholder="Type a question (e.g. What's included in revisions?)"
                                  className="border-0 bg-transparent px-0 h-7 text-xs font-medium focus-visible:ring-0"
                                />
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="icon"
                                  className="size-7 text-muted-foreground hover:text-rose-600"
                                  onClick={() => removeFaq(f.id)}
                                  aria-label="Remove FAQ"
                                  disabled={form.faq.length === 1}
                                >
                                  <Trash2 className="size-3.5" />
                                </Button>
                              </div>
                              <Textarea
                                value={f.answer}
                                onChange={(e) =>
                                  setFaq(f.id, "answer", e.target.value)
                                }
                                placeholder="Type the answer here…"
                                rows={2}
                                className="border-0 rounded-none focus-visible:ring-0 text-xs leading-relaxed"
                              />
                            </motion.div>
                          ))}
                        </AnimatePresence>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={addFaq}
                        className="w-full border-dashed"
                      >
                        <Plus className="size-3.5" /> Add another question
                      </Button>
                      {form.faq.length === 1 &&
                        !form.faq[0].question &&
                        !form.faq[0].answer && (
                          <p className="text-[10px] text-muted-foreground text-center">
                            Tip: clear FAQs reduce back-and-forth messages and
                            improve conversion.
                          </p>
                        )}
                    </div>
                  )}

                  {/* STEP 3 , Review & Publish */}
                  {step === 3 && (
                    <div className="space-y-5">
                      <StepHeader
                        icon={Rocket}
                        title="Review & Publish"
                        desc="Final check before your service goes live."
                      />
                      <div className="rounded-xl border border-border/70 overflow-hidden">
                        <div className="bg-khidma-gradient text-white px-4 py-3 flex items-center justify-between gap-3">
                          <div className="min-w-0">
                            <p className="text-[10px] uppercase tracking-wider text-white/70">
                              Service
                            </p>
                            <h3 className="text-sm font-semibold truncate">
                              I will {form.title || ","}
                            </h3>
                          </div>
                          <div className="text-right shrink-0">
                            <p className="text-[9px] uppercase tracking-wider text-white/70">
                              Starting at
                            </p>
                            <p className="text-sm font-bold tabular-nums">
                              {startingPrice ? formatTND(startingPrice) : ","}
                            </p>
                          </div>
                        </div>
                        <dl className="divide-y divide-border/60 text-xs">
                          <SummaryRow
                            label="Category"
                            value={selectedCategory?.name ?? ","}
                          />
                          <SummaryRow
                            label="Description"
                            value={
                              <p className="text-[11px] text-muted-foreground leading-relaxed line-clamp-3">
                                {form.description || ","}
                              </p>
                            }
                          />
                          <SummaryRow
                            label="Skills"
                            value={
                              form.skills.length ? (
                                <div className="flex flex-wrap gap-1 justify-end">
                                  {form.skills.map((s) => (
                                    <Badge
                                      key={s}
                                      variant="outline"
                                      className="text-[9px] px-1.5 py-0 h-4"
                                    >
                                      {s}
                                    </Badge>
                                  ))}
                                </div>
                              ) : (
                                ","
                              )
                            }
                          />
                          {(["basic", "standard", "premium"] as PkgKey[]).map(
                            (k) => {
                              const p = form.packages[k];
                              const valid = Number(p.price) > 0;
                              return (
                                <SummaryRow
                                  key={k}
                                  label={`${PKG_LABELS[k].label} package`}
                                  value={
                                    valid ? (
                                      <div className="text-right">
                                        <span className="font-semibold">
                                          {formatTND(Number(p.price))}
                                        </span>
                                        <span className="text-muted-foreground">
                                          {" "}
                                          · {p.deliveryDays || ","} days ·{" "}
                                          {p.revisions || "0"} revisions ·{" "}
                                          {p.features.filter((f) =>
                                            f.trim()
                                          ).length}{" "}
                                          features
                                        </span>
                                      </div>
                                    ) : (
                                      <span className="text-muted-foreground">
                                        Not configured
                                      </span>
                                    )
                                  }
                                />
                              );
                            }
                          )}
                          <SummaryRow
                            label="FAQ items"
                            value={`${form.faq.filter((f) => f.question.trim() && f.answer.trim()).length} answered`}
                          />
                        </dl>
                      </div>
                      <div className="rounded-lg border border-[#32504d]/20 dark:border-[#32504d]/30 bg-[#32504d]/5 dark:bg-[#32504d]/15 p-3 flex items-start gap-2.5">
                        <ShieldCheck className="size-4 text-[#32504d] dark:text-[#9bb3ae] shrink-0 mt-0.5" />
                        <p className="text-[11px] text-muted-foreground leading-relaxed">
                          By publishing, you confirm this service complies with
                          Khidma&apos;s guidelines. Each order is protected by
                          escrow , payments release only after you deliver.
                        </p>
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </ScrollArea>

          {/* Footer */}
          <div className="px-5 sm:px-7 py-3 border-t border-border/60 bg-card/40 flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground"
              onClick={handleSaveDraft}
            >
              <Save className="size-3.5" /> Save as Draft
            </Button>
            <div className="flex-1" />
            {step > 0 && (
              <Button variant="outline" size="sm" onClick={back}>
                <ArrowLeft className="size-3.5" /> Back
              </Button>
            )}
            {step < TOTAL_STEPS - 1 ? (
              <Button
                size="sm"
                className="bg-[#2b3d3d] hover:bg-[#192d2f] text-white"
                onClick={next}
                disabled={!stepValid}
              >
                Next <ArrowRight className="size-3.5" />
              </Button>
            ) : (
              <Button
                size="sm"
                className="bg-[#2b3d3d] hover:bg-[#192d2f] text-white"
                onClick={handlePublish}
                disabled={publishing}
              >
                {publishing ? (
                  <>
                    <span className="size-3.5 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                    Publishing…
                  </>
                ) : (
                  <>
                    <Rocket className="size-3.5" /> Publish Service
                  </>
                )}
              </Button>
            )}
          </div>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}

function StepHeader({
  icon: Icon,
  title,
  desc,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  desc: string;
}) {
  return (
    <div className="flex items-start gap-3 mb-2">
      <span className="size-9 rounded-lg bg-[#32504d]/10 dark:bg-[#32504d]/20 flex items-center justify-center shrink-0">
        <Icon className="size-4 text-[#32504d] dark:text-[#9bb3ae]" />
      </span>
      <div>
        <h3 className="text-sm font-semibold">{title}</h3>
        <p className="text-[11px] text-muted-foreground">{desc}</p>
      </div>
    </div>
  );
}

function PackageCard({
  pkgKey,
  pkg,
  startingPriceRef,
  onPatch,
  onAddFeature,
  onRemoveFeature,
  onSetFeature,
}: {
  pkgKey: PkgKey;
  pkg: ServicePackage;
  startingPriceRef: number | null;
  onPatch: (patch: Partial<ServicePackage>) => void;
  onAddFeature: () => void;
  onRemoveFeature: (idx: number) => void;
  onSetFeature: (idx: number, value: string) => void;
}) {
  const meta = PKG_LABELS[pkgKey];
  const accent =
    pkgKey === "basic"
      ? "from-[#6e8580] to-[#475959]"
      : pkgKey === "standard"
      ? "from-[#475959] to-[#32504d]"
      : "from-[#32504d] to-[#2b3d3d]";
  return (
    <div className="rounded-xl border border-border/70 overflow-hidden flex flex-col bg-card">
      <div className={cn("bg-gradient-to-br text-white px-3 py-2", accent)}>
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <span className="size-6 rounded-md bg-white/15 flex items-center justify-center text-[10px] font-bold">
              {pkgKey === "basic" ? "1" : pkgKey === "standard" ? "2" : "3"}
            </span>
            <Input
              value={pkg.name}
              onChange={(e) => onPatch({ name: e.target.value })}
              placeholder={meta.label}
              className="border-0 bg-transparent px-0 h-6 text-sm font-semibold text-white placeholder:text-white/60 focus-visible:ring-0"
            />
          </div>
          <span className="text-[9px] uppercase tracking-wider text-white/80">
            {meta.badge}
          </span>
        </div>
      </div>
      <div className="p-3 space-y-3 flex-1 flex flex-col">
        <div className="space-y-1">
          <Label htmlFor={`${pkgKey}-price`} className="text-[10px] uppercase tracking-wider text-muted-foreground">
            Price (TND)
          </Label>
          <div className="relative">
            <DollarSign className="size-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              id={`${pkgKey}-price`}
              inputMode="numeric"
              value={pkg.price}
              onChange={(e) =>
                onPatch({ price: e.target.value.replace(/[^\d]/g, "") })
              }
              placeholder="100"
              className="pl-7 h-8 text-xs"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1">
            <Label htmlFor={`${pkgKey}-days`} className="text-[10px] uppercase tracking-wider text-muted-foreground">
              Delivery (days)
            </Label>
            <div className="relative">
              <Clock className="size-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <Input
                id={`${pkgKey}-days`}
                inputMode="numeric"
                value={pkg.deliveryDays}
                onChange={(e) =>
                  onPatch({
                    deliveryDays: e.target.value.replace(/[^\d]/g, ""),
                  })
                }
                placeholder="3"
                className="pl-7 h-8 text-xs"
              />
            </div>
          </div>
          <div className="space-y-1">
            <Label htmlFor={`${pkgKey}-rev`} className="text-[10px] uppercase tracking-wider text-muted-foreground">
              Revisions
            </Label>
            <Input
              id={`${pkgKey}-rev`}
              inputMode="numeric"
              value={pkg.revisions}
              onChange={(e) =>
                onPatch({
                  revisions: e.target.value.replace(/[^\d]/g, ""),
                })
              }
              placeholder="2"
              className="h-8 text-xs"
            />
          </div>
        </div>
        <div className="space-y-1.5 flex-1">
          <Label className="text-[10px] uppercase tracking-wider text-muted-foreground">
            Features
          </Label>
          <ul className="space-y-1.5">
            <AnimatePresence initial={false}>
              {pkg.features.map((f, idx) => (
                <motion.li
                  key={idx}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.15 }}
                  className="flex items-center gap-1.5"
                >
                  <span className="size-4 rounded-full bg-[#32504d]/10 dark:bg-[#32504d]/20 flex items-center justify-center shrink-0">
                    <Check className="size-2.5 text-[#32504d] dark:text-[#9bb3ae]" />
                  </span>
                  <Input
                    value={f}
                    onChange={(e) => onSetFeature(idx, e.target.value)}
                    placeholder={
                      idx === 0
                        ? "e.g. 1 page"
                        : idx === 1
                        ? "e.g. Responsive design"
                        : "Add a feature…"
                    }
                    className="h-7 text-[11px]"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="size-7 text-muted-foreground hover:text-rose-600 shrink-0"
                    onClick={() => onRemoveFeature(idx)}
                    aria-label="Remove feature"
                    disabled={pkg.features.length === 1}
                  >
                    <span className="text-xs">×</span>
                  </Button>
                </motion.li>
              ))}
            </AnimatePresence>
          </ul>
          <button
            type="button"
            onClick={onAddFeature}
            className="text-[10px] text-[#32504d] dark:text-[#9bb3ae] hover:underline flex items-center gap-1"
          >
            <Plus className="size-2.5" /> Add feature
          </button>
        </div>
        {pkgKey === "basic" && startingPriceRef !== null && (
          <div className="rounded-md bg-[#32504d]/5 dark:bg-[#32504d]/15 border border-[#32504d]/20 dark:border-[#32504d]/30 px-2 py-1 text-[10px] text-[#32504d] dark:text-[#9bb3ae] flex items-center gap-1">
            <DollarSign className="size-2.5" />
            This sets your starting price:{" "}
            <strong>{formatTND(startingPriceRef)}</strong>
          </div>
        )}
      </div>
    </div>
  );
}

function SummaryRow({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-3 px-4 py-2.5">
      <dt className="text-[11px] uppercase tracking-wider text-muted-foreground shrink-0">
        {label}
      </dt>
      <dd className="text-xs font-medium text-right min-w-0 flex-1">
        {value}
      </dd>
    </div>
  );
}
