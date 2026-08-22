"use client";

/**
 * BlogSection
 * -----------
 * "Insights & Resources" , Khidma's blog / educational resources section.
 *
 * Per spec section 96 , blog/educational resources can host advertising.
 * Layout:
 *   1. SectionHeading (eyebrow + title + description)
 *   2. Featured article (2/3 width) + 4 smaller cards (2×2 grid, 1/3 width)
 *   3. Category filter pills (visual filter on mock data)
 *   4. Newsletter subscribe inline form (email + Subscribe → toast)
 *
 * All animations respect `prefers-reduced-motion`.
 */

import { useMemo, useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  Clock,
  Send,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Reveal, SectionHeading } from "@/components/khidma/reveal";
import { useT } from "@/lib/use-t";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

/* ----------------------------------------------------------------------------
 * Types + mock data
 * -------------------------------------------------------------------------- */

type Category =
  | "All"
  | "Freelancing"
  | "Design"
  | "Development"
  | "Marketing"
  | "Tunisian Success Stories"
  | "Payment & Finance";

interface Article {
  id: string;
  title: string;
  excerpt: string;
  category: Exclude<Category, "All">;
  author: {
    name: string;
    avatarSeed: string;
  };
  date: string;
  readTime: number; // minutes
  imageSeed: string;
  featured?: boolean;
}

const CATEGORIES: Category[] = [
  "All",
  "Freelancing",
  "Design",
  "Development",
  "Marketing",
  "Tunisian Success Stories",
  "Payment & Finance",
];

const ARTICLES: Article[] = [
  {
    id: "a1",
    title: "How to write a winning proposal that gets hired",
    excerpt:
      "A 7-step framework used by top-rated Khidma freelancers. Stop sending generic templates, these are the patterns that actually convert clients.",
    category: "Freelancing",
    author: { name: "Amira Ben Salah", avatarSeed: "AmiraB" },
    date: "Mar 12, 2025",
    readTime: 8,
    imageSeed: "khidma-proposal",
    featured: true,
  },
  {
    id: "a2",
    title: "Tunisian freelancer success: from Sfax to Silicon Valley",
    excerpt:
      "Meet Skander, a self-taught developer who went from local gigs in Sfax to contracting with a YC-backed startup in San Francisco.",
    category: "Tunisian Success Stories",
    author: { name: "Skander Gharbi", avatarSeed: "SkanderG" },
    date: "Mar 8, 2025",
    readTime: 6,
    imageSeed: "khidma-sfax",
  },
  {
    id: "a3",
    title: "Next.js 16 best practices for production apps",
    excerpt:
      "App Router patterns, server components, streaming, and the new caching model, what to adopt and what to avoid.",
    category: "Development",
    author: { name: "Yassine Trabelsi", avatarSeed: "YassineT" },
    date: "Mar 4, 2025",
    readTime: 11,
    imageSeed: "khidma-nextjs",
  },
  {
    id: "a4",
    title: "Setting your hourly rate as a beginner freelancer",
    excerpt:
      "Most beginners undercharge by 40%. Here's a simple formula based on your target monthly income, billable hours, and Tunisian market rates.",
    category: "Freelancing",
    author: { name: "Rania Mejri", avatarSeed: "RaniaM" },
    date: "Feb 28, 2025",
    readTime: 5,
    imageSeed: "khidma-rate",
  },
  {
    id: "a5",
    title: "The 1% fee model explained",
    excerpt:
      "Why Khidma charges the lowest platform fee in MENA, how it's calculated, and what's covered by the 1%.",
    category: "Payment & Finance",
    author: { name: "Khidma Team", avatarSeed: "KhidmaTeam" },
    date: "Feb 24, 2025",
    readTime: 4,
    imageSeed: "khidma-fee",
  },
  {
    id: "a6",
    title: "Building a portfolio that converts visitors into clients",
    excerpt:
      "The 5-section portfolio structure used by Khidma's Top Rated freelancers, case study, impact metrics, process, testimonials, and CTA.",
    category: "Design",
    author: { name: "Lina Khelifi", avatarSeed: "LinaK" },
    date: "Feb 20, 2025",
    readTime: 7,
    imageSeed: "khidma-portfolio",
  },
  {
    id: "a7",
    title: "Payment methods for Tunisian freelancers in 2025",
    excerpt:
      "A comparison of Khidma Wallet, bank transfers, e-Dinar, and international options like Payoneer and Wise, fees, speed, and limits.",
    category: "Payment & Finance",
    author: { name: "Omar Zribi", avatarSeed: "OmarZ" },
    date: "Feb 16, 2025",
    readTime: 9,
    imageSeed: "khidma-payments",
  },
  {
    id: "a8",
    title: "Top 10 in-demand skills for 2025",
    excerpt:
      "From AI-augmented design to Flutter and edge-deployed backends, the skills Khidma clients are searching for this quarter.",
    category: "Marketing",
    author: { name: "Khidma Team", avatarSeed: "KhidmaTeam2" },
    date: "Feb 12, 2025",
    readTime: 6,
    imageSeed: "khidma-skills",
  },
];

