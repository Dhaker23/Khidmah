"use client";

/**
 * CommunitySection
 * ----------------
 * Landing page section , "The Khidma Community".
 *
 * Subtitle: "Where Tunisian freelancers connect, learn, and grow together."
 *
 * Layout (top → bottom):
 *   1. SectionHeading (eyebrow "KHIDMA COMMUNITY" + title + description).
 *   2. 3-column feature grid:
 *        - Events & Meetups (Calendar)
 *        - Community Forum (MessageCircle)
 *        - Mentorship Program (Users)
 *      Each card has icon + title + description + supporting stat/note +
 *      CTA button (→ toast).
 *   3. Upcoming events row (3 cards): date badge, title, location,
 *      attendee count, Register button (→ toast + pushNotification).
 *   4. Community stats strip (4 inline metrics).
 *   5. Top contributors row (4 mini avatar cards with Top Contributor badge).
 *
 * Animations: Reveal staggered entrance; framer-motion hover lift on cards.
 * Respects prefers-reduced-motion.
 *
 * Palette: Khidma teal only , #475959 #2b3d3d #748684 #192d2f #32504d #6e8580.
 */

import { motion, useReducedMotion } from "framer-motion";
import {
  Calendar,
  MessageCircle,
  Users,
  ArrowRight,
  MapPin,
  UserCheck,
  Star,
  type LucideIcon,
} from "lucide-react";
import Image from "next/image";
import { Reveal, Section, SectionHeading } from "@/components/khidma/reveal";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useApp } from "@/lib/store";
import { useT } from "@/lib/use-t";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

/* ----------------------------------------------------------------------------
 * Static data
 * -------------------------------------------------------------------------- */

interface CommunityFeature {
  icon: LucideIcon;
  title: string;
  description: string;
  note: string;
  cta: string;
  onCta: () => void;
}

interface UpcomingEvent {
  day: string;
  month: string;
  weekday: string;
  title: string;
  location: string;
  registered: number;
  isVirtual: boolean;
}

interface Contributor {
  name: string;
  username: string;
  role: string;
  avatar: string;
  posts: number;
}

const COMMUNITY_STATS: { value: string; key: string }[] = [
  { value: "8,420+", key: "members" },
  { value: "2,847", key: "discussions" },
  { value: "24", key: "cities" },
  { value: "12", key: "meetups" },
];

const UPCOMING_EVENTS: UpcomingEvent[] = [
  {
    day: "15",
    month: "Mar",
    weekday: "Sat",
    title: "Freelance Finance 101: Taxes & Invoicing in Tunisia",
    location: "Virtual",
    registered: 234,
    isVirtual: true,
  },
  {
    day: "20",
    month: "Mar",
    weekday: "Thu",
    title: "Building Your First Next.js App",
    location: "Sfax",
    registered: 89,
    isVirtual: false,
  },
  {
    day: "29",
    month: "Mar",
    weekday: "Sat",
    title: "Portfolio Masterclass with Yassine Gharbi",
    location: "Tunis",
    registered: 156,
    isVirtual: false,
  },
];

