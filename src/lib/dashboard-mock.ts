// Khidma — Freelancer dashboard mock data
// Used by src/components/views/dashboard-view.tsx
// All amounts in TND.

import type { ContractStatus, WalletTxnStatus } from "@/lib/khidma-data";

// === KPI numbers (current user: Amira Ben Salah — freelancers[0]) ===
export const kpis = {
  availableBalance: 4250,
  pendingClearance: 1800,
  activeContracts: 3,
  completedProjects: 142,
  monthlyEarningsTotal: 4870,
  monthlyGrowth: 12, // %
  responseRate: 98,
  responseRateDelta: 4, // +4% vs last month
  onTimeDelivery: 96,
  repeatClients: 34,
};

// === Earnings chart — last 6 months ===
export const earningsMonthly = [
  { month: "Mar", earnings: 3200, withdrawals: 1800 },
  { month: "Apr", earnings: 4100, withdrawals: 2200 },
  { month: "May", earnings: 3800, withdrawals: 2500 },
  { month: "Jun", earnings: 4650, withdrawals: 3100 },
  { month: "Jul", earnings: 5200, withdrawals: 3400 },
  { month: "Aug", earnings: 4870, withdrawals: 2900 },
];

// === Activity feed (5 items) ===
export type ActivityType =
  | "proposal"
  | "milestone"
  | "payment"
  | "review"
  | "portfolio";

export interface ActivityItem {
  id: string;
  type: ActivityType;
  title: string;
  description: string;
  time: string;
}

export const activityFeed: ActivityItem[] = [
  {
    id: "a1",
    type: "proposal",
    title: "New proposal received",
    description:
      "Cassurea Technologies invited you to submit a proposal for “Next.js SaaS landing page”.",
    time: "12 min ago",
  },
  {
    id: "a2",
    type: "milestone",
    title: "Milestone funded",
    description:
      "SaaS Dashboard — Milestone 2 ($1,200) was funded by the client.",
    time: "3 hours ago",
  },
  {
    id: "a3",
    type: "payment",
    title: "Payment received",
    description: "Order #1029 — Next.js landing page (+750 TND).",
    time: "1 day ago",
  },
  {
    id: "a4",
    type: "review",
    title: "Review left",
    description:
      "Sarah Chen left a 5.0 review on “SaaS Landing Page Redesign”.",
    time: "2 days ago",
  },
  {
    id: "a5",
    type: "portfolio",
    title: "Portfolio item approved",
    description:
      "“Luxury Real Estate Landing Page” was approved by the Khidma team.",
    time: "4 days ago",
  },
];

// === Profile completion (85%) ===
export const profileCompletion = {
  total: 85,
  items: [
    { label: "Personal info", value: 100, done: true },
    { label: "Professional info", value: 100, done: true },
    { label: "Profile photo", value: 100, done: true },
    { label: "Skills (6 of 5+)", value: 100, done: true },
    { label: "Languages", value: 100, done: true },
    { label: "Portfolio items (3)", value: 75, done: false },
    { label: "Hourly rate", value: 100, done: true },
    { label: "Availability calendar", value: 50, done: false },
  ],
};

// === Proposals & Applications ===
export type ProposalStatus =
  | "PENDING"
  | "VIEWED"
  | "SHORTLISTED"
  | "DECLINED"
  | "HIRED";

export interface Proposal {
  id: string;
  jobTitle: string;
  client: string;
  clientAvatar: string;
  submitted: string;
  status: ProposalStatus;
  bid: number;
  isHourly?: boolean;
  coverLetter: string;
}

const avatarFor = (seed: string) =>
  `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
    seed
  )}&backgroundColor=32504d,475959,6e8580&radius=50`;

