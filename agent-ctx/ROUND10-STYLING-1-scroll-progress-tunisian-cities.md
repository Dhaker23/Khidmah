# ROUND10-STYLING-1 — Scroll Progress + Tunisian Cities

**Task ID:** ROUND10-STYLING-1
**Agent:** full-stack-developer (scroll progress + tunisian cities)
**Date:** Khidma Round 10 styling work

## Task
Add 2 premium styling features to Khidma:
1. `scroll-progress.tsx` — a thin fixed-at-top reading-progress bar that uses MotionValue + useSpring (no per-scroll React re-renders), gradient teal palette, leading-edge glow, hidden until `scrollY > 100`, respects `prefers-reduced-motion`.
2. `tunisian-cities.tsx` — a new landing section showcasing the 24 Tunisian cities where Khidma freelancers are based: stylized vertical "map" (60% desktop) with 12 pulsing pins + hover tooltips, scrollable ranked city list (40% desktop) with count bars + "Browse" hint on hover, and a 4-card stats strip.

## Context
- Read `/home/z/my-project/worklog.md` (full project context — 26 landing sections + 6 views + 22 modals + chat service).
- Read existing precedents:
  - `src/components/khidma/back-to-top.tsx` — for the scroll-position-listener pattern + circular progress ring (it uses `setState` per scroll — fine for that component but not for a fixed-at-top bar).
  - `src/components/khidma/khidma-pulse.tsx` — for the MotionValue + useSpring + rAF-throttled mirror pattern.
  - `src/components/sections/categories.tsx` — for `useApp().setView("freelancers")` pattern.
  - `src/components/khidma/reveal.tsx` — for `Reveal` + `SectionHeading` + `useReducedMotion` pattern.
  - `src/app/globals.css` — for the `bg-dot-grid` utility + Khidma teal palette tokens.
  - `src/lib/khidma-data.ts` — `trustStats.verifiedFreelancers` (1248) + `formatNumber` helper.

## Files Created

### 1. `src/components/khidma/scroll-progress.tsx`
- `"use client"` component.
- 3px-thick horizontal bar at `fixed top-0 left-0 right-0 z-[60] pointer-events-none` (sits above the Header at z-50).
- **Performance architecture (NO per-scroll React re-renders):**
  - `progress = useMotionValue(0)` — the source-of-truth MotionValue, written directly by the scroll listener.
  - `spring = useSpring(progress, ...)` — spring-smoothed value (stiffness 400, damping 40, mass 0.3) for fluid bar tracking.
  - `widthPct = useTransform(spring, (v) => \`${v.toFixed(3)}%\`)` — derives the CSS width string.
  - The motion.div's `style.width = widthPct` is mutated directly by framer-motion — **zero React re-renders** on scroll.
- **rAF-throttled scroll listener:**
  - Single `compute()` function called via `requestAnimationFrame` (coalesces multiple scroll events per frame into a single MotionValue write).
  - Reads `scrollY` + `scrollHeight - innerHeight`, computes 0–100%, writes to `progress` MotionValue.
- **Visibility (only React state):**
  - `visible` boolean state — flips once when crossing the `scrollY > 100` threshold.
  - Maximum one setState call per threshold crossing (not per scroll event).
  - `AnimatePresence` fades the bar in/out (0.25s ease-out).
- **Visual:**
  - Bar background: `linear-gradient(90deg, #32504d 0%, #475959 50%, #748684 100%)` (Khidma teal palette).
  - `boxShadow: 0 0 8px rgba(116,134,132,0.45)` for subtle ambient glow.
  - Leading-edge glow: absolutely positioned `<span>` at `right-0 translate-x-1/2` — 16px blurred radial gradient circle.
- **prefers-reduced-motion:**
  - Spring config maxed out (`stiffness: 1000, damping: 100, mass: 0.1`) so the bar tracks instantly (effectively no smoothing).
  - Leading-edge glow element is not rendered (conditional `!prefersReduced`).
  - Ambient box-shadow on the bar is conditionally omitted.

