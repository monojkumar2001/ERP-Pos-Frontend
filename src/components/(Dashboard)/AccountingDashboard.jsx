"use client";

import { useMemo, useState } from "react";

const KPI_CARDS = [
  {
    title: "Income",
    amount: "৳ 16,225,529.6",
    month: "Sep,2026",
    monthAmount: "৳ 9,884.82",
    icon: "fa-coins",
    iconBg: "#d7e8f5",
    iconColor: "#448dc0",
  },
  {
    title: "Expense",
    amount: "৳ 9,903,283,292.65",
    month: "Sep, 2026",
    monthAmount: "৳ 20,388.34",
    icon: "fa-money-check-alt",
    iconBg: "#fbd2ca",
    iconColor: "#f55151",
  },
  {
    title: "Profit",
    amount: "৳ -9,887,057,763.05",
    month: "Sep, 2026",
    monthAmount: "৳ -10,503.52",
    icon: "fa-hand-holding-usd",
    iconBg: "#daf6ca",
    iconColor: "#63ba33",
  },
  {
    title: "Customer Payments Expectations",
    amount: "৳ 40,693,265.87",
    month: "Sep, 2026",
    monthAmount: "৳ 40,693,265.87",
    icon: "fa-clipboard-list",
    iconBg: "#fee2fe",
    iconColor: "#b319b3",
  },
  {
    title: "Supplier Payments Expectations",
    amount: "৳ 22,339,195,393.9",
    month: "Sep, 2026",
    monthAmount: "৳ 22,339,195,393.9",
    icon: "fa-wallet",
    iconBg: "#e4f3ea",
    iconColor: "#486575",
  },
  {
    title: "Upcoming",
    amount: "৳ -22,298,502,128.02",
    month: "Sep, 2026",
    monthAmount: "৳ -22,298,502,128.02",
    icon: "fa-file-invoice-dollar",
    iconBg: "#f9efc1",
    iconColor: "#f39e4d",
  },
];

const INCOME_CATS = [
  { label: "Sales", value: 72, color: "#448dc0" },
  { label: "Discount Given", value: 8, color: "#63ba33" },
  { label: "Addtional Income", value: 6, color: "#f39e4d" },
  { label: "manufacturing 1", value: 5, color: "#b319b3" },
  { label: "Joint Machine rent", value: 4, color: "#f55151" },
  { label: "Campaign Expenses", value: 3, color: "#486575" },
  { label: "Sell", value: 1, color: "#9b59b6" },
  { label: "Cash on Hands", value: 1, color: "#1abc9c" },
];

const EXPENSE_CATS = [
  { label: "Cost of Goods Sold", value: 28, color: "#448dc0" },
  { label: "Payroll – Salary & Wages", value: 14, color: "#f55151" },
  { label: "Utilities", value: 10, color: "#f39e4d" },
  { label: "Office Rent", value: 9, color: "#63ba33" },
  { label: "Purchase", value: 8, color: "#b319b3" },
  { label: "Cash Short / Excess", value: 7, color: "#486575" },
  { label: "Bank Service Charges", value: 6, color: "#9b59b6" },
  { label: "General Expenses", value: 5, color: "#1abc9c" },
  { label: "Others", value: 13, color: "#95a5a6" },
];

const LATEST_INCOMES = [
  ["Sep 6, 2026", "Sales", "৳ 2,300"],
  ["Sep 3, 2026", "Sales", "৳ 1,150"],
  ["Sep 2, 2026", "Sales", "৳ 172.5"],
  ["Sep 2, 2026", "Sales", "৳ 800"],
  ["Sep 2, 2026", "Sales", "৳ 200"],
  ["Sep 2, 2026", "Sales", "৳ 2,040"],
  ["Sep 2, 2026", "Sales", "৳ 1,454.82"],
  ["Sep 2, 2026", "Discount Given", "৳ 0"],
  ["Sep 2, 2026", "Sales", "৳ 172.5"],
  ["Sep 1, 2026", "Sales", "৳ 100"],
];

