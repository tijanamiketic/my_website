"use client";

import Link from "next/link";
import { useDeferredValue, useState } from "react";
import { hash, pick } from "@/lib/cover";
import { formatDate } from "@/lib/format";
import { localeInfo } from "@/lib/i18n";
import type { ResourceDoc } from "@/lib/resources";
import { useI18n } from "../I18nProvider";
import { Download, Search } from "../icons";
import FilterBar from "../FilterBar";

type Item = ResourceDoc & { categoryLabel: string; href: string };

const ALL = "all";

/** Search + category filter over the resource cards. Each card links to /resources/<slug> and downloads the original .md. */
export default function ResourceLibrary({ resources, categories }: { resources: Item[]; categories: { value: string; label: string }[] }) {
  const { locale, t } = useI18n();
  const [cat, setCat] = useState(ALL);
  const [query, setQuery] = useState("");
  const q = useDeferredValue(query).trim().toLowerCase();

  const options = [{ value: ALL, label: t.common.all }, ...categories];
  const list = resources.filter(
    (r) =>
      (cat === ALL || r.category === cat) &&
      (!q || [r.title, r.description, r.categoryLabel].join(" ").toLowerCase().includes(q)),
  );

  return (
    <div className="res-panel glass" data-reveal>
      <div className="res-tools">
        <label className="search">
          <Search />
          <span className="sr-only">{t.resources.searchLabel}</span>
          <input type="search" placeholder={t.resources.searchPlaceholder} autoComplete="off" value={query} onChange={(e) => setQuery(e.target.value)} />
        </label>
        <FilterBar label={t.resources.filter} options={options} value={cat} onChange={setCat} />
      </div>
      <p className="res-count" aria-live="polite">
        {t.resources.count(list.length, resources.length)}
      </p>
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
    </div>
  );
}
