"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Heart,
  Trash2,
  Search,
  Users,
  ShoppingBag,
  Briefcase,
  ArrowRight,
  X,
  Bookmark,
  Star,
  Wallet,
  Clock,
} from "lucide-react";
import { useApp } from "@/lib/store";
import { toast } from "sonner";
import {
  getFreelancerById,
  getAllServices,
  jobs as allJobs,
  formatTND,
  formatNumber,
} from "@/lib/khidma-data";
import type { FavoriteItem } from "@/lib/store";
import { cn } from "@/lib/utils";

/* ---------- time helpers ---------- */

function timeAgo(ts: number): string {
  const diff = Date.now() - ts;
  const sec = Math.floor(diff / 1000);
  if (sec < 60) return "just now";
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 24) return `${hr}h ago`;
  const day = Math.floor(hr / 24);
  if (day === 1) return "Yesterday";
  if (day < 7) return `${day}d ago`;
  const wk = Math.floor(day / 7);
  if (wk === 1) return "1w ago";
  if (wk < 4) return `${wk}w ago`;
  const mo = Math.floor(day / 30);
  return `${mo}mo ago`;
}

function savedAtLabel(ts: number): string {
  return `Saved ${timeAgo(ts)}`;
}

/* ---------- type-specific card ---------- */

function FavoriteFreelancerRow({
  item,
  onRemove,
}: {
  item: FavoriteItem;
  onRemove: () => void;
}) {
  const { openFreelancer, closeFavorites } = useApp();
  const f = getFreelancerById(item.id);
  if (!f) return <MissingRow item={item} onRemove={onRemove} />;
  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 40, height: 0, marginTop: 0, marginBottom: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="group flex items-center gap-3 p-3 rounded-xl border border-border/60 bg-card hover:border-[#32504d]/40 hover:shadow-sm transition-all"
    >
      <Avatar className="size-10 border border-border/60 shrink-0">
        <AvatarImage src={f.avatar} alt={f.name} />
        <AvatarFallback className="bg-[#32504d]/10 dark:bg-[#32504d]/20 text-[#32504d] dark:text-[#9bb3ae]">
          {f.name.charAt(0)}
        </AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="font-semibold text-sm truncate">{f.name}</span>
          {f.topRated && (
            <Badge className="bg-amber-50 text-amber-700 border-amber-200 text-[9px] h-4 py-0 px-1">
              Top
            </Badge>
          )}
        </div>
        <p className="text-[11px] text-muted-foreground truncate">{f.title}</p>
        <div className="flex items-center gap-2 mt-1 text-[10px] text-muted-foreground">
          <span className="inline-flex items-center gap-0.5">
            <Star className="size-2.5 fill-amber-400 text-amber-400" />
            {f.rating.toFixed(1)}
          </span>
          <span className="inline-flex items-center gap-0.5">
            <Wallet className="size-2.5 text-[#32504d] dark:text-[#9bb3ae]" />
            {formatTND(f.hourlyRate)}/hr
          </span>
          <span className="inline-flex items-center gap-0.5">
            <Clock className="size-2.5" />
            {savedAtLabel(item.savedAt)}
          </span>
        </div>
      </div>
      <div className="flex flex-col items-end gap-1 shrink-0">
        <Button
          size="sm"
          variant="outline"
          className="h-7 text-xs group-hover:bg-[#2b3d3d] group-hover:text-white group-hover:border-[#2b3d3d] transition-colors"
          onClick={() => {
            closeFavorites();
            openFreelancer(item.id);
          }}
        >
          View
          <ArrowRight className="size-3" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="size-6 text-muted-foreground hover:text-rose-600 hover:bg-rose-50"
          onClick={onRemove}
          aria-label={`Remove ${f.name} from saved items`}
        >
          <Trash2 className="size-3" />
        </Button>
      </div>
    </motion.div>
  );
}

