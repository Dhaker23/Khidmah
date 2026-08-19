# ROUND11-FEATURES-1 — Review + Top-up Modals

**Task ID:** ROUND11-FEATURES-1
**Agent:** full-stack-developer (review + topup modals)
**Date:** 2025-08-19

## Task
Build 2 new Khidma modals — (1) `review-modal.tsx` for rating/reviewing a freelancer after a completed contract, and (2) `topup-modal.tsx` for topping up the wallet balance. Wire them into the global store, modals barrel, page.tsx mount, and add a "Top up" entry point in the existing WalletModal.

## Work Log

### Read first
- `/home/z/my-project/worklog.md` — understood full project context (Round 10 done: scroll-progress, Tunisian Cities, Stats view, section rhythm dividers; ~27 landing sections, 7 views, 22 modals).
- `src/lib/store.ts` — existing modal state pattern + ModalState interface + actions.
- `src/components/modals/index.ts` — barrel exports.
- `src/components/modals/wallet-modal.tsx` — entry-point modal to add a "Top up" button.
- `src/components/modals/report-modal.tsx` — reference pattern for self-rendering Dialog with payload state.
- `src/app/page.tsx` — dynamic modal mount pattern (ssr:false).
- `src/components/khidma/logo.tsx` — KhidmaLogo API.
- `src/components/ui/{dialog,switch,radio-group,avatar,checkbox,label,textarea,input,button,badge}.tsx` — shadcn primitives available.
- `src/lib/khidma-data.ts` — `formatTND`, `withdrawalMethods`.
- `src/app/globals.css` — `.bg-khidma-gradient` utility + Khidma teal palette tokens.

### Store changes — `src/lib/store.ts`
- Added new exported `ReviewPayload` interface:
  ```ts
  {
    contractTitle: string;
    reviewerName: string;
    revieweeName: string;
    revieweeAvatar: string;
    contractId: string;
  }
  ```
- Added 3 new fields to `ModalState` interface: `reviewOpen: boolean`, `reviewPayload: ReviewPayload | null`, `topupOpen: boolean`.
- Added 3 new fields to initial state object inside `modal: { ... }`.
- Added 5 new action signatures to `AppState` interface: `openReview(payload)`, `closeReview()`, `openTopup()`, `closeTopup()`.
- Implemented actions (all follow existing `set((s) => ({ modal: { ...s.modal, ... } }))` pattern).

### Feature 1 — `src/components/modals/review-modal.tsx` (~360 LOC)
- **Self-renders** based on `modal.reviewOpen` from store. Early-returns null when closed (matches WalletModal pattern).
- **`max-w-lg`** Dialog with Khidma teal gradient header.
- **Header**: Avatar (reviewee) + "Rate your experience" title + "How was your experience with {revieweeName}?" subtitle + small contract title (truncated). Close button via `showCloseButton`.
- **Overall rating** — large, centered. 5 interactive star buttons (40px each), motion-button with `whileHover` (scale 1.12) + `whileTap` (scale 0.92) + spring transitions. Hover preview state (`overallHover`). Below: animated label showing "5/5 · Excellent" or "Tap a star to rate" using AnimatePresence + framer-motion (x-shift fade).
- **Metric ratings** — 4 rows in a list, each row: icon chip (changes color when rated) + label + small star row (18px):
  - Communication — `MessageSquare`
  - Quality of Work — `Sparkles`
  - On-time Delivery — `Clock`
  - Professionalism — `Briefcase`
