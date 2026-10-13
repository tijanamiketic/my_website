import type { Metadata, Viewport } from "next";
import { Inter, Instrument_Serif, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { profile } from "@/content/profile";
import { socials } from "@/content/socials";
import { SITE_URL, fullName } from "@/lib/config";
import Ambient from "@/components/Ambient";
import Nav from "@/components/Nav";
import MotionEffects from "@/components/MotionEffects";
import ChatWidget from "@/components/chat/ChatWidget";

// Only the UI font is preloaded (latin-ext covers characters like "ć"); the accent
// fonts load on demand so they never compete with the hero image for bandwidth.
const inter = Inter({ subsets: ["latin", "latin-ext"], variable: "--font-inter", display: "swap" });
const instrument = Instrument_Serif({ subsets: ["latin"], weight: "400", style: "italic", variable: "--font-instrument", display: "swap", preload: false });
const jetbrains = JetBrains_Mono({ subsets: ["latin"], weight: "400", variable: "--font-jetbrains", display: "swap", preload: false });

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: `${fullName} — ${profile.role}`, template: `%s · ${fullName}` },
  description: profile.seo.description,
  keywords: profile.seo.keywords,
  authors: [{ name: fullName, url: SITE_URL }],
  creator: fullName,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: fullName,
    title: `${fullName} — ${profile.role}`,
    description: profile.seo.description,
    locale: "en_GB",
  },
  twitter: { card: "summary_large_image", title: `${fullName} — ${profile.role}`, description: profile.seo.description },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ECEEF3" },
    { media: "(prefers-color-scheme: dark)", color: "#0E0F13" },
  ],
};

/** Runs before first paint: applies a saved theme choice so there is no flash. */
const themeScript = `try{var t=localStorage.getItem("theme");if(t==="light"||t==="dark")document.documentElement.dataset.theme=t}catch(e){}`;

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: fullName,
  jobTitle: profile.role,
  description: profile.seo.description,
  url: SITE_URL,
  image: `${SITE_URL}/images/portrait.png`,
  email: `mailto:${profile.email}`,
  address: { "@type": "PostalAddress", addressLocality: profile.location },
  sameAs: socials.map((s) => s.url),
  knowsAbout: ["Artificial intelligence", "Large language models", "AI agents", "Retrieval-augmented generation", "AI education"],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${instrument.variable} ${jetbrains.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd).replace(/</g, "\\u003c") }}
        />
      </head>
      <body>
        <a href="#main" className="skip-link">Skip to content</a>
        <Ambient />
        <Nav />
        {children}
        <ChatWidget />
        <MotionEffects />
      </body>
    </html>
  );
}
