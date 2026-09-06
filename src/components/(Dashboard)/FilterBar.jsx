"use client";

import { useState } from "react";

function MultiSelect({ placeholder, options = [], value, onChange }) {
  const [open, setOpen] = useState(false);

  const toggle = (opt) => {
    if (value.includes(opt)) onChange(value.filter((v) => v !== opt));
    else onChange([...value, opt]);
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex min-h-9 w-full min-w-[12rem] flex-wrap items-center gap-1 rounded border border-slate-200 bg-white px-2 py-1 text-left text-[13px] outline-none focus:border-[#2980b9]"
      >
        {value.length === 0 && (
          <span className="text-slate-400">{placeholder || "Select"}</span>
        )}
        {value.map((v) => (
          <span
            key={v}
            className="inline-flex items-center gap-1 rounded bg-[#e8f1f8] px-1.5 py-0.5 text-[12px] text-[#1a557a]"
          >
            <span
              role="button"
              tabIndex={0}
              onClick={(e) => {
                e.stopPropagation();
                toggle(v);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.stopPropagation();
                  toggle(v);
                }
              }}
              className="cursor-pointer text-slate-500 hover:text-slate-800"
            >
              ×
            </span>
            {v}
          </span>
        ))}
        <span className="material-icons ml-auto text-[18px] text-slate-400">
          expand_more
        </span>
      </button>
      {open && (
        <div className="absolute z-20 mt-1 w-full rounded border border-slate-200 bg-white py-1 shadow-lg">
          {options.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() => toggle(opt)}
              className={`flex w-full items-center gap-2 px-3 py-1.5 text-left text-[13px] hover:bg-slate-50 ${
                value.includes(opt) ? "bg-[#e8f1f8] text-[#2980b9]" : "text-slate-700"
              }`}
            >
              <input
                type="checkbox"
                readOnly
                checked={value.includes(opt)}
                className="accent-[#2980b9]"
              />
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function FilterBar({ filters = [], onApply, onClear }) {
  const [multiValues, setMultiValues] = useState(() => {
    const init = {};
    filters.forEach((f) => {
      if (f.type === "multiselect") init[f.key] = f.defaultValue || [];
    });
    return init;
  });

  if (!filters.length) return null;

  return (
    <div className="mb-3 flex flex-wrap items-end gap-2">
      {filters.map((f) => {
        if (f.type === "multiselect") {
          return (
            <div key={f.key} className="min-w-[12rem]">
              <MultiSelect
                placeholder={f.placeholder || f.label}
                options={f.options || []}
                value={multiValues[f.key] || []}
                onChange={(v) => setMultiValues((s) => ({ ...s, [f.key]: v }))}
              />
            </div>
          );
        }

        if (f.type === "date") {
          return (
            <div key={f.key} className="relative min-w-[10rem]">
              <input
                type="text"
                placeholder={f.placeholder || f.label}
                className="h-9 w-full rounded border border-slate-200 bg-white py-1 pl-3 pr-8 text-[13px] text-slate-700 outline-none focus:border-[#2980b9]"
              />
              <span className="material-icons pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-[18px] text-slate-400">
                calendar_today
              </span>
            </div>
          );
        }

        return (
          <div key={f.key} className="min-w-[12rem]">
            <select className="h-9 w-full rounded border border-slate-200 bg-white px-2 text-[13px] text-slate-700 outline-none focus:border-[#2980b9]">
              <option value="">{f.placeholder || `Select ${f.label}`}</option>
              {(f.options || ["Option 1", "Option 2"]).map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        );
      })}

      <button
        type="button"
        onClick={onApply}
        className="h-8 rounded bg-[#2980b9] px-3 text-[12px] font-medium text-white hover:bg-[#2472a4]"
      >
        Apply Filter
      </button>
      <button
        type="button"
        onClick={onClear}
        className="h-8 rounded border border-[#2980b9] bg-white px-3 text-[12px] font-medium text-[#2980b9] hover:bg-[#e8f1f8]"
      >
        Clear Filter
      </button>
    </div>
  );
}
