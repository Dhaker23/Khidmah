"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogPortal,
  DialogOverlay,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Star,
  MapPin,
  Clock,
  Briefcase,
  Languages,
  Sparkles,
  CheckCircle2,
  X,
  Plus,
  Users,
  Trash2,
  Wallet,
  Image as ImageIcon,
  ShoppingBag,
  CalendarDays,
  ShieldCheck,
  Mail,
  Phone,
  Award,
  ArrowRight,
} from "lucide-react";
import { useApp } from "@/lib/store";
import { toast } from "sonner";
import {
  getFreelancerById,
  formatTND,
  formatNumber,
  type Freelancer,
} from "@/lib/khidma-data";
import { cn } from "@/lib/utils";

/* ---------- helpers ---------- */

function responseTimeToMinutes(rt: string): number {
  const h = rt.match(/(\d+)\s*hour/);
  if (h) return parseInt(h[1], 10) * 60;
  const m = rt.match(/(\d+)\s*min/);
  if (m) return parseInt(m[1], 10);
  const d = rt.match(/(\d+)\s*day/);
  if (d) return parseInt(d[1], 10) * 1440;
  return Number.MAX_SAFE_INTEGER;
}

const availabilityMeta = {
  available: { label: "Available", dot: "bg-emerald-500", text: "text-emerald-700" },
  limited: { label: "Limited", dot: "bg-amber-500", text: "text-amber-700" },
  booked: { label: "Booked", dot: "bg-rose-500", text: "text-rose-700" },
} as const;

interface RowSpec {
  key: string;
  label: string;
  icon: typeof Star;
  render: (f: Freelancer) => React.ReactNode;
  valueFor?: (f: Freelancer) => number;
  noHighlight?: boolean;
}

const ROWS: RowSpec[] = [
  {
    key: "rating",
    label: "Rating",
    icon: Star,
    render: (f) => (
      <div className="flex items-center gap-1.5 justify-center">
        <Star className="size-3.5 fill-amber-400 text-amber-400" />
        <span className="font-semibold text-sm">{f.rating.toFixed(1)}</span>
        <span className="text-[11px] text-muted-foreground">
          ({formatNumber(f.reviewsCount)})
        </span>
      </div>
    ),
    valueFor: (f) => f.rating,
  },
  {
    key: "location",
    label: "Location",
    icon: MapPin,
    render: (f) => (
      <span className="text-sm text-foreground">
        {f.location.city}, {f.location.country}
      </span>
    ),
    noHighlight: true,
  },
  {
    key: "rate",
    label: "Hourly Rate",
    icon: Wallet,
    render: (f) => (
      <span className="text-sm font-semibold text-foreground">
        {formatTND(f.hourlyRate)}
        <span className="text-[11px] font-normal text-muted-foreground">/hr</span>
      </span>
    ),
    // Lower rate = better. We negate so higher-is-better logic still applies.
    valueFor: (f) => -f.hourlyRate,
  },
  {
    key: "projects",
    label: "Completed Projects",
    icon: Briefcase,
    render: (f) => (
      <span className="text-sm font-semibold text-foreground">
        {formatNumber(f.completedProjects)}
      </span>
    ),
    valueFor: (f) => f.completedProjects,
  },
  {
    key: "response",
    label: "Response Time",
    icon: Clock,
    render: (f) => <span className="text-sm text-foreground">{f.responseTime}</span>,
    valueFor: (f) => -responseTimeToMinutes(f.responseTime),
  },
  {
    key: "languages",
    label: "Languages",
    icon: Languages,
    render: (f) => (
      <div className="flex flex-wrap gap-1 justify-center">
        {f.languages.map((l) => (
          <Badge key={l} variant="secondary" className="text-[10px] h-5 py-0">
            {l}
          </Badge>
        ))}
      </div>
    ),
    noHighlight: true,
  },
  {
    key: "skills",
    label: "Top Skills",
    icon: Sparkles,
    render: (f) => (
      <div className="flex flex-wrap gap-1 justify-center">
        {f.skills.slice(0, 6).map((s) => (
          <Badge key={s} variant="outline" className="text-[10px] h-5 py-0">
            {s}
          </Badge>
        ))}
      </div>
    ),
    noHighlight: true,
  },
  {
    key: "verification",
    label: "Verification",
    icon: ShieldCheck,
    render: (f) => (
      <div className="flex flex-wrap gap-1 justify-center">
        <VChip on={f.verified.email} icon={Mail} />
        <VChip on={f.verified.phone} icon={Phone} />
        <VChip on={f.verified.identity} icon={ShieldCheck} />
        <VChip on={f.verified.portfolio} icon={Briefcase} />
      </div>
    ),
    valueFor: (f) =>
      [f.verified.email, f.verified.phone, f.verified.identity, f.verified.portfolio].filter(
        Boolean
      ).length,
  },
  {
    key: "topRated",
    label: "Top Rated",
    icon: Award,
    render: (f) =>
      f.topRated ? (
        <Badge className="bg-amber-50 text-amber-700 border-amber-200 text-[10px] h-5 py-0">
          <Award className="size-3" />
          Yes
        </Badge>
      ) : (
        <span className="text-[11px] text-muted-foreground">No</span>
      ),
    valueFor: (f) => (f.topRated ? 1 : 0),
  },
  {
    key: "availability",
    label: "Availability",
    icon: Clock,
    render: (f) => {
      const m = availabilityMeta[f.availability];
      return (
        <span className={cn("inline-flex items-center gap-1.5 text-xs", m.text)}>
          <span className={cn("size-2 rounded-full", m.dot)} />
          {m.label}
        </span>
      );
    },
    valueFor: (f) =>
      f.availability === "available" ? 2 : f.availability === "limited" ? 1 : 0,
  },
  {
    key: "memberSince",
    label: "Member Since",
    icon: CalendarDays,
    render: (f) => <span className="text-sm text-foreground">{f.memberSince}</span>,
    noHighlight: true,
  },
  {
    key: "portfolioItems",
    label: "Portfolio Items",
    icon: ImageIcon,
    render: (f) => (
      <span className="text-sm font-semibold text-foreground">
        {formatNumber(f.portfolio.length)}
      </span>
    ),
    valueFor: (f) => f.portfolio.length,
  },
  {
    key: "services",
    label: "Services",
    icon: ShoppingBag,
    render: (f) => (
      <span className="text-sm font-semibold text-foreground">
        {formatNumber(f.services.length)}
      </span>
    ),
    valueFor: (f) => f.services.length,
  },
];

