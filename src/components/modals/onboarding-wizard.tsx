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
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  User,
  Briefcase,
  Sparkles,
  Award,
  Image as ImageIcon,
  Camera,
  ShieldCheck,
  CheckCircle2,
  Plus,
  Trash2,
  Upload,
  X,
  Mail,
  Phone,
  IdCard,
  ArrowRight,
  ArrowLeft,
  Eye,
  Send,
  Globe,
  Code2,
  Star,
} from "lucide-react";
import { useApp } from "@/lib/store";
import { toast } from "sonner";
import { KhidmaLogo } from "@/components/khidma/logo";
import { categories } from "@/lib/khidma-data";
import { cn } from "@/lib/utils";

const TOTAL_STEPS = 8;

const stepMeta = [
  { name: "Personal Info", desc: "Tell us who you are", icon: User },
  { name: "Professional Info", desc: "Define your offer", icon: Briefcase },
  { name: "Skills", desc: "Pick your strengths", icon: Sparkles },
  { name: "Experience", desc: "Show your track record", icon: Award },
  { name: "Portfolio", desc: "Showcase your work", icon: ImageIcon },
  { name: "Profile Photo", desc: "Put a face to your name", icon: Camera },
  { name: "Verification", desc: "Confirm your identity", icon: ShieldCheck },
  { name: "Review & Submit", desc: "Final review", icon: CheckCircle2 },
];

const titleSuggestions = [
  "Full-Stack Web Developer",
  "Frontend Developer",
  "UI/UX Designer",
  "Brand Identity Designer",
  "Motion Designer",
  "Voice Over Artist",
  "3D Artist",
  "SEO Specialist",
];

interface ExpEntry {
  id: string;
  company: string;
  position: string;
  start: string;
  end: string;
  current: boolean;
  description: string;
  skills: string;
}

interface PortfolioEntry {
  id: string;
  title: string;
  category: string;
  type: "image" | "video" | "audio" | "url" | "github";
  description: string;
  skills: string;
  role: string;
  liveUrl: string;
  repoUrl: string;
}

const uid = () => Math.random().toString(36).slice(2, 9);

function SectionCard({
  title,
  desc,
  children,
  className,
}: {
  title?: string;
  desc?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("space-y-1.5", className)}>
      {title && (
        <div className="flex items-baseline justify-between">
          <h3 className="text-sm font-semibold text-foreground">{title}</h3>
          {desc && <span className="text-[11px] text-muted-foreground">{desc}</span>}
        </div>
      )}
      {children}
    </div>
  );
}

