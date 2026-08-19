"use client";

/**
 * AwardsSection
 * -------------
 * Landing page section — "Khidma Awards 2025".
 *
 * Subtitle: "Celebrating the best of Tunisian freelance talent."
 *
 * Layout (top → bottom):
 *   1. SectionHeading (eyebrow "KHIDMA AWARDS 2025" + title + description).
 *   2. Featured Winner card (full-width, Amira Ben Salah — Freelancer of
 *      the Year 2025). Large avatar + badge + name + category + quote +
 *      stats (projects / rating / earnings) + View profile button (→
 *      openFreelancer('f1')).
 *   3. 6 award categories (3×2 grid): each card with icon + category name
 *      + winner name + short description. Accent color per category.
 *   4. Nomination card — "Nominate a freelancer for 2026" + Submit
 *      nomination button (→ toast "Nominations open October 2025").
 *   5. Past winners row — 3 past winners (2024, 2023, 2022) with year +
 *      name + category.
 *   6. Ceremony info card — "Awards Ceremony 2025 — December 12, Tunis" +
 *      "Get tickets" button (→ toast).
 *
 * Animations: Reveal staggered entrance; framer-motion hover lift on
 * category cards. Respects prefers-reduced-motion.
 *
 * Palette: Khidma teal base + per-category accent colors (gold / silver /
 * bronze / purple / rose / emerald) — NO indigo/blue.
 */

import { motion, useReducedMotion } from "framer-motion";
import {
  Crown,
  TrendingUp,
  Code2,
  Palette,
  Mic,
  Heart,
  Quote,
  ArrowRight,
  Calendar,
  MapPin,
  Trophy,
  Star,
  Briefcase,
  type LucideIcon,
} from "lucide-react";
import Image from "next/image";
import { Reveal, Section, SectionHeading } from "@/components/khidma/reveal";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useApp } from "@/lib/store";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

/* ----------------------------------------------------------------------------
 * Static data
 * -------------------------------------------------------------------------- */

type AccentKey = "gold" | "silver" | "bronze" | "purple" | "rose" | "emerald";

interface AwardCategory {
  icon: LucideIcon;
  category: string;
  winner: string;
  description: string;
  accent: AccentKey;
}

interface PastWinner {
  year: string;
  name: string;
  category: string;
}

// Tailwind color class maps per accent. Each accent has bg/text/border/icon
// variants so we can theme every category card consistently.
const ACCENT_CLASSES: Record<
  AccentKey,
  { iconWrap: string; badge: string; ring: string }
> = {
  gold: {
    iconWrap: "bg-amber-400/15 text-amber-600",
    badge: "border-amber-400/40 bg-amber-400/10 text-amber-700",
    ring: "group-hover:border-amber-400/50",
  },
  silver: {
    iconWrap: "bg-slate-300/30 text-slate-600 dark:text-slate-300",
    badge: "border-slate-400/40 bg-slate-400/10 text-slate-700 dark:text-slate-200",
    ring: "group-hover:border-slate-400/50",
  },
  bronze: {
    iconWrap: "bg-orange-400/15 text-orange-700 dark:text-orange-300",
    badge: "border-orange-400/40 bg-orange-400/10 text-orange-700 dark:text-orange-300",
    ring: "group-hover:border-orange-400/50",
  },
  purple: {
    iconWrap: "bg-purple-400/15 text-purple-700 dark:text-purple-300",
    badge: "border-purple-400/40 bg-purple-400/10 text-purple-700 dark:text-purple-300",
    ring: "group-hover:border-purple-400/50",
  },
  rose: {
    iconWrap: "bg-rose-400/15 text-rose-700 dark:text-rose-300",
    badge: "border-rose-400/40 bg-rose-400/10 text-rose-700 dark:text-rose-300",
    ring: "group-hover:border-rose-400/50",
  },
  emerald: {
    iconWrap: "bg-emerald-400/15 text-emerald-700 dark:text-emerald-300",
    badge: "border-emerald-400/40 bg-emerald-400/10 text-emerald-700 dark:text-emerald-300",
    ring: "group-hover:border-emerald-400/50",
  },
};

