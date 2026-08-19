# Task: ROUND4-INTEGRATION-1 — Favorites + Compare wiring & floating compare tray

**Agent:** full-stack-developer (favorites/compare wiring + tray)
**Task ID:** ROUND4-INTEGRATION-1
**Date:** Continuation round (Round 4)

## Context picked up from prior rounds
- Read `/home/z/my-project/worklog.md` end-to-end (Round 3 unresolved items, esp. "Favorites/Compare toggles aren't yet wired into the existing FreelancerCard/ServiceCard/JobCard … heart icon on FreelancerCard is local state" + "Header doesn't show a favorites count badge / quick-access button").
- Re-read the 4 card/header files I had to touch + the store (favorites/compare slice is already implemented) + page.tsx mount points + back-to-top.tsx as a style reference for the new floating component.

## Files Created / Modified

### Created
1. **`src/components/khidma/compare-tray.tsx`** — floating bottom-center compare queue bar
   - `fixed bottom-6 left-1/2 -translate-x-1/2 z-40`, horizontal pill (rounded-2xl, backdrop-blur-xl, border-border/70, bg-background/95).
   - Left block: "Comparing" label + `${count}/${MAX}` (3) tabular-nums + "Max reached" amber hint when atMax.
   - Middle block: overlapping avatar stack (-ml-2, ring-2 ring-background, z-indexed by index) + names (joined with " · ") + a small helper line.
   - Each avatar has a small rose-500 × remove button that fades in on hover (group-hover/avatar).
   - Right block: "Compare now" teal Button (`bg-[#32504d] hover:bg-[#2b3d3d]`, disabled when count < 2, opens compare modal) + ghost X icon "Clear" button (clears queue + toast).
   - Mobile responsive: hides the label block and the names column, swaps button label to just "Compare", shrinks to a 44px-wide count badge on the left.
   - `useReducedMotion()` respected — entrance becomes opacity-only when reduced motion is on.
   - framer-motion AnimatePresence slide-up + scale + fade entrance (24px y, 0.96 scale, 0.28s ease-out).
   - Reads `compareIds`, `removeFromCompare`, `clearCompare`, `openCompare` from `useApp`.
   - Uses `getFreelancerById` to resolve avatars/names (filtered for non-nulls via type guard).

### Modified
2. **`src/components/khidma/freelancer-card.tsx`** — full favorites + compare wiring
   - Removed local `useState(false)` `liked` state.
   - Reads `favorites` (re-renders on change) + computes `isFav = favorites.some(fav => fav.id === f.id && fav.type === "freelancer")`.
   - Heart click handler: `e.stopPropagation()`, `toggleFavorite(f.id, "freelancer")`, then `toast.success(isFav ? "Removed from saved" : "Saved to favorites", { description: f.name })`.
   - Heart icon: `fill-rose-500 text-rose-500` when `isFav`, white outline otherwise.
   - **Compare pill** added to cover strip bottom-right (next to the availability dot which stays bottom-left):
     - Small pill button with `GitCompare` icon + label text ("Compare" / "In compare") + a 12px checkbox square (filled teal-white when `inCompare`, empty outline otherwise).
     - When `inCompare`: pill background flips to `bg-[#32504d] text-white`.
     - On click: `e.stopPropagation()`. If `compareIds.length >= 3 && !inCompare` → `toast.error("Compare queue full", { description: "Remove a freelancer to add a new one" })` and skip toggle. Otherwise `toggleCompare(f.id)` + toast `"Added to compare"` with `${name} — ${compareIds.length + 1}/3` description.
   - `FreelancerListRow` (list variant) also got a heart button in the right action area, before the price block — same wiring.
   - aria-labels + `aria-pressed` on both heart and compare pill.
   - Removed unused `Image` / `Eye` imports that were left over from prior template.

3. **`src/components/khidma/service-card.tsx`** — heart + Saved badge
   - New heart button on the cover (top-right, 32px, `backdrop-blur-md`).
     - Style: `bg-white/90 text-rose-500` when `isFav` (filled heart), `bg-black/30 text-white` when not (outline heart).
   - "Saved" badge appears on the cover (top-right, offset by 48px to sit left of the heart) when `isFav` — `bg-[#32504d] text-white` with a `Bookmark` (filled) icon + "Saved" label.
   - Same `toggleFavorite(s.id, "service")` + toast flow + `e.stopPropagation()` + `aria-pressed`.
   - Card body click (opening service modal) unchanged.

4. **`src/components/khidma/job-card.tsx`** — heart in header row
   - Heart button placed top-right of the card, alongside the "Verified Client" badge (now wrapped in a flex container so the verified badge hides on mobile but the heart stays accessible).
   - Style matches freelancer list row heart: `text-rose-500 hover:bg-rose-500/10` when `isFav` (filled), `text-muted-foreground hover:bg-muted` otherwise.
   - Same `toggleFavorite(job.id, "job")` + toast + `e.stopPropagation()` + `aria-pressed`.
   - All existing card behavior (click → open job modal, skills, budget, proposals, postedBy row) untouched.

