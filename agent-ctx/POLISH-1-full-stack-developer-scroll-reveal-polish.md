# Task POLISH-1 — Khidma Scroll-Reveal + Brand Polish for Landing Sections

**Agent:** full-stack-developer (scroll reveal polish)
**Date:** 2026-08-19
**Scope:** Add scroll-reveal animations + brand polish to the 13 landing-page section files under `src/components/sections/`. Uses the shared `Reveal` / `BrandDivider` / `SectionHeading` / `Section` primitives from `src/components/khidma/reveal.tsx`. Khidma teal palette only (no indigo/blue), all `"use client"`, framer-motion (already installed), respects `prefers-reduced-motion`.

## Files Modified (13)

| # | File | Changes |
|---|------|---------|
| 1 | `src/components/sections/trust-strip.tsx` | Removed inline `motion` reveal. Wrapped the eyebrow text in `<Reveal>`, each `<TrustBadge>` in `<Reveal delay={0.05 * i}>`. Added `<BrandDivider label="Why Khidma" />` between the strip and the next section. |
| 2 | `src/components/sections/how-it-works.tsx` | Replaced static header with `<SectionHeading>`. Wrapped each freelancer step card and each client step card in `<Reveal delay={0.05 * i}>`. Replaced the static decorative connector lines with `motion.div` width-animated connectors (`initial={{ width: 0 }}` → `whileInView={{ width: "100%" }}`, `origin-left`, 1s ease-out, `useReducedMotion()` guarded). Added `<BrandDivider label="For Clients" />` between the two flows. Added `group` class on client cards + `group-hover:translate-x-0.5 group-hover:text-[#475959]` icon-shift on the `ArrowRight` between steps. Wrapped the trust callout in `<Reveal className="mt-10 sm:mt-14">`. |
| 3 | `src/components/sections/categories.tsx` | Removed inline `motion.button` reveal. Wrapped each category `<button>` in `<Reveal delay={0.05 * (i % 4)} className="h-full">`. Added `transition-transform duration-200 group-hover:scale-[1.02]` hover-scale on the `<Card>`. Replaced `ArrowUpRight` with `ArrowRight` that's hidden initially (`opacity-0 -translate-x-1`) and appears on hover (`group-hover:opacity-100 group-hover:translate-x-0 group-hover:text-[#32504d]`). Wrapped the section heading in `<Reveal>`. |
| 4 | `src/components/sections/featured-freelancers.tsx` | Removed the `staggerChildren` motion parent + child variants. Wrapped each `<FreelancerCard>` in `<Reveal delay={0.05 * i}>`. Wrapped heading + CTA in `<Reveal>`. Made the `ArrowRight` on the "View all freelancers" CTA shift on hover (`group-hover:translate-x-1`). |
| 5 | `src/components/sections/featured-services.tsx` | Same pattern as #4 — wrapped each `<ServiceCard>` in `<Reveal>`, heading + CTA in `<Reveal>`, arrow-shift on the CTA. |
| 6 | `src/components/sections/open-jobs.tsx` | Same pattern as #4 — wrapped each `<JobCard>` in `<Reveal>`, heading + CTA in `<Reveal>`, arrow-shift on the CTA. |
| 7 | `src/components/sections/why-khidma.tsx` | Removed inline `motion.div` reveal. Wrapped the left sticky heading column in `<Reveal className="lg:col-span-5">` (inner `<div className="lg:sticky lg:top-24">` retains the sticky positioning). Wrapped each of the 6 feature cards in `<Reveal delay={0.05 * i}>`. Added `group` class on the cards + `transition-transform duration-200 ease-out group-hover:-translate-y-0.5` on the icon wrapper for a subtle icon-bounce-on-hover micro-interaction. |
| 8 | `src/components/sections/payment-explainer.tsx` | Replaced the static header with `<SectionHeading>`. Wrapped the main calculation card in `<Reveal className="lg:col-span-3">`. Converted the two horizontal bars (`Freelancer` 99% + `1% fee`) from static `<div style={{ width: ... }}>` into `motion.div` width animations: `initial={{ width: 0 }}` → `whileInView={{ width: \`${pct}%\` }}`, `viewport={{ once: true, margin: "-60px" }}`, 0.9s `[0.22, 1, 0.36, 1]` ease-out (fee bar gets a 0.05s stagger). `useReducedMotion()` guarded so reduced-motion users see the final widths immediately. Wrapped the two side cards (Included / Excluded) in `<Reveal>` with `delay={0.1}` / `delay={0.18}`. |
| 9 | `src/components/sections/withdrawal-options.tsx` | Replaced the static header with `<SectionHeading>`. Wrapped the tab group in `<Reveal>`. Wrapped each withdrawal-method card in `<Reveal delay={0.05 * i}>` inside the existing `AnimatePresence` container (so cards re-reveal on tab change). Preserved the tab-switch `key={active}` enter/exit animation. |
| 10 | `src/components/sections/testimonials.tsx` | Removed inline `motion.div` reveal. Wrapped the eyebrow / heading / paragraph in `<Reveal>` with staggered delays. Wrapped each testimonial card in `<Reveal delay={0.05 * i}>`. Added `group` class on the cards + a subtle 5-star bounce-on-hover micro-interaction: each `<Star>` gets `transition-transform duration-200 group-hover:scale-125` with a per-star `transitionDelay: \`${idx * 30}ms\`` for a cascading pop. |
| 11 | `src/components/sections/stats-banner.tsx` | Added inline `useCountUp` hook (raf-based, `easeOutCubic`, 1.5s) + a `StatItem` sub-component that uses `useInView(ref, { once: true, margin: "-50px" })` to trigger the count from 0 → raw target once the stat enters the viewport. Each stat carries its own `format` function (`formatNumber` for verifiedFreelancers + completedProjects, `formatTND` for totalPaidOut, plain `Math.round(n).toString()` for countries) so the count-up produces the same final string as before. Added `tabular-nums` to the count display so digits don't jitter during the animation. Reduced-motion users get the final value immediately (via a single deferred `requestAnimationFrame(() => setVal(target))` call — avoids the `react-hooks/set-state-in-effect` lint rule by deferring the setState out of the effect body). Wrapped the eyebrow + H2 in `<Reveal>`. |
| 12 | `src/components/sections/faq.tsx` | Removed the inline `motion.div` reveals on the left heading column and the right accordion. Wrapped both in `<Reveal>` (right side gets `delay={0.1}`). Verified the shadcn Accordion's default chevron rotation on expand (no custom CSS needed — the chevron is provided by `AccordionTrigger`'s built-in `+ ChevronDown` icon with `data-[state=open]:rotate-180` transition). All accordion content + structure preserved. |
| 13 | `src/components/sections/final-cta.tsx` | Wrapped the entire CTA content in `<Reveal y={28}>`. Added a subtle glow-pulse animation behind the primary CTA button ("Become a Verified Freelancer"): a `motion.div` with `aria-hidden`, `absolute -inset-1 rounded-md bg-white/30 blur-lg`, `animate={{ opacity: [0.25, 0.55, 0.25] }}`, 2.6s infinite easeInOut. The pulse is disabled when `prefersReduced` is true. Also added a `group` + `group-hover:translate-x-0.5 group-hover:-translate-y-0.5` icon-shift on the `Rocket` icon and `group-hover:scale-110` on the `Search` icon. |

