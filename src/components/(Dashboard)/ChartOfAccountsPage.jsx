"use client";

import { useEffect, useMemo, useState } from "react";
import { accountingApi } from "../../lib/api";

const FALLBACK_TABS = [
  { id: "expense", label: "EXPENSE", count: 0 },
  { id: "income", label: "INCOME", count: 0 },
  { id: "equity", label: "OWNER'S EQUITY", count: 0 },
  { id: "liabilities", label: "LIABILITIES", count: 0 },
  { id: "asset", label: "ASSET", count: 0 },
];

export default function ChartOfAccountsPage() {
  const [tab, setTab] = useState("asset");
  const [search, setSearch] = useState("");
  const [openGroups, setOpenGroups] = useState({});
  const [tabs, setTabs] = useState(FALLBACK_TABS);
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    accountingApi
      .accounts()
      .then((res) => {
        if (cancelled) return;
        setTabs(res.tabs?.length ? res.tabs : FALLBACK_TABS);
        setData(res.data || {});
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err.message || "Failed to load accounts");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const groups = data[tab] || [];

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return groups;
    return groups
      .map((g) => ({
        ...g,
        accounts: g.accounts.filter(
          (a) =>
            a.name.toLowerCase().includes(q) ||
            (a.code || "").toLowerCase().includes(q) ||
            (a.desc || "").toLowerCase().includes(q)
        ),
      }))
      .filter((g) => g.accounts.length > 0 || g.name.toLowerCase().includes(q));
  }, [groups, search]);

  const toggleGroup = (name) => {
    setOpenGroups((prev) => ({
      ...prev,
      [name]: prev[name] === false ? true : prev[name] === true ? false : false,
    }));
  };

  const isOpen = (name) => openGroups[name] !== false;

  return (
    <div className="text-[#1a557a]">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h1 className="m-0 flex items-center gap-2 text-[22px] font-semibold text-[#1a557a]">
          Chart of Accounts
          <button type="button" className="text-[#2980b9]" aria-label="Help">
            <i className="far fa-question-circle text-[16px]" />
          </button>
        </h1>
        <button
          type="button"
          className="inline-flex h-9 items-center rounded border border-[#2980b9] bg-white px-3 text-[13px] font-medium text-[#2980b9] hover:bg-[#2980b9] hover:text-white"
        >
          Add New Account
        </button>
      </div>

      <div className="mb-4 flex justify-end">
        <div className="relative w-full max-w-xs">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search..."
            className="h-9 w-full rounded border border-[#cfd8e3] bg-white py-2 pl-3 pr-9 text-[13px] outline-none focus:border-[#2980b9]"
          />
          <i className="fas fa-search absolute right-3 top-1/2 -translate-y-1/2 text-[13px] text-slate-400" />
        </div>
      </div>

      {error && (
        <div className="mb-3 rounded border border-red-200 bg-red-50 px-3 py-2 text-[13px] text-red-700">
          {error}
        </div>
      )}

      <div className="mb-4 flex flex-wrap gap-1 border-b border-[#e5e7eb]">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`inline-flex items-center gap-2 px-6 py-3 text-[12px] font-semibold uppercase tracking-wide ${
              tab === t.id
                ? "border-b-2 border-[#2980b9] text-[#2980b9]"
                : "border-b-2 border-transparent text-[#296d9b]"
            }`}
          >
            {t.label}
            <span className="rounded bg-[#e8f1f8] px-1.5 py-0.5 text-[11px] font-semibold text-[#6c7a89]">
              {t.count}
            </span>
          </button>
        ))}
      </div>

      {loading ? (
        <div className="rounded border border-slate-200 bg-white p-10 text-center text-slate-500">
          Loading…
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((group) => (
            <div
              key={group.name}
              className="overflow-hidden rounded border border-[#e5e7eb] bg-white shadow-sm"
            >
              <div className="flex items-center justify-between bg-[#e8f1f8] px-4 py-2.5">
                <button
                  type="button"
                  onClick={() => toggleGroup(group.name)}
                  className="flex items-center gap-2 text-[13px] font-semibold text-[#1a557a]"
                >
                  <i
                    className={`fas fa-chevron-${isOpen(group.name) ? "down" : "right"} text-[11px] text-[#2980b9]`}
                  />
                  {group.name}
                  <i className="far fa-question-circle text-[12px] text-[#8aa0b3]" />
                </button>
                <button
                  type="button"
                  className="text-[12px] font-medium text-[#2980b9] hover:underline"
                >
                  + Add New
                </button>
              </div>

              {isOpen(group.name) && (
                <ul className="m-0 list-none p-0">
                  {group.accounts.map((acc, idx) => (
                    <li
                      key={`${acc.id || acc.name}-${idx}`}
                      className="flex items-center gap-3 border-b border-[#eef1f4] px-4 py-3 last:border-b-0 hover:bg-[#f8fafc]"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-baseline gap-2">
                          {acc.code && (
                            <span className="account-number text-[12px] font-semibold text-[#2980b9]">
                              {acc.code}
                            </span>
                          )}
                          <span className="text-[13px] font-semibold text-[#1a557a]">
                            {acc.name}
                          </span>
                          {acc.desc && (
                            <span className="text-[12px] text-[#8aa0b3]">{acc.desc}</span>
                          )}
                        </div>
                      </div>
                      <span className="inline-flex rounded-full bg-[#28a745] px-2.5 py-0.5 text-[11px] font-semibold text-white">
                        {acc.status}
                      </span>
                      <button
                        type="button"
                        className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                        aria-label="Actions"
                      >
                        <i className="fas fa-ellipsis-v text-[13px]" />
                      </button>
                    </li>
                  ))}
                  {!group.accounts.length && (
                    <li className="px-4 py-6 text-center text-[13px] text-slate-400">
                      No accounts found
                    </li>
                  )}
                </ul>
              )}
            </div>
          ))}
          {!filtered.length && (
            <div className="rounded border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500">
              No accounts in this category
            </div>
          )}
        </div>
      )}
    </div>
  );
}
