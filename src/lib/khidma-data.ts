// Khidma — Mock data for the marketplace demo
// All data here is for visual demonstration of the platform's capabilities.
// In production, these would come from the database via API routes.

import {
  Code2,
  Palette,
  Video,
  Music,
  PenTool,
  Languages,
  Megaphone,
  Camera,
  Box,
  Building2,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

export type AccountType = "FREELANCER" | "CLIENT";
export type VerificationLevel =
  | "UNVERIFIED"
  | "EMAIL_VERIFIED"
  | "PHONE_VERIFIED"
  | "IDENTITY_VERIFIED"
  | "PORTFOLIO_REVIEWED"
  | "ADMIN_VERIFIED";

export type ApplicationStatus =
  | "DRAFT"
  | "SUBMITTED"
  | "UNDER_REVIEW"
  | "MORE_INFORMATION_REQUIRED"
  | "APPROVED"
  | "REJECTED"
  | "SUSPENDED"
  | "REVOKED";

export type ContractStatus =
  | "DRAFT"
  | "PENDING_FUNDING"
  | "FUNDED"
  | "IN_PROGRESS"
  | "DELIVERED"
  | "APPROVED"
  | "COMPLETED"
  | "DISPUTED"
  | "CANCELLED";

export type WalletTxnStatus =
  | "PENDING"
  | "AVAILABLE"
  | "PROCESSING"
  | "WITHDRAWN"
  | "REFUNDED"
  | "DISPUTED";

export type ServiceStatus = "DRAFT" | "PENDING_REVIEW" | "PUBLISHED" | "REJECTED" | "SUSPENDED";

export type JobStatus = "DRAFT" | "OPEN" | "CLOSED" | "AWARDED" | "COMPLETED" | "CANCELLED";

export interface Category {
  id: string;
  name: string;
  nameAr: string;
  icon: LucideIcon;
  color: string;
  count: number;
  skills: string[];
}

export interface Skill {
  id: string;
  name: string;
  categoryId: string;
}

export interface Freelancer {
  id: string;
  name: string;
  username: string;
  title: string;
  avatar: string;
  location: { city: string; country: string };
  rating: number;
  reviewsCount: number;
  completedProjects: number;
  hourlyRate: number;
  responseTime: string;
  languages: string[];
  skills: string[];
  bio: string;
  verified: {
    email: boolean;
    phone: boolean;
    identity: boolean;
    portfolio: boolean;
  };
  badges: string[];
  availability: "available" | "limited" | "booked";
  memberSince: string;
  portfolio: PortfolioItem[];
  services: Service[];
  topRated: boolean;
  featured: boolean;
}

export interface PortfolioItem {
  id: string;
  title: string;
  category: string;
  cover: string;
  type: "image" | "video" | "audio" | "url" | "github";
  description: string;
  skills: string[];
  role: string;
  verification: "UNVERIFIED" | "SELF_DECLARED" | "ADMIN_VERIFIED" | "EXTERNALLY_VERIFIED";
  visibility: "PUBLIC" | "PRIVATE" | "UNLISTED";
  results?: string;
  liveUrl?: string;
  repoUrl?: string;
}

export interface Service {
  id: string;
  freelancerId: string;
  title: string;
  description: string;
  cover: string;
  category: string;
  skills: string[];
  startingPrice: number;
  deliveryDays: number;
  revisions: number;
  rating: number;
  ordersCount: number;
  packages: {
    basic: { name: string; price: number; deliveryDays: number; revisions: number; features: string[] };
    standard: { name: string; price: number; deliveryDays: number; revisions: number; features: string[] };
    premium: { name: string; price: number; deliveryDays: number; revisions: number; features: string[] };
  };
}

export interface Job {
  id: string;
  title: string;
  description: string;
  category: string;
  budget: { min: number; max: number };
  type: "FIXED" | "HOURLY";
  duration: string;
  postedBy: string;
  postedAt: string;
  proposals: number;
  skills: string[];
  experienceLevel: "Entry" | "Intermediate" | "Expert";
  location: "Tunisia" | "Worldwide" | "Remote";
  verifiedClient: boolean;
}

export interface Review {
  id: string;
  fromName: string;
  fromAvatar: string;
  rating: number;
  metrics: { communication: number; quality: number; delivery: number; professionalism: number };
  comment: string;
  date: string;
  project: string;
}

// === CATEGORIES ===
export const categories: Category[] = [
  {
    id: "development",
    name: "Development",
    nameAr: "تطوير",
    icon: Code2,
    color: "#2b3d3d",
    count: 1248,
    skills: ["Next.js", "React", "TypeScript", "Node.js", "Python", "Django", "PHP", "Laravel", "Mobile App"],
  },
  {
    id: "design",
    name: "Design",
    nameAr: "تصميم",
    icon: Palette,
    color: "#32504d",
    count: 892,
    skills: ["UI Design", "UX Design", "Figma", "Photoshop", "Illustrator", "Brand Identity"],
  },
  {
    id: "video",
    name: "Video",
    nameAr: "فيديو",
    icon: Video,
    color: "#475959",
    count: 412,
    skills: ["Video Editing", "After Effects", "Premiere Pro", "Motion Graphics", "Reels"],
  },
  {
    id: "audio",
    name: "Audio",
    nameAr: "صوت",
    icon: Music,
    color: "#6e8580",
    count: 198,
    skills: ["Voice Over", "Sound Design", "Music Production", "Podcast Editing", "Audio Mastering"],
  },
  {
    id: "writing",
    name: "Writing",
    nameAr: "كتابة",
    icon: PenTool,
    color: "#748684",
    count: 547,
    skills: ["Copywriting", "Articles", "Blog Posts", "Product Descriptions", "Scriptwriting"],
  },
  {
    id: "translation",
    name: "Translation",
    nameAr: "ترجمة",
    icon: Languages,
    color: "#192d2f",
    count: 286,
    skills: ["Arabic Translation", "French Translation", "English Translation", "Subtitling"],
  },
  {
    id: "marketing",
    name: "Marketing",
    nameAr: "تسويق",
    icon: Megaphone,
    color: "#32504d",
    count: 364,
    skills: ["SEO", "Google Ads", "Social Media", "Email Marketing", "Content Strategy"],
  },
  {
    id: "photography",
    name: "Photography",
    nameAr: "تصوير",
    icon: Camera,
    color: "#475959",
    count: 156,
    skills: ["Product Photography", "Portrait", "Commercial", "Event Photography"],
  },
  {
    id: "3d",
    name: "3D & Architecture",
    nameAr: "ثري دي",
    icon: Box,
    color: "#2b3d3d",
    count: 124,
    skills: ["3D Models", "Product Renders", "Architecture Visualization", "3D Animation"],
  },
  {
    id: "business",
    name: "Business",
    nameAr: "أعمال",
    icon: Building2,
    color: "#6e8580",
    count: 213,
    skills: ["Business Plans", "Market Research", "Financial Modeling", "Consulting"],
  },
  {
    id: "ai",
    name: "AI",
    nameAr: "ذكاء اصطناعي",
    icon: Sparkles,
    color: "#32504d",
    count: 87,
    skills: ["Machine Learning", "LLM Integration", "Computer Vision", "AI Automation"],
  },
];

// === AVATARS (using DiceBear / UI avatars URLs for demo) ===
const avatarSeed = (s: string) =>
  `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(s)}&backgroundColor=2b3d3d,32504d,475959,6e8580&radius=50`;

const coverSeed = (s: string, w = 600, h = 400) =>
  `https://picsum.photos/seed/${encodeURIComponent(s)}/${w}/${h}`;

// === FREELANCERS ===
export const freelancers: Freelancer[] = [
  {
    id: "f1",
    name: "Amira Ben Salah",
    username: "@amira.codes",
    title: "Full-Stack Web Developer",
    avatar: avatarSeed("Amira Ben Salah"),
    location: { city: "Tunis", country: "Tunisia" },
    rating: 4.9,
    reviewsCount: 87,
    completedProjects: 142,
    hourlyRate: 45,
    responseTime: "~1 hour",
    languages: ["Arabic", "French", "English"],
    skills: ["Next.js", "React", "TypeScript", "Node.js", "Prisma", "Tailwind CSS"],
    bio: "Senior full-stack engineer specializing in production Next.js applications. 7+ years building SaaS platforms, e-commerce, and admin dashboards. Focused on performance, accessibility, and clean architecture.",
    verified: { email: true, phone: true, identity: true, portfolio: true },
    badges: ["Top Rated", "Identity Verified", "Portfolio Reviewed"],
    availability: "available",
    memberSince: "2022",
    topRated: true,
    featured: true,
    portfolio: [
      {
        id: "p1",
        title: "Luxury Real Estate Landing Page",
        category: "Web Development",
        cover: coverSeed("real-estate"),
        type: "image",
        description:
          "Premium responsive landing page for a Tunisian luxury real estate developer. Featured animated hero, interactive 3D property tours, and lead capture forms.",
        skills: ["Next.js", "GSAP", "Three.js", "Tailwind"],
        role: "Frontend Developer",
        verification: "ADMIN_VERIFIED",
        visibility: "PUBLIC",
        results: "320% increase in qualified leads in 60 days",
        liveUrl: "https://example.com",
      },
      {
        id: "p2",
        title: "SaaS Analytics Dashboard",
        category: "Web Development",
        cover: coverSeed("saas-dashboard"),
        type: "image",
        description:
          "Multi-tenant SaaS dashboard with real-time charts, role-based access, and Stripe billing integration.",
        skills: ["Next.js", "TypeScript", "Recharts", "Prisma"],
        role: "Lead Engineer",
        verification: "ADMIN_VERIFIED",
        visibility: "PUBLIC",
        liveUrl: "https://example.com",
      },
      {
        id: "p3",
        title: "E-commerce Marketplace — Crafts of Tunisia",
        category: "Web Development",
        cover: coverSeed("ecommerce-crafts"),
        type: "image",
        description:
          "Two-sided marketplace connecting Tunisian artisans with international buyers. Includes escrow payments and multi-currency support.",
        skills: ["Next.js", "Stripe", "PostgreSQL", "Tailwind"],
        role: "Full-Stack Developer",
        verification: "EXTERNALLY_VERIFIED",
        visibility: "PUBLIC",
        repoUrl: "https://github.com/example",
      },
    ],
    services: [
      {
        id: "s1",
        freelancerId: "f1",
        title: "I will build a professional Next.js landing page",
        description:
          "Premium responsive landing page with animations, SEO optimization, and lead capture. Trusted by 80+ clients.",
        cover: "/services/nextjs-landing.png",
        category: "Web Development",
        skills: ["Next.js", "Tailwind", "GSAP"],
        startingPrice: 350,
        deliveryDays: 5,
        revisions: 3,
        rating: 4.9,
        ordersCount: 142,
        packages: {
          basic: { name: "Basic", price: 350, deliveryDays: 5, revisions: 2, features: ["1 page", "Responsive", "Contact form", "2 revisions"] },
          standard: { name: "Standard", price: 750, deliveryDays: 7, revisions: 4, features: ["3 pages", "Animations", "SEO basics", "Lead capture", "4 revisions"] },
          premium: { name: "Premium", price: 1500, deliveryDays: 14, revisions: 6, features: ["Up to 7 pages", "Premium animations", "Full SEO", "CMS integration", "1 month support", "6 revisions"] },
        },
      },
      {
        id: "s2",
        freelancerId: "f1",
        title: "I will develop a complete SaaS dashboard",
        description:
          "Multi-tenant admin dashboard with auth, role-based access, real-time charts, and API integrations.",
        cover: "/services/saas-dashboard.png",
        category: "Web Development",
        skills: ["Next.js", "Prisma", "TypeScript", "Recharts"],
        startingPrice: 1200,
        deliveryDays: 14,
        revisions: 5,
        rating: 5.0,
        ordersCount: 38,
        packages: {
          basic: { name: "Basic", price: 1200, deliveryDays: 14, revisions: 3, features: ["Auth", "5 dashboard pages", "Charts", "3 revisions"] },
          standard: { name: "Standard", price: 2500, deliveryDays: 21, revisions: 5, features: ["Auth + RBAC", "10 dashboard pages", "Real-time data", "API integration", "5 revisions"] },
          premium: { name: "Premium", price: 4500, deliveryDays: 30, revisions: 8, features: ["Full RBAC", "Unlimited pages", "Real-time + WebSockets", "Stripe billing", "3 months support", "8 revisions"] },
        },
      },
    ],
  },
  {
    id: "f2",
    name: "Yassine Gharbi",
    username: "@yassine.design",
    title: "UI/UX Designer & Brand Identity",
    avatar: avatarSeed("Yassine Gharbi"),
    location: { city: "Sfax", country: "Tunisia" },
    rating: 5.0,
    reviewsCount: 124,
    completedProjects: 203,
    hourlyRate: 38,
    responseTime: "~2 hours",
    languages: ["Arabic", "French", "English"],
    skills: ["UI Design", "UX Design", "Figma", "Brand Identity", "Design Systems", "Prototype"],
    bio: "Product designer focused on clean, conversion-driven interfaces. Built design systems for fintech, healthcare, and SaaS startups across MENA and Europe.",
    verified: { email: true, phone: true, identity: true, portfolio: true },
    badges: ["Top Rated", "Identity Verified", "Portfolio Reviewed"],
    availability: "limited",
    memberSince: "2021",
    topRated: true,
    featured: true,
    portfolio: [
      {
        id: "p4",
        title: "Fintech Mobile App — Design System",
        category: "UI/UX Design",
        cover: coverSeed("fintech-ui"),
        type: "image",
        description:
          "Complete design system for a Tunisian fintech app including 80+ components, dark mode, and accessibility guidelines.",
        skills: ["Figma", "Design System", "Mobile UI"],
        role: "Lead Designer",
        verification: "ADMIN_VERIFIED",
        visibility: "PUBLIC",
        results: "Reduced design-to-dev time by 60%",
      },
      {
        id: "p5",
        title: "Brand Identity — Café Restaurant",
        category: "Brand Identity",
        cover: coverSeed("brand-cafe"),
        type: "image",
        description:
          "End-to-end brand identity including logo, typography, packaging, and social media templates.",
        skills: ["Illustrator", "Photoshop", "Branding"],
        role: "Brand Designer",
        verification: "ADMIN_VERIFIED",
        visibility: "PUBLIC",
      },
    ],
    services: [
      {
        id: "s3",
        freelancerId: "f2",
        title: "I will design a modern UI for your web or mobile app",
        description:
          "Pixel-perfect, modern UI design in Figma. Includes design system, components, and developer handoff.",
        cover: "/services/ui-design.png",
        category: "UI/UX Design",
        skills: ["Figma", "UI Design", "Design System"],
        startingPrice: 250,
        deliveryDays: 5,
        revisions: 3,
        rating: 5.0,
        ordersCount: 203,
        packages: {
          basic: { name: "Basic", price: 250, deliveryDays: 5, revisions: 2, features: ["3 screens", "Mobile", "Source file", "2 revisions"] },
          standard: { name: "Standard", price: 600, deliveryDays: 8, revisions: 4, features: ["8 screens", "Mobile + Web", "Design system", "Prototype", "4 revisions"] },
          premium: { name: "Premium", price: 1200, deliveryDays: 14, revisions: 6, features: ["Unlimited screens", "Full design system", "Interactive prototype", "Dev handoff", "1 month support", "6 revisions"] },
        },
      },
    ],
  },
  {
    id: "f3",
    name: "Syrine Mansri",
    username: "@syrine.motion",
    title: "Motion Designer & Video Editor",
    avatar: avatarSeed("Syrine Mansri"),
    location: { city: "Sousse", country: "Tunisia" },
    rating: 4.8,
    reviewsCount: 64,
    completedProjects: 91,
    hourlyRate: 35,
    responseTime: "~3 hours",
    languages: ["Arabic", "French", "English"],
    skills: ["After Effects", "Premiere Pro", "Motion Graphics", "Video Editing", "Reels"],
    bio: "Motion designer specializing in brand animations, social media reels, and explainer videos. Worked with 30+ Tunisian and European brands.",
    verified: { email: true, phone: true, identity: true, portfolio: true },
    badges: ["Portfolio Reviewed", "Identity Verified"],
    availability: "available",
    memberSince: "2023",
    topRated: false,
    featured: true,
    portfolio: [
      {
        id: "p6",
        title: "Brand Animation Reel — 5 Brands",
        category: "Motion Graphics",
        cover: coverSeed("motion-reel"),
        type: "video",
        description:
          "Collection of brand animation intros and logos stings for 5 different companies across industries.",
        skills: ["After Effects", "Motion Graphics"],
        role: "Motion Designer",
        verification: "ADMIN_VERIFIED",
        visibility: "PUBLIC",
      },
    ],
    services: [
      {
        id: "s4",
        freelancerId: "f3",
        title: "I will create professional motion graphics for your brand",
        description:
          "Animated logos, social media reels, and explainer videos that capture attention and elevate your brand.",
        cover: "/services/motion-graphics.png",
        category: "Motion Graphics",
        skills: ["After Effects", "Motion Graphics", "Video Editing"],
        startingPrice: 180,
        deliveryDays: 4,
        revisions: 3,
        rating: 4.8,
        ordersCount: 91,
        packages: {
          basic: { name: "Basic", price: 180, deliveryDays: 4, revisions: 2, features: ["15s video", "1080p", "2 revisions", "1 format"] },
          standard: { name: "Standard", price: 420, deliveryDays: 6, revisions: 3, features: ["30s video", "1080p + vertical", "Voice over", "3 revisions"] },
          premium: { name: "Premium", price: 850, deliveryDays: 10, revisions: 5, features: ["60s video", "4K + all formats", "Pro voice over", "Custom illustration", "5 revisions"] },
        },
      },
    ],
  },
  {
    id: "f4",
    name: "Mehdi Trabelsi",
    username: "@mehdi.voice",
    title: "Voice Over Artist & Sound Designer",
    avatar: avatarSeed("Mehdi Trabelsi"),
    location: { city: "Tunis", country: "Tunisia" },
    rating: 4.9,
    reviewsCount: 51,
    completedProjects: 78,
    hourlyRate: 50,
    responseTime: "~1 hour",
    languages: ["Arabic", "French", "English"],
    skills: ["Voice Over", "Sound Design", "Podcast Editing", "Audio Mastering"],
    bio: "Professional voice over artist for Arabic and French content. Worked with radio, audiobooks, ads, and corporate videos.",
    verified: { email: true, phone: true, identity: true, portfolio: true },
    badges: ["Identity Verified", "Portfolio Reviewed"],
    availability: "available",
    memberSince: "2022",
    topRated: false,
    featured: false,
    portfolio: [
      {
        id: "p7",
        title: "Arabic Audiobook Sample",
        category: "Voice Over",
        cover: coverSeed("audiobook"),
        type: "audio",
        description: "Sample chapter from a published Arabic audiobook narration.",
        skills: ["Voice Over", "Arabic"],
        role: "Narrator",
        verification: "ADMIN_VERIFIED",
        visibility: "PUBLIC",
      },
    ],
    services: [
      {
        id: "s5",
        freelancerId: "f4",
        title: "I will record a professional Arabic or French voice over",
        description:
          "Studio-quality voice over for ads, videos, audiobooks, and corporate content. Arabic and French native.",
        cover: "/services/voice-over.png",
        category: "Voice Over",
        skills: ["Voice Over", "Arabic", "French"],
        startingPrice: 80,
        deliveryDays: 2,
        revisions: 2,
        rating: 4.9,
        ordersCount: 78,
        packages: {
          basic: { name: "Basic", price: 80, deliveryDays: 2, revisions: 1, features: ["Up to 100 words", "MP3", "1 revision"] },
          standard: { name: "Standard", price: 200, deliveryDays: 3, revisions: 2, features: ["Up to 400 words", "WAV + MP3", "Commercial rights", "2 revisions"] },
          premium: { name: "Premium", price: 450, deliveryDays: 5, revisions: 3, features: ["Up to 1000 words", "WAV + MP3", "Full rights", "Background music", "3 revisions"] },
        },
      },
    ],
  },
  {
    id: "f5",
    name: "Rania Khelifi",
    username: "@rania.copy",
    title: "Copywriter & Content Strategist",
    avatar: avatarSeed("Rania Khelifi"),
    location: { city: "Nabeul", country: "Tunisia" },
    rating: 4.7,
    reviewsCount: 38,
    completedProjects: 56,
    hourlyRate: 30,
    responseTime: "~4 hours",
    languages: ["Arabic", "French", "English"],
    skills: ["Copywriting", "SEO Writing", "Blog Posts", "Product Descriptions", "Scriptwriting"],
    bio: "Bilingual copywriter creating conversion-focused content for SaaS, e-commerce, and education brands. Specializes in MENA market positioning.",
    verified: { email: true, phone: true, identity: false, portfolio: true },
    badges: ["Email Verified", "Portfolio Reviewed"],
    availability: "available",
    memberSince: "2023",
    topRated: false,
    featured: false,
    portfolio: [
      {
        id: "p8",
        title: "SaaS Landing Page Copy — Series",
        category: "Copywriting",
        cover: coverSeed("copywriting"),
        type: "url",
        description: "Series of high-converting landing pages written for a B2B SaaS company.",
        skills: ["Copywriting", "Conversion"],
        role: "Copywriter",
        verification: "SELF_DECLARED",
        visibility: "PUBLIC",
        results: "27% average conversion rate",
        liveUrl: "https://example.com",
      },
    ],
    services: [
      {
        id: "s6",
        freelancerId: "f5",
        title: "I will write SEO-optimized blog articles in Arabic, French, or English",
        description:
          "High-quality, research-backed articles optimized for search engines and reader engagement.",
        cover: "/services/seo-writing.png",
        category: "Writing",
        skills: ["Copywriting", "SEO", "Blog"],
        startingPrice: 60,
        deliveryDays: 3,
        revisions: 2,
        rating: 4.7,
        ordersCount: 56,
        packages: {
          basic: { name: "Basic", price: 60, deliveryDays: 3, revisions: 1, features: ["500 words", "SEO basic", "1 revision"] },
          standard: { name: "Standard", price: 140, deliveryDays: 5, revisions: 2, features: ["1500 words", "Full SEO", "Images", "2 revisions"] },
          premium: { name: "Premium", price: 320, deliveryDays: 7, revisions: 3, features: ["3000 words", "Full SEO", "Images + meta", "Topic cluster", "3 revisions"] },
        },
      },
    ],
  },
  {
    id: "f6",
    name: "Omar Jlassi",
    username: "@omar.3d",
    title: "3D Artist & Product Renderer",
    avatar: avatarSeed("Omar Jlassi"),
    location: { city: "Monastir", country: "Tunisia" },
    rating: 4.9,
    reviewsCount: 42,
    completedProjects: 68,
    hourlyRate: 55,
    responseTime: "~2 hours",
    languages: ["Arabic", "French", "English"],
    skills: ["Blender", "3D Modeling", "Product Renders", "Architecture Visualization", "3D Animation"],
    bio: "3D artist creating photorealistic product renders and architectural visualizations for e-commerce, real estate, and advertising.",
    verified: { email: true, phone: true, identity: true, portfolio: true },
    badges: ["Top Rated", "Identity Verified", "Portfolio Reviewed"],
    availability: "limited",
    memberSince: "2022",
    topRated: true,
    featured: false,
    portfolio: [
      {
        id: "p9",
        title: "Product Render Series — Cosmetics Brand",
        category: "3D Art",
        cover: coverSeed("3d-cosmetics"),
        type: "image",
        description: "12 photorealistic product renders for a Tunisian cosmetics brand's e-commerce store.",
        skills: ["Blender", "3D Rendering"],
        role: "3D Artist",
        verification: "ADMIN_VERIFIED",
        visibility: "PUBLIC",
        results: "18% increase in product page conversion",
      },
    ],
    services: [
      {
        id: "s7",
        freelancerId: "f6",
        title: "I will create photorealistic 3D product renders",
        description:
          "Studio-quality 3D renders for your products, packaging, or architectural projects.",
        cover: coverSeed("3d-service"),
        category: "3D Art",
        skills: ["Blender", "3D Modeling", "3D Rendering"],
        startingPrice: 90,
        deliveryDays: 3,
        revisions: 3,
        rating: 4.9,
        ordersCount: 68,
        packages: {
          basic: { name: "Basic", price: 90, deliveryDays: 3, revisions: 2, features: ["1 product", "2 angles", "1080p", "2 revisions"] },
          standard: { name: "Standard", price: 220, deliveryDays: 5, revisions: 3, features: ["3 products", "5 angles", "4K", "Background scene", "3 revisions"] },
          premium: { name: "Premium", price: 500, deliveryDays: 8, revisions: 5, features: ["Up to 8 products", "Unlimited angles", "4K + PSD", "Custom scene", "Animation", "5 revisions"] },
        },
      },
    ],
  },
];

// === JOBS ===
export const jobs: Job[] = [
  {
    id: "j1",
    title: "Build a Next.js SaaS landing page with animations",
    description:
      "We're a Tunisian fintech startup looking for an experienced Next.js developer to build a high-converting landing page. Must include GSAP animations, SEO optimization, and lead capture. Brand assets ready in Figma.",
    category: "Web Development",
    budget: { min: 800, max: 1500 },
    type: "FIXED",
    duration: "1-2 weeks",
    postedBy: "Cassurea Technologies",
    postedAt: "2 hours ago",
    proposals: 12,
    skills: ["Next.js", "TypeScript", "GSAP", "Tailwind CSS"],
    experienceLevel: "Expert",
    location: "Worldwide",
    verifiedClient: true,
  },
  {
    id: "j2",
    title: "Design a complete brand identity for a coffee shop",
    description:
      "Need a designer to create a brand identity including logo, color palette, typography, packaging, and social media templates. Tunisian coffee shop launching in 2 months.",
    category: "Brand Identity",
    budget: { min: 600, max: 1200 },
    type: "FIXED",
    duration: "2-3 weeks",
    postedBy: "Café El Manara",
    postedAt: "5 hours ago",
    proposals: 8,
    skills: ["Brand Identity", "Illustrator", "Photoshop", "Logo Design"],
    experienceLevel: "Intermediate",
    location: "Tunisia",
    verifiedClient: true,
  },
  {
    id: "j3",
    title: "Voice over for 10-episode Arabic podcast series",
    description:
      "Looking for a male or female Arabic voice over artist for a 10-episode business podcast. Each episode ~30 minutes. Must deliver clean, mastered audio files.",
    category: "Voice Over",
    budget: { min: 400, max: 800 },
    type: "FIXED",
    duration: "1 month",
    postedBy: "Sahla Media",
    postedAt: "1 day ago",
    proposals: 15,
    skills: ["Voice Over", "Arabic", "Podcast", "Audio Mastering"],
    experienceLevel: "Intermediate",
    location: "Remote",
    verifiedClient: true,
  },
  {
    id: "j4",
    title: "SEO-optimized blog content for a SaaS company (ongoing)",
    description:
      "Long-term partnership for monthly blog content (4 articles/month, 1500 words each). Topics around dev tools, productivity, and software development.",
    category: "Writing",
    budget: { min: 25, max: 40 },
    type: "HOURLY",
    duration: "Ongoing",
    postedBy: "DevTool Hub",
    postedAt: "2 days ago",
    proposals: 22,
    skills: ["Copywriting", "SEO", "Technical Writing"],
    experienceLevel: "Intermediate",
    location: "Worldwide",
    verifiedClient: true,
  },
  {
    id: "j5",
    title: "3D product renders for cosmetics e-commerce (12 SKUs)",
    description:
      "Need photorealistic 3D renders for 12 cosmetic products. Multiple angles + 1 lifestyle scene per product. Source files required.",
    category: "3D Art",
    budget: { min: 700, max: 1400 },
    type: "FIXED",
    duration: "2 weeks",
    postedBy: "Nour Cosmetics",
    postedAt: "3 days ago",
    proposals: 9,
    skills: ["Blender", "3D Modeling", "3D Rendering"],
    experienceLevel: "Expert",
    location: "Tunisia",
    verifiedClient: true,
  },
  {
    id: "j6",
    title: "Motion graphics for 5 social media reels",
    description:
      "Need 5 short animated reels (15-30s each) promoting our new app launch. Style: modern, energetic, with kinetic typography.",
    category: "Motion Graphics",
    budget: { min: 350, max: 700 },
    type: "FIXED",
    duration: "1 week",
    postedBy: "Fitflex App",
    postedAt: "3 days ago",
    proposals: 6,
    skills: ["After Effects", "Motion Graphics", "Reels"],
    experienceLevel: "Intermediate",
    location: "Worldwide",
    verifiedClient: false,
  },
];

// === REVIEWS ===
export const reviews: Review[] = [
  {
    id: "r1",
    fromName: "Sarah Chen",
    fromAvatar: avatarSeed("Sarah Chen"),
    rating: 5,
    metrics: { communication: 5, quality: 5, delivery: 5, professionalism: 5 },
    comment:
      "Amira delivered an exceptional landing page. Communication was flawless, and the final result exceeded our expectations. Will definitely hire again.",
    date: "2 weeks ago",
    project: "SaaS Landing Page Redesign",
  },
  {
    id: "r2",
    fromName: "Karim Bouazizi",
    fromAvatar: avatarSeed("Karim Bouazizi"),
    rating: 5,
    metrics: { communication: 5, quality: 5, delivery: 4, professionalism: 5 },
    comment:
      "Outstanding work on our dashboard. Clean code, great attention to detail, and very responsive to feedback throughout the project.",
    date: "1 month ago",
    project: "Multi-tenant Admin Dashboard",
  },
  {
    id: "r3",
    fromName: "Lina Haddad",
    fromAvatar: avatarSeed("Lina Haddad"),
    rating: 5,
    metrics: { communication: 5, quality: 5, delivery: 5, professionalism: 5 },
    comment:
      "Working with Yassine was a pleasure. He understood our brand perfectly and delivered a design system that our team still uses today.",
    date: "1 month ago",
    project: "Fintech Mobile App Design",
  },
  {
    id: "r4",
    fromName: "Daniel Fischer",
    fromAvatar: avatarSeed("Daniel Fischer"),
    rating: 4,
    metrics: { communication: 4, quality: 5, delivery: 4, professionalism: 5 },
    comment:
      "Great motion graphics work. Took a bit longer than expected but the final videos were excellent quality.",
    date: "2 months ago",
    project: "Brand Animation Reel",
  },
];

// === HELPER FUNCTIONS ===
export const formatTND = (amount: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "TND",
    maximumFractionDigits: 0,
  }).format(amount);

