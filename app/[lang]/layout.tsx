import type { Metadata, Viewport } from "next";
import { Inter, Instrument_Serif, JetBrains_Mono } from "next/font/google";
import "../globals.css";
import { profile as profileSource } from "@/content/profile";
import { socials } from "@/content/socials";
import { SITE_URL, fullName } from "@/lib/config";
import { languageAlternates, localeInfo, localePath, localize, locales } from "@/lib/i18n";
import { getI18n } from "@/lib/i18n/server";
import I18nProvider from "@/components/I18nProvider";
import Ambient from "@/components/Ambient";
import Nav from "@/components/Nav";
import MotionEffects from "@/components/MotionEffects";
import ChatWidget from "@/components/chat/ChatWidget";

// Only the UI font is preloaded (latin-ext covers characters like "ć", "š", "ž"); the accent
// fonts load on demand so they never compete with the hero image for bandwidth.
const inter = Inter({ subsets: ["latin", "latin-ext"], variable: "--font-inter", display: "swap" });
const instrument = Instrument_Serif({ subsets: ["latin", "latin-ext"], weight: "400", style: "italic", variable: "--font-instrument", display: "swap", preload: false });
const jetbrains = JetBrains_Mono({ subsets: ["latin", "latin-ext"], weight: "400", variable: "--font-jetbrains", display: "swap", preload: false });

/** Every language is prerendered. "/" is served from "sr" by proxy.ts; "/en" from "en". */
export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export async function generateMetadata(): Promise<Metadata> {
  const { locale } = await getI18n();
  const profile = localize(profileSource, locale);
  const title = `${fullName} — ${profile.role}`;
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: title, template: `%s · ${fullName}` },
    description: profile.seo.description,
    keywords: profile.seo.keywords,
    authors: [{ name: fullName, url: SITE_URL }],
    creator: fullName,
    alternates: { canonical: localePath(locale, "/"), languages: languageAlternates("/") },
    openGraph: {
      type: "website",
      url: `${SITE_URL}${localePath(locale, "/")}`,
      siteName: fullName,
      title,
      description: profile.seo.description,
      locale: localeInfo[locale].og,
      alternateLocale: locales.filter((l) => l !== locale).map((l) => localeInfo[l].og),
    },
    twitter: { card: "summary_large_image", title, description: profile.seo.description },
    robots: { index: true, follow: true },
  };
}

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

export default async function RootLayout({ children }: LayoutProps<"/[lang]">) {
  const { locale, t } = await getI18n();
  const profile = localize(profileSource, locale);

  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: fullName,
    jobTitle: profile.role,
    description: profile.seo.description,
    url: `${SITE_URL}${localePath(locale, "/")}`,
    image: `${SITE_URL}/images/portrait.png`,
    email: `mailto:${profile.email}`,
    address: { "@type": "PostalAddress", addressLocality: profile.location },
    sameAs: socials.map((s) => s.url),
    knowsAbout: t.meta.knowsAbout,
  };

  return (
    <html lang={localeInfo[locale].htmlLang} suppressHydrationWarning className={`${inter.variable} ${instrument.variable} ${jetbrains.variable}`}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd).replace(/</g, "\\u003c") }}
        />
      </head>
      <body>
        <I18nProvider locale={locale}>
          <a href="#main" className="skip-link">{t.meta.skipLink}</a>
          <Ambient />
          <Nav />
          {children}
          <ChatWidget />
          <MotionEffects />
        </I18nProvider>
      </body>
    </html>
  );
}
