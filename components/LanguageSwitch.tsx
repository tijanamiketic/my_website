"use client";

import { usePathname } from "next/navigation";
import { localeInfo, localePath, locales, stripLocale } from "@/lib/i18n";
import { useI18n } from "./I18nProvider";

/**
 * "SR | EN" switch: links to the same page in the other language. Each label is
 * written in its own language. The choice is not remembered: a new visit to "/"
 * always starts in the default language.
 */
export default function LanguageSwitch() {
  const { locale, t } = useI18n();
  const path = stripLocale(usePathname());

  return (
    <div className="lang-switch" role="group" aria-label={t.language.label}>
      {locales.map((l) => (
        <a
          key={l}
          href={localePath(l, path)}
          hrefLang={localeInfo[l].htmlLang}
          lang={localeInfo[l].htmlLang}
          aria-label={localeInfo[l].name}
          aria-current={l === locale ? "true" : undefined}
          // Keep the visitor on the same section ("/#courses" → "/en#courses").
          onClick={(e) => {
            if (location.hash) e.currentTarget.href = localePath(l, path) + location.hash;
          }}
        >
          {localeInfo[l].short}
        </a>
      ))}
    </div>
  );
}
