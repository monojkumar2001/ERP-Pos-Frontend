"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  masterApi,
  purchaseApi,
  salesApi,
  settingsApi,
  unwrapApiData,
} from "../../lib/api";

const CUSTOMERS = ["karim saheb", "Rahim", "Masud Rahman", "Walk-in Customer", "Bestu Store"];
const SUPPLIERS = ["Rahim", "Karim Traders", "Bestu Store", "hbehb", "Masud Rahman"];
const SALES_PERSONS = ["Demo (demo@biznify.com.bd)", "Monoj", "Admin"];
const PRICE_LISTS = ["Default", "Wholesale", "Retail"];
const ITEMS = ["Paper A4", "Bag", "Notebook", "Pen Set", "Stapler"];
const UNITS = ["pc", "kg", "box", "dozen"];
const PAYMENT_METHODS = ["Cash", "Bank", "Card", "Mobile Banking"];

const BACK_HREF_TO_SALES_API = {
  "/en/sales/sales-direct-sales": "directInvoices",
  "/en/sales/quotation-list": "quotations",
  "/en/sales/sales-orders": "orders",
  "/en/sales/customer-debits": "customerDebits",
};

const BACK_HREF_TO_PURCHASE_API = {
  "/en/purchase/direct-purchases": "directBills",
  "/en/purchase/requisitions": "requisitions",
  "/en/purchase/orders": "orders",
  "/en/purchase/supplier-credits": "supplierCredits",
};

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
      className={`h-10 w-full rounded border border-slate-200 bg-white px-3 text-[13px] text-slate-700 outline-none placeholder:text-slate-400 focus:border-[#00a78b] ${className}`}
    />
  );
}

function SelectInput({
  options = [],
  placeholder,
  value,
  onChange,
  className = "",
  optionValue = "id",
  optionLabel = "name",
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className={`h-10 w-full rounded border border-slate-200 bg-white px-3 text-[13px] text-slate-700 outline-none focus:border-[#00a78b] ${className}`}
    >
      <option value="">{placeholder}</option>
      {options.map((o) => {
        const val = typeof o === "object" ? o[optionValue] : o;
        const label = typeof o === "object" ? o[optionLabel] : o;
        return (
          <option key={String(val)} value={val}>
            {label}
          </option>
        );
      })}
    </select>
  );
}

