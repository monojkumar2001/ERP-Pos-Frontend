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

export default function AclUserDetailsPage({ config, record }) {
  const [data, setData] = useState({
    username: record?.username || "user",
    fullName: record?.fullName || "User",
    email: record?.email || "user@example.com",
    phone: record?.phone || "01700000000",
    status: record?.status || "Active",
    statusSince: record?.statusSince || "—",
    userSince: record?.userSince || "—",
    roles: record?.roles || [],
  });
  const [loading, setLoading] = useState(Boolean(record?.id));
  const backHref = config?.backHref || "/en/acl/user/index";

  useEffect(() => {
    if (!record?.id) return;
    let cancelled = false;
    setLoading(true);
    aclApi
      .user(record.id)
      .then((res) => {
        if (cancelled) return;
        const payload = res?.data || res;
        setData({
          username: payload.username,
          fullName: payload.fullName,
          email: payload.email,
          phone: payload.phone,
          status: payload.status,
          statusSince: payload.statusSince,
          userSince: payload.userSince,
          roles: payload.roles || [],
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
        <h1 className="m-0 text-[22px] font-semibold text-[#2980b9]">{data.email}</h1>
        <div className="flex items-center gap-2">
          <Link
            href="/en/acl/user/invite"
            className="inline-flex h-9 items-center rounded border border-[#2980b9] bg-white px-4 text-[13px] font-medium text-[#2980b9]"
          >
            Add Role
          </Link>
          <Link href={backHref} className="text-[18px] text-slate-400 hover:text-slate-600" aria-label="Close">
            ×
          </Link>
        </div>
      </div>

      <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
        <div className="mb-5 grid max-w-2xl gap-2 text-[13px]">
          {[
            ["User Name", data.username],
            ["Full Name", data.fullName],
            ["Email", data.email],
            ["Phone Number", data.phone],
          ].map(([label, value]) => (
            <div key={label} className="grid grid-cols-[140px_16px_1fr] items-center">
              <span className="font-semibold text-[#1a557a]">{label}</span>
              <span>:</span>
              <span className="text-slate-700">{value}</span>
            </div>
          ))}
          <div className="grid grid-cols-[140px_16px_1fr] items-center">
            <span className="font-semibold text-[#1a557a]">Status</span>
            <span>:</span>
            <span className="inline-flex items-center gap-2 text-slate-700">
              <StatusPill value={data.status} />
              <span>Since - {data.statusSince}</span>
            </span>
          </div>
          <div className="grid grid-cols-[140px_16px_1fr] items-center">
            <span className="font-semibold text-[#1a557a]">User Since</span>
            <span>:</span>
            <span className="text-slate-700">{data.userSince}</span>
          </div>
        </div>

        <div className="overflow-x-auto rounded border border-slate-200">
          <table className="min-w-full text-left text-[13px]">
            <thead className="bg-white text-[11px] font-semibold uppercase tracking-wide text-[#1a557a]">
              <tr className="border-b border-slate-200">
                <th className="px-3 py-2">Role Name</th>
                <th className="px-3 py-2">Redirect Url</th>
                <th className="px-3 py-2">Assignment Status</th>
                <th className="px-3 py-2">Effective From</th>
                <th className="px-3 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {(data.roles || []).length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-3 py-8 text-center text-slate-400">
                    No roles assigned
                  </td>
                </tr>
              ) : (
                data.roles.map((r) => (
                  <tr key={r.roleName} className="border-t border-slate-100">
                    <td className="px-3 py-2.5 text-[#2980b9]">{r.roleName}</td>
                    <td className="px-3 py-2.5">{r.redirectUrl}</td>
                    <td className="px-3 py-2.5">
                      <StatusPill value={r.status} />
                    </td>
                    <td className="px-3 py-2.5">{r.effectiveFrom || "—"}</td>
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
