"use client";

import { motion } from "framer-motion";
import {
  Clock,
  Users,
  MapPin,
  Wallet,
  ShieldCheck,
  ChevronRight,
  Heart,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useApp } from "@/lib/store";
import { formatTND, type Job } from "@/lib/khidma-data";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export function JobCard({ job, index = 0 }: { job: Job; index?: number }) {
  const openJob = useApp((s) => s.openJob);
  const favorites = useApp((s) => s.favorites);
  const toggleFavorite = useApp((s) => s.toggleFavorite);
  const isFav = favorites.some((fav) => fav.id === job.id && fav.type === "job");

  const onHeartClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleFavorite(job.id, "job");
    toast.success(isFav ? "Removed from saved" : "Saved to favorites", {
      description: job.title,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4, delay: index * 0.04 }}
    >
      <Card
        onClick={() => openJob(job.id)}
        className="khidma-card group cursor-pointer p-5 border-border/60 hover:border-[#32504d]/40"
      >
        <div className="flex items-start justify-between gap-3 mb-2">
          <div className="flex items-center gap-2 flex-wrap">
            <Badge variant="secondary" className="text-[10px] gap-1">
              {job.type === "FIXED" ? "Fixed Price" : "Hourly"}
            </Badge>
            <Badge variant="outline" className="text-[10px] gap-1">
              {job.experienceLevel}
            </Badge>
            <Badge variant="outline" className="text-[10px] gap-1">
              <MapPin className="size-2.5" />
              {job.location}
            </Badge>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            {job.verifiedClient && (
              <span className="hidden sm:inline-flex items-center gap-1 text-[10px] text-[#32504d] dark:text-[#9bb3ae] font-medium shrink-0">
                <ShieldCheck className="size-3" />
                Verified Client
              </span>
            )}
            {/* Heart button */}
            <button
              onClick={onHeartClick}
              aria-label={isFav ? `Remove job from favorites` : `Save job to favorites`}
              aria-pressed={isFav}
              className={cn(
                "size-8 grid place-items-center rounded-full transition-colors",
                isFav
                  ? "text-rose-500 hover:bg-rose-500/10"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              <Heart className={cn("size-4", isFav && "fill-rose-500")} />
            </button>
          </div>
        </div>

        <h3 className="font-semibold text-base leading-snug group-hover:text-[#32504d] dark:group-hover:text-[#9bb3ae] transition-colors mb-2">
          {job.title}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{job.description}</p>

        <div className="flex flex-wrap gap-1 mb-3">
          {job.skills.slice(0, 4).map((skill) => (
            <Badge key={skill} variant="secondary" className="text-[10px] py-0 h-5">
              {skill}
            </Badge>
          ))}
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-border/60">
          <div className="flex items-center gap-1.5 text-sm">
            <Wallet className="size-3.5 text-[#32504d] dark:text-[#9bb3ae]" />
            {job.type === "FIXED" ? (
              <span className="font-semibold">
                {formatTND(job.budget.min)} – {formatTND(job.budget.max)}
              </span>
            ) : (
              <span className="font-semibold">
                {formatTND(job.budget.min)}–{formatTND(job.budget.max)}/hr
              </span>
            )}
          </div>
          <div className="flex items-center gap-3 text-[11px] text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock className="size-3" />
              {job.duration}
            </span>
            <span className="flex items-center gap-1">
              <Users className="size-3" />
              {job.proposals}
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-3 mt-1">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Avatar className="size-5">
              <AvatarFallback className="text-[8px] bg-[#32504d]/10 text-[#32504d] dark:bg-[#32504d]/25 dark:text-[#9bb3ae]">
                {job.postedBy.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <span>{job.postedBy}</span>
            <span>·</span>
            <span>{job.postedAt}</span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 text-xs opacity-0 group-hover:opacity-100 transition-opacity text-[#32504d] dark:text-[#9bb3ae] hover:text-[#2b3d3d] dark:hover:text-white hover:bg-[#32504d]/10 dark:hover:bg-[#32504d]/25"
          >
            View
            <ChevronRight className="size-3 ml-0.5" />
          </Button>
        </div>
      </Card>
    </motion.div>
  );
}
