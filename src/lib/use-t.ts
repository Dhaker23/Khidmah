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
    ar: "لقى موهبة",
  },
  "nav.findWork": {
    en: "Find Work",
    fr: "Trouver du Travail",
    ar: "لقى خدمة",
  },
  "nav.services": {
    en: "Services",
    fr: "Services",
    ar: "خدمات",
  },
  "nav.howItWorks": {
    en: "How It Works",
    fr: "Comment ça marche",
    ar: "كيفاش تخدم",
  },
  "nav.login": {
    en: "Log in",
    fr: "Connexion",
    ar: "دخول",
  },
  "nav.join": {
    en: "Join Khidma",
    fr: "Rejoindre Khidma",
    ar: "انضمّ لخدمة",
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
    ar: "أعمل",
  },
  "nav.postJob": {
    en: "Post a Job",
    fr: "Publier un emploi",
    ar: "انشر خدمة",
  },
  "nav.createService": {
    en: "Create a Service",
    fr: "Créer un service",
    ar: "أعمل خدمة",
  },

  // === Hero ===
  "hero.eyebrow": {
    en: "Built for Tunisian talent & clients worldwide",
    fr: "Conçu pour les talents tunisiens & clients du monde entier",
    ar: "مصمم للمواهب التونسية والعملاء في العالم كله",
  },
  "hero.titleLine1": {
    en: "Find trusted talent.",
    fr: "Trouvez un talent de confiance.",
    ar: "لقى موهبة تثق فيها.",
  },
  "hero.subtitle": {
    en: "A professional marketplace connecting verified Tunisian freelancers with clients locally and globally.",
    fr: "Une marketplace professionnelle connectant les freelancers tunisiens vérifiés avec les clients localement et globalement.",
    ar: "منصة احترافية تربط الفريلانسير التوانسة المثبتين بالعملاء في تونس والعالم.",
  },
  "hero.trust.realPeople": {
    en: "Real people. Real skills. Real trust.",
    fr: "De vraies personnes. De vraies compétences. Une vraie confiance.",
    ar: "ناس حقيقيين. مهارات حقيقية. ثقة حقيقية.",
  },

  // === Hero typewriter phrases ===
  "hero.phrase1": {
    en: "Build your career.",
    fr: "Construisez votre carrière.",
    ar: "ابني مسارك المهني.",
  },
  "hero.phrase2": {
    en: "Hire verified talent.",
    fr: "Engagez un talent vérifié.",
    ar: "وظف موهبة متثبت فيها.",
  },
  "hero.phrase3": {
    en: "Grow your business.",
    fr: "Faites croître votre entreprise.",
    ar: "كبّر بزنسك.",
  },
  "hero.phrase4": {
    en: "Earn your worth.",
    fr: "Gagnez ce que vous valez.",
    ar: "اربح اللي تستاهلو.",
  },

  // === CTAs ===
  "cta.findFreelancer": {
    en: "Find a Freelancer",
    fr: "Trouver un Freelancer",
    ar: "لقى فريلانسير",
  },
  "cta.startFreelancing": {
    en: "Start Freelancing",
    fr: "Commencer",
    ar: "ابدا كي فريلانسير",
  },
  "cta.becomeFreelancer": {
    en: "Become a Verified Freelancer",
    fr: "Devenir un freelancer vérifié",
    ar: "ولّي فريلانسير متثبت فيه",
  },
  "cta.hireTalent": {
    en: "Hire Talent",
    fr: "Engager du talent",
    ar: "وظف مواهب",
  },
  "cta.viewProfile": {
    en: "View Profile",
    fr: "Voir le profil",
    ar: "شوف البروفايل",
  },
  "cta.viewService": {
    en: "View Service",
    fr: "Voir le service",
    ar: "شوف الخدمة",
  },
  "cta.viewJob": {
    en: "View Job",
    fr: "Voir l'emploi",
    ar: "شوف الخدمة",
  },
  "cta.subscribe": {
    en: "Subscribe",
    fr: "S'abonner",
    ar: "اشترك",
  },
  "cta.getStarted": {
    en: "Get started",
    fr: "Commencer",
    ar: "ابدا توّ",
  },
  "cta.getStartedFree": {
    en: "Get started free",
    fr: "Commencer gratuitement",
    ar: "ابدا ببلاش",
  },
  "cta.learnMore": {
    en: "Learn more",
    fr: "En savoir plus",
    ar: "اعرف اكثر",
  },
  "cta.compareNow": {
    en: "Compare now",
    fr: "Comparer maintenant",
    ar: "قارن توّ",
  },

  // === Common actions ===
  "common.close": {
    en: "Close",
    fr: "Fermer",
    ar: "سكر",
  },
  "common.cancel": {
    en: "Cancel",
    fr: "Annuler",
    ar: "كانسيل",
  },
  "common.save": {
    en: "Save",
    fr: "Enregistrer",
    ar: "سجّل",
  },
  "common.search": {
    en: "Search",
    fr: "Rechercher",
    ar: "قلّب",
  },
  "common.loading": {
    en: "Loading…",
    fr: "Chargement…",
    ar: "نسخّي توّ…",
  },
  "common.viewAll": {
    en: "View all",
    fr: "Voir tout",
    ar: "شوف الكل",
  },
  "common.clearAll": {
    en: "Clear all",
    fr: "Tout effacer",
    ar: "مسح الكل",
  },
  "common.from": {
    en: "from",
    fr: "à partir de",
    ar: "من",
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
    ar: "نحقّقو الأفكار عبر تجارب رقمية حديثة",
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
    ar: "للفريلانسير",
  },
  "footer.marketplace": {
    en: "Marketplace",
    fr: "Marketplace",
    ar: "السوق",
  },
  "footer.trustSafety": {
    en: "Trust & Safety",
    fr: "Confiance & Sécurité",
    ar: "الثقة والأمان",
  },
  "footer.madeInTunisia": {
    en: "Made in Tunisia",
    fr: "Fait en Tunisie",
    ar: "مصنوع في تونس",
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
    ar: "فريلانسير متثبت فيهم",
  },
  "trust.projectsCompleted": {
    en: "projects completed",
    fr: "projets complétés",
    ar: "خدمات مكمّلة",
  },
  "trust.paidOut": {
    en: "paid out",
    fr: "versés",
    ar: "مدفوعة",
  },
  "trust.countriesServed": {
    en: "Countries Served",
    fr: "Pays servis",
    ar: "بلدان مخدومة",
  },
  "trust.citiesCovered": {
    en: "Cities Covered",
    fr: "Villes couvertes",
    ar: "مدن مغطّاية",
  },
  "trust.avgRating": {
    en: "Average Rating",
    fr: "Note moyenne",
    ar: "معدّل التقييم",
  },
  "trust.identityVerified": {
    en: "Identity Verified",
    fr: "Identité vérifiée",
    ar: "الهوية متثبت فيها",
  },
  "trust.portfolioReviewed": {
    en: "Portfolio Reviewed",
    fr: "Portfolio examiné",
    ar: "البورتفوليو تتم مراجعته",
  },
  "trust.realPeople": {
    en: "Real People. Real Reviews.",
    fr: "De vraies personnes. De vrais avis.",
    ar: "ناس حقيقيين. آراء حقيقية.",
  },
  "trust.transparentFee": {
    en: "Transparent 1% Platform Fee",
    fr: "Frais de plateforme transparents de 1%",
    ar: "عمولة المنصة 1٪ بس",
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
