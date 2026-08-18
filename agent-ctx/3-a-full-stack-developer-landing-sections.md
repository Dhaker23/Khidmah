# Task 3-a — Landing Page Sections

**Agent:** full-stack-developer (landing sections)
**Date:** 2025-01-01
**Scope:** Built 14 landing page section components for Khidma freelance marketplace.

## Files Created

All in `/home/z/my-project/src/components/sections/`:

1. `hero.tsx` — Premium hero with radial gradient + dot grid bg, display heading "Find trusted talent. Build your career.", floating mini freelancer cards (freelancers.slice(0,3)), trust chips (1,248 freelancers / 8,420 projects / TND 1.24M paid out), CTAs `setView('freelancers')` + `openOnboarding()`.
2. `trust-strip.tsx` — Horizontal trust indicators strip using `TrustBadge`, 6 stats (verified freelancers, completed projects, paid out, rating, countries, cities).
3. `how-it-works.tsx` — Three-step freelancer flow (Register & Verify → Build Profile → Get Approved) with decorative connecting line + four-step client flow (Post Job → Compare Profiles → Fund Contract → Release on Approval) + escrow trust callout.
4. `categories.tsx` — All 11 categories as cards with icon, EN + AR names (font-arabic), freelancer count, top 3 skill chips. Staggered entrance via motion.
5. `featured-freelancers.tsx` — Grid of `FreelancerCard` from `freelancers.filter(f => f.featured)`, "View all freelancers" button.
6. `featured-services.tsx` — Grid of 6 `ServiceCard` from `getAllServices().slice(0, 6)`, "View all services" button.
7. `open-jobs.tsx` — Grid of 4 `JobCard` from `jobs.slice(0, 4)`, "Browse all jobs" button.
8. `why-khidma.tsx` — Two-column: left heading "Why clients and freelancers choose Khidma" + paragraph + trust chips; right grid of 6 feature cards (Trust-first verification, Transparent 1% fee, Secure contracts & escrow, Local & international withdrawals, Real reviews, Two-sided reputation).
9. `payment-explainer.tsx` — Big example calculation card (1000 TND → 10 TND fee → 990 TND freelancer) with horizontal bar diagram + "What's included" / "What we never charge" lists.
10. `withdrawal-options.tsx` — Tab switcher (Local / Bank / International) with AnimatePresence transitions, filtering `withdrawalMethods` by type. Each card: emoji logo, name, type badge, fee, time.
11. `testimonials.tsx` — 4 testimonial cards from `reviews`, with avatar, name, project, quote, 5-star rating, date. Decorative Quote icon.
12. `stats-banner.tsx` — Dark `bg-khidma-gradient` banner, 4 big numbers (1,248 verified freelancers / 8,420 completed projects / TND 1.24M total paid out / 41 countries served) with `font-display`.
13. `faq.tsx` — shadcn Accordion with 8 questions: verification, free?, payment protection, withdrawals, international clients, disputes, 1% fee calc, anyone can freelance. Side panel with "Still have questions?" callout.
14. `final-cta.tsx` — Dark `bg-[#192d2f]` premium conversion section. Heading "Join Khidma Today." Primary CTA → `openOnboarding()`, Secondary → `setView('freelancers')`. Trust line at bottom.
15. `index.ts` — Barrel file exporting all 14 sections.

## Patterns Used
- All "use client", default-exported, self-contained.
- `motion` from `framer-motion` with `whileInView={{ once: true }}` for fade-up on scroll.
- Khidma teal palette only (#2b3d3d, #32504d, #475959, #748684, #6e8580, #192d2f). NO indigo/blue.
- Consistent section heading pattern: eyebrow → big H2 (`font-display`) → supporting paragraph.
- All sections wrapped in `mx-auto max-w-7xl px-4 sm:px-6 lg:px-8` with `py-16 sm:py-24` spacing.
- Responsive grid patterns: `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4`.
- Semantic HTML (`section`, `h2`, `p`, `ul`).
- Existing components reused: `FreelancerCard`, `ServiceCard`, `JobCard`, `TrustBadge`, `VerificationBadge`, shadcn `Accordion`, `Card`, `Button`, `Badge`, `Avatar`.

## Integration Points for Composer Agent
- Import everything from `@/components/sections` via the barrel file.
- All sections call `useApp()` methods: `setView('freelancers'|'services'|'jobs')`, `openOnboarding()`.
- No props required — each section is self-contained and pulls data from `@/lib/khidma-data`.

## Lint Status
- `bunx eslint src/components/sections/` → 0 errors, 0 warnings. ✅
- (Project-wide lint errors exist in `onboarding-wizard.tsx` but are outside this task's scope.)
