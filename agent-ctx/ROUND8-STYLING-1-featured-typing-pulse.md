# Task ID: ROUND8-STYLING-1 — Featured Banner + Typing Hero + Pulse Widget

**Agent:** full-stack-developer (featured banner + typing hero + pulse widget)
**Scope:** Khidma landing page — 3 premium styling features, all inside the `/` route.

## Task
Build three premium styling features for the Khidma landing page:

1. **`featured-this-week.tsx`** — a rotating "Featured This Week" banner section
   with 5 items (freelancer / service / job / article / event) auto-advancing
   every 5s with smooth slide + fade transitions, dot indicators, a progress
   bar, pause-on-hover, and `prefers-reduced-motion` fallback.
2. **Hero typing animation** — a typewriter effect on the second line of the
   hero headline, cycling through 4 phrases with a blinking cursor and a
   `prefers-reduced-motion` static fallback.
3. **`khidma-pulse.tsx`** — a "live metrics" pill widget for the hero showing
   3 fluctuating real-time-feeling metrics (active freelancers, projects this
   week, paid out today) using MotionValue + useSpring (no re-renders).

## Work Log
- Read `worklog.md` (full project context), `hero.tsx`, `khidma-data.ts`,
  `reveal.tsx`, `live-activity-ticker.tsx`, `globals.css`, sections barrel,
  and `page.tsx` to align with existing conventions.
- Confirmed brand tokens: `bg-khidma-gradient`, `bg-khidma-radial`,
  `bg-dot-grid`, `text-khidma-gradient`, `font-display`, `font-arabic`.
- Confirmed store actions: `openFreelancer`, `openService`, `openJob`,
  `openOnboarding`, `setView`.

### Files created
- `src/components/sections/featured-this-week.tsx`
  - 5-item rotating carousel (`freelancer`/`service`/`job`/`article`/`event`).
  - Each item: eyebrow + title (with `text-khidma-gradient` accent) +
    description + CTA button (CTA wired to `openFreelancer("f1")`,
    `openService("s1")`, `openJob("j1")`, or no-op for article/event).
  - Right column: rotating visual preview custom-built per kind
    (`FreelancerVisual`, `ServiceVisual`, `JobVisual`, `ArticleVisual`,
    `EventVisual`) — each is a styled glass card with avatar / cover / date
    block + glow accents, all in Khidma teal palette.
  - 5 dot indicators (clickable, jump to item) with active "wide bar" + kind
    icon tinted per kind.
  - Auto-advance progress bar at the very bottom (rAF-driven, resets on each
    item change).
  - Pause on hover (and on focus for keyboard accessibility).
  - `prefers-reduced-motion`: no auto-advance, no progress bar, no slide —
    just a cross-fade between items; dots still clickable.
  - framer-motion `AnimatePresence` + custom variants (direction-aware slide
    + fade) for left & right columns.
  - Per-kind meta (`KIND_META`) maps kind → icon + Tailwind color tint
    (emerald / teal / `#9ad0c8` / amber / rose — all Khidma-safe accents).
  - `aria-roledescription="carousel"` + `aria-current` on the active dot
    + `aria-label`s for the prev/next buttons.

- `src/components/khidma/use-typewriter.ts`
  - Custom hook `useTypewriter(phrases)` returning `{ text, phraseIndex,
    animating }`.
  - State machine with 4 phases: `typing` (50ms/char) → `holding` (1.5s) →
    `deleting` (30ms/char) → `empty` (0.5s) → next phrase.
  - Uses refs for `phase`/`pos`/`phraseIndex` so the timer callback can read
    the latest values without re-subscribing each render.
  - `prefers-reduced-motion`: returns the first phrase statically (no
    animation, no cursor blink). The initial state sync is deferred to a
    microtask (`setTimeout 0`) so it does NOT trigger
    `react-hooks/set-state-in-effect` cascading-render warnings.
  - Re-runs when `prefersReduced` or the joined phrase list changes (so HMR
    on the phrase list works).