function FavoriteServiceRow({
  item,
  onRemove,
}: {
  item: FavoriteItem;
  onRemove: () => void;
}) {
  const { openService, closeFavorites } = useApp();
  const s = getAllServices().find((x) => x.id === item.id);
  if (!s) return <MissingRow item={item} onRemove={onRemove} />;
  const f = getFreelancerById(s.freelancerId);
  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 40, height: 0, marginTop: 0, marginBottom: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="group flex items-center gap-3 p-3 rounded-xl border border-border/60 bg-card hover:border-[#32504d]/40 hover:shadow-sm transition-all"
    >
      <div className="relative size-10 rounded-lg overflow-hidden bg-muted shrink-0">
        <Image
          src={s.cover}
          alt={s.title}
          fill
          sizes="40px"
          className="object-cover"
        />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium leading-tight line-clamp-1">{s.title}</p>
        <p className="text-[11px] text-muted-foreground truncate">
          by {f?.name ?? "Unknown"}
        </p>
        <div className="flex items-center gap-2 mt-1 text-[10px] text-muted-foreground">
          <span className="inline-flex items-center gap-0.5">
            <Star className="size-2.5 fill-amber-400 text-amber-400" />
            {s.rating.toFixed(1)} ({formatNumber(s.ordersCount)})
          </span>
          <span className="font-semibold text-[#32504d] dark:text-[#9bb3ae]">
            {formatTND(s.startingPrice)}
          </span>
          <span className="inline-flex items-center gap-0.5">
            <Clock className="size-2.5" />
            {savedAtLabel(item.savedAt)}
          </span>
        </div>
      </div>
      <div className="flex flex-col items-end gap-1 shrink-0">
        <Button
          size="sm"
          variant="outline"
          className="h-7 text-xs group-hover:bg-[#2b3d3d] group-hover:text-white group-hover:border-[#2b3d3d] transition-colors"
          onClick={() => {
            closeFavorites();
            openService(item.id);
          }}
        >
          View
          <ArrowRight className="size-3" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="size-6 text-muted-foreground hover:text-rose-600 hover:bg-rose-50"
          onClick={onRemove}
          aria-label={`Remove ${s.title} from saved items`}
        >
          <Trash2 className="size-3" />
        </Button>
      </div>
    </motion.div>
  );
}

function FavoriteJobRow({
  item,
  onRemove,
}: {
  item: FavoriteItem;
  onRemove: () => void;
}) {
  const { openJob, closeFavorites } = useApp();
  const job = allJobs.find((x) => x.id === item.id);
  if (!job) return <MissingRow item={item} onRemove={onRemove} />;
  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 24 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 40, height: 0, marginTop: 0, marginBottom: 0 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="group flex items-center gap-3 p-3 rounded-xl border border-border/60 bg-card hover:border-[#32504d]/40 hover:shadow-sm transition-all"
    >
      <div className="size-10 rounded-lg bg-[#32504d]/10 dark:bg-[#32504d]/20 flex items-center justify-center shrink-0">
        <Briefcase className="size-4 text-[#32504d] dark:text-[#9bb3ae]" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium leading-tight line-clamp-1">{job.title}</p>
        <p className="text-[11px] text-muted-foreground truncate">
          {job.type === "FIXED" ? "Fixed" : "Hourly"} · {job.location}
        </p>
        <div className="flex items-center gap-2 mt-1 text-[10px] text-muted-foreground">
          <span className="inline-flex items-center gap-0.5 font-semibold text-[#32504d] dark:text-[#9bb3ae]">
            <Wallet className="size-2.5" />
            {formatTND(job.budget.min)}–{formatTND(job.budget.max)}
          </span>
          <span className="inline-flex items-center gap-0.5">
            <Clock className="size-2.5" />
            {savedAtLabel(item.savedAt)}
          </span>
        </div>
      </div>
      <div className="flex flex-col items-end gap-1 shrink-0">
        <Button
          size="sm"
          variant="outline"
          className="h-7 text-xs group-hover:bg-[#2b3d3d] group-hover:text-white group-hover:border-[#2b3d3d] transition-colors"
          onClick={() => {
            closeFavorites();
            openJob(item.id);
          }}
        >
          View
          <ArrowRight className="size-3" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="size-6 text-muted-foreground hover:text-rose-600 hover:bg-rose-50"
          onClick={onRemove}
          aria-label={`Remove ${job.title} from saved items`}
        >
          <Trash2 className="size-3" />
        </Button>
      </div>
    </motion.div>
  );
}

