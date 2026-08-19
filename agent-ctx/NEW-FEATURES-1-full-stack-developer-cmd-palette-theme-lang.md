# NEW-FEATURES-1 — ⌘K Command Palette + Dark Mode Toggle + Language Switcher (EN/FR/AR with RTL)

**Task ID:** NEW-FEATURES-1
**Agent:** full-stack-developer (cmd palette + theme + lang)
**Date:** 2025

## Scope
Built 4 client-side modules that integrate into the Khidma header (header integration left for the main session / composer agent):

1. `src/lib/use-t.ts` — i18n translation hook (EN / FR / AR).
2. `src/components/khidma/theme-toggle.tsx` — dark mode toggle button.
3. `src/components/khidma/language-switcher.tsx` — language dropdown with RTL support.
4. `src/components/khidma/command-palette.tsx` — global ⌘K command palette.

## Files Created

| File | Purpose |
| --- | --- |
| `src/lib/use-t.ts` | Lightweight i18n `useT()` hook returning `{ t, lang }`. |
| `src/components/khidma/theme-toggle.tsx` | Sun/Moon icon button with framer-motion rotate+fade swap. |
| `src/components/khidma/language-switcher.tsx` | shadcn DropdownMenu showing current lang code + 3 options. |
| `src/components/khidma/command-palette.tsx` | Linear/Raycast-style ⌘K palette with 6 grouped result lists + keyboard nav. |

All 4 export both named and default.

## Implementation Details

### `use-t.ts`
- `useT()` reads `lang` from the global `useApp` Zustand store.
- Returns a memoised `t(key, params?)` that does dictionary lookup + `{{token}}` interpolation.
- Dictionary includes the required keys (`nav.*`, `cta.*`, `footer.rights`) plus a few palette-only strings (`cmd.*`).
- `footer.rights` Arabic uses "خدمة" (consistent with the rest of the app), not the typo'd "خدة" in the spec.
- Exports `Lang` + `Params` types.

### `theme-toggle.tsx`
- Uses `next-themes` `useTheme()` as the single source of truth.
- On click → `setTheme(theme === "dark" ? "light" : "dark")` from next-themes.
- `useEffect` syncs `theme` → `setStoreTheme` from the Zustand store so other components (e.g. command palette) can read either source.
- SSR-safe: a `mounted` flag prevents the icon from rendering until after hydration (avoids theme mismatch on first paint). Before mount, a small placeholder circle keeps the button sized.
- framer-motion `AnimatePresence mode="wait"` rotates + fades the icon swap (`initial rotate:-90 → animate rotate:0 → exit rotate:90`, scale 0.5↔1, 0.2s ease-out).
- `aria-label="Toggle dark mode"` + `title` attribute for the next state.

### `language-switcher.tsx`
- shadcn `DropdownMenu` triggered by a ghost `Button` showing a `Globe` icon + current lang code (uppercase, mono, `tracking-wider`).
- 3 options: English 🇬🇧 / Français 🇫🇷 / العربية 🇹🇳.
- Arabic option gets `font-arabic` styling.
- On select:
  1. `setLang(code)` from store.
  2. `document.documentElement.lang = code`
  3. `document.documentElement.dir = code === "ar" ? "rtl" : "ltr"`
  4. sonner toast: `Language switched to {native name}` (Arabic toasts show a secondary Arabic description).
- Footer note in the dropdown explains RTL behaviour.

### `command-palette.tsx`
- Self-renders based on `modal.commandPaletteOpen` from the store.
- Global `window` keydown listener catches `⌘K` / `Ctrl+K` anywhere (with `e.preventDefault()` to suppress browser defaults).
- A second keydown listener (only mounted while open) handles `Escape` to close.
- Custom modal (no shadcn Dialog wrapper — full control of framer-motion entrance: `opacity 0→1`, `scale 0.96→1`, `y -12→0`, 0.15s ease-out). Backdrop click closes.
- Layout:
  - **Input row** (h-14) — `Search` icon + autofocused input + `ESC` kbd hint.
  - **Results** — `max-h-[55vh] overflow-y-auto`, `overscroll-contain`.
  - **Footer** (h-11) — `↑↓ navigate · ⏎ select · esc close` + small Khidma symbol logo.
