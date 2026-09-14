"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const SAMPLE_ITEMS = [
  "Strip Light - 100 Feet",
  "Katari Rice",
  "LED Bulb 12W",
  "Ceiling Fan",
  "Copper Wire 1.5mm",
];

function ChoiceCard({ selected, title, subtitle, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-start gap-3 rounded-md border px-4 py-3 text-left transition-colors ${
        selected
          ? "border-[#2980b9] bg-[#f3f9fc]"
          : "border-slate-200 bg-white hover:border-[#9ec4e0]"
      }`}
    >
      <span
        className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
          selected ? "border-[#2980b9] text-[#2980b9]" : "border-slate-300 text-transparent"
        }`}
      >
        <span className="material-icons text-[14px]">check</span>
      </span>
      <span className="min-w-0">
        <span className="block text-[14px] font-medium text-[#1a557a]">{title}</span>
        {subtitle ? (
          <span className="mt-0.5 block text-[12px] leading-snug text-slate-500">{subtitle}</span>
        ) : null}
      </span>
    </button>
  );
}

function FieldRow({ label, required, children }) {
  return (
    <div className="grid gap-2 sm:grid-cols-[200px_1fr] sm:items-start">
      <label className="pt-2 text-[13px] font-medium text-[#1a557a]">
        {label}
        {required ? <span className="text-red-500"> *</span> : null}
      </label>
      <div>{children}</div>
    </div>
  );
}

