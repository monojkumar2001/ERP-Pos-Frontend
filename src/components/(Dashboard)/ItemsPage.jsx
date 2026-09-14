"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import DataTable from "./DataTable";

const CHECKBOX_FILTERS = [
  "Serialized",
  "Batched",
  "Saleable",
  "Purchaseable",
  "Returnable",
  "Non-Stockable",
  "Raw Material",
];

const ITEM_COLUMNS = [
  { key: "name", label: "NAME", type: "link", showIcon: true },
  { key: "code", label: "CODE", type: "link" },
  { key: "categories", label: "CATEGORIES" },
  { key: "type", label: "TYPE" },
  { key: "brand", label: "BRAND" },
  { key: "color", label: "COLOR" },
  { key: "size", label: "SIZE" },
  { key: "sale_price", label: "SALE PRICE" },
  { key: "available_stock", label: "AVAILABLE STOCK" },
  { key: "status", label: "STATUS", type: "status" },
  { key: "action", label: "ACTION", type: "action" },
];

const GROUP_COLUMNS = [
  { key: "name", label: "NAME", type: "link" },
  { key: "categories", label: "CATEGORIES" },
  { key: "type", label: "TYPE" },
  { key: "brand", label: "BRAND" },
  { key: "available_stock", label: "AVAILABE STOCK" },
  { key: "status", label: "STATUS", type: "status" },
  { key: "action", label: "ACTION", type: "action" },
];

const ITEM_ROWS = [
  {
    id: 1,
    name: "Katari Rice",
    code: "I-004821",
    categories: "N/A",
    type: "Product",
    brand: "তীর",
    color: "N/A",
    size: "N/A",
    sale_price: "৳ 120",
    available_stock: "497 kg",
    status: "Active",
  },
  {
    id: 2,
    name: "Pusti Nababibhog Steam Katari Rice",
    code: "I-004820",
    categories: "N/A",
    type: "Product",
    brand: "NB",
    color: "N/A",
    size: "N/A",
    sale_price: "৳ 120",
    available_stock: "25001 kg",
    status: "Active",
  },
  {
    id: 3,
    name: "Jersey | Manufactured Item",
    code: "I-004819",
    categories: "N/A",
    type: "Product",
    brand: "N/A",
    color: "N/A",
    size: "N/A",
    sale_price: "৳ 1,000",
    available_stock: "7 pc",
    status: "Active",
  },
  {
    id: 4,
    name: "Fabric | Raw Material",
    code: "I-004818",
    categories: "N/A",
    type: "Product",
    brand: "N/A",
    color: "N/A",
    size: "N/A",
    sale_price: "৳ 0",
    available_stock: "39 sht",
    status: "Active",
  },
  {
    id: 5,
    name: "Expiry Product 1 (Batch)",
    code: "I-004817",
    categories: "N/A",
    type: "Product",
    brand: "N/A",
    color: "N/A",
    size: "N/A",
    sale_price: "৳ 1,000",
    available_stock: "0 pc",
    status: "Active",
  },
  {
    id: 6,
    name: "TP Link",
    code: "I-004787",
    categories: "N/A",
    type: "Product",
    brand: "TP Link",
    color: "N/A",
    size: "N/A",
    sale_price: "৳ 2,200",
    available_stock: "49 pc",
    status: "Active",
  },
  {
    id: 7,
    name: "Vsol-Xpon-ONU (Serialized)",
    code: "I-004786",
    categories: "N/A",
    type: "Product",
    brand: "N/A",
    color: "N/A",
    size: "N/A",
    sale_price: "৳ 1,150",
    available_stock: "9 pc",
    status: "Active",
  },
  {
    id: 8,
    name: "Ceiling Fan",
    code: "I-004780",
    categories: "Electronics",
    type: "Product",
    brand: "Walton",
    color: "White",
    size: "N/A",
    sale_price: "৳ 3,500",
    available_stock: "22 pc",
    status: "Active",
  },
];

