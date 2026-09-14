"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

const UNITS = ["pc", "kg", "ltr", "box", "dozen"];
const MANUFACTURERS = ["selim", "matador", "paper brand"];
const BRANDS = ["Yamaha", "NB", "akij", "Ars nova", "Hamko"];
const COLORS = ["Red", "Blue", "Black", "White"];
const SIZE_TYPES = ["Apparel", "Shoe", "General"];
const SIZES = ["S", "M", "L", "XL", "XXL"];
const ATTRIBUTE_SETS = ["Color Family", "Material", "Warranty", "Origin"];
const CATEGORIES = ["Accessories", "Electronics", "Fashion Item", "Food"];
const ACCOUNTS = {
  inventory: ["Inventory"],
  purchase: ["Cost of Goods Sold"],
  sales: ["Sales"],
  vat: ["VAT 5%", "VAT 15%", "No VAT"],
  discount: ["5%", "10%", "No Discount"],
};

function FieldLabel({ children, required }) {
  return (
    <label className="mb-1.5 flex items-center gap-1 text-[13px] font-medium text-[#1a557a]">
      {children}
      {required && <span className="text-red-500">*</span>}
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

function CheckRow({ label, checked, onChange }) {
  return (
    <label className="flex cursor-pointer items-center gap-2 text-[13px] text-[#1a557a]">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 accent-[#2980b9]"
      />
      {label}
    </label>
  );
}

function ChoiceCard({ selected, title, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex items-center gap-2 rounded-md border px-4 py-2.5 text-[13px] font-medium ${
        selected
          ? "border-[#2980b9] bg-[#f3f9fc] text-[#1a557a]"
          : "border-slate-200 bg-white text-slate-600"
      }`}
    >
      <span
        className={`flex h-4 w-4 items-center justify-center rounded-full border-2 ${
          selected ? "border-[#2980b9] text-[#2980b9]" : "border-slate-300"
        }`}
      >
        {selected ? <span className="material-icons text-[12px]">check</span> : null}
      </span>
      {title}
    </button>
  );
}

export default function AddItemGroupPage() {
  const [saved, setSaved] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [form, setForm] = useState({
    type: "Product",
    name: "",
    shortDescription: "",
    longDescription: "",
    manufacturer: "",
    brand: "",
    color: "",
    sizeType: "",
    size: "",
    attributeSet: "",
    categories: "",
    unit: "",
    fractional: false,
    returnable: false,
    trackInventory: true,
    inventoryAccount: "Inventory",
    serialized: false,
    manageBatch: false,
    rawMaterial: false,
    includeOpeningStock: false,
    purchasable: true,
    purchaseAccount: "Cost of Goods Sold",
    purchaseVat: "",
    saleable: true,
    salesAccount: "Sales",
    sellingVat: "",
    sellingDiscount: "",
    pos: true,
    deliverable: false,
    ecommerce: false,
  });

  const set = (key) => (val) => setForm((prev) => ({ ...prev, [key]: val }));

  const canSave = useMemo(
    () => Boolean(String(form.name || "").trim() && form.unit),
    [form.name, form.unit]
  );

  if (saved) {
    return (
      <div className="rounded-lg border border-green-200 bg-green-50 p-6 text-center text-green-700">
        Item group saved successfully (demo).{" "}
        <Link href="/en/item-config/items" className="font-semibold underline">
          Back to Items
        </Link>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-[#e5e7eb] bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
        <h2 className="m-0 text-[20px] font-semibold text-[#1a557a]">Add Item Group</h2>
        <Link
          href="/en/item-config/items"
          className="rounded p-1 text-slate-500 hover:bg-slate-100"
          aria-label="Close"
        >
          <span className="material-icons text-[22px]">close</span>
        </Link>
      </div>

      <div className="space-y-6 px-5 py-5">
        <div>
          <h3 className="mb-3 text-[15px] font-semibold text-[#1a557a]">Basic Information</h3>
          <div className="mb-4">
            <FieldLabel required>Type</FieldLabel>
            <div className="flex gap-3">
              {["Service", "Product"].map((t) => (
                <ChoiceCard
                  key={t}
                  title={t}
                  selected={form.type === t}
                  onClick={() => set("type")(t)}
                />
              ))}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <FieldLabel required>Item Group Name</FieldLabel>
              <TextInput
                value={form.name}
                onChange={(e) => set("name")(e.target.value)}
                placeholder="Enter item group name"
              />
            </div>
            <div>
              <FieldLabel>Short Description</FieldLabel>
              <TextInput
                value={form.shortDescription}
                onChange={(e) => set("shortDescription")(e.target.value)}
                placeholder="Short description"
              />
            </div>
            <div>
              <FieldLabel>Long Description</FieldLabel>
              <textarea
                rows={3}
                value={form.longDescription}
                onChange={(e) => set("longDescription")(e.target.value)}
                placeholder="Long description"
                className="w-full rounded border border-slate-200 px-3 py-2 text-[13px] outline-none focus:border-[#2980b9]"
              />
            </div>
            <div>
              <FieldLabel>Manufacturers</FieldLabel>
              <SelectInput
                options={MANUFACTURERS}
                placeholder="Select manufacturer"
                value={form.manufacturer}
                onChange={set("manufacturer")}
              />
            </div>
            <div>
              <FieldLabel>Brands</FieldLabel>
              <SelectInput
                options={BRANDS}
                placeholder="Select brand"
                value={form.brand}
                onChange={set("brand")}
              />
            </div>
            <div>
              <FieldLabel>Colors</FieldLabel>
              <SelectInput
                options={COLORS}
                placeholder="Select color"
                value={form.color}
                onChange={set("color")}
              />
            </div>
            <div>
              <FieldLabel>Size Types</FieldLabel>
              <SelectInput
                options={SIZE_TYPES}
                placeholder="Select size type"
                value={form.sizeType}
                onChange={set("sizeType")}
              />
            </div>
            <div>
              <FieldLabel>Sizes</FieldLabel>
              <SelectInput
                options={SIZES}
                placeholder="Select size"
                value={form.size}
                onChange={set("size")}
              />
            </div>
            <div>
              <FieldLabel>Attribute Sets</FieldLabel>
              <SelectInput
                options={ATTRIBUTE_SETS}
                placeholder="Select attribute set"
                value={form.attributeSet}
                onChange={set("attributeSet")}
              />
            </div>
            <div>
              <FieldLabel>Categories</FieldLabel>
              <SelectInput
                options={CATEGORIES}
                placeholder="Select categories"
                value={form.categories}
                onChange={set("categories")}
              />
            </div>
            <div>
              <FieldLabel required>Unit</FieldLabel>
              <SelectInput
                options={UNITS}
                placeholder="Select unit"
                value={form.unit}
                onChange={set("unit")}
              />
            </div>
          </div>

          <div className="mt-4 flex flex-wrap gap-4">
            <CheckRow
              label="Use Fractional Units"
              checked={form.fractional}
              onChange={set("fractional")}
            />
            <CheckRow
              label="Returnable Item"
              checked={form.returnable}
              onChange={set("returnable")}
            />
          </div>

          <div className="mt-5 flex min-h-[160px] flex-col items-center justify-center rounded-lg border-2 border-dashed border-[#9ec4e0] bg-[#f3f9fc] px-4 py-6 text-center">
            <span className="material-icons mb-2 text-[36px] text-[#2980b9]">cloud_upload</span>
            <p className="m-0 text-[13px] text-slate-600">Drag and drop file here or Browse</p>
            <p className="mt-2 mb-0 text-[11px] text-slate-500">
              Up to 5 images · Max 2MB · JPG, JPEG, PNG
            </p>
          </div>
        </div>

        <div className="border-t border-slate-100 pt-5">
          <h3 className="mb-3 text-[15px] font-semibold text-[#1a557a]">Inventory / Purchase / Sale</h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <CheckRow
              label="Track Inventory"
              checked={form.trackInventory}
              onChange={set("trackInventory")}
            />
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
              label="Raw Material"
              checked={form.rawMaterial}
              onChange={set("rawMaterial")}
            />
            <CheckRow
              label="Include Opening Stock"
              checked={form.includeOpeningStock}
              onChange={set("includeOpeningStock")}
            />
            <CheckRow
              label="Purchasable"
              checked={form.purchasable}
              onChange={set("purchasable")}
            />
            <CheckRow label="Saleable" checked={form.saleable} onChange={set("saleable")} />
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {form.trackInventory && (
              <div>
                <FieldLabel required>Inventory Account</FieldLabel>
                <SelectInput
                  options={ACCOUNTS.inventory}
                  placeholder="Inventory Account"
                  value={form.inventoryAccount}
                  onChange={set("inventoryAccount")}
                />
              </div>
            )}
            {form.purchasable && (
              <>
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
                    value={form.purchaseVat}
                    onChange={set("purchaseVat")}
                  />
                </div>
              </>
            )}
            {form.saleable && (
              <>
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
              </>
            )}
          </div>
        </div>

        <div className="border-t border-slate-100 pt-5">
          <h3 className="mb-3 text-[15px] font-semibold text-[#1a557a]">Channels</h3>
          <div className="flex flex-wrap gap-4">
            <CheckRow label="Available in POS" checked={form.pos} onChange={set("pos")} />
            <CheckRow
              label="Deliverable through Channel"
              checked={form.deliverable}
              onChange={set("deliverable")}
            />
            <CheckRow
              label="Available in E-commerce"
              checked={form.ecommerce}
              onChange={set("ecommerce")}
            />
          </div>
        </div>

        <div className="rounded-lg border border-[#cfe3f1] bg-[#f3f9fc] p-4">
          <h3 className="mb-2 text-[15px] font-semibold text-[#1a557a]">Generate Items</h3>
          <p className="mb-3 text-[12px] leading-relaxed text-slate-600">
            Item names are generated from color × size × attribute combinations. Maximum 1,000
            items per generate. After generate, edits here do not update existing items — clear and
            regenerate instead.
          </p>
          <button
            type="button"
            onClick={() => setGenerated(true)}
            className="inline-flex h-9 items-center rounded border border-[#2980b9] bg-white px-4 text-[13px] font-medium text-[#2980b9] hover:bg-[#e8f1f8]"
          >
            Generate Items
          </button>
          {generated && (
            <p className="mt-3 mb-0 text-[13px] text-green-700">
              Demo: variant items would appear here after generation.
            </p>
          )}
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
  );
}
