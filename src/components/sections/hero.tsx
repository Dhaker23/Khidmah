"use client";

import {
  motion,
  useScroll,
  useTransform,
  useReducedMotion,
  useMotionValue,
  useSpring,
} from "framer-motion";
import { useRef, useEffect, useState, type ReactNode } from "react";
import {
  Search,
  Rocket,
  ShieldCheck,
  Star,
  Users,
  Wallet,
  TrendingUp,
  ArrowRight,
  Quote,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { VerificationBadge } from "@/components/khidma/verification";
import { LiveActivityTicker } from "@/components/khidma/live-activity-ticker";
import { useTypewriter } from "@/components/khidma/use-typewriter";
import { useApp } from "@/lib/store";
import { useT } from "@/lib/use-t";
import {
  freelancers,
  trustStats,
  formatNumber,
  formatTND,
} from "@/lib/khidma-data";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } },
};

// Animated count-up hook
function useCountUp(target: number, duration = 1800, start = false) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (!start) return;
    let raf = 0;
    const t0 = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - t0) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(Math.floor(target * eased));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration, start]);
  return value;
}

const SKILLS_MARQUEE = [
  "Next.js", "React", "TypeScript", "UI Design", "Figma", "Motion Graphics",
  "Voice Over", "Copywriting", "SEO", "Blender 3D", "Brand Identity", "After Effects",
  "Translation", "Premiere Pro", "Tailwind CSS", "Sound Design", "Photography",
  "Node.js", "Illustrator", "Photoshop", "Mobile App", "3D Rendering",
];

// Phrases for the typewriter headline (line 2 of the hero).
// Order matches the brand narrative: build / hire / grow / earn.
const HEADLINE_PHRASES = [
  "Build your career.",
  "Hire verified talent.",
  "Grow your business.",
  "Earn your worth.",
];

/**
 * MagneticCard , wrapper that makes its content subtly follow the cursor
 * when hovered (max 8px translate), with a springy reset on mouse leave.
 *
 * Uses `useMotionValue` + `useSpring` so there are NO React re-renders on
 * `mousemove`. Falls back to a plain wrapper when `prefers-reduced-motion`
 * is set (no magnetic effect).
 */
function MagneticCard({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const prefersReduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springConfig = { stiffness: 200, damping: 15, mass: 0.3 };
  const sx = useSpring(x, springConfig);
  const sy = useSpring(y, springConfig);

  if (prefersReduced) {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ x: sx, y: sy }}
      onMouseMove={(e) => {
        const el = ref.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        // Normalized direction (-1..1), clamped to [-1, 1] for safety.
        const dx = Math.max(
          -1,
          Math.min(1, (e.clientX - cx) / (rect.width / 2))
        );
        const dy = Math.max(
          -1,
          Math.min(1, (e.clientY - cy) / (rect.height / 2))
        );
        // Max translate: 8px.
        x.set(dx * 8);
        y.set(dy * 8);
      }}
      onMouseLeave={() => {
        x.set(0);
        y.set(0);
      }}
    >
      {children}
    </motion.div>
  );
}

