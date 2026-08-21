"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Search,
  SlidersHorizontal,
  LayoutGrid,
  List as ListIcon,
  Users,
  X,
  RotateCcw,
  ChevronDown,
  CheckCircle2,
  Mail,
  Phone,
  ShieldCheck,
  Briefcase,
  Star,
  Globe,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
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
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  categories,
  freelancers,
  formatTND,
  type Freelancer,
} from "@/lib/khidma-data";
import {
  FreelancerCard,
  FreelancerListRow,
} from "@/components/khidma/freelancer-card";
import { RecentlyViewedPanel } from "@/components/khidma/recently-viewed-panel";
import { useApp } from "@/lib/store";
import { cn } from "@/lib/utils";

/* ---------- types & constants ---------- */

type SortKey =
  | "topRated"
  | "newest"
  | "mostReviews"
  | "rateLow"
  | "rateHigh";

type AvailabilityFilter = "any" | "available" | "limited";
type CountryFilter = "all" | "Tunisia" | "Worldwide";

interface FilterState {
  search: string;
  categoryIds: string[];
  skills: string[];
  rateRange: [number, number];
  availability: AvailabilityFilter;
  verifications: {
    email: boolean;
    phone: boolean;
    identity: boolean;
    portfolio: boolean;
    topRated: boolean;
  };
  country: CountryFilter;
}

const RATE_MIN = 20;
const RATE_MAX = 100;
const RATE_STEP = 5;

const DEFAULT_FILTERS: FilterState = {
  search: "",
  categoryIds: [],
  skills: [],
  rateRange: [RATE_MIN, RATE_MAX],
  availability: "any",
  verifications: {
    email: false,
    phone: false,
    identity: false,
    portfolio: false,
    topRated: false,
  },
  country: "all",
};

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: "topRated", label: "Top Rated" },
  { key: "newest", label: "Newest" },
  { key: "mostReviews", label: "Most Reviews" },
  { key: "rateLow", label: "Hourly: Low → High" },
  { key: "rateHigh", label: "Hourly: High → Low" },
];

// Skills derived from categories' skills
const ALL_SKILLS: string[] = Array.from(
  new Set(categories.flatMap((c) => c.skills))
).sort();

const VERIFICATION_OPTIONS: {
  key: keyof FilterState["verifications"];
  label: string;
  icon: typeof Mail;
}[] = [
  { key: "email", label: "Email Verified", icon: Mail },
  { key: "phone", label: "Phone Verified", icon: Phone },
  { key: "identity", label: "Identity Verified", icon: ShieldCheck },
  { key: "portfolio", label: "Portfolio Reviewed", icon: Briefcase },
  { key: "topRated", label: "Top Rated", icon: Star },
];

/* ---------- filter helpers ---------- */

