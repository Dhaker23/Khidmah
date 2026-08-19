# Task 5-a — Marketplace Views

**Agent:** full-stack-developer (marketplace views)
**Scope:** Build 4 marketplace view components (`FreelancersView`, `ServicesView`, `JobsView`, `HowItWorksView`) under `/home/z/my-project/src/components/views/`, each mounted via the Zustand `view` state inside the single `/` route. Composer agent will switch between them.

## Files Created

| Path | Purpose |
|---|---|
| `/home/z/my-project/src/components/views/freelancers-view.tsx` | "Find Verified Talent" browse page — sticky desktop filter sidebar + Sheet on mobile, Grid/List layout toggle, sort dropdown, staggered card entrance, empty state + skeletons + "Load more". |
| `/home/z/my-project/src/components/views/services-view.tsx` | "Browse Services" page — horizontally-scrollable category pills (with desktop scroll arrows), search + sort row, ServiceCard grid, footer callout that routes to jobs view. |
| `/home/z/my-project/src/components/views/jobs-view.tsx` | "Find Work" jobs page — filter sidebar (job type, experience level, budget slider, category, location, verified-only switch), sort dropdown, 2-col JobCard grid, footer trust banner. |
| `/home/z/my-project/src/components/views/how-it-works-view.tsx` | Long-form "How Khidma Works" — 21-step freelancer lifecycle (4 phases with vertical timeline), 9-step client lifecycle (3 phases with horizontal step grid), 3 trust cards, withdrawal methods grid, 4-metric reputation breakdown + sample review, dual CTA at bottom. |
| `/home/z/my-project/src/components/views/index.ts` | Barrel export — preserves existing `DashboardView` / `AdminView` exports and adds the 4 new marketplace views. |

## Architecture

### Freelancers View
- Local `FilterState` interface (search, categoryIds[], skills[], rateRange[2], availability, verifications{}, country).
- `applyFilters(list, filters)` + `sortFreelancers(list, key)` pure helpers — fully tested via `useMemo`-driven re-render.
- **FiltersPanel** sub-component reused on desktop sidebar (inside a `Card`) and inside the mobile `Sheet` (left side, `w-[88%] sm:max-w-md`).
- Active filter count badge in panel header.
- **Layout toggle** via `DropdownMenu` (Grid view / List view) with active-state checkmark — satisfies the DropdownMenu shadcn requirement.
- Sort via `Select` (Top Rated / Newest / Most Reviews / Hourly Low→High / Hourly High→Low).
- `useState` `visibleCount` for "Load more" (visual only — increments 6 at a time).
- Staggered entrance via motion variants (`staggerChildren: 0.05`).

### Services View
- All 11 categories + "All" rendered as horizontally scrollable pills (button chips) with desktop-only left/right scroll arrows.
- Active pill highlighted with `bg-[#2b3d3d]` text-white.
- Sort `Select` (Popular / Newest / Price Low→High / Price High→Low / Top Rated).
- `SERVICE_CATEGORY_TO_ID` map translates `service.category` strings (e.g. "Web Development", "3D Art") to the matching category id for pill filtering.
- Active filter summary as removable Badges above the grid.
- Dark footer callout card with `setView('jobs')` CTA.

### Jobs View
- Mirror of Freelancers layout: sticky desktop sidebar + Sheet on mobile.
- Filters: job type (RadioGroup), experience level (RadioGroup), budget range (Slider), category (Checkbox list), location (Select), verified-only (Switch).
- Sort `Select` (Newest / Oldest / Budget High→Low / Most / Least proposals).
- `JOB_CATEGORY_TO_ID` map for filtering.
- 1-col on mobile / 2-col on lg JobCard grid.
- Footer trust banner with country/city stats.

### How It Works View
- Long-form single-page layout using the standard `mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-12` wrapper.
- **For Freelancers** section: 4 phases × 21 total steps. Each phase has its own `PhaseHeader` (numbered icon badge) + `VerticalTimeline` (numbered circle + step Card with icon). Animated via `whileInView` per-step staggered.
- **For Clients** section: 3 phases × 9 total steps. Each phase has `PhaseHeader` + `HorizontalStepGrid` (3-column responsive grid of numbered step cards with large `font-display` step number watermark).
- **Trust System**: 3 large feature cards (Verification Badges / 1% Platform Fee / Escrow Protection) with bullet checklists.
- **Payment & Withdrawals**: 6 withdrawal method cards from `withdrawalMethods` data + dark 99/1 payment explainer strip.
- **Reviews & Reputation**: 4-metric breakdown card (Communication / Quality / Delivery / Professionalism) with animated progress bars + dark sample review card with mini-metrics grid.
- **CTA**: dual buttons — "Become a Verified Freelancer" (primary → `openOnboarding()`) and "Post a Job" (secondary outline → `setView('jobs')`).

## Khidma Palette Usage

Only Khidma teal/dark-green hexes used throughout: `#192d2f`, `#2b3d3d`, `#32504d`, `#475959`, `#6e8580`, `#748684`. No indigo, no blue. Dark cards use `from-[#192d2f] to-[#2b3d3d]` gradient. Accent surfaces use `bg-[#32504d]/10`. Verified-client stars use amber-400 (already established brand accent in `verification.tsx`).

## shadcn Components Used

`Button`, `Input`, `Card`, `Badge`, `Checkbox`, `RadioGroup`+`RadioGroupItem`, `Slider`, `Separator`, `Sheet`+`SheetContent`+`SheetHeader`+`SheetTitle`+`SheetDescription`+`SheetTrigger`, `Select`+`SelectTrigger`+`SelectContent`+`SelectItem`+`SelectValue`, `DropdownMenu`+`DropdownMenuTrigger`+`DropdownMenuContent`+`DropdownMenuItem`, `Switch`.

## Lint Verification

- `bunx eslint src/components/views/freelancers-view.tsx src/components/views/services-view.tsx src/components/views/jobs-view.tsx src/components/views/how-it-works-view.tsx src/components/views/index.ts` → **0 errors / 0 warnings**.
- `bun run lint` (project-wide) → **0 errors / 0 warnings**.
- Dev server (`bun run dev`) recompiles cleanly on save (`✓ Compiled in 200-500ms`).
- No modifications to `src/app/page.tsx` (per instructions) — composer agent will wire views via the Zustand `view === 'freelancers' | 'services' | 'jobs' | 'how-it-works'` checks.

## Store Wiring

- Reads `setView` (back-to-home, footer CTAs).
- `FreelancersView` reads/writes `searchQuery` & `setSearchQuery` from the global store so the navbar search box syncs with the in-page search input.
- `HowItWorksView` calls `openOnboarding()` (primary CTA) and `setView('jobs')` (secondary CTA).
- All card components (FreelancerCard / ServiceCard / JobCard) already call `openFreelancer` / `openService` / `openJob` internally via their own store usage — no wiring required from the views.

## Reusable exports

```ts
import { FreelancersView, ServicesView, JobsView, HowItWorksView } from "@/components/views";
```

Or per-file default imports also work.
