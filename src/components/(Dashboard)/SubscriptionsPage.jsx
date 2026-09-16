"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { subscriptionApi } from "../../lib/api";

const FALLBACK = {
  current_plan: "Business",
  next_billing_date: "14 Oct 2026",
  plans: [
    {
      name: "Starter",
      price: "৳ 1,999",
      period: "/month",
      features: ["Accounting", "Sales", "Purchase", "Inventory", "2 Users"],
      current: false,
    },
    {
      name: "Business",
      price: "৳ 4,999",
      period: "/month",
      features: ["All Starter modules", "POS", "HRM", "Reports", "10 Users"],
      current: true,
    },
    {
      name: "Enterprise",
      price: "Custom",
      period: "",
      features: ["All modules", "Manufacturing", "Priority support", "Unlimited users"],
      current: false,
    },
  ],
};

export default function SubscriptionsPage() {
  const [data, setData] = useState(FALLBACK);

  useEffect(() => {
    let cancelled = false;
    subscriptionApi
      .list()
      .then((res) => {
        if (cancelled) return;
        const payload = res?.data || res;
        if (payload?.plans) setData({ ...FALLBACK, ...payload });
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div>
      <div className="mb-5">
        <h1 className="m-0 text-[22px] font-semibold text-[#1a557a]">Subscriptions</h1>
        <p className="mt-1 mb-0 text-[13px] text-[#6c7a89]">
          Manage your Biznify plan and billing.
        </p>
      </div>

      <div className="mb-5 rounded-lg border border-[#d6e8f5] bg-[#f3f9fc] px-4 py-3 text-[13px] text-[#1a557a]">
        Current plan: <strong>{data.current_plan}</strong> · Next billing date:{" "}
        {data.next_billing_date}
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {(data.plans || []).map((plan) => (
          <div
            key={plan.name}
            className={`rounded-xl border bg-white p-5 shadow-sm ${
              plan.current ? "border-[#00a78b] ring-1 ring-[#00a78b]" : "border-[#e5e7eb]"
            }`}
          >
            <div className="mb-1 text-[14px] font-semibold text-[#1a557a]">{plan.name}</div>
            <div className="mb-4">
              <span className="text-[24px] font-bold text-[#2c3e50]">{plan.price}</span>
              <span className="text-[13px] text-[#8aa0b3]">{plan.period}</span>
            </div>
            <ul className="mb-5 list-none space-y-2 p-0">
              {plan.features.map((f) => (
                <li key={f} className="flex items-center gap-2 text-[13px] text-[#5a6b7b]">
                  <span className="material-icons text-[16px] text-[#28a745]">check_circle</span>
                  {f}
                </li>
              ))}
            </ul>
            <button
              type="button"
              className={`h-9 w-full rounded text-[13px] font-medium ${
                plan.current
                  ? "border border-[#00a78b] bg-white text-[#00a78b]"
                  : "bg-[#00a78b] text-white hover:bg-[#008f77]"
              }`}
            >
              {plan.current ? "Current Plan" : "Choose Plan"}
            </button>
          </div>
        ))}
      </div>

      <div className="mt-6">
        <Link href="/en/dashboard" className="text-[13px] text-[#00a78b] hover:underline">
          ← Back to dashboard
        </Link>
      </div>
    </div>
  );
}
