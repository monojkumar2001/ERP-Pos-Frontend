"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { QUICK_ACTIONS, RING_COLORS } from "../../data/dashboard/tokens";
import { dashboardApi } from "../../lib/api";

function Ring({ percent, color }) {
  const raw = String(percent).replace("%", "").replace("+", "");
  const num = Math.min(100, Number(raw) || 0);
  const r = 26;
  const c = 2 * Math.PI * r;
  const offset = c - (num / 100) * c;

  return (
    <div className="relative h-[70px] w-[70px] shrink-0">
      <svg width="70" height="70" className="-rotate-90">
        <circle cx="35" cy="35" r={r} fill="none" stroke="#dddddd" strokeWidth="7" />
        <circle
          cx="35"
          cy="35"
          r={r}
          fill="none"
          stroke={color}
          strokeWidth="7"
          strokeDasharray={c}
          strokeDashoffset={offset}
          strokeLinecap="butt"
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-[11px] font-semibold text-[#1a557a]">
        {percent}
      </span>
    </div>
  );
}

function PeriodCard({ currentLabel, currentValue, prevLabel, prevValue, percent, color, trend }) {
  const icon =
    trend === "up"
      ? "fas fa-long-arrow-alt-up"
      : trend === "down"
        ? "fas fa-long-arrow-alt-down"
        : "fas fa-arrows-alt-v";
  const iconColor =
    trend === "up" ? "#198754" : trend === "down" ? "#dc3545" : "#9ca3af";

  return (
    <div
      className="info-box flex h-[90px] items-center rounded-[6px] bg-white px-3"
      style={{ boxShadow: "rgba(0, 0, 0, 0.1) 1px 1px 2px 2px" }}
    >
      <div className="flex min-w-0 flex-1 items-start gap-2">
        <i
          className={icon}
          style={{ fontSize: 40, marginRight: 4, marginTop: 8, color: iconColor }}
        />
        <div className="min-w-0 leading-[1.25]">
          <div className="cursor-pointer text-[12px] text-[#1a557a]">
            {currentLabel}{" "}
            <span className="font-semibold">BDT {currentValue}</span>
          </div>
          <div className="mt-1 text-[12px] text-[#1a557a]">
            {prevLabel} <span className="font-semibold">BDT {prevValue}</span>
          </div>
        </div>
      </div>
      <div className="mx-2 h-12 w-px bg-[#e5e7eb]" />
      <Ring percent={percent} color={color} />
    </div>
  );
}

function SectionBanner({ title }) {
  return (
    <div className="mb-3 rounded bg-[#e8ecf5] px-3 py-2.5 text-center">
      <h6 className="m-0 text-[13px] font-semibold uppercase tracking-wide text-[#1a557a]">
        {title}
      </h6>
    </div>
  );
}

function PeriodGrid({ rows }) {
  return (
    <div className="mb-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
      {(rows || []).map((row, i) => (
        <PeriodCard key={`${row.currentLabel}-${i}`} {...row} color={RING_COLORS[i % 4]} />
      ))}
    </div>
  );
}

function FinanceCard({ title, total, leftTitle, leftRows, rightTotal, rightTitle, rightRows }) {
  return (
    <div className="overflow-hidden rounded border border-[#e5e7eb] bg-white shadow-sm">
      <div className="flex items-center justify-between bg-[#e8ecf5] px-4 py-3">
        <h6 className="m-0 text-[13px] font-semibold uppercase text-[#1a557a]">{title}</h6>
        <span className="text-[14px] font-semibold text-[#1a557a]">{total}</span>
      </div>
      <div className="grid gap-0 md:grid-cols-2">
        <div className="border-b border-[#eef1f4] p-4 md:border-b-0 md:border-r">
          <div className="mb-2 text-[12px] font-semibold text-[#1a557a]">{leftTitle}</div>
          {(leftRows || []).map(([l, v]) => (
            <div key={l} className="mb-1 flex justify-between text-[12px] text-[#486575]">
              <span>{l}</span>
              <span className="font-medium text-[#1a557a]">{v}</span>
            </div>
          ))}
        </div>
        <div className="p-4">
          {rightTotal && (
            <div className="mb-2 text-right text-[13px] font-semibold text-[#1a557a]">
              {rightTotal}
            </div>
          )}
          {rightTitle && (
            <div className="mb-2 text-[12px] font-semibold text-[#1a557a]">{rightTitle}</div>
          )}
          {rightRows?.map(([l, v]) => (
            <div key={l} className="mb-1 flex justify-between text-[12px] text-[#486575]">
              <span>{l}</span>
              <span className="font-medium text-[#1a557a]">{v}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function MiniBar({ label, value, max = 70, color }) {
  const w = Math.max(2, (value / max) * 100);
  return (
    <div className="mb-2">
      <div className="mb-1 flex justify-between text-[11px] text-[#1a557a]">
        <span>{label}</span>
        <span>{value}</span>
      </div>
      <div className="h-3 rounded bg-[#eef2f7]">
        <div className="h-3 rounded" style={{ width: `${w}%`, backgroundColor: color }} />
      </div>
    </div>
  );
}

const FALLBACK = {
  sales: [
    { currentLabel: "Today", currentValue: "503,215", prevLabel: "Yesterday", prevValue: "3,060,800", percent: "608%", trend: "down" },
    { currentLabel: "This Week", currentValue: "3,564,015", prevLabel: "Last Week", prevValue: "29,560", percent: "1000+%", trend: "up" },
    { currentLabel: "This Month", currentValue: "3,601,859.83", prevLabel: "Last Month", prevValue: "640,126.55", percent: "563%", trend: "up" },
    { currentLabel: "This Year", currentValue: "38,349,021.4", prevLabel: "Last Year", prevValue: "47,558,256.78", percent: "124%", trend: "down" },
  ],
  pos: [
    { currentLabel: "Today", currentValue: "0", prevLabel: "Yesterday", prevValue: "5,500", percent: "0%", trend: "down" },
    { currentLabel: "This Week", currentValue: "5,500", prevLabel: "Last Week", prevValue: "3,650", percent: "151%", trend: "up" },
    { currentLabel: "This Month", currentValue: "9,150", prevLabel: "Last Month", prevValue: "432,931", percent: "1000+%", trend: "down" },
    { currentLabel: "This Year", currentValue: "814,060.18", prevLabel: "Last Year", prevValue: "819,809.15", percent: "101%", trend: "down" },
  ],
  purchase: [
    { currentLabel: "Today", currentValue: "529", prevLabel: "Yesterday", prevValue: "900,222", percent: "1000+%", trend: "down" },
    { currentLabel: "This Week", currentValue: "902,951", prevLabel: "Last Week", prevValue: "223,550", percent: "404%", trend: "up" },
    { currentLabel: "This Month", currentValue: "1,257,601", prevLabel: "Last Month", prevValue: "1,266,282.02", percent: "101%", trend: "down" },
    { currentLabel: "This Year", currentValue: "123,151,651.73", prevLabel: "Last Year", prevValue: "22,862,214,773.07", percent: "1000+%", trend: "up" },
  ],
  receivables: {
    total: "৳ 36,673,590.49",
    left_title: "Total Unpaid Invoices",
    left_rows: [
      ["Current (This Month)", "৳ 1,995"],
      ["Overdue (Previous Months)", "৳ 36,671,595.49"],
    ],
  },
  payables: {
    total: "৳ 22,019,865,121.59",
    left_title: "Total Unpaid Bills",
    left_rows: [
      ["Current (This Month)", "৳ 117,200"],
      ["Overdue (Previous Months)", "৳ 22,019,747,921.59"],
    ],
  },
  sales_returnable: {
    total: "৳ 7,501,734.12",
    left_title: "Total Payable Memos",
    left_rows: [
      ["Current (This Month)", "৳ 0"],
      ["Previous (Till Previous Month)", "৳ 7,501,734.12"],
    ],
    right_total: "৳ 2,451,065.22",
    right_title: "Total Applied Memos",
    right_rows: [
      ["Current (This Month)", "৳ 0"],
      ["Previous (Till Previous Month)", "৳ 2,451,065.22"],
    ],
  },
  purchase_returnable: {
    total: "৳ 554,428",
    left_title: "Total Receivable Memos",
    left_rows: [
      ["Current (This Month)", "৳ 0"],
      ["Previous (Till Previous Month)", "৳ 554,428"],
    ],
    right_total: "৳ 1,507,498",
    right_title: "Total Applied Memos",
    right_rows: [
      ["Current (This Month)", "৳ 0"],
      ["Previous (Till Previous Month)", "৳ 1,507,498"],
    ],
  },
  item_details: [
    { label: "Low Stock Items", value: "247", color: "#f55151" },
    { label: "All Active Items", value: "4,726", color: "#00c278" },
    { label: "All Item Groups", value: "142", color: "#4ca6ff" },
    { label: "All Items", value: "4,756", color: "#6a5acd" },
  ],
  top_selling_items: [
    { name: "TP Link 1pc", qty: "128" },
    { name: "Rice 25kg", qty: "96" },
    { name: "Soybean Oil 5L", qty: "84" },
    { name: "Sugar 1kg", qty: "71" },
    { name: "Flour 10kg", qty: "63" },
  ],
  hrm: {
    attendance: [
      { label: "Present", value: 70, color: "#00c278" },
      { label: "Absent", value: 8, color: "#f55151" },
      { label: "Late", value: 12, color: "#ffa34d" },
      { label: "EarlyOut", value: 5, color: "#4ca6ff" },
      { label: "Weekend", value: 0, color: "#9b59b6" },
      { label: "Holiday", value: 0, color: "#95a5a6" },
    ],
    departments: [
      { department: "Sales", present: 18, absent: 1, late: 2, early_out: 0, weekend: 0, holiday: 0 },
      { department: "Accounts", present: 8, absent: 0, late: 1, early_out: 0, weekend: 0, holiday: 0 },
      { department: "Warehouse", present: 14, absent: 2, late: 3, early_out: 1, weekend: 0, holiday: 0 },
      { department: "HR", present: 5, absent: 0, late: 0, early_out: 0, weekend: 0, holiday: 0 },
      { department: "Production", present: 25, absent: 5, late: 6, early_out: 4, weekend: 0, holiday: 0 },
    ],
  },
};

export default function DashboardHome() {
  const [data, setData] = useState(FALLBACK);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    dashboardApi
      .home()
      .then((res) => {
        if (cancelled) return;
        const payload = res?.data || res;
        if (payload?.sales) setData({ ...FALLBACK, ...payload });
      })
      .catch(() => {
        /* keep FALLBACK (live-aligned) when API unavailable */
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const recv = data.receivables || FALLBACK.receivables;
  const pay = data.payables || FALLBACK.payables;
  const sRet = data.sales_returnable || FALLBACK.sales_returnable;
  const pRet = data.purchase_returnable || FALLBACK.purchase_returnable;
  const items = data.item_details || FALLBACK.item_details;
  const top = data.top_selling_items || FALLBACK.top_selling_items;
  const hrm = data.hrm || FALLBACK.hrm;

  return (
    <div className={`text-[#1a557a] ${loading ? "opacity-90" : ""}`}>
      <div className="mb-4 flex flex-wrap gap-3">
        {QUICK_ACTIONS.map((a) => (
          <Link
            key={a.href}
            href={a.href}
            className="btn-squared-default flex h-[120px] w-[120px] flex-col items-center justify-center gap-2 rounded-[6px] px-3 py-1.5 text-center text-white shadow-sm transition hover:opacity-95"
            style={{ backgroundColor: a.color }}
          >
            <i className={`fas ${a.icon} text-[36px]`} />
            <span className="text-[12px] font-semibold leading-tight">{a.label}</span>
          </Link>
        ))}
      </div>

      <SectionBanner title="Sales" />
      <PeriodGrid rows={data.sales} />

      <SectionBanner title="Pos" />
      <PeriodGrid rows={data.pos} />

      <SectionBanner title="Purchase" />
      <PeriodGrid rows={data.purchase} />

      <div className="mb-4 grid gap-3 lg:grid-cols-2">
        <FinanceCard
          title="Total Receivables"
          total={recv.total}
          leftTitle={recv.left_title}
          leftRows={recv.left_rows}
        />
        <FinanceCard
          title="Total Payables"
          total={pay.total}
          leftTitle={pay.left_title}
          leftRows={pay.left_rows}
        />
        <FinanceCard
          title="Total Sales Returnable"
          total={sRet.total}
          leftTitle={sRet.left_title}
          leftRows={sRet.left_rows}
          rightTotal={sRet.right_total}
          rightTitle={sRet.right_title}
          rightRows={sRet.right_rows}
        />
        <FinanceCard
          title="Total Purchase Returnable"
          total={pRet.total}
          leftTitle={pRet.left_title}
          leftRows={pRet.left_rows}
          rightTotal={pRet.right_total}
          rightTitle={pRet.right_title}
          rightRows={pRet.right_rows}
        />
      </div>

      <div className="mb-4 grid gap-3 lg:grid-cols-2">
        <div className="overflow-hidden rounded border border-[#e5e7eb] bg-white shadow-sm">
          <div className="bg-[#e8ecf5] px-4 py-2.5">
            <h6 className="m-0 text-[13px] font-semibold uppercase text-[#1a557a]">
              Item Details
            </h6>
          </div>
          <div className="grid grid-cols-2 gap-3 p-4 sm:grid-cols-4">
            {items.map((it) => (
              <div key={it.label} className="rounded bg-[#f4f6f8] p-3 text-center">
                <div className="text-[20px] font-semibold" style={{ color: it.color }}>
                  {it.value}
                </div>
                <div className="text-[11px] text-[#486575]">{it.label}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="overflow-hidden rounded border border-[#e5e7eb] bg-white shadow-sm">
          <div className="flex items-center justify-between bg-[#e8ecf5] px-4 py-2.5">
            <h6 className="m-0 text-[13px] font-semibold uppercase text-[#1a557a]">
              Top Selling Items
            </h6>
            <select className="h-7 rounded border border-[#cfd8e3] bg-white px-2 text-[12px]">
              <option>Today</option>
              <option>This Week</option>
              <option>This Month</option>
            </select>
          </div>
          <ul className="m-0 list-none space-y-0 p-0">
            {top.map((row, i) => (
              <li
                key={row.name}
                className="flex items-center justify-between border-b border-[#eef1f4] px-4 py-2.5 text-[13px]"
              >
                <span>
                  <span className="mr-2 text-[#8aa0b3]">{i + 1}.</span>
                  {row.name}
                </span>
                <span className="font-semibold text-[#00a78b]">{row.qty}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <SectionBanner title="HRM" />
      <div className="mb-2 grid gap-3 lg:grid-cols-2">
        <div className="overflow-hidden rounded border border-[#e5e7eb] bg-white shadow-sm">
          <div className="bg-[#f0f8ff] px-4 py-2.5">
            <h6 className="m-0 text-[13px] font-semibold text-[#1a557a]">
              Employee Attendance
            </h6>
          </div>
          <div className="p-4">
            {(hrm.attendance || []).map((row) => (
              <MiniBar key={row.label} label={row.label} value={row.value} color={row.color} />
            ))}
          </div>
        </div>
        <div className="overflow-hidden rounded border border-[#e5e7eb] bg-white shadow-sm">
          <div className="bg-[#f0f8ff] px-4 py-2.5">
            <h6 className="m-0 text-[13px] font-semibold text-[#1a557a]">
              Dept. Wise Employee Attendance
            </h6>
          </div>
          <div className="overflow-x-auto p-3">
            <table className="w-full min-w-[520px] text-left text-[12px]">
              <thead>
                <tr className="border-b border-[#e5e7eb] text-[#1a557a]">
                  {["Department", "Present", "Absent", "Late", "EarlyOut", "Weekend", "Holiday"].map(
                    (h) => (
                      <th key={h} className="px-2 py-2 font-semibold">
                        {h}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {(hrm.departments || []).map((row) => (
                  <tr key={row.department} className="border-b border-[#eef1f4]">
                    <td className="px-2 py-2">{row.department}</td>
                    <td className="px-2 py-2">{row.present}</td>
                    <td className="px-2 py-2">{row.absent}</td>
                    <td className="px-2 py-2">{row.late}</td>
                    <td className="px-2 py-2">{row.early_out}</td>
                    <td className="px-2 py-2">{row.weekend}</td>
                    <td className="px-2 py-2">{row.holiday}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