const AWARD_CATEGORIES: AwardCategory[] = [
  {
    icon: Crown,
    category: "Freelancer of the Year",
    winner: "Amira Ben Salah",
    description: "Exceptional quality, communication, and impact.",
    accent: "gold",
  },
  {
    icon: TrendingUp,
    category: "Rising Star",
    winner: "Rania Khelifi",
    description: "Most improved freelancer of the year.",
    accent: "silver",
  },
  {
    icon: Code2,
    category: "Top Rated Developer",
    winner: "Amira Ben Salah",
    description: "Highest-rated in Development.",
    accent: "bronze",
  },
  {
    icon: Palette,
    category: "Design Excellence",
    winner: "Yassine Gharbi",
    description: "Outstanding UI/UX work.",
    accent: "purple",
  },
  {
    icon: Mic,
    category: "Voice of the Year",
    winner: "Mehdi Trabelsi",
    description: "Best voice-over portfolio.",
    accent: "rose",
  },
  {
    icon: Heart,
    category: "Community Champion",
    winner: "Omar Jlassi",
    description: "Most helpful community member.",
    accent: "emerald",
  },
];

const PAST_WINNERS: PastWinner[] = [
  {
    year: "2024",
    name: "Syrine Mansri",
    category: "Freelancer of the Year",
  },
  {
    year: "2023",
    name: "Yassine Gharbi",
    category: "Design Excellence",
  },
  {
    year: "2022",
    name: "Mehdi Trabelsi",
    category: "Voice of the Year",
  },
];

const FEATURED_STATS: { label: string; value: string; icon: LucideIcon }[] = [
  { label: "Projects", value: "142", icon: Briefcase },
  { label: "Rating", value: "4.9★", icon: Star },
  { label: "Lifetime earnings", value: "TND 480K+", icon: Trophy },
];

/* ----------------------------------------------------------------------------
 * Hover-lift wrapper
 * -------------------------------------------------------------------------- */

function LiftCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const prefersReduced = useReducedMotion();
  return (
    <motion.div
      whileHover={
        prefersReduced
          ? undefined
          : { y: -6, transition: { duration: 0.25, ease: "easeOut" } }
      }
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ----------------------------------------------------------------------------
 * Featured winner card
 * -------------------------------------------------------------------------- */

function FeaturedWinner() {
  const openFreelancer = useApp((s) => s.openFreelancer);
  return (
    <Reveal>
      <Card className="overflow-hidden p-0 border-border/60 bg-khidma-gradient text-white relative">
        {/* Decorative blobs */}
        <div
          className="absolute -top-16 -right-10 size-56 rounded-full bg-amber-300/10 blur-3xl pointer-events-none"
          aria-hidden
        />
        <div
          className="absolute -bottom-20 -left-10 size-56 rounded-full bg-[#748684]/15 blur-3xl pointer-events-none"
          aria-hidden
        />

        <div className="relative grid gap-6 lg:grid-cols-[auto_1fr] lg:gap-8 p-6 sm:p-8">
          {/* Avatar + crown badge */}
          <div className="flex flex-col items-center lg:items-start gap-3">
            <div className="relative">
              <Image
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=Amira%20Ben%20Salah&backgroundColor=2b3d3d,32504d,475959,6e8580&radius=50"
                alt="Amira Ben Salah — Khidma Freelancer of the Year 2025"
                width={128}
                height={128}
                className="size-28 sm:size-32 rounded-2xl ring-4 ring-white/15 bg-white/5"
                unoptimized
              />
              <span className="absolute -top-3 -right-3 flex size-9 items-center justify-center rounded-full bg-amber-400 text-white shadow-lg ring-2 ring-white/20">
                <Crown className="size-4" />
              </span>
            </div>
            <Badge className="bg-amber-400/20 text-amber-200 border-amber-300/30 uppercase tracking-wider text-[10px]">
              <Crown className="size-3" />
              Freelancer of the Year 2025
            </Badge>
          </div>

          {/* Name + quote + stats + CTA */}
          <div className="flex flex-col justify-center">
            <p className="text-xs uppercase tracking-[0.2em] text-white/60">
              Khidma Awards 2025 · Featured Winner
            </p>
            <h3 className="mt-1 font-display text-2xl sm:text-3xl font-bold text-white">
              Amira Ben Salah
            </h3>
            <p className="mt-0.5 text-sm text-white/70">
              Full-Stack Web Developer · Tunis · @amira.codes
            </p>

            <figure className="mt-4 rounded-xl border border-white/10 bg-white/5 p-4">
              <Quote className="size-4 text-amber-300/70" />
              <blockquote className="mt-2 text-sm sm:text-base text-white/90 leading-relaxed font-medium">
                &ldquo;Khidma gave me the structure to turn my skills into a
                real business — verified clients, milestone escrow, and a
                community that pushes me to be better every quarter.&rdquo;
              </blockquote>
              <figcaption className="mt-2 text-[11px] text-white/55">
                — Amira, accepting the 2025 award
              </figcaption>
            </figure>

            {/* Stats row */}
            <div className="mt-5 grid grid-cols-3 gap-3">
              {FEATURED_STATS.map((s) => {
                const Icon = s.icon;
                return (
                  <div
                    key={s.label}
                    className="rounded-lg border border-white/10 bg-white/5 px-3 py-2.5"
                  >
                    <Icon className="size-3.5 text-white/60" />
                    <p className="mt-1 font-display text-lg font-bold text-white leading-tight">
                      {s.value}
                    </p>
                    <p className="text-[10px] uppercase tracking-wider text-white/55">
                      {s.label}
                    </p>
                  </div>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => openFreelancer("f1")}
              className="mt-5 inline-flex items-center gap-1.5 self-start rounded-md bg-white text-[#192d2f] hover:bg-white/90 text-sm font-semibold h-10 px-4 transition-colors"
            >
              View profile
              <ArrowRight className="size-3.5" />
            </button>
          </div>
        </div>
      </Card>
    </Reveal>
  );
}

/* ----------------------------------------------------------------------------
 * Section
 * -------------------------------------------------------------------------- */

export function AwardsSection() {
  return (
    <Section
      id="awards"
      className="bg-muted/30"
    >
      <SectionHeading
        eyebrow="KHIDMA AWARDS 2025"
        title={
          <>
            Celebrating the best of{" "}
            <span className="text-[#32504d] dark:text-[#9bb3ae]">
              Tunisian freelance talent
            </span>
          </>
        }
        description="Every year, we honor the freelancers who went above and beyond. Nominations are open to all verified members."
      />

      {/* === Featured winner === */}
      <FeaturedWinner />

      {/* === 6 award categories === */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {AWARD_CATEGORIES.map((a, i) => {
          const Icon = a.icon;
          const accent = ACCENT_CLASSES[a.accent];
          return (
            <Reveal key={a.category} delay={i * 0.06}>
              <LiftCard className="h-full">
                <Card
                  className={cn(
                    "group h-full p-5 border-border/60 transition-colors",
                    accent.ring
                  )}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <span
                      className={cn(
                        "flex size-10 items-center justify-center rounded-lg",
                        accent.iconWrap
                      )}
                    >
                      <Icon className="size-5" />
                    </span>
                    <Badge
                      variant="outline"
                      className={cn(
                        "ml-auto text-[10px] uppercase tracking-wider",
                        accent.badge
                      )}
                    >
                      Winner 2025
                    </Badge>
                  </div>
                  <h3 className="font-display text-base font-bold text-foreground leading-snug">
                    {a.category}
                  </h3>
                  <p className="mt-0.5 text-sm font-semibold text-[#32504d] dark:text-[#9bb3ae]">
                    {a.winner}
                  </p>
                  <p className="mt-1.5 text-xs text-muted-foreground leading-relaxed">
                    {a.description}
                  </p>
                </Card>
              </LiftCard>
            </Reveal>
          );
        })}
      </div>

      {/* === Nomination + Ceremony (2-col on lg) === */}
      <div className="mt-8 grid gap-4 lg:grid-cols-2">
        {/* Nomination card */}
        <Reveal>
          <Card className="h-full p-6 border-border/60 bg-background flex flex-col">
            <div className="flex items-center gap-3 mb-3">
              <span className="flex size-10 items-center justify-center rounded-lg bg-[#32504d]/10 text-[#32504d]">
                <Trophy className="size-5" />
              </span>
              <h3 className="font-display text-lg font-bold text-foreground">
                Nominate a freelancer for 2026
              </h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Know a Khidma freelancer who deserves recognition? Submit their
              name and a short note about why they should win next year. Open
              to all verified members.
            </p>
            <button
              type="button"
              onClick={() =>
                toast.info("Nominations open October 2025", {
                  description:
                    "We'll email all verified members when submissions go live.",
                })
              }
              className="mt-4 inline-flex items-center justify-center gap-1.5 rounded-md bg-[#32504d] hover:bg-[#2b3d3d] text-white text-sm font-semibold h-10 px-4 transition-colors self-start"
            >
              Submit nomination
              <ArrowRight className="size-3.5" />
            </button>
          </Card>
        </Reveal>

        {/* Ceremony info card */}
        <Reveal delay={0.06}>
          <Card className="h-full p-6 border-border/60 bg-khidma-gradient text-white relative overflow-hidden">
            <div
              className="absolute -top-10 -right-10 size-32 rounded-full bg-white/5 blur-2xl pointer-events-none"
              aria-hidden
            />
            <div className="relative flex flex-col h-full">
              <div className="flex items-center gap-3 mb-3">
                <span className="flex size-10 items-center justify-center rounded-lg bg-white/10 text-white">
                  <Calendar className="size-5" />
                </span>
                <h3 className="font-display text-lg font-bold">
                  Awards Ceremony 2025
                </h3>
              </div>
              <p className="text-sm text-white/80 leading-relaxed">
                Join us in Tunis to celebrate this year's winners. Live
                ceremony, panel talks, and networking with the community.
              </p>
              <div className="mt-4 flex flex-wrap items-center gap-4 text-sm">
                <span className="inline-flex items-center gap-1.5">
                  <Calendar className="size-4 text-white/65" />
                  December 12, 2025
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="size-4 text-white/65" />
                  Tunis
                </span>
              </div>
              <button
                type="button"
                onClick={() =>
                  toast.success("Tickets available September 2025", {
                    description:
                      "Khidma verified members get priority access + 50% off.",
                  })
                }
                className="mt-5 inline-flex items-center justify-center gap-1.5 rounded-md bg-white text-[#192d2f] hover:bg-white/90 text-sm font-semibold h-10 px-4 transition-colors self-start"
              >
                Get tickets
                <ArrowRight className="size-3.5" />
              </button>
            </div>
          </Card>
        </Reveal>
      </div>

      {/* === Past winners === */}
      <Reveal delay={0.08}>
        <div className="mt-10">
          <div className="flex items-center gap-2 mb-5">
            <Trophy className="size-4 text-[#748684]" />
            <h3 className="font-display text-lg font-bold text-foreground">
              Past winners
            </h3>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            {PAST_WINNERS.map((p, i) => (
              <Reveal key={p.year} delay={i * 0.06}>
                <Card className="p-4 border-border/60 flex items-center gap-4">
                  <div className="flex size-14 shrink-0 flex-col items-center justify-center rounded-xl border border-[#32504d]/20 bg-[#32504d]/5">
                    <span className="text-[9px] uppercase tracking-wider text-muted-foreground">
                      Year
                    </span>
                    <span className="font-display text-lg font-bold text-[#32504d] dark:text-[#9bb3ae] leading-none">
                      {p.year}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-sm text-foreground leading-tight truncate">
                      {p.name}
                    </p>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {p.category}
                    </p>
                  </div>
                </Card>
              </Reveal>
            ))}
          </div>
        </div>
      </Reveal>
    </Section>
  );
}

export default AwardsSection;
