# Task ID: ROUND9-FEATURES-1 — Khidma Academy + Podcast Sections

**Agent:** full-stack-developer (academy + podcast)
**Scope:** Khidma landing page — 2 new landing sections (AcademySection + PodcastSection), all inside the `/` route.

## Task

Build 2 new landing page sections and add them to the landing composition between `AwardsSection` and `FAQ`:

1. **`academy-section.tsx`** — "Khidma Academy" educational courses section:
   featured course (Freelance Bootcamp 2025) + 6 course cards (3×2 grid) + 3 learning paths + academy stats strip + instructor CTA card.
2. **`podcast-section.tsx`** — "The Khidma Podcast" section:
   featured episode (Ep 47: Amira) + 5 latest episodes list + 5-platform subscribe row + podcast stats.

All Khidma teal palette only, framer-motion animations, `prefers-reduced-motion` respected, mobile responsive, sonner toasts for all CTAs.

## Work Log

- Read `worklog.md` (full project context), `khidma-data.ts`, `reveal.tsx`, `awards-section.tsx`, `blog-section.tsx`, and sections barrel `index.ts` to align with existing conventions.
- Confirmed brand tokens: `bg-khidma-gradient`, `font-display`, `text-[#32504d]`, `dark:text-[#9bb3ae]`. Confirmed `toast` from sonner for CTA feedback.
- Previous agent work records reviewed in `/agent-ctx/`: ROUND8-STYLING-1 (featured banner + typing hero + pulse widget), ROUND7-FEATURES-1 (partners + mobile promo), ROUND7-STYLING-1 (success stories + trust center) — all confirmed existing patterns followed.

### Files created

