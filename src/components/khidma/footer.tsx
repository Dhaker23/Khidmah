"use client";

import {
  Mail,
  MessageCircle,
  MapPin,
  Github,
  Linkedin,
  Twitter,
  Send,
  Shield,
  Users,
  Briefcase,
  ShoppingBag,
  HelpCircle,
} from "lucide-react";
import { KhidmaLogo } from "./logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useApp } from "@/lib/store";
import { toast } from "sonner";

const footerNav = [
  {
    title: "For Clients",
    icon: Users,
    links: [
      { label: "Find Talent", view: "freelancers" as const },
      { label: "Post a Job", view: "jobs" as const },
      { label: "Browse Services", view: "services" as const },
      { label: "How It Works", view: "how-it-works" as const },
    ],
  },
  {
    title: "For Freelancers",
    icon: Briefcase,
    links: [
      { label: "Find Work", view: "jobs" as const },
      { label: "Become Verified", view: "dashboard" as const },
      { label: "Create Service", view: "dashboard" as const },
      { label: "Withdrawal Options", view: "how-it-works" as const },
    ],
  },
  {
    title: "Marketplace",
    icon: ShoppingBag,
    links: [
      { label: "All Freelancers", view: "freelancers" as const },
      { label: "All Services", view: "services" as const },
      { label: "Open Jobs", view: "jobs" as const },
      { label: "Categories", view: "home" as const },
    ],
  },
  {
    title: "Trust & Safety",
    icon: Shield,
    links: [
      { label: "Verification Process", view: "how-it-works" as const },
      { label: "Secure Contracts", view: "how-it-works" as const },
      { label: "Dispute Resolution", view: "how-it-works" as const },
      { label: "1% Fee Explained", view: "how-it-works" as const },
    ],
  },
];

const socialLinks = [
  { icon: Github, label: "GitHub", href: "#" },
  { icon: Linkedin, label: "LinkedIn", href: "#" },
  { icon: Twitter, label: "Twitter", href: "#" },
];

export function Footer() {
  const { setView } = useApp();

  return (
    <footer className="mt-auto bg-[#0e1a1b] text-white relative overflow-hidden">
      {/* Decorative top gradient line */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#748684] to-transparent opacity-50" />
      {/* Decorative dot grid */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage:
            "radial-gradient(circle, #ffffff 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        {/* CTA + Newsletter */}
        <div className="grid gap-8 lg:grid-cols-2 items-center pb-12 border-b border-white/10">
          <div>
            <h3 className="font-display text-2xl sm:text-3xl font-bold tracking-tight">
              Ready to start your Khidma journey?
            </h3>
            <p className="mt-2 text-white/70 text-sm sm:text-base">
              Join 1,248+ verified Tunisian freelancers and 4,200+ clients building real work, the trusted way.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 lg:justify-end">
            <Input
              type="email"
              placeholder="Enter your email"
              className="bg-white/5 border-white/15 text-white placeholder:text-white/40 h-11 max-w-sm focus-visible:border-[#748684]"
            />
            <Button
              size="lg"
              className="bg-[#32504d] hover:bg-[#475959] text-white h-11 px-6 group"
              onClick={() =>
                toast.success("Subscribed!", {
                  description: "You'll receive Khidma updates at your email.",
                })
              }
            >
              Get Updates
              <Send className="ml-2 size-4 transition-transform group-hover:translate-x-0.5" />
            </Button>
          </div>
        </div>

        {/* Main footer */}
        <div className="grid gap-8 lg:gap-12 py-12 lg:grid-cols-12">
          {/* Brand + Contact */}
          <div className="lg:col-span-4 space-y-6">
            <div>
              <KhidmaLogo variant="full" size="md" className="[&_span]:text-white [&_span:nth-child(2)]:text-white/60" />
              <p className="mt-4 text-sm text-white/70 max-w-sm leading-relaxed">
                Khidma (خدمة) is a trusted freelance marketplace connecting verified Tunisian
                talent with clients locally and globally. Work. Earn. Grow.
              </p>
            </div>

            {/* Contact */}
            <div className="space-y-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-white/50">
                Contact
              </h4>
              <a
                href="mailto:dhakeramarawork@gmail.com"
                className="flex items-center gap-2.5 text-sm text-white/80 hover:text-white transition-colors group"
              >
                <span className="size-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-[#32504d] transition-colors">
                  <Mail className="size-4" />
                </span>
                dhakeramarawork@gmail.com
              </a>
              <a
                href="https://wa.me/21699495558"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 text-sm text-white/80 hover:text-white transition-colors group"
              >
                <span className="size-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-[#32504d] transition-colors">
                  <MessageCircle className="size-4" />
                </span>
                WhatsApp: +216 99 49 55 58
              </a>
              <div className="flex items-center gap-2.5 text-sm text-white/80">
                <span className="size-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
                  <MapPin className="size-4" />
                </span>
                Tunis, Tunisia · Serving Worldwide
              </div>
            </div>

            {/* Social */}
            <div className="flex items-center gap-2">
              {socialLinks.map((s) => {
                const Icon = s.icon;
                return (
                  <a
                    key={s.label}
                    href={s.href}
                    aria-label={s.label}
                    className="size-9 rounded-lg bg-white/5 border border-white/10 hover:bg-[#32504d] hover:border-[#32504d] flex items-center justify-center transition-all"
                  >
                    <Icon className="size-4" />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Nav columns */}
          <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-4 gap-8">
            {footerNav.map((col) => {
              const Icon = col.icon;
              return (
                <div key={col.title} className="space-y-4">
                  <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-white/50">
                    <Icon className="size-3.5" />
                    {col.title}
                  </div>
                  <ul className="space-y-2.5">
                    {col.links.map((link) => (
                      <li key={link.label}>
                        <button
                          onClick={() => setView(link.view)}
                          className="text-sm text-white/70 hover:text-white transition-colors text-left"
                        >
                          {link.label}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        </div>

        <Separator className="bg-white/10" />

        {/* Trust strip */}
        <div className="py-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4 text-xs text-white/60">
          <div className="flex items-center gap-2">
            <Shield className="size-3.5 text-[#748684]" />
            Identity + Portfolio Verification
          </div>
          <div className="flex items-center gap-2">
            <Briefcase className="size-3.5 text-[#748684]" />
            Secure Contracts + Escrow
          </div>
          <div className="flex items-center gap-2">
            <Users className="size-3.5 text-[#748684]" />
            Real People. Real Reviews.
          </div>
          <div className="flex items-center gap-2">
            <HelpCircle className="size-3.5 text-[#748684]" />
            Transparent 1% Platform Fee
          </div>
        </div>

        <Separator className="bg-white/10" />

        {/* Bottom */}
        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <div className="text-xs text-white/50 space-y-1">
            <p>© {new Date().getFullYear()} Khidma — خدمة. All rights reserved.</p>
            <p>
              Designed &amp; Developed by{" "}
              <a
                href="mailto:dhakeramarawork@gmail.com"
                className="font-medium text-white/80 hover:text-white underline-offset-2 hover:underline"
              >
                Amara Dhaker
              </a>
              . Bringing ideas to life through modern digital experiences.
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs text-white/50">
            <button className="hover:text-white/80 transition-colors">Privacy</button>
            <button className="hover:text-white/80 transition-colors">Terms</button>
            <button className="hover:text-white/80 transition-colors">Trust &amp; Safety</button>
          </div>
        </div>
      </div>
    </footer>
  );
}
