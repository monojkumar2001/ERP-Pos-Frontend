"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import PageHeader from "./PageHeader";
import { api } from "../../lib/api";

function FieldInput({ field, value, onChange, requiredOverride }) {
  const required = requiredOverride ?? field.required;
  const inputClass =
    "h-10 w-full rounded border border-slate-200 px-3 text-[13px] outline-none focus:border-[#00a78b]";

  if (field.type === "textarea") {
    return (
      <textarea
        required={required}
        rows={3}
        value={value || ""}
        placeholder={field.placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded border border-slate-200 px-3 py-2 text-[13px] outline-none focus:border-[#00a78b]"
      />
    );
  }

  if (field.type === "select") {
    return (
      <select
        required={required}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        className={inputClass}
      >
        <option value="">{field.placeholder || "Select..."}</option>
        {(field.options || []).map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    );
  }

  if (field.type === "radio") {
    return (
      <div className="flex flex-wrap gap-4">
        {(field.options || []).map((o) => (
          <label key={o} className="flex items-center gap-2 text-[13px] text-slate-700">
            <input
              type="radio"
              name={field.key}
              value={o}
              checked={value === o}
              onChange={() => onChange(o)}
              className="accent-[#00a78b]"
            />
            {o}
          </label>
        ))}
      </div>
    );
  }

  return (
    <input
      type={field.type || "text"}
      required={required}
      value={value || ""}
      placeholder={field.placeholder}
      onChange={(e) => onChange(e.target.value)}
      className={inputClass}
    />
  );
}

function FieldBlock({ field, value, onChange, requiredOverride }) {
  if (field.type === "checkbox") {
    return (
      <label className="flex items-center gap-2 text-[13px] font-medium text-slate-700">
        <input
          type="checkbox"
          checked={Boolean(value)}
          onChange={(e) => onChange(e.target.checked)}
          className="accent-[#00a78b]"
        />
        {field.label}
      </label>
    );
  }

  if (field.type === "toggle") {
    return (
      <label className="inline-flex cursor-pointer items-center gap-3 text-[13px] font-medium text-[#1a557a]">
        <button
          type="button"
          role="switch"
          aria-checked={Boolean(value)}
          onClick={() => onChange(!value)}
          className={`relative h-6 w-11 rounded-full transition-colors ${
            value ? "bg-[#00a78b]" : "bg-slate-300"
          }`}
        >
          <span
            className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
              value ? "translate-x-5" : ""
            }`}
          />
        </button>
        <span>{field.label}</span>
      </label>
    );
  }

  return (
    <div>
      <label className="mb-1 flex items-center gap-1 text-[13px] font-medium text-[#1a557a]">
        {field.label}
        {(requiredOverride ?? field.required) && <span className="text-red-500"> *</span>}
        {field.help && (
          <span className="material-icons text-[14px] text-[#00a78b]" title="Help">
            info
          </span>
        )}
      </label>
      <FieldInput
        field={field}
        value={value}
        onChange={onChange}
        requiredOverride={requiredOverride}
      />
    </div>
  );
}

function PhotoUpload({ label }) {
  return (
    <div>
      <label className="mb-1 block text-[13px] font-medium text-[#1a557a]">{label}</label>
      <div className="flex min-h-[220px] flex-col items-center justify-center rounded-lg border-2 border-dashed border-[#9ec4e0] bg-[#f3f9fc] px-4 py-6 text-center">
        <span className="material-icons mb-2 text-[36px] text-[#00a78b]">cloud_upload</span>
        <p className="m-0 text-[13px] text-slate-600">Drag and drop file here</p>
        <p className="my-2 text-[12px] text-slate-400">or</p>
        <button
          type="button"
          className="rounded bg-[#00a78b] px-4 py-2 text-[13px] font-medium text-white hover:bg-[#008f77]"
        >
          Upload Photo
        </button>
        <p className="mt-3 mb-0 text-[11px] leading-relaxed text-slate-500">
          Maximum file size 2MB
          <br />
          Supported Formates: JPG, JPEG, PNG &amp; ICO
        </p>
      </div>
    </div>
  );
}

function EntityForm({ config, values, setValues, onSubmit, backHref }) {
  const fields = config.fields || [];
  const showContact = Boolean(values.add_contact_info);
  const showAddress = Boolean(values.add_address);
  const basicFields = fields.filter((f) => f.section === "basic");
  const balanceFields = fields.filter((f) => f.section === "balance");
  const toggleFields = fields.filter((f) => f.section === "toggle");
  const contactFields = fields.filter((f) => f.section === "contact");
  const addressFields = fields.filter((f) => f.section === "address");
  const requiredKeys = config.requiredKeys || ["name", "supplier_type"];
  const canSave = requiredKeys.every((key) => String(values[key] || "").trim());
  const basicCols = config.basicGridCols === 3 ? "sm:grid-cols-2 xl:grid-cols-3" : "sm:grid-cols-2";

  const setVal = (key, val) => setValues((prev) => ({ ...prev, [key]: val }));

  return (
    <form onSubmit={onSubmit} className="rounded-lg border border-[#e5e7eb] bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
        <h2 className="m-0 text-[20px] font-semibold text-[#1a557a]">{config.title}</h2>
        <Link href={backHref} className="rounded p-1 text-slate-500 hover:bg-slate-100" aria-label="Close">
          <span className="material-icons text-[22px]">close</span>
        </Link>
      </div>

      <div className="space-y-6 px-5 py-5">
        <div>
          <h3 className="mb-4 text-[15px] font-semibold text-[#1a557a]">Basic Information</h3>
          <div className="grid gap-5 lg:grid-cols-[1fr_280px]">
            <div className={`grid gap-4 ${basicCols}`}>
              {basicFields.map((f) => (
                <FieldBlock
                  key={f.key}
                  field={f}
                  value={values[f.key]}
                  onChange={(v) => setVal(f.key, v)}
                />
              ))}
            </div>
            {config.imageLabel ? <PhotoUpload label={config.imageLabel} /> : null}
          </div>
        </div>

        {balanceFields.length > 0 && (
          <div className="border-t border-slate-100 pt-5">
            <div className={`grid gap-4 ${config.entity === "customer" ? "max-w-3xl sm:grid-cols-2" : "max-w-md"}`}>
              {balanceFields.map((f) => (
                <FieldBlock
                  key={f.key}
                  field={f}
                  value={values[f.key]}
                  onChange={(v) => setVal(f.key, v)}
                />
              ))}
            </div>
          </div>
        )}

        {toggleFields.map((f) => (
          <div key={f.key} className="space-y-3">
            <FieldBlock
              field={f}
              value={values[f.key]}
              onChange={(v) => setVal(f.key, v)}
            />
            {f.clearWarning && !values[f.key] && (
              <div className="flex items-start gap-2 rounded border border-[#b6d4ea] bg-[#e8f4fc] px-3 py-2 text-[13px] text-[#1a557a]">
                <span className="material-icons text-[18px] text-[#00a78b]">info</span>
                <span className="flex-1">{f.clearWarning}</span>
              </div>
            )}
          </div>
        ))}

        {showContact && (
          <div className="rounded-lg bg-[#f3f9fc] p-4">
            <h3 className="mb-4 text-[15px] font-semibold text-[#1a557a]">Contact Information</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              {contactFields.map((f) => (
                <FieldBlock
                  key={f.key}
                  field={f}
                  value={values[f.key]}
                  onChange={(v) => setVal(f.key, v)}
                  requiredOverride={showContact ? f.required : false}
                />
              ))}
            </div>
          </div>
        )}

        {showAddress && (
          <div className="rounded-lg bg-[#f3f9fc] p-4">
            <h3 className="mb-4 text-[15px] font-semibold text-[#1a557a]">Address</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              {addressFields.map((f) => (
                <FieldBlock
                  key={f.key}
                  field={f}
                  value={values[f.key]}
                  onChange={(v) => setVal(f.key, v)}
                  requiredOverride={showAddress ? f.required : false}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="flex justify-end gap-2 border-t border-slate-100 px-5 py-4">
        <Link
          href={backHref}
          className="inline-flex h-9 items-center rounded-full border border-[#00a78b] bg-white px-5 text-[13px] font-medium text-[#00a78b] hover:bg-[#f0f7fb]"
        >
          Cancel
        </Link>
        <button
          type="submit"
          disabled={!canSave}
          className="h-9 rounded-full bg-[#00a78b] px-5 text-[13px] font-medium text-white hover:bg-[#008f77] disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          Save
        </button>
      </div>
    </form>
  );
}

export default function FormPage({ config, initialValues }) {
  const [saved, setSaved] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [values, setValues] = useState(() => {
    const init = {};
    (config?.fields || []).forEach((f) => {
      if (f.type === "checkbox" || f.type === "toggle") init[f.key] = Boolean(f.defaultValue);
      else init[f.key] = f.defaultValue || "";
    });
    return { ...init, ...(initialValues || {}) };
  });

  const isEntity = config?.layout === "entity";

  const backHref = useMemo(
    () => config?.backHref || "/en/dashboard",
    [config?.backHref]
  );

  if (!config) return null;

  const onSubmit = async (e) => {
    e.preventDefault();
    if (config.apiEndpoint) {
      setSaveError("");
      try {
        await api(config.apiEndpoint, { method: "POST", body: values });
        setSaved(true);
      } catch (err) {
        setSaveError(err.message || "Failed to save");
      }
      return;
    }
    setSaved(true);
  };

  if (isEntity) {
    return (
      <div>
        {saved ? (
          <div className="rounded-lg border border-green-200 bg-green-50 p-6 text-center text-green-700">
            Saved successfully (demo).{" "}
            <Link href={backHref} className="font-semibold underline">
              Back to list
            </Link>
          </div>
        ) : (
          <EntityForm
            config={config}
            values={values}
            setValues={setValues}
            onSubmit={onSubmit}
            backHref={backHref}
          />
        )}
      </div>
    );
  }

  return (
    <div>
      <PageHeader title={config.title} showExport={false} />
      <div className="mx-auto max-w-3xl rounded-lg border border-[#e5e7eb] bg-white p-6 shadow-sm">
        {saved ? (
          <div className="rounded bg-green-50 p-4 text-center text-green-700">
            Saved successfully (demo).{" "}
            <Link href={backHref} className="font-semibold underline">
              Back to list
            </Link>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="space-y-4">
            {saveError && (
              <div className="rounded border border-red-200 bg-red-50 px-3 py-2 text-[13px] text-red-700">
                {saveError}
              </div>
            )}
            {config.fields?.map((f) => (
              <FieldBlock
                key={f.key}
                field={f}
                value={values[f.key]}
                onChange={(val) => setValues((prev) => ({ ...prev, [f.key]: val }))}
              />
            ))}
            <div className="flex gap-2 pt-2">
              <button
                type="submit"
                className="h-10 rounded bg-[#00a78b] px-5 text-[13px] font-medium text-white hover:bg-[#008f77]"
              >
                Save
              </button>
              <Link
                href={backHref}
                className="inline-flex h-10 items-center rounded border border-slate-200 px-5 text-[13px] text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
