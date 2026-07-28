import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";

import { ThemeProvider } from "@/components/layout/theme-provider";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Toaster } from "@/components/ui/sonner";

import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Smart Traffic Signal — Interactive Traffic Simulation",
    template: "%s | Smart Traffic Signal",
  },
  description:
    "An interactive smart traffic signal controller: a queue-based priority scheduling simulation with live analytics, rush hour, rain, accidents, and emergency vehicle preemption — running entirely in your browser.",
  keywords: [
    "traffic signal simulation",
    "priority scheduling algorithm",
    "circular queue",
    "traffic light optimization",
    "Next.js portfolio project",
    "data structures visualization",
  ],
  authors: [{ name: "Krish Ramesh Pareet", url: "https://github.com/krishrp1" }],
  creator: "Krish Ramesh Pareet",
  applicationName: "Smart Traffic Signal",
  openGraph: {
    type: "website",
    url: siteUrl,
    title: "Smart Traffic Signal — Interactive Traffic Simulation",
    description:
      "A queue-based priority scheduling algorithm for four-way intersections, visualized as a live, interactive simulation with an analytics dashboard.",
    siteName: "Smart Traffic Signal",
  },
  twitter: {
    card: "summary_large_image",
    title: "Smart Traffic Signal — Interactive Traffic Simulation",
    description:
      "A queue-based priority scheduling algorithm for four-way intersections, visualized as a live, interactive simulation with an analytics dashboard.",
  },
  icons: {
    icon: "/favicon.svg",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#fefefe" },
    { media: "(prefers-color-scheme: dark)", color: "#10131a" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased`}>
        <ThemeProvider>
          <a
            href="#main-content"
            className="focus:bg-primary focus:text-primary-foreground sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:rounded-md focus:px-4 focus:py-2"
          >
            Skip to main content
          </a>
          <div className="flex min-h-dvh flex-col">
            <Navbar />
            <main id="main-content" className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
