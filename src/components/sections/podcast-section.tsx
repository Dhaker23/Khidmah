"use client";

/**
 * PodcastSection
 * ---------------
 * Landing page section — "The Khidma Podcast".
 *
 * Subtitle: "Conversations with Tunisian freelancers who are building the
 * future."
 *
 * Layout (top → bottom):
 *   1. SectionHeading (eyebrow "KHIDMA PODCAST" + title + description).
 *   2. Featured episode (2-column, lg): left = cover art (square), right =
 *      episode info (number, title, description, host + avatar, duration,
 *      date, play button (large circular) → toast "Now playing...", "Add to
 *      playlist" → toast, "Share" → toast "Link copied!". Animated waveform
 *      beside play button.
 *   3. Latest episodes list (5 episodes, vertical rows): episode number,
 *      cover thumbnail (64px), title, guest name, duration, date, small
 *      play button. Hover reveals "Listen" action.
 *   4. Subscribe row: 5 platform buttons (Apple Podcasts / Spotify /
 *      Google Podcasts / YouTube / RSS) → toast "Subscribing on {platform}...".
 *   5. Podcast stats: 47 episodes · 12,400+ monthly listeners · 4.9★ on
 *      Apple Podcasts · #1 in Tunisian Business.
 *
 * Animations: Reveal staggered entrance; framer-motion hover on episode
 * rows + featured card; animated waveform beside featured play button
 * (staggered bar animation, paused when prefers-reduced-motion).
 *
 * Palette: Khidma teal only — #475959 #2b3d3d #748684 #192d2f #32504d #6e8580.
 */

import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import {
  Play,
  Plus,
  Share2,
  Clock,
  Calendar,
  Mic2,
  Headphones,
  Rss,
  Youtube,
  Podcast,
  Radio,
  ListPlus,
  type LucideIcon,
} from "lucide-react";
import { Reveal, Section, SectionHeading } from "@/components/khidma/reveal";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

/* ----------------------------------------------------------------------------
 * Static data
 * -------------------------------------------------------------------------- */

interface Episode {
  number: number;
  title: string;
  guest: string;
  avatarSeed: string;
  duration: string;
  date: string;
  coverSeed: string;
}

const HOST = { name: "Skander Mejri", avatarSeed: "SkanderM" };

const FEATURED_EPISODE: Episode = {
  number: 47,
  title: "From Sfax to Silicon Valley: Amira's Journey",
  guest: "Amira Ben Salah",
  avatarSeed: "AmiraBS",
  duration: "52 min",
  date: "Mar 11, 2025",
  coverSeed: "khidma-pod-47",
};

const LATEST_EPISODES: Episode[] = [
  {
    number: 46,
    title: "Building a 6-Figure Design Agency",
    guest: "Yassine Gharbi",
    avatarSeed: "YassineG",
    duration: "45 min",
    date: "Mar 4, 2025",
    coverSeed: "khidma-pod-46",
  },
  {
    number: 45,
    title: "The Art of Voice Over",
    guest: "Mehdi Trabelsi",
    avatarSeed: "MehdiT",
    duration: "38 min",
    date: "Feb 25, 2025",
    coverSeed: "khidma-pod-45",
  },
  {
    number: 44,
    title: "3D Artistry and Blender",
    guest: "Omar Jlassi",
    avatarSeed: "OmarJ",
    duration: "52 min",
    date: "Feb 18, 2025",
    coverSeed: "khidma-pod-44",
  },
  {
    number: 43,
    title: "Copywriting That Converts",
    guest: "Rania Khelifi",
    avatarSeed: "RaniaK",
    duration: "41 min",
    date: "Feb 11, 2025",
    coverSeed: "khidma-pod-43",
  },
  {
    number: 42,
    title: "Motion Design Mastery",
    guest: "Syrine Mansri",
    avatarSeed: "SyrineM",
    duration: "47 min",
    date: "Feb 4, 2025",
    coverSeed: "khidma-pod-42",
  },
];

interface Platform {
  name: string;
  icon: LucideIcon;
}

const PLATFORMS: Platform[] = [
  { name: "Apple Podcasts", icon: Podcast },
  { name: "Spotify", icon: Radio },
  { name: "Google Podcasts", icon: Headphones },
  { name: "YouTube", icon: Youtube },
  { name: "RSS", icon: Rss },
];

const PODCAST_STATS: { value: string; label: string }[] = [
  { value: "47", label: "episodes" },
  { value: "12,400+", label: "monthly listeners" },
  { value: "4.9★", label: "Apple Podcasts" },
  { value: "#1", label: "Tunisian Business" },
];

