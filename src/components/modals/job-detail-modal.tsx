"use client";

import { useEffect } from "react";
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
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  MapPin,
  Clock,
  Briefcase,
  CheckCircle2,
  ShieldCheck,
  X,
  Send,
  Bookmark,
  Users,
  Layers,
  GraduationCap,
  Wallet,
  Share2,
  Flag,
} from "lucide-react";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { useApp } from "@/lib/store";
import { toast } from "sonner";
import { jobs, formatTND } from "@/lib/khidma-data";
import { cn } from "@/lib/utils";

export function JobDetailModal() {
  const {
    modal: { selectedJobId },
    closeJob,
    openAuth,
    currentUser,
    openShare,
    openReport,
  } = useApp();

  useEffect(() => {
    if (selectedJobId) {
      const orig = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = orig;
      };
    }
  }, [selectedJobId]);

  if (!selectedJobId) return null;
  const job = jobs.find((j) => j.id === selectedJobId);
  if (!job) return null;

  const handleSubmitProposal = () => {
    if (!currentUser) {
      toast.info("Please log in to submit a proposal.", {
        action: { label: "Log in", onClick: () => openAuth("login") },
      });
      return;
    }
    toast.success("Proposal submitted!", {
      description: "The client will be notified and can review it shortly.",
    });
    closeJob();
  };

  const handleSave = () => {
    toast.success("Job saved", { description: "Find it later in your saved list." });
  };

  return (
    <Dialog open={!!selectedJobId} onOpenChange={(o) => !o && closeJob()}>
      <DialogPortal>
        <DialogOverlay className="bg-[#192d2f]/70 backdrop-blur-sm" />
        <DialogContent
          className="p-0 gap-0 max-w-3xl w-[calc(100vw-1rem)] sm:w-[calc(100vw-2rem)] sm:max-w-3xl max-h-[92vh] flex flex-col overflow-hidden rounded-xl"
          aria-describedby={undefined}
          showCloseButton
        >
          <DialogTitle className="sr-only">{job.title}</DialogTitle>
          <DialogDescription className="sr-only">
            Job: {job.title} posted by {job.postedBy}. Budget{" "}
            {formatTND(job.budget.min)} – {formatTND(job.budget.max)}.
          </DialogDescription>

          {/* Mobile close button overlay */}
          <button
            onClick={closeJob}
            className="absolute top-3 right-3 z-10 size-9 rounded-full bg-black/30 hover:bg-black/50 text-white flex items-center justify-center backdrop-blur-sm lg:hidden"
            aria-label="Close job"
          >
            <X className="size-4" />
          </button>

          {/* Header */}
          <div className="relative px-5 sm:px-7 pt-6 pb-4 border-b border-border/60 bg-gradient-to-br from-[#32504d]/5 to-transparent">
            <div className="flex flex-wrap items-center gap-1.5 mb-2.5">
              <Badge variant="outline" className="text-[10px] gap-1 bg-[#32504d]/5 dark:bg-[#32504d]/15 text-[#32504d] dark:text-[#9bb3ae] border-[#32504d]/20 dark:border-[#32504d]/30">
                <Layers className="size-2.5" />
                {job.category}
              </Badge>
              <Badge variant="outline" className="text-[10px] gap-1">
                {job.type === "FIXED" ? "Fixed price" : "Hourly rate"}
              </Badge>
              <Badge variant="outline" className="text-[10px] gap-1">
                <GraduationCap className="size-2.5" />
                {job.experienceLevel}
              </Badge>
              <Badge variant="outline" className="text-[10px] gap-1">
                <MapPin className="size-2.5" />
                {job.location}
              </Badge>
              <Badge variant="outline" className="text-[10px] gap-1">
                <Clock className="size-2.5" />
                {job.duration}
              </Badge>
            </div>

            <div className="flex items-start justify-between gap-3 pr-8">
              <h2 className="text-xl font-display font-bold leading-snug text-foreground flex-1 min-w-0">
                {job.title}
              </h2>
              <div className="flex items-center gap-1 shrink-0">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="icon"
                      variant="ghost"
                      aria-label={`Share ${job.title}`}
                      className="size-8 text-muted-foreground hover:text-[#32504d] dark:text-[#9bb3ae] hover:bg-[#32504d]/10 dark:bg-[#32504d]/20"
                      onClick={() =>
                        openShare({
                          entityType: "job",
                          entityId: job.id,
                          entityTitle: job.title,
                        })
                      }
                    >
                      <Share2 className="size-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Share</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      size="icon"
                      variant="ghost"
                      aria-label={`Report ${job.title}`}
                      className="size-8 text-muted-foreground hover:text-rose-600 hover:bg-rose-500/10"
                      onClick={() =>
                        openReport({
                          entityType: "job",
                          entityId: job.id,
                          entityTitle: job.title,
                        })
                      }
                    >
                      <Flag className="size-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Report this listing</TooltipContent>
                </Tooltip>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-3 text-xs text-muted-foreground">
              <span>
                Posted by{" "}
                <span className="text-foreground font-semibold">{job.postedBy}</span>
                {job.verifiedClient && (
                  <ShieldCheck className="size-3.5 inline ml-1 text-[#32504d] dark:text-[#9bb3ae]" />
                )}
              </span>
              <span>· {job.postedAt}</span>
              <span>· {job.proposals} proposals</span>
            </div>

            {/* Budget box */}
            <div className="mt-3 rounded-xl border border-border/70 bg-card/60 p-3 flex items-center gap-3">
              <span className="size-10 rounded-lg bg-[#32504d]/10 dark:bg-[#32504d]/20 flex items-center justify-center">
                <Wallet className="size-5 text-[#32504d] dark:text-[#9bb3ae]" />
              </span>
              <div>
                <div className="text-[10px] text-muted-foreground uppercase tracking-wider">
                  {job.type === "FIXED" ? "Budget" : "Hourly rate"}
                </div>
                <div className="text-lg font-bold text-foreground">
                  {formatTND(job.budget.min)}{" "}
                  <span className="text-muted-foreground font-normal text-sm">
                    –
                  </span>{" "}
                  {formatTND(job.budget.max)}
                  {job.type === "HOURLY" && (
                    <span className="text-sm text-muted-foreground font-normal">/hr</span>
                  )}
                </div>
              </div>
              <div className="ml-auto text-right text-[11px] text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Clock className="size-3" />
                  {job.duration}
                </div>
                <div className="mt-0.5">{job.proposals} proposals</div>
              </div>
            </div>
          </div>

          {/* Body */}
          <ScrollArea className="flex-1">
            <div className="px-5 sm:px-7 py-5 space-y-5">
              <div>
                <h3 className="text-sm font-semibold mb-1.5">Project description</h3>
                <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                  {job.description}
                </p>
              </div>

              <div>
                <h3 className="text-sm font-semibold mb-2">Skills required</h3>
                <div className="flex flex-wrap gap-1.5">
                  {job.skills.map((s) => (
                    <Badge
                      key={s}
                      variant="outline"
                      className="bg-[#32504d]/5 dark:bg-[#32504d]/15 text-[#32504d] dark:text-[#9bb3ae] border-[#32504d]/20 dark:border-[#32504d]/30 text-[11px]"
                    >
                      {s}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold mb-2">Requirements</h3>
                <ul className="space-y-1.5">
                  {[
                    `Experience level: ${job.experienceLevel}`,
                    `Location: ${job.location}`,
                    `Duration: ${job.duration}`,
                    "Portfolio with relevant past work",
                    "Strong communication skills",
                    "Available for regular check-ins",
                  ].map((r, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-sm text-muted-foreground"
                    >
                      <CheckCircle2 className="size-4 text-[#32504d] dark:text-[#9bb3ae] shrink-0 mt-0.5" />
                      <span>{r}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Client info */}
              <div className="rounded-xl border border-border/70 p-4">
                <h3 className="text-sm font-semibold mb-3">About the client</h3>
                <div className="flex items-start gap-3">
                  <span className="size-10 rounded-full bg-khidma-gradient flex items-center justify-center text-white text-sm font-bold">
                    {job.postedBy.charAt(0)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="text-sm font-semibold">{job.postedBy}</span>
                      {job.verifiedClient && (
                        <Badge className="bg-[#32504d]/10 dark:bg-[#32504d]/20 text-[#32504d] dark:text-[#9bb3ae] gap-0.5 text-[10px]">
                          <ShieldCheck className="size-2.5" />
                          Verified
                        </Badge>
                      )}
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      Member since 2022 · Tunisia
                    </p>
                    <div className="grid grid-cols-3 gap-2 mt-3 text-xs">
                      <div className="rounded-md bg-muted/40 p-1.5">
                        <div className="text-[10px] text-muted-foreground">
                          Posted
                        </div>
                        <div className="font-semibold text-foreground">12</div>
                      </div>
                      <div className="rounded-md bg-muted/40 p-1.5">
                        <div className="text-[10px] text-muted-foreground">
                          Hired
                        </div>
                        <div className="font-semibold text-foreground">8</div>
                      </div>
                      <div className="rounded-md bg-muted/40 p-1.5">
                        <div className="text-[10px] text-muted-foreground">
                          Avg rate
                        </div>
                        <div className="font-semibold text-foreground">4.8★</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </ScrollArea>

          {/* Sticky footer */}
          <div className="border-t border-border/60 bg-card/60 px-5 sm:px-7 py-3 flex flex-col sm:flex-row items-center gap-2 sm:gap-3">
            <div className="text-xs text-muted-foreground mr-auto">
              <span className="text-foreground font-semibold">
                {formatTND(job.budget.min)} – {formatTND(job.budget.max)}
              </span>
              {job.type === "HOURLY" && "/hr"} · {job.proposals} proposals
            </div>
            <Button
              size="sm"
              variant="outline"
              className="w-full sm:w-auto"
              onClick={handleSave}
            >
              <Bookmark className="size-3.5" /> Save Job
            </Button>
            <Button
              size="sm"
              className="w-full sm:w-auto bg-[#2b3d3d] hover:bg-[#192d2f] text-white"
              onClick={handleSubmitProposal}
            >
              <Send className="size-3.5" /> Submit Proposal
            </Button>
          </div>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}
