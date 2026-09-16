"use client";

const KPI_CARDS = [
  {
    title: "Running Production Plan",
    amount: "0",
    change: "0.0% Since last day",
    tone: "neutral",
    icon: "fa-industry",
    iconBg: "#d7e8f5",
    iconColor: "#448dc0",
    tip: "Total production currently in progress today",
  },
  {
    title: "Monthly Production Plan",
    amount: "9",
    change: "↑ 200.0% Since last month",
    tone: "up",
    icon: "fa-boxes",
    iconBg: "#daf6ca",
    iconColor: "#63ba33",
  },
  {
    title: "Today Finished Goods",
    amount: "0",
    change: "↓ -100.0% Since last day",
    tone: "down",
    icon: "fa-check-circle",
    iconBg: "#fbd2ca",
    iconColor: "#f55151",
  },
  {
    title: "Monthly Finished Goods",
    amount: "10",
    change: "↑ 150.0% Since last month",
    tone: "up",
    icon: "fa-clipboard-list",
    iconBg: "#fee2fe",
    iconColor: "#b319b3",
  },
  {
    title: "Today Waste Goods",
    amount: "0",
    change: "0.0% Since last day",
    tone: "neutral",
    icon: "fa-trash",
    iconBg: "#9fbccb",
    iconColor: "#486575",
  },
  {
    title: "Monthly Waste Goods",
    amount: "2",
    change: "↓ -33.33% Since last month",
    tone: "down",
    icon: "fa-recycle",
    iconBg: "#f9efc1",
    iconColor: "#f39e4d",
  },
  {
    title: "Today Labour Time",
    amount: "0h 0min",
    change: "↓ -100.0% Since last day",
    tone: "down",
    icon: "fa-clock",
    iconBg: "#79e9a4",
    iconColor: "#398556",
  },
  {
    title: "Monthly Labour Time",
    amount: "0h 4min",
    change: "↓ -14.52% Since last month",
    tone: "down",
    icon: "fa-calendar-alt",
    iconBg: "#d76320",
    iconColor: "#ffffff",
  },
];

const ITEM_BARS = [
  { label: "#1 BSF sardin", value: 4800, color: "#6ea8fe" },
  { label: "#2 NIOR No Trans...", value: 2800, color: "#4dd0c8" },
  { label: "#3 Test for pric...", value: 2500, color: "#a8d67a" },
  { label: "#4 Rice kukar ye...", value: 1800, color: "#7ec8e3" },
  { label: "#5 Sublimation 2...", value: 900, color: "#9b7cf6" },
];

const TEAM_BARS = [
  { label: "#1 Key Manager 1", value: 22000, color: "#5b5fc7" },
  { label: "#2 green", value: 800, color: "#4dd0c8" },
  { label: "#3 Distribution ...", value: 400, color: "#8fd16a" },
  { label: "#4 Mango Juice t...", value: 250, color: "#c084fc" },
  { label: "#5 Manufacture t...", value: 180, color: "#f9a8d4" },
];

const MONTH_ITEMS = [
  { label: "#1 Radical - 100...", value: 50, color: "#6ea8fe" },
  { label: "#2 Jersey | Manu...", value: 13, color: "#4dd0c8" },
  { label: "#3 2 Port TJ (Ca...", value: 12, color: "#a8d67a" },
  { label: "#4 2 Core Fiber_...", value: 11, color: "#7ec8e3" },
  { label: "#5 Charizma Summ...", value: 11, color: "#9b7cf6" },
  { label: "#6 সয়াবিন তেল - ...", value: 5, color: "#fbbf24" },
];

const WASTE_ITEMS = [
  { label: "#1 Panjabi", value: 120, color: "#6ea8fe" },
  { label: "#2 Test for pric...", value: 40, color: "#4dd0c8" },
  { label: "#3 practice", value: 22, color: "#a8d67a" },
  { label: "#4 1008", value: 12, color: "#7ec8e3" },
  { label: "#5 Shoe", value: 8, color: "#9b7cf6" },
];

const FINISHED_ITEMS = [
  { label: "#1 BSF sardin", value: 4200, color: "#6ea8fe" },
  { label: "#2 NIOR No Trans...", value: 2600, color: "#4dd0c8" },
  { label: "#3 Test for pric...", value: 2300, color: "#a8d67a" },
  { label: "#4 Rice kukar ye...", value: 1700, color: "#7ec8e3" },
  { label: "#5 Sublimation 2...", value: 800, color: "#9b7cf6" },
];

