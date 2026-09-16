"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { masterApi, unwrapApiData } from "../../lib/api";

const ITEMS = [
  "Strip Light - 100 Feet",
  "LED Bulb 12W",
  "Paper A4",
  "Bag",
  "Notebook",
  "Pen Set",
];
const ROUND_OFF = ["Never mind", "Nearest Whole Number", "Nearest Decimal"];

function FieldLabel({ children, required }) {
  return (
    <label className="mb-1.5 block text-[13px] font-medium text-[#1a557a]">
      {children}
      {required && <span className="text-red-500"> *</span>}
    </label>
  );
}

function ChoiceCard({ selected, title, description, onClick, disabled }) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`flex w-full items-start gap-3 rounded-lg border px-4 py-3 text-left transition-colors ${
        selected
          ? "border-[#00a78b] bg-[#f0f7fb]"
          : "border-slate-200 bg-white hover:border-[#9ec4e0]"
      } ${disabled ? "cursor-default opacity-90" : ""}`}
    >
      <span
        className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
          selected ? "border-[#00a78b] bg-[#00a78b] text-white" : "border-slate-300 bg-white"
        }`}
      >
        {selected ? <span className="text-[11px] leading-none">✓</span> : null}
      </span>
      <span className="min-w-0">
        <span className="block text-[14px] font-semibold text-[#1a557a]">{title}</span>
        {description ? (
          <span className="mt-0.5 block text-[12px] leading-snug text-slate-500">{description}</span>
        ) : null}
      </span>
    </button>
  );
}

function ToggleSwitch({ checked, onChange, disabled }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => !disabled && onChange(!checked)}
      className={`relative h-6 w-11 rounded-full transition-colors ${
        checked ? "bg-[#00a78b]" : "bg-slate-300"
      } ${disabled ? "cursor-default opacity-80" : ""}`}
    >
      <span
        className={`absolute top-0.5 left-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-white text-[10px] text-[#00a78b] shadow transition-transform ${
          checked ? "translate-x-5" : ""
        }`}
      >
        {checked ? "✓" : ""}
      </span>
    </button>
  );
}

function DetailRow({ label, children }) {
  return (
    <div className="min-w-[160px]">
      <div className="text-[12px] font-medium text-slate-400">{label}</div>
      <div className="mt-1 text-[14px] font-medium text-[#1a557a]">{children}</div>
    </div>
  );
}

export default function PriceListFormPage({ config, mode = "create", initialValues = {} }) {
  const router = useRouter();
  const readOnly = mode === "details";
  const isEdit = mode === "edit";
  const backHref = config?.backHref || "/en/item-config/price-list";

  const [form, setForm] = useState(() => {
    const seed = {
      name: "",
      description: "",
      transaction_type: "Sales",
      price_list_type: mode === "create" ? "All Items" : "Individual Items",
      pricing_scheme: "Unit Pricing",
      include_discount: false,
      percentage_mode: "Markup",
      percentage: "0",
      round_off: "Never mind",
      status: "Active",
      ...initialValues,
    };
    const rawLines = initialValues.line_items || [{ item: "", rate: "" }];
    return {
      ...seed,
      line_items: rawLines.map((line, i) => ({
        id: line.id || i + 1,
        item: line.item || "",
        rate: line.rate || "",
      })),
    };
  });
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!initialValues.id || mode === "create") return;
    masterApi.priceLists
      .get(initialValues.id)
      .then((res) => {
        const pl = unwrapApiData(res);
        setForm((prev) => ({
          ...prev,
          name: pl.name || prev.name,
          transaction_type: pl.transaction_type || prev.transaction_type,
          price_list_type: pl.price_list_type || pl.pricebook_type || prev.price_list_type,
          status: pl.status || prev.status,
        }));
      })
      .catch(() => {});
  }, [initialValues.id, mode]);

  const title =
    mode === "details"
      ? config?.title || "Price List Details"
      : mode === "edit"
        ? config?.title || "Edit Price List"
        : config?.title || "Add Price List";

  const isAllItems = form.price_list_type === "All Items";
  const lines = useMemo(() => form.line_items || [], [form.line_items]);

  const canSave = useMemo(() => {
    if (readOnly) return false;
    if (!String(form.name || "").trim()) return false;
    if (isAllItems) {
      return form.percentage !== "" && form.percentage != null && form.round_off;
    }
    return true;
  }, [form, isAllItems, readOnly]);

  const set = (key, val) => setForm((prev) => ({ ...prev, [key]: val }));

  const updateLine = (id, key, val) =>
    set(
      "line_items",
      lines.map((line) => (line.id === id ? { ...line, [key]: val } : line))
    );

  const addLine = () =>
    set("line_items", [...lines, { id: Date.now(), item: "", rate: "" }]);

  const removeLine = (id) =>
    set(
      "line_items",
      lines.length <= 1 ? lines : lines.filter((line) => line.id !== id)
    );

  if (saved) {
    return (
      <div className="rounded-lg border border-green-200 bg-green-50 p-8 text-center text-green-700">
        Price list saved successfully (demo).{" "}
        <Link href={backHref} className="font-semibold underline">
          Back to Price List
        </Link>
      </div>
    );
  }

  if (readOnly) {
    return (
      <div className="pb-8 text-[#1a557a]">
        <div className="overflow-hidden rounded-lg border border-[#e5e7eb] bg-white shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 px-5 py-3">
            <h1 className="m-0 text-[20px] font-semibold text-[#1a557a]">{title}</h1>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() =>
                  set(
                    "status",
                    String(form.status).toLowerCase() === "active" ? "Inactive" : "Active"
                  )
                }
                className="inline-flex h-9 items-center rounded border border-[#00a78b] bg-white px-4 text-[13px] font-medium text-[#00a78b] hover:bg-[#f0f7fb]"
              >
                {String(form.status).toLowerCase() === "active" ? "Deactivate" : "Activate"}
              </button>
              <Link
                href={
                  initialValues?.id
                    ? `/en/item-config/price-list-update/${initialValues.id}`
                    : backHref
                }
                className="inline-flex h-9 items-center gap-1 rounded bg-[#00a78b] px-4 text-[13px] font-medium text-white hover:bg-[#008f77]"
              >
                <span className="material-icons text-[16px]">edit</span>
                Edit
              </Link>
              <Link
                href={backHref}
                className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                aria-label="Close"
              >
                <span className="material-icons text-[22px]">close</span>
              </Link>
            </div>
          </div>

          <div className="space-y-6 px-5 py-5">
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              <DetailRow label="Name">{form.name || "—"}</DetailRow>
              <DetailRow label="Description">{form.description?.trim() || "—"}</DetailRow>
              <DetailRow label="Transaction Type">{form.transaction_type}</DetailRow>
              <DetailRow label="Price List Type">{form.price_list_type}</DetailRow>
              {!isAllItems && (
                <DetailRow label="Include Discount">
                  {form.include_discount ? "Yes" : "No"}
                </DetailRow>
              )}
              <DetailRow label="Status">
                <span
                  className={
                    String(form.status).toLowerCase() === "active"
                      ? "text-[#28a745]"
                      : "text-[#dc3545]"
                  }
                >
                  {form.status || "Active"}
                </span>
              </DetailRow>
              {!isAllItems && (
                <DetailRow label="Individual Pricing Scheme">{form.pricing_scheme}</DetailRow>
              )}
              {isAllItems && (
                <>
                  <DetailRow label="Pricing Scheme">{form.percentage_mode}</DetailRow>
                  <DetailRow label="Percentage">{form.percentage}%</DetailRow>
                  <DetailRow label="Round Off To">{form.round_off}</DetailRow>
                </>
              )}
            </div>

            {!isAllItems && (
              <div>
                <h2 className="mb-3 text-[16px] font-semibold text-[#1a557a]">Line Items</h2>
                <div className="overflow-hidden rounded border border-slate-200">
                  <table className="min-w-full text-left text-[13px]">
                    <thead className="bg-[#d9ebf7] text-[11px] font-semibold uppercase text-[#1a557a]">
                      <tr>
                        <th className="px-3 py-2.5 w-12">#</th>
                        <th className="px-3 py-2.5">Item</th>
                        <th className="px-3 py-2.5 text-right">Rate</th>
                      </tr>
                    </thead>
                    <tbody>
                      {lines.map((line, idx) => (
                        <tr key={line.id} className="border-t border-slate-100">
                          <td className="px-3 py-2.5 text-slate-500">{idx + 1}</td>
                          <td className="px-3 py-2.5 text-[#1a557a]">{line.item || "—"}</td>
                          <td className="px-3 py-2.5 text-right text-[#1a557a]">
                            {line.rate
                              ? Number(line.rate).toLocaleString(undefined, {
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2,
                                })
                              : "—"}
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
      </div>
    );
  }

  return (
    <div className="pb-8 text-[#1a557a]">
      <div className="overflow-hidden rounded-lg border border-[#e5e7eb] bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-3">
          <h1 className="m-0 text-[20px] font-semibold text-[#1a557a]">{title}</h1>
          <Link
            href={backHref}
            className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            aria-label="Close"
          >
            <span className="material-icons text-[22px]">close</span>
          </Link>
        </div>

        <div className="space-y-5 px-5 py-5">
          <div>
            <FieldLabel required>Name</FieldLabel>
            <input
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              placeholder="Enter price list name"
              className="h-10 w-full rounded border border-slate-200 bg-white px-3 text-[13px] text-slate-700 outline-none placeholder:text-slate-400 focus:border-[#00a78b]"
            />
          </div>

          <div>
            <FieldLabel required>Transaction Type</FieldLabel>
            <div className="grid gap-3 sm:grid-cols-2">
              {["Sales", "Purchase"].map((type) => (
                <ChoiceCard
                  key={type}
                  title={type}
                  selected={form.transaction_type === type}
                  onClick={() => set("transaction_type", type)}
                />
              ))}
            </div>
          </div>

          <div>
            <FieldLabel required>Price List Type</FieldLabel>
            <div className="grid gap-3 sm:grid-cols-2">
              <ChoiceCard
                title="All Items"
                description="Mark up or mark down the rates of all items"
                selected={isAllItems}
                onClick={() => set("price_list_type", "All Items")}
              />
              <ChoiceCard
                title="Individual Items"
                description="Customize the rate of each item"
                selected={!isAllItems}
                onClick={() => set("price_list_type", "Individual Items")}
              />
            </div>
          </div>

          <div>
            <FieldLabel>Description</FieldLabel>
            <textarea
              rows={3}
              value={form.description || ""}
              onChange={(e) => set("description", e.target.value)}
              placeholder="Enter the description"
              className="w-full rounded border border-slate-200 bg-white px-3 py-2 text-[13px] text-slate-700 outline-none placeholder:text-slate-400 focus:border-[#00a78b]"
            />
          </div>

          {isAllItems ? (
            <>
              <div>
                <FieldLabel required>Percentage</FieldLabel>
                <div className="flex max-w-md overflow-hidden rounded border border-slate-200">
                  <select
                    value={form.percentage_mode}
                    onChange={(e) => set("percentage_mode", e.target.value)}
                    className="h-10 border-0 border-r border-slate-200 bg-[#f8fafc] px-3 text-[13px] text-[#1a557a] outline-none"
                  >
                    <option value="Markup">Markup</option>
                    <option value="Markdown">Markdown</option>
                  </select>
                  <input
                    type="number"
                    min="0"
                    value={form.percentage}
                    onChange={(e) => set("percentage", e.target.value)}
                    placeholder="0"
                    className="h-10 min-w-0 flex-1 border-0 px-3 text-[13px] outline-none focus:ring-0"
                  />
                  <span className="flex h-10 items-center bg-[#f8fafc] px-3 text-[13px] text-slate-500">
                    %
                  </span>
                </div>
              </div>
              <div className="max-w-md">
                <FieldLabel required>Round Off To</FieldLabel>
                <select
                  value={form.round_off}
                  onChange={(e) => set("round_off", e.target.value)}
                  className="h-10 w-full rounded border border-slate-200 bg-white px-3 text-[13px] text-slate-700 outline-none focus:border-[#00a78b]"
                >
                  {ROUND_OFF.map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
              </div>
            </>
          ) : (
            <>
              <div>
                <FieldLabel required>Pricing Scheme</FieldLabel>
                <div className="grid gap-3 sm:grid-cols-2">
                  {["Unit Pricing", "Volume Pricing"].map((scheme) => (
                    <ChoiceCard
                      key={scheme}
                      title={scheme}
                      selected={form.pricing_scheme === scheme}
                      onClick={() => set("pricing_scheme", scheme)}
                    />
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-[13px] font-medium text-[#1a557a]">Include Discount</span>
                <ToggleSwitch
                  checked={Boolean(form.include_discount)}
                  onChange={(v) => set("include_discount", v)}
                />
              </div>

              <div>
                <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                  <h2 className="m-0 text-[16px] font-semibold text-[#1a557a]">Line Items</h2>
                  <button
                    type="button"
                    onClick={addLine}
                    className="inline-flex h-9 items-center gap-1 rounded border border-[#00a78b] bg-white px-3 text-[13px] font-medium text-[#00a78b] hover:bg-[#f0f7fb]"
                  >
                    <span className="text-[16px] leading-none">+</span>
                    Add Item
                  </button>
                </div>
                <div className="overflow-hidden rounded border border-slate-200">
                  <table className="min-w-full text-left text-[13px]">
                    <thead className="bg-[#d9ebf7] text-[11px] font-semibold uppercase text-[#1a557a]">
                      <tr>
                        <th className="px-3 py-2.5">Item *</th>
                        <th className="px-3 py-2.5 w-40">Rate *</th>
                        <th className="w-12 px-2 py-2.5" />
                      </tr>
                    </thead>
                    <tbody>
                      {lines.map((line) => (
                        <tr key={line.id} className="border-t border-slate-100">
                          <td className="px-3 py-2">
                            <select
                              value={line.item}
                              onChange={(e) => updateLine(line.id, "item", e.target.value)}
                              className="h-10 w-full rounded border border-slate-200 bg-white px-2 text-[13px] outline-none focus:border-[#00a78b]"
                            >
                              <option value="">Select item</option>
                              {ITEMS.map((item) => (
                                <option key={item} value={item}>
                                  {item}
                                </option>
                              ))}
                              {line.item && !ITEMS.includes(line.item) ? (
                                <option value={line.item}>{line.item}</option>
                              ) : null}
                            </select>
                          </td>
                          <td className="px-3 py-2">
                            <input
                              type="number"
                              value={line.rate}
                              onChange={(e) => updateLine(line.id, "rate", e.target.value)}
                              placeholder="0.00"
                              className="h-10 w-full rounded border border-slate-200 px-2 text-[13px] outline-none focus:border-[#00a78b]"
                            />
                          </td>
                          <td className="px-2 py-2 text-center">
                            <button
                              type="button"
                              aria-label="Remove item"
                              onClick={() => removeLine(line.id)}
                              className="rounded p-1 text-red-500 hover:bg-red-50"
                            >
                              <span className="material-icons text-[18px]">delete</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="flex justify-end gap-2 border-t border-slate-200 px-5 py-3">
          <Link
            href={backHref}
            className="inline-flex h-9 items-center rounded border border-[#00a78b] bg-white px-5 text-[13px] font-medium text-[#00a78b] hover:bg-[#f0f7fb]"
          >
            Cancel
          </Link>
          {saveError && (
            <div className="mr-auto rounded border border-red-200 bg-red-50 px-3 py-2 text-[13px] text-red-700">
              {saveError}
            </div>
          )}
          <button
            type="button"
            disabled={!canSave || saving}
            onClick={async () => {
              setSaveError("");
              setSaving(true);
              const payload = {
                name: form.name.trim(),
                transaction_type: form.transaction_type,
                price_list_type: form.price_list_type,
              };
              try {
                if (isEdit && initialValues.id) {
                  await masterApi.priceLists.update(initialValues.id, payload);
                } else {
                  await masterApi.priceLists.create(payload);
                }
                setSaved(true);
                router.push(backHref);
              } catch (err) {
                setSaveError(err.message || "Failed to save price list");
              } finally {
                setSaving(false);
              }
            }}
            className="h-9 rounded bg-[#00a78b] px-5 text-[13px] font-medium text-white hover:bg-[#008f77] disabled:cursor-not-allowed disabled:bg-slate-300 disabled:text-white"
          >
            {saving ? "Saving…" : isEdit ? "Save Changes" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
}
