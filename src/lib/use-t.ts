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
 * Covers: nav, hero, trust, sections, CTAs, footer, command palette, common actions.
 */
const translations: Record<string, Record<Lang, string>> = {
  // === Navigation ===
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
  "nav.dashboard": {
    en: "Dashboard",
    fr: "Tableau de bord",
    ar: "لوحة التحكم",
  },
  "nav.messages": {
    en: "Messages",
    fr: "Messages",
    ar: "الرسائل",
  },
  "nav.notifications": {
    en: "Notifications",
    fr: "Notifications",
    ar: "الإشعارات",
  },
  "nav.saved": {
    en: "Saved items",
    fr: "Éléments enregistrés",
    ar: "العناصر المحفوظة",
  },
  "nav.create": {
    en: "Create",
    fr: "Créer",
    ar: "إنشاء",
  },
  "nav.postJob": {
    en: "Post a Job",
    fr: "Publier un emploi",
    ar: "انشر وظيفة",
  },
  "nav.createService": {
    en: "Create a Service",
    fr: "Créer un service",
    ar: "أنشئ خدمة",
  },

  // === Hero ===
  "hero.eyebrow": {
    en: "Built for Tunisian talent & clients worldwide",
    fr: "Conçu pour les talents tunisiens & clients du monde entier",
    ar: "مصمم للمواهب التونسية والعملاء حول العالم",
  },
  "hero.titleLine1": {
    en: "Find trusted talent.",
    fr: "Trouvez un talent de confiance.",
    ar: "اعثر على موهبة موثوقة.",
  },
  "hero.subtitle": {
    en: "A professional marketplace connecting verified Tunisian freelancers with clients locally and globally.",
    fr: "Une marketplace professionnelle connectant les freelancers tunisiens vérifiés avec les clients localement et globalement.",
    ar: "سوق احترافي يربط المستقلين التونسيين الموثقين بالعملاء محلياً وعالمياً.",
  },
  "hero.trust.realPeople": {
    en: "Real people. Real skills. Real trust.",
    fr: "De vraies personnes. De vraies compétences. Une vraie confiance.",
    ar: "أشخاص حقيقيون. مهارات حقيقية. ثقة حقيقية.",
  },

  // === Hero typewriter phrases ===
  "hero.phrase1": {
    en: "Build your career.",
    fr: "Construisez votre carrière.",
    ar: "ابنِ مسيرتك المهنية.",
  },
  "hero.phrase2": {
    en: "Hire verified talent.",
    fr: "Engagez un talent vérifié.",
    ar: "وظف موهبة موثقة.",
  },
  "hero.phrase3": {
    en: "Grow your business.",
    fr: "Faites croître votre entreprise.",
    ar: "نمِّ أعمالك.",
  },
  "hero.phrase4": {
    en: "Earn your worth.",
    fr: "Gagnez ce que vous valez.",
    ar: "اكسب ما تستحقه.",
  },

  // === CTAs ===
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
  "cta.becomeFreelancer": {
    en: "Become a Verified Freelancer",
    fr: "Devenir un freelancer vérifié",
    ar: "كن مستقلاً موثقاً",
  },
  "cta.hireTalent": {
    en: "Hire Talent",
    fr: "Engager du talent",
    ar: "وظف مواهب",
  },
  "cta.viewProfile": {
    en: "View Profile",
    fr: "Voir le profil",
    ar: "عرض الملف",
  },
  "cta.viewService": {
    en: "View Service",
    fr: "Voir le service",
    ar: "عرض الخدمة",
  },
  "cta.viewJob": {
    en: "View Job",
    fr: "Voir l'emploi",
    ar: "عرض الوظيفة",
  },
  "cta.subscribe": {
    en: "Subscribe",
    fr: "S'abonner",
    ar: "اشترك",
  },
  "cta.getStarted": {
    en: "Get started",
    fr: "Commencer",
    ar: "ابدأ الآن",
  },
  "cta.getStartedFree": {
    en: "Get started free",
    fr: "Commencer gratuitement",
    ar: "ابدأ مجاناً",
  },
  "cta.learnMore": {
    en: "Learn more",
    fr: "En savoir plus",
    ar: "اعرف المزيد",
  },
  "cta.compareNow": {
    en: "Compare now",
    fr: "Comparer maintenant",
    ar: "قارن الآن",
  },

  // === Common actions ===
  "common.close": {
    en: "Close",
    fr: "Fermer",
    ar: "إغلاق",
  },
  "common.cancel": {
    en: "Cancel",
    fr: "Annuler",
    ar: "إلغاء",
  },
  "common.save": {
    en: "Save",
    fr: "Enregistrer",
    ar: "حفظ",
  },
  "common.search": {
    en: "Search",
    fr: "Rechercher",
    ar: "بحث",
  },
  "common.loading": {
    en: "Loading…",
    fr: "Chargement…",
    ar: "جار التحميل…",
  },
  "common.viewAll": {
    en: "View all",
    fr: "Voir tout",
    ar: "عرض الكل",
  },
  "common.clearAll": {
    en: "Clear all",
    fr: "Tout effacer",
    ar: "مسح الكل",
  },
  "common.from": {
    en: "from",
    fr: "à partir de",
    ar: "ابتداءً من",
  },
  "common.perHour": {
    en: "/hr",
    fr: "/h",
    ar: "/ساعة",
  },

  // === Section eyebrows ===
  "section.featured": {
    en: "Featured this week",
    fr: "À la une cette semaine",
    ar: "مميز هذا الأسبوع",
  },
  "section.trustStrip": {
    en: "Trusted by Tunisian talent & international clients",
    fr: "Approuvé par les talents tunisiens & clients internationaux",
    ar: "موثوق من المواهب التونسية والعملاء الدوليين",
  },
  "section.howItWorks": {
    en: "How Khidma Works",
    fr: "Comment fonctionne Khidma",
    ar: "كيف يعمل خدمة",
  },
  "section.categories": {
    en: "Explore by Category",
    fr: "Explorer par catégorie",
    ar: "استكشف حسب الفئة",
  },
  "section.featuredFreelancers": {
    en: "Featured Verified Freelancers",
    fr: "Freelancers vérifiés en vedette",
    ar: "مستقلون موثقون مميزون",
  },
  "section.featuredServices": {
    en: "Popular Services",
    fr: "Services populaires",
    ar: "خدمات شائعة",
  },
  "section.openJobs": {
    en: "Latest Job Opportunities",
    fr: "Dernières opportunités d'emploi",
    ar: "أحدث فرص العمل",
  },
  "section.statsBanner": {
    en: "Khidma by the numbers",
    fr: "Khidma en chiffres",
    ar: "خدمة بالأرقام",
  },
  "section.whyKhidma": {
    en: "Why Khidma",
    fr: "Pourquoi Khidma",
    ar: "لماذا خدمة",
  },
  "section.trustCenter": {
    en: "The Khidma Trust Center",
    fr: "Le Centre de Confiance Khidma",
    ar: "مركز الثقة خدمة",
  },
  "section.pricing": {
    en: "Simple, transparent pricing",
    fr: "Tarification simple et transparente",
    ar: "تسعير بسيط وشفاف",
  },
  "section.testimonials": {
    en: "What clients say",
    fr: "Ce que disent les clients",
    ar: "ماذا يقول العملاء",
  },
  "section.successStories": {
    en: "Real freelancers. Real journeys. Real results.",
    fr: "De vrais freelancers. De vrais parcours. De vrais résultats.",
    ar: "مستقلون حقيقيون. رحلات حقيقية. نتائج حقيقية.",
  },
  "section.blog": {
    en: "Insights & Resources",
    fr: "Insights & Ressources",
    ar: "رؤى وموارد",
  },
  "section.mobileApp": {
    en: "Take Khidma everywhere you go.",
    fr: "Emportez Khidma partout avec vous.",
    ar: "خذ خدمة معك أينما ذهبت.",
  },
  "section.community": {
    en: "The Khidma Community",
    fr: "La Communauté Khidma",
    ar: "مجتمع خدمة",
  },
  "section.awards": {
    en: "Khidma Awards 2025",
    fr: "Prix Khidma 2025",
    ar: "جوائز خدمة 2025",
  },
  "section.academy": {
    en: "Learn the skills that pay",
    fr: "Apprenez les compétences qui rapportent",
    ar: "تعلم المهارات التي تدر ربحاً",
  },
  "section.podcast": {
    en: "The Khidma Podcast",
    fr: "Le Podcast Khidma",
    ar: "بودكاست خدمة",
  },
  "section.faq": {
    en: "Questions, answered.",
    fr: "Questions, réponses.",
    ar: "أسئلة، إجابات.",
  },
  "section.finalCta": {
    en: "Join Khidma Today.",
    fr: "Rejoignez Khidma aujourd'hui.",
    ar: "انضم إلى خدمة اليوم.",
  },

  // === Footer ===
  "footer.rights": {
    en: "© {{year}} Khidma — خدمة. All rights reserved.",
    fr: "© {{year}} Khidma — خدمة. Tous droits réservés.",
    ar: "© {{year}} خدة — جميع الحقوق محفوظة.",
  },
  "footer.designedBy": {
    en: "Designed & Developed by",
    fr: "Conçu & développé par",
    ar: "تصميم وتطوير",
  },
  "footer.tagline": {
    en: "Bringing ideas to life through modern digital experiences",
    fr: "Donner vie aux idées à travers des expériences numériques modernes",
    ar: "نحو الأفكار إلى حياة عبر تجارب رقمية حديثة",
  },
  "footer.contact": {
    en: "Contact",
    fr: "Contact",
    ar: "اتصل",
  },
  "footer.forClients": {
    en: "For Clients",
    fr: "Pour les clients",
    ar: "للعملاء",
  },
  "footer.forFreelancers": {
    en: "For Freelancers",
    fr: "Pour les freelancers",
    ar: "للمستقلين",
  },
  "footer.marketplace": {
    en: "Marketplace",
    fr: "Marketplace",
    ar: "السوق",
  },
  "footer.trustSafety": {
    en: "Trust & Safety",
    fr: "Confiance & Sécurité",
    ar: "الثقة والسلامة",
  },
  "footer.madeInTunisia": {
    en: "Made in Tunisia",
    fr: "Fait en Tunisie",
    ar: "صُنع في تونس",
  },
  "footer.privacy": {
    en: "Privacy",
    fr: "Confidentialité",
    ar: "الخصوصية",
  },
  "footer.terms": {
    en: "Terms",
    fr: "Conditions",
    ar: "الشروط",
  },

  // === Command palette ===
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

  // === Trust signals ===
  "trust.verifiedFreelancers": {
    en: "verified freelancers",
    fr: "freelancers vérifiés",
    ar: "مستقلون موثقون",
  },
  "trust.projectsCompleted": {
    en: "projects completed",
    fr: "projets complétés",
    ar: "مشاريع منجزة",
  },
  "trust.paidOut": {
    en: "paid out",
    fr: "versés",
    ar: "مدفوعة",
  },
  "trust.countriesServed": {
    en: "Countries Served",
    fr: "Pays servis",
    ar: "دول مخدومة",
  },
  "trust.citiesCovered": {
    en: "Cities Covered",
    fr: "Villes couvertes",
    ar: "مدن مغطاة",
  },
  "trust.avgRating": {
    en: "Average Rating",
    fr: "Note moyenne",
    ar: "متوسط التقييم",
  },
  "trust.identityVerified": {
    en: "Identity Verified",
    fr: "Identité vérifiée",
    ar: "الهوية موثقة",
  },
  "trust.portfolioReviewed": {
    en: "Portfolio Reviewed",
    fr: "Portfolio examiné",
    ar: "معرض الأعمال مُراجع",
  },
  "trust.realPeople": {
    en: "Real People. Real Reviews.",
    fr: "De vraies personnes. De vrais avis.",
    ar: "أشخاص حقيقيون. تقييمات حقيقية.",
  },
  "trust.transparentFee": {
    en: "Transparent 1% Platform Fee",
    fr: "Frais de plateforme transparents de 1%",
    ar: "رسوم منصة شفافة 1٪",
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
