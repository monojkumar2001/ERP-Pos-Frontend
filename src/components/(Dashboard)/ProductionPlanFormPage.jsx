"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  MFG_CUSTOMERS,
  MFG_ITEMS,
  MFG_PEOPLE,
  MFG_TEAMS,
  PLAN_SEED,
} from "../../data/dashboard/manufacturing";

const RAW_ITEMS = ["Cotton Yarn", "Flour", "Cooking Oil", "Packaging Box", "Color Dye"];

function FieldLabel({ children, required, info }) {
  return (
    <label className="mb-1.5 flex items-center gap-1 text-[13px] font-medium text-[#1a557a]">
      {children}
      {required && <span className="text-red-500">*</span>}
      {info && <i className="far fa-question-circle text-[12px] text-slate-400" />}
    </label>
  );
}

function TextInput({ className = "", readOnly, ...props }) {
  return (
    <input
      {...props}
      readOnly={readOnly}
      className={`h-10 w-full rounded border border-slate-200 px-3 text-[13px] text-slate-700 outline-none placeholder:text-slate-400 focus:border-[#00a78b] ${
        readOnly ? "bg-slate-100 text-slate-500" : "bg-white"
      } ${className}`}
    />
  );
}

function SelectInput({ options = [], placeholder, value, onChange, disabled }) {
  return (
    <select
      value={value}
      disabled={disabled}
      onChange={(e) => onChange(e.target.value)}
      className="h-10 w-full rounded border border-slate-200 bg-white px-3 text-[13px] text-slate-700 outline-none focus:border-[#00a78b] disabled:bg-slate-100"
    >
      <option value="">{placeholder}</option>
      {options.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
  );
}

function emptyLine() {
  return {
    id: Date.now() + Math.random(),
    item: "",
    stock: "0",
    planned: "1",
    price: "0",
    inventory: "N/A",
  };
}

function lineAmount(line) {
  return (Number(line.planned) || 0) * (Number(line.price) || 0);
}

function idFromPath(pathname) {
  const m = String(pathname || "").match(/\/(\d+)(?:\/)?$/);
  return m ? Number(m[1]) : null;
}

export default function ProductionPlanFormPage({ config, pathname }) {
  const isTemplate = Boolean(config?.isTemplate);
  const mode = config?.formMode || "create";
  const readOnly = mode === "details";
  const backHref = config?.backHref || "/en/manufacturing/production-plans";
  const seedId = idFromPath(pathname);
  const seed = (seedId && PLAN_SEED[seedId]) || PLAN_SEED[1] || {};

  const [saved, setSaved] = useState("");
  const [form, setForm] = useState({
    item: seed.item || "",
    customer: seed.customer || "",
    binCard: seed.binCard || "Auto Generated",
    workOrder: seed.workOrder || "",
    quantity: seed.quantity || "",
    startDate: seed.startDate || "",
    endDate: seed.endDate || "",
    team: seed.team || "",
    responsible: seed.responsible || "",
    members: seed.members || [],
    template: seed.template || "",
    saveAsTemplate: Boolean(seed.saveAsTemplate),
    notes: seed.notes || "",
  });
  const [lines, setLines] = useState(seed.lines?.length ? seed.lines : []);

  const qty = Number(form.quantity) || 0;
  const totalAmount = useMemo(() => lines.reduce((s, l) => s + lineAmount(l), 0), [lines]);
  const perCost = qty ? totalAmount / qty : 0;

  const setField = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));
  const updateLine = (id, key, value) =>
    setLines((prev) => prev.map((line) => (line.id === id ? { ...line, [key]: value } : line)));

  if (saved) {
    return (
      <div className="rounded-lg border border-green-200 bg-green-50 p-6 text-center text-green-700">
        {saved}{" "}
        <Link href={backHref} className="font-semibold underline">
          Back to list
        </Link>
      </div>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (readOnly) return;
        setSaved("Saved successfully (demo).");
      }}
      className="rounded-lg border border-[#e5e7eb] bg-white shadow-sm"
    >
      <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
        <h1 className="m-0 text-[20px] font-semibold text-[#1a557a]">
          {config?.title || "New Production Plan"}
        </h1>
        <Link href={backHref} className="rounded p-1 text-slate-500 hover:bg-slate-100" aria-label="Close">
          <span className="material-icons text-[22px]">close</span>
        </Link>
      </div>

      <div className="space-y-6 px-5 py-5">
        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <FieldLabel required info>
              Production Item Name
            </FieldLabel>
            <SelectInput
              options={MFG_ITEMS}
              placeholder="Select Items"
              value={form.item}
              onChange={(v) => setField("item", v)}
              disabled={readOnly}
            />
          </div>
          <div>
            <FieldLabel info>Customer Name</FieldLabel>
            <SelectInput
              options={MFG_CUSTOMERS.filter((c) => c !== "N/A")}
              placeholder="Select customer"
              value={form.customer}
              onChange={(v) => setField("customer", v)}
              disabled={readOnly}
            />
          </div>
          <div>
            <FieldLabel info>Production ID/BIN card ID</FieldLabel>
            <TextInput value={form.binCard || "Auto Generated"} readOnly />
          </div>
          <div>
            <FieldLabel info>Select Workorder</FieldLabel>
            <SelectInput
              options={["WO-1001", "WO-1002", "WO-1003"]}
              placeholder="Select Work Order"
              value={form.workOrder}
              onChange={(v) => setField("workOrder", v)}
              disabled={readOnly}
            />
          </div>
          <div>
            <FieldLabel required info>
              Production Quantity
            </FieldLabel>
            <TextInput
              type="number"
              placeholder="ex:100"
              value={form.quantity}
              onChange={(e) => setField("quantity", e.target.value)}
              readOnly={readOnly}
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <FieldLabel required={!isTemplate} info>
                Start Date
              </FieldLabel>
              <TextInput
                type="date"
                value={form.startDate}
                onChange={(e) => setField("startDate", e.target.value)}
                readOnly={readOnly}
              />
            </div>
            <div>
              <FieldLabel required={!isTemplate} info>
                Deadline
              </FieldLabel>
              <TextInput
                type="date"
                value={form.endDate}
                onChange={(e) => setField("endDate", e.target.value)}
                readOnly={readOnly}
              />
            </div>
          </div>
          <div>
            <FieldLabel required info>
              Assign Production Team
            </FieldLabel>
            <SelectInput
              options={MFG_TEAMS}
              placeholder="Select team"
              value={form.team}
              onChange={(v) => setField("team", v)}
              disabled={readOnly}
            />
          </div>
          <div>
            <FieldLabel required info>
              Responsible Person
            </FieldLabel>
            <SelectInput
              options={MFG_PEOPLE}
              placeholder="Select person"
              value={form.responsible}
              onChange={(v) => setField("responsible", v)}
              disabled={readOnly}
            />
          </div>
          <div>
            <FieldLabel info>Assign Team Person</FieldLabel>
            <SelectInput
              options={MFG_PEOPLE}
              placeholder="Select team member"
              value={form.members[0] || ""}
              onChange={(v) => setField("members", v ? [v] : [])}
              disabled={readOnly}
            />
          </div>
          {!isTemplate && (
            <>
              <div>
                <FieldLabel info>Select Template</FieldLabel>
                <SelectInput
                  options={["TEMP-2026-000016", "TEMP-2026-000015", "TEMP-2026-000014"]}
                  placeholder="Select Template"
                  value={form.template}
                  onChange={(v) => setField("template", v)}
                  disabled={readOnly}
                />
              </div>
              <div className="flex items-end pb-2">
                <label className="flex items-center gap-2 text-[13px] text-[#1a557a]">
                  <input
                    type="checkbox"
                    checked={form.saveAsTemplate}
                    disabled={readOnly}
                    onChange={(e) => setField("saveAsTemplate", e.target.checked)}
                    className="accent-[#00a78b]"
                  />
                  Save as Template
                  <i className="far fa-question-circle text-[12px] text-slate-400" />
                </label>
              </div>
            </>
          )}
        </div>

        <div>
          <h3 className="mb-2 text-[14px] font-semibold text-[#1a557a]">Select raw materials</h3>
          <div className="overflow-hidden rounded-lg border border-slate-200">
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-[12px]">
                <thead className="bg-[#d9ebf7] text-[#1a557a]">
                  <tr>
                    {["ITEM NAME", "QUANTITY IN STOCK", "PLANNED QUANTITY*", "UNIT PRICE", "AMOUNT", !isTemplate ? "INVENTORY" : null, ""].filter((h) => h !== null).map((h) => (
                      <th key={h || "x"} className="whitespace-nowrap px-3 py-2.5 font-semibold">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {lines.map((line) => (
                    <tr key={line.id} className="border-t border-slate-100">
                      <td className="px-2 py-2 min-w-[160px]">
                        <SelectInput
                          options={RAW_ITEMS}
                          placeholder="Select item"
                          value={line.item}
                          onChange={(v) => updateLine(line.id, "item", v)}
                          disabled={readOnly}
                        />
                      </td>
                      <td className="px-3 py-2 text-slate-500">{line.stock}</td>
                      <td className="px-2 py-2 min-w-[90px]">
                        <TextInput
                          type="number"
                          value={line.planned}
                          readOnly={readOnly}
                          onChange={(e) => updateLine(line.id, "planned", e.target.value)}
                        />
                      </td>
                      <td className="px-2 py-2 min-w-[90px]">
                        <TextInput
                          type="number"
                          value={line.price}
                          readOnly={readOnly}
                          onChange={(e) => updateLine(line.id, "price", e.target.value)}
                        />
                      </td>
                      <td className="px-3 py-2 whitespace-nowrap">৳ {lineAmount(line).toLocaleString()}</td>
                      {!isTemplate && <td className="px-3 py-2 text-slate-500">{line.inventory}</td>}
                      <td className="px-2 py-2">
                        {!readOnly && (
                          <button
                            type="button"
                            onClick={() => setLines((prev) => prev.filter((l) => l.id !== line.id))}
                            className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-red-500"
                            aria-label="Remove item"
                          >
                            <span className="material-icons text-[18px]">close</span>
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {!readOnly && (
              <div className="border-t border-slate-100 px-3 py-2">
                <button
                  type="button"
                  onClick={() => setLines((prev) => [...prev, emptyLine()])}
                  className="inline-flex h-8 items-center rounded border border-[#00a78b] bg-white px-3 text-[12px] font-medium text-[#00a78b] hover:bg-[#f0f7fb]"
                >
                  Add Item
                </button>
              </div>
            )}
          </div>
          {!lines.length && (
            <p className="mt-2 text-[12px] italic text-slate-400">
              Please add stock details to proceed with plan approval.
            </p>
          )}
          <div className="mt-3 ml-auto w-full max-w-sm rounded-lg bg-[#f3f9fc] p-3 text-[13px] text-[#1a557a]">
            <div className="flex justify-between py-1">
              <span>Total Amount</span>
              <span>= ৳ {totalAmount.toLocaleString()}</span>
            </div>
            <div className="flex justify-between py-1">
              <span>Total Production Quantity</span>
              <span>= {qty}</span>
            </div>
            <div className="flex justify-between py-1">
              <span>Per Production Cost</span>
              <span>= ৳ {perCost.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
            </div>
          </div>
        </div>

        <div>
          <h3 className="mb-2 flex items-center gap-2 text-[14px] font-semibold text-[#1a557a]">
            <span className="material-icons text-[18px]">note</span>
            Add Note
          </h3>
          <textarea
            rows={5}
            readOnly={readOnly}
            value={form.notes}
            placeholder="Write internal note..."
            onChange={(e) => setField("notes", e.target.value)}
            className="w-full rounded border border-slate-200 px-3 py-2 text-[13px] outline-none focus:border-[#00a78b]"
          />
        </div>

        <div>
          <FieldLabel>Attach files</FieldLabel>
          <div className="rounded-lg border border-dashed border-slate-300 bg-slate-50 px-4 py-4 text-[12px] text-slate-500">
            <input type="file" disabled={readOnly} className="text-[13px]" />
            <p className="mt-2 mb-0">Maximum file size 5MB</p>
            <p className="m-0">Supported Formates: DOC, DOCX, XLX, XLSX, PDF, JPG, JPEG, PNG</p>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-2 border-t border-slate-100 px-5 py-4">
        <Link
          href={backHref}
          className="inline-flex h-9 items-center rounded border border-slate-200 px-4 text-[13px] text-slate-600 hover:bg-slate-50"
        >
          Cancel
        </Link>
        {!readOnly &&
          (isTemplate ? (
            <button
              type="submit"
              className="inline-flex h-9 items-center rounded bg-[#00a78b] px-4 text-[13px] font-medium text-white hover:bg-[#008f77]"
            >
              Save
            </button>
          ) : (
            <>
              <button
                type="submit"
                className="inline-flex h-9 items-center rounded bg-[#00a78b] px-4 text-[13px] font-medium text-white hover:bg-[#008f77]"
              >
                Save As Draft
              </button>
              <button
                type="button"
                disabled={!lines.length}
                onClick={() => setSaved("Approved successfully (demo).")}
                className="inline-flex h-9 items-center rounded border border-[#00a78b] px-4 text-[13px] font-medium text-[#00a78b] hover:bg-[#e8f1f8] disabled:cursor-not-allowed disabled:opacity-40"
              >
                Save As Approved
              </button>
            </>
          ))}
      </div>
    </form>
  );
}
