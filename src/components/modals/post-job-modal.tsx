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
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Briefcase,
  Wallet,
  ListChecks,
  Rocket,
  ArrowLeft,
  ArrowRight,
  Check,
  X,
  Plus,
  FileText,
  DollarSign,
  Globe,
  Lock,
  Building2,
  ShieldCheck,
  Clock,
  Sparkles,
  Trash2,
  Tag,
  Save,
} from "lucide-react";
import { useApp } from "@/lib/store";
import { toast } from "sonner";
import { categories, formatTND } from "@/lib/khidma-data";
import { KhidmaLogo } from "@/components/khidma/logo";
import { cn } from "@/lib/utils";

type JobType = "FIXED" | "HOURLY";
type ExperienceLevel = "Entry" | "Intermediate" | "Expert";
type JobLocation = "Tunisia" | "Worldwide" | "Remote";

interface JobFormState {
  title: string;
  category: string;
  description: string;
  skills: string[];
  type: JobType;
  budgetMin: string;
  budgetMax: string;
  duration: string;
  experienceLevel: ExperienceLevel;
  location: JobLocation;
  verifiedOnly: boolean;
  specialRequirements: string;
}

const TOTAL_STEPS = 4;

const stepMeta = [
  { name: "Job Basics", desc: "Title, category & description", icon: Briefcase },
  { name: "Budget & Type", desc: "Pricing, duration & level", icon: Wallet },
  { name: "Requirements", desc: "Location & preferences", icon: ListChecks },
  { name: "Review & Publish", desc: "Final check", icon: Rocket },
];

const DURATIONS = [
  { value: "<1 week", label: "Less than 1 week" },
  { value: "1-2 weeks", label: "1 to 2 weeks" },
  { value: "2-4 weeks", label: "2 to 4 weeks" },
  { value: "1-3 months", label: "1 to 3 months" },
  { value: "3+ months", label: "3+ months" },
];

const EXPERIENCE_LEVELS: { value: ExperienceLevel; label: string; desc: string }[] = [
  { value: "Entry", label: "Entry", desc: "$ — best for simple, well-defined tasks" },
  { value: "Intermediate", label: "Intermediate", desc: "$$ — some expertise required" },
  { value: "Expert", label: "Expert", desc: "$$$ — senior-level, complex work" },
];

const initialForm: JobFormState = {
  title: "",
  category: "",
  description: "",
  skills: [],
  type: "FIXED",
  budgetMin: "",
  budgetMax: "",
  duration: "",
  experienceLevel: "Intermediate",
  location: "Tunisia",
  verifiedOnly: true,
  specialRequirements: "",
};

