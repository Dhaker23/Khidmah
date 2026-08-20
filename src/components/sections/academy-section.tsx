"use client";

/**
 * AcademySection
 * --------------
 * Landing page section — "Khidma Academy".
 *
 * Subtitle: "Learn the skills that pay. Free courses by top Tunisian freelancers."
 *
 * Layout (top → bottom):
 *   1. SectionHeading (eyebrow "KHIDMA ACADEMY" + title "Learn the skills
 *      that pay" + description).
 *   2. Featured course (large, full-width): cover image, title, instructor
 *      with avatar, duration, lessons, level, rating + students, "Start
 *      learning free" button (→ toast), short description, tags.
 *   3. 6 course cards (3×2 grid): each with cover image, category badge,
 *      title, instructor avatar + name, duration, lessons, level, rating +
 *      students, "Enroll free" button (→ toast).
 *   4. Learning paths (3 cards): "Become a Full-Stack Developer" /
 *      "Master Digital Design" / "Start Your Freelance Business" — each with
 *      course count + total hours + "View path" button (→ toast).
 *   5. Academy stats strip: 24 free courses · 8,420+ active learners · 142
 *      hours of content · 4.9★ average rating.
 *   6. Instructor CTA: "Become an instructor" + "Apply to teach" button (→
 *      toast "Instructor applications open quarterly.").
 *
 * Animations: Reveal staggered entrance; framer-motion hover lift on course
 * cards + path cards. Respects prefers-reduced-motion.
 *
 * Palette: Khidma teal only — #475959 #2b3d3d #748684 #192d2f #32504d #6e8580.
 */

import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import {
  Play,
  Clock,
  BookOpen,
  BarChart2,
  Star,
  GraduationCap,
  Sparkles,
  ArrowRight,
  type LucideIcon,
} from "lucide-react";
import { Reveal, Section, SectionHeading } from "@/components/khidma/reveal";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

/* ----------------------------------------------------------------------------
 * Types + static data
 * -------------------------------------------------------------------------- */

type Level = "Beginner" | "Intermediate" | "Advanced" | "All Levels";

interface Course {
  id: string;
  title: string;
  category: string;
  instructor: string;
  avatarSeed: string;
  durationHours: number;
  lessons: number;
  level: Level;
  rating: number;
  students: number;
  coverSeed: string;
  description: string;
  tags?: string[];
}

const LEVEL_STYLES: Record<Level, string> = {
  Beginner: "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-300",
  Intermediate: "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-300",
  Advanced: "border-rose-500/30 bg-rose-500/10 text-rose-700 dark:text-rose-300",
  "All Levels": "border-[#32504d]/30 dark:border-[#32504d]/30 bg-[#32504d]/10 dark:bg-[#32504d]/20 text-[#32504d] dark:text-[#9bb3ae]",
};

const FEATURED_COURSE: Course = {
  id: "feat",
  title: "Complete Freelance Bootcamp 2025",
  category: "Freelancing",
  instructor: "Amira Ben Salah",
  avatarSeed: "AmiraBS",
  durationHours: 12,
  lessons: 48,
  level: "All Levels",
  rating: 4.9,
  students: 1247,
  coverSeed: "khidma-bootcamp",
  description:
    "A 12-hour intensive bootcamp covering everything from setting up your Khidma profile and writing proposals, to pricing, milestone escrow, and scaling to a 6-figure freelance business. Includes templates, scripts, and a private community channel.",
  tags: ["Freelancing", "Business", "Career"],
};