const LATEST_EXPENSES = [
  ["Sep 6, 2026", "Cost of Goods Sold", "৳ 1,550"],
  ["Sep 6, 2026", "Application Fee", "৳ 15,000"],
  ["Sep 6, 2026", "বিদ্যুৎ বিল", "৳ 400"],
  ["Sep 5, 2026", "Cost of Goods Sold", "৳ 110.04"],
  ["Sep 3, 2026", "Cost of Goods Sold", "৳ 1,100"],
  ["Sep 2, 2026", "Cost of Goods Sold", "৳ 100"],
  ["Sep 2, 2026", "Cost of Goods Sold", "৳ 503.95"],
  ["Sep 2, 2026", "Cost of Goods Sold", "৳ 110"],
  ["Sep 2, 2026", "Cost of Goods Sold", "৳ 820"],
  ["Sep 2, 2026", "Cost of Goods Sold", "৳ 1,120.05"],
];

const CASH_ACCOUNTS = [
  ["Cash on Hand", "৳ -1,953,485.17"],
  ["Magura Cash", "৳ 99,445"],
  ["Dinajpur Cash", "৳ 2,800"],
  ["Bandar Cash", "৳ 518,589"],
  ["Cash Special", "৳ 12,450"],
  ["Petty Cash", "৳ 5,200"],
];

const BANK_ACCOUNTS = [
  ["DBBL Current", "৳ 1,245,800"],
  ["City Bank", "৳ 892,350.5"],
  ["BRAC Bank", "৳ 320,000"],
];

const MOBILE_ACCOUNTS = [
  ["bKash Merchant", "৳ 48,920"],
  ["Nagad Business", "৳ 22,150"],
  ["Rocket", "৳ 8,400"],
];

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
            {rows.map(([date, cat, amount], i) => (
              <tr key={`${date}-${i}`} className="border-b border-[#f1f3f5]">
                <td className="px-3 py-2 text-[#486575]">{date}</td>
                <td className="px-3 py-2 text-[#1a557a]">{cat}</td>
                <td className="px-3 py-2 text-right font-medium text-[#727272]">
                  {amount}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function AccountingDashboard() {
  const [tab, setTab] = useState("CASH");
  const accounts = useMemo(() => {
    if (tab === "BANK") return BANK_ACCOUNTS;
    if (tab === "MOBILE BANK") return MOBILE_ACCOUNTS;
    return CASH_ACCOUNTS;
  }, [tab]);

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
              defaultValue="2026-01-01"
              className="h-9 rounded border border-[#cfd8e3] bg-white px-2 text-[13px] outline-none focus:border-[#2980b9]"
            />
          </div>
          <div>
            <label className="mb-1 block text-[12px] font-medium">To Date</label>
            <input
              type="date"
              defaultValue="2026-09-06"
              className="h-9 rounded border border-[#cfd8e3] bg-white px-2 text-[13px] outline-none focus:border-[#2980b9]"
            />
          </div>
          <button
            type="button"
            className="h-9 rounded bg-[#2980b9] px-4 text-[13px] font-medium text-white hover:bg-[#2472a4]"
          >
            Apply Filter
          </button>
        </div>
      </div>

      <div className="mb-4 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-6">
        {KPI_CARDS.map((card) => (
          <KpiCard key={card.title} card={card} />
        ))}
      </div>

      <div className="mb-4 grid gap-4 lg:grid-cols-2">
        <div className="overflow-hidden rounded bg-white shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
          <div className="bg-[#dbe2ef] px-3 py-2.5 text-[13px] font-semibold text-[#1a557a]">
            Income By Category
          </div>
          <div className="grid gap-3 p-4 md:grid-cols-[180px_1fr] md:items-center">
            <DonutChart segments={INCOME_CATS} centerLabel="Category" />
            <ul className="m-0 max-h-[200px] space-y-1.5 overflow-auto p-0 list-none text-[12px]">
              {INCOME_CATS.map((s) => (
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
            <DonutChart segments={EXPENSE_CATS} centerLabel="Category" />
            <ul className="m-0 max-h-[200px] space-y-1.5 overflow-auto p-0 list-none text-[12px]">
              {EXPENSE_CATS.map((s) => (
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
          rows={LATEST_INCOMES}
        />
        <LatestTable
          title="Latest Expenses"
          headerBg="#486575"
          rows={LATEST_EXPENSES}
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
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
