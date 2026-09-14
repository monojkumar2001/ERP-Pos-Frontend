"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

const CUSTOMERS = ["karim saheb", "Rahim", "Masud Rahman", "Walk-in Customer", "Bestu Store"];
const SALES_PERSONS = ["Demo (demo@biznify.com.bd)", "Monoj", "Admin"];
const PRICE_LISTS = ["Default", "Wholesale", "Retail"];
const ITEMS = ["Paper A4", "Bag", "Notebook", "Pen Set", "Stapler"];
const UNITS = ["pc", "kg", "box", "dozen"];
const PAYMENT_METHODS = ["Cash", "Bank", "Card", "Mobile Banking"];

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

function SelectInput({ options = [], placeholder, value, onChange, className = "" }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`h-10 w-full rounded border border-slate-200 bg-white px-3 text-[13px] text-slate-700 outline-none focus:border-[#2980b9] ${className}`}
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

function emptyLine() {
  return {
    id: Date.now() + Math.random(),
    item: "",
    unit: "pc",
    quantity: "1",
    price: "0",
    discount: "0",
    vat: "0",
    inventory: "N/A",
  };
}

function lineAmount(line) {
  const qty = Number(line.quantity) || 0;
  const price = Number(line.price) || 0;
  const discount = Number(line.discount) || 0;
  const vat = Number(line.vat) || 0;
  const base = Math.max(0, qty * price - discount);
  return base + vat;
}

