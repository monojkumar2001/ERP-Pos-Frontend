"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { inventoryApi, unwrapApiData } from "../../lib/api";

function StatusPill({ value }) {
  const v = String(value || "").toLowerCase().replace(/\s+/g, "");
  let cls = "bg-slate-400 text-white";
  if (["active", "approved", "completed", "received"].includes(v))
    cls = v === "received" ? "bg-[#17a2b8] text-white" : "bg-[#28a745] text-white";
  else if (["draft", "pending", "initiated"].includes(v))
    cls = "bg-[#ffc107] text-[#212529]";
  else if (["requested"].includes(v)) cls = "bg-[#fd7e14] text-white";
  else if (["inactive", "cancelled", "rejected"].includes(v))
    cls = "bg-[#dc3545] text-white";

  return (
    <span className={`inline-flex rounded-md px-2 py-0.5 text-[11px] font-semibold ${cls}`}>
      {value}
    </span>
  );
}

export default function InventoryDetailsPage({ config, record }) {
  const router = useRouter();
  const kind = config?.inventoryKind || "adjustment";
  const api =
    kind === "transfer" ? inventoryApi.warehouseTransfer : inventoryApi.stockAdjustment;
  const backHref =
    config?.backHref ||
    (kind === "transfer"
      ? "/en/inventory/warehouse-transfer-list"
      : "/en/inventory/stock-adjustments");

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    const id = record?.id;
    if (!id) {
      setLoading(false);
      setError("Missing record id.");
      return;
    }
    let cancelled = false;
    setLoading(true);
    api
      .get(id)
      .then((res) => {
        if (!cancelled) setData(unwrapApiData(res));
      })
      .catch((err) => {
        if (!cancelled) setError(err.message || "Failed to load details");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [record?.id, api]);

  const view = useMemo(() => {
    if (!data) return null;
    if (kind === "transfer") {
      return {
        number: data.transfer_number,
        date: data.transfer_date || data.transfer_date_formatted,
        status: data.status,
        source: data.source_warehouse,
        destination: data.destination_warehouse,
        note: data.note,
        lines: (data.lines || []).map((line) => ({
          id: line.id,
          item: line.item,
          source_bin: line.source_bin || "Default",
          destination_bin: line.destination_bin || "Default",
          qty: line.quantity_formatted || line.quantity,
        })),
      };
    }
    const isDecrease = String(data.adjustment_type || "").toLowerCase() === "decrease";
    return {
      number: data.adjustment_number,
      date: data.adjustment_date_formatted || data.adjustment_date,
      status: data.status,
      warehouse: data.warehouse,
      reason: data.adjustment_reason,
      type: data.adjustment_type,
      isDecrease,
      note: data.note,
      lines: (data.lines || []).map((line) => ({
        id: line.id,
        item: line.item || line.item_name,
        cost: line.unit_cost != null ? `৳ ${line.unit_cost}` : "N/A",
        bin: line.bin || "Default",
        qty: `${isDecrease ? "- " : ""}${line.quantity_formatted || line.quantity}`,
      })),
    };
  }, [data, kind]);

  const handleCancel = async () => {
    if (!data?.id || !window.confirm("Cancel this record?")) return;
    setCancelling(true);
    try {
      await api.cancel(data.id);
      router.push(backHref);
    } catch (err) {
      setError(err.message || "Failed to cancel");
    } finally {
      setCancelling(false);
    }
  };

  const isDecrease = view?.isDecrease;
  const canCancel =
    view?.status &&
    (kind === "transfer"
      ? !["Cancelled", "Received"].includes(view.status)
      : !["Cancelled", "Approved"].includes(view.status));

  const pageTitle =
    kind === "transfer"
      ? "Stock Movement Details"
      : isDecrease
        ? "Stock Reduction Adjustment Details"
        : "Stock Increase Adjustment Details";

  if (loading) {
    return (
      <div className="rounded-lg border border-slate-200 bg-white p-10 text-center text-slate-500">
        Loading…
      </div>
    );
  }

  if (error || !view) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-6 text-center text-red-700">
        {error || "Record not found."}{" "}
        <Link href={backHref} className="font-semibold underline">
          Back to list
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-1 text-[13px] text-slate-500">{pageTitle}</div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h1 className="m-0 text-[22px] font-semibold text-[#2c3e50]">{view.number}</h1>
        <div className="flex flex-wrap items-center gap-2">
          {canCancel ? (
            <button
              type="button"
              disabled={cancelling}
              onClick={handleCancel}
              className="inline-flex h-9 items-center rounded border border-[#dc3545] bg-white px-4 text-[13px] font-medium text-[#dc3545] hover:bg-red-50 disabled:opacity-50"
            >
              Cancel
            </button>
          ) : (
            <Link
              href={backHref}
              className="inline-flex h-9 items-center rounded border border-slate-200 bg-white px-4 text-[13px] font-medium text-slate-600 hover:bg-slate-50"
            >
              Back
            </Link>
          )}
        </div>
      </div>

      {error && (
        <div className="mb-3 rounded border border-red-200 bg-red-50 px-3 py-2 text-[13px] text-red-700">
          {error}
        </div>
      )}

      <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-6 grid gap-4 md:grid-cols-2">
          <div className="space-y-2 text-[13px]">
            <div>
              <span className="text-slate-500">
                {kind === "transfer" ? "Transfer Number" : "Adjustment Number"} :{" "}
              </span>
              <span className="font-medium text-[#2c3e50]">{view.number}</span>
            </div>
            <div>
              <span className="text-slate-500">Date : </span>
              <span className="font-medium text-[#2c3e50]">{view.date}</span>
            </div>
            {kind === "transfer" ? (
              <>
                <div>
                  <span className="text-slate-500">Source Warehouse : </span>
                  <span className="font-medium text-[#00a78b]">{view.source}</span>
                </div>
                <div>
                  <span className="text-slate-500">Destination Warehouse : </span>
                  <span className="font-medium text-[#00a78b]">{view.destination}</span>
                </div>
              </>
            ) : (
              <>
                <div>
                  <span className="text-slate-500">Warehouse : </span>
                  <span className="font-medium text-[#2c3e50]">{view.warehouse}</span>
                </div>
                <div>
                  <span className="text-slate-500">Reason : </span>
                  <span className="font-medium text-[#dc3545]">
                    {isDecrease ? `- ${view.reason}` : view.reason}
                  </span>
                </div>
              </>
            )}
            <div className="flex items-center gap-2">
              <span className="text-slate-500">Status : </span>
              <StatusPill value={view.status} />
            </div>
          </div>
          {view.note ? (
            <div className="rounded border border-slate-100 bg-slate-50 p-3 text-[13px] text-slate-600">
              <div className="mb-1 font-medium text-[#2c3e50]">Note</div>
              {view.note}
            </div>
          ) : null}
        </div>

        <div className="overflow-x-auto rounded border border-slate-200">
          <table className="min-w-full text-left text-[13px]">
            <thead className="bg-[#eef5fa] text-[11px] font-semibold uppercase tracking-wide text-[#1a557a]">
              <tr>
                <th className="px-3 py-2">SL NO.</th>
                <th className="px-3 py-2">ITEM</th>
                {kind === "transfer" ? (
                  <>
                    <th className="px-3 py-2">SOURCE BIN</th>
                    <th className="px-3 py-2">DESTINATION BIN</th>
                  </>
                ) : (
                  <>
                    <th className="px-3 py-2">ITEM COST</th>
                    <th className="px-3 py-2">BIN</th>
                  </>
                )}
                <th className="px-3 py-2">QUANTITY</th>
              </tr>
            </thead>
            <tbody>
              {(view.lines || []).map((line, idx) => (
                <tr key={line.id || idx} className="border-t border-slate-100">
                  <td className="px-3 py-3 text-slate-600">{idx + 1}.</td>
                  <td className="px-3 py-3 font-medium text-[#00a78b]">{line.item}</td>
                  {kind === "transfer" ? (
                    <>
                      <td className="px-3 py-3">{line.source_bin}</td>
                      <td className="px-3 py-3">{line.destination_bin}</td>
                    </>
                  ) : (
                    <>
                      <td className="px-3 py-3">{line.cost}</td>
                      <td className="px-3 py-3">{line.bin}</td>
                    </>
                  )}
                  <td
                    className={`px-3 py-3 ${
                      kind === "adjustment" && isDecrease ? "font-medium text-[#dc3545]" : ""
                    }`}
                  >
                    {line.qty}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4">
          <Link
            href={backHref}
            className="text-[13px] font-medium text-[#00a78b] hover:underline"
          >
            ← Back to list
          </Link>
        </div>
      </div>
    </div>
  );
}
