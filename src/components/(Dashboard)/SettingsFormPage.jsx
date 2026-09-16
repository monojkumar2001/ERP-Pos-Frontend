"use client";

import { useState } from "react";
import Link from "next/link";

export default function SettingsFormPage({ config }) {
  const title = config?.title || "Settings";
  const [saved, setSaved] = useState(false);

  return (
    <div>
      <div className="mb-5 flex items-center justify-between gap-3">
        <div>
          <h1 className="m-0 text-[22px] font-semibold text-[#1a557a]">{title}</h1>
          <p className="mt-1 mb-0 text-[13px] text-[#6c7a89]">
            Configure {title.toLowerCase()} options for your business.
          </p>
        </div>
        <Link
          href="/en/dashboard"
          className="text-[13px] text-[#00a78b] hover:underline"
        >
          ← Dashboard
        </Link>
      </div>

      <div className="rounded-xl border border-[#e5e7eb] bg-white p-5 shadow-sm">
        <div className="mb-4 grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-[12px] font-medium text-[#1a557a]">
              Enable module defaults
            </label>
            <select className="h-10 w-full rounded border border-slate-200 px-3 text-[13px] outline-none focus:border-[#00a78b]">
              <option>Yes</option>
              <option>No</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-[12px] font-medium text-[#1a557a]">
              Default status
            </label>
            <select className="h-10 w-full rounded border border-slate-200 px-3 text-[13px] outline-none focus:border-[#00a78b]">
              <option>Active</option>
              <option>Inactive</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="mb-1 block text-[12px] font-medium text-[#1a557a]">
              Notes
            </label>
            <textarea
              rows={3}
              className="w-full rounded border border-slate-200 px-3 py-2 text-[13px] outline-none focus:border-[#00a78b]"
              placeholder="Optional notes..."
            />
          </div>
        </div>

        {saved ? (
          <p className="mb-3 text-[13px] text-[#28a745]">Settings saved (demo).</p>
        ) : null}

        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => setSaved(true)}
            className="h-9 rounded bg-[#00a78b] px-4 text-[13px] font-medium text-white hover:bg-[#008f77]"
          >
            Save
          </button>
          <button
            type="button"
            onClick={() => setSaved(false)}
            className="h-9 rounded border border-[#00a78b] px-4 text-[13px] font-medium text-[#00a78b]"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
