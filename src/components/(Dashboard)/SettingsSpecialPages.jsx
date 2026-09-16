"use client";

import { useEffect, useMemo, useState } from "react";
import PageHeader from "./PageHeader";
import DataTable from "./DataTable";
import { masterApi, settingsApi, unwrapApiData } from "../../lib/api";

export function BinLocationsPage({ config }) {
  const [warehouses, setWarehouses] = useState([]);
  const [allBins, setAllBins] = useState([]);
  const [warehouse, setWarehouse] = useState("");
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  const columns = useMemo(
    () => [
      { key: "sl", label: "#" },
      { key: "name", label: "NAME" },
      { key: "action", label: "ACTION", type: "action" },
    ],
    []
  );

  useEffect(() => {
    setLoading(true);
    Promise.all([masterApi.warehouses.list(), masterApi.binLocations.list()])
      .then(([wh, bins]) => {
        setWarehouses(wh.rows || []);
        setAllBins(bins.rows || []);
      })
      .catch(() => {
        setWarehouses([]);
        setAllBins([]);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!warehouse) {
      setRows([]);
      return;
    }
    const wh = warehouses.find((w) => w.name === warehouse);
    const filtered = wh ? allBins.filter((b) => b.warehouse_id === wh.id) : [];
    setRows(filtered.map((b, i) => ({ id: b.id, sl: i + 1, name: b.name })));
  }, [warehouse, warehouses, allBins]);

  function onWarehouseChange(value) {
    setWarehouse(value);
  }

  return (
    <div>
      <PageHeader
        title={config?.title || "Bin Locations"}
        addLabel={warehouse ? "Add Bin Location" : ""}
        addDisabled={!warehouse}
        showExport={false}
      />
      <div className="mb-4 max-w-sm rounded-lg border border-slate-200 bg-white p-4">
        <label className="mb-1 block text-[13px] font-medium text-slate-600">Warehouse</label>
        <select
          value={warehouse}
          onChange={(e) => onWarehouseChange(e.target.value)}
          className="h-9 w-full rounded border border-slate-200 bg-white px-2 text-[13px] outline-none focus:border-[#00a78b]"
        >
          <option value="">Select Warehouse</option>
          {warehouses.map((w) => (
            <option key={w.id} value={w.name}>
              {w.name}
            </option>
          ))}
        </select>
      </div>
      {loading ? (
        <div className="rounded-lg border border-slate-200 bg-white p-10 text-center text-[13px] text-slate-500">
          Loading…
        </div>
      ) : warehouse ? (
        <DataTable
          columns={columns}
          rows={rows}
          totalEntries={rows.length}
          rowActions={[{ key: "edit", label: "Edit" }, { key: "delete", label: "Delete" }]}
        />
      ) : (
        <div className="rounded-lg border border-dashed border-slate-200 bg-white p-10 text-center text-[13px] text-slate-500">
          Select a warehouse to view bin locations
        </div>
      )}
    </div>
  );
}

function mapChannelCard(row) {
  const creds = row.credentials || {};
  return {
    id: row.id,
    name: row.name || "",
    enabled: String(row.status).toLowerCase() !== "inactive",
    clientId: creds.client_id || creds.clientId || "",
    clientSecret: creds.client_secret || creds.clientSecret || "",
    email: creds.email || "",
    password: creds.password || "",
  };
}

export function DeliveryChannelsPage({ config }) {
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    setError("");
    settingsApi.deliveryChannels
      .list()
      .then(async (data) => {
        const rows = data.rows || [];
        const detailed = await Promise.all(
          rows.map(async (row) => {
            try {
              const res = await settingsApi.deliveryChannels.get(row.id);
              return mapChannelCard({ ...row, ...unwrapApiData(res) });
            } catch {
              return mapChannelCard(row);
            }
          })
        );
        setCards(detailed);
      })
      .catch((err) => {
        setError(err.message || "Failed to load delivery channels");
        setCards([]);
      })
      .finally(() => setLoading(false));
  }, []);

  function update(id, key, value) {
    setCards((prev) => prev.map((c) => (c.id === id ? { ...c, [key]: value } : c)));
  }

  async function saveCard(card) {
    setSavingId(card.id);
    setMessage("");
    setError("");
    try {
      await settingsApi.deliveryChannels.update(card.id, {
        name: card.name,
        provider: card.name,
        status: card.enabled ? "Active" : "Inactive",
        credentials: {
          client_id: card.clientId,
          client_secret: card.clientSecret,
          email: card.email,
          password: card.password,
        },
      });
      setMessage(`${card.name} updated`);
      setTimeout(() => setMessage(""), 2500);
    } catch (err) {
      setError(err.message || "Failed to update delivery channel");
    } finally {
      setSavingId(null);
    }
  }

  return (
    <div>
      <PageHeader
        title={config?.title || "Delivery Channels"}
        addLabel="Add New Channel"
        showExport={false}
      />
      {error ? (
        <div className="mb-3 rounded border border-red-200 bg-red-50 px-3 py-2 text-[13px] text-red-700">
          {error}
        </div>
      ) : null}
      {message ? (
        <div className="mb-3 rounded border border-green-200 bg-green-50 px-3 py-2 text-[13px] text-green-700">
          {message}
        </div>
      ) : null}
      {loading ? (
        <div className="rounded-lg border border-slate-200 bg-white p-10 text-center text-[13px] text-slate-500">
          Loading…
        </div>
      ) : cards.length === 0 ? (
        <div className="rounded-lg border border-dashed border-slate-200 bg-white p-10 text-center text-[13px] text-slate-500">
          No delivery channels configured
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {cards.map((card) => (
            <div
              key={card.id}
              className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="mb-4 flex items-center justify-between gap-3">
                <h3 className="m-0 text-[15px] font-semibold text-[#2c3e50]">{card.name}</h3>
                <label className="inline-flex items-center gap-2 text-[12px] text-slate-600">
                  <input
                    type="checkbox"
                    checked={card.enabled}
                    onChange={(e) => update(card.id, "enabled", e.target.checked)}
                    className="accent-[#00a78b]"
                  />
                  Enabled
                </label>
              </div>
              <div className="space-y-3 text-[13px]">
                {[
                  ["clientId", "Client ID / API Key *"],
                  ["clientSecret", "Client Secret / Secret Key *"],
                  ["email", "Client Email"],
                  ["password", "Client Password"],
                ].map(([key, label]) => (
                  <div key={key}>
                    <label className="mb-1 block text-slate-600">{label}</label>
                    <input
                      type={key === "password" ? "password" : "text"}
                      value={card[key]}
                      onChange={(e) => update(card.id, key, e.target.value)}
                      className="h-9 w-full rounded border border-slate-200 px-2 outline-none focus:border-[#00a78b]"
                    />
                  </div>
                ))}
              </div>
              <div className="mt-4 flex items-center gap-3">
                <button
                  type="button"
                  disabled={savingId === card.id}
                  onClick={() => saveCard(card)}
                  className="inline-flex h-9 items-center rounded bg-[#00a78b] px-4 text-[13px] font-medium text-white hover:bg-[#008f77] disabled:cursor-not-allowed disabled:bg-slate-300"
                >
                  {savingId === card.id ? "Saving…" : "Update"}
                </button>
                <button type="button" className="text-[13px] text-[#00a78b] hover:underline">
                  Check Balance
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function TemplateSettingsPage({ config }) {
  const categories = [
    { name: "Sales Quotation", count: 4 },
    { name: "Sales Order", count: 4 },
    { name: "Sales Delivery", count: 1 },
    { name: "Sales Invoice", count: 4 },
    { name: "Sales Return", count: 1 },
    { name: "Sales Payment", count: 1 },
    { name: "Purchase Order", count: 1 },
    { name: "Purchase Bill", count: 1 },
  ];

  return (
    <div>
      <PageHeader title={config?.title || "Template Setting"} showExport={false} />
      <div className="space-y-6">
        {categories.map((cat) => (
          <div key={cat.name}>
            <h3 className="mb-3 mt-0 text-[14px] font-semibold text-[#2c3e50]">
              {cat.name}{" "}
              <span className="font-normal text-slate-400">({cat.count})</span>
            </h3>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {Array.from({ length: Math.min(cat.count, 4) }, (_, i) => (
                <div
                  key={i}
                  className="rounded-lg border border-slate-200 bg-white p-3 shadow-sm"
                >
                  <div className="mb-3 flex h-28 items-center justify-center rounded bg-slate-50 text-slate-400">
                    <span className="material-icons text-[36px]">description</span>
                  </div>
                  <div className="mb-2 text-[12px] font-medium text-[#2c3e50]">
                    Template {i + 1}
                    {i === 0 ? (
                      <span className="ml-2 rounded bg-[#28a745] px-1.5 py-0.5 text-[10px] text-white">
                        Default
                      </span>
                    ) : null}
                  </div>
                  <div className="flex flex-wrap gap-2 text-[11px]">
                    {i !== 0 ? (
                      <button type="button" className="text-[#00a78b] hover:underline">
                        Set as default
                      </button>
                    ) : null}
                    <button type="button" className="text-[#00a78b] hover:underline">
                      Edit
                    </button>
                    <button type="button" className="text-[#00a78b] hover:underline">
                      Preview
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const UOM_CATEGORIES = {
  Paper: ["Sheet", "Quire", "Ream"],
  Quantity: ["Piece", "Dozen", "Gross"],
  Time: ["Second", "Minute", "Hour", "Day"],
  Weight: ["Gram", "Kg", "Ton"],
  Volume: ["ML", "Liter"],
  Area: ["Sq.ft", "Sq.m"],
  Temperature: ["Celsius", "Fahrenheit"],
  Length: ["MM", "CM", "Meter", "Inch", "Foot"],
};

export function UomConversionsPage({ config }) {
  const [open, setOpen] = useState("Paper");
  const [fromUom, setFromUom] = useState("Sheet");
  const [toUom, setToUom] = useState("Quire");
  const [unit, setUnit] = useState("1");

  return (
    <div>
      <PageHeader
        title={config?.title || "UoM Conversions"}
        addLabel="Add Unit"
        showExport={false}
      />
      <div className="mb-4 rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="mb-3 mt-0 text-[15px] font-semibold text-[#2c3e50]">
          Unit of Measurement Types
        </h3>
        <div className="grid gap-3 md:grid-cols-4">
          <div>
            <label className="mb-1 block text-[12px] text-slate-600">From UOM</label>
            <select
              value={fromUom}
              onChange={(e) => setFromUom(e.target.value)}
              className="h-9 w-full rounded border border-slate-200 px-2 text-[13px]"
            >
              {Object.values(UOM_CATEGORIES)
                .flat()
                .map((u) => (
                  <option key={u}>{u}</option>
                ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-[12px] text-slate-600">Unit</label>
            <input
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              className="h-9 w-full rounded border border-slate-200 px-2 text-[13px]"
              placeholder="Unit"
            />
          </div>
          <div>
            <label className="mb-1 block text-[12px] text-slate-600">To UOM</label>
            <select
              value={toUom}
              onChange={(e) => setToUom(e.target.value)}
              className="h-9 w-full rounded border border-slate-200 px-2 text-[13px]"
            >
              {Object.values(UOM_CATEGORIES)
                .flat()
                .map((u) => (
                  <option key={u}>{u}</option>
                ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-[12px] text-slate-600">Converted Unit</label>
            <input
              value={fromUom === "Sheet" && toUom === "Quire" ? "0.04" : ""}
              readOnly
              className="h-9 w-full rounded border border-slate-200 bg-slate-50 px-2 text-[13px]"
              placeholder="Unit"
            />
          </div>
        </div>
        <p className="mb-0 mt-3 text-[13px] text-slate-600">
          {unit} {fromUom} = {fromUom === "Sheet" && toUom === "Quire" ? "0.04" : "…"} {toUom}{" "}
          (Paper)
        </p>
      </div>
      <div className="rounded-lg border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-100 px-5 py-3 text-[15px] font-semibold text-[#2c3e50]">
          All Units
        </div>
        {Object.entries(UOM_CATEGORIES).map(([cat, units]) => (
          <div key={cat} className="border-b border-slate-100 last:border-b-0">
            <button
              type="button"
              onClick={() => setOpen((v) => (v === cat ? "" : cat))}
              className="flex w-full items-center justify-between px-5 py-3 text-left text-[13px] font-medium text-[#2c3e50] hover:bg-slate-50"
            >
              <span>{cat}</span>
              <span className="material-icons text-[18px] text-slate-400">
                {open === cat ? "expand_less" : "expand_more"}
              </span>
            </button>
            {open === cat ? (
              <div className="flex flex-wrap gap-2 px-5 pb-4">
                {units.map((u) => (
                  <span
                    key={u}
                    className="rounded border border-slate-200 bg-slate-50 px-2.5 py-1 text-[12px] text-slate-700"
                  >
                    {u}
                  </span>
                ))}
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </div>
  );
}
