"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Clock,
  ChevronDown,
  Users,
  ShoppingBag,
  Briefcase,
  Trash2,
  ArrowRight,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useApp } from "@/lib/store";
import { toast } from "sonner";
import {
  getFreelancerById,
  getAllServices,
  jobs as allJobs,
} from "@/lib/khidma-data";
import type { RecentlyViewedItem } from "@/lib/store";
import { cn } from "@/lib/utils";

/* ---------- time helpers ---------- */

function timeAgoShort(ts: number): string {
  const diff = Date.now() - ts;
  const sec = Math.floor(diff / 1000);
  if (sec < 60) return `${sec}s ago`;
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const day = Math.floor(hr / 24);
  if (day === 1) return "Yesterday";
  if (day < 7) return `${day}d ago`;
  const wk = Math.floor(day / 7);
  return `${wk}w ago`;
}

const typeMeta = {
  freelancer: {
    label: "Freelancer",
    icon: Users,
    color: "text-[#32504d] bg-[#32504d]/10 border-[#32504d]/20 dark:text-[#9bb3ae] dark:bg-[#32504d]/25 dark:border-[#32504d]/30",
  },
  service: {
    label: "Service",
    icon: ShoppingBag,
    color: "text-[#475959] bg-[#475959]/10 border-[#475959]/20 dark:text-[#94a8a4] dark:bg-[#475959]/25 dark:border-[#475959]/30",
  },
  job: {
    label: "Job",
    icon: Briefcase,
    color: "text-[#2b3d3d] bg-[#2b3d3d]/10 border-[#2b3d3d]/20 dark:text-[#94a8a4] dark:bg-[#2b3d3d]/30 dark:border-[#2b3d3d]/40",
  },
} as const;

/* ---------- compact row ---------- */

function RecentRow({ item }: { item: RecentlyViewedItem }) {
  const { openFreelancer, openService, openJob } = useApp();
  const meta = typeMeta[item.type];

  let thumb: React.ReactNode = null;
  let primary = "";
  let secondary = "";

  if (item.type === "freelancer") {
    const f = getFreelancerById(item.id);
    if (!f) return null;
    primary = f.name;
    secondary = f.title;
    thumb = (
      <Avatar className="size-8 border border-border/60">
        <AvatarImage src={f.avatar} alt={f.name} />
        <AvatarFallback className="text-[10px] bg-[#32504d]/10 text-[#32504d] dark:bg-[#32504d]/25 dark:text-[#9bb3ae]">
          {f.name.charAt(0)}
        </AvatarFallback>
      </Avatar>
    );
  } else if (item.type === "service") {
    const s = getAllServices().find((x) => x.id === item.id);
    if (!s) return null;
    primary = s.title;
    secondary = s.category;
    thumb = (
      <div className="relative size-8 rounded-md overflow-hidden bg-muted shrink-0">
        <Image
          src={s.cover}
          alt={s.title}
          fill
          sizes="32px"
          className="object-cover"
        />
      </div>
    );
  } else {
    const job = allJobs.find((x) => x.id === item.id);
    if (!job) return null;
    primary = job.title;
    secondary = job.category;
    thumb = (
      <div className="size-8 rounded-md bg-[#32504d]/10 dark:bg-[#32504d]/25 flex items-center justify-center shrink-0">
        <Briefcase className="size-3.5 text-[#32504d] dark:text-[#9bb3ae]" />
      </div>
    );
  }

  const handleClick = () => {
    if (item.type === "freelancer") openFreelancer(item.id);
    else if (item.type === "service") openService(item.id);
    else openJob(item.id);
  };

  return (
    <motion.button
      layout
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -10, height: 0, marginTop: 0 }}
      transition={{ duration: 0.2 }}
      onClick={handleClick}
      className="group w-full flex items-center gap-2.5 p-2 rounded-lg hover:bg-muted/60 transition-colors text-left"
    >
      <div className="shrink-0">{thumb}</div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium leading-tight truncate group-hover:text-[#32504d] dark:group-hover:text-[#9bb3ae] transition-colors">
          {primary}
        </p>
        <p className="text-[10px] text-muted-foreground truncate">{secondary}</p>
      </div>
      <div className="flex flex-col items-end gap-1 shrink-0">
        <Badge
          variant="outline"
          className={cn("text-[9px] h-4 py-0 px-1 gap-0.5", meta.color)}
        >
          <meta.icon className="size-2.5" />
          {meta.label}
        </Badge>
        <span className="text-[9px] text-muted-foreground">
          {timeAgoShort(item.viewedAt)}
        </span>
      </div>
    </motion.button>
  );
}

