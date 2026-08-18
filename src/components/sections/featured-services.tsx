"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ServiceCard } from "@/components/khidma/service-card";
import { useApp } from "@/lib/store";
import { getAllServices } from "@/lib/khidma-data";

export function FeaturedServices() {
  const { setView } = useApp();
  const services = getAllServices().slice(0, 6);

  return (
    <section className="py-16 sm:py-24 bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10 sm:mb-14">
          <div className="max-w-2xl">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#748684]">
              Ready-to-Buy Services
            </span>
            <h2 className="mt-2 font-display text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
              Popular Services
            </h2>
            <p className="mt-3 text-base text-muted-foreground">
              Pre-packaged offerings from verified freelancers. Transparent
              pricing, clear delivery times, and revisions included.
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => setView("services")}
            className="self-start sm:self-auto shrink-0 group"
          >
            View all services
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </Button>
        </div>

        <motion.div
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          variants={{
            hidden: {},
            show: { transition: { staggerChildren: 0.08 } },
          }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6"
        >
          {services.map((s, i) => (
            <motion.div
              key={s.id}
              variants={{
                hidden: { opacity: 0, y: 18 },
                show: { opacity: 1, y: 0, transition: { duration: 0.45 } },
              }}
            >
              <ServiceCard service={s} index={i} />
            </motion.div>
          ))}
        </motion.div>

        <div className="mt-10 flex justify-center sm:hidden">
          <Button
            variant="outline"
            onClick={() => setView("services")}
            className="group"
          >
            View all services
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </Button>
        </div>
      </div>
    </section>
  );
}

export default FeaturedServices;
