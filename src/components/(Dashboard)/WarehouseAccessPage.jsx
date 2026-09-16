"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import PageHeader from "./PageHeader";
import DataTable from "./DataTable";
import { aclApi, inventoryApi, masterApi } from "../../lib/api";

export default function WarehouseAccessPage({ config }) {
  const [accessBy, setAccessBy] = useState("warehouse");
  const [selected, setSelected] = useState("");
  const [rows, setRows] = useState([]);
  const [adding, setAdding] = useState(false);
  const [pick, setPick] = useState("");
  const [warehouses, setWarehouses] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [listLoading, setListLoading] = useState(false);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setLoading(true);
    Promise.all([masterApi.warehouses.list(), aclApi.users()])
      .then(([whRes, usersRes]) => {
        setWarehouses(whRes.rows || []);
        setUsers(usersRes.rows || []);
      })
      .catch((err) => {
        setError(err.message || "Failed to load options");
        setWarehouses([]);
        setUsers([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const loadAssignments = useCallback(
    (mode, id) => {
      if (!id) {
        setRows([]);
        return Promise.resolve();
      }
      setListLoading(true);
      setError("");
      const params =
        mode === "warehouse" ? { warehouse_id: id } : { user_id: id };
      return inventoryApi.warehouseAccess
        .list(params)
        .then((data) => {
          const list = data.rows || [];
          setRows(
            list.map((row) =>
              mode === "warehouse"
                ? {
                    id: row.id,
                    user_email:
                      row.user_email ||
                      users.find((u) => u.id === row.user_id)?.email ||
                      row.user ||
                      "—",
                  }
                : { id: row.id, warehouse: row.warehouse }
            )
          );
        })
        .catch((err) => {
          setError(err.message || "Failed to load assignments");
          setRows([]);
        })
        .finally(() => setListLoading(false));
    },
    []
  );

  useEffect(() => {
    if (selected) loadAssignments(accessBy, selected);
    else setRows([]);
  }, [accessBy, selected, loadAssignments]);

  const canAdd = Boolean(selected);
  const addLabel =
    accessBy === "warehouse" ? "Add User Access" : "Add Warehouse Access";

  const columns = useMemo(
    () =>
      accessBy === "warehouse"
        ? [
            { key: "user_email", label: "USER EMAIL" },
            { key: "action", label: "ACTION", type: "action" },
          ]
        : [
            { key: "warehouse", label: "Warehouse" },
            { key: "action", label: "Action", type: "action" },
          ],
    [accessBy]
  );

  const pickOptions = useMemo(() => {
    const assignedIds = new Set(
      rows.map((r) =>
        accessBy === "warehouse"
          ? users.find((u) => (u.email || u.user_email) === r.user_email)?.id
          : warehouses.find((w) => w.name === r.warehouse)?.id
      )
    );
    if (accessBy === "warehouse") {
      return users.filter((u) => !assignedIds.has(u.id));
    }
    return warehouses.filter((w) => !assignedIds.has(w.id));
  }, [accessBy, rows, users, warehouses]);

  const rowActions = useMemo(
    () => [
      {
        key: "delete",
        label: "Delete",
        onClick: async (row) => {
          try {
            await inventoryApi.warehouseAccess.delete(row.id);
            await loadAssignments(accessBy, selected);
          } catch (err) {
            setError(err.message || "Failed to remove access");
          }
        },
      },
    ],
    [accessBy, selected, loadAssignments]
  );

  function switchMode(mode) {
    setAccessBy(mode);
    setSelected("");
    setRows([]);
    setAdding(false);
    setPick("");
    setError("");
  }

  function onSelectChange(value) {
    setSelected(value);
    setAdding(false);
    setPick("");
  }

  async function saveAccess() {
    if (!pick || !selected) return;
    setSaving(true);
    setError("");
    try {
      const body =
        accessBy === "warehouse"
          ? { warehouse_id: Number(selected), user_id: Number(pick) }
          : { warehouse_id: Number(pick), user_id: Number(selected) };
      await inventoryApi.warehouseAccess.create(body);
      setAdding(false);
      setPick("");
      await loadAssignments(accessBy, selected);
    } catch (err) {
      setError(err.message || "Failed to save access");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="rounded-lg border border-slate-200 bg-white p-10 text-center text-slate-500">
        Loading…
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title={config?.title || "Warehouse Access"}
        addLabel={addLabel}
        addDisabled={!canAdd}
        onAddClick={() => canAdd && setAdding(true)}
        showExport={false}
      />

      {error && (
        <div className="mb-3 rounded border border-red-200 bg-red-50 px-3 py-2 text-[13px] text-red-700">
          {error}
        </div>
      )}

      <div className="mb-4 flex flex-wrap items-end gap-4 rounded-lg border border-slate-200 bg-white p-4">
        <div>
          <div className="mb-2 text-[13px] font-medium text-slate-600">Access By</div>
          <div className="flex items-center gap-4 text-[13px] text-slate-700">
            <label className="inline-flex cursor-pointer items-center gap-2">
              <input
                type="radio"
                name="accessBy"
                checked={accessBy === "warehouse"}
                onChange={() => switchMode("warehouse")}
                className="accent-[#00a78b]"
              />
              Warehouse
            </label>
            <label className="inline-flex cursor-pointer items-center gap-2">
              <input
                type="radio"
                name="accessBy"
                checked={accessBy === "user"}
                onChange={() => switchMode("user")}
                className="accent-[#00a78b]"
              />
              User
            </label>
          </div>
        </div>

        <div className="min-w-[14rem]">
          <div className="mb-2 text-[13px] font-medium text-slate-600">
            {accessBy === "warehouse" ? "Select Warehouse" : "Select User"}
          </div>
          <select
            value={selected}
            onChange={(e) => onSelectChange(e.target.value)}
            className="h-9 w-full rounded border border-slate-200 bg-white px-2 text-[13px] outline-none focus:border-[#00a78b]"
          >
            <option value="">
              {accessBy === "warehouse" ? "Select Warehouse" : "Select User"}
            </option>
            {(accessBy === "warehouse" ? warehouses : users).map((opt) => (
              <option key={opt.id} value={String(opt.id)}>
                {accessBy === "warehouse" ? opt.name : opt.email || opt.user_email}
              </option>
            ))}
          </select>
        </div>
      </div>

      {adding ? (
        <div className="mb-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <div className="mb-3 max-w-sm">
            <label className="mb-1 block text-[13px] font-medium text-slate-600">
              {accessBy === "warehouse" ? "Select User" : "Select Warehouse"}
            </label>
            <select
              value={pick}
              onChange={(e) => setPick(e.target.value)}
              className="h-9 w-full rounded border border-slate-200 bg-white px-2 text-[13px] outline-none focus:border-[#00a78b]"
            >
              <option value="">
                {accessBy === "warehouse" ? "Select User" : "Select Warehouse"}
              </option>
              {pickOptions.map((opt) => (
                <option key={opt.id} value={String(opt.id)}>
                  {accessBy === "warehouse" ? opt.email || opt.user_email : opt.name}
                </option>
              ))}
            </select>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => {
                setAdding(false);
                setPick("");
              }}
              className="inline-flex h-9 items-center rounded border border-slate-200 bg-white px-4 text-[13px] font-medium text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={!pick || saving}
              onClick={saveAccess}
              className={`inline-flex h-9 items-center rounded px-4 text-[13px] font-medium text-white ${
                pick && !saving
                  ? "bg-[#00a78b] hover:bg-[#008f77]"
                  : "cursor-not-allowed bg-slate-300"
              }`}
            >
              Save
            </button>
          </div>
        </div>
      ) : null}

      {listLoading ? (
        <div className="rounded-lg border border-slate-200 bg-white p-10 text-center text-slate-500">
          Loading assignments…
        </div>
      ) : (
        <DataTable
          columns={columns}
          rows={rows}
          totalEntries={rows.length}
          rowActions={rowActions}
        />
      )}
    </div>
  );
}
