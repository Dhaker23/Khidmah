"use client";

import * as React from "react";
import { Check } from "lucide-react";
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
  name: string;
  english: string;
  flag: string;
}

const LANGUAGES: LanguageOption[] = [
  { code: "en", name: "English", english: "English", flag: "🇬🇧" },
  { code: "fr", name: "Français", english: "French", flag: "🇫🇷" },
  { code: "ar", name: "العربية", english: "Arabic", flag: "🇹🇳" },
];

export function LanguageSwitcher({ className }: { className?: string }) {
  const lang = useApp((s) => s.lang);
  const setLang = useApp((s) => s.setLang);

  const current = LANGUAGES.find((l) => l.code === lang) ?? LANGUAGES[0];

  const handleSelect = React.useCallback(
    (option: LanguageOption) => {
      setLang(option.code);
      if (typeof document !== "undefined") {
        document.documentElement.lang = option.code;
        document.documentElement.dir = option.code === "ar" ? "rtl" : "ltr";
      }
      toast.success(`Language: ${option.english}`, {
        description: option.code === "ar" ? "اللغة تبدلت للتونسي" : undefined,
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
          aria-label={`Language: ${current.english}. Click to change language.`}
          title="Change language"
        >
          <span className="text-base leading-none">{current.flag}</span>
          <span className="text-xs font-semibold uppercase tracking-wider">
            {current.code.toUpperCase()}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52">
        <DropdownMenuLabel className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
          Language
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
              <span className="text-base leading-none">{option.flag}</span>
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
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default LanguageSwitcher;