const CONTRIBUTORS: Contributor[] = [
  {
    name: "Amira Ben Salah",
    username: "@amira.codes",
    role: "Full-Stack Developer",
    avatar:
      "https://api.dicebear.com/7.x/avataaars/svg?seed=Amira%20Ben%20Salah&backgroundColor=2b3d3d,32504d,475959,6e8580&radius=50",
    posts: 412,
  },
  {
    name: "Yassine Gharbi",
    username: "@yassine.design",
    role: "UI/UX Designer",
    avatar:
      "https://api.dicebear.com/7.x/avataaars/svg?seed=Yassine%20Gharbi&backgroundColor=2b3d3d,32504d,475959,6e8580&radius=50",
    posts: 318,
  },
  {
    name: "Rania Khelifi",
    username: "@rania.copy",
    role: "Copywriter",
    avatar:
      "https://api.dicebear.com/7.x/avataaars/svg?seed=Rania%20Khelifi&backgroundColor=2b3d3d,32504d,475959,6e8580&radius=50",
    posts: 274,
  },
  {
    name: "Omar Jlassi",
    username: "@omar.3d",
    role: "3D Artist",
    avatar:
      "https://api.dicebear.com/7.x/avataaars/svg?seed=Omar%20Jlassi&backgroundColor=2b3d3d,32504d,475959,6e8580&radius=50",
    posts: 231,
  },
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
 * Section
 * -------------------------------------------------------------------------- */

export function CommunitySection() {
  const pushNotification = useApp((s) => s.pushNotification);
  const { t } = useT();

  const features: CommunityFeature[] = [
    {
      icon: Calendar,
      title: t("section.community.events.title"),
      description: t("section.community.events.description"),
      note: t("section.community.events.note"),
      cta: t("section.community.events.cta"),
      onCta: () =>
        toast.info("Opening events calendar…", {
          description: "Loading upcoming Khidma meetups and workshops.",
        }),
    },
    {
      icon: MessageCircle,
      title: t("section.community.forum.title"),
      description: t("section.community.forum.description"),
      note: t("section.community.forum.note"),
      cta: t("section.community.forum.cta"),
      onCta: () =>
        toast.info("Opening community forum…", {
          description: "Join the conversation with 8,420+ Tunisian freelancers.",
        }),
    },
    {
      icon: Users,
      title: t("section.community.mentorship.title"),
      description: t("section.community.mentorship.description"),
      note: t("section.community.mentorship.note"),
      cta: t("section.community.mentorship.cta"),
      onCta: () =>
        toast.info("Mentorship applications open quarterly.", {
          description: "Apply as a mentee or mentor , next cohort in April.",
        }),
    },
  ];

  const handleRegister = (event: UpcomingEvent) => {
    toast.success(`Registered for "${event.title.split(":")[0]}${event.title.includes(":") ? "…" : ""}"`, {
      description: `${event.weekday} ${event.month} ${event.day} · ${event.location}`,
    });
    pushNotification({
      type: "system",
      title: "Event registration confirmed",
      body: `You're registered for "${event.title}" on ${event.weekday} ${event.month} ${event.day}. Calendar invite sent to your email.`,
      link: "dashboard",
    });
  };

  return (
    <Section
      id="community"
      className="bg-gradient-to-b from-background via-[#f5f8f7] to-background dark:via-[#0e1a1b]/40"
    >
      <SectionHeading
        eyebrow={t("section.eyebrow.khidmaCommunity")}
        title={
          <>
            The{" "}
            <span className="text-[#32504d] dark:text-[#9bb3ae]">
              Khidma Community
            </span>
          </>
        }
        description={t("section.community.description")}
      />

      {/* === Feature grid === */}
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {features.map((f, i) => {
          const Icon = f.icon;
          return (
            <Reveal key={f.title} delay={i * 0.08}>
              <LiftCard className="h-full">
                <Card className="h-full flex flex-col p-6 border-border/60 hover:border-[#32504d]/40 transition-colors">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="flex size-11 items-center justify-center rounded-xl bg-[#32504d]/10 dark:bg-[#32504d]/20 text-[#32504d] dark:text-[#9bb3ae]">
                      <Icon className="size-5" />
                    </span>
                    <h3 className="font-display text-lg font-bold text-foreground">
                      {f.title}
                    </h3>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {f.description}
                  </p>
                  <div className="mt-4 rounded-lg bg-[#32504d]/5 dark:bg-[#32504d]/15 border border-[#32504d]/15 px-3 py-2">
                    <p className="text-xs font-medium text-foreground/85">
                      {f.note}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={f.onCta}
                    className="mt-4 group inline-flex items-center gap-1.5 text-sm font-semibold text-[#32504d] dark:text-[#9bb3ae] hover:text-[#2b3d3d] dark:text-[#94a8a4] transition-colors self-start"
                  >
                    {f.cta}
                    <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
                  </button>
                </Card>
              </LiftCard>
            </Reveal>
          );
        })}
      </div>

      {/* === Upcoming events === */}
      <Reveal delay={0.1}>
        <div className="mt-14">
          <div className="flex items-end justify-between mb-6">
            <div>
              <h3 className="font-display text-xl sm:text-2xl font-bold text-foreground">
                {t("section.community.upcomingEvents")}
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {t("section.community.upcomingEventsSubtitle")}
              </p>
            </div>
            <button
              type="button"
              onClick={() =>
                toast.info("Opening events calendar…", {
                  description: "Loading upcoming Khidma meetups and workshops.",
                })
              }
              className="hidden sm:inline-flex items-center gap-1.5 text-sm font-semibold text-[#32504d] dark:text-[#9bb3ae] hover:text-[#2b3d3d] dark:text-[#94a8a4] transition-colors"
            >
              {t("common.viewAll")}
              <ArrowRight className="size-3.5" />
            </button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {UPCOMING_EVENTS.map((event, i) => (
              <Reveal key={event.title} delay={i * 0.08}>
                <LiftCard className="h-full">
                  <Card className="h-full p-5 border-border/60 hover:border-[#32504d]/40 transition-colors flex flex-col">
                    <div className="flex items-start gap-4">
                      {/* Date badge */}
                      <div className="shrink-0 flex flex-col items-center justify-center size-16 rounded-xl bg-khidma-gradient text-white">
                        <span className="text-[10px] uppercase tracking-wider text-white/70">
                          {event.weekday}
                        </span>
                        <span className="font-display text-2xl font-bold leading-none">
                          {event.day}
                        </span>
                        <span className="text-[10px] uppercase tracking-wider text-white/70">
                          {event.month}
                        </span>
                      </div>
                      {/* Title */}
                      <h4 className="text-sm font-semibold text-foreground leading-snug flex-1 line-clamp-3">
                        {event.title}
                      </h4>
                    </div>

                    {/* Meta row */}
                    <div className="mt-4 flex items-center gap-3 text-xs text-muted-foreground">
                      <span className="inline-flex items-center gap-1">
                        <MapPin className="size-3.5 text-[#748684]" />
                        {event.location}
                      </span>
                      <span aria-hidden>·</span>
                      <span className="inline-flex items-center gap-1">
                        <Users className="size-3.5 text-[#748684]" />
                        {event.registered} {t("section.community.registered")}
                      </span>
                    </div>

                    {/* Register button */}
                    <button
                      type="button"
                      onClick={() => handleRegister(event)}
                      className="mt-4 w-full inline-flex items-center justify-center rounded-md bg-[#32504d] hover:bg-[#2b3d3d] text-white text-sm font-semibold h-10 transition-colors"
                    >
                      {t("section.community.register")}
                    </button>
                  </Card>
                </LiftCard>
              </Reveal>
            ))}
          </div>
        </div>
      </Reveal>

      {/* === Community stats strip === */}
      <Reveal delay={0.12}>
        <div className="mt-14 rounded-2xl bg-khidma-gradient overflow-hidden relative">
          <div
            className="absolute -top-10 -right-10 size-40 rounded-full bg-white/5 blur-2xl pointer-events-none"
            aria-hidden
          />
          <div className="relative grid grid-cols-2 sm:grid-cols-4 divide-x divide-white/10">
            {COMMUNITY_STATS.map((s) => (
              <div
                key={s.key}
                className="px-4 py-6 sm:py-7 text-center sm:text-left sm:px-6"
              >
                <div className="font-display text-2xl sm:text-3xl font-bold text-white">
                  {s.value}
                </div>
                <div className="mt-0.5 text-xs uppercase tracking-wider text-white/65">
                  {t(`section.community.stats.${s.key}`)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Reveal>

      {/* === Top contributors === */}
      <Reveal delay={0.14}>
        <div className="mt-14">
          <div className="flex items-end justify-between mb-6">
            <div>
              <h3 className="font-display text-xl sm:text-2xl font-bold text-foreground">
                {t("section.community.topContributors")}
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
                {t("section.community.topContributorsSubtitle")}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {CONTRIBUTORS.map((c, i) => (
              <Reveal key={c.username} delay={i * 0.06}>
                <LiftCard className="h-full">
                  <Card className="h-full p-5 border-border/60 hover:border-[#32504d]/40 transition-colors text-center flex flex-col items-center">
                    <div className="relative">
                      <Image
                        src={c.avatar}
                        alt={c.name}
                        width={56}
                        height={56}
                        className="rounded-full border border-border bg-muted"
                        unoptimized
                      />
                      <span className="absolute -bottom-1 -right-1 flex size-5 items-center justify-center rounded-full bg-[#32504d] text-white ring-2 ring-background">
                        <Star className="size-2.5 fill-white text-white" />
                      </span>
                    </div>
                    <p className="mt-3 font-semibold text-sm text-foreground leading-tight">
                      {c.name}
                    </p>
                    <p className="mt-0.5 text-[11px] text-muted-foreground">
                      {c.role}
                    </p>
                    <Badge
                      variant="outline"
                      className="mt-2.5 border-[#32504d]/30 dark:border-[#32504d]/30 bg-[#32504d]/8 text-[#32504d] dark:text-[#9bb3ae] gap-1"
                    >
                      <UserCheck className="size-3" />
                      {t("section.community.topContributorBadge")}
                    </Badge>
                    <p className="mt-2.5 text-[11px] text-muted-foreground">
                      <span className="font-semibold text-foreground">
                        {c.posts}
                      </span>{" "}
                      {t("section.community.postsQuarter")}
                    </p>
                  </Card>
                </LiftCard>
              </Reveal>
            ))}
          </div>
        </div>
      </Reveal>
    </Section>
  );
}

export default CommunitySection;
