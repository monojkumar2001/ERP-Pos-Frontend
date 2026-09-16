"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { aclApi } from "../../lib/api";

function StatusPill({ value }) {
  const v = String(value || "").toLowerCase();
  const cls =
    v === "active"
      ? "bg-[#28a745] text-white"
      : v === "inactive"
        ? "bg-[#dc3545] text-white"
        : "bg-slate-400 text-white";
  return (
    <span className={`inline-flex rounded-md px-2 py-0.5 text-[11px] font-semibold ${cls}`}>
      {value}
    </span>
  );
}

export default function AclRoleDetailsPage({ config, record }) {
  const [data, setData] = useState({
    roleName: record?.roleName || "Role",
    redirectUrl: record?.redirectUrl || "/dashboard",
    users: record?.users || [],
  });
  const [loading, setLoading] = useState(Boolean(record?.id));
  const backHref = config?.backHref || "/en/acl/role/index";

  useEffect(() => {
    if (!record?.id) return;
    let cancelled = false;
    setLoading(true);
    aclApi
      .role(record.id)
      .then((res) => {
        if (cancelled) return;
        const payload = res?.data || res;
        setData({
          roleName: payload.roleName || payload.name,
          redirectUrl: payload.redirectUrl || payload.redirect_url || "/dashboard",
          users: payload.users || [],
        });
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [record?.id]);

  return (
    <div className={loading ? "opacity-90" : ""}>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h1 className="m-0 text-[22px] font-semibold text-[#2980b9]">{data.roleName}</h1>
        <div className="flex items-center gap-2">
          <Link
            href="/en/acl/user/invite"
            className="inline-flex h-9 items-center rounded border border-[#2980b9] bg-white px-4 text-[13px] font-medium text-[#2980b9]"
          >
            Add User
          </Link>
          <Link href={backHref} className="text-[18px] text-slate-400 hover:text-slate-600" aria-label="Close">
            ×
          </Link>
        </div>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-5 grid max-w-xl gap-2 text-[13px]">
          <div className="grid grid-cols-[140px_16px_1fr] items-center">
            <span className="font-semibold text-[#1a557a]">Role Name</span>
            <span>:</span>
            <span className="text-slate-700">{data.roleName}</span>
          </div>
          <div className="grid grid-cols-[140px_16px_1fr] items-center">
            <span className="font-semibold text-[#1a557a]">Redirect Url</span>
            <span>:</span>
            <span className="text-slate-700">{data.redirectUrl}</span>
          </div>
        </div>

        <div className="overflow-x-auto rounded border border-slate-200">
          <table className="min-w-full text-left text-[13px]">
            <thead className="bg-[#5dade2] text-[11px] font-semibold uppercase tracking-wide text-white">
              <tr>
                <th className="px-3 py-2">User Name</th>
                <th className="px-3 py-2">Full Name</th>
                <th className="px-3 py-2">Email</th>
                <th className="px-3 py-2">Phone Number</th>
                <th className="px-3 py-2">Assignment Status</th>
                <th className="px-3 py-2">Effective From</th>
                <th className="px-3 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {(data.users || []).length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-3 py-8 text-center text-slate-400">
                    No users assigned
                  </td>
                </tr>
              ) : (
                data.users.map((u) => (
                  <tr key={u.email} className="border-t border-slate-100">
                    <td className="px-3 py-2.5 text-[#2980b9]">{u.username || u.email}</td>
                    <td className="px-3 py-2.5">{u.fullName}</td>
                    <td className="px-3 py-2.5">{u.email}</td>
                    <td className="px-3 py-2.5">{u.phone}</td>
                    <td className="px-3 py-2.5">
                      <StatusPill value={u.status} />
                    </td>
                    <td className="px-3 py-2.5">{u.effectiveFrom || "—"}</td>
                    <td className="px-3 py-2.5">
                      <button type="button" className="text-slate-500" aria-label="Actions">
                        <span className="material-icons text-[18px]">more_vert</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
