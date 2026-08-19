"use client";

/**
 * MobileAppPromo
 * --------------
 * Landing page section promoting the (mock) Khidma mobile app.
 *
 * Layout (desktop): 2-column — phone mockup (left) + content (right).
 * Layout (mobile): stacked — phone on top, content below.
 *
 * Phone mockup is a styled div (rounded-[2rem], dark border, shadow) with an
 * internal stylized app UI:
 *   - Khidma logo + greeting at top
 *   - Fake freelancer card (avatar, name, rating, CTA)
 *   - Fake push notification toast (animated slide-down)
 *   - Bottom nav bar with 5 icons (Home, Search, Wallet, Chat, Profile)
 *
 * Right column:
 *   - Eyebrow "KHIDMA MOBILE"
 *   - Title "Take Khidma everywhere you go."
 *   - Description
 *   - 6-feature list (Check icons)
 *   - App store + Google Play badges (lucide Apple / Play icons) → toast
 *   - Stats row (4.9★ App Store · 100K+ downloads · 41 countries)
 *   - QR code mock (CSS grid of black/white squares) + "Scan to download"
 *
 * Animations: framer-motion (subtle tilt on phone hover, notification slide-in,
 * feature stagger). Reveal used for entrance. Respects prefers-reduced-motion.
 *
 * Palette: Khidma teal only — no indigo/blue.
 */

import { useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  Bell,
  Search,
  Home,
  Wallet,
  MessageCircle,
  User,
  Check,
  Star,
  Apple,
  Play,
  Fingerprint,
  WifiOff,
  Zap,
  ArrowDownToLine,
} from "lucide-react";
import Image from "next/image";
import { Reveal, Section, SectionHeading } from "@/components/khidma/reveal";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

/* ----------------------------------------------------------------------------
 * Phone mockup
 * -------------------------------------------------------------------------- */

/** Single notification toast shown inside the phone frame. */
function PhoneNotification() {
  const prefersReduced = useReducedMotion();
  return (
    <motion.div
      initial={prefersReduced ? undefined : { opacity: 0, y: -8 }}
      animate={prefersReduced ? undefined : { opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay: prefersReduced ? 0 : 0.6,
        ease: [0.22, 1, 0.36, 1] as const,
      }}
      className="absolute left-2.5 right-2.5 top-2 z-20 rounded-xl border border-white/15 bg-[#0e1a1b]/85 backdrop-blur-md p-2.5 shadow-lg shadow-black/30"
    >
      <div className="flex items-start gap-2">
        <span className="size-7 rounded-md bg-[#32504d] flex items-center justify-center shrink-0">
          <Bell className="size-3.5 text-white" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[10px] font-semibold text-white leading-tight">
            New proposal · Khidma
          </p>
          <p className="text-[9px] text-white/70 leading-snug mt-0.5 line-clamp-2">
            Amira submitted a proposal on your Next.js SaaS landing job.
          </p>
        </div>
        <span className="text-[8px] text-white/40 mt-0.5">now</span>
      </div>
    </motion.div>
  );
}

