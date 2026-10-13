"use client";

import { useDeferredValue, useRef, useState } from "react";
import type { Resource, ResourceType } from "@/content/types";
import { hash, pick } from "@/lib/cover";
import { formatDate } from "@/lib/format";
import type { Localized } from "@/lib/i18n";
import { useI18n } from "../I18nProvider";
import { ArrowRight, Close, Search } from "../icons";
import FilterBar from "../FilterBar";

const TYPE_COLOR: Record<ResourceType, string> = {
  PDF: "#F4BFD5",
  Template: "#C7B3F5",
  Checklist: "#B7D3F0",
  Notebook: "#D5DAE4",
  Guide: "#A9B8F5",
};

type Item = Localized<Resource>;

export default function ResourceLibrary({ resources }: { resources: Item[] }) {
  const { locale, t } = useI18n();
  const [cat, setCat] = useState("All");
  const [query, setQuery] = useState("");
  const q = useDeferredValue(query).trim().toLowerCase();
  const [open, setOpen] = useState<Item | null>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const openerRef = useRef<HTMLButtonElement | null>(null);

  const cats = [{ value: "All", label: t.common.all }, ...[...new Set(resources.map((r) => r.category))].map((c) => ({ value: c, label: c }))];
  const list = resources.filter(
    (r) =>
      (cat === "All" || r.category === cat) &&
      (!q || [r.title, r.description, t.resources.type[r.type], r.category].join(" ").toLowerCase().includes(q)),
  );

  const show = (r: Item, btn: HTMLButtonElement) => {
    openerRef.current = btn;
    setOpen(r);
    // showModal gives us focus trapping, Escape-to-close and an inert background for free.
    requestAnimationFrame(() => dialogRef.current?.showModal());
  };
  const close = () => dialogRef.current?.close();
  const external = open ? /^https?:\/\//.test(open.url) : false;
  const available = open ? open.url !== "#" : false;

  return (
    <>
      <div className="res-panel glass" data-reveal>
        <div className="res-tools">
          <label className="search">
            <Search />
            <span className="sr-only">{t.resources.searchLabel}</span>
            <input type="search" placeholder={t.resources.searchPlaceholder} autoComplete="off" value={query} onChange={(e) => setQuery(e.target.value)} />
          </label>
          <FilterBar label={t.resources.filter} options={cats} value={cat} onChange={setCat} />
        </div>
        <p className="res-count" aria-live="polite">
          {t.resources.count(list.length, resources.length)}
        </p>
        <ul className="res-list">
          {list.map((r) => (
            <li key={r.title} className="res">
              <span className="ficon" style={{ background: TYPE_COLOR[r.type] }} aria-hidden="true">
                {r.type.slice(0, 4).toUpperCase()}
              </span>
              <div>
                <h3>{r.title}</h3>
                <div className="sub">
                  <span>{r.category}</span>
                  <span>
                    {t.resources.type[r.type]} · {r.size}
                  </span>
                  <span>
                    {t.resources.updated} <time dateTime={r.updated}>{formatDate(r.updated, locale)}</time>
                  </span>
                </div>
              </div>
              <button className="btn btn-glass btn-sm" type="button" onClick={(e) => show(r, e.currentTarget)} aria-haspopup="dialog" aria-label={t.resources.openAria(r.title)}>
                {t.resources.open}
              </button>
            </li>
          ))}
          {list.length === 0 && <li className="empty">{t.resources.empty(query)}</li>}
        </ul>
      </div>

      <dialog
        ref={dialogRef}
        className="doc"
        aria-labelledby="doc-title"
        onClose={() => {
          setOpen(null);
          openerRef.current?.focus();
        }}
        onClick={(e) => {
          if (e.target === e.currentTarget) close(); // click on backdrop
        }}
      >
        {open && (
          <div className="doc-card glass">
            <div style={{ display: "flex", justifyContent: "space-between", gap: ".6rem", alignItems: "flex-start" }}>
              <ul className="chips" aria-label={t.common.details}>
                <li className="chip">{open.category}</li>
                <li className="chip">{t.resources.type[open.type]}</li>
                <li className="chip">{open.size}</li>
              </ul>
              <button type="button" className="icon-btn" style={{ width: 36, height: 36, flex: "none" }} onClick={close} aria-label={t.resources.closePreview}>
                <Close />
              </button>
            </div>
            <h3 id="doc-title" style={{ fontSize: "1.4rem", marginTop: ".9rem" }}>
              {open.title}
            </h3>
            <div className="preview" aria-hidden="true" style={{ background: `linear-gradient(135deg, ${TYPE_COLOR[open.type]}, ${pick(hash(open.title), 1)})` }}>
              {t.resources.preview(t.resources.type[open.type])}
            </div>
            <p style={{ color: "var(--muted)" }}>{open.description}</p>
            <p className="mono" style={{ color: "var(--muted)", marginTop: ".6rem" }}>
              {t.resources.updated} {formatDate(open.updated, locale)}
            </p>
            <div className="actions">
              {available ? (
                <a className="btn btn-primary" href={open.url} target="_blank" rel="noopener noreferrer">
                  {t.resources.openDocument} <ArrowRight />
                  <span className="sr-only">{external ? t.resources.externalNewTab : t.resources.newTab}</span>
                </a>
              ) : (
                <span className="btn btn-primary" aria-disabled="true" style={{ opacity: 0.6, cursor: "not-allowed" }}>
                  {t.resources.comingSoon}
                </span>
              )}
              <button className="btn btn-glass" type="button" onClick={close}>
                {t.resources.close}
              </button>
            </div>
          </div>
        )}
      </dialog>
    </>
  );
}
