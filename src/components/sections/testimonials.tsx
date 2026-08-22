"use client";
import { useT } from "@/lib/use-t";

import { Star, Quote } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Reveal } from "@/components/khidma/reveal";
import { cn } from "@/lib/utils";
import { reviews } from "@/lib/khidma-data";

export function Testimonials() {
  const { t } = useT();
  // Take up to 4 reviews, prefer higher-rated
  const picks = [...reviews]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 4);

  return (
    <section id="testimonials" className="py-16 sm:py-24 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-10 sm:mb-14">
          <Reveal>
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#748684]">
              Success Stories
            </span>
          </Reveal>
          <Reveal delay={0.05}>
            <h2 className="mt-2 font-display text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
              {t("section.testimonials")}
            </h2>
          </Reveal>
          <Reveal delay={0.1}>
            <p className="mt-3 text-base text-muted-foreground">
              Real reviews from real contracts. Every testimonial below comes
              from a verified, paid project on Khidma.
            </p>
          </Reveal>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-5 sm:gap-6">
          {picks.map((r, i) => (
            <Reveal key={r.id} delay={0.05 * i}>
              <Card className="group h-full p-6 border-border/60 hover:border-[#32504d]/40 khidma-card relative overflow-hidden">
                <Quote
                  className="absolute top-5 right-5 size-8 text-[#32504d] dark:text-[#9bb3ae]/8"
                  aria-hidden
                />
                <div className="flex items-center gap-1 mb-4">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <Star
                      key={idx}
                      className={cn(
                        "size-4 transition-transform duration-200",
                        idx < r.rating
                          ? "fill-amber-400 text-amber-400 group-hover:scale-125"
                          : "text-muted-foreground/30"
                      )}
                      style={{ transitionDelay: `${idx * 30}ms` }}
                    />
                  ))}
                </div>

                <p className="text-sm sm:text-base text-foreground leading-relaxed">
                  &ldquo;{r.comment}&rdquo;
                </p>

                <div className="mt-5 pt-5 border-t border-border/60 flex items-center gap-3">
                  <Avatar className="size-10 border border-border/60">
                    <AvatarImage src={r.fromAvatar} alt={r.fromName} />
                    <AvatarFallback className="bg-[#32504d]/10 dark:bg-[#32504d]/20 text-[#32504d] dark:text-[#9bb3ae]">
                      {r.fromName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0 flex-1">
                    <div className="font-semibold text-sm text-foreground truncate">
                      {r.fromName}
                    </div>
                    <div className="text-xs text-muted-foreground truncate">
                      {r.project}
                    </div>
                  </div>
                  <div className="text-right text-xs text-muted-foreground shrink-0">
                    {r.date}
                  </div>
                </div>
              </Card>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Testimonials;