function MissingRow({
  item,
  onRemove,
}: {
  item: FavoriteItem;
  onRemove: () => void;
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, height: 0 }}
      className="flex items-center justify-between p-3 rounded-xl border border-dashed border-border/60 bg-muted/30"
    >
      <span className="text-xs text-muted-foreground">
        Item no longer available
      </span>
      <Button
        variant="ghost"
        size="icon"
        className="size-6 text-muted-foreground hover:text-rose-600"
        onClick={onRemove}
        aria-label="Remove unavailable item"
      >
        <Trash2 className="size-3" />
      </Button>
    </motion.div>
  );
}

function FavoriteRow({
  item,
  onRemove,
}: {
  item: FavoriteItem;
  onRemove: () => void;
}) {
  if (item.type === "freelancer")
    return <FavoriteFreelancerRow item={item} onRemove={onRemove} />;
  if (item.type === "service")
    return <FavoriteServiceRow item={item} onRemove={onRemove} />;
  return <FavoriteJobRow item={item} onRemove={onRemove} />;
}

/* ---------- empty state ---------- */

function EmptyState({ onClose }: { onClose: () => void }) {
  const { setView } = useApp();
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="flex-1 flex flex-col items-center justify-center text-center px-6 py-16"
    >
      <div className="relative mb-5">
        <div className="size-24 rounded-full bg-gradient-to-br from-[#32504d]/15 to-[#32504d]/5 flex items-center justify-center">
          <Heart className="size-10 text-[#32504d] dark:text-[#9bb3ae]" />
        </div>
        <span className="absolute -top-1 -right-1 size-7 rounded-full bg-background border-2 border-[#32504d]/20 dark:border-[#32504d]/30 flex items-center justify-center">
          <Bookmark className="size-3.5 text-[#32504d] dark:text-[#9bb3ae]" />
        </span>
      </div>
      <h3 className="font-display text-lg font-semibold text-foreground">
        No saved items yet
      </h3>
      <p className="text-sm text-muted-foreground mt-2 max-w-xs">
        Tap the heart icon on any freelancer, service, or job to save it here
        for later.
      </p>
      <Button
        className="mt-5 bg-[#2b3d3d] hover:bg-[#192d2f] text-white"
        onClick={() => {
          onClose();
          setView("freelancers");
        }}
      >
        Browse the marketplace
        <ArrowRight className="size-4" />
      </Button>
    </motion.div>
  );
}

/* ---------- main sheet ---------- */

