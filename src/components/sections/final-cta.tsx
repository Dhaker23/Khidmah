"use client";

import { motion } from "framer-motion";
import { Rocket, Search, ShieldCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useApp } from "@/lib/store";

export function FinalCTA() {
  const { openOnboarding, setView } = useApp();

  return (
    <section className="relative bg-[#192d2f] overflow-hidden">
      {/* Background glows */}
      <div
        className="absolute inset-0 opacity-50 pointer-events-none bg-dot-grid"
        aria-hidden
      />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 25% 30%, rgba(116,134,132,0.28) 0%, transparent 45%), radial-gradient(circle at 75% 75%, rgba(50,80,77,0.32) 0%, transparent 50%)",
        }}
        aria-hidden
      />
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24 lg:py-28">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] as const }}
          className="mx-auto max-w-3xl text-center"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs font-medium text-white/85 backdrop-blur-sm">
            <Sparkles className="size-3.5 text-[#94a8a4]" />
            Free to join · Real verification · 1% fee only
          </span>

          <h2 className="mt-5 font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.05]">
            Join Khidma Today.
          </h2>

          <p className="mt-5 text-base sm:text-lg text-white/75 max-w-xl mx-auto leading-relaxed">
            Build a verified profile, win real contracts, and get paid through
            escrow-protected milestones. Work. Earn. Grow — with a marketplace
            that puts trust first.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              size="lg"
              onClick={openOnboarding}
              className="h-12 px-6 bg-white text-[#192d2f] hover:bg-white/90 hover:text-[#192d2f]"
            >
              <Rocket className="size-4" />
              Become a Verified Freelancer
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => setView("freelancers")}
              className="h-12 px-6 border-white/30 bg-transparent text-white hover:bg-white/10 hover:text-white"
            >
              <Search className="size-4" />
              Hire Talent
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
        </motion.div>
      </div>
    </section>
  );
}

export default FinalCTA;
