"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { aclApi } from "../../lib/api";

const REDIRECT_URLS = [
  "/dashboard",
  "/accounting/dashboard",
  "/sales/sales-direct-sales",
  "/pos/poscountercheckin",
  "/inventory/item-stock",
  "/purchase/direct-bills",
];

const PERMISSION_GROUPS = [
  {
    key: "contacts",
    title: "Contacts",
    rows: ["Suppliers", "Supplier Type", "Customers", "Customer Type"],
  },
  {
    key: "items",
    title: "Items",
    rows: [
      "Attribute Set",
      "Brand",
      "Category",
      "Color",
      "Items",
      "Manufacturer",
      "Size Type",
      "Price List",
    ],
  },
  {
    key: "sales",
    title: "Sales",
    rows: [
      "All Invoices",
      "Delivery",
      "Quotation",
      "Order",
      "Return",
      "Payment",
      "Direct Invoice",
      "Batch Payment",
      "Customer Debit",
      "Refund",
    ],
  },
  {
    key: "purchases",
    title: "Purchases",
    rows: [
      "All Bills",
      "Payment",
      "Direct Bill",
      "Order",
      "Receipt",
      "Requisition",
      "Return",
      "Batch Payment",
      "Supplier Credit",
      "Refund",
    ],
  },
  {
    key: "inventory",
    title: "Inventory",
    rows: ["Stock Adjustment", "Stock Movement", "Item Stock Summary", "Receivable Stock", "Warehouse Access"],
  },
  {
    key: "accounting",
    title: "Accounting",
    rows: ["Chart Of Account", "Incomes", "Expenses", "Journals", "Internal Transfer", "Recurring Journals"],
  },
  {
    key: "pos",
    title: "Point Of Sale",
    rows: ["Outlet", "Counter", "Orders", "Barcode", "Outlet Access"],
  },
  {
    key: "hrm",
    title: "HR & Payroll",
    rows: ["Employees", "Attendance", "Payroll", "Leave", "Holidays"],
  },
  {
    key: "acl",
    title: "Permission Management",
    rows: ["Role", "User"],
  },
];

const ACTIONS = ["view", "create", "update", "delete"];

function emptyPerms() {
  const out = {};
  PERMISSION_GROUPS.forEach((g) => {
    out[g.key] = {};
    g.rows.forEach((row) => {
      out[g.key][row] = { view: false, create: false, update: false, delete: false };
    });
  });
  return out;
}

function FieldLabel({ children, required }) {
  return (
    <label className="mb-1.5 block text-[13px] font-medium text-[#1a557a]">
      {children}
      {required && <span className="text-red-500"> *</span>}
    </label>
  );
}

