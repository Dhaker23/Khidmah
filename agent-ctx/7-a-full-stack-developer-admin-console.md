---
Task ID: 7-a
Agent: full-stack-developer (admin console)
Task: Build the Admin Review Console for Khidma — a 3-column dashboard where admins review freelancer applications and decide APPROVE / REJECT / REQUEST INFORMATION.

Work Log:
- Read `/home/z/my-project/worklog.md`, `src/lib/khidma-data.ts` (Freelancer, PortfolioItem, ApplicationStatus types), `src/lib/store.ts` (useApp view/setView/openFreelancer), existing `src/components/khidma/verification.tsx` (VerificationBadge, VerificationChecklist, TrustBadge), `src/components/khidma/logo.tsx` (KhidmaLogo), and `src/app/globals.css` to align with Khidma design tokens (bg-khidma-gradient, font-display = Sora, font-arabic = IBM Plex Sans Arabic, teal palette only). Reviewed shadcn UI components used (Button, Card, Tabs, Badge, Avatar, Textarea, Select, Checkbox, Dialog, Tooltip, Separator, ScrollArea, Progress, Table, Label, Input, AlertDialog) and confirmed lucide-react icons available.
- Created `src/lib/admin-mock.ts` — full mock data layer:
  - 5 mock `AdminApplication` objects based on existing freelancers (f1 Amira, f5 Rania, f6 Omar, f2 Yassine, f4 Mehdi) covering each ApplicationStatus (UNDER_REVIEW, MORE_INFORMATION_REQUIRED, SUBMITTED, APPROVED, REJECTED). Each carries: application ID (APP-2025-00XX), assigned reviewer, phone/email, years of experience, primary category, starting price, identity status (PENDING/VERIFIED/REJECTED), risk signals, 15-item checklist with checked state, per-portfolio-item review state, 1-4 admin notes, history events, and audit log entries.
  - RiskSignals type: duplicateAccounts, suspiciousActivity, previousRejections, reportsCount, internalFlags[], overall (LOW/MEDIUM/HIGH) — APP-0014 LOW, APP-0015 MEDIUM (duplicate watch + 1 prior rejection), APP-0011 LOW, APP-0009 HIGH (suspicious duplicate, 2 prior rejections, 1 client report, plagiarized portfolio audio).
  - 15-item `checklistTemplate` organized by groups: Identity (3), Profile (5), Portfolio (2), Risk (2), Quality (3) — per spec section 55. APP-0011 has all 15 checked (approved), others have partial checks.
  - 3 mock reviewers (Lina Ben Salah, Karim Jouini, Rim Hamdi) + System actor for auto-assignment.
  - `adminKPIs` strip values: 24 pending, 8 under review, 12 approved today, 3 rejected today, 1,248 total verified.
  - Display config maps: `statusConfig` (DRAFT/SUBMITTED/UNDER_REVIEW/MORE_INFORMATION_REQUIRED/APPROVED/REJECTED/SUSPENDED/REVOKED) with label, color, bg, dot; `riskConfig` (LOW/MEDIUM/HIGH) with ring color; `signalConfig` (NONE/WATCH/SUSPICIOUS); `decisionConfig` for portfolio items (PENDING/APPROVED/FLAGGED/REJECTED); `verificationLabel` and `visibilityLabel` lookup tables.
  - Helper functions: `checklistCount`, `formatDate`, `formatDateTime`, `timeAgo`.

