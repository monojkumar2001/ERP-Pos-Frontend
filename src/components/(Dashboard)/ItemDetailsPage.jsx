"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { masterApi, unwrapApiData } from "../../lib/api";

function StatusPill({ value }) {
  const v = String(value || "").toLowerCase();
  const cls =
    v === "active"
      ? "bg-[#28a745] text-white"
      : v === "inactive"
        ? "bg-[#dc3545] text-white"
        : "bg-slate-400 text-white";
  return (
    <span className={`inline-flex rounded-md px-2 py-0.5 text-[11px] font-semibold ${cls}`}>
      {value}
    </span>
  );
}

function Field({ label, children }) {
  return (
    <div className="flex gap-2 border-b border-dashed border-slate-100 py-2 text-[13px]">
      <span className="min-w-[9rem] text-slate-500">{label}</span>
      <span className="font-medium text-[#2c3e50]">{children}</span>
    </div>
  );
}

export default function ItemDetailsPage({ config, record }) {
  const [item, setItem] = useState(record);
  const [loading, setLoading] = useState(Boolean(record?.id));

  useEffect(() => {
    if (!record?.id) return;
    setLoading(true);
    masterApi.items
      .get(record.id)
      .then((res) => setItem({ ...record, ...unwrapApiData(res) }))
      .catch(() => setItem(record))
      .finally(() => setLoading(false));
  }, [record?.id]);

  const data = useMemo(
    () => ({
      name: item?.item || item?.name || `Item ${item?.id || 1}`,
      code: item?.code || `I-${String(4787 - (item?.id || 1) + 1).padStart(6, "0")}`,
      brand: item?.brand || "N/A",
      group: item?.group || "N/A",
      available: item?.available_stock || "0 pc",
      low: item?.low_stock || "0 pc",
      status: item?.status || "Active",
      salePrice: item?.sale_price || "৳ 120/kg",
      purchasePrice: item?.purchase_price || "৳ 100/kg",
      type: item?.type || "Product",
      manufacturer: item?.manufacturer || "N/A",
      color: item?.color || "N/A",
      size: item?.size || "N/A",
      sku: item?.sku || item?.code || "N/A",
      baseUnit: item?.base_unit || "pc",
      category: item?.category || item?.categories || "N/A",
      ...item,
    }),
    [item]
  );

  if (loading) {
    return (
      <div className="rounded-lg border border-slate-200 bg-white p-10 text-center text-slate-500">
        Loading…
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="m-0 flex flex-wrap items-center gap-2 text-[22px] font-semibold text-[#2c3e50]">
            {data.name}
            <span className="inline-flex items-center rounded-full bg-[#28a745] px-2.5 py-0.5 text-[12px] font-medium text-white">
              {data.available} Available
            </span>
          </h1>
          <div className="mt-1 text-[13px] text-slate-500">[Item Code: {data.code}]</div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            className="inline-flex h-9 items-center rounded border border-[#dc3545] bg-white px-4 text-[13px] font-medium text-[#dc3545] hover:bg-red-50"
          >
            Make Inactive
          </button>
          <Link
            href="/en/item-config/add-item"
            className="inline-flex h-9 items-center rounded border border-[#00a78b] bg-white px-4 text-[13px] font-medium text-[#00a78b] hover:bg-[#e8f1f8]"
          >
            Edit
          </Link>
        </div>
      </div>

      <div className="mb-4 rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <div className="grid gap-6 lg:grid-cols-3">
          <div>
            <h3 className="mb-2 mt-0 text-[15px] font-semibold text-[#2c3e50]">
              Primary information
            </h3>
            <Field label="Item Type">{data.type}</Field>
            <Field label="Manufacturer">{data.manufacturer}</Field>
            <Field label="Brand">{data.brand}</Field>
            <Field label="Color">{data.color}</Field>
            <Field label="Size">{data.size}</Field>
            <Field label="SKU">{data.sku}</Field>
            <Field label="Base Unit">{data.baseUnit}</Field>
            <Field label="Category">{data.category}</Field>
            <div className="mt-3 flex items-center gap-2">
              <StatusPill value={data.status} />
            </div>
          </div>

          <div>
            <div className="mb-3 text-[13px]">
              <div className="mb-1 text-slate-500">Short description</div>
              <div className="rounded border border-slate-200 bg-slate-50 px-3 py-2 text-slate-400">
                No short description
              </div>
            </div>
            <div className="mb-3 text-[13px]">
              <div className="mb-1 text-slate-500">Long description</div>
              <div className="min-h-[5rem] rounded border border-slate-200 bg-slate-50 px-3 py-2 text-slate-400">
                No long description
              </div>
            </div>
            <label className="inline-flex items-center gap-2 text-[13px] text-slate-700">
              <input type="checkbox" defaultChecked className="accent-[#00a78b]" readOnly />
              Deliverable Through Channel
            </label>
          </div>

          <div>
            <div className="mb-3 text-right text-[13px] font-medium text-[#28a745]">
              20% profit on this item
            </div>
            <div className="flex h-40 items-center justify-center rounded border border-dashed border-slate-200 bg-slate-50 text-slate-400">
              <span className="material-icons text-[40px]">image</span>
            </div>
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <div className="grid gap-6 md:grid-cols-3">
          <div>
            <h5 className="mb-2 mt-0 text-[14px] font-semibold text-[#2c3e50]">
              Purchase information
            </h5>
            <Field label="Price">{data.purchasePrice}</Field>
            <Field label="Last Purchasing Price">{data.purchasePrice}</Field>
            <Field label="Account">Cost of Goods Sold</Field>
            <Field label="Ordered">N/A</Field>
            <Field label="Billed">N/A</Field>
          </div>
          <div>
            <h5 className="mb-2 mt-0 text-[14px] font-semibold text-[#2c3e50]">
              Sales information
            </h5>
            <Field label="Price">{data.salePrice}</Field>
            <Field label="Account">Sales</Field>
            <Field label="Ordered">N/A</Field>
            <Field label="Invoiced">N/A</Field>
            <Field label="Delivered">N/A</Field>
          </div>
          <div>
            <h5 className="mb-2 mt-0 text-[14px] font-semibold text-[#2c3e50]">
              Inventory information
            </h5>
            <Field label="Account">Inventory</Field>
            <Field label="Total stock in">{data.available}</Field>
            <Field label="Total stock out">N/A</Field>
            <Field label="Adjustment in">0</Field>
            <Field label="Adjustment out">0</Field>
            <Field label="Low Stock">{data.low}</Field>
          </div>
        </div>

        <div className="mt-5">
          <Link
            href={config?.backHref || "/en/inventory/item-stock"}
            className="text-[13px] font-medium text-[#00a78b] hover:underline"
          >
            ← Back to list
          </Link>
        </div>
      </div>
    </div>
  );
}
