# Khidma (خدمة) — Freelance Marketplace Worklog

## Project Overview
Building **Khidma** — a trusted freelance marketplace connecting verified Tunisian freelancers with Tunisian/international clients. Inspired by Upwork, Fiverr, 5amsat but with its own identity.

**Core principles:** REAL PEOPLE. REAL SKILLS. REAL PORTFOLIOS. REAL WORK. REAL TRUST.

**Brand palette:** #475959 #2b3d3d #748684 #192d2f #32504d #6e8580 #ffffff (deep teal / dark green, premium trustworthy)
**Fonts:** Manrope (Latin) + IBM Plex Sans Arabic (RTL/Arabic)
**Tagline:** Work. Earn. Grow.

## Footer (Required)
- Designed & Developed by **Amara Dhaker** — "Bringing ideas to life through modern digital experiences"
- Contact: dhakeramarawork@gmail.com | WhatsApp: +216 994 95 558

## Constraint
User can only see `/` route. All marketplace features must be presented within the single page (with internal navigation via state/modals/tabs).

## Tech stack
Next.js 16, TypeScript, Tailwind 4, shadcn/ui, Prisma+SQLite, Zustand, React Hook Form, Zod, Motion (framer-motion already installed), Lucide, next-themes, sonner.

---
Task ID: 1
Agent: Z.ai Code (main)
Task: Foundation setup — copy logos, build Khidma design system (teal palette + Manrope/IBM Plex Arabic fonts), update layout metadata, set up worklog.

Work Log:
- Read full Project.txt spec (~3500 lines) for Khidma freelance marketplace
- Copied Logo 6.png → public/khidma-logo.png and Logo 6 BG.png → public/khidma-logo-bg.png
- About to update globals.css with Khidma teal/dark-green palette
- About to update layout.tsx with Manrope + IBM Plex Sans Arabic fonts and proper metadata
- About to update tailwind config

Stage Summary:
- Brand assets in place at /public/khidma-logo.png and /public/khidma-logo-bg.png
- Worklog initialized for tracking all subsequent subagent work

---
Task ID: 3-a
Agent: full-stack-developer (landing sections)
Task: Build 14 landing page section components for Khidma (hero, trust-strip, how-it-works, categories, featured-freelancers, featured-services, open-jobs, why-khidma, payment-explainer, withdrawal-options, testimonials, stats-banner, faq, final-cta) + barrel index.ts.

