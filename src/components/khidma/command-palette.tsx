"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  CornerDownLeft,
  ChevronUp,
  ChevronDown,
  ChevronRight,
  Briefcase,
  ShoppingBag,
  MessageSquare,
  Wallet,
  Sun,
  Moon,
  Home,
  Users,
  HelpCircle,
  LayoutDashboard,
  Shield,
  BarChart3,
  type LucideIcon,
} from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { KhidmaLogo } from "./logo";
import { useApp } from "@/lib/store";
import { useTheme } from "next-themes";
import {
  categories,
  freelancers,
  jobs,
  getAllServices,
  formatTND,
} from "@/lib/khidma-data";
import { cn } from "@/lib/utils";

/**
 * CommandPalette , Khidma global ⌘K command palette.
 *
 * - Self-renders based on `modal.commandPaletteOpen` from the global store.
 * - Opens with ⌘K (Mac) / Ctrl+K (Win/Linux); closes with Escape or backdrop click.
 * - Grouped results: Quick Actions · Navigate · Freelancers · Services · Jobs · Categories.
 * - Quick Actions + Navigate are always shown; the other groups filter by query
 *   (case-insensitive substring match) and cap at 5 items each.
 * - Keyboard navigation: ↑/↓ to move selection, Enter to activate, Escape to close.
 * - Mobile responsive: 90vw width, max 600px.
 * - framer-motion entrance: scale + fade from top, 0.15s ease-out.
 *
 * The palette is mounted once at the root and stays in the DOM (always-rendered
 * component returns null until `open` flips to true). The ⌘K keyboard listener
 * is always active so the user can summon the palette from anywhere.
 */

type View =
  | "home"
  | "freelancers"
  | "services"
  | "jobs"
  | "how-it-works"
  | "dashboard"
  | "admin"
  | "stats";

interface PaletteItem {
  id: string;
  groupId: string;
  /** Icon component (left slot, used when neither avatar nor thumbnail is set). */
  icon?: LucideIcon;
  /** Avatar URL (left slot, takes precedence over icon). */
  avatar?: string;
  /** Thumbnail URL (left slot, takes precedence over avatar). */
  thumbnail?: string;
  title: string;
  subtitle?: string;
  /** Small chip / chevron text on the right. */
  trailing?: string;
  action: () => void;
}

interface PaletteGroup {
  id: string;
  label: string;
  items: PaletteItem[];
}

