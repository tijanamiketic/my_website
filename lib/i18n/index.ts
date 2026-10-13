/**
 * Languages, URLs and helpers shared by server and client code.
 * Rules for adding or changing translations: docs/how-to-change.md → "Translations".
 */

/** Languages the site is published in. The default one lives at "/" with no prefix. */
export const locales = ["sr", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "sr";

export const localeInfo: Record<Locale, { name: string; short: string; htmlLang: string; intl: string; og: string }> = {
  // Serbian in Latin script. `name` is written in the language itself (shown in the switcher).
  sr: { name: "Srpski", short: "SR", htmlLang: "sr-Latn", intl: "sr-Latn-RS", og: "sr_RS" },
  en: { name: "English", short: "EN", htmlLang: "en", intl: "en-GB", og: "en_GB" },
};

export const isLocale = (v: unknown): v is Locale => locales.includes(v as Locale);
export const toLocale = (v: unknown): Locale => (isLocale(v) ? v : defaultLocale);

/** Public URL path of a page in a language: localePath("en", "/blog/x") → "/en/blog/x". */
export function localePath(locale: Locale, path = "/"): string {
  if (locale === defaultLocale) return path;
  return path === "/" ? `/${locale}` : `/${locale}${path}`;
}

/** Path without its language prefix: "/en/blog/x" → "/blog/x", "/sr" → "/". */
export function stripLocale(pathname: string): string {
  const first = pathname.split("/")[1];
  if (!isLocale(first)) return pathname || "/";
  return pathname.slice(first.length + 1) || "/";
}

/** hreflang links for a page that exists in `available` languages (metadata `alternates.languages`, sitemap). */
export function languageAlternates(path: string, available: readonly Locale[] = locales): Record<string, string> {
  const links: Record<string, string> = Object.fromEntries(available.map((l) => [l, localePath(l, path)]));
  if (available.includes(defaultLocale)) links["x-default"] = localePath(defaultLocale, path);
  return links;
}

/** Visitor-facing text, written once per language. */
export type Text = Record<Locale, string>;

/** The same shape as T, with every Text replaced by a plain string. */
export type Localized<T> = T extends Text ? string : T extends RegExp ? T : T extends object ? { [K in keyof T]: Localized<T[K]> } : T;

function isText(v: object): v is Text {
  const keys = Object.keys(v);
  return keys.length === locales.length && locales.every((l) => typeof (v as Record<string, unknown>)[l] === "string");
}

/** Pick one language from content: every { sr, en } pair inside `value` becomes a string. */
export function localize<T>(value: T, locale: Locale): Localized<T> {
  if (Array.isArray(value)) return value.map((v) => localize(v, locale)) as Localized<T>;
  if (value && typeof value === "object" && Object.getPrototypeOf(value) === Object.prototype) {
    if (isText(value)) return value[locale] as Localized<T>;
    return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, localize(v, locale)])) as Localized<T>;
  }
  return value as Localized<T>;
}

/**
 * Plural forms: Serbian has three (1 mesto, 2 mesta, 5 mesta), English two.
 * "#" in a form is replaced by the number.
 */
export function plural(locale: Locale, n: number, forms: { one: string; few?: string; other: string }): string {
  const rule = new Intl.PluralRules(localeInfo[locale].intl).select(n);
  const form = rule === "one" ? forms.one : rule === "few" ? (forms.few ?? forms.other) : forms.other;
  return form.replace("#", String(n));
}

/** Prices are stored in EUR as numbers and formatted per language ("€349" / "349 €"). */
export function formatPrice(eur: number, locale: Locale): string {
  return new Intl.NumberFormat(localeInfo[locale].intl, { style: "currency", currency: "EUR", maximumFractionDigits: 0 }).format(eur);
}