Work Log:
- Read worklog.md, store.ts, khidma-data.ts, existing khidma components (freelancer-card, service-card, job-card, verification, logo) and globals.css to confirm design tokens (bg-khidma-radial, bg-dot-grid, bg-khidma-gradient, font-display, font-arabic).
- Built hero.tsx — premium dark hero with radial gradient + dot grid background, staggered framer-motion entrance, floating mini freelancer cards (freelancers.slice(0,3)) on the right + a floating Trust Score chip; trust chips below (1,248 freelancers / 8,420 projects / TND 1.24M paid out). Primary CTA `setView('freelancers')`, secondary `openOnboarding()`.
- Built trust-strip.tsx — 6 TrustBadge cards in a responsive grid (verified freelancers, projects, paid out, rating, countries, cities).
- Built how-it-works.tsx — 3-step freelancer flow (Register & Verify → Build Profile → Get Approved) with decorative connector line and key-action lines + 4-step client flow (Post Job → Compare → Fund → Release) + escrow trust callout.
- Built categories.tsx — all 11 categories as motion-staggered clickable cards (icon, EN + AR via font-arabic, freelancer count, top 3 skill chips). Click → setView('freelancers').
- Built featured-freelancers.tsx — featured freelancers grid using FreelancerCard + "View all" button → setView('freelancers').
- Built featured-services.tsx — 6 ServiceCard grid using getAllServices().slice(0,6) + "View all" button → setView('services').
- Built open-jobs.tsx — 4 JobCard grid using jobs.slice(0,4) + "Browse all" button → setView('jobs').
- Built why-khidma.tsx — two-column layout: left heading + paragraph + trust chips (sticky on lg); right 6 feature cards (Trust-first verification, Transparent 1% fee, Secure contracts & escrow, Local & international withdrawals, Real reviews, Two-sided reputation).
- Built payment-explainer.tsx — big dark gradient example card with horizontal bar diagram (99% freelancer / 1% fee) + breakdown tiles (Project 1000 / Fee 10 / Receives 990) + "What's included" and "What we never charge" lists (no subscriptions, no credits, etc.).
- Built withdrawal-options.tsx — Local/Bank/International tab switcher (AnimatePresence) filtering withdrawalMethods by type. Each card: emoji logo, name, type badge (color-coded), fee, time.
- Built testimonials.tsx — 4 testimonial cards from reviews with avatar, name, project, quote, 5-star rating, decorative Quote icon.
- Built stats-banner.tsx — dark bg-khidma-gradient banner, 4 big numbers using font-display (1,248 / 8,420 / TND 1.24M / 41).
- Built faq.tsx — shadcn Accordion with 8 Q&A items + side "Still have questions?" callout that triggers openOnboarding() / setView('freelancers').
- Built final-cta.tsx — premium dark bg-[#192d2f] section with radial glow + dot grid, big "Join Khidma Today." heading, primary CTA → openOnboarding(), secondary → setView('freelancers'), bottom trust line.
- Built index.ts barrel exporting all 14 sections.
- Ran `bunx eslint src/components/sections/` → 0 errors / 0 warnings. (Project-wide lint errors in onboarding-wizard.tsx are outside this task's scope — left untouched.)
- Wrote work record to /home/z/my-project/agent-ctx/3-a-full-stack-developer-landing-sections.md.

Stage Summary:
- 14 landing page section components + 1 barrel file delivered in /home/z/my-project/src/components/sections/.
- All sections are "use client", default-exported, self-contained, with no props required.
- Use framer-motion `whileInView` for scroll-triggered fade-ins, Khidma teal palette only (no indigo/blue), font-display for headings, font-arabic for Arabic labels.
- Reuse existing khidma components (FreelancerCard, ServiceCard, JobCard, TrustBadge, VerificationBadge) and shadcn/ui (Accordion, Card, Button, Badge, Avatar).
- Composer agent can `import { Hero, TrustStrip, HowItWorks, Categories, FeaturedFreelancers, FeaturedServices, OpenJobs, WhyKhidma, PaymentExplainer, WithdrawalOptions, Testimonials, StatsBanner, FAQ, FinalCTA } from '@/components/sections'`.
- Page.tsx not modified (per instructions); another agent will compose the page.

---
Task ID: 4-a
Agent: full-stack-developer (modals)
Task: Build the full set of Khidma interactive modals — auth (login/register, two-column brand), 8-step freelancer onboarding wizard, freelancer profile, service detail, job detail, and wallet preview. All within the `/` route, using only the Khidma teal palette.

Work Log:
- Read `/home/z/my-project/worklog.md`, `src/lib/khidma-data.ts`, `src/lib/store.ts`, existing khidma components (verification, freelancer-card, service-card, logo) and shadcn UI to align with project conventions.
- Created `src/components/modals/auth-modal.tsx` — Dialog with two-column layout: left brand panel (Khidma logo, tagline, 3 trust bullets, social proof avatars) + right form panel. Uses shadcn Tabs to switch login/register. Login form: email, password (with show/hide toggle), "Forgot password?" link. Register form: full name, email, password, account type (FREELANCER/CLIENT) as radio cards with icons (Briefcase / Building2), Terms checkbox. On submit calls `login(name, type)` from store, then `closeAuth()`, then sonner toast "Welcome to Khidma!". Includes field-level validation (email regex, password length). Renders nothing when `!authOpen`.
- Created `src/components/modals/onboarding-wizard.tsx` — 8-step wizard inside shadcn Dialog (max-w-4xl). Header shows Khidma logo, current step + name + description + Progress bar (step+1 / 8). Bottom sticky footer with "Save & continue later" (ghost), "Back" (outline), "Next"/"Submit for Review" (primary). Step transitions via framer-motion AnimatePresence (horizontal slide, direction-aware). Step contents:
  1. Personal Info: first/last name, username (@), country (default "Tunisia"), city, phone, languages (multi-input chips), short intro textarea.
  2. Professional Info: title (with suggestion chips), bio textarea, years exp, primary category (select from categories), hourly rate, starting price, response time, availability radio cards.
  3. Skills: category-grouped skills as toggle chips, selected counter badge.
  4. Experience: add/remove rows — position, company, start/end (month inputs), current checkbox, description, skills used.
  5. Portfolio: add/remove rows — title, category, type (image/video/audio/url/github), description, role, skills, live URL, repo URL.
  6. Profile Photo: large dropzone with hidden file input, preview circle, Replace/Remove buttons, photo tips card.
  7. Verification: email verify button, phone OTP demo (send OTP → enter "123456" → confirm), identity upload (visual only) + Progress bar showing 0/3 → 3/3 completion.
  8. Review & Submit: shows summary grid (Personal / Professional / Skills / Experience / Portfolio / Verification) + "Preview Public Profile" toggle that expands a styled preview card. Submit triggers `closeOnboarding()`, `login(fullName, "freelancer")`, sonner toast "Application submitted! Admin will review within 48 hours."
  Uses React 19 render-time state adjustment (avoid setState-in-effect) for syncing internal step with store when modal reopens.
- Created `src/components/modals/freelancer-profile-modal.tsx` — shadcn Dialog (max-w-5xl). Render nothing when `!selectedFreelancerId`; find freelancer via `getFreelancerById`. Header: khidma-gradient cover strip, large avatar (negative bottom offset), name + Top Rated badge, professional title, location/languages/member-since meta. Stats row: rating (★), reviews count, completed projects, response time, availability badge (color-coded), hourly rate. CTA buttons: Invite to Job, Contact, Request Proposal (toast with login prompt if `!currentUser`). Tabs:
  - Overview: bio, skills chips, mock experience & education & certifications, plus "Why clients trust …" section using `VerificationChecklist` + badges + quick-stats grid.
  - Portfolio: cards with cover, type badge, role, skills, verification badge (UNVERIFIED → EXTERNALLY_VERIFIED mapping); click "View" expands to reveal results + live/repo links.
  - Services: compact clickable cards that call `openService(s.id)`.
  - Reviews: aggregate metrics (4 metrics with progress bars), 3 review cards with metrics breakdown.
  Sticky footer: Save, View Services, Contact.
- Created `src/components/modals/service-detail-modal.tsx` — shadcn Dialog (max-w-4xl, two-column). Render nothing when `!selectedServiceId`; lookup via `getAllServices()`. Left: cover image + delivery/revisions badges, freelancer mini-card (clickable → `openFreelancer`), title + rating + orders + category badge, description, skills chips, package Tabs (Basic/Standard/Premium) with AnimatePresence between packages — each shows name, price, delivery days, revisions, features list. Right: sticky order card showing selected package summary, breakdown of features, "Continue to Order" button (toast with login prompt if not authenticated), price breakdown (service fee 5% + processing 2% + total), "Compare packages" button.
- Created `src/components/modals/job-detail-modal.tsx` — shadcn Dialog (max-w-3xl). Render nothing when `!selectedJobId`; lookup from `jobs`. Header: category / type / experience / location / duration badges, title, posted-by with verified ShieldCheck if verifiedClient + posted time + proposals count, budget box (Wallet icon, min–max with /hr suffix for hourly jobs). Body (ScrollArea): full description, skills chips, requirements checklist, "About the client" card with member since + posted/hired/avg-rate mini-stats. Sticky footer: budget recap, Save Job (outline → toast), Submit Proposal (primary → toast or login prompt).
- Created `src/components/modals/wallet-modal.tsx` — shadcn Dialog (max-w-2xl). Render nothing when `!walletOpen`. Header: khidma-gradient strip with wallet icon + total balance. Tabs:
  - Balances: 4 balance cards (Available / Pending / Processing / Withdrawn) with icons + colored badges + sub labels, mini 30-day earnings bar chart, "Request Withdrawal" button.
  - History: 6 mock transactions (credit/debit arrows, date, project, amount colored +/−, status badge AVAILABLE/PENDING/PROCESSING/WITHDRAWN/REFUNDED).
  - Methods: first 6 from `withdrawalMethods` rendered as grid with logo, name, type/fee, processing time.
  Sticky footer: available recap + "Manage methods" + "Request Withdrawal" (toast with login prompt if not authenticated).
- Created `src/components/modals/index.ts` — barrel export for all six modals.

Quality details:
- Every modal is `"use client"` and uses the Khidma palette only (#2b3d3d, #32504d, #475959, #748684, #6e8580, #192d2f, #ffffff) — no indigo/blue.
- Entrance animations via `motion` / `AnimatePresence` (horizontal slide in onboarding, fade/slide in profiles & services, layout animation for portfolio cards).
- Body scroll locked on open (`document.body.style.overflow = "hidden"`) and restored on cleanup.
- Backdrop-click & ESC close handled via shadcn `Dialog onOpenChange`.
- Mobile close buttons added for non-full-screen modals.
- Sticky footer action bars on long modals (onboarding, freelancer profile, service, job, wallet).
- All toasts use `sonner` for feedback.
- Lint passes: `cd /home/z/my-project && bun run lint` — 0 errors, 0 warnings. Fixed two issues during dev: replaced setState-in-Effect patterns with React 19 render-time state adjustment (render-time setState when prop changes), and removed unused `eslint-disable` directives for `@next/next/no-img-element`.

Stage Summary:
- 6 modal files + 1 barrel export written under `src/components/modals/`.
- All wired to the global Zustand store (`useApp`) — read modal flags, call open/close/login methods.
- Ready to be composed into the main page (`src/app/page.tsx`) by the integration agent.

---
Task ID: 6-a
Agent: full-stack-developer (dashboard)
Task: Build the freelancer dashboard view (`DashboardView`) — top bar + sticky sidebar (Sheet on mobile) + 9 tabbed views: Overview, My Profile, Portfolio, Services, Proposals & Applications, Contracts, Wallet & Earnings, Reviews, Settings. All within the `/` route, Khidma teal palette only, framer-motion tab transitions, recharts charts.

Work Log:
- Read `/home/z/my-project/worklog.md`, `src/lib/khidma-data.ts` (full), `src/lib/store.ts`, `src/components/khidma/{verification,logo,freelancer-card}.tsx`, `src/components/modals/wallet-modal.tsx`, `src/app/globals.css`, `src/app/layout.tsx` to align with project conventions (palette #475959 #2b3d3d #748684 #192d2f #32504d #6e8580 #ffffff, font-display = Sora, font-arabic = IBM Plex Sans Arabic, existing khidma-card / bg-khidma-gradient / bg-dot-grid utilities, VerificationBadge/VerificationChecklist components).
- Created `src/lib/dashboard-mock.ts` — typed mock data: `kpis` (4 KPI numbers + monthly earnings/growth + response rate etc.), `earningsMonthly` (6 months Mar–Aug with earnings + withdrawals), `activityFeed` (5 typed `ActivityItem` rows: proposal/milestone/payment/review/portfolio), `profileCompletion` (85% with 8-item breakdown), `proposals` (5 typed `Proposal` rows with status PENDING/VIEWED/SHORTLISTED/HIRED/DECLINED + bid amounts + cover letters), `contracts` (4 typed `Contract` rows with milestones + statuses FUNDED/IN_PROGRESS/DELIVERED/APPROVED), `walletBalances` (4 cards), `walletTransactions` (6 typed `WalletTxn` rows), `ratingMetrics` (4.9 overall + 4-metric breakdown), `applicationStatus` (APPROVED badge), `notificationDefaults` (5 toggles), `quickActions` (4 actions), plus `proposalStatusStyles` / `contractStatusStyles` / `milestoneStatusStyles` / `txnStatusStyles` color maps.
- Created `src/components/views/dashboard-view.tsx` (~1,300 lines, `"use client"`):
  - `NAV_ITEMS` array with 9 entries (Overview/Profile/Portfolio/Services/Proposals/Contracts/Wallet/Reviews/Settings) — each with Lucide icon + label + optional badge count (Portfolio=3, Services=2, Proposals=4, Contracts=3).
  - `TopBar` component — sticky h-16 header with Back-to-Home button (→ `setView('home')`), avatar + "Welcome back, {firstName}" + title, animated notification bell dropdown (shows 3 latest activity items with icon-colored mini-cards), and wallet mini-card on the right (gradient icon + "Available: TND 4,250" → `openWallet()`).
  - `SidebarContent` — profile mini-card (avatar, name, top-rated star, username), nav buttons (active = `bg-[#2b3d3d] text-white` with white count badge), and bottom "Application: APPROVED" status card (emerald-tinted, LIVE badge, approved-on date).
  - `DesktopSidebar` — `hidden lg:block w-60`, sticky top-20 with `h-[calc(100vh-6rem)]`.
  - `MobileSidebar` — controlled shadcn `Sheet` (left side, 280px) containing the same sidebar; closes on tab pick.
  - **OverviewTab** — 4 KPI cards (Available Balance with chevron→ `openWallet`, Pending Clearance, Active Contracts, Completed Projects) with motion stagger; earnings `AreaChart` (recharts, 6 months, #32504d gradient) with `ChartTooltip` and "Earnings" header + "+12%" badge; Recent Activity feed card (5 items, color-coded mini icons, scrollable max-h-260); Quick Actions card (4 buttons: Edit Profile, Add Portfolio Item, Create Service, Browse Jobs — last one → `setView('jobs')`, others → tab switch); Profile Completion card (85% progress bar + 8-item checklist with check icons + per-item %); Verification Status card (renders all of Amira's VerificationBadge + VerificationChecklist).
  - **ProfileTab** — header card with khidma-gradient cover strip + 20px avatar overlay + name + all verification badges + meta row + "Preview Public Profile" button (→ `openFreelancer('f1')`); About card with bio; 6 editable section cards (Personal/Professional/Languages/Skills/Rates/Availability) each with icon + "Edit" button (sonner toast) + field grid (2 cols) or custom chip cluster.
  - **PortfolioTab** — "Add Portfolio Item" button + 3 portfolio cards with cover image (Next/Image, aspect-4/3, hover scale), type badge + verification badge (Verified/External/Self-declared) + visibility badge + skills chips + results highlight + Edit/Delete ghost buttons; empty-state fallback for users with no portfolio.
  - **ServicesTab** — "Create Service" button + 2 service cards (horizontal layout: 128px cover + content with title/PUBLISHED badge/description/meta/starting-at + Edit/Pause/Delete ghost buttons).
  - **ProposalsTab** — filter pills (All/Active/Awarded/Declined) with live counts; list of 5 proposal rows in a shadcn Card (divide-y) with client avatar, job title + status badge, client + submitted date, cover letter quote, and bid amount (with /hr suffix for hourly).
  - **ContractsTab** — 4 contract cards with client avatar, title + status badge, started date, milestone progress (X/Y + Progress bar + amber "Next: date"), total value, and a chevron rotate; clicking expands an `AnimatePresence height:auto` panel showing numbered milestone rows with status badges (PENDING_FUNDING/FUNDED/IN_PROGRESS/DELIVERED/APPROVED) and amounts.
  - **WalletTab** — "Request Withdrawal" CTA (→ `openWallet()`); 4 balance cards (Available/Pending/Processing/Withdrawn-2025); earnings-vs-withdrawals grouped BarChart (recharts, #2b3d3d + #748684); transactions Table with credit/debit arrows, color-coded amounts, and status badges (AVAILABLE/PENDING/PROCESSING/WITHDRAWN/REFUNDED); withdrawal methods grid (uses `withdrawalMethods` from khidma-data, hover teal border); secure-escrow notice card with ShieldCheck icon.
  - **ReviewsTab** — summary card with big 4.9/5 number + 5 stars + review count on left and 4 metric progress bars (Communication/Quality/Delivery/Professionalism) with gradient fill on right; 4 review cards (avatar, name, project + date, 5-star row, comment, and per-review 4-metric mini-grid).
  - **SettingsTab** — Account Information card (4 Input fields with Label + Save button → sonner toast); Security card (Password Change / 2FA Switch / Active Sessions); Notifications card (5 Switch toggles driven by local `notifState` with sonner feedback per toggle); Privacy card (Select for profile visibility + 2 Switches); Payment Methods card (3 active method rows + Add button); Close Account danger-zone card (rose-tinted, Deactivate + Close permanently buttons).
  - Main `DashboardView` switches tabs via `TAB_RENDERERS` lookup + `AnimatePresence mode="wait"` (opacity/y transition, 0.25s).
- Created `src/components/views/index.ts` — barrel re-export (`export { DashboardView, default } from "./dashboard-view"`).
- Lint check: `bunx eslint src/components/views/dashboard-view.tsx src/lib/dashboard-mock.ts src/components/views/index.ts` → 0 errors / 0 warnings.
- TypeScript check: `bunx tsc --noEmit` filtered to dashboard files → no output (clean).
- Dev server compiled the new file multiple times successfully (visible in `/home/z/my-project/dev.log`).
- Project-wide `bun run lint` still reports 7 problems — all in `src/components/views/admin-view.tsx` (Task 6-b, different agent's file, outside this task's scope). My files are clean.
- Did NOT modify `src/app/page.tsx` (per instructions) — another agent will compose the page.
- Wrote work record to `/home/z/my-project/agent-ctx/6-a-full-stack-developer-dashboard.md`.

Stage Summary:
- 3 files delivered under `src/components/views/` (dashboard-view.tsx, index.ts) and `src/lib/` (dashboard-mock.ts).
- `DashboardView` is `"use client"`, self-contained, mounted via `setView('dashboard')`. Composer can `import { DashboardView } from "@/components/views"`.
- Khidma teal palette only — no indigo/blue. framer-motion transitions on tab switch + chart KPI stagger + contract expand. recharts AreaChart + BarChart with custom Tooltip. All action feedback via `sonner` toasts.
- Mobile responsive: top bar collapses welcome text on mobile (`hidden sm:block`), sidebar collapses to Sheet, contracts/proposals/service cards reflow to single column, transactions table hides project column on mobile (`hidden sm:table-cell`) and status column on tablet (`hidden md:table-cell`).
- Footer status: dashboard is a full-height view (`min-h-screen flex flex-col`); page composer should still mount the global Khidma footer after it for consistency.


---
Task ID: 5-a
Agent: full-stack-developer (marketplace views)
Task: Build 4 marketplace view components (FreelancersView, ServicesView, JobsView, HowItWorksView) under `src/components/views/`, plus the barrel index.ts export. Each view is mounted via Zustand `view === 'freelancers' | 'services' | 'jobs' | 'how-it-works'` inside the single `/` route.

Work Log:
- Read `/home/z/my-project/worklog.md`, `src/lib/khidma-data.ts`, `src/lib/store.ts`, `src/components/khidma/{freelancer-card,service-card,job-card,verification}.tsx`, `src/components/sections/how-it-works.tsx`, `src/components/sections/featured-freelancers.tsx`, shadcn UI primitives (`select`, `slider`, `sheet`, `dropdown-menu`, `radio-group`, `checkbox`, `separator`, `badge`, `skeleton`), and `src/app/globals.css` to align with Khidma teal palette tokens, `khidma-card`, `shimmer`, `font-display`, `font-arabic` utilities.
- Discovered that other agents (Task 6-a dashboard) had already created `dashboard-view.tsx`, `admin-view.tsx`, and the barrel `index.ts`. Preserved `DashboardView` and `AdminView` exports when rewriting `index.ts`.
- Created `src/components/views/freelancers-view.tsx` — "Find Verified Talent" browse page with: header (title, subtitle, "Showing X of Y freelancers" count, back-to-home), 2-col grid (`lg:grid-cols-[280px_1fr]`), sticky desktop filter sidebar inside a `Card`, mobile sidebar via shadcn `Sheet` (left side). Filter panel includes: search input (synced with global `searchQuery`/`setSearchQuery`), category checkbox list (all 11 categories with counts), skills multi-select chips (derived from `categories.flatMap(c => c.skills)` unique sorted), hourly rate dual-thumb Slider (TND 20–100), availability RadioGroup (Any/Available/Limited), verification-level checkboxes (Email/Phone/Identity/Portfolio/Top Rated with icons), country `Select` (All/Tunisia/Worldwide), active filter count badge + "Clear all" button. Toolbar with sort `Select` (Top Rated / Newest / Most Reviews / Hourly Low→High / Hourly High→Low) and layout `DropdownMenu` (Grid view / List view with active checkmark). Staggered `motion.div` grid (1/2/3 cols) of `FreelancerCard`, or list variant of `FreelancerListRow`. Empty state card + 3 shimmer skeletons + "Load more" button (visual, increments 6). All filters functional via `applyFilters()` + `sortFreelancers()` `useMemo`.
- Created `src/components/views/services-view.tsx` — "Browse Services" page with header, horizontally-scrollable category pills row (All + 11 categories with EN + AR `font-arabic` labels, desktop-only left/right scroll arrows using `useRef<HTMLDivElement>` + `scrollBy({behavior:'smooth'})`), search input + sort `Select` (Popular / Newest / Price Low→High / Price High→Low / Top Rated), active filter summary as removable Badges, ServiceCard grid (1/2/3/4 cols responsive). `SERVICE_CATEGORY_TO_ID` map (Web Development→development, 3D Art→3d, etc.) for pill filtering. Dark gradient footer callout card with `setView('jobs')` CTA. Empty state + shimmer skeleton + "Load more" button.
- Created `src/components/views/jobs-view.tsx` — "Find Work" page with header, sticky desktop filter sidebar + mobile `Sheet`. Filters: job type RadioGroup (Any/Fixed/Hourly), experience level RadioGroup (Any/Entry/Intermediate/Expert), budget range Slider (TND 0–2000), category Checkbox list, location `Select` (Any/Tunisia/Worldwide/Remote), verified-only `Switch`. Sort `Select` (Newest / Oldest / Budget High→Low / Most / Least proposals). Stats row (total proposals, verified count). JobCard grid (1 col mobile / 2 cols lg). Dark gradient footer trust banner (41 countries / 24 cities). Empty state + JobSkeleton + "Load more" button. `JOB_CATEGORY_TO_ID` map for category filtering.
- Created `src/components/views/how-it-works-view.tsx` — long-form single-page "How Khidma Works" layout. Header with back-to-home, hero subtitle, and 3 trust Badges (1,248 verified freelancers / TND 1.24M paid out / 41 countries). 5 major sections:
  - **For Freelancers** (4 phases, 21 total steps): Phase 1 Onboarding (Register, Email Verify, Create Profile, Upload Photo) — Phase 2 Build Profile (Add Professional Info, Add Skills, Add Experience, Add Portfolio, Submit Application) — Phase 3 Verification & Approval (Admin Review, Approved, Verified) — Phase 4 Work, Earn, Grow (Apply for Jobs, Create Services, Get Clients, Contracts, Milestones, Work & Deliver, Client Approval, Earnings, Withdrawal). Each phase has a numbered `PhaseHeader` and a `VerticalTimeline` of step cards (numbered circle + icon + title + description) with `whileInView` staggered entrance and a left-side gradient connecting line.
  - **For Clients** (3 phases, 9 total steps): Phase 1 Post & Find (Post Job, Search, Invite) — Phase 2 Contract & Fund (Compare, Sign Contract, Fund Milestone) — Phase 3 Review & Pay (Review Work, Release Payment, Leave Review). Each phase renders a `HorizontalStepGrid` of 3 numbered cards with large `font-display` watermark numbers.
  - **Trust System**: 3 feature cards (Verification Badges / 1% Platform Fee / Escrow Protection) with bullet checklists.
  - **Payment & Withdrawals**: 6 withdrawal method cards from `withdrawalMethods` data (emoji logo, name, type badge, fee, processing time) + dark "99% to you. 1% to Khidma." explainer strip.
  - **Reviews & Reputation**: 4-metric breakdown card (Communication / Quality / Delivery / Professionalism) with animated progress bars using Khidma hex palette + dark sample review card from `reviews[0]` with mini-metrics grid.
  - Final CTA section: dark gradient Card with "Become a Verified Freelancer" (primary → `openOnboarding()`) and "Post a Job" (outline → `setView('jobs')`) buttons.
- Updated `src/components/views/index.ts` to export `FreelancersView`, `ServicesView`, `JobsView`, `HowItWorksView` while preserving existing `DashboardView` (named) and `AdminView` (default) exports for composer compatibility.
- Lint passes: `bunx eslint src/components/views/{freelancers,services,jobs,how-it-works}-view.tsx src/components/views/index.ts` → 0 errors / 0 warnings. Project-wide `bun run lint` → exit 0 clean.
- Wrote work record to `/home/z/my-project/agent-ctx/5-a-full-stack-developer-marketplace-views.md`.

Stage Summary:
- 4 view files + 1 barrel index.ts delivered in `/home/z/my-project/src/components/views/`.
- All views are `"use client"`, default + named exported, self-contained (no props), Khidma teal palette only, `font-display` for headings, framer-motion staggered entrances, mobile-first responsive.
- Reuse existing khidma components (`FreelancerCard` / `FreelancerListRow` / `ServiceCard` / `JobCard`) and full shadcn/ui set (Button, Input, Card, Badge, Checkbox, RadioGroup, Slider, Sheet, Select, DropdownMenu, Separator, Switch).
- Filters are functional via `useMemo` + pure helper functions. Empty states + shimmer skeletons + "Load more" buttons on all browse views.
- Mobile sidebar collapses to shadcn `Sheet` (left side) on `lg` breakpoint.
- Composer agent can `import { FreelancersView, ServicesView, JobsView, HowItWorksView } from '@/components/views'` and mount each when `view === ...`.
- Page.tsx not modified (per instructions); another agent will compose the page.

---
Task ID: 7-a
Agent: full-stack-developer (admin console)
Task: Build the Admin Review Console for Khidma — a 3-column dashboard where admins review freelancer applications and decide APPROVE / REJECT / REQUEST INFORMATION.

Work Log:
- Read `/home/z/my-project/worklog.md`, `src/lib/khidma-data.ts`, `src/lib/store.ts`, `src/components/khidma/verification.tsx`, `src/components/khidma/logo.tsx`, `src/app/globals.css`, and shadcn UI primitives (Button, Card, Tabs, Badge, Avatar, Textarea, Select, Checkbox, Dialog, Tooltip, Separator, ScrollArea, Progress, Table, Label, Input, AlertDialog) to align with the Khidma design system (bg-khidma-gradient, font-display = Sora, font-arabic = IBM Plex Sans Arabic, teal palette only, no indigo/blue).
- Created `src/lib/admin-mock.ts` — full mock data layer:
  - 5 `AdminApplication` objects based on existing freelancers (f1 Amira / f5 Rania / f6 Omar / f2 Yassine / f4 Mehdi) covering each ApplicationStatus (UNDER_REVIEW, MORE_INFORMATION_REQUIRED, SUBMITTED, APPROVED, REJECTED). Each carries: application ID (APP-2025-00XX), assigned reviewer, phone/email, years of experience, primary category, starting price, identity status, risk signals, 15-item checklist with checked state, per-portfolio-item review state, 1-4 admin notes, history events, and audit log entries.
  - Risk signals vary by app: APP-0014 LOW, APP-0015 MEDIUM (duplicate watch + 1 prior rejection + self-declared portfolio only), APP-0011 LOW (approved), APP-0009 HIGH (suspicious duplicate, 2 prior rejections, 1 client report, plagiarized portfolio audio).
  - 15-item `checklistTemplate` grouped by Identity (3) / Profile (5) / Portfolio (2) / Risk (2) / Quality (3) — per spec section 55. APP-0011 has all 15 checked.
  - 3 mock reviewers (Lina Ben Salah, Karim Jouini, Rim Hamdi) + System actor.
  - `adminKPIs` strip: 24 pending, 8 under review, 12 approved today, 3 rejected today, 1,248 total verified.
  - Display config maps: `statusConfig`, `riskConfig`, `signalConfig`, `decisionConfig`, `verificationLabel`, `visibilityLabel`; helpers: `checklistCount`, `formatDate`, `formatDateTime`, `timeAgo`.

- Created `src/components/views/admin-view.tsx` (~2400 lines, "use client"):
  - Header + KPI strip: sticky KhidmaLogo + "Admin Console" badge + keyboard-shortcut tooltip + "Back to Home" button (`setView('home')`). KPI strip with 5 color-coded tiles.
  - Application queue (desktop scroll list / mobile Select dropdown) + "Next Application" button that cycles the queue with a toast.
  - LEFT COLUMN (sticky + scrollable on lg, stacked on mobile): application header card with `bg-khidma-gradient` strip; profile photo + verification badges; personal info; professional info; skills chips; experience timeline; "View Public Profile" button → `openFreelancer(f.id)`.
  - CENTER COLUMN: "Portfolio Review" section; per-item reviewable card with cover image + category/role/decision overlays, description, skill chips, verification status Select, visibility badge, Live/Repo URL links, 3 action buttons (Approve/Flag/Reject — Reject opens a reason Dialog), per-item admin note Textarea. Empty state when no items.
  - RIGHT COLUMN (sticky + scrollable): `VerificationPanel` (email/phone/identity/portfolio X/Y + overall), `RiskPanel` (duplicate, suspicious, prior rejections, reports, internal flags, color-coded overall LOW/MEDIUM/HIGH ring), `ChecklistPanel` (15 items grouped by group, Progress bar + X/15 badge, ScrollArea capped 280px), `DecisionPanel` (dark header, 3 motion-animated decision buttons APPROVE/REQUEST/REJECT with shortcut hints, AnimatePresence reason/info Textareas, internal admin note, "Submit Decision" button + Confirm Dialog previewing the message before submission).
  - BOTTOM SECTION (full width): shadcn Tabs with Admin Notes / History / Audit Log. AdminNotesTab — add-note form (Textarea + pin + Add Note) + sorted notes list (pinned first). HistoryTab — visual vertical timeline with status-colored dots. AuditLogTab — shadcn Table (timestamp / actor / action `<code>` / reason + details) capped at 420px ScrollArea. AnimatePresence cross-fades between applications.
  - Real interactivity via local `applications` state (initialized from `adminApplications`): mutation helpers for portfolio item review updates, checklist toggles, note additions, and decision submission. Submitting a decision updates the application's status, pushes a new history event + audit log entry, optionally adds an internal note, fires a color-coded sonner toast. Keyboard shortcuts A / R / X select APPROVE / REQUEST_INFORMATION / REJECT via a ref-registered callback (avoids react-hooks/refs lint rule). Shortcuts suppressed while typing in inputs. "Next Application" cycles the queue with a toast. All transitions via framer-motion.
  - Layout: `mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8 py-6`, 3-column `lg:grid-cols-[360px_minmax(0,1fr)_380px]`, sticky left/right columns with capped overflow on desktop; stacked flow on mobile. `min-h-screen flex flex-col` root + `mt-auto` footer.

Quality details:
- Khidma teal palette only; emerald/amber/red used only for status semantics (no indigo/blue).
- shadcn UI + lucide-react used throughout; `sonner` for feedback; `font-display` (Sora) for headings/KPIs.
- Initial lint surfaced 7 errors + 1 warning, all fixed:
  1. `Cannot access refs during render` (×5) — switched render-time prop-change reset from `useRef` pattern to the documented React 19 pattern using a separate `useState` for `prevAppId`.
  2. `'TooltipProvider' is not defined` — removed outer wrapper (shadcn `Tooltip` already wraps itself in TooltipProvider).
  3. Unused eslint-disable directive for `@next/next/no-img-element` (rule is globally disabled) — removed the comment.
  4. `TS2367` (unreachable `decision !== "APPROVE"` after `decision === "APPROVE"` check) — simplified to `(decision === "APPROVE" || message.trim().length > 0)`.
- After fixes: `bun run lint` → 0 errors / 0 warnings (for files in scope of this task). `bunx tsc --noEmit --skipLibCheck` → 0 errors in admin-view.tsx / admin-mock.ts (remaining errors are in `examples/` and `skills/` outside this task's scope).
- `bun run dev` server compiled successfully (verified via dev.log). `src/app/page.tsx` was NOT modified — the composer agent will render `<AdminView />` when `view === 'admin'`.

Stage Summary:
- 2 files delivered:
  - `/home/z/my-project/src/lib/admin-mock.ts` — mock data layer (5 applications, risk signals, 15-item checklist template, admin notes, history, audit log, reviewers, display config maps, helpers).
  - `/home/z/my-project/src/components/views/admin-view.tsx` — full Admin Review Console ("use client", default-exported, no props required).
- Composer integration: `import AdminView from "@/components/views/admin-view"` then `{view === "admin" && <AdminView />}` inside the page switch.
- Self-contained: no API routes needed; all local state mutations reflect immediately with sonner toasts; audit log and history timeline are appended-to live.

---
Task ID: FINAL
Agent: Z.ai Code (main)
Task: Compose main page.tsx, fix next.config image hosts, fix AdminView export, set up Prisma schema, build API routes, run agent-browser end-to-end verification, create 15-min webDevReview cron job.

Work Log:
- Composed src/app/page.tsx with dynamic-imported views + framer-motion AnimatePresence view transitions + global modals mounted once + sticky footer layout (`min-h-screen flex flex-col`).
- Added next.config.ts image remotePatterns for picsum.photos, dicebear, fastly, etc., and allowedDevOrigins for the preview-* space-z.ai host.
- Removed unsupported `eslint` key from next.config (Next 16 dropped it).
- Fixed AdminView dynamic import — admin-view uses default export, page was calling .AdminView.
- Built full Prisma schema with ~25 models: User, Profile, FreelancerProfile, ClientProfile, FreelancerApplication, ApplicationHistory, FreelancerVerification, Appeal, PortfolioItem, PortfolioMedia, Category, Skill, Service, ServicePackage, ServiceMedia, Job, Proposal, Contract, Milestone, Deliverable, Payment, Wallet, LedgerEntry, Withdrawal, Review, ReviewMetric, AdminNote, AuditLog, RiskFlag, Notification, PaymentProvider. Pushed with `bun run db:push` — schema in sync.
- Built 5 API routes: /api/stats, /api/freelancers (only APPROVED), /api/jobs (only OPEN), /api/services (only PUBLISHED + VERIFIED freelancer), /api/withdrawal-methods (all clearly marked `mock: true` so the UI never lies about real transactions).
- Agent-browser end-to-end verification:
  - Home view: hero renders, trust strip + how-it-works + categories + featured freelancers + services + jobs + stats banner + why-khidma + payment explainer + withdrawal options + testimonials + FAQ + final CTA all visible.
  - Auth modal: opens on "Join Khidma", dual-panel layout, terms checkbox required, successful login + toast.
  - Onboarding wizard: 8-step wizard opens on "Start Freelancing", progress bar + back/next + step transitions all working.
  - Freelancer profile modal: opens on card click, tabs (Overview/Portfolio/Services/Reviews) present, verification checklist visible.
  - Freelancers view: filter sidebar + grid + sort + empty state.
  - Jobs view: filters + grid.
  - Services view: category pills + grid.
  - How It Works view: 21-step freelancer lifecycle + 4-step client flow + withdrawal methods.
  - Dashboard view (after login): 9 tabs — Overview, Profile, Portfolio, Services, Proposals, Contracts, Wallet, Reviews, Settings.
  - Admin Review Console (after login): KPIs + 5-application queue + 3-column layout (freelancer info / portfolio review / verification+risk+decision panel) + Approve/Flag/Reject per-item buttons + bottom tabs (Admin Notes/History/Audit Log).
- VLM (z-ai vision) verified: hero "polished and production-ready"; footer contains "Designed & Developed by Amara Dhaker" + "Bringing ideas to life through modern digital experiences" + dhakeramarawork@gmail.com + WhatsApp +216 99 49 55 58; freelancers view "polished, professional, effectively communicates trust"; admin console "high-fidelity, functional, polished".
- Created 15-min recurring webDevReview cron job (id 328735) to keep improving the project autonomously.

Stage Summary:
- Single-page Khidma marketplace complete on `/` with 6 views + 6 modals + 14 landing sections.
- Lint: 0 errors. TypeScript (excluding examples/skills): 0 errors. Dev server: 200 OK on `/`.
- Prisma schema synced; 5 secure API routes (enforce: APPROVED only for freelancers, OPEN only for jobs, PUBLISHED + VERIFIED for services, all withdrawal methods marked `mock: true`).
- Footer attribution + contact info verified both in DOM text and via VLM screenshot analysis.
- 15-min webDevReview cron scheduled.
