"use client";

/**
 * SuccessStories
 * --------------
 * Long-form case-study section featuring real freelancer journeys on Khidma.
 * Different from Testimonials (which is short quote-based): this shows
 * before/after metrics, key outcomes, and a metrics row at the bottom.
 *
 * Layout:
 *   1. SectionHeading (eyebrow + title + description)
 *   2. Featured story (large full-width card with before/after comparison)
 *   3. Story cards grid (3–4 cards: avatar + excerpt + key metric + tags)
 *   4. Metrics row (4 big numbers)
 *
 * Animations respect `prefers-reduced-motion`.
 */

import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  Calendar,
  MapPin,
  Quote,
  Star,
  TrendingUp,
  Users,
  Wallet,
  Award,
  CheckCircle2,
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Reveal,
  SectionHeading,
  BrandDivider,
} from "@/components/khidma/reveal";
import { VerificationBadge } from "@/components/khidma/verification";
import { freelancers, formatTND } from "@/lib/khidma-data";
import { useT } from "@/lib/use-t";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

/* ----------------------------------------------------------------------------
 * Types + mock data
 * -------------------------------------------------------------------------- */

interface StoryStat {
  label: string;
  value: string;
  icon: LucideIcon;
}

interface SuccessStory {
  id: string;
  freelancerId: string;
  name: string;
  title: string;
  city: string;
  avatar: string;
  excerpt: string;
  quote: string;
  before: StoryStat[];
  after: StoryStat[];
  highlight: string;
  highlightSub?: string;
  tags: string[];
  duration: string;
  featured?: boolean;
}

function f(id: string) {
  return freelancers.find((x) => x.id === id)!;
}

const STORIES: SuccessStory[] = [
  {
    id: "s1",
    freelancerId: "f1",
    name: f("f1").name,
    title: f("f1").title,
    city: f("f1").location.city,
    avatar: f("f1").avatar,
    duration: "18 months",
    featured: true,
    excerpt:
      "I was a CS student in Tunis doing tiny gigs on the side. Within 18 months on Khidma, I went from TND 800/month to TND 5,000/month, and I now work with clients in 7 countries.",
    quote:
      "Khidma didn't just give me clients, it gave me a track record. Every verified project, every review, every milestone built a reputation that now sells my work before I even send a proposal.",
    before: [
      { label: "Monthly income", value: formatTND(800), icon: Wallet },
      { label: "Active clients", value: "2", icon: Users },
      { label: "Portfolio reviews", value: "0", icon: Award },
    ],
    after: [
      { label: "Monthly income", value: formatTND(5000), icon: Wallet },
      { label: "Active clients", value: "12", icon: Users },
      { label: "Avg. rating", value: "4.9 ★", icon: Star },
    ],
    highlight: "+525% income in 18 months",
    highlightSub: "From CS student to Top Rated developer",
    tags: ["Tunis", "Next.js", "18 months"],
  },
  {
    id: "s2",
    freelancerId: "f2",
    name: f("f2").name,
    title: f("f2").title,
    city: f("f2").location.city,
    avatar: f("f2").avatar,
    duration: "12 months",
    excerpt:
      "Started solo in Sfax. Today runs a 6-person design studio serving SaaS clients across MENA and Europe , all originated from Khidma contracts.",
    quote: "",
    before: [],
    after: [],
    highlight: "Built a 6-person agency",
    highlightSub: "From solo to studio in 1 year",
    tags: ["Sfax", "Figma", "Agency"],
  },
  {
    id: "s3",
    freelancerId: "f4",
    name: f("f4").name,
    title: f("f4").title,
    city: f("f4").location.city,
    avatar: f("f4").avatar,
    duration: "9 months",
    excerpt:
      "From local radio spots to voicing ads for brands in France, UAE, and Canada, all booked through Khidma with escrow-protected international payments.",
    quote: "",
    before: [],
    after: [],
    highlight: "40+ international ads voiced",
    highlightSub: "Local talent, global reach",
    tags: ["Tunis", "Voice Over", "International"],
  },
  {
    id: "s4",
    freelancerId: "f6",
    name: f("f6").name,
    title: f("f6").title,
    city: f("f6").location.city,
    avatar: f("f6").avatar,
    duration: "14 months",
    excerpt:
      "3D artist in Monastir rendering for European furniture and cosmetics brands. Earns more from his home studio than he ever did working for local agencies.",
    quote: "",
    before: [],
    after: [],
    highlight: formatTND(4200) + "/mo with EU brands",
    highlightSub: "Premium rates from a Monastir studio",
    tags: ["Monastir", "Blender", "Europe"],
  },
];