export const proposals: Proposal[] = [
  {
    id: "pr1",
    jobTitle: "Build a Next.js SaaS landing page with animations",
    client: "Cassurea Technologies",
    clientAvatar: avatarFor("Cassurea Technologies"),
    submitted: "Aug 17, 2025",
    status: "SHORTLISTED",
    bid: 1200,
    coverLetter:
      "Hi Cassurea team — I've delivered 4 similar fintech landing pages in the past year, including animated hero sections with GSAP and lead-capture flows. Happy to start within 2 days. Full plan + milestones in the brief.",
  },
  {
    id: "pr2",
    jobTitle: "Design a complete brand identity for a coffee shop",
    client: "Café El Manara",
    clientAvatar: avatarFor("Café El Manara"),
    submitted: "Aug 14, 2025",
    status: "PENDING",
    bid: 800,
    coverLetter:
      "Brand identity is right in my wheelhouse — I've shipped 12+ MENA F&B brand systems. Let's set up a 30-min discovery call.",
  },
  {
    id: "pr3",
    jobTitle: "Voice over for 10-episode Arabic podcast series",
    client: "Sahla Media",
    clientAvatar: avatarFor("Sahla Media"),
    submitted: "Aug 9, 2025",
    status: "VIEWED",
    bid: 600,
    coverLetter:
      "I can deliver clean, mastered WAV files per episode with a 48-hour turnaround per episode.",
  },
  {
    id: "pr4",
    jobTitle: "SEO-optimized blog content for a SaaS company (ongoing)",
    client: "DevTool Hub",
    clientAvatar: avatarFor("DevTool Hub"),
    submitted: "Aug 4, 2025",
    status: "HIRED",
    bid: 35,
    isHourly: true,
    coverLetter:
      "Monthly retainer — 4 articles/month, 1500 words each, with SEO research + meta tags.",
  },
  {
    id: "pr5",
    jobTitle: "3D product renders for cosmetics e-commerce (12 SKUs)",
    client: "Nour Cosmetics",
    clientAvatar: avatarFor("Nour Cosmetics"),
    submitted: "Jul 28, 2025",
    status: "DECLINED",
    bid: 1000,
    coverLetter:
      "12 SKUs, multiple angles, lifestyle scene — 2-week timeline fits.",
  },
];

export const proposalStatusStyles: Record<
  ProposalStatus,
  { className: string; label: string }
> = {
  PENDING: {
    label: "Pending",
    className: "bg-amber-500/10 text-amber-700 border-amber-200",
  },
  VIEWED: {
    label: "Viewed",
    className: "bg-[#748684]/15 text-[#475959] border-[#748684]/30",
  },
  SHORTLISTED: {
    label: "Shortlisted",
    className: "bg-[#32504d]/10 text-[#32504d] border-[#32504d]/25",
  },
  HIRED: {
    label: "Hired",
    className: "bg-emerald-500/10 text-emerald-700 border-emerald-200",
  },
  DECLINED: {
    label: "Declined",
    className: "bg-rose-500/10 text-rose-700 border-rose-200",
  },
};

// === Contracts ===
export type MilestoneStatus =
  | "PENDING_FUNDING"
  | "FUNDED"
  | "IN_PROGRESS"
  | "DELIVERED"
  | "APPROVED";

export interface Milestone {
  title: string;
  amount: number;
  status: MilestoneStatus;
  due: string;
}

export interface Contract {
  id: string;
  title: string;
  client: string;
  clientAvatar: string;
  status: ContractStatus;
  totalValue: number;
  milestonesTotal: number;
  milestonesDone: number;
  nextDue: string;
  startedAt: string;
  milestones: Milestone[];
}