function CommandPaletteImpl() {
  // ── State from global store (selectors → stable refs, minimal re-renders) ──
  const open = useApp((s) => s.modal.commandPaletteOpen);
  const openCommandPalette = useApp((s) => s.openCommandPalette);
  const closeCommandPalette = useApp((s) => s.closeCommandPalette);
  const setView = useApp((s) => s.setView);
  const openOnboarding = useApp((s) => s.openOnboarding);
  const openPostJob = useApp((s) => s.openPostJob);
  const openCreateService = useApp((s) => s.openCreateService);
  const openMessaging = useApp((s) => s.openMessaging);
  const openWallet = useApp((s) => s.openWallet);
  const openFreelancer = useApp((s) => s.openFreelancer);
  const openService = useApp((s) => s.openService);
  const openJob = useApp((s) => s.openJob);
  const setStoreTheme = useApp((s) => s.setTheme);

  // next-themes is the source of truth for the actual rendered theme.
  const { theme: ntTheme, setTheme: ntSetTheme } = useTheme();

  // ── Local UI state ──
  const [query, setQuery] = React.useState("");
  const [activeIndex, setActiveIndex] = React.useState(0);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const itemRefs = React.useRef<(HTMLButtonElement | null)[]>([]);
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);

  // Reset query + active index whenever the palette opens.
  React.useEffect(() => {
    if (open) {
      setQuery("");
      setActiveIndex(0);
      itemRefs.current = [];
      const t = setTimeout(() => inputRef.current?.focus(), 60);
      return () => clearTimeout(t);
    }
    return undefined;
  }, [open]);

  // ── Global keyboard shortcuts ──
  // ⌘K / Ctrl+K → toggle palette open/closed (always listening).
  React.useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (open) closeCommandPalette();
        else openCommandPalette();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, openCommandPalette, closeCommandPalette]);

  // Escape → close (only while open).
  React.useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        closeCommandPalette();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, closeCommandPalette]);

  // ── Filter data ──
  const q = query.trim().toLowerCase();

  const filteredFreelancers = React.useMemo(
    () =>
      freelancers
        .filter(
          (f) =>
            !q ||
            f.name.toLowerCase().includes(q) ||
            f.title.toLowerCase().includes(q) ||
            f.skills.some((s) => s.toLowerCase().includes(q))
        )
        .slice(0, 5),
    [q]
  );

  const filteredServices = React.useMemo(
    () =>
      getAllServices()
        .filter(
          (s) =>
            !q ||
            s.title.toLowerCase().includes(q) ||
            s.category.toLowerCase().includes(q) ||
            s.skills.some((sk) => sk.toLowerCase().includes(q))
        )
        .slice(0, 5),
    [q]
  );

  const filteredJobs = React.useMemo(
    () =>
      jobs
        .filter(
          (j) =>
            !q ||
            j.title.toLowerCase().includes(q) ||
            j.category.toLowerCase().includes(q) ||
            j.skills.some((sk) => sk.toLowerCase().includes(q))
        )
        .slice(0, 5),
    [q]
  );

  const filteredCategories = React.useMemo(
    () =>
      categories
        .filter(
          (c) =>
            !q ||
            c.name.toLowerCase().includes(q) ||
            c.nameAr.includes(query.trim()) ||
            c.skills.some((s) => s.toLowerCase().includes(q))
        )
        .slice(0, 5),
    [q, query]
  );

  // ── Build groups ──
  const groups: PaletteGroup[] = React.useMemo(() => {
    const close = () => closeCommandPalette();
    const navigateTo = (view: View) => {
      close();
      setView(view);
    };

    const quickActions: PaletteItem[] = [
      {
        id: "qa-onboard",
        groupId: "qa",
        icon: Users,
        title: "Become a freelancer",
        subtitle: "Start your onboarding journey",
        trailing: "Onboarding",
        action: () => {
          close();
          openOnboarding();
        },
      },
      {
        id: "qa-post-job",
        groupId: "qa",
        icon: Briefcase,
        title: "Post a job",
        subtitle: "Hire verified Tunisian talent",
        trailing: "New job",
        action: () => {
          close();
          openPostJob();
        },
      },
      {
        id: "qa-create-service",
        groupId: "qa",
        icon: ShoppingBag,
        title: "Create a service",
        subtitle: "List a new service offering",
        trailing: "New service",
        action: () => {
          close();
          openCreateService();
        },
      },
      {
        id: "qa-messaging",
        groupId: "qa",
        icon: MessageSquare,
        title: "Open messaging",
        subtitle: "View your conversations",
        trailing: "Inbox",
        action: () => {
          close();
          openMessaging();
        },
      },
      {
        id: "qa-wallet",
        groupId: "qa",
        icon: Wallet,
        title: "Open wallet",
        subtitle: "Balance, transactions, withdrawals",
        trailing: "Wallet",
        action: () => {
          close();
          openWallet();
        },
      },
      {
        id: "qa-theme",
        groupId: "qa",
        icon: ntTheme === "dark" ? Sun : Moon,
        title:
          ntTheme === "dark" ? "Switch to light mode" : "Switch to dark mode",
        subtitle: "Toggle UI theme",
        trailing: "Theme",
        action: () => {
          const next = ntTheme === "dark" ? "light" : "dark";
          ntSetTheme(next);
          setStoreTheme(next);
          close();
        },
      },
    ];

    const navigate: PaletteItem[] = [
      {
        id: "nv-home",
        groupId: "nv",
        icon: Home,
        title: "Home",
        subtitle: "Back to landing page",
        action: () => navigateTo("home"),
      },
      {
        id: "nv-talent",
        groupId: "nv",
        icon: Users,
        title: "Find Talent",
        subtitle: "Browse verified freelancers",
        action: () => navigateTo("freelancers"),
      },
      {
        id: "nv-work",
        groupId: "nv",
        icon: Briefcase,
        title: "Find Work",
        subtitle: "Browse open jobs",
        action: () => navigateTo("jobs"),
      },
      {
        id: "nv-services",
        groupId: "nv",
        icon: ShoppingBag,
        title: "Services",
        subtitle: "Browse services",
        action: () => navigateTo("services"),
      },
      {
        id: "nv-how",
        groupId: "nv",
        icon: HelpCircle,
        title: "How It Works",
        subtitle: "Platform walkthrough",
        action: () => navigateTo("how-it-works"),
      },
      {
        id: "nv-dashboard",
        groupId: "nv",
        icon: LayoutDashboard,
        title: "Dashboard",
        subtitle: "Your freelancer dashboard",
        action: () => navigateTo("dashboard"),
      },
      {
        id: "nv-admin",
        groupId: "nv",
        icon: Shield,
        title: "Admin Review Console",
        subtitle: "Review freelancer applications",
        action: () => navigateTo("admin"),
      },
      {
        id: "nv-stats",
        groupId: "nv",
        icon: BarChart3,
        title: "Platform Stats",
        subtitle: "Real-time marketplace analytics",
        action: () => navigateTo("stats"),
      },
    ];

    const freelancersGroup: PaletteItem[] = filteredFreelancers.map((f) => ({
      id: `fl-${f.id}`,
      groupId: "fl",
      avatar: f.avatar,
      title: f.name,
      subtitle: f.title,
      trailing: `★ ${f.rating.toFixed(1)}`,
      action: () => {
        close();
        openFreelancer(f.id);
      },
    }));

    const servicesGroup: PaletteItem[] = filteredServices.map((s) => ({
      id: `sv-${s.id}`,
      groupId: "sv",
      thumbnail: s.cover,
      title: s.title,
      subtitle: s.category,
      trailing: `from ${formatTND(s.startingPrice)}`,
      action: () => {
        close();
        openService(s.id);
      },
    }));

    const jobsGroup: PaletteItem[] = filteredJobs.map((j) => ({
      id: `jb-${j.id}`,
      groupId: "jb",
      icon: Briefcase,
      title: j.title,
      subtitle: `${j.postedBy} · ${j.duration} · ${j.experienceLevel}`,
      trailing:
        j.type === "HOURLY"
          ? `${formatTND(j.budget.min)}/hr`
          : `${formatTND(j.budget.min)}–${formatTND(j.budget.max)}`,
      action: () => {
        close();
        openJob(j.id);
      },
    }));

    const categoriesGroup: PaletteItem[] = filteredCategories.map((c) => ({
      id: `ct-${c.id}`,
      groupId: "ct",
      icon: c.icon,
      title: c.name,
      subtitle: `${c.count.toLocaleString()} freelancers`,
      trailing: c.nameAr,
      action: () => {
        close();
        setView("freelancers");
      },
    }));

    const result: PaletteGroup[] = [
      { id: "qa", label: "Quick Actions", items: quickActions },
      { id: "nv", label: "Navigate", items: navigate },
    ];
    if (freelancersGroup.length)
      result.push({ id: "fl", label: "Freelancers", items: freelancersGroup });
    if (servicesGroup.length)
      result.push({ id: "sv", label: "Services", items: servicesGroup });
    if (jobsGroup.length)
      result.push({ id: "jb", label: "Jobs", items: jobsGroup });
    if (categoriesGroup.length)
      result.push({ id: "ct", label: "Categories", items: categoriesGroup });

    return result;
  }, [
    filteredFreelancers,
    filteredServices,
    filteredJobs,
    filteredCategories,
    ntTheme,
    ntSetTheme,
    setStoreTheme,
    setView,
    openOnboarding,
    openPostJob,
    openCreateService,
    openMessaging,
    openWallet,
    openFreelancer,
    openService,
    openJob,
    closeCommandPalette,
  ]);

  // Flat list of items (for keyboard navigation index math).
  const flatItems = React.useMemo(
    () => groups.flatMap((g) => g.items),
    [groups]
  );

  // Pre-compute starting index of each group so we know each item's global index.
  const groupStartIndices = React.useMemo(() => {
    const starts: number[] = [];
    let cum = 0;
    for (const g of groups) {
      starts.push(cum);
      cum += g.items.length;
    }
    return starts;
  }, [groups]);

  // Reset active index when query changes.
  React.useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  // Auto-scroll active item into view.
  React.useEffect(() => {
    itemRefs.current[activeIndex]?.scrollIntoView({
      block: "nearest",
      behavior: "smooth",
    });
  }, [activeIndex]);

  // ── Input keyboard handler ──
  const onKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, flatItems.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      flatItems[activeIndex]?.action();
    }
  };

  if (!open) return null;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-start justify-center px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15, ease: "easeOut" }}
          role="dialog"
          aria-modal="true"
          aria-label="Khidma command palette"
        >
          {/* Backdrop , click to close */}
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={closeCommandPalette}
            aria-hidden
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -12 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="relative mt-[10vh] sm:mt-[14vh] w-[90vw] max-w-[600px] overflow-hidden rounded-xl border border-border/60 bg-popover text-popover-foreground shadow-2xl"
          >
            {/* ─── Input ─── */}
            <div className="flex items-center gap-3 border-b border-border/60 px-4">
              <Search className="size-5 text-muted-foreground shrink-0" aria-hidden />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={onKeyDown}
                placeholder="Search freelancers, services, jobs, or jump to…"
                aria-label="Search Khidma"
                aria-autocomplete="list"
                aria-controls="khidma-cmd-results"
                autoComplete="off"
                spellCheck={false}
                className="flex-1 h-14 bg-transparent text-base outline-none placeholder:text-muted-foreground"
              />
              <kbd
                className="hidden sm:inline-flex h-6 select-none items-center rounded border border-border bg-muted/60 px-1.5 font-mono text-[10px] font-medium text-muted-foreground"
                aria-hidden
              >
                ESC
              </kbd>
            </div>

            {/* ─── Results ─── */}
            <div
              id="khidma-cmd-results"
              ref={scrollContainerRef}
              className="max-h-[55vh] overflow-y-auto overscroll-contain p-2"
              role="listbox"
            >
              {groups.map((g, gIdx) => {
                const start = groupStartIndices[gIdx] ?? 0;
                return (
                  <div key={g.id} className="mb-1 last:mb-0">
                    <div className="px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                      {g.label}
                    </div>
                    {g.items.map((item, i) => {
                      const idx = start + i;
                      const active = idx === activeIndex;
                      return (
                        <ResultRow
                          key={item.id}
                          item={item}
                          active={active}
                          onClick={item.action}
                          onMouseEnter={() => setActiveIndex(idx)}
                          refCallback={(el) => {
                            itemRefs.current[idx] = el;
                          }}
                        />
                      );
                    })}
                  </div>
                );
              })}

              {flatItems.length === 0 && (
                <div className="px-4 py-16 text-center">
                  <Search className="mx-auto size-6 text-muted-foreground/50 mb-3" />
                  <p className="text-sm text-muted-foreground">
                    No results found
                    {query && (
                      <>
                        {" "}
                        for <span className="text-foreground font-medium">&ldquo;{query}&rdquo;</span>
                      </>
                    )}
                  </p>
                </div>
              )}
            </div>

            {/* ─── Footer ─── */}
            <div className="flex items-center justify-between gap-3 border-t border-border/60 bg-muted/30 px-4 h-11 text-[11px] text-muted-foreground">
              <div className="flex items-center gap-3 flex-wrap">
                <span className="flex items-center gap-1">
                  <ChevronUp className="size-3" />
                  <ChevronDown className="size-3" />
                  navigate
                </span>
                <span className="flex items-center gap-1">
                  <CornerDownLeft className="size-3" />
                  select
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="font-mono text-[10px] border border-border rounded px-1 py-px">
                    esc
                  </kbd>
                  close
                </span>
              </div>
              <KhidmaLogo
                variant="symbol"
                size="sm"
                className="opacity-70"
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/**
 * ResultRow , single row in the command palette.
 * Left slot: thumbnail / avatar / icon (in that priority order).
 * Middle slot: title (primary) + subtitle (secondary, truncated).
 * Right slot: trailing chip + chevron (only when active).
 */
