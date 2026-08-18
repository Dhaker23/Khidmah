import type { Metadata } from "next";
import { Manrope, Sora, IBM_Plex_Sans_Arabic, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { ThemeProvider } from "@/components/theme-provider";

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800"],
});

const ibmPlexArabic = IBM_Plex_Sans_Arabic({
  variable: "--font-arabic",
  subsets: ["arabic", "latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Khidma — Trusted Tunisian Freelance Marketplace | خدمة",
  description:
    "Khidma (خدمة) connects verified Tunisian freelancers with clients locally and globally. Real people. Real skills. Real portfolios. Real work. Real trust. Work. Earn. Grow.",
  keywords: [
    "Khidma",
    "خدمة",
    "Tunisia freelance",
    "Tunisian freelancers",
    "freelance marketplace",
    "Upwork alternative Tunisia",
    "Fiverr Tunisia",
    "verified freelancers",
    "Tunisian talent",
  ],
  authors: [{ name: "Amara Dhaker" }],
  creator: "Amara Dhaker",
  publisher: "Khidma",
  icons: {
    icon: "/khidma-logo.png",
    apple: "/khidma-logo.png",
  },
  openGraph: {
    title: "Khidma — Trusted Tunisian Freelance Marketplace",
    description:
      "A professional marketplace connecting verified Tunisian freelancers with clients locally and globally. Work. Earn. Grow.",
    siteName: "Khidma",
    type: "website",
    locale: "en_US",
    alternateLocale: "ar_TN",
  },
  twitter: {
    card: "summary_large_image",
    title: "Khidma — Trusted Tunisian Freelance Marketplace",
    description:
      "Verified Tunisian freelancers. Real portfolios. Secure contracts. Work. Earn. Grow.",
  },
  metadataBase: new URL("https://khidma.tn"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${manrope.variable} ${sora.variable} ${ibmPlexArabic.variable} ${geistMono.variable} font-sans antialiased bg-background text-foreground`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
          <Sonner position="top-right" richColors closeButton />
        </ThemeProvider>
      </body>
    </html>
  );
}
