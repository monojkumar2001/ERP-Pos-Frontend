"use client";

import { useEffect, useMemo, useState } from "react";
import PageHeader from "./PageHeader";
import { settingsApi, unwrapApiData } from "../../lib/api";

function FieldRow({ field, value, onChange }) {
  if (field.type === "toggle" || field.type === "checkbox") {
    return (
      <label className="flex cursor-pointer items-start gap-3 border-b border-dashed border-slate-100 py-3 text-[13px]">
        <input
          type="checkbox"
          checked={!!value}
          onChange={(e) => onChange(e.target.checked)}
          className="mt-0.5 accent-[#00a78b]"
        />
        <span>
          <span className="block font-medium text-[#2c3e50]">{field.label}</span>
          {field.hint ? (
            <span className="mt-0.5 block text-[12px] text-slate-500">{field.hint}</span>
          ) : null}
        </span>
      </label>
    );
  }

  if (field.type === "select") {
    return (
      <div className="border-b border-dashed border-slate-100 py-3">
        <label className="mb-1 block text-[13px] text-slate-600">{field.label}</label>
        <select
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
          className="h-9 w-full max-w-md rounded border border-slate-200 bg-white px-2 text-[13px] outline-none focus:border-[#00a78b]"
        >
          {(field.options || []).map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>
    );
  }

  if (field.type === "textarea") {
    return (
      <div className="border-b border-dashed border-slate-100 py-3">
        <label className="mb-1 block text-[13px] font-medium text-[#2c3e50]">
          {field.label}
        </label>
        {field.hint ? (
          <p className="mb-2 mt-0 text-[12px] text-slate-500">{field.hint}</p>
        ) : null}
        <textarea
          rows={4}
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
          className="w-full max-w-2xl rounded border border-slate-200 px-3 py-2 text-[13px] outline-none focus:border-[#00a78b]"
        />
      </div>
    );
  }

  return (
    <div className="border-b border-dashed border-slate-100 py-3">
      <label className="mb-1 block text-[13px] text-slate-600">{field.label}</label>
      {field.hint ? (
        <p className="mb-2 mt-0 text-[12px] text-slate-500">{field.hint}</p>
      ) : null}
      <input
        type="text"
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        className="h-9 w-full max-w-md rounded border border-slate-200 px-2 text-[13px] outline-none focus:border-[#00a78b]"
      />
    </div>
  );
}

function collectFields(config) {
  const fields = [];
  if (config?.tabFields) {
    Object.entries(config.tabFields).forEach(([tab, tabFields]) => {
      (tabFields || []).forEach((field) => {
        if (field?.key) fields.push({ ...field, tab });
      });
    });
  }
  if (config?.quotationSections?.length) {
    config.quotationSections.forEach((section) => {
      (section.fields || []).forEach((field) => {
        if (field?.key) fields.push({ ...field, tab: "QUOTATION" });
      });
    });
  }
  for (const section of config?.sections || []) {
    (section.fields || []).forEach((field) => {
      if (field?.key) fields.push({ ...field, tab: null });
    });
  }
  return fields;
}

function settingStorageKey(config, field) {
  const prefix = config?.settingsKeyPrefix || "";
  if (config?.tabFields && field.tab) {
    return `${prefix}${String(field.tab).toLowerCase()}.${field.key}`;
  }
  return `${prefix}${field.key}`;
}

function parseStoredValue(field, raw) {
  if (raw == null || raw === "") {
    if (field.type === "toggle" || field.type === "checkbox") return field.default ?? false;
    return field.default ?? field.options?.[0] ?? "";
  }
  if (field.type === "toggle" || field.type === "checkbox") {
    return raw === true || raw === "true" || raw === "1" || raw === 1;
  }
  return String(raw);
}

export default function ConfigSettingsPage({ config }) {
  const tabs = config?.tabs || null;
  const [activeTab, setActiveTab] = useState(tabs?.[0] || "");

  const allFields = useMemo(() => collectFields(config), [config]);

  const sections = useMemo(() => {
    if (tabs?.length && config?.tabFields) {
      const tab = activeTab || tabs[0];
      const fields = config.tabFields[tab] || [];
      if (tab === "QUOTATION" && config.quotationSections?.length) {
        return config.quotationSections;
      }
      return [{ title: "", fields }];
    }
    if (config?.sections?.length) return config.sections;
    return [];
  }, [config, tabs, activeTab]);

  const initial = useMemo(() => {
    const values = {};
    for (const field of allFields) {
      if (field.type === "toggle" || field.type === "checkbox") {
        values[field.key] = field.default ?? false;
      } else {
        values[field.key] = field.default ?? field.options?.[0] ?? "";
      }
    }
    return values;
  }, [allFields]);

  const [values, setValues] = useState(initial);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    setValues(initial);
    setLoading(true);
    setError("");
    settingsApi.company
      .get()
      .then((res) => {
        const stored = unwrapApiData(res) || {};
        const next = { ...initial };
        for (const field of allFields) {
          const storageKey = settingStorageKey(config, field);
          if (storageKey in stored) {
            next[field.key] = parseStoredValue(field, stored[storageKey]);
          }
        }
        setValues(next);
      })
      .catch((err) => {
        setError(err.message || "Failed to load settings");
      })
      .finally(() => setLoading(false));
  }, [config, initial, allFields]);

  const onSave = async () => {
    setSaving(true);
    setMessage("");
    setError("");
    const settings = {};
    for (const field of allFields) {
      settings[settingStorageKey(config, field)] = values[field.key];
    }
    try {
      await settingsApi.company.update({ settings });
      setMessage("Settings saved");
      setTimeout(() => setMessage(""), 2500);
    } catch (err) {
      setError(err.message || "Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <PageHeader title={config?.title || "Settings"} showExport={false} />

      {tabs?.length ? (
        <div className="mb-4 flex flex-wrap gap-1 border-b border-slate-200">
          {tabs.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-[13px] font-semibold uppercase tracking-wide ${
                (activeTab || tabs[0]) === tab
                  ? "border-b-2 border-[#00a78b] text-[#00a78b]"
                  : "text-slate-500 hover:text-[#00a78b]"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      ) : null}

      {loading ? (
        <div className="rounded-lg border border-slate-200 bg-white p-10 text-center text-[13px] text-slate-500">
          Loading…
        </div>
      ) : (
        <div className="space-y-4">
          {sections.map((section) => (
            <div
              key={section.title}
              className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm"
            >
              {section.title && !tabs?.length ? (
                <h3 className="mb-2 mt-0 text-[15px] font-semibold text-[#2c3e50]">
                  {section.title}
                </h3>
              ) : section.title ? (
                <h3 className="mb-2 mt-0 text-[13px] font-semibold uppercase tracking-wide text-[#7aa0bd]">
                  {section.title}
                </h3>
              ) : null}
              {(section.fields || []).map((field) => (
                <FieldRow
                  key={`${section.title}-${field.key}`}
                  field={field}
                  value={values[field.key]}
                  onChange={(v) => setValues((prev) => ({ ...prev, [field.key]: v }))}
                />
              ))}
            </div>
          ))}
        </div>
      )}

      {!config?.hideSave ? (
        <div className="mt-4 flex items-center gap-3">
          <button
            type="button"
            disabled={loading || saving}
            onClick={onSave}
            className="inline-flex h-9 items-center rounded bg-[#00a78b] px-5 text-[13px] font-medium text-white hover:bg-[#008f77] disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            {saving ? "Saving…" : "Save"}
          </button>
          {message ? <span className="text-[13px] text-[#28a745]">{message}</span> : null}
          {error ? <span className="text-[13px] text-red-600">{error}</span> : null}
        </div>
      ) : null}
    </div>
  );
}
