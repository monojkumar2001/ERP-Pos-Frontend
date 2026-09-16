"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { authApi } from "../../lib/api";
import { clearSession, getCompany, getUser } from "../../lib/auth";

const WHATS_NEW = [
  {
    date: "Sep 2026",
    title: "Direct Purchase cancellation & live list updates",
    body: "Lists now update immediately after cancellation from details view for Direct Purchase, Purchase Return, Direct Sale, and Sale Return.",
  },
  {
    date: "Aug 2026",
    title: "Enhanced details pages",
    body: "Item short descriptions are now shown on Quotation, Order, Delivery, Invoice, Direct Sale, Return, and Purchase Bill details.",
  },
  {
    date: "Jul 2026",
    title: "OTP for Panel Reset",
    body: "OTP verification added during Panel Reset for enhanced security.",
  },
];

function ModalShell({ title, onClose, children, wide }) {
  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/40 p-4" onClick={onClose}>
      <div
        className={`max-h-[90vh] w-full overflow-auto rounded-xl border border-[#e5e7eb] bg-white shadow-xl ${
          wide ? "max-w-2xl" : "max-w-md"
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-[#eef1f4] px-5 py-3.5">
          <h2 className="m-0 text-[16px] font-semibold text-[#1a557a]">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded p-1 text-[#1a557a] hover:bg-[#e8f1f8]"
            aria-label="Close"
          >
            <span className="material-icons text-[20px]">close</span>
          </button>
        </div>
        <div className="px-5 py-4">{children}</div>
      </div>
    </div>
  );
}

export default function ProfileMenu({ open, onClose, onOpenSettings }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [company, setCompany] = useState(null);
  const [loggingOut, setLoggingOut] = useState(false);
  const [modal, setModal] = useState(null);
  const [pwd, setPwd] = useState({ current: "", next: "", confirm: "" });
  const [pwdMsg, setPwdMsg] = useState("");
  const [resetConfirm, setResetConfirm] = useState("");

  useEffect(() => {
    setUser(getUser());
    setCompany(getCompany());
  }, [open]);

  if (!open && !modal) return null;

  const displayName = user?.name || "User";
  const email = user?.email || "—";
  const phone = user?.phone || user?.mobile || company?.phone || "—";
  const companyName = company?.name || "—";

  const onLogout = async () => {
    setLoggingOut(true);
    try {
      await authApi.logout();
    } catch {
      // clear local anyway
    } finally {
      clearSession();
      setLoggingOut(false);
      router.replace("/account/login");
    }
  };

  const menuItems = [
    {
      key: "business",
      label: "Business Setting",
      icon: "settings",
      onClick: () => {
        onClose?.();
        onOpenSettings?.();
      },
    },
    {
      key: "whats-new",
      label: "What's New",
      icon: "star",
      onClick: () => {
        onClose?.();
        setModal("whats-new");
      },
    },
    {
      key: "panel-reset",
      label: "Panel Reset",
      icon: "autorenew",
      onClick: () => {
        onClose?.();
        setModal("panel-reset");
        setResetConfirm("");
      },
    },
    {
      key: "subscriptions",
      label: "Subscriptions",
      icon: "settings_suggest",
      href: "/en/subscriptions",
    },
    {
      key: "change-password",
      label: "Change Password",
      icon: "visibility_off",
      onClick: () => {
        onClose?.();
        setModal("change-password");
        setPwd({ current: "", next: "", confirm: "" });
        setPwdMsg("");
      },
    },
    {
      key: "sign-out",
      label: loggingOut ? "Signing out..." : "Sign Out",
      icon: "logout",
      onClick: onLogout,
    },
  ];

  return (
    <>
      {open ? (
        <div className="absolute right-0 top-[calc(100%+8px)] z-50 w-[300px] rounded-xl border border-[#d6e4f0] bg-white p-4 shadow-xl">
          <button
            type="button"
            onClick={onClose}
            className="absolute right-3 top-3 rounded p-0.5 text-[#1a557a] hover:bg-[#e8f1f8]"
            aria-label="Close profile menu"
          >
            <span className="material-icons text-[18px]">close</span>
          </button>

          <p className="mb-3 mt-0 text-[12px] text-[#8aa0b3]">Logged in as</p>
          <div className="space-y-2.5 pr-6">
            <div className="flex items-center gap-2.5 text-[13px] text-[#1a557a]">
              <span className="material-icons text-[18px]">person</span>
              <span className="font-semibold uppercase tracking-wide">{displayName}</span>
            </div>
            <div className="flex items-center gap-2.5 text-[13px] text-[#00a78b]">
              <span className="material-icons text-[18px]">mail</span>
              <span className="truncate">{email}</span>
            </div>
            <div className="flex items-center gap-2.5 text-[13px] text-[#00a78b]">
              <span className="material-icons text-[18px]">phone</span>
              <span>{phone}</span>
            </div>
            <div className="flex items-center gap-2.5 text-[13px] text-[#00a78b]">
              <span className="material-icons text-[18px]">work</span>
              <span className="truncate">{companyName}</span>
            </div>
          </div>

          <div className="my-4 border-t border-[#e8eef3]" />

          <div className="flex flex-col gap-2">
            {menuItems.map((item) => {
              const className =
                "flex h-10 items-center gap-2.5 rounded-full border border-[#c5d9ea] bg-white px-4 text-[13px] font-medium text-[#1a557a] hover:bg-[#f3f9fc]";
              if (item.href) {
                return (
                  <Link
                    key={item.key}
                    href={item.href}
                    onClick={onClose}
                    className={className}
                  >
                    <span className="material-icons text-[18px]">{item.icon}</span>
                    {item.label}
                  </Link>
                );
              }
              return (
                <button
                  key={item.key}
                  type="button"
                  onClick={item.onClick}
                  disabled={item.key === "sign-out" && loggingOut}
                  className={`${className} disabled:opacity-60`}
                >
                  <span className="material-icons text-[18px]">{item.icon}</span>
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>
      ) : null}

      {modal === "whats-new" ? (
        <ModalShell title="What's New" onClose={() => setModal(null)} wide>
          <div className="space-y-4">
            {WHATS_NEW.map((item) => (
              <div key={item.title} className="rounded-lg border border-[#e8eef3] p-3">
                <div className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-[#8aa0b3]">
                  {item.date}
                </div>
                <div className="mb-1 text-[14px] font-semibold text-[#1a557a]">{item.title}</div>
                <p className="m-0 text-[13px] leading-relaxed text-[#5a6b7b]">{item.body}</p>
              </div>
            ))}
          </div>
        </ModalShell>
      ) : null}

      {modal === "panel-reset" ? (
        <ModalShell title="Panel Reset" onClose={() => setModal(null)}>
          <p className="mt-0 text-[13px] leading-relaxed text-[#5a6b7b]">
            This will reset demo panel data to the default state. Type <strong>RESET</strong> to
            confirm.
          </p>
          <input
            value={resetConfirm}
            onChange={(e) => setResetConfirm(e.target.value)}
            placeholder="Type RESET"
            className="mb-4 h-10 w-full rounded border border-slate-200 px-3 text-[13px] outline-none focus:border-[#00a78b]"
          />
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setModal(null)}
              className="h-9 rounded border border-[#00a78b] px-4 text-[13px] font-medium text-[#00a78b]"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={resetConfirm !== "RESET"}
              onClick={() => {
                setModal(null);
                alert("Panel reset requested (demo).");
              }}
              className="h-9 rounded bg-[#00a78b] px-4 text-[13px] font-medium text-white disabled:opacity-50"
            >
              Confirm Reset
            </button>
          </div>
        </ModalShell>
      ) : null}

      {modal === "change-password" ? (
        <ModalShell title="Change Password" onClose={() => setModal(null)}>
          <div className="space-y-3">
            {[
              ["current", "Current Password"],
              ["next", "New Password"],
              ["confirm", "Confirm New Password"],
            ].map(([key, label]) => (
              <div key={key}>
                <label className="mb-1 block text-[12px] font-medium text-[#1a557a]">{label}</label>
                <input
                  type="password"
                  value={pwd[key]}
                  onChange={(e) => setPwd((p) => ({ ...p, [key]: e.target.value }))}
                  className="h-10 w-full rounded border border-slate-200 px-3 text-[13px] outline-none focus:border-[#00a78b]"
                />
              </div>
            ))}
            {pwdMsg ? <p className="m-0 text-[12px] text-[#c0392b]">{pwdMsg}</p> : null}
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setModal(null)}
                className="h-9 rounded border border-[#00a78b] px-4 text-[13px] font-medium text-[#00a78b]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  if (!pwd.current || !pwd.next) {
                    setPwdMsg("Please fill all fields.");
                    return;
                  }
                  if (pwd.next !== pwd.confirm) {
                    setPwdMsg("New passwords do not match.");
                    return;
                  }
                  setModal(null);
                  alert("Password updated (demo).");
                }}
                className="h-9 rounded bg-[#00a78b] px-4 text-[13px] font-medium text-white"
              >
                Save
              </button>
            </div>
          </div>
        </ModalShell>
      ) : null}
    </>
  );
}
