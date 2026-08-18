"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Star, MapPin, Clock, Heart, Eye } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { VerificationBadge } from "./verification";
import { useApp } from "@/lib/store";
import { formatTND, formatNumber, type Freelancer } from "@/lib/khidma-data";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface FreelancerCardProps {
  freelancer: Freelancer;
  index?: number;
  layout?: "grid" | "list";
}

const availabilityConfig = {
  available: { label: "Available", color: "bg-emerald-500" },
  limited: { label: "Limited", color: "bg-amber-500" },
  booked: { label: "Booked", color: "bg-rose-500" },
} as const;

export function FreelancerCard({ freelancer: f, index = 0, layout = "grid" }: FreelancerCardProps) {
  const { openFreelancer } = useApp();
  const [liked, setLiked] = useState(false);
  const avail = availabilityConfig[f.availability];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      <Card
        onClick={() => openFreelancer(f.id)}
        className="khidma-card group relative cursor-pointer overflow-hidden p-0 border-border/60 hover:border-[#32504d]/40"
      >
        {/* Cover strip */}
        <div className="relative h-20 bg-khidma-gradient overflow-hidden">
          <div
            className="absolute inset-0 opacity-30"
            style={{
              backgroundImage:
                "radial-gradient(circle at 20% 50%, #748684 0%, transparent 50%), radial-gradient(circle at 80% 50%, #32504d 0%, transparent 50%)",
            }}
          />
          <button
            onClick={(e) => {
              e.stopPropagation();
              setLiked((p) => !p);
            }}
            className="absolute top-2 right-2 size-8 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center hover:bg-white/20 transition-colors"
          >
            <Heart className={cn("size-3.5", liked ? "fill-rose-500 text-rose-500" : "text-white")} />
          </button>
          <div className="absolute bottom-2 left-3 flex items-center gap-1.5">
            <span className={cn("size-2 rounded-full", avail.color)} />
            <span className="text-[10px] uppercase tracking-wider text-white/90 font-medium">
              {avail.label}
            </span>
          </div>
        </div>

        <div className="p-4 space-y-3">
          {/* Avatar + Name */}
          <div className="flex items-start gap-3 -mt-10">
            <Avatar className="size-14 border-2 border-background shrink-0">
              <AvatarImage src={f.avatar} alt={f.name} />
              <AvatarFallback>{f.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0 pt-7">
              <h3 className="font-semibold text-sm leading-tight truncate group-hover:text-[#32504d] transition-colors">
                {f.name}
              </h3>
              <p className="text-xs text-muted-foreground truncate">{f.title}</p>
            </div>
          </div>

          {/* Rating + Location */}
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5">
              <Star className="size-3.5 fill-amber-400 text-amber-400" />
              <span className="font-semibold text-foreground">{f.rating.toFixed(1)}</span>
              <span className="text-muted-foreground">({formatNumber(f.reviewsCount)})</span>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <MapPin className="size-3" />
              {f.location.city}, {f.location.country}
            </div>
          </div>

          {/* Skills */}
          <div className="flex flex-wrap gap-1">
            {f.skills.slice(0, 3).map((skill) => (
              <Badge key={skill} variant="secondary" className="text-[10px] py-0 h-5 font-medium">
                {skill}
              </Badge>
            ))}
            {f.skills.length > 3 && (
              <Badge variant="outline" className="text-[10px] py-0 h-5 font-medium">
                +{f.skills.length - 3}
              </Badge>
            )}
          </div>

          {/* Verification badges */}
          <div className="flex flex-wrap gap-1">
            {f.verified.email && <VerificationBadge type="email" showLabel={false} />}
            {f.verified.phone && <VerificationBadge type="phone" showLabel={false} />}
            {f.verified.identity && <VerificationBadge type="identity" showLabel={false} />}
            {f.verified.portfolio && <VerificationBadge type="portfolio" showLabel={false} />}
            {f.topRated && <VerificationBadge type="topRated" showLabel={false} />}
          </div>

          {/* Footer */}
          <div className="pt-3 border-t border-border/60 flex items-center justify-between">
            <div>
              <div className="text-[10px] text-muted-foreground uppercase tracking-wider">From</div>
              <div className="text-sm font-semibold text-foreground">
                {formatTND(f.hourlyRate)}
                <span className="text-[10px] font-normal text-muted-foreground">/hr</span>
              </div>
            </div>
            <Button
              size="sm"
              variant="outline"
              className="h-8 text-xs group-hover:bg-[#2b3d3d] group-hover:text-white group-hover:border-[#2b3d3d] transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                openFreelancer(f.id);
              }}
            >
              View Profile
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

// Compact horizontal variant for lists
export function FreelancerListRow({ freelancer: f, index = 0 }: { freelancer: Freelancer; index?: number }) {
  const { openFreelancer } = useApp();
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3, delay: index * 0.03 }}
      onClick={() => openFreelancer(f.id)}
      className="flex items-center gap-4 p-4 rounded-xl border border-border/60 bg-card hover:border-[#32504d]/40 hover:shadow-sm transition-all cursor-pointer"
    >
      <Avatar className="size-12 border border-border/60">
        <AvatarImage src={f.avatar} alt={f.name} />
        <AvatarFallback>{f.name.charAt(0)}</AvatarFallback>
      </Avatar>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-semibold text-sm truncate">{f.name}</span>
          {f.topRated && <VerificationBadge type="topRated" showLabel={false} />}
        </div>
        <div className="text-xs text-muted-foreground truncate">{f.title}</div>
        <div className="flex items-center gap-3 mt-1 text-[11px] text-muted-foreground">
          <span className="flex items-center gap-1">
            <Star className="size-3 fill-amber-400 text-amber-400" />
            {f.rating.toFixed(1)} ({formatNumber(f.reviewsCount)})
          </span>
          <span className="flex items-center gap-1">
            <MapPin className="size-3" />
            {f.location.city}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="size-3" />
            {f.responseTime}
          </span>
        </div>
      </div>
      <div className="text-right">
        <div className="text-sm font-semibold">{formatTND(f.hourlyRate)}</div>
        <div className="text-[10px] text-muted-foreground">/hour</div>
      </div>
    </motion.div>
  );
}
