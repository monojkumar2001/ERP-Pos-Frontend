"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { getEmployeeById } from "../../data/dashboard/employees";

function StatusPill({ value }) {
  const active = String(value || "").toLowerCase() === "active";
  return (
    <span
      className={`inline-flex rounded-md px-2 py-0.5 text-[11px] font-semibold text-white ${
        active ? "bg-[#28a745]" : "bg-[#dc3545]"
      }`}
    >
      {value || "Active"}
    </span>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="grid grid-cols-[140px_1fr] gap-2 border-b border-slate-100 py-2.5 text-[13px] last:border-0">
      <span className="font-medium text-slate-500">{label}</span>
      <span className="text-slate-800">{value || "N/A"}</span>
    </div>
  );
}

export default function EmployeeDetailsPage({ config, pathname }) {
  const recordId = useMemo(() => {
    const parts = String(pathname || "").split("/");
    const last = parts[parts.length - 1];
    return /^\d+$/.test(last) ? last : "116";
  }, [pathname]);

  const seed = getEmployeeById(recordId) || getEmployeeById(116);
  const [status, setStatus] = useState(seed?.status || "Active");
  const data = { ...seed, status };
  const backHref = config?.backHref || "/en/hrm/employee/employees";
  const editHref = `/en/hrm/employee/employee-update/${data.id}`;
  const inactive = String(status).toLowerCase() === "inactive";

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h1 className="m-0 text-[22px] font-semibold text-[#1a557a]">
          {data.name}&apos;s Details
        </h1>
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href={editHref}
            className="inline-flex h-9 items-center rounded border border-[#00a78b] bg-white px-3 text-[13px] font-medium text-[#00a78b] hover:bg-[#00a78b] hover:text-white"
          >
            Edit
          </Link>
          <button
            type="button"
            onClick={() => setStatus(inactive ? "Active" : "Inactive")}
            className="inline-flex h-9 items-center rounded border border-slate-200 bg-white px-3 text-[13px] font-medium text-slate-600 hover:bg-slate-50"
          >
            {inactive ? "Make Active" : "Make Inactive"}
          </button>
          <Link
            href={backHref}
            className="inline-flex h-9 items-center rounded border border-slate-200 bg-white px-3 text-[13px] text-slate-600 hover:bg-slate-50"
          >
            Close
          </Link>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[280px_1fr]">
        <div className="rounded-lg border border-[#e5e7eb] bg-white p-5 text-center shadow-sm">
          <div className="mx-auto mb-3 flex h-24 w-24 items-center justify-center rounded-full bg-[#e8f1f8] text-[#00a78b]">
            <span className="material-icons text-[48px]">person</span>
          </div>
          <h2 className="m-0 text-[18px] font-semibold text-[#2c3e50]">{data.name}</h2>
          <p className="mt-1 text-[13px] text-slate-500">{data.position}</p>
          <div className="mt-3 flex justify-center">
            <StatusPill value={status} />
          </div>
          <p className="mt-4 text-[12px] text-slate-400">Code: {data.code}</p>
        </div>

        <div className="rounded-lg border border-[#e5e7eb] bg-white p-5 shadow-sm">
          <h3 className="mb-2 text-[15px] font-semibold text-[#1a557a]">Official Information</h3>
          <InfoRow label="Department" value={data.department} />
          <InfoRow label="Position" value={data.position} />
          <InfoRow label="Employment Type" value={data.employment_type} />
          <InfoRow label="Joining Date" value={data.joining_date} />
          <InfoRow label="Office Location" value={data.office_location} />
          <InfoRow label="Working Shift" value={data.shift} />
          <InfoRow
            label="Weekend"
            value={(data.weekends || []).join(", ") || "N/A"}
          />

          <h3 className="mb-2 mt-6 text-[15px] font-semibold text-[#1a557a]">
            Contact Information
          </h3>
          <InfoRow label="Email" value={data.email} />
          <InfoRow label="Phone Number" value={data.phone_number} />
          <InfoRow label="Gender" value={data.gender} />
        </div>
      </div>
    </div>
  );
}