export default function AclRoleFormPage({ config }) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    redirectUrl: "",
    description: "",
  });
  const [perms, setPerms] = useState(emptyPerms);

  const backHref = config?.backHref || "/en/acl/role/index";
  const canSave = useMemo(
    () => Boolean(String(form.name || "").trim() && form.redirectUrl) && !saving,
    [form, saving]
  );

  const toggle = (groupKey, row, action) => {
    setPerms((prev) => ({
      ...prev,
      [groupKey]: {
        ...prev[groupKey],
        [row]: {
          ...prev[groupKey][row],
          [action]: !prev[groupKey][row][action],
        },
      },
    }));
  };

  const toggleGroup = (group) => {
    const allOn = group.rows.every((row) =>
      ACTIONS.every((a) => perms[group.key][row][a])
    );
    setPerms((prev) => {
      const next = { ...prev, [group.key]: { ...prev[group.key] } };
      group.rows.forEach((row) => {
        next[group.key][row] = Object.fromEntries(ACTIONS.map((a) => [a, !allOn]));
      });
      return next;
    });
  };

  const onSave = async () => {
    if (!canSave) return;
    setSaving(true);
    setError("");
    try {
      await aclApi.createRole({
        name: form.name.trim(),
        redirect_url: form.redirectUrl,
        description: form.description || null,
        permissions: perms,
      });
      router.push(backHref);
    } catch (err) {
      setError(err.message || "Failed to save role");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h1 className="m-0 text-[22px] font-semibold text-[#2c3e50]">
          {config?.title || "Create Role"}
        </h1>
        <Link href={backHref} className="text-[18px] text-slate-400 hover:text-slate-600" aria-label="Close">
          ×
        </Link>
      </div>

      {error && (
        <div className="mb-3 rounded border border-red-200 bg-red-50 px-3 py-2 text-[13px] text-red-700">
          {error}
        </div>
      )}

      <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-5 grid gap-4 md:grid-cols-2">
          <div>
            <FieldLabel required>Name</FieldLabel>
            <input
              value={form.name}
              onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
              placeholder="Enter Role Name"
              className="h-10 w-full rounded border border-slate-200 px-3 text-[13px] outline-none focus:border-[#00a78b]"
            />
          </div>
          <div>
            <FieldLabel required>Redirect Url</FieldLabel>
            <select
              value={form.redirectUrl}
              onChange={(e) => setForm((p) => ({ ...p, redirectUrl: e.target.value }))}
              className="h-10 w-full rounded border border-slate-200 px-3 text-[13px] outline-none focus:border-[#00a78b]"
            >
              <option value="">Select Redirect URL</option>
              {REDIRECT_URLS.map((u) => (
                <option key={u} value={u}>
                  {u}
                </option>
              ))}
            </select>
          </div>
          <div className="md:col-span-2">
            <FieldLabel>Description</FieldLabel>
            <textarea
              value={form.description}
              onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
              placeholder="Write description about this Role"
              rows={4}
              className="w-full rounded border border-slate-200 px-3 py-2 text-[13px] outline-none focus:border-[#00a78b]"
            />
          </div>
        </div>

        <div className="space-y-4">
          {PERMISSION_GROUPS.map((group) => (
            <div key={group.key} className="overflow-hidden rounded border border-slate-200">
              <div className="flex items-center gap-2 bg-[#d9ebf7] px-3 py-2">
                <input
                  type="checkbox"
                  className="accent-[#00a78b]"
                  checked={group.rows.every((row) =>
                    ACTIONS.every((a) => perms[group.key][row][a])
                  )}
                  onChange={() => toggleGroup(group)}
                />
                <span className="text-[13px] font-semibold text-[#1a557a]">{group.title}</span>
              </div>
              <div className="overflow-x-auto">
                <table className="min-w-full text-left text-[13px]">
                  <thead className="bg-slate-50 text-[11px] uppercase text-slate-500">
                    <tr>
                      <th className="px-3 py-2">Permission</th>
                      {ACTIONS.map((a) => (
                        <th key={a} className="px-3 py-2 text-center capitalize">
                          {a}
                        </th>
                      ))}
                      <th className="px-3 py-2 text-center">More</th>
                    </tr>
                  </thead>
                  <tbody>
                    {group.rows.map((row) => (
                      <tr key={row} className="border-t border-slate-100">
                        <td className="px-3 py-2">{row}</td>
                        {ACTIONS.map((a) => (
                          <td key={a} className="px-3 py-2 text-center">
                            <input
                              type="checkbox"
                              className="accent-[#00a78b]"
                              checked={perms[group.key][row][a]}
                              onChange={() => toggle(group.key, row, a)}
                            />
                          </td>
                        ))}
                        <td className="px-3 py-2 text-center text-[12px] text-[#00a78b]">
                          More Permissions
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <Link
            href={backHref}
            className="inline-flex h-9 items-center rounded border border-[#00a78b] bg-white px-4 text-[13px] font-medium text-[#00a78b]"
          >
            Cancel
          </Link>
          <button
            type="button"
            disabled={!canSave}
            onClick={onSave}
            className="inline-flex h-9 items-center rounded bg-[#00a78b] px-4 text-[13px] font-medium text-white disabled:bg-slate-300"
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