export function OnboardingWizard() {
  const {
    modal: { onboardingOpen, onboardingStep },
    closeOnboarding,
    setOnboardingStep,
    login,
  } = useApp();

  // Local form state
  const [step, setStep] = useState(onboardingStep);
  const [lastOnboardingOpen, setLastOnboardingOpen] = useState(onboardingOpen);
  const [lastOnboardingStep, setLastOnboardingStep] = useState(onboardingStep);
  // When the modal (re)opens, sync internal step with store (React 19 render-time adjustment)
  if (onboardingOpen !== lastOnboardingOpen) {
    setLastOnboardingOpen(onboardingOpen);
    if (onboardingOpen) {
      setStep(onboardingStep);
      setLastOnboardingStep(onboardingStep);
    }
  }
  // If onboardingStep changes externally while open, follow it
  if (onboardingOpen && onboardingStep !== lastOnboardingStep) {
    setLastOnboardingStep(onboardingStep);
    setStep(onboardingStep);
  }
  const [direction, setDirection] = useState<1 | -1>(1);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [verif, setVerif] = useState({ email: false, phone: false, identity: false });
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [showPreview, setShowPreview] = useState(false);

  const [personal, setPersonal] = useState({
    firstName: "",
    lastName: "",
    username: "",
    country: "Tunisia",
    city: "",
    phone: "",
    intro: "",
  });
  const [languages, setLanguages] = useState<string[]>(["Arabic", "French"]);
  const [langInput, setLangInput] = useState("");

  const [prof, setProf] = useState({
    title: "",
    bio: "",
    years: "1",
    categoryId: "",
    hourlyRate: "30",
    startingPrice: "100",
    availability: "available" as "available" | "limited" | "booked",
    responseTime: "~1 hour",
  });

  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [experiences, setExperiences] = useState<ExpEntry[]>([
    {
      id: uid(),
      company: "",
      position: "",
      start: "",
      end: "",
      current: false,
      description: "",
      skills: "",
    },
  ]);
  const [portfolio, setPortfolio] = useState<PortfolioEntry[]>([
    {
      id: uid(),
      title: "",
      category: "",
      type: "image",
      description: "",
      skills: "",
      role: "",
      liveUrl: "",
      repoUrl: "",
    },
  ]);

  // Lock scroll
  useEffect(() => {
    if (onboardingOpen) {
      const orig = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = orig;
      };
    }
  }, [onboardingOpen]);

  const goTo = (n: number) => {
    if (n < 0 || n >= TOTAL_STEPS) return;
    setDirection(n > step ? 1 : -1);
    setStep(n);
    setOnboardingStep(n);
  };

  const next = () => goTo(step + 1);
  const back = () => goTo(step - 1);

  const progressPct = useMemo(
    () => ((step + 1) / TOTAL_STEPS) * 100,
    [step]
  );

  if (!onboardingOpen) return null;

  const addLanguage = () => {
    const v = langInput.trim();
    if (v && !languages.includes(v)) {
      setLanguages([...languages, v]);
      setLangInput("");
    }
  };

  const toggleSkill = (skill: string) => {
    setSelectedSkills((s) =>
      s.includes(skill) ? s.filter((x) => x !== skill) : [...s, skill]
    );
  };

  const updateExp = (id: string, patch: Partial<ExpEntry>) =>
    setExperiences((arr) =>
      arr.map((e) => (e.id === id ? { ...e, ...patch } : e))
    );

  const updatePortfolio = (id: string, patch: Partial<PortfolioEntry>) =>
    setPortfolio((arr) =>
      arr.map((p) => (p.id === id ? { ...p, ...patch } : p))
    );

  const verifComplete =
    (verif.email ? 1 : 0) + (verif.phone ? 1 : 0) + (verif.identity ? 1 : 0);
  const verifPct = (verifComplete / 3) * 100;

  const handleSubmit = () => {
    const fullName =
      `${personal.firstName || "New"} ${personal.lastName || "Freelancer"}`.trim() ||
      "Khidma Freelancer";
    closeOnboarding();
    login(fullName, "freelancer");
    toast.success("Application submitted!", {
      description: "Admin will review within 48 hours.",
    });
  };

  const CurrentIcon = stepMeta[step].icon;

  return (
    <Dialog open={onboardingOpen} onOpenChange={(o) => !o && closeOnboarding()}>
      <DialogPortal>
        <DialogOverlay className="bg-[#192d2f]/70 backdrop-blur-sm" />
        <DialogContent
          className="p-0 gap-0 max-w-4xl w-[calc(100%-2rem)] max-h-[92vh] flex flex-col overflow-hidden"
          aria-describedby={undefined}
          showCloseButton
        >
          <DialogTitle className="sr-only">
            Freelancer onboarding — Step {step + 1} of {TOTAL_STEPS}
          </DialogTitle>
          <DialogDescription className="sr-only">
            {stepMeta[step].name}: {stepMeta[step].desc}
          </DialogDescription>

          {/* Header */}
          <div className="relative px-5 sm:px-7 py-4 border-b border-border/60 bg-card/60">
            <div className="flex items-center gap-3">
              <KhidmaLogo size="sm" showArabic={false} />
              <span className="text-[11px] text-muted-foreground hidden sm:inline">
                Freelancer Application
              </span>
              <div className="ml-auto flex items-center gap-2 text-xs">
                <span className="text-muted-foreground">
                  Step {step + 1} / {TOTAL_STEPS}
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-[#32504d]/10 text-[#32504d] px-2 py-0.5 text-[11px] font-semibold">
                  <CurrentIcon className="size-3" />
                  {stepMeta[step].name}
                </span>
              </div>
            </div>
            <div className="mt-3 space-y-1.5">
              <Progress
                value={progressPct}
                className="h-1.5 bg-muted [&>div]:bg-[#32504d]"
              />
              <p className="text-xs text-muted-foreground">{stepMeta[step].desc}</p>
            </div>
          </div>

          {/* Body — scrollable */}
          <div className="flex-1 overflow-y-auto px-5 sm:px-7 py-5 khidma-scroll">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={step}
                custom={direction}
                initial={{ opacity: 0, x: direction * 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: direction * -24 }}
                transition={{ duration: 0.25 }}
                className="space-y-5"
              >
                {/* === STEP 1: Personal Info === */}
                {step === 0 && (
                  <>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label htmlFor="ob-first">First name</Label>
                        <Input
                          id="ob-first"
                          placeholder="Amira"
                          value={personal.firstName}
                          onChange={(e) =>
                            setPersonal({ ...personal, firstName: e.target.value })
                          }
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="ob-last">Last name</Label>
                        <Input
                          id="ob-last"
                          placeholder="Ben Salah"
                          value={personal.lastName}
                          onChange={(e) =>
                            setPersonal({ ...personal, lastName: e.target.value })
                          }
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="ob-user">Username</Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground text-sm">
                          @
                        </span>
                        <Input
                          id="ob-user"
                          placeholder="amira.codes"
                          className="pl-7"
                          value={personal.username}
                          onChange={(e) =>
                            setPersonal({ ...personal, username: e.target.value })
                          }
                        />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label htmlFor="ob-country">Country</Label>
                        <Select
                          value={personal.country}
                          onValueChange={(v) =>
                            setPersonal({ ...personal, country: v })
                          }
                        >
                          <SelectTrigger id="ob-country">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {["Tunisia", "Morocco", "Algeria", "Egypt", "Other"].map(
                              (c) => (
                                <SelectItem key={c} value={c}>
                                  {c}
                                </SelectItem>
                              )
                            )}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="ob-city">City</Label>
                        <Input
                          id="ob-city"
                          placeholder="Tunis"
                          value={personal.city}
                          onChange={(e) =>
                            setPersonal({ ...personal, city: e.target.value })
                          }
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="ob-phone">Phone</Label>
                      <Input
                        id="ob-phone"
                        placeholder="+216 99 999 999"
                        value={personal.phone}
                        onChange={(e) =>
                          setPersonal({ ...personal, phone: e.target.value })
                        }
                      />
                    </div>

                    <div className="space-y-1.5">
                      <Label>Languages</Label>
                      <div className="flex flex-wrap gap-2 min-h-9 p-2 rounded-md border border-input bg-background">
                        {languages.map((l) => (
                          <Badge
                            key={l}
                            className="bg-[#32504d]/10 text-[#32504d] hover:bg-[#32504d]/20 gap-1"
                          >
                            {l}
                            <button
                              type="button"
                              onClick={() =>
                                setLanguages(languages.filter((x) => x !== l))
                              }
                              className="hover:text-rose-500"
                              aria-label={`Remove ${l}`}
                            >
                              <X className="size-3" />
                            </button>
                          </Badge>
                        ))}
                        <div className="flex items-center gap-1">
                          <Input
                            placeholder="Add language…"
                            value={langInput}
                            onChange={(e) => setLangInput(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault();
                                addLanguage();
                              }
                            }}
                            className="h-7 w-32 border-0 p-0 focus-visible:ring-0 text-xs"
                          />
                          <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            onClick={addLanguage}
                            className="h-7 px-2 text-[#32504d]"
                          >
                            <Plus className="size-3" />
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="ob-intro">Short intro</Label>
                      <Textarea
                        id="ob-intro"
                        rows={3}
                        placeholder="One sentence to introduce yourself…"
                        value={personal.intro}
                        onChange={(e) =>
                          setPersonal({ ...personal, intro: e.target.value })
                        }
                      />
                    </div>
                  </>
                )}

                {/* === STEP 2: Professional Info === */}
                {step === 1 && (
                  <>
                    <div className="space-y-1.5">
                      <Label htmlFor="ob-title">Professional title</Label>
                      <Input
                        id="ob-title"
                        placeholder="e.g. Full-Stack Web Developer"
                        value={prof.title}
                        onChange={(e) =>
                          setProf({ ...prof, title: e.target.value })
                        }
                      />
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {titleSuggestions.map((t) => (
                          <button
                            key={t}
                            type="button"
                            onClick={() => setProf({ ...prof, title: t })}
                            className="text-[11px] rounded-full border border-border bg-muted/40 px-2 py-0.5 hover:border-[#32504d]/40 hover:bg-[#32504d]/5"
                          >
                            {t}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <Label htmlFor="ob-bio">Bio</Label>
                      <Textarea
                        id="ob-bio"
                        rows={4}
                        placeholder="Describe your expertise, approach, and what makes you stand out…"
                        value={prof.bio}
                        onChange={(e) => setProf({ ...prof, bio: e.target.value })}
                      />
                    </div>

                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <Label htmlFor="ob-years">Years of experience</Label>
                        <Input
                          id="ob-years"
                          type="number"
                          min={0}
                          value={prof.years}
                          onChange={(e) =>
                            setProf({ ...prof, years: e.target.value })
                          }
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label>Primary category</Label>
                        <Select
                          value={prof.categoryId}
                          onValueChange={(v) =>
                            setProf({ ...prof, categoryId: v })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select category…" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((c) => (
                              <SelectItem key={c.id} value={c.id}>
                                {c.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-3 gap-4">
                      <div className="space-y-1.5">
                        <Label htmlFor="ob-rate">Hourly rate (TND)</Label>
                        <Input
                          id="ob-rate"
                          type="number"
                          min={0}
                          value={prof.hourlyRate}
                          onChange={(e) =>
                            setProf({ ...prof, hourlyRate: e.target.value })
                          }
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="ob-start">Starting price (TND)</Label>
                        <Input
                          id="ob-start"
                          type="number"
                          min={0}
                          value={prof.startingPrice}
                          onChange={(e) =>
                            setProf({ ...prof, startingPrice: e.target.value })
                          }
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="ob-resp">Response time</Label>
                        <Select
                          value={prof.responseTime}
                          onValueChange={(v) =>
                            setProf({ ...prof, responseTime: v })
                          }
                        >
                          <SelectTrigger id="ob-resp">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {["~1 hour", "~3 hours", "~12 hours", "~1 day"].map(
                              (r) => (
                                <SelectItem key={r} value={r}>
                                  {r}
                                </SelectItem>
                              )
                            )}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <Label>Availability</Label>
                      <RadioGroup
                        value={prof.availability}
                        onValueChange={(v) =>
                          setProf({
                            ...prof,
                            availability: v as typeof prof.availability,
                          })
                        }
                        className="grid grid-cols-3 gap-3"
                      >
                        {[
                          {
                            v: "available" as const,
                            l: "Available",
                            d: "Open to new work",
                          },
                          {
                            v: "limited" as const,
                            l: "Limited",
                            d: "Selective intake",
                          },
                          {
                            v: "booked" as const,
                            l: "Booked",
                            d: "Fully booked",
                          },
                        ].map((o) => (
                          <label
                            key={o.v}
                            className={cn(
                              "cursor-pointer rounded-lg border p-2.5 text-xs",
                              prof.availability === o.v
                                ? "border-[#32504d] bg-[#32504d]/5"
                                : "border-border"
                            )}
                          >
                            <div className="flex items-center gap-2">
                              <RadioGroupItem
                                value={o.v}
                                className="data-[state=checked]:border-[#32504d] data-[state=checked]:text-[#32504d]"
                              />
                              <span className="font-semibold">{o.l}</span>
                            </div>
                            <p className="text-[10px] text-muted-foreground mt-1">
                              {o.d}
                            </p>
                          </label>
                        ))}
                      </RadioGroup>
                    </div>
                  </>
                )}

                {/* === STEP 3: Skills === */}
                {step === 2 && (
                  <>
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-semibold">Pick your skills</h3>
                        <p className="text-[11px] text-muted-foreground">
                          Toggle the skills that reflect your expertise.
                        </p>
                      </div>
                      <Badge className="bg-[#32504d] text-white hover:bg-[#32504d]">
                        {selectedSkills.length} selected
                      </Badge>
                    </div>

                    <div className="space-y-4 max-h-[55vh] overflow-y-auto pr-1 khidma-scroll">
                      {categories.map((cat) => {
                        const Icon = cat.icon;
                        const pickedInCat = cat.skills.filter((s) =>
                          selectedSkills.includes(s)
                        ).length;
                        return (
                          <div
                            key={cat.id}
                            className="rounded-xl border border-border/70 p-3"
                          >
                            <div className="flex items-center gap-2 mb-2.5">
                              <span
                                className="size-7 rounded-md flex items-center justify-center text-white"
                                style={{ backgroundColor: cat.color }}
                              >
                                <Icon className="size-3.5" />
                              </span>
                              <span className="text-sm font-semibold">
                                {cat.name}
                              </span>
                              {pickedInCat > 0 && (
                                <Badge
                                  variant="outline"
                                  className="ml-auto text-[10px]"
                                >
                                  {pickedInCat}
                                </Badge>
                              )}
                            </div>
                            <div className="flex flex-wrap gap-1.5">
                              {cat.skills.map((skill) => {
                                const active = selectedSkills.includes(skill);
                                return (
                                  <button
                                    key={skill}
                                    type="button"
                                    onClick={() => toggleSkill(skill)}
                                    className={cn(
                                      "text-xs rounded-full border px-2.5 py-1 transition-colors",
                                      active
                                        ? "bg-[#32504d] border-[#32504d] text-white"
                                        : "bg-muted/40 border-border hover:border-[#32504d]/40 hover:bg-[#32504d]/5"
                                    )}
                                  >
                                    {active && (
                                      <CheckCircle2 className="size-2.5 inline mr-1" />
                                    )}
                                    {skill}
                                  </button>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </>
                )}

                {/* === STEP 4: Experience === */}
                {step === 3 && (
                  <>
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-semibold">Experience entries</h3>
                        <p className="text-[11px] text-muted-foreground">
                          Add positions you&apos;ve held that prove your expertise.
                        </p>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          setExperiences([
                            ...experiences,
                            {
                              id: uid(),
                              company: "",
                              position: "",
                              start: "",
                              end: "",
                              current: false,
                              description: "",
                              skills: "",
                            },
                          ])
                        }
                      >
                        <Plus className="size-3.5" /> Add entry
                      </Button>
                    </div>

                    <div className="space-y-3 max-h-[55vh] overflow-y-auto pr-1 khidma-scroll">
                      {experiences.map((e, idx) => (
                        <div
                          key={e.id}
                          className="rounded-xl border border-border/70 p-3 space-y-3 relative"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-semibold text-muted-foreground">
                              Entry {idx + 1}
                            </span>
                            {experiences.length > 1 && (
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-6 text-rose-500 hover:text-rose-600"
                                onClick={() =>
                                  setExperiences(experiences.filter((x) => x.id !== e.id))
                                }
                              >
                                <Trash2 className="size-3" /> Remove
                              </Button>
                            )}
                          </div>
                          <div className="grid sm:grid-cols-2 gap-3">
                            <div className="space-y-1">
                              <Label className="text-xs">Position</Label>
                              <Input
                                placeholder="Senior Frontend Developer"
                                value={e.position}
                                onChange={(ev) =>
                                  updateExp(e.id, { position: ev.target.value })
                                }
                              />
                            </div>
                            <div className="space-y-1">
                              <Label className="text-xs">Company</Label>
                              <Input
                                placeholder="Cassurea Technologies"
                                value={e.company}
                                onChange={(ev) =>
                                  updateExp(e.id, { company: ev.target.value })
                                }
                              />
                            </div>
                          </div>
                          <div className="grid sm:grid-cols-2 gap-3">
                            <div className="space-y-1">
                              <Label className="text-xs">Start date</Label>
                              <Input
                                type="month"
                                value={e.start}
                                onChange={(ev) =>
                                  updateExp(e.id, { start: ev.target.value })
                                }
                              />
                            </div>
                            <div className="space-y-1">
                              <Label className="text-xs">End date</Label>
                              <Input
                                type="month"
                                disabled={e.current}
                                value={e.end}
                                onChange={(ev) =>
                                  updateExp(e.id, { end: ev.target.value })
                                }
                              />
                            </div>
                          </div>
                          <label className="flex items-center gap-2 text-xs cursor-pointer">
                            <Checkbox
                              checked={e.current}
                              onCheckedChange={(c) =>
                                updateExp(e.id, { current: c === true })
                              }
                              className="data-[state=checked]:bg-[#2b3d3d] data-[state=checked]:border-[#2b3d3d]"
                            />
                            I currently work here
                          </label>
                          <div className="space-y-1">
                            <Label className="text-xs">Description</Label>
                            <Textarea
                              rows={2}
                              placeholder="What did you build or achieve…"
                              value={e.description}
                              onChange={(ev) =>
                                updateExp(e.id, { description: ev.target.value })
                              }
                            />
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs">Skills used</Label>
                            <Input
                              placeholder="Next.js, TypeScript, Stripe"
                              value={e.skills}
                              onChange={(ev) =>
                                updateExp(e.id, { skills: ev.target.value })
                              }
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {/* === STEP 5: Portfolio === */}
                {step === 4 && (
                  <>
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-sm font-semibold">Portfolio items</h3>
                        <p className="text-[11px] text-muted-foreground">
                          Showcase real work. Verified portfolios rank higher in search.
                        </p>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          setPortfolio([
                            ...portfolio,
                            {
                              id: uid(),
                              title: "",
                              category: "",
                              type: "image",
                              description: "",
                              skills: "",
                              role: "",
                              liveUrl: "",
                              repoUrl: "",
                            },
                          ])
                        }
                      >
                        <Plus className="size-3.5" /> Add project
                      </Button>
                    </div>

                    <div className="space-y-3 max-h-[55vh] overflow-y-auto pr-1 khidma-scroll">
                      {portfolio.map((p, idx) => (
                        <div
                          key={p.id}
                          className="rounded-xl border border-border/70 p-3 space-y-3"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-semibold text-muted-foreground">
                              Project {idx + 1}
                            </span>
                            {portfolio.length > 1 && (
                              <Button
                                size="sm"
                                variant="ghost"
                                className="h-6 text-rose-500 hover:text-rose-600"
                                onClick={() =>
                                  setPortfolio(portfolio.filter((x) => x.id !== p.id))
                                }
                              >
                                <Trash2 className="size-3" /> Remove
                              </Button>
                            )}
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs">Title</Label>
                            <Input
                              placeholder="Luxury Real Estate Landing Page"
                              value={p.title}
                              onChange={(ev) =>
                                updatePortfolio(p.id, { title: ev.target.value })
                              }
                            />
                          </div>
                          <div className="grid sm:grid-cols-2 gap-3">
                            <div className="space-y-1">
                              <Label className="text-xs">Category</Label>
                              <Input
                                placeholder="Web Development"
                                value={p.category}
                                onChange={(ev) =>
                                  updatePortfolio(p.id, { category: ev.target.value })
                                }
                              />
                            </div>
                            <div className="space-y-1">
                              <Label className="text-xs">Type</Label>
                              <Select
                                value={p.type}
                                onValueChange={(v) =>
                                  updatePortfolio(p.id, {
                                    type: v as PortfolioEntry["type"],
                                  })
                                }
                              >
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {["image", "video", "audio", "url", "github"].map(
                                    (t) => (
                                      <SelectItem key={t} value={t}>
                                        {t}
                                      </SelectItem>
                                    )
                                  )}
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                          <div className="space-y-1">
                            <Label className="text-xs">Description</Label>
                            <Textarea
                              rows={2}
                              placeholder="What you built, results achieved…"
                              value={p.description}
                              onChange={(ev) =>
                                updatePortfolio(p.id, {
                                  description: ev.target.value,
                                })
                              }
                            />
                          </div>
                          <div className="grid sm:grid-cols-2 gap-3">
                            <div className="space-y-1">
                              <Label className="text-xs">Your role</Label>
                              <Input
                                placeholder="Lead Engineer"
                                value={p.role}
                                onChange={(ev) =>
                                  updatePortfolio(p.id, { role: ev.target.value })
                                }
                              />
                            </div>
                            <div className="space-y-1">
                              <Label className="text-xs">Skills used</Label>
                              <Input
                                placeholder="Next.js, GSAP"
                                value={p.skills}
                                onChange={(ev) =>
                                  updatePortfolio(p.id, { skills: ev.target.value })
                                }
                              />
                            </div>
                          </div>
                          <div className="grid sm:grid-cols-2 gap-3">
                            <div className="space-y-1">
                              <Label className="text-xs">Live URL</Label>
                              <Input
                                placeholder="https://…"
                                value={p.liveUrl}
                                onChange={(ev) =>
                                  updatePortfolio(p.id, { liveUrl: ev.target.value })
                                }
                              />
                            </div>
                            <div className="space-y-1">
                              <Label className="text-xs">Repository URL</Label>
                              <Input
                                placeholder="https://github.com/…"
                                value={p.repoUrl}
                                onChange={(ev) =>
                                  updatePortfolio(p.id, { repoUrl: ev.target.value })
                                }
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}

                {/* === STEP 6: Profile Photo === */}
                {step === 5 && (
                  <div className="space-y-5">
                    <SectionCard
                      title="Upload your photo"
                      desc="A clear, friendly photo builds trust. JPG/PNG, max 5MB."
                    >
                      <label
                        htmlFor="photo-input"
                        className="block cursor-pointer"
                      >
                        <div
                          className={cn(
                            "rounded-2xl border-2 border-dashed p-8 flex flex-col items-center justify-center gap-3 transition-colors",
                            photoPreview
                              ? "border-[#32504d]/40 bg-[#32504d]/5"
                              : "border-border hover:border-[#32504d]/40 hover:bg-[#32504d]/5"
                          )}
                        >
                          {photoPreview ? (
                            <div className="relative size-28 rounded-full overflow-hidden ring-2 ring-[#32504d]/30">
                              <img
                                src={photoPreview}
                                alt="Profile preview"
                                className="size-full object-cover"
                              />
                            </div>
                          ) : (
                            <div className="size-20 rounded-full bg-[#32504d]/10 flex items-center justify-center">
                              <Upload className="size-7 text-[#32504d]" />
                            </div>
                          )}
                          <div className="text-center">
                            <p className="text-sm font-semibold">
                              {photoPreview ? "Photo added" : "Click to upload"}
                            </p>
                            <p className="text-[11px] text-muted-foreground">
                              Drag & drop or click — visual preview only
                            </p>
                          </div>
                        </div>
                        <input
                          id="photo-input"
                          type="file"
                          accept="image/*"
                          className="sr-only"
                          onChange={(e) => {
                            const f = e.target.files?.[0];
                            if (f) setPhotoPreview(URL.createObjectURL(f));
                          }}
                        />
                      </label>
                      {photoPreview && (
                        <div className="flex gap-2 mt-3">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() =>
                              document.getElementById("photo-input")?.click()
                            }
                          >
                            <Upload className="size-3.5" /> Replace
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="text-rose-500 hover:text-rose-600"
                            onClick={() => setPhotoPreview(null)}
                          >
                            <Trash2 className="size-3.5" /> Remove
                          </Button>
                        </div>
                      )}
                    </SectionCard>
                    <div className="rounded-xl bg-muted/40 border border-border/60 p-3 text-xs text-muted-foreground">
                      <p className="font-medium text-foreground mb-1">Photo tips</p>
                      <ul className="list-disc pl-4 space-y-0.5">
                        <li>Faces must be clearly visible — no sunglasses</li>
                        <li>Use a neutral background and natural lighting</li>
                        <li>Square aspect ratio works best (1:1)</li>
                      </ul>
                    </div>
                  </div>
                )}

                {/* === STEP 7: Verification === */}
                {step === 6 && (
                  <div className="space-y-5">
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-semibold">
                          Verification progress
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {verifComplete}/3 complete
                        </span>
                      </div>
                      <Progress
                        value={verifPct}
                        className="h-2 [&>div]:bg-[#32504d]"
                      />
                    </div>

                    <div className="space-y-3">
                      {/* Email verification */}
                      <div className="rounded-xl border border-border/70 p-3.5 flex items-start gap-3">
                        <span className="size-9 rounded-lg bg-[#32504d]/10 flex items-center justify-center shrink-0">
                          <Mail className="size-4 text-[#32504d]" />
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-semibold">Email verification</p>
                            {verif.email && (
                              <Badge className="bg-[#32504d]/10 text-[#32504d] gap-0.5">
                                <CheckCircle2 className="size-3" />
                                Verified
                              </Badge>
                            )}
                          </div>
                          <p className="text-[11px] text-muted-foreground mt-0.5">
                            Confirm your email to enable account recovery.
                          </p>
                          <Button
                            size="sm"
                            variant={verif.email ? "ghost" : "outline"}
                            className="mt-2"
                            disabled={verif.email}
                            onClick={() => setVerif((v) => ({ ...v, email: true }))}
                          >
                            {verif.email ? "Done" : "Verify now"}
                          </Button>
                        </div>
                      </div>

                      {/* Phone (OTP) */}
                      <div className="rounded-xl border border-border/70 p-3.5 flex items-start gap-3">
                        <span className="size-9 rounded-lg bg-[#475959]/10 flex items-center justify-center shrink-0">
                          <Phone className="size-4 text-[#475959]" />
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-semibold">Phone (OTP)</p>
                            {verif.phone && (
                              <Badge className="bg-[#32504d]/10 text-[#32504d] gap-0.5">
                                <CheckCircle2 className="size-3" />
                                Verified
                              </Badge>
                            )}
                          </div>
                          <p className="text-[11px] text-muted-foreground mt-0.5">
                            We&apos;ll text a 6-digit code to your number.
                          </p>
                          {!verif.phone && otpSent && (
                            <div className="mt-2 space-y-2">
                              <Input
                                placeholder="Enter 6-digit code (try 123456)"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                className="h-9"
                              />
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  if (otp === "123456") {
                                    setVerif((v) => ({ ...v, phone: true }));
                                    setOtp("");
                                  } else {
                                    toast.error("Wrong code — try 123456");
                                  }
                                }}
                              >
                                Confirm code
                              </Button>
                            </div>
                          )}
                          {!verif.phone && !otpSent && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="mt-2"
                              onClick={() => {
                                setOtpSent(true);
                                toast.success("Demo OTP sent: 123456");
                              }}
                            >
                              Send OTP
                            </Button>
                          )}
                        </div>
                      </div>

                      {/* Identity upload */}
                      <div className="rounded-xl border border-border/70 p-3.5 flex items-start gap-3">
                        <span className="size-9 rounded-lg bg-[#2b3d3d]/10 flex items-center justify-center shrink-0">
                          <IdCard className="size-4 text-[#2b3d3d]" />
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-semibold">
                              Identity verification
                            </p>
                            {verif.identity && (
                              <Badge className="bg-[#32504d]/10 text-[#32504d] gap-0.5">
                                <CheckCircle2 className="size-3" />
                                Uploaded
                              </Badge>
                            )}
                          </div>
                          <p className="text-[11px] text-muted-foreground mt-0.5">
                            Upload your CIN or passport (visual demo only).
                          </p>
                          <label
                            htmlFor="id-input"
                            className="inline-flex items-center gap-1.5 mt-2 text-xs rounded-md border border-input bg-background px-3 h-8 cursor-pointer hover:bg-muted/40"
                          >
                            <Upload className="size-3" /> Upload document
                          </label>
                          <input
                            id="id-input"
                            type="file"
                            className="sr-only"
                            onChange={() => setVerif((v) => ({ ...v, identity: true }))}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* === STEP 8: Review & Submit === */}
                {step === 7 && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <h3 className="text-sm font-semibold">Review your application</h3>
                        <p className="text-[11px] text-muted-foreground">
                          Make sure everything looks good — you can edit any step
                          before submitting.
                        </p>
                      </div>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setShowPreview((s) => !s)}
                      >
                        <Eye className="size-3.5" />
                        {showPreview ? "Hide preview" : "Preview public profile"}
                      </Button>
                    </div>

                    <AnimatePresence>
                      {showPreview && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="rounded-xl border border-[#32504d]/30 bg-gradient-to-br from-[#32504d]/5 to-transparent p-4"
                        >
                          <div className="flex items-center gap-3">
                            {photoPreview ? (
                              <img
                                src={photoPreview}
                                alt="Profile preview"
                                className="size-14 rounded-full object-cover ring-2 ring-[#32504d]/30"
                              />
                            ) : (
                              <div className="size-14 rounded-full bg-[#32504d]/20 flex items-center justify-center text-[#32504d]">
                                <User className="size-5" />
                              </div>
                            )}
                            <div>
                              <p className="font-semibold">
                                {personal.firstName || "New"}{" "}
                                {personal.lastName || "Freelancer"}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {prof.title || "Your professional title"}
                              </p>
                              <p className="text-[11px] text-muted-foreground">
                                @{personal.username || "username"} ·{" "}
                                {personal.city || "Tunis"}, {personal.country}
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    <div className="grid sm:grid-cols-2 gap-3">
                      <SectionCard title="Personal">
                        <ul className="text-xs text-muted-foreground space-y-1">
                          <li>
                            <span className="text-foreground font-medium">Name:</span>{" "}
                            {personal.firstName || "—"} {personal.lastName}
                          </li>
                          <li>
                            <span className="text-foreground font-medium">
                              Username:
                            </span>{" "}
                            @{personal.username || "—"}
                          </li>
                          <li>
                            <span className="text-foreground font-medium">
                              Location:
                            </span>{" "}
                            {personal.city || "—"}, {personal.country}
                          </li>
                          <li>
                            <span className="text-foreground font-medium">
                              Phone:
                            </span>{" "}
                            {personal.phone || "—"}
                          </li>
                          <li>
                            <span className="text-foreground font-medium">
                              Languages:
                            </span>{" "}
                            {languages.join(", ") || "—"}
                          </li>
                        </ul>
                      </SectionCard>

                      <SectionCard title="Professional">
                        <ul className="text-xs text-muted-foreground space-y-1">
                          <li>
                            <span className="text-foreground font-medium">
                              Title:
                            </span>{" "}
                            {prof.title || "—"}
                          </li>
                          <li>
                            <span className="text-foreground font-medium">
                              Category:
                            </span>{" "}
                            {categories.find((c) => c.id === prof.categoryId)?.name ||
                              "—"}
                          </li>
                          <li>
                            <span className="text-foreground font-medium">
                              Experience:
                            </span>{" "}
                            {prof.years}y
                          </li>
                          <li>
                            <span className="text-foreground font-medium">
                              Hourly:
                            </span>{" "}
                            {prof.hourlyRate} TND
                          </li>
                          <li>
                            <span className="text-foreground font-medium">
                              Starting:
                            </span>{" "}
                            {prof.startingPrice} TND
                          </li>
                          <li>
                            <span className="text-foreground font-medium">
                              Availability:
                            </span>{" "}
                            {prof.availability}
                          </li>
                        </ul>
                      </SectionCard>

                      <SectionCard title={`Skills (${selectedSkills.length})`}>
                        {selectedSkills.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {selectedSkills.map((s) => (
                              <Badge
                                key={s}
                                variant="outline"
                                className="bg-[#32504d]/5 text-[#32504d] text-[10px]"
                              >
                                {s}
                              </Badge>
                            ))}
                          </div>
                        ) : (
                          <p className="text-xs text-muted-foreground">None selected</p>
                        )}
                      </SectionCard>

                      <SectionCard title={`Experience (${experiences.filter((e) => e.position || e.company).length})`}>
                        {experiences.filter((e) => e.position || e.company).length === 0 ? (
                          <p className="text-xs text-muted-foreground">None added</p>
                        ) : (
                          <ul className="text-xs space-y-1">
                            {experiences
                              .filter((e) => e.position || e.company)
                              .map((e, i) => (
                                <li key={e.id} className="text-muted-foreground">
                                  <span className="text-foreground font-medium">
                                    {e.position || "—"}
                                  </span>{" "}
                                  @ {e.company || "—"}
                                  <span className="text-[10px] ml-1">#{i + 1}</span>
                                </li>
                              ))}
                          </ul>
                        )}
                      </SectionCard>

                      <SectionCard title={`Portfolio (${portfolio.filter((p) => p.title).length})`}>
                        {portfolio.filter((p) => p.title).length === 0 ? (
                          <p className="text-xs text-muted-foreground">None added</p>
                        ) : (
                          <ul className="text-xs space-y-1">
                            {portfolio
                              .filter((p) => p.title)
                              .map((p) => (
                                <li key={p.id} className="text-foreground">
                                  {p.title}{" "}
                                  <span className="text-muted-foreground">
                                    ({p.type})
                                  </span>
                                </li>
                              ))}
                          </ul>
                        )}
                      </SectionCard>

                      <SectionCard title="Verification">
                        <ul className="text-xs space-y-1">
                          <li>
                            Email:{" "}
                            {verif.email ? (
                              <span className="text-[#32504d]">✓ verified</span>
                            ) : (
                              <span className="text-muted-foreground">pending</span>
                            )}
                          </li>
                          <li>
                            Phone:{" "}
                            {verif.phone ? (
                              <span className="text-[#32504d]">✓ verified</span>
                            ) : (
                              <span className="text-muted-foreground">pending</span>
                            )}
                          </li>
                          <li>
                            Identity:{" "}
                            {verif.identity ? (
                              <span className="text-[#32504d]">✓ uploaded</span>
                            ) : (
                              <span className="text-muted-foreground">pending</span>
                            )}
                          </li>
                        </ul>
                      </SectionCard>
                    </div>

                    <div className="rounded-xl border border-border bg-muted/30 p-3 flex gap-2.5">
                      <Sparkles className="size-4 text-[#32504d] shrink-0 mt-0.5" />
                      <p className="text-xs text-muted-foreground">
                        By submitting, you confirm the information above is accurate.
                        Our admin team reviews applications within 48 hours. Verified
                        freelancers get a Top Rated badge and priority placement.
                      </p>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Sticky footer */}
          <div className="border-t border-border/60 bg-card/60 px-5 sm:px-7 py-3 flex flex-col sm:flex-row items-center gap-2 sm:gap-3">
            <Button
              size="sm"
              variant="ghost"
              className="text-muted-foreground w-full sm:w-auto sm:mr-auto"
              onClick={() => {
                closeOnboarding();
                toast.info("Progress saved — resume anytime from your dashboard.");
              }}
            >
              Save & continue later
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="w-full sm:w-auto"
              onClick={back}
              disabled={step === 0}
            >
              <ArrowLeft className="size-3.5" /> Back
            </Button>
            {step < TOTAL_STEPS - 1 ? (
              <Button
                size="sm"
                className="w-full sm:w-auto bg-[#2b3d3d] hover:bg-[#192d2f] text-white"
                onClick={next}
              >
                Next <ArrowRight className="size-3.5" />
              </Button>
            ) : (
              <Button
                size="sm"
                className="w-full sm:w-auto bg-[#32504d] hover:bg-[#2b3d3d] text-white"
                onClick={handleSubmit}
              >
                <Send className="size-3.5" /> Submit for Review
              </Button>
            )}
          </div>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}
