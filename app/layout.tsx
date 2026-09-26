import type { Metadata, Viewport } from "next";
import "./globals.css";
import { LanguageProvider } from "@/lib/i18n";
import { ServiceWorkerRegistration } from "./service-worker-registration";

export const viewport: Viewport = {
  themeColor: "#8B74C9",
};

export const metadata: Metadata = {
  title: "TRAC-Mind — Mental Health Support",
  description: "AI-Powered Dynamic Mental Health Monitoring and Distress Prediction System",
  manifest: "/manifest.json",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        <ServiceWorkerRegistration />
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
