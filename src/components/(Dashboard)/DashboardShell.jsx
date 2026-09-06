"use client";

import { useState } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function DashboardShell({ children }) {
  const [collapsed, setCollapsed] = useState(false);

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
            className="font-medium text-[#2980b9] hover:underline"
          >
            Softifybd
          </a>{" "}
          2026
        </footer>
      </div>
    </div>
  );
}
