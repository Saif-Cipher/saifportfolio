import { PageTransition } from "@/components/page-transition";
import type { Metadata, Viewport } from "next";
import { PortfolioKineticBackground } from "@/components/portfolio-kinetic-background";
import "./globals.css";

const deploymentHost = process.env.VERCEL_PROJECT_PRODUCTION_URL ?? process.env.VERCEL_URL;
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? (deploymentHost ? `https://${deploymentHost}` : undefined);

export const metadata: Metadata = {
  metadataBase: siteUrl ? new URL(siteUrl) : undefined,
  title: "Saif Hossain — AI Automation & Digital Systems",
  description:
    "AI automation and digital systems, designed and built with intent. Explore automation workflows, websites, and digital products by Saif Hossain.",
  icons: {
    icon: "/icon.svg",
    apple: "/icon.svg",
  },
  openGraph: {
    title: "Saif Hossain — AI Automation & Digital Systems",
    description:
      "Practical AI workflows and digital products that connect ideas to execution.",
    type: "website",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#07080a",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body><PortfolioKineticBackground />{children}<PageTransition /></body>
    </html>
  );
}
