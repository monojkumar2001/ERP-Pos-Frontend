import Link from "next/link";

export default function PageHeader({
  title,
  addLabel,
  addHref,
  onAddClick,
  onFilterToggle,
  showExport = true,
}) {
  return (
    <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
      <h1 className="m-0 flex items-center gap-2 text-[22px] font-semibold text-[#2c3e50]">
        {title}
        <button type="button" className="text-[#2980b9]" aria-label="Help">
          <i className="far fa-question-circle text-[16px]" />
        </button>
      </h1>
      <div className="flex items-center gap-2">
        {showExport && (
          <button
            type="button"
            className="flex h-9 w-9 items-center justify-center rounded border border-slate-200 bg-white text-slate-500 hover:bg-slate-50"
            aria-label="Export"
          >
            <span className="material-icons text-[18px]">file_download</span>
          </button>
        )}
        {onFilterToggle && (
          <button
            type="button"
            onClick={onFilterToggle}
            className="flex h-9 w-9 items-center justify-center rounded border border-slate-200 bg-white text-slate-500 hover:bg-slate-50"
            aria-label="Filter"
          >
            <span className="material-icons text-[18px]">filter_list</span>
          </button>
        )}
        {addLabel && onAddClick ? (
          <button
            type="button"
            onClick={onAddClick}
            className="inline-flex h-9 items-center gap-1 rounded border border-[#2980b9] bg-white px-3 text-[13px] font-medium text-[#2980b9] hover:bg-[#2980b9] hover:text-white"
          >
            {addLabel}
          </button>
        ) : addLabel ? (
          <Link
            href={addHref || "#"}
            className="inline-flex h-9 items-center gap-1 rounded border border-[#2980b9] bg-white px-3 text-[13px] font-medium text-[#2980b9] hover:bg-[#2980b9] hover:text-white"
          >
            {addLabel}
          </Link>
        ) : null}
      </div>
    </div>
  );
}