- Mobile responsive: `w-[90vw] max-w-[600px]`, `mt-[10vh] sm:mt-[14vh]`.
- Grouped results:
  1. **Quick Actions** (always 6): Become a freelancer (→ `openOnboarding`), Post a job (→ `openPostJob`), Create a service (→ `openCreateService`), Open messaging (→ `openMessaging`), Open wallet (→ `openWallet`), Toggle theme (calls `ntSetTheme` + `setStoreTheme`).
  2. **Navigate** (always 7): Home, Find Talent, Find Work, Services, How It Works, Dashboard, Admin Review Console.
  3. **Freelancers** (filtered, max 5): avatar + name + title + `★ rating` chip → `openFreelancer(id)`.
  4. **Services** (filtered, max 5): cover thumbnail + title + category + `from TND X` chip → `openService(id)`.
  5. **Jobs** (filtered, max 5): `Briefcase` icon + title + postedBy/duration/level + budget chip → `openJob(id)`.
  6. **Categories** (filtered, max 5): category icon + name + count + Arabic name chip → `setView("freelancers")`.
- Filtering: case-insensitive substring match on name/title/category/skills. Empty query → first 5 of each group shown.
- Keyboard navigation: `↑/↓` moves `activeIndex` across the flat list (built via `groupStartIndices`); `Enter` activates. `scrollIntoView({ block: "nearest", behavior: "smooth" })` keeps the active row visible.
- Hover → updates `activeIndex` (so Enter after hover activates the right item).
- Row layout: left slot (thumbnail > avatar > icon, in priority order), middle (title + truncated subtitle), right (trailing chip + `ChevronRight` when active).
- Empty state: `Search` icon + "No results found for '{query}'" when zero matches.
- A11y: `role="dialog"` + `aria-modal="true"` + `aria-label` on the wrapper, `role="listbox"` on results, `role="option"` + `aria-selected` on each row, `aria-controls` + `aria-autocomplete="list"` on input.
- All actions call `closeCommandPalette()` then the target store action — no stacked modal issues.
- `ResultRow` is wrapped in `React.memo` to keep re-renders cheap when only `activeIndex` changes.

## Lint & Type Check
- `bunx eslint src/components/khidma/{command-palette,theme-toggle,language-switcher}.tsx src/lib/use-t.ts --max-warnings=0` → exit 0 (0 errors / 0 warnings on my files).
- `bunx tsc --noEmit --skipLibCheck` → 0 errors in my files.
- Project-wide lint still reports 3 errors in `src/components/modals/messaging-modal.tsx` (different agent's file, outside this task's scope).
- Dev server `dev.log` shows `✓ Compiled` lines right after my files were written — no compile errors.

## Verification Notes
- All 4 components are `"use client"` and require no props (except optional `className` on ThemeToggle / LanguageSwitcher).
- The header integration is left for the composer / main session per the task spec: "Just create the components; another agent (or the main session) will integrate them into the header."
- Suggested integration: drop `<CommandPalette />` once at the page root, then add `<ThemeToggle />` and `<LanguageSwitcher />` next to the existing auth buttons in `src/components/khidma/header.tsx`.
- The `useT()` hook can be used to translate the 9 required strings in header nav, hero CTA, and footer copyright.

## Stage Summary
- 4 files delivered:
  - `src/lib/use-t.ts` (i18n hook + dictionary)
  - `src/components/khidma/theme-toggle.tsx` (dark mode button)
  - `src/components/khidma/language-switcher.tsx` (lang dropdown + RTL)
  - `src/components/khidma/command-palette.tsx` (⌘K palette)
- All use the Khidma teal palette only (no indigo/blue), shadcn/ui primitives, lucide-react icons, framer-motion for transitions, and the existing Zustand store for state.
- Mobile responsive, keyboard accessible, and SSR-safe (theme toggle handles hydration).
