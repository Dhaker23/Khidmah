"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Menu,
  X,
  Bell,
  MessageSquare,
  ChevronDown,
  LayoutDashboard,
  Shield,
  LogOut,
  Wallet,
  Sparkles,
  Briefcase,
  Users,
  ShoppingBag,
  HelpCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { KhidmaLogo } from "./logo";
import { useApp } from "@/lib/store";
import { cn } from "@/lib/utils";

const navItems = [
  { id: "freelancers", label: "Find Talent", icon: Users },
  { id: "jobs", label: "Find Work", icon: Briefcase },
  { id: "services", label: "Services", icon: ShoppingBag },
  { id: "how-it-works", label: "How It Works", icon: HelpCircle },
] as const;

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const {
    view,
    setView,
    openAuth,
    currentUser,
    login,
    logout,
    setSearchQuery,
    openOnboarding,
  } = useApp();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        scrolled
          ? "bg-background/85 backdrop-blur-xl border-b border-border/60 shadow-sm"
          : "bg-transparent"
      )}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <button
            onClick={() => setView("home")}
            className="flex items-center gap-2 transition-opacity hover:opacity-90"
            aria-label="Khidma home"
          >
            <KhidmaLogo variant="full" size="sm" />
          </button>

          {/* Desktop Nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = view === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setView(item.id as never)}
                  className={cn(
                    "relative inline-flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    active
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                  )}
                >
                  <Icon className="size-3.5" />
                  {item.label}
                  {active && (
                    <motion.div
                      layoutId="nav-underline"
                      className="absolute inset-x-2 -bottom-px h-0.5 bg-[#32504d] rounded-full"
                    />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Search (desktop) */}
          <div className="hidden md:flex flex-1 max-w-md mx-2">
            <div className="relative w-full group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
              <Input
                placeholder="Search freelancers, services, skills…"
                className="pl-9 pr-3 h-10 bg-muted/40 border-border/60 focus-visible:bg-background focus-visible:border-[#32504d]/40 transition-all"
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setView("freelancers")}
              />
              <kbd className="hidden lg:inline-flex absolute right-2 top-1/2 -translate-y-1/2 h-6 select-none items-center gap-1 rounded border bg-muted/60 px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
                ⌘K
              </kbd>
            </div>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-1.5">
            {currentUser ? (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="hidden md:inline-flex relative"
                  aria-label="Messages"
                >
                  <MessageSquare className="size-[18px]" />
                  <span className="absolute top-1 right-1 size-2 rounded-full bg-[#32504d]" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="hidden md:inline-flex relative"
                  aria-label="Notifications"
                >
                  <Bell className="size-[18px]" />
                  <span className="absolute top-1 right-1 size-2 rounded-full bg-amber-500" />
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="inline-flex items-center gap-2 rounded-full pl-1.5 pr-2 py-1 hover:bg-muted/60 transition-colors">
                      <Avatar className="size-8 border border-border/60">
                        <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
                        <AvatarFallback>
                          {currentUser.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <ChevronDown className="size-3.5 text-muted-foreground" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col">
                        <span className="font-medium">{currentUser.name}</span>
                        <span className="text-xs text-muted-foreground capitalize">
                          {currentUser.type}
                        </span>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setView("dashboard")}>
                      <LayoutDashboard className="mr-2 size-4" />
                      Dashboard
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Wallet className="mr-2 size-4" />
                      Wallet
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setView("admin")}>
                      <Shield className="mr-2 size-4" />
                      Admin Review
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      onClick={() => {
                        logout();
                        setView("home");
                      }}
                    >
                      <LogOut className="mr-2 size-4" />
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => openAuth("login")}
                  className="hidden sm:inline-flex"
                >
                  Log in
                </Button>
                <Button
                  size="sm"
                  onClick={() => openAuth("register")}
                  className="hidden sm:inline-flex bg-[#2b3d3d] hover:bg-[#192d2f] text-white"
                >
                  Join Khidma
                </Button>
              </>
            )}

            {/* Mobile menu */}
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
                  <Menu className="size-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full max-w-xs p-0">
                <SheetHeader className="border-b border-border/60 p-4">
                  <SheetTitle className="flex items-center justify-between">
                    <KhidmaLogo variant="full" size="sm" />
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setMobileOpen(false)}
                    >
                      <X className="size-4" />
                    </Button>
                  </SheetTitle>
                </SheetHeader>
                <div className="p-4 space-y-1">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          setView(item.id as never);
                          setMobileOpen(false);
                        }}
                        className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-muted"
                      >
                        <Icon className="size-4 text-muted-foreground" />
                        {item.label}
                      </button>
                    );
                  })}
                  <div className="pt-4 mt-4 border-t border-border/60 space-y-2">
                    {!currentUser ? (
                      <>
                        <Button
                          variant="outline"
                          className="w-full"
                          onClick={() => {
                            openAuth("login");
                            setMobileOpen(false);
                          }}
                        >
                          Log in
                        </Button>
                        <Button
                          className="w-full bg-[#2b3d3d] hover:bg-[#192d2f] text-white"
                          onClick={() => {
                            openAuth("register");
                            setMobileOpen(false);
                          }}
                        >
                          Join Khidma
                        </Button>
                      </>
                    ) : null}
                    <Button
                      variant="ghost"
                      className="w-full justify-start"
                      onClick={() => {
                        setView("dashboard");
                        setMobileOpen(false);
                      }}
                    >
                      <LayoutDashboard className="mr-2 size-4" />
                      Dashboard
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start"
                      onClick={() => {
                        setView("admin");
                        setMobileOpen(false);
                      }}
                    >
                      <Shield className="mr-2 size-4" />
                      Admin Review Console
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
