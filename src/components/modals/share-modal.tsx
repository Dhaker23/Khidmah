"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogPortal,
  DialogOverlay,
  DialogTitle,
  DialogDescription,
  DialogHeader,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Copy,
  Check,
  Link2,
  ShieldCheck,
  MessageSquare,
  Mail,
  Share2,
} from "lucide-react";
import { useApp } from "@/lib/store";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

/* ----------------------------------------------------------------------------
 * Inline brand SVG icons (lucide-react doesn't ship X / WhatsApp / Telegram).
 * Each is sized via `size` prop, inherits `currentColor` for fill.
 * -------------------------------------------------------------------------- */
type IconProps = { className?: string };

function XIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function FacebookIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" fill="currentColor">
      <path d="M9.101 23.691v-7.98H6.627v-3.667h2.474v-1.58c0-4.085 1.848-5.978 5.858-5.978.401 0 .955.042 1.468.103a8.68 8.68 0 0 1 1.141.195v3.325a8.623 8.623 0 0 0-.653-.036 26.805 26.805 0 0 0-.733-.009c-.707 0-1.259.096-1.675.309a1.69 1.69 0 0 0-.679.622c-.258.42-.371.995-.371 1.752v1.297h3.919l-.386 2.103-.287 1.564h-3.246v8.245C19.396 23.238 24 18.179 24 12.044c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.628 3.874 10.35 9.101 11.647Z" />
    </svg>
  );
}

function LinkedInIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function WhatsAppIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" fill="currentColor">
      <path d="M.057 24l1.687-6.163a11.867 11.867 0 0 1-1.587-5.945C.16 5.335 5.495 0 12.05 0a11.817 11.817 0 0 1 8.413 3.488 11.824 11.824 0 0 1 3.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 0 1-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
    </svg>
  );
}

function TelegramIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" fill="currentColor">
      <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.095.036.31.02.452-.19 1.5-1.005 5.108-1.42 6.786-.176.7-.522.935-.857.968-.728.067-1.282-.48-1.987-.943-1.104-.725-1.726-1.176-2.8-1.885-1.24-.817-.436-1.268.27-2.003.183-.19 3.242-2.97 3.298-3.223.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.244-1.349-.374-1.297-.789.027-.218.324-.441.892-.67 3.486-1.438 5.81-2.386 6.973-2.845 3.322-1.382 4.015-1.622 4.467-1.63z" />
    </svg>
  );
}

interface SocialButton {
  key: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  /** Tailwind hover background + text colors , Khidma teal palette only where possible. */
  hoverClass: string;
  shareUrl: (url: string, text: string) => string;
}

const SOCIALS: SocialButton[] = [
  {
    key: "x",
    label: "Share on X",
    icon: XIcon,
    hoverClass: "hover:bg-foreground hover:text-background",
    shareUrl: (url, text) =>
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
  },
  {
    key: "facebook",
    label: "Share on Facebook",
    icon: FacebookIcon,
    hoverClass: "hover:bg-[#32504d] hover:text-white",
    shareUrl: (url) => `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
  },
  {
    key: "linkedin",
    label: "Share on LinkedIn",
    icon: LinkedInIcon,
    hoverClass: "hover:bg-[#475959] hover:text-white",
    shareUrl: (url, text) =>
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}&summary=${encodeURIComponent(text)}`,
  },
  {
    key: "whatsapp",
    label: "Share on WhatsApp",
    icon: WhatsAppIcon,
    hoverClass: "hover:bg-[#32504d] hover:text-white",
    shareUrl: (url, text) =>
      `https://api.whatsapp.com/send?text=${encodeURIComponent(`${text} ${url}`)}`,
  },
  {
    key: "telegram",
    label: "Share on Telegram",
    icon: TelegramIcon,
    hoverClass: "hover:bg-[#475959] hover:text-white",
    shareUrl: (url, text) =>
      `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(text)}`,
  },
  {
    key: "email",
    label: "Share via Email",
    icon: Mail,
    hoverClass: "hover:bg-[#2b3d3d] hover:text-white",
    shareUrl: (url, text) =>
      `mailto:?subject=${encodeURIComponent(text)}&body=${encodeURIComponent(`Check this out: ${url}`)}`,
  },
];

const ENTITY_LABEL: Record<string, string> = {
  freelancer: "freelancer",
  service: "service",
  job: "job",
};