export const contracts: Contract[] = [
  {
    id: "c1",
    title: "Multi-tenant SaaS Dashboard",
    client: "Karim Bouazizi",
    clientAvatar: avatarFor("Karim Bouazizi"),
    status: "IN_PROGRESS",
    totalValue: 2500,
    milestonesTotal: 3,
    milestonesDone: 2,
    nextDue: "Aug 30, 2025",
    startedAt: "Aug 1, 2025",
    milestones: [
      { title: "Discovery & wireframes", amount: 600, status: "APPROVED", due: "Aug 4, 2025" },
      { title: "Auth + dashboard pages", amount: 1200, status: "FUNDED", due: "Aug 15, 2025" },
      { title: "Real-time + WebSockets", amount: 700, status: "PENDING_FUNDING", due: "Aug 30, 2025" },
    ],
  },
  {
    id: "c2",
    title: "SaaS Landing Page Redesign",
    client: "Sarah Chen",
    clientAvatar: avatarFor("Sarah Chen"),
    status: "DELIVERED",
    totalValue: 750,
    milestonesTotal: 1,
    milestonesDone: 1,
    nextDue: "—",
    startedAt: "Aug 5, 2025",
    milestones: [
      { title: "Full landing page delivery", amount: 750, status: "DELIVERED", due: "Aug 12, 2025" },
    ],
  },
  {
    id: "c3",
    title: "Crafts of Tunisia — Marketplace Phase 1",
    client: "Nour Cosmetics",
    clientAvatar: avatarFor("Nour Cosmetics"),
    status: "FUNDED",
    totalValue: 1500,
    milestonesTotal: 2,
    milestonesDone: 0,
    nextDue: "Sep 5, 2025",
    startedAt: "Aug 20, 2025",
    milestones: [
      { title: "Setup + product catalog", amount: 750, status: "FUNDED", due: "Aug 25, 2025" },
      { title: "Payments + escrow flow", amount: 750, status: "PENDING_FUNDING", due: "Sep 5, 2025" },
    ],
  },
  {
    id: "c4",
    title: "Real Estate Platform — Phase 2",
    client: "ImmoTunisia",
    clientAvatar: avatarFor("ImmoTunisia"),
    status: "APPROVED",
    totalValue: 1800,
    milestonesTotal: 2,
    milestonesDone: 2,
    nextDue: "—",
    startedAt: "Jun 28, 2025",
    milestones: [
      { title: "Property listings + filters", amount: 900, status: "APPROVED", due: "Jul 12, 2025" },
      { title: "Map + saved searches", amount: 900, status: "APPROVED", due: "Aug 1, 2025" },
    ],
  },
];

export const contractStatusStyles: Record<
  ContractStatus,
  { className: string; label: string }
> = {
  DRAFT: { label: "Draft", className: "bg-muted text-muted-foreground border-border" },
  PENDING_FUNDING: {
    label: "Pending funding",
    className: "bg-amber-500/10 text-amber-700 border-amber-200",
  },
  FUNDED: {
    label: "Funded",
    className: "bg-[#32504d]/10 text-[#32504d] border-[#32504d]/25",
  },
  IN_PROGRESS: {
    label: "In progress",
    className: "bg-[#475959]/10 text-[#475959] border-[#475959]/25",
  },
  DELIVERED: {
    label: "Delivered",
    className: "bg-[#748684]/15 text-[#475959] border-[#748684]/30",
  },
  APPROVED: {
    label: "Approved",
    className: "bg-emerald-500/10 text-emerald-700 border-emerald-200",
  },
  COMPLETED: {
    label: "Completed",
    className: "bg-emerald-500/10 text-emerald-700 border-emerald-200",
  },
  DISPUTED: {
    label: "Disputed",
    className: "bg-rose-500/10 text-rose-700 border-rose-200",
  },
  CANCELLED: {
    label: "Cancelled",
    className: "bg-rose-500/10 text-rose-700 border-rose-200",
  },
};

export const milestoneStatusStyles: Record<
  MilestoneStatus,
  { className: string; label: string }
> = {
  PENDING_FUNDING: {
    label: "Pending funding",
    className: "bg-amber-500/10 text-amber-700 border-amber-200",
  },
  FUNDED: {
    label: "Funded",
    className: "bg-[#32504d]/10 text-[#32504d] border-[#32504d]/25",
  },
  IN_PROGRESS: {
    label: "In progress",
    className: "bg-[#475959]/10 text-[#475959] border-[#475959]/25",
  },
  DELIVERED: {
    label: "Delivered",
    className: "bg-[#748684]/15 text-[#475959] border-[#748684]/30",
  },
  APPROVED: {
    label: "Approved",
    className: "bg-emerald-500/10 text-emerald-700 border-emerald-200",
  },
};

// === Wallet balances (4 cards) ===
export const walletBalances = [
  {
    key: "available",
    label: "Available",
    value: 4250,
    sub: "Ready to withdraw",
    color: "#32504d",
  },
  {
    key: "pending",
    label: "Pending",
    value: 1800,
    sub: "In clearance (7 days)",
    color: "#475959",
  },
  {
    key: "processing",
    label: "Processing",
    value: 1200,
    sub: "Withdrawal in progress",
    color: "#748684",
  },
  {
    key: "withdrawn",
    label: "Withdrawn (2025)",
    value: 15900,
    sub: "Year-to-date total",
    color: "#192d2f",
  },
];

// === Wallet transactions ===
export interface WalletTxn {
  id: string;
  date: string;
  desc: string;
  project: string;
  type: "credit" | "debit";
  amount: number;
  status: WalletTxnStatus;
}