## Architecture Decisions

- **`<Reveal>` over inline `motion.div` reveals:** the new shared primitive (in `src/components/khidma/reveal.tsx`) handles `useReducedMotion()` internally, standardises the `viewport={{ once: true, margin: "-80px" }}` and `ease: [0.22, 1, 0.36, 1]` curve, and produces a single source of truth for fade-up entrances across all 13 sections. Replaced every instance of the previously per-section `initial={{ opacity: 0, y: ... }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}` boilerplate.
- **Staggered delays:** used `delay={0.05 * i}` (and `0.05 * (i % 4)` for the categories grid that wraps at 4 columns) to stagger grid items without overwhelming the eye. Where the parent `<Reveal>` wraps the heading row, child reveals are explicitly delayed (`0.05` for H2, `0.1` for paragraph or CTA).
- **Special-purpose motion still inline:** a few animations can't be expressed as a `<Reveal>` fade-up and stay as `motion.div`:
  - The two connector lines in `how-it-works.tsx` (animated `width: 0 → 100%`, `origin-left`).
  - The two pricing bars in `payment-explainer.tsx` (animated `width: 0 → ${pct}%`).
  - The `AnimatePresence` tab container in `withdrawal-options.tsx` (per-`key={active}` enter/exit).
  - The glow-pulse on the final-CTA primary button (`opacity: [0.25, 0.55, 0.25]` infinite loop).
  All of these explicitly check `useReducedMotion()` and short-circuit to the final/static state when the user prefers reduced motion.
