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
    set((s) => ({ modal: { ...s.modal, selectedFreelancerId: id } })),
  closeFreelancer: () =>
    set((s) => ({ modal: { ...s.modal, selectedFreelancerId: null } })),
  openService: (id) =>
    set((s) => ({ modal: { ...s.modal, selectedServiceId: id } })),
  closeService: () =>
    set((s) => ({ modal: { ...s.modal, selectedServiceId: null } })),
  openJob: (id) => set((s) => ({ modal: { ...s.modal, selectedJobId: id } })),
  closeJob: () =>
    set((s) => ({ modal: { ...s.modal, selectedJobId: null } })),
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
}));

// Dev-only helper: expose the store on the window object so the agent-browser
// E2E verification can trigger modal actions from outside React.
if (typeof window !== "undefined" && process.env.NODE_ENV === "development") {
  (window as unknown as { __useApp?: typeof useApp }).__useApp = useApp;
}
