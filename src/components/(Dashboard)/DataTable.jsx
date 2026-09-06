"use client";

import { useMemo, useState } from "react";

function StatusPill({ value }) {
  const v = String(value).toLowerCase();
  let cls = "bg-slate-400 text-white";
  if (
    ["active", "approved", "completed", "paid", "verified", "delivered", "refunded", "approve"].includes(
      v
    )
  )
    cls = "bg-[#28a745] text-white";
  else if (["draft", "pending", "in-process", "partially paid", "partially delivered", "partially invoiced", "not invoiced"].includes(v))
    cls = "bg-[#ffc107] text-[#212529]";
  else if (["inactive", "rejected", "cancelled", "unpaid"].includes(v))
    cls = "bg-[#dc3545] text-white";
  else if (["ordered", "invoiced"].includes(v)) cls = "bg-[#17a2b8] text-white";

  return (
    <span
      className={`inline-flex rounded-lg px-2 py-0.5 text-[11px] font-semibold ${cls}`}
    >
      {value}
    </span>
  );
}

export default function DataTable({
  columns = [],
  rows = [],
  totalEntries,
  totalAmount,
  amountKey = "amount",
}) {
  const [pageSize, setPageSize] = useState(25);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    if (!search.trim()) return rows;
    const q = search.toLowerCase();
    return rows.filter((r) =>
      Object.values(r).some((v) => String(v).toLowerCase().includes(q))
    );
  }, [rows, search]);

  const total = totalEntries || filtered.length;
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageRows = filtered.slice((page - 1) * pageSize, page * pageSize);
  const from = filtered.length ? (page - 1) * pageSize + 1 : 0;
  const to = Math.min(page * pageSize, filtered.length);

  const amountColIndex = columns.findIndex((c) => c.key === amountKey);
  const totalLabelColSpan = amountColIndex > 0 ? amountColIndex : Math.max(1, columns.length - 3);

  return (
    <div className="overflow-hidden rounded border border-[#e5e7eb] bg-white">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#e5e7eb] px-3 py-2.5">
        <label className="flex items-center gap-2 text-[13px] text-slate-600">
          Show
          <select
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setPage(1);
            }}
            className="h-8 rounded border border-slate-200 px-2"
          >
            {[25, 50, 100].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
          entries
        </label>
        <div className="relative">
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search..."
            className="h-8 w-52 rounded border border-slate-200 py-1 pl-3 pr-8 text-[13px] outline-none focus:border-[#2980b9]"
          />
          <span className="material-icons absolute right-2 top-1/2 -translate-y-1/2 text-[18px] text-slate-400">
            search
          </span>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[900px] border-collapse text-left text-[13px]">
          <thead>
            <tr style={{ backgroundColor: "#2980b9" }}>
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="whitespace-nowrap px-3 py-2.5 text-[11px] font-semibold uppercase tracking-wide text-white"
                >
                  {col.type === "checkbox" ? (
                    <input type="checkbox" className="accent-white" readOnly />
                  ) : (
                    col.label
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pageRows.map((row) => (
              <tr key={row.id} className="border-b border-[#eef1f4] hover:bg-slate-50">
                {columns.map((col) => {
                  const val = row[col.key];
                  return (
                    <td
                      key={col.key}
                      className={`px-3 py-2 text-slate-700 ${
                        col.key === amountKey ? "text-center" : ""
                      } ${col.type === "description" || col.key === "description" ? "max-w-[280px] truncate" : ""}`}
                    >
                      {col.type === "checkbox" ? (
                        <input type="checkbox" className="accent-[#2980b9]" readOnly />
                      ) : col.type === "status" ? (
                        <StatusPill value={val} />
                      ) : col.type === "action" ? (
                        <button
                          type="button"
                          className="rounded p-1 text-slate-500 hover:bg-slate-100"
                          aria-label="Actions"
                        >
                          <span className="material-icons text-[18px]">more_vert</span>
                        </button>
                      ) : col.type === "link" ? (
                        val === "N/A" || !val ? (
                          <span className="text-slate-400">N/A</span>
                        ) : (
                          <span className="cursor-pointer font-medium text-[#2980b9] hover:underline">
                            {col.showIcon ? (
                              <span className="inline-flex items-center gap-2">
                                <span className="material-icons text-[16px] text-slate-400">
                                  image
                                </span>
                                {val}
                              </span>
                            ) : (
                              val
                            )}
                          </span>
                        )
                      ) : (
                        val
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
            {!pageRows.length && (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-3 py-10 text-center text-slate-400"
                >
                  No data available
                </td>
              </tr>
            )}
          </tbody>
          {totalAmount != null && amountColIndex >= 0 && (
            <tfoot>
              <tr className="border-t border-[#e5e7eb]">
                <td colSpan={totalLabelColSpan} className="px-3 py-2.5">
                  <strong className="text-[13px] text-slate-800">Total Amount</strong>
                </td>
                <td className="px-3 py-2.5 text-center">
                  <strong className="text-[13px] text-slate-800">{totalAmount}</strong>
                </td>
                <td colSpan={columns.length - amountColIndex - 1} />
              </tr>
            </tfoot>
          )}
        </table>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 px-3 py-2.5 text-[13px] text-slate-600">
        <span>
          Showing {from} to {to} of {total} entries
        </span>
        <div className="flex items-center gap-2">
          <span className="text-slate-500">Jump to</span>
          <select
            value={page}
            onChange={(e) => setPage(Number(e.target.value))}
            className="h-8 rounded border border-slate-200 px-2"
          >
            {Array.from({ length: pageCount }, (_, i) => i + 1).map((n) => (
              <option key={n} value={n}>
                {n === page ? "page" : n}
              </option>
            ))}
          </select>
        </div>
        <div className="flex items-center gap-1">
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => setPage(1)}
            className="rounded border border-slate-200 px-2 py-1 disabled:opacity-40"
          >
            First
          </button>
          <button
            type="button"
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
            className="rounded border border-slate-200 px-2 py-1 disabled:opacity-40"
          >
            <span className="material-icons text-[16px]">chevron_left</span>
          </button>
          {Array.from({ length: Math.min(pageCount, 5) }, (_, i) => {
            const n = pageCount <= 5 ? i + 1 : Math.min(Math.max(page - 2, 1) + i, pageCount);
            return n;
          })
            .filter((n, i, arr) => arr.indexOf(n) === i)
            .map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setPage(n)}
                className={`min-w-8 rounded border px-2 py-1 ${
                  page === n
                    ? "border-[#2980b9] bg-[#2980b9] text-white"
                    : "border-slate-200 bg-white"
                }`}
              >
                {n}
              </button>
            ))}
          {pageCount > 5 && <span className="px-1">...</span>}
          {pageCount > 5 && (
            <button
              type="button"
              onClick={() => setPage(pageCount)}
              className={`min-w-8 rounded border px-2 py-1 ${
                page === pageCount
                  ? "border-[#2980b9] bg-[#2980b9] text-white"
                  : "border-slate-200 bg-white"
              }`}
            >
              {pageCount}
            </button>
          )}
          <button
            type="button"
            disabled={page >= pageCount}
            onClick={() => setPage((p) => p + 1)}
            className="rounded border border-slate-200 px-2 py-1 disabled:opacity-40"
          >
            <span className="material-icons text-[16px]">chevron_right</span>
          </button>
          <button
            type="button"
            disabled={page >= pageCount}
            onClick={() => setPage(pageCount)}
            className="rounded border border-slate-200 px-2 py-1 disabled:opacity-40"
          >
            Last
          </button>
        </div>
      </div>
    </div>
  );
}
