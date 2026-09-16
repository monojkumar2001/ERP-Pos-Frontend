"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { accountingApi } from "../../lib/api";
import EntityFormModal from "./EntityFormModal";

const FALLBACK_TABS = [
  { id: "expense", label: "EXPENSE", count: 0 },
  { id: "income", label: "INCOME", count: 0 },
  { id: "equity", label: "OWNER'S EQUITY", count: 0 },
  { id: "liabilities", label: "LIABILITIES", count: 0 },
  { id: "asset", label: "ASSET", count: 0 },
];

const TYPE_OPTIONS = [
  { value: "expense", label: "Expense" },
  { value: "income", label: "Income" },
  { value: "equity", label: "Owner's Equity" },
  { value: "liabilities", label: "Liabilities" },
  { value: "asset", label: "Asset" },
];

function emptyAccountForm(tab, groupName = "") {
  return {
    name: "",
    type: tab || "asset",
    group_name: groupName,
    description: "",
    code: "",
  };
}

export default function ChartOfAccountsPage() {
  const [tab, setTab] = useState("asset");
  const [search, setSearch] = useState("");
  const [openGroups, setOpenGroups] = useState({});
  const [tabs, setTabs] = useState(FALLBACK_TABS);
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState(emptyAccountForm());
  const [menuId, setMenuId] = useState(null);
  const [saving, setSaving] = useState(false);

  const loadAccounts = useCallback(() => {
    setLoading(true);
    setError("");
    return accountingApi
      .accounts()
      .then((res) => {
        setTabs(res.tabs?.length ? res.tabs : FALLBACK_TABS);
        setData(res.data || {});
      })
      .catch((err) => {
        setError(err.message || "Failed to load accounts");
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    loadAccounts();
  }, [loadAccounts]);

  const groups = data[tab] || [];

  const groupOptions = useMemo(() => groups.map((g) => g.name), [groups]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return groups;
    return groups
      .map((g) => ({
        ...g,
        accounts: g.accounts.filter(
          (a) =>
            a.name.toLowerCase().includes(q) ||
            (a.code || "").toLowerCase().includes(q) ||
            (a.desc || "").toLowerCase().includes(q)
        ),
      }))
      .filter((g) => g.accounts.length > 0 || g.name.toLowerCase().includes(q));
  }, [groups, search]);

  const toggleGroup = (name) => {
    setOpenGroups((prev) => ({
      ...prev,
      [name]: prev[name] === false ? true : prev[name] === true ? false : false,
    }));
  };

  const isOpen = (name) => openGroups[name] !== false;

  const openCreate = (groupName = "") => {
    setForm(emptyAccountForm(tab, groupName));
    setModal({ mode: "create" });
    setMenuId(null);
  };

  const openEdit = async (acc) => {
    setMenuId(null);
    try {
      const res = await accountingApi.getAccount(acc.id);
      const payload = res?.data ?? res;
      setForm({
        id: payload.id,
        name: payload.name || "",
        type: payload.type === "liability" ? "liabilities" : payload.type || tab,
        group_name: payload.group_name || "",
        description: payload.description || "",
        code: payload.code || "",
      });
      setModal({ mode: "edit", id: acc.id });
    } catch (err) {
      setError(err.message || "Failed to load account");
    }
  };

  const onFormChange = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const saveAccount = async () => {
    if (saving) return;
    if (!form.name?.trim()) {
      setError("Account name is required.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      const body = {
        name: form.name.trim(),
        type: form.type,
        group_name: form.group_name?.trim() || null,
        description: form.description?.trim() || null,
        code: form.code?.trim() || null,
      };
      if (modal?.mode === "edit" && modal.id) {
        await accountingApi.updateAccount(modal.id, body);
      } else {
        await accountingApi.createAccount(body);
      }
      setModal(null);
      await loadAccounts();
    } catch (err) {
      setError(err.message || "Failed to save account");
    } finally {
      setSaving(false);
    }
  };

  const deleteAccount = async (acc) => {
    setMenuId(null);
    if (!window.confirm(`Delete account "${acc.name}"?`)) return;
    setError("");
    try {
      await accountingApi.deleteAccount(acc.id);
      await loadAccounts();
    } catch (err) {
      setError(err.message || "Failed to delete account");
    }
  };

  const modalFields = [
    { key: "name", label: "Account Name", required: true, placeholder: "Account Name" },
    {
      key: "type",
      label: "Account Category",
      type: "select",
      required: true,
      placeholder: "Select category",
      options: TYPE_OPTIONS.map((t) => t.label),
    },
    {
      key: "group_name",
      label: "Group",
      type: "select",
      placeholder: "Select group",
      options: groupOptions.length ? groupOptions : ["Other"],
    },
    { key: "code", label: "Code", placeholder: "Optional account code" },
    {
      key: "description",
      label: "Description",
      type: "textarea",
      placeholder: "Description",
    },
  ];

  const modalValues = {
    ...form,
    type: TYPE_OPTIONS.find((t) => t.value === form.type)?.label || form.type,
  };

  const onModalChange = (key, value) => {
    if (key === "type") {
      const match = TYPE_OPTIONS.find((t) => t.label === value);
      onFormChange("type", match?.value || value);
      return;
    }
    onFormChange(key, value);
  };

  return (
    <div className="text-[#1a557a]">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h1 className="m-0 flex items-center gap-2 text-[22px] font-semibold text-[#1a557a]">
          Chart of Accounts
          <button type="button" className="text-[#00a78b]" aria-label="Help">
            <i className="far fa-question-circle text-[16px]" />
          </button>
        </h1>
        <button
          type="button"
          onClick={() => openCreate()}
          className="inline-flex h-9 items-center rounded border border-[#00a78b] bg-white px-3 text-[13px] font-medium text-[#00a78b] hover:bg-[#00a78b] hover:text-white"
        >
          Add New Account
        </button>
      </div>

      <div className="mb-4 flex justify-end">
        <div className="relative w-full max-w-xs">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search..."
            className="h-9 w-full rounded border border-[#cfd8e3] bg-white py-2 pl-3 pr-9 text-[13px] outline-none focus:border-[#00a78b]"
          />
          <i className="fas fa-search absolute right-3 top-1/2 -translate-y-1/2 text-[13px] text-slate-400" />
        </div>
      </div>

      {error && (
        <div className="mb-3 rounded border border-red-200 bg-red-50 px-3 py-2 text-[13px] text-red-700">
          {error}
        </div>
      )}

      <div className="mb-4 flex flex-wrap gap-1 border-b border-[#e5e7eb]">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`inline-flex items-center gap-2 px-6 py-3 text-[12px] font-semibold uppercase tracking-wide ${
              tab === t.id
                ? "border-b-2 border-[#00a78b] text-[#00a78b]"
                : "border-b-2 border-transparent text-[#296d9b]"
            }`}
          >
            {t.label}
            <span className="rounded bg-[#e8f1f8] px-1.5 py-0.5 text-[11px] font-semibold text-[#6c7a89]">
              {t.count}
            </span>
          </button>
        ))}
      </div>

      {loading ? (
        <div className="rounded border border-slate-200 bg-white p-10 text-center text-slate-500">
          Loading…
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((group) => (
            <div
              key={group.name}
              className="overflow-hidden rounded border border-[#e5e7eb] bg-white shadow-sm"
            >
              <div className="flex items-center justify-between bg-[#e8f1f8] px-4 py-2.5">
                <button
                  type="button"
                  onClick={() => toggleGroup(group.name)}
                  className="flex items-center gap-2 text-[13px] font-semibold text-[#1a557a]"
                >
                  <i
                    className={`fas fa-chevron-${isOpen(group.name) ? "down" : "right"} text-[11px] text-[#00a78b]`}
                  />
                  {group.name}
                  <i className="far fa-question-circle text-[12px] text-[#8aa0b3]" />
                </button>
                <button
                  type="button"
                  onClick={() => openCreate(group.name)}
                  className="text-[12px] font-medium text-[#00a78b] hover:underline"
                >
                  + Add New
                </button>
              </div>

              {isOpen(group.name) && (
                <ul className="m-0 list-none p-0">
                  {group.accounts.map((acc, idx) => (
                    <li
                      key={`${acc.id || acc.name}-${idx}`}
                      className="relative flex items-center gap-3 border-b border-[#eef1f4] px-4 py-3 last:border-b-0 hover:bg-[#f8fafc]"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-baseline gap-2">
                          {acc.code && (
                            <span className="account-number text-[12px] font-semibold text-[#00a78b]">
                              {acc.code}
                            </span>
                          )}
                          <span className="text-[13px] font-semibold text-[#1a557a]">
                            {acc.name}
                          </span>
                          {acc.desc && (
                            <span className="text-[12px] text-[#8aa0b3]">{acc.desc}</span>
                          )}
                        </div>
                      </div>
                      <span className="inline-flex rounded-full bg-[#28a745] px-2.5 py-0.5 text-[11px] font-semibold text-white">
                        {acc.status}
                      </span>
                      <div className="relative">
                        <button
                          type="button"
                          onClick={() => setMenuId(menuId === acc.id ? null : acc.id)}
                          className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
                          aria-label="Actions"
                        >
                          <i className="fas fa-ellipsis-v text-[13px]" />
                        </button>
                        {menuId === acc.id && (
                          <div className="absolute right-0 top-full z-20 mt-1 min-w-[120px] rounded-md border border-slate-200 bg-white py-1 shadow-lg">
                            <button
                              type="button"
                              className="block w-full px-3 py-2 text-left text-[13px] text-[#1a557a] hover:bg-[#f0f7fb]"
                              onClick={() => openEdit(acc)}
                            >
                              Edit
                            </button>
                            <button
                              type="button"
                              className="block w-full px-3 py-2 text-left text-[13px] text-red-600 hover:bg-[#f0f7fb]"
                              onClick={() => deleteAccount(acc)}
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </li>
                  ))}
                  {!group.accounts.length && (
                    <li className="px-4 py-6 text-center text-[13px] text-slate-400">
                      No accounts found
                    </li>
                  )}
                </ul>
              )}
            </div>
          ))}
          {!filtered.length && (
            <div className="rounded border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500">
              No accounts in this category
            </div>
          )}
        </div>
      )}

      <EntityFormModal
        open={Boolean(modal)}
        title={modal?.mode === "edit" ? "Edit Account" : "Add New Account"}
        fields={modalFields}
        values={modalValues}
        onChange={onModalChange}
        onClose={() => setModal(null)}
        onSave={saveAccount}
      />
    </div>
  );
}
