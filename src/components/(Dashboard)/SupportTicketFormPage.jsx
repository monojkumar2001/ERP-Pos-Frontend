"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

const SUPPORT_UNITS = ["Softifybd Support", "Billing Unit", "Technical Unit", "Account Unit"];
const SUPPORT_CATEGORIES = [
  "Quotations",
  "Macreseller Support",
  "Salary sheet generate",
  "Billing Support",
  "Login / Password",
  "General Support",
];

function FieldLabel({ children, required }) {
  return (
    <label className="mb-1.5 block text-[13px] font-medium text-[#1a557a]">
      {children}
      {required && <span className="text-red-500"> *</span>}
    </label>
  );
}

export default function SupportTicketFormPage({ config }) {
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    phone: "",
    email: "demo@biznify.com.bd",
    supportUnit: "",
    category: "",
    subject: "",
    details: "",
  });

  const backHref = config?.backHref || "/en/support-tickets";
  const canSave = useMemo(
    () =>
      Boolean(form.supportUnit && form.category && String(form.subject || "").trim()),
    [form]
  );

  const set = (key, val) => setForm((prev) => ({ ...prev, [key]: val }));

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h1 className="m-0 text-[22px] font-semibold text-[#2c3e50]">
          {config?.title || "Create Support Ticket"}
        </h1>
        <Link href={backHref} className="text-[18px] text-slate-400 hover:text-slate-600" aria-label="Close">
          ×
        </Link>
      </div>

      {saved && (
        <div className="mb-3 rounded border border-green-200 bg-green-50 px-3 py-2 text-[13px] text-green-700">
          Support ticket saved (demo).
        </div>
      )}

      <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <div className="grid gap-5 lg:grid-cols-[1fr_280px]">
          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <FieldLabel>Contact Phone Number</FieldLabel>
                <input
                  value={form.phone}
                  onChange={(e) => set("phone", e.target.value)}
                  placeholder="Client Phone Number"
                  className="h-10 w-full rounded border border-slate-200 px-3 text-[13px] outline-none focus:border-[#00a78b]"
                />
              </div>
              <div>
                <FieldLabel>Contact Email</FieldLabel>
                <input
                  type="email"
                  value={form.email}
                  readOnly
                  className="h-10 w-full rounded border border-slate-200 bg-slate-50 px-3 text-[13px] text-slate-600"
                />
              </div>
              <div>
                <FieldLabel required>Support Unit</FieldLabel>
                <select
                  value={form.supportUnit}
                  onChange={(e) => set("supportUnit", e.target.value)}
                  className="h-10 w-full rounded border border-slate-200 px-3 text-[13px] outline-none focus:border-[#00a78b]"
                >
                  <option value="">Select Support Unit</option>
                  {SUPPORT_UNITS.map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <FieldLabel required>Select Support Category</FieldLabel>
                <select
                  value={form.category}
                  onChange={(e) => set("category", e.target.value)}
                  className="h-10 w-full rounded border border-slate-200 px-3 text-[13px] outline-none focus:border-[#00a78b]"
                >
                  <option value="">Select Support Category</option>
                  {SUPPORT_CATEGORIES.map((o) => (
                    <option key={o} value={o}>
                      {o}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <FieldLabel required>Subject</FieldLabel>
              <input
                value={form.subject}
                onChange={(e) => set("subject", e.target.value)}
                className="h-10 w-full rounded border border-slate-200 px-3 text-[13px] outline-none focus:border-[#00a78b]"
                placeholder="Subject"
              />
            </div>

            <div>
              <FieldLabel>Problem Details</FieldLabel>
              <textarea
                value={form.details}
                onChange={(e) => set("details", e.target.value)}
                rows={6}
                className="w-full rounded border border-slate-200 px-3 py-2 text-[13px] outline-none focus:border-[#00a78b]"
                placeholder="Describe the problem..."
              />
            </div>
          </div>

          <div>
            <FieldLabel>Attachments</FieldLabel>
            <div className="flex min-h-[220px] flex-col items-center justify-center rounded-lg border-2 border-dashed border-[#9ec5e0] bg-[#f5fbff] px-4 py-6 text-center">
              <div className="text-[13px] text-slate-500">Drag and drop file here</div>
              <div className="my-2 text-[12px] text-slate-400">or</div>
              <label className="inline-flex cursor-pointer items-center gap-1 rounded bg-[#00a78b] px-3 py-2 text-[12px] font-medium text-white hover:bg-[#008f77]">
                <span className="material-icons text-[16px]">upload</span>
                Choose File
                <input type="file" className="hidden" />
              </label>
              <div className="mt-3 text-[11px] leading-4 text-slate-400">
                Maximum file size 5MB
                <br />
                Supported Formates: DOC, DOCX, XLX, XLSX, PDF, JPG, JPEG, PNG
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <Link
            href={backHref}
            className="inline-flex h-9 items-center rounded border border-[#e83e8c] bg-white px-4 text-[13px] font-medium text-[#e83e8c] hover:bg-[#fff0f6]"
          >
            Cancel
          </Link>
          <button
            type="button"
            disabled={!canSave}
            onClick={() => setSaved(true)}
            className="inline-flex h-9 items-center rounded bg-[#00a78b] px-4 text-[13px] font-medium text-white disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
