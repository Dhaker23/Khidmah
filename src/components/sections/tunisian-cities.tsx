"use client";

/**
 * TunisianCities
 * --------------
 * A premium showcase section highlighting the 24 Tunisian cities where
 * Khidma freelancers are based. (12 cities shown on the stylized map + list;
 * the other 12 are accounted for in the stats strip.)
 *
 * Layout (desktop, lg+):
 *   ┌──────────────────────────┬──────────────────────┐
 *   │  Stylized "map" (60%)    │  City list (40%)     │
 *   │  - vertical container    │  - scrollable list    │
 *   │  - gradient + dot grid   │  - rank + name + bar  │
 *   │  - 12 pulsing pins       │  - hover "Browse"     │
 *   │  - hover tooltips        │                       │
 *   └──────────────────────────┴──────────────────────┘
 *   │  Stats strip: 4 cards (24 cities · 1,248 · 12 · 4)│
 *
 * Mobile:
 *   - map hidden, replaced by a simple 2-3 col grid of city pills
 *   - city list full-width below
 *
 * - All pins + rows are clickable → `setView("freelancers")` + toast.
 * - framer-motion for pin entrance (staggered scale-from-0), pulsing rings,
 *   and count-bar fill.
 * - `prefers-reduced-motion` respected throughout (no entrance animation,
 *   no pulsing, instant bar fill).
 */

import { useState, type Dispatch, type SetStateAction } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowUpRight, MapPin } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Reveal, SectionHeading } from "@/components/khidma/reveal";
import { useApp } from "@/lib/store";
import { formatNumber, trustStats } from "@/lib/khidma-data";
import { CITIES_WITH_POS, TUNISIA_SVG_PATH } from "@/lib/tunisia-geo";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// =====================================================================
// Types & data
// =====================================================================

interface CityPin {
  rank: number;
  name: string;
  count: number;
  x: number;
  y: number;
  lat: number;
  lng: number;
  cats: [string, string];
}

const CITIES: CityPin[] = CITIES_WITH_POS;

// Use the platform-wide total (1,248) for percentage math — this matches
// the trustStats.verifiedFreelancers value used elsewhere on the page.
const TOTAL_FREELANCERS = trustStats.verifiedFreelancers;
const MAX_COUNT = CITIES[0].count; // Tunis (412)

// =====================================================================
// Helpers
// =====================================================================

/** Pin dot size scales with sqrt(count) so smaller cities aren't invisible. */
function pinSize(count: number): number {
  const ratio = Math.sqrt(count / MAX_COUNT);
  return Math.round(12 + ratio * 14); // 12px .. 26px
}

// =====================================================================
// Sub-components
// =====================================================================

interface MapPinButtonProps {
  city: CityPin;
  index: number;
  isHovered: boolean;
  onHover: Dispatch<SetStateAction<number | null>>;
  onClick: (city: CityPin) => void;
  prefersReduced: boolean;
}

