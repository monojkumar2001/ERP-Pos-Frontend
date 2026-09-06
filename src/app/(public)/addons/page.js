"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { addons } from "../../data/site";
import CTABanner from "../../components/CTABanner";
import FAQ from "../../components/FAQ";
import { homeFaqs } from "../../data/site";

const filters = ["All addons", "Delivery System", "SMS", "Payment Method"];

export default function AddonsPage() {
  const [filter, setFilter] = useState("All addons");

  const filtered = useMemo(() => {
    if (filter === "All addons") return addons;
    return addons.filter((item) => item.category === filter);
  }, [filter]);

  return (
    <>
      <section className="bg-hero-glow py-16 md:py-20">
        <div className="container-site text-center">
          <h1 className="section-title">Power Up Biznify with Seamless Addons</h1>
          <p className="section-sub">
            Extend your ERP with integrations across payment, delivery, SMS, and more.
          </p>
        </div>
      </section>

      <section className="pb-16">
        <div className="container-site">
          <div className="mb-8 flex flex-wrap justify-center gap-2">
            {filters.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setFilter(item)}
                className={`rounded-full px-5 py-2 text-sm font-medium transition ${
                  filter === item
                    ? "bg-primary text-white"
                    : "border border-line bg-white text-muted hover:text-title"
                }`}
              >
                {item}
              </button>
            ))}
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((addon) => (
              <div
                key={addon.title}
                className="overflow-hidden rounded-3xl border border-line bg-white shadow-soft transition hover:-translate-y-1 hover:shadow-card"
              >
                <div className="relative flex h-40 items-center justify-center bg-soft p-6">
                  <Image
                    src={addon.image}
                    alt={addon.title}
                    width={120}
                    height={80}
                    className="h-20 w-auto object-contain"
                  />
                  <span className="absolute right-4 top-4 rounded-full bg-primary-light px-3 py-1 text-xs font-semibold text-primary">
                    {addon.price}
                  </span>
                </div>
                <div className="p-6">
                  <p className="mb-2 text-xs font-medium uppercase tracking-wide text-primary">
                    {addon.category}
                  </p>
                  <h3 className="text-lg font-semibold text-title">{addon.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-muted">
                    {addon.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <FAQ items={homeFaqs.slice(0, 6)} />
      <CTABanner />
    </>
  );
}
