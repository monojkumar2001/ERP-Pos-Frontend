import Link from "next/link";
import PageHeader from "./PageHeader";

export function ManufacturingOverviewPage() {
  return (
    <div>
      <PageHeader title="Manufacturing Overview" showExport={false} />
      <div className="mb-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {[
          ["Active Plans", "8", "#3949ab"],
          ["In Pipeline", "14", "#f9a825"],
          ["Finished Today", "5", "#43a047"],
          ["Waste Units", "2", "#e53935"],
        ].map(([t, v, c]) => (
          <div
            key={t}
            className="rounded-lg p-4 text-white shadow-sm"
            style={{ backgroundColor: c }}
          >
            <div className="text-[24px] font-semibold">{v}</div>
            <div className="text-[13px] opacity-90">{t}</div>
          </div>
        ))}
      </div>
      <div className="rounded-lg border border-[#e5e7eb] bg-white p-4 shadow-sm">
        <h6 className="m-0 mb-3 text-[13px] font-semibold uppercase text-slate-500">
          Quick Links
        </h6>
        <div className="flex flex-wrap gap-2">
          {[
            ["/en/manufacturing/production-plans", "Production Plans"],
            ["/en/manufacturing/pipelines", "Production Pipeline"],
            ["/en/manufacturing/finished-goods", "Finished Goods"],
          ].map(([href, label]) => (
            <Link
              key={href}
              href={href}
              className="rounded border border-[#00a78b] px-3 py-2 text-[13px] text-[#00a78b] hover:bg-[#00a78b] hover:text-white"
            >
              {label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export function AttendanceSheetPage() {
  const employees = [
    "MD IMRAN Hossain",
    "Ekramul Hoque",
    "Nabil Rahman",
    "Ariful Islam",
    "Fatema Akter",
    "Karim Uddin",
  ];

  return (
    <div>
      <PageHeader title="Take Attendance" showExport={false} />
      <div className="mb-4 flex flex-wrap items-end gap-3 rounded-lg border border-[#e5e7eb] bg-white p-4 shadow-sm">
        <div>
          <label className="mb-1 block text-[12px] font-medium text-slate-600">Date</label>
          <input
            type="date"
            defaultValue="2026-09-06"
            className="h-10 rounded border border-slate-200 px-3 text-[13px]"
          />
        </div>
        <div>
          <label className="mb-1 block text-[12px] font-medium text-slate-600">
            Department
          </label>
          <select className="h-10 rounded border border-slate-200 px-3 text-[13px]">
            <option>All Departments</option>
            <option>Sales</option>
            <option>Accounts</option>
          </select>
        </div>
        <button
          type="button"
          className="h-10 rounded bg-[#00a78b] px-4 text-[13px] font-medium text-white"
        >
          Load Sheet
        </button>
      </div>
      <div className="overflow-hidden rounded-lg border border-[#e5e7eb] bg-white shadow-sm">
        <table className="w-full text-left text-[13px]">
          <thead>
            <tr style={{ backgroundColor: "#00a78b" }}>
              {["EMPLOYEE", "PRESENT", "ABSENT", "LEAVE", "LATE", "NOTE"].map((h) => (
                <th key={h} className="px-3 py-3 text-[11px] font-semibold text-white">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {employees.map((name) => (
              <tr key={name} className="border-b border-slate-100">
                <td className="px-3 py-2.5 font-medium">{name}</td>
                {["Present", "Absent", "Leave", "Late"].map((s) => (
                  <td key={s} className="px-3 py-2.5">
                    <input
                      type="radio"
                      name={`att-${name}`}
                      defaultChecked={s === "Present"}
                      className="accent-[#00a78b]"
                    />
                  </td>
                ))}
                <td className="px-3 py-2.5">
                  <input
                    className="h-8 w-full rounded border border-slate-200 px-2"
                    placeholder="Note"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="border-t border-slate-100 p-3">
          <button
            type="button"
            className="h-10 rounded bg-[#28a745] px-5 text-[13px] font-medium text-white"
          >
            Save Attendance
          </button>
        </div>
      </div>
    </div>
  );
}

export function BarcodePage() {
  return (
    <div>
      <PageHeader title="Barcode Generation" showExport={false} />
      <div className="mx-auto max-w-xl rounded-lg border border-[#e5e7eb] bg-white p-6 shadow-sm">
        <div className="space-y-4">
          <div>
            <label className="mb-1 block text-[13px] font-medium">Item</label>
            <select className="h-10 w-full rounded border border-slate-200 px-3 text-[13px]">
              <option>Select item...</option>
              <option>Rice 25kg</option>
              <option>Soybean Oil 5L</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-[13px] font-medium">Quantity</label>
            <input
              type="number"
              defaultValue={10}
              className="h-10 w-full rounded border border-slate-200 px-3 text-[13px]"
            />
          </div>
          <button
            type="button"
            className="h-10 rounded bg-[#00a78b] px-5 text-[13px] font-medium text-white"
          >
            Generate Barcode
          </button>
          <div className="rounded border border-dashed border-slate-300 p-8 text-center text-slate-400">
            <span className="material-icons text-[48px]">qr_code_2</span>
            <p className="mt-2 text-[13px]">Barcode preview will appear here</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export function AccountingDashPage() {
  return null;
}

