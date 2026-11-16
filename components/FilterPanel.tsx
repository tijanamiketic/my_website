"use client";

import { useDeferredValue, useState } from "react";
import { Search } from "./icons";
import FilterBar from "./FilterBar";

export const ALL = "all";

/** Category + text search state over a list. `text` returns the searchable text of an item. */
export function useFilteredList<T>(items: T[], category: (item: T) => string, text: (item: T) => string) {
  const [cat, setCat] = useState(ALL);
  const [query, setQuery] = useState("");
  const q = useDeferredValue(query).trim().toLowerCase();
  const list = items.filter((i) => (cat === ALL || category(i) === cat) && (!q || text(i).toLowerCase().includes(q)));
  return { cat, setCat, query, setQuery, list };
}

/**
 * The glass panel shared by Resources and Events: search box on the left, category chips on the
 * right, the "X of Y" counter, then the list (children).
 */
export default function FilterPanel({
  searchLabel,
  searchPlaceholder,
  filterLabel,
  options,
  cat,
  onCat,
  query,
  onQuery,
  count,
  children,
}: {
  searchLabel: string;
  searchPlaceholder: string;
  filterLabel: string;
  /** Includes "All" (value ALL). */
  options: { value: string; label: string }[];
  cat: string;
  onCat: (v: string) => void;
  query: string;
  onQuery: (v: string) => void;
  count: string;
  children: React.ReactNode;
}) {
  return (
    <div className="res-panel glass" data-reveal>
      <div className="res-tools">
        <label className="search">
          <Search />
          <span className="sr-only">{searchLabel}</span>
          <input type="search" placeholder={searchPlaceholder} autoComplete="off" value={query} onChange={(e) => onQuery(e.target.value)} />
        </label>
        <FilterBar label={filterLabel} options={options} value={cat} onChange={onCat} />
      </div>
      <p className="res-count" aria-live="polite">
        {count}
      </p>
      {children}
    </div>
  );
}
