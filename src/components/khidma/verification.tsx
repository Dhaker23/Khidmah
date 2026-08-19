"use client";

import { cn } from "@/lib/utils";
import {
  CheckCircle2,
  Mail,
  Phone,
  ShieldCheck,
  Briefcase,
  Star,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface VerificationBadgeProps {
  type: "email" | "phone" | "identity" | "portfolio" | "topRated";
  size?: "sm" | "md";
  showLabel?: boolean;
  className?: string;
}

const config: Record<
  VerificationBadgeProps["type"],
  { label: string; icon: LucideIcon; color: string; bg: string }
> = {
  email: {
    label: "Email Verified",
    icon: Mail,
    color: "text-[#32504d]",
    bg: "bg-[#32504d]/10 border-[#32504d]/20",
  },
  phone: {
    label: "Phone Verified",
    icon: Phone,
    color: "text-[#475959]",
    bg: "bg-[#475959]/10 border-[#475959]/20",
  },
  identity: {
    label: "Identity Verified",
    icon: ShieldCheck,
    color: "text-[#2b3d3d]",
    bg: "bg-[#2b3d3d]/10 border-[#2b3d3d]/20",
  },
  portfolio: {
    label: "Portfolio Reviewed",
    icon: Briefcase,
    color: "text-[#32504d]",
    bg: "bg-[#32504d]/10 border-[#32504d]/20",
  },
  topRated: {
    label: "Top Rated",
    icon: Star,
    color: "text-amber-700",
    bg: "bg-amber-50 border-amber-200",
  },
};

export function VerificationBadge({
  type,
  size = "sm",
  showLabel = true,
  className,
}: VerificationBadgeProps) {
  const c = config[type];
  const Icon = c.icon;
  const sizes = {
    sm: "text-[10px] px-1.5 py-0.5 gap-1 [&_svg]:size-3",
    md: "text-xs px-2 py-1 gap-1.5 [&_svg]:size-3.5",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center font-medium rounded-full border",
        c.color,
        c.bg,
        sizes[size],
        className
      )}
    >
      <Icon className={c.color} />
      {showLabel && <span>{c.label}</span>}
    </span>
  );
}

export function VerificationChecklist({
  verified,
  completed,
  reviews,
  memberSince,
}: {
  verified: { email: boolean; phone: boolean; identity: boolean; portfolio: boolean };
  completed: number;
  reviews: number;
  memberSince: string;
}) {
  const items = [
    { label: "Email verified", done: verified.email },
    { label: "Phone verified", done: verified.phone },
    { label: "Identity verified", done: verified.identity },
    { label: "Portfolio reviewed", done: verified.portfolio },
    { label: `${completed} completed projects`, done: completed > 0 },
    { label: `${reviews} client reviews`, done: reviews > 0 },
    { label: `Member since ${memberSince}`, done: true },
  ];
  return (
    <ul className="space-y-2">
      {items.map((it) => (
        <li key={it.label} className="flex items-center gap-2 text-sm">
          <CheckCircle2
            className={cn(
              "size-4 shrink-0",
              it.done ? "text-[#32504d]" : "text-muted-foreground/40"
            )}
          />
          <span className={it.done ? "text-foreground" : "text-muted-foreground line-through"}>
            {it.label}
          </span>
        </li>
      ))}
    </ul>
  );
}

export function TrustBadge({
  icon: Icon,
  label,
  value,
  className,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-3 rounded-xl border border-border/60 bg-card/60 backdrop-blur-sm px-4 py-3",
        className
      )}
    >
      <div className="size-9 rounded-lg bg-[#32504d]/10 flex items-center justify-center shrink-0">
        <Icon className="size-4 text-[#32504d]" />
      </div>
      <div className="min-w-0">
        <div className="text-xs text-muted-foreground truncate">{label}</div>
        <div className="text-sm font-semibold text-foreground truncate">{value}</div>
      </div>
    </div>
  );
}
