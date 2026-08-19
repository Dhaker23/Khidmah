"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogPortal,
  DialogOverlay,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Star,
  Clock,
  CheckCircle2,
  Zap,
  ShoppingCart,
  Eye,
  X,
  Award,
  Share2,
  Flag,
} from "lucide-react";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { useApp } from "@/lib/store";
import { toast } from "sonner";
import { getAllServices, getFreelancerById, formatTND, formatNumber } from "@/lib/khidma-data";
import { VerificationBadge } from "@/components/khidma/verification";
import { cn } from "@/lib/utils";

type PkgKey = "basic" | "standard" | "premium";

export function ServiceDetailModal() {
  const {
    modal: { selectedServiceId },
    closeService,
    openFreelancer,
    openAuth,
    currentUser,
    openShare,
    openReport,
  } = useApp();
  const [pkg, setPkg] = useState<PkgKey>("standard");
  const [lastServiceId, setLastServiceId] = useState(selectedServiceId);
  // Reset to standard package when a new service is opened (React 19 render-time adjustment)
  if (selectedServiceId && selectedServiceId !== lastServiceId) {
    setLastServiceId(selectedServiceId);
    setPkg("standard");
  }

  useEffect(() => {
    if (selectedServiceId) {
      const orig = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = orig;
      };
    }
  }, [selectedServiceId]);

  if (!selectedServiceId) return null;
  const service = getAllServices().find((s) => s.id === selectedServiceId);
  if (!service) return null;

  const freelancer = getFreelancerById(service.freelancerId);
  const currentPkg = service.packages[pkg];

  const handleOrder = () => {
    if (!currentUser) {
      toast.info("Please log in to continue.", {
        action: {
          label: "Log in",
          onClick: () => openAuth("login"),
        },
      });
      return;
    }
    toast.success("Continue to order summary", {
      description: `${currentPkg.name} package · ${formatTND(currentPkg.price)}`,
    });
  };

  return (
    <Dialog
      open={!!selectedServiceId}
      onOpenChange={(o) => !o && closeService()}
    >
      <DialogPortal>
        <DialogOverlay className="bg-[#192d2f]/70 backdrop-blur-sm" />
        <DialogContent
          className="p-0 gap-0 max-w-4xl w-[calc(100%-2rem)] max-h-[92vh] flex flex-col overflow-hidden"
          aria-describedby={undefined}
          showCloseButton
        >
          <DialogTitle className="sr-only">{service.title}</DialogTitle>
          <DialogDescription className="sr-only">
            Service: {service.title} by {freelancer?.name}. Starting at{" "}
            {formatTND(service.startingPrice)}.
          </DialogDescription>

          {/* Mobile close button */}
          <button
            onClick={closeService}
            className="absolute top-3 right-3 z-10 size-9 rounded-full bg-black/30 hover:bg-black/50 text-white flex items-center justify-center backdrop-blur-sm lg:hidden"
            aria-label="Close service"
          >
            <X className="size-4" />
          </button>

          <ScrollArea className="flex-1">
            <div className="grid lg:grid-cols-[1.4fr_1fr]">
              {/* LEFT: cover + description + packages */}
              <div className="space-y-5">
                <div className="relative aspect-[16/9] bg-muted overflow-hidden">
                  <Image
                    src={service.cover}
                    alt={service.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 60vw"
                    className="object-cover"
                    priority
                  />
                  <div className="absolute top-2 left-2 flex gap-1.5">
                    <Badge className="bg-white/90 text-[#2b3d3d] hover:bg-white/90 text-[10px] gap-1">
                      <Zap className="size-2.5" />
                      {service.deliveryDays}d delivery
                    </Badge>
                    <Badge className="bg-white/90 text-[#2b3d3d] hover:bg-white/90 text-[10px] gap-1">
                      <Clock className="size-2.5" />
                      {service.revisions} revisions
                    </Badge>
                  </div>
                </div>

                <div className="px-5 sm:px-7 space-y-5 pb-5">
                  {/* Freelancer mini-card */}
                  {freelancer && (
                    <button
                      onClick={() => openFreelancer(freelancer.id)}
                      className="w-full text-left flex items-center gap-3 rounded-xl border border-border/70 p-2.5 hover:border-[#32504d]/40 hover:bg-[#32504d]/5 transition-colors"
                    >
                      <Avatar className="size-10">
                        <AvatarImage src={freelancer.avatar} alt={freelancer.name} />
                        <AvatarFallback className="bg-[#32504d] text-white">
                          {freelancer.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <span className="text-sm font-semibold truncate">
                            {freelancer.name}
                          </span>
                          {freelancer.topRated && (
                            <Award className="size-3.5 text-amber-500 shrink-0" />
                          )}
                        </div>
                        <p className="text-[11px] text-muted-foreground truncate">
                          {freelancer.title} · {freelancer.location.city}
                        </p>
                      </div>
                      <div className="flex items-center gap-1 shrink-0 text-xs">
                        <Star className="size-3 fill-amber-400 text-amber-400" />
                        <span className="font-semibold">
                          {freelancer.rating.toFixed(1)}
                        </span>
                      </div>
                      {freelancer.verified.identity && (
                        <VerificationBadge type="identity" size="sm" showLabel={false} />
                      )}
                    </button>
                  )}

                  <div>
                    <div className="flex items-start justify-between gap-3">
                      <h1 className="text-lg sm:text-xl font-display font-bold leading-snug flex-1 min-w-0">
                        {service.title}
                      </h1>
                      <div className="flex items-center gap-1 shrink-0 -mt-0.5">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              size="icon"
                              variant="ghost"
                              aria-label={`Share ${service.title}`}
                              className="size-8 text-muted-foreground hover:text-[#32504d] hover:bg-[#32504d]/10"
                              onClick={() =>
                                openShare({
                                  entityType: "service",
                                  entityId: service.id,
                                  entityTitle: service.title,
                                })
                              }
                            >
                              <Share2 className="size-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Share</TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              size="icon"
                              variant="ghost"
                              aria-label={`Report ${service.title}`}
                              className="size-8 text-muted-foreground hover:text-rose-600 hover:bg-rose-500/10"
                              onClick={() =>
                                openReport({
                                  entityType: "service",
                                  entityId: service.id,
                                  entityTitle: service.title,
                                })
                              }
                            >
                              <Flag className="size-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Report this listing</TooltipContent>
                        </Tooltip>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-2 text-xs text-muted-foreground">
                      <span className="inline-flex items-center gap-1">
                        <Star className="size-3.5 fill-amber-400 text-amber-400" />
                        <span className="font-semibold text-foreground">
                          {service.rating.toFixed(1)}
                        </span>
                        <span>
                          ({formatNumber(service.ordersCount)} orders)
                        </span>
                      </span>
                      <span>·</span>
                      <Badge variant="outline" className="text-[10px]">
                        {service.category}
                      </Badge>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold mb-1.5">Description</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {service.description}
                    </p>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold mb-2">Skills included</h3>
                    <div className="flex flex-wrap gap-1.5">
                      {service.skills.map((s) => (
                        <Badge
                          key={s}
                          variant="outline"
                          className="bg-[#32504d]/5 text-[#32504d] border-[#32504d]/20 text-[11px]"
                        >
                          {s}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Packages */}
                  <div>
                    <h3 className="text-sm font-semibold mb-2.5">Choose your package</h3>
                    <Tabs
                      value={pkg}
                      onValueChange={(v) => setPkg(v as PkgKey)}
                    >
                      <TabsList className="grid w-full grid-cols-3 bg-muted/60 h-auto p-1">
                        {(["basic", "standard", "premium"] as PkgKey[]).map((k) => (
                          <TabsTrigger
                            key={k}
                            value={k}
                            className="capitalize text-xs py-2 data-[state=active]:bg-[#2b3d3d] data-[state=active]:text-white"
                          >
                            {service.packages[k].name}
                          </TabsTrigger>
                        ))}
                      </TabsList>

                      <AnimatePresence mode="wait">
                        <motion.div
                          key={pkg}
                          initial={{ opacity: 0, y: 6 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -6 }}
                          transition={{ duration: 0.2 }}
                          className="mt-3 rounded-xl border border-border/70 p-4 space-y-3"
                        >
                          <TabsContent value={pkg} className="m-0 space-y-3">
                            <div className="flex items-end justify-between">
                              <div>
                                <div className="text-xs text-muted-foreground uppercase tracking-wider">
                                  {currentPkg.name}
                                </div>
                                <div className="text-2xl font-bold text-foreground">
                                  {formatTND(currentPkg.price)}
                                </div>
                              </div>
                              <div className="flex gap-3 text-xs text-muted-foreground">
                                <div className="text-right">
                                  <div className="text-[10px] uppercase tracking-wider">
                                    Delivery
                                  </div>
                                  <div className="text-foreground font-semibold">
                                    {currentPkg.deliveryDays} days
                                  </div>
                                </div>
                                <div className="text-right">
                                  <div className="text-[10px] uppercase tracking-wider">
                                    Revisions
                                  </div>
                                  <div className="text-foreground font-semibold">
                                    {currentPkg.revisions}
                                  </div>
                                </div>
                              </div>
                            </div>

                            <ul className="space-y-1.5 pt-2 border-t border-border/60">
                              {currentPkg.features.map((feat) => (
                                <li
                                  key={feat}
                                  className="flex items-start gap-2 text-xs"
                                >
                                  <CheckCircle2 className="size-3.5 text-[#32504d] shrink-0 mt-0.5" />
                                  <span className="text-muted-foreground">{feat}</span>
                                </li>
                              ))}
                            </ul>
                          </TabsContent>
                        </motion.div>
                      </AnimatePresence>
                    </Tabs>
                  </div>
                </div>
              </div>

              {/* RIGHT: sticky order card */}
              <div className="lg:border-l border-border/60 bg-card">
                <div className="sticky top-0 p-5 space-y-4">
                  <div>
                    <div className="text-[10px] text-muted-foreground uppercase tracking-wider">
                      Selected package
                    </div>
                    <div className="flex items-baseline justify-between">
                      <h3 className="text-lg font-bold">{currentPkg.name}</h3>
                      <span className="text-2xl font-bold text-[#32504d]">
                        {formatTND(currentPkg.price)}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="rounded-lg bg-muted/50 p-2.5">
                      <div className="text-[10px] text-muted-foreground uppercase tracking-wider">
                        Delivery
                      </div>
                      <div className="text-sm font-semibold flex items-center gap-1">
                        <Clock className="size-3.5 text-[#32504d]" />
                        {currentPkg.deliveryDays} days
                      </div>
                    </div>
                    <div className="rounded-lg bg-muted/50 p-2.5">
                      <div className="text-[10px] text-muted-foreground uppercase tracking-wider">
                        Revisions
                      </div>
                      <div className="text-sm font-semibold flex items-center gap-1">
                        <CheckCircle2 className="size-3.5 text-[#32504d]" />
                        {currentPkg.revisions}
                      </div>
                    </div>
                  </div>

                  <ul className="space-y-1.5 text-xs">
                    {currentPkg.features.slice(0, 5).map((f) => (
                      <li key={f} className="flex items-start gap-1.5">
                        <CheckCircle2 className="size-3 text-[#32504d] shrink-0 mt-0.5" />
                        <span className="text-muted-foreground">{f}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    onClick={handleOrder}
                    className="w-full bg-[#2b3d3d] hover:bg-[#192d2f] text-white h-11"
                  >
                    <ShoppingCart className="size-4" />
                    Continue to Order
                  </Button>

                  <p className="text-[11px] text-muted-foreground text-center">
                    <CheckCircle2 className="size-3 inline mr-1 text-[#32504d]" />
                    Protected by Khidma escrow — funds released only when you approve
                  </p>

                  <div className="pt-3 border-t border-border/60 text-xs space-y-1.5">
                    <div className="flex justify-between text-muted-foreground">
                      <span>Service fee (5%)</span>
                      <span>{formatTND(currentPkg.price * 0.05)}</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>Processing (2%)</span>
                      <span>{formatTND(currentPkg.price * 0.02)}</span>
                    </div>
                    <div className="flex justify-between font-semibold text-foreground pt-1 border-t border-border/60">
                      <span>Total</span>
                      <span>{formatTND(currentPkg.price * 1.07)}</span>
                    </div>
                  </div>

                  <Button variant="outline" className="w-full" size="sm">
                    <Eye className="size-3.5" />
                    Compare packages
                  </Button>
                </div>
              </div>
            </div>
          </ScrollArea>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}
