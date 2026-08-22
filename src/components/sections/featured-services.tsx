"use client";
import { useT } from "@/lib/use-t";

import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ServiceCard } from "@/components/khidma/service-card";
import { Reveal } from "@/components/khidma/reveal";
import { useApp } from "@/lib/store";
import { getAllServices } from "@/lib/khidma-data";

export function FeaturedServices() {
  const { t } = useT();
  const { setView } = useApp();
  const services = getAllServices().slice(0, 6);

  return (
    <section id="featured-services" className="py-16 sm:py-24 bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10 sm:mb-14">
          <Reveal className="max-w-2xl">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#748684]">
              Ready-to-Buy Services
            </span>
            <h2 className="mt-2 font-display text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
              {t("section.featuredServices")}
            </h2>
            <p className="mt-3 text-base text-muted-foreground">
              Pre-packaged offerings from verified freelancers. Transparent
              pricing, clear delivery times, and revisions included.
            </p>
          </Reveal>
          <Reveal delay={0.1} className="shrink-0">
            <Button
              variant="outline"
              onClick={() => setView("services")}
              className="self-start sm:self-auto shrink-0 group"
            >
              View all services
              <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
            </Button>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {services.map((s, i) => (
            <Reveal key={s.id} delay={0.05 * i}>
              <ServiceCard service={s} index={i} />
            </Reveal>
          ))}
        </div>

        <div className="mt-10 flex justify-center sm:hidden">
          <Button
            variant="outline"
            onClick={() => setView("services")}
            className="group"
          >
            View all services
            <ArrowRight className="size-4 transition-transform duration-200 group-hover:translate-x-1" />
          </Button>
        </div>
      </div>
    </section>
  );
}

export default FeaturedServices;