const ResultRow = React.memo(function ResultRow({
  item,
  active,
  onClick,
  onMouseEnter,
  refCallback,
}: {
  item: PaletteItem;
  active: boolean;
  onClick: () => void;
  onMouseEnter: () => void;
  refCallback: (el: HTMLButtonElement | null) => void;
}) {
  const Icon = item.icon;
  return (
    <button
      ref={refCallback}
      type="button"
      role="option"
      aria-selected={active}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      className={cn(
        "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left transition-colors",
        active
          ? "bg-accent text-accent-foreground"
          : "hover:bg-accent/50"
      )}
    >
      {/* Left slot */}
      <div className="size-8 shrink-0 flex items-center justify-center">
        {item.thumbnail ? (
          <div className="size-8 overflow-hidden rounded-md bg-muted">
            <img
              src={item.thumbnail}
              alt=""
              className="size-full object-cover"
              loading="lazy"
            />
          </div>
        ) : item.avatar ? (
          <Avatar className="size-8 border border-border/60">
            <AvatarImage src={item.avatar} alt={item.title} />
            <AvatarFallback className="text-[10px] bg-[#32504d]/10 text-[#32504d] dark:text-[#748684]">
              {item.title.charAt(0)}
            </AvatarFallback>
          </Avatar>
        ) : Icon ? (
          <Icon className="size-4 text-muted-foreground" />
        ) : (
          <div className="size-8 rounded-md bg-muted" />
        )}
      </div>

      {/* Middle slot */}
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium truncate text-foreground">
          {item.title}
        </div>
        {item.subtitle && (
          <div className="text-xs text-muted-foreground truncate">
            {item.subtitle}
          </div>
        )}
      </div>

      {/* Right slot */}
      {item.trailing && (
        <span className="text-[11px] text-muted-foreground shrink-0 px-2 py-0.5 rounded-md bg-muted/70 dark:bg-muted/40">
          {item.trailing}
        </span>
      )}
      {active && (
        <ChevronRight className="size-3.5 text-muted-foreground shrink-0" />
      )}
    </button>
  );
});

export function CommandPalette() {
  return <CommandPaletteImpl />;
}

export default CommandPalette;
