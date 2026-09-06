import Link from "next/link";
import { QUICK_ACTIONS, RING_COLORS } from "../../data/dashboard/tokens";

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
      {rows.map((row, i) => (
        <PeriodCard key={`${row.currentLabel}-${i}`} {...row} color={RING_COLORS[i % 4]} />
      ))}
    </div>
  );
}

const SALES = [
  {
    currentLabel: "Today",
    currentValue: "2,300",
    prevLabel: "Yesterday",
    prevValue: "0",
    percent: "0%",
    trend: "up",
  },
  {
    currentLabel: "This Week",
    currentValue: "2,300",
    prevLabel: "Last Week",
    prevValue: "19,084.83",
    percent: "830%",
    trend: "down",
  },
  {
    currentLabel: "This Month",
    currentValue: "9,884.83",
    prevLabel: "Last Month",
    prevValue: "640,126.55",
    percent: "1000+%",
    trend: "down",
  },
  {
    currentLabel: "This Year",
    currentValue: "34,757,046.4",
    prevLabel: "Last Year",
    prevValue: "47,558,256.78",
    percent: "137%",
    trend: "down",
  },
];

const POS = [
  {
    currentLabel: "Today",
    currentValue: "0",
    prevLabel: "Yesterday",
    prevValue: "0",
    percent: "0%",
    trend: "flat",
  },
  {
    currentLabel: "This Week",
    currentValue: "0",
    prevLabel: "Last Week",
    prevValue: "10,035",
    percent: "0%",
    trend: "down",
  },
  {
    currentLabel: "This Month",
    currentValue: "0",
    prevLabel: "Last Month",
    prevValue: "432,931",
    percent: "0%",
    trend: "down",
  },
  {
    currentLabel: "This Year",
    currentValue: "804,910.18",
    prevLabel: "Last Year",
    prevValue: "819,809.15",
    percent: "102%",
    trend: "down",
  },
];

const PURCHASE = [
  {
    currentLabel: "Today",
    currentValue: "77,500",
    prevLabel: "Yesterday",
    prevValue: "0",
    percent: "0%",
    trend: "up",
  },
  {
    currentLabel: "This Week",
    currentValue: "77,500",
    prevLabel: "Last Week",
    prevValue: "186,100",
    percent: "240%",
    trend: "down",
  },
  {
    currentLabel: "This Month",
    currentValue: "208,600",
    prevLabel: "Last Month",
    prevValue: "1,266,282.02",
    percent: "607%",
    trend: "down",
  },
  {
    currentLabel: "This Year",
    currentValue: "122,102,650.73",
    prevLabel: "Last Year",
    prevValue: "22,862,214,773.07",
    percent: "1000+%",
    trend: "down",
  },
];

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
          {leftRows.map(([l, v]) => (
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

export default function DashboardHome() {
  return (
    <div className="text-[#1a557a]">
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
      <PeriodGrid rows={SALES} />

      <SectionBanner title="Pos" />
      <PeriodGrid rows={POS} />

      <SectionBanner title="Purchase" />
      <PeriodGrid rows={PURCHASE} />

      <div className="mb-4 grid gap-3 lg:grid-cols-2">
        <FinanceCard
          title="Total Receivables"
          total="৳ 36,673,590.49"
          leftTitle="Total Unpaid Invoices"
          leftRows={[
            ["Current (This Month)", "৳ 1,995"],
            ["Overdue (Previous Months)", "৳ 36,671,595.49"],
          ]}
        />
        <FinanceCard
          title="Total Payables"
          total="৳ 22,019,865,121.59"
          leftTitle="Total Unpaid Bills"
          leftRows={[
            ["Current (This Month)", "৳ 117,200"],
            ["Overdue (Previous Months)", "৳ 22,019,747,921.59"],
          ]}
        />
        <FinanceCard
          title="Total Sales Returnable"
          total="৳ 7,501,734.12"
          leftTitle="Total Payable Memos"
          leftRows={[
            ["Current (This Month)", "৳ 0"],
            ["Previous (Till Previous Month)", "৳ 7,501,734.12"],
          ]}
          rightTotal="৳ 2,451,065.22"
          rightTitle="Total Applied Memos"
          rightRows={[
            ["Current (This Month)", "৳ 0"],
            ["Previous (Till Previous Month)", "৳ 2,451,065.22"],
          ]}
        />
        <FinanceCard
          title="Total Purchase Returnable"
          total="৳ 554,428"
          leftTitle="Total Receivable Memos"
          leftRows={[
            ["Current (This Month)", "৳ 0"],
            ["Previous (Till Previous Month)", "৳ 554,428"],
          ]}
          rightTotal="৳ 1,507,498"
          rightTitle="Total Applied Memos"
          rightRows={[
            ["Current (This Month)", "৳ 0"],
            ["Previous (Till Previous Month)", "৳ 1,507,498"],
          ]}
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
            {[
              ["Low Stock Items", "247", "#f55151"],
              ["All Active Items", "4,692", "#00c278"],
              ["All Item Groups", "140", "#4ca6ff"],
              ["All Items", "4,722", "#6a5acd"],
            ].map(([l, v, c]) => (
              <div key={l} className="rounded bg-[#f4f6f8] p-3 text-center">
                <div className="text-[20px] font-semibold" style={{ color: c }}>
                  {v}
                </div>
                <div className="text-[11px] text-[#486575]">{l}</div>
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
          <ul className="m-0 space-y-0 p-0 list-none">
            {[
              ["TP Link 1pc", "128"],
              ["Rice 25kg", "96"],
              ["Soybean Oil 5L", "84"],
              ["Sugar 1kg", "71"],
              ["Flour 10kg", "63"],
            ].map(([name, qty], i) => (
              <li
                key={name}
                className="flex items-center justify-between border-b border-[#eef1f4] px-4 py-2.5 text-[13px]"
              >
                <span>
                  <span className="mr-2 text-[#8aa0b3]">{i + 1}.</span>
                  {name}
                </span>
                <span className="font-semibold text-[#2980b9]">{qty}</span>
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
            <MiniBar label="Present" value={70} color="#00c278" />
            <MiniBar label="Absent" value={8} color="#f55151" />
            <MiniBar label="Late" value={12} color="#ffa34d" />
            <MiniBar label="EarlyOut" value={5} color="#4ca6ff" />
            <MiniBar label="Weekend" value={0} color="#9b59b6" />
            <MiniBar label="Holiday" value={0} color="#95a5a6" />
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
                  {[
                    "Department",
                    "Present",
                    "Absent",
                    "Late",
                    "EarlyOut",
                    "Weekend",
                    "Holiday",
                  ].map((h) => (
                    <th key={h} className="px-2 py-2 font-semibold">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  ["Sales", 18, 1, 2, 0, 0, 0],
                  ["Accounts", 8, 0, 1, 0, 0, 0],
                  ["Warehouse", 14, 2, 3, 1, 0, 0],
                  ["HR", 5, 0, 0, 0, 0, 0],
                  ["Production", 25, 5, 6, 4, 0, 0],
                ].map((row) => (
                  <tr key={row[0]} className="border-b border-[#eef1f4]">
                    {row.map((cell, i) => (
                      <td key={i} className="px-2 py-2">
                        {cell}
                      </td>
                    ))}
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
