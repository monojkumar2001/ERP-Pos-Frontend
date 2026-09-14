"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

const UNITS = ["pc", "kg", "ltr", "box", "dozen"];
const MANUFACTURERS = ["selim", "matador", "paper brand"];
const BRANDS = ["Yamaha", "NB", "akij", "Ars nova"];
const COLORS = ["Red", "Blue", "Black", "White"];
const SIZES = ["S", "M", "L", "XL", "XXL"];
const ATTRIBUTE_SETS = ["Color Family", "Material", "Warranty", "Origin"];
const CATEGORIES = [
  "Accessories",
  "Electronics",
  "Fashion Item",
  "Food",
  "Home & Personal Care",
];
const ACCOUNTS = {
  inventory: ["Inventory"],
  purchase: ["Cost of Goods Sold"],
  sales: ["Sales"],
  vat: ["VAT 5%", "VAT 15%", "No VAT"],
  discount: ["5%", "10%", "No Discount"],
};

function FieldLabel({ children, required, hint }) {
  return (
    <label className="mb-1.5 flex items-center gap-1 text-[13px] font-medium text-[#1a557a]">
      {children}
      {required && <span className="text-red-500">*</span>}
      {hint && <i className="far fa-info-circle text-[12px] text-[#2980b9]" />}
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

function SelectInput({ options = [], placeholder, value, onChange }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="h-10 w-full rounded border border-slate-200 bg-white px-3 text-[13px] text-slate-700 outline-none focus:border-[#2980b9]"
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

function CheckRow({ label, checked, disabled, onChange }) {
  return (
    <label
      className={`flex items-center gap-2 text-[13px] ${
        disabled ? "cursor-not-allowed text-slate-400" : "cursor-pointer text-[#1a557a]"
      }`}
    >
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 accent-[#2980b9]"
      />
      {label}
    </label>
  );
}

function RichToolbar() {
  const tools = [
    ["undo", "Undo"],
    ["redo", "Redo"],
    ["format_bold", "Bold"],
    ["format_italic", "Italic"],
    ["format_underlined", "Underline"],
    ["strikethrough_s", "Strikethrough"],
    ["format_align_left", "Justify Left"],
    ["format_align_center", "Justify Center"],
    ["format_align_right", "Justify Right"],
    ["format_align_justify", "Justify Full"],
    ["format_list_bulleted", "Unordered List"],
    ["format_list_numbered", "Ordered List"],
    ["link", "Insert Link"],
    ["horizontal_rule", "Horizontal Line"],
    ["format_clear", "Clear Formatting"],
    ["code", "HTML Code"],
  ];
  return (
    <div className="flex flex-wrap items-center gap-0.5 border-b border-slate-200 bg-[#f8fafc] px-2 py-1.5">
      {tools.map(([icon, label]) => (
        <button
          key={icon}
          type="button"
          className="rounded p-1 text-slate-500 hover:bg-white hover:text-[#2980b9]"
          aria-label={label}
        >
          <span className="material-icons text-[18px]">{icon}</span>
        </button>
      ))}
      <span className="mx-1 h-5 w-px bg-slate-200" />
      <select className="h-7 rounded border border-slate-200 bg-white px-1 text-[12px]">
        <option>Arial</option>
      </select>
      <select className="ml-1 h-7 rounded border border-slate-200 bg-white px-1 text-[12px]">
        <option>3</option>
      </select>
    </div>
  );
}

function ModalShell({ title, onClose, children, onSave }) {
  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/35 p-4">
      <div className="w-full max-w-md overflow-hidden rounded-lg bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
          <h3 className="m-0 text-[16px] font-semibold text-[#1a557a]">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded p-1 text-slate-400 hover:bg-slate-100"
          >
            <span className="material-icons text-[20px]">close</span>
          </button>
        </div>
        <div className="max-h-72 overflow-auto p-4">{children}</div>
        <div className="flex justify-end gap-2 border-t border-slate-200 px-4 py-3">
          <button
            type="button"
            onClick={onClose}
            className="h-9 rounded-full border border-slate-300 bg-white px-4 text-[13px] text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onSave}
            className="h-9 rounded-full bg-[#2980b9] px-4 text-[13px] font-medium text-white hover:bg-[#2472a4]"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AddItemPage() {
  const [form, setForm] = useState({
    itemType: "Product",
    name: "",
    shortDescription: "",
    longDescription: "",
    manufacturer: "",
    brand: "",
    color: "",
    size: "",
    chalan: "",
    categories: [],
    sku: "",
    unit: "",
    fractionalUnits: false,
    returnable: true,
    trackInventory: true,
    inventoryAccount: "Inventory",
    lowStockPoint: "",
    serialized: false,
    manageBatch: false,
    openingStock: false,
    rawMaterial: false,
    purchasable: true,
    purchasingPrice: "",
    purchaseAccount: "Cost of Goods Sold",
    purchasingVat: "",
    saleable: true,
    sellingPrice: "",
    salesAccount: "Sales",
    sellingVat: "",
    sellingDiscount: "",
    deliverable: true,
    weight: "",
    ecommerce: false,
    pos: false,
  });
  const [categoryModal, setCategoryModal] = useState(false);
  const [pendingCategories, setPendingCategories] = useState([]);
  const [attributes, setAttributes] = useState([]);
  const [saved, setSaved] = useState(false);

  const set = (key) => (val) => setForm((prev) => ({ ...prev, [key]: val }));

  const canSave = useMemo(() => {
    if (!form.name.trim() || !form.unit) return false;
    if (form.trackInventory && !form.inventoryAccount) return false;
    if (form.purchasable && (!form.purchasingPrice || !form.purchaseAccount)) return false;
    if (form.saleable && (!form.sellingPrice || !form.salesAccount)) return false;
    return true;
  }, [form]);

  const generateSku = () => {
    const n = String(Math.floor(1000 + Math.random() * 9000));
    setForm((prev) => ({ ...prev, sku: `I-00${n}` }));
  };

  if (saved) {
    return (
      <div className="rounded-lg border border-green-200 bg-green-50 p-8 text-center text-green-700">
        Item saved successfully (demo).{" "}
        <Link href="/en/item-config/items" className="font-semibold underline">
          Back to Items
        </Link>
      </div>
    );
  }

  return (
    <div className="pb-8 text-[#1a557a]">
      <div className="overflow-hidden rounded-lg border border-[#e5e7eb] bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-3">
          <h1 className="m-0 text-[20px] font-semibold text-[#1a557a]">Add Item</h1>
          <Link
            href="/en/item-config/items"
            className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
            aria-label="Close"
          >
            <span className="material-icons text-[22px]">close</span>
          </Link>
        </div>

        <div className="px-5 py-4">
          <h2 className="mb-4 mt-0 text-[15px] font-semibold text-[#5b8fb8]">Item Information</h2>

          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
            <div className="space-y-4">
              <div>
                <FieldLabel hint>Item Type</FieldLabel>
                <div className="flex gap-6">
                  {["Service", "Product"].map((t) => (
                    <label key={t} className="flex items-center gap-2 text-[13px]">
                      <input
                        type="radio"
                        name="itemType"
                        checked={form.itemType === t}
                        onChange={() => set("itemType")(t)}
                        className="accent-[#2980b9]"
                      />
                      {t}
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <FieldLabel required>Item Name</FieldLabel>
                <TextInput
                  value={form.name}
                  onChange={(e) => set("name")(e.target.value)}
                  placeholder="Enter item name"
                />
              </div>

              <div>
                <FieldLabel>Short Description</FieldLabel>
                <textarea
                  value={form.shortDescription}
                  onChange={(e) => set("shortDescription")(e.target.value)}
                  placeholder="Write a short description about this item..."
                  rows={3}
                  className="w-full rounded border border-slate-200 px-3 py-2 text-[13px] outline-none focus:border-[#2980b9]"
                />
              </div>

              <div>
                <FieldLabel>Long Description</FieldLabel>
                <div className="overflow-hidden rounded border border-slate-200">
                  <RichToolbar />
                  <textarea
                    value={form.longDescription}
                    onChange={(e) => set("longDescription")(e.target.value)}
                    placeholder="Write a long description about this item..."
                    rows={5}
                    className="w-full border-0 px-3 py-2 text-[13px] outline-none"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <FieldLabel>Select Manufacturer</FieldLabel>
                  <SelectInput
                    options={MANUFACTURERS}
                    placeholder="Select or Create Manufacturer"
                    value={form.manufacturer}
                    onChange={set("manufacturer")}
                  />
                </div>
                <div>
                  <FieldLabel>Select Brand</FieldLabel>
                  <SelectInput
                    options={BRANDS}
                    placeholder="Select or Create brand"
                    value={form.brand}
                    onChange={set("brand")}
                  />
                </div>
                <div>
                  <FieldLabel>Select Color</FieldLabel>
                  <SelectInput
                    options={COLORS}
                    placeholder="Select or Create Color"
                    value={form.color}
                    onChange={set("color")}
                  />
                </div>
                <div>
                  <FieldLabel>Select Size</FieldLabel>
                  <SelectInput
                    options={SIZES}
                    placeholder="Select Size"
                    value={form.size}
                    onChange={set("size")}
                  />
                </div>
              </div>

              <div>
                <FieldLabel>Attribute Sets</FieldLabel>
                <div className="space-y-2">
                  {attributes.map((row) => (
                    <div key={row.id} className="grid gap-2 sm:grid-cols-[1fr_1fr_auto]">
                      <SelectInput
                        options={ATTRIBUTE_SETS}
                        placeholder="Attribute Sets"
                        value={row.set}
                        onChange={(val) =>
                          setAttributes((prev) =>
                            prev.map((r) => (r.id === row.id ? { ...r, set: val, attr: "" } : r))
                          )
                        }
                      />
                      <SelectInput
                        options={
                          row.set
                            ? ["Option A", "Option B", "Option C"]
                            : []
                        }
                        placeholder="Select Attribute"
                        value={row.attr}
                        onChange={(val) =>
                          setAttributes((prev) =>
                            prev.map((r) => (r.id === row.id ? { ...r, attr: val } : r))
                          )
                        }
                      />
                      <button
                        type="button"
                        onClick={() =>
                          setAttributes((prev) => prev.filter((r) => r.id !== row.id))
                        }
                        className="inline-flex h-10 w-10 items-center justify-center rounded text-red-500 hover:bg-red-50"
                        aria-label="Remove attribute"
                      >
                        <span className="material-icons text-[20px]">delete</span>
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() =>
                    setAttributes((prev) => [
                      ...prev,
                      { id: Date.now(), set: "", attr: "" },
                    ])
                  }
                  className="mt-2 inline-flex h-9 items-center rounded border border-[#2980b9] px-3 text-[13px] font-medium text-[#2980b9] hover:bg-[#f0f7fb]"
                >
                  + Add Attribute
                </button>
              </div>

              <div>
                <FieldLabel>Chalan</FieldLabel>
                <TextInput
                  type="number"
                  value={form.chalan}
                  onChange={(e) => set("chalan")(e.target.value)}
                  placeholder="Enter Number Value"
                />
              </div>

              <div>
                <FieldLabel>Categories</FieldLabel>
                <div className="flex gap-2">
                  <div className="flex min-h-10 min-w-0 flex-1 flex-wrap items-center gap-1 rounded border border-slate-200 bg-white px-2 py-1.5 text-[13px] text-slate-500">
                    {form.categories.length === 0
                      ? "Categories"
                      : form.categories.map((c) => (
                          <span
                            key={c}
                            className="rounded bg-[#eaf4fb] px-2 py-0.5 text-[12px] text-[#2980b9]"
                          >
                            {c}
                          </span>
                        ))}
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setPendingCategories(form.categories);
                      setCategoryModal(true);
                    }}
                    className="inline-flex h-10 shrink-0 items-center rounded border border-[#2980b9] px-3 text-[13px] font-medium text-[#2980b9] hover:bg-[#f0f7fb]"
                  >
                    Select Categories
                  </button>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <FieldLabel>SKU</FieldLabel>
                  <div className="relative">
                    <TextInput
                      value={form.sku}
                      onChange={(e) => set("sku")(e.target.value)}
                      placeholder="SKU"
                      className="pr-24"
                    />
                    <button
                      type="button"
                      onClick={generateSku}
                      className="absolute right-1 top-1/2 -translate-y-1/2 rounded border border-[#2980b9] px-3 py-1.5 text-[12px] font-medium text-[#2980b9] hover:bg-[#f0f7fb]"
                    >
                      Generate
                    </button>
                  </div>
                </div>
                <div>
                  <FieldLabel required>Unit</FieldLabel>
                  <SelectInput
                    options={UNITS}
                    placeholder="Unit"
                    value={form.unit}
                    onChange={set("unit")}
                  />
                </div>
              </div>
            </div>

            <div>
              <div className="flex min-h-[360px] flex-col items-center justify-center rounded-lg border-2 border-dashed border-[#bfd3e4] bg-[#f7fbfe] px-4 py-8 text-center">
                <span className="material-icons mb-2 text-[42px] text-[#2980b9]">cloud_upload</span>
                <p className="m-0 text-[13px] text-slate-600">Drag and drop files here</p>
                <p className="my-2 text-[12px] text-slate-400">or</p>
                <label className="cursor-pointer rounded bg-[#2980b9] px-4 py-2 text-[13px] font-medium text-white hover:bg-[#2472a4]">
                  Browse for files
                  <input type="file" accept=".jpg,.jpeg,.png" multiple className="hidden" />
                </label>
                <p className="mt-4 mb-0 text-[11px] leading-relaxed text-slate-500">
                  You can add upto 5 images, Maximum file size 2MB
                  <br />
                  Supported Formates: JPG, JPEG &amp; PNG
                </p>
              </div>
            </div>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <CheckRow
              label="Use Fractional Units"
              checked={form.fractionalUnits}
              onChange={set("fractionalUnits")}
            />
            <CheckRow
              label="Returnable Item"
              checked={form.returnable}
              onChange={set("returnable")}
            />
            <CheckRow
              label="Track Inventory"
              checked={form.trackInventory}
              onChange={set("trackInventory")}
            />
          </div>

          {form.trackInventory && (
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <FieldLabel required>Inventory Account</FieldLabel>
                <SelectInput
                  options={ACCOUNTS.inventory}
                  placeholder="Inventory Account"
                  value={form.inventoryAccount}
                  onChange={set("inventoryAccount")}
                />
              </div>
              <div>
                <FieldLabel>Low Stock Point</FieldLabel>
                <TextInput
                  type="number"
                  value={form.lowStockPoint}
                  onChange={(e) => set("lowStockPoint")(e.target.value)}
                  placeholder="Low Stock Point"
                />
              </div>
            </div>
          )}

          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <CheckRow
              label="Serialized Item"
              checked={form.serialized}
              onChange={set("serialized")}
            />
            <CheckRow
              label="Manage Batch"
              checked={form.manageBatch}
              onChange={set("manageBatch")}
            />
            <CheckRow
              label="Include Opening Stock"
              checked={form.openingStock}
              disabled
              onChange={set("openingStock")}
            />
            <CheckRow
              label="Raw Material"
              checked={form.rawMaterial}
              onChange={set("rawMaterial")}
            />
          </div>

          <div className="mt-6 grid gap-6 border-t border-slate-100 pt-5 lg:grid-cols-2">
            <div>
              <CheckRow
                label="Purchasable"
                checked={form.purchasable}
                onChange={set("purchasable")}
              />
              {form.purchasable && (
                <div className="mt-3 space-y-3">
                  <div>
                    <FieldLabel required>Purchasing Price</FieldLabel>
                    <TextInput
                      type="number"
                      value={form.purchasingPrice}
                      onChange={(e) => set("purchasingPrice")(e.target.value)}
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <FieldLabel required>Purchase Account</FieldLabel>
                    <SelectInput
                      options={ACCOUNTS.purchase}
                      placeholder="Purchase Account"
                      value={form.purchaseAccount}
                      onChange={set("purchaseAccount")}
                    />
                  </div>
                  <div>
                    <FieldLabel>Purchasing VAT</FieldLabel>
                    <SelectInput
                      options={ACCOUNTS.vat}
                      placeholder="Purchasing VAT"
                      value={form.purchasingVat}
                      onChange={set("purchasingVat")}
                    />
                  </div>
                </div>
              )}
            </div>

            <div>
              <CheckRow label="Saleable" checked={form.saleable} onChange={set("saleable")} />
              {form.saleable && (
                <div className="mt-3 space-y-3">
                  <div>
                    <FieldLabel required>Selling Price</FieldLabel>
                    <TextInput
                      type="number"
                      value={form.sellingPrice}
                      onChange={(e) => set("sellingPrice")(e.target.value)}
                      placeholder="0.00"
                    />
                  </div>
                  <div>
                    <FieldLabel required>Sales Account</FieldLabel>
                    <SelectInput
                      options={ACCOUNTS.sales}
                      placeholder="Sales Account"
                      value={form.salesAccount}
                      onChange={set("salesAccount")}
                    />
                  </div>
                  <div>
                    <FieldLabel>Selling VAT</FieldLabel>
                    <SelectInput
                      options={ACCOUNTS.vat}
                      placeholder="Selling VAT"
                      value={form.sellingVat}
                      onChange={set("sellingVat")}
                    />
                  </div>
                  <div>
                    <FieldLabel>Selling Discount</FieldLabel>
                    <SelectInput
                      options={ACCOUNTS.discount}
                      placeholder="Selling Discount"
                      value={form.sellingDiscount}
                      onChange={set("sellingDiscount")}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="mt-6 grid gap-4 border-t border-slate-100 pt-5 sm:grid-cols-2 lg:grid-cols-3">
            <CheckRow
              label="Deliverable through Channel"
              checked={form.deliverable}
              onChange={set("deliverable")}
            />
            <div>
              <FieldLabel>Item Weight (KG)</FieldLabel>
              <TextInput
                type="number"
                value={form.weight}
                onChange={(e) => set("weight")(e.target.value)}
                placeholder="0.0"
              />
            </div>
            <div className="flex flex-col gap-3">
              <CheckRow
                label="Available in E-commerce"
                checked={form.ecommerce}
                onChange={set("ecommerce")}
              />
              <CheckRow label="Available in POS" checked={form.pos} onChange={set("pos")} />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 border-t border-slate-200 px-5 py-3">
          <Link
            href="/en/item-config/items"
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

      {categoryModal && (
        <ModalShell
          title="Select Categories"
          onClose={() => setCategoryModal(false)}
          onSave={() => {
            setForm((prev) => ({ ...prev, categories: pendingCategories }));
            setCategoryModal(false);
          }}
        >
          <div className="space-y-2">
            {CATEGORIES.map((c) => (
              <label key={c} className="flex items-center gap-2 text-[13px] text-[#1a557a]">
                <input
                  type="checkbox"
                  checked={pendingCategories.includes(c)}
                  onChange={(e) => {
                    setPendingCategories((prev) =>
                      e.target.checked ? [...prev, c] : prev.filter((x) => x !== c)
                    );
                  }}
                  className="accent-[#2980b9]"
                />
                {c}
              </label>
            ))}
          </div>
        </ModalShell>
      )}
    </div>
  );
}