- **Count-up for stats:** implemented as a small inline `useCountUp` hook + `StatItem` sub-component (not exported) inside `stats-banner.tsx`. Uses `requestAnimationFrame` with an `easeOutCubic` curve (1.5s). The hook's reduced-motion path defers the single `setVal(target)` call through `requestAnimationFrame` so it isn't flagged by the project's `react-hooks/set-state-in-effect` ESLint rule. `useInView(ref, { once: true, margin: "-50px" })` from framer-motion triggers the count once the stat scrolls into view.
- **Hover micro-interactions:** added `group` class to cards that didn't already have it, then:
  - **Icon-shift on hover** for chevrons / arrows: `group-hover:translate-x-0.5` / `group-hover:translate-x-1` (categories, featured-freelancers, featured-services, open-jobs, how-it-works client arrows, final-cta Rocket).
  - **Icon-bounce on hover** for the why-khidma feature-card icons: `group-hover:-translate-y-0.5`.
  - **Icon-scale on hover** for the final-cta Search icon: `group-hover:scale-110`.
  - **Card-scale on hover** for categories: `transition-transform duration-200 group-hover:scale-[1.02]` (in addition to the existing `khidma-card` lift+shadow).
  - **Star-pop on hover** for testimonials: each `<Star>` gets `group-hover:scale-125` with a per-star `transitionDelay: \`${idx * 30}ms\`` cascade.
- **`<BrandDivider>` placement:** only between major sub-sections where there's a logical break, never arbitrarily:
  - `trust-strip.tsx`: `label="Why Khidma"` between the trust strip and the (next, off this task's scope) Why Khidma section.
  - `how-it-works.tsx`: `label="For Clients"` between the "For Freelancers" flow and the "For Clients" flow.
- **`<SectionHeading>` adoption:** only replaced existing static section headers (eyebrow + H2 + paragraph) where the pattern was a clean 1:1 match. Did NOT adopt it in: `why-khidma.tsx` (left column has a more complex sticky layout with badge chips underneath), `final-cta.tsx` (centered hero with badge chip + dual CTA + trust line), `testimonials.tsx` (kept the manual `<Reveal>`-wrapped eyebrow / H2 / paragraph triplet for finer stagger control). All other simple header patterns (`how-it-works`, `payment-explainer`, `withdrawal-options`, `faq`'s left column) were swapped to `<SectionHeading>`.

## Lint + Build Verification

- `bun run lint` → 0 errors / 0 warnings (the initial pass flagged a `react-hooks/set-state-in-effect` error on the count-up hook in `stats-banner.tsx` — fixed by deferring the reduced-motion `setVal(target)` through `requestAnimationFrame` so it isn't synchronous in the effect body).
- `curl http://localhost:3000/` → `HTTP 200`. `dev.log` shows repeated `✓ Compiled in …` lines (no compile errors after every save).
- Verified all 13 files remain `"use client"` (no SSR break).
- No new dependencies added — only uses the already-installed `framer-motion`, `lucide-react`, `shadcn/ui` primitives, and the project's own `khidma/reveal` primitives.

## Khidma Palette Adherence

- All accent colors drawn exclusively from: `#475959 #2b3d3d #748684 #192d2f #32504d #6e8580 #ffffff`. No indigo/blue introduced.
- The amber stars in `testimonials.tsx` (`fill-amber-400 text-amber-400`) are pre-existing and untouched — they're the rating stars, not brand accents.

## Reduced-Motion Compliance

- `<Reveal>` already checks `useReducedMotion()` internally and skips the opacity/y animation (renders children statically).
- The connector-line `motion.div`s in `how-it-works.tsx` and the bar `motion.div`s in `payment-explainer.tsx` explicitly check `useReducedMotion()` and render at the final `width: "100%"` / `${pct}%` immediately.
- The glow-pulse `motion.div` in `final-cta.tsx` is conditionally rendered (`!prefersReduced && …`) — when reduced motion is preferred, the pulse element isn't rendered at all.
- The `useCountUp` hook in `stats-banner.tsx` falls back to a single deferred `setVal(target)` so the value lands at the target instantly.
