"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  inventoryApi,
  masterApi,
  settingsApi,
  unwrapApiData,
} from "../../lib/api";

const RESOURCE = {
  adjustment: inventoryApi.stockAdjustment,
  transfer: inventoryApi.warehouseTransfer,
  "transfer-request": inventoryApi.warehouseTransfer,
  "transfer-initiate": inventoryApi.warehouseTransfer,
  receive: inventoryApi.warehouseTransfer,
};

function FieldLabel({ children, required }) {
  return (
    <label className="mb-1.5 block text-[13px] font-medium text-[#1a557a]">
      {children}
      {required && <span className="text-red-500"> *</span>}
    </label>
  );
}

function TextInput(props) {
  return (
    <input
      {...props}
      className={`h-10 w-full rounded border border-slate-200 bg-white px-3 text-[13px] text-slate-700 outline-none placeholder:text-slate-400 focus:border-[#00a78b] ${props.className || ""}`}
    />
  );
}

function SelectInput({ options = [], placeholder, value, onChange, optionValue = "id", optionLabel = "name" }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="h-10 w-full rounded border border-slate-200 bg-white px-3 text-[13px] text-slate-700 outline-none focus:border-[#00a78b]"
    >
      <option value="">{placeholder || "Select..."}</option>
      {options.map((o) => {
        const val = typeof o === "object" ? o[optionValue] : o;
        const label = typeof o === "object" ? o[optionLabel] : o;
        return (
          <option key={val} value={val}>
            {label}
          </option>
        );
      })}
    </select>
  );
}

function emptyAdjustmentLine() {
  return { id: Date.now() + Math.random(), item_id: "", bin_location_id: "", quantity: "" };
}

function emptyTransferLine() {
  return { id: Date.now() + Math.random(), item_id: "", source_bin_location_id: "", quantity: "" };
}

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