- `src/components/khidma/khidma-pulse.tsx`
  - Horizontal pill glass card with `bg-white/5 backdrop-blur-md border
    border-white/10`.
  - "LIVE" indicator on the left (pulsing green dot, `prefers-reduced-motion`
    safe — `animate-ping` is conditionally rendered).
  - 3 metrics with dividers: Active now (247 ±5 every 3s), This week (1,432
    +1..+3 every 4s), Paid out today (TND 12,450 +50..+200 every 5s).
  - Each metric: small icon tile + pulsing dot + label + big number
    (`tabular-nums`) + subtle TrendingUp arrow.
  - **Performance:** uses `useMotionValue` + `useSpring` (stiffness 120,
    damping 20) for the source value — no React re-render per fluctuation.
    A rAF loop mirrors the spring's rounded integer into a throttled
    `display` state (~5×/sec max, only when the rounded value changes by ≥1),
    so the DOM text updates without re-rendering the entire widget.
  - `prefers-reduced-motion`: rAF loop idles, `display` stays at its
    `useState` initial value (so the metric shows the static initial
    number — no fluctuation, no pulsing dot, no spring smoothing).
  - Fluctuation is gated by an `enabled` flag that flips on 800ms after
    mount (so it doesn't fight with the hero entrance animation), and is
    disabled entirely under `prefers-reduced-motion`. This also prevents
    SSR/client mismatch.

### Files modified
- `src/components/sections/hero.tsx`
  - Imported `KhidmaPulse` + `useTypewriter`.
  - Added `HEADLINE_PHRASES` constant (4 phrases: Build your career / Hire
    verified talent / Grow your business / Earn your worth).
  - Called `useTypewriter(HEADLINE_PHRASES)` to get the typed text + an
    `animating` flag.
  - Replaced the static `Build your career.` span with a dynamic
    `{typedText}` + a blinking cursor `<motion.span>` that fades opacity
    1→0→1 (1s loop, 0.7s while typing). Cursor is hidden (no animation)
    under `prefers-reduced-motion`.
  - Mounted `<KhidmaPulse />` between the TrustSeal and the LiveActivityTicker
    (preserves the existing flow: trust chips → trust seal → live metrics
    pill → live activity ticker).
  - Did NOT touch the gradient mesh, parallax, count-up, marquee, magnetic
    cards, or floating preview cards — all existing hero functionality is
    intact.

- `src/components/sections/index.ts`
  - Added `export { FeaturedThisWeek } from "./featured-this-week";` right
    after `Hero` (so it appears as the second export in the barrel).

- `src/app/page.tsx`
  - Added `FeaturedThisWeek` to the import list (after `Hero`, before
    `TrustStrip`).
  - Inserted `<FeaturedThisWeek />` in the `view === "home"` block right
    after `<Hero />` and before `<TrustStrip />`, per task spec.

## Verification
- `bun run lint` → **0 errors / 0 warnings** (fixed two
  `react-hooks/set-state-in-effect` errors by deferring initial state sync
  to a microtask, and removed an unused eslint-disable directive).
- `bunx tsc --noEmit` → 0 errors in `src/` (the only TS errors are in
  `examples/` and `skills/` directories — unrelated to this task).
- Dev server (`http://localhost:3000/`) returns HTTP 200.
- `curl` of the homepage confirms all three features rendered:
  "Find trusted talent", "Featured this week", "247 freelancers online",
  "Paid out today".

## Stage Summary
- **3 new files:** `featured-this-week.tsx`, `use-typewriter.ts`,
  `khidma-pulse.tsx`.
- **3 modified files:** `hero.tsx` (typewriter headline + KhidmaPulse
  mount), `sections/index.ts` (barrel export), `app/page.tsx` (composition).
- All `"use client"` where required.
- Khidma teal palette only — no indigo/blue. Accent colors are emerald,
  teal, amber, rose (Khidma-safe pastel accents on dark-teal gradient bg).
- Mobile responsive: featured banner stacks left/right on small screens
  (`grid-cols-1 lg:grid-cols-12`), KhidmaPulse wraps metrics on narrow
  viewports (`flex flex-wrap`).
- `prefers-reduced-motion` respected in all three features (no auto-advance,
  no slide, no cursor blink, no pulsing dot, no number fluctuation, no
  spring smoothing).
- framer-motion used for all animations (entrance, slide, cross-fade,
  blinking cursor, MetricCell keyframe).
- Performance: KhidmaPulse uses MotionValue + useSpring + a throttled rAF
  mirror — the only React re-renders are ~5×/sec per metric, not per
  fluctuation frame.
- Existing hero functionality intact (gradient mesh, parallax blobs,
  count-up trust chips, skills marquee, magnetic floating cards, trust
  seal, live activity ticker, trust-score badge, mini testimonial).
- Hero now stacks: chips → trust seal → **KhidmaPulse** → live ticker.

## Unresolved / Risks for next round
- Article & event CTAs are intentional no-ops (real CMS / event-registration
  integration is mocked per spec).
- KhidmaPulse numbers are simulated; in production these would come from a
  `/api/pulse` SSE endpoint (or a periodic fetch). The hook architecture
  supports swapping in a real source without changing the render layer.
- The typewriter is hard-coded to 4 phrases; making them configurable via
  props or CMS would be a small extension.
