import Image from "next/image";
import { cn } from "@/lib/utils";

interface KhidmaLogoProps {
  variant?: "full" | "symbol" | "wordmark";
  className?: string;
  showArabic?: boolean;
  size?: "sm" | "md" | "lg";
}

export function KhidmaLogo({
  variant = "full",
  className,
  showArabic = false,
  size = "md",
}: KhidmaLogoProps) {
  const sizes = {
    sm: { icon: 28, text: "text-base", ar: "text-sm" },
    md: { icon: 36, text: "text-lg", ar: "text-base" },
    lg: { icon: 48, text: "text-2xl", ar: "text-xl" },
  };
  const s = sizes[size];

  if (variant === "symbol") {
    return (
      <div className={cn("relative", className)}>
        <Image
          src="/khidma-logo.png"
          alt="Khidma logo"
          width={s.icon}
          height={s.icon}
          className="object-contain"
        />
      </div>
    );
  }

  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <Image
        src="/khidma-logo.png"
        alt="Khidma logo"
        width={s.icon}
        height={s.icon}
        className="object-contain"
        priority
      />
      {variant === "wordmark" || variant === "full" ? (
        <div className="flex items-baseline gap-2">
          <span
            className={cn(
              "font-display font-bold tracking-tight text-foreground",
              s.text
            )}
          >
            Khidma
          </span>
          {showArabic && (
            <span
              className={cn(
                "font-arabic text-muted-foreground",
                s.ar
              )}
              dir="rtl"
            >
              خدمة
            </span>
          )}
        </div>
      ) : null}
    </div>
  );
}
