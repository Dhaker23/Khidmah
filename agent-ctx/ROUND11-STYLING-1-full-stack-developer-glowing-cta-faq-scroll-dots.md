# Task: ROUND11-STYLING-1 — Glowing CTA + FAQ polish + Scroll-to-section dots

**Task ID:** ROUND11-STYLING-1
**Agent:** full-stack-developer (glowing CTA + FAQ polish + scroll dots)

## Task
Polish 2 existing sections + add 1 new global styling component on the Khidma landing page:
1. `final-cta.tsx` — premium glowing CTA button + animated gradient mesh + "Take the tour" button.
2. `faq.tsx` — accordion styling improvements (chevron rotation, left-border accent, background tint, better typography), "Was this helpful?" feedback row, "Contact support" CTA card.
3. NEW `scroll-to-section.tsx` — vertical floating dot navigation on the right side (desktop only) with IntersectionObserver + framer-motion layoutId.

## Work Log

### Pre-work review
- Read `/home/z/my-project/worklog.md` — confirmed project context (Round 10 complete; 27 landing sections, 7 views, scroll-progress bar + Tunisian Cities + Stats view + section rhythm dividers all in place; Khidma teal palette; framer-motion throughout).
- Read existing `final-cta.tsx` and `faq.tsx` to understand the existing markup + behavior I must preserve (openOnboarding, setView, Reveal wrapper, existing trust badges).
- Read `@/components/khidma/reveal.tsx` (Reveal/BrandDivider/SectionHeading/Section patterns) and `@/components/ui/accordion.tsx` (Radix-backed shadcn accordion; default chevron already rotates 180° via `[&[data-state=open]>svg]:rotate-180` with `transition-transform duration-200`).
- Read `@/lib/store.ts` — confirmed `startTour`, `openHelp`, `openOnboarding`, `setView` all exist on the store.
- Inspected all major section opening tags to plan ID additions:
  - Hero (`hero.tsx:217`) had `<section ref={sectionRef} data-cursor-glow className="...">`
  - Categories, FeaturedFreelancers, FeaturedServices, OpenJobs, StatsBanner, Testimonials all had `<section className="...">` without IDs
  - Pricing already had `id="pricing"` and Blog already had `id="blog"`.

### Files created

1. **`src/components/khidma/scroll-to-section.tsx`** (new, ~165 LOC) — Premium floating dot navigation:
   - **Position**: `hidden lg:flex fixed right-6 top-1/2 -translate-y-1/2 z-40 flex-col items-end gap-3` (desktop-only, vertically centered, right side).
   - **Sections list** (10 entries): hero, categories, featured-freelancers, featured-services, open-jobs, stats, pricing, testimonials, blog, faq.
   - **Active tracking**: single `IntersectionObserver` with `rootMargin: "-45% 0px -45% 0px"` (thin middle-of-viewport slice). For each entry that intersects, store its `intersectionRatio` in a `Map`, then pick the most-visible section as `activeId`. Observing is deferred via `requestAnimationFrame` so all section DOM nodes are mounted first.
   - **Per-dot structure** (inside each `<button>`):
     - Tooltip: `<motion.span>` with `AnimatePresence` — slides in from the right (x:6→0) over 180ms; rendered to the LEFT of the dot (button uses `flex justify-end gap-2`, so dot stays anchored to the right edge of the viewport while tooltip grows leftward).
     - Dot container: `relative flex size-4 items-center justify-center` (16px square holding the dot).
     - Muted base dot: `<motion.span>` 8px normally, animates to 16px on hover (or 0 when active so only the teal fill shows). Spring transition (stiffness 380, damping 28).
     - Active fill: `<motion.span layoutId="khidma-scroll-dot-active-fill">` with `absolute inset-0 rounded-full bg-[#32504d] shadow-[0_0_8px_rgba(50,80,77,0.55)]`. The shared `layoutId` makes the teal fill smoothly slide between dots when the active section changes.
   - **Click**: `document.getElementById(id)?.scrollIntoView({ behavior: prefersReduced ? "auto" : "smooth", block: "start" })`.
   - **Accessibility**: `<nav aria-label="On-page section navigation">`, each button has `aria-label="Scroll to {label} section"` and `aria-current={isActive ? "location" : undefined}`. `focus-visible:outline-none` lets the default focus ring show.
   - **prefers-reduced-motion**: tooltip uses initial `{opacity:1}` (no slide); dot animations use `transition={{ duration: 0 }}` (instant); active fill layout transition also `duration: 0` (instant slide between sections); smooth-scroll falls back to `behavior: "auto"`.
   - **Cleanup**: observer disconnects on unmount; rAF cancelled.

### Files modified

