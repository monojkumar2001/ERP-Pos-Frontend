"use client";

import { useMemo, useState } from "react";
import {
  REPORT_CATEGORIES,
  DEFAULT_FAVORITE_IDS,
  allReports,
} from "../../data/dashboard/reports";

function ReportItem({ report, favorited, onToggleFavorite, onOpen }) {
  return (
    <div className="border-b border-slate-100 px-4 py-3 last:border-b-0">
      <div className="flex items-start gap-2">
        <button
          type="button"
          onClick={() => onOpen(report)}
          className="min-w-0 flex-1 text-left text-[14px] font-medium text-[#00a78b] hover:underline"
        >
          {report.title}
        </button>
        <button
          type="button"
          onClick={() => onToggleFavorite(report.id)}
          className="mt-0.5 shrink-0 text-[#00a78b] hover:scale-110"
          aria-label={favorited ? "Remove from favorites" : "Add to favorites"}
          title={favorited ? "Remove from favorites" : "Add to favorites"}
        >
          <span className="material-icons text-[18px]">
            {favorited ? "star" : "star_border"}
          </span>
        </button>
      </div>
      <p className="m-0 mt-1 text-[12px] leading-relaxed text-slate-500">{report.description}</p>
    </div>
  );
}

function CategoryPanel({ category, open, onToggle, favorites, onToggleFavorite, onOpen, query }) {
  const items = category.items.filter((item) => {
    if (!query) return true;
    const q = query.toLowerCase();
    return (
      item.title.toLowerCase().includes(q) || item.description.toLowerCase().includes(q)
    );
  });

  if (query && items.length === 0) return null;

  return (
    <div className="overflow-hidden rounded-lg border border-[#e5e7eb] bg-white shadow-sm">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center gap-2 border-b border-[#d6e8f5] bg-[#eef6fb] px-4 py-3 text-left"
      >
        <span className="material-icons text-[20px] text-[#00a78b]">{category.icon}</span>
        <span className="flex-1 text-[15px] font-semibold text-[#00a78b]">{category.title}</span>
        <span className="material-icons text-[20px] text-[#00a78b]">
          {open ? "expand_less" : "expand_more"}
        </span>
      </button>
      {open && (
        <div>
          {items.map((item) => (
            <ReportItem
              key={item.id}
              report={item}
              favorited={favorites.has(item.id)}
              onToggleFavorite={onToggleFavorite}
              onOpen={onOpen}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function ReportRunner({ report, onBack }) {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [generated, setGenerated] = useState(false);

  return (
    <div className="pb-8">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h1 className="m-0 flex items-center gap-2 text-[22px] font-semibold text-[#2c3e50]">
          {report.title}
          <button type="button" className="text-[#00a78b]" aria-label="Help">
            <i className="far fa-question-circle text-[16px]" />
          </button>
        </h1>
        <button
          type="button"
          onClick={onBack}
          className="inline-flex h-9 items-center rounded border border-[#00a78b] px-4 text-[13px] font-medium text-[#00a78b] hover:bg-[#f0f7fb]"
        >
          Back to Reports
        </button>
      </div>

      <div className="overflow-hidden rounded-lg border border-[#e5e7eb] bg-white shadow-sm">
        <div className="border-b border-slate-200 px-5 py-3">
          <p className="m-0 text-[13px] text-slate-500">{report.description}</p>
        </div>
        <div className="grid gap-4 px-5 py-4 sm:grid-cols-3">
          <div>
            <label className="mb-1.5 block text-[13px] font-medium text-[#1a557a]">
              From Date
            </label>
            <input
              type="date"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="h-10 w-full rounded border border-slate-200 px-3 text-[13px] outline-none focus:border-[#00a78b]"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-[13px] font-medium text-[#1a557a]">To Date</label>
            <input
              type="date"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="h-10 w-full rounded border border-slate-200 px-3 text-[13px] outline-none focus:border-[#00a78b]"
            />
          </div>
          <div className="flex items-end">
            <button
              type="button"
              onClick={() => setGenerated(true)}
              className="h-10 rounded bg-[#00a78b] px-5 text-[13px] font-medium text-white hover:bg-[#008f77]"
            >
              Generate
            </button>
          </div>
        </div>

        {generated && (
          <div className="border-t border-slate-100 px-5 py-6">
            <div className="mb-3 flex items-center justify-between gap-2">
              <h3 className="m-0 text-[14px] font-semibold text-[#1a557a]">Report Preview</h3>
              <button
                type="button"
                className="inline-flex h-8 items-center gap-1 rounded border border-slate-200 px-3 text-[12px] text-slate-600 hover:bg-slate-50"
              >
                <span className="material-icons text-[16px]">file_download</span>
                Export
              </button>
            </div>
            <div className="overflow-auto rounded border border-slate-200">
              <table className="min-w-full text-left text-[13px]">
                <thead className="bg-[#00a78b] text-white">
                  <tr>
                    <th className="px-3 py-2 font-medium">DATE</th>
                    <th className="px-3 py-2 font-medium">REFERENCE</th>
                    <th className="px-3 py-2 font-medium">PARTY</th>
                    <th className="px-3 py-2 font-medium">AMOUNT</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["12 Aug 2026", "INV-10021", "Walk-in Customer", "৳ 12,500.00"],
                    ["18 Aug 2026", "INV-10034", "Rahim Traders", "৳ 8,200.00"],
                    ["02 Sep 2026", "INV-10051", "Softify Retail", "৳ 21,450.00"],
                  ].map((row) => (
                    <tr key={row[1]} className="border-t border-slate-100 odd:bg-slate-50">
                      {row.map((cell) => (
                        <td key={cell} className="px-3 py-2 text-slate-700">
                          {cell}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="mt-3 mb-0 text-[12px] text-slate-400">Demo preview data only.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function ReportsPage() {
  const [query, setQuery] = useState("");
  const [favorites, setFavorites] = useState(() => new Set(DEFAULT_FAVORITE_IDS));
  const [openCats, setOpenCats] = useState(() =>
    Object.fromEntries(REPORT_CATEGORIES.map((c) => [c.id, true]))
  );
  const [favoritesOpen, setFavoritesOpen] = useState(true);
  const [activeReport, setActiveReport] = useState(null);

  const catalog = useMemo(() => allReports(), []);

  const favoriteReports = useMemo(
    () => catalog.filter((r) => favorites.has(r.id)),
    [catalog, favorites]
  );

  const filteredFavorites = useMemo(() => {
    if (!query) return favoriteReports;
    const q = query.toLowerCase();
    return favoriteReports.filter(
      (r) => r.title.toLowerCase().includes(q) || r.description.toLowerCase().includes(q)
    );
  }, [favoriteReports, query]);

  const toggleFavorite = (id) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  if (activeReport) {
    return <ReportRunner report={activeReport} onBack={() => setActiveReport(null)} />;
  }

  return (
    <div className="pb-8">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h1 className="m-0 flex items-center gap-2 text-[22px] font-semibold text-[#2c3e50]">
          Reports
          <button type="button" className="text-[#00a78b]" aria-label="Help">
            <i className="far fa-question-circle text-[16px]" />
          </button>
        </h1>
        <div className="relative w-full max-w-xs">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search..."
            className="h-10 w-full rounded-full border border-slate-200 bg-white py-2 pl-4 pr-10 text-[13px] outline-none focus:border-[#00a78b]"
          />
          <span className="material-icons pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[18px] text-slate-400">
            search
          </span>
        </div>
      </div>

      {filteredFavorites.length > 0 && (
        <div className="mb-4 overflow-hidden rounded-lg border border-[#e5e7eb] bg-white shadow-sm">
          <button
            type="button"
            onClick={() => setFavoritesOpen((v) => !v)}
            className="flex w-full items-center gap-2 border-b border-[#d6e8f5] bg-[#eef6fb] px-4 py-3 text-left"
          >
            <span className="material-icons text-[20px] text-[#00a78b]">star</span>
            <span className="flex-1 text-[15px] font-semibold text-[#00a78b]">Favorites</span>
            <span className="material-icons text-[20px] text-[#00a78b]">
              {favoritesOpen ? "expand_less" : "expand_more"}
            </span>
          </button>
          {favoritesOpen && (
            <div className="grid gap-0 md:grid-cols-2 xl:grid-cols-3">
              {filteredFavorites.map((report) => (
                <div key={report.id} className="border-b border-r border-slate-100 md:border-b-0">
                  <ReportItem
                    report={report}
                    favorited
                    onToggleFavorite={toggleFavorite}
                    onOpen={setActiveReport}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <div className="grid items-start gap-4 lg:grid-cols-2 xl:grid-cols-3">
        {REPORT_CATEGORIES.map((category) => (
          <CategoryPanel
            key={category.id}
            category={category}
            open={openCats[category.id]}
            onToggle={() =>
              setOpenCats((prev) => ({ ...prev, [category.id]: !prev[category.id] }))
            }
            favorites={favorites}
            onToggleFavorite={toggleFavorite}
            onOpen={setActiveReport}
            query={query}
          />
        ))}
      </div>
    </div>
  );
}