export default function TransactionFormPage({ config }) {
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    number: "Auto Generated",
    date: new Date().toISOString().slice(0, 10),
    customer: "",
    salesPerson: SALES_PERSONS[0],
    priceList: "Default",
    description: "",
    notes: "",
    discountPct: "0",
    adjustmentSign: "+",
    adjustment: "0.00",
  });
  const [lines, setLines] = useState([]);
  const [payments, setPayments] = useState([{ id: 1, method: "", amount: "0.00" }]);

  const backHref = config?.backHref || "/en/dashboard";
  const title = config?.title || "Add Transaction";
  const numberLabel = config?.numberLabel || "Number";
  const dateLabel = config?.dateLabel || "Date";
  const showPayment = config?.showPayment !== false;
  const showSalesPerson = config?.showSalesPerson !== false;
  const showPriceList = config?.showPriceList !== false;
  const showValidTill = Boolean(config?.showValidTill);

  const subtotal = useMemo(() => lines.reduce((sum, line) => sum + lineAmount(line), 0), [lines]);
  const discountAmt = useMemo(
    () => (subtotal * (Number(form.discountPct) || 0)) / 100,
    [subtotal, form.discountPct]
  );
  const adjustment = Number(form.adjustment) || 0;
  const adjustmentSigned = form.adjustmentSign === "-" ? -adjustment : adjustment;
  const grandTotal = Math.max(0, subtotal - discountAmt + adjustmentSigned);
  const canSave = Boolean(form.customer && (showSalesPerson ? form.salesPerson : true));

  const setField = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const updateLine = (id, key, value) =>
    setLines((prev) => prev.map((line) => (line.id === id ? { ...line, [key]: value } : line)));

  const onSubmit = (e) => {
    e.preventDefault();
    if (!canSave) return;
    setSaved(true);
  };

  if (saved) {
    return (
      <div className="rounded-lg border border-green-200 bg-green-50 p-6 text-center text-green-700">
        Saved successfully (demo).{" "}
        <Link href={backHref} className="font-semibold underline">
          Back to list
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="rounded-lg border border-[#e5e7eb] bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
        <h1 className="m-0 text-[20px] font-semibold text-[#1a557a]">{title}</h1>
        <Link href={backHref} className="rounded p-1 text-slate-500 hover:bg-slate-100" aria-label="Close">
          <span className="material-icons text-[22px]">close</span>
        </Link>
      </div>

      <div className="space-y-6 px-5 py-5">
        <div className="grid gap-5 lg:grid-cols-[1fr_280px]">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <FieldLabel>{numberLabel}</FieldLabel>
              <TextInput value={form.number} readOnly className="bg-slate-50 text-slate-500" />
            </div>
            <div>
              <FieldLabel>{dateLabel}</FieldLabel>
              <TextInput
                type="date"
                value={form.date}
                onChange={(e) => setField("date", e.target.value)}
              />
            </div>
            {showValidTill && (
              <div>
                <FieldLabel>Valid Till Date</FieldLabel>
                <TextInput
                  type="date"
                  value={form.validTill || ""}
                  onChange={(e) => setField("validTill", e.target.value)}
                />
              </div>
            )}
            <div>
              <FieldLabel required>Customer</FieldLabel>
              <SelectInput
                options={CUSTOMERS}
                placeholder="Select Customer"
                value={form.customer}
                onChange={(v) => setField("customer", v)}
              />
            </div>
            {showSalesPerson && (
              <div>
                <FieldLabel required>Sales Person</FieldLabel>
                <SelectInput
                  options={SALES_PERSONS}
                  placeholder="Select Sales Person"
                  value={form.salesPerson}
                  onChange={(v) => setField("salesPerson", v)}
                />
              </div>
            )}
            {showPriceList && (
              <div>
                <FieldLabel>Price List</FieldLabel>
                <SelectInput
                  options={PRICE_LISTS}
                  placeholder="Select Price List"
                  value={form.priceList}
                  onChange={(v) => setField("priceList", v)}
                />
              </div>
            )}
            <div className="sm:col-span-2">
              <FieldLabel>Description</FieldLabel>
              <textarea
                value={form.description}
                onChange={(e) => setField("description", e.target.value)}
                placeholder="Description"
                rows={3}
                className="w-full rounded border border-slate-200 px-3 py-2 text-[13px] outline-none focus:border-[#2980b9]"
              />
            </div>
          </div>

          <div>
            <FieldLabel>Upload a file</FieldLabel>
            <div className="flex min-h-[220px] flex-col items-center justify-center rounded-lg border-2 border-dashed border-[#9ec4e0] bg-[#f3f9fc] px-4 py-6 text-center">
              <span className="material-icons mb-2 text-[36px] text-[#2980b9]">cloud_upload</span>
              <p className="m-0 text-[13px] text-slate-600">Drag and drop file here</p>
              <p className="my-2 text-[12px] text-slate-400">or</p>
              <button
                type="button"
                className="rounded bg-[#2980b9] px-4 py-2 text-[13px] font-medium text-white hover:bg-[#2472a4]"
              >
                Choose File
              </button>
              <p className="mt-3 mb-0 text-[11px] leading-relaxed text-slate-500">
                Maximum file size 5MB
                <br />
                Supported Formates: DOC, DOCX, XLX, XLSX, PDF, JPG, JPEG, PNG
              </p>
            </div>
          </div>
        </div>

        <div className="overflow-hidden rounded-lg border border-slate-200">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-[12px]">
              <thead className="bg-[#d9ebf7] text-[#1a557a]">
                <tr>
                  {["ITEM *", "UNIT *", "QUANTITY *", "PRICE", "DISCOUNT", "VAT", "AMOUNT", "INVENTORY", ""].map(
                    (h) => (
                      <th key={h || "x"} className="whitespace-nowrap px-3 py-2.5 font-semibold">
                        {h}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {lines.map((line) => (
                  <tr key={line.id} className="border-t border-slate-100">
                    <td className="px-2 py-2 min-w-[160px]">
                      <SelectInput
                        options={ITEMS}
                        placeholder="Select item"
                        value={line.item}
                        onChange={(v) => updateLine(line.id, "item", v)}
                      />
                    </td>
                    <td className="px-2 py-2 min-w-[90px]">
                      <SelectInput
                        options={UNITS}
                        placeholder="Unit"
                        value={line.unit}
                        onChange={(v) => updateLine(line.id, "unit", v)}
                      />
                    </td>
                    <td className="px-2 py-2 min-w-[90px]">
                      <TextInput
                        type="number"
                        value={line.quantity}
                        onChange={(e) => updateLine(line.id, "quantity", e.target.value)}
                      />
                    </td>
                    <td className="px-2 py-2 min-w-[90px]">
                      <TextInput
                        type="number"
                        value={line.price}
                        onChange={(e) => updateLine(line.id, "price", e.target.value)}
                      />
                    </td>
                    <td className="px-2 py-2 min-w-[90px]">
                      <TextInput
                        type="number"
                        value={line.discount}
                        onChange={(e) => updateLine(line.id, "discount", e.target.value)}
                      />
                    </td>
                    <td className="px-2 py-2 min-w-[90px]">
                      <TextInput
                        type="number"
                        value={line.vat}
                        onChange={(e) => updateLine(line.id, "vat", e.target.value)}
                      />
                    </td>
                    <td className="px-3 py-2 whitespace-nowrap text-[13px] text-slate-700">
                      ৳ {lineAmount(line).toLocaleString()}
                    </td>
                    <td className="px-3 py-2 text-slate-500">{line.inventory}</td>
                    <td className="px-2 py-2">
                      <button
                        type="button"
                        onClick={() => setLines((prev) => prev.filter((l) => l.id !== line.id))}
                        className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-red-500"
                        aria-label="Remove item"
                      >
                        <span className="material-icons text-[18px]">close</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="border-t border-slate-100 px-3 py-2">
            <button
              type="button"
              onClick={() => setLines((prev) => [...prev, emptyLine()])}
              className="inline-flex h-8 items-center rounded border border-[#2980b9] bg-white px-3 text-[12px] font-medium text-[#2980b9] hover:bg-[#f0f7fb]"
            >
              Add Item
            </button>
          </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          <div>
            <FieldLabel>Notes/Terms:</FieldLabel>
            <textarea
              value={form.notes}
              onChange={(e) => setField("notes", e.target.value)}
              placeholder="Write if you have any notes or terms."
              rows={8}
              className="w-full rounded border border-slate-200 px-3 py-2 text-[13px] outline-none focus:border-[#2980b9]"
            />
          </div>

          <div className="rounded-lg bg-[#f3f9fc] p-4">
            <div className="mb-3 flex items-center justify-between text-[13px]">
              <span className="text-[#1a557a]">Subtotal</span>
              <span className="font-medium text-slate-700">৳ {subtotal.toLocaleString()}</span>
            </div>
            <div className="mb-3 flex items-center justify-between gap-2 text-[13px]">
              <span className="text-[#1a557a]">Discount</span>
              <div className="flex items-center gap-2">
                <TextInput
                  type="number"
                  value={form.discountPct}
                  onChange={(e) => setField("discountPct", e.target.value)}
                  className="!h-8 w-20"
                />
                <span className="text-slate-500">%</span>
                <span className="min-w-[70px] text-right text-slate-700">
                  - ৳ {discountAmt.toLocaleString()}
                </span>
              </div>
            </div>
            <button
              type="button"
              className="mb-3 inline-flex h-8 items-center rounded border border-[#2980b9] bg-white px-3 text-[12px] font-medium text-[#2980b9] hover:bg-[#f0f7fb]"
            >
              Add Additional Charge
            </button>
            <div className="mb-3 flex items-center justify-between gap-2 text-[13px]">
              <span className="text-[#1a557a]">Adjustment Amount</span>
              <div className="flex items-center gap-2">
                <SelectInput
                  options={["+", "-"]}
                  value={form.adjustmentSign}
                  onChange={(v) => setField("adjustmentSign", v || "+")}
                  className="!h-8 !w-14"
                  placeholder=""
                />
                <TextInput
                  type="number"
                  value={form.adjustment}
                  onChange={(e) => setField("adjustment", e.target.value)}
                  className="!h-8 w-24"
                />
              </div>
            </div>
            <div className="mb-4 flex items-center justify-between border-t border-[#cfe3f1] pt-3 text-[15px] font-semibold text-[#1a557a]">
              <span>Grand Total</span>
              <span>৳ {grandTotal.toLocaleString()}</span>
            </div>

            {showPayment && (
              <div>
                <div className="mb-2 text-[13px] font-medium text-[#1a557a]">Payment Method</div>
                {payments.map((p) => (
                  <div key={p.id} className="mb-2 flex gap-2">
                    <SelectInput
                      options={PAYMENT_METHODS}
                      placeholder="Payment Method"
                      value={p.method}
                      onChange={(v) =>
                        setPayments((prev) =>
                          prev.map((row) => (row.id === p.id ? { ...row, method: v } : row))
                        )
                      }
                    />
                    <TextInput
                      type="number"
                      value={p.amount}
                      onChange={(e) =>
                        setPayments((prev) =>
                          prev.map((row) =>
                            row.id === p.id ? { ...row, amount: e.target.value } : row
                          )
                        )
                      }
                      className="w-28"
                    />
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() =>
                    setPayments((prev) => [
                      ...prev,
                      { id: Date.now(), method: "", amount: "0.00" },
                    ])
                  }
                  className="inline-flex h-8 items-center rounded border border-[#2980b9] bg-white px-3 text-[12px] font-medium text-[#2980b9] hover:bg-[#f0f7fb]"
                >
                  Add Payment Method
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-2 border-t border-slate-100 px-5 py-4">
        <Link
          href={backHref}
          className="inline-flex h-9 items-center rounded-full border border-[#2980b9] bg-white px-5 text-[13px] font-medium text-[#2980b9] hover:bg-[#f0f7fb]"
        >
          Cancel
        </Link>
        <button
          type="submit"
          disabled={!canSave}
          className="h-9 rounded-full bg-[#2980b9] px-5 text-[13px] font-medium text-white hover:bg-[#2472a4] disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          Save
        </button>
      </div>
    </form>
  );
}