export default function InventoryFormPage({ config, recordId: pathRecordId }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const kind = config?.inventoryForm || "adjustment";
  const editId = searchParams.get("id") || (pathRecordId ? String(pathRecordId) : null);
  const isEdit = Boolean(editId) && !["transfer-initiate", "receive"].includes(kind);
  const backHref = config?.backHref || "/en/inventory/item-stock";
  const api = RESOURCE[kind];

  const [warehouses, setWarehouses] = useState([]);
  const [items, setItems] = useState([]);
  const [bins, setBins] = useState([]);
  const [reasons, setReasons] = useState([]);
  const [transfer, setTransfer] = useState(null);
  const [adjustmentNumber, setAdjustmentNumber] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [adjustmentForm, setAdjustmentForm] = useState({
    adjustment_date: todayISO(),
    warehouse_id: "",
    adjustment_reason_id: "",
    adjustment_type: "Decrease",
    note: "",
  });
  const [adjustmentLines, setAdjustmentLines] = useState([emptyAdjustmentLine()]);

  const [transferForm, setTransferForm] = useState({
    transfer_date: todayISO(),
    source_warehouse_id: "",
    destination_warehouse_id: "",
    note: "",
  });
  const [transferLines, setTransferLines] = useState([emptyTransferLine()]);
  const [receiveLineBins, setReceiveLineBins] = useState({});

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");

    const loads = [
      masterApi.warehouses.list(),
      masterApi.items.list(),
      masterApi.binLocations.list(),
      settingsApi.adjustmentReasons.list(),
    ];

    if (editId && api) {
      loads.push(api.get(editId));
    }

    Promise.all(loads)
      .then(([whRes, itemsRes, binsRes, reasonsRes, recordRes]) => {
        if (cancelled) return;
        setWarehouses(whRes.rows || []);
        setItems(itemsRes.rows || []);
        setBins(binsRes.rows || []);
        setReasons(reasonsRes.rows || []);

        const record = recordRes ? unwrapApiData(recordRes) : null;
        if (!record) return;

        if (kind === "adjustment") {
          setAdjustmentNumber(record.adjustment_number || "");
          setAdjustmentForm({
            adjustment_date: record.adjustment_date || todayISO(),
            warehouse_id: String(record.warehouse_id || ""),
            adjustment_reason_id: String(record.adjustment_reason_id || ""),
            adjustment_type: record.adjustment_type || "Decrease",
            note: record.note || "",
          });
          setAdjustmentLines(
            (record.lines || []).length
              ? record.lines.map((l) => ({
                  id: l.id || Date.now() + Math.random(),
                  item_id: String(l.item_id || ""),
                  bin_location_id: String(l.bin_location_id || ""),
                  quantity: l.quantity != null ? String(l.quantity) : "",
                }))
              : [emptyAdjustmentLine()]
          );
        } else if (kind === "receive") {
          setTransfer(record);
          const binMap = {};
          (record.lines || []).forEach((l) => {
            binMap[l.id] = String(l.destination_bin_location_id || "");
          });
          setReceiveLineBins(binMap);
        } else if (kind === "transfer-initiate") {
          setTransfer(record);
        } else {
          setTransferForm({
            transfer_date: record.transfer_date_raw || todayISO(),
            source_warehouse_id: String(record.source_warehouse_id || ""),
            destination_warehouse_id: String(record.destination_warehouse_id || ""),
            note: record.note || "",
          });
          setTransferLines(
            (record.lines || []).length
              ? record.lines.map((l) => ({
                  id: l.id || Date.now() + Math.random(),
                  item_id: String(l.item_id || ""),
                  source_bin_location_id: String(l.source_bin_location_id || ""),
                  quantity: l.quantity != null ? String(l.quantity) : "",
                }))
              : [emptyTransferLine()]
          );
        }
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
  }, [kind, editId, api]);

  const sourceBins = useMemo(
    () =>
      bins.filter(
        (b) =>
          !transferForm.source_warehouse_id ||
          String(b.warehouse_id) === String(transferForm.source_warehouse_id)
      ),
    [bins, transferForm.source_warehouse_id]
  );

  const destBins = useMemo(
    () =>
      bins.filter(
        (b) =>
          !transfer?.destination_warehouse_id ||
          String(b.warehouse_id) === String(transfer.destination_warehouse_id)
      ),
    [bins, transfer?.destination_warehouse_id]
  );

  const adjustmentBins = useMemo(
    () =>
      bins.filter(
        (b) =>
          !adjustmentForm.warehouse_id ||
          String(b.warehouse_id) === String(adjustmentForm.warehouse_id)
      ),
    [bins, adjustmentForm.warehouse_id]
  );

  const saveAdjustment = async (approve) => {
    if (!adjustmentForm.adjustment_date || !adjustmentForm.warehouse_id) {
      setError("Date and warehouse are required.");
      return;
    }
    const lines = adjustmentLines
      .filter((l) => l.item_id && Number(l.quantity))
      .map((l) => ({
        item_id: Number(l.item_id),
        bin_location_id: l.bin_location_id ? Number(l.bin_location_id) : null,
        quantity: Number(l.quantity),
      }));
    if (!lines.length) {
      setError("Add at least one line with item and quantity.");
      return;
    }

    setSaving(true);
    setError("");
    try {
      const body = {
        adjustment_date: adjustmentForm.adjustment_date,
        warehouse_id: Number(adjustmentForm.warehouse_id),
        adjustment_reason_id: adjustmentForm.adjustment_reason_id
          ? Number(adjustmentForm.adjustment_reason_id)
          : null,
        adjustment_type: adjustmentForm.adjustment_type,
        note: adjustmentForm.note?.trim() || null,
        lines,
      };
      let id = editId;
      if (isEdit) {
        await api.update(editId, body);
      } else {
        const res = await api.create(body);
        id = unwrapApiData(res)?.id;
      }
      if (approve && id) {
        await api.setStatus(id, "Approved");
      }
      router.push(backHref);
    } catch (err) {
      setError(err.message || "Failed to save adjustment");
    } finally {
      setSaving(false);
    }
  };

  const saveTransfer = async () => {
    if (
      !transferForm.transfer_date ||
      !transferForm.source_warehouse_id ||
      !transferForm.destination_warehouse_id
    ) {
      setError("Date and both warehouses are required.");
      return;
    }
    const lines = transferLines
      .filter((l) => l.item_id && Number(l.quantity))
      .map((l) => ({
        item_id: Number(l.item_id),
        source_bin_location_id: l.source_bin_location_id
          ? Number(l.source_bin_location_id)
          : null,
        quantity: Number(l.quantity),
      }));
    if (!lines.length) {
      setError("Add at least one line with item and quantity.");
      return;
    }

    setSaving(true);
    setError("");
    try {
      const body = {
        transfer_date: transferForm.transfer_date,
        source_warehouse_id: Number(transferForm.source_warehouse_id),
        destination_warehouse_id: Number(transferForm.destination_warehouse_id),
        note: transferForm.note?.trim() || null,
        lines,
      };
      if (isEdit) {
        await api.update(editId, body);
      } else if (kind === "transfer-request") {
        await api.request(body);
      } else {
        await api.create(body);
      }
      router.push(backHref);
    } catch (err) {
      setError(err.message || "Failed to save transfer");
    } finally {
      setSaving(false);
    }
  };

  const confirmInitiate = async () => {
    if (!editId) return;
    setSaving(true);
    setError("");
    try {
      await api.initiate(editId);
      router.push(backHref);
    } catch (err) {
      setError(err.message || "Failed to initiate transfer");
    } finally {
      setSaving(false);
    }
  };

  const confirmReceive = async () => {
    if (!editId) return;
    setSaving(true);
    setError("");
    try {
      const lines = (transfer?.lines || [])
        .filter((l) => receiveLineBins[l.id])
        .map((l) => ({
          id: l.id,
          destination_bin_location_id: Number(receiveLineBins[l.id]),
        }));
      await api.receive(editId, lines.length ? { lines } : {});
      router.push(backHref);
    } catch (err) {
      setError(err.message || "Failed to receive stock");
    } finally {
      setSaving(false);
    }
  };

  const title =
    config?.title ||
    (kind === "adjustment"
      ? "Add Stock Adjustment"
      : kind === "transfer-request"
        ? "Request Stock Movement"
        : kind === "transfer-initiate"
          ? "Initiate Stock Movement"
          : kind === "receive"
            ? "Receive Stock"
            : "Add Stock Movement");

  if (loading) {
    return (
      <div className="rounded-lg border border-slate-200 bg-white p-10 text-center text-slate-500">
        Loading…
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-[#e5e7eb] bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
        <h1 className="m-0 text-[20px] font-semibold text-[#1a557a]">{title}</h1>
        <Link href={backHref} className="rounded p-1 text-slate-500 hover:bg-slate-100" aria-label="Close">
          <span className="material-icons text-[22px]">close</span>
        </Link>
      </div>

      <div className="space-y-6 px-5 py-5">
        {error && (
          <div className="rounded border border-red-200 bg-red-50 px-3 py-2 text-[13px] text-red-700">
            {error}
          </div>
        )}

        {kind === "adjustment" && (
          <>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div>
                <FieldLabel>Adjustment Number</FieldLabel>
                <TextInput
                  readOnly
                  value={isEdit ? adjustmentNumber || "—" : "Auto Generated"}
                />
              </div>
              <div>
                <FieldLabel required>Adjustment Date</FieldLabel>
                <TextInput
                  type="date"
                  value={adjustmentForm.adjustment_date}
                  onChange={(e) =>
                    setAdjustmentForm((p) => ({ ...p, adjustment_date: e.target.value }))
                  }
                />
              </div>
              <div>
                <FieldLabel required>Warehouse</FieldLabel>
                <SelectInput
                  options={warehouses}
                  optionValue="id"
                  optionLabel="name"
                  placeholder="Select Warehouse"
                  value={adjustmentForm.warehouse_id}
                  onChange={(v) => setAdjustmentForm((p) => ({ ...p, warehouse_id: v }))}
                />
              </div>
              <div>
                <FieldLabel required>Adjustment Reason</FieldLabel>
                <SelectInput
                  options={reasons}
                  optionValue="id"
                  optionLabel="name"
                  placeholder="Select Reason"
                  value={adjustmentForm.adjustment_reason_id}
                  onChange={(v) =>
                    setAdjustmentForm((p) => ({ ...p, adjustment_reason_id: v }))
                  }
                />
              </div>
              <div>
                <FieldLabel required>Adjustment Type</FieldLabel>
                <SelectInput
                  options={[
                    { id: "Increase", name: "Increase" },
                    { id: "Decrease", name: "Decrease" },
                  ]}
                  placeholder="Select Type"
                  value={adjustmentForm.adjustment_type}
                  onChange={(v) => setAdjustmentForm((p) => ({ ...p, adjustment_type: v }))}
                />
              </div>
              <div className="sm:col-span-2 lg:col-span-3">
                <FieldLabel>Notes/Terms:</FieldLabel>
                <textarea
                  value={adjustmentForm.note}
                  onChange={(e) => setAdjustmentForm((p) => ({ ...p, note: e.target.value }))}
                  placeholder="Write if you have any notes or terms."
                  className="min-h-[80px] w-full rounded border border-slate-200 px-3 py-2 text-[13px] outline-none focus:border-[#00a78b]"
                />
              </div>
            </div>

            <LinesTable
              title="Adjustment Lines"
              headers={["Item", "Bin Location", "Quantity"]}
              lines={adjustmentLines}
              onAdd={() => setAdjustmentLines((p) => [...p, emptyAdjustmentLine()])}
              onRemove={(id) =>
                setAdjustmentLines((p) => (p.length > 1 ? p.filter((l) => l.id !== id) : p))
              }
              renderRow={(line) => (
                <>
                  <td className="px-3 py-2">
                    <SelectInput
                      options={items}
                      optionValue="id"
                      optionLabel="name"
                      placeholder="Select item"
                      value={line.item_id}
                      onChange={(v) =>
                        setAdjustmentLines((p) =>
                          p.map((l) => (l.id === line.id ? { ...l, item_id: v } : l))
                        )
                      }
                    />
                  </td>
                  <td className="px-3 py-2">
                    <SelectInput
                      options={adjustmentBins}
                      optionValue="id"
                      optionLabel="name"
                      placeholder="Select bin"
                      value={line.bin_location_id}
                      onChange={(v) =>
                        setAdjustmentLines((p) =>
                          p.map((l) => (l.id === line.id ? { ...l, bin_location_id: v } : l))
                        )
                      }
                    />
                  </td>
                  <td className="px-3 py-2">
                    <TextInput
                      type="number"
                      min="0.001"
                      step="0.001"
                      value={line.quantity}
                      onChange={(e) =>
                        setAdjustmentLines((p) =>
                          p.map((l) =>
                            l.id === line.id ? { ...l, quantity: e.target.value } : l
                          )
                        )
                      }
                    />
                  </td>
                </>
              )}
            />

            <ActionBar backHref={backHref} saving={saving}>
              <button
                type="button"
                disabled={saving}
                onClick={() => saveAdjustment(false)}
                className="inline-flex h-10 items-center rounded border border-[#00a78b] bg-white px-4 text-[13px] font-medium text-[#00a78b] hover:bg-[#e8f1f8] disabled:opacity-50"
              >
                Save As Draft
              </button>
              <button
                type="button"
                disabled={saving}
                onClick={() => saveAdjustment(true)}
                className="inline-flex h-10 items-center rounded bg-[#00a78b] px-4 text-[13px] font-medium text-white hover:bg-[#008f77] disabled:opacity-50"
              >
                Approve
              </button>
            </ActionBar>
          </>
        )}

        {(kind === "transfer" || kind === "transfer-request") && (
          <>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div>
                <FieldLabel required>Date</FieldLabel>
                <TextInput
                  type="date"
                  value={transferForm.transfer_date}
                  onChange={(e) =>
                    setTransferForm((p) => ({ ...p, transfer_date: e.target.value }))
                  }
                />
              </div>
              <div>
                <FieldLabel required>Source Warehouse</FieldLabel>
                <SelectInput
                  options={warehouses}
                  optionValue="id"
                  optionLabel="name"
                  placeholder="Source Warehouse"
                  value={transferForm.source_warehouse_id}
                  onChange={(v) =>
                    setTransferForm((p) => ({ ...p, source_warehouse_id: v }))
                  }
                />
              </div>
              <div>
                <FieldLabel required>Destination Warehouse</FieldLabel>
                <SelectInput
                  options={warehouses.filter(
                    (w) => String(w.id) !== String(transferForm.source_warehouse_id)
                  )}
                  optionValue="id"
                  optionLabel="name"
                  placeholder="Destination Warehouse"
                  value={transferForm.destination_warehouse_id}
                  onChange={(v) =>
                    setTransferForm((p) => ({ ...p, destination_warehouse_id: v }))
                  }
                />
              </div>
              <div className="sm:col-span-2 lg:col-span-3">
                <FieldLabel>Note</FieldLabel>
                <textarea
                  value={transferForm.note}
                  onChange={(e) => setTransferForm((p) => ({ ...p, note: e.target.value }))}
                  placeholder="Notes"
                  className="min-h-[80px] w-full rounded border border-slate-200 px-3 py-2 text-[13px] outline-none focus:border-[#00a78b]"
                />
              </div>
            </div>

            <LinesTable
              title="Transfer Lines"
              headers={["Item", "Source Bin", "Quantity"]}
              lines={transferLines}
              onAdd={() => setTransferLines((p) => [...p, emptyTransferLine()])}
              onRemove={(id) =>
                setTransferLines((p) => (p.length > 1 ? p.filter((l) => l.id !== id) : p))
              }
              renderRow={(line) => (
                <>
                  <td className="px-3 py-2">
                    <SelectInput
                      options={items}
                      optionValue="id"
                      optionLabel="name"
                      placeholder="Select item"
                      value={line.item_id}
                      onChange={(v) =>
                        setTransferLines((p) =>
                          p.map((l) => (l.id === line.id ? { ...l, item_id: v } : l))
                        )
                      }
                    />
                  </td>
                  <td className="px-3 py-2">
                    <SelectInput
                      options={sourceBins}
                      optionValue="id"
                      optionLabel="name"
                      placeholder="Select bin"
                      value={line.source_bin_location_id}
                      onChange={(v) =>
                        setTransferLines((p) =>
                          p.map((l) =>
                            l.id === line.id ? { ...l, source_bin_location_id: v } : l
                          )
                        )
                      }
                    />
                  </td>
                  <td className="px-3 py-2">
                    <TextInput
                      type="number"
                      min="0.001"
                      step="0.001"
                      value={line.quantity}
                      onChange={(e) =>
                        setTransferLines((p) =>
                          p.map((l) =>
                            l.id === line.id ? { ...l, quantity: e.target.value } : l
                          )
                        )
                      }
                    />
                  </td>
                </>
              )}
            />

            <ActionBar backHref={backHref} saving={saving}>
              <button
                type="button"
                disabled={saving}
                onClick={saveTransfer}
                className="inline-flex h-10 items-center rounded bg-[#00a78b] px-4 text-[13px] font-medium text-white hover:bg-[#008f77] disabled:opacity-50"
              >
                Save
              </button>
            </ActionBar>
          </>
        )}

        {kind === "transfer-initiate" && transfer && (
          <>
            <div className="grid gap-3 text-[13px] sm:grid-cols-2">
              <InfoRow label="Transfer Number" value={transfer.transfer_number} />
              <InfoRow label="Date" value={transfer.transfer_date} />
              <InfoRow label="Source Warehouse" value={transfer.source_warehouse} />
              <InfoRow label="Destination Warehouse" value={transfer.destination_warehouse} />
              <InfoRow label="Status" value={transfer.status} />
            </div>
            <LinesTable
              title="Lines"
              headers={["Item", "Quantity"]}
              lines={transfer.lines || []}
              readOnly
              renderRow={(line) => (
                <>
                  <td className="px-3 py-3 font-medium text-[#00a78b]">{line.item}</td>
                  <td className="px-3 py-3">{line.quantity_formatted || line.quantity}</td>
                </>
              )}
            />
            <ActionBar backHref={backHref} saving={saving}>
              <button
                type="button"
                disabled={saving}
                onClick={confirmInitiate}
                className="inline-flex h-10 items-center rounded bg-[#00a78b] px-4 text-[13px] font-medium text-white hover:bg-[#008f77] disabled:opacity-50"
              >
                Confirm Initiate
              </button>
            </ActionBar>
          </>
        )}

        {kind === "receive" && transfer && (
          <>
            <div className="grid gap-3 text-[13px] sm:grid-cols-2">
              <InfoRow label="Transfer Number" value={transfer.transfer_number} />
              <InfoRow label="Date" value={transfer.transfer_date} />
              <InfoRow label="Source Warehouse" value={transfer.source_warehouse} />
              <InfoRow label="Destination Warehouse" value={transfer.destination_warehouse} />
            </div>
            <LinesTable
              title="Receive Lines"
              headers={["Item", "Quantity", "Destination Bin"]}
              lines={transfer.lines || []}
              readOnly
              renderRow={(line) => (
                <>
                  <td className="px-3 py-3 font-medium text-[#00a78b]">{line.item}</td>
                  <td className="px-3 py-3">{line.quantity_formatted || line.quantity}</td>
                  <td className="px-3 py-2">
                    <SelectInput
                      options={destBins}
                      optionValue="id"
                      optionLabel="name"
                      placeholder="Select bin"
                      value={receiveLineBins[line.id] || ""}
                      onChange={(v) =>
                        setReceiveLineBins((p) => ({ ...p, [line.id]: v }))
                      }
                    />
                  </td>
                </>
              )}
            />
            <ActionBar backHref={backHref} saving={saving}>
              <button
                type="button"
                disabled={saving}
                onClick={confirmReceive}
                className="inline-flex h-10 items-center rounded bg-[#00a78b] px-4 text-[13px] font-medium text-white hover:bg-[#008f77] disabled:opacity-50"
              >
                Receive Stock
              </button>
            </ActionBar>
          </>
        )}
      </div>
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div>
      <span className="text-slate-500">{label}: </span>
      <span className="font-medium text-[#1a557a]">{value || "—"}</span>
    </div>
  );
}

function LinesTable({ title, headers, lines, onAdd, onRemove, renderRow, readOnly }) {
  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <span className="text-[13px] font-semibold uppercase tracking-wide text-[#1a557a]">
          {title}
        </span>
        {!readOnly && onAdd && (
          <button
            type="button"
            onClick={onAdd}
            className="text-[13px] font-medium text-[#00a78b] hover:underline"
          >
            Add Line
          </button>
        )}
      </div>
      <div className="overflow-x-auto rounded border border-[#e5e7eb]">
        <table className="w-full min-w-[640px] text-left text-[13px]">
          <thead className="bg-[#e8f1f8] text-[11px] font-semibold uppercase text-[#1a557a]">
            <tr>
              {headers.map((h) => (
                <th key={h} className="px-3 py-2.5">
                  {h}
                </th>
              ))}
              {!readOnly && <th className="w-10" />}
            </tr>
          </thead>
          <tbody>
            {lines.map((line) => (
              <tr key={line.id} className="border-t border-[#eef1f4]">
                {renderRow(line)}
                {!readOnly && onRemove && (
                  <td className="px-2 py-2">
                    <button
                      type="button"
                      onClick={() => onRemove(line.id)}
                      className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-red-500"
                      aria-label="Remove line"
                    >
                      <i className="fas fa-times text-[12px]" />
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ActionBar({ backHref, saving, children }) {
  return (
    <div className="flex flex-wrap justify-end gap-2 border-t border-slate-100 pt-4">
      <Link
        href={backHref}
        className="inline-flex h-10 items-center rounded border border-slate-300 bg-white px-4 text-[13px] font-medium text-[#1a557a] hover:bg-slate-50"
      >
        Cancel
      </Link>
      {children}
    </div>
  );
}
