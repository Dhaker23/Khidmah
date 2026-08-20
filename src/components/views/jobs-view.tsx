"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Search,
  SlidersHorizontal,
  RotateCcw,
  X,
  Briefcase,
  ShieldCheck,
  Wallet,
  Users,
  MapPin,
  ChevronDown,
  Globe,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { jobs, categories, formatTND, type Job } from "@/lib/khidma-data";
import { JobCard } from "@/components/khidma/job-card";
import { useApp } from "@/lib/store";
import { cn } from "@/lib/utils";

/* ---------- types & constants ---------- */

type SortKey =
  | "newest"
  | "oldest"
  | "budgetHigh"
  | "mostProposals"
  | "leastProposals";

type JobTypeFilter = "any" | "FIXED" | "HOURLY";
type ExpLevelFilter = "any" | "Entry" | "Intermediate" | "Expert";
type LocationFilter = "any" | "Tunisia" | "Worldwide" | "Remote";

interface FilterState {
  search: string;
  jobType: JobTypeFilter;
  expLevel: ExpLevelFilter;
  budgetRange: [number, number];
  categoryIds: string[];
  location: LocationFilter;
  verifiedOnly: boolean;
}

const BUDGET_MIN = 0;
const BUDGET_MAX = 2000;
const BUDGET_STEP = 50;

const DEFAULT_FILTERS: FilterState = {
  search: "",
  jobType: "any",
  expLevel: "any",
  budgetRange: [BUDGET_MIN, BUDGET_MAX],
  categoryIds: [],
  location: "any",
  verifiedOnly: false,
};

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: "newest", label: "Newest first" },
  { key: "oldest", label: "Oldest first" },
  { key: "budgetHigh", label: "Budget: High → Low" },
  { key: "mostProposals", label: "Most proposals" },
  { key: "leastProposals", label: "Least proposals" },
];

const JOB_CATEGORY_TO_ID: Record<string, string> = {
  "Web Development": "development",
  "Brand Identity": "design",
  "UI/UX Design": "design",
  "Motion Graphics": "video",
  "Video Editing": "video",
  "Voice Over": "audio",
  Writing: "writing",
  Translation: "translation",
  Marketing: "marketing",
  Photography: "photography",
  "3D Art": "3d",
  "3D Modeling": "3d",
  "3D Rendering": "3d",
  Business: "business",
  "AI Services": "ai",
};

/* ---------- helpers ---------- */

