"use client";

import { useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Search,
  X,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Zap,
  Package,
  Layers,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ServiceCard } from "@/components/khidma/service-card";
import { categories, getAllServices, type Service } from "@/lib/khidma-data";
import { useApp } from "@/lib/store";
import { cn } from "@/lib/utils";

type SortKey =
  | "popular"
  | "newest"
  | "priceLow"
  | "priceHigh"
  | "topRated";

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: "popular", label: "Most Popular" },
  { key: "newest", label: "Newest" },
  { key: "priceLow", label: "Price: Low → High" },
  { key: "priceHigh", label: "Price: High → Low" },
  { key: "topRated", label: "Top Rated" },
];

function applyFilters(list: Service[], search: string): Service[] {
  const q = search.trim().toLowerCase();
  if (!q) return list;
  return list.filter((s) =>
    `${s.title} ${s.description} ${s.category} ${s.skills.join(" ")}`
      .toLowerCase()
      .includes(q)
  );
}

function sortServices(list: Service[], key: SortKey): Service[] {
  const copy = [...list];
  switch (key) {
    case "popular":
      return copy.sort((a, b) => b.ordersCount - a.ordersCount);
    case "newest":
      return copy.sort((a, b) => b.deliveryDays - a.deliveryDays);
    case "priceLow":
      return copy.sort((a, b) => a.startingPrice - b.startingPrice);
    case "priceHigh":
      return copy.sort((a, b) => b.startingPrice - a.startingPrice);
    case "topRated":
      return copy.sort((a, b) => b.rating - a.rating);
    default:
      return copy;
  }
}

/* Map service.category string -> category id (for pill filtering) */
const SERVICE_CATEGORY_TO_ID: Record<string, string> = {
  "Web Development": "development",
  "UI/UX Design": "design",
  "Brand Identity": "design",
  "Motion Graphics": "video",
  "Video Editing": "video",
  "Voice Over": "audio",
  "Audio Mastering": "audio",
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

function ServiceSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("rounded-xl border border-border/60 overflow-hidden", className)}>
      <div className="aspect-[16/9] bg-muted shimmer" />
      <div className="p-4 space-y-3">
        <div className="h-2.5 w-1/3 bg-muted shimmer rounded" />
        <div className="h-3 w-full bg-muted shimmer rounded" />
        <div className="h-3 w-2/3 bg-muted shimmer rounded" />
        <div className="h-2 w-full bg-muted shimmer rounded" />
      </div>
    </div>
  );
}

function EmptyState({ onClear }: { onClear: () => void }) {
  return (
    <Card className="p-12 text-center border-dashed">
      <div className="size-16 rounded-full bg-[#32504d]/10 mx-auto flex items-center justify-center">
        <Package className="size-8 text-[#32504d]" />
      </div>
      <h3 className="font-display text-lg font-semibold mt-4 text-foreground">
        No services match your selection
      </h3>
      <p className="text-muted-foreground text-sm mt-2 max-w-md mx-auto">
        Try a different category or clear the search to see all available
        services.
      </p>
      <Button variant="outline" className="mt-5" onClick={onClear}>
        <X className="size-4" />
        Clear filters
      </Button>
    </Card>
  );
}

