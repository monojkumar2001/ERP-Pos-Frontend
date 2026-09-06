"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { getPageConfig } from "../../data/dashboard/pageConfigs";
import { authApi } from "../../lib/api";
import { clearSession, getCompany, getUser } from "../../lib/auth";

export default function Topbar() {
  const pathname = usePathname();
  const router = useRouter();
  const config = getPageConfig(pathname);
  const isHome = pathname === "/en/dashboard";
  const isAccountingDash = pathname === "/en/accounting/dashboard";
  const isChartOfAccounts = pathname === "/en/accounting/accounts";
  const [user, setUser] = useState(null);
  const [company, setCompany] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    setUser(getUser());
    setCompany(getCompany());
  }, []);

  useEffect(() => {
    const onDoc = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const crumbs = isHome
    ? [{ label: "Dashboard", href: "/en/dashboard" }]
    : isAccountingDash
      ? [
          { label: "Home", href: "/en/dashboard" },
          { label: "Accounting Dashboard", href: pathname },
        ]
      : isChartOfAccounts
        ? [
            { label: "Home", href: "/en/dashboard" },
            { label: "Chart Of Accounts", href: pathname },
          ]
      : [
          { label: "Home", href: "/en/dashboard" },
          {
            label: config?.title || pathname.split("/").filter(Boolean).pop(),
            href: pathname,
          },
        ];

  const initial = (user?.name || company?.name || "B").charAt(0).toUpperCase();

  const onLogout = async () => {
    setLoggingOut(true);
    try {
      await authApi.logout();
    } catch {
      // still clear local session
    } finally {
      clearSession();
      setLoggingOut(false);
      router.replace("/account/login");
    }
  };

  return (
    <header className="sticky top-0 z-30 flex h-[56px] items-center justify-between border-b border-[#e5e7eb] bg-white px-4">
      <nav className="flex items-center gap-1 text-[13px]">
        {crumbs.map((c, i) => (
          <span key={`${c.href}-${c.label}`} className="flex items-center gap-1">
            {i > 0 && <span className="text-[#8aa0b3]">›</span>}
            <Link
              href={c.href}
              className={`rounded-[4px] px-2.5 py-1 ${
                i === crumbs.length - 1
                  ? "bg-[#e8f1f8] font-medium text-[#2980b9]"
                  : "text-[#6c7a89] hover:text-[#2980b9]"
              }`}
            >
              {c.label}
            </Link>
          </span>
        ))}
      </nav>

      <div className="flex items-center gap-2">
        {company?.name ? (
          <span className="hidden max-w-[180px] truncate text-[12px] font-medium text-[#6c7a89] sm:inline">
            {company.name}
            {company.id ? (
              <span className="ml-1 text-[#98a6b5]">#{company.id}</span>
            ) : null}
          </span>
        ) : null}
        <button
          type="button"
          className="flex h-9 w-9 items-center justify-center rounded-full text-[#2980b9] hover:bg-[#e8f1f8]"
          aria-label="Settings"
        >
          <i className="fas fa-cog text-[16px]" />
        </button>

        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-[#d7e8f5] text-sm font-semibold text-[#2980b9]"
            aria-label="Profile menu"
            title={user?.name || "Profile"}
          >
            {initial}
          </button>
          {menuOpen ? (
            <div className="absolute right-0 mt-2 w-52 overflow-hidden rounded-lg border border-[#e5e7eb] bg-white shadow-lg">
              <div className="border-b border-[#eef1f4] px-3 py-2">
                <p className="m-0 truncate text-[13px] font-semibold text-[#2c3e50]">
                  {user?.name || "User"}
                </p>
                <p className="m-0 truncate text-[11px] text-[#8aa0b3]">
                  {user?.email || ""}
                </p>
              </div>
              <button
                type="button"
                onClick={onLogout}
                disabled={loggingOut}
                className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-[13px] text-[#c0392b] hover:bg-[#fff5f5] disabled:opacity-60"
              >
                <i className="fas fa-sign-out-alt text-[13px]" />
                {loggingOut ? "Logging out..." : "Logout"}
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
}
