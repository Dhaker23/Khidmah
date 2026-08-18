"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { JobCard } from "@/components/khidma/job-card";
import { useApp } from "@/lib/store";
import { jobs } from "@/lib/khidma-data";

export function OpenJobs() {
  const { setView } = useApp();
  const previewJobs = jobs.slice(0, 4);

  return (
    <section className="py-16 sm:py-24 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10 sm:mb-14">
          <div className="max-w-2xl">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#748684]">
              Open Opportunities
            </span>
            <h2 className="mt-2 font-display text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
              Latest Job Opportunities
            </h2>
            <p className="mt-3 text-base text-muted-foreground">
              Real projects posted by verified clients. Apply with your profile
              and get hired through escrow-protected contracts.
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => setView("jobs")}
            className="self-start sm:self-auto shrink-0 group"
          >
            Browse all jobs
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
          className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6"
        >
          {previewJobs.map((job, i) => (
            <motion.div
              key={job.id}
              variants={{
                hidden: { opacity: 0, y: 18 },
                show: { opacity: 1, y: 0, transition: { duration: 0.45 } },
              }}
            >
              <JobCard job={job} index={i} />
            </motion.div>
          ))}
        </motion.div>

        <div className="mt-10 flex justify-center sm:hidden">
          <Button
            variant="outline"
            onClick={() => setView("jobs")}
            className="group"
          >
            Browse all jobs
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
          </Button>
        </div>
      </div>
    </section>
  );
}

export default OpenJobs;
