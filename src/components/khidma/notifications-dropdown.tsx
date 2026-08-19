"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  CheckCheck,
  Trash2,
  Briefcase,
  Wallet,
  MessageSquare,
  Star,
  ShieldCheck,
  Info,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { useApp } from "@/lib/store";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

const typeConfig: Record<
  string,
  { icon: LucideIcon; color: string; bg: string }
> = {
  application: { icon: ShieldCheck, color: "text-[#32504d]", bg: "bg-[#32504d]/10" },
  proposal: { icon: Briefcase, color: "text-[#475959]", bg: "bg-[#475959]/10" },
  message: { icon: MessageSquare, color: "text-[#748684]", bg: "bg-[#748684]/10" },
  payment: { icon: Wallet, color: "text-emerald-700", bg: "bg-emerald-50" },
  review: { icon: Star, color: "text-amber-600", bg: "bg-amber-50" },
  system: { icon: Info, color: "text-[#2b3d3d]", bg: "bg-[#2b3d3d]/10" },
  job: { icon: Briefcase, color: "text-[#32504d]", bg: "bg-[#32504d]/10" },
  service: { icon: Briefcase, color: "text-[#475959]", bg: "bg-[#475959]/10" },
};

export function NotificationsDropdown() {
  const {
    notifications,
    unreadCount,
    markNotificationRead,
    markAllNotificationsRead,
    clearNotifications,
    setView,
    openMessaging,
    closeMessaging,
  } = useApp();
  const [open, setOpen] = useState(false);

  const handleNotifClick = (id: string, link?: string) => {
    markNotificationRead(id);
    if (link === "messaging") {
      setOpen(false);
      openMessaging();
    } else if (link) {
      setOpen(false);
      setView(link as never);
    }
  };

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative h-9 w-9"
          aria-label={`Notifications (${unreadCount} unread)`}
        >
          <Bell className="size-[18px]" />
          {unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 min-w-4 h-4 px-1 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-[min(92vw,400px)] p-0 max-h-[600px]"
        sideOffset={8}
      >
        <div className="flex items-center justify-between px-3 py-2.5 border-b border-border/60">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-sm">Notifications</span>
            {unreadCount > 0 && (
              <Badge variant="secondary" className="text-[10px] h-4 px-1.5 gap-0.5">
                {unreadCount} new
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-1">
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="h-7 text-[11px] text-[#32504d] hover:text-[#2b3d3d] hover:bg-[#32504d]/10"
                onClick={() => markAllNotificationsRead()}
              >
                <CheckCheck className="size-3 mr-1" />
                Mark all read
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-muted-foreground"
              onClick={() => clearNotifications()}
              aria-label="Clear all notifications"
            >
              <Trash2 className="size-3" />
            </Button>
          </div>
        </div>

        {notifications.length === 0 ? (
          <div className="py-16 px-4 text-center">
            <div className="mx-auto size-12 rounded-full bg-muted flex items-center justify-center mb-3">
              <Bell className="size-5 text-muted-foreground" />
            </div>
            <p className="text-sm font-medium text-foreground">No notifications</p>
            <p className="text-xs text-muted-foreground mt-1">
              You're all caught up. New activity will appear here.
            </p>
          </div>
        ) : (
          <ScrollArea className="h-[420px]">
            <ul className="divide-y divide-border/40">
              {notifications.map((n) => {
                const cfg = typeConfig[n.type] ?? typeConfig.system;
                const Icon = cfg.icon;
                return (
                  <li key={n.id}>
                    <button
                      onClick={() => handleNotifClick(n.id, n.link)}
                      className={cn(
                        "w-full flex items-start gap-3 px-3 py-3 text-left hover:bg-muted/60 transition-colors",
                        !n.read && "bg-[#32504d]/[0.04]"
                      )}
                    >
                      <div
                        className={cn(
                          "size-8 rounded-lg flex items-center justify-center shrink-0",
                          cfg.bg
                        )}
                      >
                        <Icon className={cn("size-4", cfg.color)} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-sm font-medium leading-tight">
                            {n.title}
                            {!n.read && (
                              <span className="ml-1.5 inline-block size-1.5 rounded-full bg-rose-500 align-middle" />
                            )}
                          </p>
                          <span className="text-[10px] text-muted-foreground whitespace-nowrap shrink-0">
                            {n.time}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-2 mt-1">
                          {n.body}
                        </p>
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          </ScrollArea>
        )}

        <DropdownMenuSeparator className="my-0" />
        <div className="px-3 py-2 flex items-center justify-between text-[11px]">
          <span className="text-muted-foreground">
            {notifications.length} {notifications.length === 1 ? "notification" : "notifications"}
          </span>
          <button
            onClick={() => {
              setOpen(false);
              setView("dashboard");
            }}
            className="text-[#32504d] hover:text-[#2b3d3d] font-medium"
          >
            View all activity →
          </button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
