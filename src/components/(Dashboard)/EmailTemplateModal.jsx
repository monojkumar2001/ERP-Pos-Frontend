"use client";

import { useEffect, useState } from "react";

const TEMPLATE_TYPES = [
  "General Template",
  "Supplier Advance Payment",
  "Customer Advance Payment",
  "Sales Refund Successful",
  "Password Reset OTP",
  "Email Verification OTP",
  "Customer Debit Created",
  "Sale Batch Payment Successful",
  "Sale Payment Successful",
  "Ecommerce Payment Successful",
  "Order Delivered",
  "Ecommerce Order Shipped",
  "Sale Order Placement",
  "POS Order Placement",
  "Ecommerce Order Placement",
  "Customer Register",
];

const INSERT_TAGS = [
  { label: "Name", token: "##name##" },
  { label: "Store Name", token: "##storename##" },
  { label: "Store Email", token: "##storeemail##" },
  { label: "Store Phone Number", token: "##storephonenumber##" },
];

const TOOLBAR = [
  "undo",
  "redo",
  "format_bold",
  "format_italic",
  "format_underlined",
  "strikethrough_s",
  "format_align_left",
  "format_align_center",
  "format_align_right",
  "format_align_justify",
  "format_list_bulleted",
  "format_list_numbered",
];

function FieldLabel({ children, required }) {
  return (
    <label className="mb-1.5 block text-[13px] font-medium text-[#1a557a]">
      {children}
      {required && <span className="text-red-500"> *</span>}
    </label>
  );
}