function applyFilters(list: Job[], f: FilterState): Job[] {
  const q = f.search.trim().toLowerCase();
  return list.filter((j) => {
    if (q) {
      const hay = `${j.title} ${j.description} ${j.category} ${j.skills.join(" ")} ${j.postedBy}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    if (f.jobType !== "any" && j.type !== f.jobType) return false;
    if (f.expLevel !== "any" && j.experienceLevel !== f.expLevel) return false;
    // budget range (use max of the budget)
    const maxBudget = Math.max(j.budget.min, j.budget.max);
    const minBudget = Math.min(j.budget.min, j.budget.max);
    if (maxBudget < f.budgetRange[0] || minBudget > f.budgetRange[1]) return false;
    if (f.categoryIds.length > 0) {
      const catId = JOB_CATEGORY_TO_ID[j.category] ?? "";
      if (!f.categoryIds.includes(catId)) return false;
    }
    if (f.location !== "any" && j.location !== f.location) return false;
    if (f.verifiedOnly && !j.verifiedClient) return false;
    return true;
  });
}

function sortJobs(list: Job[], key: SortKey): Job[] {
  const copy = [...list];
  switch (key) {
    case "newest":
      return copy.sort((a, b) => a.postedAt.localeCompare(b.postedAt));
    case "oldest":
      return copy.sort((a, b) => b.postedAt.localeCompare(a.postedAt));
    case "budgetHigh":
      return copy.sort((a, b) => b.budget.max - a.budget.max);
    case "mostProposals":
      return copy.sort((a, b) => b.proposals - a.proposals);
    case "leastProposals":
      return copy.sort((a, b) => a.proposals - b.proposals);
    default:
      return copy;
  }
}

/* ---------- filter panel ---------- */

function FilterSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-3">
      <h4 className="text-xs font-semibold uppercase tracking-[0.15em] text-[#748684]">
        {title}
      </h4>
      {children}
    </div>
  );
}

interface FiltersPanelProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  onClear: () => void;
}

function FiltersPanel({ filters, setFilters, onClear }: FiltersPanelProps) {
  const toggleCategory = (id: string) => {
    setFilters((p) => {
      const arr = p.categoryIds;
      const next = arr.includes(id) ? arr.filter((v) => v !== id) : [...arr, id];
      return { ...p, categoryIds: next };
    });
  };

  const activeFilterCount =
    (filters.jobType !== "any" ? 1 : 0) +
    (filters.expLevel !== "any" ? 1 : 0) +
    (filters.location !== "any" ? 1 : 0) +
    (filters.verifiedOnly ? 1 : 0) +
    (filters.categoryIds.length > 0 ? 1 : 0) +
    (filters.budgetRange[0] !== BUDGET_MIN || filters.budgetRange[1] !== BUDGET_MAX ? 1 : 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="size-4 text-[#32504d] dark:text-[#9bb3ae]" />
          <span className="font-display text-sm font-semibold">Filters</span>
          {activeFilterCount > 0 && (
            <Badge className="bg-[#32504d] text-white hover:bg-[#32504d] text-[10px] h-5 px-1.5">
              {activeFilterCount}
            </Badge>
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClear}
          disabled={activeFilterCount === 0}
          className="h-7 text-xs text-muted-foreground hover:text-[#32504d] dark:text-[#9bb3ae]"
        >
          <RotateCcw className="size-3" />
          Clear all
        </Button>
      </div>

      <Separator />

      {/* job type */}
      <FilterSection title="Job Type">
        <RadioGroup
          value={filters.jobType}
          onValueChange={(v) =>
            setFilters((p) => ({ ...p, jobType: v as JobTypeFilter }))
          }
          className="gap-2"
        >
          {[
            { value: "any", label: "Any type" },
            { value: "FIXED", label: "Fixed price" },
            { value: "HOURLY", label: "Hourly rate" },
          ].map((opt) => (
            <label
              key={opt.value}
              className="flex items-center gap-2.5 cursor-pointer text-sm"
            >
              <RadioGroupItem
                value={opt.value}
                className="border-[#748684] data-[state=checked]:border-[#32504d] text-[#32504d] dark:text-[#9bb3ae]"
              />
              {opt.label}
            </label>
          ))}
        </RadioGroup>
      </FilterSection>

      <Separator />

      {/* experience level */}
      <FilterSection title="Experience Level">
        <RadioGroup
          value={filters.expLevel}
          onValueChange={(v) =>
            setFilters((p) => ({ ...p, expLevel: v as ExpLevelFilter }))
          }
          className="gap-2"
        >
          {[
            { value: "any", label: "Any level" },
            { value: "Entry", label: "Entry level" },
            { value: "Intermediate", label: "Intermediate" },
            { value: "Expert", label: "Expert" },
          ].map((opt) => (
            <label
              key={opt.value}
              className="flex items-center gap-2.5 cursor-pointer text-sm"
            >
              <RadioGroupItem
                value={opt.value}
                className="border-[#748684] data-[state=checked]:border-[#32504d] text-[#32504d] dark:text-[#9bb3ae]"
              />
              {opt.label}
            </label>
          ))}
        </RadioGroup>
      </FilterSection>

      <Separator />

      {/* budget */}
      <FilterSection title="Budget (TND)">
        <div className="px-1">
          <Slider
            value={filters.budgetRange}
            min={BUDGET_MIN}
            max={BUDGET_MAX}
            step={BUDGET_STEP}
            onValueChange={(v) =>
              setFilters((p) => ({
                ...p,
                budgetRange: [v[0] ?? BUDGET_MIN, v[1] ?? BUDGET_MAX],
              }))
            }
            className="[&_span[data-slot=slider-range]]:bg-[#32504d] [&_span[data-slot=slider-thumb]]:border-[#32504d]"
          />
          <div className="flex items-center justify-between mt-3 text-xs">
            <span className="font-medium">{formatTND(filters.budgetRange[0])}</span>
            <span className="text-muted-foreground">to</span>
            <span className="font-medium">{formatTND(filters.budgetRange[1])}</span>
          </div>
        </div>
      </FilterSection>

      <Separator />

      {/* category */}
      <FilterSection title="Category">
        <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
          {categories.map((cat) => {
            const checked = filters.categoryIds.includes(cat.id);
            return (
              <label
                key={cat.id}
                className="flex items-center gap-2.5 cursor-pointer group"
              >
                <Checkbox
                  checked={checked}
                  onCheckedChange={() => toggleCategory(cat.id)}
                  className="data-[state=checked]:bg-[#32504d] data-[state=checked]:border-[#32504d]"
                />
                <span className="text-sm flex-1 group-hover:text-[#2b3d3d] dark:text-[#94a8a4]">
                  {cat.name}
                </span>
              </label>
            );
          })}
        </div>
      </FilterSection>

      <Separator />

      {/* location */}
      <FilterSection title="Location">
        <Select
          value={filters.location}
          onValueChange={(v) =>
            setFilters((p) => ({ ...p, location: v as LocationFilter }))
          }
        >
          <SelectTrigger className="w-full h-9 text-sm">
            <SelectValue placeholder="Any location" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="any">Any location</SelectItem>
            <SelectItem value="Tunisia">Tunisia</SelectItem>
            <SelectItem value="Worldwide">Worldwide</SelectItem>
            <SelectItem value="Remote">Remote</SelectItem>
          </SelectContent>
        </Select>
      </FilterSection>

      <Separator />

      {/* verified client */}
      <FilterSection title="Client Trust">
        <label className="flex items-center justify-between gap-3 cursor-pointer">
          <div className="flex items-start gap-2.5">
            <ShieldCheck className="size-4 text-[#32504d] dark:text-[#9bb3ae] mt-0.5" />
            <div>
              <div className="text-sm font-medium">Verified clients only</div>
              <div className="text-xs text-muted-foreground">
                Show jobs posted by verified businesses only
              </div>
            </div>
          </div>
          <Switch
            checked={filters.verifiedOnly}
            onCheckedChange={(c) =>
              setFilters((p) => ({ ...p, verifiedOnly: c }))
            }
            className="data-[state=checked]:bg-[#32504d]"
          />
        </label>
      </FilterSection>
    </div>
  );
}

/* ---------- empty state + skeleton ---------- */

function EmptyState({ onClear }: { onClear: () => void }) {
  return (
    <Card className="p-12 text-center border-dashed">
      <div className="size-16 rounded-full bg-[#32504d]/10 dark:bg-[#32504d]/20 mx-auto flex items-center justify-center">
        <Briefcase className="size-8 text-[#32504d] dark:text-[#9bb3ae]" />
      </div>
      <h3 className="font-display text-lg font-semibold mt-4 text-foreground">
        No open jobs match your filters
      </h3>
      <p className="text-muted-foreground text-sm mt-2 max-w-md mx-auto">
        Try widening your budget, switching location, or clearing filters
        to see more opportunities.
      </p>
      <Button variant="outline" className="mt-5" onClick={onClear}>
        <RotateCcw className="size-4" />
        Clear all filters
      </Button>
    </Card>
  );
}

function JobSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("rounded-xl border border-border/60 p-5", className)}>
      <div className="flex items-center gap-2 mb-3">
        <div className="h-5 w-20 bg-muted shimmer rounded" />
        <div className="h-5 w-16 bg-muted shimmer rounded" />
      </div>
      <div className="h-4 w-3/4 bg-muted shimmer rounded mb-2" />
      <div className="h-3 w-full bg-muted shimmer rounded mb-1" />
      <div className="h-3 w-5/6 bg-muted shimmer rounded" />
      <div className="h-2.5 w-1/2 bg-muted shimmer rounded mt-4" />
    </div>
  );
}

/* ---------- main view ---------- */

export function JobsView() {
  const { setView } = useApp();
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [sort, setSort] = useState<SortKey>("newest");
  const [sheetOpen, setSheetOpen] = useState(false);

  const filtered = useMemo(() => applyFilters(jobs, filters), [filters]);
  const sorted = useMemo(() => sortJobs(filtered, sort), [filtered, sort]);

  const clearFilters = () => {
    setFilters(DEFAULT_FILTERS);
  };

  const sortLabel = SORT_OPTIONS.find((s) => s.key === sort)?.label ?? "Sort";

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-8 sm:mb-10"
      >
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setView("home")}
          className="mb-4 text-muted-foreground hover:text-[#2b3d3d] dark:text-[#94a8a4] -ml-2"
        >
          <ArrowLeft className="size-4" />
          Back to home
        </Button>
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#748684]">
              Job Board
            </span>
            <h1 className="mt-2 font-display text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
              Find Work
            </h1>
            <p className="mt-2 text-sm sm:text-base text-muted-foreground">
              Browse open projects from verified clients
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Briefcase className="size-4 text-[#32504d] dark:text-[#9bb3ae]" />
            <span>
              <span className="font-semibold text-foreground">
                {sorted.length}
              </span>{" "}
              open {sorted.length === 1 ? "job" : "jobs"}
            </span>
          </div>
        </div>
      </motion.div>

      {/* mobile search + filters trigger */}
      <div className="lg:hidden mb-4 flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            value={filters.search}
            onChange={(e) =>
              setFilters((p) => ({ ...p, search: e.target.value }))
            }
            placeholder="Search jobs, skills, clients…"
            className="pl-9 h-10"
          />
          {filters.search && (
            <button
              onClick={() => setFilters((p) => ({ ...p, search: "" }))}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              aria-label="Clear search"
            >
              <X className="size-4" />
            </button>
          )}
        </div>
        <Sheet open={sheetOpen} onOpenChange={setSheetOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="h-10 w-10 shrink-0">
              <SlidersHorizontal className="size-4" />
            </Button>
          </SheetTrigger>
          <SheetContent
            side="left"
            className="w-[88%] sm:max-w-md overflow-y-auto p-4"
          >
            <SheetHeader>
              <SheetTitle className="font-display">Filter Jobs</SheetTitle>
              <SheetDescription>
                Find the perfect project to apply for.
              </SheetDescription>
            </SheetHeader>
            <div className="mt-2">
              <FiltersPanel
                filters={filters}
                setFilters={setFilters}
                onClear={() => {
                  clearFilters();
                  setSheetOpen(false);
                }}
              />
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-6 lg:gap-8">
        {/* desktop sidebar */}
        <aside className="hidden lg:block">
          <div className="sticky top-24">
            <div className="relative mb-5">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                value={filters.search}
                onChange={(e) =>
                  setFilters((p) => ({ ...p, search: e.target.value }))
                }
                placeholder="Search jobs…"
                className="pl-9 h-10"
              />
              {filters.search && (
                <button
                  onClick={() => setFilters((p) => ({ ...p, search: "" }))}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  aria-label="Clear search"
                >
                  <X className="size-4" />
                </button>
              )}
            </div>
            <Card className="p-5">
              <FiltersPanel
                filters={filters}
                setFilters={setFilters}
                onClear={clearFilters}
              />
            </Card>
          </div>
        </aside>

        {/* main column */}
        <div>
          {/* toolbar */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>Sort by</span>
              <Select value={sort} onValueChange={(v) => setSort(v as SortKey)}>
                <SelectTrigger className="h-9 w-[200px] text-sm">
                  <SelectValue>{sortLabel}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {SORT_OPTIONS.map((opt) => (
                    <SelectItem key={opt.key} value={opt.key}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center flex-wrap gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Users className="size-3.5" />
                {sorted.reduce((sum, j) => sum + j.proposals, 0)} total
                proposals
              </span>
              <span className="flex items-center gap-1">
                <ShieldCheck className="size-3.5" />
                {sorted.filter((j) => j.verifiedClient).length} verified
              </span>
            </div>
          </div>

          {/* result count */}
          <div className="mb-4 text-sm text-muted-foreground">
            Showing{" "}
            <span className="font-semibold text-foreground">
              {sorted.length}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-foreground">{jobs.length}</span>{" "}
            open jobs
          </div>

          {/* results */}
          {sorted.length === 0 ? (
            <EmptyState onClear={clearFilters} />
          ) : (
            <motion.div
              initial="hidden"
              animate="show"
              variants={{
                hidden: {},
                show: { transition: { staggerChildren: 0.06 } },
              }}
              className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5"
            >
              {sorted.map((j, i) => (
                <motion.div
                  key={j.id}
                  variants={{
                    hidden: { opacity: 0, y: 14 },
                    show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
                  }}
                >
                  <JobCard job={j} index={0} />
                  <span className="sr-only">{i + 1}</span>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* load more */}
          {sorted.length > 0 && (
            <div className="mt-8 flex flex-col items-center gap-5">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-5 w-full">
                <JobSkeleton />
                <JobSkeleton className="hidden lg:block" />
              </div>
              <Button variant="outline" className="group">
                Load more jobs
                <ChevronDown className="size-4 transition-transform group-hover:translate-y-0.5" />
              </Button>
            </div>
          )}

          {/* footer summary */}
          <Card className="mt-10 p-5 bg-gradient-to-br from-[#192d2f] to-[#2b3d3d] border-0 text-white">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-full bg-white/10 flex items-center justify-center">
                  <Wallet className="size-5 text-white" />
                </div>
                <div>
                  <h4 className="font-display font-semibold">
                    Protected payments. Verified clients.
                  </h4>
                  <p className="text-xs text-white/70">
                    Every job on Khidma is escrow-protected.
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-4 text-xs text-white/80">
                <span className="flex items-center gap-1">
                  <Globe className="size-3.5" /> 41 countries
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="size-3.5" /> 24 cities
                </span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default JobsView;