/* ----------------------------------------------------------------------------
 * Helpers
 * -------------------------------------------------------------------------- */

function CategoryBadge({ category }: { category: Exclude<Category, "All"> }) {
  return (
    <Badge
      variant="outline"
      className="bg-[#32504d]/8 border-[#32504d]/25 dark:border-[#32504d]/30 text-[#32504d] dark:text-[#9bb3ae] backdrop-blur-sm"
    >
      {category}
    </Badge>
  );
}

function AuthorRow({ author, date }: { author: Article["author"]; date: string }) {
  return (
    <div className="flex items-center gap-2">
      <Avatar className="size-7 border border-border/60">
        <AvatarImage
          src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
            author.avatarSeed
          )}&backgroundColor=32504d&radius=50`}
          alt={author.name}
        />
        <AvatarFallback className="text-[10px] bg-[#32504d] text-white">
          {author.name
            .split(" ")
            .map((w) => w[0])
            .join("")
            .slice(0, 2)}
        </AvatarFallback>
      </Avatar>
      <span className="text-xs font-medium text-foreground/80">{author.name}</span>
      <span className="text-muted-foreground/50" aria-hidden>
        ·
      </span>
      <span className="text-xs text-muted-foreground">{date}</span>
    </div>
  );
}

/* ----------------------------------------------------------------------------
 * Featured article card (large, left)
 * -------------------------------------------------------------------------- */

function FeaturedCard({ article }: { article: Article }) {
  const prefersReduced = useReducedMotion();
  const { t } = useT();
  return (
    <motion.article
      initial={prefersReduced ? undefined : { opacity: 0, y: 20 }}
      whileInView={prefersReduced ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      whileHover={prefersReduced ? undefined : { y: -6 }}
      className="group relative h-full"
    >
      <Card className="overflow-hidden h-full border-border/60 hover:border-[#32504d]/50 hover:shadow-xl hover:shadow-[#32504d]/10 transition-all duration-300 p-0">
        <div className="relative aspect-[16/9] sm:aspect-[2/1] overflow-hidden">
          <Image
            src={`https://picsum.photos/seed/${article.imageSeed}/960/480`}
            alt={article.title}
            fill
            sizes="(min-width: 1024px) 640px, 100vw"
            className="object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#192d2f]/85 via-[#192d2f]/25 to-transparent" />
          <div className="absolute top-4 left-4">
            <CategoryBadge category={article.category} />
          </div>
          <div className="absolute bottom-4 left-4 right-4 flex items-center gap-3 text-white/85 text-xs">
            <span className="inline-flex items-center gap-1.5">
              <Clock className="size-3.5" />
              {t("section.blog.minRead", { count: article.readTime })}
            </span>
            <span className="text-white/40" aria-hidden>
              ·
            </span>
            <span className="inline-flex items-center gap-1.5">
              {t("section.blog.featured")}
            </span>
          </div>
        </div>

        <div className="p-6 sm:p-7 space-y-4">
          <h3 className="font-display text-2xl sm:text-[28px] font-bold leading-tight tracking-tight text-foreground group-hover:text-[#32504d] dark:text-[#9bb3ae] dark:group-hover:text-[#9bb3ae] transition-colors">
            <button
              type="button"
              onClick={() => toast.info("Article reader coming soon", { description: article.title })}
              className="text-left"
            >
              {article.title}
            </button>
          </h3>
          <p className="text-muted-foreground text-sm sm:text-base leading-relaxed line-clamp-2">
            {article.excerpt}
          </p>
          <div className="flex items-center justify-between pt-2">
            <AuthorRow author={article.author} date={article.date} />
            <Button
              variant="ghost"
              size="sm"
              className="text-[#32504d] dark:text-[#9bb3ae] hover:bg-[#32504d]/10 dark:bg-[#32504d]/20 -mr-2"
              onClick={() => toast.info("Article reader coming soon", { description: article.title })}
            >
              {t("section.blog.readArticle")}
              <ArrowRight className="ml-1.5 size-4 transition-transform group-hover:translate-x-0.5" />
            </Button>
          </div>
        </div>
      </Card>
    </motion.article>
  );
}

