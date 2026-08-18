"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogPortal,
  DialogOverlay,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Star,
  MapPin,
  Clock,
  Briefcase,
  Mail,
  Eye,
  ExternalLink,
  Github,
  Calendar,
  CheckCircle2,
  X,
  Globe,
  Award,
  GraduationCap,
  Send,
  Bookmark,
  MessageSquare,
  FileText,
  ChevronRight,
} from "lucide-react";
import { useApp } from "@/lib/store";
import { toast } from "sonner";
import {
  getFreelancerById,
  reviews as allReviews,
  formatTND,
  formatNumber,
  type PortfolioItem,
} from "@/lib/khidma-data";
import { VerificationBadge, VerificationChecklist } from "@/components/khidma/verification";
import { cn } from "@/lib/utils";

const availabilityConfig = {
  available: {
    label: "Available for work",
    color: "bg-emerald-500/10 text-emerald-700 border-emerald-200",
  },
  limited: {
    label: "Limited availability",
    color: "bg-amber-500/10 text-amber-700 border-amber-200",
  },
  booked: {
    label: "Currently booked",
    color: "bg-rose-500/10 text-rose-700 border-rose-200",
  },
} as const;

const portTypeMeta: Record<
  PortfolioItem["type"],
  { label: string; icon: typeof Eye }
> = {
  image: { label: "Image", icon: Eye },
  video: { label: "Video", icon: Eye },
  audio: { label: "Audio", icon: Eye },
  url: { label: "Link", icon: ExternalLink },
  github: { label: "Repository", icon: Github },
};

function Stars({ rating, size = "sm" }: { rating: number; size?: "sm" | "md" }) {
  const s = size === "md" ? "size-4" : "size-3";
  return (
    <div className="inline-flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={cn(
            s,
            i <= Math.round(rating)
              ? "fill-amber-400 text-amber-400"
              : "fill-muted text-muted-foreground/40"
          )}
        />
      ))}
    </div>
  );
}