- Created `src/components/views/admin-view.tsx` (~2400 lines, "use client") — the full Admin Review Console:

  **Header + KPI strip:**
  - Sticky `AdminHeader` with KhidmaLogo (sm) + "Admin Console" badge (bg-[#192d2f]) + keyboard shortcut hint button (Tooltip) + "Back to Home" button (calls `setView('home')`).
  - `KpiStrip` — 5-tile responsive grid (2 cols mobile, 5 cols lg): Pending Review (24), Under Review (8), Approved Today (12), Rejected Today (3), Total Verified (1,248). Color-coded icon tiles using only the Khidma teal palette + emerald/amber/red semantics.

  **Application queue:**
  - `ApplicationQueue` — desktop: scrollable list of all 5 applications with avatar, name, app ID, title, status pill, and time-ago. Mobile: shadcn Select dropdown. Clicking switches the active application. The current application is highlighted with a `border-[#32504d]` ring.
  - "Next Application" button cycles through the queue and fires a sonner toast.

  **LEFT COLUMN — Freelancer Information (lg:sticky + scrollable, mobile: stacked flow):**
  - Application card with `bg-khidma-gradient` header strip showing APP-2025-00XX + status pill; avatar/name/username/applied date below.
  - Profile photo card with large avatar preview + verification badges (VerificationBadge for email/phone/identity/portfolio when verified).
  - Personal info card: full name, location (city, country), phone (mono), email (mono), languages (•-separated).
  - Professional info card: title, bio, years of experience, primary category, hourly rate (TND/hr), starting price (TND), availability (capitalized), response time.
  - Skills card with chips (3+ skills per freelancer).
  - Experience list — compact timeline with dot+line connectors, role / company / period / skill chips.
  - "View Public Profile" outline button → `openFreelancer(f.id)`.

  **CENTER COLUMN — Portfolio Review:**
  - Section title "Portfolio Review" + count badge.
  - Per-portfolio-item reviewable card: large 16:9 cover image with category + role badges + decision pill overlay; description (full); skill chips; verification status Select (UNVERIFIED / SELF_DECLARED / ADMIN_VERIFIED / EXTERNALLY_VERIFIED); visibility badge; Live URL + Repo URL links opening in new tab; existing-item-note callout if present; 3 action buttons (Approve / Flag / Reject) with color states that "stick" when selected; per-item admin note Textarea. Reject opens a Dialog prompting for a reason.
  - Empty state card with icon + message if no portfolio items.

  **RIGHT COLUMN — Verification + Risk + Checklist + Decision (lg:sticky + scrollable):**
  - `VerificationPanel`: Email / Phone / Identity (with pending state) / Portfolio (X/Y items approved) rows + Overall status pill at bottom.
  - `RiskPanel` with `ring-1 ring-inset` colored by overall risk level. Rows: Duplicate accounts, Suspicious activity (both NONE/WATCH/SUSPICIOUS), Previous rejections count (color-coded), Client reports count, Internal flags callout (amber) listing all `internalFlags`.
  - `ChecklistPanel` — 15-item checklist grouped by group name, with Progress bar at top showing X/15 + percentage, ScrollArea capped at 280px. Each item is a label-wrapped Checkbox; checked items get `line-through` styling.
  - `DecisionPanel` — dark header (`bg-[#192d2f] text-white`); 3 motion-animated decision buttons (APPROVE green, REQUEST_INFO amber, REJECT red) each with keyboard shortcut hint `[A]`/`[R]`/`[X]` in tooltip. AnimatePresence expands a rejection reason Textarea (REJECT) or request-info message Textarea (REQUEST_INFORMATION). Internal admin note Textarea always visible. "Submit Decision" button disabled until message is provided (or APPROVE selected). Confirm Dialog previews the message + note before final submission.

  **BOTTOM SECTION — Notes + History + Audit Log (full width):**
  - `BottomSection` Card with shadcn Tabs (3 cols): Admin Notes / History / Audit Log. AnimatePresence cross-fades between applications on switch.
  - `AdminNotesTab`: Add-note form (Textarea + pin checkbox + "Add Note" button) at top, then a sorted list of notes (pinned first, then newest) — each note is a card with avatar / author / pinned badge / time-ago (tooltip shows full date-time) / content. Adding a note pushes it locally and logs an `ADD_NOTE` / `ADD_PINNED_NOTE` audit entry.
  - `HistoryTab`: visual vertical timeline with colored status dots (icon-stamped: APPROVED=✓, REJECTED=X, MORE_INFO=?, UNDER_REVIEW=clock, SUBMITTED=file), actor, time-ago (tooltip with full date-time), and note callout if present.
  - `AuditLogTab`: shadcn Table (timestamp / actor / action with `<code>` styling / reason + details) wrapped in ScrollArea capped at 420px.

  **Real interactivity (local state, no API needed):**
  - `useApp` store drives navigation: `setView('home')` from header back button; `openFreelancer(f.id)` from "View Public Profile".
  - Local `applications` state (initialized from `adminApplications`) — mutation helpers update portfolio item reviews, toggle checklist items, add admin notes, and submit decisions. Submitting a decision updates the application's `status`, pushes a new `HistoryEvent` and `AuditLogEntry`, optionally adds an internal note, and fires a color-coded sonner toast.
  - Keyboard shortcuts A / R / X select APPROVE / REQUEST_INFORMATION / REJECT in the DecisionPanel via a ref-registered callback (avoids the react-hooks/refs lint rule violation). Shortcuts are suppressed while typing in input/textarea/select/contenteditable. Each shortcut fires a sonner toast confirming the selection.
  - "Next Application" cycles through the queue and shows a toast.
  - All transitions use framer-motion: column enter/leave (left slides in from x=-8, center y=8, right x=8), portfolio cards (layout animation + initial opacity/y), decision textarea expand (AnimatePresence height auto), bottom tabs cross-fade between applications.

  **Layout / responsiveness:**
  - Section wrapper `mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8 py-6`.
  - 3-column grid: `lg:grid-cols-[360px_minmax(0,1fr)_380px]`. Left and right columns are `lg:sticky lg:top-[140px]` with `lg:max-h-[calc(100vh-160px)] lg:overflow-y-auto` so they pin while the center column scrolls.
  - On mobile (<lg), all columns stack in normal flow; `ApplicationQueue` switches to a Select dropdown.
  - `min-h-screen flex flex-col` root with `mt-auto` footer for sticky-footer behavior. Footer shows "Khidma Admin Review Console · Restricted access" + "Designed & Developed by Amara Dhaker".

Quality details:
- `"use client"` component, fully client-side.
- Khidma teal palette only (#2b3d3d, #32504d, #475959, #748684, #6e8580, #192d2f, #ffffff) — no indigo/blue. Semantic colors (emerald/amber/red) used only for status semantics (approved/rejected/risk-level).
- shadcn components used throughout (Button, Card, Tabs, Badge, Avatar, Textarea, Select, Checkbox, Dialog, Tooltip, Separator, ScrollArea, Progress, Table, Label, Input).
- lucide-react icons: ShieldCheck, ShieldAlert, Shield, AlertTriangle, CheckCircle2, XCircle, HelpCircle, Flag, FileText, History, ClipboardList, ListChecks, Clock, Mail, Phone, MapPin, User, UserCheck, Briefcase, GraduationCap, Lightbulb, Sparkles, LayoutGrid, StickyNote, MessageSquare, Pin, Plus, ExternalLink, Globe, Languages, Keyboard, ArrowLeft, ArrowRight, Copy, Info, RefreshCw, Eye.
- sonner toasts for all admin actions (approve / reject / request info / note added / shortcut selected / next application).
- font-display (Sora) for headings and KPI numbers.
- Initial lint run surfaced 7 errors + 1 warning:
  1. `Cannot access refs during render` (5 instances) — the "render-time state adjustment" pattern was using a `useRef` to detect prop changes, which trips the `react-hooks/refs` rule. Fixed by switching to the documented React 19 pattern of storing the previous prop value in a separate `useState` (`prevAppId`) and updating it in-render when it differs from the current prop. This is the official pattern from https://react.dev/reference/react/useState#storing-information-from-previous-renders and passes the rule.
  2. `'TooltipProvider' is not defined` — I had wrapped the entire AdminView in a `<TooltipProvider>` but was only importing Tooltip/TooltipTrigger/TooltipContent. The shadcn `Tooltip` component already wraps itself in TooltipProvider internally, so I removed the outer wrapper.
  3. `Unused eslint-disable directive` for `@next/next/no-img-element` — the project's eslint config already disables this rule globally, so the inline disable comment was redundant; removed it.
  4. `TS2367: comparison appears unintentional` on `decision !== "APPROVE" && message.trim().length > 0` — TypeScript correctly narrowed `decision` to `"REQUEST_INFORMATION" | "REJECT"` after the preceding `decision === "APPROVE"` check, making the second comparison unreachable. Simplified to `(decision === "APPROVE" || message.trim().length > 0)`.
- After fixes: `bun run lint` → 0 errors / 0 warnings (for files in scope of this task). `bunx tsc --noEmit --skipLibCheck` → 0 errors in admin-view.tsx and admin-mock.ts (remaining errors are in `examples/` and `skills/` folders outside this task's scope).
- `bun run dev` server compiled successfully after the new files were added (no compile errors in dev.log).
- Main `src/app/page.tsx` was NOT modified — the composer agent will wire `<AdminView />` to render when `view === 'admin'`.

Stage Summary:
- 2 files delivered:
  - `/home/z/my-project/src/lib/admin-mock.ts` — mock data layer (5 applications, risk signals, 15-item checklist template, admin notes, history, audit log, reviewers, display config maps, helpers).
  - `/home/z/my-project/src/components/views/admin-view.tsx` — full Admin Review Console ("use client", default-exported, no props required).
- All work happens within the `/` route — `AdminView` reads `view`/`setView`/`openFreelancer` from the global `useApp` Zustand store, so the composer agent just needs to render `<AdminView />` when `view === 'admin'`.
- Composer integration: `import AdminView from "@/components/views/admin-view"` then `{view === "admin" && <AdminView />}` inside the page switch.
- Self-contained: no API routes needed (the spec calls for mock interactivity only). All local state mutations (decision, portfolio review, checklist toggle, note add) are reflected immediately in the UI and trigger sonner toasts. The audit log and history timeline are appended-to live so admins can see their actions recorded.
- Files ready for composition. No further changes needed from this agent.
