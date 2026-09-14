"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

function StatusPill({ value, tone }) {
  const v = String(value || "").toLowerCase();
  let cls = "bg-slate-400 text-white";
  if (tone === "orange" || v === "delivered") cls = "bg-[#fd7e14] text-white";
  else if (tone === "red" || ["unpaid", "cancelled", "inactive"].includes(v))
    cls = "bg-[#dc3545] text-white";
  else if (["completed", "paid", "approved", "active"].includes(v))
    cls = "bg-[#28a745] text-white";
  else if (["draft", "pending"].includes(v)) cls = "bg-[#ffc107] text-[#212529]";

  return (
    <span className={`inline-flex rounded-lg px-2.5 py-0.5 text-[11px] font-semibold ${cls}`}>
      {value}
    </span>
  );
}

function MetaRow({ label, children }) {
  return (
    <div className="grid grid-cols-[120px_12px_1fr] gap-1 text-[13px] text-slate-700">
      <span className="text-slate-500">{label}</span>
      <span className="text-slate-400">:</span>
      <span>{children}</span>
    </div>
  );
}

function RelatedTable({ title, columns, rows, emptyText = "No data available!" }) {
  return (
    <div className="mt-6">
      <h3 className="mb-2 text-[15px] font-semibold text-[#1a557a]">{title}</h3>
      <div className="overflow-x-auto rounded border border-[#e5e7eb]">
        <table className="w-full min-w-[640px] border-collapse text-left text-[13px]">
          <thead>
            <tr className="bg-[#eef5fa]">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className="whitespace-nowrap px-3 py-2.5 text-[11px] font-semibold uppercase tracking-wide text-[#1a557a]"
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-3 py-6 text-center text-slate-400"
                >
                  {emptyText}
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr key={row.id} className="border-t border-[#eef1f4]">
                  {columns.map((col) => {
                    const val = row[col.key];
                    return (
                      <td key={col.key} className="px-3 py-2.5 text-slate-700">
                        {col.type === "link" ? (
                          <span className="font-medium text-[#2980b9]">{val}</span>
                        ) : col.type === "status" ? (
                          <StatusPill value={val} tone={col.tone} />
                        ) : col.type === "action" ? (
                          <button
                            type="button"
                            className="rounded p-1 text-slate-500 hover:bg-slate-100"
                            aria-label="Actions"
                          >
                            <span className="material-icons text-[18px]">more_vert</span>
                          </button>
                        ) : (
                          val
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function TransactionDetailPage({ config, data }) {
  const router = useRouter();
  const backHref = config?.backHref || "/en/sales/sales-direct-sales";
  const d = data || {};

  const orderNumber = d.order_number || "DSO-000000";
  const status = d.status || "Completed";
  const lines = d.lines || [];
  const deliveries = d.deliveries || [];
  const invoices = d.invoices || [];
  const returns = d.returns || [];

  return (
    <div>
      <div className="mb-3 flex flex-wrap items-center gap-2 text-[12px] text-slate-500">
        <Link href="/en/dashboard" className="rounded bg-[#eef2f6] px-2 py-1 hover:text-[#2980b9]">
          Home
        </Link>
        <span>›</span>
        <Link href={backHref} className="rounded bg-[#eef2f6] px-2 py-1 hover:text-[#2980b9]">
          Direct Sales
        </Link>
        <span>›</span>
        <span className="rounded bg-[#eef2f6] px-2 py-1 text-slate-700">Direct Sale Details</span>
      </div>

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h1 className="m-0 text-[22px] font-semibold text-[#2c3e50]">{orderNumber}</h1>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => router.push(config?.editHref || "/en/sales/sales-direct-sale-create")}
            className="inline-flex h-9 items-center rounded border border-[#2980b9] bg-white px-3 text-[13px] font-medium text-[#2980b9] hover:bg-[#e8f1f8]"
          >
            Edit
          </button>
          <button
            type="button"
            className="inline-flex h-9 items-center rounded border border-[#2980b9] bg-white px-3 text-[13px] font-medium text-[#2980b9] hover:bg-[#e8f1f8]"
          >
            Cancel
          </button>
          <button
            type="button"
            className="inline-flex h-9 items-center gap-1 rounded bg-[#2980b9] px-3 text-[13px] font-medium text-white hover:bg-[#2472a4]"
          >
            <span className="material-icons text-[16px]">print</span>
            Print
          </button>
          <button
            type="button"
            className="inline-flex h-9 items-center gap-1 rounded bg-[#2980b9] px-3 text-[13px] font-medium text-white hover:bg-[#2472a4]"
          >
            <span className="material-icons text-[16px]">picture_as_pdf</span>
            PDF
          </button>
        </div>
      </div>

      <div className="rounded-lg border border-[#e5e7eb] bg-white p-5 shadow-sm">
        <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#1a557a] text-[22px] font-bold text-white">
              b
            </div>
            <div>
              <h2 className="m-0 text-[16px] font-semibold text-[#1a557a]">
                {d.company_name || "Demo Biznify"}
              </h2>
              <p className="m-0 mt-1 text-[12px] leading-relaxed text-slate-500">
                {d.company_email || "shanto@softifybd.com"}
                <br />
                {d.company_phone || "+8801894431216"}
                <br />
                {d.company_address ||
                  "Lift-18, Tower of Akash, Gulshan 1, Gulshan, Dhaka, Dhaka, Bangladesh"}
              </p>
            </div>
          </div>
        </div>

        <div className="mb-6 flex flex-wrap items-start justify-between gap-6 border-b border-[#eef1f4] pb-5">
          <div>
            <div className="text-[13px] text-slate-500">Order by:</div>
            <div className="mt-0.5 text-[15px] font-semibold text-[#2980b9]">
              {d.customer || "Customer"}
            </div>
            {d.customer_phone ? (
              <div className="mt-0.5 text-[13px] text-slate-600">{d.customer_phone}</div>
            ) : null}
          </div>
          <div className="space-y-1.5 min-w-[240px]">
            <MetaRow label="Order Number">{orderNumber}</MetaRow>
            <MetaRow label="Date">{d.sale_date || "—"}</MetaRow>
            <MetaRow label="Type">{d.type || "Direct Sale"}</MetaRow>
            <MetaRow label="Sales Person">{d.sales_person || "Demo"}</MetaRow>
            <MetaRow label="Status">
              <StatusPill value={status} />
            </MetaRow>
          </div>
        </div>

        <div className="overflow-x-auto rounded border border-[#e5e7eb]">
          <table className="w-full min-w-[900px] border-collapse text-left text-[13px]">
            <thead>
              <tr className="bg-[#eef5fa]">
                {[
                  "#",
                  "ITEM & DESCRIPTION",
                  "ORDERED QTY",
                  "BILLED QTY",
                  "DELIVERED QTY",
                  "RETURNED QTY",
                  "PRICE",
                  "DISCOUNT",
                  "AMOUNT",
                ].map((h) => (
                  <th
                    key={h}
                    className="whitespace-nowrap px-3 py-2.5 text-[11px] font-semibold uppercase tracking-wide text-[#1a557a]"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {lines.map((line, idx) => (
                <tr key={line.id || idx} className="border-t border-[#eef1f4]">
                  <td className="px-3 py-2.5 text-slate-600">{idx + 1}</td>
                  <td className="px-3 py-2.5">
                    <div className="font-medium text-[#2980b9]">{line.item}</div>
                    {line.description ? (
                      <div className="mt-0.5 text-[12px] text-slate-500">{line.description}</div>
                    ) : null}
                  </td>
                  <td className="px-3 py-2.5">{line.ordered_qty}</td>
                  <td className="px-3 py-2.5">{line.billed_qty}</td>
                  <td className="px-3 py-2.5">{line.delivered_qty}</td>
                  <td className="px-3 py-2.5">{line.returned_qty}</td>
                  <td className="px-3 py-2.5">{line.price}</td>
                  <td className="px-3 py-2.5">{line.discount || "N/A"}</td>
                  <td className="px-3 py-2.5 font-medium">{line.amount}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t border-[#e5e7eb] bg-[#fafbfc]">
                <td colSpan={8} className="px-3 py-3 text-right font-semibold text-slate-700">
                  Grand Total
                </td>
                <td className="px-3 py-3 font-semibold text-slate-800">
                  {d.grand_total || "৳ 0"}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        <RelatedTable
          title="Related Deliveries"
          columns={[
            { key: "number", label: "DELIVERY NUMBER", type: "link" },
            { key: "date", label: "DATE" },
            { key: "type", label: "DELIVERY TYPE" },
            { key: "status", label: "DELIVERY STATUS", type: "status", tone: "orange" },
            { key: "action", label: "ACTION", type: "action" },
          ]}
          rows={deliveries}
        />

        <RelatedTable
          title="Related Invoices"
          columns={[
            { key: "number", label: "INVOICE NUMBER", type: "link" },
            { key: "date", label: "INVOICE DATE" },
            { key: "paid", label: "PAID" },
            { key: "due", label: "DUE" },
            { key: "total", label: "TOTAL" },
            { key: "status", label: "STATUS", type: "status", tone: "red" },
            { key: "action", label: "ACTION", type: "action" },
          ]}
          rows={invoices}
        />

        <RelatedTable
          title="Related Returns"
          columns={[
            { key: "number", label: "RETURN NUMBER", type: "link" },
            { key: "reason", label: "REASON" },
            { key: "date", label: "RETURN DATE" },
            { key: "amount", label: "AMOUNT" },
            { key: "action", label: "ACTION", type: "action" },
          ]}
          rows={returns}
        />

        <div className="mt-8 grid gap-6 border-t border-[#eef1f4] pt-6 md:grid-cols-3">
          <div>
            <div className="mb-2 text-[13px] font-medium text-slate-600">Notes :</div>
            <div className="min-h-[48px] text-[13px] text-slate-500">{d.notes || ""}</div>
          </div>
          <div className="text-center">
            <div className="mb-10 text-[13px] text-slate-500">Signature of Customer</div>
            <div className="mx-auto h-px w-40 bg-slate-300" />
          </div>
          <div className="text-center">
            <div className="mb-10 text-[13px] text-slate-500">Authorized Signature</div>
            <div className="mx-auto h-px w-40 bg-slate-300" />
          </div>
        </div>
      </div>
    </div>
  );
}