/* ---------- empty state ---------- */

function EmptyState() {
  const { setView } = useApp();
  return (
    <div className="text-center py-6 px-3">
      <div className="size-10 rounded-full bg-muted/60 flex items-center justify-center mx-auto mb-2">
        <Clock className="size-5 text-muted-foreground" />
      </div>
      <p className="text-xs font-medium text-foreground">No recent activity</p>
      <p className="text-[11px] text-muted-foreground mt-1">
        Start exploring to see your history here.
      </p>
      <Button
        variant="link"
        size="sm"
        className="mt-1 h-7 text-xs text-[#32504d] dark:text-[#9bb3ae]"
        onClick={() => setView("freelancers")}
      >
        Browse talent
        <ArrowRight className="size-3" />
      </Button>
    </div>
  );
}

/* ---------- main panel ---------- */

export function RecentlyViewedPanel() {
  const { recentlyViewed, clearRecentlyViewed } = useApp();
  const [open, setOpen] = useState(true);

  const recent = useMemo(
    () => recentlyViewed.slice(0, 5),
    [recentlyViewed]
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      <Card className="overflow-hidden border-border/60">
        <Collapsible open={open} onOpenChange={setOpen}>
          <div className="flex items-center justify-between gap-2 px-4 py-3 border-b border-border/60 bg-muted/30">
            <CollapsibleTrigger asChild>
              <button
                className="flex items-center gap-2 text-sm font-semibold text-foreground hover:text-[#32504d] dark:hover:text-[#9bb3ae] transition-colors"
                aria-label={open ? "Collapse recently viewed" : "Expand recently viewed"}
              >
                <Clock className="size-4 text-[#32504d] dark:text-[#9bb3ae]" />
                Recently Viewed
                {recent.length > 0 && (
                  <Badge
                    variant="secondary"
                    className="text-[9px] h-4 py-0 px-1 ml-0.5"
                  >
                    {recent.length}
                  </Badge>
                )}
                <ChevronDown
                  className={cn(
                    "size-3.5 text-muted-foreground transition-transform",
                    open ? "" : "-rotate-90"
                  )}
                />
              </button>
            </CollapsibleTrigger>
            {recent.length > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="h-6 px-2 text-[10px] text-muted-foreground hover:text-rose-600 hover:bg-rose-50"
                onClick={() => {
                  clearRecentlyViewed();
                  toast.success("Recently viewed cleared");
                }}
                aria-label="Clear recently viewed history"
              >
                <Trash2 className="size-3" />
                Clear
              </Button>
            )}
          </div>

          <CollapsibleContent>
            <AnimatePresence mode="popLayout">
              {recent.length === 0 ? (
                <EmptyState key="empty" />
              ) : (
                <motion.div
                  key="list"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="p-1.5 space-y-0.5"
                >
                  <AnimatePresence mode="popLayout">
                    {recent.map((item) => (
                      <RecentRow
                        key={`${item.type}-${item.id}`}
                        item={item}
                      />
                    ))}
                  </AnimatePresence>

                  {recentlyViewed.length > 5 && (
                    <div className="pt-1.5 pb-1 flex items-center justify-center gap-1 text-[10px] text-muted-foreground">
                      +{recentlyViewed.length - 5} more in your history
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </CollapsibleContent>
        </Collapsible>
      </Card>
    </motion.div>
  );
}
