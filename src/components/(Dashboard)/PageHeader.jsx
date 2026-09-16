import Link from "next/link";

function AddButton({ label, href, onClick, disabled }) {
  if (!label) return null;
  const cls = disabled
    ? "inline-flex h-9 cursor-not-allowed items-center gap-1 rounded border border-slate-200 bg-slate-50 px-3 text-[13px] font-medium text-slate-400"
    : "inline-flex h-9 items-center gap-1 rounded border border-[#00a78b] bg-white px-3 text-[13px] font-medium text-[#00a78b] hover:bg-[#00a78b] hover:text-white";
  if (onClick || disabled) {
    return (
      <button type="button" onClick={disabled ? undefined : onClick} disabled={disabled} className={cls}>
        <span className="text-[16px] leading-none">+</span>
        {label}
      </button>
    );
  }
  return (
    <Link href={href || "#"} className={cls}>
      <span className="text-[16px] leading-none">+</span>
      {label}
    </Link>
  );
}

function BatchButton({ label, disabled, onClick }) {
  if (!label) return null;
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      className={`inline-flex h-9 items-center rounded border px-3 text-[13px] font-medium ${
        disabled
          ? "cursor-not-allowed border-slate-200 bg-slate-50 text-slate-400"
          : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
      }`}
    >
      {label}
    </button>
  );
}

export default function PageHeader({
  title,
  addLabel,
  addHref,
  addDisabled = false,
  secondaryAddLabel,
  secondaryAddHref,
  onSecondaryAddClick,
  onAddClick,
  onFilterToggle,
  showExport = true,
  batchActions = [],
}) {
  return (
    <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
      <h1 className="m-0 flex items-center gap-2 text-[22px] font-semibold text-[#2c3e50]">
        {title}
        <button type="button" className="text-[#00a78b]" aria-label="Help">
          <i className="far fa-question-circle text-[16px]" />
        </button>
      </h1>
      <div className="flex flex-wrap items-center gap-2">
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
        {batchActions.map((action) => (
          <BatchButton
            key={action.key || action.label}
            label={action.label}
            disabled={action.disabled}
            onClick={action.onClick}
          />
        ))}
        <AddButton
          label={secondaryAddLabel}
          href={secondaryAddHref}
          onClick={onSecondaryAddClick}
        />
        <AddButton
          label={addLabel}
          href={addHref}
          onClick={onAddClick}
          disabled={addDisabled}
        />
      </div>
    </div>
  );
}
