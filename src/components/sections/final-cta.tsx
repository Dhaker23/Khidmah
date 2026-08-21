"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Compass, Rocket, Search, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/khidma/reveal";
import { useApp } from "@/lib/store";

export function FinalCTA() {
  const { openOnboarding, setView, startTour } = useApp();
  const prefersReduced = useReducedMotion();

  return (
    <section className="relative bg-[#192d2f] overflow-hidden">
      {/* Background dot grid */}
      <div
        className="absolute inset-0 opacity-50 pointer-events-none bg-dot-grid"
        aria-hidden
      />
      {/* Static radial gradient backdrop */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 25% 30%, rgba(116,134,132,0.28) 0%, transparent 45%), radial-gradient(circle at 75% 75%, rgba(50,80,77,0.32) 0%, transparent 50%)",
        }}
        aria-hidden
      />

      {/* Animated gradient mesh , 3 drifting blurred blobs (20s loop) */}
      {!prefersReduced && (
        <>
          <motion.div
            aria-hidden
            className="absolute -top-24 left-1/4 size-[420px] rounded-full blur-[120px] pointer-events-none"
            style={{
              background:
                "radial-gradient(circle, rgba(50,80,77,0.55) 0%, transparent 70%)",
            }}
            animate={{
              x: [0, 60, -20, 0],
              y: [0, 40, -30, 0],
              opacity: [0.4, 0.6, 0.45, 0.4],
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            aria-hidden
            className="absolute top-1/3 -right-16 size-[480px] rounded-full blur-[140px] pointer-events-none"
            style={{
              background:
                "radial-gradient(circle, rgba(116,134,132,0.42) 0%, transparent 70%)",
            }}
            animate={{
              x: [0, -50, 30, 0],
              y: [0, -30, 50, 0],
              opacity: [0.35, 0.55, 0.4, 0.35],
            }}
            transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            aria-hidden
            className="absolute -bottom-32 left-1/3 size-[460px] rounded-full blur-[130px] pointer-events-none"
            style={{
              background:
                "radial-gradient(circle, rgba(110,133,128,0.45) 0%, transparent 70%)",
            }}
            animate={{
              x: [0, 40, -40, 0],
              y: [0, -20, 30, 0],
              opacity: [0.3, 0.5, 0.35, 0.3],
            }}
            transition={{ duration: 24, repeat: Infinity, ease: "easeInOut" }}
          />
        </>
      )}

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-28">
        <Reveal y={28} className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium text-white/85 backdrop-blur-sm">
            Free to join · Real verification · 1% fee only
          </span>

          <h2 className="mt-5 font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.05]">
            Join Khidma Today.
          </h2>

          <p className="mt-5 text-base sm:text-lg text-white/75 max-w-xl mx-auto leading-relaxed">
            Build a verified profile, win real contracts, and get paid through
            escrow-protected milestones. Work. Earn. Grow, with a marketplace
            that puts trust first.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            {/* Premium glowing primary CTA */}
            <motion.div
              className="relative inline-flex"
              whileHover={prefersReduced ? undefined : { scale: 1.02 }}
              whileTap={prefersReduced ? undefined : { scale: 0.99 }}
              transition={{ type: "spring", stiffness: 400, damping: 22 }}
            >
              {/* Animated radial glow behind button , pulses 0.4 → 0.7 → 0.4 (2.5s) */}
              <motion.div
                aria-hidden
                className="absolute -inset-4 rounded-full blur-2xl pointer-events-none"
                style={{
                  background:
                    "radial-gradient(circle, rgba(50,80,77,0.85) 0%, rgba(50,80,77,0.4) 45%, transparent 75%)",
                }}
                initial={prefersReduced ? { opacity: 0.55 } : { opacity: 0.4 }}
                animate={
                  prefersReduced ? { opacity: 0.55 } : { opacity: [0.4, 0.7, 0.4] }
                }
                transition={
                  prefersReduced
                    ? { duration: 0 }
                    : {
                        duration: 2.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }
                }
              />
              <Button
                size="lg"
                onClick={openOnboarding}
                className="relative h-12 px-6 bg-white text-[#192d2f] hover:bg-white/90 hover:text-[#192d2f] group"
              >
                <Rocket className="size-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                Become a Verified Freelancer
              </Button>
            </motion.div>

            <Button
              size="lg"
              variant="outline"
              onClick={() => setView("freelancers")}
              className="h-12 px-6 border-white/30 bg-transparent text-white hover:bg-white/10 hover:text-white group"
            >
              <Search className="size-4 transition-transform duration-200 group-hover:scale-110" />
              Hire Talent
            </Button>

            {/* Take the tour , secondary CTA triggering the onboarding tour */}
            <Button
              size="lg"
              variant="ghost"
              onClick={startTour}
              className="h-12 px-6 bg-transparent text-white/85 hover:bg-white/10 hover:text-white group"
            >
              <Compass className="size-4 transition-transform duration-300 group-hover:rotate-[24deg]" />
              Take the tour
            </Button>
          </div>

          {/* Trust line */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-white/60">
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="size-3.5 text-[#94a8a4]" />
              Identity-verified freelancers
            </span>
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="size-3.5 text-[#94a8a4]" />
              Escrow-protected contracts
            </span>
            <span className="inline-flex items-center gap-1.5">
              <ShieldCheck className="size-3.5 text-[#94a8a4]" />
              Local &amp; international withdrawals
            </span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export default FinalCTA;