/* ----------------------------------------------------------------------------
 * Helpers
 * -------------------------------------------------------------------------- */

function avatarUrl(seed: string) {
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
    seed
  )}&backgroundColor=32504d&radius=50`;
}

function initials(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

/* ----------------------------------------------------------------------------
 * Animated waveform (decorative)
 * -------------------------------------------------------------------------- */

const WAVEFORM_BARS = 28;

function Waveform({ playing = false }: { playing?: boolean }) {
  const prefersReduced = useReducedMotion();
  return (
    <div
      className="flex items-end gap-[3px] h-8"
      role="img"
      aria-label="Audio waveform"
    >
      {Array.from({ length: WAVEFORM_BARS }).map((_, i) => {
        const heightPct = 30 + ((i * 53) % 70);
        return (
          <motion.span
            key={i}
            className="w-[3px] rounded-full bg-[#32504d]/60 dark:bg-[#9bb3ae]/70"
            initial={{ height: `${heightPct}%` }}
            animate={
              prefersReduced
                ? { height: `${heightPct}%` }
                : {
                    height: [
                      `${heightPct}%`,
                      `${Math.max(20, heightPct - 25)}%`,
                      `${Math.min(100, heightPct + 15)}%`,
                      `${heightPct}%`,
                    ],
                  }
            }
            transition={
              prefersReduced
                ? undefined
                : {
                    duration: 1.4,
                    repeat: Infinity,
                    repeatType: "mirror",
                    ease: "easeInOut",
                    delay: (i % 7) * 0.08,
                    repeatDelay: playing ? 0 : 0.6,
                  }
            }
          />
        );
      })}
    </div>
  );
}

/* ----------------------------------------------------------------------------
 * Featured episode card (2-column)
 * -------------------------------------------------------------------------- */

function FeaturedEpisode() {
  const prefersReduced = useReducedMotion();
  return (
    <Reveal>
      <motion.div
        whileHover={
          prefersReduced
            ? undefined
            : { y: -4, transition: { duration: 0.25, ease: "easeOut" } }
        }
      >
        <Card className="overflow-hidden p-0 border-border/60 bg-khidma-gradient text-white relative">
          {/* Decorative blobs */}
          <div
            className="absolute -top-16 -right-10 size-56 rounded-full bg-[#748684]/15 blur-3xl pointer-events-none"
            aria-hidden
          />
          <div
            className="absolute -bottom-20 -left-10 size-56 rounded-full bg-amber-300/8 blur-3xl pointer-events-none"
            aria-hidden
          />

          <div className="relative grid gap-6 lg:grid-cols-2 p-6 sm:p-8">
            {/* Cover art */}
            <div className="relative aspect-square w-full max-w-sm mx-auto lg:max-w-none overflow-hidden rounded-2xl ring-1 ring-white/15">
              <Image
                src={`https://picsum.photos/seed/${FEATURED_EPISODE.coverSeed}/600/600`}
                alt={`Cover art for ${FEATURED_EPISODE.title}`}
                fill
                sizes="(min-width: 1024px) 480px, 100vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-[#192d2f]/70 via-[#192d2f]/15 to-transparent" />
              <div className="absolute top-4 left-4">
                <Badge className="bg-amber-400/20 text-amber-200 border-amber-300/30 uppercase tracking-wider text-[10px]">
                  <Mic2 className="size-3" />
                  New episode
                </Badge>
              </div>
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 text-xs text-white/85">
                  <Calendar className="size-3.5" />
                  {FEATURED_EPISODE.date}
                </span>
                <span className="inline-flex items-center gap-1.5 text-xs text-white/85">
                  <Clock className="size-3.5" />
                  {FEATURED_EPISODE.duration}
                </span>
              </div>
            </div>

            {/* Info */}
            <div className="flex flex-col gap-4 justify-center">
              <p className="text-xs uppercase tracking-[0.25em] text-white/60 font-semibold">
                Episode {FEATURED_EPISODE.number} · Featured
              </p>
              <h3 className="font-display text-2xl sm:text-3xl font-bold tracking-tight leading-tight">
                {FEATURED_EPISODE.title}
              </h3>
              <p className="text-sm text-white/80 leading-relaxed">
                Amira went from local gigs in Sfax to contracting with a
                YC-backed startup in San Francisco. In this episode, she breaks
                down the systems, the failures, and the mindset that made it
                possible — and what Tunisian freelancers can steal from her
                playbook today.
              </p>

              {/* Host + guest row */}
              <div className="flex flex-wrap items-center gap-4 pt-1">
                <div className="flex items-center gap-2">
                  <Avatar className="size-8 border border-white/20">
                    <AvatarImage
                      src={avatarUrl(HOST.avatarSeed)}
                      alt={HOST.name}
                    />
                    <AvatarFallback className="text-[10px] bg-[#32504d] text-white">
                      {initials(HOST.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col leading-tight">
                    <span className="text-[10px] uppercase tracking-wider text-white/55">
                      Host
                    </span>
                    <span className="text-xs font-semibold text-white">
                      {HOST.name}
                    </span>
                  </div>
                </div>
                <span className="text-white/30" aria-hidden>
                  |
                </span>
                <div className="flex items-center gap-2">
                  <Avatar className="size-8 border border-white/20">
                    <AvatarImage
                      src={avatarUrl(FEATURED_EPISODE.avatarSeed)}
                      alt={FEATURED_EPISODE.guest}
                    />
                    <AvatarFallback className="text-[10px] bg-[#32504d] text-white">
                      {initials(FEATURED_EPISODE.guest)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col leading-tight">
                    <span className="text-[10px] uppercase tracking-wider text-white/55">
                      Guest
                    </span>
                    <span className="text-xs font-semibold text-white">
                      {FEATURED_EPISODE.guest}
                    </span>
                  </div>
                </div>
              </div>

              {/* Waveform */}
              <div className="hidden sm:flex items-center gap-4 pt-1">
                <Waveform playing />
                <span className="text-[10px] uppercase tracking-wider text-white/55">
                  Now playing
                </span>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() =>
                    toast.success("Now playing...", {
                      description: `Episode ${FEATURED_EPISODE.number} · ${FEATURED_EPISODE.title}`,
                    })
                  }
                  className="inline-flex items-center justify-center gap-2 size-12 rounded-full bg-white text-[#192d2f] hover:bg-white/90 transition-colors shadow-lg shadow-black/10"
                  aria-label={`Play episode ${FEATURED_EPISODE.number}`}
                >
                  <Play className="size-5 fill-[#192d2f]" />
                </button>
                <button
                  type="button"
                  onClick={() =>
                    toast.success("Added to your playlist", {
                      description: FEATURED_EPISODE.title,
                    })
                  }
                  className="inline-flex items-center justify-center gap-1.5 rounded-md border border-white/15 bg-white/5 hover:bg-white/10 text-white text-sm font-semibold h-10 px-4 transition-colors"
                >
                  <Plus className="size-4" />
                  Add to playlist
                </button>
                <button
                  type="button"
                  onClick={() =>
                    toast.success("Link copied!", {
                      description: "Share this episode with your network.",
                    })
                  }
                  className="inline-flex items-center justify-center gap-1.5 rounded-md border border-white/15 bg-white/5 hover:bg-white/10 text-white text-sm font-semibold h-10 px-4 transition-colors"
                >
                  <Share2 className="size-4" />
                  Share
                </button>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>
    </Reveal>
  );
}

