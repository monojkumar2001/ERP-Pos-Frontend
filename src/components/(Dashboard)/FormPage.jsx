"use client";

import { useState } from "react";
import Link from "next/link";
import PageHeader from "./PageHeader";

export default function FormPage({ config }) {
  const [saved, setSaved] = useState(false);

  if (!config) return null;

  const onSubmit = (e) => {
    e.preventDefault();
    setSaved(true);
  };

  return (
    <div>
      <PageHeader title={config.title} showExport={false} />
      <div className="mx-auto max-w-3xl rounded-lg border border-[#e5e7eb] bg-white p-6 shadow-sm">
        {saved ? (
          <div className="rounded bg-green-50 p-4 text-center text-green-700">
            Saved successfully (demo).{" "}
            <Link href="/en/dashboard" className="font-semibold underline">
              Back to dashboard
            </Link>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="space-y-4">
            {config.fields?.map((f) => (
              <div key={f.key}>
                <label className="mb-1 block text-[13px] font-medium text-slate-700">
                  {f.label}
                  {f.required && <span className="text-red-500"> *</span>}
                </label>
                {f.type === "textarea" ? (
                  <textarea
                    required={f.required}
                    rows={3}
                    className="w-full rounded border border-slate-200 px-3 py-2 text-[13px] outline-none focus:border-[#2980b9]"
                  />
                ) : f.type === "select" ? (
                  <select
                    required={f.required}
                    className="h-10 w-full rounded border border-slate-200 px-3 text-[13px] outline-none focus:border-[#2980b9]"
                  >
                    <option value="">Select...</option>
                    {(f.options || []).map((o) => (
                      <option key={o} value={o}>
                        {o}
                      </option>
                    ))}
                  </select>
                ) : (
                  <input
                    type={f.type || "text"}
                    required={f.required}
                    className="h-10 w-full rounded border border-slate-200 px-3 text-[13px] outline-none focus:border-[#2980b9]"
                  />
                )}
              </div>
            ))}
            <div className="flex gap-2 pt-2">
              <button
                type="submit"
                className="h-10 rounded bg-[#2980b9] px-5 text-[13px] font-medium text-white hover:bg-[#2472a4]"
              >
                Save
              </button>
              <Link
                href="/en/dashboard"
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