function MapPinButton({
  city,
  index,
  isHovered,
  onHover,
  onClick,
  prefersReduced,
}: MapPinButtonProps) {
  const size = pinSize(city.count);
  return (
    <motion.button
      type="button"
      initial={prefersReduced ? undefined : { scale: 0, opacity: 0 }}
      whileInView={prefersReduced ? undefined : { scale: 1, opacity: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        delay: prefersReduced ? 0 : 0.4 + index * 0.07,
        type: "spring",
        stiffness: 300,
        damping: 18,
      }}
      onMouseEnter={() => onHover(city.rank)}
      onMouseLeave={() => onHover((h) => (h === city.rank ? null : h))}
      onFocus={() => onHover(city.rank)}
      onBlur={() => onHover((h) => (h === city.rank ? null : h))}
      onClick={() => onClick(city)}
      aria-label={`${city.name} — ${city.count} freelancers. Top categories: ${city.cats.join(", ")}. Browse freelancers in ${city.name}.`}
      className="absolute -translate-x-1/2 -translate-y-1/2 z-10 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#748684] focus-visible:ring-offset-2 focus-visible:ring-offset-[#192d2f] rounded-full"
      style={{
        left: `${city.x}%`,
        top: `${city.y}%`,
        width: size,
        height: size,
      }}
    >
      {/* Pulsing ring — disabled under prefers-reduced-motion */}
      {!prefersReduced && (
        <motion.span
          className="absolute inset-0 rounded-full bg-[#748684]"
          initial={{ opacity: 0.55, scale: 1 }}
          animate={{ opacity: [0.55, 0], scale: [1, 2.6] }}
          transition={{
            duration: 2.2,
            repeat: Infinity,
            ease: "easeOut",
            delay: index * 0.18,
          }}
          aria-hidden
        />
      )}

      {/* Core dot — color flips on hover/focus */}
      <span
        className={cn(
          "relative block rounded-full transition-all duration-200",
          isHovered
            ? "bg-white ring-2 ring-[#32504d]"
            : "bg-[#32504d] ring-2 ring-white/60"
        )}
        style={{ width: size, height: size }}
      />

      {/* City name label */}
      <span
        className={cn(
          "absolute left-1/2 -translate-x-1/2 top-full mt-1.5 whitespace-nowrap text-[10px] sm:text-xs font-medium transition-colors pointer-events-none",
          isHovered ? "text-white" : "text-white/65"
        )}
      >
        {city.name}
      </span>

      {/* Hover tooltip — city + count + top 2 categories */}
      {isHovered && (
        <span
          role="tooltip"
          className="absolute z-30 left-1/2 -translate-x-1/2 bottom-full mb-2 w-max max-w-[220px] rounded-lg border border-white/15 bg-[#192d2f]/95 backdrop-blur-md p-3 shadow-xl pointer-events-none"
        >
          <span className="block text-xs font-semibold text-white">
            {city.name}
          </span>
          <span className="block text-[11px] text-white/70 mt-0.5 tabular-nums">
            {formatNumber(city.count)} freelancers ·{" "}
            {((city.count / TOTAL_FREELANCERS) * 100).toFixed(1)}% of network
          </span>
          <span className="block mt-2 text-[9px] uppercase tracking-[0.15em] text-[#94a8a4]">
            Top categories
          </span>
          <span className="flex flex-wrap gap-1 mt-1">
            {city.cats.map((cat) => (
              <span
                key={cat}
                className="text-[10px] px-1.5 py-0.5 rounded bg-[#32504d]/40 text-white/85"
              >
                {cat}
              </span>
            ))}
          </span>
        </span>
      )}
    </motion.button>
  );
}

// =====================================================================
// Main component
// =====================================================================