const GROUP_ROWS = [
  {
    id: 101,
    name: "Charizma Summer Lawn (15 items)",
    categories: "N/A",
    type: "Product",
    brand: "Pakistani Dress",
    available_stock: "10 pc",
    status: "Active",
  },
  {
    id: 102,
    name: "সয়াবিন তেল (4 items)",
    categories: "N/A",
    type: "Product",
    brand: "তীর",
    available_stock: "45 pc",
    status: "Active",
  },
  {
    id: 103,
    name: "Brake Pad (4 items)",
    categories: "N/A",
    type: "Product",
    brand: "Yamaha",
    available_stock: "296 pc",
    status: "Active",
  },
  {
    id: 104,
    name: "Radical (4 items)",
    categories: "N/A",
    type: "Product",
    brand: "N/A",
    available_stock: "46 pc",
    status: "Active",
  },
  {
    id: 105,
    name: "Hamko (4 items)",
    categories: "N/A",
    type: "Product",
    brand: "Hamko",
    available_stock: "61 pc",
    status: "Active",
  },
  {
    id: 106,
    name: "Light Bundle (8 items)",
    categories: "Electronics",
    type: "Product",
    brand: "N/A",
    available_stock: "120 pc",
    status: "Active",
  },
];

function FilterSelect({ label, placeholder, options, value, onChange }) {
  return (
    <div className="min-w-0">
      <label className="mb-1 block text-[12px] font-medium text-[#1a557a]">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-9 w-full rounded border border-slate-200 bg-white px-2 text-[13px] text-slate-700 outline-none focus:border-[#2980b9]"
      >
        <option value="">{placeholder}</option>
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    </div>
  );
}

export default function ItemsPage() {
  const router = useRouter();
  const [tab, setTab] = useState("items");
  const [itemRows, setItemRows] = useState(ITEM_ROWS);
  const [groupRows, setGroupRows] = useState(GROUP_ROWS);
  const [checks, setChecks] = useState(() =>
    Object.fromEntries(CHECKBOX_FILTERS.map((c) => [c, false]))
  );
  const [filters, setFilters] = useState({
    category: "",
    available_in: "",
    item_type: "",
    brand: "",
    status: "Active",
  });

  const isGroups = tab === "groups";
  const rows = isGroups ? groupRows : itemRows;
  const setRows = isGroups ? setGroupRows : setItemRows;

  const rowActions = useMemo(() => {
    const setStatus = (row, status) =>
      setRows((prev) => prev.map((r) => (r.id === row.id ? { ...r, status } : r)));

    const base = [
      {
        key: "details",
        label: "Details",
        onClick: (row) =>
          router.push(
            isGroups
              ? `/en/item-config/add-item-group?mode=details&id=${row.id}`
              : `/en/item-config/add-item?mode=details&id=${row.id}`
          ),
      },
      {
        key: "edit",
        label: "Edit",
        onClick: (row) =>
          router.push(
            isGroups
              ? `/en/item-config/add-item-group?mode=edit&id=${row.id}`
              : `/en/item-config/add-item?mode=edit&id=${row.id}`
          ),
      },
      {
        key: "inactive",
        label: (row) =>
          String(row.status).toLowerCase() === "inactive" ? "Make Active" : "Make Inactive",
        onClick: (row) =>
          setStatus(
            row,
            String(row.status).toLowerCase() === "inactive" ? "Active" : "Inactive"
          ),
      },
      {
        key: "delete",
        label: "Delete",
        onClick: (row) => setRows((prev) => prev.filter((r) => r.id !== row.id)),
      },
    ];

    if (isGroups) {
      base.push({
        key: "add-item",
        label: "Add Item",
        onClick: () => router.push("/en/item-config/add-item"),
      });
    } else {
      base.push({
        key: "edit-opening-stock",
        label: "Edit Opening Stock",
        getDisabled: (row) => String(row.available_stock || "").startsWith("0 "),
      });
    }

    return base;
  }, [isGroups, router, setRows]);

  const clearFilters = () => {
    setFilters({
      category: "",
      available_in: "",
      item_type: "",
      brand: "",
      status: "",
    });
    setChecks(Object.fromEntries(CHECKBOX_FILTERS.map((c) => [c, false])));
  };

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="inline-flex overflow-hidden rounded-full border border-[#2980b9]">
          <button
            type="button"
            onClick={() => setTab("items")}
            className={`h-9 px-5 text-[13px] font-medium transition-colors ${
              !isGroups
                ? "bg-[#2980b9] text-white"
                : "bg-white text-[#2980b9] hover:bg-[#f0f7fb]"
            }`}
          >
            Items
          </button>
          <button
            type="button"
            onClick={() => setTab("groups")}
            className={`h-9 px-5 text-[13px] font-medium transition-colors ${
              isGroups
                ? "bg-[#2980b9] text-white"
                : "bg-white text-[#2980b9] hover:bg-[#f0f7fb]"
            }`}
          >
            Item Groups
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            className="inline-flex h-9 items-center gap-1.5 rounded-full border border-[#2980b9] bg-white px-4 text-[13px] font-medium text-[#2980b9] hover:bg-[#f0f7fb]"
          >
            <span className="material-icons text-[16px]">sync</span>
            Sync
          </button>
          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-[#2980b9] bg-white text-[#2980b9] hover:bg-[#f0f7fb]"
            aria-label="Download"
          >
            <span className="material-icons text-[18px]">file_download</span>
          </button>
          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded-full bg-[#2980b9] text-white hover:bg-[#2472a4]"
            aria-label="Upload"
          >
            <span className="material-icons text-[18px]">file_upload</span>
          </button>
          <Link
            href={isGroups ? "/en/item-config/add-item-group" : "/en/item-config/add-item"}
            className="inline-flex h-9 items-center rounded-full border border-[#2980b9] bg-white px-4 text-[13px] font-medium text-[#2980b9] hover:bg-[#f0f7fb]"
          >
            {isGroups ? "Add Group Item" : "Add Single Item"}
          </Link>
        </div>
      </div>

      <div className="mb-3 rounded-lg border border-slate-200 bg-white p-4">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          <FilterSelect
            label="Categories"
            placeholder="Select Item Categories"
            options={["Food", "Electronics", "Fashion Item", "Accessories"]}
            value={filters.category}
            onChange={(v) => setFilters((s) => ({ ...s, category: v }))}
          />
          <FilterSelect
            label="Available in"
            placeholder="ex: Pos, Ecommerce"
            options={["POS", "Ecommerce", "POS & Ecommerce"]}
            value={filters.available_in}
            onChange={(v) => setFilters((s) => ({ ...s, available_in: v }))}
          />
          <FilterSelect
            label="Item Type"
            placeholder="ex: Product, Service"
            options={["Product", "Service"]}
            value={filters.item_type}
            onChange={(v) => setFilters((s) => ({ ...s, item_type: v }))}
          />
          <FilterSelect
            label="Brand"
            placeholder="ex: Apple, Samsung"
            options={["তীর", "NB", "TP Link", "Yamaha", "Hamko", "Walton"]}
            value={filters.brand}
            onChange={(v) => setFilters((s) => ({ ...s, brand: v }))}
          />
          <FilterSelect
            label="Status"
            placeholder="ex: Active, Inactive"
            options={["Active", "Inactive"]}
            value={filters.status}
            onChange={(v) => setFilters((s) => ({ ...s, status: v }))}
          />
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap gap-x-4 gap-y-2">
            {CHECKBOX_FILTERS.map((label) => (
              <label
                key={label}
                className="inline-flex items-center gap-2 text-[13px] text-[#1a557a]"
              >
                <input
                  type="checkbox"
                  checked={Boolean(checks[label])}
                  onChange={(e) =>
                    setChecks((s) => ({ ...s, [label]: e.target.checked }))
                  }
                  className="h-4 w-4 accent-[#2980b9]"
                />
                {label}
              </label>
            ))}
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              className="h-8 rounded bg-[#2980b9] px-4 text-[12px] font-medium text-white hover:bg-[#2472a4]"
            >
              Apply Filter
            </button>
            <button
              type="button"
              onClick={clearFilters}
              className="h-8 rounded border border-[#2980b9] bg-white px-4 text-[12px] font-medium text-[#2980b9] hover:bg-[#e8f1f8]"
            >
              Clear Filter
            </button>
          </div>
        </div>
      </div>

      <DataTable
        columns={isGroups ? GROUP_COLUMNS : ITEM_COLUMNS}
        rows={rows}
        totalEntries={rows.length}
        rowActions={rowActions}
      />
    </div>
  );
}
