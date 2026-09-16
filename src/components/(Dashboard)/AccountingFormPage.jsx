"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { accountingApi, unwrapApiData } from "../../lib/api";

const ACCOUNT_TYPES = [
  { id: "expense", label: "Expense" },
  { id: "income", label: "Income" },
  { id: "equity", label: "Owner's Equity" },
  { id: "liabilities", label: "Liabilities" },
  { id: "asset", label: "Asset" },
];

const RECURRING_INTERVALS = [
  "1 Days",
  "5 Days",
  "1 Weeks",
  "2 Weeks",
  "1 Months",
  "3 Months",
  "6 Months",
  "1 Years",
];

const RESOURCE = {
  journal: accountingApi.journal,
  expense: accountingApi.expense,
  income: accountingApi.income,
  transfer: accountingApi.transfer,
  recurring: accountingApi.recurringJournal,
};

function FieldLabel({ children, required }) {
  return (
    <label className="mb-1.5 block text-[13px] font-medium text-[#1a557a]">
      {children}
      {required && <span className="text-red-500"> *</span>}
    </label>
  );
}

function TextInput(props) {
  return (
    <input
      {...props}
      className={`h-10 w-full rounded border border-slate-200 bg-white px-3 text-[13px] text-slate-700 outline-none placeholder:text-slate-400 focus:border-[#00a78b] ${props.className || ""}`}
    />
  );
}

function SelectInput({ options = [], placeholder, value, onChange, optionValue = "id", optionLabel = "name" }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="h-10 w-full rounded border border-slate-200 bg-white px-3 text-[13px] text-slate-700 outline-none focus:border-[#00a78b]"
    >
      <option value="">{placeholder || "Select..."}</option>
      {options.map((o) => {
        const val = typeof o === "object" ? o[optionValue] : o;
        const label = typeof o === "object" ? o[optionLabel] : o;
        return (
          <option key={val} value={val}>
            {label}
          </option>
        );
      })}
    </select>
  );
}

function flattenAccountsResponse(res) {
  const data = res?.data || {};
  const flat = [];
  for (const [type, groups] of Object.entries(data)) {
    for (const group of groups || []) {
      for (const acc of group.accounts || []) {
        flat.push({
          id: acc.id,
          name: acc.name,
          code: acc.code,
          type,
          group_name: group.name,
          label: acc.code ? `${acc.code} — ${acc.name}` : acc.name,
        });
      }
    }
  }
  return flat.sort((a, b) => a.name.localeCompare(b.name));
}

function groupNamesForType(res, type) {
  const groups = res?.data?.[type] || [];
  return groups.map((g) => g.name);
}

