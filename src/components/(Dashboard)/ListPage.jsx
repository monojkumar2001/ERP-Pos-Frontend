"use client";

import { useState } from "react";
import PageHeader from "./PageHeader";
import FilterBar from "./FilterBar";
import DataTable from "./DataTable";

export default function ListPage({ config }) {
  const [showFilters, setShowFilters] = useState(true);

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
      <DataTable
        columns={config.columns || []}
        rows={config.rows || []}
        totalEntries={config.totalEntries}
        totalAmount={config.totalAmount}
        amountKey={config.amountKey}
      />
    </div>
  );
}
