"use client";

import { useEffect, useState } from "react";
import PageHeader from "./PageHeader";
import FilterBar from "./FilterBar";
import DataTable from "./DataTable";
import { api } from "../../lib/api";

export default function ListPage({ config }) {
  const [showFilters, setShowFilters] = useState(true);
  const [rows, setRows] = useState(config?.rows || []);
  const [totalEntries, setTotalEntries] = useState(config?.totalEntries);
  const [totalAmount, setTotalAmount] = useState(config?.totalAmount);
  const [loading, setLoading] = useState(Boolean(config?.apiEndpoint));
  const [error, setError] = useState("");

  useEffect(() => {
    if (!config?.apiEndpoint) {
      setRows(config?.rows || []);
      setTotalEntries(config?.totalEntries);
      setTotalAmount(config?.totalAmount);
      setLoading(false);
      setError("");
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError("");

    api(config.apiEndpoint)
      .then((data) => {
        if (cancelled) return;
        setRows(data.rows || []);
        setTotalEntries(data.totalEntries ?? (data.rows || []).length);
        setTotalAmount(data.totalAmount);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err.message || "Failed to load data");
        setRows([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [config?.apiEndpoint, config?.title]);

  if (!config) {
    return (
      <div className="rounded-lg border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500">
        Page not configured
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title={config.title}
        addLabel={config.addLabel}
        addHref={config.addHref}
        onFilterToggle={
          config.hideFilterToggle
            ? undefined
            : () => setShowFilters((v) => !v)
        }
      />
      {showFilters && <FilterBar filters={config.filters || []} />}
      {error && (
        <div className="mb-3 rounded border border-red-200 bg-red-50 px-3 py-2 text-[13px] text-red-700">
          {error}
        </div>
      )}
      {loading ? (
        <div className="rounded-lg border border-slate-200 bg-white p-10 text-center text-slate-500">
          Loading…
        </div>
      ) : (
        <DataTable
          columns={config.columns || []}
          rows={rows}
          totalEntries={totalEntries}
          totalAmount={totalAmount}
          amountKey={config.amountKey}
        />
      )}
    </div>
  );
}
