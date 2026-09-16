"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { masterApi, unwrapApiData } from "../../lib/api";

const TABS = [
  "Ledger",
  "Direct Sales",
  "Orders",
  "Deliveries",
  "Invoices",
  "Payments",
  "Customer Debit",
];

const STAT_CARDS = [
  { key: "orders", label: "Orders", icon: "shopping_cart" },
  { key: "deliveries", label: "Deliveries", icon: "local_shipping" },
  { key: "invoices", label: "Invoices", icon: "receipt_long" },
  { key: "payments", label: "Payments", icon: "payments" },
  { key: "credit", label: "Credit Memos", icon: "credit_score" },
  { key: "applied", label: "Applied Credit Memos", icon: "done_all" },
  { key: "remaining", label: "Remaining Credit Memos", icon: "pending" },
  { key: "outstanding", label: "Outstanding Balance", icon: "account_balance_wallet", danger: true },
];

function StatusPill({ value }) {
  const active = String(value || "").toLowerCase() === "active";
  return (
    <span
      className={`inline-flex rounded-md px-2 py-0.5 text-[11px] font-semibold text-white ${
        active ? "bg-[#28a745]" : "bg-[#dc3545]"
      }`}
    >
      {value || "Active"}
    </span>
  );
}

export default function CustomerDetailsPage({ config, record }) {
  const [tab, setTab] = useState("Ledger");
  const [customer, setCustomer] = useState(record);
  const [loading, setLoading] = useState(Boolean(record?.id));
  const [status, setStatus] = useState(record?.status || "Active");

  useEffect(() => {
    if (!record?.id) return;
    setLoading(true);
    masterApi.customers
      .get(record.id)
      .then((res) => {
        const payload = unwrapApiData(res);
        setCustomer({ ...record, ...payload });
        setStatus(payload?.status || "Active");
      })
      .catch(() => setCustomer(record))
      .finally(() => setLoading(false));
  }, [record?.id]);

  const data = useMemo(
    () => ({
      id: customer?.id,
      name: customer?.name || `Customer ${customer?.id || ""}`,
      code: customer?.code || "N/A",
      phone: customer?.phone || customer?.phone_number || "N/A",
      email: customer?.email || "N/A",
      status: customer?.status || status,
      stats: {
        orders: "7 / ৳64,560",
        deliveries: "6",
        invoices: "5 / ৳63,320",
        payments: "৳2,500",
        credit: "0 / ৳0",
        applied: "0",
        remaining: "0",
        outstanding: "৳60,820",
      },
      ledger: [
        { date: "Opening Balance", reference: "", debit: "", credit: "", balance: "৳ 0" },
        {
          date: "13 Sep 2026, 01:08 PM",
          reference: "Sale Invoice: INV-2026-000318",
          debit: "৳ 60,000",
          credit: "৳ 0.00",
          balance: "৳ 60,700",
        },
        {
          date: "12 Sep 2026, 04:22 PM",
          reference: "Sale Invoice: INV-2026-000312",
          debit: "৳ 700",
          credit: "৳ 0.00",
          balance: "৳ 700",
        },
        {
          date: "10 Sep 2026, 11:15 AM",
          reference: "SP-001443",
          debit: "৳ 0.00",
          credit: "৳ 2,500",
          balance: "৳ 0",
        },
      ],
      ...customer,
    }),
    [customer, status]
  );

  const backHref = config?.backHref || "/en/sales/customers";
  const editHref = `/en/sales/customer-update/${data.id}`;
  const inactive = String(status).toLowerCase() === "inactive";

  if (loading) {
    return (
      <div className="rounded-lg border border-slate-200 bg-white p-10 text-center text-slate-500">
        Loading…
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h1 className="m-0 text-[22px] font-semibold text-[#1a557a]">
          {data.name}&apos;s Details
        </h1>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setStatus(inactive ? "Active" : "Inactive")}
            className="inline-flex h-9 items-center rounded border border-[#dc3545] bg-white px-4 text-[13px] font-medium text-[#dc3545] hover:bg-red-50"
          >
            {inactive ? "Make Active" : "Make Inactive"}
          </button>
          <Link
            href={editHref}
            className="inline-flex h-9 items-center rounded border border-[#00a78b] bg-white px-4 text-[13px] font-medium text-[#00a78b] hover:bg-[#e8f1f8]"
          >
            Edit
          </Link>
          <Link
            href={backHref}
            className="rounded p-1 text-slate-500 hover:bg-slate-100"
            aria-label="Close"
          >
            <span className="material-icons text-[22px]">close</span>
          </Link>
        </div>
      </div>

      <div className="mb-4 flex flex-wrap items-end gap-3 rounded-lg border border-[#e5e7eb] bg-white p-3">
        <div>
          <label className="mb-1 block text-[12px] text-slate-500">Select Range</label>
          <select className="h-9 min-w-[140px] rounded border border-slate-200 px-2 text-[13px]">
            <option>This Month</option>
            <option>Last Month</option>
            <option>Custom</option>
          </select>
        </div>
        <div>
          <label className="mb-1 block text-[12px] text-slate-500">From</label>
          <input type="date" defaultValue="2026-09-01" className="h-9 rounded border border-slate-200 px-2 text-[13px]" />
        </div>
        <div>
          <label className="mb-1 block text-[12px] text-slate-500">To</label>
          <input type="date" defaultValue="2026-09-14" className="h-9 rounded border border-slate-200 px-2 text-[13px]" />
        </div>
        <button
          type="button"
          className="h-9 rounded bg-[#00a78b] px-4 text-[13px] font-medium text-white hover:bg-[#008f77]"
        >
          Apply Filter
        </button>
        <button
          type="button"
          className="h-9 rounded border border-[#00a78b] bg-white px-4 text-[13px] font-medium text-[#00a78b] hover:bg-[#f0f7fb]"
        >
          Clear Filter
        </button>
      </div>

      <div className="mb-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        {STAT_CARDS.map((card) => (
          <div
            key={card.key}
            className="flex items-center gap-3 rounded-lg border border-[#e5e7eb] bg-white px-4 py-3 shadow-sm"
          >
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#e8f1f8] text-[#00a78b]">
              <span className="material-icons text-[20px]">{card.icon}</span>
            </span>
            <div>
              <p className="m-0 text-[12px] text-slate-500">{card.label}</p>
              <p
                className={`m-0 text-[15px] font-semibold ${
                  card.danger ? "text-[#dc3545]" : "text-[#1a557a]"
                }`}
              >
                {data.stats?.[card.key] || "0"}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-[280px_1fr]">
        <div className="rounded-lg border border-[#e5e7eb] bg-white p-4 text-center shadow-sm">
          <div className="mx-auto mb-3 flex h-28 w-28 items-center justify-center rounded-full bg-slate-100 text-slate-400">
            <span className="material-icons text-[48px]">image</span>
          </div>
          <h2 className="m-0 text-[18px] font-semibold text-[#1a557a]">{data.name}</h2>
          <div className="mt-2 flex items-center justify-center gap-2">
            <span className="text-[13px] text-slate-600">{data.code}</span>
            <StatusPill value={status} />
          </div>
          <p className="mt-3 mb-0 flex items-center justify-center gap-1 text-[13px] text-[#00a78b]">
            <span className="material-icons text-[16px]">phone</span>
            {data.phone}
          </p>
        </div>

        <div className="rounded-lg border border-[#e5e7eb] bg-white shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 px-3 py-2">
            <div className="flex flex-wrap gap-1">
              {TABS.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTab(t)}
                  className={`rounded px-3 py-1.5 text-[13px] font-medium ${
                    tab === t
                      ? "bg-[#00a78b] text-white"
                      : "text-[#1a557a] hover:bg-[#f0f7fb]"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
            <button
              type="button"
              className="inline-flex items-center gap-1 text-[13px] font-medium text-[#00a78b]"
            >
              View All
              <span className="material-icons text-[16px]">open_in_new</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            {tab === "Ledger" ? (
              <table className="w-full min-w-[640px] border-collapse text-[13px]">
                <thead>
                  <tr className="bg-[#e8f1f8] text-left text-[#1a557a]">
                    <th className="px-3 py-2 font-semibold">DATE</th>
                    <th className="px-3 py-2 font-semibold">REFERENCE</th>
                    <th className="px-3 py-2 font-semibold">DEBIT</th>
                    <th className="px-3 py-2 font-semibold">CREDIT</th>
                    <th className="px-3 py-2 font-semibold">BALANCE</th>
                  </tr>
                </thead>
                <tbody>
                  {(data.ledger || []).map((row, i) => (
                    <tr key={i} className="border-t border-slate-100">
                      <td className="px-3 py-2.5 text-slate-700">{row.date}</td>
                      <td className="px-3 py-2.5 text-[#00a78b]">{row.reference || "—"}</td>
                      <td className="px-3 py-2.5">{row.debit || "—"}</td>
                      <td className="px-3 py-2.5">{row.credit || "—"}</td>
                      <td className="px-3 py-2.5 font-medium">{row.balance}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="px-3 py-10 text-center text-slate-400">No data available!</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
