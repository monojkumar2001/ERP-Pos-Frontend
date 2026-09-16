"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { PIPELINE_SEED } from "../../data/dashboard/manufacturing";

const DEFAULT_STAGES = [
  { id: "open", name: "Open", color: "#00a78b", filled: true },
  { id: "working", name: "Working-Process", color: "#f39c12", filled: false },
  { id: "hold", name: "On-Hold", color: "#f39c12", filled: false },
  { id: "done", name: "Completed", color: "#28a745", filled: true },
];

function idFromPath(pathname) {
  const m = String(pathname || "").match(/item-pipeline\/(\d+)/);
  return m ? Number(m[1]) : 1;
}

export default function ItemPipelinePage({ config, pathname }) {
  const id = idFromPath(pathname);
  const seed = PIPELINE_SEED[id] || PIPELINE_SEED[1];
  const [stages, setStages] = useState(DEFAULT_STAGES);
  const [card, setCard] = useState({
    ...seed,
    stageId: "done",
  });
  const [openMenu, setOpenMenu] = useState(null);
  const [renameId, setRenameId] = useState(null);
  const [renameValue, setRenameValue] = useState("");

  const title = useMemo(
    () => `${card.item} Pipeline (${card.quantity})`,
    [card.item, card.quantity]
  );

  const addStage = () => {
    const n = stages.length + 1;
    setStages((prev) => [
      ...prev.slice(0, -1),
      { id: `stage-${n}`, name: `Stage ${n}`, color: "#64748b", filled: false },
      prev[prev.length - 1],
    ]);
    setOpenMenu(null);
  };

  const deleteStage = (stageId) => {
    setStages((prev) => prev.filter((s) => s.id !== stageId));
    setOpenMenu(null);
  };

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="m-0 text-[20px] font-semibold text-[#1a557a]">{title}</h1>
        <Link
          href={config?.backHref || "/en/manufacturing/pipelines"}
          className="rounded p-1 text-slate-500 hover:bg-slate-100"
          aria-label="Close"
        >
          <span className="material-icons text-[22px]">close</span>
        </Link>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-6">
        {stages.map((stage) => (
          <div key={stage.id} className="min-w-[220px] flex-1">
            <div className="relative mb-3">
              <button
                type="button"
                className={`flex h-10 w-full items-center justify-between rounded px-3 text-[13px] font-semibold ${
                  stage.filled ? "text-white" : "border border-slate-200 bg-white text-slate-700"
                }`}
                style={stage.filled ? { backgroundColor: stage.color } : undefined}
              >
                <span className="inline-flex items-center gap-2">
                  <span
                    className="h-2.5 w-2.5 rounded-full"
                    style={{ backgroundColor: stage.filled ? "#fff" : stage.color }}
                  />
                  {renameId === stage.id ? (
                    <input
                      autoFocus
                      value={renameValue}
                      onChange={(e) => setRenameValue(e.target.value)}
                      onBlur={() => {
                        setStages((prev) =>
                          prev.map((s) => (s.id === stage.id ? { ...s, name: renameValue || s.name } : s))
                        );
                        setRenameId(null);
                      }}
                      className="h-6 rounded px-1 text-[13px] text-slate-800"
                      onClick={(e) => e.stopPropagation()}
                    />
                  ) : (
                    stage.name
                  )}
                </span>
                {stage.id !== "open" && stage.id !== "done" && (
                  <span
                    role="button"
                    tabIndex={0}
                    className="material-icons text-[18px] opacity-70"
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenMenu(openMenu === stage.id ? null : stage.id);
                    }}
                  >
                    more_horiz
                  </span>
                )}
              </button>
              {openMenu === stage.id && (
                <div className="absolute right-0 z-20 mt-1 min-w-[180px] rounded-md border border-slate-200 bg-white py-1 shadow-lg">
                  {[
                    ["Add new stage", addStage],
                    [
                      "Change stage color",
                      () => {
                        const next = stage.color === "#f39c12" ? "#8b5cf6" : "#f39c12";
                        setStages((prev) =>
                          prev.map((s) => (s.id === stage.id ? { ...s, color: next } : s))
                        );
                        setOpenMenu(null);
                      },
                    ],
                    [
                      "Rename stage",
                      () => {
                        setRenameId(stage.id);
                        setRenameValue(stage.name);
                        setOpenMenu(null);
                      },
                    ],
                    ["Delete stage", () => deleteStage(stage.id)],
                  ].map(([label, fn]) => (
                    <button
                      key={label}
                      type="button"
                      className="block w-full px-3 py-2 text-left text-[13px] text-[#1a557a] hover:bg-[#f0f7fb]"
                      onClick={fn}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {card.stageId === stage.id && (
              <div className="relative rounded border border-slate-200 bg-white p-3 shadow-sm">
                <div className="mb-2 flex items-start justify-between">
                  <span className="rounded bg-[#e11d48] px-2 py-0.5 text-[11px] font-semibold text-white">
                    {card.date}
                  </span>
                  <div className="relative">
                    <button
                      type="button"
                      className="rounded p-0.5 text-slate-400 hover:bg-slate-100"
                      onClick={() => setOpenMenu(openMenu === "card" ? null : "card")}
                    >
                      <span className="material-icons text-[16px]">more_vert</span>
                    </button>
                    {openMenu === "card" && (
                      <div className="absolute right-0 z-20 min-w-[120px] rounded-md border border-slate-200 bg-white py-1 shadow-lg">
                        <button
                          type="button"
                          className="block w-full px-3 py-2 text-left text-[13px] text-[#1a557a] hover:bg-[#f0f7fb]"
                          onClick={() => {
                            setCard((c) => ({
                              ...c,
                              stageId: c.stageId === "done" ? "working" : "done",
                            }));
                            setOpenMenu(null);
                          }}
                        >
                          Edit
                        </button>
                      </div>
                    )}
                  </div>
                </div>
                <div className="text-[11px] text-slate-500">Bin Card ID</div>
                <div className="flex items-center justify-between gap-2">
                  <div className="text-[12px] font-medium text-[#1a557a]">{card.binCardId}</div>
                  <div className="text-[12px] text-slate-600">{card.quantity}</div>
                </div>
                <div className="mt-2">
                  <span className="rounded bg-[#00a78b] px-2 py-0.5 text-[11px] text-white">
                    Last Stage: {card.lastStage}
                  </span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