const COURSES: Course[] = [
  {
    id: "c1",
    title: "Next.js 16 Masterclass",
    category: "Development",
    instructor: "Amira Ben Salah",
    avatarSeed: "AmiraBS",
    durationHours: 8,
    lessons: 32,
    level: "Intermediate",
    rating: 4.9,
    students: 892,
    coverSeed: "khidma-nextjs16",
    description:
      "Build production Next.js 16 apps with App Router, server components, streaming, and the new caching model.",
  },
  {
    id: "c2",
    title: "UI/UX Design with Figma",
    category: "Design",
    instructor: "Yassine Gharbi",
    avatarSeed: "YassineG",
    durationHours: 6,
    lessons: 24,
    level: "Beginner",
    rating: 5.0,
    students: 1534,
    coverSeed: "khidma-figma",
    description:
      "Master Figma from the ground up — design systems, components, prototyping, and handoff to developers.",
  },
  {
    id: "c3",
    title: "Motion Graphics in After Effects",
    category: "Video & Animation",
    instructor: "Syrine Mansri",
    avatarSeed: "SyrineM",
    durationHours: 10,
    lessons: 40,
    level: "Intermediate",
    rating: 4.8,
    students: 567,
    coverSeed: "khidma-motion",
    description:
      "From keyframes to complex character animation — build a reel that lands international clients.",
  },
  {
    id: "c4",
    title: "Voice Over for Beginners",
    category: "Music & Audio",
    instructor: "Mehdi Trabelsi",
    avatarSeed: "MehdiT",
    durationHours: 4,
    lessons: 18,
    level: "Beginner",
    rating: 4.9,
    students: 423,
    coverSeed: "khidma-voice",
    description:
      "Set up your home studio, build your demo reel, and land your first voice-over gig in 30 days.",
  },
  {
    id: "c5",
    title: "SEO Mastery 2025",
    category: "Marketing",
    instructor: "Rania Khelifi",
    avatarSeed: "RaniaK",
    durationHours: 7,
    lessons: 28,
    level: "All Levels",
    rating: 4.7,
    students: 678,
    coverSeed: "khidma-seo",
    description:
      "Technical SEO, content strategy, and the 2025 algorithm updates — rank and stay ranked.",
  },
  {
    id: "c6",
    title: "3D Rendering with Blender",
    category: "3D & Animation",
    instructor: "Omar Jlassi",
    avatarSeed: "OmarJ",
    durationHours: 12,
    lessons: 45,
    level: "Advanced",
    rating: 4.9,
    students: 345,
    coverSeed: "khidma-blender",
    description:
      "Photorealistic product rendering, architectural visualization, and Cycles optimization techniques.",
  },
];

interface LearningPath {
  title: string;
  courseCount: number;
  hours: number;
  icon: LucideIcon;
  blurb: string;
}

const LEARNING_PATHS: LearningPath[] = [
  {
    title: "Become a Full-Stack Developer",
    courseCount: 5,
    hours: 40,
    icon: GraduationCap,
    blurb:
      "From HTML to Next.js 16 — everything you need to ship production web apps.",
  },
  {
    title: "Master Digital Design",
    courseCount: 4,
    hours: 28,
    icon: Sparkles,
    blurb:
      "UI/UX, Figma systems, motion graphics, and brand identity from the ground up.",
  },
  {
    title: "Start Your Freelance Business",
    courseCount: 6,
    hours: 35,
    icon: BarChart2,
    blurb:
      "Pricing, proposals, milestone escrow, and scaling to a 6-figure income.",
  },
];

