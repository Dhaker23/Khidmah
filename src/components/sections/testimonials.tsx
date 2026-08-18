"use client";

import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { reviews } from "@/lib/khidma-data";

export function Testimonials() {
  // Take up to 4 reviews, prefer higher-rated
  const picks = [...reviews]
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 4);

  return (
    <section className="py-16 sm:py-24 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mb-10 sm:mb-14">
          <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#748684]">
            Success Stories
          </span>
          <h2 className="mt-2 font-display text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
            What clients and freelancers say
          </h2>
          <p className="mt-3 text-base text-muted-foreground">
            Real reviews from real contracts. Every testimonial below comes
            from a verified, paid project on Khidma.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-5 sm:gap-6">
          {picks.map((r, i) => (
            <motion.div
              key={r.id}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
            >
              <Card className="h-full p-6 border-border/60 hover:border-[#32504d]/40 khidma-card relative overflow-hidden">
                <Quote
                  className="absolute top-5 right-5 size-8 text-[#32504d]/8"
                  aria-hidden
                />
                <div className="flex items-center gap-1 mb-4">
                  {Array.from({ length: 5 }).map((_, idx) => (
                    <Star
                      key={idx}
                      className={
                        idx < r.rating
                          ? "size-4 fill-amber-400 text-amber-400"
                          : "size-4 text-muted-foreground/30"
                      }
                    />
                  ))}
                </div>

                <p className="text-sm sm:text-base text-foreground leading-relaxed">
                  &ldquo;{r.comment}&rdquo;
                </p>

                <div className="mt-5 pt-5 border-t border-border/60 flex items-center gap-3">
                  <Avatar className="size-10 border border-border/60">
                    <AvatarImage src={r.fromAvatar} alt={r.fromName} />
                    <AvatarFallback className="bg-[#32504d]/10 text-[#32504d]">
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
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Testimonials;