export function ShareModal() {
  const {
    modal: { shareOpen, sharePayload },
    closeShare,
    openMessaging,
  } = useApp();

  const [copied, setCopied] = useState(false);

  // Reset copied state whenever the modal opens/closes
  useEffect(() => {
    if (!shareOpen) {
      const t = setTimeout(() => setCopied(false), 300);
      return () => clearTimeout(t);
    }
  }, [shareOpen]);

  const shareUrl = useMemo(() => {
    if (!sharePayload) return "";
    return `https://khidma.tn/${sharePayload.entityType}/${sharePayload.entityId}`;
  }, [sharePayload]);

  const shareText = useMemo(() => {
    if (!sharePayload) return "";
    return sharePayload.entityType === "freelancer"
      ? `Check out ${sharePayload.entityTitle} on Khidma`
      : sharePayload.entityType === "service"
        ? `${sharePayload.entityTitle} , on Khidma`
        : `Job: ${sharePayload.entityTitle} , on Khidma`;
  }, [sharePayload]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast.success("Link copied!", {
        description: "Share it with anyone , they can view the public profile.",
      });
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // Fallback for browsers without clipboard API permissions
      const ta = document.createElement("textarea");
      ta.value = shareUrl;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand("copy");
        setCopied(true);
        toast.success("Link copied!");
        setTimeout(() => setCopied(false), 1800);
      } catch {
        toast.error("Couldn't copy , please copy the link manually.");
      }
      document.body.removeChild(ta);
    }
  };

  const handleShare = (s: SocialButton) => {
    window.open(s.shareUrl(shareUrl, shareText), "_blank", "noopener,noreferrer,width=620,height=640");
  };

  const handleShareViaMessages = () => {
    closeShare();
    openMessaging();
    toast.info("Opening messages…", {
      description: sharePayload
        ? `Share "${sharePayload.entityTitle}" in a new conversation.`
        : "Start a new conversation to share.",
    });
  };

  const entityLabel = sharePayload ? ENTITY_LABEL[sharePayload.entityType] : "item";

  return (
    <Dialog open={shareOpen} onOpenChange={(o) => !o && closeShare()}>
      <DialogPortal>
        <DialogOverlay className="bg-[#192d2f]/70 backdrop-blur-sm" />
        <DialogContent
          className="max-w-md w-[calc(100%-2rem)] p-0 gap-0 overflow-hidden"
          aria-describedby={undefined}
          showCloseButton
        >
          <DialogHeader className="px-5 pt-5 pb-3 border-b border-border/60">
            <DialogTitle className="flex items-center gap-2 text-base font-display font-bold">
              <Share2 className="size-4 text-[#32504d] dark:text-[#9bb3ae]" />
              Share
            </DialogTitle>
            <DialogDescription className="text-xs">
              {sharePayload ? (
                <span className="block truncate">
                  Sharing {entityLabel}:{" "}
                  <span className="font-medium text-foreground">
                    {sharePayload.entityTitle}
                  </span>
                </span>
              ) : (
                "Share this listing with your network."
              )}
            </DialogDescription>
          </DialogHeader>

          <div className="p-5 space-y-5">
            {/* Copy link row */}
            <div className="space-y-1.5">
              <label
                htmlFor="khidma-share-url"
                className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground"
              >
                Public link
              </label>
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Link2 className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3.5 text-muted-foreground" />
                  <Input
                    id="khidma-share-url"
                    readOnly
                    value={shareUrl}
                    onFocus={(e) => e.currentTarget.select()}
                    className="pl-8 pr-2 h-9 text-xs bg-muted/40 border-border/60 font-mono truncate focus-visible:ring-[#32504d]/30"
                    aria-label="Public link"
                  />
                </div>
                <Button
                  type="button"
                  size="sm"
                  onClick={handleCopy}
                  className={cn(
                    "h-9 px-3 shrink-0 transition-colors",
                    copied
                      ? "bg-emerald-600 hover:bg-emerald-700 text-white"
                      : "bg-[#2b3d3d] hover:bg-[#192d2f] text-white"
                  )}
                >
                  {copied ? (
                    <>
                      <Check className="size-3.5" /> Copied
                    </>
                  ) : (
                    <>
                      <Copy className="size-3.5" /> Copy
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Social share row */}
            <div className="space-y-2">
              <span className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
                Share via
              </span>
              <div className="grid grid-cols-6 gap-2">
                {SOCIALS.map((s) => {
                  const Icon = s.icon;
                  return (
                    <motion.button
                      key={s.key}
                      type="button"
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.94 }}
                      onClick={() => handleShare(s)}
                      aria-label={s.label}
                      title={s.label}
                      className={cn(
                        "flex size-9 sm:size-10 items-center justify-center rounded-full border border-border/60 bg-card text-foreground/80 transition-colors",
                        s.hoverClass
                      )}
                    >
                      <Icon className="size-4" />
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Share via in-app messages */}
            <Button
              type="button"
              variant="outline"
              onClick={handleShareViaMessages}
              className="w-full h-10 border-[#32504d]/30 dark:border-[#32504d]/30 text-[#32504d] dark:text-[#9bb3ae] hover:bg-[#32504d]/5 dark:bg-[#32504d]/15 hover:text-[#192d2f]"
            >
              <MessageSquare className="size-4" />
              Share via messages
            </Button>
          </div>

          <DialogFooter className="px-5 py-3 border-t border-border/60 bg-muted/20 flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-start">
            <ShieldCheck className="size-3.5 text-[#32504d] dark:text-[#9bb3ae] shrink-0" />
            <p className="text-[11px] text-muted-foreground leading-snug">
              Anyone with this link can view the public profile.
            </p>
            <DialogClose asChild>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="sm:ml-auto text-xs"
                onClick={closeShare}
              >
                Close
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}

export default ShareModal;
