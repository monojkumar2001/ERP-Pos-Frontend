"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  EMPLOYEE_DEPARTMENTS,
  EMPLOYEE_POSITIONS,
  EMPLOYMENT_TYPES,
  OFFICE_LOCATIONS,
  WORKING_SHIFTS,
  getEmployeeById,
} from "../../data/dashboard/employees";

function FieldLabel({ children, required }) {
  return (
    <label className="mb-1.5 block text-[13px] font-medium text-[#1a557a]">
      {children}
      {required && <span className="text-red-500"> *</span>}
    </label>
  );
}

function TextInput({ className = "", ...props }) {
  return (
    <input
      {...props}
      className={`h-10 w-full rounded border border-slate-200 bg-white px-3 text-[13px] text-slate-700 outline-none placeholder:text-slate-400 focus:border-[#00a78b] ${className}`}
    />
  );
}

function SelectInput({ options = [], placeholder, value, onChange }) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="h-10 w-full rounded border border-slate-200 bg-white px-3 text-[13px] text-slate-700 outline-none focus:border-[#00a78b]"
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

const emptyForm = {
  name: "",
  code: "",
  email: "",
  phone_number: "",
  gender: "",
  date_of_birth: "",
  blood_group: "",
  nid: "",
  department: "",
  position: "",
  employment_type: "",
  joining_date: "",
  office_location: "",
  shift: "",
  address: "",
  emergency_contact: "",
  status: "Active",
};