/* ----------------------------------------------------------------------------
 * Small article card (right grid)
 * -------------------------------------------------------------------------- */

function SmallCard({ article, index }: { article: Article; index: number }) {
  const prefersReduced = useReducedMotion();
  const { t } = useT();
  return (
    <motion.article
      initial={prefersReduced ? undefined : { opacity: 0, y: 16 }}
      whileInView={prefersReduced ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{
        duration: 0.5,
        delay: prefersReduced ? 0 : 0.05 + index * 0.06,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={prefersReduced ? undefined : { y: -4 }}
      className="group h-full"
    >
      <Card className="overflow-hidden h-full flex flex-col border-border/60 hover:border-[#32504d]/40 hover:shadow-lg hover:shadow-[#32504d]/5 transition-all duration-300 p-0">
        <div className="relative aspect-[16/10] overflow-hidden">
          <Image
            src={`https://picsum.photos/seed/${article.imageSeed}/400/250`}
            alt={article.title}
            fill
            sizes="(min-width: 1024px) 280px, 50vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#192d2f]/60 to-transparent" />
          <div className="absolute top-2.5 left-2.5">
            <CategoryBadge category={article.category} />
          </div>
        </div>
        <div className="p-4 flex flex-col flex-1 gap-2.5">
          <h4 className="font-display text-sm font-semibold leading-snug text-foreground group-hover:text-[#32504d] dark:text-[#9bb3ae] dark:group-hover:text-[#9bb3ae] transition-colors line-clamp-2">
            {article.title}
          </h4>
          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
            {article.excerpt}
          </p>
          <div className="mt-auto pt-2 flex items-center justify-between">
            <AuthorRow author={article.author} date={article.date} />
          </div>
          <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
            <Clock className="size-3" />
            {t("section.blog.minRead", { count: article.readTime })}
          </div>
        </div>
      </Card>
    </motion.article>
  );
}

/* ----------------------------------------------------------------------------
 * Newsletter form
 * -------------------------------------------------------------------------- */

function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error("Please enter your email address.");
      return;
    }
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!emailOk) {
      toast.error("Please enter a valid email address.");
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      toast.success("Subscribed to Khidma Insights!", {
        description: `You'll receive weekly resources at ${email}.`,
      });
      setEmail("");
    }, 400);
  };

  return (
    <form
      onSubmit={handleSubscribe}
      className="flex flex-col sm:flex-row gap-3 w-full sm:max-w-md"
    >
      <label htmlFor="blog-newsletter-email" className="sr-only">
        Email address
      </label>
      <Input
        id="blog-newsletter-email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@example.com"
        className="bg-background border-border/70 focus-visible:border-[#32504d] h-11"
        autoComplete="email"
      />
      <Button
        type="submit"
        disabled={submitting}
        className="bg-[#32504d] hover:bg-[#475959] text-white h-11 px-5 shrink-0 group"
      >
        Subscribe
        <Send className="ml-2 size-4 transition-transform group-hover:translate-x-0.5" />
      </Button>
    </form>
  );
}

