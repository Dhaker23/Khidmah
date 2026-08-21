"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Search,
  Menu,
  X,
  MessageSquare,
  ChevronDown,
  LayoutDashboard,
  Shield,
  LogOut,
  Wallet,
  Briefcase,
  Users,
  ShoppingBag,
  HelpCircle,
  PlusCircle,
  Heart,
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
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import { KhidmaLogo } from "./logo";
import { ThemeToggle } from "./theme-toggle";
import { LanguageSwitcher } from "./language-switcher";
import { NotificationsDropdown } from "./notifications-dropdown";
import { useApp } from "@/lib/store";
import { useT } from "@/lib/use-t";
import { cn } from "@/lib/utils";

const navItems = [
  { id: "freelancers", labelKey: "nav.findTalent", icon: Users },
  { id: "jobs", labelKey: "nav.findWork", icon: Briefcase },
  { id: "services", labelKey: "nav.services", icon: ShoppingBag },
  { id: "how-it-works", labelKey: "nav.howItWorks", icon: HelpCircle },
] as const;

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const {
    view,
    setView,
    openAuth,
    currentUser,
    logout,
    setSearchQuery,
    openOnboarding,
    openMessaging,
    openWallet,
    openPostJob,
    openCreateService,
    openCommandPalette,
    openFavorites,
    favoritesCount,
  } = useApp();
  const { t } = useT();

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        setScrolled(window.scrollY > 8);
        ticking = false;
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // ⌘K / Ctrl+K to open command palette
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        openCommandPalette();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [openCommandPalette]);

  const navItemsResolved = navItems.map((i) => ({ ...i, label: t(i.labelKey) }));

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        scrolled
          ? "bg-background/85 backdrop-blur-xl border-b border-border/60 shadow-sm"
          : "bg-[#eef0f0]/80 backdrop-blur-md"
      )}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <button
            onClick={() => {
              setView("home");
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="flex items-center gap-2 transition-opacity hover:opacity-90 shrink-0 z-10"
            aria-label="Khidma home, scroll to top"
          >
            <KhidmaLogo
              variant="full"
              size="sm"
            />
          </button>

          {/* Desktop Nav , absolutely centered */}
          <nav data-tour="nav" className="hidden lg:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
            {navItemsResolved.map((item) => {
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
                      className="absolute inset-x-2 -bottom-px h-0.5 rounded-full bg-[#32504d]"
                    />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right actions */}
          <div className="flex items-center gap-1 shrink-0 ml-auto">
            {currentUser ? (
              <>
                {/* Post Job / Create Service quick actions */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="hidden md:inline-flex gap-1.5 text-[#32504d] hover:text-[#2b3d3d] hover:bg-[#32504d]/10"
                    >
                      <PlusCircle className="size-4" />
                      Create
                      <ChevronDown className="size-3 opacity-60" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>Create new…</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuGroup>
                      <DropdownMenuItem
                        onClick={() => openPostJob()}
                        className="cursor-pointer"
                      >
                        <Briefcase className="mr-2 size-4 text-[#32504d]" />
                        <div className="flex flex-col">
                          <span className="text-sm font-medium">Post a Job</span>
                          <span className="text-[11px] text-muted-foreground">For clients hiring talent</span>
                        </div>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => openCreateService()}
                        className="cursor-pointer"
                      >
                        <ShoppingBag className="mr-2 size-4 text-[#32504d]" />
                        <div className="flex flex-col">
                          <span className="text-sm font-medium">Create a Service</span>
                          <span className="text-[11px] text-muted-foreground">For freelancers selling work</span>
                        </div>
                      </DropdownMenuItem>
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>

                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    "hidden md:inline-flex relative h-9 w-9",
                    
                  )}
                  aria-label="Messages"
                  onClick={() => openMessaging()}
                >
                  <MessageSquare className="size-[18px]" />
                  <span className="absolute top-1 right-1 size-2 rounded-full bg-[#32504d]" />
                </Button>

                <div className={cn()}>
                  <NotificationsDropdown />
                </div>

                {/* Favorites */}
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    "hidden md:inline-flex relative h-9 w-9",
                    
                  )}
                  aria-label={`Saved items${favoritesCount > 0 ? ` (${favoritesCount})` : ""}`}
                  onClick={() => openFavorites()}
                >
                  <Heart className="size-[18px]" />
                  {favoritesCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 px-1 rounded-full bg-[#32504d] text-white text-[10px] font-semibold leading-4 grid place-items-center">
                      {favoritesCount > 99 ? "99+" : favoritesCount}
                    </span>
                  )}
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className={cn(
                      "inline-flex items-center gap-2 rounded-full pl-1.5 pr-2 py-1 transition-colors",
                      "hover:bg-muted/60"
                    )}>
                      <Avatar className="size-8 border border-border/60">
                        <AvatarImage src={currentUser.avatar} alt={currentUser.name} />
                        <AvatarFallback>
                          {currentUser.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <ChevronDown className={cn("size-3.5", "text-muted-foreground")} />
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
                    <DropdownMenuItem onClick={() => openMessaging()}>
                      <MessageSquare className="mr-2 size-4" />
                      Messages
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => openWallet()}>
                      <Wallet className="mr-2 size-4" />
                      Wallet
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => openCreateService()}>
                      <PlusCircle className="mr-2 size-4" />
                      Create Service
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => openPostJob()}>
                      <Briefcase className="mr-2 size-4" />
                      Post a Job
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setView("admin")}>
                      <Shield className="mr-2 size-4" />
                      Admin Review Console
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

                <div className={cn("hidden md:block ml-1", )}>
                  <ThemeToggle />
                </div>
                <div className={cn("hidden md:block", )}>
                  <LanguageSwitcher />
                </div>
              </>
            ) : (
              <>
                <div className={cn("hidden md:block", )}>
                  <ThemeToggle />
                </div>
                <div className={cn("hidden md:block", )}>
                  <LanguageSwitcher />
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => openAuth("login")}
                  className={"hidden sm:inline-flex"}
                >
                  {t("nav.login")}
                </Button>
                <Button
                  size="sm"
                  data-tour="join"
                  onClick={() => openAuth("register")}
                  className="hidden sm:inline-flex bg-[#2b3d3d] hover:bg-[#192d2f] text-white"
                >
                  {t("nav.join")}
                </Button>
              </>
            )}

            {/* Mobile menu */}
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    "lg:hidden",
                    
                  )}
                >
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
                  {navItemsResolved.map((item) => {
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
                  {/* Saved items , always available */}
                  <button
                    onClick={() => {
                      openFavorites();
                      setMobileOpen(false);
                    }}
                    className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium hover:bg-muted"
                  >
                    <Heart className="size-4 text-[#32504d]" />
                    Saved Items
                    {favoritesCount > 0 && (
                      <span className="ml-auto min-w-[20px] h-5 px-1.5 rounded-full bg-[#32504d] text-white text-[10px] font-semibold leading-5 grid place-items-center">
                        {favoritesCount > 99 ? "99+" : favoritesCount}
                      </span>
                    )}
                  </button>
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
                          {t("nav.login")}
                        </Button>
                        <Button
                          className="w-full bg-[#2b3d3d] hover:bg-[#192d2f] text-white"
                          onClick={() => {
                            openAuth("register");
                            setMobileOpen(false);
                          }}
                        >
                          {t("nav.join")}
                        </Button>
                      </>
                    ) : (
                      <>
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
                            openMessaging();
                            setMobileOpen(false);
                          }}
                        >
                          <MessageSquare className="mr-2 size-4" />
                          Messages
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
                      </>
                    )}
                    <div className="flex items-center justify-between pt-4 mt-2 border-t border-border/60">
                      <div className="flex items-center gap-2">
                        <ThemeToggle />
                        <LanguageSwitcher />
                      </div>
                    </div>
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