- **Public review** Textarea (4 rows, min 50 chars, max 500 chars). Live char counter — gray below 50, teal 50–450, amber 450–500. Placeholder: "Share details about your experience…".
- **Private feedback** Textarea (2 rows, max 400 chars, optional). Label: "Private feedback (optional)" + placeholder: "Private notes for Khidma (not visible to {revieweeName})".
- **Would recommend** — `Switch` (teal checked state) + "Would recommend" + "Would you recommend {revieweeName} to others?".
- **Anonymous** — `Checkbox` (teal checked state) + "Post this review anonymously".
- **Footer**: status badge (Ready to submit / Log in required / Fill required fields) on desktop, "Cancel" ghost button, "Submit Review" primary (disabled until overall + all 4 metrics + 50+ char public review). Submit shows `Loader2` spinner ("Submitting…").
- **On submit**: `pushNotification({ type: "review", title: "Review submitted", body: "Your review for {revieweeName} has been published.", link: "dashboard" })` + `toast.success("Review submitted! ⭐", { description: "{overall}/5 · {label}" })` + close + reset (via useEffect on `[reviewOpen, reviewPayload?.contractId]`).
- **`prefers-reduced-motion`**: disabled `whileHover`/`whileTap` scale + disabled label fade/slide.
- **Accessibility**: ARIA `role="radiogroup"` + `role="radio"` + `aria-checked` + `aria-label` per star, `aria-label` on Switch/Checkbox, `focus-visible:ring` on star buttons, dialog title/description present (description `aria-describedby={undefined}`).
- **Mobile responsive**: stars stay centered, list rows stack label + stars (justify-between), footer uses `flex-row` with badge hidden on mobile.

### Feature 2 — `src/components/modals/topup-modal.tsx` (~440 LOC)
- **Self-renders** based on `modal.topupOpen` from store.
- **`max-w-md`** Dialog with Khidma teal gradient header (KhidmaLogo symbol on desktop + "Top up your wallet" title + "Add funds to hire freelancers faster." subtitle). Close button via `showCloseButton`.
- **Current balance card** — 2-col grid: "Available: TND 4,250.00" + "Pending: TND 1,800.00" (mock values, 2-decimal places via `formatAmount` helper).
- **Amount selection**:
  - Quick-amount buttons (5-col grid on sm, 3-col on mobile): TND 50 / 100 / 250 / 500 / 1,000. Each uses `formatTND` (no decimals). Selected = filled teal bg + white text + shadow.
  - Custom amount input (TND prefix, numeric inputMode, clamp 10–10,000). Validation: shows amber hint when out of range; shows green check when valid.
  - framer-motion `whileHover` (scale 1.03) + `whileTap` (scale 0.97) on quick-amount buttons (disabled when reduced motion).
- **Payment method** — RadioGroup with 4 options (icon chip + label + description):
  - Credit/Debit Card (`CreditCard`) — "Visa, Mastercard"
  - Bank Transfer (`Building`) — "BIAT, TIJARI, Zitouna"
  - D17 Mobile (`Smartphone`) — "Instant mobile payment"
  - Tunisian Post (`Mail`) — "Post office transfer"
- **Card details** (conditionally shown when method === "card" via AnimatePresence height/opacity transition):
  - Card number (grouped 4-digit blocks, max 16 digits, autocomplete cc-number)
  - Expiry (MM/YY auto-format, max 4 digits, autocomplete cc-exp)
  - CVC (3-4 digits, autocomplete cc-csc)
  - Name on card (autocomplete cc-name)
- **Summary card** — Khidma-tinted border + bg:
  - Amount: TND {X}
  - Discount line (only when promo applied): "Discount (CODE · −X%)"
  - Processing fee: Free (teal)
  - Total: TND {X} (bold, dark teal)
  - "Funds available instantly" with Zap icon
- **Promo code** input + "Apply" button. Validates against 3 mock codes: `KHIDMA10` (10% off), `WELCOME` (5% off), `TUNISIA` (15% off). Success toast: "Promo code applied!" with discount description. Failure toast: "Invalid code". Hint text shows valid codes on failure.
- **Trust signal** — ShieldCheck icon + "Khidma uses 256-bit TLS encryption. Card details are processed by our PCI-DSS payment partner and never stored on our servers."
- **Footer**: selected-method badge (icon + label) on desktop + "Cancel" ghost + "Top up TND {X}" primary (shows discounted total). Submit shows `Loader2` spinner ("Processing…"). Disabled when amount invalid OR (card method AND card fields invalid).
- **On submit**: `pushNotification({ type: "payment", title: "Top-up successful", body: "TND {X} added to your wallet.", link: "dashboard" })` + `toast.success("Payment successful! 💰", { description: "{amount} added to your wallet" })` + close + reset (via useEffect on `[topupOpen]`).
- **`prefers-reduced-motion`**: disabled quick-amount button scale + card details AnimatePresence transition is fade-only (no height anim).
- **Accessibility**: `aria-label` on inputs, `aria-invalid` on promo when status invalid, ARIA `aria-pressed` on quick-amount buttons, focus-visible rings throughout.
- **Mobile responsive**: quick-amount grid 3-col mobile / 5-col sm, footer uses `flex-row` with badge hidden on mobile, summary stacked.