function applyFilters(list: Freelancer[], f: FilterState): Freelancer[] {
  const q = f.search.trim().toLowerCase();
  return list.filter((fl) => {
    // search
    if (q) {
      const hay = `${fl.name} ${fl.title} ${fl.skills.join(" ")} ${fl.bio} ${fl.location.city} ${fl.location.country}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    // categories , match if any of the freelancer's skills appear in any selected category's skill list
    if (f.categoryIds.length > 0) {
      const allowedSkills = new Set(
        f.categoryIds.flatMap((id) => categories.find((c) => c.id === id)?.skills ?? [])
      );
      const hasMatch = fl.skills.some((s) => allowedSkills.has(s));
      if (!hasMatch) return false;
    }
    // skills (intersection)
    if (f.skills.length > 0) {
      const has = f.skills.some((s) => fl.skills.includes(s));
      if (!has) return false;
    }
    // rate range
    if (fl.hourlyRate < f.rateRange[0] || fl.hourlyRate > f.rateRange[1]) return false;
    // availability
    if (f.availability !== "any" && fl.availability !== f.availability) return false;
    // verifications
    const v = f.verifications;
    if (v.email && !fl.verified.email) return false;
    if (v.phone && !fl.verified.phone) return false;
    if (v.identity && !fl.verified.identity) return false;
    if (v.portfolio && !fl.verified.portfolio) return false;
    if (v.topRated && !fl.topRated) return false;
    // country
    if (f.country !== "all" && fl.location.country !== f.country) return false;
    return true;
  });
}

function sortFreelancers(list: Freelancer[], key: SortKey): Freelancer[] {
  const copy = [...list];
  switch (key) {
    case "topRated":
      return copy.sort((a, b) => {
        if (a.topRated !== b.topRated) return a.topRated ? -1 : 1;
        return b.rating - a.rating;
      });
    case "newest":
      return copy.sort((a, b) => Number(b.memberSince) - Number(a.memberSince));
    case "mostReviews":
      return copy.sort((a, b) => b.reviewsCount - a.reviewsCount);
    case "rateLow":
      return copy.sort((a, b) => a.hourlyRate - b.hourlyRate);
    case "rateHigh":
      return copy.sort((a, b) => b.hourlyRate - a.hourlyRate);
    default:
      return copy;
  }
}

/* ---------- filter panel (shared by desktop sidebar + mobile sheet) ---------- */

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
  const toggleArrayValue = (key: "categoryIds" | "skills", value: string) => {
    setFilters((p) => {
      const arr = p[key];
      const next = arr.includes(value)
        ? arr.filter((v) => v !== value)
        : [...arr, value];
      return { ...p, [key]: next };
    });
  };

  const toggleVerification = (key: keyof FilterState["verifications"]) => {
    setFilters((p) => ({
      ...p,
      verifications: { ...p.verifications, [key]: !p.verifications[key] },
    }));
  };

  const activeFilterCount =
    filters.categoryIds.length +
    filters.skills.length +
    (filters.availability !== "any" ? 1 : 0) +
    (filters.country !== "all" ? 1 : 0) +
    (filters.rateRange[0] !== RATE_MIN || filters.rateRange[1] !== RATE_MAX ? 1 : 0) +
    Object.values(filters.verifications).filter(Boolean).length;

  return (
    <div className="space-y-6">
      {/* top row: title + clear */}
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

      {/* categories */}
      <FilterSection title="Categories">
        <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
          {categories.map((cat) => {
            const checked = filters.categoryIds.includes(cat.id);
            return (
              <label
                key={cat.id}
                className="flex items-center gap-2.5 cursor-pointer group"
              >
                <Checkbox
                  checked={checked}
                  onCheckedChange={() => toggleArrayValue("categoryIds", cat.id)}
                  className="data-[state=checked]:bg-[#32504d] data-[state=checked]:border-[#32504d]"
                />
                <span className="text-sm flex-1 group-hover:text-[#2b3d3d] dark:text-[#94a8a4]">
                  {cat.name}
                </span>
                <Badge variant="outline" className="text-[10px] h-5 px-1.5">
                  {cat.count}
                </Badge>
              </label>
            );
          })}
        </div>
      </FilterSection>

      <Separator />

      {/* skills */}
      <FilterSection title="Skills">
        <div className="flex flex-wrap gap-1.5 max-h-44 overflow-y-auto pr-1">
          {ALL_SKILLS.map((skill) => {
            const active = filters.skills.includes(skill);
            return (
              <button
                key={skill}
                type="button"
                onClick={() => toggleArrayValue("skills", skill)}
                className={cn(
                  "text-[11px] px-2.5 py-1 rounded-full border transition-colors",
                  active
                    ? "bg-[#32504d] border-[#32504d] text-white"
                    : "border-border text-muted-foreground hover:border-[#32504d]/50 hover:text-[#2b3d3d] dark:text-[#94a8a4] bg-background"
                )}
              >
                {skill}
              </button>
            );
          })}
        </div>
      </FilterSection>

      <Separator />

      {/* hourly rate */}
      <FilterSection title="Hourly Rate (TND/hr)">
        <div className="px-1">
          <Slider
            value={filters.rateRange}
            min={RATE_MIN}
            max={RATE_MAX}
            step={RATE_STEP}
            onValueChange={(v) =>
              setFilters((p) => ({
                ...p,
                rateRange: [v[0] ?? RATE_MIN, v[1] ?? RATE_MAX],
              }))
            }
            className="[&_span[data-slot=slider-range]]:bg-[#32504d] [&_span[data-slot=slider-thumb]]:border-[#32504d]"
          />
          <div className="flex items-center justify-between mt-3 text-xs">
            <span className="font-medium">{formatTND(filters.rateRange[0])}</span>
            <span className="text-muted-foreground">to</span>
            <span className="font-medium">{formatTND(filters.rateRange[1])}</span>
          </div>
        </div>
      </FilterSection>

      <Separator />

      {/* availability */}
      <FilterSection title="Availability">
        <RadioGroup
          value={filters.availability}
          onValueChange={(v) =>
            setFilters((p) => ({
              ...p,
              availability: v as AvailabilityFilter,
            }))
          }
          className="gap-2"
        >
          {[
            { value: "any", label: "Any availability" },
            { value: "available", label: "Available now" },
            { value: "limited", label: "Limited capacity" },
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

      {/* verification */}
      <FilterSection title="Verification Level">
        <div className="space-y-2.5">
          {VERIFICATION_OPTIONS.map((opt) => {
            const Icon = opt.icon;
            const checked = filters.verifications[opt.key];
            return (
              <label
                key={opt.key}
                className="flex items-center gap-2.5 cursor-pointer group"
              >
                <Checkbox
                  checked={checked}
                  onCheckedChange={() => toggleVerification(opt.key)}
                  className="data-[state=checked]:bg-[#32504d] data-[state=checked]:border-[#32504d]"
                />
                <Icon className="size-3.5 text-[#748684] group-hover:text-[#32504d] dark:text-[#9bb3ae]" />
                <span className="text-sm group-hover:text-[#2b3d3d] dark:text-[#94a8a4]">
                  {opt.label}
                </span>
              </label>
            );
          })}
        </div>
      </FilterSection>

      <Separator />

      {/* country */}
      <FilterSection title="Country">
        <Select
          value={filters.country}
          onValueChange={(v) =>
            setFilters((p) => ({ ...p, country: v as CountryFilter }))
          }
        >
          <SelectTrigger className="w-full h-9 text-sm">
            <SelectValue placeholder="All countries" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All countries</SelectItem>
            <SelectItem value="Tunisia">Tunisia</SelectItem>
            <SelectItem value="Worldwide">Worldwide</SelectItem>
          </SelectContent>
        </Select>
      </FilterSection>
    </div>
  );
}

/* ---------- empty state ---------- */

function EmptyState({ onClear }: { onClear: () => void }) {
  return (
    <Card className="p-12 text-center border-dashed">
      <div className="size-16 rounded-full bg-[#32504d]/10 dark:bg-[#32504d]/20 mx-auto flex items-center justify-center">
        <Users className="size-8 text-[#32504d] dark:text-[#9bb3ae]" />
      </div>
      <h3 className="font-display text-lg font-semibold mt-4 text-foreground">
        No freelancers match your filters
      </h3>
      <p className="text-muted-foreground text-sm mt-2 max-w-md mx-auto">
        Try removing some filters or searching with different keywords to
        expand your results.
      </p>
      <Button variant="outline" className="mt-5" onClick={onClear}>
        <RotateCcw className="size-4" />
        Clear all filters
      </Button>
    </Card>
  );
}

/* ---------- skeleton (visual only) ---------- */

function FreelancerSkeleton() {
  return (
    <div className="rounded-xl border border-border/60 overflow-hidden">
      <div className="h-20 bg-muted shimmer" />
      <div className="p-4 space-y-3">
        <div className="flex items-start gap-3">
          <div className="size-14 rounded-full bg-muted shimmer -mt-10 border-2 border-background" />
          <div className="space-y-2 pt-7 flex-1">
            <div className="h-3 w-2/3 bg-muted shimmer rounded" />
            <div className="h-2.5 w-1/2 bg-muted shimmer rounded" />
          </div>
        </div>
        <div className="h-2 w-full bg-muted shimmer rounded" />
        <div className="h-2 w-3/4 bg-muted shimmer rounded" />
      </div>
    </div>
  );
}

/* ---------- main view ---------- */

export function FreelancersView() {
  const { setView, searchQuery, setSearchQuery } = useApp();
  const [filters, setFilters] = useState<FilterState>({
    ...DEFAULT_FILTERS,
    search: searchQuery,
  });
  const [sort, setSort] = useState<SortKey>("topRated");
  const [layout, setLayout] = useState<"grid" | "list">("grid");
  const [visibleCount, setVisibleCount] = useState(9);
  const [sheetOpen, setSheetOpen] = useState(false);

  // keep search synced with global store
  const updateSearch = (v: string) => {
    setFilters((p) => ({ ...p, search: v }));
    setSearchQuery(v);
  };

  const filtered = useMemo(
    () => applyFilters(freelancers, filters),
    [filters]
  );
  const sorted = useMemo(() => sortFreelancers(filtered, sort), [filtered, sort]);
  const visible = sorted.slice(0, visibleCount);

  const clearFilters = () => {
    setFilters({ ...DEFAULT_FILTERS, search: "" });
    setSearchQuery("");
    setVisibleCount(9);
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
              Browse Talent
            </span>
            <h1 className="mt-2 font-display text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
              Find Verified Talent
            </h1>
            <p className="mt-2 text-sm sm:text-base text-muted-foreground">
              Browse our 1,248+ approved Tunisian freelancers
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="size-4 text-[#32504d] dark:text-[#9bb3ae]" />
            <span>
              Showing{" "}
              <span className="font-semibold text-foreground">
                {visible.length}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-foreground">
                {sorted.length}
              </span>{" "}
              freelancers
            </span>
          </div>
        </div>
      </motion.div>

      {/* mobile search bar */}
      <div className="lg:hidden mb-4 flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            value={filters.search}
            onChange={(e) => updateSearch(e.target.value)}
            placeholder="Search freelancers, skills…"
            className="pl-9 h-10"
          />
          {filters.search && (
            <button
              onClick={() => updateSearch("")}
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
              <SheetTitle className="font-display">Filter Freelancers</SheetTitle>
              <SheetDescription>
                Narrow down to the perfect talent for your project.
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
            {/* search */}
            <div className="relative mb-5">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                value={filters.search}
                onChange={(e) => updateSearch(e.target.value)}
                placeholder="Search freelancers…"
                className="pl-9 h-10"
              />
              {filters.search && (
                <button
                  onClick={() => updateSearch("")}
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
            <div className="mt-5">
              <RecentlyViewedPanel />
            </div>
          </div>
        </aside>

        {/* main column */}
        <div>
          {/* toolbar: sort + layout toggle */}
          <div className="flex items-center justify-between gap-3 mb-5">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span>Sort by</span>
              <Select value={sort} onValueChange={(v) => setSort(v as SortKey)}>
                <SelectTrigger className="h-9 w-[180px] text-sm">
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

            <div className="flex items-center gap-1.5">
              {/* layout toggle (dropdown variant for accessibility) */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="h-9 px-3">
                    {layout === "grid" ? (
                      <LayoutGrid className="size-4" />
                    ) : (
                      <ListIcon className="size-4" />
                    )}
                    <span className="hidden sm:inline text-xs">
                      {layout === "grid" ? "Grid" : "List"}
                    </span>
                    <ChevronDown className="size-3 opacity-60" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40">
                  <DropdownMenuItem
                    onClick={() => setLayout("grid")}
                    className={cn(
                      "gap-2 cursor-pointer",
                      layout === "grid" && "bg-accent text-[#32504d] dark:text-[#9bb3ae]"
                    )}
                  >
                    <LayoutGrid className="size-4" />
                    Grid view
                    {layout === "grid" && (
                      <CheckCircle2 className="size-3.5 ml-auto text-[#32504d] dark:text-[#9bb3ae]" />
                    )}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setLayout("list")}
                    className={cn(
                      "gap-2 cursor-pointer",
                      layout === "list" && "bg-accent text-[#32504d] dark:text-[#9bb3ae]"
                    )}
                  >
                    <ListIcon className="size-4" />
                    List view
                    {layout === "list" && (
                      <CheckCircle2 className="size-3.5 ml-auto text-[#32504d] dark:text-[#9bb3ae]" />
                    )}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          {/* results */}
          {visible.length === 0 ? (
            <EmptyState onClear={clearFilters} />
          ) : layout === "grid" ? (
            <motion.div
              initial="hidden"
              animate="show"
              variants={{
                hidden: {},
                show: { transition: { staggerChildren: 0.05 } },
              }}
              className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5"
            >
              {visible.map((f, i) => (
                <motion.div
                  key={f.id}
                  variants={{
                    hidden: { opacity: 0, y: 14 },
                    show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
                  }}
                >
                  <FreelancerCard freelancer={f} index={0} />
                  <span className="sr-only">{i + 1}</span>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              initial="hidden"
              animate="show"
              variants={{
                hidden: {},
                show: { transition: { staggerChildren: 0.04 } },
              }}
              className="space-y-3"
            >
              {visible.map((f, i) => (
                <motion.div
                  key={f.id}
                  variants={{
                    hidden: { opacity: 0, y: 8 },
                    show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
                  }}
                >
                  <FreelancerListRow freelancer={f} index={0} />
                  <span className="sr-only">{i + 1}</span>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* skeletons + load more (visual only) */}
          {visible.length > 0 && visible.length < sorted.length && (
            <div className="mt-8 flex flex-col items-center gap-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 w-full">
                {Array.from({ length: 3 }).map((_, i) => (
                  <FreelancerSkeleton key={`sk-${i}`} />
                ))}
              </div>
              <Button
                variant="outline"
                onClick={() => setVisibleCount((c) => c + 6)}
                className="group"
              >
                Load more freelancers
                <ChevronDown className="size-4 transition-transform group-hover:translate-y-0.5" />
              </Button>
            </div>
          )}

          {visible.length > 0 && visible.length >= sorted.length && (
            <div className="mt-8 flex items-center justify-center gap-2 text-xs text-muted-foreground">
              <Globe className="size-3.5" />
              You&apos;ve reached the end ,{" "}
              <span className="font-medium text-foreground">
                {sorted.length}
              </span>{" "}
              verified freelancers
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default FreelancersView;
