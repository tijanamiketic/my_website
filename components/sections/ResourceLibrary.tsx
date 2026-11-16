"use client";

import Link from "next/link";
import { hash, pick } from "@/lib/cover";
import { formatDate } from "@/lib/format";
import { localeInfo } from "@/lib/i18n";
import type { ResourceDoc } from "@/lib/resources";
import { useI18n } from "../I18nProvider";
import { Download } from "../icons";
import FilterPanel, { ALL, useFilteredList } from "../FilterPanel";

type Item = ResourceDoc & { categoryLabel: string; href: string };

/** Search + category filter over the resource cards. Each card links to /resources/<slug> and downloads the original .md. */
export default function ResourceLibrary({ resources, categories }: { resources: Item[]; categories: { value: string; label: string }[] }) {
  const { locale, t } = useI18n();
  const { cat, setCat, query, setQuery, list } = useFilteredList(
    resources,
    (r) => r.category,
    (r) => [r.title, r.description, r.categoryLabel].join(" "),
  );

  return (
    <FilterPanel
      searchLabel={t.resources.searchLabel}
      searchPlaceholder={t.resources.searchPlaceholder}
      filterLabel={t.resources.filter}
      options={[{ value: ALL, label: t.common.all }, ...categories]}
      cat={cat}
      onCat={setCat}
      query={query}
      onQuery={setQuery}
      count={t.resources.count(list.length, resources.length)}
    >
      <ul className="res-list">
        {list.map((r) => {
          // A document written in another language is shown as is, marked with its language.
          const docLang = r.lang === locale ? undefined : localeInfo[r.lang].htmlLang;
          return (
            <li key={r.slug} className="res">
              <span className="ficon" style={{ background: pick(hash(r.category), 0) }} aria-hidden="true">
                MD
              </span>
              <div>
                <h3 lang={docLang}>
                  <Link href={r.href}>{r.title}</Link>
                </h3>
                <div className="sub">
                  <span>{r.categoryLabel}</span>
                  <span>{t.resources.format}</span>
                  <span>
                    {t.resources.updated} <time dateTime={r.updated}>{formatDate(r.updated, locale)}</time>
                  </span>
                  {docLang && <span className="chip">{localeInfo[r.lang].short}</span>}
                </div>
              </div>
              <div className="res-actions">
                <Link className="btn btn-glass btn-sm" href={r.href} aria-label={t.resources.readAria(r.title)}>
                  {t.resources.read}
                </Link>
                <a className="btn btn-primary btn-sm" href={r.file} download={`${r.slug}.md`} aria-label={t.resources.downloadAria(r.title)}>
                  <Download /> {t.resources.download}
                </a>
              </div>
            </li>
          );
        })}
        {list.length === 0 && <li className="empty">{t.resources.empty(query)}</li>}
      </ul>
    </FilterPanel>
  );
}
