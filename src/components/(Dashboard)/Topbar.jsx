"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { getPageConfig } from "../../data/dashboard/pageConfigs";
import { getCompany, getUser } from "../../lib/auth";
import ProfileMenu from "./ProfileMenu";
import SettingsDrawer from "./SettingsDrawer";

export default function Topbar() {
  const pathname = usePathname();
  const config = getPageConfig(pathname);
  const isHome = pathname === "/en/dashboard";
  const isAccountingDash = pathname === "/en/accounting/dashboard";
  const isChartOfAccounts = pathname === "/en/accounting/accounts";
  const [user, setUser] = useState(null);
  const [company, setCompany] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    setUser(getUser());
    setCompany(getCompany());
  }, []);

  useEffect(() => {
    setSettingsOpen(false);
    setMenuOpen(false);
  }, [pathname]);

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

  return (
    <>
      <header className="sticky top-0 z-30 flex h-[56px] items-center justify-between border-b border-[#e5e7eb] bg-white px-4">
        <nav className="flex items-center gap-1 text-[13px]">
          {crumbs.map((c, i) => (
            <span key={`${c.href}-${c.label}`} className="flex items-center gap-1">
              {i > 0 && <span className="text-[#8aa0b3]">›</span>}
              <Link
                href={c.href}
                className={`rounded-[4px] px-2.5 py-1 ${
                  i === crumbs.length - 1
                    ? "bg-[#e8f1f8] font-medium text-[#00a78b]"
                    : "text-[#6c7a89] hover:text-[#00a78b]"
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
            onClick={() => {
              setMenuOpen(false);
              setSettingsOpen(true);
            }}
            className="flex h-9 w-9 items-center justify-center rounded-full text-[#00a78b] hover:bg-[#e8f1f8]"
            aria-label="Settings"
          >
            <i className="fas fa-cog text-[16px]" />
          </button>

          <div className="relative" ref={menuRef}>
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full bg-[#00a78b] text-sm font-semibold text-white"
              aria-label="Profile menu"
              title={user?.name || "Profile"}
            >
              {initial}
            </button>
            <ProfileMenu
              open={menuOpen}
              onClose={() => setMenuOpen(false)}
              onOpenSettings={() => setSettingsOpen(true)}
            />
          </div>
        </div>
      </header>

      <SettingsDrawer open={settingsOpen} onClose={() => setSettingsOpen(false)} />
    </>
  );
}
