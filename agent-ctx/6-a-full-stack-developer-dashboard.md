# Task 6-a — Freelancer Dashboard View

**Agent:** full-stack-developer (dashboard)
**Scope:** Build the freelancer-facing dashboard inside the `/` route as a single view component (`DashboardView`) that the page composer will mount via Zustand `view === 'dashboard'`.

## Files Created

| Path | Purpose |
|---|---|
| `/home/z/my-project/src/lib/dashboard-mock.ts` | Mock data — KPIs, 6-month earnings chart, activity feed, profile completion breakdown, proposals (5), contracts (4) with milestones, wallet balances (4), wallet transactions (6), rating metrics + breakdown, application status, notification defaults, quick actions. Plus shared style maps for `ProposalStatus` / `ContractStatus` / `MilestoneStatus` / `WalletTxnStatus`. |
| `/home/z/my-project/src/components/views/dashboard-view.tsx` | Main `"use client"` dashboard component — top bar, sidebar (sticky desktop + Sheet on mobile), and 9 tabbed views. Exports `DashboardView` (named + default). |
| `/home/z/my-project/src/components/views/index.ts` | Barrel re-export. |

## Architecture Decisions

- **Single file for the view** (~1,300 lines) to keep all 9 tabs co-located and make the file easy for the composer agent to drop in. Each tab is its own function component (`OverviewTab`, `ProfileTab`, …) and the main `DashboardView` switches between them with `AnimatePresence mode="wait"` for smooth fade-slide transitions.
- **Layout:**
  - `min-h-screen flex flex-col` outer wrapper.
  - Sticky `TopBar` (h-16) with backdrop blur — Back-to-Home button (`setView('home')`), avatar + welcome message, notification bell with animated dropdown, and wallet mini-card (`formatTND(4250)` → `openWallet()`).
  - On `lg+` screens: 240px sticky sidebar with profile mini-card, 9 nav items (icon + label + optional count badge), and a green "Application: APPROVED" status card at the bottom.
  - On mobile: a 48px sub-header with a `Menu` button that opens a controlled `Sheet` containing the same sidebar.
  - Main content area uses the prescribed `mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8` wrapper.
- **State:** only two `useState` calls in the parent — `tab` (active section) and `mobileNavOpen` (Sheet). No external state; everything else is local to each tab. Filter tabs on Proposals use `useMemo` to derive the filtered list.
- **Charts:** recharts `AreaChart` (Overview) and `BarChart` (Wallet) inside a parent `<div className="h-[260px]">` so `ResponsiveContainer` has a defined height. Custom `ChartTooltip` returns null when inactive. Khidma palette only: `#2b3d3d` (stroke), `#32504d` (gradient stop), `#748684` (second bar).
- **Profile preview:** `ProfileTab` opens the public profile modal via `openFreelancer('f1')` so the user can see what clients see. Each section card has a ghost "Edit" button that fires a `sonner` toast (demo).
- **Contracts:** each card expands inline (collapsible milestones list) with `AnimatePresence height: auto` animation; milestones render as numbered pills with `MilestoneStatus` badges.
- **Proposals:** filter pills (All / Active / Awarded / Declined) with live counts in the pill.
- **Wallet:** 4 balance cards, earnings vs withdrawals grouped BarChart, transactions Table with credit/debit arrows and color-coded status badges, withdrawal methods grid (uses `withdrawalMethods` from khidma-data), and a "Request Withdrawal" CTA → `openWallet()` (the wallet modal).
- **Reviews:** big 4.9/5 number + 4-metric progress bars (Communication / Quality / Delivery / Professionalism) using `bg-gradient-to-r from-[#748684] to-[#2b3d3d]`. Review cards include mini-metrics grid per review.
- **Settings:** Account info form (Input/Label), Security list (Change password / 2FA Switch / Sessions), Notifications (5 toggles with local state + sonner toasts), Privacy (Select + 2 Switches), Payment methods (3 active cards + Add), Close-account danger zone (rose-tinted card).

## Wiring to Store
- Reads `setView` (Back-to-Home, Browse Jobs quick action), `openWallet` (wallet mini-card, Request Withdrawal CTA), `openFreelancer('f1')` (Preview Public Profile button).
- Does **not** require `currentUser` to be set — the view is demoable standalone by rendering `<DashboardView/>` when `view === 'dashboard'`.
- Does **not** modify `page.tsx` (per instructions); the composer agent will mount it.

## Data Source
- Current user = `freelancers[0]` (Amira Ben Salah) — pulled with `const me = freelancers[0]`.
- Portfolio tab reads `me.portfolio` (3 items).
- Services tab reads `me.services` (2 items).
- Reviews tab pulls from `reviews` (4 cards shown, real Khidma data file).

## Verification
- `bunx eslint src/components/views/dashboard-view.tsx src/lib/dashboard-mock.ts src/components/views/index.ts` → **0 errors / 0 warnings**.
- `bunx tsc --noEmit` filtered to dashboard files → no output (clean).
- Dev server (`bun run dev`) compiled the file multiple times with no errors (visible in `dev.log`).
- Project-wide `bun run lint` still reports 7 problems — all in `src/components/views/admin-view.tsx` (Task 6-b, different agent's file, outside this task's scope). My files are clean.

## Reusable exports
```ts
// Page composer can do:
import { DashboardView } from "@/components/views";
// or
import DashboardView from "@/components/views/dashboard-view";
```
