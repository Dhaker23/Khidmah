"use client";

/**
 * Khidma Footer — premium information-dense footer
 * -----------------------------------------------
 * Sections:
 *   1. Top strip — "Trusted by 1,248+ verified freelancers across 24 cities"
 *      + row of 5 Tunisian city pills (Tunis, Sfax, Sousse, Kairouan, Nabeul).
 *   2. Newsletter — "Join 8,420+ Khidma insiders" + subtitle + email input +
 *      Subscribe button + privacy note. Animated form feedback via framer-motion.
 *   3. Stats mini-row — 4 inline stats with count-up (1,248 freelancers ·
 *      8,420 projects · TND 1.24M paid · 41 countries).
 *   4. App download badges — App Store + Google Play mock badges (inline SVGs).
 *   5. Social proof — ★ 4.9/5 from 8,420+ reviews (5 star icons).
 *   6. Existing nav columns — For Clients / For Freelancers / Marketplace /
 *      Trust & Safety, plus new "Khidma API" + "Khidma for Teams" links.
 *   7. Bottom bar — Amara Dhaker attribution + contact email + WhatsApp +
 *      "Made in Tunisia 🇹🇳" badge + "Take the tour" button.
 *
 * Palette: Khidma teal only — #475959 #2b3d3d #748684 #192d2f #32504d #6e8580 #ffffff
 * Animations: framer-motion + count-up; respects prefers-reduced-motion.
 */

