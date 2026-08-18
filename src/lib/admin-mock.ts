// Khidma — Admin Review Console mock data
// In production these would be fetched via API from the admin service.
// For demo: 5 applications, risk signals, admin notes, history, audit log,
// 15-item admin review checklist, and KPI counters.

import type {
  ApplicationStatus,
  Freelancer,
  PortfolioItem,
} from "@/lib/khidma-data";
import { freelancers } from "@/lib/khidma-data";

export type RiskLevel = "LOW" | "MEDIUM" | "HIGH";
export type SignalStrength = "NONE" | "WATCH" | "SUSPICIOUS";

export type PortfolioItemDecision =
  | "PENDING"
  | "APPROVED"
  | "FLAGGED"
  | "REJECTED";

export interface RiskSignals {
  duplicateAccounts: SignalStrength;
  suspiciousActivity: SignalStrength;
  previousRejections: number;
  reportsCount: number;
  internalFlags: string[];
  overall: RiskLevel;
}

export interface AdminNote {
  id: string;
  applicationId: string;
  author: string;
  authorAvatar: string;
  timestamp: string;
  content: string;
  pinned?: boolean;
}

export interface HistoryEvent {
  id: string;
  applicationId: string;
  status: ApplicationStatus;
  label: string;
  timestamp: string;
  actor: string;
  note?: string;
}

export interface AuditLogEntry {
  id: string;
  applicationId: string;
  timestamp: string;
  actor: string;
  action: string;
  reason?: string;
  details?: string;
}

export interface ReviewChecklistItem {
  id: string;
  label: string;
  group: string;
  checked: boolean;
}

export interface PortfolioReviewState {
  itemId: string;
  verification: PortfolioItem["verification"];
  visibility: PortfolioItem["visibility"];
  decision: PortfolioItemDecision;
  note: string;
  rejectReason?: string;
}

export interface AdminApplication {
  id: string; // application ID (e.g. APP-2025-0014)
  freelancerId: string;
  freelancer: Freelancer;
  status: ApplicationStatus;
  appliedAt: string;
  assignedTo: string;
  phone: string;
  email: string;
  yearsOfExperience: number;
  primaryCategory: string;
  startingPrice: number;
  identityStatus: "PENDING" | "VERIFIED" | "REJECTED";
  risk: RiskSignals;
  checklist: ReviewChecklistItem[];
  portfolioReviews: Record<string, PortfolioReviewState>;
  notes: AdminNote[];
  history: HistoryEvent[];
  auditLog: AuditLogEntry[];
}

// === KPI strip (mock) ===
export const adminKPIs = {
  pendingReview: 24,
  underReview: 8,
  approvedToday: 12,
  rejectedToday: 3,
  totalVerified: 1248,
};

