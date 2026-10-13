"use client";

import { createContext, useContext } from "react";
import { dictionaries } from "@/content/i18n";
import { defaultLocale, type Locale } from "@/lib/i18n";

const LocaleContext = createContext<Locale>(defaultLocale);

/** Makes the page language available to Client Components (set once in the root layout). */
export default function I18nProvider({ locale, children }: { locale: Locale; children: React.ReactNode }) {
  return <LocaleContext.Provider value={locale}>{children}</LocaleContext.Provider>;
}

/** Language + its interface strings, for Client Components. */
export function useI18n() {
  const locale = useContext(LocaleContext);
  return { locale, t: dictionaries[locale] };
}