function VChip({ on, icon: Icon }: { on: boolean; icon: typeof Mail }) {
  if (!on)
    return (
      <span className="inline-flex items-center justify-center size-5 rounded-full border border-dashed border-muted-foreground/30 text-muted-foreground/40">
        <Icon className="size-2.5" />
      </span>
    );
  return (
    <span className="inline-flex items-center justify-center size-5 rounded-full bg-[#32504d]/10 dark:bg-[#32504d]/20 border border-[#32504d]/20 dark:border-[#32504d]/30">
      <CheckCircle2 className="size-3 text-[#32504d] dark:text-[#9bb3ae]" />
    </span>
  );
}

/* ---------- empty state ---------- */

function EmptyState() {
  const { closeCompare, setView } = useApp();
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex-1 flex flex-col items-center justify-center py-20 text-center"
    >
      <div className="size-20 rounded-full bg-[#32504d]/10 dark:bg-[#32504d]/20 flex items-center justify-center mb-5">
        <Users className="size-9 text-[#32504d] dark:text-[#9bb3ae]" />
      </div>
      <h3 className="font-display text-xl font-semibold text-foreground">
        No freelancers to compare yet
      </h3>
      <p className="text-sm text-muted-foreground mt-2 max-w-md">
        Add freelancers to compare from the marketplace. You can compare up to 3
        side-by-side at once.
      </p>
      <Button
        className="mt-6 bg-[#2b3d3d] hover:bg-[#192d2f] text-white"
        onClick={() => {
          closeCompare();
          setView("freelancers");
        }}
      >
        Browse talent
        <ArrowRight className="size-4" />
      </Button>
    </motion.div>
  );
}

/* ---------- column header ---------- */