/** The phone mockup — a styled div with aspect-[9/19] ratio. */
function PhoneMockup() {
  const prefersReduced = useReducedMotion();

  return (
    <motion.div
      initial={prefersReduced ? undefined : { opacity: 0, y: 30 }}
      whileInView={prefersReduced ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] as const }}
      whileHover={
        prefersReduced
          ? undefined
          : {
              rotate: -1.2,
              y: -6,
              transition: { duration: 0.4, ease: "easeOut" },
            }
      }
      className="relative mx-auto w-[260px] sm:w-[290px]"
    >
      {/* Glow halo behind the phone */}
      <div
        className="absolute -inset-8 -z-10 rounded-[3rem] bg-gradient-to-br from-[#32504d]/25 via-[#6e8580]/15 to-transparent blur-2xl"
        aria-hidden
      />
      {/* Phone frame */}
      <div className="relative aspect-[9/19] w-full rounded-[2rem] border-[6px] border-[#0e1a1b] bg-[#0e1a1b] shadow-2xl shadow-[#192d2f]/40 overflow-hidden">
        {/* Side buttons (decorative) */}
        <div
          className="absolute -left-[7px] top-20 h-10 w-[2px] rounded-l bg-[#0e1a1b]"
          aria-hidden
        />
        <div
          className="absolute -left-[7px] top-32 h-14 w-[2px] rounded-l bg-[#0e1a1b]"
          aria-hidden
        />
        <div
          className="absolute -right-[7px] top-28 h-16 w-[2px] rounded-r bg-[#0e1a1b]"
          aria-hidden
        />

        {/* Screen */}
        <div className="relative h-full w-full rounded-[1.4rem] overflow-hidden bg-gradient-to-b from-[#192d2f] via-[#2b3d3d] to-[#0e1a1b]">
          {/* Notch */}
          <div
            className="absolute left-1/2 top-2 z-30 h-4 w-20 -translate-x-1/2 rounded-full bg-[#0e1a1b]"
            aria-hidden
          />

          {/* Notification toast */}
          <PhoneNotification />

          {/* App content */}
          <div className="absolute inset-0 pt-12 pb-14 px-3 flex flex-col">
            {/* Header: logo + greeting */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-1.5">
                <Image
                  src="/khidma-logo.png"
                  alt="Khidma logo"
                  width={22}
                  height={22}
                  className="rounded-md"
                />
                <span className="font-display text-xs font-bold text-white">
                  Khidma
                </span>
              </div>
              <span className="size-6 rounded-full bg-white/10 flex items-center justify-center">
                <span className="size-1.5 rounded-full bg-emerald-400" />
              </span>
            </div>

            {/* Greeting */}
            <div className="mb-2.5">
              <p className="text-[9px] text-white/55">Welcome back,</p>
              <p className="font-display text-sm font-bold text-white">
                Hire talent on the go 👋
              </p>
            </div>

            {/* Fake freelancer card */}
            <div className="rounded-xl border border-white/10 bg-white/5 p-2.5 mb-2.5">
              <div className="flex items-center gap-2">
                <Image
                  src="https://api.dicebear.com/7.x/avataaars/svg?seed=AmiraB&backgroundColor=32504d&radius=50"
                  alt="Amira Ben Salah"
                  width={28}
                  height={28}
                  className="rounded-full border border-white/20"
                />
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] font-semibold text-white truncate">
                    Amira Ben Salah
                  </p>
                  <p className="text-[8px] text-white/55 truncate">
                    UI/UX Designer · Tunis
                  </p>
                </div>
                <div className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-md bg-amber-400/15">
                  <Star className="size-2.5 fill-amber-400 text-amber-400" />
                  <span className="text-[9px] font-semibold text-amber-300">
                    5.0
                  </span>
                </div>
              </div>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-[9px] text-white/55">Starting at</span>
                <span className="font-display text-[11px] font-bold text-white">
                  TND 80/hr
                </span>
              </div>
              <button
                type="button"
                disabled
                className="mt-2 w-full rounded-md bg-[#32504d] text-[9px] font-semibold text-white py-1.5"
              >
                View profile
              </button>
            </div>

            {/* Mini stats row */}
            <div className="grid grid-cols-3 gap-1.5">
              {[
                { value: "TND 12K", label: "balance" },
                { value: "8", label: "active" },
                { value: "4.9", label: "rating" },
              ].map((s) => (
                <div
                  key={s.label}
                  className="rounded-lg border border-white/10 bg-white/5 px-1.5 py-1.5 text-center"
                >
                  <p className="font-display text-[10px] font-bold text-white leading-tight">
                    {s.value}
                  </p>
                  <p className="text-[7px] text-white/55 uppercase tracking-wider">
                    {s.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom nav bar */}
          <div className="absolute inset-x-0 bottom-0 z-10 border-t border-white/10 bg-[#0e1a1b]/95 backdrop-blur-md px-2 pt-1.5 pb-2.5">
            <div className="flex items-center justify-between">
              {[
                { icon: Home, label: "Home", active: true },
                { icon: Search, label: "Search", active: false },
                { icon: Wallet, label: "Wallet", active: false },
                { icon: MessageCircle, label: "Chat", active: false },
                { icon: User, label: "Profile", active: false },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.label}
                    className={cn(
                      "flex flex-col items-center gap-0.5 px-1",
                      item.active
                        ? "text-[#9bb3ae]"
                        : "text-white/40"
                    )}
                  >
                    <Icon className="size-3.5" />
                    <span className="text-[7px]">{item.label}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ----------------------------------------------------------------------------
 * QR code mock — deterministic 21×21 grid
 * -------------------------------------------------------------------------- */

/**
 * Generates a 21×21 boolean grid (true = black) that mimics a QR code pattern:
 * three finder squares (top-left, top-right, bottom-left) + pseudo-random fill
 * for the rest. Same pattern on every render (deterministic).
 */
function useQrMatrix(): boolean[][] {
  return useMemo(() => {
    const SIZE = 21;
    const grid: boolean[][] = Array.from({ length: SIZE }, () =>
      Array.from({ length: SIZE }, () => false)
    );

    // Pseudo-random fill using a simple LCG (deterministic, no Math.random)
    let seed = 71283;
    const rand = () => {
      seed = (seed * 1103515245 + 12345) & 0x7fffffff;
      return (seed >> 8) & 1;
    };
    for (let r = 0; r < SIZE; r++) {
      for (let c = 0; c < SIZE; c++) {
        grid[r][c] = rand() === 1;
      }
    }

    // Finder patterns (7×7 at 3 corners)
    const drawFinder = (startR: number, startC: number) => {
      for (let r = 0; r < 7; r++) {
        for (let c = 0; c < 7; c++) {
          const onBorder = r === 0 || r === 6 || c === 0 || c === 6;
          const onInner = r >= 2 && r <= 4 && c >= 2 && c <= 4;
          grid[startR + r][startC + c] = onBorder || onInner;
        }
      }
      // Clear the separator ring (row 7 / col 7 around each finder)
      for (let i = 0; i < 8; i++) {
        if (startR + 7 < SIZE && startC + i < SIZE)
          grid[startR + 7][startC + i] = false;
        if (startC + 7 < SIZE && startR + i < SIZE)
          grid[startR + i][startC + 7] = false;
      }
    };
    drawFinder(0, 0);
    drawFinder(0, SIZE - 7);
    drawFinder(SIZE - 7, 0);

    // Timing patterns (alternating row/col)
    for (let i = 8; i < SIZE - 8; i++) {
      grid[6][i] = i % 2 === 0;
      grid[i][6] = i % 2 === 0;
    }

    return grid;
  }, []);
}

function QrMock() {
  const matrix = useQrMatrix();
  return (
    <div className="flex items-center gap-3" aria-label="Scan QR to download">
      <div className="relative size-20 sm:size-24 rounded-lg border border-border/70 bg-white p-1.5 shadow-sm">
        {/* Khidma logo overlay (center) */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 size-7 rounded-md bg-white border border-border/70 flex items-center justify-center z-10">
          <Image
            src="/khidma-logo.png"
            alt=""
            width={18}
            height={18}
            className="rounded-sm"
          />
        </div>
        <div
          className="grid w-full h-full"
          style={{
            gridTemplateColumns: `repeat(${matrix[0].length}, 1fr)`,
            gridTemplateRows: `repeat(${matrix.length}, 1fr)`,
            gap: "0px",
          }}
          aria-hidden
        >
          {matrix.map((row, r) =>
            row.map((on, c) => (
              <div
                key={`${r}-${c}`}
                className={on ? "bg-[#0e1a1b]" : "bg-white"}
              />
            ))
          )}
        </div>
      </div>
      <div>
        <p className="text-[11px] font-semibold text-foreground flex items-center gap-1.5">
          <ArrowDownToLine className="size-3.5 text-[#32504d] dark:text-[#9bb3ae]" />
          Scan to download
        </p>
        <p className="text-[10px] text-muted-foreground mt-0.5 max-w-[10rem]">
          Point your camera here to install the Khidma app.
        </p>
      </div>
    </div>
  );
}

/* ----------------------------------------------------------------------------
 * App store badges
 * -------------------------------------------------------------------------- */

function AppStoreButton() {
  return (
    <button
      type="button"
      aria-label="Download on the App Store"
      onClick={() =>
        toast.info("App coming soon! We'll notify you.", {
          description: "Sign up to get an email when Khidma Mobile launches.",
        })
      }
      className="group flex items-center gap-2.5 rounded-xl border border-[#0e1a1b]/20 bg-[#0e1a1b] hover:bg-[#192d2f] dark:bg-[#0e1a1b]/90 transition-all px-3.5 py-2.5"
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

function GooglePlayButton() {
  return (
    <button
      type="button"
      aria-label="Get it on Google Play"
      onClick={() =>
        toast.info("App coming soon! We'll notify you.", {
          description: "Sign up to get an email when Khidma Mobile launches.",
        })
      }
      className="group flex items-center gap-2.5 rounded-xl border border-[#0e1a1b]/20 bg-[#0e1a1b] hover:bg-[#192d2f] dark:bg-[#0e1a1b]/90 transition-all px-3.5 py-2.5"
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

/* ----------------------------------------------------------------------------
 * Feature list
 * -------------------------------------------------------------------------- */

interface Feature {
  icon: React.ComponentType<{ className?: string }>;
  text: string;
}

const FEATURES: Feature[] = [
  {
    icon: Zap,
    text: "Instant push notifications for proposals & messages",
  },
  {
    icon: MessageCircle,
    text: "Real-time chat with clients",
  },
  {
    icon: Wallet,
    text: "Wallet + earnings dashboard",
  },
  {
    icon: Fingerprint,
    text: "Biometric login (Face ID / fingerprint)",
  },
  {
    icon: WifiOff,
    text: "Offline mode for browsing freelancers",
  },
  {
    icon: ArrowDownToLine,
    text: "Quick withdrawal requests",
  },
];

function FeatureItem({ feature, index }: { feature: Feature; index: number }) {
  const prefersReduced = useReducedMotion();
  const Icon = feature.icon;
  return (
    <motion.li
      initial={prefersReduced ? undefined : { opacity: 0, x: -8 }}
      whileInView={prefersReduced ? undefined : { opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{
        duration: 0.4,
        delay: prefersReduced ? 0 : 0.06 * index,
      }}
      className="flex items-start gap-2.5"
    >
      <span className="mt-0.5 flex size-5 items-center justify-center rounded-full bg-[#32504d]/15 text-[#32504d] dark:text-[#9bb3ae]">
        <Check className="size-3.5" />
      </span>
      <span className="flex items-center gap-1.5 text-sm text-foreground/85">
        <Icon className="size-3.5 text-[#748684] hidden sm:inline" aria-hidden />
        {feature.text}
      </span>
    </motion.li>
  );
}

/* ----------------------------------------------------------------------------
 * Section
 * -------------------------------------------------------------------------- */

export function MobileAppPromo() {
  const prefersReduced = useReducedMotion();

  return (
    <Section
      id="mobile-app"
      className="bg-gradient-to-b from-background via-[#f5f8f7] to-background dark:via-[#0e1a1b]/40"
    >
      <div className="grid gap-10 lg:gap-16 lg:grid-cols-2 items-center">
        {/* Left: phone mockup */}
        <div className="order-2 lg:order-1 flex justify-center lg:justify-start">
          <PhoneMockup />
        </div>

        {/* Right: content */}
        <div className="order-1 lg:order-2">
          <SectionHeading
            eyebrow="KHIDMA MOBILE"
            title={
              <>
                Take Khidma{" "}
                <span className="text-[#32504d] dark:text-[#9bb3ae]">
                  everywhere you go.
                </span>
              </>
            }
            description="Manage your freelance business from your phone. Get instant notifications, chat with clients, track earnings, and withdraw — all from the Khidma mobile app."
          />

          {/* Feature list (6) */}
          <Reveal>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 mb-8">
              {FEATURES.map((f, i) => (
                <FeatureItem key={f.text} feature={f} index={i} />
              ))}
            </ul>
          </Reveal>

          {/* App store badges + QR */}
          <Reveal delay={0.05}>
            <div className="flex flex-col sm:flex-row sm:items-center gap-5 mb-8">
              <div className="flex flex-wrap items-center gap-2.5">
                <AppStoreButton />
                <GooglePlayButton />
              </div>
              <div className="hidden sm:block h-12 w-px bg-border/60" aria-hidden />
              <QrMock />
            </div>
          </Reveal>

          {/* Stats row */}
          <Reveal delay={0.1}>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm">
              <div className="flex items-center gap-1.5">
                <Star className="size-4 fill-amber-400 text-amber-400" />
                <span className="font-display font-bold text-foreground">
                  4.9
                </span>
                <span className="text-muted-foreground">on App Store</span>
              </div>
              <span
                className="hidden sm:inline text-border"
                aria-hidden
              >
                ·
              </span>
              <div className="flex items-center gap-1.5">
                <motion.span
                  animate={
                    prefersReduced
                      ? undefined
                      : { scale: [1, 1.18, 1], opacity: [1, 0.65, 1] }
                  }
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  className="size-2 rounded-full bg-emerald-500"
                  aria-hidden
                />
                <span className="font-display font-bold text-foreground">
                  100K+
                </span>
                <span className="text-muted-foreground">downloads</span>
              </div>
              <span className="hidden sm:inline text-border" aria-hidden>
                ·
              </span>
              <div className="flex items-center gap-1.5">
                <span className="font-display font-bold text-foreground">
                  41
                </span>
                <span className="text-muted-foreground">countries</span>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}
