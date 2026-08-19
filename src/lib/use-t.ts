"use client";

import * as React from "react";
import { useApp } from "@/lib/store";

type Lang = "en" | "fr" | "ar";
type Params = Record<string, string | number>;

/**
 * Khidma i18n dictionary — EN / FR / AR.
 * Lightweight lookup: keys map to { en, fr, ar } templates.
 * Templates support {{token}} interpolation (e.g. {{year}}).
 *
 * Note: only critical user-facing strings are translated (nav, hero CTA, footer).
 * The full marketplace UI remains in English for now; this proves the i18n system works.
 */
const translations: Record<string, Record<Lang, string>> = {
  "nav.findTalent": {
    en: "Find Talent",
    fr: "Trouver un Talent",
    ar: "ابحث عن موهبة",
  },
  "nav.findWork": {
    en: "Find Work",
    fr: "Trouver du Travail",
    ar: "ابحث عن عمل",
  },
  "nav.services": {
    en: "Services",
    fr: "Services",
    ar: "خدمات",
  },
  "nav.howItWorks": {
    en: "How It Works",
    fr: "Comment ça marche",
    ar: "كيف يعمل",
  },
  "nav.login": {
    en: "Log in",
    fr: "Connexion",
    ar: "تسجيل الدخول",
  },
  "nav.join": {
    en: "Join Khidma",
    fr: "Rejoindre Khidma",
    ar: "انضم إلى خدمة",
  },
  "cta.findFreelancer": {
    en: "Find a Freelancer",
    fr: "Trouver un Freelancer",
    ar: "ابحث عن مستقل",
  },
  "cta.startFreelancing": {
    en: "Start Freelancing",
    fr: "Commencer",
    ar: "ابدأ العمل الحر",
  },
  "footer.rights": {
    en: "© {{year}} Khidma — خدمة. All rights reserved.",
    fr: "© {{year}} Khidma — خدمة. Tous droits réservés.",
    ar: "© {{year}} Khidma — خدمة. جميع الحقوق محفوظة.",
  },
  // Command palette strings
  "cmd.placeholder": {
    en: "Search freelancers, services, jobs, or jump to…",
    fr: "Rechercher des freelancers, services, jobs, ou aller à…",
    ar: "ابحث عن مستقلين، خدمات، وظائف، أو انتقل إلى…",
  },
  "cmd.group.quickActions": {
    en: "Quick Actions",
    fr: "Actions rapides",
    ar: "إجراءات سريعة",
  },
  "cmd.group.navigate": {
    en: "Navigate",
    fr: "Naviguer",
    ar: "تنقل",
  },
  "cmd.group.freelancers": {
    en: "Freelancers",
    fr: "Freelancers",
    ar: "مستقلين",
  },
  "cmd.group.services": {
    en: "Services",
    fr: "Services",
    ar: "خدمات",
  },
  "cmd.group.jobs": {
    en: "Jobs",
    fr: "Emplois",
    ar: "وظائف",
  },
  "cmd.group.categories": {
    en: "Categories",
    fr: "Catégories",
    ar: "فئات",
  },
  "cmd.empty": {
    en: "No results found for \"{{query}}\"",
    fr: "Aucun résultat pour \"{{query}}\"",
    ar: "لا توجد نتائج لـ \"{{query}}\"",
  },
};

function interpolate(template: string, params?: Params): string {
  if (!params) return template;
  return template.replace(/\{\{(\w+)\}\}/g, (_, key: string) =>
    params[key] !== undefined ? String(params[key]) : `{{${key}}}`
  );
}

/**
 * Returns `{ t, lang }` where `t(key, params?)` resolves the key for the
 * currently-selected language from the global Zustand store.
 *
 * Usage:
 *   const { t, lang } = useT();
 *   t("nav.findTalent");                           // → "Trouver un Talent"
 *   t("footer.rights", { year: 2025 });            // → "© 2025 Khidma — خدمة. …"
 */
export function useT() {
  const lang = useApp((s) => s.lang);
  const t = React.useCallback(
    (key: string, params?: Params): string => {
      const entry = translations[key];
      if (!entry) return key;
      const template = entry[lang] ?? entry.en;
      return interpolate(template, params);
    },
    [lang]
  );
  return { t, lang } as const;
}

export type { Lang, Params };

export default useT;