function emptyJournalLine() {
  return { id: Date.now() + Math.random(), account_id: "", debit: "", credit: "" };
}

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function nowTime() {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

export default function AccountingFormPage({ config }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const kind = config?.accountingForm || "journal";
  const editId = searchParams.get("id");
  const isEdit = Boolean(editId);
  const backHref = config?.backHref || "/en/accounting/dashboard";
  const api = RESOURCE[kind];

  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [journalForm, setJournalForm] = useState({
    entry_date: todayISO(),
    description: "",
  });
  const [journalLines, setJournalLines] = useState([emptyJournalLine(), emptyJournalLine()]);

  const [entryForm, setEntryForm] = useState({
    entry_date: todayISO(),
    entry_time: nowTime(),
    description: "",
    account_id: "",
    from_account_id: "",
    to_account_id: "",
    amount: "",
  });

  const [recurringForm, setRecurringForm] = useState({
    start_date: todayISO(),
    account_type: "expense",
    debit_account_id: "",
    credit_account_id: "",
    amount: "",
    recurring_interval: "1 Months",
    approval_status: "Approve",
    operational_status: "Active",
  });

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    Promise.all([
      accountingApi.accounts(),
      isEdit && api ? api.get(editId) : Promise.resolve(null),
    ])
      .then(([accRes, recordRes]) => {
        if (cancelled) return;
        setAccounts(flattenAccountsResponse(accRes));
        const record = recordRes ? unwrapApiData(recordRes) : null;
        if (!record) return;

        if (kind === "journal") {
          setJournalForm({
            entry_date: record.entry_date || todayISO(),
            description: record.description || "",
          });
          setJournalLines(
            (record.lines || []).length
              ? record.lines.map((l) => ({
                  id: l.id || Date.now() + Math.random(),
                  account_id: String(l.account_id || ""),
                  debit: l.debit != null ? String(l.debit) : "",
                  credit: l.credit != null ? String(l.credit) : "",
                }))
              : [emptyJournalLine(), emptyJournalLine()]
          );
        } else if (kind === "recurring") {
          setRecurringForm({
            start_date: record.start_date || todayISO(),
            account_type: record.account_type || "expense",
            debit_account_id: String(record.debit_account_id || ""),
            credit_account_id: String(record.credit_account_id || ""),
            amount: record.amount != null ? String(record.amount) : "",
            recurring_interval: record.recurring_interval || "1 Months",
            approval_status: record.approval_status || "Approve",
            operational_status: record.operational_status || "Active",
          });
        } else {
          setEntryForm({
            entry_date: record.entry_date || todayISO(),
            entry_time: record.entry_time?.slice?.(0, 5) || record.entry_time || nowTime(),
            description: record.description || "",
            account_id: String(record.account_id || record.from_account_id || ""),
            from_account_id: String(record.from_account_id || ""),
            to_account_id: String(record.to_account_id || ""),
            amount: record.amount != null ? String(record.amount) : "",
          });
        }
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || "Failed to load form");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [kind, editId, isEdit, api]);

  const journalTotals = useMemo(() => {
    const totalDebit = journalLines.reduce((s, l) => s + (Number(l.debit) || 0), 0);
    const totalCredit = journalLines.reduce((s, l) => s + (Number(l.credit) || 0), 0);
    return { totalDebit, totalCredit, difference: totalDebit - totalCredit };
  }, [journalLines]);

  const filteredAccounts = useMemo(() => {
    if (kind !== "recurring" || !recurringForm.account_type) return accounts;
    const t = recurringForm.account_type.toLowerCase();
    return accounts.filter((a) => a.type === t || a.type === recurringForm.account_type);
  }, [accounts, kind, recurringForm.account_type]);

  const updateJournalLine = (id, key, value) => {
    setJournalLines((prev) => prev.map((l) => (l.id === id ? { ...l, [key]: value } : l)));
  };

  const saveJournal = async (status) => {
    if (!journalForm.entry_date || !journalForm.description?.trim()) {
      setError("Date and description are required.");
      return;
    }
    const lines = journalLines
      .filter((l) => l.account_id && (Number(l.debit) || Number(l.credit)))
      .map((l) => ({
        account_id: Number(l.account_id),
        debit: Number(l.debit) || 0,
        credit: Number(l.credit) || 0,
      }));
    if (!lines.length) {
      setError("Add at least one journal line.");
      return;
    }
    if (status === "Approved" && Math.abs(journalTotals.difference) > 0.001) {
      setError("Debit and credit totals must balance before approval.");
      return;
    }

    setSaving(true);
    setError("");
    try {
      const body = {
        entry_date: journalForm.entry_date,
        description: journalForm.description.trim(),
        lines,
      };
      let id = editId;
      if (isEdit) {
        await api.update(editId, body);
      } else {
        const res = await api.create(body);
        id = unwrapApiData(res)?.id;
      }
      if (status === "Approved" && id) {
        await api.setStatus(id, "Approved");
      }
      router.push(backHref);
    } catch (err) {
      setError(err.message || "Failed to save journal");
    } finally {
      setSaving(false);
    }
  };

  const saveEntry = async (status) => {
    if (!entryForm.entry_date || !entryForm.amount) {
      setError("Date and amount are required.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const body = {
        entry_date: entryForm.entry_date,
        entry_time: entryForm.entry_time || null,
        description: entryForm.description?.trim() || null,
        amount: Number(entryForm.amount),
        status,
      };
      if (kind === "expense") body.account_id = entryForm.account_id ? Number(entryForm.account_id) : null;
      if (kind === "income") body.account_id = entryForm.account_id ? Number(entryForm.account_id) : null;
      if (kind === "transfer") {
        body.from_account_id = entryForm.from_account_id ? Number(entryForm.from_account_id) : null;
        body.to_account_id = entryForm.to_account_id ? Number(entryForm.to_account_id) : null;
      }
      if (isEdit) await api.update(editId, body);
      else await api.create(body);
      router.push(backHref);
    } catch (err) {
      setError(err.message || "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const saveRecurring = async () => {
    if (!recurringForm.start_date || !recurringForm.amount) {
      setError("Start date and amount are required.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const body = {
        start_date: recurringForm.start_date,
        account_type: recurringForm.account_type,
        debit_account_id: recurringForm.debit_account_id ? Number(recurringForm.debit_account_id) : null,
        credit_account_id: recurringForm.credit_account_id ? Number(recurringForm.credit_account_id) : null,
        amount: Number(recurringForm.amount),
        recurring_interval: recurringForm.recurring_interval,
        approval_status: recurringForm.approval_status,
        operational_status: recurringForm.operational_status,
      };
      if (isEdit) await api.update(editId, body);
      else await api.create(body);
      router.push(backHref);
    } catch (err) {
      setError(err.message || "Failed to save recurring journal");
    } finally {
      setSaving(false);
    }
  };

  const title = isEdit
    ? config?.editTitle ||
      (config?.title || "").replace(/^(Add |Create )/, "Edit ") ||
      "Edit Entry"
    : config?.title || "Create Entry";

  if (loading) {
    return (
      <div className="rounded-lg border border-slate-200 bg-white p-10 text-center text-slate-500">
        Loading…
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-[#e5e7eb] bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
        <h1 className="m-0 text-[20px] font-semibold text-[#1a557a]">{title}</h1>
        <Link href={backHref} className="rounded p-1 text-slate-500 hover:bg-slate-100" aria-label="Close">
          <span className="material-icons text-[22px]">close</span>
        </Link>
      </div>

      <div className="space-y-6 px-5 py-5">
        {error && (
          <div className="rounded border border-red-200 bg-red-50 px-3 py-2 text-[13px] text-red-700">
            {error}
          </div>
        )}

        {kind === "journal" && (
          <>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <FieldLabel required>Date</FieldLabel>
                <TextInput
                  type="date"
                  value={journalForm.entry_date}
                  onChange={(e) => setJournalForm((p) => ({ ...p, entry_date: e.target.value }))}
                />
              </div>
              <div className="sm:col-span-2">
                <FieldLabel required>Description</FieldLabel>
                <TextInput
                  value={journalForm.description}
                  onChange={(e) => setJournalForm((p) => ({ ...p, description: e.target.value }))}
                  placeholder="Journal description"
                />
              </div>
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between">
                <span className="text-[13px] font-semibold uppercase tracking-wide text-[#1a557a]">
                  Journal Lines
                </span>
                <button
                  type="button"
                  onClick={() => setJournalLines((p) => [...p, emptyJournalLine()])}
                  className="text-[13px] font-medium text-[#00a78b] hover:underline"
                >
                  Add Line
                </button>
              </div>
              <div className="overflow-x-auto rounded border border-[#e5e7eb]">
                <table className="w-full min-w-[640px] text-left text-[13px]">
                  <thead className="bg-[#e8f1f8] text-[11px] font-semibold uppercase text-[#1a557a]">
                    <tr>
                      <th className="px-3 py-2.5">Account</th>
                      <th className="px-3 py-2.5 w-36">Debit</th>
                      <th className="px-3 py-2.5 w-36">Credit</th>
                      <th className="w-10" />
                    </tr>
                  </thead>
                  <tbody>
                    {journalLines.map((line) => (
                      <tr key={line.id} className="border-t border-[#eef1f4]">
                        <td className="px-3 py-2">
                          <SelectInput
                            options={accounts}
                            optionValue="id"
                            optionLabel="label"
                            placeholder="Select account"
                            value={line.account_id}
                            onChange={(v) => updateJournalLine(line.id, "account_id", v)}
                          />
                        </td>
                        <td className="px-3 py-2">
                          <TextInput
                            type="number"
                            min="0"
                            step="0.01"
                            value={line.debit}
                            onChange={(e) => updateJournalLine(line.id, "debit", e.target.value)}
                          />
                        </td>
                        <td className="px-3 py-2">
                          <TextInput
                            type="number"
                            min="0"
                            step="0.01"
                            value={line.credit}
                            onChange={(e) => updateJournalLine(line.id, "credit", e.target.value)}
                          />
                        </td>
                        <td className="px-2 py-2">
                          <button
                            type="button"
                            onClick={() =>
                              setJournalLines((p) =>
                                p.length > 1 ? p.filter((l) => l.id !== line.id) : p
                              )
                            }
                            className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-red-500"
                            aria-label="Remove line"
                          >
                            <i className="fas fa-times text-[12px]" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="mt-3 flex flex-wrap justify-end gap-6 text-[13px] text-[#1a557a]">
                <span>
                  Total Debit: <strong>৳ {journalTotals.totalDebit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
                </span>
                <span>
                  Total Credit: <strong>৳ {journalTotals.totalCredit.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
                </span>
                <span className={Math.abs(journalTotals.difference) > 0.001 ? "text-red-600" : ""}>
                  Difference: <strong>৳ {journalTotals.difference.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</strong>
                </span>
              </div>
            </div>

            <div className="flex flex-wrap justify-end gap-2 border-t border-slate-100 pt-4">
              <Link
                href={backHref}
                className="inline-flex h-10 items-center rounded border border-slate-300 bg-white px-4 text-[13px] font-medium text-[#1a557a] hover:bg-slate-50"
              >
                Cancel
              </Link>
              <button
                type="button"
                disabled={saving}
                onClick={() => saveJournal("Draft")}
                className="inline-flex h-10 items-center rounded border border-[#00a78b] bg-white px-4 text-[13px] font-medium text-[#00a78b] hover:bg-[#e8f1f8] disabled:opacity-50"
              >
                Save As Draft
              </button>
              <button
                type="button"
                disabled={saving}
                onClick={() => saveJournal("Approved")}
                className="inline-flex h-10 items-center rounded bg-[#00a78b] px-4 text-[13px] font-medium text-white hover:bg-[#008f77] disabled:opacity-50"
              >
                Save As Approved
              </button>
            </div>
          </>
        )}

        {(kind === "expense" || kind === "income" || kind === "transfer") && (
          <>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div>
                <FieldLabel required>Date</FieldLabel>
                <TextInput
                  type="date"
                  value={entryForm.entry_date}
                  onChange={(e) => setEntryForm((p) => ({ ...p, entry_date: e.target.value }))}
                />
              </div>
              <div>
                <FieldLabel>Time</FieldLabel>
                <TextInput
                  type="time"
                  value={entryForm.entry_time}
                  onChange={(e) => setEntryForm((p) => ({ ...p, entry_time: e.target.value }))}
                />
              </div>
              <div className="sm:col-span-2 lg:col-span-3">
                <FieldLabel>Description</FieldLabel>
                <TextInput
                  value={entryForm.description}
                  onChange={(e) => setEntryForm((p) => ({ ...p, description: e.target.value }))}
                  placeholder="Description"
                />
              </div>
              {kind === "expense" && (
                <div>
                  <FieldLabel>Expense From</FieldLabel>
                  <SelectInput
                    options={accounts}
                    optionValue="id"
                    optionLabel="label"
                    placeholder="Select account"
                    value={entryForm.account_id}
                    onChange={(v) => setEntryForm((p) => ({ ...p, account_id: v }))}
                  />
                </div>
              )}
              {kind === "income" && (
                <div>
                  <FieldLabel>Income To</FieldLabel>
                  <SelectInput
                    options={accounts}
                    optionValue="id"
                    optionLabel="label"
                    placeholder="Select account"
                    value={entryForm.account_id}
                    onChange={(v) => setEntryForm((p) => ({ ...p, account_id: v }))}
                  />
                </div>
              )}
              {kind === "transfer" && (
                <>
                  <div>
                    <FieldLabel>From Account</FieldLabel>
                    <SelectInput
                      options={accounts}
                      optionValue="id"
                      optionLabel="label"
                      placeholder="Select account"
                      value={entryForm.from_account_id}
                      onChange={(v) => setEntryForm((p) => ({ ...p, from_account_id: v }))}
                    />
                  </div>
                  <div>
                    <FieldLabel>To Account</FieldLabel>
                    <SelectInput
                      options={accounts}
                      optionValue="id"
                      optionLabel="label"
                      placeholder="Select account"
                      value={entryForm.to_account_id}
                      onChange={(v) => setEntryForm((p) => ({ ...p, to_account_id: v }))}
                    />
                  </div>
                </>
              )}
              <div>
                <FieldLabel required>Amount</FieldLabel>
                <TextInput
                  type="number"
                  min="0"
                  step="0.01"
                  value={entryForm.amount}
                  onChange={(e) => setEntryForm((p) => ({ ...p, amount: e.target.value }))}
                  placeholder="0.00"
                />
              </div>
            </div>

            <div className="flex flex-wrap justify-end gap-2 border-t border-slate-100 pt-4">
              <Link
                href={backHref}
                className="inline-flex h-10 items-center rounded border border-slate-300 bg-white px-4 text-[13px] font-medium text-[#1a557a] hover:bg-slate-50"
              >
                Cancel
              </Link>
              <button
                type="button"
                disabled={saving}
                onClick={() => saveEntry("Draft")}
                className="inline-flex h-10 items-center rounded border border-[#00a78b] bg-white px-4 text-[13px] font-medium text-[#00a78b] hover:bg-[#e8f1f8] disabled:opacity-50"
              >
                Save Draft
              </button>
              <button
                type="button"
                disabled={saving}
                onClick={() => saveEntry("Approved")}
                className="inline-flex h-10 items-center rounded bg-[#00a78b] px-4 text-[13px] font-medium text-white hover:bg-[#008f77] disabled:opacity-50"
              >
                Approve
              </button>
            </div>
          </>
        )}

        {kind === "recurring" && (
          <>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div>
                <FieldLabel required>Start Date</FieldLabel>
                <TextInput
                  type="date"
                  value={recurringForm.start_date}
                  onChange={(e) => setRecurringForm((p) => ({ ...p, start_date: e.target.value }))}
                />
              </div>
              <div>
                <FieldLabel>Account Type</FieldLabel>
                <SelectInput
                  options={ACCOUNT_TYPES}
                  optionValue="id"
                  optionLabel="label"
                  placeholder="Select type"
                  value={recurringForm.account_type}
                  onChange={(v) =>
                    setRecurringForm((p) => ({
                      ...p,
                      account_type: v,
                      debit_account_id: "",
                      credit_account_id: "",
                    }))
                  }
                />
              </div>
              <div>
                <FieldLabel>Debit Account</FieldLabel>
                <SelectInput
                  options={filteredAccounts}
                  optionValue="id"
                  optionLabel="label"
                  placeholder="Select account"
                  value={recurringForm.debit_account_id}
                  onChange={(v) => setRecurringForm((p) => ({ ...p, debit_account_id: v }))}
                />
              </div>
              <div>
                <FieldLabel>Credit Account</FieldLabel>
                <SelectInput
                  options={filteredAccounts}
                  optionValue="id"
                  optionLabel="label"
                  placeholder="Select account"
                  value={recurringForm.credit_account_id}
                  onChange={(v) => setRecurringForm((p) => ({ ...p, credit_account_id: v }))}
                />
              </div>
              <div>
                <FieldLabel required>Amount</FieldLabel>
                <TextInput
                  type="number"
                  min="0"
                  step="0.01"
                  value={recurringForm.amount}
                  onChange={(e) => setRecurringForm((p) => ({ ...p, amount: e.target.value }))}
                />
              </div>
              <div>
                <FieldLabel>Interval</FieldLabel>
                <SelectInput
                  options={RECURRING_INTERVALS}
                  placeholder="Select interval"
                  value={recurringForm.recurring_interval}
                  onChange={(v) => setRecurringForm((p) => ({ ...p, recurring_interval: v }))}
                />
              </div>
            </div>

            <div className="flex flex-wrap justify-end gap-2 border-t border-slate-100 pt-4">
              <Link
                href={backHref}
                className="inline-flex h-10 items-center rounded border border-slate-300 bg-white px-4 text-[13px] font-medium text-[#1a557a] hover:bg-slate-50"
              >
                Cancel
              </Link>
              <button
                type="button"
                disabled={saving}
                onClick={saveRecurring}
                className="inline-flex h-10 items-center rounded bg-[#00a78b] px-4 text-[13px] font-medium text-white hover:bg-[#008f77] disabled:opacity-50"
              >
                Save
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
