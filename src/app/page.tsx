"use client";

import dynamic from "next/dynamic";
import { AnimatePresence, motion } from "framer-motion";
import { Header } from "@/components/khidma/header";
import { Footer } from "@/components/khidma/footer";
import {
  Hero,
  TrustStrip,
  HowItWorks,
  Categories,
  FeaturedFreelancers,
  FeaturedServices,
  OpenJobs,
  WhyKhidma,
  PaymentExplainer,
  WithdrawalOptions,
  Testimonials,
  StatsBanner,
  FAQ,
  FinalCTA,
} from "@/components/sections";
import { AuthModal, OnboardingWizard } from "@/components/modals";
import { CommandPalette } from "@/components/khidma/command-palette";
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

function ViewLoading() {
  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
      <div className="space-y-4">
        <div className="h-8 w-1/3 rounded-lg bg-muted animate-pulse" />
        <div className="h-4 w-1/2 rounded bg-muted/70 animate-pulse" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="h-64 rounded-xl bg-muted/60 shimmer"
              style={{ animationDelay: `${i * 0.05}s` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const view = useApp((s) => s.view);

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <Header />

      <main className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={view}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className={cn(view !== "home" && view !== "how-it-works" && "pt-4")}
          >
            {view === "home" && (
              <>
                <Hero />
                <TrustStrip />
                <HowItWorks />
                <Categories />
                <FeaturedFreelancers />
                <FeaturedServices />
                <OpenJobs />
                <StatsBanner />
                <WhyKhidma />
                <PaymentExplainer />
                <WithdrawalOptions />
                <Testimonials />
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
          </motion.div>
        </AnimatePresence>
      </main>

      <Footer />

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
    </div>
  );
}