function PortfolioCard({ item }: { item: PortfolioItem }) {
  const [expanded, setExpanded] = useState(false);
  const meta = portTypeMeta[item.type];
  const Icon = meta.icon;

  const verifMap = {
    UNVERIFIED: { label: "Unverified", color: "bg-muted text-muted-foreground" },
    SELF_DECLARED: { label: "Self-declared", color: "bg-amber-500/10 text-amber-700" },
    ADMIN_VERIFIED: {
      label: "Admin verified",
      color: "bg-[#32504d]/10 text-[#32504d]",
    },
    EXTERNALLY_VERIFIED: {
      label: "Externally verified",
      color: "bg-[#32504d]/10 text-[#32504d]",
    },
  } as const;
  const v = verifMap[item.verification];

  return (
    <motion.div
      layout
      className="rounded-xl border border-border/70 overflow-hidden bg-card"
    >
      <div className="relative aspect-[16/9] bg-muted overflow-hidden">
        {item.type === "github" ? (
          <div className="size-full flex items-center justify-center bg-[#192d2f]">
            <Github className="size-10 text-white/70" />
          </div>
        ) : (
          <Image
            src={item.cover}
            alt={item.title}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover"
          />
        )}
        <div className="absolute top-2 left-2">
          <Badge className="bg-white/90 text-[#2b3d3d] hover:bg-white/90 text-[10px] gap-1">
            <Icon className="size-2.5" />
            {meta.label}
          </Badge>
        </div>
        <div className="absolute top-2 right-2">
          <Badge className={cn("text-[10px] gap-0.5 border-0", v.color)}>
            <CheckCircle2 className="size-2.5" />
            {v.label}
          </Badge>
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h4 className="text-sm font-semibold leading-snug">{item.title}</h4>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              {item.role} · {item.category}
            </p>
          </div>
          <Button
            size="sm"
            variant="ghost"
            className="h-7 px-2 shrink-0"
            onClick={() => setExpanded((e) => !e)}
          >
            {expanded ? "Hide" : "View"}
            <ChevronRight
              className={cn(
                "size-3.5 transition-transform",
                expanded && "rotate-90"
              )}
            />
          </Button>
        </div>

        <p className="text-xs text-muted-foreground mt-2 line-clamp-2">
          {item.description}
        </p>

        <div className="flex flex-wrap gap-1 mt-2.5">
          {item.skills.map((s) => (
            <Badge
              key={s}
              variant="outline"
              className="text-[10px] bg-[#32504d]/5 text-[#32504d] border-[#32504d]/20"
            >
              {s}
            </Badge>
          ))}
        </div>

        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="mt-3 pt-3 border-t border-border/60 space-y-2">
                {item.results && (
                  <div className="rounded-md bg-[#32504d]/5 border border-[#32504d]/20 p-2.5">
                    <p className="text-[10px] uppercase font-semibold text-[#32504d] tracking-wider">
                      Results achieved
                    </p>
                    <p className="text-xs text-foreground mt-0.5">{item.results}</p>
                  </div>
                )}
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
                <div className="flex gap-2 pt-1">
                  {item.liveUrl && (
                    <a
                      href={item.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-[#32504d] hover:underline"
                    >
                      <ExternalLink className="size-3" /> Live
                    </a>
                  )}
                  {item.repoUrl && (
                    <a
                      href={item.repoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-xs text-[#32504d] hover:underline"
                    >
                      <Github className="size-3" /> Repo
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

export function FreelancerProfileModal() {
  const {
    modal: { selectedFreelancerId },
    closeFreelancer,
    openService,
  openAuth,
    currentUser,
  } = useApp();
  const [tab, setTab] = useState("overview");
  const [lastFreelancerId, setLastFreelancerId] = useState(selectedFreelancerId);
  // Reset tab to overview when a new freelancer is opened (React 19 render-time adjustment)
  if (selectedFreelancerId && selectedFreelancerId !== lastFreelancerId) {
    setLastFreelancerId(selectedFreelancerId);
    setTab("overview");
  }

  useEffect(() => {
    if (selectedFreelancerId) {
      const orig = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = orig;
      };
    }
  }, [selectedFreelancerId]);

  if (!selectedFreelancerId) return null;
  const f = getFreelancerById(selectedFreelancerId);
  if (!f) return null;

  // Mock education + certifications (since data doesn't include them)
  const education = [
    {
      id: "e1",
      school: "ENSI, University of Tunis",
      degree: "M.Sc. Computer Science",
      years: "2015 – 2018",
    },
  ];
  const certifications = [
    { id: "c1", name: "AWS Certified Developer – Associate", year: "2023" },
    { id: "c2", name: "Scrum Master (PSM I)", year: "2022" },
  ];

  const fReviews = allReviews.slice(0, 3);
  const avail = availabilityConfig[f.availability];

  const handleAction = (action: string) => {
    if (!currentUser) {
      toast.info("Please log in to continue.", {
        action: {
          label: "Log in",
          onClick: () => openAuth("login"),
        },
      });
      return;
    }
    toast.success(action);
  };

  return (
    <Dialog
      open={!!selectedFreelancerId}
      onOpenChange={(o) => !o && closeFreelancer()}
    >
      <DialogPortal>
        <DialogOverlay className="bg-[#192d2f]/70 backdrop-blur-sm" />
        <DialogContent
          className="p-0 gap-0 max-w-5xl w-[calc(100%-2rem)] max-h-[92vh] flex flex-col overflow-hidden"
          aria-describedby={undefined}
          showCloseButton
        >
          <DialogTitle className="sr-only">
            {f.name} — {f.title}
          </DialogTitle>
          <DialogDescription className="sr-only">
            Freelancer profile: {f.name}, {f.title} based in {f.location.city}, {f.location.country}.
          </DialogDescription>

          {/* Cover + header */}
          <div className="relative">
            <div className="h-28 sm:h-32 bg-khidma-gradient relative overflow-hidden">
              <div className="absolute -top-12 -right-8 size-44 rounded-full bg-white/5 blur-2xl" />
              <div className="absolute -bottom-12 -left-8 size-52 rounded-full bg-[#6e8580]/20 blur-3xl" />
            </div>
            <div className="absolute -bottom-12 left-5 sm:left-7 flex items-end gap-3">
              <Avatar className="size-20 sm:size-24 border-4 border-background rounded-full">
                <AvatarImage src={f.avatar} alt={f.name} />
                <AvatarFallback className="bg-[#32504d] text-white text-2xl font-bold">
                  {f.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
            </div>
            <div className="absolute top-3 right-3">
              <button
                onClick={closeFreelancer}
                className="size-9 rounded-full bg-black/30 hover:bg-black/50 text-white flex items-center justify-center backdrop-blur-sm lg:hidden"
                aria-label="Close profile"
              >
                <X className="size-4" />
              </button>
            </div>
          </div>

          {/* Header info */}
          <div className="px-5 sm:px-7 pt-14 pb-4 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 border-b border-border/60">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl font-display font-bold text-foreground">
                  {f.name}
                </h2>
                {f.topRated && (
                  <Badge className="bg-amber-500/10 text-amber-700 border-amber-200 gap-0.5">
                    <Award className="size-3" />
                    Top Rated
                  </Badge>
                )}
              </div>
              <p className="text-sm text-[#32504d] font-medium">{f.title}</p>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1">
                  <MapPin className="size-3" />
                  {f.location.city}, {f.location.country}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Globe className="size-3" />
                  {f.languages.join(" · ")}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Calendar className="size-3" />
                  Member since {f.memberSince}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <Button
                size="sm"
                className="bg-[#2b3d3d] hover:bg-[#192d2f] text-white"
                onClick={() => handleAction("Invitation sent to freelancer!")}
              >
                <Send className="size-3.5" />
                Invite to Job
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleAction("Opening conversation…")}
              >
                <Mail className="size-3.5" />
                Contact
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleAction("Proposal request submitted!")}
              >
                <FileText className="size-3.5" />
                Request Proposal
              </Button>
            </div>
          </div>

          {/* Stats row */}
          <div className="px-5 sm:px-7 py-3 flex flex-wrap items-center gap-x-6 gap-y-2 border-b border-border/60 text-xs">
            <div className="inline-flex items-center gap-1.5">
              <Star className="size-4 fill-amber-400 text-amber-400" />
              <span className="font-semibold text-foreground">{f.rating.toFixed(1)}</span>
              <span className="text-muted-foreground">({f.reviewsCount} reviews)</span>
            </div>
            <div className="inline-flex items-center gap-1.5 text-muted-foreground">
              <Briefcase className="size-3.5" />
              <span className="text-foreground font-medium">
                {formatNumber(f.completedProjects)}
              </span>{" "}
              projects
            </div>
            <div className="inline-flex items-center gap-1.5 text-muted-foreground">
              <Clock className="size-3.5" />
              Responds {f.responseTime}
            </div>
            <Badge
              variant="outline"
              className={cn("ml-auto gap-1", avail.color)}
            >
              <span className="size-1.5 rounded-full bg-current" />
              {avail.label}
            </Badge>
            <div className="text-foreground font-semibold">
              {formatTND(f.hourlyRate)}
              <span className="text-muted-foreground font-normal">/hr</span>
            </div>
          </div>

          {/* Tabs */}
          <div className="px-5 sm:px-7 pt-3 border-b border-border/60">
            <Tabs value={tab} onValueChange={setTab}>
              <TabsList className="bg-transparent p-0 h-auto gap-1 w-full justify-start overflow-x-auto">
                {[
                  { v: "overview", l: "Overview" },
                  { v: "portfolio", l: `Portfolio (${f.portfolio.length})` },
                  { v: "services", l: `Services (${f.services.length})` },
                  { v: "reviews", l: `Reviews (${f.reviewsCount})` },
                ].map((t) => (
                  <TabsTrigger
                    key={t.v}
                    value={t.v}
                    className="rounded-md data-[state=active]:bg-[#32504d]/10 data-[state=active]:text-[#32504d] data-[state=active]:shadow-none text-xs px-3 h-8"
                  >
                    {t.l}
                  </TabsTrigger>
                ))}
              </TabsList>

              <TabsContent value="overview" className="mt-0">
                <ScrollArea className="h-[55vh] sm:h-[50vh]">
                  <div className="p-4 sm:p-5 space-y-5">
                    <div className="grid sm:grid-cols-[2fr_1fr] gap-5">
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-sm font-semibold mb-1.5">About</h3>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            {f.bio}
                          </p>
                        </div>
                        <div>
                          <h3 className="text-sm font-semibold mb-2">Skills</h3>
                          <div className="flex flex-wrap gap-1.5">
                            {f.skills.map((s) => (
                              <Badge
                                key={s}
                                variant="outline"
                                className="bg-[#32504d]/5 text-[#32504d] border-[#32504d]/20 text-[11px]"
                              >
                                {s}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div>
                          <h3 className="text-sm font-semibold mb-2">Experience</h3>
                          <ul className="space-y-3">
                            <li className="text-xs">
                              <div className="font-semibold text-foreground">
                                Senior {f.title}
                              </div>
                              <div className="text-muted-foreground">
                                Independent · 2020 — Present
                              </div>
                              <p className="mt-1 text-muted-foreground">
                                Delivered {f.completedProjects}+ projects across
                                fintech, e-commerce, and SaaS for clients in Tunisia
                                and Europe.
                              </p>
                            </li>
                          </ul>
                        </div>
                        <div>
                          <h3 className="text-sm font-semibold mb-2 inline-flex items-center gap-1.5">
                            <GraduationCap className="size-4 text-[#32504d]" />
                            Education
                          </h3>
                          <ul className="space-y-2">
                            {education.map((e) => (
                              <li key={e.id} className="text-xs">
                                <div className="font-semibold text-foreground">
                                  {e.degree}
                                </div>
                                <div className="text-muted-foreground">
                                  {e.school} · {e.years}
                                </div>
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div>
                          <h3 className="text-sm font-semibold mb-2">Certifications</h3>
                          <ul className="space-y-1.5">
                            {certifications.map((c) => (
                              <li
                                key={c.id}
                                className="flex items-center gap-2 text-xs"
                              >
                                <CheckCircle2 className="size-3.5 text-[#32504d]" />
                                <span className="text-foreground">{c.name}</span>
                                <span className="text-muted-foreground">· {c.year}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="rounded-xl border border-border/70 p-4">
                          <h3 className="text-sm font-semibold mb-3 inline-flex items-center gap-1.5">
                            <Award className="size-4 text-[#32504d]" />
                            Why clients trust {f.name.split(" ")[0]}
                          </h3>
                          <VerificationChecklist
                            verified={f.verified}
                            completed={f.completedProjects}
                            reviews={f.reviewsCount}
                            memberSince={f.memberSince}
                          />
                          <div className="flex flex-wrap gap-1.5 mt-4 pt-3 border-t border-border/60">
                            {f.badges.map((b) => (
                              <Badge
                                key={b}
                                variant="outline"
                                className="text-[10px] bg-[#32504d]/5 text-[#32504d] border-[#32504d]/20"
                              >
                                {b}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        <div className="rounded-xl border border-border/70 p-4 space-y-2.5">
                          <h3 className="text-sm font-semibold">Quick stats</h3>
                          <div className="grid grid-cols-2 gap-2 text-xs">
                            <div className="rounded-lg bg-muted/40 p-2">
                              <div className="text-[10px] text-muted-foreground uppercase tracking-wider">
                                Hourly
                              </div>
                              <div className="font-semibold text-foreground">
                                {formatTND(f.hourlyRate)}
                              </div>
                            </div>
                            <div className="rounded-lg bg-muted/40 p-2">
                              <div className="text-[10px] text-muted-foreground uppercase tracking-wider">
                                Response
                              </div>
                              <div className="font-semibold text-foreground">
                                {f.responseTime}
                              </div>
                            </div>
                            <div className="rounded-lg bg-muted/40 p-2">
                              <div className="text-[10px] text-muted-foreground uppercase tracking-wider">
                                Projects
                              </div>
                              <div className="font-semibold text-foreground">
                                {formatNumber(f.completedProjects)}
                              </div>
                            </div>
                            <div className="rounded-lg bg-muted/40 p-2">
                              <div className="text-[10px] text-muted-foreground uppercase tracking-wider">
                                Rating
                              </div>
                              <div className="font-semibold text-foreground">
                                {f.rating.toFixed(1)}★
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </ScrollArea>
              </TabsContent>

              <TabsContent value="portfolio" className="mt-0">
                <ScrollArea className="h-[55vh] sm:h-[50vh]">
                  <div className="p-4 sm:p-5 grid sm:grid-cols-2 gap-4">
                    {f.portfolio.map((p, i) => (
                      <motion.div
                        key={p.id}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: i * 0.05 }}
                      >
                        <PortfolioCard item={p} />
                      </motion.div>
                    ))}
                  </div>
                </ScrollArea>
              </TabsContent>

              <TabsContent value="services" className="mt-0">
                <ScrollArea className="h-[55vh] sm:h-[50vh]">
                  <div className="p-4 sm:p-5 space-y-3">
                    {f.services.map((s, i) => (
                      <motion.div
                        key={s.id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: i * 0.05 }}
                      >
                        <button
                          onClick={() => openService(s.id)}
                          className="w-full text-left rounded-xl border border-border/70 p-4 hover:border-[#32504d]/40 hover:bg-[#32504d]/5 transition-colors group"
                        >
                          <div className="flex items-start gap-3">
                            <div className="relative size-16 rounded-lg overflow-hidden bg-muted shrink-0">
                              <Image
                                src={s.cover}
                                alt={s.title}
                                fill
                                sizes="64px"
                                className="object-cover"
                              />
                            </div>
                            <div className="min-w-0 flex-1">
                              <h4 className="text-sm font-semibold leading-snug group-hover:text-[#32504d] transition-colors">
                                {s.title}
                              </h4>
                              <div className="flex items-center gap-2 mt-1 text-[11px] text-muted-foreground">
                                <span className="inline-flex items-center gap-0.5">
                                  <Star className="size-3 fill-amber-400 text-amber-400" />
                                  {s.rating.toFixed(1)}
                                </span>
                                <span>·</span>
                                <span>{formatNumber(s.ordersCount)} orders</span>
                                <span>·</span>
                                <span>{s.deliveryDays}d delivery</span>
                              </div>
                              <div className="flex flex-wrap gap-1 mt-1.5">
                                {s.skills.slice(0, 3).map((sk) => (
                                  <Badge
                                    key={sk}
                                    variant="outline"
                                    className="text-[10px] bg-[#32504d]/5 text-[#32504d] border-[#32504d]/20"
                                  >
                                    {sk}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            <div className="text-right shrink-0">
                              <div className="text-[10px] text-muted-foreground uppercase tracking-wider">
                                From
                              </div>
                              <div className="font-bold text-foreground">
                                {formatTND(s.startingPrice)}
                              </div>
                              <ChevronRight className="size-4 text-muted-foreground ml-auto mt-1 group-hover:text-[#32504d]" />
                            </div>
                          </div>
                        </button>
                      </motion.div>
                    ))}
                  </div>
                </ScrollArea>
              </TabsContent>

              <TabsContent value="reviews" className="mt-0">
                <ScrollArea className="h-[55vh] sm:h-[50vh]">
                  <div className="p-4 sm:p-5 space-y-4">
                    {/* Aggregate metrics */}
                    <div className="rounded-xl border border-border/70 p-4 grid grid-cols-2 sm:grid-cols-5 gap-3">
                      <div className="col-span-2 sm:col-span-1 text-center sm:text-left">
                        <div className="text-3xl font-bold text-foreground">
                          {f.rating.toFixed(1)}
                        </div>
                        <Stars rating={f.rating} size="md" />
                        <p className="text-[11px] text-muted-foreground mt-1">
                          Based on {f.reviewsCount} reviews
                        </p>
                      </div>
                      <div className="col-span-2 sm:col-span-4 grid sm:grid-cols-2 gap-3">
                        {[
                          { l: "Communication", v: 4.9 },
                          { l: "Quality", v: 4.8 },
                          { l: "Delivery", v: 4.7 },
                          { l: "Professionalism", v: 4.9 },
                        ].map((m) => (
                          <div key={m.l} className="space-y-1">
                            <div className="flex items-center justify-between text-xs">
                              <span className="text-muted-foreground">{m.l}</span>
                              <span className="font-semibold">{m.v.toFixed(1)}</span>
                            </div>
                            <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                              <div
                                className="h-full bg-[#32504d]"
                                style={{ width: `${(m.v / 5) * 100}%` }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Review cards */}
                    <div className="space-y-3">
                      {fReviews.map((r) => (
                        <motion.div
                          key={r.id}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="rounded-xl border border-border/70 p-4"
                        >
                          <div className="flex items-start gap-3">
                            <Avatar className="size-9">
                              <AvatarImage src={r.fromAvatar} alt={r.fromName} />
                              <AvatarFallback>{r.fromName.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center justify-between">
                                <p className="text-sm font-semibold">{r.fromName}</p>
                                <span className="text-[11px] text-muted-foreground">
                                  {r.date}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 mt-0.5">
                                <Stars rating={r.rating} />
                                <span className="text-[11px] text-muted-foreground">
                                  {r.project}
                                </span>
                              </div>
                              <p className="text-sm text-muted-foreground mt-2 leading-relaxed">
                                &quot;{r.comment}&quot;
                              </p>
                              <div className="grid grid-cols-4 gap-2 mt-3 pt-3 border-t border-border/60">
                                {Object.entries(r.metrics).map(([k, v]) => (
                                  <div key={k} className="text-center">
                                    <div className="text-[10px] text-muted-foreground capitalize">
                                      {k}
                                    </div>
                                    <div className="text-xs font-semibold text-foreground">
                                      {v.toFixed(1)}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sticky footer CTA */}
          <div className="border-t border-border/60 bg-card/60 px-5 sm:px-7 py-3 flex flex-col sm:flex-row items-center gap-2 sm:gap-3">
            <div className="text-xs text-muted-foreground mr-auto">
              <span className="text-foreground font-semibold">
                {formatTND(f.hourlyRate)}/hr
              </span>{" "}
              · Responds {f.responseTime}
            </div>
            <Button
              size="sm"
              variant="outline"
              className="w-full sm:w-auto"
              onClick={() => toast.success("Saved to your favorites")}
            >
              <Bookmark className="size-3.5" /> Save
            </Button>
            <Button
              size="sm"
              variant="outline"
              className="w-full sm:w-auto"
              onClick={() => setTab("services")}
            >
              <Briefcase className="size-3.5" /> View Services
            </Button>
            <Button
              size="sm"
              className="w-full sm:w-auto bg-[#2b3d3d] hover:bg-[#192d2f] text-white"
              onClick={() => handleAction("Conversation opened!")}
            >
              <MessageSquare className="size-3.5" /> Contact
            </Button>
          </div>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}