import { useEffect, useRef, useState } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import {
  Mail,
  MessageCircle,
  MapPin,
  Github,
  Linkedin,
  Twitter,
  Send,
  Shield,
  Users,
  Briefcase,
  ShoppingBag,
  HelpCircle,
  Star,
  Lock,
  Globe2,
  Wallet,
  ShieldCheck,
  Apple,
  Play,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { KhidmaLogo } from "./logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useApp } from "@/lib/store";
import { useT } from "@/lib/use-t";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const CITIES = ["Tunis", "Sfax", "Sousse", "Kairouan", "Nabeul"];

interface NavLink {
  label: string;
  view?: "freelancers" | "jobs" | "services" | "how-it-works" | "dashboard" | "home";
  action?: "apiDocs" | "teams" | "help" | "partners";
}

interface NavCol {
  title: string;
  icon: LucideIcon;
  links: NavLink[];
}

const footerNav: NavCol[] = [
  {
    title: "For Clients",
    icon: Users,
    links: [
      { label: "Find Talent", view: "freelancers" },
      { label: "Post a Job", view: "jobs" },
      { label: "Browse Services", view: "services" },
      { label: "How It Works", view: "how-it-works" },
      { label: "Khidma for Teams", action: "teams" },
    ],
  },
  {
    title: "For Freelancers",
    icon: Briefcase,
    links: [
      { label: "Find Work", view: "jobs" },
      { label: "Become Verified", view: "dashboard" },
      { label: "Create Service", view: "dashboard" },
      { label: "Withdrawal Options", view: "how-it-works" },
      { label: "Khidma API", action: "apiDocs" },
    ],
  },
  {
    title: "Marketplace",
    icon: ShoppingBag,
    links: [
      { label: "All Freelancers", view: "freelancers" },
      { label: "All Services", view: "services" },
      { label: "Open Jobs", view: "jobs" },
      { label: "Categories", view: "home" },
      { label: "Partner Program", action: "partners" },
    ],
  },
  {
    title: "Trust & Safety",
    icon: Shield,
    links: [
      { label: "Verification Process", view: "how-it-works" },
      { label: "Secure Contracts", view: "how-it-works" },
      { label: "Dispute Resolution", view: "how-it-works" },
      { label: "1% Fee Explained", view: "how-it-works" },
      { label: "Help Center", action: "help" },
    ],
  },
];

const socialLinks = [
  { icon: Github, label: "GitHub", href: "#" },
  { icon: Linkedin, label: "LinkedIn", href: "#" },
  { icon: Twitter, label: "Twitter", href: "#" },
];

/* ------------------------------------------------------------------ */
/* Count-up hook                                                       */
/* ------------------------------------------------------------------ */

function useCountUp(target: number, active: boolean, duration = 1500) {
  const [val, setVal] = useState(0);
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    if (!active) return;
    if (prefersReduced) {
      const raf = requestAnimationFrame(() => setVal(target));
      return () => cancelAnimationFrame(raf);
    }
    let raf = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setVal(target * eased);
      if (progress < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [active, target, duration, prefersReduced]);

  return val;
}

/* ------------------------------------------------------------------ */
/* Inline SVG app store badges                                          */
/* ------------------------------------------------------------------ */

function AppStoreBadge() {
  return (
    <button
      type="button"
      aria-label="Download on the App Store"
      className="group flex items-center gap-2.5 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 hover:border-white/25 transition-all px-3 py-2"
      onClick={() => toast.info("iOS app coming soon — sign up to be notified.")}
    >
      <Apple className="size-5 text-white" />
      <div className="text-left leading-tight">
        <div className="text-[9px] text-white/60 uppercase tracking-wider">
          Download on the
        </div>
        <div className="text-xs font-semibold text-white">App Store</div>
      </div>
    </button>
  );
}

function GooglePlayBadge() {
  return (
    <button
      type="button"
      aria-label="Get it on Google Play"
      className="group flex items-center gap-2.5 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 hover:border-white/25 transition-all px-3 py-2"
      onClick={() => toast.info("Android app coming soon — sign up to be notified.")}
    >
      <Play className="size-5 text-white fill-white" />
      <div className="text-left leading-tight">
        <div className="text-[9px] text-white/60 uppercase tracking-wider">
          Get it on
        </div>
        <div className="text-xs font-semibold text-white">Google Play</div>
      </div>
    </button>
  );
}

/* ------------------------------------------------------------------ */
/* Stat item (count-up)                                                */
/* ------------------------------------------------------------------ */

interface MiniStat {
  icon: LucideIcon;
  raw: number;
  format: (n: number) => string;
  label: string;
}

const MINI_STATS: MiniStat[] = [
  {
    icon: Users,
    raw: 1248,
    format: (n) => Math.round(n).toLocaleString("en-US"),
    label: "freelancers",
  },
  {
    icon: Briefcase,
    raw: 8420,
    format: (n) => Math.round(n).toLocaleString("en-US"),
    label: "projects",
  },
  {
    icon: Wallet,
    raw: 1240000,
    format: (n) => `TND ${(Math.round(n) / 1_000_000).toFixed(2)}M`,
    label: "paid out",
  },
  {
    icon: Globe2,
    raw: 41,
    format: (n) => Math.round(n).toString(),
    label: "countries",
  },
];

function MiniStatItem({ stat, index }: { stat: MiniStat; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const count = useCountUp(stat.raw, inView);
  const Icon = stat.icon;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, delay: index * 0.08 }}
      className="flex items-center gap-2.5"
    >
      <span className="flex size-8 items-center justify-center rounded-lg bg-white/5 border border-white/10">
        <Icon className="size-4 text-[#94a8a4]" />
      </span>
      <div className="leading-tight">
        <div className="font-display text-base sm:text-lg font-bold text-white tabular-nums">
          {stat.format(count)}
        </div>
        <div className="text-[10px] uppercase tracking-wider text-white/50">
          {stat.label}
        </div>
      </div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* Animated underline link                                             */
/* ------------------------------------------------------------------ */

function FooterLink({
  link,
  onNavigate,
}: {
  link: NavLink;
  onNavigate: (link: NavLink) => void;
}) {
  return (
    <li>
      <button
        onClick={() => onNavigate(link)}
        className="group relative text-sm text-white/70 hover:text-white transition-colors text-left"
      >
        <span>{link.label}</span>
        <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-[#748684] transition-all duration-300 group-hover:w-full" />
      </button>
    </li>
  );
}

/* ------------------------------------------------------------------ */
/* Newsletter form                                                     */
/* ------------------------------------------------------------------ */

function NewsletterForm() {
  const openNewsletter = useApp((s) => s.openNewsletter);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Open the dedicated premium newsletter modal instead of inline toast.
    openNewsletter();
  };

  return (
    <div>
      <form onSubmit={onSubmit} className="flex flex-col sm:flex-row gap-3 flex-1">
        <div className="relative flex-1">
          <Input
            type="email"
            placeholder="you@email.com"
            aria-label="Email address"
            className="bg-white/5 border-white/15 text-white placeholder:text-white/40 h-12 pr-10 focus-visible:border-[#748684]"
          />
        </div>
        <Button
          type="submit"
          size="lg"
          className="bg-[#32504d] hover:bg-[#475959] text-white h-12 px-6 group"
        >
          Subscribe
          <Send className="size-4 transition-transform group-hover:translate-x-0.5" />
        </Button>
      </form>
      <div className="mt-3 flex items-center gap-1.5 text-[11px] text-white/45">
        <Lock className="size-3" />
        <span>We respect your privacy. Unsubscribe anytime.</span>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Footer                                                              */
/* ------------------------------------------------------------------ */

export function Footer() {
  const prefersReduced = useReducedMotion();
  const { t } = useT();
  const {
    setView,
    openApiDocs,
    openTeams,
    openHelp,
    openPartners,
    startTour,
  } = useApp();

  const onNavigate = (link: NavLink) => {
    if (link.action === "apiDocs") return openApiDocs();
    if (link.action === "teams") return openTeams();
    if (link.action === "help") return openHelp();
    if (link.action === "partners") return openPartners();
    if (link.view) setView(link.view);
  };

  return (
    <footer className="mt-auto bg-[#0e1a1b] text-white relative overflow-hidden">
      {/* Decorative top gradient line */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#748684] to-transparent opacity-50" />
      {/* Decorative dot grid */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle, #ffffff 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {/* === 1. Top strip — trust + city pills === */}
        <motion.div
          initial={prefersReduced ? undefined : { opacity: 0, y: 12 }}
          whileInView={prefersReduced ? undefined : { opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-8 border-b border-white/10"
        >
          <div className="flex items-center gap-3">
            <span className="flex size-9 items-center justify-center rounded-full bg-[#32504d]/30 ring-1 ring-[#32504d]/40">
              <ShieldCheck className="size-4 text-[#94a8a4]" />
            </span>
            <div className="leading-tight">
              <div className="text-sm font-semibold text-white">
                Trusted by{" "}
                <span className="text-[#94a8a4]">1,248+ verified freelancers</span>
              </div>
              <div className="text-xs text-white/55">
                across 24 cities in Tunisia &amp; beyond
              </div>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            {CITIES.map((c) => (
              <span
                key={c}
                className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] font-medium text-white/70"
              >
                {c}
              </span>
            ))}
            <span className="rounded-full border border-[#32504d]/40 bg-[#32504d]/15 px-2.5 py-1 text-[11px] font-semibold text-[#94a8a4]">
              +19
            </span>
          </div>
        </motion.div>

        {/* === 2. Newsletter === */}
        <div className="grid gap-8 lg:grid-cols-2 items-center py-10 border-b border-white/10">
          <div>
            <h3 className="font-display text-2xl sm:text-3xl font-bold tracking-tight">
              Join{" "}
              <span className="bg-khidma-gradient bg-clip-text text-transparent">
                8,420+ Khidma insiders
              </span>
            </h3>
            <p className="mt-2 text-white/70 text-sm sm:text-base max-w-md">
              Get exclusive market insights, freelancer spotlights, and platform
              updates. No spam, unsubscribe anytime.
            </p>
          </div>
          <NewsletterForm />
        </div>

        {/* === 3. Stats mini-row + App badges + Social proof === */}
        <div className="grid gap-8 py-10 border-b border-white/10 lg:grid-cols-12">
          {/* Mini stats */}
          <div className="lg:col-span-6">
            <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/45 mb-4">
              Platform at a glance
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {MINI_STATS.map((s, i) => (
                <MiniStatItem key={s.label} stat={s} index={i} />
              ))}
            </div>
          </div>

          {/* App badges */}
          <div className="lg:col-span-3">
            <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/45 mb-4">
              Download the Khidma app
            </div>
            <div className="flex flex-col gap-2.5">
              <AppStoreBadge />
              <GooglePlayBadge />
            </div>
          </div>

          {/* Social proof */}
          <div className="lg:col-span-3">
            <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-white/45 mb-4">
              Loved by the community
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-4">
              <div className="flex items-center gap-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className="size-4 fill-amber-400 text-amber-400"
                    aria-hidden
                  />
                ))}
              </div>
              <div className="mt-2 font-display text-xl font-bold text-white">
                4.9 <span className="text-sm font-medium text-white/60">/ 5.0</span>
              </div>
              <div className="text-[11px] text-white/55">
                from 8,420+ verified reviews
              </div>
            </div>
          </div>
        </div>

        {/* === 4. Main footer (Brand + Nav) === */}
        <div className="grid gap-8 lg:gap-12 py-12 lg:grid-cols-12">
          {/* Brand + Contact */}
          <div className="lg:col-span-4 space-y-6">
            <div>
              <KhidmaLogo
                variant="full"
                size="md"
                className="[&_span]:text-white [&_span:nth-child(2)]:text-white/60"
              />
              <p className="mt-4 text-sm text-white/70 max-w-sm leading-relaxed">
                Khidma (خدمة) is a trusted freelance marketplace connecting
                verified Tunisian talent with clients locally and globally.
                Work. Earn. Grow.
              </p>
            </div>

            {/* Contact */}
            <div className="space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-white/50">
                Contact
              </h4>
              <a
                href="mailto:dhakeramarawork@gmail.com"
                className="group flex items-center gap-2.5 text-sm text-white/80 hover:text-white transition-colors"
              >
                <span className="size-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-[#32504d] transition-colors">
                  <Mail className="size-4" />
                </span>
                <span className="relative">
                  dhakeramarawork@gmail.com
                  <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-[#748684] transition-all duration-300 group-hover:w-full" />
                </span>
              </a>
              <a
                href="https://wa.me/21699495558"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-2.5 text-sm text-white/80 hover:text-white transition-colors"
              >
                <span className="size-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-[#32504d] transition-colors">
                  <MessageCircle className="size-4" />
                </span>
                <span className="relative">
                  WhatsApp: +216 99 49 55 58
                  <span className="absolute -bottom-0.5 left-0 h-px w-0 bg-[#748684] transition-all duration-300 group-hover:w-full" />
                </span>
              </a>
              <div className="flex items-center gap-2.5 text-sm text-white/80">
                <span className="size-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
                  <MapPin className="size-4" />
                </span>
                Tunis, Tunisia · Serving Worldwide
              </div>
            </div>

            {/* Social */}
            <div className="flex items-center gap-2">
              {socialLinks.map((s) => {
                const Icon = s.icon;
                return (
                  <a
                    key={s.label}
                    href={s.href}
                    aria-label={s.label}
                    className="size-9 rounded-lg bg-white/5 border border-white/10 hover:bg-[#32504d] hover:border-[#32504d] hover:scale-105 flex items-center justify-center transition-all"
                  >
                    <Icon className="size-4" />
                  </a>
                );
              })}
              <Button
                variant="outline"
                size="sm"
                onClick={() => startTour()}
                className="ml-2 border-white/15 bg-white/5 text-white/80 hover:bg-white/10 hover:text-white gap-1.5"
              >
                <Sparkles className="size-3.5" />
                Take the tour
              </Button>
            </div>
          </div>

          {/* Nav columns */}
          <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-4 gap-8">
            {footerNav.map((col) => {
              const Icon = col.icon;
              return (
                <div key={col.title} className="space-y-4">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-white/50">
                    <Icon className="size-3.5" />
                    {col.title}
                  </div>
                  <ul className="space-y-2.5">
                    {col.links.map((link) => (
                      <FooterLink
                        key={link.label}
                        link={link}
                        onNavigate={onNavigate}
                      />
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>

        <Separator className="bg-white/10" />

        {/* Trust strip */}
        <div className="py-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4 text-xs text-white/60">
          <div className="flex items-center gap-2">
            <Shield className="size-3.5 text-[#748684]" />
            Identity + Portfolio Verification
          </div>
          <div className="flex items-center gap-2">
            <Briefcase className="size-3.5 text-[#748684]" />
            Secure Contracts + Escrow
          </div>
          <div className="flex items-center gap-2">
            <Users className="size-3.5 text-[#748684]" />
            Real People. Real Reviews.
          </div>
          <div className="flex items-center gap-2">
            <HelpCircle className="size-3.5 text-[#748684]" />
            Transparent 1% Platform Fee
          </div>
        </div>

        <Separator className="bg-white/10" />

        {/* === Bottom bar === */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="text-xs text-white/50 space-y-1 max-w-xl">
            <p>© {new Date().getFullYear()} Khidma. All rights reserved.</p>
            <p>
              {t("footer.designedBy")}{" "}
              <a
                href="mailto:dhakeramarawork@gmail.com"
                className="font-medium text-white/80 hover:text-white underline-offset-2 hover:underline"
              >
                Amara Dhaker
              </a>
              . {t("footer.tagline")}.
            </p>
            <p className="flex items-center justify-center sm:justify-start gap-2 pt-1">
              <a
                href="mailto:dhakeramarawork@gmail.com"
                className="hover:text-white/80 transition-colors inline-flex items-center gap-1"
              >
                <Mail className="size-3" /> dhakeramarawork@gmail.com
              </a>
              <span className="text-white/30">·</span>
              <a
                href="https://wa.me/21699495558"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-white/80 transition-colors inline-flex items-center gap-1"
              >
                <MessageCircle className="size-3" /> +216 99 49 55 58
              </a>
            </p>
          </div>
          <div className="flex items-center gap-3 flex-wrap justify-center">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[#32504d]/40 bg-[#32504d]/15 px-3 py-1 text-[11px] font-semibold text-[#94a8a4]">
              Made in Tunisia 🇹🇳
            </span>
            <div className="flex items-center gap-3 text-xs text-white/50">
              <button
                onClick={() => useApp.getState().openPrivacy()}
                className="hover:text-white/80 transition-colors"
              >
                Privacy
              </button>
              <button
                onClick={() => useApp.getState().openHelp()}
                className="hover:text-white/80 transition-colors"
              >
                Terms
              </button>
              <button
                onClick={() => useApp.getState().openHelp()}
                className="hover:text-white/80 transition-colors"
              >
                Trust &amp; Safety
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
