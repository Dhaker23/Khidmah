"use client";

import { ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Reveal } from "@/components/khidma/reveal";
import { useApp } from "@/lib/store";
import { categories, formatNumber } from "@/lib/khidma-data";

export function Categories() {
  const { setView } = useApp();

  return (
    <section className="py-16 sm:py-24 bg-muted/30">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10 sm:mb-14">
          <Reveal className="max-w-2xl">
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#748684]">
              Explore by Category
            </span>
            <h2 className="mt-2 font-display text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
              Find the right talent for any project
            </h2>
            <p className="mt-3 text-base text-muted-foreground">
              Browse {categories.length} categories — from development and
              design to voice over, translation, and AI.
            </p>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
          {categories.map((cat, i) => {
            const Icon = cat.icon;
            return (
              <Reveal
                key={cat.id}
                delay={0.05 * (i % 4)}
                className="h-full"
              >
                <button
                  type="button"
                  onClick={() => setView("freelancers")}
                  className="group text-left h-full w-full"
                >
                  <Card className="h-full p-5 border-border/60 hover:border-[#32504d]/40 khidma-card overflow-hidden relative transition-transform duration-200 group-hover:scale-[1.02]">
                    <div
                      className="absolute -top-12 -right-12 size-28 rounded-full opacity-[0.07] blur-2xl pointer-events-none"
                      style={{ backgroundColor: cat.color }}
                    />
                    <div className="flex items-start justify-between mb-4">
                      <div
                        className="flex size-11 items-center justify-center rounded-xl"
                        style={{
                          backgroundColor: `${cat.color}14`,
                          color: cat.color,
                        }}
                      >
                        <Icon className="size-5" />
                      </div>
                      <ArrowRight className="size-4 text-muted-foreground/40 opacity-0 -translate-x-1 transition-all duration-200 group-hover:opacity-100 group-hover:translate-x-0 group-hover:text-[#32504d]" />
                    </div>

                    <div className="flex items-baseline gap-2">
                      <h3 className="font-display text-base font-semibold text-foreground">
                        {cat.name}
                      </h3>
                      <span
                        className="font-arabic text-sm text-muted-foreground"
                        dir="rtl"
                      >
                        {cat.nameAr}
                      </span>
                    </div>

                    <p className="mt-1 text-xs text-muted-foreground">
                      {formatNumber(cat.count)} freelancers
                    </p>

                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {cat.skills.slice(0, 3).map((skill) => (
                        <Badge
                          key={skill}
                          variant="secondary"
                          className="text-[10px] py-0 h-5 font-medium"
                        >
                          {skill}
                        </Badge>
                      ))}
                      {cat.skills.length > 3 && (
                        <Badge
                          variant="outline"
                          className="text-[10px] py-0 h-5 font-medium"
                        >
                          +{cat.skills.length - 3}
                        </Badge>
                      )}
                    </div>
                  </Card>
                </button>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default Categories;