function Toggle({ checked, onChange }) {
  return (
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
        className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
          checked ? "translate-x-5" : ""
        }`}
      />
    </button>
  );
}

export default function PriceListFormPage({ config, mode = "create", initialValues }) {
  const router = useRouter();
  const backHref = config?.backHref || "/en/item-config/price-list";
  const isEdit = mode === "edit";
  const isDetails = mode === "details";

  const [saved, setSaved] = useState(false);
  const [values, setValues] = useState(() => ({
    name: "",
    transaction_type: "Sales",
    price_list_type: "All Items",
    description: "",
    percentage_mode: "Markup",
    percentage: "0",
    round_off: "Never mind",
    pricing_scheme: "Unit Pricing",
    include_discount: false,
    line_items: [{ item: "", rate: "" }],
    ...initialValues,
  }));

  const setVal = (key, val) => setValues((prev) => ({ ...prev, [key]: val }));

  const isAllItems = values.price_list_type === "All Items";
  const title = config?.title || (isEdit ? "Edit Price List" : isDetails ? "Price List Details" : "Add Price List");

  const canSave = useMemo(() => {
    if (!String(values.name || "").trim()) return false;
    if (isAllItems) return true;
    return (values.line_items || []).some((row) => String(row.item || "").trim());
  }, [values.name, values.line_items, isAllItems]);

  const updateLine = (index, key, val) => {
    setValues((prev) => {
      const list = [...(prev.line_items || [])];
      list[index] = { ...list[index], [key]: val };
      return { ...prev, line_items: list };
    });
  };

  const addLine = () =>
    setValues((prev) => ({
      ...prev,
      line_items: [...(prev.line_items || []), { item: "", rate: "" }],
    }));

  const removeLine = (index) =>
    setValues((prev) => {
      const list = [...(prev.line_items || [])];
      if (list.length <= 1) return { ...prev, line_items: [{ item: "", rate: "" }] };
      list.splice(index, 1);
      return { ...prev, line_items: list };
    });

  const onSubmit = (e) => {
    e.preventDefault();
    if (!canSave || isDetails) return;
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
        <h2 className="m-0 text-[20px] font-semibold text-[#1a557a]">{title}</h2>
        <Link href={backHref} className="rounded p-1 text-slate-500 hover:bg-slate-100" aria-label="Close">
          <span className="material-icons text-[22px]">close</span>
        </Link>
      </div>

      <div className="space-y-5 px-5 py-5">
        <FieldRow label="Name" required>
          <input
            type="text"
            required
            disabled={isDetails}
            value={values.name}
            placeholder="Enter price list name"
            onChange={(e) => setVal("name", e.target.value)}
            className="h-10 w-full rounded border border-slate-200 px-3 text-[13px] outline-none focus:border-[#2980b9] disabled:bg-slate-50"
          />
        </FieldRow>

        <FieldRow label="Transaction Type" required>
          <div className="grid gap-3 sm:grid-cols-2">
            {["Sales", "Purchase"].map((opt) => (
              <ChoiceCard
                key={opt}
                title={opt}
                selected={values.transaction_type === opt}
                onClick={() => !isDetails && setVal("transaction_type", opt)}
              />
            ))}
          </div>
        </FieldRow>

        <FieldRow label="Price List Type" required>
          <div className="grid gap-3 sm:grid-cols-2">
            <ChoiceCard
              title="All Items"
              subtitle="Mark up or mark down the rates of all items"
              selected={isAllItems}
              onClick={() => !isDetails && setVal("price_list_type", "All Items")}
            />
            <ChoiceCard
              title="Individual Items"
              subtitle="Customize the rate of each item"
              selected={!isAllItems}
              onClick={() => !isDetails && setVal("price_list_type", "Individual Items")}
            />
          </div>
        </FieldRow>

        <FieldRow label="Description">
          <textarea
            rows={3}
            disabled={isDetails}
            value={values.description}
            placeholder="Enter the description"
            onChange={(e) => setVal("description", e.target.value)}
            className="w-full rounded border border-slate-200 px-3 py-2 text-[13px] outline-none focus:border-[#2980b9] disabled:bg-slate-50"
          />
        </FieldRow>

        {isAllItems ? (
          <>
            <FieldRow label="Percentage" required>
              <div className="flex overflow-hidden rounded border border-slate-200">
                <select
                  disabled={isDetails}
                  value={values.percentage_mode}
                  onChange={(e) => setVal("percentage_mode", e.target.value)}
                  className="h-10 border-r border-slate-200 bg-[#f8fafc] px-3 text-[13px] outline-none"
                >
                  <option value="Markup">Markup</option>
                  <option value="Markdown">Markdown</option>
                </select>
                <input
                  type="number"
                  disabled={isDetails}
                  value={values.percentage}
                  placeholder="0"
                  onChange={(e) => setVal("percentage", e.target.value)}
                  className="h-10 min-w-0 flex-1 px-3 text-[13px] outline-none"
                />
                <span className="inline-flex h-10 items-center bg-[#f8fafc] px-3 text-[13px] text-slate-600">
                  %
                </span>
              </div>
            </FieldRow>

            <FieldRow label="Round Off To" required>
              <select
                disabled={isDetails}
                value={values.round_off}
                onChange={(e) => setVal("round_off", e.target.value)}
                className="h-10 w-full rounded border border-slate-200 px-3 text-[13px] outline-none focus:border-[#2980b9]"
              >
                <option>Never mind</option>
                <option>Nearest Whole Number</option>
                <option>Decimal Places</option>
              </select>
            </FieldRow>
          </>
        ) : (
          <>
            <FieldRow label="Pricing Scheme" required>
              <div className="grid gap-3 sm:grid-cols-2">
                {["Unit Pricing", "Volume Pricing"].map((opt) => (
                  <ChoiceCard
                    key={opt}
                    title={opt}
                    selected={values.pricing_scheme === opt}
                    onClick={() => !isDetails && setVal("pricing_scheme", opt)}
                  />
                ))}
              </div>
            </FieldRow>

            <FieldRow label="Include Discount">
              <div className="pt-1">
                <Toggle
                  checked={Boolean(values.include_discount)}
                  onChange={(v) => !isDetails && setVal("include_discount", v)}
                />
              </div>
            </FieldRow>

            <div className="border-t border-slate-100 pt-4">
              <div className="mb-3 flex items-center justify-between">
                <h3 className="m-0 text-[15px] font-semibold text-[#1a557a]">Line Items</h3>
                {!isDetails && (
                  <button
                    type="button"
                    onClick={addLine}
                    className="inline-flex h-9 items-center rounded-full border border-[#2980b9] bg-white px-4 text-[13px] font-medium text-[#2980b9] hover:bg-[#f0f7fb]"
                  >
                    + Add Item
                  </button>
                )}
              </div>

              <div className="overflow-hidden rounded-md border border-slate-200">
                <div className="grid grid-cols-[1fr_140px_44px] gap-2 bg-[#eef3f7] px-3 py-2 text-[12px] font-semibold uppercase tracking-wide text-[#1a557a]">
                  <span>Item *</span>
                  <span>Rate *</span>
                  <span />
                </div>
                <div className="divide-y divide-slate-100">
                  {(values.line_items || []).map((row, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-[1fr_140px_44px] items-center gap-2 px-3 py-2"
                    >
                      <select
                        disabled={isDetails}
                        value={row.item}
                        onChange={(e) => updateLine(index, "item", e.target.value)}
                        className="h-9 w-full rounded border border-slate-200 px-2 text-[13px] outline-none focus:border-[#2980b9]"
                      >
                        <option value="">Select item</option>
                        {SAMPLE_ITEMS.map((item) => (
                          <option key={item} value={item}>
                            {item}
                          </option>
                        ))}
                      </select>
                      <input
                        type="number"
                        disabled={isDetails}
                        value={row.rate}
                        placeholder="0.00"
                        onChange={(e) => updateLine(index, "rate", e.target.value)}
                        className="h-9 w-full rounded border border-slate-200 px-2 text-[13px] outline-none focus:border-[#2980b9]"
                      />
                      {!isDetails ? (
                        <button
                          type="button"
                          onClick={() => removeLine(index)}
                          className="inline-flex h-9 w-9 items-center justify-center rounded text-red-500 hover:bg-red-50"
                          aria-label="Remove item"
                        >
                          <span className="material-icons text-[18px]">delete</span>
                        </button>
                      ) : (
                        <span />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      <div className="flex justify-end gap-2 border-t border-slate-100 px-5 py-4">
        <button
          type="button"
          onClick={() => router.push(backHref)}
          className="inline-flex h-9 items-center rounded-full border border-[#2980b9] bg-white px-5 text-[13px] font-medium text-[#2980b9] hover:bg-[#f0f7fb]"
        >
          Cancel
        </button>
        {!isDetails && (
          <button
            type="submit"
            disabled={!canSave}
            className="h-9 rounded-full bg-[#2980b9] px-5 text-[13px] font-medium text-white hover:bg-[#2472a4] disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            {isEdit ? "Save Changes" : "Save"}
          </button>
        )}
      </div>
    </form>
  );
}