export function Hero() {
  const { setView, openOnboarding } = useApp();
  const { t } = useT();
  const featured = freelancers.slice(0, 3);
  const prefersReducedMotion = useReducedMotion();
  const headlinePhrases = [
    t("hero.phrase1"),
    t("hero.phrase2"),
    t("hero.phrase3"),
    t("hero.phrase4"),
  ];
  const { text: typedText, animating: typing } = useTypewriter(headlinePhrases);

  const sectionRef = useRef<HTMLElement>(null);
  const [mounted, setMounted] = useState(false);
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => setMounted(true), []);

  // Mouse parallax — throttled via rAF to avoid excessive re-renders
  const [mouse, setMouse] = useState({ x: 0, y: 0 });
  useEffect(() => {
    if (prefersReducedMotion) return;
    let raf = 0;
    let pending = false;
    const onMove = (e: MouseEvent) => {
      if (pending) return;
      pending = true;
      raf = requestAnimationFrame(() => {
        pending = false;
        const el = sectionRef.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        setMouse({ x, y });
      });
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, [prefersReducedMotion]);

  // Scroll-based fade — use useViewportScroll for passive tracking
  const { scrollY } = useScroll();
  const cardsY = useTransform(scrollY, [0, 600], [0, prefersReducedMotion ? 0 : 60]);
  const cardsOpacity = useTransform(scrollY, [0, 400], [1, 0.3]);

  const counters = {
    freelancers: useCountUp(trustStats.verifiedFreelancers, 1800, mounted),
    projects: useCountUp(trustStats.completedProjects, 2200, mounted),
    paid: useCountUp(Math.floor(trustStats.totalPaidOut / 1000), 2400, mounted),
  };

  const trustChips = [
    {
      icon: Users,
      label: `${formatNumber(counters.freelancers)} verified freelancers`,
    },
    {
      icon: ShieldCheck,
      label: `${formatNumber(counters.projects)} projects completed`,
    },
    {
      icon: Wallet,
      label: `TND ${(counters.paid * 1000).toLocaleString("en-US")} paid out`,
    },
  ];

  // Parallax style helpers
  const blob1X = mouse.x * 18;
  const blob1Y = mouse.y * 18;
  const blob2X = mouse.x * -24;
  const blob2Y = mouse.y * -24;
  const cardShift = mouse.x * 6;

  return (
    <section
      ref={sectionRef}
      id="hero"
      data-cursor-glow
      className="relative overflow-hidden bg-khidma-radial bg-dot-grid"
    >
      {/* Animated gradient mesh blobs */}
      <motion.div
        aria-hidden
        className="absolute inset-0 opacity-70 pointer-events-none"
        animate={
          prefersReducedMotion
            ? undefined
            : { rotate: 360 }
        }
        transition={
          prefersReducedMotion
            ? undefined
            : { duration: 90, repeat: Infinity, ease: "linear" }
        }
      >
        <motion.div
          className="absolute -top-32 -left-32 size-[520px] rounded-full blur-3xl"
          style={{
            background:
              "radial-gradient(circle, rgba(116,134,132,0.30) 0%, transparent 70%)",
            x: blob1X,
            y: blob1Y,
          }}
        />
        <motion.div
          className="absolute top-1/3 -right-40 size-[600px] rounded-full blur-3xl"
          style={{
            background:
              "radial-gradient(circle, rgba(50,80,77,0.35) 0%, transparent 70%)",
            x: blob2X,
            y: blob2Y,
          }}
        />
        <div
          className="absolute bottom-0 left-1/3 size-[420px] rounded-full blur-3xl"
          style={{
            background:
              "radial-gradient(circle, rgba(110,133,128,0.20) 0%, transparent 70%)",
          }}
        />
      </motion.div>

      {/* Subtle grid overlay */}
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.06] pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)",
          backgroundSize: "64px 64px",
          maskImage:
            "radial-gradient(ellipse at center, black 30%, transparent 80%)",
          WebkitMaskImage:
            "radial-gradient(ellipse at center, black 30%, transparent 80%)",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left: copy + CTA */}
          <motion.div
            className="lg:col-span-7"
            variants={containerVariants}
            initial="hidden"
            animate="show"
          >
            <motion.div variants={itemVariants}>
              <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium text-white/85 backdrop-blur-sm">
                <motion.span
                  animate={prefersReducedMotion ? undefined : { scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  className="size-1.5 rounded-full bg-emerald-400"
                />
                {t("hero.eyebrow")}
              </span>
            </motion.div>

            <motion.div variants={itemVariants} className="relative mt-5">
              {/* Radial glow behind headline , soft pulse, reduced-motion safe */}
              <motion.div
                aria-hidden
                className={
                  "pointer-events-none absolute left-1/2 top-1/2 size-[600px] " +
                  "max-w-none -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
                }
                style={{
                  background:
                    "radial-gradient(circle, rgba(116,134,132,0.25) 0%, transparent 60%)",
                }}
                animate={
                  prefersReducedMotion ? undefined : { opacity: [0.6, 0.9, 0.6] }
                }
                transition={
                  prefersReducedMotion
                    ? undefined
                    : { duration: 4, repeat: Infinity, ease: "easeInOut" }
                }
              />
              <h1
                className="relative font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.05]"
                style={{ textShadow: "0 2px 24px rgba(0,0,0,0.3)" }}
              >
                {t("hero.titleLine1")}
                <br />
                <span className="text-khidma-gradient">
                  {typedText}
                  <motion.span
                    aria-hidden
                    animate={
                      prefersReducedMotion
                        ? undefined
                        : { opacity: [1, 0, 1] }
                    }
                    transition={
                      prefersReducedMotion
                        ? undefined
                        : {
                            duration: 1,
                            repeat: Infinity,
                            ease: "easeInOut",
                            // Blink slower while typing/deleting for a calmer feel.
                            ...(typing ? { duration: 0.7 } : {}),
                          }
                    }
                    className="ml-0.5 inline-block w-[2px] sm:w-[3px] h-[0.85em] sm:h-[0.9em] translate-y-[0.05em] rounded-full bg-white/80 align-text-bottom"
                  />
                </span>
              </h1>
            </motion.div>

            <motion.p
              variants={itemVariants}
              className="mt-6 max-w-xl text-base sm:text-lg text-white/75 leading-relaxed"
            >
              {t("hero.subtitle")}{" "}
              <span className="font-semibold text-white/95">
                {t("hero.trust.realPeople")}
              </span>
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="mt-8 flex flex-col sm:flex-row gap-3"
            >
              <Button
                size="lg"
                onClick={() => setView("freelancers")}
                className="group h-12 px-6 bg-white text-[#192d2f] hover:bg-white hover:shadow-[0_8px_40px_-4px_rgba(255,255,255,0.5)] transition-all"
              >
                <Search className="size-4 transition-transform group-hover:scale-110" />
                {t("cta.findFreelancer")}
                <ArrowRight className="ml-1 size-4 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={openOnboarding}
                className="group h-12 px-6 border-white/30 bg-white/5 text-white hover:bg-white/10 hover:text-white hover:border-white/50 transition-all backdrop-blur-sm"
              >
                <Rocket className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:rotate-12" />
                {t("cta.startFreelancing")}
              </Button>
            </motion.div>

            {/* Trust chips with live counters */}
            <motion.ul
              variants={itemVariants}
              data-tour="trust-chips"
              className="mt-8 flex flex-wrap gap-x-6 gap-y-3"
            >
              {trustChips.map((chip, idx) => (
                <motion.li
                  key={chip.label}
                  whileHover={{ scale: 1.02 }}
                  className="flex items-center gap-2 text-sm text-white/80"
                >
                  <chip.icon className="size-4 text-[#94a8a4]" />
                  {chip.label}
                  {idx < trustChips.length - 1 && (
                    <span className="ml-2 text-white/30">·</span>
                  )}
                </motion.li>
              ))}
            </motion.ul>

            {/* Live activity ticker , real-time platform events */}
            <motion.div variants={itemVariants} className="mt-6 max-w-xl">
              <LiveActivityTicker />
            </motion.div>
          </motion.div>

          {/* Right: floating preview cards with parallax */}
          <motion.div
            className="lg:col-span-5 relative"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] as const }}
          >
            <motion.div
              style={{ y: cardsY, opacity: cardsOpacity, x: cardShift }}
              className="relative space-y-4"
            >
              {featured.map((f, i) => (
                <MagneticCard
                  key={f.id}
                  className={
                    i === 1 ? "lg:ml-8" : i === 2 ? "lg:mr-4" : ""
                  }
                >
                  <motion.button
                    onClick={() => useApp.getState().openFreelancer(f.id)}
                    initial={{ opacity: 0, y: 24 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.55,
                      delay: 0.35 + i * 0.15,
                      ease: [0.22, 1, 0.36, 1] as const,
                    }}
                    whileHover={{ y: -4, scale: 1.01 }}
                    className="group w-full text-left rounded-2xl border border-white/10 bg-white/[0.07] backdrop-blur-md p-4 shadow-2xl transition-colors hover:border-white/25"
                  >
                  <div className="flex items-start gap-3">
                    <Avatar className="size-12 border border-white/20 shrink-0">
                      <AvatarImage src={f.avatar} alt={f.name} />
                      <AvatarFallback className="bg-[#32504d] text-white">
                        {f.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h3 className="font-semibold text-sm text-white truncate group-hover:text-white">
                          {f.name}
                        </h3>
                        {f.topRated && (
                          <VerificationBadge type="topRated" showLabel={false} />
                        )}
                      </div>
                      <p className="text-xs text-white/70 truncate">{f.title}</p>
                      <div className="mt-1 flex items-center gap-1 text-xs text-white/70">
                        <Star className="size-3 fill-amber-400 text-amber-400" />
                        <span className="font-semibold text-white">
                          {f.rating.toFixed(1)}
                        </span>
                        <span>· {formatNumber(f.completedProjects)} projects</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-between">
                    <div className="flex flex-wrap gap-1">
                      {f.skills.slice(0, 2).map((s) => (
                        <span
                          key={s}
                          className="rounded-md bg-white/10 px-1.5 py-0.5 text-[10px] text-white/80 group-hover:bg-white/15 transition-colors"
                        >
                          {s}
                        </span>
                      ))}
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] uppercase tracking-wider text-white/60">
                        from
                      </div>
                      <div className="text-sm font-semibold text-white">
                        {formatTND(f.hourlyRate)}
                        <span className="text-[10px] font-normal text-white/60">
                          /hr
                        </span>
                      </div>
                    </div>
                  </div>
                  </motion.button>
                </MagneticCard>
              ))}

              {/* Floating trust-score badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.85 }}
                className="absolute -bottom-6 -left-6 hidden sm:flex items-center gap-3 rounded-xl border border-white/15 bg-[#32504d]/90 backdrop-blur-md px-4 py-3 shadow-xl"
              >
                <TrendingUp className="size-4 text-white shrink-0" />
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-white/70">
                    Trust Score
                  </div>
                  <div className="text-sm font-bold text-white">
                    {trustStats.avgRating.toFixed(1)} / 5.0
                  </div>
                </div>
              </motion.div>

              {/* Floating mini testimonial */}
              <motion.div
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 1 }}
                className="absolute -top-6 -right-6 hidden lg:flex items-start gap-2 rounded-xl border border-white/15 bg-white/10 backdrop-blur-md px-3 py-2.5 shadow-xl max-w-[200px]"
              >
                <Quote className="size-3.5 text-[#94a8a4] shrink-0 mt-0.5" />
                <div>
                  <div className="text-[10px] text-white/70 uppercase tracking-wider">
                    Verified
                  </div>
                  <div className="text-xs text-white font-medium leading-tight">
                    Identity · Portfolio · Reviews
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>

        {/* Skills marquee at the bottom */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="relative mt-16 sm:mt-20 overflow-hidden"
        >
          <div className="flex items-center gap-3 mb-3">
            <span className="text-[11px] uppercase tracking-[0.2em] text-white/40 font-medium">
              Popular skills on Khidma
            </span>
            <div className="h-px flex-1 bg-gradient-to-r from-white/15 to-transparent" />
          </div>
          <div className="relative">
            <div className="flex gap-2 animate-marquee-slow whitespace-nowrap w-max">
              {[...SKILLS_MARQUEE, ...SKILLS_MARQUEE].map((skill, i) => (
                <span
                  key={`${skill}-${i}`}
                  className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/70 hover:text-white hover:bg-white/10 transition-colors"
                >
                  <span className="size-1 rounded-full bg-[#748684]" />
                  {skill}
                </span>
              ))}
            </div>
            {/* edge fades */}
            <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-[#192d2f] to-transparent pointer-events-none" />
            <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-[#192d2f] to-transparent pointer-events-none" />
          </div>
        </motion.div>
      </div>

      {/* Bottom fade divider */}
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
    </section>
  );
}

export default Hero;
