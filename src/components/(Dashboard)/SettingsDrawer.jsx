"use client";

import Link from "next/link";
import { SETTINGS_PANEL } from "../../data/dashboard/settingsPanel";

export default function SettingsDrawer({ open, onClose }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[80]">
      <button
        type="button"
        className="absolute inset-0 bg-black/25"
        aria-label="Close settings overlay"
        onClick={onClose}
      />
      <aside className="absolute right-0 top-0 flex h-full w-[280px] max-w-[90vw] flex-col bg-white shadow-[-4px_0_24px_rgba(0,0,0,0.12)]">
        <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
          <h2 className="m-0 text-[15px] font-bold uppercase tracking-wide text-[#1a557a]">
            {SETTINGS_PANEL.title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded text-slate-400 hover:bg-slate-50 hover:text-slate-600"
            aria-label="Close settings"
          >
            <span className="material-icons text-[20px]">close</span>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-2 py-3">
          {SETTINGS_PANEL.sections.map((section) => (
            <div key={section.heading}>
              <div className="mb-2 px-2 text-[11px] font-semibold uppercase tracking-wide text-[#7aa0bd]">
                {section.heading}
              </div>
              <ul className="m-0 list-none p-0">
                {section.items.map((item) => (
                  <li key={item.href + item.label}>
                    <Link
                      href={item.href}
                      onClick={onClose}
                      className="flex items-center gap-3 rounded px-2 py-2.5 text-[13px] font-medium text-[#00a78b] hover:bg-[#e8f1f8]"
                    >
                      <span className="material-icons text-[18px] text-[#9bb4c7]">
                        {item.icon}
                      </span>
                      <span>{item.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </aside>
    </div>
  );
}