2. **`src/components/sections/final-cta.tsx`** — Premium glowing CTA + animated gradient mesh + Take the tour:
   - Added `startTour` to the destructure from `useApp()` (alongside existing `openOnboarding`, `setView`).
   - Added 3 drifting blurred blobs (gradient mesh) as `motion.div` elements with `blur-[120-140px]` + radial-gradient backgrounds in Khidma teal tones (#32504d / #748684 / #6e8580). Each animates `x`, `y`, `opacity` over 20s/22s/24s with `repeat: Infinity, ease: "easeInOut"`. Only rendered when `!prefersReduced`.
   - **Premium glowing primary CTA**: wrapped the existing `<Button>` in `<motion.div>` with `whileHover={{ scale: 1.02 }}` and `whileTap={{ scale: 0.99 }}` (spring, stiffness 400, damping 22). Behind the button: a `<motion.div>` with `absolute -inset-4 rounded-full blur-2xl` and `radial-gradient(circle, rgba(50,80,77,0.85) 0%, rgba(50,80,77,0.4) 45%, transparent 75%)`. Animates opacity `[0.4, 0.7, 0.4]` over 2.5s (per spec). Reduced-motion: static opacity 0.55, no animation.
   - **"Take the tour" button** (NEW): `<Button variant="ghost" onClick={startTour}>` with `<Compass>` icon (rotates 24° on hover). Positioned after "Hire Talent" in the CTA row.
   - Preserved all existing functionality: openOnboarding (Become a Verified Freelancer), setView("freelancers") (Hire Talent), trust line, Sparkles eyebrow, Reveal wrapper, dark `bg-[#192d2f]` background, dot-grid overlay, static radial-gradient backdrop.

3. **`src/components/sections/faq.tsx`** — Accordion styling + feedback row + Contact support CTA:
   - Added `id="faq"` to the section element (was missing — needed for scroll-to-section targeting).
   - Added imports: `useState`, `Button` from `@/components/ui/button`, `toast` from `sonner`, `cn` from `@/lib/utils`, and 5 new Lucide icons (`ThumbsUp`, `ThumbsDown`, `LifeBuoy`, `Mail`, plus the existing icons).
   - **Accordion styling enhancements** (applied via `className` on `AccordionItem`):
     - `data-[state=open]:bg-[#32504d]/[0.04]` — subtle teal background tint on the expanded item.
     - `data-[state=open]:shadow-[inset_2px_0_0_0_#32504d]` — left-border accent via inset shadow (avoids layout shift that a real `border-l` would cause). 2px solid Khidma teal.
     - `rounded-md transition-colors duration-200` — smooth color transitions.
   - **Chevron rotation** (subtle improvement): added `[&>svg]:duration-300 [&>svg]:ease-out` to the `AccordionTrigger` className — upgrades the default chevron transition from 200ms linear to 300ms ease-out (smoother, more "premium" feel). The actual 180° rotation comes from the shadcn default `[&[data-state=open]>svg]:rotate-180`.
   - **Question typography**: bumped from `text-sm sm:text-base font-semibold` to `text-base sm:text-lg font-semibold tracking-tight` (slightly larger, tighter, more confident).
   - **NEW `FeedbackRow` sub-component**: rendered inside each `AccordionContent` below the answer. Has local `useState<"yes" | "no" | null>` so each FAQ item remembers its own vote.
     - "Was this helpful?" label + two buttons: `<ThumbsUp>` Yes + `<ThumbsDown>` No.
     - Clicking either fires `toast("Thanks for your feedback!", { description: ... })` — different description based on yes/no.
     - Once voted, the chosen button stays in the highlighted teal state (`bg-[#32504d]/15 text-[#32504d]`); `aria-pressed` reflects state.
     - Re-clicking the same vote is a no-op (prevents toast spam).
   - **NEW "Contact support" CTA card** at the bottom of the FAQ section: `<Card>` with `bg-gradient-to-br from-[#32504d]/[0.05] via-[#748684]/[0.03] to-transparent` and `border-[#32504d]/20`. Contains a `<LifeBuoy>` icon in a teal-tinted circle, the heading "Still have questions?", supporting text about 24h reply time, and a `<Button onClick={openHelp}>Contact support</Button>` (with `<Mail>` icon). Wrapped in `<Reveal delay={0.1}>` for entrance animation.
   - Preserved the existing left-column "Still have questions?" onboarding card (openOnboarding + setView("freelancers")) and the accordion's data + icons.

### ID additions to section elements (so the scroll-to-section dots can target them)

4. **`src/components/sections/hero.tsx`** — added `id="hero"` to the `<section>` opening tag (between `ref={sectionRef}` and `data-cursor-glow`).
5. **`src/components/sections/categories.tsx`** — `<section className="py-16 sm:py-24 bg-muted/30">` → `<section id="categories" className="py-16 sm:py-24 bg-muted/30">`.
6. **`src/components/sections/featured-freelancers.tsx`** — added `id="featured-freelancers"`.
7. **`src/components/sections/featured-services.tsx`** — added `id="featured-services"`.
8. **`src/components/sections/open-jobs.tsx`** — added `id="open-jobs"`.
9. **`src/components/sections/stats-banner.tsx`** — added `id="stats"`.
10. **`src/components/sections/testimonials.tsx`** — added `id="testimonials"`.
    - (`pricing` and `blog` already had IDs — left untouched; `faq` ID added as part of the faq.tsx rewrite above.)

### Mount in `src/app/page.tsx`

11. **`src/app/page.tsx`** — imported `ScrollToSection` from `@/components/khidma/scroll-to-section` and rendered it conditionally as `{view === "home" && <ScrollToSection />}` immediately after `<CursorGlow />` (so it sits between the header overlay and the main content). It's `hidden lg:flex` so it only renders visibly on desktop; on other views it's not in the DOM at all.

## Verification

- `bun run lint` → **0 errors / 0 warnings** (exit 0) on first pass after writing all files. No fixes needed.
- `bunx tsc --noEmit` → **0 errors in any of my 11 modified/created files**. The 3 TS errors shown are all pre-existing in `examples/websocket/server.ts` and `skills/*` (unrelated to my changes).
- Dev server (Next.js 16.1.3 Turbopack): `GET /` → **HTTP 200**, response 1,079,018 bytes, response time 0.31s.
- HTML content verification (curl + grep on rendered HTML):
  - All 10 section IDs present in DOM: `id="hero"`, `id="categories"`, `id="featured-freelancers"`, `id="featured-services"`, `id="open-jobs"`, `id="stats"`, `id="pricing"`, `id="testimonials"`, `id="blog"`, `id="faq"` ✓
  - ScrollToSection nav rendered with `aria-label="On-page section navigation"` ✓
  - All 10 "Scroll to {Section} section" aria-labels present ✓
  - "Become a Verified Freelancer" CTA present ✓
  - "Take the tour" button present ✓ (NEW)
  - "Hire Talent" button still present (no regression) ✓
  - "Questions, answered." FAQ heading present ✓
  - All 8 FAQ questions in DOM ✓
  - "Contact support" button present ✓ (NEW)
  - "Still have questions?" CTA card heading present ✓ (NEW — bottom of FAQ section)
- The "Was this helpful?" feedback row only mounts in the DOM when an accordion item is expanded (Radix default behavior — content unmounts when closed). Verified the FeedbackRow renders correctly via the source code; it will appear on user interaction.
- All Khidma teal palette only (#475959 #2b3d3d #748684 #192d2f #32504d #6e8580 #ffffff) — no indigo/blue.
- All `"use client"` directives present.
- `prefers-reduced-motion` respected in every animated element (glow pulse, mesh blobs, dot hover, active-fill slide, smooth-scroll).
- framer-motion used for: radial glow pulse, mesh blob drift, button scale, dot hover, active-fill slide (layoutId), tooltip slide (AnimatePresence).

## Stage Summary

- **1 new file**: `src/components/khidma/scroll-to-section.tsx` (premium floating dot navigation, desktop-only, IntersectionObserver-tracked, layoutId sliding active fill).
- **2 polished files**: `src/components/sections/final-cta.tsx` (glowing CTA + 3-blob gradient mesh + Take the tour button), `src/components/sections/faq.tsx` (accordion styling, FeedbackRow, Contact support CTA card).
- **7 ID-additions**: hero, categories, featured-freelancers, featured-services, open-jobs, stats-banner, testimonials (pricing + blog already had IDs; faq ID added in the faq.tsx rewrite).
- **1 mounting change**: `src/app/page.tsx` imports + conditionally renders ScrollToSection on the home view.
- Lint clean. TypeScript clean. Dev server: HTTP 200. All existing functionality preserved (openOnboarding, setView, openHelp, accordion data, trust badges, Reveal wrapper, etc.).
- Khidma teal palette only. `prefers-reduced-motion` respected everywhere. framer-motion used throughout (motion.div, motion.span, AnimatePresence, layoutId, useReducedMotion).

## Unresolved / Risks for next round

- The "Was this helpful?" feedback row only persists its vote state per-session/per-accordion-open-cycle. Since Radix unmounts the AccordionContent when closed, the FeedbackRow state resets when the user closes and re-opens the same item. If persistent feedback state is desired, the vote should be lifted to a `useState` at the FAQ level keyed by item index, or persisted to localStorage.
- The scroll-to-section IntersectionObserver uses a thin middle-viewport slice (`-45% 0px -45% 0px`). On very short sections (e.g., `stats-banner` which is shorter than 10% of viewport), the active state might briefly flicker when scrolling past. Acceptable for the 10 chosen sections.
- The layoutId slide animation only works while the ScrollToSection component stays mounted. If the user navigates away from `view === "home"` and back, the component unmounts and remounts, so the active-fill animation restarts from the freshly-computed active dot (no slide on first render).
- The 3-blob animated mesh in FinalCTA adds 3 absolutely-positioned, blurred, infinitely-animating motion.divs. They have `pointer-events-none` so they don't block clicks, and they're skipped under `prefers-reduced-motion`. On low-end devices without reduced-motion enabled, this could add minor GPU load — acceptable for a single landing-page section.