export const formatNumber = (n: number) =>
  new Intl.NumberFormat("en-US").format(n);

export const getFreelancerById = (id: string) => freelancers.find((f) => f.id === id);
export const getServicesByFreelancer = (freelancerId: string) =>
  freelancers.find((f) => f.id === freelancerId)?.services ?? [];
export const getAllServices = () => freelancers.flatMap((f) => f.services);

// === TRUST STATS ===
export const trustStats = {
  verifiedFreelancers: 1248,
  completedProjects: 8420,
  totalPaidOut: 1240000,
  avgRating: 4.9,
  cities: 24,
  countries: 41,
};

// === PAYMENT METHODS ===
export const withdrawalMethods = [
  { id: "biat", name: "BIAT Bank Transfer", type: "Bank", fee: "1%", time: "1-2 business days", logo: "🏦" },
  { id: "tijari", name: "TIJARI Bank Transfer", type: "Bank", fee: "1%", time: "1-2 business days", logo: "🏦" },
  { id: "zitouna", name: "Zitouna Bank", type: "Bank", fee: "1%", time: "1-2 business days", logo: "🏦" },
  { id: "post", name: "Tunisian Post", type: "Local", fee: "0.5%", time: "2-3 business days", logo: "📮" },
  { id: "d17", name: "D17 Mobile", type: "Local", fee: "0.5%", time: "Instant", logo: "📱" },
  { id: "intl", name: "International Bank Transfer", type: "International", fee: "2%", time: "3-5 business days", logo: "🌍" },
  { id: "wu", name: "Western Union", type: "International", fee: "2.5%", time: "1-3 business days", logo: "💸" },
];