const METRICS = [
  {
    icon: Wallet,
    value: "TND 2.4M+",
    label: "Total earned by top 100 freelancers",
  },
  {
    icon: TrendingUp,
    value: "340%",
    label: "Average income increase",
  },
  {
    icon: Users,
    value: "87%",
    label: "Of top freelancers joined in 2023",
  },
  {
    icon: Award,
    value: "12 months",
    label: "Average time to reach Top Rated",
  },
];

/* ----------------------------------------------------------------------------
 * Featured story card (full width, before/after comparison)
 * -------------------------------------------------------------------------- */

function FeaturedStory({ story }: { story: SuccessStory }) {
  const prefersReduced = useReducedMotion();
  const { t } = useT();
  return (
    <motion.article
      initial={prefersReduced ? undefined : { opacity: 0, y: 24 }}
      whileInView={prefersReduced ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      whileHover={prefersReduced ? undefined : { y: -4 }}
      className="group relative"
    >
      <Card className="overflow-hidden border-[#32504d]/20 dark:border-[#32504d]/30 hover:border-[#32504d]/40 hover:shadow-2xl hover:shadow-[#32504d]/10 transition-all duration-300 p-0">
        <div className="grid grid-cols-1 lg:grid-cols-12">
          {/* Left: freelancer + quote */}
          <div className="lg:col-span-7 p-6 sm:p-8 lg:p-10 relative">
            <Quote
              className="absolute top-6 right-6 size-10 text-[#32504d] dark:text-[#9bb3ae]/10"
              aria-hidden
            />
            <div className="flex items-center gap-2 mb-5">
              <Badge className="bg-[#32504d]/10 dark:bg-[#32504d]/20 border-[#32504d]/25 dark:border-[#32504d]/30 text-[#32504d] dark:text-[#9bb3ae] hover:bg-[#32504d]/15 dark:bg-[#32504d]/25">
                {t("section.successStories.featuredStory")}
              </Badge>
              <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                <Calendar className="size-3.5" />
                {story.duration} {t("section.successStories.onKhidma")}
              </span>
            </div>

            <div className="flex items-center gap-4 mb-6">
              <Avatar className="size-16 border-2 border-[#32504d]/30 dark:border-[#32504d]/30">
                <AvatarImage src={story.avatar} alt={story.name} />
                <AvatarFallback className="bg-[#32504d] text-white text-lg">
                  {story.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="min-w-0">
                <h3 className="font-display text-xl sm:text-2xl font-bold text-foreground truncate">
                  {story.name}
                </h3>
                <p className="text-sm text-muted-foreground truncate">
                  {story.title}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                    <MapPin className="size-3" />
                    {story.city}, Tunisia
                  </span>
                  <VerificationBadge type="topRated" size="sm" />
                </div>
              </div>
            </div>

            <blockquote className="relative">
              <p className="font-display text-lg sm:text-xl lg:text-2xl italic leading-relaxed text-foreground/90">
                &ldquo;{story.quote}&rdquo;
              </p>
            </blockquote>

            <div className="mt-7 flex flex-wrap items-center gap-2">
              <Button
                type="button"
                onClick={() =>
                  toast.info("Full case study coming soon", {
                    description: `${story.name}'s complete journey will be published soon.`,
                  })
                }
                className="bg-[#32504d] hover:bg-[#475959] text-white group/btn"
              >
                {t("section.successStories.readFullStory")}
                <ArrowRight className="ml-2 size-4 transition-transform group-hover/btn:translate-x-0.5" />
              </Button>
              <div className="flex flex-wrap gap-1.5">
                {story.tags.map((t) => (
                  <Badge
                    key={t}
                    variant="outline"
                    className="bg-background border-border/70 text-muted-foreground"
                  >
                    {t}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Right: before/after comparison */}
          <div className="lg:col-span-5 border-t lg:border-t-0 lg:border-l border-border/60 bg-gradient-to-br from-[#192d2f] to-[#2b3d3d] text-white p-6 sm:p-8 lg:p-10 relative overflow-hidden">
            <div
              className="absolute inset-0 opacity-[0.06] pointer-events-none"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 80% 20%, #748684 0%, transparent 50%), radial-gradient(circle at 20% 80%, #32504d 0%, transparent 50%)",
              }}
              aria-hidden
            />
            <div className="relative">
              <div className="flex items-center gap-2 mb-6">
                <TrendingUp className="size-5 text-[#9bb3ae]" />
                <h4 className="font-display text-base font-semibold uppercase tracking-wider text-white/90">
                  {t("section.successStories.beforeAfter")}
                </h4>
              </div>

              {/* Before column */}
              <div className="space-y-3 mb-5">
                <div className="text-xs uppercase tracking-[0.2em] text-white/50 font-medium">
                  {t("section.successStories.before")}
                </div>
                {story.before.map((s) => {
                  const Icon = s.icon;
                  return (
                    <div
                      key={s.label}
                      className="flex items-center justify-between gap-3 py-2 border-b border-white/10"
                    >
                      <div className="flex items-center gap-2.5 text-white/70 text-sm">
                        <Icon className="size-4 text-white/50" />
                        {s.label}
                      </div>
                      <span className="font-display text-base font-semibold text-white/80">
                        {s.value}
                      </span>
                    </div>
                  );
                })}
              </div>

              {/* After column */}
              <div className="space-y-3">
                <div className="text-xs uppercase tracking-[0.2em] text-[#9bb3ae] font-medium">
                  {t("section.successStories.after")}
                </div>
                {story.after.map((s) => {
                  const Icon = s.icon;
                  return (
                    <div
                      key={s.label}
                      className="flex items-center justify-between gap-3 py-2 border-b border-[#9bb3ae]/20"
                    >
                      <div className="flex items-center gap-2.5 text-white/90 text-sm">
                        <Icon className="size-4 text-[#9bb3ae]" />
                        {s.label}
                      </div>
                      <span className="font-display text-base font-bold text-white">
                        {s.value}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 rounded-lg bg-[#9bb3ae]/15 border border-[#9bb3ae]/30 px-4 py-3">
                <div className="font-display text-xl font-bold text-white">
                  {story.highlight}
                </div>
                {story.highlightSub && (
                  <div className="text-xs text-white/70 mt-0.5">
                    {story.highlightSub}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </Card>
    </motion.article>
  );
}

/* ----------------------------------------------------------------------------
 * Story card (small, grid)
 * -------------------------------------------------------------------------- */

function StoryCard({ story, index }: { story: SuccessStory; index: number }) {
  const prefersReduced = useReducedMotion();
  const { t } = useT();
  return (
    <motion.article
      initial={prefersReduced ? undefined : { opacity: 0, y: 18 }}
      whileInView={prefersReduced ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{
        duration: 0.5,
        delay: prefersReduced ? 0 : 0.05 + index * 0.07,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={prefersReduced ? undefined : { y: -6 }}
      className="group h-full"
    >
      <Card className="overflow-hidden h-full flex flex-col border-border/60 hover:border-[#32504d]/40 hover:shadow-xl hover:shadow-[#32504d]/8 transition-all duration-300 p-5 sm:p-6">
        <div className="flex items-center gap-3 mb-4">
          <Avatar className="size-12 border border-border/60">
            <AvatarImage src={story.avatar} alt={story.name} />
            <AvatarFallback className="bg-[#32504d] text-white">
              {story.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <h4 className="font-display text-sm font-semibold text-foreground truncate group-hover:text-[#32504d] dark:text-[#9bb3ae] dark:group-hover:text-[#9bb3ae] transition-colors">
              {story.name}
            </h4>
            <p className="text-xs text-muted-foreground truncate">{story.title}</p>
            <div className="flex items-center gap-1 mt-0.5 text-[11px] text-muted-foreground">
              <MapPin className="size-3" />
              {story.city}
            </div>
          </div>
        </div>

        <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3 flex-1">
          {story.excerpt}
        </p>

        <div className="mt-5 rounded-lg bg-gradient-to-br from-[#32504d]/10 to-[#6e8580]/8 dark:from-[#32504d]/20 dark:to-[#6e8580]/12 border border-[#32504d]/20 dark:border-[#32504d]/30 px-4 py-3">
          <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-[0.18em] text-[#748684] dark:text-[#9bb3ae] font-semibold mb-0.5">
            <ArrowUpRight className="size-3" />
            {t("section.successStories.keyOutcome")}
          </div>
          <div className="font-display text-base font-bold text-[#192d2f] dark:text-[#9bb3ae]">
            {story.highlight}
          </div>
          {story.highlightSub && (
            <div className="text-[11px] text-muted-foreground mt-0.5">
              {story.highlightSub}
            </div>
          )}
        </div>

        <div className="mt-4 flex flex-wrap gap-1.5">
          {story.tags.map((t) => (
            <span
              key={t}
              className="inline-flex items-center rounded-full bg-muted/60 border border-border/60 px-2 py-0.5 text-[11px] text-muted-foreground"
            >
              {t}
            </span>
          ))}
        </div>
      </Card>
    </motion.article>
  );
}

/* ----------------------------------------------------------------------------
 * Metric tile
 * -------------------------------------------------------------------------- */

function MetricTile({
  icon: Icon,
  value,
  label,
  index,
}: {
  icon: LucideIcon;
  value: string;
  label: string;
  index: number;
}) {
  const prefersReduced = useReducedMotion();
  return (
    <motion.div
      initial={prefersReduced ? undefined : { opacity: 0, y: 16 }}
      whileInView={prefersReduced ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        duration: 0.5,
        delay: prefersReduced ? 0 : index * 0.08,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="group relative text-center sm:text-left"
    >
      <Icon className="size-5 text-[#32504d] dark:text-[#9bb3ae] mb-3 mx-auto sm:mx-0 transition-transform duration-200 group-hover:-translate-y-0.5" />
      <div className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
        {value}
      </div>
      <div className="mt-1 text-xs sm:text-sm text-muted-foreground leading-snug">
        {label}
      </div>
    </motion.div>
  );
}

/* ----------------------------------------------------------------------------
 * Section
 * -------------------------------------------------------------------------- */

export function SuccessStories() {
  const { t } = useT();
  const featured = STORIES.find((s) => s.featured)!;
  const cards = STORIES.filter((s) => !s.featured);

  return (
    <section
      id="success-stories"
      aria-labelledby="success-stories-heading"
      className="py-16 sm:py-24 bg-gradient-to-b from-background via-[#f7f9f8]/50 to-background dark:via-[#0e1a1b]/30"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow={t("section.eyebrow.khidmaSuccessStories")}
          title={
            <>
              Real freelancers. Real journeys.{" "}
              <span className="text-[#32504d] dark:text-[#9bb3ae]">
                Real results.
              </span>
            </>
          }
          description={t("section.successStories.description")}
        />

        {/* Featured story */}
        <div className="mb-10 sm:mb-14">
          <FeaturedStory story={featured} />
        </div>

        <BrandDivider label="MORE STORIES" className="mb-10" />

        {/* Story cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 mb-12 sm:mb-16">
          {cards.map((s, i) => (
            <StoryCard key={s.id} story={s} index={i} />
          ))}
        </div>

        {/* Metrics row */}
        <Reveal>
          <div className="rounded-2xl border border-[#32504d]/15 bg-gradient-to-br from-[#32504d]/8 via-[#6e8580]/6 to-[#748684]/8 dark:from-[#32504d]/15 dark:via-[#6e8580]/10 dark:to-[#748684]/12 p-6 sm:p-8">
            <div className="flex items-center gap-2 mb-6">
              <CheckCircle2 className="size-5 text-[#32504d] dark:text-[#9bb3ae]" />
              <h3 className="font-display text-base sm:text-lg font-bold tracking-tight text-foreground">
                {t("section.successStories.metricsTitle")}
              </h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              {METRICS.map((m, i) => (
                <MetricTile
                  key={m.label}
                  icon={m.icon}
                  value={m.value}
                  label={m.label}
                  index={i}
                />
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export default SuccessStories;
