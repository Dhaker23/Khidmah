# Task ROUND7-FEATURES-1 — Khidma Partner Program Modal + Mobile App Promo Section

**Agent:** full-stack-developer (partners + mobile promo)
**Date:** 2026-08-19
**Scope:** Add 2 new features to Khidma — (1) `PartnersModal` (Khidma Partner Program for payment providers, banks, accelerators, educational institutions) + (2) `MobileAppPromo` landing section (phone mockup + feature list + app store badges + QR code). All within `/` route, Khidma teal palette only, Next.js 16 + TS + Tailwind 4 + shadcn/ui + framer-motion + sonner. Respects `prefers-reduced-motion`.

## Files Created / Modified

### Created (2)
- `src/components/modals/partners-modal.tsx` — `max-w-4xl` Dialog with header (gradient), hero strip (3 trust badges: 12+ active partners · TND 2.4M+ processed jointly · 41 countries), 4 partner-type cards (2×2 grid: Payment Providers / Banks & Financial Institutions / Accelerators & Incubators / Educational Institutions), 6-benefit grid (Revenue sharing up to 30% / Co-marketing / Partner portal / API / Priority support / Quarterly business reviews), 3-tier pricing (Associate Free / Premier TND 5,000/yr / Strategic Custom), partner logos row (BIAT Bank / Tunisian Post / D17 / Flat6Labs Tunis / Esprit University), "Become a partner" application form (Name / Email / Company / Partner type Select / Message Textarea + Apply now button → toast + pushNotification + close; Schedule a call ghost button → toast), 4-question FAQ accordion. Self-renders based on `modal.partnersOpen`.
- `src/components/sections/mobile-app-promo.tsx` — `MobileAppPromo` landing section. 2-column layout (desktop): phone mockup (left) + content (right). Phone mockup is a styled div (`aspect-[9/19]`, `rounded-[2rem]`, dark border, shadow) with internal stylized app UI (Khidma logo at top, fake freelancer card with avatar + name + 5.0 rating + TND 80/hr + View profile button, fake push notification toast with animated slide-down, 3 mini-stats, bottom nav bar with 5 icons). Right column: eyebrow "KHIDMA MOBILE", title "Take Khidma everywhere you go.", description, 6-feature list (Instant push notifications / Real-time chat / Wallet + earnings / Biometric login / Offline mode / Quick withdrawal), App Store + Google Play badges (lucide Apple/Play icons → toast "App coming soon!"), stats row (4.9★ App Store · 100K+ downloads · 41 countries), QR code mock (CSS grid of 21×21 deterministic black/white squares with finder patterns + timing patterns + Khidma logo overlay in center) + "Scan to download" label. framer-motion subtle tilt on phone hover. Reveal for entrance.

### Modified (5)
- `src/lib/store.ts` — Extended `ModalState` with `partnersOpen: boolean`; added `openPartners()` + `closePartners()` to `AppState` interface + initial state (`partnersOpen: false`) + implementation in `create()`.
- `src/components/modals/index.ts` — Exported `PartnersModal`.
- `src/components/sections/index.ts` — Exported `MobileAppPromo`.
- `src/app/page.tsx` — Added `MobileAppPromo` to landing composition (after `<BlogSection />`, before `<FAQ />`); added dynamic import + mount for `<PartnersModal />` (ssr:false).
- `src/components/khidma/footer.tsx` — Extended `NavLink.action` union with `"partners"`; added `{ label: "Partner Program", action: "partners" }` to the "Marketplace" column; destructured `openPartners` from `useApp()`; added `if (link.action === "partners") return openPartners();` branch to `onNavigate`.

## Architecture Decisions

### Store
- Followed existing pattern: `partnersOpen` lives in the `modal` slice alongside `teamsOpen`/`apiDocsOpen`. Two new actions (`openPartners`/`closePartners`) mirror the existing pair pattern. No persistence needed (modal state is ephemeral).

