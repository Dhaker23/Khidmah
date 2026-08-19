# ROUND9-STYLING-1 — Live Notifications + Testimonial Carousel

**Agent:** full-stack-developer (live notifications + testimonial carousel)
**Task ID:** ROUND9-STYLING-1

## Task
Add 2 premium styling features to Khidma:
1. **LiveNotifications** — periodic sonner toasts about real-time platform activity + bottom-left "Live activity" pill (toggle + manual fire).
2. **TestimonialCarousel** — large auto-rotating single-testimonial showcase with direction-aware slide, progress bar, dots, arrows; sits alongside (after) the existing static `Testimonials` section.

## Work Log

### Context review
- Read `worklog.md` (Rounds 1-8 — project has 23 landing sections, 20 modals, 6 views, 2 mini-services).
- Read `src/components/sections/testimonials.tsx` (existing static 4-card grid using `reviews` mock).
- Read `src/components/khidma/reveal.tsx` (Reveal / SectionHeading / BrandDivider / Section exports).
- Read `src/components/sections/index.ts` barrel.
- Read `src/app/page.tsx` (composition: Testimonials → SuccessStories block).
- Read `src/lib/khidma-data.ts` `reviews` + `formatTND` helpers (4 reviews available — Sarah Chen, Karim Bouazizi, Lina Haddad, Daniel Fischer).
- Read `src/lib/store.ts` (ModalState + view types — confirmed `view === "home"` gating + `tourActive` flag).
- Read `src/components/khidma/back-to-top.tsx` (confirms bottom-right positioning so bottom-left is free for LiveNotifications).
- Read `src/components/khidma/live-activity-ticker.tsx` (precedent glass-card pill pattern with pulsing green dot).
- Read `src/app/layout.tsx` + `src/components/ui/sonner.tsx` — confirmed existing Sonner `<Toaster position="top-right" richColors closeButton />` mounted globally; needed to add a SECOND Toaster at bottom-left WITHOUT duplicating every toast into both.
- Confirmed `sonner@2.0.7` is installed. Read sonner v2 type defs (`index.d.ts`): confirmed `ToasterProps.id`, `ToastOptions.toasterId`, `ExternalToast.toasterId` — sonner v2 supports multiple Toaster routing via `id` (on Toaster) + `toasterId` (on toast).
- Read `src/app/globals.css` — confirmed brand utilities `bg-khidma-gradient`, `bg-dot-grid`, `bg-dot-grid-light`, `text-khidma-gradient`, `text-khidma-accent-gradient`, `font-display`, `font-arabic`, `khidma-card`, `animate-ping`, `shimmer`, `animate-marquee`.