function ColumnHeader({
  f,
  onRemove,
}: {
  f: Freelancer;
  onRemove: () => void;
}) {
  const { openFreelancer, closeCompare } = useApp();
  return (
    <div className="flex flex-col items-center gap-2 p-3">
      <Avatar className="size-14 border-2 border-background ring-1 ring-border/60">
        <AvatarImage src={f.avatar} alt={f.name} />
        <AvatarFallback className="bg-[#32504d]/10 dark:bg-[#32504d]/20 text-[#32504d] dark:text-[#9bb3ae] font-semibold">
          {f.name.charAt(0)}
        </AvatarFallback>
      </Avatar>
      <div className="text-center min-w-0 w-full">
        <button
          onClick={() => {
            closeCompare();
            openFreelancer(f.id);
          }}
          className="font-semibold text-sm leading-tight hover:text-[#32504d] dark:text-[#9bb3ae] transition-colors truncate block w-full"
          title={f.name}
        >
          {f.name}
        </button>
        <p className="text-[11px] text-muted-foreground truncate">{f.title}</p>
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={onRemove}
        className="h-7 px-2 text-xs text-muted-foreground hover:text-rose-600 hover:bg-rose-50"
        aria-label={`Remove ${f.name} from comparison`}
      >
        <X className="size-3" />
        Remove
      </Button>
    </div>
  );
}

/* ---------- placeholder column ---------- */

function AddAnotherColumn() {
  const { closeCompare, setView } = useApp();
  return (
    <button
      onClick={() => {
        closeCompare();
        setView("freelancers");
      }}
      className="h-full min-h-[180px] w-full flex flex-col items-center justify-center gap-2 p-3 border-2 border-dashed border-border/60 rounded-lg text-muted-foreground hover:border-[#32504d]/40 hover:text-[#32504d] dark:text-[#9bb3ae] hover:bg-[#32504d]/5 dark:bg-[#32504d]/15 transition-colors"
      aria-label="Add another freelancer to comparison"
    >
      <span className="size-10 rounded-full bg-[#32504d]/10 dark:bg-[#32504d]/20 flex items-center justify-center">
        <Plus className="size-5" />
      </span>
      <span className="text-xs font-medium text-center leading-tight">
        Add another
        <br />
        freelancer
      </span>
    </button>
  );
}

/* ---------- main modal ---------- */

