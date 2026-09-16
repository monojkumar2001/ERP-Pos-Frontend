"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

function StatusPill({ value }) {
  const v = String(value || "").toLowerCase().replace(/\s+/g, "");
  let cls = "bg-slate-400 text-white";
  if (v === "open") cls = "bg-[#007bff] text-white";
  else if (v === "inprogress" || v === "in-progress") cls = "bg-[#fd7e14] text-white";
  else if (v === "closed" || v === "resolved") cls = "bg-[#28a745] text-white";
  else if (v === "pending") cls = "bg-[#ffc107] text-[#212529]";

  return (
    <span className={`inline-flex rounded-md px-2 py-0.5 text-[11px] font-semibold ${cls}`}>
      {value}
    </span>
  );
}

export default function SupportTicketDetailsPage({ config, record }) {
  const [reply, setReply] = useState("");
  const [status, setStatus] = useState(record?.status || "Open");
  const [messages, setMessages] = useState(record?.messages || []);

  const data = useMemo(
    () => ({
      ticketNumber: "ST-2026-004987",
      date: "11 Sep 2026",
      issue: "Support ticket",
      category: "General Support",
      email: "demo@biznify.com.bd",
      phone: "01700000000",
      supportUnit: "Softifybd Support",
      details: "No additional details provided.",
      ...record,
      status,
    }),
    [record, status]
  );

  const backHref = config?.backHref || "/en/support-tickets";

  const sendReply = () => {
    const text = reply.trim();
    if (!text) return;
    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        author: "You",
        time: "Just now",
        body: text,
      },
    ]);
    setReply("");
  };

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="m-0 text-[22px] font-semibold text-[#2c3e50]">{data.ticketNumber}</h1>
          <div className="mt-1 text-[13px] text-slate-500">{data.date}</div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <StatusPill value={data.status} />
          {String(data.status).toLowerCase() !== "closed" && (
            <button
              type="button"
              onClick={() => setStatus("Closed")}
              className="inline-flex h-9 items-center rounded border border-[#00a78b] bg-white px-4 text-[13px] font-medium text-[#00a78b] hover:bg-[#e8f1f8]"
            >
              Close Ticket
            </button>
          )}
          <Link
            href={backHref}
            className="inline-flex h-9 items-center rounded border border-slate-200 bg-white px-4 text-[13px] text-slate-600 hover:bg-slate-50"
          >
            Back
          </Link>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[1fr_300px]">
        <div className="space-y-4">
          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <h2 className="m-0 mb-3 text-[16px] font-semibold text-[#2c3e50]">{data.issue}</h2>
            <div className="whitespace-pre-wrap text-[13px] leading-6 text-slate-700">
              {data.details}
            </div>
          </div>

          <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="m-0 mb-3 text-[15px] font-semibold text-[#2c3e50]">Conversation</h3>
            <div className="mb-4 space-y-3">
              {(messages || []).length === 0 ? (
                <div className="rounded border border-dashed border-slate-200 px-3 py-6 text-center text-[13px] text-slate-400">
                  No replies yet
                </div>
              ) : (
                messages.map((m) => (
                  <div key={m.id} className="rounded border border-slate-100 bg-slate-50 px-3 py-2.5">
                    <div className="mb-1 flex items-center justify-between gap-2 text-[12px]">
                      <span className="font-semibold text-[#1a557a]">{m.author}</span>
                      <span className="text-slate-400">{m.time}</span>
                    </div>
                    <div className="text-[13px] text-slate-700">{m.body}</div>
                  </div>
                ))
              )}
            </div>
            <textarea
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              rows={4}
              placeholder="Write a reply..."
              className="mb-2 w-full rounded border border-slate-200 px-3 py-2 text-[13px] outline-none focus:border-[#00a78b]"
            />
            <div className="flex justify-end">
              <button
                type="button"
                onClick={sendReply}
                disabled={!reply.trim()}
                className="inline-flex h-9 items-center rounded bg-[#00a78b] px-4 text-[13px] font-medium text-white disabled:opacity-50"
              >
                Send Reply
              </button>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <h3 className="m-0 mb-3 text-[14px] font-semibold text-[#2c3e50]">Ticket Info</h3>
          <dl className="space-y-3 text-[13px]">
            <div>
              <dt className="text-slate-500">Category</dt>
              <dd className="m-0 font-medium text-[#2c3e50]">{data.category}</dd>
            </div>
            <div>
              <dt className="text-slate-500">Support Unit</dt>
              <dd className="m-0 font-medium text-[#2c3e50]">{data.supportUnit}</dd>
            </div>
            <div>
              <dt className="text-slate-500">Email</dt>
              <dd className="m-0 font-medium text-[#00a78b]">{data.email}</dd>
            </div>
            <div>
              <dt className="text-slate-500">Phone</dt>
              <dd className="m-0 font-medium text-[#2c3e50]">{data.phone}</dd>
            </div>
            <div>
              <dt className="text-slate-500">Status</dt>
              <dd className="m-0 mt-1">
                <StatusPill value={data.status} />
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}
