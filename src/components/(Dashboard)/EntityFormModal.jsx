"use client";

export default function EntityFormModal({
  open,
  title,
  fields = [],
  values,
  onChange,
  onClose,
  onSave,
  imageLabel,
}) {
  if (!open) return null;

  const updateRepeating = (key, index, text) => {
    const list = [...(values[key] || [""])];
    list[index] = text;
    onChange(key, list);
  };

  const addRepeating = (key, addLabel) => {
    onChange(key, [...(values[key] || [""]), ""]);
  };

  const removeRepeating = (key, index) => {
    const list = [...(values[key] || [""])];
    if (list.length <= 1) {
      onChange(key, [""]);
      return;
    }
    list.splice(index, 1);
    onChange(key, list);
  };

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/35 p-4">
      <div className="w-full max-w-[720px] overflow-hidden rounded-lg bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-3">
          <h2 className="m-0 text-[18px] font-semibold text-[#1a557a]">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded p-1 text-slate-500 hover:bg-slate-100"
            aria-label="Close"
          >
            <span className="material-icons text-[20px]">close</span>
          </button>
        </div>

        <div className={`grid gap-5 px-5 py-5 ${imageLabel ? "md:grid-cols-2" : ""}`}>
          <div className="space-y-4">
            {fields.map((f) => (
              <div key={f.key}>
                <label className="mb-1 block text-[13px] font-medium text-[#1a557a]">
                  {f.label}
                  {f.required && <span className="text-red-500"> *</span>}
                </label>
                {f.type === "textarea" ? (
                  <textarea
                    value={values[f.key] || ""}
                    onChange={(e) => onChange(f.key, e.target.value)}
                    placeholder={f.placeholder || f.label}
                    rows={3}
                    className="w-full rounded border border-slate-200 px-3 py-2 text-[13px] outline-none focus:border-[#2980b9]"
                  />
                ) : f.type === "select" ? (
                  <select
                    value={values[f.key] || ""}
                    onChange={(e) => onChange(f.key, e.target.value)}
                    className="h-10 w-full rounded border border-slate-200 px-3 text-[13px] outline-none focus:border-[#2980b9]"
                  >
                    <option value="">{f.placeholder || "Select..."}</option>
                    {(f.options || []).map((o) => (
                      <option key={o} value={o}>
                        {o}
                      </option>
                    ))}
                  </select>
                ) : f.type === "repeating" ? (
                  <div className="space-y-2">
                    <div className="text-[11px] font-semibold uppercase tracking-wide text-slate-500">
                      {f.rowLabel || "NAME"}
                    </div>
                    {(values[f.key] || [""]).map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={item}
                          onChange={(e) => updateRepeating(f.key, idx, e.target.value)}
                          placeholder={f.placeholder || "Name"}
                          className="h-10 w-full rounded border border-slate-200 px-3 text-[13px] outline-none focus:border-[#2980b9]"
                        />
                        <button
                          type="button"
                          onClick={() => removeRepeating(f.key, idx)}
                          className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-red-500"
                          aria-label="Remove row"
                        >
                          <span className="material-icons text-[18px]">close</span>
                        </button>
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={() => addRepeating(f.key)}
                      className="text-[13px] font-medium text-[#2980b9] hover:underline"
                    >
                      {f.addRowLabel || "Add"}
                    </button>
                  </div>
                ) : (
                  <input
                    type={f.type || "text"}
                    value={values[f.key] || ""}
                    onChange={(e) => onChange(f.key, e.target.value)}
                    placeholder={f.placeholder || f.label}
                    className="h-10 w-full rounded border border-slate-200 px-3 text-[13px] outline-none focus:border-[#2980b9]"
                  />
                )}
              </div>
            ))}
          </div>

          {imageLabel && (
            <div>
              <label className="mb-1 block text-[13px] font-medium text-[#1a557a]">
                {imageLabel}
              </label>
              <div className="flex min-h-[200px] flex-col items-center justify-center rounded-lg border-2 border-dashed border-[#9ec4e0] bg-[#f3f9fc] px-4 py-6 text-center">
                <span className="material-icons mb-2 text-[36px] text-[#2980b9]">cloud_upload</span>
                <p className="m-0 text-[13px] text-slate-600">Drag and drop file here</p>
                <p className="my-2 text-[12px] text-slate-400">or</p>
                <button
                  type="button"
                  className="rounded bg-[#2980b9] px-4 py-2 text-[13px] font-medium text-white hover:bg-[#2472a4]"
                >
                  Upload Photo
                </button>
                <p className="mt-3 mb-0 text-[11px] leading-relaxed text-slate-500">
                  Maximum file size 2MB
                  <br />
                  Supported Formates: JPG, JPEG, PNG &amp; ICO
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2 border-t border-slate-200 px-5 py-3">
          <button
            type="button"
            onClick={onClose}
            className="h-9 rounded-full border border-[#2980b9] bg-white px-5 text-[13px] font-medium text-[#2980b9] hover:bg-[#f0f7fb]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onSave}
            className="h-9 rounded-full bg-[#2980b9] px-5 text-[13px] font-medium text-white hover:bg-[#2472a4]"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
