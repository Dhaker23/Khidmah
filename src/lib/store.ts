"use client";

import { create } from "zustand";

type View =
  | "home"
  | "freelancers"
  | "services"
  | "jobs"
  | "how-it-works"
  | "dashboard"
  | "admin";

type Theme = "light" | "dark";
type Lang = "en" | "fr" | "ar";

export type ShareEntityType = "freelancer" | "service" | "job";
export type ReportEntityType = "freelancer" | "service" | "job" | "review";

export interface SharePayload {
  entityType: ShareEntityType;
  entityId: string;
  entityTitle: string;
}

export interface ReportPayload {
  entityType: ReportEntityType;
  entityId: string;
  entityTitle: string;
}

interface ModalState {
  authOpen: boolean;
  authMode: "login" | "register";
  onboardingOpen: boolean;
  onboardingStep: number;
  selectedFreelancerId: string | null;
  selectedServiceId: string | null;
  selectedJobId: string | null;
  walletOpen: boolean;
  messagingOpen: boolean;
  postJobOpen: boolean;
  createServiceOpen: boolean;
  commandPaletteOpen: boolean;
  compareOpen: boolean;
  favoritesOpen: boolean;
  shareOpen: boolean;
  sharePayload: SharePayload | null;
  reportOpen: boolean;
  reportPayload: ReportPayload | null;
  helpOpen: boolean;
  proOpen: boolean;
  referralOpen: boolean;
  privacyOpen: boolean;
  teamsOpen: boolean;
  apiDocsOpen: boolean;
  partnersOpen: boolean;
}

export type FavoriteType = "freelancer" | "service" | "job";
export interface FavoriteItem {
  id: string;
  type: FavoriteType;
  savedAt: number;
}

export interface RecentlyViewedItem {
  id: string;
  type: FavoriteType;
  viewedAt: number;
}

interface Notification {
  id: string;
  type: "application" | "proposal" | "message" | "payment" | "review" | "system" | "job" | "service";
  title: string;
  body: string;
  time: string;
  read: boolean;
  link?: string;
}

interface AppState {
  view: View;
  setView: (v: View) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  modal: ModalState;
  openAuth: (mode?: "login" | "register") => void;
  closeAuth: () => void;
  openOnboarding: () => void;
  closeOnboarding: () => void;
  setOnboardingStep: (n: number) => void;
  openFreelancer: (id: string) => void;
  closeFreelancer: () => void;
  openService: (id: string) => void;
  closeService: () => void;
  openJob: (id: string) => void;
  closeJob: () => void;
  openWallet: () => void;
  closeWallet: () => void;
  openMessaging: () => void;
  closeMessaging: () => void;
  openPostJob: () => void;
  closePostJob: () => void;
  openCreateService: () => void;
  closeCreateService: () => void;
  openCommandPalette: () => void;
  closeCommandPalette: () => void;
  openCompare: () => void;
  closeCompare: () => void;
  openFavorites: () => void;
  closeFavorites: () => void;
  openShare: (payload: SharePayload) => void;
  closeShare: () => void;
  openReport: (payload: ReportPayload) => void;
  closeReport: () => void;
  openHelp: () => void;
  closeHelp: () => void;
  openPro: () => void;
  closePro: () => void;
  openReferral: () => void;
  closeReferral: () => void;
  openPrivacy: () => void;
  closePrivacy: () => void;
  openTeams: () => void;
  closeTeams: () => void;
  openApiDocs: () => void;
  closeApiDocs: () => void;
  openPartners: () => void;
  closePartners: () => void;
  // demo logged-in user (no real auth)
  currentUser: { name: string; type: "freelancer" | "client"; avatar: string } | null;
  login: (name: string, type: "freelancer" | "client") => void;
  logout: () => void;
  // theme + lang
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (t: Theme) => void;
  lang: Lang;
  setLang: (l: Lang) => void;
  // notifications
  notifications: Notification[];
  unreadCount: number;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  clearNotifications: () => void;
  pushNotification: (n: Omit<Notification, "id" | "time" | "read">) => void;
  // favorites (persisted to localStorage)
  favorites: FavoriteItem[];
  toggleFavorite: (id: string, type: FavoriteType) => void;
  isFavorite: (id: string, type: FavoriteType) => boolean;
  removeFavorite: (id: string, type: FavoriteType) => void;
  clearFavorites: () => void;
  favoritesCount: number;
  // compare queue (max 3)
  compareIds: string[];
  toggleCompare: (id: string) => void;
  removeFromCompare: (id: string) => void;
  clearCompare: () => void;
  // recently viewed (max 8)
  recentlyViewed: RecentlyViewedItem[];
  trackView: (id: string, type: FavoriteType) => void;
  clearRecentlyViewed: () => void;
  // onboarding tour (first-visit guided walkthrough)
  tourActive: boolean;
  tourStep: number;
  startTour: () => void;
  nextTourStep: () => void;
  prevTourStep: () => void;
  endTour: () => void;
  skipTour: () => void;
}