const ACADEMY_STATS: { value: string; label: string }[] = [
  { value: "24", label: "free courses" },
  { value: "8,420+", label: "active learners" },
  { value: "142h", label: "of content" },
  { value: "4.9★", label: "average rating" },
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

function formatStudents(n: number) {
  return n.toLocaleString("en-US");
}

function LevelBadge({ level }: { level: Level }) {
  return (
    <Badge
      variant="outline"
      className={cn("text-[10px] uppercase tracking-wider", LEVEL_STYLES[level])}
    >
      {level}
    </Badge>
  );
}

function CategoryBadge({ category }: { category: string }) {
  return (
    <Badge
      variant="outline"
      className="bg-[#32504d]/8 border-[#32504d]/25 dark:border-[#32504d]/30 text-[#32504d] dark:text-[#9bb3ae] backdrop-blur-sm"
    >
      {category}
    </Badge>
  );
}

function InstructorRow({
  instructor,
  avatarSeed,
}: {
  instructor: string;
  avatarSeed: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <Avatar className="size-7 border border-border/60">
        <AvatarImage src={avatarUrl(avatarSeed)} alt={instructor} />
        <AvatarFallback className="text-[10px] bg-[#32504d] text-white">
          {initials(instructor)}
        </AvatarFallback>
      </Avatar>
      <span className="text-xs font-medium text-foreground/80 truncate">
        {instructor}
      </span>
    </div>
  );
}

function RatingRow({ rating, students }: { rating: number; students: number }) {
  return (
    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
      <Star className="size-3.5 fill-amber-400 text-amber-400" />
      <span className="font-semibold text-foreground">{rating.toFixed(1)}</span>
      <span className="text-muted-foreground/60" aria-hidden>
        ·
      </span>
      <span>{formatStudents(students)} students</span>
    </div>
  );
}

function MetaRow({
  durationHours,
  lessons,
}: {
  durationHours: number;
  lessons: number;
}) {
  return (
    <div className="flex items-center gap-3 text-xs text-muted-foreground">
      <span className="inline-flex items-center gap-1.5">
        <Clock className="size-3.5" />
        {durationHours}h
      </span>
      <span className="text-muted-foreground/40" aria-hidden>
        ·
      </span>
      <span className="inline-flex items-center gap-1.5">
        <BookOpen className="size-3.5" />
        {lessons} lessons
      </span>
    </div>
  );
}

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
 * Featured course card (full-width)
 * -------------------------------------------------------------------------- */

function FeaturedCourse() {
  return (
    <Reveal>
      <Card className="overflow-hidden p-0 border-border/60 bg-background">
        <div className="grid lg:grid-cols-[1.05fr_1fr]">
          {/* Cover */}
          <div className="relative aspect-[16/10] lg:aspect-auto lg:min-h-[360px] overflow-hidden bg-muted">
            <Image
              src={`https://picsum.photos/seed/${FEATURED_COURSE.coverSeed}/960/600`}
              alt={FEATURED_COURSE.title}
              fill
              sizes="(min-width: 1024px) 560px, 100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#192d2f]/85 via-[#192d2f]/25 to-transparent lg:bg-gradient-to-r" />
            <div className="absolute top-4 left-4 flex items-center gap-2">
              <Badge className="bg-amber-400/20 text-amber-200 border-amber-300/30 uppercase tracking-wider text-[10px]">
                <Sparkles className="size-3" />
                Featured course
              </Badge>
              <CategoryBadge category={FEATURED_COURSE.category} />
            </div>
            <div className="absolute bottom-4 left-4 right-4 flex items-center gap-3 text-white/85 text-xs">
              <span className="inline-flex items-center gap-1.5">
                <Clock className="size-3.5" />
                {FEATURED_COURSE.durationHours} hours
              </span>
              <span className="text-white/40" aria-hidden>
                ·
              </span>
              <span className="inline-flex items-center gap-1.5">
                <BookOpen className="size-3.5" />
                {FEATURED_COURSE.lessons} lessons
              </span>
              <span className="text-white/40" aria-hidden>
                ·
              </span>
              <LevelBadge level={FEATURED_COURSE.level} />
            </div>
          </div>

          {/* Info */}
          <div className="flex flex-col gap-4 p-6 sm:p-8">
            <div className="space-y-3">
              <h3 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-foreground leading-tight">
                {FEATURED_COURSE.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {FEATURED_COURSE.description}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <InstructorRow
                instructor={FEATURED_COURSE.instructor}
                avatarSeed={FEATURED_COURSE.avatarSeed}
              />
              <RatingRow
                rating={FEATURED_COURSE.rating}
                students={FEATURED_COURSE.students}
              />
            </div>

            <div className="flex flex-wrap items-center gap-2">
              {(FEATURED_COURSE.tags ?? []).map((tag) => (
                <Badge
                  key={tag}
                  variant="outline"
                  className="border-border/70 text-xs text-muted-foreground"
                >
                  {tag}
                </Badge>
              ))}
            </div>

            <div className="mt-auto pt-3 flex flex-wrap items-center gap-3">
              <Button
                type="button"
                onClick={() =>
                  toast.success("Enrolling you in Freelance Bootcamp...", {
                    description: "Check your inbox for the welcome lesson.",
                  })
                }
                className="bg-[#32504d] hover:bg-[#2b3d3d] text-white"
              >
                <Play className="size-4" />
                Start learning free
              </Button>
              <span className="text-xs text-muted-foreground">
                100% free · Certificate included
              </span>
            </div>
          </div>
        </div>
      </Card>
    </Reveal>
  );
}

/* ----------------------------------------------------------------------------
 * Course card (grid)
 * -------------------------------------------------------------------------- */

function CourseCard({ course, index }: { course: Course; index: number }) {
  return (
    <Reveal delay={index * 0.05}>
      <LiftCard className="h-full">
        <Card className="group h-full p-0 overflow-hidden border-border/60 hover:border-[#32504d]/50 hover:shadow-lg hover:shadow-[#32504d]/10 transition-all duration-300 flex flex-col">
          {/* Cover */}
          <div className="relative aspect-[16/10] overflow-hidden bg-muted">
            <Image
              src={`https://picsum.photos/seed/${course.coverSeed}/480/300`}
              alt={course.title}
              fill
              sizes="(min-width: 1024px) 320px, 50vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#192d2f]/75 via-transparent to-transparent" />
            <div className="absolute top-2.5 left-2.5">
              <CategoryBadge category={course.category} />
            </div>
            <div className="absolute bottom-2.5 left-2.5">
              <LevelBadge level={course.level} />
            </div>
          </div>

          {/* Body */}
          <div className="flex flex-col gap-3 p-4 flex-1">
            <h3 className="font-display text-base font-semibold leading-snug text-foreground group-hover:text-[#32504d] dark:text-[#9bb3ae] dark:group-hover:text-[#9bb3ae] transition-colors line-clamp-2">
              {course.title}
            </h3>

            <InstructorRow
              instructor={course.instructor}
              avatarSeed={course.avatarSeed}
            />

            <MetaRow
              durationHours={course.durationHours}
              lessons={course.lessons}
            />

            <RatingRow rating={course.rating} students={course.students} />

            <div className="mt-auto pt-2">
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() =>
                  toast.success("Enrolled!", {
                    description: `You've joined "${course.title}".`,
                  })
                }
                className="w-full border-[#32504d]/40 text-[#32504d] dark:text-[#9bb3ae] hover:bg-[#32504d]/10 dark:bg-[#32504d]/20 hover:text-[#32504d] dark:text-[#9bb3ae] dark:hover:text-[#9bb3ae]"
              >
                <Play className="size-3.5" />
                Enroll free
              </Button>
            </div>
          </div>
        </Card>
      </LiftCard>
    </Reveal>
  );
}

/* ----------------------------------------------------------------------------
 * Learning path card
 * -------------------------------------------------------------------------- */

function PathCard({ path, index }: { path: LearningPath; index: number }) {
  const Icon = path.icon;
  return (
    <Reveal delay={index * 0.06}>
      <LiftCard className="h-full">
        <Card className="group h-full p-5 border-border/60 hover:border-[#32504d]/50 hover:shadow-lg hover:shadow-[#32504d]/10 transition-all duration-300 flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-lg bg-[#32504d]/10 dark:bg-[#32504d]/20 text-[#32504d] dark:text-[#9bb3ae]">
              <Icon className="size-5" />
            </span>
            <Badge
              variant="outline"
              className="border-border/70 text-[10px] uppercase tracking-wider text-muted-foreground ml-auto"
            >
              Path
            </Badge>
          </div>
          <h3 className="font-display text-base font-bold leading-snug text-foreground">
            {path.title}
          </h3>
          <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
            {path.blurb}
          </p>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1.5">
              <BookOpen className="size-3.5" />
              {path.courseCount} courses
            </span>
            <span className="text-muted-foreground/40" aria-hidden>
              ·
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="size-3.5" />
              {path.hours}h total
            </span>
          </div>
          <button
            type="button"
            onClick={() =>
              toast.info(`Opening path: ${path.title}`, {
                description: `${path.courseCount} courses · ${path.hours}h of content`,
              })
            }
            className="mt-auto inline-flex items-center justify-center gap-1.5 self-start rounded-md bg-[#32504d]/10 dark:bg-[#32504d]/20 hover:bg-[#32504d]/15 dark:bg-[#32504d]/25 text-[#32504d] dark:text-[#9bb3ae] text-sm font-semibold h-9 px-3 transition-colors"
          >
            View path
            <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
          </button>
        </Card>
      </LiftCard>
    </Reveal>
  );
}

/* ----------------------------------------------------------------------------
 * Section
 * -------------------------------------------------------------------------- */

export function AcademySection() {
  return (
    <Section id="academy" className="bg-muted/30">
      <SectionHeading
        eyebrow="KHIDMA ACADEMY"
        title={
          <>
            Learn the{" "}
            <span className="text-[#32504d] dark:text-[#9bb3ae]">
              skills that pay
            </span>
          </>
        }
        description="Free courses by top Tunisian freelancers. From beginner to Pro, level up your freelance career."
      />

      {/* === Featured course === */}
      <FeaturedCourse />

      {/* === 6 course cards === */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {COURSES.map((c, i) => (
          <CourseCard key={c.id} course={c} index={i} />
        ))}
      </div>

      {/* === Learning paths === */}
      <Reveal>
        <div className="mt-12 mb-4">
          <div className="flex items-center gap-2">
            <GraduationCap className="size-4 text-[#748684]" />
            <h3 className="font-display text-lg font-bold text-foreground">
              Learning paths
            </h3>
            <span className="text-xs text-muted-foreground ml-1">
              Curated tracks that take you from zero to hireable
            </span>
          </div>
        </div>
      </Reveal>
      <div className="grid gap-4 sm:grid-cols-3">
        {LEARNING_PATHS.map((p, i) => (
          <PathCard key={p.title} path={p} index={i} />
        ))}
      </div>

      {/* === Academy stats strip === */}
      <Reveal>
        <div className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-4">
          {ACADEMY_STATS.map((s) => (
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

      {/* === Instructor CTA === */}
      <Reveal>
        <Card className="mt-8 p-6 sm:p-8 border-border/60 bg-khidma-gradient text-white relative overflow-hidden">
          <div
            className="absolute -top-12 -right-10 size-44 rounded-full bg-white/5 blur-3xl pointer-events-none"
            aria-hidden
          />
          <div
            className="absolute -bottom-12 -left-10 size-44 rounded-full bg-[#748684]/15 blur-3xl pointer-events-none"
            aria-hidden
          />
          <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-5">
            <div className="flex items-start gap-4">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-white/10 text-white">
                <GraduationCap className="size-5" />
              </span>
              <div className="space-y-1">
                <h3 className="font-display text-lg sm:text-xl font-bold">
                  Become an instructor
                </h3>
                <p className="text-sm text-white/80 leading-relaxed max-w-md">
                  Share your expertise. Earn from your knowledge. Join 40+
                  Tunisian freelancers already teaching on Khidma Academy.
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() =>
                toast.info("Instructor applications open quarterly.", {
                  description:
                    "We'll review your portfolio and respond within 14 days.",
                })
              }
              className="inline-flex items-center justify-center gap-1.5 self-start sm:self-center rounded-md bg-white text-[#192d2f] hover:bg-white/90 text-sm font-semibold h-10 px-5 transition-colors"
            >
              Apply to teach
              <ArrowRight className="size-4" />
            </button>
          </div>
        </Card>
      </Reveal>
    </Section>
  );
}

export default AcademySection;