export const walletTransactions: WalletTxn[] = [
  {
    id: "t1",
    date: "Aug 17, 2025",
    desc: "Service payment — Next.js landing page",
    project: "Order #1029",
    type: "credit",
    amount: 750,
    status: "AVAILABLE",
  },
  {
    id: "t2",
    date: "Aug 15, 2025",
    desc: "Withdrawal — BIAT Bank",
    project: "W-2451",
    type: "debit",
    amount: 2000,
    status: "WITHDRAWN",
  },
  {
    id: "t3",
    date: "Aug 12, 2025",
    desc: "Milestone payment — SaaS dashboard",
    project: "Contract C-118",
    type: "credit",
    amount: 1200,
    status: "PROCESSING",
  },
  {
    id: "t4",
    date: "Aug 8, 2025",
    desc: "Service payment — Brand identity design",
    project: "Order #1015",
    type: "credit",
    amount: 600,
    status: "PENDING",
  },
  {
    id: "t5",
    date: "Aug 3, 2025",
    desc: "Withdrawal — D17 Mobile",
    project: "W-2448",
    type: "debit",
    amount: 1500,
    status: "WITHDRAWN",
  },
  {
    id: "t6",
    date: "Jul 28, 2025",
    desc: "Refund — Cancelled order #982",
    project: "Refund",
    type: "debit",
    amount: 350,
    status: "REFUNDED",
  },
];

export const txnStatusStyles: Record<WalletTxnStatus, string> = {
  PENDING: "bg-amber-500/10 text-amber-700 border-amber-200",
  AVAILABLE: "bg-emerald-500/10 text-emerald-700 border-emerald-200",
  PROCESSING: "bg-[#748684]/15 text-[#475959] border-[#748684]/30",
  WITHDRAWN: "bg-[#32504d]/10 text-[#32504d] border-[#32504d]/25",
  REFUNDED: "bg-rose-500/10 text-rose-700 border-rose-200",
  DISPUTED: "bg-rose-500/10 text-rose-700 border-rose-200",
};

// === Rating metrics ===
export const ratingMetrics = {
  overall: 4.9,
  reviewsCount: 87,
  metrics: [
    { key: "communication", label: "Communication", value: 4.9, max: 5 },
    { key: "quality", label: "Quality of work", value: 4.95, max: 5 },
    { key: "delivery", label: "On-time delivery", value: 4.8, max: 5 },
    { key: "professionalism", label: "Professionalism", value: 4.95, max: 5 },
  ],
};

// === Application status (sidebar footer) ===
export const applicationStatus = {
  status: "APPROVED" as const,
  submittedAt: "Mar 12, 2022",
  approvedAt: "Mar 14, 2022",
  reviewerNote: "Excellent portfolio. Welcome to Khidma.",
};

// === Settings: notification defaults ===
export const notificationDefaults = [
  {
    key: "email_new_proposal",
    title: "New proposals",
    description: "Email me when a client invites me to submit a proposal.",
    enabled: true,
  },
  {
    key: "email_messages",
    title: "Client messages",
    description: "Email me when a client sends me a new message.",
    enabled: true,
  },
  {
    key: "email_milestone",
    title: "Milestone updates",
    description: "Email me when a milestone is funded or released.",
    enabled: true,
  },
  {
    key: "email_marketing",
    title: "Product updates",
    description: "Occasional emails about new Khidma features.",
    enabled: false,
  },
  {
    key: "push_all",
    title: "Push notifications",
    description: "Receive push notifications on this device.",
    enabled: true,
  },
];

// === Quick actions for overview tab ===
export const quickActions = [
  {
    key: "edit-profile",
    label: "Edit Profile",
    icon: "User",
    description: "Update your bio, skills, and rates",
    target: "profile" as const,
  },
  {
    key: "add-portfolio",
    label: "Add Portfolio Item",
    icon: "Plus",
    description: "Showcase a new piece of work",
    target: "portfolio" as const,
  },
  {
    key: "create-service",
    label: "Create Service",
    icon: "Sparkles",
    description: "List a new offering for clients",
    target: "services" as const,
  },
  {
    key: "browse-jobs",
    label: "Browse Jobs",
    icon: "Search",
    description: "Find your next project",
    target: "browse" as const,
  },
];