function emptyLine() {
  return {
    id: Date.now() + Math.random(),
    item_id: "",
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

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function resolveSalesApi(config) {
  const key =
    config?.salesApiKey ||
    BACK_HREF_TO_SALES_API[config?.backHref] ||
    null;
  return key ? salesApi[key] : null;
}

function resolvePurchaseApi(config) {
  const key =
    config?.purchaseApiKey ||
    BACK_HREF_TO_PURCHASE_API[config?.backHref] ||
    null;
  return key ? purchaseApi[key] : null;
}

function approveStatusFor(config) {
  if (
    config?.salesDocType === "direct_invoice" ||
    config?.salesApiKey === "directInvoices" ||
    config?.backHref === "/en/sales/sales-direct-sales" ||
    config?.purchaseDocType === "direct_bill" ||
    config?.purchaseApiKey === "directBills" ||
    config?.backHref === "/en/purchase/direct-purchases"
  ) {
    return "Completed";
  }
  return "Approved";
}

export default function TransactionFormPage({ config }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isSales = config?.module === "Sales";
  const isPurchase =
    config?.module === "Purchase" || Boolean(config?.purchaseApiKey);
  const api = isSales
    ? resolveSalesApi(config)
    : isPurchase
      ? resolvePurchaseApi(config)
      : null;
  const usesApi = Boolean(api);
  const editId = searchParams.get("id");
  const isEdit = Boolean(editId) && usesApi;

  const partyKey = config?.partyKey || (isPurchase ? "supplier" : "customer");
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(Boolean(usesApi));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [parties, setParties] = useState([]);
  const [items, setItems] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [priceLists, setPriceLists] = useState([]);

  const [form, setForm] = useState({
    number: "Auto Generated",
    date: todayISO(),
    validTill: "",
    customer: "",
    supplier: "",
    salesPerson: SALES_PERSONS[0],
    priceList: "Default",
    receiptNumber: "",
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
  const partyLabel =
    config?.partyLabel || (isPurchase ? "Supplier" : "Customer");
  const partyPlaceholder = config?.partyPlaceholder || `Select ${partyLabel}`;
  const showPayment = config?.showPayment !== false;
  const showSalesPerson = isPurchase
    ? config?.showSalesPerson === true
    : config?.showSalesPerson !== false;
  const showPriceList = config?.showPriceList !== false;
  const showValidTill = Boolean(config?.showValidTill);
  const showReceiptNumber = Boolean(config?.showReceiptNumber);
  const notesLabel = config?.notesLabel || "Notes/Terms:";
  const notesPlaceholder = config?.notesPlaceholder || "Write if you have any notes or terms.";

  const partyOptions = usesApi
    ? parties
    : config?.partyOptions || (partyKey === "supplier" ? SUPPLIERS : CUSTOMERS);
  const itemOptions = usesApi ? items : ITEMS;
  const paymentOptions = usesApi ? paymentMethods : PAYMENT_METHODS;
  const priceListOptions = usesApi
    ? priceLists.length
      ? priceLists.map((p) => p.name).filter(Boolean)
      : PRICE_LISTS
    : PRICE_LISTS;

  useEffect(() => {
    if (!usesApi || !api) {
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError("");

    const partyListPromise = isPurchase
      ? masterApi.suppliers.list()
      : masterApi.customers.list();

    const loads = [
      partyListPromise,
      masterApi.items.list(),
      settingsApi.paymentMethods.list(),
      masterApi.priceLists.list().catch(() => ({ rows: [] })),
    ];
    if (editId) loads.push(api.get(editId));

    Promise.all(loads)
      .then(([partyRes, itemsRes, payRes, priceRes, recordRes]) => {
        if (cancelled) return;
        setParties(partyRes.rows || []);
        setItems(itemsRes.rows || []);
        setPaymentMethods(payRes.rows || []);
        setPriceLists(priceRes.rows || []);

        const record = recordRes ? unwrapApiData(recordRes) : null;
        if (!record) return;

        setForm((prev) => ({
          ...prev,
          number: record.document_number || prev.number,
          date: record.document_date || todayISO(),
          validTill: record.valid_till || "",
          customer: record.customer_id != null ? String(record.customer_id) : "",
          supplier: record.supplier_id != null ? String(record.supplier_id) : "",
          salesPerson: record.sales_person || prev.salesPerson,
          priceList: record.price_list || prev.priceList,
          receiptNumber: record.receipt_number || "",
          description: record.description || "",
          notes: record.note || "",
          discountPct: "0",
          adjustmentSign: Number(record.adjustment) < 0 ? "-" : "+",
          adjustment: String(Math.abs(Number(record.adjustment) || 0)),
        }));
        setLines(
          (record.lines || []).length
            ? record.lines.map((l) => ({
                id: l.id || Date.now() + Math.random(),
                item_id: String(l.item_id || ""),
                item: l.item || l.item_name || "",
                unit: l.unit || "pc",
                quantity: l.quantity != null ? String(l.quantity) : "1",
                price: l.unit_price != null ? String(l.unit_price) : "0",
                discount: l.discount != null ? String(l.discount) : "0",
                vat: l.tax != null ? String(l.tax) : "0",
                inventory: "N/A",
              }))
            : []
        );
        setPayments(
          (record.payments || []).length
            ? record.payments.map((p) => ({
                id: p.id || Date.now() + Math.random(),
                method: p.payment_method_id != null ? String(p.payment_method_id) : "",
                amount: p.amount != null ? String(p.amount) : "0.00",
              }))
            : [{ id: 1, method: "", amount: "0.00" }]
        );
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
  }, [usesApi, api, editId, isPurchase]);

  const subtotal = useMemo(() => lines.reduce((sum, line) => sum + lineAmount(line), 0), [lines]);
  const discountAmt = useMemo(
    () => (subtotal * (Number(form.discountPct) || 0)) / 100,
    [subtotal, form.discountPct]
  );
  const adjustment = Number(form.adjustment) || 0;
  const adjustmentSigned = form.adjustmentSign === "-" ? -adjustment : adjustment;
  const grandTotal = Math.max(0, subtotal - discountAmt + adjustmentSigned);
  const partyValue = form[partyKey] || "";
  const canSave = Boolean(partyValue && (showSalesPerson ? form.salesPerson : true));

  const setField = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const updateLine = (id, key, value) =>
    setLines((prev) => prev.map((line) => (line.id === id ? { ...line, [key]: value } : line)));

  const buildBody = () => {
    const linePayload = lines
      .filter((l) => (usesApi ? l.item_id : l.item) && Number(l.quantity))
      .map((l) => ({
        item_id: Number(l.item_id),
        quantity: Number(l.quantity),
        unit_price: Number(l.price) || 0,
        discount: Number(l.discount) || 0,
        tax: Number(l.vat) || 0,
        unit: l.unit || "pc",
      }));

    const paymentPayload = showPayment
      ? payments
          .filter((p) => p.method && Number(p.amount) > 0)
          .map((p) => ({
            payment_method_id: Number(p.method),
            amount: Number(p.amount),
          }))
      : [];

    const body = {
      document_date: form.date,
      note: form.notes?.trim() || null,
      description: form.description?.trim() || null,
      discount_amount: discountAmt,
      tax_amount: lines.reduce((s, l) => s + (Number(l.vat) || 0), 0),
      adjustment: adjustmentSigned,
      price_list: form.priceList || null,
      lines: linePayload,
    };
    if (isPurchase) {
      body.supplier_id = form.supplier ? Number(form.supplier) : null;
    } else {
      body.customer_id = form.customer ? Number(form.customer) : null;
      body.sales_person = form.salesPerson || null;
    }
    if (showValidTill && form.validTill) body.valid_till = form.validTill;
    if (showReceiptNumber) body.receipt_number = form.receiptNumber || null;
    if (paymentPayload.length) body.payments = paymentPayload;
    return body;
  };

  const saveTxn = async (approve) => {
    if (!api || !canSave) return;
    const body = buildBody();
    const allowEmptyLines =
      config?.salesApiKey === "customerDebits" ||
      config?.purchaseApiKey === "supplierCredits";
    if (!body.lines.length && !allowEmptyLines) {
      setError("Add at least one line item.");
      return;
    }
    if (allowEmptyLines && !body.lines.length) {
      body.grand_total = grandTotal || Number(form.adjustment) || 0;
      body.adjustment = body.grand_total;
    }

    setSaving(true);
    setError("");
    try {
      let id = editId;
      if (isEdit) {
        await api.update(editId, body);
      } else {
        const res = await api.create(body);
        id = unwrapApiData(res)?.id;
      }
      if (approve && id) {
        await api.setStatus(id, approveStatusFor(config));
      }
      router.push(backHref);
    } catch (err) {
      setError(err.message || "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (!canSave) return;
    if (usesApi) {
      saveTxn(false);
      return;
    }
    setSaved(true);
  };

  if (loading) {
    return (
      <div className="rounded-lg border border-slate-200 bg-white p-10 text-center text-slate-500">
        Loading…
      </div>
    );
  }

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
        <h1 className="m-0 text-[20px] font-semibold text-[#1a557a]">
          {isEdit ? title.replace(/^Add /, "Edit ") : title}
        </h1>
        <Link href={backHref} className="rounded p-1 text-slate-500 hover:bg-slate-100" aria-label="Close">
          <span className="material-icons text-[22px]">close</span>
        </Link>
      </div>

      {error && (
        <div className="mx-5 mt-4 rounded border border-red-200 bg-red-50 px-3 py-2 text-[13px] text-red-700">
          {error}
        </div>
      )}

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
              <FieldLabel required>{partyLabel}</FieldLabel>
              <SelectInput
                options={partyOptions}
                placeholder={partyPlaceholder}
                value={partyValue}
                onChange={(v) => setField(partyKey, v)}
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
                  options={priceListOptions}
                  placeholder="Select Price List"
                  value={form.priceList}
                  onChange={(v) => setField("priceList", v)}
                />
              </div>
            )}
            {showReceiptNumber && (
              <div>
                <FieldLabel>Supplier Receipt Number</FieldLabel>
                <TextInput
                  value={form.receiptNumber}
                  onChange={(e) => setField("receiptNumber", e.target.value)}
                  placeholder="Enter Receipt Number"
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
                className="w-full rounded border border-slate-200 px-3 py-2 text-[13px] outline-none focus:border-[#00a78b]"
              />
            </div>
          </div>

          <div>
            <FieldLabel>Upload a file</FieldLabel>
            <div className="flex min-h-[220px] flex-col items-center justify-center rounded-lg border-2 border-dashed border-[#9ec4e0] bg-[#f3f9fc] px-4 py-6 text-center">
              <span className="material-icons mb-2 text-[36px] text-[#00a78b]">cloud_upload</span>
              <p className="m-0 text-[13px] text-slate-600">Drag and drop file here</p>
              <p className="my-2 text-[12px] text-slate-400">or</p>
              <button
                type="button"
                className="rounded bg-[#00a78b] px-4 py-2 text-[13px] font-medium text-white hover:bg-[#008f77]"
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
                        options={itemOptions}
                        placeholder="Select item"
                        value={usesApi ? line.item_id : line.item}
                        onChange={(v) => {
                          if (usesApi) {
                            const found = items.find((i) => String(i.id) === String(v));
                            const priceKey = isPurchase
                              ? found?.purchase_price ?? found?.sales_price ?? found?.price
                              : found?.sales_price ?? found?.price;
                            setLines((prev) =>
                              prev.map((row) =>
                                row.id === line.id
                                  ? {
                                      ...row,
                                      item_id: v,
                                      price:
                                        priceKey != null ? String(priceKey) : row.price,
                                    }
                                  : row
                              )
                            );
                          } else {
                            updateLine(line.id, "item", v);
                          }
                        }}
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
              className="inline-flex h-8 items-center rounded border border-[#00a78b] bg-white px-3 text-[12px] font-medium text-[#00a78b] hover:bg-[#f0f7fb]"
            >
              Add Item
            </button>
          </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          <div>
            <FieldLabel>{notesLabel}</FieldLabel>
            <textarea
              value={form.notes}
              onChange={(e) => setField("notes", e.target.value)}
              placeholder={notesPlaceholder}
              rows={8}
              className="w-full rounded border border-slate-200 px-3 py-2 text-[13px] outline-none focus:border-[#00a78b]"
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
              className="mb-3 inline-flex h-8 items-center rounded border border-[#00a78b] bg-white px-3 text-[12px] font-medium text-[#00a78b] hover:bg-[#f0f7fb]"
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
                      options={paymentOptions}
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
                  className="inline-flex h-8 items-center rounded border border-[#00a78b] bg-white px-3 text-[12px] font-medium text-[#00a78b] hover:bg-[#f0f7fb]"
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
          className="inline-flex h-9 items-center rounded-full border border-[#00a78b] bg-white px-5 text-[13px] font-medium text-[#00a78b] hover:bg-[#f0f7fb]"
        >
          Cancel
        </Link>
        {usesApi ? (
          <>
            <button
              type="button"
              disabled={!canSave || saving}
              onClick={() => saveTxn(false)}
              className="h-9 rounded-full border border-[#00a78b] bg-white px-5 text-[13px] font-medium text-[#00a78b] hover:bg-[#f0f7fb] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving ? "Saving…" : "Save As Draft"}
            </button>
            <button
              type="button"
              disabled={!canSave || saving}
              onClick={() => saveTxn(true)}
              className="h-9 rounded-full bg-[#00a78b] px-5 text-[13px] font-medium text-white hover:bg-[#008f77] disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              {saving
                ? "Saving…"
                : approveStatusFor(config) === "Completed"
                  ? "Complete"
                  : "Approve"}
            </button>
          </>
        ) : (
          <button
            type="submit"
            disabled={!canSave}
            className="h-9 rounded-full bg-[#00a78b] px-5 text-[13px] font-medium text-white hover:bg-[#008f77] disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            Save
          </button>
        )}
      </div>
    </form>
  );
}