export function CompareModal() {
  const {
    modal,
    closeCompare,
    compareIds,
    removeFromCompare,
    clearCompare,
    setView,
  } = useApp();

  const freelancers = useMemo(
    () =>
      compareIds
        .map((id) => getFreelancerById(id))
        .filter((f): f is Freelancer => Boolean(f)),
    [compareIds]
  );

  const bestIndexByKey = useMemo(() => {
    const map: Record<string, number> = {};
    if (freelancers.length < 2) return map;
    for (const row of ROWS) {
      if (row.noHighlight || !row.valueFor) continue;
      const vals = freelancers.map(row.valueFor);
      const best = Math.max(...vals);
      const winners = vals.filter((v) => v === best).length;
      if (winners !== 1) continue;
      map[row.key] = vals.indexOf(best);
    }
    return map;
  }, [freelancers]);

  const colTemplate = `160px repeat(${freelancers.length}, minmax(0, 1fr))${
    freelancers.length < 3 ? " 1fr" : ""
  }`;

  return (
    <Dialog open={modal.compareOpen} onOpenChange={(o) => !o && closeCompare()}>
      <DialogPortal>
        <DialogOverlay />
        <DialogContent
          className="max-w-6xl w-[96vw] h-[85vh] p-0 gap-0 overflow-hidden flex flex-col"
          showCloseButton={false}
        >
          <DialogTitle className="sr-only">Compare freelancers</DialogTitle>
          <DialogDescription className="sr-only">
            Side-by-side comparison of up to 3 freelancers
          </DialogDescription>

          {/* Header */}
          <div className="flex items-center justify-between gap-4 px-6 py-4 border-b border-border/60 bg-gradient-to-r from-[#32504d]/5 to-transparent shrink-0">
            <div>
              <h2 className="font-display text-lg sm:text-xl font-bold text-foreground flex items-center gap-2">
                <span className="size-7 rounded-lg bg-[#32504d] text-white flex items-center justify-center">
                  <Users className="size-4" />
                </span>
                Compare Freelancers
              </h2>
              <p className="text-xs sm:text-sm text-muted-foreground mt-0.5 ml-9">
                Side-by-side comparison of up to 3 freelancers
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="hidden sm:inline-flex">
                {freelancers.length}/3
              </Badge>
              <Button
                variant="ghost"
                size="icon"
                onClick={closeCompare}
                aria-label="Close compare dialog"
                className="size-8"
              >
                <X className="size-4" />
              </Button>
            </div>
          </div>

          {/* Body */}
          {freelancers.length === 0 ? (
            <EmptyState />
          ) : (
            <ScrollArea className="flex-1">
              <div className="min-w-[680px] p-4 sm:p-6">
                {/* Header row (freelancers) */}
                <div
                  className="grid gap-px rounded-t-xl overflow-hidden border border-border/60 border-b-0 bg-border/60"
                  style={{ gridTemplateColumns: colTemplate }}
                >
                  <div className="bg-muted/40 p-3 flex items-center justify-center">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                      Freelancer
                    </span>
                  </div>
                  {freelancers.map((f) => (
                    <div key={f.id} className="bg-background">
                      <ColumnHeader f={f} onRemove={() => removeFromCompare(f.id)} />
                    </div>
                  ))}
                  {freelancers.length < 3 && (
                    <div className="bg-background p-3">
                      <AddAnotherColumn />
                    </div>
                  )}
                </div>

                {/* Comparison rows */}
                <div className="border border-border/60 border-t-0 overflow-hidden rounded-b-xl">
                  {ROWS.map((row, idx) => {
                    const Icon = row.icon;
                    const bestIdx = bestIndexByKey[row.key];
                    return (
                      <motion.div
                        key={row.key}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.25, delay: idx * 0.02 }}
                        className="grid gap-px bg-border/60"
                        style={{ gridTemplateColumns: colTemplate }}
                      >
                        {/* attribute label cell */}
                        <div className="bg-muted/40 p-3 flex items-center gap-2">
                          <Icon className="size-3.5 text-[#748684] shrink-0" />
                          <span className="text-xs font-medium text-foreground">
                            {row.label}
                          </span>
                        </div>
                        {freelancers.map((f, ci) => (
                          <div
                            key={f.id}
                            className={cn(
                              "bg-background p-3 flex items-center justify-center text-center relative transition-colors hover:bg-[#32504d]/[0.04]",
                              bestIdx === ci &&
                                "bg-[#32504d]/10 dark:bg-[#32504d]/20 ring-1 ring-inset ring-[#32504d]/30"
                            )}
                          >
                            {row.render(f)}
                            {bestIdx === ci && (
                              <span
                                className="absolute top-1.5 right-1.5 size-3.5 rounded-full bg-[#32504d] text-white flex items-center justify-center"
                                title="Best value"
                              >
                                <CheckCircle2 className="size-2.5" />
                              </span>
                            )}
                          </div>
                        ))}
                        {freelancers.length < 3 && (
                          <div className="bg-background p-3">
                            <div className="h-full w-full" />
                          </div>
                        )}
                      </motion.div>
                    );
                  })}
                </div>

                <p className="mt-4 text-[11px] text-muted-foreground flex items-center gap-1.5">
                  <span className="size-2 rounded-full bg-[#32504d]" />
                  Teal highlight indicates the best value in each row.
                </p>
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          )}

          {/* Footer */}
          {freelancers.length > 0 && (
            <div className="flex items-center justify-between gap-3 px-6 py-3 border-t border-border/60 bg-muted/30 shrink-0">
              <Button
                variant="ghost"
                size="sm"
                className="text-muted-foreground hover:text-rose-600 hover:bg-rose-50"
                onClick={() => {
                  clearCompare();
                  toast.success("Comparison cleared");
                }}
              >
                <Trash2 className="size-4" />
                Clear all
              </Button>
              <Button
                size="sm"
                className="bg-[#2b3d3d] hover:bg-[#192d2f] text-white"
                onClick={() => {
                  closeCompare();
                  setView("freelancers");
                }}
              >
                Find Talent
                <ArrowRight className="size-4" />
              </Button>
            </div>
          )}
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}