const DEFAULT_NOTIFICATIONS: Notification[] = [
  {
    id: "n1",
    type: "proposal",
    title: "New proposal on your job",
    body: "Amira Ben Salah submitted a proposal for 'Next.js SaaS landing page'.",
    time: "2 min ago",
    read: false,
    link: "jobs",
  },
  {
    id: "n2",
    type: "payment",
    title: "Payment received",
    body: "TND 990 was released to your wallet from milestone 'Design system'.",
    time: "1 hour ago",
    read: false,
    link: "dashboard",
  },
  {
    id: "n3",
    type: "application",
    title: "Application approved",
    body: "Your freelancer application was approved. Welcome to Khidma!",
    time: "3 hours ago",
    read: true,
    link: "dashboard",
  },
  {
    id: "n4",
    type: "review",
    title: "New 5-star review",
    body: "Sarah Chen left you a 5.0 review on 'SaaS Landing Page Redesign'.",
    time: "1 day ago",
    read: true,
    link: "dashboard",
  },
  {
    id: "n5",
    type: "message",
    title: "New message",
    body: "Karim Bouazizi: 'Can we hop on a quick call tomorrow?'",
    time: "2 days ago",
    read: true,
    link: "messaging",
  },
];

export const useApp = create<AppState>((set) => ({
  view: "home",
  setView: (view) => set({ view }),
  searchQuery: "",
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  modal: {
    authOpen: false,
    authMode: "login",
    onboardingOpen: false,
    onboardingStep: 0,
    selectedFreelancerId: null,
    selectedServiceId: null,
    selectedJobId: null,
    walletOpen: false,
    messagingOpen: false,
    postJobOpen: false,
    createServiceOpen: false,
    commandPaletteOpen: false,
    compareOpen: false,
    favoritesOpen: false,
    shareOpen: false,
    sharePayload: null,
    reportOpen: false,
    reportPayload: null,
    helpOpen: false,
    proOpen: false,
    referralOpen: false,
    privacyOpen: false,
    teamsOpen: false,
    apiDocsOpen: false,
    partnersOpen: false,
  },
  openAuth: (mode = "login") =>
    set((s) => ({ modal: { ...s.modal, authOpen: true, authMode: mode } })),
  closeAuth: () => set((s) => ({ modal: { ...s.modal, authOpen: false } })),
  openOnboarding: () =>
    set((s) => ({ modal: { ...s.modal, onboardingOpen: true, onboardingStep: 0 } })),
  closeOnboarding: () =>
    set((s) => ({ modal: { ...s.modal, onboardingOpen: false } })),
  setOnboardingStep: (n) =>
    set((s) => ({ modal: { ...s.modal, onboardingStep: n } })),
  openFreelancer: (id) =>
    set((s) => {
      // Track in recently-viewed (dedupe + cap 8)
      const filtered = s.recentlyViewed.filter(
        (r) => !(r.id === id && r.type === "freelancer")
      );
      const recentlyViewed = [
        { id, type: "freelancer" as FavoriteType, viewedAt: Date.now() },
        ...filtered,
      ].slice(0, 8);
      if (typeof window !== "undefined") {
        try {
          window.localStorage.setItem(
            "khidma:recently-viewed",
            JSON.stringify(recentlyViewed)
          );
        } catch {
          /* ignore */
        }
      }
      return {
        modal: { ...s.modal, selectedFreelancerId: id },
        recentlyViewed,
      };
    }),
  closeFreelancer: () =>
    set((s) => ({ modal: { ...s.modal, selectedFreelancerId: null } })),
  openService: (id) =>
    set((s) => {
      const filtered = s.recentlyViewed.filter(
        (r) => !(r.id === id && r.type === "service")
      );
      const recentlyViewed = [
        { id, type: "service" as FavoriteType, viewedAt: Date.now() },
        ...filtered,
      ].slice(0, 8);
      if (typeof window !== "undefined") {
        try {
          window.localStorage.setItem(
            "khidma:recently-viewed",
            JSON.stringify(recentlyViewed)
          );
        } catch {
          /* ignore */
        }
      }
      return {
        modal: { ...s.modal, selectedServiceId: id },
        recentlyViewed,
      };
    }),
  closeService: () =>
    set((s) => ({ modal: { ...s.modal, selectedServiceId: null } })),
  openJob: (id) =>
    set((s) => {
      const filtered = s.recentlyViewed.filter(
        (r) => !(r.id === id && r.type === "job")
      );
      const recentlyViewed = [
        { id, type: "job" as FavoriteType, viewedAt: Date.now() },
        ...filtered,
      ].slice(0, 8);
      if (typeof window !== "undefined") {
        try {
          window.localStorage.setItem(
            "khidma:recently-viewed",
            JSON.stringify(recentlyViewed)
          );
        } catch {
          /* ignore */
        }
      }
      return {
        modal: { ...s.modal, selectedJobId: id },
        recentlyViewed,
      };
    }),
  closeJob: () => set((s) => ({ modal: { ...s.modal, selectedJobId: null } })),
  openWallet: () => set((s) => ({ modal: { ...s.modal, walletOpen: true } })),
  closeWallet: () => set((s) => ({ modal: { ...s.modal, walletOpen: false } })),
  openMessaging: () => set((s) => ({ modal: { ...s.modal, messagingOpen: true } })),
  closeMessaging: () => set((s) => ({ modal: { ...s.modal, messagingOpen: false } })),
  openPostJob: () => set((s) => ({ modal: { ...s.modal, postJobOpen: true } })),
  closePostJob: () => set((s) => ({ modal: { ...s.modal, postJobOpen: false } })),
  openCreateService: () => set((s) => ({ modal: { ...s.modal, createServiceOpen: true } })),
  closeCreateService: () => set((s) => ({ modal: { ...s.modal, createServiceOpen: false } })),
  openCommandPalette: () => set((s) => ({ modal: { ...s.modal, commandPaletteOpen: true } })),
  closeCommandPalette: () => set((s) => ({ modal: { ...s.modal, commandPaletteOpen: false } })),
  openCompare: () => set((s) => ({ modal: { ...s.modal, compareOpen: true } })),
  closeCompare: () => set((s) => ({ modal: { ...s.modal, compareOpen: false } })),
  openFavorites: () => set((s) => ({ modal: { ...s.modal, favoritesOpen: true } })),
  closeFavorites: () => set((s) => ({ modal: { ...s.modal, favoritesOpen: false } })),
  openShare: (payload) =>
    set((s) => ({ modal: { ...s.modal, shareOpen: true, sharePayload: payload } })),
  closeShare: () => set((s) => ({ modal: { ...s.modal, shareOpen: false } })),
  openReport: (payload) =>
    set((s) => ({ modal: { ...s.modal, reportOpen: true, reportPayload: payload } })),
  closeReport: () => set((s) => ({ modal: { ...s.modal, reportOpen: false } })),
  openHelp: () => set((s) => ({ modal: { ...s.modal, helpOpen: true } })),
  closeHelp: () => set((s) => ({ modal: { ...s.modal, helpOpen: false } })),
  openPro: () => set((s) => ({ modal: { ...s.modal, proOpen: true } })),
  closePro: () => set((s) => ({ modal: { ...s.modal, proOpen: false } })),
  openReferral: () => set((s) => ({ modal: { ...s.modal, referralOpen: true } })),
  closeReferral: () => set((s) => ({ modal: { ...s.modal, referralOpen: false } })),
  openPrivacy: () => set((s) => ({ modal: { ...s.modal, privacyOpen: true } })),
  closePrivacy: () => set((s) => ({ modal: { ...s.modal, privacyOpen: false } })),
  openTeams: () => set((s) => ({ modal: { ...s.modal, teamsOpen: true } })),
  closeTeams: () => set((s) => ({ modal: { ...s.modal, teamsOpen: false } })),
  openApiDocs: () => set((s) => ({ modal: { ...s.modal, apiDocsOpen: true } })),
  closeApiDocs: () => set((s) => ({ modal: { ...s.modal, apiDocsOpen: false } })),
  openPartners: () => set((s) => ({ modal: { ...s.modal, partnersOpen: true } })),
  closePartners: () => set((s) => ({ modal: { ...s.modal, partnersOpen: false } })),
  currentUser: null,
  login: (name, type) =>
    set({
      currentUser: {
        name,
        type,
        avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}&backgroundColor=32504d&radius=50`,
      },
    }),
  logout: () => set({ currentUser: null }),
  theme: "light",
  toggleTheme: () => set((s) => ({ theme: s.theme === "light" ? "dark" : "light" })),
  setTheme: (theme) => set({ theme }),
  lang: "en",
  setLang: (lang) => set({ lang }),
  notifications: DEFAULT_NOTIFICATIONS,
  unreadCount: DEFAULT_NOTIFICATIONS.filter((n) => !n.read).length,
  markNotificationRead: (id) =>
    set((s) => {
      const notifications = s.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      );
      return { notifications, unreadCount: notifications.filter((n) => !n.read).length };
    }),
  markAllNotificationsRead: () =>
    set((s) => ({
      notifications: s.notifications.map((n) => ({ ...n, read: true })),
      unreadCount: 0,
    })),
  clearNotifications: () => set({ notifications: [], unreadCount: 0 }),
  pushNotification: (n) =>
    set((s) => {
      const notif: Notification = {
        ...n,
        id: `n${Date.now()}`,
        time: "just now",
        read: false,
      };
      const notifications = [notif, ...s.notifications];
      return { notifications, unreadCount: notifications.filter((x) => !x.read).length };
    }),
  // === Favorites ===
  favorites: [],
  favoritesCount: 0,
  toggleFavorite: (id, type) =>
    set((s) => {
      const exists = s.favorites.some((f) => f.id === id && f.type === type);
      const favorites = exists
        ? s.favorites.filter((f) => !(f.id === id && f.type === type))
        : [{ id, type, savedAt: Date.now() }, ...s.favorites];
      // Persist to localStorage
      if (typeof window !== "undefined") {
        try {
          window.localStorage.setItem("khidma:favorites", JSON.stringify(favorites));
        } catch {
          /* ignore */
        }
      }
      return { favorites, favoritesCount: favorites.length };
    }),
  isFavorite: (id, type) =>
    useApp.getState().favorites.some((f) => f.id === id && f.type === type),
  removeFavorite: (id, type) =>
    set((s) => {
      const favorites = s.favorites.filter(
        (f) => !(f.id === id && f.type === type)
      );
      if (typeof window !== "undefined") {
        try {
          window.localStorage.setItem("khidma:favorites", JSON.stringify(favorites));
        } catch {
          /* ignore */
        }
      }
      return { favorites, favoritesCount: favorites.length };
    }),
  clearFavorites: () => {
    if (typeof window !== "undefined") {
      try {
        window.localStorage.removeItem("khidma:favorites");
      } catch {
        /* ignore */
      }
    }
    set({ favorites: [], favoritesCount: 0 });
  },
  // === Compare queue (max 3) ===
  compareIds: [],
  toggleCompare: (id) =>
    set((s) => {
      if (s.compareIds.includes(id)) {
        return { compareIds: s.compareIds.filter((x) => x !== id) };
      }
      if (s.compareIds.length >= 3) {
        return s; // max 3
      }
      return { compareIds: [...s.compareIds, id] };
    }),
  removeFromCompare: (id) =>
    set((s) => ({ compareIds: s.compareIds.filter((x) => x !== id) })),
  clearCompare: () => set({ compareIds: [] }),
  // === Recently viewed (max 8) ===
  recentlyViewed: [],
  trackView: (id, type) =>
    set((s) => {
      const filtered = s.recentlyViewed.filter(
        (r) => !(r.id === id && r.type === type)
      );
      const recentlyViewed = [
        { id, type, viewedAt: Date.now() },
        ...filtered,
      ].slice(0, 8);
      if (typeof window !== "undefined") {
        try {
          window.localStorage.setItem("khidma:recently-viewed", JSON.stringify(recentlyViewed));
        } catch {
          /* ignore */
        }
      }
      return { recentlyViewed };
    }),
  clearRecentlyViewed: () => {
    if (typeof window !== "undefined") {
      try {
        window.localStorage.removeItem("khidma:recently-viewed");
      } catch {
        /* ignore */
      }
    }
    set({ recentlyViewed: [] });
  },
  // === Onboarding tour ===
  tourActive: false,
  tourStep: 0,
  startTour: () => set({ tourActive: true, tourStep: 0 }),
  nextTourStep: () =>
    set((s) => ({ tourStep: s.tourStep + 1 })),
  prevTourStep: () => set((s) => ({ tourStep: Math.max(0, s.tourStep - 1) })),
  endTour: () => {
    if (typeof window !== "undefined") {
      try {
        window.localStorage.setItem("khidma:tour-completed", "true");
      } catch {
        /* ignore */
      }
    }
    set({ tourActive: false, tourStep: 0 });
  },
  skipTour: () => {
    if (typeof window !== "undefined") {
      try {
        window.localStorage.setItem("khidma:tour-completed", "true");
      } catch {
        /* ignore */
      }
    }
    set({ tourActive: false, tourStep: 0 });
  },
}));

// Hydrate favorites + recently-viewed from localStorage on first load
if (typeof window !== "undefined") {
  try {
    const fav = window.localStorage.getItem("khidma:favorites");
    if (fav) {
      const parsed = JSON.parse(fav) as FavoriteItem[];
      useApp.setState({ favorites: parsed, favoritesCount: parsed.length });
    }
  } catch {
    /* ignore */
  }
  try {
    const rv = window.localStorage.getItem("khidma:recently-viewed");
    if (rv) {
      const parsed = JSON.parse(rv) as RecentlyViewedItem[];
      useApp.setState({ recentlyViewed: parsed });
    }
  } catch {
    /* ignore */
  }
}

// Dev-only helper: expose the store on the window object so the agent-browser
// E2E verification can trigger modal actions from outside React.
if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
  (window as unknown as { __useApp?: typeof useApp }).__useApp = useApp;
}