export default function EmailTemplateModal({
  open,
  mode = "create",
  values = {},
  onChange,
  onClose,
  onSave,
}) {
  const [body, setBody] = useState(values.body || "");

  useEffect(() => {
    if (open) setBody(values.body || "");
  }, [open, values.body]);

  const isEdit = mode === "edit";
  const title = isEdit ? "Edit Template" : "Add Template";
  const subtitle = isEdit
    ? "Update the template details below"
    : "Fill in the details to create a new email template";

  const canSave = Boolean(
    String(values.type || "").trim() &&
      String(values.name || "").trim() &&
      String(values.subject || "").trim()
  );

  if (!open) return null;

  const set = (key, val) => onChange(key, val);

  const insertTag = (token) => {
    const next = `${body || ""}${body ? " " : ""}${token}`;
    setBody(next);
    set("body", next);
  };

  const clearBody = () => {
    setBody("");
    set("body", "");
  };

  const charCount = String(body || values.body || "").length;

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/40 p-4">
      <div className="flex max-h-[92vh] w-full max-w-[760px] flex-col overflow-hidden rounded-xl bg-white shadow-2xl">
        <div className="flex items-start justify-between border-b border-slate-200 px-5 py-4">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#eaf4fb] text-[#00a78b]">
              <span className="material-icons text-[22px]">email</span>
            </div>
            <div>
              <h2 className="m-0 text-[18px] font-semibold text-[#1a557a]">{title}</h2>
              <p className="m-0 mt-0.5 text-[12px] text-slate-500">{subtitle}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600"
          >
            <span className="material-icons text-[20px]">close</span>
          </button>
        </div>

        <div className="flex-1 space-y-4 overflow-y-auto px-5 py-4">
          <section className="rounded-lg border border-slate-200 bg-[#fbfdff] p-4">
            <div className="mb-3 flex items-center gap-1.5 text-[12px] font-semibold uppercase tracking-wide text-[#00a78b]">
              TEMPLATE INFO
              <span className="material-icons text-[14px]">info</span>
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              <div>
                <FieldLabel required>Type</FieldLabel>
                <select
                  value={values.type || "General Template"}
                  onChange={(e) => set("type", e.target.value)}
                  className="h-10 w-full rounded border border-slate-200 bg-white px-3 text-[13px] outline-none focus:border-[#00a78b]"
                >
                  {TEMPLATE_TYPES.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <FieldLabel required>Name</FieldLabel>
                <input
                  value={values.name || ""}
                  onChange={(e) => set("name", e.target.value)}
                  placeholder="Enter template name"
                  className="h-10 w-full rounded border border-slate-200 bg-white px-3 text-[13px] outline-none placeholder:text-slate-400 focus:border-[#00a78b]"
                />
              </div>
              <div className="md:col-span-2">
                <FieldLabel required>Subject</FieldLabel>
                <div className="flex h-10 overflow-hidden rounded border border-slate-200 focus-within:border-[#00a78b]">
                  <span className="flex items-center bg-[#f8fafc] px-3 text-[13px] text-slate-400">
                    #
                  </span>
                  <input
                    value={values.subject || ""}
                    onChange={(e) => set("subject", e.target.value)}
                    placeholder="Enter email subject line"
                    className="h-full min-w-0 flex-1 border-0 px-3 text-[13px] outline-none"
                  />
                </div>
              </div>
            </div>
          </section>

          <section className="rounded-lg border border-slate-200 bg-white p-4">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 text-[12px] font-semibold uppercase tracking-wide text-[#00a78b]">
                EMAIL CONTENT
                <span className="material-icons text-[14px]">edit</span>
                <span className="material-icons text-[14px]">info</span>
              </div>
              {isEdit && (
                <button
                  type="button"
                  onClick={clearBody}
                  className="inline-flex items-center gap-1 rounded border border-slate-200 px-2.5 py-1 text-[12px] text-slate-600 hover:bg-slate-50"
                >
                  <span className="material-icons text-[14px]">close</span>
                  Clear Body
                </button>
              )}
            </div>

            <div className="mb-2 flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-semibold uppercase text-slate-400">
                Insert Tag:
              </span>
              {INSERT_TAGS.map((tag) => (
                <button
                  key={tag.token}
                  type="button"
                  onClick={() => insertTag(tag.token)}
                  className="inline-flex items-center gap-1 rounded-full bg-[#eaf4fb] px-2.5 py-1 text-[12px] font-medium text-[#00a78b] hover:bg-[#d9ebf7]"
                >
                  <span className="text-[11px]">#</span>
                  {tag.label}
                </button>
              ))}
            </div>

            <div className="overflow-hidden rounded border border-slate-200">
              <div className="flex flex-wrap items-center gap-0.5 border-b border-slate-200 bg-[#f8fafc] px-2 py-1.5">
                {TOOLBAR.map((icon) => (
                  <button
                    key={icon}
                    type="button"
                    className="rounded p-1 text-slate-500 hover:bg-white hover:text-[#00a78b]"
                    aria-label={icon}
                  >
                    <span className="material-icons text-[18px]">{icon}</span>
                  </button>
                ))}
                <span className="mx-1 h-5 w-px bg-slate-200" />
                <select className="h-7 rounded border border-slate-200 bg-white px-1 text-[12px]">
                  <option>default</option>
                </select>
                <select className="ml-1 h-7 rounded border border-slate-200 bg-white px-1 text-[12px]">
                  <option>Arial</option>
                </select>
                <select className="ml-1 h-7 rounded border border-slate-200 bg-white px-1 text-[12px]">
                  <option>3</option>
                </select>
                <button type="button" className="ml-1 rounded px-2 py-1 text-[12px] text-slate-500 hover:bg-white">
                  Clear Class
                </button>
                <button type="button" className="rounded p-1 text-slate-500 hover:bg-white" aria-label="Link">
                  <span className="material-icons text-[18px]">link</span>
                </button>
                <button type="button" className="rounded p-1 text-slate-500 hover:bg-white" aria-label="Code">
                  <span className="material-icons text-[18px]">code</span>
                </button>
              </div>
              <textarea
                value={body || values.body || ""}
                onChange={(e) => {
                  setBody(e.target.value);
                  set("body", e.target.value);
                }}
                rows={8}
                placeholder="Start writing your email content here…"
                className="w-full resize-y border-0 px-3 py-3 text-[13px] text-slate-700 outline-none placeholder:text-slate-400"
              />
              <div className="border-t border-slate-100 px-3 py-1.5 text-right text-[11px] text-slate-400">
                {charCount} chars
              </div>
            </div>
          </section>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 px-5 py-3">
          <div className="text-[12px] text-slate-500">
            {isEdit ? (
              <span className="inline-flex items-center gap-1">
                <span className="material-icons text-[14px] text-[#00a78b]">info</span>
                Editing existing template
              </span>
            ) : (
              <span />
            )}
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-9 items-center rounded border border-[#00a78b] bg-white px-4 text-[13px] font-medium text-[#00a78b] hover:bg-[#f0f7fb]"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={!canSave}
              onClick={onSave}
              className="inline-flex h-9 items-center gap-1 rounded bg-[#00a78b] px-4 text-[13px] font-medium text-white hover:bg-[#008f77] disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              <span className="material-icons text-[16px]">save</span>
              Save Template
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
