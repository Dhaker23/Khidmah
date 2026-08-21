"use client";

import dynamic from "next/dynamic";
import { Header } from "@/components/khidma/header";
import { Footer } from "@/components/khidma/footer";
import { CursorGlow } from "@/components/khidma/cursor-glow";
import { ScrollProgress } from "@/components/khidma/scroll-progress";
import { ScrollToSection } from "@/components/khidma/scroll-to-section";
import { FreelancerGridSkeleton } from "@/components/khidma/skeletons";
import { PageTransition } from "@/components/khidma/page-transition";
import {
  Hero,
  FeaturedThisWeek,
  TrustStrip,
  HowItWorks,
  Categories,
  FeaturedFreelancers,
  FeaturedServices,
  OpenJobs,
  WhyKhidma,
  TrustCenter,
  TunisianCities,
  PaymentExplainer,
  WithdrawalOptions,
  Testimonials,
  TestimonialCarousel,
  SuccessStories,
  StatsBanner,
  StatsDashboard,
  BlogSection,
  MobileAppPromo,
  CommunitySection,
  AwardsSection,
  FAQ,
  FinalCTA,
} from "@/components/sections";
import { AuthModal, OnboardingWizard } from "@/components/modals";
import { CommandPalette } from "@/components/khidma/command-palette";
import { BackToTop } from "@/components/khidma/back-to-top";
import { CompareTray } from "@/components/khidma/compare-tray";
import { LiveNotifications } from "@/components/khidma/live-notifications";
import {
  WaveDivider,
  DotGridDivider,
  GradientDivider,
} from "@/components/khidma/section-rhythm";
import { useApp } from "@/lib/store";
import { cn } from "@/lib/utils";

// Views are dynamically imported to keep initial bundle smaller and avoid SSR mismatch
const FreelancersView = dynamic(
  () => import("@/components/views/freelancers-view").then((m) => m.FreelancersView),
  { ssr: false, loading: () => <ViewLoading /> }
);
const ServicesView = dynamic(
  () => import("@/components/views/services-view").then((m) => m.ServicesView),
  { ssr: false, loading: () => <ViewLoading /> }
);
const JobsView = dynamic(
  () => import("@/components/views/jobs-view").then((m) => m.JobsView),
  { ssr: false, loading: () => <ViewLoading /> }
);
const HowItWorksView = dynamic(
  () => import("@/components/views/how-it-works-view").then((m) => m.HowItWorksView),
  { ssr: false, loading: () => <ViewLoading /> }
);
const DashboardView = dynamic(
  () => import("@/components/views/dashboard-view").then((m) => m.DashboardView),
  { ssr: false, loading: () => <ViewLoading /> }
);
const AdminView = dynamic(
  () => import("@/components/views/admin-view").then((m) => m.default),
  { ssr: false, loading: () => <ViewLoading /> }
);
const StatsView = dynamic(
  () => import("@/components/views/stats-view").then((m) => m.StatsView),
  { ssr: false, loading: () => <ViewLoading /> }
);

// Modals are dynamically imported (they're heavy and only open on demand)
const FreelancerProfileModal = dynamic(
  () =>
    import("@/components/modals/freelancer-profile-modal").then(
      (m) => m.FreelancerProfileModal
    ),
  { ssr: false }
);
const ServiceDetailModal = dynamic(
  () =>
    import("@/components/modals/service-detail-modal").then((m) => m.ServiceDetailModal),
  { ssr: false }
);
const JobDetailModal = dynamic(
  () => import("@/components/modals/job-detail-modal").then((m) => m.JobDetailModal),
  { ssr: false }
);
const WalletModal = dynamic(
  () => import("@/components/modals/wallet-modal").then((m) => m.WalletModal),
  { ssr: false }
);
const MessagingModal = dynamic(
  () => import("@/components/modals/messaging-modal").then((m) => m.MessagingModal),
  { ssr: false }
);
const PostJobModal = dynamic(
  () => import("@/components/modals/post-job-modal").then((m) => m.PostJobModal),
  { ssr: false }
);
const CreateServiceModal = dynamic(
  () =>
    import("@/components/modals/create-service-modal").then(
      (m) => m.CreateServiceModal
    ),
  { ssr: false }
);
const CompareModalDynamic = dynamic(
  () => import("@/components/modals/compare-modal").then((m) => m.CompareModal),
  { ssr: false }
);
const FavoritesModalDynamic = dynamic(
  () => import("@/components/modals/favorites-modal").then((m) => m.FavoritesModal),
  { ssr: false }
);
const ShareModal = dynamic(
  () => import("@/components/modals/share-modal").then((m) => m.ShareModal),
  { ssr: false }
);
const ReportModal = dynamic(
  () => import("@/components/modals/report-modal").then((m) => m.ReportModal),
  { ssr: false }
);
const HelpModal = dynamic(
  () => import("@/components/modals/help-modal").then((m) => m.HelpModal),
  { ssr: false }
);
const ProModal = dynamic(
  () => import("@/components/modals/pro-modal").then((m) => m.ProModal),
  { ssr: false }
);
const ReferralModal = dynamic(
  () => import("@/components/modals/referral-modal").then((m) => m.ReferralModal),
  { ssr: false }
);
const PrivacyModal = dynamic(
  () => import("@/components/modals/privacy-modal").then((m) => m.PrivacyModal),
  { ssr: false }
);
const TeamsModal = dynamic(
  () => import("@/components/modals/teams-modal").then((m) => m.TeamsModal),
  { ssr: false }
);
const ApiDocsModal = dynamic(
  () => import("@/components/modals/api-docs-modal").then((m) => m.ApiDocsModal),
  { ssr: false }
);
const PartnersModal = dynamic(
  () => import("@/components/modals/partners-modal").then((m) => m.PartnersModal),
  { ssr: false }
);
const NewsletterModal = dynamic(
  () => import("@/components/modals/newsletter-modal").then((m) => m.NewsletterModal),
  { ssr: false }
);
const ReviewModal = dynamic(
  () => import("@/components/modals/review-modal").then((m) => m.ReviewModal),
  { ssr: false }
);
const TopupModal = dynamic(
  () => import("@/components/modals/topup-modal").then((m) => m.TopupModal),
  { ssr: false }
);
const CookieConsent = dynamic(
  () => import("@/components/khidma/cookie-consent").then((m) => m.CookieConsent),
  { ssr: false }
);
const OnboardingTour = dynamic(
  () => import("@/components/khidma/onboarding-tour").then((m) => m.OnboardingTour),
  { ssr: false }
);

function ViewLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="space-y-3 mb-8" aria-hidden="true">
        <div className="h-8 w-1/3 rounded-lg bg-muted shimmer" />
        <div className="h-4 w-1/2 rounded bg-muted/70 shimmer" />
      </div>
      <FreelancerGridSkeleton count={8} />
    </div>
  );
}

export default function Home() {
  const view = useApp((s) => s.view);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Premium scroll-progress bar — fixed at top, above header (z-[60] > z-50) */}
      <ScrollProgress />

      <Header />

      {/* Cursor-following glow — only visible over [data-cursor-glow] areas */}
      <CursorGlow />

      {/* Floating section-navigation dots — only on the home view (desktop lg+) */}
      {view === "home" && <ScrollToSection />}

      <main className="flex-1">
        <PageTransition
          viewKey={view}
          className={cn(view !== "home" && view !== "how-it-works" && "pt-4")}
        >
          {view === "home" && (
            <>
              <Hero />
              <WaveDivider />
              <FeaturedThisWeek />
              <TrustStrip />
              <HowItWorks />
              <Categories />
              <FeaturedFreelancers />
              <FeaturedServices />
              <OpenJobs />
              <StatsBanner />
              <StatsDashboard />
              <DotGridDivider />
              <WhyKhidma />
              <TrustCenter />
              <TunisianCities />
              <PaymentExplainer />
              <GradientDivider />
              <WithdrawalOptions />
              <Testimonials />
              <DotGridDivider />
              <TestimonialCarousel />
              <SuccessStories />
              <BlogSection />
              <MobileAppPromo />
              <WaveDivider />
              <CommunitySection />
              <AwardsSection />
              <GradientDivider />
              <FAQ />
              <FinalCTA />
            </>
          )}
          {view === "freelancers" && <FreelancersView />}
          {view === "services" && <ServicesView />}
          {view === "jobs" && <JobsView />}
          {view === "how-it-works" && <HowItWorksView />}
          {view === "dashboard" && <DashboardView />}
          {view === "admin" && <AdminView />}
          {view === "stats" && <StatsView />}
        </PageTransition>
      </main>

      <Footer />

      {/* Floating back-to-top button with scroll progress ring */}
      <BackToTop />

      {/* Floating compare queue bar — appears when freelancers are queued */}
      <CompareTray />

      {/* Live activity notifications — periodic sonner toasts at bottom-left */}
      <LiveNotifications />

      {/* Global command palette — self-renders on ⌘K */}
      <CommandPalette />

      {/* Global modals — all self-render based on store state */}
      <AuthModal />
      <OnboardingWizard />
      <FreelancerProfileModal />
      <ServiceDetailModal />
      <JobDetailModal />
      <WalletModal />
      <MessagingModal />
      <PostJobModal />
      <CreateServiceModal />
      <CompareModalDynamic />
      <FavoritesModalDynamic />
      <ShareModal />
      <ReportModal />
      <HelpModal />
      <ProModal />
      <ReferralModal />
      <PrivacyModal />
      <TeamsModal />
      <ApiDocsModal />
      <PartnersModal />
      <NewsletterModal />
      <ReviewModal />
      <TopupModal />

      {/* Global cookie consent banner — self-renders on first visit */}
      <CookieConsent />

      {/* Global onboarding tour — auto-starts on first visit, self-renders */}
      <OnboardingTour />
    </div>
  );
}