- **`src/components/sections/academy-section.tsx`** (~470 lines):
  - `SectionHeading` (eyebrow + title "Learn the skills that pay" + description).
  - Featured course card (full-width, 2-col): cover image (picsum), badges, title, description, instructor (Amira) with avatar, duration/lessons/level overlays, rating + students, 3 tags, "Start learning free" button → toast.
  - 6 course cards (3×2 grid): Next.js 16, UI/UX Design with Figma, Motion Graphics in After Effects, Voice Over for Beginners, SEO Mastery 2025, 3D Rendering with Blender — each with cover, category + level badges (color-coded), instructor, meta row, rating, "Enroll free" button → toast.
  - Learning paths (3 cards): Become a Full-Stack Developer, Master Digital Design, Start Your Freelance Business — icon + blurb + meta + "View path" button → toast.
  - Academy stats strip: 24 free courses · 8,420+ active learners · 142h of content · 4.9★ average rating.
  - Instructor CTA card (`bg-khidma-gradient`): "Become an instructor" + "Apply to teach" → toast "Instructor applications open quarterly."
  - `Reveal` staggered entrance + `LiftCard` (motion.div y:-6 hover). `useReducedMotion` respected.
  - Helpers: `avatarUrl` (dicebear), `initials`, `formatStudents`, `LevelBadge` (per-level color: emerald/amber/rose/[#32504d]), `CategoryBadge`, `InstructorRow`, `RatingRow`, `MetaRow`.

- **`src/components/sections/podcast-section.tsx`** (~470 lines):
  - `SectionHeading` (eyebrow "KHIDMA PODCAST" + title "The Khidma Podcast" + description).
  - Featured episode card (2-col, `bg-khidma-gradient`): left = square cover art with "New episode" badge + date/duration overlays; right = "Episode 47 · Featured" eyebrow + title "From Sfax to Silicon Valley: Amira's Journey" + 3-line description + host (Skander Mejri) + guest (Amira Ben Salah) avatars + animated `Waveform` (28 motion.span bars, staggered mirror repeat, paused on reduced-motion) + "Now playing" label + 3 actions: large circular Play button → toast "Now playing...", "Add to playlist" → toast, "Share" → toast "Link copied!".
  - Latest episodes list (5 rows, vertical, Card with divide-y): each row has episode number badge + 64px cover thumbnail + "Episode N" eyebrow + title + "with {guest}" + duration + date + small Play button labeled "Listen" (sm+). Hover: `motion.div whileHover={{ x: 4 }}`. Episodes 46→42 covered.
  - Subscribe row: "Subscribe on your favorite platform" + 5 platform buttons (Apple Podcasts / Spotify / Google Podcasts / YouTube / RSS) with appropriate lucide icons (Podcast / Radio / Headphones / Youtube / Rss). Each → toast "Subscribing on {platform}...".
  - Podcast stats strip: 47 episodes · 12,400+ monthly listeners · 4.9★ Apple Podcasts · #1 Tunisian Business.
  - `Reveal` staggered entrance + framer-motion hover on featured card (y:-4) + episode rows (x:4) + Waveform per-bar staggered mirror animation. `useReducedMotion` respected.

### Files modified

- **`src/components/sections/index.ts`**: Added 2 exports — `AcademySection` + `PodcastSection` (after `AwardsSection`, before `FAQ`).
- **`src/app/page.tsx`**:
  - Added `AcademySection` + `PodcastSection` to the sections barrel import block.
  - Inserted `<AcademySection />` + `<PodcastSection />` into the `view === "home"` composition between `<AwardsSection />` and `<FAQ />`.

### Verification

- `bun run lint` → 0 errors / 0 warnings (clean). Ran twice (initial pass, then re-run after removing 2 unused imports: `Users` from academy, `Pause` from podcast).
- `curl http://localhost:3000/` → HTTP 200 — page compiles + serves successfully.
- Existing dev server (PID 5545, port 3000) already running; new code hot-reloaded cleanly.
- All Khidma teal palette (#475959 #2b3d3d #748684 #192d2f #32504d #6e8580 #ffffff); per-level accent colors (emerald/amber/rose) used only on small level badges — NO indigo/blue anywhere.
- Mobile responsive: featured cards collapse to single column, 3-col grids → 2-col → 1-col, episode list stays vertical, subscribe buttons wrap.
- `prefers-reduced-motion`: all `Reveal` fade-up + hover lift + waveform animation fall back to static.

## Stage Summary

- **2 new landing sections delivered**: `AcademySection` + `PodcastSection`.
- **Landing page composition now**: …AwardsSection → **AcademySection** → **PodcastSection** → FAQ → FinalCTA (24 sections total — was 22).
- All Khidma teal palette; per-level accent colors used only on small level badges — NO indigo/blue.
- framer-motion staggered `Reveal` + hover-lift on course cards, path cards, featured cards, episode rows; animated waveform (28 bars, mirror repeat) beside featured play button.
- `prefers-reduced-motion` respected throughout (Reveal, LiftCard, Waveform).
- Mobile responsive (cards stack, episode list stays vertical, subscribe buttons wrap).
- All CTAs fire sonner toasts per spec — no real backend wiring needed for this round.
- Lint clean (0 errors / 0 warnings). Dev server healthy (HTTP 200 on port 3000).
- Both components `"use client"` + default-exported for code-splitting compatibility.

## Files Created/Modified

**Created:**
1. `/home/z/my-project/src/components/sections/academy-section.tsx`
2. `/home/z/my-project/src/components/sections/podcast-section.tsx`

**Modified:**
3. `/home/z/my-project/src/components/sections/index.ts`
4. `/home/z/my-project/src/app/page.tsx`
5. `/home/z/my-project/worklog.md` (appended work record)

## Unresolved / Risks

- Academy courses + learning paths + podcast episodes are all mocked — no real CMS / video host / podcast RSS feed.
- Enrollment / instructor application / play / subscribe buttons are front-end only (toast feedback); no persistence.
- Podcast waveform is decorative (not tied to actual audio playback).
- Translation dictionary not extended for new Academy/Podcast copy (English-only).
- Could add real LMS backend (Prisma models: Course, Lesson, Enrollment, Path) + real podcast hosting integration (RSS / Transistor / Buzzsprout) in a future round.
