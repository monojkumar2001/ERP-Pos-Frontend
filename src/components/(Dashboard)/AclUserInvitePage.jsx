"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { aclApi } from "../../lib/api";

export default function AclUserInvitePage({ config }) {
  const router = useRouter();
  const backHref = config?.backHref || "/en/acl/user/index";
  const [roles, setRoles] = useState([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    email: "",
    full_name: "",
    phone: "",
    role_id: "",
  });

  useEffect(() => {
    aclApi
      .roles()
      .then((res) => setRoles(res.rows || []))
      .catch(() => setRoles([]));
  }, []);

  const canSave = useMemo(
    () =>
      Boolean(form.email.trim() && form.full_name.trim() && form.role_id) && !saving,
    [form, saving]
  );

  const onSave = async (e) => {
    e.preventDefault();
    if (!canSave) return;
    setSaving(true);
    setError("");
    try {
      await aclApi.inviteUser({
        email: form.email.trim(),
        full_name: form.full_name.trim(),
        phone: form.phone || null,
        role_id: Number(form.role_id),
      });
      router.push(backHref);
    } catch (err) {
      setError(err.message || "Invite failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="m-0 text-[22px] font-semibold text-[#1a557a]">
          {config?.title || "Invite an User"}
        </h1>
        <Link href={backHref} className="text-[18px] text-slate-400 hover:text-slate-600">
          ×
        </Link>
      </div>

      {error && (
        <div className="mb-3 rounded border border-red-200 bg-red-50 px-3 py-2 text-[13px] text-red-700">
          {error}
        </div>
      )}

      <form
        onSubmit={onSave}
        className="max-w-xl space-y-4 rounded-lg border border-slate-200 bg-white p-5 shadow-sm"
      >
        <div>
          <label className="mb-1 block text-[13px] font-medium text-[#1a557a]">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
            placeholder="user@example.com"
            className="h-10 w-full rounded border border-slate-200 px-3 text-[13px]"
          />
        </div>
        <div>
          <label className="mb-1 block text-[13px] font-medium text-[#1a557a]">
            Full Name <span className="text-red-500">*</span>
          </label>
          <input
            required
            value={form.full_name}
            onChange={(e) => setForm((p) => ({ ...p, full_name: e.target.value }))}
            placeholder="Full Name"
            className="h-10 w-full rounded border border-slate-200 px-3 text-[13px]"
          />
        </div>
        <div>
          <label className="mb-1 block text-[13px] font-medium text-[#1a557a]">Phone Number</label>
          <input
            value={form.phone}
            onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
            placeholder="Phone Number"
            className="h-10 w-full rounded border border-slate-200 px-3 text-[13px]"
          />
        </div>
        <div>
          <label className="mb-1 block text-[13px] font-medium text-[#1a557a]">
            Role <span className="text-red-500">*</span>
          </label>
          <select
            required
            value={form.role_id}
            onChange={(e) => setForm((p) => ({ ...p, role_id: e.target.value }))}
            className="h-10 w-full rounded border border-slate-200 px-3 text-[13px]"
          >
            <option value="">Select Role</option>
            {roles.map((r) => (
              <option key={r.id} value={r.id}>
                {r.role_name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex justify-end gap-2 pt-2">
          <Link
            href={backHref}
            className="inline-flex h-9 items-center rounded border border-slate-300 px-4 text-[13px]"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={!canSave}
            className="inline-flex h-9 items-center rounded bg-[#2980b9] px-4 text-[13px] font-medium text-white disabled:bg-slate-300"
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </form>
    </div>
  );
}
