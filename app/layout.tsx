import type { Metadata, Viewport } from "next";
import "./globals.css";
import PWARegister from "@/components/shared/PWARegister";
import CompareTray from "@/components/shared/CompareTray";

export const viewport: Viewport = {
  themeColor: "#C5A572",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "Nivesh Ventures | Premium Real Estate",
  description: "Discover premium real estate opportunities. Together We Grow.",
  manifest: "/manifest.json",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className="h-full antialiased scroll-smooth"
    >
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cinzel+Decorative:wght@700;900&family=Great+Vibes&family=Playfair+Display:ital,wght@0,600;0,700;0,900;1,600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-full flex flex-col bg-cream text-text-dark font-sans selection:bg-accent/20">
        {children}
        <CompareTray />
        <PWARegister />
      </body>
    </html>
  );
}
