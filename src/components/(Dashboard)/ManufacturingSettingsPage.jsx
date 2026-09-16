"use client";

import { useMemo, useState } from "react";
import { SETTINGS_MEMBERS, SETTINGS_TEAMS } from "../../data/dashboard/manufacturing";

const AVATAR_COLORS = {
  AH: "#0ea5e9",
  NH: "#10b981",
  JI: "#f43f5e",
  MA: "#8b5cf6",
  N: "#64748b",
  SK: "#f59e0b",
  B: "#06b6d4",
  NS: "#84cc16",
  R: "#ef4444",
  T: "#2563eb",
  S: "#14b8a6",
  MX: "#f97316",
  PB: "#a855f7",
  আ: "#22c55e",
  SH: "#0ea5e9",
  MI: "#eab308",
  I: "#64748b",
};

function Avatar({ initials, size = 36 }) {
  return (
    <span
      className="inline-flex items-center justify-center rounded-full text-[11px] font-semibold text-white"
      style={{
        width: size,
        height: size,
        backgroundColor: AVATAR_COLORS[initials] || "#64748b",
      }}
    >
      {initials}
    </span>
  );
}

export default function ManufacturingSettingsPage() {
  const [tab, setTab] = useState("teams");
  const [teams, setTeams] = useState(SETTINGS_TEAMS);
  const [active, setActive] = useState(SETTINGS_TEAMS[0]?.name || "");
  const [teamName, setTeamName] = useState(SETTINGS_TEAMS[0]?.name || "");
  const [members] = useState(SETTINGS_MEMBERS);
  const [showMembers, setShowMembers] = useState(false);
  const [binPrefix, setBinPrefix] = useState("BIN");
  const [binStart, setBinStart] = useState("15200");
  const [saved, setSaved] = useState("");

  const activeTeam = useMemo(
    () => teams.find((t) => t.name === active) || teams[0],
    [teams, active]
  );

  const createTeam = () => {
    const name = `New Team ${teams.length + 1}`;
    setTeams((prev) => [{ name, members: [], extra: 0 }, ...prev]);
    setActive(name);
    setTeamName(name);
  };

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="m-0 text-[22px] font-semibold text-[#2c3e50]">Settings</h1>
        {tab === "teams" && (
          <button
            type="button"
            onClick={createTeam}
            className="inline-flex h-9 items-center gap-1 rounded border border-[#00a78b] bg-white px-3 text-[13px] font-medium text-[#00a78b] hover:bg-[#00a78b] hover:text-white"
          >
            + Create Team
          </button>
        )}
      </div>

      <div className="grid gap-4 lg:grid-cols-[240px_1fr]">
        <div className="space-y-2">
          {[
            ["teams", "Manage Production Teams", "group"],
            ["bin", "Bin card", "radio_button_checked"],
          ].map(([id, label, icon]) => (
            <button
              key={id}
              type="button"
              onClick={() => setTab(id)}
              className={`flex w-full items-center justify-between rounded px-3 py-3 text-left text-[13px] ${
                tab === id ? "bg-[#e8f1f8] text-[#1a557a]" : "bg-white text-slate-600"
              }`}
              style={{ boxShadow: "rgba(0,0,0,0.06) 0 1px 2px" }}
            >
              <span className="inline-flex items-center gap-2">
                <span className="material-icons text-[18px]">{icon}</span>
                {label}
              </span>
              <span className="material-icons text-[16px]">chevron_right</span>
            </button>
          ))}
        </div>

        {tab === "teams" ? (
          <div className="space-y-4">
            <div className="rounded-lg bg-[#edf1f7] px-4 py-2 text-[13px] font-semibold text-[#1a557a]">
              Team Settings
            </div>
            <div className="rounded-lg border border-slate-200 bg-white p-4">
              <label className="mb-1.5 block text-[13px] font-medium text-[#1a557a]">Team Name</label>
              <div className="flex gap-2">
                <input
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  placeholder="Team name"
                  className="h-10 flex-1 rounded border border-slate-200 px-3 text-[13px] outline-none focus:border-[#00a78b]"
                />
                <button
                  type="button"
                  onClick={() => {
                    setTeams((prev) =>
                      prev.map((t) => (t.name === active ? { ...t, name: teamName } : t))
                    );
                    setActive(teamName);
                    setSaved("Team saved");
                  }}
                  className="h-10 rounded bg-[#00a78b] px-4 text-[13px] font-medium text-white"
                >
                  Save
                </button>
              </div>
            </div>

            <div className="rounded-lg border border-slate-200 bg-white p-4">
              <div className="mb-3 flex items-center justify-between">
                <div className="text-[13px] font-semibold text-[#1a557a]">Team Members</div>
                <button
                  type="button"
                  onClick={() => setShowMembers((v) => !v)}
                  className="inline-flex h-8 items-center rounded border border-[#00a78b] px-3 text-[12px] font-medium text-[#00a78b]"
                >
                  + Manage Members
                </button>
              </div>
              {showMembers && (
                <div className="mb-3 rounded border border-slate-200 bg-slate-50 p-3 text-[12px] text-slate-600">
                  Member list is demo-only. Toggle does not persist to a server.
                </div>
              )}
              <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
                {members.map((m) => (
                  <div
                    key={m.initials + m.name}
                    className="flex items-center gap-2 rounded-lg bg-[#edf1f7] px-3 py-2"
                  >
                    <Avatar initials={m.initials} />
                    <div className="min-w-0">
                      <div className="truncate text-[13px] font-medium text-[#1a557a]">{m.name}</div>
                      {m.email ? (
                        <div className="truncate text-[11px] text-slate-500">{m.email}</div>
                      ) : null}
                    </div>
                    <span className="material-icons ml-auto text-[16px] text-slate-400">person</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-lg border border-slate-200 bg-white">
              <div className="rounded-t-lg bg-[#edf1f7] px-4 py-2 text-[13px] font-semibold text-[#1a557a]">
                All Teams
              </div>
              <div>
                {teams.map((team) => (
                  <button
                    key={team.name}
                    type="button"
                    onClick={() => {
                      setActive(team.name);
                      setTeamName(team.name);
                    }}
                    className={`flex w-full items-center justify-between border-b border-slate-100 px-4 py-3 text-left last:border-b-0 ${
                      active === team.name ? "bg-[#f0f7fb]" : "bg-white"
                    }`}
                  >
                    <span className="text-[13px] font-medium text-[#1a557a]">{team.name}</span>
                    <span className="inline-flex items-center gap-2">
                      <span className="flex -space-x-2">
                        {team.members.slice(0, 4).map((ini) => (
                          <Avatar key={ini + team.name} initials={ini} size={28} />
                        ))}
                      </span>
                      {team.extra > 0 && (
                        <span className="text-[12px] text-slate-500">+{team.extra}</span>
                      )}
                      <span className="material-icons text-[16px] text-[#00a78b]">edit</span>
                    </span>
                  </button>
                ))}
              </div>
            </div>
            {saved && <div className="text-[12px] text-green-700">{saved}</div>}
          </div>
        ) : (
          <div className="rounded-lg border border-slate-200 bg-white p-5">
            <div className="mb-4 rounded-lg bg-[#edf1f7] px-4 py-2 text-[13px] font-semibold text-[#1a557a]">
              Bin card
            </div>
            <div className="grid max-w-lg gap-4">
              <div>
                <label className="mb-1.5 block text-[13px] font-medium text-[#1a557a]">
                  Prefix
                </label>
                <input
                  value={binPrefix}
                  onChange={(e) => setBinPrefix(e.target.value)}
                  className="h-10 w-full rounded border border-slate-200 px-3 text-[13px] outline-none focus:border-[#00a78b]"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-[13px] font-medium text-[#1a557a]">
                  Starting number
                </label>
                <input
                  value={binStart}
                  onChange={(e) => setBinStart(e.target.value)}
                  className="h-10 w-full rounded border border-slate-200 px-3 text-[13px] outline-none focus:border-[#00a78b]"
                />
              </div>
              <div className="rounded bg-[#f3f9fc] px-3 py-2 text-[13px] text-[#1a557a]">
                Preview: {binPrefix} {binStart}-2026-000001
              </div>
              <button
                type="button"
                onClick={() => setSaved("Bin card settings saved")}
                className="h-10 w-fit rounded bg-[#00a78b] px-4 text-[13px] font-medium text-white"
              >
                Save
              </button>
              {saved && <div className="text-[12px] text-green-700">{saved}</div>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
