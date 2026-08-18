"use client";

import { motion } from "framer-motion";
import { Star, Clock, Zap } from "lucide-react";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useApp } from "@/lib/store";
import { formatTND, formatNumber, type Service } from "@/lib/khidma-data";
import { getFreelancerById } from "@/lib/khidma-data";

export function ServiceCard({ service: s, index = 0 }: { service: Service; index?: number }) {
  const { openService } = useApp();
  const f = getFreelancerById(s.freelancerId);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      <Card
        onClick={() => openService(s.id)}
        className="khidma-card group cursor-pointer overflow-hidden p-0 border-border/60 hover:border-[#32504d]/40"
      >
        {/* Cover */}
        <div className="relative aspect-[16/9] overflow-hidden bg-muted">
          <Image
            src={s.cover}
            alt={s.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <div className="absolute top-2 left-2">
            <Badge className="bg-white/90 text-[#2b3d3d] hover:bg-white/90 text-[10px] gap-1">
              <Zap className="size-2.5" />
              {s.deliveryDays}-day delivery
            </Badge>
          </div>
          <div className="absolute bottom-2 left-3 text-white text-xs font-medium">
            {s.category}
          </div>
        </div>

        <div className="p-4 space-y-3">
          {/* Freelancer */}
          {f && (
            <div className="flex items-center gap-2">
              <Avatar className="size-6">
                <AvatarImage src={f.avatar} alt={f.name} />
                <AvatarFallback className="text-[10px]">{f.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <span className="text-xs text-muted-foreground truncate">
                by <span className="text-foreground font-medium">{f.name}</span>
              </span>
            </div>
          )}

          {/* Title */}
          <h3 className="font-semibold text-sm leading-snug line-clamp-2 group-hover:text-[#32504d] transition-colors min-h-[2.5rem]">
            {s.title}
          </h3>

          {/* Rating */}
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-1">
              <Star className="size-3.5 fill-amber-400 text-amber-400" />
              <span className="font-semibold">{s.rating.toFixed(1)}</span>
              <span className="text-muted-foreground">({formatNumber(s.ordersCount)})</span>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground">
              <Clock className="size-3" />
              {s.deliveryDays}d
            </div>
          </div>

          {/* Footer */}
          <div className="pt-3 border-t border-border/60 flex items-end justify-between">
            <div>
              <div className="text-[10px] text-muted-foreground uppercase tracking-wider">
                Starting at
              </div>
              <div className="text-base font-bold text-foreground">
                {formatTND(s.startingPrice)}
              </div>
            </div>
            <Button
              size="sm"
              variant="outline"
              className="h-8 text-xs group-hover:bg-[#2b3d3d] group-hover:text-white group-hover:border-[#2b3d3d] transition-colors"
            >
              View Service
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
