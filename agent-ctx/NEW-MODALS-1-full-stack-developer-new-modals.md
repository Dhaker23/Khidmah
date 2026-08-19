# Task NEW-MODALS-1 — Khidma New Interactive Modals

**Agent:** full-stack-developer (new modals)
**Date:** 2026-08-18
**Scope:** Build 3 new interactive modals (`MessagingModal`, `PostJobModal`, `CreateServiceModal`) for Khidma, plus barrel + page integration + store type extension. All within the `/` route, Khidma teal palette only, Next.js 16 + TS + Tailwind 4 + shadcn/ui + framer-motion + sonner.

## Files Created / Modified
- `src/components/modals/messaging-modal.tsx` — `max-w-4xl h-[80vh]` two-column real-time chat Dialog with socket.io via Caddy gateway (`io("/?XTransformPort=3003", { transports:["websocket"] })`).
- `src/components/modals/post-job-modal.tsx` — `max-w-3xl` 4-step job-posting wizard.
- `src/components/modals/create-service-modal.tsx` — `max-w-3xl` 4-step service-creation wizard with packages + FAQ.
- `src/components/modals/index.ts` — barrel updated to export the 3 new modals.
- `src/app/page.tsx` — added 3 dynamic-imported modal mounts (`{ ssr: false }`).
- `src/lib/store.ts` — extended `Notification.type` union with `"job" | "service"`; added dev-only `window.__useApp` exposure.

## Architecture Decisions
- Read `modal` slice + `currentUser` / `login` / `logout` / `openAuth` / `openOnboarding` / `pushNotification` / `setView` / `closeMessaging` / `closePostJob` / `closeCreateService` from the global `useApp` Zustand hook.
- All modals return `null` when their flag is closed (so they can stay mounted in the page tree without rendering anything).
- React 19 render-time state adjustment used (instead of `setState` inside `useEffect`) to reset all local form state when `messagingOpen` / `postJobOpen` / `createServiceOpen` transitions from closed → open — satisfies the project's `react-hooks/set-state-in-effect` ESLint rule. Same pattern for `selectedId` change in messaging (clear messages).
- Body scroll lock applied on open and restored on cleanup.
- Role gates:
  - MessagingModal → login wall (CTA → `openAuth("login")`).
  - PostJobModal → "Clients only" notice if `!currentUser || currentUser.type === "freelancer"` with "Log out" button.
  - CreateServiceModal → "Freelancers only" notice if `!currentUser || currentUser.type === "client"` with "Become a freelancer" button → `openOnboarding()`.
- Khidma palette only — no indigo/blue. Uses `bg-khidma-gradient`, `bg-[#2b3d3d]`, `bg-[#32504d]`, `text-[#32504d]` etc. `font-display` (Sora) for headings.
- framer-motion `AnimatePresence` used for: messaging discover panel slide-down, per-message entrance (opacity+y+scale), typing indicator dot bounce, post-job step transitions (direction-aware slide), create-service step transitions, FAQ row add/remove (height animation), package feature row add/remove (height animation).
- Mobile responsive: messaging left column hides on mobile when a conversation is selected (`selectedId && "hidden md:flex"`); wizard step pills show icons only on mobile.
- shadcn UI + lucide-react used throughout; `sonner` for feedback.
- Socket.io connection: `io("/?XTransformPort=3003", { transports:["websocket"], reconnection:true, reconnectionAttempts:3, timeout:8000 })`. Never hardcodes `localhost:3003`.
- Socket stored in a `useRef` (not state) to avoid `set-state-in-effect` rule violations. A separate `socketReady` boolean state is flipped only inside the `connect` / `connect_error` event handlers (event-driven setState is allowed by the rule).
- `selectedIdRef` (ref) kept in sync via a small `useEffect(() => { selectedIdRef.current = selectedId; }, [selectedId])` so socket event handlers always read the current selection (avoids stale-closure bug).
- Per-step validation via `useMemo` — `Next` button disabled until requirements met. No Zod needed.

## Lint + TypeScript Fixes
1. `react-hooks/set-state-in-effect` (×6) — initial drafts used `useEffect(() => { if (open) setStep(0); ... })` for state reset on open. Switched to React 19 render-time adjustment pattern.
2. `react-hooks/rules-of-hooks` — `useMemo` for `stepValid` was called AFTER early return. Reordered so all hooks run unconditionally.
3. `react-hooks/refs` — initial draft did `selectedIdRef.current = selectedId;` during render. Moved the sync to `useEffect`.
4. `set-state-in-effect` for `setSocket(sock)` — converted `socket` state to `socketRef` + `socketReady` boolean (set only in event handlers).
5. Removed unused `eslint-disable-next-line react-hooks/exhaustive-deps` directive.
6. `TS2322` `"job"|"service"` not assignable to `Notification.type` — extended the union in `src/lib/store.ts`.

After fixes: `bun run lint` → 0 errors / 0 warnings. `bunx tsc --noEmit --skipLibCheck` for in-scope files → 0 errors. Dev server `dev.log` shows `✓ Compiled in …` after every save.

## Agent-browser E2E Verification (via Caddy gateway on port 81)
- **MessagingModal login wall:** "Log in to chat" hero with primary + secondary CTAs. ✓
- **MessagingModal real-time chat:** Welcome conversation with demo bot auto-appears. Clicking opens thread. Sending "Hello there!" triggers `message:send`; bot auto-replies ~1.5s later. Sidebar preview updates with bot's reply. ✓ (screenshots saved)
- **PostJobModal role gate:** freelancer account shows "Clients only" notice + "Log out" button. ✓
- **PostJobModal full wizard:** all 4 steps walked; Publish → toast "Job published!" + close + `setView("jobs")` + notification "Job published" with body containing the title. ✓
- **CreateServiceModal role gate:** client account shows "Freelancers only" + "Become a freelancer" button → `openOnboarding()`. ✓
- **CreateServiceModal full wizard:** all 4 steps walked (including Basic package price 100 TND that updates the header "Starting at" live); Publish → toast "Service published!" + close + `setView("services")` + notification with the service title. ✓
- No console errors or uncaught exceptions during any flow.

## Integration Note for Page Agent
The 3 modals are already mounted in `src/app/page.tsx` via dynamic imports. They can be triggered from any UI element via the store actions:
- `openMessaging()` / `closeMessaging()`
- `openPostJob()` / `closePostJob()`
- `openCreateService()` / `closeCreateService()`

The `<CommandPalette />` component (created by the NEW-FEATURES-1 agent) already wires up all three actions behind ⌘K — composer agent can mount it at the page root for keyboard access. The header could also expose explicit buttons:
- "Post a Job" CTA in the header for logged-in clients.
- "Create Service" CTA in the header for logged-in freelancers.
- "Messages" envelope icon in the header (with unread count badge from `notifications.filter(n => n.type === "message" && !n.read).length`).
