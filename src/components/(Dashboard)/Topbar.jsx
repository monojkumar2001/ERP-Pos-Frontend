"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { getPageConfig } from "../../data/dashboard/pageConfigs";

export default function Topbar() {
  const pathname = usePathname();
  const config = getPageConfig(pathname);
  const isHome = pathname === "/en/dashboard";
  const isAccountingDash = pathname === "/en/accounting/dashboard";
  const isChartOfAccounts = pathname === "/en/accounting/accounts";

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

  return (
    <header className="sticky top-0 z-30 flex h-[56px] items-center justify-between border-b border-[#e5e7eb] bg-white px-4">
      <nav className="flex items-center gap-1 text-[13px]">
        {crumbs.map((c, i) => (
          <span key={`${c.href}-${c.label}`} className="flex items-center gap-1">
            {i > 0 && (
              <span className="text-[#8aa0b3]">›</span>
            )}
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
        <button
          type="button"
          className="flex h-9 w-9 items-center justify-center rounded-full text-[#2980b9] hover:bg-[#e8f1f8]"
          aria-label="Settings"
        >
          <i className="fas fa-cog text-[16px]" />
        </button>
        <button
          type="button"
          className="flex h-9 w-9 items-center justify-center rounded-full bg-[#d7e8f5] text-sm font-semibold text-[#2980b9]"
          aria-label="Profile"
        >
          B
        </button>
      </div>
    </header>
  );
}
