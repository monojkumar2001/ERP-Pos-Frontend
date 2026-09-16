"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { isLoggedIn } from "../../lib/auth";

export default function DashboardShell({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!isLoggedIn()) {
      router.replace(`/account/login?next=${encodeURIComponent(pathname || "/en/dashboard")}`);
      return;
    }
    setReady(true);
  }, [pathname, router]);

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f4f6f8] text-sm text-[#6c7a89]">
        Checking session...
      </div>
    );
  }

  return (
    <div
      className="min-h-screen font-[family-name:var(--font-poppins)] text-[13.6px] text-[#2c3e50]"
      style={{ backgroundColor: "#f4f6f8" }}
    >
      <Sidebar collapsed={collapsed} onToggleCollapse={() => setCollapsed((v) => !v)} />
      <div
        className={`flex min-h-screen flex-col transition-all duration-200 ${
          collapsed ? "pl-[64px]" : "pl-[256px]"
        }`}
      >
        <Topbar />
        <main className="flex-1 p-4 md:p-5">{children}</main>
        <footer className="px-4 py-3 text-[12px] text-[#8aa0b3]">
          Copyright ©{" "}
          <a
            href="https://softifybd.com"
            target="_blank"
            rel="noreferrer"
            className="font-medium text-[#00a78b] hover:underline"
          >
            Softifybd
          </a>{" "}
          2026
        </footer>
      </div>
    </div>
  );
}