### PartnersModal
- Used shadcn `Dialog` with `max-w-4xl` (matches `TeamsModal`). Header is gradient (`from-[#192d2f] via-[#2b3d3d] to-[#32504d]`) with `Handshake` icon + title "Khidma Partner Program" + subtitle "Join the Khidma ecosystem. Grow with us." + close button (top-right).
- `ScrollArea` wraps the body (`max-h-[90vh]`) so the modal scrolls internally on smaller screens. Header stays pinned.
- **Partner-type cards** use 2×2 grid (`sm:grid-cols-2`) with entrance animation (stagger by index, opacity+y). Each card has icon, title, tagline (uppercase eyebrow), description, 2×2 feature list with check icons.
- **Benefits grid** (`sm:grid-cols-2 lg:grid-cols-3`) — 6 cards each with icon + title + description. Same stagger pattern.
- **Tier cards** — 3 across (`sm:grid-cols-3`). Highlight on "Premier" (Recommended badge). framer-motion `whileHover={{ y: -4 }}` for subtle lift. Each tier has Apply/Talk-to-sales button → toast.
- **Partner logos** — styled text pills with `Building2` icon. `whileHover={{ y: -2 }}` micro-interaction. Includes "illustrative" disclaimer.
- **Partner application form** — `PartnerApplicationForm` is its own component (uses `useApp().pushNotification`). 5 fields with `Label` + `Input`/`Select`/`Textarea`. Validation in `handleSubmit` (regex email check, required field checks → `toast.error`). On success: 700ms simulated submit (spinner) → `toast.success` + `pushNotification({ type: "system", title: "Partner application submitted", body: "${name} (${company}) applied as ${typeLabel}.", link: "dashboard" })` + form reset + `closePartners()`. "Schedule a call" ghost button → `toast.info("Our team will reach out")`.
- **FAQ** — 4 questions using shadcn `Accordion` (single, collapsible). Same pattern as `TeamsModal`.
- Accessibility: `DialogClose` has `aria-label="Close"`, `DialogTitle` + `DialogDescription` present (sr-only text via Dialog primitive). Escape closes via Radix Dialog default. Focus management delegated to Radix.

### MobileAppPromo
- `Section` wrapper from `@/components/khidma/reveal` (consistent spacing + max width). Background gradient `from-background via-[#f5f8f7] to-background dark:via-[#0e1a1b]/40` to give the section visual separation.
- 2-column layout: `lg:grid-cols-2 items-center`. Order: phone first on mobile (`order-2 lg:order-1`), content first on desktop (`order-1 lg:order-2`) — so phone visually anchors the right of the headline on desktop.
- **Phone mockup** — `aspect-[9/19] w-full` div with `border-[6px] border-[#0e1a1b] rounded-[2rem] shadow-2xl`. Internal screen uses `rounded-[1.4rem] overflow-hidden bg-gradient-to-b from-[#192d2f] via-[#2b3d3d] to-[#0e1a1b]`. Decorative side buttons (`-left-[7px]`/`-right-[7px]` absolute divs). Notch (`absolute left-1/2 top-2 h-4 w-20 rounded-full bg-[#0e1a1b]`). Glow halo behind phone (`absolute -inset-8 -z-10 ... bg-gradient-to-br from-[#32504d]/25 ... blur-2xl`).
- **Inside phone**: Khidma logo + greeting header → "Welcome back, Hire talent on the go 👋" → fake freelancer card (DiceBear avatar + name "Amira Ben Salah" + "UI/UX Designer · Tunis" + 5.0 amber badge + TND 80/hr + disabled "View profile" button) → 3 mini-stats (TND 12K balance · 8 active · 4.9 rating) → bottom nav bar with 5 icons (Home active, Search, Wallet, Chat, Profile).
- **Animated push notification** — absolute-positioned toast at top of phone screen with `motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}`. Shows "New proposal · Khidma" + "Amira submitted a proposal on your Next.js SaaS landing job." + "now" timestamp.
- **Phone hover tilt** — `whileHover={{ rotate: -1.2, y: -6 }}` (subtle, 0.4s easeOut). Skipped when `prefersReduced`.
- **Right column** uses `SectionHeading` (eyebrow + title with teal gradient highlight + description).
- **Feature list** — 6 items, 2-column grid on `sm+`. Each item: motion.li with `initial={{ opacity: 0, x: -8 }}` + `Check` icon in teal-tinted circle + the icon for that feature (`Zap`/`MessageCircle`/`Wallet`/`Fingerprint`/`WifiOff`/`ArrowDownToLine`) hidden on mobile to save space.
- **App store badges** — `AppStoreButton` + `GooglePlayButton` styled as dark teal (`bg-[#0e1a1b]`) pill buttons with Apple/Play lucide icons. Click → `toast.info("App coming soon! We'll notify you.")`.
- **QR code mock** — `useQrMatrix()` hook generates a deterministic 21×21 boolean grid using a simple LCG (no Math.random, so SSR-safe and stable). Three finder patterns (7×7) at corners, alternating timing patterns on row 6 / col 6, pseudo-random fill for the rest. Rendered as a CSS grid (`gridTemplateColumns: repeat(21, 1fr)`) of black/white squares. Khidma logo overlay (`size-7` white square with logo) positioned at center via `absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10`.
  - **Bug fix during dev**: initial implementation had an out-of-bounds write when drawing finder separator rings (when `startR + i` or `startC + i` exceeded `SIZE`). Added bounds checks: `if (startR + 7 < SIZE && startC + i < SIZE)` and `if (startC + 7 < SIZE && startR + i < SIZE)`. Dev log showed the original crash with `TypeError: Cannot set properties of undefined (setting '7')` at `drawFinder`; after the fix the page compiles and serves HTTP 200.