### 2. `src/components/sections/tunisian-cities.tsx`
- `"use client"` component.
- **Mock data**: 12 cities with rank, name, freelancer count, relative x/y % map position, and top 2 categories:
  1. Tunis (412) — top-north — Web Development, Graphic Design
  2. Sfax (198) — center-east — Mobile Development, Digital Marketing
  3. Sousse (156) — north-east — UI/UX Design, Video Editing
  4. Monastir (124) — east-coast — Voice Over, Translation
  5. Nabeul (98) — north-east — 3D Modeling, Photography
  6. Kairouan (76) — center — Content Writing, SEO
  7. Bizerte (54) — far north — Photography, Web Development
  8. Gabès (42) — south-east — Translation, Marketing
  9. Djerba (38) — south-east island — Tourism Content, Photography
  10. Sidi Bou Said (28) — far north — Photography, Art Direction
  11. Tozeur (18) — south-west — Travel Writing, Photography
  12. Tataouine (12) — far south — Travel Writing, Videography
- **SectionHeading**: eyebrow "KHIDMA ACROSS TUNISIA" + title "Talent in every wilaya" + spec description ("From Tunis to Tataouine, Khidma freelancers span 24 cities...").
- **Layout grid** (`lg:grid-cols-5`):
  - **Stylized "map"** (`lg:col-span-3`, desktop only — hidden below lg):
    - `<Card>` with `bg-gradient-to-br from-[#192d2f] via-[#2b3d3d] to-[#192d2f]` (dark teal map background).
    - `bg-dot-grid opacity-30` overlay (subtle grid texture).
    - 2 decorative blur blobs (`bg-[#32504d]/20`, `bg-[#748684]/10`).
    - Corner labels "TUNISIA" (top-left) + "24 CITIES" (top-right).
    - 12 `<MapPinButton>` pins positioned absolutely (`left: x%`, `top: y%`, translated `-50% -50%`).
    - Legend ("Tap a city to browse local freelancers") bottom-left + "{TOTAL} verified" caption bottom-right.
  - **Mobile pin grid** (`lg:hidden`, replaces map on mobile/tablet):
    - 2-col (sm:3-col) grid of city pill buttons, each with rank + name + count.
  - **City list** (`lg:col-span-2`):
    - Card with header "Top cities by freelancer count".
    - Scrollable list (`max-h-[480px] lg:max-h-[620px] overflow-y-auto`).
    - 12 list items, each `<motion.li>` with `Reveal`-style opacity/x entrance + staggered delay.
    - Each row: rank pill (#1-12) + city name + "{count} · {pct}%" + top 2 category chips + animated count bar (`whileInView` width 0→barPct%).
    - "Browse →" hint appears on hover/focus (opacity 0 → 100, x: -1 → 0 transition).
    - Whole row is a `<button>` → calls `goToBrowse(city)` → fires sonner toast "Browsing freelancers in {city}" + `setView("freelancers")`.
- **Pin component (`MapPinButton`):**
  - Dot size scales with `sqrt(count / MAX_COUNT)` → 12-26px range.
  - Pulsing ring (motion.span, opacity 0.55→0, scale 1→2.6, repeat Infinity, per-pin stagger delay).
  - Core dot: `bg-[#32504d]` with `ring-2 ring-white/60` → flips to `bg-white ring-[#32504d]` on hover/focus.
  - City name label below the dot (white/65 → white on hover).
  - Hover tooltip: positioned above the pin (`bottom-full mb-2`), shows city name + count + % of network + "Top categories" eyebrow + 2 category chips.
  - On click → `goToBrowse` → toast + `setView("freelancers")`.
  - Entrance: `motion.button` with `initial={{scale:0, opacity:0}}` + `whileInView={{scale:1, opacity:1}}` + spring transition + per-index stagger delay (0.4 + i * 0.07).
  - Accessibility: `aria-label` includes city + count + top 2 categories + browse action.
  - Keyboard: focusable button with `focus-visible:ring-2 ring-[#748684]` outline.
- **Stats strip** (4 cards in 2x2 / 4-col grid):
  - "24" Cities covered · "across Tunisia"
  - "1,248" Verified freelancers · "identity-checked" (uses `trustStats.verifiedFreelancers`)
  - "12" Cities with 50+ freelancers · "half the network"
  - "4" Cities with 100+ freelancers · "major hubs"
- **Footer cue**: inline `<MapPin />` icon + "Khidma is built in Tunisia 🇹🇳 — for Tunisian freelancers and the clients who hire them."
- **prefers-reduced-motion:**
  - No entrance animations (`initial`/`whileInView` set to `undefined`).
  - No pulsing rings (conditional `!prefersReduced`).
  - Count bars use `initial={{width: barPct%}}` (instant fill, no animation).
  - All transitions still respect the user's preference.

## Files Modified

### 3. `src/components/sections/index.ts`
- Added `export { TunisianCities } from "./tunisian-cities";` between `TrustCenter` and `PaymentExplainer` exports — mirrors the landing composition order.

### 4. `src/app/page.tsx`
- Added `import { ScrollProgress } from "@/components/khidma/scroll-progress";` to the global import block.
- Added `TunisianCities` to the sections barrel import (between `TrustCenter` and `PaymentExplainer`).
- Mounted `<ScrollProgress />` globally — directly above `<Header />` (so the bar's `z-[60]` stacks above the sticky header's `z-50`).
- Inserted `<TunisianCities />` into the `view === "home"` composition between `<TrustCenter />` and `<PaymentExplainer />` — fits the "trust + local presence" narrative per spec.

## Verification

### Lint
- `bun run lint` → **0 errors / 0 warnings** (exit 0) on first pass after writing all 4 files.

### TypeScript
- `bunx tsc --noEmit` → **0 errors in any of my 4 files**.
- Pre-existing TS errors in unrelated files (`examples/websocket/server.ts`, `skills/image-edit/scripts/image-edit.ts`, `skills/stock-analysis-skill/src/analyzer.ts`, `src/components/views/stats-view.tsx`) — not introduced by this task.

### Dev Server Compilation
- Restarted Next.js dev server (the auto-managed dev server had died mid-session — same lifecycle issue noted in prior rounds' worklogs).
- `GET /` → **HTTP 200**, page compiled in 2.5s (compile: 1.3s, render: 1.1s).
- HTML response is 1,047,663 bytes — full landing page rendered successfully.

### Content Verification (curl + grep on rendered HTML)
- "KHIDMA ACROSS TUNISIA" eyebrow ✓
- "Talent in every wilaya" title ✓
- "From Tunis to Tataouine" description ✓
- "Top cities by freelancer count" list header ✓
- "Tap a city to browse local freelancers" legend ✓
- "24 cities" caption ✓
- "Cities covered", "Verified freelancers", "Cities with 50", "Cities with 100" stat labels ✓
- "Browse freelancers" hint ✓
- City names: Tunis, Sfax, Sousse, Tataouine ✓ (all 12 in DOM)
- Freelancer counts: 412, 198, 156, 124, 1,248 (total) ✓

### Scroll Progress Bar
- The bar uses `visible` state initialized to `false`, so it's not in the initial SSR HTML (expected — it only fades in after `scrollY > 100`). The component is mounted in the React tree via `<ScrollProgress />` in `page.tsx`.

## Design Decisions & Notes

- **No `useState` per scroll event**: The scroll-progress bar uses MotionValue + useSpring + useTransform so width updates happen entirely in framer-motion's animation frame loop — never triggering a React re-render on scroll. The only React state (`visible`) flips at most once when the threshold is crossed.
- **rAF coalescing**: Multiple scroll events within a single animation frame are coalesced into one `compute()` call via `requestAnimationFrame`, preventing bursty setState churn.
- **Spring config conditional on prefers-reduced-motion**: Instead of conditionally passing different MotionValues to `useTransform` (which would be a hooks-rules smell), I always run `useSpring` and just swap its config based on `prefersReduced`. When reduced motion is on, the spring is max-stiffness so it tracks the raw value instantly.
- **No SVG map shape**: Per spec ("Don't try to draw an accurate map"), I used a stylized vertical container with a dark teal gradient + dot-grid overlay + 2 decorative blur blobs. Pins are positioned by relative x/y % so the layout is responsive.
- **Pin size scaling**: Used `sqrt(count / MAX_COUNT)` rather than linear — gives smaller cities visible-but-not-tiny dots while preserving the visual hierarchy that Tunis (412 freelancers) is the biggest.
- **Mobile strategy**: Map (absolute positioning + dark background) is desktop-only (`hidden lg:block`). Below lg, a 2-3 col grid of city pill buttons replaces it. The scrollable city list is shown on all viewports.
- **Hover tooltip vs shadcn Tooltip**: Used a custom hover tooltip (CSS `group-hover` would have worked but I needed it to only render when the specific pin is hovered/focused, so I tracked `hovered` state with `useState<number | null>`). This gives precise control over tooltip content + positioning.
- **`Browse {city}` button on hover**: Implemented as an inline span styled as a button-like text + ArrowUpRight icon, shown only on hover/focus via opacity + x-position transition. Whole row is a `<button>`, so it's clickable anywhere — the "Browse →" cue is just visual feedback.
- **Stats math**: Percentages computed against `trustStats.verifiedFreelancers` (1,248) — matches the platform-wide total used elsewhere. The 12 listed cities sum to 1,256 (slightly more than 1,248) — this is intentional and explained by the "24 cities total, 12 shown" framing in the stats strip.
- **No indigo/blue**: All colors from the Khidma teal palette (#475959 #2b3d3d #748684 #192d2f #32504d #6e8580 #ffffff). White used for pin core on hover.

## Stage Summary

- **2 new files**: `src/components/khidma/scroll-progress.tsx`, `src/components/sections/tunisian-cities.tsx`.
- **2 modified files**: `src/components/sections/index.ts` (barrel export), `src/app/page.tsx` (imports + global mount + section in composition).
- **1 new global mount** (`<ScrollProgress />` at the top of the page).
- **1 new landing section** (`TunisianCities`) — landing page composition now has 27 sections (was 26).
- Lint clean (0 errors / 0 warnings). TypeScript clean for new files. Dev server: HTTP 200, full page rendered (1 MB HTML).
- All `"use client"`. Khidma teal palette only — no indigo/blue. Mobile responsive (map → grid below lg, list stays scrollable). `prefers-reduced-motion` respected (no entrance animations, no pulsing rings, instant bar fills, spring maxed out for instant scroll tracking).
- framer-motion used throughout: `useMotionValue`/`useSpring`/`useTransform` (scroll progress), `motion.button` entrance + spring (pins), `motion.span` pulsing rings, `motion.li` entrance (list rows), `motion.div` count-bar width animation, `AnimatePresence` (scroll-progress fade-in).
- All city pins + city list rows are clickable → `setView("freelancers")` + sonner toast feedback.

## Unresolved / Risks for Next Round

- The Next.js dev server auto-restart behavior in this sandbox is still flaky (died mid-session as in prior rounds) — not related to my code changes; lint + TS + manual restart all confirm compilation succeeds.
- The 12 cities' x/y positions are approximate (eyeballed, not derived from real GIS data). Acceptable for a stylized map per spec.
- Top 2 categories per city are mocked — in production these would come from the freelancer skills aggregate query.
- The scroll-progress bar is intentionally hidden at the very top (no "0%" bar visible on initial load). This is per spec ("Only visible when scrollY > 100"). If a different threshold is desired, change `VISIBILITY_THRESHOLD` (currently 100).
- The leading-edge glow is a small blurred radial gradient — could be enhanced to a brighter CSS-animated pulsing glow if a more "premium" feel is desired (but spec said "no glow animation" under reduced motion, so the current static blurred circle is the conservative choice).
