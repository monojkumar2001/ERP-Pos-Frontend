const TONE = {
  blue: { wrap: "bg-[#eaf4fb]", icon: "text-[#00a78b]", glyph: "work_outline" },
  pink: { wrap: "bg-[#fde8ef]", icon: "text-[#e83e8c]", glyph: "monitor_heart" },
  green: { wrap: "bg-[#e8f8ef]", icon: "text-[#28a745]", glyph: "percent" },
  purple: { wrap: "bg-[#f0eaff]", icon: "text-[#6f42c1]", glyph: "add" },
};

export default function SummaryCards({ cards = [] }) {
  if (!cards.length) return null;

  return (
    <div className="mb-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => {
        const tone = TONE[card.tone] || TONE.blue;
        return (
          <div
            key={card.key || card.label}
            className="flex items-center gap-3 rounded-lg border border-[#e8eef3] bg-white px-4 py-3 shadow-sm"
          >
            <div
              className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${tone.wrap}`}
            >
              <span className={`material-icons text-[22px] ${tone.icon}`}>
                {card.icon || tone.glyph}
              </span>
            </div>
            <div className="min-w-0">
              <div className="text-[12px] text-slate-500">{card.label}</div>
              <div className="truncate text-[15px] font-semibold text-[#1a557a]">
                {card.value}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