/* ----------------------------------------------------------------------------
 * Section
 * -------------------------------------------------------------------------- */

export function BlogSection() {
  const prefersReduced = useReducedMotion();
  const { t } = useT();
  const [active, setActive] = useState<Category>("All");

  const filtered = useMemo(() => {
    if (active === "All") return ARTICLES;
    return ARTICLES.filter((a) => a.category === active);
  }, [active]);

  const featured = filtered.find((a) => a.featured) ?? filtered[0];
  const rest = filtered.filter((a) => a.id !== featured?.id).slice(0, 4);

  return (
    <section
      id="blog"
      aria-labelledby="blog-heading"
      className="py-16 sm:py-24 bg-gradient-to-b from-[#f7f9f8] via-background to-background dark:from-[#0e1a1b]/40"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow={t("section.eyebrow.khidmaBlog")}
          title={
            <>
              Insights &amp;{" "}
              <span className="text-[#32504d] dark:text-[#9bb3ae]">Resources</span>
            </>
          }
          description={t("section.blog.description")}
        />

        {/* Featured + small grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-10">
          {featured && (
            <div className="lg:col-span-2">
              <FeaturedCard article={featured} />
            </div>
          )}
          <div className="lg:col-span-1 grid grid-cols-2 gap-4 sm:gap-5 content-start">
            {rest.map((a, i) => (
              <SmallCard key={a.id} article={a} index={i} />
            ))}
            {rest.length === 0 && (
              <div className="col-span-2 text-center text-sm text-muted-foreground py-12 border border-dashed border-border/60 rounded-lg">
                {t("section.blog.noArticles")}
              </div>
            )}
          </div>
        </div>

        {/* Category pills */}
        <Reveal>
          <div className="flex flex-wrap items-center gap-2 mb-12">
            {CATEGORIES.map((cat) => {
              const isActive = cat === active;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActive(cat)}
                  aria-pressed={isActive}
                  className={cn(
                    "px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-medium border transition-all",
                    isActive
                      ? "bg-[#32504d] border-[#32504d] text-white shadow-sm shadow-[#32504d]/20"
                      : "bg-background border-border/70 text-muted-foreground hover:border-[#32504d]/40 hover:text-foreground"
                  )}
                >
                  {cat}
                </button>
              );
            })}
          </div>
        </Reveal>

        {/* Newsletter */}
        <Reveal>
          <div className="relative overflow-hidden rounded-2xl border border-[#32504d]/20 dark:border-[#32504d]/30 bg-gradient-to-br from-[#32504d]/10 via-[#6e8580]/8 to-[#748684]/10 dark:from-[#32504d]/20 dark:via-[#6e8580]/12 dark:to-[#748684]/15 p-6 sm:p-8">
            <div
              className="absolute inset-0 opacity-[0.05] pointer-events-none"
              style={{
                backgroundImage:
                  "radial-gradient(circle, #32504d 1px, transparent 1px)",
                backgroundSize: "24px 24px",
              }}
              aria-hidden
            />
            <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <TrendingUp className="size-4 text-[#32504d] dark:text-[#9bb3ae] shrink-0" />
                  <h3 className="font-display text-lg sm:text-xl font-bold tracking-tight">
                    {t("section.blog.newsletter.title")}
                  </h3>
                </div>
                <p className="text-sm text-muted-foreground max-w-md">
                  {t("section.blog.newsletter.body")}
                </p>
              </div>
              <NewsletterForm />
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
