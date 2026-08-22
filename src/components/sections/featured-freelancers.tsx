"use client";
import { useT } from "@/lib/use-t";

import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { FreelancerCard } from "@/components/khidma/freelancer-card";
import { Reveal } from "@/components/khidma/reveal";
import { useApp } from "@/lib/store";
import { freelancers } from "@/lib/khidma-data";

export function FeaturedFreelancers() {
  const { t } = useT();
  const { setView } = useApp();
  const featured = freelancers.filter((f) => f.featured);

  return (
    <section id="featured-freelancers" className="py-16 sm:py-24 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10 sm:mb-14">
          <Reveal className="max-w-2xl">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#748684]">
              Featured Talent
            </span>
            <h2 className="mt-2 font-display text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
              {t("section.featuredFreelancers")}
            </h2>
            <p className="mt-3 text-base text-muted-foreground">
              Hand-picked freelancers who passed our verification process ,
              identity, portfolio, and reputation reviewed.
            </p>
          </Reveal>
          <Reveal delay={0.1} className="shrink-0">
            <Button
              variant="outline"
              onClick={() => setView("freelancers")}
              className="self-start sm:self-auto shrink-0 group"
            >
              View all freelancers
              <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
            </Button>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {featured.map((f, i) => (
            <Reveal key={f.id} delay={0.05 * i}>
              <FreelancerCard freelancer={f} index={i} />
            </Reveal>
          ))}
        </div>

        <div className="mt-10 flex justify-center sm:hidden">
          <Button
            variant="outline"
            onClick={() => setView("freelancers")}
            className="group"
          >
            View all freelancers
            <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
          </Button>
        </div>
      </div>
    </section>
  );
}

export default FeaturedFreelancers;