export default function EmployeeFormPage({ config, pathname }) {
  const isEdit = config?.formMode === "edit";
  const recordId = useMemo(() => {
    const parts = String(pathname || "").split("/");
    const last = parts[parts.length - 1];
    return /^\d+$/.test(last) ? last : null;
  }, [pathname]);

  const seed = useMemo(() => {
    if (!isEdit || !recordId) return null;
    return getEmployeeById(recordId);
  }, [isEdit, recordId]);

  const [form, setForm] = useState(() => ({
    ...emptyForm,
    ...(seed
      ? {
          name: seed.name,
          code: seed.code,
          email: seed.email,
          phone_number: seed.phone_number,
          gender: seed.gender || "",
          department: seed.department,
          position: seed.position,
          employment_type: seed.employment_type,
          joining_date: seed.joining_date,
          office_location: seed.office_location || "",
          shift: seed.shift || "",
          status: seed.status,
        }
      : {}),
  }));
  const [saved, setSaved] = useState(false);

  const set = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));
  const backHref = config?.backHref || "/en/hrm/employee/employees";

  const onSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.code.trim()) return;
    setSaved(true);
  };

  if (saved) {
    return (
      <div className="rounded-lg border border-green-200 bg-green-50 p-8 text-center text-green-700">
        Employee {isEdit ? "updated" : "created"} successfully (demo).{" "}
        <Link href={backHref} className="font-semibold underline">
          Back to Employees
        </Link>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h1 className="m-0 text-[22px] font-semibold text-[#2c3e50]">
          {config?.title || (isEdit ? "Edit Employee" : "Add Employee")}
        </h1>
        <Link
          href={backHref}
          className="inline-flex h-9 items-center rounded border border-slate-200 bg-white px-3 text-[13px] text-slate-600 hover:bg-slate-50"
        >
          Close
        </Link>
      </div>

      <form
        onSubmit={onSubmit}
        className="rounded-lg border border-[#e5e7eb] bg-white p-5 shadow-sm"
      >
        <div className="mb-6 flex items-start gap-4">
          <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full border-2 border-dashed border-slate-300 bg-slate-50 text-slate-400">
            <span className="material-icons text-[36px]">person</span>
          </div>
          <div>
            <p className="m-0 text-[13px] font-medium text-[#1a557a]">Profile Photo</p>
            <p className="mt-1 text-[12px] text-slate-500">
              Optional. JPG or PNG, max 2MB.
            </p>
            <button
              type="button"
              className="mt-2 h-8 rounded border border-[#00a78b] px-3 text-[12px] font-medium text-[#00a78b] hover:bg-[#e8f1f8]"
            >
              Upload Photo
            </button>
          </div>
        </div>

        <h2 className="mb-3 text-[15px] font-semibold text-[#1a557a]">Basic Information</h2>
        <div className="mb-6 grid gap-4 md:grid-cols-3">
          <div>
            <FieldLabel required>Employee Name</FieldLabel>
            <TextInput
              required
              value={form.name}
              placeholder="Enter employee name"
              onChange={(e) => set("name", e.target.value)}
            />
          </div>
          <div>
            <FieldLabel required>Employee Code</FieldLabel>
            <TextInput
              required
              value={form.code}
              placeholder="Enter employee code"
              onChange={(e) => set("code", e.target.value)}
            />
          </div>
          <div>
            <FieldLabel>Gender</FieldLabel>
            <SelectInput
              placeholder="Select Gender"
              options={["Male", "Female", "Other"]}
              value={form.gender}
              onChange={(v) => set("gender", v)}
            />
          </div>
          <div>
            <FieldLabel>Email</FieldLabel>
            <TextInput
              type="email"
              value={form.email}
              placeholder="Enter email"
              onChange={(e) => set("email", e.target.value)}
            />
          </div>
          <div>
            <FieldLabel required>Phone Number</FieldLabel>
            <TextInput
              required
              value={form.phone_number}
              placeholder="Enter phone number"
              onChange={(e) => set("phone_number", e.target.value)}
            />
          </div>
          <div>
            <FieldLabel>Date of Birth</FieldLabel>
            <TextInput
              value={form.date_of_birth}
              placeholder="DD MMM YYYY"
              onChange={(e) => set("date_of_birth", e.target.value)}
            />
          </div>
          <div>
            <FieldLabel>Blood Group</FieldLabel>
            <SelectInput
              placeholder="Select Blood Group"
              options={["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]}
              value={form.blood_group}
              onChange={(v) => set("blood_group", v)}
            />
          </div>
          <div>
            <FieldLabel>NID / Passport</FieldLabel>
            <TextInput
              value={form.nid}
              placeholder="Enter NID or passport"
              onChange={(e) => set("nid", e.target.value)}
            />
          </div>
          <div>
            <FieldLabel>Emergency Contact</FieldLabel>
            <TextInput
              value={form.emergency_contact}
              placeholder="Enter emergency contact"
              onChange={(e) => set("emergency_contact", e.target.value)}
            />
          </div>
        </div>

        <h2 className="mb-3 text-[15px] font-semibold text-[#1a557a]">Official Information</h2>
        <div className="mb-6 grid gap-4 md:grid-cols-3">
          <div>
            <FieldLabel required>Department</FieldLabel>
            <SelectInput
              placeholder="Select Department"
              options={EMPLOYEE_DEPARTMENTS}
              value={form.department}
              onChange={(v) => set("department", v)}
            />
          </div>
          <div>
            <FieldLabel required>Position</FieldLabel>
            <SelectInput
              placeholder="Select Position"
              options={EMPLOYEE_POSITIONS}
              value={form.position}
              onChange={(v) => set("position", v)}
            />
          </div>
          <div>
            <FieldLabel required>Employment Type</FieldLabel>
            <SelectInput
              placeholder="Select Employment Type"
              options={EMPLOYMENT_TYPES}
              value={form.employment_type}
              onChange={(v) => set("employment_type", v)}
            />
          </div>
          <div>
            <FieldLabel required>Joining Date</FieldLabel>
            <TextInput
              required
              value={form.joining_date}
              placeholder="DD MMM YYYY"
              onChange={(e) => set("joining_date", e.target.value)}
            />
          </div>
          <div>
            <FieldLabel>Office Location</FieldLabel>
            <SelectInput
              placeholder="Select Office Location"
              options={OFFICE_LOCATIONS}
              value={form.office_location}
              onChange={(v) => set("office_location", v)}
            />
          </div>
          <div>
            <FieldLabel>Working Shift</FieldLabel>
            <SelectInput
              placeholder="Select Working Shift"
              options={WORKING_SHIFTS}
              value={form.shift}
              onChange={(v) => set("shift", v)}
            />
          </div>
          <div>
            <FieldLabel>Status</FieldLabel>
            <SelectInput
              placeholder="Select Status"
              options={["Active", "Inactive"]}
              value={form.status}
              onChange={(v) => set("status", v)}
            />
          </div>
          <div className="md:col-span-2">
            <FieldLabel>Address</FieldLabel>
            <TextInput
              value={form.address}
              placeholder="Enter address"
              onChange={(e) => set("address", e.target.value)}
            />
          </div>
        </div>

        <div className="flex flex-wrap gap-2 border-t border-slate-100 pt-4">
          <button
            type="submit"
            className="h-10 rounded bg-[#00a78b] px-5 text-[13px] font-medium text-white hover:bg-[#008f77]"
          >
            {isEdit ? "Save Changes" : "Save"}
          </button>
          <Link
            href={backHref}
            className="inline-flex h-10 items-center rounded border border-slate-200 px-5 text-[13px] text-slate-600 hover:bg-slate-50"
          >
            Cancel
          </Link>
        </div>
      </form>
    </div>
  );
}
