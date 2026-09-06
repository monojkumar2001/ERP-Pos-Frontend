"use client";

import { useState } from "react";

export default function FAQ({ items = [], title = "Frequently Asked Questions", subtitle = "Your Questions, Answered" }) {
  const [open, setOpen] = useState(0);

  return (
    <section className="bg-soft py-16 md:py-20">
      <div className="container-site">
        <div className="mx-auto mb-10 max-w-3xl text-center">
          <h2 className="section-title">{title}</h2>
          {subtitle && <p className="section-sub">{subtitle}</p>}
        </div>
        <div className="mx-auto max-w-3xl space-y-3">
          {items.map((item, index) => {
            const isOpen = open === index;
            return (
              <div
                key={item.q}
                className="overflow-hidden rounded-2xl border border-line bg-white"
              >
                <button
                  type="button"
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                  onClick={() => setOpen(isOpen ? -1 : index)}
                >
                  <span className="text-base font-medium text-title">{item.q}</span>
                  <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-light text-primary transition ${
                      isOpen ? "rotate-45" : ""
                    }`}
                  >
                    +
                  </span>
                </button>
                {isOpen && (
                  <div className="border-t border-line px-5 pb-5 pt-3 text-sm leading-relaxed text-muted">
                    {item.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