export function ServicesView() {
  const { setView } = useApp();
  const [activeCat, setActiveCat] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortKey>("popular");

  const all = useMemo(() => getAllServices(), []);

  const filtered = useMemo(() => {
    let list = all;
    if (activeCat !== "all") {
      list = list.filter((s) => {
        const catId = SERVICE_CATEGORY_TO_ID[s.category] ?? "";
        return catId === activeCat;
      });
    }
    list = applyFilters(list, search);
    return sortServices(list, sort);
  }, [all, activeCat, search, sort]);

  const sortLabel = SORT_OPTIONS.find((s) => s.key === sort)?.label ?? "Sort";

  const pillsRef = useRef<HTMLDivElement>(null);
  const scrollPills = (dir: "left" | "right") => {
    const el = pillsRef.current;
    if (!el) return;
    const delta = dir === "left" ? -200 : 200;
    el.scrollBy({ left: delta, behavior: "smooth" });
  };

  const clearAll = () => {
    setActiveCat("all");
    setSearch("");
  };

  // pill list: "All" + categories
  const pills = [{ id: "all", name: "All", nameAr: "الكل" }, ...categories];

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mb-6 sm:mb-8"
      >
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setView("home")}
          className="mb-4 text-muted-foreground hover:text-[#2b3d3d] -ml-2"
        >
          <ArrowLeft className="size-4" />
          Back to home
        </Button>
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#748684]">
              Services Marketplace
            </span>
            <h1 className="mt-2 font-display text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
              Browse Services
            </h1>
            <p className="mt-2 text-sm sm:text-base text-muted-foreground">
              Pre-packaged offerings from verified freelancers — fixed scope,
              fixed price, fast delivery.
            </p>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Layers className="size-4 text-[#32504d]" />
            <span>
              <span className="font-semibold text-foreground">
                {filtered.length}
              </span>{" "}
              services available
            </span>
          </div>
        </div>
      </motion.div>

      {/* category pills row */}
      <div className="relative mb-5">
        <div
          ref={pillsRef}
          className="flex items-center gap-2 overflow-x-auto pb-2 -mx-1 px-1 scroll-smooth"
          style={{ scrollbarWidth: "thin" }}
        >
          {pills.map((cat) => {
            const active = activeCat === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCat(cat.id)}
                className={cn(
                  "shrink-0 px-4 h-9 rounded-full border text-sm font-medium transition-all flex items-center gap-1.5",
                  active
                    ? "bg-[#2b3d3d] border-[#2b3d3d] text-white shadow-sm"
                    : "border-border bg-background text-muted-foreground hover:border-[#32504d]/50 hover:text-[#2b3d3d]"
                )}
              >
                {cat.name}
                {cat.id !== "all" && (
                  <span
                    className={cn(
                      "text-[10px] font-normal font-arabic",
                      active ? "text-white/70" : "text-muted-foreground"
                    )}
                  >
                    {cat.nameAr}
                  </span>
                )}
              </button>
            );
          })}
        </div>
        {/* scroll arrows (desktop only) */}
        <button
          onClick={() => scrollPills("left")}
          className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-2 size-8 rounded-full border border-border bg-background items-center justify-center shadow-sm hover:bg-muted"
          aria-label="Scroll categories left"
        >
          <ChevronLeft className="size-4" />
        </button>
        <button
          onClick={() => scrollPills("right")}
          className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-2 size-8 rounded-full border border-border bg-background items-center justify-center shadow-sm hover:bg-muted"
          aria-label="Scroll categories right"
        >
          <ChevronRight className="size-4" />
        </button>
      </div>

      {/* search + sort row */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search services, skills, categories…"
            className="pl-9 h-10"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              aria-label="Clear search"
            >
              <X className="size-4" />
            </button>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-muted-foreground whitespace-nowrap">
            Sort by
          </span>
          <Select value={sort} onValueChange={(v) => setSort(v as SortKey)}>
            <SelectTrigger className="h-10 w-[200px] text-sm">
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
      </div>

      <Separator className="mb-6" />

      {/* active filter summary */}
      {(activeCat !== "all" || search) && (
        <div className="flex items-center flex-wrap gap-2 mb-5 text-sm">
          <span className="text-xs text-muted-foreground">Active filters:</span>
          {activeCat !== "all" && (
            <Badge
              variant="secondary"
              className="gap-1 cursor-pointer hover:bg-muted"
              onClick={() => setActiveCat("all")}
            >
              {pills.find((p) => p.id === activeCat)?.name}
              <X className="size-3" />
            </Badge>
          )}
          {search && (
            <Badge
              variant="secondary"
              className="gap-1 cursor-pointer hover:bg-muted"
              onClick={() => setSearch("")}
            >
              &ldquo;{search}&rdquo;
              <X className="size-3" />
            </Badge>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAll}
            className="h-7 text-xs text-muted-foreground hover:text-[#32504d] -ml-1"
          >
            Clear all
          </Button>
        </div>
      )}

      {/* grid */}
      {filtered.length === 0 ? (
        <EmptyState onClear={clearAll} />
      ) : (
        <motion.div
          initial="hidden"
          animate="show"
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.05 } },
          }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5"
        >
          {filtered.map((s, i) => (
            <motion.div
              key={s.id}
              variants={{
                hidden: { opacity: 0, y: 14 },
                show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
              }}
            >
              <ServiceCard service={s} index={0} />
              <span className="sr-only">{i + 1}</span>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* load more (visual only) */}
      {filtered.length > 0 && (
        <div className="mt-10 flex flex-col items-center gap-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 w-full">
            <ServiceSkeleton />
            <ServiceSkeleton className="hidden sm:block" />
          </div>
          <Button variant="outline" className="group">
            Load more services
            <ChevronDown className="size-4 transition-transform group-hover:translate-y-0.5" />
          </Button>
        </div>
      )}

      {/* footer callout */}
      <Card className="mt-12 p-6 sm:p-8 bg-gradient-to-br from-[#192d2f] to-[#2b3d3d] border-0 text-white overflow-hidden relative">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "radial-gradient(circle at 80% 20%, rgba(116,134,132,0.35) 0%, transparent 60%)",
          }}
        />
        <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
          <div>
            <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.2em] text-[#94a8a4] mb-2">
              <Zap className="size-3.5" />
              Can&apos;t find what you need?
            </div>
            <h3 className="font-display text-xl sm:text-2xl font-bold">
              Post a custom job and get verified proposals
            </h3>
            <p className="text-sm text-white/70 mt-2 max-w-xl">
              Describe your project, set a budget, and let our verified
              freelancers come to you with tailored proposals.
            </p>
          </div>
          <Button
            variant="secondary"
            size="lg"
            onClick={() => setView("jobs")}
            className="bg-white text-[#192d2f] hover:bg-white/90 shrink-0 group"
          >
            Browse Jobs
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </Button>
        </div>
      </Card>
    </div>
  );
}

export default ServicesView;
