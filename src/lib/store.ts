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

interface ModalState {
  authOpen: boolean;
  authMode: "login" | "register";
  onboardingOpen: boolean;
  onboardingStep: number;
  selectedFreelancerId: string | null;
  selectedServiceId: string | null;
  selectedJobId: string | null;
  walletOpen: boolean;
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
  // demo logged-in user (no real auth)
  currentUser: { name: string; type: "freelancer" | "client"; avatar: string } | null;
  login: (name: string, type: "freelancer" | "client") => void;
  logout: () => void;
}

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
}));