5. **`src/components/khidma/header.tsx`** — Favorites button in right action group + mobile sheet
   - Imported `Heart` from lucide-react.
   - Destructured `openFavorites` + `favoritesCount` from `useApp()`.
   - Desktop: new ghost icon-button (`h-9 w-9`) placed **between `<NotificationsDropdown />` and the avatar dropdown**, same style as Messages/Notifications. Heart icon `size-[18px]`. Count badge: `-top-0.5 -right-0.5`, `min-w-[16px] h-4 px-1 rounded-full bg-[#32504d] text-white text-[10px] font-semibold`, shows count or `99+` when > 99. Only renders when `favoritesCount > 0`.
   - Mobile sheet: added a new "Saved Items" list item right after the nav items, **always visible** (logged in or out) — Heart icon in `text-[#32504d]`, label, count badge right-aligned (`ml-auto min-w-[20px] h-5 bg-[#32504d]`). Calls `openFavorites()` + closes sheet.

6. **`src/app/page.tsx`** — mounted `<CompareTray />`
   - Added `import { CompareTray } from "@/components/khidma/compare-tray";`
   - Mounted right after `<BackToTop />` (so the tray sits at `bottom-6` centered, the back-to-top button sits at `bottom-6 right-6`).

## Work Log

1. Read `worklog.md` end → identified Round 3 "Unresolved / Risks" items. Specifically:
   - "Favorites/Compare toggles aren't yet wired into existing cards" → my entire task.
   - "Header doesn't show a favorites count badge" → my header work.
2. Read all 4 files I had to edit + store slice + page.tsx + back-to-top.tsx for style alignment.
3. Wrote `freelancer-card.tsx` with store-backed favorites + new compare pill; applied same heart wiring to `FreelancerListRow`. Stripped two unused imports (`Image`, `Eye`) that the prior template had left behind.
4. Wrote `service-card.tsx` with cover heart + a "Saved" badge appearing on `isFav`.
5. Wrote `job-card.tsx` with heart in the header row (alongside "Verified Client"). Restructured that header row into a flex with `justify-between` so the heart always sits top-right even when the "Verified Client" badge hides on mobile.
6. MultiEdit'd `header.tsx`: added `Heart` import, destructured `openFavorites` + `favoritesCount`, inserted the desktop icon-button between `<NotificationsDropdown />` and the avatar dropdown, and added the "Saved Items" entry to the mobile sheet (always-on).
7. Created `compare-tray.tsx`: floating pill, AnimatePresence slide-up + fade, avatar stack with hover-remove × buttons, "Compare now" CTA (disabled < 2), "Clear" ghost button, prefers-reduced-motion handling, mobile responsive collapse.
8. Mounted `<CompareTray />` in `page.tsx` right after `<BackToTop />`.
9. `bun run lint` → only 1 error remains and it is **pre-existing** in `src/components/modals/report-modal.tsx:122` (`set-state-in-effect` from a `useEffect` calling `setReason`). That file is **not imported** anywhere (verified via grep on `modals/index.ts` and `page.tsx`) — it's a dead/orphan file. My edited/created files all lint cleanly:
   `npx eslint src/components/khidma/freelancer-card.tsx src/components/khidma/service-card.tsx src/components/khidma/job-card.tsx src/components/khidma/header.tsx src/components/khidma/compare-tray.tsx src/app/page.tsx` → `EXIT=0`.
10. Dev server log shows successful recompiles after each file save — no errors, no Fast Refresh crashes (`✓ Compiled in ...ms`).

## Stage Summary

- **5 files modified + 1 file created.**
- All favorites + compare UI state now flows through the global Zustand store (`useApp`), no more local `liked` useState. Heart fills rose on saved; checkbox pill turns teal on in-compare.
- All toggle actions fire a `sonner` toast with the appropriate success/error variant + description.
- All card-internal buttons call `e.stopPropagation()` so card-body onClick still opens the right modal.
- New header Favorites button with live count badge; "Saved Items" entry added to mobile sheet.
- New `<CompareTray />` floating bar: avatars, names, count, max-reached hint, clear, compare-now CTA. Animated with framer-motion, respects reduced-motion, mobile collapses names/labels.
- Khidma teal palette (`#32504d` / `#2b3d3d` / `#748684`) used throughout. No indigo/blue. Rose-500 only for "saved" heart fills (semantic, brand-compliant per existing FreelancerCard precedent).
- Lint: my files pass cleanly. Pre-existing `report-modal.tsx:122` lint error left untouched (orphan file, out of scope).
- Dev server stable: `GET / 200` repeatedly, `✓ Compiled` with no errors.

## Files touched (final list)
- `src/components/khidma/freelancer-card.tsx` (modified)
- `src/components/khidma/service-card.tsx` (modified)
- `src/components/khidma/job-card.tsx` (modified)
- `src/components/khidma/header.tsx` (modified)
- `src/components/khidma/compare-tray.tsx` (created)
- `src/app/page.tsx` (modified — 2 lines added: import + mount)

## Notes for next round
- `src/components/modals/report-modal.tsx` exists but is orphaned (no mount) and has a `set-state-in-effect` lint error — next round should either delete it or wire it up properly.
- The header still has unused destructured `setSearchQuery` + `openOnboarding` (pre-existing, not introduced by this task; eslint rule is off in this project so it's cosmetic).
- The new CompareTray is desktop-friendly with avatars + names; on mobile it correctly drops names to keep width under control. If the next round wants to add tabs/filter chips to the tray, the layout has room to grow horizontally with `max-w-3xl`.
