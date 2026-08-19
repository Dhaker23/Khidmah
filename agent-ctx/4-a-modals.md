# Task 4-a — Khidma Interactive Modals

**Agent:** full-stack-developer (modals)
**Date:** 2026-08-18
**Scope:** Build all interactive modals for the Khidma marketplace within the `/` route, using only the Khidma teal palette, Next.js 16 + TS + Tailwind 4 + shadcn/ui + framer-motion + sonner.

## Files Created
- `src/components/modals/auth-modal.tsx` — login/register Dialog with two-column brand panel + Tabs toggle + Zod-lite validation + login() + toast.
- `src/components/modals/onboarding-wizard.tsx` — 8-step freelancer wizard (Personal Info → Professional → Skills → Experience → Portfolio → Photo → Verification → Review & Submit) with progress bar, framer-motion step transitions, sticky footer.
- `src/components/modals/freelancer-profile-modal.tsx` — public profile (max-w-5xl): cover gradient + avatar, header meta, stats row, Overview/Portfolio/Services/Reviews tabs, sticky footer CTAs.
- `src/components/modals/service-detail-modal.tsx` — two-column service detail with cover, freelancer mini-card, package Tabs (Basic/Standard/Premium), order card with price breakdown + Continue to Order.
- `src/components/modals/job-detail-modal.tsx` — job detail (max-w-3xl) with badges, budget box, description, skills, requirements checklist, client info, Submit Proposal + Save Job footer.
- `src/components/modals/wallet-modal.tsx` — wallet preview (max-w-2xl) with 4 balance cards, 30-day earnings mini-chart, transaction history, withdrawal methods grid, Request Withdrawal CTAs.
- `src/components/modals/index.ts` — barrel export for all six modals.

## Architecture Decisions
- Read `modal` slice + `login` / `openAuth` / `currentUser` from global store `@/lib/store` `useApp()` hook.
- All modals return `null` when their respective flag is closed, so they can stay mounted in the tree without rendering anything.
- React 19 render-time state adjustment used (instead of `setState` inside `useEffect`) to sync local state when `selectedFreelancerId`, `selectedServiceId`, or `onboardingOpen` change — this satisfies the project's `react-hooks/set-state-in-effect` ESLint rule.
- Body scroll lock applied on open and restored on cleanup.
- Login wall: CTAs (Invite to Job, Submit Proposal, Continue to Order, Request Withdrawal) show a `sonner` toast with a "Log in" action button when `!currentUser`, otherwise they show a success toast.
- Khidma palette only — no indigo/blue anywhere. Uses `bg-[#2b3d3d]`, `bg-[#32504d]/10`, `text-[#32504d]` etc.
- framer-motion `AnimatePresence` used for: auth tab switches (horizontal), onboarding step transitions (direction-aware slide), service package switches, portfolio expand/collapse, freelancer profile entrance.
- Sticky footer pattern: each long modal (onboarding, freelancer profile, service, job, wallet) has its action buttons pinned at the bottom; only the body scrolls.

## Lint Status
`cd /home/z/my-project && bun run lint` → 0 errors, 0 warnings.

## Integration Note for Page Agent
Import these modals in `src/app/page.tsx` (or a top-level layout component) and mount them once — they self-render based on store state:

```tsx
import {
  AuthModal,
  OnboardingWizard,
  FreelancerProfileModal,
  ServiceDetailModal,
  JobDetailModal,
  WalletModal,
} from "@/components/modals";

// Inside your root page:
<AuthModal />
<OnboardingWizard />
<FreelancerProfileModal />
<ServiceDetailModal />
<JobDetailModal />
<WalletModal />
```

To trigger them from anywhere in the app, use the store methods:
- `useApp((s) => s.openAuth)('login' | 'register')`
- `useApp((s) => s.openOnboarding)()`
- `useApp((s) => s.openFreelancer)('f1')`
- `useApp((s) => s.openService)('s1')`
- `useApp((s) => s.openJob)('j1')`
- `useApp((s) => s.openWallet)()`