// === Admin reviewers (mock) ===
const reviewers = [
  { name: "Lina Ben Salah", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Lina%20Admin&backgroundColor=32504d&radius=50" },
  { name: "Karim Jouini", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Karim%20Admin&backgroundColor=2b3d3d&radius=50" },
  { name: "Rim Hamdi", avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Rim%20Admin&backgroundColor=475959&radius=50" },
  { name: "System", avatar: "" },
];

// === 15-item admin review checklist (spec section 55) ===
const checklistTemplate: Omit<ReviewChecklistItem, "checked">[] = [
  { id: "c1", label: "Identity document verified", group: "Identity" },
  { id: "c2", label: "Email address verified", group: "Identity" },
  { id: "c3", label: "Phone number verified", group: "Identity" },
  { id: "c4", label: "Profile photo appropriate", group: "Profile" },
  { id: "c5", label: "Professional title clear & accurate", group: "Profile" },
  { id: "c6", label: "Bio meets quality standards", group: "Profile" },
  { id: "c7", label: "Skills relevant to category", group: "Profile" },
  { id: "c8", label: "Experience entries valid", group: "Profile" },
  { id: "c9", label: "Portfolio ownership confirmed", group: "Portfolio" },
  { id: "c10", label: "No stolen / plagiarized content", group: "Portfolio" },
  { id: "c11", label: "No suspicious information detected", group: "Risk" },
  { id: "c12", label: "No duplicate account concerns", group: "Risk" },
  { id: "c13", label: "Primary category appropriate", group: "Quality" },
  { id: "c14", label: "Meets Khidma quality standards", group: "Quality" },
  { id: "c15", label: "Pricing within fair range", group: "Quality" },
];

function buildChecklist(checkedIds: string[]): ReviewChecklistItem[] {
  return checklistTemplate.map((t) => ({
    ...t,
    checked: checkedIds.includes(t.id),
  }));
}

function buildPortfolioReviews(
  items: PortfolioItem[],
  overrides: Partial<Record<string, Partial<PortfolioReviewState>>> = {},
): Record<string, PortfolioReviewState> {
  const out: Record<string, PortfolioReviewState> = {};
  for (const it of items) {
    out[it.id] = {
      itemId: it.id,
      verification: it.verification,
      visibility: it.visibility,
      decision: "PENDING",
      note: "",
      ...(overrides[it.id] ?? {}),
    };
  }
  return out;
}

// === Mock applications ===
export const adminApplications: AdminApplication[] = [
  {
    id: "APP-2025-0014",
    freelancerId: "f1",
    freelancer: freelancers[0],
    status: "UNDER_REVIEW",
    appliedAt: "2025-01-12T09:14:00Z",
    assignedTo: "Lina Ben Salah",
    phone: "+216 22 145 890",
    email: "amira.bensalah@example.com",
    yearsOfExperience: 7,
    primaryCategory: "Development",
    startingPrice: 350,
    identityStatus: "VERIFIED",
    risk: {
      duplicateAccounts: "NONE",
      suspiciousActivity: "NONE",
      previousRejections: 0,
      reportsCount: 0,
      internalFlags: [],
      overall: "LOW",
    },
    checklist: buildChecklist([
      "c1", "c2", "c3", "c4", "c5", "c6", "c7", "c9", "c10", "c12", "c13",
    ]),
    portfolioReviews: buildPortfolioReviews(
      freelancers[0].portfolio,
      {
        p1: { decision: "APPROVED", verification: "ADMIN_VERIFIED" },
        p2: { decision: "APPROVED", verification: "ADMIN_VERIFIED" },
      },
    ),
    notes: [
      {
        id: "n1",
        applicationId: "APP-2025-0014",
        author: reviewers[0].name,
        authorAvatar: reviewers[0].avatar,
        timestamp: "2025-01-12T11:02:00Z",
        content:
          "Profile looks strong. 7+ years of Next.js experience is verifiable across portfolio. Confirmed identity via ID upload. Proceeding to portfolio verification.",
        pinned: true,
      },
      {
        id: "n2",
        applicationId: "APP-2025-0014",
        author: reviewers[0].name,
        authorAvatar: reviewers[0].avatar,
        timestamp: "2025-01-12T11:35:00Z",
        content:
          "Item 1 (Real Estate Landing) — live URL verified, loading & responsive confirmed. Approved.",
      },
      {
        id: "n3",
        applicationId: "APP-2025-0014",
        author: reviewers[1].name,
        authorAvatar: reviewers[1].avatar,
        timestamp: "2025-01-12T12:10:00Z",
        content:
          "Item 3 (E-commerce marketplace) has a repo URL but no live deployment. Request external verification of GitHub commits before approving.",
      },
      {
        id: "n4",
        applicationId: "APP-2025-0014",
        author: reviewers[2].name,
        authorAvatar: reviewers[2].avatar,
        timestamp: "2025-01-12T13:48:00Z",
        content:
          "Cross-checked LinkedIn — confirmed employer matches. No duplicate accounts found.",
      },
    ],
    history: [
      {
        id: "h1",
        applicationId: "APP-2025-0014",
        status: "SUBMITTED",
        label: "Application Submitted",
        timestamp: "2025-01-12T09:14:00Z",
        actor: "Amira Ben Salah",
        note: "Submitted 8-step onboarding wizard. Verification 3/3.",
      },
      {
        id: "h2",
        applicationId: "APP-2025-0014",
        status: "UNDER_REVIEW",
        label: "Moved to Under Review",
        timestamp: "2025-01-12T10:55:00Z",
        actor: "System",
        note: "Auto-assigned to Lina Ben Salah (reviewer pool).",
      },
      {
        id: "h3",
        applicationId: "APP-2025-0014",
        status: "UNDER_REVIEW",
        label: "Portfolio Verification Started",
        timestamp: "2025-01-12T11:02:00Z",
        actor: "Lina Ben Salah",
      },
    ],
    auditLog: [
      {
        id: "a1",
        applicationId: "APP-2025-0014",
        timestamp: "2025-01-12T09:14:00Z",
        actor: "Amira Ben Salah",
        action: "SUBMIT_APPLICATION",
        details: "Application submitted via onboarding wizard.",
      },
      {
        id: "a2",
        applicationId: "APP-2025-0014",
        timestamp: "2025-01-12T10:55:00Z",
        actor: "System",
        action: "AUTO_ASSIGN",
        reason: "Round-robin reviewer assignment",
        details: "Assigned to Lina Ben Salah.",
      },
      {
        id: "a3",
        applicationId: "APP-2025-0014",
        timestamp: "2025-01-12T11:08:00Z",
        actor: "Lina Ben Salah",
        action: "PORTFOLIO_ITEM_APPROVED",
        reason: "Live URL verified",
        details: "Approved item p1 — Luxury Real Estate Landing Page.",
      },
      {
        id: "a4",
        applicationId: "APP-2025-0014",
        timestamp: "2025-01-12T11:32:00Z",
        actor: "Lina Ben Salah",
        action: "PORTFOLIO_ITEM_APPROVED",
        details: "Approved item p2 — SaaS Analytics Dashboard.",
      },
      {
        id: "a5",
        applicationId: "APP-2025-0014",
        timestamp: "2025-01-12T13:48:00Z",
        actor: "Rim Hamdi",
        action: "DUPLICATE_CHECK",
        details: "No duplicate accounts found.",
      },
    ],
  },
  {
    id: "APP-2025-0015",
    freelancerId: "f5",
    freelancer: freelancers[4],
    status: "MORE_INFORMATION_REQUIRED",
    appliedAt: "2025-01-11T16:42:00Z",
    assignedTo: "Karim Jouini",
    phone: "+216 98 314 220",
    email: "rania.khelifi@example.com",
    yearsOfExperience: 4,
    primaryCategory: "Writing",
    startingPrice: 60,
    identityStatus: "PENDING",
    risk: {
      duplicateAccounts: "WATCH",
      suspiciousActivity: "NONE",
      previousRejections: 1,
      reportsCount: 0,
      internalFlags: ["Self-declared portfolio only"],
      overall: "MEDIUM",
    },
    checklist: buildChecklist([
      "c2", "c4", "c5", "c7", "c12", "c13",
    ]),
    portfolioReviews: buildPortfolioReviews(
      freelancers[4].portfolio,
      {
        p8: {
          decision: "FLAGGED",
          verification: "SELF_DECLARED",
          note: "Live URL works but content shows a different company name. Need freelancer to confirm authorship.",
        },
      },
    ),
    notes: [
      {
        id: "n5",
        applicationId: "APP-2025-0015",
        author: reviewers[1].name,
        authorAvatar: reviewers[1].avatar,
        timestamp: "2025-01-11T17:20:00Z",
        content:
          "Portfolio item is self-declared only. Identity document not uploaded yet. Need to request government ID + proof of authorship.",
        pinned: true,
      },
      {
        id: "n6",
        applicationId: "APP-2025-0015",
        author: reviewers[1].name,
        authorAvatar: reviewers[1].avatar,
        timestamp: "2025-01-11T17:55:00Z",
        content:
          "Found a similar account (@rania.write) — same city, similar skills. Watch for duplicate. Asking for additional clarification.",
      },
      {
        id: "n7",
        applicationId: "APP-2025-0015",
        author: reviewers[2].name,
        authorAvatar: reviewers[2].avatar,
        timestamp: "2025-01-11T19:10:00Z",
        content:
          "Previous rejection in Oct 2024 — reason: incomplete identity. Now submitted again with same gap. Should request info before approving.",
      },
    ],
    history: [
      {
        id: "h4",
        applicationId: "APP-2025-0015",
        status: "SUBMITTED",
        label: "Application Submitted",
        timestamp: "2025-01-11T16:42:00Z",
        actor: "Rania Khelifi",
      },
      {
        id: "h5",
        applicationId: "APP-2025-0015",
        status: "UNDER_REVIEW",
        label: "Moved to Under Review",
        timestamp: "2025-01-11T17:05:00Z",
        actor: "System",
      },
      {
        id: "h6",
        applicationId: "APP-2025-0015",
        status: "MORE_INFORMATION_REQUIRED",
        label: "Information Requested",
        timestamp: "2025-01-11T18:30:00Z",
        actor: "Karim Jouini",
        note: "Requested: government ID + proof of authorship for portfolio item.",
      },
    ],
    auditLog: [
      {
        id: "a6",
        applicationId: "APP-2025-0015",
        timestamp: "2025-01-11T16:42:00Z",
        actor: "Rania Khelifi",
        action: "SUBMIT_APPLICATION",
      },
      {
        id: "a7",
        applicationId: "APP-2025-0015",
        timestamp: "2025-01-11T17:05:00Z",
        actor: "System",
        action: "AUTO_ASSIGN",
        details: "Assigned to Karim Jouini.",
      },
      {
        id: "a8",
        applicationId: "APP-2025-0015",
        timestamp: "2025-01-11T17:55:00Z",
        actor: "Karim Jouini",
        action: "PORTFOLIO_ITEM_FLAGGED",
        reason: "Self-declared, no proof of authorship",
        details: "Flagged item p8 — SaaS Landing Page Copy Series.",
      },
      {
        id: "a9",
        applicationId: "APP-2025-0015",
        timestamp: "2025-01-11T18:30:00Z",
        actor: "Karim Jouini",
        action: "REQUEST_INFORMATION",
        reason: "Identity & portfolio ownership",
        details: "Requested government ID + proof of authorship.",
      },
    ],
  },
  {
    id: "APP-2025-0016",
    freelancerId: "f6",
    freelancer: freelancers[5],
    status: "SUBMITTED",
    appliedAt: "2025-01-13T08:22:00Z",
    assignedTo: "Unassigned",
    phone: "+216 55 902 410",
    email: "omar.jlassi@example.com",
    yearsOfExperience: 5,
    primaryCategory: "3D & Architecture",
    startingPrice: 90,
    identityStatus: "PENDING",
    risk: {
      duplicateAccounts: "NONE",
      suspiciousActivity: "NONE",
      previousRejections: 0,
      reportsCount: 0,
      internalFlags: [],
      overall: "LOW",
    },
    checklist: buildChecklist(["c2", "c3", "c5", "c7", "c13"]),
    portfolioReviews: buildPortfolioReviews(freelancers[5].portfolio),
    notes: [
      {
        id: "n8",
        applicationId: "APP-2025-0016",
        author: reviewers[2].name,
        authorAvatar: reviewers[2].avatar,
        timestamp: "2025-01-13T08:30:00Z",
        content:
          "Newly submitted. 3D product renders look strong. Awaiting identity document upload to proceed.",
        pinned: true,
      },
    ],
    history: [
      {
        id: "h7",
        applicationId: "APP-2025-0016",
        status: "SUBMITTED",
        label: "Application Submitted",
        timestamp: "2025-01-13T08:22:00Z",
        actor: "Omar Jlassi",
        note: "Submitted onboarding wizard. Verification 2/3 — identity pending.",
      },
    ],
    auditLog: [
      {
        id: "a10",
        applicationId: "APP-2025-0016",
        timestamp: "2025-01-13T08:22:00Z",
        actor: "Omar Jlassi",
        action: "SUBMIT_APPLICATION",
        details: "Application submitted via onboarding wizard.",
      },
    ],
  },
  {
    id: "APP-2025-0011",
    freelancerId: "f2",
    freelancer: freelancers[1],
    status: "APPROVED",
    appliedAt: "2025-01-09T13:08:00Z",
    assignedTo: "Rim Hamdi",
    phone: "+216 71 622 805",
    email: "yassine.gharbi@example.com",
    yearsOfExperience: 8,
    primaryCategory: "Design",
    startingPrice: 250,
    identityStatus: "VERIFIED",
    risk: {
      duplicateAccounts: "NONE",
      suspiciousActivity: "NONE",
      previousRejections: 0,
      reportsCount: 0,
      internalFlags: [],
      overall: "LOW",
    },
    checklist: buildChecklist([
      "c1", "c2", "c3", "c4", "c5", "c6", "c7", "c8", "c9", "c10", "c11",
      "c12", "c13", "c14", "c15",
    ]),
    portfolioReviews: buildPortfolioReviews(
      freelancers[1].portfolio,
      {
        p4: { decision: "APPROVED", verification: "ADMIN_VERIFIED" },
        p5: { decision: "APPROVED", verification: "ADMIN_VERIFIED" },
      },
    ),
    notes: [
      {
        id: "n9",
        applicationId: "APP-2025-0011",
        author: reviewers[2].name,
        authorAvatar: reviewers[2].avatar,
        timestamp: "2025-01-09T14:15:00Z",
        content:
          "Clean profile, verified Figma source files, externally referenced work via Dribbble. Approved.",
        pinned: true,
      },
    ],
    history: [
      {
        id: "h8",
        applicationId: "APP-2025-0011",
        status: "SUBMITTED",
        label: "Application Submitted",
        timestamp: "2025-01-09T13:08:00Z",
        actor: "Yassine Gharbi",
      },
      {
        id: "h9",
        applicationId: "APP-2025-0011",
        status: "UNDER_REVIEW",
        label: "Moved to Under Review",
        timestamp: "2025-01-09T13:30:00Z",
        actor: "System",
      },
      {
        id: "h10",
        applicationId: "APP-2025-0011",
        status: "APPROVED",
        label: "Application Approved",
        timestamp: "2025-01-09T15:42:00Z",
        actor: "Rim Hamdi",
        note: "All 15 checklist items passed. Profile is now live.",
      },
    ],
    auditLog: [
      {
        id: "a11",
        applicationId: "APP-2025-0011",
        timestamp: "2025-01-09T13:08:00Z",
        actor: "Yassine Gharbi",
        action: "SUBMIT_APPLICATION",
      },
      {
        id: "a12",
        applicationId: "APP-2025-0011",
        timestamp: "2025-01-09T15:42:00Z",
        actor: "Rim Hamdi",
        action: "APPROVE_APPLICATION",
        reason: "All checks passed",
        details: "Status changed APPROVED. Profile published.",
      },
    ],
  },
  {
    id: "APP-2025-0009",
    freelancerId: "f4",
    freelancer: freelancers[3],
    status: "REJECTED",
    appliedAt: "2025-01-08T11:20:00Z",
    assignedTo: "Karim Jouini",
    phone: "+216 22 778 119",
    email: "mehdi.trabelsi@example.com",
    yearsOfExperience: 3,
    primaryCategory: "Audio",
    startingPrice: 80,
    identityStatus: "REJECTED",
    risk: {
      duplicateAccounts: "SUSPICIOUS",
      suspiciousActivity: "WATCH",
      previousRejections: 2,
      reportsCount: 1,
      internalFlags: [
        "Possible duplicate of @mehdi.vo (different account, same ID document)",
        "1 client report — invoice dispute",
      ],
      overall: "HIGH",
    },
    checklist: buildChecklist(["c2", "c3", "c5", "c7", "c13"]),
    portfolioReviews: buildPortfolioReviews(
      freelancers[3].portfolio,
      {
        p7: {
          decision: "REJECTED",
          verification: "UNVERIFIED",
          rejectReason: "Audio sample claims commercial rights but source track found in public domain library.",
          note: "Reject — plagiarized audio sample.",
        },
      },
    ),
    notes: [
      {
        id: "n10",
        applicationId: "APP-2025-0009",
        author: reviewers[1].name,
        authorAvatar: reviewers[1].avatar,
        timestamp: "2025-01-08T12:00:00Z",
        content:
          "Identity document appears identical to a previously rejected account. Flagged as suspicious duplicate.",
        pinned: true,
      },
      {
        id: "n11",
        applicationId: "APP-2025-0009",
        author: reviewers[1].name,
        authorAvatar: reviewers[1].avatar,
        timestamp: "2025-01-08T12:35:00Z",
        content:
          "Portfolio audio sample claims commercial rights, but the track was identified in a public domain library. Cannot approve.",
      },
      {
        id: "n12",
        applicationId: "APP-2025-0009",
        author: reviewers[2].name,
        authorAvatar: reviewers[2].avatar,
        timestamp: "2025-01-08T13:10:00Z",
        content:
          "1 prior client report — invoice dispute on a previous project. Recommending rejection.",
      },
    ],
    history: [
      {
        id: "h11",
        applicationId: "APP-2025-0009",
        status: "SUBMITTED",
        label: "Application Submitted",
        timestamp: "2025-01-08T11:20:00Z",
        actor: "Mehdi Trabelsi",
      },
      {
        id: "h12",
        applicationId: "APP-2025-0009",
        status: "UNDER_REVIEW",
        label: "Moved to Under Review",
        timestamp: "2025-01-08T11:35:00Z",
        actor: "System",
      },
      {
        id: "h13",
        applicationId: "APP-2025-0009",
        status: "REJECTED",
        label: "Application Rejected",
        timestamp: "2025-01-08T13:50:00Z",
        actor: "Karim Jouini",
        note: "Rejected — duplicate account + plagiarized portfolio audio sample.",
      },
    ],
    auditLog: [
      {
        id: "a13",
        applicationId: "APP-2025-0009",
        timestamp: "2025-01-08T11:20:00Z",
        actor: "Mehdi Trabelsi",
        action: "SUBMIT_APPLICATION",
      },
      {
        id: "a14",
        applicationId: "APP-2025-0009",
        timestamp: "2025-01-08T11:35:00Z",
        actor: "System",
        action: "AUTO_ASSIGN",
        details: "Assigned to Karim Jouini.",
      },
      {
        id: "a15",
        applicationId: "APP-2025-0009",
        timestamp: "2025-01-08T12:30:00Z",
        actor: "Karim Jouini",
        action: "PORTFOLIO_ITEM_REJECTED",
        reason: "Plagiarized audio sample",
        details: "Rejected item p7 — Arabic Audiobook Sample.",
      },
      {
        id: "a16",
        applicationId: "APP-2025-0009",
        timestamp: "2025-01-08T13:50:00Z",
        actor: "Karim Jouini",
        action: "REJECT_APPLICATION",
        reason: "Duplicate account + plagiarized portfolio",
        details: "Status changed REJECTED.",
      },
    ],
  },
];

export const adminReviewers = reviewers;

// === Status display config ===
export const statusConfig: Record<
  ApplicationStatus,
  { label: string; color: string; bg: string; dot: string }
> = {
  DRAFT: {
    label: "Draft",
    color: "text-muted-foreground",
    bg: "bg-muted",
    dot: "bg-muted-foreground",
  },
  SUBMITTED: {
    label: "Submitted",
    color: "text-[#32504d]",
    bg: "bg-[#32504d]/10",
    dot: "bg-[#32504d]",
  },
  UNDER_REVIEW: {
    label: "Under Review",
    color: "text-[#475959]",
    bg: "bg-[#475959]/10",
    dot: "bg-[#475959]",
  },
  MORE_INFORMATION_REQUIRED: {
    label: "Info Required",
    color: "text-amber-700",
    bg: "bg-amber-50",
    dot: "bg-amber-500",
  },
  APPROVED: {
    label: "Approved",
    color: "text-emerald-700",
    bg: "bg-emerald-50",
    dot: "bg-emerald-600",
  },
  REJECTED: {
    label: "Rejected",
    color: "text-red-700",
    bg: "bg-red-50",
    dot: "bg-red-600",
  },
  SUSPENDED: {
    label: "Suspended",
    color: "text-red-800",
    bg: "bg-red-100",
    dot: "bg-red-700",
  },
  REVOKED: {
    label: "Revoked",
    color: "text-red-900",
    bg: "bg-red-200",
    dot: "bg-red-800",
  },
};

export const riskConfig: Record<
  RiskLevel,
  { label: string; color: string; bg: string; ring: string }
> = {
  LOW: {
    label: "LOW RISK",
    color: "text-emerald-700",
    bg: "bg-emerald-50",
    ring: "ring-emerald-200",
  },
  MEDIUM: {
    label: "MEDIUM RISK",
    color: "text-amber-700",
    bg: "bg-amber-50",
    ring: "ring-amber-200",
  },
  HIGH: {
    label: "HIGH RISK",
    color: "text-red-700",
    bg: "bg-red-50",
    ring: "ring-red-200",
  },
};

export const signalConfig: Record<
  SignalStrength,
  { label: string; color: string; bg: string }
> = {
  NONE: {
    label: "None",
    color: "text-emerald-700",
    bg: "bg-emerald-50",
  },
  WATCH: {
    label: "Watch",
    color: "text-amber-700",
    bg: "bg-amber-50",
  },
  SUSPICIOUS: {
    label: "Suspicious",
    color: "text-red-700",
    bg: "bg-red-50",
  },
};

export const verificationLabel: Record<PortfolioItem["verification"], string> = {
  UNVERIFIED: "Unverified",
  SELF_DECLARED: "Self-declared",
  ADMIN_VERIFIED: "Admin verified",
  EXTERNALLY_VERIFIED: "Externally verified",
};

export const visibilityLabel: Record<PortfolioItem["visibility"], string> = {
  PUBLIC: "Public",
  PRIVATE: "Private",
  UNLISTED: "Unlisted",
};

export const decisionConfig: Record<
  PortfolioItemDecision,
  { label: string; color: string; bg: string }
> = {
  PENDING: {
    label: "Pending",
    color: "text-muted-foreground",
    bg: "bg-muted",
  },
  APPROVED: {
    label: "Approved",
    color: "text-emerald-700",
    bg: "bg-emerald-50",
  },
  FLAGGED: {
    label: "Flagged",
    color: "text-amber-700",
    bg: "bg-amber-50",
  },
  REJECTED: {
    label: "Rejected",
    color: "text-red-700",
    bg: "bg-red-50",
  },
};

// Helpers
export function checklistCount(checklist: ReviewChecklistItem[]): number {
  return checklist.filter((c) => c.checked).length;
}

export function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function formatDateTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function timeAgo(iso: string): string {
  const then = new Date(iso).getTime();
  const now = Date.now();
  const diff = Math.max(0, now - then);
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  return `${Math.floor(months / 12)}y ago`;
}
