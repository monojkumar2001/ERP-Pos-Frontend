"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { accountingApi, unwrapApiData } from "../../lib/api";

const RESOURCE = {
  journal: accountingApi.journal,
  expense: accountingApi.expense,
  income: accountingApi.income,
  transfer: accountingApi.transfer,
  recurring: accountingApi.recurringJournal,
};

function StatusPill({ value }) {
  const v = String(value || "").toLowerCase();
  let cls = "bg-slate-400 text-white";
  if (["active", "approved", "approve", "completed"].includes(v)) cls = "bg-[#28a745] text-white";
  else if (["draft", "pending"].includes(v)) cls = "bg-[#ffc107] text-[#212529]";

  return (
    <span className={`inline-flex rounded-md px-2 py-0.5 text-[11px] font-semibold ${cls}`}>
      {value}
    </span>
  );
}

function DetailRow({ label, value }) {
  return (
    <div className="grid gap-1 sm:grid-cols-[180px_1fr] sm:gap-4">
      <dt className="text-[13px] font-medium text-[#8aa0b3]">{label}</dt>
      <dd className="m-0 text-[13px] text-[#1a557a]">{value ?? "—"}</dd>
    </div>
  );
}

export default function AccountingDetailsPage({ config }) {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const kind = config?.accountingDetails || "journal";
  const backHref = config?.backHref || "/en/accounting/dashboard";
  const editHref = config?.editHref ? `${config.editHref}?id=${id}` : backHref;
  const api = RESOURCE[kind];

  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!id || !api) {
      setLoading(false);
      setError("Missing record id.");
      return;
    }
    let cancelled = false;
    setLoading(true);
    api
      .get(id)
      .then((res) => {
        if (!cancelled) setRecord(unwrapApiData(res));
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || "Failed to load details");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [id, api]);

  const title =
    config?.title ||
    (kind === "journal"
      ? record?.reference_number || "Journal Entry"
      : record?.reference_number || "Details");

  if (loading) {
    return (
      <div className="rounded-lg border border-slate-200 bg-white p-10 text-center text-slate-500">
        Loading…
      </div>
    );
  }

  if (error || !record) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center text-red-700">
        {error || "Record not found."}{" "}
        <Link href={backHref} className="font-semibold underline">
          Back to list
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h1 className="m-0 text-[22px] font-semibold text-[#1a557a]">{title}</h1>
        <div className="flex flex-wrap items-center gap-2">
          {record.status && kind !== "recurring" && (
            <StatusPill value={record.status} />
          )}
          {kind !== "recurring" && String(record.status).toLowerCase() === "draft" && (
            <Link
              href={editHref}
              className="inline-flex h-9 items-center rounded border border-[#00a78b] bg-white px-4 text-[13px] font-medium text-[#00a78b] hover:bg-[#e8f1f8]"
            >
              Edit
            </Link>
          )}
          <Link
            href={backHref}
            className="inline-flex h-9 items-center rounded border border-slate-300 bg-white px-4 text-[13px] font-medium text-[#1a557a] hover:bg-slate-50"
          >
            Back
          </Link>
        </div>
      </div>

      <div className="rounded-lg border border-[#e5e7eb] bg-white p-5 shadow-sm">
        <dl className="space-y-4">
          {kind === "journal" && (
            <>
              <DetailRow label="Reference" value={record.reference_number || "N/A"} />
              <DetailRow label="Date" value={record.entry_date_formatted || record.entry_date} />
              <DetailRow label="Time" value={record.entry_time_formatted || record.entry_time} />
              <DetailRow label="Description" value={record.description} />
              <DetailRow label="Amount" value={record.amount_formatted} />
              <DetailRow label="Status" value={<StatusPill value={record.status} />} />
            </>
          )}

          {(kind === "expense" || kind === "income" || kind === "transfer") && (
            <>
              <DetailRow label="Reference" value={record.reference_number || "N/A"} />
              <DetailRow label="Date" value={record.entry_date_formatted || record.entry_date} />
              <DetailRow label="Time" value={record.entry_time_formatted || record.entry_time} />
              <DetailRow label="Description" value={record.description} />
              {kind === "expense" && (
                <DetailRow label="Expense From" value={record.expense_from} />
              )}
              {kind === "income" && <DetailRow label="Income To" value={record.income_to} />}
              {kind === "transfer" && (
                <>
                  <DetailRow label="Transfer From" value={record.transfer_from} />
                  <DetailRow label="Transfer To" value={record.transfer_to} />
                </>
              )}
              <DetailRow label="Amount" value={record.amount_formatted} />
              <DetailRow label="Status" value={<StatusPill value={record.status} />} />
            </>
          )}

          {kind === "recurring" && (
            <>
              <DetailRow label="Start Date" value={record.start_date_formatted || record.start_date} />
              <DetailRow label="Account Type" value={record.account_type} />
              <DetailRow label="Debit Account" value={record.debit_account} />
              <DetailRow label="Credit Account" value={record.credit_account} />
              <DetailRow label="Amount" value={record.amount_formatted} />
              <DetailRow label="Recurring Interval" value={record.recurring_interval} />
              <DetailRow
                label="Last Transaction Date"
                value={record.last_transaction_date_formatted || record.last_transaction_date || "—"}
              />
              <DetailRow label="Approval Status" value={record.approval_status} />
              <DetailRow label="Operational Status" value={record.operational_status} />
            </>
          )}
        </dl>

        {kind === "journal" && record.lines?.length > 0 && (
          <div className="mt-6">
            <h3 className="mb-3 text-[15px] font-semibold text-[#1a557a]">Journal Lines</h3>
            <div className="overflow-x-auto rounded border border-[#e5e7eb]">
              <table className="w-full min-w-[480px] text-left text-[13px]">
                <thead className="bg-[#e8f1f8] text-[11px] font-semibold uppercase text-[#1a557a]">
                  <tr>
                    <th className="px-3 py-2.5">Account</th>
                    <th className="px-3 py-2.5">Debit</th>
                    <th className="px-3 py-2.5">Credit</th>
                  </tr>
                </thead>
                <tbody>
                  {record.lines.map((line) => (
                    <tr key={line.id} className="border-t border-[#eef1f4]">
                      <td className="px-3 py-2.5">
                        {line.account_code ? `${line.account_code} — ` : ""}
                        {line.account_name}
                      </td>
                      <td className="px-3 py-2.5">
                        {Number(line.debit) ? `৳ ${Number(line.debit).toLocaleString()}` : "—"}
                      </td>
                      <td className="px-3 py-2.5">
                        {Number(line.credit) ? `৳ ${Number(line.credit).toLocaleString()}` : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
