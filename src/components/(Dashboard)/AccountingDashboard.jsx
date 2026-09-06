"use client";

import { useEffect, useMemo, useState } from "react";
import { accountingApi } from "../../lib/api";

function DonutChart({ segments, centerLabel }) {
  const size = 180;
  const stroke = 28;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  let offset = 0;
  const total = segments.reduce((s, x) => s + x.value, 0) || 1;

  return (
    <div className="relative mx-auto h-[180px] w-[180px]">
      <svg width={size} height={size} className="-rotate-90">
        {segments.map((seg) => {
          const len = (seg.value / total) * c;
          const dash = `${len} ${c - len}`;
          const el = (
            <circle
              key={seg.label}
              cx={size / 2}
              cy={size / 2}
              r={r}
              fill="none"
              stroke={seg.color}
              strokeWidth={stroke}
              strokeDasharray={dash}
              strokeDashoffset={-offset}
            />
          );
          offset += len;
          return el;
        })}
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        <div className="text-[11px] text-[#1a557a]">{centerLabel}</div>
        <div className="text-[12px] font-semibold text-[#727272]">
          {segments[0]?.label}
        </div>
      </div>
    </div>
  );
}

function KpiCard({ card }) {
  return (
    <div
      className="flex h-full cursor-pointer items-center gap-3 rounded-[6px] bg-white px-8 py-[9.6px]"
      style={{ boxShadow: "rgba(0, 0, 0, 0.1) 1px 1px 2px 2px" }}
    >
      <div
        className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full"
        style={{ backgroundColor: card.iconBg, color: card.iconColor }}
      >
        <i className={`fas ${card.icon} text-[22px]`} />
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-[12px] font-semibold text-[#1a557a]">{card.title}</div>
        <div className="truncate text-[13px] font-semibold text-[#727272]">
          {card.amount}
        </div>
        <div className="mt-0.5 flex items-center justify-between gap-2 text-[12px] text-[#1a557a]">
          <span className="inline-flex items-center gap-1">
            <i className="far fa-question-circle text-[11px] opacity-70" />
            {card.month}
          </span>
          <span className="font-medium">{card.monthAmount}</span>
        </div>
      </div>
    </div>
  );
}

function LatestTable({ title, headerBg, rows }) {
  return (
    <div className="overflow-hidden rounded bg-white shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
      <div
        className="px-3 py-2.5 text-[13px] font-semibold uppercase tracking-wide text-white"
        style={{ backgroundColor: headerBg }}
      >
        {title}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-[13px]">
          <thead>
            <tr className="border-b border-[#eef1f4] text-[#1a557a]">
              <th className="px-3 py-2 font-semibold">Date</th>
              <th className="px-3 py-2 font-semibold">Category</th>
              <th className="px-3 py-2 text-right font-semibold">Amount</th>
            </tr>
          </thead>
          <tbody>
            {(rows || []).map(([date, cat, amount], i) => (
              <tr key={`${date}-${i}`} className="border-b border-[#f1f3f5]">
                <td className="px-3 py-2 text-[#486575]">{date}</td>
                <td className="px-3 py-2 text-[#1a557a]">{cat}</td>
                <td className="px-3 py-2 text-right font-medium text-[#727272]">
                  {amount}
                </td>
              </tr>
            ))}
            {!rows?.length && (
              <tr>
                <td colSpan={3} className="px-3 py-6 text-center text-slate-400">
                  No data
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function AccountingDashboard() {
  const [tab, setTab] = useState("CASH");
  const [from, setFrom] = useState("2026-01-01");
  const [to, setTo] = useState("2026-09-06");
  const [applied, setApplied] = useState({ from: "2026-01-01", to: "2026-09-06" });
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");
    accountingApi
      .dashboard(applied)
      .then((res) => {
        if (!cancelled) setData(res);
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || "Failed to load dashboard");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [applied]);

  const accounts = useMemo(() => {
    if (!data) return [];
    if (tab === "BANK") return data.bankAccounts || [];
    if (tab === "MOBILE BANK") return data.mobileAccounts || [];
    return data.cashAccounts || [];
  }, [tab, data]);

  const kpis = data?.kpis || [];
  const incomeCats = data?.incomeCategories || [];
  const expenseCats = data?.expenseCategories || [];

  return (
    <div className="text-[#1a557a]">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h1 className="m-0 text-[22px] font-semibold text-[#1a557a]">
          Accounting Dashboard
        </h1>
        <div className="flex flex-wrap items-end gap-2">
          <div>
            <label className="mb-1 block text-[12px] font-medium">From Date</label>
            <input
              type="date"
              value={from}
              onChange={(e) => setFrom(e.target.value)}
              className="h-9 rounded border border-[#cfd8e3] bg-white px-2 text-[13px] outline-none focus:border-[#2980b9]"
            />
          </div>
          <div>
            <label className="mb-1 block text-[12px] font-medium">To Date</label>
            <input
              type="date"
              value={to}
              onChange={(e) => setTo(e.target.value)}
              className="h-9 rounded border border-[#cfd8e3] bg-white px-2 text-[13px] outline-none focus:border-[#2980b9]"
            />
          </div>
          <button
            type="button"
            onClick={() => setApplied({ from, to })}
            className="h-9 rounded bg-[#2980b9] px-4 text-[13px] font-medium text-white hover:bg-[#2472a4]"
          >
            Apply Filter
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-3 rounded border border-red-200 bg-red-50 px-3 py-2 text-[13px] text-red-700">
          {error}
        </div>
      )}

      {loading && !data ? (
        <div className="rounded bg-white p-10 text-center text-slate-500 shadow">
          Loading…
        </div>
      ) : (
        <>
          <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
            {kpis.map((card) => (
              <KpiCard key={card.title} card={card} />
            ))}
          </div>

          <div className="mb-4 grid gap-4 lg:grid-cols-2">
            <div className="overflow-hidden rounded bg-white shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
              <div className="bg-[#dbe2ef] px-3 py-2.5 text-[13px] font-semibold text-[#1a557a]">
                Income By Category
              </div>
              <div className="grid gap-3 p-4 md:grid-cols-[180px_1fr] md:items-center">
                <DonutChart segments={incomeCats} centerLabel="Category" />
                <ul className="m-0 max-h-[200px] space-y-1.5 overflow-auto p-0 list-none text-[12px]">
                  {incomeCats.map((s) => (
                    <li key={s.label} className="flex items-center gap-2">
                      <span
                        className="h-2.5 w-2.5 shrink-0 rounded-full"
                        style={{ backgroundColor: s.color }}
                      />
                      <span className="flex-1 truncate">{s.label}</span>
                      <span className="text-[#727272]">{s.value}%</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="overflow-hidden rounded bg-white shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
              <div className="bg-[#dbe2ef] px-3 py-2.5 text-[13px] font-semibold text-[#1a557a]">
                Expense Breakdown
              </div>
              <div className="grid gap-3 p-4 md:grid-cols-[180px_1fr] md:items-center">
                <DonutChart segments={expenseCats} centerLabel="Category" />
                <ul className="m-0 max-h-[200px] space-y-1.5 overflow-auto p-0 list-none text-[12px]">
                  {expenseCats.map((s) => (
                    <li key={s.label} className="flex items-center gap-2">
                      <span
                        className="h-2.5 w-2.5 shrink-0 rounded-full"
                        style={{ backgroundColor: s.color }}
                      />
                      <span className="flex-1 truncate">{s.label}</span>
                      <span className="text-[#727272]">{s.value}%</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="mb-4 grid gap-4 lg:grid-cols-2">
            <LatestTable
              title="Latest Incomes"
              headerBg="#448dc0"
              rows={data?.latestIncomes || []}
            />
            <LatestTable
              title="Latest Expenses"
              headerBg="#486575"
              rows={data?.latestExpenses || []}
            />
          </div>

          <div className="overflow-hidden rounded bg-white shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
            <div className="flex gap-6 border-b border-[#e5e7eb] px-4 pt-2">
              {["CASH", "BANK", "MOBILE BANK"].map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTab(t)}
                  className={`inline-flex items-center gap-2 border-b-2 pb-2 text-[13px] font-semibold uppercase ${
                    tab === t
                      ? "border-[#2980b9] text-[#2980b9]"
                      : "border-transparent text-[#296d9b]"
                  }`}
                >
                  <i
                    className={`fas ${
                      t === "CASH"
                        ? "fa-money-bill-wave"
                        : t === "BANK"
                          ? "fa-university"
                          : "fa-mobile-alt"
                    }`}
                  />
                  {t}
                </button>
              ))}
            </div>
            <div className="max-h-[280px] overflow-auto">
              <table className="w-full text-left text-[13px]">
                <thead className="sticky top-0">
                  <tr className="bg-[#d8e4f0] text-[#1a557a]">
                    <th className="px-4 py-2.5 font-semibold">Account</th>
                    <th className="px-4 py-2.5 text-right font-semibold">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {accounts.map(([name, amount]) => (
                    <tr key={name} className="border-b border-[#eef1f4]">
                      <td className="px-4 py-2.5">{name}</td>
                      <td className="px-4 py-2.5 text-right font-medium text-[#727272]">
                        {amount}
                      </td>
                    </tr>
                  ))}
                  {!accounts.length && (
                    <tr>
                      <td colSpan={2} className="px-4 py-6 text-center text-slate-400">
                        No accounts
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