/* ----------------------------------------------------------------------------
 * Episode row (latest list)
 * -------------------------------------------------------------------------- */

function EpisodeRow({ episode }: { episode: Episode }) {
  const prefersReduced = useReducedMotion();
  return (
    <motion.div
      whileHover={
        prefersReduced
          ? undefined
          : { x: 4, transition: { duration: 0.2, ease: "easeOut" } }
      }
      className="group"
    >
      <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl border border-transparent hover:border-border/60 hover:bg-background transition-all">
        {/* Episode number (mobile compact) */}
        <div className="hidden sm:flex size-9 shrink-0 items-center justify-center rounded-lg border border-[#32504d]/20 bg-[#32504d]/5">
          <span className="font-display text-xs font-bold text-[#32504d] dark:text-[#9bb3ae]">
            {episode.number}
          </span>
        </div>

        {/* Cover thumbnail */}
        <div className="relative size-12 sm:size-16 shrink-0 overflow-hidden rounded-lg bg-muted">
          <Image
            src={`https://picsum.photos/seed/${episode.coverSeed}/128/128`}
            alt={`Cover art for ${episode.title}`}
            fill
            sizes="64px"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-tr from-[#192d2f]/60 to-transparent" />
          <span className="absolute bottom-1 left-1 text-[9px] font-bold text-white sm:hidden">
            #{episode.number}
          </span>
        </div>

        {/* Title + guest */}
        <div className="min-w-0 flex-1">
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
            Episode {episode.number}
          </p>
          <h4 className="font-display text-sm sm:text-base font-semibold leading-snug text-foreground truncate group-hover:text-[#32504d] dark:group-hover:text-[#9bb3ae] transition-colors">
            {episode.title}
          </h4>
          <div className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground">
            <span className="truncate">with {episode.guest}</span>
            <span className="text-muted-foreground/40" aria-hidden>
              ·
            </span>
            <span className="inline-flex items-center gap-1 shrink-0">
              <Clock className="size-3" />
              {episode.duration}
            </span>
            <span className="hidden md:inline text-muted-foreground/40" aria-hidden>
              ·
            </span>
            <span className="hidden md:inline shrink-0">{episode.date}</span>
          </div>
        </div>

        {/* Play button */}
        <button
          type="button"
          onClick={() =>
            toast.success("Now playing...", {
              description: `Episode ${episode.number} · ${episode.title}`,
            })
          }
          className="inline-flex items-center justify-center gap-1.5 rounded-full bg-[#32504d] hover:bg-[#2b3d3d] text-white text-xs font-semibold h-9 px-3 sm:px-4 transition-colors shrink-0"
          aria-label={`Play episode ${episode.number}: ${episode.title}`}
        >
          <Play className="size-3.5 fill-white" />
          <span className="hidden sm:inline group-hover:inline transition-opacity">
            Listen
          </span>
        </button>
      </div>
    </motion.div>
  );
}

/* ----------------------------------------------------------------------------
 * Subscribe row
 * -------------------------------------------------------------------------- */

function SubscribeRow() {
  return (
    <Reveal>
      <Card className="p-5 sm:p-6 border-border/60 bg-background">
        <div className="flex flex-col lg:flex-row lg:items-center gap-5">
          <div className="space-y-1 lg:max-w-xs">
            <div className="flex items-center gap-2">
              <Headphones className="size-4 text-[#748684]" />
              <h3 className="font-display text-base font-bold text-foreground">
                Subscribe on your favorite platform
              </h3>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              New episodes every Tuesday. Never miss a conversation.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2.5 lg:ml-auto">
            {PLATFORMS.map((p) => {
              const Icon = p.icon;
              return (
                <button
                  key={p.name}
                  type="button"
                  onClick={() =>
                    toast.info(`Subscribing on ${p.name}...`, {
                      description: "Opening your podcast app shortly.",
                    })
                  }
                  className="inline-flex items-center justify-center gap-1.5 rounded-md border border-border/70 bg-background hover:bg-[#32504d]/8 hover:border-[#32504d]/40 text-foreground text-xs sm:text-sm font-medium h-9 px-3 sm:px-3.5 transition-colors"
                >
                  <Icon className="size-3.5 text-[#32504d] dark:text-[#9bb3ae]" />
                  <span className="truncate">{p.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </Card>
    </Reveal>
  );
}

/* ----------------------------------------------------------------------------
 * Section
 * -------------------------------------------------------------------------- */

export function PodcastSection() {
  return (
    <Section id="podcast" className="bg-gradient-to-b from-background via-muted/20 to-background">
      <SectionHeading
        eyebrow="KHIDMA PODCAST"
        title={
          <>
            The <span className="text-[#32504d] dark:text-[#9bb3ae]">Khidma Podcast</span>
          </>
        }
        description="Conversations with Tunisian freelancers who are building the future. New episodes every Tuesday."
      />

      {/* === Featured episode === */}
      <FeaturedEpisode />

      {/* === Latest episodes list === */}
      <Reveal>
        <div className="mt-10 mb-5 flex items-center gap-2">
          <ListPlus className="size-4 text-[#748684]" />
          <h3 className="font-display text-lg font-bold text-foreground">
            Latest episodes
          </h3>
          <span className="text-xs text-muted-foreground ml-1">
            · Updated weekly
          </span>
        </div>
      </Reveal>
      <Reveal delay={0.05}>
        <Card className="p-2 sm:p-3 border-border/60 bg-muted/20">
          <div className="flex flex-col divide-y divide-border/40">
            {LATEST_EPISODES.map((ep) => (
              <EpisodeRow key={ep.number} episode={ep} />
            ))}
          </div>
        </Card>
      </Reveal>

      {/* === Subscribe row === */}
      <div className="mt-10">
        <SubscribeRow />
      </div>

      {/* === Podcast stats === */}
      <Reveal>
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
          {PODCAST_STATS.map((s) => (
            <div
              key={s.label}
              className="rounded-xl border border-border/60 bg-background px-4 py-5 text-center"
            >
              <p className="font-display text-2xl font-bold text-[#32504d] dark:text-[#9bb3ae] leading-tight">
                {s.value}
              </p>
              <p className="mt-1 text-xs uppercase tracking-wider text-muted-foreground">
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </Reveal>
    </Section>
  );
}

export default PodcastSection;
