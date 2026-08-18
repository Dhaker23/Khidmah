"use client";

import { motion } from "framer-motion";
import {
  Search,
  Rocket,
  ShieldCheck,
  Star,
  Users,
  Wallet,
  TrendingUp,
  Sparkles,
} from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { VerificationBadge } from "@/components/khidma/verification";
import { useApp } from "@/lib/store";
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

export function Hero() {
  const { setView, openOnboarding } = useApp();
  const featured = freelancers.slice(0, 3);

  const trustChips = [
    {
      icon: Users,
      label: `${formatNumber(trustStats.verifiedFreelancers)} verified freelancers`,
    },
    {
      icon: ShieldCheck,
      label: `${formatNumber(trustStats.completedProjects)} projects completed`,
    },
    {
      icon: Wallet,
      label: `${formatTND(trustStats.totalPaidOut)} paid out`,
    },
  ];

  return (
    <section className="relative overflow-hidden bg-khidma-radial bg-dot-grid">
      {/* Decorative glow */}
      <div
        className="absolute inset-0 opacity-60 pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle at 15% 30%, rgba(116,134,132,0.18) 0%, transparent 45%), radial-gradient(circle at 85% 70%, rgba(50,80,77,0.22) 0%, transparent 50%)",
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
                <Sparkles className="size-3.5 text-[#748684]" />
                Built for Tunisian talent & clients worldwide
              </span>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="mt-5 font-display text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.05]"
            >
              Find trusted talent.
              <br />
              Build your career.
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="mt-5 max-w-xl text-base sm:text-lg text-white/75 leading-relaxed"
            >
              A professional marketplace connecting verified Tunisian freelancers
              with clients locally and globally. Real people. Real skills. Real
              trust.
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="mt-8 flex flex-col sm:flex-row gap-3"
            >
              <Button
                size="lg"
                onClick={() => setView("freelancers")}
                className="h-11 px-6 bg-white text-[#192d2f] hover:bg-white/90 hover:text-[#192d2f]"
              >
                <Search className="size-4" />
                Find a Freelancer
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={openOnboarding}
                className="h-11 px-6 border-white/30 bg-transparent text-white hover:bg-white/10 hover:text-white"
              >
                <Rocket className="size-4" />
                Start Freelancing
              </Button>
            </motion.div>

            {/* Trust chips */}
            <motion.ul
              variants={itemVariants}
              className="mt-8 flex flex-wrap gap-x-6 gap-y-3"
            >
              {trustChips.map((chip) => (
                <li
                  key={chip.label}
                  className="flex items-center gap-2 text-sm text-white/80"
                >
                  <span className="flex size-7 items-center justify-center rounded-full bg-white/10">
                    <chip.icon className="size-3.5 text-[#94a8a4]" />
                  </span>
                  {chip.label}
                </li>
              ))}
            </motion.ul>
          </motion.div>

          {/* Right: floating preview cards */}
          <motion.div
            className="lg:col-span-5 relative"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.22, 1, 0.36, 1] as const }}
          >
            <div className="relative space-y-4">
              {featured.map((f, i) => (
                <motion.div
                  key={f.id}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.55,
                    delay: 0.35 + i * 0.15,
                    ease: [0.22, 1, 0.36, 1] as const,
                  }}
                  className={`rounded-2xl border border-white/10 bg-white/[0.07] backdrop-blur-md p-4 shadow-2xl ${
                    i === 1 ? "lg:ml-8" : i === 2 ? "lg:mr-4" : ""
                  }`}
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
                        <h3 className="font-semibold text-sm text-white truncate">
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
                          className="rounded-md bg-white/10 px-1.5 py-0.5 text-[10px] text-white/80"
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
                </motion.div>
              ))}

              {/* Floating stat card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.85 }}
                className="absolute -bottom-6 -left-6 hidden sm:flex items-center gap-2 rounded-xl border border-white/15 bg-[#32504d]/90 backdrop-blur-md px-4 py-3 shadow-xl"
              >
                <div className="flex size-9 items-center justify-center rounded-lg bg-white/10">
                  <TrendingUp className="size-4 text-white" />
                </div>
                <div>
                  <div className="text-[10px] uppercase tracking-wider text-white/70">
                    Trust Score
                  </div>
                  <div className="text-sm font-bold text-white">
                    {trustStats.avgRating.toFixed(1)} / 5.0
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />
    </section>
  );
}

export default Hero;