export function FavoritesModal() {
  const {
    modal,
    closeFavorites,
    favorites,
    favoritesCount,
    removeFavorite,
    clearFavorites,
  } = useApp();
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState<"all" | "freelancer" | "service" | "job">("all");

  const counts = useMemo(
    () => ({
      all: favorites.length,
      freelancer: favorites.filter((f) => f.type === "freelancer").length,
      service: favorites.filter((f) => f.type === "service").length,
      job: favorites.filter((f) => f.type === "job").length,
    }),
    [favorites]
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return favorites
      .filter((f) => (tab === "all" ? true : f.type === tab))
      .filter((f) => {
        if (!q) return true;
        // Lookup name/title for search
        if (f.type === "freelancer") {
          const fl = getFreelancerById(f.id);
          return fl ? `${fl.name} ${fl.title} ${fl.skills.join(" ")}`.toLowerCase().includes(q) : false;
        }
        if (f.type === "service") {
          const s = getAllServices().find((x) => x.id === f.id);
          const fl = s ? getFreelancerById(s.freelancerId) : null;
          return s
            ? `${s.title} ${s.category} ${fl?.name ?? ""}`.toLowerCase().includes(q)
            : false;
        }
        const job = allJobs.find((x) => x.id === f.id);
        return job ? `${job.title} ${job.category} ${job.skills.join(" ")}`.toLowerCase().includes(q) : false;
      })
      .sort((a, b) => b.savedAt - a.savedAt);
  }, [favorites, tab, search]);

  return (
    <Sheet open={modal.favoritesOpen} onOpenChange={(o) => !o && closeFavorites()}>
      <SheetContent
        side="right"
        className="w-[420px] sm:max-w-[420px] p-0 gap-0 flex flex-col"
      >
        <SheetTitle className="sr-only">Saved items</SheetTitle>
        <SheetDescription className="sr-only">
          Your saved freelancers, services, and jobs
        </SheetDescription>

          {/* Header */}
          <div className="px-5 pt-5 pb-3 border-b border-border/60 bg-gradient-to-b from-[#32504d]/5 to-transparent shrink-0">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="size-8 rounded-lg bg-[#32504d] text-white flex items-center justify-center">
                  <Heart className="size-4" />
                </span>
                <div>
                  <h2 className="font-display text-lg font-bold text-foreground leading-tight">
                    Saved Items
                  </h2>
                  <p className="text-[11px] text-muted-foreground">
                    {favoritesCount} {favoritesCount === 1 ? "item" : "items"}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                {favorites.length > 0 && (
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 text-xs text-muted-foreground hover:text-rose-600 hover:bg-rose-50"
                      >
                        <Trash2 className="size-3.5" />
                        <span className="hidden sm:inline">Clear all</span>
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Clear all saved items?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          This will remove all {favoritesCount} saved freelancers,
                          services, and jobs. This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          className="bg-rose-600 hover:bg-rose-700 text-white"
                          onClick={() => {
                            clearFavorites();
                            toast.success("All saved items cleared");
                          }}
                        >
                          Clear all
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-8"
                  onClick={closeFavorites}
                  aria-label="Close saved items"
                >
                  <X className="size-4" />
                </Button>
              </div>
            </div>

            {/* Search */}
            {favorites.length > 0 && (
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Filter saved items…"
                  className="h-9 pl-8 pr-8 text-sm"
                />
                {search && (
                  <button
                    onClick={() => setSearch("")}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                    aria-label="Clear filter"
                  >
                    <X className="size-3.5" />
                  </button>
                )}
              </div>
            )}

            {/* Tabs */}
            {favorites.length > 0 && (
              <Tabs
                value={tab}
                onValueChange={(v) => setTab(v as typeof tab)}
                className="mt-3"
              >
                <TabsList className="w-full h-9 bg-muted/60">
                  <TabsTrigger value="all" className="text-xs gap-1">
                    All
                    <Badge variant="secondary" className="text-[9px] h-3.5 py-0 px-1">
                      {counts.all}
                    </Badge>
                  </TabsTrigger>
                  <TabsTrigger value="freelancer" className="text-xs gap-1">
                    <Users className="size-3" />
                    {counts.freelancer}
                  </TabsTrigger>
                  <TabsTrigger value="service" className="text-xs gap-1">
                    <ShoppingBag className="size-3" />
                    {counts.service}
                  </TabsTrigger>
                  <TabsTrigger value="job" className="text-xs gap-1">
                    <Briefcase className="size-3" />
                    {counts.job}
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            )}
          </div>

          {/* Body */}
          {favorites.length === 0 ? (
            <EmptyState onClose={closeFavorites} />
          ) : (
            <ScrollArea className="flex-1">
              <div className="p-4 space-y-2">
                {filtered.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-sm text-muted-foreground">
                      No saved items match your filter.
                    </p>
                    <Button
                      variant="link"
                      size="sm"
                      className="mt-2 text-[#32504d] dark:text-[#9bb3ae]"
                      onClick={() => {
                        setSearch("");
                        setTab("all");
                      }}
                    >
                      Reset filter
                    </Button>
                  </div>
                ) : (
                  <AnimatePresence mode="popLayout">
                    {filtered.map((item) => (
                      <FavoriteRow
                        key={`${item.type}-${item.id}`}
                        item={item}
                        onRemove={() => {
                          removeFavorite(item.id, item.type);
                          toast.success("Removed from saved items");
                        }}
                      />
                    ))}
                  </AnimatePresence>
                )}
              </div>
            </ScrollArea>
          )}

          {/* Footer */}
          {favorites.length > 0 && (
            <div className="px-5 py-3 border-t border-border/60 bg-muted/30 shrink-0">
              <p className="text-[11px] text-muted-foreground text-center">
                {favoritesCount} saved {favoritesCount === 1 ? "item" : "items"} ·
                synced to this browser
              </p>
            </div>
          )}
      </SheetContent>
    </Sheet>
  );
}
