"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

const WAREHOUSES = ["Food Cart", "Jamalkhan", "Default", "Mirpur", "Main Warehouse"];
const CASH_METHODS = ["Pos Cash", "Cash Jamalkhan", "Bogura Outlet", "Dinajpur Outlet", "Narayanganj outllet", "Cash"];
const BANK_METHODS = ["DBBL Bank", "City Bank", "Brac Bank", "Islami Bank"];
const MOBILE_METHODS = ["Bkash Merchant", "Rocket", "Nagad", "Upay"];

function FieldLabel({ children, required }) {
  return (
    <label className="mb-1.5 block text-[13px] font-medium text-[#1a557a]">
      {children}
      {required && <span className="text-red-500"> *</span>}
    </label>
  );
}

function TextInput({ className = "", ...props }) {
  return (
    <input
      {...props}
      className={`h-10 w-full rounded border border-slate-200 bg-white px-3 text-[13px] text-slate-700 outline-none placeholder:text-slate-400 focus:border-[#2980b9] ${className}`}
    />
  );
}

function SelectInput({ options = [], placeholder, value, onChange, disabled }) {
  return (
    <select
      value={value}
      disabled={disabled}
      onChange={(e) => onChange(e.target.value)}
      className="h-10 w-full rounded border border-slate-200 bg-white px-3 text-[13px] text-slate-700 outline-none focus:border-[#2980b9] disabled:bg-slate-50 disabled:text-slate-400"
    >
      <option value="">{placeholder}</option>
      {options.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
  );
}

function MultiSelect({ options = [], placeholder, value = [], onChange }) {
  const selected = Array.isArray(value) ? value : value ? [value] : [];
  return (
    <div>
      <div className="mb-2 flex min-h-10 flex-wrap items-center gap-1.5 rounded border border-slate-200 bg-white px-2 py-1.5">
        {selected.length === 0 ? (
          <span className="text-[13px] text-slate-400">{placeholder}</span>
        ) : (
          selected.map((item) => (
            <span
              key={item}
              className="inline-flex items-center gap-1 rounded bg-[#eaf4fb] px-2 py-0.5 text-[12px] text-[#2980b9]"
            >
              {item}
              <button
                type="button"
                aria-label={`Remove ${item}`}
                onClick={() => onChange(selected.filter((x) => x !== item))}
                className="text-[#2980b9] hover:text-red-500"
              >
                ×
              </button>
            </span>
          ))
        )}
      </div>
      <select
        value=""
        onChange={(e) => {
          const v = e.target.value;
          if (v && !selected.includes(v)) onChange([...selected, v]);
        }}
        className="h-10 w-full rounded border border-slate-200 bg-white px-3 text-[13px] outline-none focus:border-[#2980b9]"
      >
        <option value="">{placeholder}</option>
        {options
          .filter((o) => !selected.includes(o))
          .map((o) => (
            <option key={o} value={o}>
              {o}
            </option>
          ))}
      </select>
    </div>
  );
}

function ToggleRow({ label, checked, onChange }) {
  return (
    <label className="inline-flex cursor-pointer items-center gap-3 text-[13px] font-medium text-[#1a557a]">
      <span>{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative h-6 w-11 rounded-full transition-colors ${
          checked ? "bg-[#2980b9]" : "bg-slate-300"
        }`}
      >
        <span
          className={`absolute top-0.5 left-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-white text-[10px] text-[#2980b9] shadow transition-transform ${
            checked ? "translate-x-5" : ""
          }`}
        >
          {checked ? "✓" : ""}
        </span>
      </button>
    </label>
  );
}

export default function OutletFormPage({ config }) {
  const isEdit = config?.formMode === "edit";
  const backHref = config?.backHref || "/en/pos/outlets";
  const initial = config?.initialValues || {};

  const [form, setForm] = useState({
    name: initial.name || "",
    number: initial.number || "",
    address: initial.address || "",
    warehouse: initial.warehouse || "",
    cash_account: initial.cash_account || "",
    add_banking: Boolean(initial.add_banking),
    banking_methods: initial.banking_methods || [],
    add_mobile_banking: Boolean(
      initial.add_mobile_banking ??
        (Array.isArray(initial.mobile_banking) && initial.mobile_banking.length > 0)
    ),
    mobile_banking: initial.mobile_banking || [],
  });
  const [saved, setSaved] = useState(false);

  const set = (key) => (val) => setForm((prev) => ({ ...prev, [key]: val }));

  const canSave = useMemo(() => {
    if (!form.name.trim() || !form.warehouse || !form.cash_account) return false;
    if (form.add_mobile_banking && (!form.mobile_banking || form.mobile_banking.length === 0))
      return false;
    if (form.add_banking && (!form.banking_methods || form.banking_methods.length === 0))
      return false;
    return true;
  }, [form]);

  if (saved) {
    return (
      <div className="rounded-lg border border-green-200 bg-green-50 p-8 text-center text-green-700">
        Outlet saved successfully (demo).{" "}
        <Link href={backHref} className="font-semibold underline">
          Back to POS Outlets
        </Link>
      </div>
    );
  }

  return (
    <div className="pb-8 text-[#1a557a]">
      <div className="overflow-hidden rounded-lg border border-[#e5e7eb] bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-3">
          <h1 className="m-0 text-[20px] font-semibold text-[#1a557a]">
            {isEdit ? "Edit POS Outlet" : "Add POS Outlet"}
          </h1>
          <Link
            href={backHref}
            className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            aria-label="Close"
          >
            <span className="material-icons text-[22px]">close</span>
          </Link>
        </div>

        <div className="space-y-5 px-5 py-5">
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <FieldLabel required>Name</FieldLabel>
              <TextInput
                value={form.name}
                onChange={(e) => set("name")(e.target.value)}
                placeholder="Enter Outlet Name"
              />
            </div>
            <div>
              <FieldLabel>Hotline Number</FieldLabel>
              <TextInput
                type="tel"
                value={form.number}
                onChange={(e) => set("number")(e.target.value)}
                placeholder="Enter Hotline Number"
              />
            </div>
            <div>
              <FieldLabel>Address</FieldLabel>
              <TextInput
                value={form.address}
                onChange={(e) => set("address")(e.target.value)}
                placeholder="Enter address"
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <FieldLabel required>Warehouse</FieldLabel>
              <SelectInput
                options={WAREHOUSES}
                placeholder="Select Warehouse"
                value={form.warehouse}
                onChange={set("warehouse")}
              />
            </div>
            <div>
              <FieldLabel required>Cash Method</FieldLabel>
              <SelectInput
                options={CASH_METHODS}
                placeholder="Select Cash Method"
                value={form.cash_account}
                onChange={set("cash_account")}
                disabled={isEdit}
              />
              <p className="mt-1.5 mb-0 text-[12px] leading-relaxed text-slate-500">
                You can&apos;t select a cash method that&apos;s already chosen for another outlet.
                If no cash method is available, please create a new one first.
              </p>
            </div>
          </div>

          <div className="space-y-4 border-t border-slate-100 pt-4">
            <ToggleRow
              label="Add Banking Method"
              checked={form.add_banking}
              onChange={set("add_banking")}
            />
            {form.add_banking && (
              <div className="max-w-xl">
                <FieldLabel required>Banking Method</FieldLabel>
                <MultiSelect
                  options={BANK_METHODS}
                  placeholder="Select Banking Method"
                  value={form.banking_methods}
                  onChange={set("banking_methods")}
                />
              </div>
            )}

            <ToggleRow
              label="Add Mobile Banking Method"
              checked={form.add_mobile_banking}
              onChange={set("add_mobile_banking")}
            />
            {form.add_mobile_banking && (
              <div className="max-w-xl">
                <FieldLabel required>Mobile Banking Method</FieldLabel>
                <MultiSelect
                  options={MOBILE_METHODS}
                  placeholder="Select Mobile Banking Method"
                  value={form.mobile_banking}
                  onChange={set("mobile_banking")}
                />
                <p className="mt-1.5 mb-0 text-[12px] text-slate-500">
                  You can select multiple mobile banking methods.
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end gap-2 border-t border-slate-200 px-5 py-3">
          <Link
            href={backHref}
            className="inline-flex h-9 items-center rounded border border-[#2980b9] bg-white px-5 text-[13px] font-medium text-[#2980b9] hover:bg-[#f0f7fb]"
          >
            Cancel
          </Link>
          <button
            type="button"
            disabled={!canSave}
            onClick={() => setSaved(true)}
            className="h-9 rounded bg-[#2980b9] px-5 text-[13px] font-medium text-white hover:bg-[#2472a4] disabled:cursor-not-allowed disabled:opacity-50"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
