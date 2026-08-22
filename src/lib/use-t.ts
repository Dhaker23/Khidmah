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
    ar: "عرض الخدمة",
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
  "section.withdrawalOptions": {
    en: "Withdraw Your Earnings, Your Way",
    fr: "Retirez vos gains, à votre façon",
    ar: "اسحب أرباحك بالطريقة التي تناسبك",
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

  // === Section eyebrows / sub-labels (NEW) ===
  "section.eyebrow.featuredTalent": {
    en: "Featured Talent",
    fr: "Talent en vedette",
    ar: "موهبة مميزة",
  },
  "section.eyebrow.readyToBuyServices": {
    en: "Ready-to-Buy Services",
    fr: "Services prêts à l'achat",
    ar: "خدمات جاهزة للشراء",
  },
  "section.eyebrow.openOpportunities": {
    en: "Open Opportunities",
    fr: "Opportunités ouvertes",
    ar: "فرص مفتوحة",
  },
  "section.eyebrow.successStories": {
    en: "Success Stories",
    fr: "Histoires de réussite",
    ar: "قصص نجاح",
  },
  "section.eyebrow.byNumbers": {
    en: "By the numbers",
    fr: "En chiffres",
    ar: "بالأرقام",
  },
  "section.eyebrow.faqShort": {
    en: "FAQ",
    fr: "FAQ",
    ar: "الأسئلة الشائعة",
  },
  "section.eyebrow.withdrawals": {
    en: "Withdrawals",
    fr: "Retraits",
    ar: "السحوبات",
  },
  "section.eyebrow.transparentPricing": {
    en: "Transparent Pricing",
    fr: "Tarification transparente",
    ar: "تسعير شفاف",
  },
  "section.eyebrow.platformAnalytics": {
    en: "Platform Analytics",
    fr: "Analytique de la plateforme",
    ar: "تحليلات المنصة",
  },
  "section.eyebrow.trustSafety": {
    en: "Trust & Safety",
    fr: "Confiance & Sécurité",
    ar: "الثقة والسلامة",
  },
  "section.eyebrow.khidmaBlog": {
    en: "Khidma Blog",
    fr: "Blog Khidma",
    ar: "مدونة خدمة",
  },
  "section.eyebrow.khidmaMobile": {
    en: "Khidma Mobile",
    fr: "Khidma Mobile",
    ar: "تطبيق خدمة",
  },
  "section.eyebrow.khidmaCommunity": {
    en: "Khidma Community",
    fr: "Communauté Khidma",
    ar: "مجتمع خدمة",
  },
  "section.eyebrow.khidmaAwards": {
    en: "Khidma Awards 2025",
    fr: "Prix Khidma 2025",
    ar: "جوائز خدمة 2025",
  },
  "section.eyebrow.khidmaAcademy": {
    en: "Khidma Academy",
    fr: "Académie Khidma",
    ar: "أكاديمية خدمة",
  },
  "section.eyebrow.khidmaPodcast": {
    en: "Khidma Podcast",
    fr: "Podcast Khidma",
    ar: "بودكاست خدمة",
  },
  "section.eyebrow.khidmaAcrossTunisia": {
    en: "Khidma Across Tunisia",
    fr: "Khidma à travers la Tunisie",
    ar: "خدمة عبر تونس",
  },
  "section.eyebrow.khidmaSuccessStories": {
    en: "Khidma Success Stories",
    fr: "Histoires de réussite Khidma",
    ar: "قصص نجاح خدمة",
  },

  // === How It Works , freelancer flow (3 steps) ===
  "section.howItWorks.freelancers.title": {
    en: "A clear path from sign-up to payout",
    fr: "Un parcours clair de l'inscription au paiement",
    ar: "مسار واضح من التسجيل إلى الدفع",
  },
  "section.howItWorks.freelancers.subtitle": {
    en: "Whether you are freelancing or hiring, Khidma's process is transparent, verified, and built around trust.",
    fr: "Que vous soyez freelance ou client, le processus de Khidma est transparent, vérifié et fondé sur la confiance.",
    ar: "سواء كنت مستقلاً أو عميلاً، فإن عملية خدمة شفافة وموثقة ومبنية على الثقة.",
  },
  "section.howItWorks.freelancers.forFreelancers": {
    en: "For Freelancers",
    fr: "Pour les freelancers",
    ar: "للمستقلين",
  },
  "section.howItWorks.freelancers.forClients": {
    en: "For Clients",
    fr: "Pour les clients",
    ar: "للعملاء",
  },
  "section.howItWorks.freelancers.step1.title": {
    en: "Register & Verify Identity",
    fr: "Inscription et vérification d'identité",
    ar: "سجّل وتحقق من هويتك",
  },
  "section.howItWorks.freelancers.step1.description": {
    en: "Create your account, confirm your email and phone, then submit your national ID for verification.",
    fr: "Créez votre compte, confirmez votre e-mail et téléphone, puis soumettez votre pièce d'identité nationale pour vérification.",
    ar: "أنشئ حسابك، أكّد بريدك الإلكتروني وهاتفك، ثم قدّم بطاقة هويتك الوطنية للتحقق.",
  },
  "section.howItWorks.freelancers.step1.action": {
    en: "Sign up + verify email, phone, and ID",
    fr: "Inscription + vérification e-mail, téléphone et pièce d'identité",
    ar: "سجّل + تحقق من البريد والهاتف والهوية",
  },
  "section.howItWorks.freelancers.step2.title": {
    en: "Build Profile & Portfolio",
    fr: "Créer profil et portfolio",
    ar: "ابنِ الملف والمعرض",
  },
  "section.howItWorks.freelancers.step2.description": {
    en: "Add your skills, experience, and portfolio items. Real projects with real results build trust.",
    fr: "Ajoutez vos compétences, expérience et éléments de portfolio. De vrais projets avec de vrais résultats créent la confiance.",
    ar: "أضف مهاراتك وخبراتك وعناصر معرضك. المشاريع الحقيقية مع النتائج الحقيقية تبني الثقة.",
  },
  "section.howItWorks.freelancers.step2.action": {
    en: "Add portfolio, skills, and hourly rate",
    fr: "Ajouter portfolio, compétences et tarif horaire",
    ar: "أضف الملف والمهارات والسعر بالساعة",
  },
  "section.howItWorks.freelancers.step3.title": {
    en: "Get Approved & Start Working",
    fr: "Être approuvé et commencer à travailler",
    ar: "احصل على الموافقة وابدأ العمل",
  },
  "section.howItWorks.freelancers.step3.description": {
    en: "Our team reviews your profile. Once approved, you can apply for jobs, publish services, and get hired.",
    fr: "Notre équipe examine votre profil. Une fois approuvé, vous pouvez postuler à des emplois, publier des services et être embauché.",
    ar: "يراجع فريقنا ملفك. بمجرد الموافقة، يمكنك التقديم على الوظائف ونشر الخدمات والحصول على عمل.",
  },
  "section.howItWorks.freelancers.step3.action": {
    en: "Receive offers and start earning",
    fr: "Recevoir des offres et commencer à gagner",
    ar: "استقبل العروض وابدأ الكسب",
  },
  "section.howItWorks.freelancers.keyAction": {
    en: "Key action",
    fr: "Action clé",
    ar: "إجراء رئيسي",
  },
  "section.howItWorks.freelancers.escrow.headline": {
    en: "Escrow-protected contracts.",
    fr: "Contrats protégés par séquestre.",
    ar: "عقود محمية بالضمان.",
  },
  "section.howItWorks.freelancers.escrow.body": {
    en: "Funds are held safely until milestones are approved, protecting both clients and freelancers.",
    fr: "Les fonds sont conservés en toute sécurité jusqu'à l'approbation des étapes, protégeant clients et freelancers.",
    ar: "تُحفظ الأموال بأمان حتى تتم الموافقة على المراحل، مما يحمي العملاء والمستقلين.",
  },

  // === How It Works , client flow (4 steps) ===
  "section.howItWorks.clients.step1.label": {
    en: "Post Job",
    fr: "Publier un emploi",
    ar: "انشر وظيفة",
  },
  "section.howItWorks.clients.step1.description": {
    en: "Describe your project, budget, and timeline",
    fr: "Décrivez votre projet, budget et délai",
    ar: "صف مشروعك وميزانيتك والجدول الزمني",
  },
  "section.howItWorks.clients.step2.label": {
    en: "Compare Profiles",
    fr: "Comparer les profils",
    ar: "قارن الملفات",
  },
  "section.howItWorks.clients.step2.description": {
    en: "Review verified freelancers side-by-side",
    fr: "Examinez les freelancers vérifiés côte à côte",
    ar: "راجع المستقلين الموثقين جنبًا إلى جنب",
  },
  "section.howItWorks.clients.step3.label": {
    en: "Fund Contract",
    fr: "Financer le contrat",
    ar: "موّل العقد",
  },
  "section.howItWorks.clients.step3.description": {
    en: "Escrow-protected milestone funding",
    fr: "Financement des étapes par séquestre",
    ar: "تمويل المراحل بالضمان",
  },
  "section.howItWorks.clients.step4.label": {
    en: "Release on Approval",
    fr: "Libérer après approbation",
    ar: "أطلق بعد الموافقة",
  },
  "section.howItWorks.clients.step4.description": {
    en: "Pay only when work is approved",
    fr: "Payer uniquement lorsque le travail est approuvé",
    ar: "ادفع فقط عند الموافقة على العمل",
  },

  // === Categories section ===
  "section.categories.title": {
    en: "Find the right talent for any project",
    fr: "Trouvez le bon talent pour tout projet",
    ar: "اعثر على الموهبة المناسبة لأي مشروع",
  },
  "section.categories.subtitle": {
    en: "Browse {{count}} categories, from development and design to voice over, translation, and AI.",
    fr: "Parcourez {{count}} catégories, du développement et design à la voix off, traduction et IA.",
    ar: "تصفّح {{count}} فئة، من التطوير والتصميم إلى التعليق الصوتي والترجمة والذكاء الاصطناعي.",
  },
  "section.categories.freelancersCount": {
    en: "freelancers",
    fr: "freelancers",
    ar: "مستقل",
  },

  // === Featured freelancers / services / jobs , viewAll buttons ===
  "section.featuredFreelancers.subtitle": {
    en: "Hand-picked freelancers who passed our verification process, identity, portfolio, and reputation reviewed.",
    fr: "Freelancers sélectionnés ayant passé notre processus de vérification, identité, portfolio et réputation examinés.",
    ar: "مستقلون مختارون بعناية اجتازوا عملية التحقق لدينا، الهوية والمعرض والسمعة مراجعة.",
  },
  "section.featuredFreelancers.viewAll": {
    en: "View all freelancers",
    fr: "Voir tous les freelancers",
    ar: "عرض كل المستقلين",
  },
  "section.featuredServices.subtitle": {
    en: "Pre-packaged offerings from verified freelancers. Transparent pricing, clear delivery times, and revisions included.",
    fr: "Offres pré-emballées par des freelancers vérifiés. Prix transparents, délais de livraison clairs et révisions incluses.",
    ar: "عروض جاهزة من مستقلين موثقين. أسعار شفافة، أوقات تسليم واضحة، ومراجعات مشمولة.",
  },
  "section.featuredServices.viewAll": {
    en: "View all services",
    fr: "Voir tous les services",
    ar: "عرض كل الخدمات",
  },
  "section.openJobs.subtitle": {
    en: "Real projects posted by verified clients. Apply with your profile and get hired through escrow-protected contracts.",
    fr: "De vrais projets publiés par des clients vérifiés. Postulez avec votre profil et soyez embauché via des contrats protégés par séquestre.",
    ar: "مشاريع حقيقية نشرها عملاء موثقون. قدّم بملفك واحصل على عمل عبر عقود محمية بالضمان.",
  },
  "section.openJobs.viewAll": {
    en: "Browse all jobs",
    fr: "Parcourir tous les emplois",
    ar: "تصفح كل الوظائف",
  },

  // === Why Khidma , 6 feature cards ===
  "section.whyKhidma.title": {
    en: "Why clients and freelancers choose Khidma",
    fr: "Pourquoi clients et freelancers choisissent Khidma",
    ar: "لماذا يختار العملاء والمستقلون خدمة",
  },
  "section.whyKhidma.subtitle": {
    en: "Most marketplaces optimise for volume. Khidma optimises for trust. We verify identity, protect payments, and let real work speak for itself, so both sides can focus on doing great work instead of chasing ghosts.",
    fr: "La plupart des marketplaces optimisent le volume. Khidma optimise la confiance. Nous vérifions l'identité, protégeons les paiements et laissons le vrai travail parler de lui-même, pour que les deux côtés puissent se concentrer sur l'excellence plutôt que de courir après des fantômes.",
    ar: "معظم الأسواق تُحسّن للحجم. خدمة تُحسّن للثقة. نتحقق من الهوية، نحمي المدفوعات، ونترك العمل الحقيقي يتحدث عن نفسه، حتى يتمكن الجانبان من التركيز على إنجاز عمل رائع بدلاً من ملاحقة الأشباح.",
  },
  "section.whyKhidma.badge.identityVerified": {
    en: "Identity Verified",
    fr: "Identité vérifiée",
    ar: "الهوية موثقة",
  },
  "section.whyKhidma.badge.escrowProtected": {
    en: "Escrow Protected",
    fr: "Protégé par séquestre",
    ar: "محمي بالضمان",
  },
  "section.whyKhidma.badge.flatFee": {
    en: "1% Flat Fee",
    fr: "1% frais forfaitaires",
    ar: "1٪ رسوم ثابتة",
  },
  "section.whyKhidma.f1.title": {
    en: "Trust-first verification",
    fr: "Vérification axée confiance",
    ar: "تحقق يضع الثقة أولاً",
  },
  "section.whyKhidma.f1.description": {
    en: "Email, phone, national ID, and portfolio reviews for every freelancer.",
    fr: "Vérification e-mail, téléphone, pièce d'identité nationale et portfolio pour chaque freelancer.",
    ar: "تحقق من البريد والهاتف والهوية الوطنية والمعرض لكل مستقل.",
  },
  "section.whyKhidma.f2.title": {
    en: "Transparent 1% fee",
    fr: "Frais transparents de 1%",
    ar: "رسوم شفافة 1٪",
  },
  "section.whyKhidma.f2.description": {
    en: "A flat 1% marketplace fee. No tiers, no surcharges, no surprises.",
    fr: "Des frais de marketplace forfaitaires de 1%. Pas de paliers, pas de suppléments, pas de surprises.",
    ar: "رسوم سوق ثابتة 1٪. لا فئات، لا رسوم إضافية، لا مفاجآت.",
  },
  "section.whyKhidma.f3.title": {
    en: "Secure contracts & escrow",
    fr: "Contrats sécurisés et séquestre",
    ar: "عقود آمنة وضمان",
  },
  "section.whyKhidma.f3.description": {
    en: "Milestone-based escrow protects funds until work is approved.",
    fr: "Le séquestre par étapes protège les fonds jusqu'à l'approbation du travail.",
    ar: "الضمان القائم على المراحل يحمي الأموال حتى تتم الموافقة على العمل.",
  },
  "section.whyKhidma.f4.title": {
    en: "Local & international withdrawals",
    fr: "Retraits locaux et internationaux",
    ar: "سحب محلي ودولي",
  },
  "section.whyKhidma.f4.description": {
    en: "BIAT, TIJARI, Tunisian Post, D17, Western Union, and bank transfers.",
    fr: "BIAT, TIJARI, Poste tunisienne, D17, Western Union et virements bancaires.",
    ar: "BIAT، TIJARI، البريد التونسي، D17، Western Union، والتحويلات المصرفية.",
  },
  "section.whyKhidma.f5.title": {
    en: "Real reviews from real projects",
    fr: "Avis réels de projets réels",
    ar: "تقييمات حقيقية من مشاريع حقيقية",
  },
  "section.whyKhidma.f5.description": {
    en: "Reviews are tied to completed, paid contracts, never fakeable.",
    fr: "Les avis sont liés à des contrats terminés et payés, jamais falsifiables.",
    ar: "التقييمات مرتبطة بعقود مكتملة ومدفوعة، لا يمكن تزويرها.",
  },
  "section.whyKhidma.f6.title": {
    en: "Two-sided reputation",
    fr: "Réputation bidirectionnelle",
    ar: "سمعة ثنائية",
  },
  "section.whyKhidma.f6.description": {
    en: "Both clients and freelancers build public track records over time.",
    fr: "Clients et freelancers construisent un historique public au fil du temps.",
    ar: "كل من العملاء والمستقلين يبنون سجلاً عامًا مع مرور الوقت.",
  },

  // === Withdrawal Options ===
  "section.withdrawalOptions.subtitle": {
    en: "Pick the payout method that fits your workflow. Mobile wallets for instant cash, bank transfers for larger amounts, and international options when you're working with clients abroad.",
    fr: "Choisissez la méthode de paiement qui convient à votre flux. Portefeuilles mobiles pour du cash instantané, virements bancaires pour des montants plus importants et options internationales lorsque vous travaillez avec des clients à l'étranger.",
    ar: "اختر طريقة الدفع التي تناسب سير عملك. محافظ الهاتف للنقد الفوري، والتحويلات المصرفية للمبالغ الكبيرة، والخيارات الدولية عند العمل مع عملاء في الخارج.",
  },
  "section.withdrawalOptions.localMethods": {
    en: "Local Methods",
    fr: "Méthodes locales",
    ar: "طرق محلية",
  },
  "section.withdrawalOptions.localMethodsDesc": {
    en: "Fast, mobile-first payouts inside Tunisia",
    fr: "Paiements rapides et mobiles en Tunisie",
    ar: "مدفوعات سريعة عبر الهاتف داخل تونس",
  },
  "section.withdrawalOptions.bankTransfers": {
    en: "Bank Transfers",
    fr: "Virements bancaires",
    ar: "تحويلات مصرفية",
  },
  "section.withdrawalOptions.bankTransfersDesc": {
    en: "Direct transfers to Tunisian bank accounts",
    fr: "Virements directs vers les comptes bancaires tunisiens",
    ar: "تحويلات مباشرة إلى الحسابات المصرفية التونسية",
  },
  "section.withdrawalOptions.international": {
    en: "International",
    fr: "International",
    ar: "دولي",
  },
  "section.withdrawalOptions.internationalDesc": {
    en: "Receive funds abroad with global providers",
    fr: "Recevez des fonds à l'étranger avec des prestataires mondiaux",
    ar: "استلم الأموال من الخارج عبر مزودين عالميين",
  },
  "section.withdrawalOptions.fee": {
    en: "Fee",
    fr: "Frais",
    ar: "الرسوم",
  },
  "section.withdrawalOptions.time": {
    en: "Time",
    fr: "Délai",
    ar: "الوقت",
  },
  "section.withdrawalOptions.footnote": {
    en: "Withdrawal fees may vary based on the method and currency conversion rates. All transactions are processed via Khidma's secure wallet system.",
    fr: "Les frais de retrait peuvent varier selon la méthode et les taux de conversion des devises. Toutes les transactions sont traitées via le portefeuille sécurisé de Khidma.",
    ar: "قد تختلف رسوم السحب حسب الطريقة وأسعار تحويل العملات. تتم معالجة جميع المعاملات عبر محفظة خدمة الآمنة.",
  },

  // === Testimonials ===
  "section.testimonials.subtitle": {
    en: "Real reviews from real contracts. Every testimonial below comes from a verified, paid project on Khidma.",
    fr: "Avis réels de contrats réels. Chaque témoignage ci-dessous provient d'un projet vérifié et payé sur Khidma.",
    ar: "تقييمات حقيقية من عقود حقيقية. كل شهادة أدناه مصدرها مشروع موثق ومدفوع على خدمة.",
  },

  // === FAQ section ===
  "section.faq.subtitle": {
    en: "Everything you need to know about verification, payments, contracts, and withdrawals on Khidma.",
    fr: "Tout ce que vous devez savoir sur la vérification, les paiements, les contrats et les retraits sur Khidma.",
    ar: "كل ما تحتاج معرفته عن التحقق والمدفوعات والعقود والسحوبات على خدمة.",
  },
  "section.faq.helpCard.title": {
    en: "Still have questions?",
    fr: "D'autres questions ?",
    ar: "ما زالت لديك أسئلة؟",
  },
  "section.faq.helpCard.body": {
    en: "Start the freelancer onboarding, our team walks you through every step.",
    fr: "Démarrez l'onboarding freelancer, notre équipe vous accompagne à chaque étape.",
    ar: "ابدأ onboarding المستقل، فريقنا يرشدك في كل خطوة.",
  },
  "section.faq.helpCard.ctaFreelancer": {
    en: "Become a freelancer",
    fr: "Devenir freelancer",
    ar: "كن مستقلاً",
  },
  "section.faq.helpCard.ctaHire": {
    en: "Hire talent",
    fr: "Engager du talent",
    ar: "وظف مواهب",
  },
  "section.faq.supportCard.title": {
    en: "Still have questions?",
    fr: "D'autres questions ?",
    ar: "ما زالت لديك أسئلة؟",
  },
  "section.faq.supportCard.body": {
    en: "Our support team replies within 24 hours, 7 days a week. We're here to help with verification, payments, contracts, and anything else.",
    fr: "Notre équipe support répond sous 24 heures, 7 jours sur 7. Nous sommes là pour vous aider avec la vérification, les paiements, les contrats et plus encore.",
    ar: "يرد فريق الدعم خلال 24 ساعة، 7 أيام في الأسبوع. نحن هنا لمساعدتك في التحقق والمدفوعات والعقود وأي شيء آخر.",
  },
  "section.faq.supportCard.cta": {
    en: "Contact support",
    fr: "Contacter le support",
    ar: "تواصل مع الدعم",
  },
  "section.faq.feedback.question": {
    en: "Was this helpful?",
    fr: "Cela a-t-il été utile ?",
    ar: "هل كان هذا مفيدًا؟",
  },
  "section.faq.feedback.yes": {
    en: "Yes",
    fr: "Oui",
    ar: "نعم",
  },
  "section.faq.feedback.no": {
    en: "No",
    fr: "Non",
    ar: "لا",
  },
  "section.faq.feedback.thanks": {
    en: "Thanks for your feedback!",
    fr: "Merci pour votre retour !",
    ar: "شكرًا على ملاحظاتك!",
  },
  "section.faq.feedback.helped": {
    en: "Glad this answer helped.",
    fr: "Content que cette réponse ait aidé.",
    ar: "سعداء أن هذه الإجابة ساعدتك.",
  },
  "section.faq.feedback.improve": {
    en: "We'll work on improving this answer.",
    fr: "Nous allons améliorer cette réponse.",
    ar: "سنعمل على تحسين هذه الإجابة.",
  },
  // === FAQ items (8 Q&A pairs) ===
  "section.faq.items.q1": {
    en: "How does verification work?",
    fr: "Comment fonctionne la vérification ?",
    ar: "كيف يعمل التحقق؟",
  },
  "section.faq.items.a1": {
    en: "Every freelancer goes through a multi-step verification: email confirmation, phone verification, national ID check, and a portfolio review by our team. Once all checks pass, the freelancer receives an Identity Verified badge that appears on their profile and proposals.",
    fr: "Chaque freelancer passe par une vérification en plusieurs étapes : confirmation e-mail, vérification téléphone, vérification de pièce d'identité nationale et examen de portfolio par notre équipe. Une fois toutes les vérifications réussies, le freelancer reçoit un badge Identité vérifiée qui apparaît sur son profil et ses propositions.",
    ar: "كل مستقل يمر بتحقق متعدد الخطوات: تأكيد البريد الإلكتروني، التحقق من الهاتف، فحص بطاقة الهوية الوطنية، ومراجعة المعرض من قبل فريقنا. عند اجتياز كل الفحوصات، يحصل المستقل على شارة الهوية موثقة تظهر في ملفه وعروضه.",
  },
  "section.faq.items.q2": {
    en: "Is Khidma free to join?",
    fr: "Khidma est-il gratuit à l'inscription ?",
    ar: "هل الانضمام إلى خدمة مجاني؟",
  },
  "section.faq.items.a2": {
    en: "Yes. Account registration, profile creation, job applications, and service publishing are completely free. Khidma only charges a flat 1% marketplace fee on completed contract payments, no subscriptions, no proposal credits, no listing fees.",
    fr: "Oui. L'inscription, la création de profil, les candidatures et la publication de services sont entièrement gratuits. Khidma facture uniquement des frais de marketplace forfaitaires de 1% sur les paiements de contrats terminés, sans abonnement, sans crédits de proposition, sans frais de publication.",
    ar: "نعم. تسجيل الحساب وإنشاء الملف والتقديم على الوظائف ونشر الخدمات مجانية تمامًا. خدمة يفرض فقط رسوم سوق ثابتة 1٪ على مدفوعات العقود المكتملة، بدون اشتراكات أو ائتمانات أو رسوم نشر.",
  },
  "section.faq.items.q3": {
    en: "How are payments protected?",
    fr: "Comment les paiements sont-ils protégés ?",
    ar: "كيف تُحمى المدفوعات؟",
  },
  "section.faq.items.a3": {
    en: "All contracts use milestone-based escrow. Clients fund milestones upfront and the funds are held safely by Khidma. Funds are only released to the freelancer once the client approves the delivered work, protecting both sides from non-payment and non-delivery.",
    fr: "Tous les contrats utilisent un séquestre par étapes. Les clients financent les étapes à l'avance et les fonds sont conservés en toute sécurité par Khidma. Les fonds ne sont libérés au freelancer qu'une fois le client a approuvé le travail livré, protégeant les deux parties du non-paiement et de non-livraison.",
    ar: "جميع العقود تستخدم ضمانًا قائمًا على المراحل. يموّل العملاء المراحل مسبقًا وتُحفظ الأموال بأمان من قبل خدمة. لا تُطلق الأموال للمستقل إلا بعد أن يوافق العميل على العمل المُسلَّم، مما يحمي الجانبين من عدم الدفع وعدم التسليم.",
  },
  "section.faq.items.q4": {
    en: "How is the 1% fee calculated?",
    fr: "Comment les frais de 1% sont-ils calculés ?",
    ar: "كيف تُحتسب رسوم 1٪؟",
  },
  "section.faq.items.a4": {
    en: "The fee is calculated on the total contract value at the time of milestone release. For example, on a 1,000 TND project, the platform fee is 10 TND and the freelancer receives 990 TND. There are no tier-based surcharges or hidden charges.",
    fr: "Les frais sont calculés sur la valeur totale du contrat au moment de la libération de l'étape. Par exemple, sur un projet de 1 000 TND, les frais de plateforme sont de 10 TND et le freelancer reçoit 990 TND. Il n'y a pas de suppléments par paliers ni de frais cachés.",
    ar: "تُحتسب الرسوم على إجمالي قيمة العقد وقت إطلاق المرحلة. على سبيل المثال، في مشروع 1000 دينار تونسي، رسوم المنصة هي 10 دينار ويتلقى المستقل 990 دينار. لا توجد رسوم إضافية حسب الفئة أو رسوم خفية.",
  },
  "section.faq.items.q5": {
    en: "How do withdrawals work?",
    fr: "Comment fonctionnent les retraits ?",
    ar: "كيف تعمل السحوبات؟",
  },
  "section.faq.items.a5": {
    en: "Available earnings in your Khidma wallet can be withdrawn via local methods (D17, Tunisian Post), bank transfers (BIAT, TIJARI, Zitouna), or international options (Western Union, international bank transfer). Processing times range from instant to 3–5 business days depending on the method.",
    fr: "Les gains disponibles dans votre portefeuille Khidma peuvent être retirés via des méthodes locales (D17, Poste tunisienne), virements bancaires (BIAT, TIJARI, Zitouna) ou options internationales (Western Union, virement bancaire international). Les délais varient de l'instantané à 3–5 jours ouvrables selon la méthode.",
    ar: "يمكن سحب الأرباح المتاحة في محفظة خدمة عبر الطرق المحلية (D17، البريد التونسي)، أو التحويلات المصرفية (BIAT، TIJARI، الزيتونة)، أو الخيارات الدولية (Western Union، التحويل المصرفي الدولي). تتراوح أوقات المعالجة من الفوري إلى 3-5 أيام عمل حسب الطريقة.",
  },
  "section.faq.items.q6": {
    en: "Can international clients hire Tunisian freelancers?",
    fr: "Les clients internationaux peuvent-ils engager des freelancers tunisiens ?",
    ar: "هل يمكن للعملاء الدوليين توظيف مستقلين تونسيين؟",
  },
  "section.faq.items.a6": {
    en: "Absolutely. Khidma is built to connect Tunisian talent with clients worldwide. International clients can post jobs, hire freelancers, fund escrow, and pay using major currencies. Withdrawals for freelancers support both local Tunisian and international methods.",
    fr: "Absolument. Khidma est conçu pour connecter le talent tunisien avec des clients du monde entier. Les clients internationaux peuvent publier des emplois, engager des freelancers, financer le séquestre et payer en principales devises. Les retraits pour freelancers prennent en charge les méthodes locales tunisiennes et internationales.",
    ar: "بالتأكيد. خدمة مصمم لربط المواهب التونسية بالعملاء حول العالم. يمكن للعملاء الدوليين نشر الوظائف، توظيف المستقلين، تمويل الضمان، والدفع باستخدام العملات الرئيسية. تدعم سحوبات المستقلين الطرق التونسية المحلية والدولية معًا.",
  },
  "section.faq.items.q7": {
    en: "What if there's a dispute?",
    fr: "Que faire en cas de litige ?",
    ar: "ماذا لو كان هناك نزاع؟",
  },
  "section.faq.items.a7": {
    en: "If a client and freelancer cannot reach agreement on a milestone, either party can open a dispute. Khidma's resolution team reviews the contract terms, communications, and delivered work, then issues a binding decision. Escrow funds remain protected throughout the process.",
    fr: "Si un client et un freelancer ne parviennent pas à un accord sur une étape, l'une ou l'autre partie peut ouvrir un litige. L'équipe de résolution de Khidma examine les termes du contrat, les communications et le travail livré, puis rend une décision contraignante. Les fonds séquestre restent protégés tout au long du processus.",
    ar: "إذا لم يتمكن العميل والمستقل من التوصل إلى اتفاق على مرحلة، يمكن لأي من الطرفين فتح نزاع. يراجع فريق حل النزاعات لدى خدمة شروط العقد والاتصالات والعمل المُسلَّم، ثم يصدر قرارًا ملزمًا. تبقى أموال الضمان محمية طوال العملية.",
  },
  "section.faq.items.q8": {
    en: "Can anyone become a freelancer?",
    fr: "N'importe qui peut-il devenir freelancer ?",
    ar: "هل يمكن لأي شخص أن يصبح مستقلاً؟",
  },
  "section.faq.items.a8": {
    en: "Anyone can register and start a profile, but to receive the Verified badge and apply for paid contracts, you must complete email, phone, and identity verification, and submit a portfolio for review. Our team reviews each application manually to maintain marketplace quality.",
    fr: "N'importe qui peut s'inscrire et créer un profil, mais pour recevoir le badge Vérifié et postuler à des contrats payants, vous devez compléter la vérification e-mail, téléphone et identité, et soumettre un portfolio à l'examen. Notre équipe examine chaque candidature manuellement pour maintenir la qualité de la marketplace.",
    ar: "يمكن لأي شخص التسجيل وبدء ملف، لكن للحصول على شارة موثق والتقديم على العقود المدفوعة، يجب إكمال التحقق من البريد والهاتف والهوية، وتقديم معرض للمراجعة. يراجع فريقنا كل طلب يدويًا للحفاظ على جودة السوق.",
  },

  // === Final CTA ===
  "section.finalCta.subtitle": {
    en: "Build a verified profile, win real contracts, and get paid through escrow-protected milestones. Work. Earn. Grow, with a marketplace that puts trust first.",
    fr: "Créez un profil vérifié, décrochez de vrais contrats et soyez payé via des étapes protégées par séquestre. Travaillez. Gagnez. Grandissez, avec une marketplace qui met la confiance en premier.",
    ar: "ابنِ ملفًا موثقًا، اربح عقودًا حقيقية، واحصل على أجرك عبر مراحل محمية بالضمان. اعمل. اكسب. نمِّ، مع سوق يضع الثقة أولاً.",
  },
  "section.finalCta.badge": {
    en: "Free to join · Real verification · 1% fee only",
    fr: "Inscription gratuite · Vérification réelle · 1% de frais uniquement",
    ar: "انضمام مجاني · تحقق حقيقي · رسوم 1٪ فقط",
  },
  "section.finalCta.takeTour": {
    en: "Take the tour",
    fr: "Faire le tour",
    ar: "خذ جولة",
  },
  "section.finalCcta.trust1": {
    en: "Identity-verified freelancers",
    fr: "Freelancers à identité vérifiée",
    ar: "مستقلون موثقة هوياتهم",
  },
  "section.finalCcta.trust2": {
    en: "Escrow-protected contracts",
    fr: "Contrats protégés par séquestre",
    ar: "عقود محمية بالضمان",
  },
  "section.finalCcta.trust3": {
    en: "Local & international withdrawals",
    fr: "Retraits locaux et internationaux",
    ar: "سحب محلي ودولي",
  },

  // === Trust strip , 6 badges ===
  "section.trustStrip.verifiedFreelancers": {
    en: "Verified Freelancers",
    fr: "Freelancers vérifiés",
    ar: "مستقلون موثقون",
  },
  "section.trustStrip.projectsCompleted": {
    en: "Projects Completed",
    fr: "Projets complétés",
    ar: "مشاريع منجزة",
  },
  "section.trustStrip.totalPaidOut": {
    en: "Total Paid Out",
    fr: "Total versé",
    ar: "إجمالي المدفوع",
  },
  "section.trustStrip.averageRating": {
    en: "Average Rating",
    fr: "Note moyenne",
    ar: "متوسط التقييم",
  },
  "section.trustStrip.countriesServed": {
    en: "Countries Served",
    fr: "Pays servis",
    ar: "دول مخدومة",
  },
  "section.trustStrip.citiesCovered": {
    en: "Cities Covered",
    fr: "Villes couvertes",
    ar: "مدن مغطاة",
  },

  // === Stats banner ===
  "section.statsBanner.subtitle": {
    en: "A marketplace built on real, measurable trust",
    fr: "Une marketplace fondée sur une confiance réelle et mesurable",
    ar: "سوق مبني على ثقة حقيقية وقابلة للقياس",
  },
  "section.statsBanner.verified": {
    en: "verified freelancers",
    fr: "freelancers vérifiés",
    ar: "مستقلون موثقون",
  },
  "section.statsBanner.completedProjects": {
    en: "completed projects",
    fr: "projets complétés",
    ar: "مشاريع منجزة",
  },
  "section.statsBanner.totalPaidOut": {
    en: "total paid out",
    fr: "total versé",
    ar: "إجمالي المدفوع",
  },
  "section.statsBanner.countriesServed": {
    en: "countries served",
    fr: "pays servis",
    ar: "دول مخدومة",
  },

  // === Stats dashboard ===
  "section.statsDashboard.description": {
    en: "Real-time platform metrics, updated continuously.",
    fr: "Indicateurs de plateforme en temps réel, mis à jour en continu.",
    ar: "مقاييس المنصة في الوقت الحقيقي، محدثة باستمرار.",
  },
  "section.statsDashboard.kpi.freelancers": {
    en: "Verified freelancers",
    fr: "Freelancers vérifiés",
    ar: "مستقلون موثقون",
  },
  "section.statsDashboard.kpi.projects": {
    en: "Completed projects",
    fr: "Projets complétés",
    ar: "مشاريع منجزة",
  },
  "section.statsDashboard.kpi.paid": {
    en: "Total paid out",
    fr: "Total versé",
    ar: "إجمالي المدفوع",
  },
  "section.statsDashboard.kpi.rating": {
    en: "Avg rating (out of 5.0)",
    fr: "Note moyenne (sur 5.0)",
    ar: "متوسط التقييم (من 5.0)",
  },
  "section.statsDashboard.growth.title": {
    en: "Growth over 6 months",
    fr: "Croissance sur 6 mois",
    ar: "النمو خلال 6 أشهر",
  },
  "section.statsDashboard.growth.subtitle": {
    en: "Freelancer signups vs project completions · Mar–Aug",
    fr: "Inscriptions freelancers vs projets complétés · Mar–Août",
    ar: "تسجيلات المستقلين مقابل المشاريع المنجزة · مارس-أغسطس",
  },
  "section.statsDashboard.legend.signups": {
    en: "Signups",
    fr: "Inscriptions",
    ar: "تسجيلات",
  },
  "section.statsDashboard.legend.completions": {
    en: "Completions",
    fr: "Achèvements",
    ar: "إتمام",
  },
  "section.statsDashboard.donut.title": {
    en: "Freelancers by category",
    fr: "Freelancers par catégorie",
    ar: "المستقلون حسب الفئة",
  },
  "section.statsDashboard.donut.subtitle": {
    en: "Distribution across top categories",
    fr: "Répartition dans les principales catégories",
    ar: "التوزيع عبر الفئات الرئيسية",
  },
  "section.statsDashboard.donut.center": {
    en: "verified",
    fr: "vérifiés",
    ar: "موثق",
  },
  "section.statsDashboard.donut.tooltip": {
    en: "% of freelancers",
    fr: "% des freelancers",
    ar: "٪ من المستقلين",
  },
  "section.statsDashboard.mini.countries": {
    en: "Countries served",
    fr: "Pays servis",
    ar: "دول مخدومة",
  },
  "section.statsDashboard.mini.cities": {
    en: "Cities covered",
    fr: "Villes couvertes",
    ar: "مدن مغطاة",
  },
  "section.statsDashboard.mini.responseTime": {
    en: "Avg response time",
    fr: "Délai de réponse moyen",
    ar: "متوسط وقت الاستجابة",
  },
  "section.statsDashboard.live": {
    en: "Live · last sync just now",
    fr: "En direct · dernière sync à l'instant",
    ar: "مباشر · آخر مزامنة الآن",
  },
  "section.statsDashboard.viewFull": {
    en: "View full stats",
    fr: "Voir toutes les stats",
    ar: "عرض كل الإحصائيات",
  },

  // === Success stories ===
  "section.successStories.description": {
    en: "These aren't marketing claims, they're verified Khidma freelancers who transformed their careers. Each story is backed by real contracts, real payments, and real reviews.",
    fr: "Ce ne sont pas des affirmations marketing, ce sont des freelancers Khidma vérifiés qui ont transformé leur carrière. Chaque histoire est soutenue par de vrais contrats, de vrais paiements et de vrais avis.",
    ar: "هذه ليست ادعاءات تسويقية، بل مستقلون موثقون من خدمة حوّلوا مسيرتهم. كل قصة مدعومة بعقود حقيقية ومدفوعات حقيقية وتقييمات حقيقية.",
  },
  "section.successStories.featuredStory": {
    en: "Featured story",
    fr: "Histoire en vedette",
    ar: "قصة مميزة",
  },
  "section.successStories.onKhidma": {
    en: "on Khidma",
    fr: "sur Khidma",
    ar: "على خدمة",
  },
  "section.successStories.readFullStory": {
    en: "Read full story",
    fr: "Lire l'histoire complète",
    ar: "اقرأ القصة كاملة",
  },
  "section.successStories.beforeAfter": {
    en: "Before / After Khidma",
    fr: "Avant / Après Khidma",
    ar: "قبل / بعد خدمة",
  },
  "section.successStories.before": {
    en: "Before",
    fr: "Avant",
    ar: "قبل",
  },
  "section.successStories.after": {
    en: "After",
    fr: "Après",
    ar: "بعد",
  },
  "section.successStories.keyOutcome": {
    en: "Key outcome",
    fr: "Résultat clé",
    ar: "النتيجة الرئيسية",
  },
  "section.successStories.metricsTitle": {
    en: "Khidma success, by the numbers",
    fr: "Succès Khidma, en chiffres",
    ar: "نجاح خدمة، بالأرقام",
  },
  "section.successStories.monthlyIncome": {
    en: "Monthly income",
    fr: "Revenu mensuel",
    ar: "الدخل الشهري",
  },
  "section.successStories.activeClients": {
    en: "Active clients",
    fr: "Clients actifs",
    ar: "عملاء نشطون",
  },
  "section.successStories.portfolioReviews": {
    en: "Portfolio reviews",
    fr: "Avis de portfolio",
    ar: "مراجعات المعرض",
  },
  "section.successStories.avgRating": {
    en: "Avg. rating",
    fr: "Note moyenne",
    ar: "متوسط التقييم",
  },

  // === Blog section ===
  "section.blog.description": {
    en: "Guides, stories, and best practices from the Khidma community.",
    fr: "Guides, histoires et bonnes pratiques de la communauté Khidma.",
    ar: "أدلة وقصص وأفضل الممارسات من مجتمع خدمة.",
  },
  "section.blog.minRead": {
    en: "{{count}} min read",
    fr: "{{count}} min de lecture",
    ar: "{{count}} دقيقة قراءة",
  },
  "section.blog.featured": {
    en: "Featured",
    fr: "À la une",
    ar: "مميز",
  },
  "section.blog.readArticle": {
    en: "Read article",
    fr: "Lire l'article",
    ar: "اقرأ المقال",
  },
  "section.blog.noArticles": {
    en: "No articles in this category yet.",
    fr: "Aucun article dans cette catégorie pour l'instant.",
    ar: "لا توجد مقالات في هذه الفئة بعد.",
  },
  "section.blog.newsletter.title": {
    en: "Khidma Insights, weekly",
    fr: "Khidma Insights, chaque semaine",
    ar: "رؤى خدمة، أسبوعيًا",
  },
  "section.blog.newsletter.body": {
    en: "One actionable email every Sunday, no fluff. Join 2,400+ freelancers across Tunisia.",
    fr: "Un e-mail actionnable chaque dimanche, sans blabla. Rejoignez 2 400+ freelancers à travers la Tunisie.",
    ar: "بريد إلكتروني عملي كل يوم أحد، بدون حشو. انضم إلى أكثر من 2400 مستقل عبر تونس.",
  },
  "section.blog.newsletter.placeholder": {
    en: "you@example.com",
    fr: "vous@exemple.com",
    ar: "you@example.com",
  },
  "section.blog.newsletter.emailLabel": {
    en: "Email address",
    fr: "Adresse e-mail",
    ar: "عنوان البريد الإلكتروني",
  },
  "section.blog.newsletter.subscribed": {
    en: "Subscribed to Khidma Insights!",
    fr: "Inscrit à Khidma Insights !",
    ar: "تم الاشتراك في رؤى خدمة!",
  },
  "section.blog.newsletter.invalidEmail": {
    en: "Please enter your email address.",
    fr: "Veuillez saisir votre adresse e-mail.",
    ar: "يرجى إدخال عنوان بريدك الإلكتروني.",
  },
  "section.blog.newsletter.invalidFormat": {
    en: "Please enter a valid email address.",
    fr: "Veuillez saisir une adresse e-mail valide.",
    ar: "يرجى إدخال عنوان بريد إلكتروني صالح.",
  },

  // === Mobile app section ===
  "section.mobileApp.description": {
    en: "Manage your freelance business from your phone. Get instant notifications, chat with clients, track earnings, and withdraw, all from the Khidma mobile app.",
    fr: "Gérez votre activité freelance depuis votre téléphone. Recevez des notifications instantanées, discutez avec les clients, suivez vos gains et retirez, le tout depuis l'application mobile Khidma.",
    ar: "أدر أعمالك المستقلة من هاتفك. احصل على إشعارات فورية، تحدث مع العملاء، تتبع أرباحك، واسحب، كل ذلك من تطبيق خدمة للهاتف.",
  },
  "section.mobileApp.feature.notifications": {
    en: "Instant push notifications for proposals & messages",
    fr: "Notifications push instantanées pour propositions & messages",
    ar: "إشعارات فورية للعروض والرسائل",
  },
  "section.mobileApp.feature.chat": {
    en: "Real-time chat with clients",
    fr: "Chat en temps réel avec les clients",
    ar: "محادثة فورية مع العملاء",
  },
  "section.mobileApp.feature.wallet": {
    en: "Wallet + earnings dashboard",
    fr: "Portefeuille + tableau de bord des gains",
    ar: "محفظة + لوحة تحكم الأرباح",
  },
  "section.mobileApp.feature.biometric": {
    en: "Biometric login (Face ID / fingerprint)",
    fr: "Connexion biométrique (Face ID / empreinte)",
    ar: "تسجيل الدخول البيومتري (Face ID / بصمة)",
  },
  "section.mobileApp.feature.offline": {
    en: "Offline mode for browsing freelancers",
    fr: "Mode hors ligne pour parcourir les freelancers",
    ar: "وضع عدم الاتصال لتصفح المستقلين",
  },
  "section.mobileApp.feature.withdrawal": {
    en: "Quick withdrawal requests",
    fr: "Demandes de retrait rapides",
    ar: "طلبات سحب سريعة",
  },
  "section.mobileApp.scanToDownload": {
    en: "Scan to download",
    fr: "Scanner pour télécharger",
    ar: "امسح للتنزيل",
  },
  "section.mobileApp.scanHelp": {
    en: "Point your camera here to install the Khidma app.",
    fr: "Pointez votre caméra ici pour installer l'application Khidma.",
    ar: "وجّه كاميرتك هنا لتثبيت تطبيق خدمة.",
  },
  "section.mobileApp.downloadOn": {
    en: "Download on the",
    fr: "Télécharger sur",
    ar: "تنزيل على",
  },
  "section.mobileApp.appStore": {
    en: "App Store",
    fr: "App Store",
    ar: "App Store",
  },
  "section.mobileApp.getItOn": {
    en: "Get it on",
    fr: "Disponible sur",
    ar: "احصل عليه على",
  },
  "section.mobileApp.googlePlay": {
    en: "Google Play",
    fr: "Google Play",
    ar: "Google Play",
  },
  "section.mobileApp.onAppStore": {
    en: "on App Store",
    fr: "sur App Store",
    ar: "على App Store",
  },
  "section.mobileApp.downloads": {
    en: "downloads",
    fr: "téléchargements",
    ar: "تنزيلات",
  },
  "section.mobileApp.countries": {
    en: "countries",
    fr: "pays",
    ar: "دول",
  },

  // === Community section ===
  "section.community.description": {
    en: "Where Tunisian freelancers connect, learn, and grow together.",
    fr: "Là où les freelancers tunisiens se connectent, apprennent et grandissent ensemble.",
    ar: "حيث يتصل المستقلون التونسيون ويتعلمون وينمون معًا.",
  },
  "section.community.events.title": {
    en: "Events & Meetups",
    fr: "Événements & Meetups",
    ar: "الفعاليات واللقاءات",
  },
  "section.community.events.description": {
    en: "Monthly meetups in Tunis, Sfax, Sousse. Virtual workshops every Thursday.",
    fr: "Meetups mensuels à Tunis, Sfax, Sousse. Ateliers virtuels chaque jeudi.",
    ar: "لقاءات شهرية في تونس وصفاقس وسوسة. ورش عمل افتراضية كل خميس.",
  },
  "section.community.events.note": {
    en: "Upcoming: Freelance Finance 101 · Sat Mar 15",
    fr: "À venir : Freelance Finance 101 · Sam 15 Mar",
    ar: "القادم: مالية العمل الحر 101 · السبت 15 مارس",
  },
  "section.community.events.cta": {
    en: "View all events",
    fr: "Voir tous les événements",
    ar: "عرض كل الفعاليات",
  },
  "section.community.forum.title": {
    en: "Community Forum",
    fr: "Forum communautaire",
    ar: "منتدى المجتمع",
  },
  "section.community.forum.description": {
    en: "Ask questions, share wins, get feedback from 8,420+ freelancers.",
    fr: "Posez des questions, partagez vos succès, obtenez des retours de 8 420+ freelancers.",
    ar: "اطرح أسئلة، شارك نجاحاتك، احصل على ملاحظات من أكثر من 8420 مستقل.",
  },
  "section.community.forum.note": {
    en: "2,847 active discussions · 142 new today",
    fr: "2 847 discussions actives · 142 nouvelles aujourd'hui",
    ar: "2847 نقاش نشط · 142 جديد اليوم",
  },
  "section.community.forum.cta": {
    en: "Browse forum",
    fr: "Parcourir le forum",
    ar: "تصفح المنتدى",
  },
  "section.community.mentorship.title": {
    en: "Mentorship Program",
    fr: "Programme de mentorat",
    ar: "برنامج الإرشاد",
  },
  "section.community.mentorship.description": {
    en: "Get matched with an experienced freelancer, or become a mentor.",
    fr: "Soyez associé à un freelancer expérimenté, ou devenez mentor.",
    ar: "ارتبط بمستقل ذي خبرة، أو كن مرشدًا.",
  },
  "section.community.mentorship.note": {
    en: "156 active mentorship pairs · 89% satisfaction",
    fr: "156 binômes de mentorat actifs · 89% de satisfaction",
    ar: "156 ثنائي إرشاد نشط · 89٪ رضا",
  },
  "section.community.mentorship.cta": {
    en: "Join mentorship",
    fr: "Rejoindre le mentorat",
    ar: "انضم للإرشاد",
  },
  "section.community.upcomingEvents": {
    en: "Upcoming events",
    fr: "Événements à venir",
    ar: "الفعاليات القادمة",
  },
  "section.community.upcomingEventsSubtitle": {
    en: "Free for Khidma members, virtual & in-person.",
    fr: "Gratuit pour les membres Khidma, virtuel & en personne.",
    ar: "مجانية لأعضاء خدمة، افتراضية وحضورية.",
  },
  "section.community.register": {
    en: "Register",
    fr: "S'inscrire",
    ar: "سجّل",
  },
  "section.community.registered": {
    en: "registered",
    fr: "inscrits",
    ar: "مسجلون",
  },
  "section.community.topContributors": {
    en: "Top contributors",
    fr: "Meilleurs contributeurs",
    ar: "أفضل المساهمين",
  },
  "section.community.topContributorsSubtitle": {
    en: "Community members leading the conversation this month.",
    fr: "Membres de la communauté qui animent la conversation ce mois-ci.",
    ar: "أعضاء المجتمع الذين يقودون النقاش هذا الشهر.",
  },
  "section.community.topContributorBadge": {
    en: "Top Contributor",
    fr: "Meilleur contributeur",
    ar: "أفضل مساهم",
  },
  "section.community.postsQuarter": {
    en: "posts this quarter",
    fr: "publications ce trimestre",
    ar: "منشورات هذا الربع",
  },
  "section.community.stats.members": {
    en: "members",
    fr: "membres",
    ar: "أعضاء",
  },
  "section.community.stats.discussions": {
    en: "discussions",
    fr: "discussions",
    ar: "نقاشات",
  },
  "section.community.stats.cities": {
    en: "cities",
    fr: "villes",
    ar: "مدن",
  },
  "section.community.stats.meetups": {
    en: "meetups/year",
    fr: "meetups/an",
    ar: "لقاءات/سنة",
  },

  // === Awards section ===
  "section.awards.description": {
    en: "Every year, we honor the freelancers who went above and beyond. Nominations are open to all verified members.",
    fr: "Chaque année, nous honorons les freelancers qui se sont surpassés. Les nominations sont ouvertes à tous les membres vérifiés.",
    ar: "كل عام، نكرّم المستقلين الذين تميزوا. الترشيحات مفتوحة لجميع الأعضاء الموثقين.",
  },
  "section.awards.featuredWinner": {
    en: "Khidma Awards 2025 · Featured Winner",
    fr: "Prix Khidma 2025 · Lauréat en vedette",
    ar: "جوائز خدمة 2025 · الفائز المميز",
  },
  "section.awards.freelancerOfYear": {
    en: "Freelancer of the Year 2025",
    fr: "Freelancer de l'année 2025",
    ar: "مستقل العام 2025",
  },
  "section.awards.winner2025": {
    en: "Winner 2025",
    fr: "Lauréat 2025",
    ar: "الفائز 2025",
  },
  "section.awards.nominateTitle": {
    en: "Nominate a freelancer for 2026",
    fr: "Nominer un freelancer pour 2026",
    ar: "رشّح مستقلاً لعام 2026",
  },
  "section.awards.nominateBody": {
    en: "Know a Khidma freelancer who deserves recognition? Submit their name and a short note about why they should win next year. Open to all verified members.",
    fr: "Connaissez-vous un freelancer Khidma qui mérite d'être reconnu ? Soumettez son nom et une courte note sur pourquoi il devrait gagner l'an prochain. Ouvert à tous les membres vérifiés.",
    ar: "هل تعرف مستقلاً من خدمة يستحق التقدير؟ قدّم اسمه وملاحظة قصيرة عن سبب استحقاقه للفوز العام القادم. مفتوح لجميع الأعضاء الموثقين.",
  },
  "section.awards.submitNomination": {
    en: "Submit nomination",
    fr: "Soumettre la nomination",
    ar: "أرسل الترشيح",
  },
  "section.awards.ceremonyTitle": {
    en: "Awards Ceremony 2025",
    fr: "Cérémonie des Prix 2025",
    ar: "حفل الجوائز 2025",
  },
  "section.awards.ceremonyBody": {
    en: "Join us in Tunis to celebrate this year's winners. Live ceremony, panel talks, and networking with the community.",
    fr: "Rejoignez-nous à Tunis pour célébrer les lauréats de cette année. Cérémonie en direct, tables rondes et réseautage avec la communauté.",
    ar: "انضم إلينا في تونس للاحتفال بفائزي هذا العام. حفل مباشر، ندوات، وتواصل مع المجتمع.",
  },
  "section.awards.getTickets": {
    en: "Get tickets",
    fr: "Obtenir des billets",
    ar: "احصل على التذاكر",
  },
  "section.awards.pastWinners": {
    en: "Past winners",
    fr: "Lauréats précédents",
    ar: "الفائزون السابقون",
  },
  "section.awards.yearLabel": {
    en: "Year",
    fr: "Année",
    ar: "السنة",
  },

  // === Trust Center section ===
  "section.trustCenter.description": {
    en: "Everything we do is built around trust. Here's exactly how we protect both freelancers and clients, from identity verification to escrow, reviews, and dispute resolution.",
    fr: "Tout ce que nous faisons est fondé sur la confiance. Voici exactement comment nous protégeons freelancers et clients, de la vérification d'identité au séquestre, avis et résolution des litiges.",
    ar: "كل ما نقوم به مبني على الثقة. إليك بالضبط كيف نحمي المستقلين والعملاء، من التحقق من الهوية إلى الضمان والتقييمات وحل النزاعات.",
  },
  "section.trustCenter.p1.title": {
    en: "Identity Verification",
    fr: "Vérification d'identité",
    ar: "التحقق من الهوية",
  },
  "section.trustCenter.p1.description": {
    en: "Every freelancer's identity is verified via government ID + phone + email. No anonymous accounts, ever.",
    fr: "L'identité de chaque freelancer est vérifiée via pièce d'identité + téléphone + e-mail. Aucun compte anonyme, jamais.",
    ar: "تُتحقق هوية كل مستقل عبر بطاقة الهاتف + الهاتف + البريد. لا حسابات مجهولة أبدًا.",
  },
  "section.trustCenter.p2.title": {
    en: "Portfolio Review",
    fr: "Examen de portfolio",
    ar: "مراجعة المعرض",
  },
  "section.trustCenter.p2.description": {
    en: "Our team reviews portfolio items for authenticity. Admin-verified items display a strong, unmistakable badge.",
    fr: "Notre équipe examine les éléments de portfolio pour leur authenticité. Les éléments vérifiés par l'admin affichent un badge fort et sans équivoque.",
    ar: "يراجع فريقنا عناصر المعرض للتأكد من صحتها. العناصر الموثقة من المشرف تعرض شارة قوية وواضحة.",
  },
  "section.trustCenter.p3.title": {
    en: "Escrow Protection",
    fr: "Protection par séquestre",
    ar: "حماية الضمان",
  },
  "section.trustCenter.p3.description": {
    en: "Client funds are held in escrow until milestones are approved. Freelancers get paid for completed work, always.",
    fr: "Les fonds des clients sont conservés en séquestre jusqu'à l'approbation des étapes. Les freelancers sont payés pour le travail terminé, toujours.",
    ar: "تُحفظ أموال العملاء في الضمان حتى تتم الموافقة على المراحل. يحصل المستقلون على أجرهم على العمل المكتمل، دائمًا.",
  },
  "section.trustCenter.p4.title": {
    en: "Two-sided Reviews",
    fr: "Avis bidirectionnels",
    ar: "تقييمات ثنائية",
  },
  "section.trustCenter.p4.description": {
    en: "Both clients and freelancers review each other after every contract. No fake reviews, all tied to real, paid projects.",
    fr: "Clients et freelancers se notent mutuellement après chaque contrat. Aucun faux avis, tous liés à de vrais projets payés.",
    ar: "كل من العملاء والمستقلين يقيّمون بعضهم بعد كل عقد. لا تقييمات وهمية، كلها مرتبطة بمشاريع حقيقية مدفوعة.",
  },
  "section.trustCenter.process.title": {
    en: "How a freelancer earns the verified badge",
    fr: "Comment un freelancer obtient le badge vérifié",
    ar: "كيف يحصل المستقل على شارة موثق",
  },
  "section.trustCenter.process.subtitle": {
    en: "Five steps stand between a new signup and a verified profile. Each one adds a layer of trust, for clients and for the freelancer's own reputation.",
    fr: "Cinq étapes séparent une nouvelle inscription d'un profil vérifié. Chacune ajoute une couche de confiance, pour les clients et pour la réputation du freelancer.",
    ar: "خمس خطوات تفصل بين تسجيل جديد وملف موثق. كل واحدة تضيف طبقة ثقة، للعملاء ولمستقبل المستقل.",
  },
  "section.trustCenter.step1.title": {
    en: "Registration",
    fr: "Inscription",
    ar: "التسجيل",
  },
  "section.trustCenter.step1.description": {
    en: "Create your account with a valid email address.",
    fr: "Créez votre compte avec une adresse e-mail valide.",
    ar: "أنشئ حسابك ببريد إلكتروني صالح.",
  },
  "section.trustCenter.step2.title": {
    en: "Email Verify",
    fr: "Vérification e-mail",
    ar: "تأكيد البريد",
  },
  "section.trustCenter.step2.description": {
    en: "Confirm your email to activate your account.",
    fr: "Confirmez votre e-mail pour activer votre compte.",
    ar: "أكّد بريدك لتفعيل حسابك.",
  },
  "section.trustCenter.step3.title": {
    en: "Profile + Portfolio",
    fr: "Profil + Portfolio",
    ar: "الملف + المعرض",
  },
  "section.trustCenter.step3.description": {
    en: "Complete your profile and upload portfolio items.",
    fr: "Complétez votre profil et téléversez des éléments de portfolio.",
    ar: "أكمل ملفك وارفع عناصر معرضك.",
  },
  "section.trustCenter.step4.title": {
    en: "Admin Review",
    fr: "Examen admin",
    ar: "مراجعة المشرف",
  },
  "section.trustCenter.step4.description": {
    en: "Our team reviews your identity and portfolio.",
    fr: "Notre équipe examine votre identité et portfolio.",
    ar: "يراجع فريقنا هويتك ومعرضك.",
  },
  "section.trustCenter.step5.title": {
    en: "Verified Badge",
    fr: "Badge vérifié",
    ar: "شارة موثق",
  },
  "section.trustCenter.step5.description": {
    en: "Earn the verified badge and unlock Top Rated perks.",
    fr: "Obtenez le badge vérifié et débloquez les avantages Top Rated.",
    ar: "احصل على شارة موثق وافتح مزايا الأعلى تقييمًا.",
  },
  "section.trustCenter.dispute.title": {
    en: "If something goes wrong",
    fr: "Si quelque chose tourne mal",
    ar: "إذا سار شيء بشكل خاطئ",
  },
  "section.trustCenter.dispute.body": {
    en: "Disputes are rare on Khidma, but when they happen, our team resolves them quickly and fairly, with full transparency for both sides.",
    fr: "Les litiges sont rares sur Khidma, mais lorsqu'ils surviennent, notre équipe les résout rapidement et équitablement, en toute transparence pour les deux parties.",
    ar: "النزاعات نادرة على خدمة، لكن عند حدوثها، يحلها فريقنا بسرعة وعدالة، بشفافية كاملة للجانبين.",
  },
  "section.trustCenter.dispute.learnMore": {
    en: "Learn more",
    fr: "En savoir plus",
    ar: "اعرف المزيد",
  },
  "section.trustCenter.dispute.step1.title": {
    en: "Open a dispute",
    fr: "Ouvrir un litige",
    ar: "افتح نزاعًا",
  },
  "section.trustCenter.dispute.step1.description": {
    en: "Either party can flag a contract from the project page. Provide context and any supporting evidence.",
    fr: "L'une ou l'autre partie peut signaler un contrat depuis la page projet. Fournissez le contexte et toute preuve à l'appui.",
    ar: "يمكن لأي طرف الإبلاغ عن عقد من صفحة المشروع. قدّم السياق وأي أدلة داعمة.",
  },
  "section.trustCenter.dispute.step2.title": {
    en: "Our team reviews evidence",
    fr: "Notre équipe examine les preuves",
    ar: "يراجع فريقنا الأدلة",
  },
  "section.trustCenter.dispute.step2.description": {
    en: "A Khidma mediator examines milestones, messages, deliverables, and escrow status, fairly and neutrally.",
    fr: "Un médiateur Khidma examine les étapes, messages, livrables et le statut du séquestre, de façon juste et neutre.",
    ar: "يفحص وسيط من خدمة المراحل والرسائل والمخرجات وحالة الضمان، بعدل وحياد.",
  },
  "section.trustCenter.dispute.step3.title": {
    en: "Fair resolution within 48h",
    fr: "Résolution équitable sous 48h",
    ar: "حل عادل خلال 48 ساعة",
  },
  "section.trustCenter.dispute.step3.description": {
    en: "Funds are released to the rightful party. Both sides receive a written decision with full reasoning.",
    fr: "Les fonds sont libérés à la partie légitime. Les deux parties reçoivent une décision écrite avec le raisonnement complet.",
    ar: "تُطلق الأموال للطرف المستحق. يتلقى الجانبان قرارًا مكتوبًا بالتفكير الكامل.",
  },
  "section.trustCenter.cta.title": {
    en: "Start with confidence",
    fr: "Commencez en confiance",
    ar: "ابدأ بثقة",
  },
  "section.trustCenter.cta.body": {
    en: "Join a marketplace where every freelancer is verified, every payment is escrow-protected, and every review is real.",
    fr: "Rejoignez une marketplace où chaque freelancer est vérifié, chaque paiement est protégé par séquestre et chaque avis est réel.",
    ar: "انضم إلى سوق حيث كل مستقل موثق، وكل دفعة محمية بالضمان، وكل تقييم حقيقي.",
  },
  "section.trustCenter.cta.becomeVerified": {
    en: "Become a verified freelancer",
    fr: "Devenir un freelancer vérifié",
    ar: "كن مستقلاً موثقًا",
  },
  "section.trustCenter.cta.hireTrusted": {
    en: "Hire trusted talent",
    fr: "Engager du talent de confiance",
    ar: "وظف مواهب موثوقة",
  },

  // === Payment explainer section ===
  "section.paymentExplainer.title": {
    en: "Transparent Pricing. No Subscriptions. No Credits. No Limits.",
    fr: "Tarification transparente. Pas d'abonnements. Pas de crédits. Pas de limites.",
    ar: "تسعير شفاف. لا اشتراكات. لا ائتمانات. لا حدود.",
  },
  "section.paymentExplainer.description": {
    en: "Khidma charges a flat 1% marketplace fee on completed contracts. No subscriptions, no proposal credits, no listing fees. Just clear, predictable pricing.",
    fr: "Khidma facture des frais de marketplace forfaitaires de 1% sur les contrats terminés. Sans abonnement, sans crédits de proposition, sans frais de publication. Une tarification claire et prévisible.",
    ar: "خدمة يفرض رسومًا ثابتة 1٪ على العقود المكتملة. بدون اشتراكات أو ائتمانات أو رسوم نشر. مجرد تسعير واضح ومتوقع.",
  },
  "section.paymentExplainer.exampleCalc": {
    en: "Example calculation",
    fr: "Exemple de calcul",
    ar: "مثال حسابي",
  },
  "section.paymentExplainer.projectBudget": {
    en: "Project budget of {{amount}}",
    fr: "Budget projet de {{amount}}",
    ar: "ميزانية المشروع {{amount}}",
  },
  "section.paymentExplainer.freelancerPct": {
    en: "{{pct}}% Freelancer",
    fr: "{{pct}}% Freelancer",
    ar: "{{pct}}٪ مستقل",
  },
  "section.paymentExplainer.freelancerReceives": {
    en: "Freelancer receives",
    fr: "Le freelancer reçoit",
    ar: "يستقبل المستقل",
  },
  "section.paymentExplainer.onePctFee": {
    en: "1% fee",
    fr: "1% de frais",
    ar: "1٪ رسوم",
  },
  "section.paymentExplainer.project": {
    en: "Project",
    fr: "Projet",
    ar: "المشروع",
  },
  "section.paymentExplainer.platformFee": {
    en: "Platform fee (1%)",
    fr: "Frais de plateforme (1%)",
    ar: "رسوم المنصة (1٪)",
  },
  "section.paymentExplainer.whatsIncluded": {
    en: "What's included",
    fr: "Ce qui est inclus",
    ar: "ما الذي يتضمنه",
  },
  "section.paymentExplainer.neverCharge": {
    en: "What we never charge",
    fr: "Ce que nous ne facturons jamais",
    ar: "ما لن نحاسبك عليه أبدًا",
  },

  // === Tunisian Cities ===
  "section.tunisianCities.title": {
    en: "Talent in every wilaya",
    fr: "Du talent dans chaque wilaya",
    ar: "موهبة في كل ولاية",
  },
  "section.tunisianCities.description": {
    en: "From Tunis to Tataouine, Khidma freelancers span 24 cities across the country. Find local talent or work with the best, wherever they are.",
    fr: "De Tunis à Tataouine, les freelancers Khidma couvrent 24 villes à travers le pays. Trouvez du talent local ou travaillez avec les meilleurs, où qu'ils soient.",
    ar: "من تونس إلى تطاوين، ينتشر مستقلو خدمة عبر 24 مدينة في البلد. اعثر على موهبة محلية أو اعمل مع الأفضل، أينما كانوا.",
  },
  "section.tunisianCities.topCities": {
    en: "Top cities by freelancer count",
    fr: "Top villes par nombre de freelancers",
    ar: "أعلى المدن حسب عدد المستقلين",
  },
  "section.tunisianCities.topCitiesDesc": {
    en: "Ranked from largest talent pool to smallest.",
    fr: "Classées du plus grand vivier de talents au plus petit.",
    ar: "مرتبة من أكبر تجمع للمواهب إلى الأصغر.",
  },
  "section.tunisianCities.browse": {
    en: "Browse",
    fr: "Parcourir",
    ar: "تصفح",
  },
  "section.tunisianCities.tapHint": {
    en: "Tap a city to browse local freelancers",
    fr: "Touchez une ville pour parcourir les freelancers locaux",
    ar: "انقر على مدينة لتصفح المستقلين المحليين",
  },
  "section.tunisianCities.biggerPin": {
    en: "More freelancers = bigger pin",
    fr: "Plus de freelancers = épingle plus grande",
    ar: "مستقلون أكثر = دبوس أكبر",
  },
  "section.tunisianCities.liveVerified": {
    en: "Live network · {{count}} verified",
    fr: "Réseau en direct · {{count}} vérifiés",
    ar: "شبكة مباشرة · {{count}} موثق",
  },
  "section.tunisianCities.topCategories": {
    en: "Top categories",
    fr: "Catégories principales",
    ar: "أعلى الفئات",
  },
  "section.tunisianCities.freelancersCount": {
    en: "{{count}} freelancers",
    fr: "{{count}} freelancers",
    ar: "{{count}} مستقل",
  },
  "section.tunisianCities.ofNetwork": {
    en: "% of network",
    fr: "% du réseau",
    ar: "٪ من الشبكة",
  },
  "section.tunisianCities.stats.cities": {
    en: "Cities covered",
    fr: "Villes couvertes",
    ar: "مدن مغطاة",
  },
  "section.tunisianCities.stats.verified": {
    en: "Verified freelancers",
    fr: "Freelancers vérifiés",
    ar: "مستقلون موثقون",
  },
  "section.tunisianCities.stats.hubs": {
    en: "Cities with 50+ freelancers",
    fr: "Villes avec 50+ freelancers",
    ar: "مدن بها 50+ مستقل",
  },
  "section.tunisianCities.stats.majorHubs": {
    en: "Cities with 100+ freelancers",
    fr: "Villes avec 100+ freelancers",
    ar: "مدن بها 100+ مستقل",
  },
  "section.tunisianCities.hintTunisia": {
    en: "across Tunisia",
    fr: "à travers la Tunisie",
    ar: "عبر تونس",
  },
  "section.tunisianCities.hintVerified": {
    en: "identity-checked",
    fr: "identité vérifiée",
    ar: "تم التحقق من الهوية",
  },
  "section.tunisianCities.hintHalf": {
    en: "half the network",
    fr: "la moitié du réseau",
    ar: "نصف الشبكة",
  },
  "section.tunisianCities.hintHubs": {
    en: "major hubs",
    fr: "centres majeurs",
    ar: "مراكز رئيسية",
  },
  "section.tunisianCities.footerNote": {
    en: "Khidma is built in Tunisia, for Tunisian freelancers and the clients who hire them.",
    fr: "Khidma est conçu en Tunisie, pour les freelancers tunisiens et les clients qui les embauchent.",
    ar: "خدمة مصنوع في تونس، للمستقلين التونسيين والعملاء الذين يوظفونهم.",
  },

  // === Academy section ===
  "section.academy.description": {
    en: "Free courses by top Tunisian freelancers. From beginner to Pro, level up your freelance career.",
    fr: "Cours gratuits par les meilleurs freelancers tunisiens. Du débutant au Pro, faites évoluer votre carrière freelance.",
    ar: "دورات مجانية من أفضل المستقلين التونسيين. من المبتدئ إلى المحترف، طوّر مسيرتك المستقلة.",
  },
  "section.academy.featuredCourse": {
    en: "Featured course",
    fr: "Cours en vedette",
    ar: "دورة مميزة",
  },
  "section.academy.startFree": {
    en: "Start learning free",
    fr: "Commencer gratuitement",
    ar: "ابدأ التعلم مجانًا",
  },
  "section.academy.freeCertificate": {
    en: "100% free · Certificate included",
    fr: "100% gratuit · Certificat inclus",
    ar: "100٪ مجاني · شهادة مشمولة",
  },
  "section.academy.enrollFree": {
    en: "Enroll free",
    fr: "S'inscrire gratuitement",
    ar: "سجّل مجانًا",
  },
  "section.academy.learningPaths": {
    en: "Learning paths",
    fr: "Parcours d'apprentissage",
    ar: "مسارات التعلم",
  },
  "section.academy.learningPathsSubtitle": {
    en: "Curated tracks that take you from zero to hireable",
    fr: "Parcours sélectionnés qui vous mènent de zéro à embauchable",
    ar: "مسارات مختارة تأخذك من الصفر إلى قابل للتوظيف",
  },
  "section.academy.viewPath": {
    en: "View path",
    fr: "Voir le parcours",
    ar: "عرض المسار",
  },
  "section.academy.pathBadge": {
    en: "Path",
    fr: "Parcours",
    ar: "مسار",
  },
  "section.academy.courses": {
    en: "courses",
    fr: "cours",
    ar: "دورات",
  },
  "section.academy.totalHours": {
    en: "{{n}}h total",
    fr: "{{n}}h au total",
    ar: "{{n}}س إجمالي",
  },
  "section.academy.hours": {
    en: "hours",
    fr: "heures",
    ar: "ساعات",
  },
  "section.academy.lessons": {
    en: "lessons",
    fr: "leçons",
    ar: "دروس",
  },
  "section.academy.students": {
    en: "{{count}} students",
    fr: "{{count}} étudiants",
    ar: "{{count}} طالب",
  },
  "section.academy.freeCourses": {
    en: "free courses",
    fr: "cours gratuits",
    ar: "دورات مجانية",
  },
  "section.academy.activeLearners": {
    en: "active learners",
    fr: "apprenants actifs",
    ar: "متعلّمون نشطون",
  },
  "section.academy.ofContent": {
    en: "of content",
    fr: "de contenu",
    ar: "من المحتوى",
  },
  "section.academy.averageRating": {
    en: "average rating",
    fr: "note moyenne",
    ar: "متوسط التقييم",
  },
  "section.academy.becomeInstructor": {
    en: "Become an instructor",
    fr: "Devenir instructeur",
    ar: "كن مدرّسًا",
  },
  "section.academy.instructorBody": {
    en: "Share your expertise. Earn from your knowledge. Join 40+ Tunisian freelancers already teaching on Khidma Academy.",
    fr: "Partagez votre expertise. Gagnez grâce à vos connaissances. Rejoignez 40+ freelancers tunisiens qui enseignent déjà sur l'Académie Khidma.",
    ar: "شارك خبرتك. اكسب من معرفتك. انضم إلى أكثر من 40 مستقلاً تونسيًا يدرّسون بالفعل في أكاديمية خدمة.",
  },
  "section.academy.applyToTeach": {
    en: "Apply to teach",
    fr: "Postuler pour enseigner",
    ar: "قدم للتدريس",
  },

  // === Podcast section ===
  "section.podcast.description": {
    en: "Conversations with Tunisian freelancers who are building the future. New episodes every Tuesday.",
    fr: "Conversations avec des freelancers tunisiens qui construisent l'avenir. Nouveaux épisodes chaque mardi.",
    ar: "محادثات مع مستقلين تونسيين يبنون المستقبل. حلقات جديدة كل ثلاثاء.",
  },
  "section.podcast.newEpisode": {
    en: "New episode",
    fr: "Nouvel épisode",
    ar: "حلقة جديدة",
  },
  "section.podcast.episodeFeatured": {
    en: "Episode {{n}} · Featured",
    fr: "Épisode {{n}} · À la une",
    ar: "الحلقة {{n}} · مميزة",
  },
  "section.podcast.host": {
    en: "Host",
    fr: "Hôte",
    ar: "المضيف",
  },
  "section.podcast.guest": {
    en: "Guest",
    fr: "Invité",
    ar: "الضيف",
  },
  "section.podcast.nowPlaying": {
    en: "Now playing",
    fr: "Lecture en cours",
    ar: "قيد التشغيل",
  },
  "section.podcast.addToPlaylist": {
    en: "Add to playlist",
    fr: "Ajouter à la playlist",
    ar: "أضف إلى قائمة التشغيل",
  },
  "section.podcast.share": {
    en: "Share",
    fr: "Partager",
    ar: "مشاركة",
  },
  "section.podcast.latestEpisodes": {
    en: "Latest episodes",
    fr: "Derniers épisodes",
    ar: "أحدث الحلقات",
  },
  "section.podcast.updatedWeekly": {
    en: "· Updated weekly",
    fr: "· Mis à jour chaque semaine",
    ar: "· محدّث أسبوعيًا",
  },
  "section.podcast.episodeN": {
    en: "Episode {{n}}",
    fr: "Épisode {{n}}",
    ar: "الحلقة {{n}}",
  },
  "section.podcast.withGuest": {
    en: "with {{name}}",
    fr: "avec {{name}}",
    ar: "مع {{name}}",
  },
  "section.podcast.listen": {
    en: "Listen",
    fr: "Écouter",
    ar: "استمع",
  },
  "section.podcast.subscribeTitle": {
    en: "Subscribe on your favorite platform",
    fr: "Abonnez-vous sur votre plateforme préférée",
    ar: "اشترك على منصتك المفضلة",
  },
  "section.podcast.subscribeBody": {
    en: "New episodes every Tuesday. Never miss a conversation.",
    fr: "Nouveaux épisodes chaque mardi. Ne manquez aucune conversation.",
    ar: "حلقات جديدة كل ثلاثاء. لا تفوّت أي محادثة.",
  },

  // === Khidma components , cards ===
  "card.from": {
    en: "From",
    fr: "À partir de",
    ar: "من",
  },
  "card.startingAt": {
    en: "Starting at",
    fr: "À partir de",
    ar: "يبدأ من",
  },
  "card.deliveryDays": {
    en: "{{n}}-day delivery",
    fr: "Livraison {{n}} jours",
    ar: "تسليم خلال {{n}} أيام",
  },
  "card.by": {
    en: "by",
    fr: "par",
    ar: "بواسطة",
  },
  "card.saved": {
    en: "Saved",
    fr: "Enregistré",
    ar: "محفوظ",
  },
  "card.compare": {
    en: "Compare",
    fr: "Comparer",
    ar: "قارن",
  },
  "card.inCompare": {
    en: "In compare",
    fr: "Dans la comparaison",
    ar: "في المقارنة",
  },
  "card.view": {
    en: "View",
    fr: "Voir",
    ar: "عرض",
  },
  "card.available": {
    en: "Available",
    fr: "Disponible",
    ar: "متاح",
  },
  "card.limited": {
    en: "Limited",
    fr: "Limité",
    ar: "محدود",
  },
  "card.booked": {
    en: "Booked",
    fr: "Réservé",
    ar: "محجوز",
  },
  "card.availableForWork": {
    en: "Available for work",
    fr: "Disponible pour travailler",
    ar: "متاح للعمل",
  },
  "card.limitedAvailability": {
    en: "Limited availability",
    fr: "Disponibilité limitée",
    ar: "توفر محدود",
  },
  "card.currentlyBooked": {
    en: "Currently booked",
    fr: "Actuellement réservé",
    ar: "محجوز حاليًا",
  },
  "card.fixedPrice": {
    en: "Fixed Price",
    fr: "Prix fixe",
    ar: "سعر ثابت",
  },
  "card.hourly": {
    en: "Hourly",
    fr: "Horaire",
    ar: "بالساعة",
  },
  "card.verifiedClient": {
    en: "Verified Client",
    fr: "Client vérifié",
    ar: "عميل موثق",
  },

  // === Notifications dropdown ===
  "notifications.title": {
    en: "Notifications",
    fr: "Notifications",
    ar: "الإشعارات",
  },
  "notifications.new": {
    en: "new",
    fr: "nouvelles",
    ar: "جديد",
  },
  "notifications.markAllRead": {
    en: "Mark all read",
    fr: "Tout marquer comme lu",
    ar: "تعليم الكل كمقروء",
  },
  "notifications.clearAll": {
    en: "Clear all notifications",
    fr: "Tout effacer",
    ar: "مسح كل الإشعارات",
  },
  "notifications.empty": {
    en: "No notifications",
    fr: "Aucune notification",
    ar: "لا إشعارات",
  },
  "notifications.emptyBody": {
    en: "You're all caught up. New activity will appear here.",
    fr: "Vous êtes à jour. Les nouvelles activités apparaîtront ici.",
    ar: "أنت على اطلاع. ستظهر الأنشطة الجديدة هنا.",
  },
  "notifications.count": {
    en: "notification",
    fr: "notification",
    ar: "إشعار",
  },
  "notifications.countPlural": {
    en: "notifications",
    fr: "notifications",
    ar: "إشعارات",
  },
  "notifications.viewAllActivity": {
    en: "View all activity",
    fr: "Voir toute l'activité",
    ar: "عرض كل النشاط",
  },

  // === Compare tray ===
  "compare.comparing": {
    en: "Comparing",
    fr: "Comparaison",
    ar: "مقارنة",
  },
  "compare.maxReached": {
    en: "Max reached",
    fr: "Max atteint",
    ar: "بلغ الحد الأقصى",
  },
  "compare.addAnother": {
    en: "Add another to compare",
    fr: "Ajoutez-en un autre à comparer",
    ar: "أضف آخر للمقارنة",
  },
  "compare.freelancersSelected": {
    en: "{{count}} freelancers selected",
    fr: "{{count}} freelancers sélectionnés",
    ar: "تم اختيار {{count}} مستقلين",
  },
  "compare.now": {
    en: "Compare now",
    fr: "Comparer maintenant",
    ar: "قارن الآن",
  },
  "compare.short": {
    en: "Compare",
    fr: "Comparer",
    ar: "قارن",
  },
  "compare.clear": {
    en: "Clear compare queue",
    fr: "Vider la file de comparaison",
    ar: "مسح قائمة المقارنة",
  },

  // === Cookie consent ===
  "cookie.title": {
    en: "We use cookies",
    fr: "Nous utilisons des cookies",
    ar: "نستخدم ملفات تعريف الارتباط",
  },
  "cookie.body": {
    en: "We use cookies to operate the marketplace, analyze traffic and personalize your experience. You can accept all cookies or reject non-essential ones.",
    fr: "Nous utilisons des cookies pour faire fonctionner la marketplace, analyser le trafic et personnaliser votre expérience. Vous pouvez accepter tous les cookies ou refuser les non essentiels.",
    ar: "نستخدم ملفات تعريف الارتباط لتشغيل السوق وتحليل حركة المرور وتخصيص تجربتك. يمكنك قبول جميع ملفات تعريف الارتباط أو رفض غير الضرورية.",
  },
  "cookie.privacySettings": {
    en: "Privacy settings",
    fr: "Paramètres de confidentialité",
    ar: "إعدادات الخصوصية",
  },
  "cookie.reject": {
    en: "Reject non-essential",
    fr: "Refuser les non essentiels",
    ar: "ارفض غير الضروري",
  },
  "cookie.accept": {
    en: "Accept all",
    fr: "Accepter tout",
    ar: "اقبل الكل",
  },
  "cookie.dismiss": {
    en: "Dismiss cookie banner",
    fr: "Fermer la bannière cookies",
    ar: "إغلاق لافتة ملفات تعريف الارتباط",
  },

  // === Onboarding tour ===
  "tour.step1.title": {
    en: "Welcome to Khidma",
    fr: "Bienvenue sur Khidma",
    ar: "أهلاً بك في خدمة",
  },
  "tour.step1.description": {
    en: "The trusted marketplace for verified Tunisian talent. Let's take a quick tour.",
    fr: "La marketplace de confiance pour le talent tunisien vérifié. Faisons un rapide tour.",
    ar: "السوق الموثوق للمواهب التونسية الموثقة. لنأخذ جولة سريعة.",
  },
  "tour.step2.title": {
    en: "Find anyone, anything",
    fr: "Trouvez n'importe qui, n'importe quoi",
    ar: "اعثر على أي شخص أو شيء",
  },
  "tour.step2.description": {
    en: "Use ⌘K or the search bar to find freelancers, services, jobs, or jump to any page.",
    fr: "Utilisez ⌘K ou la barre de recherche pour trouver freelancers, services, jobs, ou aller à n'importe quelle page.",
    ar: "استخدم ⌘K أو شريط البحث للعثور على مستقلين أو خدمات أو وظائف أو الانتقال لأي صفحة.",
  },
  "tour.step3.title": {
    en: "Explore the marketplace",
    fr: "Explorez la marketplace",
    ar: "استكشف السوق",
  },
  "tour.step3.description": {
    en: "Browse freelancers, find work, or check out services.",
    fr: "Parcourez les freelancers, trouvez du travail, ou consultez les services.",
    ar: "تصفح المستقلين، اعثر على عمل، أو اطلع على الخدمات.",
  },
  "tour.step4.title": {
    en: "Get started free",
    fr: "Commencer gratuitement",
    ar: "ابدأ مجانًا",
  },
  "tour.step4.description": {
    en: "Join Khidma as a freelancer or client. It's free and takes 2 minutes.",
    fr: "Rejoignez Khidma comme freelancer ou client. C'est gratuit et prend 2 minutes.",
    ar: "انضم إلى خدمة كمستقل أو عميل. مجاني ويستغرق دقيقتين.",
  },
  "tour.step5.title": {
    en: "Real people. Real trust.",
    fr: "De vraies personnes. Une vraie confiance.",
    ar: "أشخاص حقيقيون. ثقة حقيقية.",
  },
  "tour.step5.description": {
    en: "Every freelancer is verified: identity, portfolio, reviews.",
    fr: "Chaque freelancer est vérifié : identité, portfolio, avis.",
    ar: "كل مستقل موثق: الهوية، المعرض، التقييمات.",
  },
  "tour.step6.title": {
    en: "You're all set!",
    fr: "Vous êtes prêt !",
    ar: "أنت جاهز!",
  },
  "tour.step6.description": {
    en: "Explore the marketplace, save your favorites, and start your Khidma journey today.",
    fr: "Explorez la marketplace, enregistrez vos favoris et commencez votre parcours Khidma aujourd'hui.",
    ar: "استكشف السوق، احفظ مفضلاتك، وابدأ رحلتك مع خدمة اليوم.",
  },
  "tour.stepOf": {
    en: "Step {{current}} of {{total}}",
    fr: "Étape {{current}} sur {{total}}",
    ar: "الخطوة {{current}} من {{total}}",
  },
  "tour.skip": {
    en: "Skip tour",
    fr: "Passer le tour",
    ar: "تخطّ الجولة",
  },
  "tour.back": {
    en: "Back",
    fr: "Retour",
    ar: "رجوع",
  },
  "tour.next": {
    en: "Next",
    fr: "Suivant",
    ar: "التالي",
  },
  "tour.getStarted": {
    en: "Get started",
    fr: "Commencer",
    ar: "ابدأ",
  },
  "tour.takeTheTour": {
    en: "Take the tour",
    fr: "Faire le tour",
    ar: "خذ جولة",
  },

  // === Auth modal ===
  "auth.tagline": {
    en: "Work. Earn. Grow.",
    fr: "Travaillez. Gagnez. Grandissez.",
    ar: "اعمل. اكسب. نمِّ.",
  },
  "auth.brandSubtitle": {
    en: "The trusted marketplace connecting verified Tunisian freelancers with clients worldwide.",
    fr: "La marketplace de confiance connectant les freelancers tunisiens vérifiés avec les clients du monde entier.",
    ar: "السوق الموثوق الذي يربط المستقلين التونسيين الموثقين بالعملاء حول العالم.",
  },
  "auth.joinedBy": {
    en: "Joined by",
    fr: "Rejoint par",
    ar: "انضمّ",
  },
  "auth.tunisianPros": {
    en: "Tunisian pros",
    fr: "professionnels tunisiens",
    ar: "محترفون تونسيون",
  },
  "auth.logIn": {
    en: "Log in",
    fr: "Connexion",
    ar: "تسجيل الدخول",
  },
  "auth.signUp": {
    en: "Sign up",
    fr: "S'inscrire",
    ar: "إنشاء حساب",
  },
  "auth.welcomeBack": {
    en: "Welcome back",
    fr: "Bon retour",
    ar: "مرحبًا بعودتك",
  },
  "auth.signInSubtitle": {
    en: "Sign in to manage your projects and proposals.",
    fr: "Connectez-vous pour gérer vos projets et propositions.",
    ar: "سجّل الدخول لإدارة مشاريعك وعروضك.",
  },
  "auth.createAccount": {
    en: "Create your account",
    fr: "Créez votre compte",
    ar: "أنشئ حسابك",
  },
  "auth.registerSubtitle": {
    en: "Join Khidma as a freelancer or client, it takes 2 minutes.",
    fr: "Rejoignez Khidma comme freelancer ou client, ça prend 2 minutes.",
    ar: "انضم إلى خدمة كمستقل أو عميل، يستغرق دقيقتين.",
  },
  "auth.email": {
    en: "Email",
    fr: "E-mail",
    ar: "البريد الإلكتروني",
  },
  "auth.password": {
    en: "Password",
    fr: "Mot de passe",
    ar: "كلمة المرور",
  },
  "auth.fullName": {
    en: "Full name",
    fr: "Nom complet",
    ar: "الاسم الكامل",
  },
  "auth.forgotPassword": {
    en: "Forgot password?",
    fr: "Mot de passe oublié ?",
    ar: "نسيت كلمة المرور؟",
  },
  "auth.iAm": {
    en: "I am a…",
    fr: "Je suis…",
    ar: "أنا...",
  },
  "auth.freelancer": {
    en: "Freelancer",
    fr: "Freelancer",
    ar: "مستقل",
  },
  "auth.freelancerDesc": {
    en: "Offer services & apply to jobs",
    fr: "Offrir des services & postuler",
    ar: "قدّم خدمات وتقدّم للوظائف",
  },
  "auth.client": {
    en: "Client",
    fr: "Client",
    ar: "عميل",
  },
  "auth.clientDesc": {
    en: "Hire talent & post jobs",
    fr: "Engager du talent & publier des jobs",
    ar: "وظّف مواهب وانشر وظائف",
  },
  "auth.agree": {
    en: "I agree to Khidma's Terms of Service and Privacy Policy.",
    fr: "J'accepte les Conditions d'utilisation et la Politique de confidentialité de Khidma.",
    ar: "أوافق على شروط الخدمة وسياسة الخصوصية لخدمة.",
  },
  "auth.termsOfService": {
    en: "Terms of Service",
    fr: "Conditions d'utilisation",
    ar: "شروط الخدمة",
  },
  "auth.privacyPolicy": {
    en: "Privacy Policy",
    fr: "Politique de confidentialité",
    ar: "سياسة الخصوصية",
  },
  "auth.dontHaveAccount": {
    en: "Don't have an account?",
    fr: "Pas de compte ?",
    ar: "ليس لديك حساب؟",
  },
  "auth.alreadyHaveAccount": {
    en: "Already have an account?",
    fr: "Vous avez déjà un compte ?",
    ar: "لديك حساب بالفعل؟",
  },
  "auth.submitLogin": {
    en: "Log in",
    fr: "Se connecter",
    ar: "تسجيل الدخول",
  },
  "auth.submitRegister": {
    en: "Create account",
    fr: "Créer le compte",
    ar: "إنشاء الحساب",
  },
  "auth.signingIn": {
    en: "Signing in…",
    fr: "Connexion…",
    ar: "جار تسجيل الدخول…",
  },
  "auth.creating": {
    en: "Creating…",
    fr: "Création…",
    ar: "جار الإنشاء…",
  },
  "auth.demoMode": {
    en: "Demo mode, any email & password will work",
    fr: "Mode démo, tout e-mail & mot de passe fonctionne",
    ar: "الوضع التجريبي، أي بريد وكلمة مرور سيعمل",
  },
  "auth.errors.fullName": {
    en: "Full name is required",
    fr: "Le nom complet est requis",
    ar: "الاسم الكامل مطلوب",
  },
  "auth.errors.email": {
    en: "Email is required",
    fr: "L'e-mail est requis",
    ar: "البريد الإلكتروني مطلوب",
  },
  "auth.errors.emailInvalid": {
    en: "Enter a valid email",
    fr: "Saisissez un e-mail valide",
    ar: "أدخل بريدًا إلكترونيًا صالحًا",
  },
  "auth.errors.password": {
    en: "Password is required",
    fr: "Le mot de passe est requis",
    ar: "كلمة المرور مطلوبة",
  },
  "auth.errors.passwordShort": {
    en: "Min. 6 characters",
    fr: "Min. 6 caractères",
    ar: "6 أحرف على الأقل",
  },
  "auth.errors.agree": {
    en: "Please accept the Terms",
    fr: "Veuillez accepter les Conditions",
    ar: "يرجى قبول الشروط",
  },

  // === Wallet modal ===
  "wallet.title": {
    en: "Khidma Wallet",
    fr: "Portefeuille Khidma",
    ar: "محفظة خدمة",
  },
  "wallet.subtitle": {
    en: "Track earnings, withdrawals, and pending payments",
    fr: "Suivez les gains, retraits et paiements en attente",
    ar: "تتبّع الأرباح والسحوبات والمدفوعات المعلقة",
  },
  "wallet.totalBalance": {
    en: "total balance",
    fr: "solde total",
    ar: "الرصيد الإجمالي",
  },
  "wallet.available": {
    en: "Available",
    fr: "Disponible",
    ar: "متاح",
  },
  "wallet.availableSub": {
    en: "Ready to withdraw",
    fr: "Prêt à retirer",
    ar: "جاهز للسحب",
  },
  "wallet.pending": {
    en: "Pending",
    fr: "En attente",
    ar: "معلّق",
  },
  "wallet.pendingSub": {
    en: "In clearance (7 days)",
    fr: "En cours de compensation (7 jours)",
    ar: "قيد التصفية (7 أيام)",
  },
  "wallet.processing": {
    en: "Processing",
    fr: "En traitement",
    ar: "قيد المعالجة",
  },
  "wallet.processingSub": {
    en: "Withdrawal in progress",
    fr: "Retrait en cours",
    ar: "السحب قيد التقدم",
  },
  "wallet.withdrawn": {
    en: "Withdrawn",
    fr: "Retiré",
    ar: "مسحوب",
  },
  "wallet.withdrawnSub": {
    en: "All-time total",
    fr: "Total cumulé",
    ar: "الإجمالي التراكمي",
  },
  "wallet.earnings30": {
    en: "Earnings (last 30 days)",
    fr: "Gains (30 derniers jours)",
    ar: "الأرباح (آخر 30 يومًا)",
  },
  "wallet.requestWithdrawal": {
    en: "Request Withdrawal",
    fr: "Demander un retrait",
    ar: "اطلب سحبًا",
  },
  "wallet.topUpWallet": {
    en: "Top up wallet",
    fr: "Recharger le portefeuille",
    ar: "اشحن المحفظة",
  },
  "wallet.topUp": {
    en: "Top up",
    fr: "Recharger",
    ar: "شحن",
  },
  "wallet.viewFullHistory": {
    en: "View full history",
    fr: "Voir tout l'historique",
    ar: "عرض السجل الكامل",
  },
  "wallet.tab.balances": {
    en: "Balances",
    fr: "Soldes",
    ar: "الأرصدة",
  },
  "wallet.tab.history": {
    en: "History",
    fr: "Historique",
    ar: "السجل",
  },
  "wallet.tab.methods": {
    en: "Withdrawal methods",
    fr: "Méthodes de retrait",
    ar: "طرق السحب",
  },
  "wallet.recentTransactions": {
    en: "Recent transactions",
    fr: "Transactions récentes",
    ar: "المعاملات الأخيرة",
  },
  "wallet.last30Days": {
    en: "Last 30 days",
    fr: "30 derniers jours",
    ar: "آخر 30 يومًا",
  },
  "wallet.withdrawalMethods": {
    en: "Withdrawal methods",
    fr: "Méthodes de retrait",
    ar: "طرق السحب",
  },
  "wallet.methodsPickWay": {
    en: "Pick your preferred way to receive your earnings.",
    fr: "Choisissez votre moyen préféré pour recevoir vos gains.",
    ar: "اختر طريقتك المفضلة لاستلام أرباحك.",
  },
  "wallet.fee": {
    en: "fee",
    fr: "frais",
    ar: "رسوم",
  },
  "wallet.addNewMethod": {
    en: "Add new method",
    fr: "Ajouter une méthode",
    ar: "أضف طريقة جديدة",
  },
  "wallet.escrowNote": {
    en: "Khidma uses secure escrow for all transactions. Withdrawals are processed within 1-3 business days depending on the method chosen.",
    fr: "Khidma utilise un séquestre sécurisé pour toutes les transactions. Les retraits sont traités sous 1 à 3 jours ouvrables selon la méthode choisie.",
    ar: "خدمة يستخدم ضمانًا آمنًا لجميع المعاملات. تتم معالجة السحوبات خلال 1-3 أيام عمل حسب الطريقة المختارة.",
  },
  "wallet.availableToWithdraw": {
    en: "available to withdraw",
    fr: "disponible au retrait",
    ar: "متاح للسحب",
  },
  "wallet.manageMethods": {
    en: "Manage methods",
    fr: "Gérer les méthodes",
    ar: "إدارة الطرق",
  },

  // === Freelancer profile modal ===
  "profile.about": {
    en: "About",
    fr: "À propos",
    ar: "نبذة",
  },
  "profile.skills": {
    en: "Skills",
    fr: "Compétences",
    ar: "المهارات",
  },
  "profile.experience": {
    en: "Experience",
    fr: "Expérience",
    ar: "الخبرة",
  },
  "profile.education": {
    en: "Education",
    fr: "Éducation",
    ar: "التعليم",
  },
  "profile.certifications": {
    en: "Certifications",
    fr: "Certifications",
    ar: "الشهادات",
  },
  "profile.memberSince": {
    en: "Member since {{date}}",
    fr: "Membre depuis {{date}}",
    ar: "عضو منذ {{date}}",
  },
  "profile.inviteToJob": {
    en: "Invite to Job",
    fr: "Inviter à un job",
    ar: "ادعُ لوظيفة",
  },
  "profile.contact": {
    en: "Contact",
    fr: "Contacter",
    ar: "تواصل",
  },
  "profile.requestProposal": {
    en: "Request Proposal",
    fr: "Demander une proposition",
    ar: "اطلب عرضًا",
  },
  "profile.share": {
    en: "Share",
    fr: "Partager",
    ar: "مشاركة",
  },
  "profile.report": {
    en: "Report this listing",
    fr: "Signaler cette annonce",
    ar: "أبلغ عن هذه القائمة",
  },
  "profile.save": {
    en: "Save",
    fr: "Enregistrer",
    ar: "حفظ",
  },
  "profile.viewServices": {
    en: "View Services",
    fr: "Voir les services",
    ar: "عرض الخدمات",
  },
  "profile.overview": {
    en: "Overview",
    fr: "Aperçu",
    ar: "نظرة عامة",
  },
  "profile.portfolio": {
    en: "Portfolio",
    fr: "Portfolio",
    ar: "المعرض",
  },
  "profile.services": {
    en: "Services",
    fr: "Services",
    ar: "الخدمات",
  },
  "profile.reviews": {
    en: "Reviews",
    fr: "Avis",
    ar: "التقييمات",
  },
  "profile.achievements": {
    en: "Achievements",
    fr: "Trophées",
    ar: "الإنجازات",
  },
  "profile.portfolioCount": {
    en: "Portfolio ({{count}})",
    fr: "Portfolio ({{count}})",
    ar: "المعرض ({{count}})",
  },
  "profile.servicesCount": {
    en: "Services ({{count}})",
    fr: "Services ({{count}})",
    ar: "الخدمات ({{count}})",
  },
  "profile.reviewsCount": {
    en: "Reviews ({{count}})",
    fr: "Avis ({{count}})",
    ar: "التقييمات ({{count}})",
  },
  "profile.respondsIn": {
    en: "Responds {{time}}",
    fr: "Répond {{time}}",
    ar: "يرد خلال {{time}}",
  },

  // === Help modal , categories ===
  "help.category.gettingStarted": {
    en: "Getting Started",
    fr: "Démarrage",
    ar: "البدء",
  },
  "help.category.forFreelancers": {
    en: "For Freelancers",
    fr: "Pour les freelancers",
    ar: "للمستقلين",
  },
  "help.category.forClients": {
    en: "For Clients",
    fr: "Pour les clients",
    ar: "للعملاء",
  },
  "help.category.payments": {
    en: "Payments & Withdrawals",
    fr: "Paiements & Retraits",
    ar: "المدفوعات والسحوبات",
  },
  "help.category.verification": {
    en: "Verification & Trust",
    fr: "Vérification & Confiance",
    ar: "التحقق والثقة",
  },
  "help.category.account": {
    en: "Account & Security",
    fr: "Compte & Sécurité",
    ar: "الحساب والأمان",
  },
  "help.category.disputes": {
    en: "Disputes",
    fr: "Litiges",
    ar: "النزاعات",
  },
  "help.searchPlaceholder": {
    en: "Search articles…",
    fr: "Rechercher des articles…",
    ar: "ابحث في المقالات…",
  },

  // === Onboarding wizard , step meta ===
  "onboarding.step1.name": {
    en: "Personal Info",
    fr: "Infos personnelles",
    ar: "المعلومات الشخصية",
  },
  "onboarding.step1.desc": {
    en: "Tell us who you are",
    fr: "Dites-nous qui vous êtes",
    ar: "أخبرنا من أنت",
  },
  "onboarding.step2.name": {
    en: "Professional Info",
    fr: "Infos professionnelles",
    ar: "المعلومات المهنية",
  },
  "onboarding.step2.desc": {
    en: "Define your offer",
    fr: "Définissez votre offre",
    ar: "حدد عرضك",
  },
  "onboarding.step3.name": {
    en: "Skills",
    fr: "Compétences",
    ar: "المهارات",
  },
  "onboarding.step3.desc": {
    en: "Pick your strengths",
    fr: "Choisissez vos points forts",
    ar: "اختر نقاط قوتك",
  },
  "onboarding.step4.name": {
    en: "Experience",
    fr: "Expérience",
    ar: "الخبرة",
  },
  "onboarding.step4.desc": {
    en: "Show your track record",
    fr: "Montrez votre parcours",
    ar: "اعرض سجلك",
  },
  "onboarding.step5.name": {
    en: "Portfolio",
    fr: "Portfolio",
    ar: "المعرض",
  },
  "onboarding.step5.desc": {
    en: "Showcase your work",
    fr: "Présentez votre travail",
    ar: "اعرض أعمالك",
  },
  "onboarding.step6.name": {
    en: "Profile Photo",
    fr: "Photo de profil",
    ar: "صورة الملف",
  },
  "onboarding.step6.desc": {
    en: "Put a face to your name",
    fr: "Associez un visage à votre nom",
    ar: "ضع وجهًا لاسمك",
  },
  "onboarding.step7.name": {
    en: "Verification",
    fr: "Vérification",
    ar: "التحقق",
  },
  "onboarding.step7.desc": {
    en: "Confirm your identity",
    fr: "Confirmez votre identité",
    ar: "أكّد هويتك",
  },
  "onboarding.step8.name": {
    en: "Review & Submit",
    fr: "Revue & Soumission",
    ar: "مراجعة وإرسال",
  },
  "onboarding.step8.desc": {
    en: "Final review",
    fr: "Revue finale",
    ar: "المراجعة النهائية",
  },

  // === Command palette , group labels ===
  "cmd.action.becomeFreelancer": {
    en: "Become a freelancer",
    fr: "Devenir freelancer",
    ar: "كن مستقلاً",
  },
  "cmd.action.startOnboarding": {
    en: "Start your onboarding journey",
    fr: "Démarrez votre parcours d'onboarding",
    ar: "ابدأ رحلة الانضمام",
  },
  "cmd.action.postJob": {
    en: "Post a job",
    fr: "Publier un emploi",
    ar: "انشر وظيفة",
  },
  "cmd.action.hireVerified": {
    en: "Hire verified Tunisian talent",
    fr: "Engager du talent tunisien vérifié",
    ar: "وظّف مواهب تونسية موثقة",
  },
  "cmd.action.createService": {
    en: "Create a service",
    fr: "Créer un service",
    ar: "أنشئ خدمة",
  },
  "cmd.action.listService": {
    en: "List a new service offering",
    fr: "Lister une nouvelle offre de service",
    ar: "أضف عرض خدمة جديد",
  },
  "cmd.action.openMessaging": {
    en: "Open messaging",
    fr: "Ouvrir la messagerie",
    ar: "افتح الرسائل",
  },
  "cmd.action.viewConversations": {
    en: "View your conversations",
    fr: "Voir vos conversations",
    ar: "اعرض محادثاتك",
  },
  "cmd.action.openWallet": {
    en: "Open wallet",
    fr: "Ouvrir le portefeuille",
    ar: "افتح المحفظة",
  },
  "cmd.action.walletBalance": {
    en: "Balance, transactions, withdrawals",
    fr: "Solde, transactions, retraits",
    ar: "الرصيد، المعاملات، السحوبات",
  },
  "cmd.action.switchLight": {
    en: "Switch to light mode",
    fr: "Passer en mode clair",
    ar: "بدّل إلى الوضع الفاتح",
  },
  "cmd.action.switchDark": {
    en: "Switch to dark mode",
    fr: "Passer en mode sombre",
    ar: "بدّل إلى الوضع الداكن",
  },
  "cmd.action.toggleTheme": {
    en: "Toggle UI theme",
    fr: "Basculer le thème",
    ar: "بدّل المظهر",
  },
  "cmd.navigate.home": {
    en: "Home",
    fr: "Accueil",
    ar: "الرئيسية",
  },
  "cmd.navigate.backLanding": {
    en: "Back to landing page",
    fr: "Retour à la page d'accueil",
    ar: "العودة للصفحة الرئيسية",
  },
  "cmd.navigate.findWork": {
    en: "Find Work",
    fr: "Trouver du travail",
    ar: "ابحث عن عمل",
  },
  "cmd.navigate.browseJobs": {
    en: "Browse open jobs",
    fr: "Parcourir les jobs ouverts",
    ar: "تصفح الوظائف المفتوحة",
  },
  "cmd.navigate.browseServices": {
    en: "Browse services",
    fr: "Parcourir les services",
    ar: "تصفح الخدمات",
  },
  "cmd.navigate.platformWalkthrough": {
    en: "Platform walkthrough",
    fr: "Visite de la plateforme",
    ar: "جولة في المنصة",
  },
  "cmd.navigate.yourDashboard": {
    en: "Your freelancer dashboard",
    fr: "Votre tableau de bord freelancer",
    ar: "لوحة تحكم المستقل الخاصة بك",
  },
  "cmd.navigate.adminConsole": {
    en: "Admin Review Console",
    fr: "Console d'examen admin",
    ar: "وحدة مراجعة المشرف",
  },
  "cmd.navigate.reviewApplications": {
    en: "Review freelancer applications",
    fr: "Examiner les candidatures freelancer",
    ar: "راجع طلبات المستقلين",
  },
  "cmd.navigate.platformStats": {
    en: "Platform Stats",
    fr: "Stats de la plateforme",
    ar: "إحصائيات المنصة",
  },
  "cmd.navigate.realtimeAnalytics": {
    en: "Real-time marketplace analytics",
    fr: "Analytique marketplace en temps réel",
    ar: "تحليلات السوق في الوقت الحقيقي",
  },
  "cmd.footer.navigate": {
    en: "navigate",
    fr: "naviguer",
    ar: "تنقل",
  },
  "cmd.footer.select": {
    en: "select",
    fr: "sélectionner",
    ar: "اختيار",
  },
  "cmd.footer.close": {
    en: "close",
    fr: "fermer",
    ar: "إغلاق",
  },
  "cmd.footer.esc": {
    en: "esc",
    fr: "esc",
    ar: "esc",
  },

  // === Live notifications messages ===
  "live.toast1": {
    en: "Amira just completed a project worth TND 4,200",
    fr: "Amira vient de terminer un projet de 4 200 TND",
    ar: "أكملت أميرة للتو مشروعًا بقيمة 4200 دينار",
  },
  "live.toast2": {
    en: "Yassine received a new 5-star review",
    fr: "Yassine a reçu un nouvel avis 5 étoiles",
    ar: "ياسين حصل على تقييم 5 نجوم جديد",
  },
  "live.toast3": {
    en: "New job posted: 'Build a Next.js dashboard'",
    fr: "Nouveau job publié : « Créer un dashboard Next.js »",
    ar: "وظيفة جديدة: «أنشئ لوحة تحكم Next.js»",
  },
  "live.toast4": {
    en: "TND 990 withdrawn via BIAT Bank",
    fr: "990 TND retirés via BIAT Bank",
    ar: "990 دينار سُحبت عبر بنك BIAT",
  },
  "live.toast5": {
    en: "Omar's portfolio was just verified",
    fr: "Le portfolio d'Omar vient d'être vérifié",
    ar: "تم للتو توثيق معرض عمر",
  },
  "live.toast6": {
    en: "Syrine's service was ordered 3 times today",
    fr: "Le service de Syrine a été commandé 3 fois aujourd'hui",
    ar: "تم طلب خدمة سيرين 3 مرات اليوم",
  },
  "live.toast7": {
    en: "Rania received a 5.0 rating from a client",
    fr: "Rania a reçu une note de 5.0 d'un client",
    ar: "رانيا حصلت على تقييم 5.0 من عميل",
  },
  "live.toast8": {
    en: "Mehdi reached 100 completed projects",
    fr: "Mehdi a atteint 100 projets complétés",
    ar: "مهدي وصل إلى 100 مشروع مكتمل",
  },
  "live.toast9": {
    en: "12 new freelancers joined Khidma today",
    fr: "12 nouveaux freelancers ont rejoint Khidma aujourd'hui",
    ar: "12 مستقلاً جديدًا انضموا إلى خدمة اليوم",
  },
  "live.toast10": {
    en: "Amira won 'Freelancer of the Week'",
    fr: "Amira a remporté « Freelancer de la semaine »",
    ar: "أميرة فازت بـ«مستقل الأسبوع»",
  },
  "live.toast11": {
    en: "New milestone funded: TND 1,500",
    fr: "Nouvelle étape financée : 1 500 TND",
    ar: "تمويل مرحلة جديدة: 1500 دينار",
  },
  "live.toast12": {
    en: "Yassine just responded to a client in 8 minutes",
    fr: "Yassine vient de répondre à un client en 8 minutes",
    ar: "ياسين رد على عميل خلال 8 دقائق",
  },
  "live.toast13": {
    en: "Omar's 3D render was viewed 47 times",
    fr: "Le rendu 3D d'Omar a été vu 47 fois",
    ar: "تم مشاهدة تصيير عمر ثلاثي الأبعاد 47 مرة",
  },
  "live.toast14": {
    en: "TND 12,450 paid out to freelancers today",
    fr: "12 450 TND versés aux freelancers aujourd'hui",
    ar: "12450 دينار دُفعت للمستقلين اليوم",
  },
  "live.toast15": {
    en: "5 new Top Rated freelancers this week",
    fr: "5 nouveaux freelancers Top Rated cette semaine",
    ar: "5 مستقلين جدد بأعلى تقييم هذا الأسبوع",
  },
  "live.toast16": {
    en: "New escrow contract funded: TND 2,800",
    fr: "Nouveau contrat séquestre financé : 2 800 TND",
    ar: "عقد ضمان جديد ممول: 2800 دينار",
  },
  "live.toast17": {
    en: "3 urgent jobs posted in the last hour",
    fr: "3 jobs urgents publiés dans la dernière heure",
    ar: "3 وظائف عاجلة نُشرت في آخر ساعة",
  },
  "live.toast18": {
    en: "Karim's hourly rate just went up to TND 95",
    fr: "Le taux horaire de Karim vient de passer à 95 TND",
    ar: "سعر كريم بالساعة ارتفع للتو إلى 95 دينار",
  },
  "live.activityLabel": {
    en: "Live activity",
    fr: "Activité en direct",
    ar: "نشاط مباشر",
  },
  "live.onKhidma": {
    en: "Live on Khidma",
    fr: "En direct sur Khidma",
    ar: "مباشر على خدمة",
  },
  "live.pause": {
    en: "Pause live activity notifications",
    fr: "Mettre en pause les notifications en direct",
    ar: "إيقاف إشعارات النشاط المباشر",
  },
  "live.resume": {
    en: "Resume live activity notifications",
    fr: "Reprendre les notifications en direct",
    ar: "استئناف إشعارات النشاط المباشر",
  },
  "live.showNow": {
    en: "Show a live activity notification now",
    fr: "Afficher une notification en direct maintenant",
    ar: "اعرض إشعار نشاط مباشر الآن",
  },
  "live.tooltip.on": {
    en: "Auto-fire on, click to pause",
    fr: "Tir auto activé, cliquez pour mettre en pause",
    ar: "الإطلاق التلقائي مفعّل، انقر للإيقاف",
  },
  "live.tooltip.off": {
    en: "Auto-fire paused, click to resume",
    fr: "Tir auto en pause, cliquez pour reprendre",
    ar: "الإطلاق التلقائي متوقف، انقر للاستئناف",
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
