"use client";

import * as React from "react";
import { Globe, Check } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useApp } from "@/lib/store";
import { cn } from "@/lib/utils";

type Lang = "en" | "fr" | "ar";

interface LanguageOption {
  code: Lang;
  /** Native name (shown in the dropdown + toast). */
  name: string;
  /** English label (used by screen readers + title attribute). */
  english: string;
  flag: string;
}

const LANGUAGES: LanguageOption[] = [
  { code: "en", name: "English", english: "English", flag: "🇬🇧" },
  { code: "fr", name: "Français", english: "French", flag: "🇫🇷" },
  { code: "ar", name: "العربية", english: "Arabic", flag: "🇹🇳" },
];

/**
 * LanguageSwitcher — Khidma language dropdown (EN / FR / AR) with RTL support.
 *
 * - Trigger button shows the current language code uppercased (e.g. "EN").
 * - On select: updates the global store (`setLang`), sets `<html lang>` and
 *   `<html dir>` (RTL for Arabic), and fires a sonner toast confirmation.
 * - Uses shadcn `DropdownMenu`, Lucide `Globe` icon, and native flag emoji.
 */
export function LanguageSwitcher({ className }: { className?: string }) {
  const lang = useApp((s) => s.lang);
  const setLang = useApp((s) => s.setLang);

  const handleSelect = React.useCallback(
    (option: LanguageOption) => {
      setLang(option.code);
      if (typeof document !== "undefined") {
        document.documentElement.lang = option.code;
        document.documentElement.dir = option.code === "ar" ? "rtl" : "ltr";
      }
      toast.success(`Language switched to ${option.name}`, {
        description: option.code === "ar" ? "تم تغيير اللغة" : undefined,
      });
    },
    [setLang]
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={cn("gap-1.5 px-2.5 h-9", className)}
          aria-label={`Language: ${lang.toUpperCase()}. Click to change language.`}
          title="Change language"
        >
          <Globe className="size-[18px] text-muted-foreground" />
          <span className="font-mono text-xs font-semibold uppercase tracking-wider">
            {lang}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuLabel className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
          Language · اللغة
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {LANGUAGES.map((option) => {
          const isActive = lang === option.code;
          return (
            <DropdownMenuItem
              key={option.code}
              onClick={() => handleSelect(option)}
              className="flex items-center gap-2.5 cursor-pointer py-2"
              data-active={isActive}
            >
              <span className="text-base leading-none" aria-hidden>
                {option.flag}
              </span>
              <span
                className={cn(
                  "flex-1",
                  option.code === "ar" && "font-arabic"
                )}
              >
                {option.name}
              </span>
              {isActive && (
                <Check className="size-4 text-[#32504d] dark:text-[#748684]" />
              )}
            </DropdownMenuItem>
          );
        })}
        <DropdownMenuSeparator />
        <div className="px-2 py-1.5 text-[10px] text-muted-foreground">
          Arabic switches the UI to RTL direction.
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default LanguageSwitcher;