function KpiCard({ card }) {
  const toneClass =
    card.tone === "up"
      ? "text-[#00c684]"
      : card.tone === "down"
        ? "text-[#ff3d71]"
        : "text-[#6c757d]";

  return (
    <div
      className="relative flex h-full flex-col justify-center rounded-[6px] bg-white px-8 py-[9.6px] transition-transform hover:-translate-y-2"
      style={{ boxShadow: "rgba(0, 0, 0, 0.1) 1px 1px 2px 2px" }}
    >
      <div
        className="absolute right-[-8px] top-[10px] flex h-14 w-14 items-center justify-center rounded-full shadow-[0_4px_8px_rgba(0,0,0,0.2)]"
        style={{ backgroundColor: card.iconBg, color: card.iconColor }}
      >
        <i className={`fas ${card.icon} text-[22px]`} />
      </div>
      <div className="pr-10">
        <div className="flex items-center gap-1 text-[12px] font-semibold text-[#1a557a]">
          {card.title}
          <i className="far fa-question-circle text-[11px] text-slate-400" />
        </div>
        <div className="text-[13px] font-semibold text-[#727272]">{card.amount}</div>
        <div className={`mt-1 text-[12px] ${toneClass}`}>{card.change}</div>
      </div>
    </div>
  );
}

function ChartCard({ title, children }) {
  return (
    <div className="overflow-hidden rounded bg-white shadow-[0_1px_3px_rgba(0,0,0,0.08)]">
      <div className="bg-[#edf1f7] px-4 py-2.5 text-[13px] font-semibold text-[#222b45]">
        {title}
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}

function HorizontalBars({ items, axis = "Quantity" }) {
  const max = Math.max(...items.map((i) => i.value), 1);
  return (
    <div className="flex gap-3">
      <div className="flex w-[132px] shrink-0 flex-col justify-around py-1 text-right text-[11px] text-slate-500">
        {items.map((item) => (
          <div key={item.label} className="truncate">
            {item.label}
          </div>
        ))}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex h-[220px] flex-col justify-around">
          {items.map((item) => (
            <div key={item.label} className="h-5 rounded-sm" style={{ width: `${(item.value / max) * 100}%`, backgroundColor: item.color }} />
          ))}
        </div>
        <div className="mt-2 flex justify-between text-[11px] text-slate-400">
          <span>0</span>
          <span>{Math.round(max / 2).toLocaleString()}</span>
          <span>{max.toLocaleString()}</span>
        </div>
        <div className="mt-1 text-center text-[11px] text-slate-500">{axis}</div>
      </div>
    </div>
  );
}

function VerticalBars({ items, yLabel = "Teams", xLabel = "Quantity" }) {
  const max = Math.max(...items.map((i) => i.value), 1);
  return (
    <div className="flex h-[260px] gap-2">
      <div className="flex w-10 flex-col justify-between pb-10 pt-1 text-right text-[10px] text-slate-400">
        <span>{max.toLocaleString()}</span>
        <span>{Math.round(max / 2).toLocaleString()}</span>
        <span>0</span>
      </div>
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex flex-1 items-end justify-around gap-2 border-b border-l border-slate-200 px-2">
          {items.map((item) => (
            <div key={item.label} className="flex h-full w-10 items-end">
              <div
                className="w-full rounded-t-sm"
                style={{ height: `${(item.value / max) * 100}%`, backgroundColor: item.color }}
              />
            </div>
          ))}
        </div>
        <div className="mt-2 flex justify-around text-[10px] text-slate-500">
          {items.map((item) => (
            <span key={item.label} className="w-12 truncate text-center">
              {item.label.replace(/^#\d+\s/, "")}
            </span>
          ))}
        </div>
        <div className="mt-1 text-center text-[11px] text-slate-500">{xLabel}</div>
      </div>
    </div>
  );
}

export default function ManufacturingOverviewPage() {
  return (
    <div>
      <h2 className="mb-4 text-[16px] font-semibold text-[#1a557a]">Overview</h2>
      <div className="mb-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {KPI_CARDS.map((card) => (
          <KpiCard key={card.title} card={card} />
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <ChartCard title="Overall Top Production Items">
          <HorizontalBars items={ITEM_BARS} />
        </ChartCard>
        <ChartCard title="Overall Top Production Teams">
          <VerticalBars items={TEAM_BARS} />
        </ChartCard>
        <ChartCard title="Top Production Items Of This Month">
          <HorizontalBars items={MONTH_ITEMS} />
        </ChartCard>
        <ChartCard title="Overall Top Waste Goods Disposal Items">
          <HorizontalBars items={WASTE_ITEMS} />
        </ChartCard>
        <div className="lg:col-span-2">
          <ChartCard title="Overall Top Finished Goods Disposal Items">
            <HorizontalBars items={FINISHED_ITEMS} />
          </ChartCard>
        </div>
      </div>
    </div>
  );
}
