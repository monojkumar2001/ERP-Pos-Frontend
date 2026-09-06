"use client";

import { useMemo, useState } from "react";

const TABS = [
  { id: "expense", label: "EXPENSE", count: 80 },
  { id: "income", label: "INCOME", count: 19 },
  { id: "equity", label: "OWNER'S EQUITY", count: 12 },
  { id: "liabilities", label: "LIABILITIES", count: 15 },
  { id: "asset", label: "ASSET", count: 91 },
];

const DATA = {
  expense: [
    {
      name: "Cost of Goods Sold",
      accounts: [
        { code: "5022", name: "Cost of Goods Sold", status: "Active" },
        { code: "", name: "abcd", status: "Active" },
        { code: "", name: "Appearals ltd", status: "Active" },
        { code: "", name: "Application Fee", status: "Active" },
        { code: "", name: "CTG Cash", status: "Active" },
      ],
    },
    {
      name: "Discounts",
      accounts: [
        {
          code: "5601",
          name: "Discount Received",
          desc: "This account is responsible for received discounts from suppliers.",
          status: "Active",
        },
      ],
    },
    {
      name: "Operating Expense",
      accounts: [
        {
          code: "5001",
          name: "Accounting Fees",
          desc: "Accounting or bookkeeping services for your business.",
          status: "Active",
        },
        {
          code: "5002",
          name: "Advertising & Promotion",
          desc: "Advertising or other costs to promote your business.",
          status: "Active",
        },
        {
          code: "5003",
          name: "Bank Service Charges",
          desc: "Fees you pay to your bank like transaction charges.",
          status: "Active",
        },
        {
          code: "5004",
          name: "Computer – Hardware",
          desc: "Desktop or laptop computers, mobile phones, tablets.",
          status: "Active",
        },
        {
          code: "5005",
          name: "Computer – Hosting",
          desc: "Fees for web storage and access.",
          status: "Active",
        },
      ],
    },
    {
      name: "Payroll Expense",
      accounts: [
        {
          code: "5303",
          name: "Payroll – Salary & Wages",
          desc: "Wages and salaries paid to your employees.",
          status: "Active",
        },
        { code: "", name: "Advance Salary", status: "Active" },
        { code: "", name: "MR. XYZ", status: "Active" },
      ],
    },
  ],
  income: [
    {
      name: "Income",
      accounts: [
        { code: "4001", name: "Sales", desc: "Income from selling products or services.", status: "Active" },
        { code: "4002", name: "Service Revenue", status: "Active" },
      ],
    },
    {
      name: "Other Income",
      accounts: [
        { code: "4101", name: "Interest Income", status: "Active" },
        { code: "", name: "Joint Machine rent", status: "Active" },
      ],
    },
    {
      name: "Uncategorized Income",
      accounts: [{ code: "", name: "Cash on Hands", status: "Active" }],
    },
  ],
  equity: [
    {
      name: "Business Owner Contribution and Drawing",
      accounts: [
        { code: "3001", name: "Owner's Contribution", status: "Active" },
        { code: "3002", name: "Owner's Drawing", status: "Active" },
      ],
    },
    {
      name: "Retained Earnings",
      accounts: [
        { code: "3101", name: "Retained Earnings", status: "Active" },
      ],
    },
  ],
  liabilities: [
    {
      name: "Credit Card",
      accounts: [
        { code: "2001", name: "Business Credit Card", status: "Active" },
      ],
    },
    {
      name: "Loan and Line of Credit",
      accounts: [
        { code: "2101", name: "Bank Loan", status: "Active" },
        { code: "2102", name: "Line of Credit", status: "Active" },
      ],
    },
    {
      name: "Expected Payments to Vendors",
      accounts: [
        { code: "2201", name: "Accounts Payable", status: "Active" },
      ],
    },
  ],
  asset: [
    {
      name: "Bank",
      accounts: [
        { code: "", name: "ADDD", desc: "D", status: "Active" },
        { code: "", name: "ASDSADSAD", status: "Active" },
        { code: "", name: "Bank Asia", status: "Active" },
        { code: "", name: "Brack Bank", desc: "ljsabd", status: "Active" },
        { code: "", name: "Cash on Handss", status: "Active" },
        { code: "", name: "City Bank", status: "Active" },
        { code: "", name: "City Bank (Dhaka Office)", status: "Active" },
        { code: "", name: "City Bank Pte", status: "Active" },
        { code: "", name: "DBBL Bank", status: "Active" },
        { code: "", name: "Dolar Cash", status: "Active" },
        { code: "", name: "Eastern Bank Ltd", status: "Active" },
        { code: "", name: "Fake Account", desc: "Forecasting", status: "Active" },
        { code: "", name: "GIB", status: "Active" },
        { code: "", name: "Green Bangla Bank", status: "Active" },
        { code: "", name: "IBBL", status: "Active" },
        { code: "", name: "Islami Bank", status: "Active" },
      ],
    },
    {
      name: "Cash",
      accounts: [
        { code: "1001", name: "Cash on Hand", status: "Active" },
        { code: "1002", name: "Petty Cash", status: "Active" },
        { code: "", name: "Magura Cash", status: "Active" },
      ],
    },
  ],
};

export default function ChartOfAccountsPage() {
  const [tab, setTab] = useState("asset");
  const [search, setSearch] = useState("");
  const [openGroups, setOpenGroups] = useState({});

  const groups = DATA[tab] || [];

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

      <div className="mb-4 flex flex-wrap gap-1 border-b border-[#e5e7eb]">
        {TABS.map((t) => (
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
                    key={`${acc.name}-${idx}`}
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
      </div>
    </div>
  );
}