### 1. `src/components/khidma/live-notifications.tsx` (NEW — 419 lines)
- **Dedicated sonner Toaster** (`<Toaster id="khidma-live" position="bottom-left" />`) — only toasts tagged with `toasterId: "khidma-live"` appear here; the existing top-right global Toaster is untouched. This is the documented sonner v2 multi-toaster pattern (Toaster-level `id` + toast-level `toasterId`).
- **Pool of 18 mock "live activity" messages** — Tunisian-context freelancers (Amira, Yassine, Rania, Mehdi, Omar, Syrine, Karim). Spec's 15 + 3 extra ("🔒 New escrow contract funded: TND 2,800", "⚡ 3 urgent jobs posted in the last hour", "📈 Karim's hourly rate just went up to TND 95").
- **Auto-fire loop**: randomized interval 12–18 s (`FIRE_MIN_MS=12_000`, `FIRE_MAX_MS=18_000`), initial delay 4–6 s. Each toast: 5 s duration, position bottom-left, custom unstyled glass-card body.
- **Gating conditions** (checked inside the timeout callback via `useApp.getState()` for fresh reads):
  - `view === "home"` (not dashboard/admin/jobs/services/etc.)
  - No modal open (checks all 22 modal flags: auth/onboarding/selectedFreelancer/selectedService/selectedJob/wallet/messaging/postJob/createService/commandPalette/compare/favorites/share/report/help/pro/referral/privacy/teams/apiDocs/partners/newsletter)
  - `!tourActive` (don't fire during the onboarding tour)
  - `!prefersReducedMotion` (effect returns early — reduced-motion users get no auto-toasts)
  - `document.visibilityState === "visible"` (don't fire when tab is in background)
  - `!hoveringRef.current` (don't fire while user is reading any toast)
  - `enabled` (local toggle state from the pill)
- **Toast body**: custom glass card with teal accent strip on the left (`bg-gradient-to-b from-emerald-400/70`), pulsing green dot icon (motion.span with scale+opacity ping), "LIVE ON KHIDMA" eyebrow, white message text. Click anywhere on the toast dismisses it (sonner `toast.dismiss(t)`).
- **LiveActivityPill** (bottom-left fixed `bottom-6 left-6 z-40`):
  - Pulsing green dot (`animate-ping` + `bg-emerald-400`) — only when not reduced-motion.
  - "LIVE ACTIVITY" uppercase tracking + `Activity` lucide icon.
  - Click → fires one toast immediately (`fireOne()`).
  - Adjacent toggle button (size-8 circle) — toggles auto-fire on/off. Shows `Pause` icon when enabled (teal-emerald state) or `Play` icon when paused (muted state). `aria-pressed` reflects state.
  - Entrance animation: framer-motion fade+slide+scale, 0.4 s delay after mount.
  - Only renders when `view === "home" || view === "how-it-works"` (the two marketing views).
- **Hover-pause detection**: document-level `mouseover`/`mouseout` listeners with `useCapture=true` checking `e.target.closest("[data-sonner-toast]")` — pauses firing when hovering ANY sonner toast (whether bottom-left live toasts OR top-right global toasts). 1.5 s release debounce so flicker between adjacent toasts doesn't resume early.
- **Reduced-motion handling**: pill still renders (manual fire works), but auto-fire effect returns early; `enabled` is forced to `false` for the pill's auto-fire toggle visual state.

### 2. `src/components/sections/testimonial-carousel.tsx` (NEW — 544 lines)
- **5 mock testimonials** — extends the 4 existing `reviews` from `@/lib/khidma-data` (Sarah Chen / Karim Bouazizi / Lina Haddad / Daniel Fischer) + 1 inline addition (Amina Trabelsi — Founder of Maison Zitouna, Lyon, 3D Product Visualization Suite). Each enriched with:
  - Author title (Head of Product / CTO / Design Lead / Marketing Director / Founder)
  - Author company (Cassurea Technologies / FinFlow Tunis / Najah Pay / Atlas Studios / Maison Zitouna)
  - Location flag (🇨🇦 / 🇹🇳 / 🇦🇪 / 🇩🇪 / 🇫🇷) + label
  - Project title + budget (TND, via `formatTND()`) + duration (3–8 weeks)
  - Per-testimonial metrics: delivery / communication / wouldRehire (drives the badge positivity color)
- **Layout** (`max-w-4xl` card centered):
  - SectionHeading (`align="center"`): eyebrow "WHAT CLIENTS SAY" + title "Trusted by clients worldwide" (with "worldwide" in `text-khidma-accent-gradient`) + description "Real stories from clients who found their perfect freelancer on Khidma."
  - Big decorative quote mark `❝` (font-display, 120–160px, `text-[#32504d]/15`, absolute-positioned top-left).
  - 5-star row (animated scale keyframe on mount, amber for filled / muted for empty).
  - Large italic quote (font-display, `text-xl sm:text-2xl lg:text-3xl`, `leading-relaxed`, `text-balance`).
  - Author row: 56px Avatar (border-2 ring), name + flag (large), title + company (teal accent).
  - Project info row: Project / Budget / Duration, separated by vertical dividers on `sm+`.
  - 3 metric badges (On-time delivery ✓ / Communication ✓ / Would rehire ✓) — color-coded emerald (positive, rating ≥5) or amber (positive but not perfect).
  - Bottom: prev/next circular glass arrows + 5 clickable dot indicators + caption "01 / 05" + paused state.
  - Below the card: rAF-driven progress bar (1px tall, max-w-md, gradient teal).
- **Auto-rotation**: cycles every 6 s (`ROTATION_MS=6_000`). rAF loop drives both rotation AND progress bar in one pass — when `paused` is true, freezes the start timestamp so progress doesn't jump on resume.
- **Direction-aware slide**: `AnimatePresence mode="wait"` with `custom={direction}` variants — enter from `dir * 60px` x-offset, exit to `-dir * 60px` x-offset. Right arrow / right dot → dir=+1; left arrow / left dot → dir=-1. Reduced-motion: x-offset=0, opacity stays 1 (pure cross-fade).
- **Controls**: 
  - Prev/Next buttons (`size-11`, rounded-full, glass `bg-background/70 backdrop-blur-md`, border-border/60, hover → `bg-[#32504d]/5 text-[#32504d]`, active:scale-95).
  - 5 dot indicators (`role="tab"`, `aria-selected`, `aria-label`). Active dot is wider (w-8 vs w-2) and uses `motion.span layoutId="active-dot"` for smooth slide-between.
  - Progress bar (`h-1 max-w-md` with `bg-gradient-to-r from-[#32504d] to-[#748684]`, width = `${progress * 100}%`).
  - Caption "01 / 05" + "paused" indicator (Pause icon).
- **Pause on hover/focus**: `onMouseEnter/Leave + onFocus/Blur` on the carousel wrapper sets `paused=true/false`. Progress bar pauses too (transition="none" while paused).
- **Background**: subtle gradient (`from-[#32504d]/5 via-background to-[#32504d]/5`) + `bg-dot-grid-light` overlay (60% opacity) + two decorative blur blobs (left-top, right-bottom, `bg-[#32504d]/10` and `bg-[#748684]/10`).
- **Keyboard navigation**: ArrowLeft/ArrowRight when the section has focus (via `onKeyDown` on the `<section tabIndex={0}>`).
- **Accessibility**: `aria-roledescription="carousel"` + `aria-label="Featured client testimonials"`. Dot indicators use `role="tab"`. Avatar alt text. Star rating has `role="img"` + `aria-label`. Buttons have `aria-label`.

### 3. `src/components/sections/index.ts` (MODIFIED)
- Added `export { TestimonialCarousel } from "./testimonial-carousel";` between `Testimonials` and `SuccessStories`.

### 4. `src/app/page.tsx` (MODIFIED)
- Imported `TestimonialCarousel` from sections barrel + `LiveNotifications` from `@/components/khidma/live-notifications`.
- Inserted `<TestimonialCarousel />` between `<Testimonials />` and `<SuccessStories />` in the `view === "home"` block (creates a "social proof cluster" per spec).
- Mounted `<LiveNotifications />` globally (after `<CompareTray />`, before `<CommandPalette />`).

## Verification
- `bun run lint` → 0 errors / 0 warnings. (Clean — `eslint .` exit code 0.)
- `bunx tsc --noEmit` → 0 errors in any of my 4 files (pre-existing TS errors in `academy-section.tsx`, `examples/`, `skills/` are unrelated to this round). Fixed 1 TS error in `live-notifications.tsx` (removed non-existent `toasterId` prop on `<Toaster>` — kept `id` + `toastOptions.toasterId`).
- Dev server (Next.js 16.1.3 Turbopack) → re-init via `init-fullstack` script after the dev process died mid-development (no compile errors caused it — just process lifecycle). Server now healthy on port 3000, serving HTTP 200, size ~991 KB.
- `curl http://localhost:3000/` HTML contains: "WHAT CLIENTS SAY", "Trusted by clients", "On-time delivery", "Would rehire", "Live activity" pill, "SaaS Landing Page Redesign" (×2 — one in existing Testimonials section + one in new TestimonialCarousel).
- No "Failed to compile" / "Module not found" / "SyntaxError" / runtime errors in dev.log.

## Files
- **NEW** `src/components/khidma/live-notifications.tsx` (419 lines)
- **NEW** `src/components/sections/testimonial-carousel.tsx` (544 lines)
- **MODIFIED** `src/components/sections/index.ts` (added barrel export)
- **MODIFIED** `src/app/page.tsx` (imported + mounted both)

## Stage Summary
- 2 new premium styling features delivered as specified.
- 1 new sonner Toaster instance (bottom-left, dedicated `id="khidma-live"`) — sonner v2 multi-toaster routing via `id` + `toasterId` keeps the existing top-right Toaster 100% untouched.
- 1 new landing section (TestimonialCarousel) → landing page now has 24 sections (was 23).
- All "use client" where required. Khidma teal palette only — no indigo/blue. Accent colors used: emerald (live dot, positive metric), amber (positive-but-not-perfect metric, star rating).
- Mobile responsive: TestimonialCarousel card pads `p-6 sm:p-10 lg:p-12`, author row stacks on mobile, project info wraps. LiveNotifications pill is at fixed `bottom-6 left-6` and the Toaster offsets are larger on mobile to leave room for the pill.
- `prefers-reduced-motion` respected everywhere:
  - LiveNotifications: no auto-firing; pill still renders with manual fire; pulsing dot ping animation disabled.
  - TestimonialCarousel: no auto-rotation, no slide animation (pure cross-fade), no progress bar, no `motion.span layoutId` slide-between dots; arrows + dots still work for manual navigation.
- framer-motion used throughout: LiveActivityPill entrance + LiveDotIcon ping (motion.span scale/opacity loop), TestimonialCarousel AnimatePresence direction-aware variants + star-row scale keyframe + active-dot layoutId.
- Existing testimonials.tsx NOT modified — the new carousel is an addition, not a replacement.

## Unresolved / Risks for next round
- The 5th testimonial (Amina Trabelsi — Maison Zitouna / 3D Product Visualization) is mock-generated inline (the existing `reviews` mock only has 4 entries). If `reviews` is later extended to 5+ entries, the inline mock should be reconciled.
- LiveNotifications hover-pause uses a 1.5 s release debounce so flicker between adjacent toasts doesn't resume early — could feel slightly sluggish if the user genuinely finished reading. Tunable via `HOVER_DEBOUNCE_MS`.
- Auto-fire initial delay is 4–6 s after mount — could be reduced if the first toast should appear sooner.
- The dedicated `khidma-live` Toaster renders its own portal at the document body; if the user has both bottom-left toasts (live) AND bottom-right (BackToTop button) AND bottom-center (CompareTray), the bottom-left position avoids all three. Verified against BackToTop (`bottom-6 right-6`) and CompareTray (centered).
- LiveNotifications pill appears on `view === "home" || "how-it-works"` — could be extended to freelancers/services/jobs views if desired (currently the spec said "home view").
- Live activity messages are static strings — could be sourced from an API/SSE feed in production.
