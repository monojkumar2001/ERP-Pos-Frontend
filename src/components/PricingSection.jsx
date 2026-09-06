"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { planFeatures, pricingPlans, IMG } from "../data/site";

export default function PricingSection({ showHeading = true }) {
  const [billing, setBilling] = useState("monthly");
  const plans = pricingPlans[billing];

  return (
    <section className="py-12 md:py-16">
      <div className="container-site">
        {showHeading && (
          <div className="mx-auto mb-10 max-w-[845px] text-center">
            <h2 className="section-title-secondary">
              Affordable ERP Solutions for Every Business
            </h2>
            <p className="section-sub">
              We offer flexible pricing plans suitable for startups, SMEs, and large
              enterprises in Bangladesh. Enjoy a 14-day free trial with selected features.
            </p>
          </div>
        )}

        <div className="mb-10 flex justify-center">
          <div className="inline-flex rounded-full border border-line bg-white p-1">
            {[
              { key: "monthly", label: "Monthly" },
              { key: "annual", label: "Annual" },
            ].map((item) => (
              <button
                key={item.key}
                type="button"
                onClick={() => setBilling(item.key)}
                className={`rounded-full px-6 py-2 text-sm font-medium transition ${
                  billing === item.key
                    ? "bg-primary text-white"
                    : "text-muted hover:text-title"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name + plan.period}
              className={`relative rounded-2xl border bg-white px-6 py-8 ${
                plan.popular ? "border-primary" : "border-line"
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 flex -translate-x-1/2 items-center gap-1 rounded-full bg-primary px-3 py-1 text-xs font-semibold text-white">
                  <Image
                    src={`${IMG}/frontend_assets/images/icons/fire.svg`}
                    alt=""
                    width={14}
                    height={14}
                  />
                  Most popular
                </div>
              )}
              <h3 className="text-[28px] font-semibold uppercase leading-[1.2] text-secondary">
                {plan.name}
              </h3>
              <div className="mt-4 mb-3 flex items-end gap-2">
                <span className="text-2xl font-semibold text-secondary">{plan.price}</span>
                <span className="pb-0.5 text-sm font-normal text-price-muted">
                  {plan.period}
                </span>
              </div>
              <p className="text-sm text-muted">(Up to {plan.users.replace("Up to ", "")})</p>
              <p className="mt-1 text-xs text-muted">[ {plan.extra} ]</p>
              <Link href="/account/register" className="btn-primary mt-6 !mr-0 w-full !rounded-lg !px-6 !py-4">
                Start 30-Day Trial
              </Link>
              <p className="mb-3 mt-8 text-sm font-semibold text-title">
                All free plans included:
              </p>
              <ul className="space-y-2.5">
                {planFeatures.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm text-title">
                    <span className="mt-0.5 text-primary">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p className="mx-auto mt-6 flex max-w-xl items-center justify-center gap-2 rounded-xl bg-[#e6f7f5] px-4 py-3 text-sm text-secondary">
          <span aria-hidden>ⓘ</span> 5% vat applicable
        </p>
      </div>
    </section>
  );
}
