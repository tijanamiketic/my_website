import { lang } from "next/root-params";
import { notFound } from "next/navigation";
import { dictionaries } from "@/content/i18n";
import { isLocale, type Locale } from "./index";

/**
 * Current page language, read from the [lang] route segment. Works in any Server
 * Component (no prop drilling). Not available in Server Actions or Route Handlers:
 * those receive the language from the request (form field or ?lang=).
 */
export async function getLocale(): Promise<Locale> {
  const value = await lang();
  if (!isLocale(value)) notFound();
  return value;
}

/** Language + its interface strings, for Server Components. */
export async function getI18n() {
  const locale = await getLocale();
  return { locale, t: dictionaries[locale] };
}