export function TunisianCities() {
  const prefersReduced = useReducedMotion();
  const { setView } = useApp();
  const [hovered, setHovered] = useState<number | null>(null);

  const goToBrowse = (city: CityPin) => {
    toast(`Browsing freelancers in ${city.name}`, {
      description: `Showing ${formatNumber(city.count)} verified local talents.`,
    });
    setView("freelancers");
  };

  return (
    <section
      id="tunisian-cities"
      className="py-16 sm:py-24 bg-muted/30"
      aria-label="Tunisian cities where Khidma freelancers are based"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="KHIDMA ACROSS TUNISIA"
          title="Talent in every wilaya"
          description="From Tunis to Tataouine, Khidma freelancers span 24 cities across the country. Find local talent or work with the best, wherever they are."
        />

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 lg:gap-8">
          {/* ─────────────────────────────────────────────────────── */}
          {/* Stylized "map" — desktop only (lg+)                    */}
          {/* ─────────────────────────────────────────────────────── */}
          <Reveal className="lg:col-span-3" delay={0.05}>
            <Card className="relative overflow-hidden border-border/60 bg-gradient-to-br from-[#192d2f] via-[#2b3d3d] to-[#192d2f] h-[480px] sm:h-[560px] lg:h-[620px]">
              {/* Accurate Tunisia SVG outline */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none" aria-hidden>
                <svg
                  viewBox="0 0 100 100"
                  preserveAspectRatio="xMidYMid meet"
                  className="h-full w-full"
                  style={{ filter: "drop-shadow(0 0 20px rgba(116,134,132,0.15))" }}
                >
                  {/* Tunisia fill */}
                  <path
                    d={TUNISIA_SVG_PATH}
                    fill="rgba(50, 80, 77, 0.25)"
                    stroke="rgba(116, 134, 132, 0.4)"
                    strokeWidth="0.4"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>

              {/* dot grid overlay */}
              <div className="absolute inset-0 bg-dot-grid opacity-15" aria-hidden />

              {/* decorative blur blobs */}
              <div
                className="absolute -top-20 -left-20 size-72 rounded-full bg-[#32504d]/20 dark:bg-[#32504d]/30 blur-3xl pointer-events-none"
                aria-hidden
              />
              <div
                className="absolute -bottom-32 -right-10 size-80 rounded-full bg-[#748684]/10 blur-3xl pointer-events-none"
                aria-hidden
              />

              {/* corner labels */}
              <span
                className="absolute top-4 left-5 text-[10px] uppercase tracking-[0.3em] font-semibold text-white/40"
                aria-hidden
              >
                Tunisia 🇹🇳
              </span>
              <span
                className="absolute top-4 right-5 text-[10px] uppercase tracking-[0.3em] font-semibold text-white/40"
                aria-hidden
              >
                24 cities
              </span>

              {/* Mediterranean Sea label */}
              <span
                className="absolute top-12 right-8 text-[9px] uppercase tracking-[0.2em] text-white/20 italic"
                aria-hidden
              >
                Mediterranean Sea
              </span>

              {/* Pins */}
              {CITIES.map((c, i) => (
                <MapPinButton
                  key={c.name}
                  city={c}
                  index={i}
                  isHovered={hovered === c.rank}
                  onHover={setHovered}
                  onClick={goToBrowse}
                  prefersReduced={Boolean(prefersReduced)}
                />
              ))}

              {/* legend */}
              <div className="absolute bottom-4 left-5 flex flex-col gap-1.5 text-[10px] text-white/50">
                <div className="flex items-center gap-2">
                  <span className="size-2 rounded-full bg-[#32504d] ring-2 ring-white/60" />
                  <span>Tap a city to browse local freelancers</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="size-1.5 rounded-full bg-[#32504d]/60" />
                  <span className="size-2.5 rounded-full bg-[#32504d]/80" />
                  <span className="size-3.5 rounded-full bg-[#32504d]" />
                  <span className="ml-1">More freelancers = bigger pin</span>
                </div>
              </div>

              {/* "as of" caption */}
              <span className="absolute bottom-4 right-5 text-[10px] text-white/40">
                Live network · {formatNumber(TOTAL_FREELANCERS)} verified
              </span>
            </Card>
          </Reveal>

          {/* ─────────────────────────────────────────────────────── */}
          {/* Mobile pin grid — replaces the stylized map below lg     */}
          {/* ─────────────────────────────────────────────────────── */}
          <div className="lg:hidden grid grid-cols-2 sm:grid-cols-3 gap-2">
            {CITIES.map((c, i) => (
              <motion.button
                key={c.name}
                type="button"
                initial={prefersReduced ? undefined : { opacity: 0, y: 8 }}
                whileInView={prefersReduced ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-30px" }}
                transition={{
                  delay: prefersReduced ? 0 : i * 0.04,
                  duration: 0.4,
                }}
                onClick={() => goToBrowse(c)}
                className="flex flex-col items-start gap-1 p-3 rounded-lg border border-border/60 bg-card text-left hover:border-[#32504d]/40 hover:bg-[#32504d]/5 dark:bg-[#32504d]/15 transition-colors"
              >
                <span className="text-[10px] text-muted-foreground tabular-nums">
                  #{c.rank}
                </span>
                <span className="text-sm font-semibold text-foreground">
                  {c.name}
                </span>
                <span className="text-[11px] text-muted-foreground tabular-nums">
                  {formatNumber(c.count)} freelancers
                </span>
              </motion.button>
            ))}
          </div>

          {/* ─────────────────────────────────────────────────────── */}
          {/* City list — desktop right column (40%), full-width on mobile */}
          {/* ─────────────────────────────────────────────────────── */}
          <Reveal className="lg:col-span-2" delay={0.1}>
            <Card className="p-0 border-border/60 overflow-hidden">
              <div className="px-5 py-4 border-b border-border/60 bg-muted/40">
                <h3 className="text-sm font-semibold text-foreground">
                  Top cities by freelancer count
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Ranked from largest talent pool to smallest.
                </p>
              </div>

              <div
                className="max-h-[480px] lg:max-h-[620px] overflow-y-auto"
                style={{
                  scrollbarWidth: "thin",
                }}
              >
                <ul className="divide-y divide-border/60">
                  {CITIES.map((c, i) => {
                    const pct = (c.count / TOTAL_FREELANCERS) * 100;
                    const barPct = (c.count / MAX_COUNT) * 100;
                    return (
                      <motion.li
                        key={c.name}
                        initial={
                          prefersReduced ? undefined : { opacity: 0, x: 10 }
                        }
                        whileInView={
                          prefersReduced ? undefined : { opacity: 1, x: 0 }
                        }
                        viewport={{ once: true, margin: "-30px" }}
                        transition={{
                          delay: prefersReduced ? 0 : i * 0.04,
                          duration: 0.4,
                        }}
                        className="group relative"
                      >
                        <button
                          type="button"
                          onClick={() => goToBrowse(c)}
                          className="w-full text-left px-5 py-4 hover:bg-[#32504d]/5 dark:bg-[#32504d]/15 transition-colors focus-visible:outline-none focus-visible:bg-[#32504d]/5 dark:bg-[#32504d]/15"
                          aria-label={`Browse ${formatNumber(c.count)} freelancers in ${c.name}`}
                        >
                          <div className="flex items-start gap-3">
                            {/* rank pill */}
                            <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-[#32504d]/10 dark:bg-[#32504d]/20 text-[11px] font-bold text-[#32504d] dark:text-[#9bb3ae] tabular-nums">
                              {c.rank}
                            </span>

                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-2">
                                <span className="text-base font-semibold text-foreground truncate">
                                  {c.name}
                                </span>
                                <div className="flex items-center gap-2 shrink-0">
                                  <span className="text-xs text-muted-foreground tabular-nums whitespace-nowrap">
                                    {formatNumber(c.count)} · {pct.toFixed(1)}%
                                  </span>
                                  {/* "Browse {city}" — appears on hover/focus */}
                                  <span className="hidden sm:inline-flex items-center gap-0.5 text-xs font-medium text-[#32504d] dark:text-[#9bb3ae] opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 group-focus-visible:opacity-100 group-focus-visible:translate-x-0 transition-all duration-200">
                                    Browse
                                    <ArrowUpRight className="size-3" />
                                  </span>
                                </div>
                              </div>

                              {/* top 2 categories */}
                              <div className="flex flex-wrap gap-1 mt-1.5">
                                {c.cats.map((cat) => (
                                  <span
                                    key={cat}
                                    className="text-[10px] px-1.5 py-0.5 rounded bg-muted text-muted-foreground"
                                  >
                                    {cat}
                                  </span>
                                ))}
                              </div>

                              {/* count bar — width proportional to count */}
                              <div className="mt-2.5 h-1 rounded-full bg-muted overflow-hidden">
                                <motion.div
                                  className="h-full rounded-full"
                                  style={{
                                    background:
                                      "linear-gradient(90deg, #32504d 0%, #475959 50%, #748684 100%)",
                                  }}
                                  initial={
                                    prefersReduced
                                      ? { width: `${barPct}%` }
                                      : { width: 0 }
                                  }
                                  whileInView={{ width: `${barPct}%` }}
                                  viewport={{ once: true, margin: "-30px" }}
                                  transition={{
                                    duration: 0.8,
                                    delay: prefersReduced ? 0 : 0.2 + i * 0.04,
                                    ease: "easeOut",
                                  }}
                                />
                              </div>
                            </div>
                          </div>
                        </button>
                      </motion.li>
                    );
                  })}
                </ul>
              </div>
            </Card>
          </Reveal>
        </div>

        {/* ─────────────────────────────────────────────────────── */}
        {/* Stats strip                                             */}
        {/* ─────────────────────────────────────────────────────── */}
        <Reveal delay={0.15}>
          <div className="mt-8 sm:mt-10 grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {[
              {
                label: "Cities covered",
                value: "24",
                hint: "across Tunisia",
              },
              {
                label: "Verified freelancers",
                value: formatNumber(TOTAL_FREELANCERS),
                hint: "identity-checked",
              },
              {
                label: "Cities with 50+ freelancers",
                value: "12",
                hint: "half the network",
              },
              {
                label: "Cities with 100+ freelancers",
                value: "4",
                hint: "major hubs",
              },
            ].map((stat) => (
              <Card
                key={stat.label}
                className="p-4 sm:p-5 border-border/60 bg-card text-center"
              >
                <div className="font-display text-2xl sm:text-3xl font-bold text-[#32504d] dark:text-[#9bb3ae] tabular-nums">
                  {stat.value}
                </div>
                <div className="mt-1 text-xs sm:text-sm text-foreground font-medium">
                  {stat.label}
                </div>
                <div className="mt-0.5 text-[10px] text-muted-foreground uppercase tracking-[0.15em]">
                  {stat.hint}
                </div>
              </Card>
            ))}
          </div>
        </Reveal>

        {/* Inline MapPin badge — gives the section a Khidma-branded footer cue */}
        <Reveal delay={0.2}>
          <div className="mt-8 flex items-center justify-center gap-2 text-xs text-muted-foreground">
            <MapPin className="size-3.5 text-[#32504d] dark:text-[#9bb3ae]" />
            <span>
              Khidma is built in Tunisia 🇹🇳 — for Tunisian freelancers and the
              clients who hire them.
            </span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

export default TunisianCities;