### Barrel + page wiring
- `src/components/modals/index.ts` — added `export { ReviewModal } from "./review-modal"` + `export { TopupModal } from "./topup-modal"`.
- `src/app/page.tsx`:
  - Added 2 dynamic imports (ssr:false): `ReviewModal`, `TopupModal`.
  - Mounted `<ReviewModal />` + `<TopupModal />` in the global modals block (after `<NewsletterModal />`).
- `src/components/modals/wallet-modal.tsx`:
  - Added `Wallet as WalletIcon` to lucide imports + `openTopup` from store.
  - Added a "Top up wallet" outline button (teal-bordered, with Wallet icon) in the balance tab, directly below the "Request Withdrawal" button — calls `closeWallet()` then `setTimeout(() => openTopup(), 120)` to allow close transition.
  - Added a smaller "Top up" outline button in the sticky footer next to "Manage methods" and "Request Withdrawal" — same wiring.

### Verification
- `bun run lint` → **0 errors / 0 warnings** (exit 0) on first pass after writing all files.
- `bunx tsc --noEmit` → **0 errors in any of my files** (only pre-existing errors in `examples/websocket/server.ts`, `skills/image-edit/scripts/image-edit.ts`, `skills/stock-analysis-skill/src/analyzer.ts` — all unrelated).
- Dev server (Next.js 16.1.3 Turbopack): `GET /` → **HTTP 200**, page rendered 1,075,023 bytes, `<title>Khidma — Trusted Tunisian Freelance Marketplace | خدمة</title>` confirmed.
- All "use client". Khidma teal palette only (`#475959 #2b3d3d #748684 #192d2f #32504d #6e8580 #ffffff`) — no indigo/blue. Mobile responsive. `prefers-reduced-motion` respected. framer-motion used throughout (motion.button, AnimatePresence, useReducedMotion). sonner for toasts.

## Stage Summary

### Files created
1. `src/components/modals/review-modal.tsx` (~360 LOC) — Rate & Review modal
2. `src/components/modals/topup-modal.tsx` (~440 LOC) — Wallet Top-up modal

### Files modified
1. `src/lib/store.ts` — Added `ReviewPayload` interface, `reviewOpen`/`reviewPayload`/`topupOpen` to ModalState + initial state, `openReview`/`closeReview`/`openTopup`/`closeTopup` actions
2. `src/components/modals/index.ts` — Added ReviewModal + TopupModal exports
3. `src/app/page.tsx` — Added 2 dynamic imports + 2 modal mounts
4. `src/components/modals/wallet-modal.tsx` — Added "Top up" buttons (in balance tab + sticky footer) + `openTopup` wiring + `Wallet as WalletIcon` import

### Modal count
- Project now has **24 modals** (was 22 before this round).

### Entry points for TopupModal
- "Top up wallet" button in WalletModal balance tab (large, outline)
- "Top up" button in WalletModal sticky footer (small, outline)
- Both close the wallet first then defer-open the top-up modal by 120ms to let the close transition start cleanly.

### Entry points for ReviewModal
- `openReview(payload)` available globally — designed to be called from a "Leave review" button on a completed-contract row (e.g., in dashboard-view). Payload requires `{ contractTitle, reviewerName, revieweeName, revieweeAvatar, contractId }`.

### Unresolved / Risks for next round
- No production wiring of `openReview()` from dashboard yet — the action exists and works; the dashboard-view would need a "Leave review" button calling `openReview({ contractTitle, reviewerName: currentUser.name, revieweeName, revieweeAvatar, contractId })`.
- Top-up is client-side mock — no real payment gateway integration (matches existing WalletModal mock pattern).
- Promo codes are mocked to 3 codes (KHIDMA10 / WELCOME / TUNISIA) — production would call a backend validation endpoint.
- Card fields are not validated against real card number checksums (Luhn) — only length/format checks.
- `useEffect` reset-on-open uses `react-hooks/set-state-in-effect` eslint-disable comment (matches `report-modal.tsx` precedent).