- **Stats row** — 4.9★ App Store · 100K+ downloads (with pulsing emerald dot, `animate={{ scale: [1, 1.18, 1], opacity: [1, 0.65, 1] }} transition={{ duration: 2, repeat: Infinity }}`) · 41 countries. Reduced-motion users see the dot statically (no pulse).

### Footer integration
- `NavLink.action` union extended from `"apiDocs" | "teams" | "help"` → `"apiDocs" | "teams" | "help" | "partners"`.
- "Partner Program" link added as the 5th entry in the Marketplace column (after All Freelancers / All Services / Open Jobs / Categories).
- `onNavigate` handler in `Footer()` adds the `if (link.action === "partners") return openPartners();` branch. `openPartners` destructured from `useApp()`.

## Lint + Dev Verification

### Lint
- `bun run lint` → 0 errors / 0 warnings (exit 0).

### Dev server
- Started `next dev -p 3000` via `setsid -f` (the system's auto-started instance had crashed earlier due to the QR matrix out-of-bounds bug; once the fix landed, the new instance serves HTTP 200).
- `GET / 200 in 9.3s (compile: 8.4s, render: 836ms)` on first compile. Subsequent `GET / 200 in ~250-350ms`.
- No runtime errors after the QR matrix fix. Tail of dev log shows clean compiles + 200 responses.
- Verified new content in HTML output via `curl + grep`:
  - `KHIDMA MOBILE` ✓ (mobile-app-promo eyebrow)
  - `Take Khidma` + `everywhere you go` ✓ (mobile-app-promo title)
  - `Scan to download` ✓ (QR mock label)
  - `BIAT Bank`, `App Store`, `Google Play` ✓ (partner logos + app badges)
  - `Partner Program` ✓ (footer link; the modal itself is `ssr: false` so its body isn't in SSR HTML — only the footer trigger renders)

## Stage Summary
- 2 new components delivered: `PartnersModal` (Khidma Partner Program) + `MobileAppPromo` (mobile app promo section).
- 2 new store actions: `openPartners()` / `closePartners()` (with `modal.partnersOpen` flag).
- Landing page now has 18 sections (added `MobileAppPromo` between `BlogSection` and `FAQ`).
- Global modal count: 20 (added `PartnersModal`).
- Footer Marketplace column has new "Partner Program" link → `openPartners()`.
- Lint clean (0 errors), dev server HTTP 200, no runtime errors in new files.
- All animations respect `prefers-reduced-motion` (instant transitions, no tilt, no notification slide, no pulse on the "100K+" dot, no QR animations — there are none anyway, it's static).

## Unresolved / Notes for next round
- The partner application form is mock — no real backend persistence. Would need a `partner_applications` Prisma model + an API route (`/api/partners/apply`) for production. Currently the form just toasts + pushes a notification into the in-memory store.
- The phone mockup is pure CSS/divs — for higher visual fidelity, a real screenshot of the (future) Khidma mobile app could replace the stylized UI.
- The QR code is decorative — it doesn't actually encode a URL. If a scannable QR is needed, swap the `useQrMatrix` deterministic pattern for a real QR library (e.g., `qrcode.react` or `qr-code-styling`).
- App store badges are mock buttons → toast. Real implementation would link to App Store / Play Store URLs once the apps are published.
- The 5 partner logos (BIAT Bank / Tunisian Post / D17 / Flat6Labs Tunis / Esprit University) are illustrative — for production, replace with actual partner logo SVGs (with permission) and remove the "illustrative" disclaimer.
- Tier CTAs ("Join free" / "Choose Premier" / "Talk to sales") currently just toast — could pre-fill the application form's partner-type Select based on which tier was clicked, then scroll to the form.
- The 3 trust badges (12+ active partners · TND 2.4M+ processed jointly · 41 countries reached) are mock figures — would come from a real partner-program stats API.