export function PostJobModal() {
  const {
    modal: { postJobOpen },
    closePostJob,
    currentUser,
    logout,
    pushNotification,
    setView,
  } = useApp();

  const [step, setStep] = useState(0);
  const [direction, setDirection] = useState(1);
  const [form, setForm] = useState<JobFormState>(initialForm);
  const [skillInput, setSkillInput] = useState("");
  const [publishing, setPublishing] = useState(false);
  const [lastOpen, setLastOpen] = useState(postJobOpen);

  // React 19 render-time adjustment: reset all local state when the modal
  // transitions from closed → open. This avoids setState-in-effect cascades.
  if (postJobOpen !== lastOpen) {
    setLastOpen(postJobOpen);
    if (postJobOpen) {
      setStep(0);
      setDirection(1);
      setForm(initialForm);
      setSkillInput("");
      setPublishing(false);
    }
  }

  // Body scroll lock.
  useEffect(() => {
    if (!postJobOpen) return;
    const orig = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = orig;
    };
  }, [postJobOpen]);

  const update = <K extends keyof JobFormState>(key: K, value: JobFormState[K]) =>
    setForm((f) => ({ ...f, [key]: value }));

  // Per-step validation: disable Next until requirements met.
  const stepValid = useMemo(() => {
    switch (step) {
      case 0:
        return (
          form.title.trim().length >= 4 &&
          form.category.length > 0 &&
          form.description.trim().length >= 20
        );
      case 1:
        return (
          form.type.length > 0 &&
          form.budgetMin.trim() !== "" &&
          Number(form.budgetMin) > 0 &&
          (form.budgetMax.trim() === "" ||
            Number(form.budgetMax) >= Number(form.budgetMin)) &&
          form.duration.length > 0 &&
          form.experienceLevel.length > 0
        );
      case 2:
        return form.location.length > 0;
      case 3:
        return true;
      default:
        return false;
    }
  }, [step, form]);

  if (!postJobOpen) return null;

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

  const handleSaveDraft = () => {
    toast.success("Draft saved", {
      description: "You can resume posting this job anytime from your dashboard.",
    });
    closePostJob();
    setView("dashboard");
  };

  const handlePublish = () => {
    setPublishing(true);
    setTimeout(() => {
      setPublishing(false);
      pushNotification({
        type: "job",
        title: "Job published",
        body: `Your job '${form.title.trim()}' is now live in the marketplace.`,
        link: "jobs",
      });
      toast.success("Job published!", {
        description: `'${form.title.trim()}' is now live in the marketplace.`,
      });
      closePostJob();
      setView("jobs");
    }, 600);
  };

  // ---- login / role gate ----
  if (!currentUser || currentUser.type === "freelancer") {
    return (
      <Dialog open onOpenChange={(o) => !o && closePostJob()}>
        <DialogPortal>
          <DialogOverlay className="bg-[#192d2f]/70 backdrop-blur-sm" />
          <DialogContent
            className="max-w-md gap-0 p-0 overflow-hidden"
            aria-describedby={undefined}
            showCloseButton
          >
            <DialogTitle className="sr-only">Post a job</DialogTitle>
            <DialogDescription className="sr-only">
              Posting jobs is for clients only.
            </DialogDescription>
            <div className="bg-khidma-gradient text-white px-6 py-8 text-center">
              <div className="mx-auto size-14 rounded-full bg-white/10 flex items-center justify-center mb-3">
                <Building2 className="size-6 text-white" />
              </div>
              <h2 className="text-lg font-semibold">Clients only</h2>
              <p className="text-xs text-white/70 mt-1">
                {currentUser
                  ? "Posting jobs is for clients only. Switch to a client account."
                  : "Log in to a client account to post a job."}
              </p>
            </div>
            <div className="p-6 flex flex-col gap-3">
              {currentUser && (
                <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-[11px] text-amber-800 flex items-start gap-2">
                  <ShieldCheck className="size-4 shrink-0 mt-0.5" />
                  <span>
                    You are currently signed in as a{" "}
                    <strong>freelancer</strong>. Log out and switch to a client
                    account to post jobs.
                  </span>
                </div>
              )}
              {currentUser ? (
                <Button
                  className="bg-[#2b3d3d] hover:bg-[#192d2f] text-white h-11"
                  onClick={() => {
                    logout();
                    closePostJob();
                  }}
                >
                  <Lock className="size-4" /> Log out
                </Button>
              ) : (
                <Button
                  className="bg-[#2b3d3d] hover:bg-[#192d2f] text-white h-11"
                  onClick={() => {
                    closePostJob();
                    useApp.getState().openAuth("login");
                  }}
                >
                  <Building2 className="size-4" /> Log in as client
                </Button>
              )}
              <p className="text-center text-[10px] text-muted-foreground">
                Don&apos;t have a client account? Register and select
                “Client” as your account type.
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
    <Dialog open onOpenChange={(o) => !o && closePostJob()}>
      <DialogPortal>
        <DialogOverlay className="bg-[#192d2f]/70 backdrop-blur-sm" />
        <DialogContent
          className="max-w-3xl w-[calc(100%-1.5rem)] max-h-[92vh] p-0 gap-0 overflow-hidden flex flex-col"
          aria-describedby={undefined}
          showCloseButton
        >
          <DialogTitle className="sr-only">Post a job</DialogTitle>
          <DialogDescription className="sr-only">
            Create a new job posting in a few quick steps.
          </DialogDescription>

          {/* Header with progress */}
          <div className="px-5 sm:px-7 py-4 border-b border-border/60 bg-khidma-gradient text-white">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5 min-w-0">
                <KhidmaLogo variant="symbol" size="sm" />
                <div className="min-w-0">
                  <h2 className="text-base font-semibold leading-tight truncate">
                    Post a Job
                  </h2>
                  <p className="text-[11px] text-white/70 truncate">
                    Step {step + 1} of {TOTAL_STEPS} — {stepMeta[step].name}
                  </p>
                </div>
              </div>
              <span className="hidden sm:inline-flex items-center gap-1.5 size-9 rounded-lg bg-white/10 flex-shrink-0">
                <StepIcon className="size-4 text-white" />
              </span>
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
                      active && "bg-[#32504d]/10 text-[#32504d] font-semibold",
                      done && "text-[#32504d]",
                      !active && !done && "text-muted-foreground"
                    )}
                  >
                    <span
                      className={cn(
                        "size-4 rounded-full flex items-center justify-center text-[9px]",
                        active && "bg-[#32504d] text-white",
                        done && "bg-[#32504d]/15 text-[#32504d]",
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
                  {/* STEP 0 — Job Basics */}
                  {step === 0 && (
                    <div className="space-y-5">
                      <StepHeader
                        icon={Briefcase}
                        title="Job Basics"
                        desc="Tell freelancers what you need. Be clear and specific."
                      />
                      <div className="space-y-1.5">
                        <Label htmlFor="title">
                          Job title <span className="text-rose-500">*</span>
                        </Label>
                        <Input
                          id="title"
                          value={form.title}
                          onChange={(e) => update("title", e.target.value)}
                          placeholder="e.g. Build a Next.js SaaS landing page with GSAP"
                          maxLength={80}
                        />
                        <p className="text-[10px] text-muted-foreground">
                          {form.title.length}/80 — min 4 characters
                        </p>
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="category">
                          Category <span className="text-rose-500">*</span>
                        </Label>
                        <Select
                          value={form.category}
                          onValueChange={(v) => update("category", v)}
                        >
                          <SelectTrigger id="category" className="w-full">
                            <SelectValue placeholder="Choose a category" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((c) => {
                              const Icon = c.icon;
                              return (
                                <SelectItem key={c.id} value={c.id}>
                                  <div className="flex items-center gap-2">
                                    <Icon className="size-3.5 text-[#32504d]" />
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
                        <Label htmlFor="description">
                          Description <span className="text-rose-500">*</span>
                        </Label>
                        <Textarea
                          id="description"
                          value={form.description}
                          onChange={(e) =>
                            update("description", e.target.value)
                          }
                          placeholder="Describe the project scope, deliverables, timeline, and any specific requirements…"
                          rows={5}
                          maxLength={2000}
                        />
                        <p className="text-[10px] text-muted-foreground">
                          {form.description.length}/2000 — min 20 characters
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
                                  className="text-[10px] px-2 py-0.5 rounded-full bg-muted hover:bg-[#32504d]/10 hover:text-[#32504d] transition-colors"
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
                                className="bg-[#32504d]/10 text-[#32504d] border-[#32504d]/20 gap-1 pr-1"
                              >
                                <Tag className="size-2.5" />
                                {s}
                                <button
                                  type="button"
                                  aria-label={`Remove ${s}`}
                                  onClick={() => removeSkill(s)}
                                  className="hover:bg-[#32504d]/20 rounded-full size-4 flex items-center justify-center"
                                >
                                  <X className="size-2.5" />
                                </button>
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* STEP 1 — Budget & Type */}
                  {step === 1 && (
                    <div className="space-y-5">
                      <StepHeader
                        icon={Wallet}
                        title="Budget & Type"
                        desc="Set the project type and pricing expectations."
                      />
                      <div className="space-y-1.5">
                        <Label>Project type</Label>
                        <RadioGroup
                          value={form.type}
                          onValueChange={(v) => update("type", v as JobType)}
                          className="grid sm:grid-cols-2 gap-3"
                        >
                          <RadioCard
                            value="FIXED"
                            current={form.type}
                            icon={Briefcase}
                            title="Fixed Price"
                            desc="Pay a set amount for the full deliverable."
                          />
                          <RadioCard
                            value="HOURLY"
                            current={form.type}
                            icon={Clock}
                            title="Hourly"
                            desc="Pay per hour worked, with a tracked budget."
                          />
                        </RadioGroup>
                      </div>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div className="space-y-1.5">
                          <Label htmlFor="bmin">
                            {form.type === "FIXED" ? "Budget min" : "Rate min"}{" "}
                            <span className="text-rose-500">*</span>
                          </Label>
                          <div className="relative">
                            <DollarSign className="size-4 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                            <Input
                              id="bmin"
                              inputMode="numeric"
                              value={form.budgetMin}
                              onChange={(e) =>
                                update(
                                  "budgetMin",
                                  e.target.value.replace(/[^\d]/g, "")
                                )
                              }
                              placeholder="500"
                              className="pl-8"
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground">
                              TND
                            </span>
                          </div>
                        </div>
                        <div className="space-y-1.5">
                          <Label htmlFor="bmax">
                            {form.type === "FIXED" ? "Budget max" : "Rate max"}
                          </Label>
                          <div className="relative">
                            <DollarSign className="size-4 absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
                            <Input
                              id="bmax"
                              inputMode="numeric"
                              value={form.budgetMax}
                              onChange={(e) =>
                                update(
                                  "budgetMax",
                                  e.target.value.replace(/[^\d]/g, "")
                                )
                              }
                              placeholder="1500"
                              className="pl-8"
                            />
                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground">
                              TND
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="duration">
                          Project duration <span className="text-rose-500">*</span>
                        </Label>
                        <Select
                          value={form.duration}
                          onValueChange={(v) => update("duration", v)}
                        >
                          <SelectTrigger id="duration" className="w-full">
                            <SelectValue placeholder="Choose a duration" />
                          </SelectTrigger>
                          <SelectContent>
                            {DURATIONS.map((d) => (
                              <SelectItem key={d.value} value={d.value}>
                                {d.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1.5">
                        <Label>
                          Experience level <span className="text-rose-500">*</span>
                        </Label>
                        <RadioGroup
                          value={form.experienceLevel}
                          onValueChange={(v) =>
                            update("experienceLevel", v as ExperienceLevel)
                          }
                          className="grid grid-cols-3 gap-2"
                        >
                          {EXPERIENCE_LEVELS.map((l) => (
                            <Label
                              key={l.value}
                              htmlFor={l.value}
                              className={cn(
                                "cursor-pointer rounded-lg border p-2.5 flex flex-col gap-0.5 transition-colors",
                                form.experienceLevel === l.value
                                  ? "border-[#32504d] bg-[#32504d]/5"
                                  : "border-border hover:border-[#32504d]/40"
                              )}
                            >
                              <div className="flex items-center gap-1.5">
                                <RadioGroupItem
                                  id={l.value}
                                  value={l.value}
                                  className="sr-only"
                                />
                                <span className="text-xs font-semibold">
                                  {l.label}
                                </span>
                              </div>
                              <span className="text-[10px] text-muted-foreground leading-tight">
                                {l.desc}
                              </span>
                            </Label>
                          ))}
                        </RadioGroup>
                      </div>
                    </div>
                  )}

                  {/* STEP 2 — Requirements */}
                  {step === 2 && (
                    <div className="space-y-5">
                      <StepHeader
                        icon={ListChecks}
                        title="Requirements"
                        desc="Set the location, freelancer preferences, and extras."
                      />
                      <div className="space-y-1.5">
                        <Label>Location</Label>
                        <RadioGroup
                          value={form.location}
                          onValueChange={(v) =>
                            update("location", v as JobLocation)
                          }
                          className="grid sm:grid-cols-3 gap-2"
                        >
                          {(
                            [
                              { v: "Tunisia", l: "Tunisia", d: "Local talent only", i: Building2 },
                              { v: "Worldwide", l: "Worldwide", d: "Open globally", i: Globe },
                              { v: "Remote", l: "Remote", d: "Remote-first", i: Sparkles },
                            ] as const
                          ).map((o) => (
                            <Label
                              key={o.v}
                              htmlFor={o.v}
                              className={cn(
                                "cursor-pointer rounded-lg border p-2.5 flex flex-col gap-0.5 transition-colors",
                                form.location === o.v
                                  ? "border-[#32504d] bg-[#32504d]/5"
                                  : "border-border hover:border-[#32504d]/40"
                              )}
                            >
                              <div className="flex items-center gap-1.5">
                                <RadioGroupItem
                                  id={o.v}
                                  value={o.v}
                                  className="sr-only"
                                />
                                <o.i className="size-3.5 text-[#32504d]" />
                                <span className="text-xs font-semibold">
                                  {o.l}
                                </span>
                              </div>
                              <span className="text-[10px] text-muted-foreground leading-tight">
                                {o.d}
                              </span>
                            </Label>
                          ))}
                        </RadioGroup>
                      </div>
                      <div className="rounded-lg border border-border/70 p-3 flex items-start justify-between gap-3">
                        <div className="flex items-start gap-2.5">
                          <span className="size-8 rounded-lg bg-[#32504d]/10 flex items-center justify-center shrink-0">
                            <ShieldCheck className="size-4 text-[#32504d]" />
                          </span>
                          <div>
                            <p className="text-xs font-semibold">
                              Verified freelancers only
                            </p>
                            <p className="text-[11px] text-muted-foreground mt-0.5">
                              Only receive proposals from freelancers with a
                              verified identity, phone & portfolio.
                            </p>
                          </div>
                        </div>
                        <Switch
                          checked={form.verifiedOnly}
                          onCheckedChange={(c) => update("verifiedOnly", c)}
                          aria-label="Verified freelancers only"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="special">Special requirements</Label>
                        <Textarea
                          id="special"
                          value={form.specialRequirements}
                          onChange={(e) =>
                            update("specialRequirements", e.target.value)
                          }
                          placeholder="Optional — e.g. must speak French, available for daily standups, NDA required…"
                          rows={3}
                          maxLength={500}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label>Attachments</Label>
                        <div className="rounded-lg border-2 border-dashed border-border/70 hover:border-[#32504d]/40 transition-colors p-6 text-center">
                          <FileText className="size-6 mx-auto text-muted-foreground/60 mb-2" />
                          <p className="text-xs text-muted-foreground">
                            Drag &amp; drop files, or{" "}
                            <button
                              type="button"
                              onClick={() =>
                                toast.info("Attachments are coming soon")
                              }
                              className="text-[#32504d] hover:underline"
                            >
                              browse
                            </button>
                          </p>
                          <p className="text-[10px] text-muted-foreground/70 mt-1">
                            PDF, PNG, JPG, DOCX up to 20 MB
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* STEP 3 — Review & Publish */}
                  {step === 3 && (
                    <div className="space-y-5">
                      <StepHeader
                        icon={Rocket}
                        title="Review & Publish"
                        desc="Double-check everything before going live."
                      />
                      <div className="rounded-xl border border-border/70 overflow-hidden">
                        <div className="bg-khidma-gradient text-white px-4 py-3 flex items-center justify-between">
                          <div className="min-w-0">
                            <p className="text-[10px] uppercase tracking-wider text-white/70">
                              Job title
                            </p>
                            <h3 className="text-sm font-semibold truncate">
                              {form.title || "Untitled job"}
                            </h3>
                          </div>
                          <Badge className="bg-white/15 text-white border-0">
                            {form.type}
                          </Badge>
                        </div>
                        <dl className="divide-y divide-border/60 text-xs">
                          <SummaryRow
                            label="Category"
                            value={selectedCategory?.name ?? "—"}
                          />
                          <SummaryRow
                            label="Description"
                            value={
                              <p className="text-[11px] text-muted-foreground leading-relaxed line-clamp-3">
                                {form.description || "—"}
                              </p>
                            }
                          />
                          <SummaryRow
                            label="Skills"
                            value={
                              form.skills.length ? (
                                <div className="flex flex-wrap gap-1">
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
                                "—"
                              )
                            }
                          />
                          <SummaryRow
                            label="Budget"
                            value={
                              form.budgetMin || form.budgetMax
                                ? `${formatTND(Number(form.budgetMin) || 0)}${
                                    form.budgetMax
                                      ? " – " +
                                        formatTND(Number(form.budgetMax))
                                      : "+"
                                  }${form.type === "HOURLY" ? " /hr" : ""}`
                                : "—"
                            }
                          />
                          <SummaryRow
                            label="Duration"
                            value={
                              DURATIONS.find((d) => d.value === form.duration)
                                ?.label ?? "—"
                            }
                          />
                          <SummaryRow
                            label="Experience level"
                            value={form.experienceLevel}
                          />
                          <SummaryRow
                            label="Location"
                            value={form.location}
                          />
                          <SummaryRow
                            label="Verified only"
                            value={form.verifiedOnly ? "Yes" : "No"}
                          />
                          {form.specialRequirements && (
                            <SummaryRow
                              label="Special requirements"
                              value={
                                <p className="text-[11px] text-muted-foreground leading-relaxed line-clamp-3">
                                  {form.specialRequirements}
                                </p>
                              }
                            />
                          )}
                        </dl>
                      </div>
                      <div className="rounded-lg border border-[#32504d]/20 bg-[#32504d]/5 p-3 flex items-start gap-2.5">
                        <ShieldCheck className="size-4 text-[#32504d] shrink-0 mt-0.5" />
                        <p className="text-[11px] text-muted-foreground leading-relaxed">
                          By publishing, you agree to Khidma&apos;s terms.
                          Payments are protected by escrow — funds are released
                          only when you approve the work.
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
                    <Rocket className="size-3.5" /> Publish Job
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
      <span className="size-9 rounded-lg bg-[#32504d]/10 flex items-center justify-center shrink-0">
        <Icon className="size-4 text-[#32504d]" />
      </span>
      <div>
        <h3 className="text-sm font-semibold">{title}</h3>
        <p className="text-[11px] text-muted-foreground">{desc}</p>
      </div>
    </div>
  );
}

function RadioCard({
  value,
  current,
  icon: Icon,
  title,
  desc,
}: {
  value: string;
  current: string;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  desc: string;
}) {
  const active = value === current;
  return (
    <Label
      htmlFor={value}
      className={cn(
        "cursor-pointer rounded-lg border p-3 flex items-start gap-3 transition-colors",
        active
          ? "border-[#32504d] bg-[#32504d]/5"
          : "border-border hover:border-[#32504d]/40"
      )}
    >
      <RadioGroupItem id={value} value={value} className="sr-only" />
      <span
        className={cn(
          "size-9 rounded-lg flex items-center justify-center shrink-0",
          active ? "bg-[#32504d] text-white" : "bg-muted text-muted-foreground"
        )}
      >
        <Icon className="size-4" />
      </span>
      <div className="min-w-0">
        <p className="text-xs font-semibold">{title}</p>
        <p className="text-[11px] text-muted-foreground leading-tight mt-0.5">
          {desc}
        </p>
      </div>
    </Label>
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
